import type { EntityRef, Project } from "@/domain/schemas";

/** Pure date/period helpers used by the temporal evaluator (M4). */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local calendar day key, `YYYY-MM-DD`. */
export function todayKey(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** ISO-8601 week key, `YYYY-Www`. */
export function weekKey(now: Date): string {
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const day = d.getUTCDay() || 7; // Mon=1..Sun=7
  d.setUTCDate(d.getUTCDate() + 4 - day); // shift to the Thursday of this week
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${pad(weekNo)}`;
}

export interface DatedEntity {
  ref: EntityRef;
  dueDate: string; // YYYY-MM-DD (non-null)
  label: string;
}

/**
 * Enumerate the open, dated entities of a project (project due date, pending
 * tasks, pending checklist items). Milestones are omitted: `EntityRef` has no
 * milestone kind and they are not yet surfaced in the UI.
 */
export function collectDatedEntities(p: Project): DatedEntity[] {
  const out: DatedEntity[] = [];

  if (p.dueDate) {
    out.push({ ref: { kind: "project", projectId: p.id }, dueDate: p.dueDate, label: p.name });
  }

  for (const t of p.tasks) {
    if (t.dueDate && t.status !== "done") {
      out.push({
        ref: { kind: "task", projectId: p.id, taskId: t.id },
        dueDate: t.dueDate,
        label: t.title,
      });
    }
  }

  for (const a of p.areas) {
    for (const cl of a.checklists) {
      for (const it of cl.items) {
        if (it.dueDate && !it.done) {
          out.push({
            ref: {
              kind: "checklistItem",
              projectId: p.id,
              areaId: a.id,
              checklistId: cl.id,
              itemId: it.id,
            },
            dueDate: it.dueDate,
            label: it.text,
          });
        }
      }
    }
  }

  return out;
}

/** Stable key for an entity reference, used to build deterministic ids. */
export function entityKey(ref: EntityRef): string {
  return [ref.projectId, ref.areaId, ref.checklistId, ref.itemId, ref.taskId]
    .filter(Boolean)
    .join("/");
}

/* ---------- Date preview helpers (spec 008) ---------- */

const DAY_FORMATTER = new Intl.DateTimeFormat("es", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Same as DAY_FORMATTER but without the weekday — used for range endpoints. */
const RANGE_DAY_FORMATTER = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Parse a `YYYY-MM-DD` day key as a local calendar date (no time-zone shift). */
export function parseDayKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function dayKeyFromDate(d: Date): string {
  return todayKey(d);
}

export interface DayRange {
  start: string;
  end: string;
}

/** Semana ISO (lunes–domingo) que contiene `dayKey` (spec 053). */
export function weekRangeContaining(dayKey: string): DayRange {
  const d = parseDayKey(dayKey);
  const day = d.getDay(); // 0=Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + mondayOffset);
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
  return { start: dayKeyFromDate(monday), end: dayKeyFromDate(sunday) };
}

/** Primer y último día del mes de `dayKey` (spec 053). */
export function monthRangeContaining(dayKey: string): DayRange {
  const d = parseDayKey(dayKey);
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return { start: dayKeyFromDate(start), end: dayKeyFromDate(end) };
}

export function shiftRange(range: DayRange, unit: "week" | "month", delta: number): DayRange {
  if (unit === "week") {
    const start = parseDayKey(range.start);
    start.setDate(start.getDate() + delta * 7);
    return weekRangeContaining(dayKeyFromDate(start));
  }
  const start = parseDayKey(range.start);
  start.setMonth(start.getMonth() + delta);
  return monthRangeContaining(dayKeyFromDate(start));
}

/** Lista inclusiva de day keys entre range.start y range.end. */
export function eachDay(range: DayRange): string[] {
  const out: string[] = [];
  const cur = parseDayKey(range.start);
  const end = parseDayKey(range.end);
  while (cur.getTime() <= end.getTime()) {
    out.push(dayKeyFromDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function rangesIntersect(a: DayRange, b: DayRange): boolean {
  return a.start <= b.end && a.end >= b.start;
}

/** Whole-day difference `b - a` (positive when `b` is later), ignoring time-of-day. */
export function daysBetween(a: string, b: string): number {
  const MS_PER_DAY = 86_400_000;
  return Math.round((parseDayKey(b).getTime() - parseDayKey(a).getTime()) / MS_PER_DAY);
}

/** "sáb, 5 jul 2026" for a `YYYY-MM-DD` day key. */
export function formatDay(key: string): string {
  return DAY_FORMATTER.format(parseDayKey(key));
}

/** "hoy" / "mañana" / "en 3 días" / "ayer" / "hace 2 días", relative to today. */
export function relativeDay(key: string, now: Date = new Date()): string {
  const diff = daysBetween(todayKey(now), key);
  if (diff === 0) return "hoy";
  if (diff === 1) return "mañana";
  if (diff === -1) return "ayer";
  return diff > 0 ? `en ${diff} días` : `hace ${Math.abs(diff)} días`;
}

/** "1 jul 2026 – 14 jul 2026 · 14 días" for a start/end pair of `YYYY-MM-DD` day keys. */
export function formatRange(start: string, end: string): string {
  const days = daysBetween(start, end) + 1; // inclusive
  const startLabel = RANGE_DAY_FORMATTER.format(parseDayKey(start));
  const endLabel = RANGE_DAY_FORMATTER.format(parseDayKey(end));
  return `${startLabel} – ${endLabel} · ${days} ${days === 1 ? "día" : "días"}`;
}
