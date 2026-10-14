import { daysUntil } from "@/domain/compute";
import { stageLabel, type StageColor } from "@/domain/kanbanStages";
import { foldName } from "@/features/projects/filterProjects";
import { orderProjects } from "@/domain/sidebarOrder";
import { Priority, type Product, type Project, type Task } from "@/domain/schemas";

/** Query, filtro, columnas y vistas del tablero global (spec 075 D10–D14).
 * Todo puro y testeado sin montar React (D20). La URL es la fuente de verdad;
 * `view` viaja en la URL pero no participa de la comparación de filtros. */

export type BoardDateFilter = "overdue" | "due-soon" | "this-week";

export interface BoardQuery {
  productIds: string[];
  projectIds: string[];
  personId: string | null;
  priority: Priority | null;
  date: BoardDateFilter | null;
  q: string;
  showDone: boolean;
  viewId: string | null;
}

export interface BoardCard {
  task: Task;
  projectId: string;
  projectName: string;
  productId: string | null;
  taskIndex: number;
  stageName: string;
}

export type BoardColumnId = "todo" | "doing" | "blocked" | "otras" | "done";

export interface BoardColumnModel {
  id: BoardColumnId;
  name: string;
  color: StageColor;
  cards: BoardCard[];
  /** Hecha, con las tarjetas ocultas. 0 en el resto. */
  hiddenCount: number;
}

/** Ids que existen en el workspace. Un param con id fuera de estos sets no
 * filtra (D10); sin `known` (matching de vistas) no se valida nada. */
export interface KnownBoardRefs {
  productIds: ReadonlySet<string>;
  projectIds: ReadonlySet<string>;
  personIds: ReadonlySet<string>;
}

const DATE_FILTERS: readonly BoardDateFilter[] = ["overdue", "due-soon", "this-week"];
const PRIORITIES: readonly Priority[] = Priority.options;

function isDateFilter(v: string | null): v is BoardDateFilter {
  return v !== null && (DATE_FILTERS as readonly string[]).includes(v);
}

function isPriority(v: string | null): v is Priority {
  return v !== null && (PRIORITIES as readonly string[]).includes(v);
}

/** Parte `a,b`, recorta, tira vacíos y duplicados; valida contra `ids`. */
function parseIdList(raw: string | null, ids: ReadonlySet<string> | undefined): string[] {
  if (raw === null) return [];
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const id = part.trim();
    if (!id || out.includes(id)) continue;
    if (ids && !ids.has(id)) continue;
    out.push(id);
  }
  return out;
}

/**
 * null/undefined `known` = parseo permisivo (matching de vistas): los ids no
 * se validan porque ambos lados de la comparación se recortan igual.
 */
export function parseBoardQuery(
  params: URLSearchParams,
  known?: KnownBoardRefs,
): BoardQuery {
  const personRaw = params.get("person");
  const priorityRaw = params.get("priority");
  const dateRaw = params.get("date");
  return {
    productIds: parseIdList(params.get("product"), known?.productIds),
    projectIds: parseIdList(params.get("project"), known?.projectIds),
    personId:
      personRaw !== null && personRaw !== "" && (!known || known.personIds.has(personRaw))
        ? personRaw
        : null,
    priority: isPriority(priorityRaw) ? priorityRaw : null,
    date: isDateFilter(dateRaw) ? dateRaw : null,
    q: params.get("q")?.trim() ?? "",
    showDone: params.get("done") === "1",
    viewId: params.get("view"),
  };
}

/** Solo lo activo, en el orden de keys del spec §4; ids con `localeCompare`.
 *  `view` no entra: es marcador de la URL, no filtro. */
export function canonicalBoardSearch(query: BoardQuery): URLSearchParams {
  const next = new URLSearchParams();
  if (query.productIds.length > 0) {
    next.set("product", [...query.productIds].sort((a, b) => a.localeCompare(b)).join(","));
  }
  if (query.projectIds.length > 0) {
    next.set("project", [...query.projectIds].sort((a, b) => a.localeCompare(b)).join(","));
  }
  if (query.personId) next.set("person", query.personId);
  if (query.priority) next.set("priority", query.priority);
  if (query.date) next.set("date", query.date);
  if (query.q) next.set("q", query.q);
  if (query.showDone) next.set("done", "1");
  return next;
}

/** Campos de filtro, sin `viewId` (D14). */
export function filtersEqual(a: BoardQuery, b: BoardQuery): boolean {
  return (
    a.productIds.join(",") === b.productIds.join(",") &&
    a.projectIds.join(",") === b.projectIds.join(",") &&
    a.personId === b.personId &&
    a.priority === b.priority &&
    a.date === b.date &&
    a.q === b.q &&
    a.showDone === b.showDone
  );
}

function matchesDate(dueDate: string | null, date: BoardDateFilter, now: Date): boolean {
  const d = daysUntil(dueDate, now);
  if (d === null) return false;
  if (date === "overdue") return d < 0;
  if (date === "due-soon") return d >= 0 && d <= 3;
  return d >= 0 && d <= 7; // this-week
}

/** Tareas no archivadas de proyectos vivos, recortadas por la query (D8/D11).
 *  No ordena: el orden lo pone `sortCards` con el rango de la barra. */
