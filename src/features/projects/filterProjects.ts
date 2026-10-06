import {
  daysUntil,
  isStalled,
  projectChecklistProgress,
  projectLiveTaskProgress,
} from "@/domain/compute";
import { effectiveHealth } from "@/domain/health";
import type { Health, Priority, Project, ProjectStatus, Settings } from "@/domain/schemas";

const STATUSES: readonly ProjectStatus[] = [
  "backlog",
  "active",
  "paused",
  "blocked",
  "done",
  "archived",
];
const HEALTHS: readonly Health[] = ["red", "amber", "green"];
const PRIORITIES: readonly Priority[] = ["critical", "high", "medium", "low"];
const DUES = ["overdue", "soon", "none"] as const;
const SORTS = ["due", "name", "progress", "updated"] as const;
const VIEWS = ["list", "quarter", "product"] as const;

export type ProjectSort = "attention" | "due" | "name" | "progress" | "updated";
export type ProjectView = "plan" | "list" | "quarter" | "product";
export type ProjectDue = (typeof DUES)[number];

export type ProjectsQuery = {
  productId: string | null;
  status: ProjectStatus | null;
  health: Health | null;
  stalled: boolean;
  quarterId: string | null;
  /** Búsqueda por nombre, ya recortada. Vacío = no filtra (D7). */
  q: string;
  priority: Priority | null;
  ownerId: string | null;
  due: ProjectDue | null;
  /** Mostrar también done/archived (D6). */
  closed: boolean;
  sort: ProjectSort;
  view: ProjectView;
};

/** Ids que existen en el workspace. Un param con id fuera de estos sets no filtra. */
export type KnownProjectRefs = {
  productIds: ReadonlySet<string>;
  quarterIds: ReadonlySet<string>;
  ownerIds: ReadonlySet<string>;
};

export type ProjectsFilterKey =
  | "product"
  | "status"
  | "health"
  | "stalled"
  | "priority"
  | "owner"
  | "due"
  | "q"
  | "closed"
  | "quarter"
  | "sort"
  | "view";

function isStatus(v: string | null): v is ProjectStatus {
  return v !== null && (STATUSES as readonly string[]).includes(v);
}

function isHealth(v: string | null): v is Health {
  return v !== null && (HEALTHS as readonly string[]).includes(v);
}

function isPriority(v: string | null): v is Priority {
  return v !== null && (PRIORITIES as readonly string[]).includes(v);
}

export function parseProjectsQuery(params: URLSearchParams): ProjectsQuery {
  const statusRaw = params.get("status");
  const healthRaw = params.get("health");
  const priorityRaw = params.get("priority");
  const dueRaw = params.get("due");
  const sortRaw = params.get("sort");
  const viewRaw = params.get("view");
  return {
    productId: params.get("product"),
    status: isStatus(statusRaw) ? statusRaw : null,
    health: isHealth(healthRaw) ? healthRaw : null,
    stalled: params.get("stalled") === "1",
    quarterId: params.get("quarter"),
    q: params.get("q")?.trim() ?? "",
    priority: isPriority(priorityRaw) ? priorityRaw : null,
    ownerId: params.get("owner"),
    due: (DUES as readonly string[]).includes(dueRaw ?? "") ? (dueRaw as ProjectDue) : null,
    closed: params.get("closed") === "1",
    sort: (SORTS as readonly string[]).includes(sortRaw ?? "")
      ? (sortRaw as ProjectSort)
      : "attention",
    view: (VIEWS as readonly string[]).includes(viewRaw ?? "")
      ? (viewRaw as ProjectView)
      : "plan",
  };
}

