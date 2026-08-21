import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { UsageEvent } from "@/ai/usage/types";

vi.mock("@/storage/idb", () => {
  const store = new Map<string, unknown>();
  return {
    idbGet: vi.fn(async (k: string) => store.get(k)),
    idbSet: vi.fn(async (k: string, v: unknown) => {
      store.set(k, v);
    }),
    idbDel: vi.fn(async (k: string) => {
      store.delete(k);
    }),
    __store: store,
  };
});

import { useAiUsageStore } from "./useAiUsageStore";

function makeStorage(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => {
      store.set(k, String(v));
    },
    removeItem: (k) => {
      store.delete(k);
    },
    clear: () => store.clear(),
    key: () => null,
    get length() {
      return store.size;
    },
  } as Storage;
}

function ev(
  over: Partial<UsageEvent> & Pick<UsageEvent, "id" | "turnId" | "kind">,
): UsageEvent {
  return {
    ts: new Date().toISOString(),
    provider: "gemini",
    modelId: "gemini:gemini-2.5-flash",
    requests: 1,
    usage: { inputTokens: 10, outputTokens: 2, totalTokens: 12, source: "provider" },
    ...over,
  };
}

describe("useAiUsageStore", () => {
  beforeEach(async () => {
    vi.stubGlobal("localStorage", makeStorage());
    const idb = await import("@/storage/idb");
    (idb as unknown as { __store: Map<string, unknown> }).__store.clear();
    vi.mocked(idb.idbGet).mockClear();
    vi.mocked(idb.idbSet).mockClear();
    vi.mocked(idb.idbDel).mockClear();
    useAiUsageStore.setState({
      events: [],
      session: { requests: 0, inputTokens: 0, outputTokens: 0 },
      lastTurn: null,
      includeEstimated: true,
      loaded: false,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("record two events same turnId sums lastTurn.requests and session.requests", async () => {
    await useAiUsageStore.getState().record(
      ev({
        id: "c1",
        turnId: "turn-1",
        kind: "chat",
        rounds: 2,
        requests: 2,
        usage: { inputTokens: 100, outputTokens: 20, totalTokens: 120, source: "provider" },
      }),
    );
    await useAiUsageStore.getState().record(
      ev({
        id: "e1",
        turnId: "turn-1",
        kind: "embedding",
        requests: 1,
        usage: { inputTokens: 50, outputTokens: 0, totalTokens: 50, source: "provider" },
      }),
    );

    const state = useAiUsageStore.getState();
    expect(state.lastTurn?.requests).toBe(3);
    expect(state.session.requests).toBe(3);
    expect(state.session.inputTokens).toBe(150);
    expect(state.session.outputTokens).toBe(20);
  });

  it("record still updates session and events if saveEvents fails (CA-07.1)", async () => {
    const { idbSet } = await import("@/storage/idb");
    vi.mocked(idbSet).mockRejectedValueOnce(new Error("quota"));

    const event = ev({
      id: "c1",
      turnId: "turn-fail",
      kind: "chat",
      requests: 2,
      usage: { inputTokens: 40, outputTokens: 10, totalTokens: 50, source: "estimated" },
    });

    await expect(useAiUsageStore.getState().record(event)).resolves.toBeUndefined();

    const state = useAiUsageStore.getState();
    expect(state.events).toHaveLength(1);
    expect(state.events[0]?.id).toBe("c1");
    expect(state.session.requests).toBe(2);
    expect(state.session.inputTokens).toBe(40);
    expect(state.session.outputTokens).toBe(10);
    expect(state.lastTurn?.turnId).toBe("turn-fail");
  });

  it("clear empties events and lastTurn but leaves session.requests (CA-06.6)", async () => {
    await useAiUsageStore.getState().record(
      ev({
        id: "c1",
        turnId: "turn-1",
        kind: "chat",
        requests: 2,
      }),
    );
    expect(useAiUsageStore.getState().session.requests).toBe(2);
    expect(useAiUsageStore.getState().lastTurn).not.toBeNull();

    await useAiUsageStore.getState().clear();

    const state = useAiUsageStore.getState();
    expect(state.events).toEqual([]);
    expect(state.lastTurn).toBeNull();
    expect(state.session.requests).toBe(2);
    expect(state.session.inputTokens).toBe(10);
    expect(state.session.outputTokens).toBe(2);
  });

  it("setIncludeEstimated(false) persists to localStorage", () => {
    useAiUsageStore.getState().setIncludeEstimated(false);
    expect(useAiUsageStore.getState().includeEstimated).toBe(false);
    expect(localStorage.getItem("hito:aiUsage:includeEstimated")).toBe("false");
  });
});
