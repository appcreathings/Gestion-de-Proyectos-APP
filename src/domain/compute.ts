import { daysBetween, todayKey } from "@/lib/dates";
import type { Area, Checklist, Project, Quarter } from "./schemas";

export interface ProgressStat {
  done: number;
  total: number;
  pct: number; // 0..100
}

function stat(done: number, total: number): ProgressStat {
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function checklistProgress(c: Checklist): ProgressStat {
  const done = c.items.filter((i) => i.done).length;
  return stat(done, c.items.length);
}

export function areaProgress(a: Area): ProgressStat {
  let done = 0;
  let total = 0;
  for (const c of a.checklists) {
    done += c.items.filter((i) => i.done).length;
    total += c.items.length;
  }
  return stat(done, total);
}

export function projectChecklistProgress(p: Project): ProgressStat {
  let done = 0;
  let total = 0;
  for (const a of p.areas) {
    const s = areaProgress(a);
    done += s.done;
    total += s.total;
  }
  return stat(done, total);
}

export function projectTaskProgress(p: Project): ProgressStat {
  const done = p.tasks.filter((t) => t.status === "done").length;
  return stat(done, p.tasks.length);
}

export function isStalled(
  p: Project,
  stalledAfterDays: number,
  now: Date = new Date(),
): boolean {
  if (p.status === "done" || p.status === "archived") return false;
  const ageMs = now.getTime() - new Date(p.updatedAt).getTime();
  return ageMs > stalledAfterDays * 24 * 60 * 60 * 1000;
}

/**
 * Whole-day difference from the local calendar day of `now` to a YYYY-MM-DD key.
 * Negative = overdue, 0 = today. `now` is injectable so reports stay deterministic.
 */
export function daysUntil(date: string | null, now: Date = new Date()): number | null {
  if (!date) return null;
  return daysBetween(todayKey(now), date);
}

/** Aggregate checklist progress across a set of projects (roll-up building block). */
export function aggregateChecklistProgress(projects: Project[]): ProgressStat {
  let done = 0;
  let total = 0;
  for (const p of projects) {
    const s = projectChecklistProgress(p);
    done += s.done;
    total += s.total;
  }
  return stat(done, total);
}

export interface QuarterRollup extends ProgressStat {
  projectCount: number;
}

/** Aggregate checklist progress across every project assigned to a quarter. */
export function quarterRollup(quarter: Quarter, projects: Project[]): QuarterRollup {
  const scoped = projects.filter((p) => p.quarterId === quarter.id);
  return { ...aggregateChecklistProgress(scoped), projectCount: scoped.length };
}
