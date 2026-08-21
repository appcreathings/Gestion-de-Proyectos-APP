import type { UsageEvent } from "./types";

export const USAGE_MAX_EVENTS = 500;
export const USAGE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;

export function pruneEvents(events: UsageEvent[], now: number = Date.now()): UsageEvent[] {
  const cutoff = now - USAGE_MAX_AGE_MS;
  return events
    .filter((e) => Date.parse(e.ts) >= cutoff)
    .sort((a, b) => Date.parse(a.ts) - Date.parse(b.ts))
    .slice(-USAGE_MAX_EVENTS);
}
