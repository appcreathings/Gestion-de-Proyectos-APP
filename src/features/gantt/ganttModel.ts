import { completionDay } from "@/domain/taskCompletion";
import type { Product, Project, Task } from "@/domain/schemas";
import { boardProjectRank } from "@/features/board/boardQuery";
import {
  dayKeyFromDate,
  daysBetween,
  parseDayKey,
  weekRangeContaining,
  type DayRange,
} from "@/lib/dates";
import type { GanttQuery, GanttScale } from "./ganttQuery";

/** Modelo puro del Gantt de proyectos (spec 077 D9–D17). Sin React. */

export interface GanttColumn {
  start: string;
  end: string;
  label: string;
}
export interface GanttWindow extends DayRange {
  scale: GanttScale;
  columns: GanttColumn[];
  totalDays: number;
}
export type DotKind = "done" | "pending" | "overdue";
export interface GanttDot {
  day: string;
  kind: DotKind;
  estimated: boolean;
  tasks: Task[];
  left: number;
}
export interface GanttBar {
  start: string;
  end: string;
  derived: boolean;
  left: number;
  width: number;
}
export interface GanttTaskRow {
  task: Task;
  day: string | null;
  kind: DotKind;
  estimated: boolean;
  left: number | null;
}
export interface GanttProjectRow {
  project: Project;
  bar: GanttBar | null;
  done: number;
  total: number;
  dots: GanttDot[];
  taskRows: GanttTaskRow[];
}

const MONTH_FORMATTER = new Intl.DateTimeFormat("es", { month: "short" });

function monthLabel(d: Date): string {
  return MONTH_FORMATTER.format(d).replace(".", "").toLowerCase();
}

function addDays(key: string, n: number): string {
  const d = parseDayKey(key);
  return dayKeyFromDate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n));
}

/** Ventana por escala (D17): mes = 6 semanas (ancla en la 3.ª), trimestre = 13
 * (ancla en la 7.ª), año = 12 meses (mes del ancla = 7.º). */
export function ganttWindow(scale: GanttScale, anchor: string): GanttWindow {
  if (scale === "year") {
    const a = parseDayKey(anchor);
    const columns: GanttColumn[] = [];
    for (let i = -6; i < 6; i++) {
      const first = new Date(a.getFullYear(), a.getMonth() + i, 1);
      const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
      columns.push({
        start: dayKeyFromDate(first),
        end: dayKeyFromDate(last),
        label: monthLabel(first),
      });
    }
    const start = columns[0].start;
    const end = columns[columns.length - 1].end;
    return { scale, start, end, columns, totalDays: daysBetween(start, end) + 1 };
  }

  const weeksBefore = scale === "month" ? 2 : 6;
  const weeks = scale === "month" ? 6 : 13;
  const start = addDays(weekRangeContaining(anchor).start, -7 * weeksBefore);
  const end = addDays(start, weeks * 7 - 1);
  const columns: GanttColumn[] = [];
  if (scale === "month") {
    for (let i = 0; i < weeks * 7; i++) {
      const day = addDays(start, i);
      columns.push({ start: day, end: day, label: String(Number(day.slice(8))) });
    }
  } else {
    for (let w = 0; w < weeks; w++) {
      const mon = addDays(start, w * 7);
      const d = parseDayKey(mon);
      columns.push({
        start: mon,
        end: addDays(mon, 6),
        label: `${d.getDate()} ${monthLabel(d)}`,
      });
    }
  }
  return { scale, start, end, columns, totalDays: weeks * 7 };
}

/** Desplaza el ancla ±1 / ±3 / ±12 meses; recorta el día al largo del mes destino. */
export function shiftAnchor(scale: GanttScale, anchor: string, delta: number): string {
  const step = scale === "month" ? 1 : scale === "quarter" ? 3 : 12;
  const d = parseDayKey(anchor);
  const target = new Date(d.getFullYear(), d.getMonth() + delta * step, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d.getDate(), lastDay));
  return dayKeyFromDate(target);
}

/** % del inicio del día dentro de la ventana; null si cae afuera. */
export function placeDay(win: GanttWindow, day: string): number | null {
  if (day < win.start || day > win.end) return null;
  return (daysBetween(win.start, day) / win.totalDays) * 100;
}

/** Recorta [start, end] a la ventana (D-foco 2); null si no la toca. */
export function placeRange(
  win: GanttWindow,
  start: string,
  end: string,
): { left: number; width: number } | null {
  if (end < win.start || start > win.end) return null;
  const s = start < win.start ? win.start : start;
  const e = end > win.end ? win.end : end;
  return {
    left: (daysBetween(win.start, s) / win.totalDays) * 100,
    width: ((daysBetween(s, e) + 1) / win.totalDays) * 100,
  };
}

/** Día local de un ISO, o `null` si no se puede interpretar (F4). */
function isoDay(iso: string): string | null {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : dayKeyFromDate(d);
}

