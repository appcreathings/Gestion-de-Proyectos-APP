import { describe, expect, it } from "vitest";
import type { AiMessage } from "../types";
import { fromGeminiContents, toGeminiContents } from "./mapping";

describe("Gemini history mapping", () => {
  it("user / assistant / tool round-trip roughly", () => {
    const history: AiMessage[] = [
      { role: "user", content: "hola" },
      {
        role: "assistant",
        content: "listo",
        toolCalls: [{ id: "c1", name: "list_projects", args: { q: "a" } }],
      },
      {
        role: "tool",
        toolCallId: "c1",
        name: "list_projects",
        result: { output: [] },
      },
    ];
    const contents = toGeminiContents(history);
    expect(contents[0].role).toBe("user");
    expect(contents[1].role).toBe("model");
    expect(contents[2].role).toBe("user");
    const back = fromGeminiContents(contents);
    expect(back[0]).toEqual({ role: "user", content: "hola" });
    expect(back[1].role).toBe("assistant");
    expect(back[2].role).toBe("tool");
  });

  it("fromGeminiContents convierte snapshot viejo con parts", () => {
    const old = [
      { role: "user", parts: [{ text: "hi" }] },
      { role: "model", parts: [{ text: "hey" }] },
    ];
    const msgs = fromGeminiContents(old);
    expect(msgs).toEqual([
      { role: "user", content: "hi" },
      { role: "assistant", content: "hey" },
    ]);
  });
});
