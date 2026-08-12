/** Watermark de último disparo por flow programado (spec 051).
 * Mismo patrón que `poll-sync-state.ts` (localStorage), con fallback en
 * memoria para entornos sin `localStorage` (tests Node / private mode). */

function storageKey(flowId: string): string {
  return `hito:schedule-lastFired:${flowId}`;
}

const memory = new Map<string, string>();

export function loadLastFiredAt(flowId: string): string | null {
  try {
    return localStorage.getItem(storageKey(flowId)) ?? memory.get(flowId) ?? null;
  } catch {
    return memory.get(flowId) ?? null;
  }
}

export function saveLastFiredAt(flowId: string, iso: string): void {
  memory.set(flowId, iso);
  try {
    localStorage.setItem(storageKey(flowId), iso);
  } catch {
    // localStorage unavailable — memory still holds the watermark this session.
  }
}

export function clearLastFiredAt(flowId: string): void {
  memory.delete(flowId);
  try {
    localStorage.removeItem(storageKey(flowId));
  } catch {
    // ignore
  }
}
