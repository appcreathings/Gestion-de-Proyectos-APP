import { describe, expect, it } from "vitest";
import type { UsageEvent } from "./types";
import { pruneEvents, USAGE_MAX_EVENTS } from "./prune";

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

describe("pruneEvents", () => {
  it("drops events older than 14 days and caps at USAGE_MAX_EVENTS keeping newest", () => {
    const now = Date.UTC(2026, 7, 20, 12, 0, 0);
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

    const pruned = pruneEvents([current, stale, ...recent], now);

    expect(pruned.some((e) => e.id === "stale")).toBe(false);
    expect(pruned).toHaveLength(USAGE_MAX_EVENTS);
    expect(pruned[pruned.length - 1]?.id).toBe("now");
    expect(pruned.every((e) => e.id !== "stale")).toBe(true);
  });
});
