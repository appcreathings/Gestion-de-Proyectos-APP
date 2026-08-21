import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UsageEvent } from "./types";
import { USAGE_MAX_EVENTS } from "./prune";

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

import { IDB_USAGE_EVENTS, loadEvents, saveEvents } from "./idb";

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

describe("usage idb", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const idb = await import("@/storage/idb");
    (idb as unknown as { __store: Map<string, unknown> }).__store.clear();
  });

  it("saveEvents prunes stale (>14d) and caps at USAGE_MAX_EVENTS before idbSet", async () => {
    const { idbSet } = await import("@/storage/idb");
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    const current = ev({
      id: "now",
      turnId: "t-now",
      kind: "chat",
      ts: new Date(now).toISOString(),
    });
    const stale = ev({
      id: "stale",
      turnId: "t-stale",
      kind: "chat",
      ts: new Date(now - 15 * dayMs).toISOString(),
    });
    const recent = Array.from({ length: 501 }, (_, i) =>
      ev({
        id: `r-${i}`,
        turnId: `t-r-${i}`,
        kind: "chat",
        ts: new Date(now - (501 - i) * 1000).toISOString(),
      }),
    );

    await saveEvents([current, stale, ...recent]);

    expect(idbSet).toHaveBeenCalledTimes(1);
    expect(idbSet).toHaveBeenCalledWith(IDB_USAGE_EVENTS, expect.any(Array));
    const saved = vi.mocked(idbSet).mock.calls[0][1] as UsageEvent[];
    expect(saved.some((e) => e.id === "stale")).toBe(false);
    expect(saved).toHaveLength(USAGE_MAX_EVENTS);
    expect(saved[saved.length - 1]?.id).toBe("now");
  });

  it("loadEvents returns [] if missing, corrupt, or idbGet throws", async () => {
    const { idbGet } = await import("@/storage/idb");

    vi.mocked(idbGet).mockResolvedValueOnce(undefined);
    expect(await loadEvents()).toEqual([]);

    vi.mocked(idbGet).mockResolvedValueOnce({ not: "an-array" });
    expect(await loadEvents()).toEqual([]);

    vi.mocked(idbGet).mockRejectedValueOnce(new Error("IDB error"));
    expect(await loadEvents()).toEqual([]);
  });

  it("loadEvents returns stored events", async () => {
    const { idbSet } = await import("@/storage/idb");
    const event = ev({ id: "e1", turnId: "t1", kind: "chat" });
    await saveEvents([event]);
    expect(idbSet).toHaveBeenCalledWith(IDB_USAGE_EVENTS, [event]);
    expect(await loadEvents()).toEqual([event]);
  });
});
