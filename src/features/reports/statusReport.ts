/**
 * Modelo puro de informe de estado (spec 052).
 * Sin React, sin DOM — solo agregación de dominio.
 */
import {
  areaProgress,
  daysUntil,
  projectChecklistProgress,
  projectTaskProgress,
  type ProgressStat,
} from "@/domain/compute";
import { effectiveHealth } from "@/domain/health";
import {
  healthLabel,
  priorityLabel,
  projectStatusLabel,
  taskStatusLabel,
} from "@/domain/labels";
import { computePortfolio } from "@/features/dashboard/portfolio";
import { collectDatedEntities } from "@/lib/dates";
import type { Person, Product, Project, Settings, TaskStatus } from "@/domain/schemas";

export interface StatusReportOptions {
  includePeople: boolean;
  now: Date;
  dueSoonDays: number;
  listCap?: number;
}

export interface ReportDueItem {
  kind: "task" | "checklistItem" | "project";
  label: string;
  dueDate: string;
  daysUntil: number;
  projectName?: string;
  areaName?: string;
  assigneeName?: string | null;
  omittedCount?: number;
}

export interface ReportAreaRow {
  name: string;
  progressPct: number;
  completed: boolean;
  taskOpen: number;
  taskDone: number;
}

export interface ReportTaskRow {
  title: string;
  status: TaskStatus;
  priorityLabel: string;
  dueDate: string | null;
  areaName: string | null;
  assigneeName?: string | null;
}

export interface ProjectStatusReport {
  scope: "project";
  generatedAt: string;
  title: string;
  includePeople: boolean;
  dueSoonDays: number;
  statusLabel: string;
  healthLabel: string;
  priorityLabel: string;
  startDate: string | null;
  dueDate: string | null;
  ownerName: string | null;
  productName: string | null;
  checklist: { done: number; total: number; pct: number };
  tasks: { done: number; total: number; pct: number; archivedCount: number };
  areas: ReportAreaRow[];
  overdue: ReportDueItem[];
  dueSoon: ReportDueItem[];
  overdueOmitted: number;
  dueSoonOmitted: number;
  focusTasks: ReportTaskRow[];
  focusTasksOmitted: number;
  descriptionPlain: string;
}

export interface PortfolioStatusReport {
  scope: "portfolio";
  generatedAt: string;
  title: string;
  includePeople: boolean;
  dueSoonDays: number;
  totals: {
    projects: number;
    open: number;
    avgProgress: number; // alias ponderado = checklistProgress.pct (spec 066 D22)
    checklist: ProgressStat;
    tasks: ProgressStat;
  };
  byStatus: { label: string; count: number }[];
  byHealth: { label: string; count: number }[];
  byProduct: {
    name: string;
    total: number;
    avgProgress: number; // alias ponderado del grupo (spec 066 D22)
    healthSummary: string;
  }[];
  overdue: ReportDueItem[];
  dueSoon: ReportDueItem[];
  overdueOmitted: number;
  dueSoonOmitted: number;
  stalled: {
    name: string;
    statusLabel: string;
    healthLabel: string;
    updatedAt: string;
  }[];
  openProjects: {
    name: string;
    statusLabel: string;
    healthLabel: string;
    checklistPct: number;
    taskPct: number;
    dueDate: string | null;
    ownerName?: string | null;
  }[];
  openProjectsOmitted: number;
}

export type StatusReport = ProjectStatusReport | PortfolioStatusReport;

function personName(
  people: Person[],
  id: string | null | undefined,
  includePeople: boolean,
): string | null {
  if (!includePeople || !id) return null;
  return people.find((p) => p.id === id)?.name ?? "Persona eliminada";
}

function formatGeneratedAt(now: Date): string {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(now);
}

