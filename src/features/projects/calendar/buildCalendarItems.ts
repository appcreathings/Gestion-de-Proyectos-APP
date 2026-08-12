/**
 * Modelo puro del calendario de tareas (spec 053).
 */
import type { DayRange } from "@/lib/dates";
import { rangesIntersect } from "@/lib/dates";
import type { Priority, Project, SprintStatus, TaskStatus } from "@/domain/schemas";
import type { SprintScope } from "../components/SprintSwitcher";

export interface CalendarTaskItem {
  kind: "task";
  id: string;
  title: string;
  day: string;
  status: TaskStatus;
  priority: Priority;
  sprintId: string | null;
  areaId: string | null;
  assigneeId: string | null;
}

export interface CalendarSprintItem {
  kind: "sprint";
  id: string;
  name: string;
  start: string;
  end: string;
  status: SprintStatus;
  goal: string;
}

export interface CalendarProjectDueItem {
  kind: "projectDue";
  id: string;
  name: string;
  day: string;
}

export interface CalendarModel {
  range: DayRange;
  tasks: CalendarTaskItem[];
  sprints: CalendarSprintItem[];
  projectDue: CalendarProjectDueItem | null;
  unscheduled: CalendarTaskItem[];
}

export function taskMatchesSprintScope(
  task: { sprintId: string | null },
  scope: SprintScope,
): boolean {
  if (scope === "all") return true;
  if (scope === "backlog") return task.sprintId === null;
  return task.sprintId === scope;
}

export interface BuildCalendarInput {
  project: Project;
  range: DayRange;
  sprintScope: SprintScope;
  searchQuery: string;
  areaId: string | null;
  includeDone: boolean;
}

export function buildCalendarModel(input: BuildCalendarInput): CalendarModel {
  const { project, range, sprintScope, searchQuery, areaId, includeDone } = input;
  const q = searchQuery.trim().toLowerCase();

  const tasks: CalendarTaskItem[] = [];
  const unscheduled: CalendarTaskItem[] = [];

  for (const task of project.tasks) {
    if (task.archived) continue;
    if (!includeDone && task.status === "done") continue;
    if (!taskMatchesSprintScope(task, sprintScope)) continue;
    if (areaId && task.areaId !== areaId) continue;
    if (
      q &&
      !task.title.toLowerCase().includes(q) &&
      !task.description.toLowerCase().includes(q) &&
      !(task.summary ?? "").toLowerCase().includes(q)
    ) {
      continue;
    }

    const item: CalendarTaskItem = {
      kind: "task",
      id: task.id,
      title: task.title,
      day: task.dueDate ?? "",
      status: task.status,
      priority: task.priority,
      sprintId: task.sprintId,
      areaId: task.areaId,
      assigneeId: task.assigneeId,
    };

    if (!task.dueDate) {
      unscheduled.push(item);
    } else if (task.dueDate >= range.start && task.dueDate <= range.end) {
      tasks.push(item);
    }
  }

  const sprints: CalendarSprintItem[] = [];
  for (const s of project.sprints) {
    if (!s.startDate || !s.endDate) continue;
    if (!rangesIntersect({ start: s.startDate, end: s.endDate }, range)) continue;
    sprints.push({
      kind: "sprint",
      id: s.id,
      name: s.name,
      start: s.startDate,
      end: s.endDate,
      status: s.status,
      goal: s.goal,
    });
  }

  let projectDue: CalendarProjectDueItem | null = null;
  if (
    project.dueDate &&
    project.dueDate >= range.start &&
    project.dueDate <= range.end
  ) {
    projectDue = {
      kind: "projectDue",
      id: project.id,
      name: project.name,
      day: project.dueDate,
    };
  }

  return { range, tasks, sprints, projectDue, unscheduled };
}

/** Tasks for a single day key. */
export function tasksOnDay(model: CalendarModel, day: string): CalendarTaskItem[] {
  return model.tasks.filter((t) => t.day === day);
}

/** Cap chips visible + remainder count. */
export function partitionDayChips<T>(items: T[], max: number): { visible: T[]; more: number } {
  if (items.length <= max) return { visible: items, more: 0 };
  return { visible: items.slice(0, max), more: items.length - max };
}
