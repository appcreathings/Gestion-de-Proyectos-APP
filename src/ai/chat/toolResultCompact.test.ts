import { describe, expect, it } from "vitest";
import type { AiMessage } from "@/ai/providers/types";
import { compactToolResults } from "./toolResultCompact";

describe("compactToolResults (CA-04)", () => {
  it("returns the same array when nothing exceeds the cap", () => {
    const history: AiMessage[] = [
      { role: "user", content: "x" },
      { role: "tool", toolCallId: "c1", name: "list_projects", result: { ok: true } },
    ];
    expect(compactToolResults(history, 4000)).toBe(history);
  });

  it("truncates large tool results and leaves user/assistant intact", () => {
    const big = "a".repeat(50);
    const history: AiMessage[] = [
      { role: "user", content: "x" },
      { role: "assistant", content: "y" },
      { role: "tool", toolCallId: "c1", name: "get_project", result: { blob: big } },
    ];
    const out = compactToolResults(history, 20);
    expect(out).not.toBe(history);
    expect(out[0]).toBe(history[0]);
    expect(out[1]).toBe(history[1]);
    expect(out[2]).toMatchObject({
      role: "tool",
      result: { truncated: true, name: "get_project" },
    });
    const preview = (out[2] as { result: { preview: string } }).result.preview;
    expect(preview.length).toBe(20);
  });
});
