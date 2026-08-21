import { create } from "zustand";
import { aggregateTurn } from "@/ai/usage/aggregate";
import { IDB_USAGE_EVENTS, loadEvents, saveEvents } from "@/ai/usage/idb";
import { pruneEvents } from "@/ai/usage/prune";
import type { TurnUsageView, UsageEvent } from "@/ai/usage/types";
import { idbDel } from "@/storage/idb";

const INCLUDE_ESTIMATED_KEY = "hito:aiUsage:includeEstimated";

export interface UsageSession {
  requests: number;
  inputTokens: number;
  outputTokens: number;
}

interface AiUsageState {
  events: UsageEvent[];
  session: UsageSession;
  lastTurn: TurnUsageView | null;
  includeEstimated: boolean;
  loaded: boolean;
  hydrate: () => Promise<void>;
  record: (event: UsageEvent) => Promise<void>;
  clear: () => Promise<void>;
  setIncludeEstimated: (v: boolean) => void;
  exportEvents: () => UsageEvent[];
}

function emptySession(): UsageSession {
  return { requests: 0, inputTokens: 0, outputTokens: 0 };
}

function readIncludeEstimated(): boolean {
  try {
    const raw = localStorage.getItem(INCLUDE_ESTIMATED_KEY);
    if (raw === null) return true;
    return raw !== "false";
  } catch {
    return true;
  }
}

function writeIncludeEstimated(v: boolean): void {
  try {
    localStorage.setItem(INCLUDE_ESTIMATED_KEY, v ? "true" : "false");
  } catch {
    // private-mode / quota — state still updates
  }
}

export const useAiUsageStore = create<AiUsageState>((set, get) => ({
  events: [],
  session: emptySession(),
  lastTurn: null,
  includeEstimated: true,
  loaded: false,

  async hydrate() {
    if (get().loaded) return;
    const events = await loadEvents();
    set({
      events,
      includeEstimated: readIncludeEstimated(),
      loaded: true,
    });
  },

  async record(event) {
    const events = pruneEvents([...get().events, event]);
    const prev = get().session;
    const session: UsageSession = {
      requests: prev.requests + event.requests,
      inputTokens: prev.inputTokens + event.usage.inputTokens,
      outputTokens: prev.outputTokens + event.usage.outputTokens,
    };
    const lastTurn = aggregateTurn(events, event.turnId);
    set({ events, session, lastTurn });
    try {
      await saveEvents(events);
    } catch {
      // CA-07.1: session/events already in memory; persist is best-effort
    }
  },

  async clear() {
    try {
      await idbDel(IDB_USAGE_EVENTS);
    } catch {
      // still empty RAM even if IDB delete fails
    }
    set({ events: [], lastTurn: null });
  },

  setIncludeEstimated(v) {
    writeIncludeEstimated(v);
    set({ includeEstimated: v });
  },

  exportEvents() {
    return get().events;
  },
}));
