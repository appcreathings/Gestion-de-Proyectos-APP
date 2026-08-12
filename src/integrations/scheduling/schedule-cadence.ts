/** Cadencia pura de triggers programados (spec 051). Sin DOM ni store. */

export type ScheduleCadence = "hourly" | "daily" | "weekly";

export interface ScheduleSpec {
  cadence: ScheduleCadence;
  atMinute: number;
  atHour?: number;
  weekday?: number;
}

const WEEKDAY_LABELS = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
] as const;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Instant local components → ms epoch. */
function atLocal(
  y: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number,
): number {
  return new Date(y, monthIndex, day, hour, minute, 0, 0).getTime();
}

/**
 * Último (o actual) ancla de cadencia ≤ `atMs`.
 * Hourly: minuto `atMinute` de cada hora.
 * Daily: `atHour:atMinute` de cada día (default hour 0 si falta).
 * Weekly: mismo, solo el `weekday` (0=dom…6=sáb); sin weekday → null.
 */
export function previousFireAtOrBefore(spec: ScheduleSpec, atMs: number): number | null {
  const d = new Date(atMs);
  const y = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const hour = d.getHours();
  const atMinute = spec.atMinute;
  const atHour = spec.atHour ?? 0;

  if (spec.cadence === "hourly") {
    let candidate = atLocal(y, m, day, hour, atMinute);
    if (candidate > atMs) {
      const prev = new Date(atMs - 60 * 60 * 1000);
      candidate = atLocal(
        prev.getFullYear(),
        prev.getMonth(),
        prev.getDate(),
        prev.getHours(),
        atMinute,
      );
    }
    return candidate;
  }

  if (spec.cadence === "daily") {
    let candidate = atLocal(y, m, day, atHour, atMinute);
    if (candidate > atMs) {
      const prev = new Date(y, m, day - 1);
      candidate = atLocal(
        prev.getFullYear(),
        prev.getMonth(),
        prev.getDate(),
        atHour,
        atMinute,
      );
    }
    return candidate;
  }

  // weekly
  if (spec.weekday === undefined) return null;
  const targetWd = spec.weekday;
  // Walk back up to 7 days to find the most recent target weekday at atHour:atMinute ≤ atMs
  for (let i = 0; i < 8; i++) {
    const probe = new Date(y, m, day - i);
    if (probe.getDay() !== targetWd) continue;
    const candidate = atLocal(
      probe.getFullYear(),
      probe.getMonth(),
      probe.getDate(),
      atHour,
      atMinute,
    );
    if (candidate <= atMs) return candidate;
  }
  return null;
}

/** Próximo ancla estrictamente posterior a `afterMs`. */
export function nextFireAfter(spec: ScheduleSpec, afterMs: number): number {
  const prev = previousFireAtOrBefore(spec, afterMs);
  if (prev === null) {
    // weekly sin weekday: fallback a mañana a atHour
    const d = new Date(afterMs);
    return atLocal(d.getFullYear(), d.getMonth(), d.getDate() + 1, spec.atHour ?? 0, spec.atMinute);
  }
  if (prev < afterMs) {
    // next slot after prev
    if (spec.cadence === "hourly") return prev + 60 * 60 * 1000;
    if (spec.cadence === "daily") {
      const p = new Date(prev);
      return atLocal(p.getFullYear(), p.getMonth(), p.getDate() + 1, spec.atHour ?? 0, spec.atMinute);
    }
    // weekly: +7 days
    const p = new Date(prev);
    return atLocal(p.getFullYear(), p.getMonth(), p.getDate() + 7, spec.atHour ?? 0, spec.atMinute);
  }
  // prev === afterMs (exact hit): next is the following slot
  if (spec.cadence === "hourly") return prev + 60 * 60 * 1000;
  if (spec.cadence === "daily") {
    const p = new Date(prev);
    return atLocal(p.getFullYear(), p.getMonth(), p.getDate() + 1, spec.atHour ?? 0, spec.atMinute);
  }
  const p = new Date(prev);
  return atLocal(p.getFullYear(), p.getMonth(), p.getDate() + 7, spec.atHour ?? 0, spec.atMinute);
}

/**
 * Hay un disparo teórico ≤ now estrictamente posterior a lastFiredAt
 * (o nunca se disparó).
 */
export function isDue(
  spec: ScheduleSpec,
  lastFiredAtMs: number | null,
  nowMs: number,
): boolean {
  const prev = previousFireAtOrBefore(spec, nowMs);
  if (prev === null) return false;
  if (lastFiredAtMs == null) return true;
  return prev > lastFiredAtMs;
}

export function formatScheduleSummary(spec: ScheduleSpec): string {
  const min = pad2(spec.atMinute);
  if (spec.cadence === "hourly") {
    return `Cada hora en el minuto ${min}`;
  }
  const hour = pad2(spec.atHour ?? 0);
  if (spec.cadence === "daily") {
    return `Cada día a las ${hour}:${min}`;
  }
  const day =
    spec.weekday !== undefined && spec.weekday >= 0 && spec.weekday <= 6
      ? WEEKDAY_LABELS[spec.weekday]
      : "día";
  return `Cada ${day} a las ${hour}:${min}`;
}

export function syntheticScheduleRecord(
  spec: ScheduleSpec,
  firedAtIso: string,
): Record<string, unknown> {
  return {
    firedAt: firedAtIso,
    cadence: spec.cadence,
    ...(spec.weekday !== undefined ? { weekday: spec.weekday } : {}),
  };
}

export function scheduleSpecFromTrigger(trigger: {
  cadence: ScheduleCadence;
  atMinute: number;
  atHour?: number;
  weekday?: number;
}): ScheduleSpec {
  return {
    cadence: trigger.cadence,
    atMinute: trigger.atMinute,
    atHour: trigger.atHour,
    weekday: trigger.weekday,
  };
}