function stripDescription(md: string, max = 2000): string {
  const t = md.trim();
  if (!t) return "";
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

function capList<T>(items: T[], cap: number): { items: T[]; omitted: number } {
  if (items.length <= cap) return { items, omitted: 0 };
  return { items: items.slice(0, cap), omitted: items.length - cap };
}

function dueKind(
  ref: { kind: string },
): ReportDueItem["kind"] {
  if (ref.kind === "task") return "task";
  if (ref.kind === "checklistItem") return "checklistItem";
  return "project";
}

export function buildProjectReport(
  project: Project,
  deps: {
    people: Person[];
    settings: Pick<Settings, "dueSoonDays" | "deriveHealth" | "stalledAfterDays">;
    productName?: string | null;
  },
  options: StatusReportOptions,
): ProjectStatusReport {
  const cap = options.listCap ?? 25;
  const settings = deps.settings;
  const cl = projectChecklistProgress(project);
  const tk = projectTaskProgress(project);
  const health = effectiveHealth(project, settings as Settings, options.now);

  const dated: ReportDueItem[] = [];
  for (const de of collectDatedEntities(project)) {
    const d = daysUntil(de.dueDate, options.now);
    if (d === null) continue;
    if (de.ref.kind === "task" && de.ref.taskId) {
      const task = project.tasks.find((t) => t.id === de.ref.taskId);
      if (task?.archived) continue;
    }
    let areaName: string | undefined;
    if (de.ref.kind === "checklistItem" && de.ref.areaId) {
      areaName = project.areas.find((a) => a.id === de.ref.areaId)?.name;
    } else if (de.ref.kind === "task" && de.ref.taskId) {
      const task = project.tasks.find((t) => t.id === de.ref.taskId);
      areaName = task?.areaId
        ? project.areas.find((a) => a.id === task.areaId)?.name
        : undefined;
    }
    const assigneeName =
      de.ref.kind === "task" && de.ref.taskId
        ? personName(
            deps.people,
            project.tasks.find((t) => t.id === de.ref.taskId)?.assigneeId ?? null,
            options.includePeople,
          )
        : de.ref.kind === "project"
          ? personName(deps.people, project.ownerId, options.includePeople)
          : null;
    dated.push({
      kind: dueKind(de.ref),
      label: de.label,
      dueDate: de.dueDate,
      daysUntil: d,
      areaName,
      assigneeName,
    });
  }
  dated.sort((a, b) => a.daysUntil - b.daysUntil);

  const overdueAll = dated.filter((r) => r.daysUntil < 0);
  const dueSoonAll = dated.filter(
    (r) => r.daysUntil >= 0 && r.daysUntil <= options.dueSoonDays,
  );
  const overdueCapped = capList(overdueAll, cap);
  const dueSoonCapped = capList(dueSoonAll, cap);

  const areas: ReportAreaRow[] = project.areas.map((a) => {
    const areaTasks = project.tasks.filter((t) => t.areaId === a.id && !t.archived);
    return {
      name: a.name,
      progressPct: areaProgress(a).pct,
      completed: a.completed,
      taskOpen: areaTasks.filter((t) => t.status !== "done").length,
      taskDone: areaTasks.filter((t) => t.status === "done").length,
    };
  });

  const focusCandidates = project.tasks
    .filter((t) => !t.archived)
    .filter(
      (t) =>
        t.status === "blocked" ||
        t.status === "doing" ||
        (t.status === "todo" && t.dueDate != null),
    )
    .sort((a, b) => {
      const order = { blocked: 0, doing: 1, todo: 2, done: 3 } as const;
      const byStatus = order[a.status] - order[b.status];
      if (byStatus !== 0) return byStatus;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  const focusCapped = capList(focusCandidates, cap);

  return {
    scope: "project",
    generatedAt: formatGeneratedAt(options.now),
    title: project.name,
    includePeople: options.includePeople,
    dueSoonDays: options.dueSoonDays,
    statusLabel: projectStatusLabel[project.status],
    healthLabel: healthLabel[health],
    priorityLabel: priorityLabel[project.priority],
    startDate: project.startDate,
    dueDate: project.dueDate,
    ownerName: personName(deps.people, project.ownerId, options.includePeople),
    productName: deps.productName ?? null,
    checklist: cl,
    tasks: {
      done: tk.done,
      total: tk.total,
      pct: tk.pct,
      archivedCount: project.tasks.filter((t) => t.archived).length,
    },
    areas,
    overdue: overdueCapped.items,
    dueSoon: dueSoonCapped.items,
    overdueOmitted: overdueCapped.omitted,
    dueSoonOmitted: dueSoonCapped.omitted,
    focusTasks: focusCapped.items.map((t) => ({
      title: t.title,
      status: t.status,
      priorityLabel: priorityLabel[t.priority],
      dueDate: t.dueDate,
      areaName: t.areaId
        ? project.areas.find((a) => a.id === t.areaId)?.name ?? null
        : null,
      assigneeName: personName(deps.people, t.assigneeId, options.includePeople),
    })),
    focusTasksOmitted: focusCapped.omitted,
    descriptionPlain: stripDescription(project.description),
  };
}

export function buildPortfolioReport(
  projects: Project[],
  products: Product[],
  people: Person[],
  settings: Settings,
  options: StatusReportOptions,
  orgName?: string,
): PortfolioStatusReport {
  const cap = options.listCap ?? 25;
  const stats = computePortfolio(projects, products, settings, options.now, people);
  const open = projects.filter((p) => p.status !== "done" && p.status !== "archived");

  const mapDue = (
    rows: typeof stats.overdue,
  ): ReportDueItem[] =>
    rows.map((r) => {
      const proj = projects.find((p) => p.id === r.projectId);
      let assigneeName: string | null = null;
      if (options.includePeople && proj) {
        if (r.ref.kind === "task" && r.ref.taskId) {
          const task = proj.tasks.find((t) => t.id === r.ref.taskId);
          assigneeName = personName(people, task?.assigneeId, true);
        } else if (r.ref.kind === "project") {
          assigneeName = personName(people, proj.ownerId, true);
        }
      }
      return {
        kind: dueKind(r.ref),
        label: r.label,
        dueDate: r.dueDate,
        daysUntil: r.d,
        projectName: proj?.name,
        assigneeName,
      };
    });

  const overdueCapped = capList(mapDue(stats.overdue), cap);
  const dueSoonCapped = capList(mapDue(stats.dueSoon), cap);
  const openCapped = capList(
    open.map((p) => ({
      name: p.name,
      statusLabel: projectStatusLabel[p.status],
      healthLabel: healthLabel[effectiveHealth(p, settings, options.now)],
      checklistPct: projectChecklistProgress(p).pct,
      taskPct: projectTaskProgress(p).pct,
      dueDate: p.dueDate,
      ownerName: personName(people, p.ownerId, options.includePeople),
    })),
    cap,
  );

  return {
    scope: "portfolio",
    generatedAt: formatGeneratedAt(options.now),
    title: orgName ? `Informe de portafolio — ${orgName}` : "Informe de portafolio",
    includePeople: options.includePeople,
    dueSoonDays: options.dueSoonDays,
    totals: {
      projects: stats.total,
      open: stats.active,
      avgProgress: stats.checklistProgress.pct,
      checklist: stats.checklistProgress,
      tasks: stats.taskProgress,
    },
    byStatus: (Object.entries(stats.byStatus) as [keyof typeof projectStatusLabel, number][])
      .filter(([, n]) => n > 0)
      .map(([k, count]) => ({ label: projectStatusLabel[k], count })),
    byHealth: (Object.entries(stats.byHealth) as [keyof typeof healthLabel, number][])
      .filter(([, n]) => n > 0)
      .map(([k, count]) => ({ label: healthLabel[k], count })),
    byProduct: stats.byProduct.map((p) => ({
      name: p.name,
      total: p.total,
      avgProgress: p.checklistProgress.pct,
      healthSummary: `🔴 ${p.byHealth.red} · 🟡 ${p.byHealth.amber} · 🟢 ${p.byHealth.green}`,
    })),
    overdue: overdueCapped.items,
    dueSoon: dueSoonCapped.items,
    overdueOmitted: overdueCapped.omitted,
    dueSoonOmitted: dueSoonCapped.omitted,
    stalled: stats.stalled.map((p) => ({
      name: p.name,
      statusLabel: projectStatusLabel[p.status],
      healthLabel: healthLabel[effectiveHealth(p, settings, options.now)],
      updatedAt: p.updatedAt,
    })),
    openProjects: openCapped.items,
    openProjectsOmitted: openCapped.omitted,
  };
}

// re-export for callers that need task status labels in MD
export { taskStatusLabel };