/** Acepta solo claves `YYYY-MM-DD` reales; cualquier otra cosa → `null` (F4). */
function validKey(key: string | null): string | null {
  if (!key || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return null;
  return dayKeyFromDate(parseDayKey(key)) === key ? key : null;
}

/** Barra del proyecto (D9). Completa puntas faltantes con las tareas; no
 * asume `completedAt >= createdAt`: usa el menor y el mayor de lo que haya.
 * Fechas ilegibles se saltan: nunca «NaN» ni estiran la barra (F4). */
export function projectBar(
  project: Project,
  tasks: readonly Task[],
): { start: string; end: string; derived: boolean } | null {
  const starts: string[] = [];
  const ends: string[] = [];
  for (const t of tasks) {
    const c = completionDay(t)?.day;
    const created = isoDay(t.createdAt);
    if (created) starts.push(created);
    if (c) {
      starts.push(c);
      ends.push(c);
    }
    const due = validKey(t.dueDate);
    if (due) ends.push(due);
  }
  const min = (xs: string[]) => (xs.length ? xs.reduce((a, b) => (a < b ? a : b)) : null);
  const max = (xs: string[]) => (xs.length ? xs.reduce((a, b) => (a > b ? a : b)) : null);

  const pStart = validKey(project.startDate);
  const pDue = validKey(project.dueDate);
  const hasStart = pStart !== null;
  const hasEnd = pDue !== null;
  // Sin fechas propias ni de tareas: sin barra (D9).
  let s = pStart ?? min(starts) ?? pDue ?? max(ends);
  let e = pDue ?? max(ends) ?? s;
  if (s === null || e === null) return null;
  if (s > e) [s, e] = [e, s];
  return { start: s, end: e, derived: !hasStart || !hasEnd };
}

/** Tareas del Gantt (D12): no archivadas, y archivadas solo si están hechas. */
export function ganttTasks(project: Project): Task[] {
  return project.tasks.filter((t) => !t.archived || t.status === "done");
}

function taskRow(task: Task, today: string, win: GanttWindow): GanttTaskRow {
  const done = completionDay(task);
  if (done) {
    return {
      task,
      day: done.day,
      kind: "done",
      estimated: done.estimated,
      left: placeDay(win, done.day),
    };
  }
  if (task.dueDate) {
    const kind: DotKind = task.dueDate < today ? "overdue" : "pending";
    return {
      task,
      day: task.dueDate,
      kind,
      estimated: false,
      left: placeDay(win, task.dueDate),
    };
  }
  return { task, day: null, kind: "pending", estimated: false, left: null };
}

/** D16: hechas por día de cierre, pendientes por vencimiento, sin fecha al final. */
function sortTaskRows(rows: GanttTaskRow[]): GanttTaskRow[] {
  const group = (r: GanttTaskRow) => (r.kind === "done" ? 0 : r.day ? 1 : 2);
  return rows
    .map((r, i) => ({ r, i }))
    .sort((a, b) => {
      const ga = group(a.r);
      const gb = group(b.r);
      if (ga !== gb) return ga - gb;
      if (a.r.day && b.r.day && a.r.day !== b.r.day) return a.r.day < b.r.day ? -1 : 1;
      return a.i - b.i;
    })
    .map((x) => x.r);
}

/** D15: un punto por día + tipo + estimado; los que caen afuera no se dibujan. */
export function groupDots(win: GanttWindow, rows: readonly GanttTaskRow[]): GanttDot[] {
  const map = new Map<string, GanttDot>();
  for (const r of rows) {
    if (r.day === null) continue;
    const left = placeDay(win, r.day);
    if (left === null) continue;
    const key = `${r.day}|${r.kind}|${r.estimated}`;
    const dot = map.get(key);
    if (dot) dot.tasks.push(r.task);
    else
      map.set(key, { day: r.day, kind: r.kind, estimated: r.estimated, tasks: [r.task], left });
  }
  return [...map.values()].sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
}

const TOOLTIP_MAX = 5;

/** Hasta 5 títulos y «y N más» (D15). */
export function dotTooltip(dot: GanttDot): string {
  const lines = dot.tasks.slice(0, TOOLTIP_MAX).map((t) => t.title);
  if (dot.tasks.length > TOOLTIP_MAX) lines.push(`y ${dot.tasks.length - TOOLTIP_MAX} más`);
  return lines.join("\n");
}

export function buildGanttRows(input: {
  projects: readonly Project[];
  products: readonly Product[];
  sidebarOrder: Readonly<Record<string, string[]>>;
  productOrder: readonly string[];
  query: GanttQuery;
  window: GanttWindow;
  today: string;
}): GanttProjectRow[] {
  const { query, window: win, today } = input;
  const chosen = query.projectIds.length > 0;
  const rank = boardProjectRank(
    input.products,
    input.projects,
    input.sidebarOrder,
    input.productOrder,
    {
      includeDone: true,
    },
  );

  const out: GanttProjectRow[] = [];
  for (const project of input.projects) {
    if (project.status === "archived") continue; // D13
    if (
      query.productIds.length &&
      !(project.productId && query.productIds.includes(project.productId))
    )
      continue;
    if (chosen && !query.projectIds.includes(project.id)) continue;

    const tasks = ganttTasks(project);
    const rawBar = projectBar(project, tasks);
    const placed = rawBar ? placeRange(win, rawBar.start, rawBar.end) : null;
    const bar: GanttBar | null = rawBar && placed ? { ...rawBar, ...placed } : null;
    const taskRows = sortTaskRows(tasks.map((t) => taskRow(t, today, win)));
    const dots = groupDots(win, taskRows);

    // D13: sin chips de proyecto, solo lo que toca la ventana.
    if (!chosen && !bar && dots.length === 0) continue;
    out.push({
      project,
      bar,
      done: tasks.filter((t) => t.status === "done").length,
      total: tasks.length,
      dots,
      taskRows,
    });
  }
  return out.sort(
    (a, b) =>
      (rank.get(a.project.id) ?? Number.MAX_SAFE_INTEGER) -
      (rank.get(b.project.id) ?? Number.MAX_SAFE_INTEGER),
  );
}