export function collectBoardCards(
  projects: readonly Project[],
  query: BoardQuery,
  now: Date,
): BoardCard[] {
  const productSet = query.productIds.length > 0 ? new Set(query.productIds) : null;
  const projectSet = query.projectIds.length > 0 ? new Set(query.projectIds) : null;
  const needle = query.q ? foldName(query.q) : "";

  const cards: BoardCard[] = [];
  for (const project of projects) {
    if (project.status === "done" || project.status === "archived") continue;
    if (productSet && (project.productId === null || !productSet.has(project.productId))) {
      continue;
    }
    if (projectSet && !projectSet.has(project.id)) continue;

    project.tasks.forEach((task, taskIndex) => {
      if (task.archived) return;
      if (query.personId && task.assigneeId !== query.personId) return;
      if (query.priority && task.priority !== query.priority) return;
      if (query.date && !matchesDate(task.dueDate, query.date, now)) return;
      if (needle && !foldName(task.title).includes(needle)) return;
      cards.push({
        task,
        projectId: project.id,
        projectName: project.name,
        productId: project.productId,
        taskIndex,
        stageName: stageLabel(project, task.status),
      });
    });
  }
  return cards;
}

/** Puesto de cada proyecto en el tablero: primero el orden de productos de la
 * barra (`productOrder`, spec 076 D9), después el orden interno del producto
 * (barra, D7). `__unassigned` va después de los productos; quien no entró
 * queda con un rango alto. Sin lista guardada, manda el orden del array. */
export function boardProjectRank(
  products: readonly Product[],
  projects: readonly Project[],
  sidebarOrder: Readonly<Record<string, string[]>>,
  productOrder: readonly string[] = [],
): Map<string, number> {
  const rank = new Map<string, number>();
  const open = projects.filter((p) => p.status !== "done" && p.status !== "archived");
  let next = 0;

  const groups: { id: string; projects: Project[] }[] = orderProjects(products, productOrder).map(
    (prod) => ({
      id: prod.id,
      projects: open.filter((p) => p.productId === prod.id),
    }),
  );
  groups.push({ id: "__unassigned", projects: open.filter((p) => p.productId === null) });

  for (const group of groups) {
    for (const p of orderProjects(group.projects, sidebarOrder[group.id])) {
      rank.set(p.id, next++);
    }
  }
  return rank;
}

/** Rango, después `taskIndex`, después título (D7). */
export function sortCards(cards: readonly BoardCard[], rank: ReadonlyMap<string, number>): BoardCard[] {
  return [...cards].sort((a, b) => {
    const ra = rank.get(a.projectId) ?? Number.MAX_SAFE_INTEGER;
    const rb = rank.get(b.projectId) ?? Number.MAX_SAFE_INTEGER;
    if (ra !== rb) return ra - rb;
    if (a.taskIndex !== b.taskIndex) return a.taskIndex - b.taskIndex;
    return a.task.title.localeCompare(b.task.title, "es");
  });
}

const COLUMN_SHAPE: { id: BoardColumnId; name: string; color: StageColor }[] = [
  { id: "todo", name: "Por hacer", color: "slate" },
  { id: "doing", name: "En curso", color: "blue" },
  { id: "blocked", name: "Bloqueada", color: "amber" },
];

/** Columnas del tablero global (D3–D5): las tres base siempre, Otras solo si
 * hay tarjetas, Hecha siempre al final. `otras` jamás se escribe en
 * `task.status`: es un balde de presentación. */
export function boardColumns(
  cards: readonly BoardCard[],
  showDone: boolean,
  rank: ReadonlyMap<string, number>,
): BoardColumnModel[] {
  const buckets = new Map<BoardColumnId, BoardCard[]>();
  for (const card of cards) {
    const id = isBuiltin(card.task.status) ? card.task.status : "otras";
    const bucket = buckets.get(id) ?? [];
    bucket.push(card);
    buckets.set(id, bucket);
  }

  const columns: BoardColumnModel[] = COLUMN_SHAPE.map((shape) => ({
    ...shape,
    cards: sortCards(buckets.get(shape.id) ?? [], rank),
    hiddenCount: 0,
  }));

  const otras = buckets.get("otras");
  if (otras && otras.length > 0) {
    columns.push({ id: "otras", name: "Otras", color: "slate", cards: sortCards(otras, rank), hiddenCount: 0 });
  }

  const done = buckets.get("done") ?? [];
  columns.push({
    id: "done",
    name: "Hecha",
    color: "green",
    cards: showDone ? sortCards(done, rank) : [],
    hiddenCount: showDone ? 0 : done.length,
  });
  return columns;
}

function isBuiltin(status: string): status is "todo" | "doing" | "blocked" | "done" {
  return status === "todo" || status === "doing" || status === "blocked" || status === "done";
}

export type ViewNameError = "empty" | "duplicate" | "limit";

const MAX_VIEWS = 20;

/** trim; vacío → empty; repetido por `foldName` → duplicate; sin `ignoreId`
 * (crear) y ya hay 20 → limit. Actualizar no llama esto (D14). */
export function viewNameError(
  views: readonly { id: string; name: string }[],
  name: string,
  ignoreId?: string,
): ViewNameError | null {
  const folded = foldName(name.trim());
  if (!folded) return "empty";
  const taken = views.some((v) => v.id !== ignoreId && foldName(v.name.trim()) === folded);
  if (taken) return "duplicate";
  if (!ignoreId && views.length >= MAX_VIEWS) return "limit";
  return null;
}

/** Primera vista cuyo `query` guardado coincide con los filtros de la URL,
 * comparado sin `view` (D14). Parseo permisivo: ambos lados se recortan igual. */
export function matchingViewId(
  views: readonly { id: string; query: string }[],
  search: URLSearchParams,
): string | null {
  const current = parseBoardQuery(search);
  for (const view of views) {
    const saved = parseBoardQuery(new URLSearchParams(view.query));
    if (filtersEqual(saved, current)) return view.id;
  }
  return null;
}
