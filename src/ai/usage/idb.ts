import { idbGet, idbSet } from "@/storage/idb";
import { pruneEvents } from "./prune";
import type { UsageEvent } from "./types";

export const IDB_USAGE_EVENTS = "aiUsage:events";

export async function loadEvents(): Promise<UsageEvent[]> {
  try {
    const raw = await idbGet<UsageEvent[]>(IDB_USAGE_EVENTS);
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export async function saveEvents(events: UsageEvent[]): Promise<void> {
  await idbSet(IDB_USAGE_EVENTS, pruneEvents(events));
}
