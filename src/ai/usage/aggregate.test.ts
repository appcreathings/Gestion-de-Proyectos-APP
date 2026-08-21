import { describe, expect, it } from "vitest";
import type { UsageEvent } from "./types";
import { aggregateDay, aggregateTurn, localDateKey } from "./aggregate";

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

describe("aggregateTurn", () => {
  it("sums requests/tokens, takes rounds from chat, estimated if any", () => {
    const rag = {
      attempted: true,
      injected: true,
      indexFocused: false,
      hits: 3,
    };
    const chat = ev({
      id: "c1",
      turnId: "turn-1",
      kind: "chat",
      rounds: 2,
      requests: 2,
      usage: { inputTokens: 100, outputTokens: 20, totalTokens: 120, source: "estimated" },
      rag,
    });
    const embedding = ev({
      id: "e1",
      turnId: "turn-1",
      kind: "embedding",
      requests: 1,
      modelId: "gemini:text-embedding-004",
      usage: { inputTokens: 50, outputTokens: 0, totalTokens: 50, source: "provider" },
    });
    const other = ev({
      id: "other",
      turnId: "turn-other",
      kind: "chat",
      rounds: 9,
      requests: 9,
    });

    expect(aggregateTurn([chat, embedding, other], "missing")).toBeNull();

    const view = aggregateTurn([chat, embedding, other], "turn-1");
    expect(view).toEqual({
      turnId: "turn-1",
      requests: 3,
      rounds: 2,
      inputTokens: 150,
      outputTokens: 20,
      totalTokens: 170,
      estimated: true,
      rag,
    });
  });

  it("uses rounds 0 when chat has no rounds", () => {
    const chat = ev({ id: "c", turnId: "t", kind: "chat", requests: 1 });
    expect(aggregateTurn([chat], "t")?.rounds).toBe(0);
  });
});

describe("aggregateDay", () => {
  it("filters by local day and optionally drops estimated", () => {
    const noonLocal = new Date(2026, 7, 20, 12, 0, 0);
    const day = localDateKey(noonLocal);
    const onDay = ev({
      id: "d1",
      turnId: "t1",
      kind: "chat",
      ts: noonLocal.toISOString(),
      modelId: "gemini:flash",
      requests: 2,
      usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15, source: "provider" },
    });
    const estimated = ev({
      id: "d2",
      turnId: "t2",
      kind: "chat",
      ts: new Date(2026, 7, 20, 18, 0, 0).toISOString(),
      modelId: "gemini:pro",
      requests: 1,
      usage: { inputTokens: 40, outputTokens: 10, totalTokens: 50, source: "estimated" },
    });
    const otherDay = ev({
      id: "d3",
      turnId: "t3",
      kind: "chat",
      ts: new Date(2026, 7, 19, 12, 0, 0).toISOString(),
      requests: 99,
      usage: { inputTokens: 99, outputTokens: 99, totalTokens: 198, source: "provider" },
    });

    const withEstimated = aggregateDay([onDay, estimated, otherDay], day, true);
    expect(withEstimated).toEqual({
      requests: 3,
      inputTokens: 50,
      outputTokens: 15,
      byModel: {
        "gemini:flash": { requests: 2, inputTokens: 10, outputTokens: 5 },
        "gemini:pro": { requests: 1, inputTokens: 40, outputTokens: 10 },
      },
    });

    const withoutEstimated = aggregateDay([onDay, estimated, otherDay], day, false);
    expect(withoutEstimated).toEqual({
      requests: 2,
      inputTokens: 10,
      outputTokens: 5,
      byModel: {
        "gemini:flash": { requests: 2, inputTokens: 10, outputTokens: 5 },
      },
    });
  });
});
