import { dayKeyFromDate, parseDayKey } from "@/lib/dates";
import { parseIdList } from "@/features/board/boardQuery";

/** Query de la URL del Gantt y memoria de la última query (spec 077 D17–D20).
 * Puro, sin React. La URL manda; `localStorage` solo cubre la vuelta por el menú. */

export type GanttScale = "month" | "quarter" | "year";

export interface GanttQuery {
  productIds: string[];
  projectIds: string[];
  scale: GanttScale;
  at: string | null;
}

/** `projectIds` = proyectos no archivados (incluye `done`, D14b). */
export interface KnownGanttRefs {
  productIds: ReadonlySet<string>;
  projectIds: ReadonlySet<string>;
}

export const GANTT_MEMORY_KEY = "hito.gantt.lastQuery";

const SCALES: readonly GanttScale[] = ["month", "quarter", "year"];
const DEFAULT_SCALE: GanttScale = "quarter";
const GANTT_KEYS = ["product", "project", "scale", "at"] as const;

function isScale(v: string | null): v is GanttScale {
  return v !== null && (SCALES as readonly string[]).includes(v);
}

/** `at` válido: AAAA-MM-DD y que sea una fecha real (rechaza 2026-13-99). */
function parseAt(raw: string | null): string | null {
  if (raw === null || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  return dayKeyFromDate(parseDayKey(raw)) === raw ? raw : null;
}

/** Ids basura (archivados, borrados, inventados) se descartan; conserva el orden de la URL. */
export function parseGanttQuery(params: URLSearchParams, known?: KnownGanttRefs): GanttQuery {
  const scale = params.get("scale");
  return {
    productIds: parseIdList(params.get("product"), known?.productIds),
    projectIds: parseIdList(params.get("project"), known?.projectIds),
    scale: isScale(scale) ? scale : DEFAULT_SCALE,
    at: parseAt(params.get("at")),
  };
}

/** Orden product, project, scale (omitida si es quarter), at; ids con localeCompare. */
export function canonicalGanttSearch(q: GanttQuery): URLSearchParams {
  const next = new URLSearchParams();
  if (q.productIds.length > 0) {
    next.set("product", [...q.productIds].sort((a, b) => a.localeCompare(b)).join(","));
  }
  if (q.projectIds.length > 0) {
    next.set("project", [...q.projectIds].sort((a, b) => a.localeCompare(b)).join(","));
  }
  if (q.scale !== DEFAULT_SCALE) next.set("scale", q.scale);
  if (q.at) next.set("at", q.at);
  return next;
}

/** «Limpiar filtros» vacía product/project y conserva escala y ventana (D20). */
export function clearGanttFilters(q: GanttQuery): GanttQuery {
  return { ...q, productIds: [], projectIds: [] };
}

export function ganttQueryIsEmpty(params: URLSearchParams): boolean {
  return GANTT_KEYS.every((key) => !params.has(key));
}

function withoutAt(search: string): string {
  const params = new URLSearchParams(search);
  params.delete("at");
  return params.toString();
}

/** La memoria no guarda `at` (D19): se restaura sin ventana. null = no tocar la URL. */
export function restoreGanttSearch(params: URLSearchParams, memory: string | null): string | null {
  if (!ganttQueryIsEmpty(params) || memory === null) return null;
  const restored = withoutAt(memory);
  return restored === "" ? null : restored;
}

/** `localStorage` puede lanzar (modo privado): se traga. */
export function readGanttMemory(storage: Pick<Storage, "getItem">): string | null {
  try {
    return storage.getItem(GANTT_MEMORY_KEY);
  } catch {
    return null;
  }
}

export function writeGanttMemory(storage: Pick<Storage, "setItem">, search: string): void {
  try {
    storage.setItem(GANTT_MEMORY_KEY, withoutAt(search));
  } catch {
    // sin memoria disponible: la app sigue funcionando solo por URL
  }
}