export function applyProjectsFilter(
  params: URLSearchParams,
  key: ProjectsFilterKey,
  value: string | null,
): URLSearchParams {
  const next = new URLSearchParams(params);
  switch (key) {
    case "stalled":
      if (value === "1") next.set("stalled", "1");
      else next.delete("stalled");
      return next;
    case "status":
      // D6: elegir un estado cerrado prende `closed`; quitar el estado no toca `closed`.
      if (!value) {
        next.delete("status");
      } else {
        next.set("status", value);
        if (value === "done" || value === "archived") next.set("closed", "1");
      }
      return next;
    case "closed":
      // D6: apagar la casilla borra `closed` y, si el estado era cerrado, también `status`.
      if (value === "1") {
        next.set("closed", "1");
      } else {
        next.delete("closed");
        const status = next.get("status");
        if (status === "done" || status === "archived") next.delete("status");
      }
      return next;
    case "q": {
      const trimmed = (value ?? "").trim();
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      return next;
    }
    case "sort":
      // D21: `attention` es la ausencia del param.
      if (!value || value === "attention") next.delete("sort");
      else next.set("sort", value);
      return next;
    case "view":
      // D13: `plan` es la ausencia del param.
      if (!value || value === "plan") next.delete("view");
      else next.set("view", value);
      return next;
    default:
      if (!value) next.delete(key);
      else next.set(key, value);
      return next;
  }
}

/** Puerta de cerrados (D6): done/archived solo entran con `closed=1` o cuando el
 *  propio estado cerrado fue elegido en `status`. */
function passesClosed(p: Project, query: ProjectsQuery): boolean {
  const isClosed = p.status === "done" || p.status === "archived";
  if (!isClosed) return true;
  if (query.status === "done" || query.status === "archived") return true;
  return query.closed;
}

const DUE_SOON_DAYS = 14;

function matchesDue(p: Project, due: ProjectDue, now: Date): boolean {
  if (due === "none") return !p.dueDate;
  const d = daysUntil(p.dueDate, now);
  if (d === null) return false;
  if (due === "overdue") return d < 0;
  return d >= 0 && d <= DUE_SOON_DAYS;
}

