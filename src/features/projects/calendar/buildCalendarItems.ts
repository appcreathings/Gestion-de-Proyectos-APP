/**
 * Modelo puro del calendario de tareas (spec 053).
 */
import type { DayRange } from "@/lib/dates";
import { daysBetween, monthRangeContaining, rangesIntersect, shiftRange } from "@/lib/dates";
import type { Priority, Project, Quarter, SprintStatus, TaskStatus } from "@/domain/schemas";
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
  projectId: string;
  projectName: string;
}

export interface CalendarSprintItem {
  kind: "sprint";
  id: string;
  name: string;
  start: string;
  end: string;
  status: SprintStatus;
  goal: string;
  projectId?: string;
  projectName?: string;
}

export interface CalendarProjectDueItem {
  kind: "projectDue";
  id: string;
  name: string;
  day: string;
}

export interface CalendarRangeBand {
  id: string;
  name: string;
  start: string;
  end: string;
  kind: "quarter" | "project";
  projectId?: string;
  goal?: string;
}

export interface PortfolioCalendarModel {
  range: DayRange;
  tasks: CalendarTaskItem[];
  projectDues: CalendarProjectDueItem[];
  bands: CalendarRangeBand[];
  unscheduled: CalendarTaskItem[];
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

export function taskMatchesSearch(
  task: {
    title: string;
    description: string;
    summary?: string | null;
    tags?: string[];
  },
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (task.title.toLowerCase().includes(q)) return true;
  if (task.description.toLowerCase().includes(q)) return true;
  if ((task.summary ?? "").toLowerCase().includes(q)) return true;
  return (task.tags ?? []).some((tag) => tag.toLowerCase().includes(q));
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

  const tasks: CalendarTaskItem[] = [];
  const unscheduled: CalendarTaskItem[] = [];

  for (const task of project.tasks) {
    if (task.archived) continue;
    if (!includeDone && task.status === "done") continue;
    if (!taskMatchesSprintScope(task, sprintScope)) continue;
    if (areaId && task.areaId !== areaId) continue;
    if (!taskMatchesSearch(task, searchQuery)) continue;

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
      projectId: project.id,
      projectName: project.name,
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
      projectId: project.id,
      projectName: project.name,
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

export interface BuildPortfolioCalendarInput {
  projects: Project[];
  quarters: Quarter[];
  range: DayRange;
  includeDone: boolean;
  /** Default false — hide done/archived projects. */
  includeClosedProjects?: boolean;
}

export function buildPortfolioCalendarModel(
  input: BuildPortfolioCalendarInput,
): PortfolioCalendarModel {
  const { projects, quarters, range, includeDone, includeClosedProjects = false } = input;

  const tasks: CalendarTaskItem[] = [];
  const unscheduled: CalendarTaskItem[] = [];
  const projectDues: CalendarProjectDueItem[] = [];
  const bands: CalendarRangeBand[] = [];

  for (const q of quarters) {
    if (!q.startDate || !q.endDate) continue;
    if (!rangesIntersect({ start: q.startDate, end: q.endDate }, range)) continue;
    bands.push({
      id: q.id,
      name: q.name,
      start: q.startDate,
      end: q.endDate,
      kind: "quarter",
      goal: q.goal,
    });
  }

  for (const project of projects) {
    if (project.status === "archived") continue;
    if (!includeClosedProjects && project.status === "done") continue;

    const model = buildCalendarModel({
      project,
      range,
      sprintScope: "all",
      searchQuery: "",
      areaId: null,
      includeDone,
    });
    tasks.push(...model.tasks);
    unscheduled.push(...model.unscheduled);
    if (model.projectDue) projectDues.push(model.projectDue);

    if (
      project.startDate &&
      project.dueDate &&
      rangesIntersect({ start: project.startDate, end: project.dueDate }, range)
    ) {
      bands.push({
        id: project.id,
        name: project.name,
        start: project.startDate,
        end: project.dueDate,
        kind: "project",
        projectId: project.id,
      });
    }
  }

  return { range, tasks, projectDues, bands, unscheduled };
}

export function monthsOverlapping(range: DayRange): DayRange[] {
  const months: DayRange[] = [];
  let cursor = monthRangeContaining(range.start);
  while (cursor.start <= range.end) {
    months.push(cursor);
    cursor = shiftRange(cursor, "month", 1);
  }
  return months;
}

/** Tasks for a single day key. */
export function tasksOnDay(model: { tasks: CalendarTaskItem[] }, day: string): CalendarTaskItem[] {
  return model.tasks.filter((t) => t.day === day);
}

/** Cap chips visible + remainder count. */
export function partitionDayChips<T>(items: T[], max: number): { visible: T[]; more: number } {
  if (items.length <= max) return { visible: items, more: 0 };
  return { visible: items.slice(0, max), more: items.length - max };
}

export interface PackedSprintBand {
  id: string;
  name: string;
  goal: string;
  start: string;
  end: string;
  status: SprintStatus;
  lane: number;
  /** 0-based inclusive column in the visible range. */
  colStart: number;
  colEnd: number;
}

/** Pack overlapping sprint ranges into lanes so bars do not stack on the same row. */
export function packSprintLanes(
  sprints: CalendarSprintItem[],
  range: DayRange,
): { bands: PackedSprintBand[]; laneCount: number } {
  const total = daysBetween(range.start, range.end) + 1;
  const items: PackedSprintBand[] = sprints.map((s) => ({
    id: s.id,
    name: s.name,
    goal: s.goal,
    start: s.start,
    end: s.end,
    status: s.status,
    lane: 0,
    colStart: Math.max(0, daysBetween(range.start, s.start)),
    colEnd: Math.min(total - 1, daysBetween(range.start, s.end)),
  }));
  items.sort(
    (a, b) => a.colStart - b.colStart || b.colEnd - b.colStart - (a.colEnd - a.colStart),
  );

  const laneEnds: number[] = [];
  for (const item of items) {
    let lane = 0;
    while (lane < laneEnds.length && laneEnds[lane] >= item.colStart) lane += 1;
    item.lane = lane;
    if (lane === laneEnds.length) laneEnds.push(item.colEnd);
    else laneEnds[lane] = item.colEnd;
  }
  return { bands: items, laneCount: laneEnds.length };
}

export function sprintsCoveringDay(
  sprints: CalendarSprintItem[],
  day: string,
): CalendarSprintItem[] {
  return sprints.filter((s) => s.start <= day && s.end >= day);
}

export interface PackedRangeBand extends CalendarRangeBand {
  lane: number;
  colStart: number;
  colEnd: number;
}

export function packRangeLanes(
  items: CalendarRangeBand[],
  range: DayRange,
): { bands: PackedRangeBand[]; laneCount: number } {
  const mapped = items.map((s) => ({
    kind: "sprint" as const,
    id: s.id,
    name: s.name,
    start: s.start,
    end: s.end,
    status: "active" as const,
    goal: s.goal ?? "",
  }));
  const packed = packSprintLanes(mapped, range);
  const byId = new Map(items.map((i) => [i.id, i]));
  return {
    laneCount: packed.laneCount,
    bands: packed.bands.map((b) => {
      const src = byId.get(b.id)!;
      return { ...src, lane: b.lane, colStart: b.colStart, colEnd: b.colEnd };
    }),
  };
}

export function bandsCoveringDay(bands: CalendarRangeBand[], day: string): CalendarRangeBand[] {
  return bands.filter((b) => b.start <= day && b.end >= day);
}
