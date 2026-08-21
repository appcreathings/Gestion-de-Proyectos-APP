import { describe, expect, it } from "vitest";
import type { UsageEvent } from "./types";
import { buildExportPayload } from "./export";

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

describe("buildExportPayload", () => {
  it("returns exportedAt and events with no apiKey field", () => {
    const events = [ev({ id: "e1", turnId: "t1", kind: "chat" })];
    const exportedAt = "2026-08-20T12:00:00.000Z";
    const payload = buildExportPayload(events, exportedAt);

    expect(payload.exportedAt).toBe(exportedAt);
    expect(payload.events).toEqual(events);
    expect(payload).not.toHaveProperty("apiKey");
    expect(JSON.stringify(payload)).not.toMatch(/apiKey/i);
  });
});