/** Minúsculas sin diacríticos para buscar nombres (D7). */
export function foldName(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

/**
 * Filtro AND de `/app/projects` (specs 063 y 072). Un proyecto `done`/`archived`
 * nunca entra con `health` (D14) ni con `stalled=1` (`isStalled` ya lo excluye),
 * aunque `closed=1`. Un param con id que no está en `known` se ignora (D3) —
 * incluido el store aún sin hidratar. El filtro no ordena.
 */
export function filterProjectsByQuery(
  projects: Project[],
  query: ProjectsQuery,
  settings: Settings | null,
  now: Date,
  known: KnownProjectRefs,
): Project[] {
  const productOk =
    query.productId !== null && known.productIds.has(query.productId)
      ? query.productId
      : null;
  const quarterOk =
    query.quarterId !== null && known.quarterIds.has(query.quarterId)
      ? query.quarterId
      : null;
  const ownerOk =
    query.ownerId !== null && known.ownerIds.has(query.ownerId) ? query.ownerId : null;
  const needle = query.q ? foldName(query.q) : "";

  return projects.filter((p) => {
    if (!passesClosed(p, query)) return false;
    if (productOk && p.productId !== productOk) return false;
    if (query.status && p.status !== query.status) return false;
    if (query.health && settings) {
      if (p.status === "done" || p.status === "archived") return false; // D14
      if (effectiveHealth(p, settings, now) !== query.health) return false;
    }
    if (query.stalled && settings && !isStalled(p, settings.stalledAfterDays, now)) return false;
    if (quarterOk && p.quarterId !== quarterOk) return false; // D4 (enmienda 063 D15)
    if (query.priority && p.priority !== query.priority) return false;
    if (ownerOk && p.ownerId !== ownerOk) return false;
    if (query.due && !matchesDue(p, query.due, now)) return false;
    if (needle && !foldName(p.name).includes(needle)) return false;
    return true;
  });
}

const HEALTH_RANK: Record<Health, number> = { red: 0, amber: 1, green: 2 };

function healthOf(p: Project, settings: Settings | null, now: Date): Health {
  return settings ? effectiveHealth(p, settings, now) : p.health;
}

function byName(a: Project, b: Project): number {
  return a.name.localeCompare(b.name, "es", { sensitivity: "base" });
}

/** Sin fecha ordena al final en `attention` y `due`. */
function dueAsc(a: Project, b: Project): number {
  const ad = a.dueDate ?? "\uffff";
  const bd = b.dueDate ?? "\uffff";
  return ad.localeCompare(bd);
}

/** Comparador del portafolio (D11). El mismo orden vale para la lista plana y
 *  el interior de cada grupo. Empate total → 0 (sort estable). */
export function compareProjects(
  a: Project,
  b: Project,
  sort: ProjectSort,
  settings: Settings | null,
  now: Date,
): number {
  if (sort === "name") return byName(a, b);
  if (sort === "updated") return b.updatedAt.localeCompare(a.updatedAt) || byName(a, b);
  if (sort === "due") return dueAsc(a, b) || byName(a, b);
  if (sort === "progress") {
    const checklist = projectChecklistProgress(b).pct - projectChecklistProgress(a).pct;
    if (checklist) return checklist;
    const tasks = projectLiveTaskProgress(b).pct - projectLiveTaskProgress(a).pct;
    return tasks || byName(a, b);
  }
  const health = HEALTH_RANK[healthOf(a, settings, now)] - HEALTH_RANK[healthOf(b, settings, now)];
  return health || dueAsc(a, b) || byName(a, b);
}

/** Vencimiento relativo del proyecto para la fila Plan (D14). */
export function projectDueLabel(dueDate: string | null, now: Date): string {
  const d = daysUntil(dueDate, now);
  if (d === null) return "Sin fecha";
  if (d === 0) return "vence hoy";
  if (d === 1) return "vence en 1 día";
  if (d > 1) return `vence en ${d} días`;
  if (d === -1) return "venció hace 1 día";
  return `venció hace ${Math.abs(d)} días`;
}

/** Tareas vivas no hechas con fecha vencida (D15). No cuenta ítems de checklist. */
export function overdueLiveTaskCount(p: Project, now: Date): number {
  return p.tasks.filter((t) => {
    if (t.archived || t.status === "done") return false;
    const d = daysUntil(t.dueDate, now);
    return d !== null && d < 0;
  }).length;
}

export type ProjectsSummary = {
  count: number;
  byHealth: Record<Health, number>;
  overdueProjects: number;
};

/** Resumen del conjunto ya filtrado (D19). */
export function summarizeProjects(
  projects: readonly Project[],
  settings: Settings | null,
  now: Date,
): ProjectsSummary {
  const byHealth: Record<Health, number> = { red: 0, amber: 0, green: 0 };
  let overdueProjects = 0;
  for (const p of projects) {
    byHealth[healthOf(p, settings, now)]++;
    const d = daysUntil(p.dueDate, now);
    if (d !== null && d < 0) overdueProjects++;
  }
  return { count: projects.length, byHealth, overdueProjects };
}

/** Los tres fragmentos de salud que pinta la página; unidos con « · »
 *  equivalen a `healthSentence` (D19). */
export function healthSummaryFragments(
  byHealth: Record<Health, number>,
): [string, string, string] {
  return [
    `${byHealth.red} en rojo`,
    `${byHealth.amber} ámbar`,
    `${byHealth.green} ${byHealth.green === 1 ? "verde" : "verdes"}`,
  ];
}

/** Proyectos de un producto, incluidos done/archived, por nombre (D28).
 *  No pasa por el filtro de la URL: el conteo y la lista miden lo mismo. */
export function projectsOfProduct(projects: readonly Project[], productId: string): Project[] {
  return projects
    .filter((p) => p.productId === productId)
    .sort((a, b) => byName(a, b));
}

const CLEARABLE = [
  "product", "status", "health", "stalled", "priority",
  "owner", "q", "due", "closed", "quarter", "sort",
] as const;

/** «Limpiar filtros» (D20): borra filtros y orden; `view` no se toca. */
export function clearProjectFilters(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const key of CLEARABLE) next.delete(key);
  return next;
}

export function hasProjectFilters(params: URLSearchParams): boolean {
  return CLEARABLE.some((key) => params.has(key));
}
