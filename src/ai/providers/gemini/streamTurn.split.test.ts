import { describe, expect, it } from "vitest";
import type { AiMessage } from "../types";
import { splitForChat } from "./streamTurn";

describe("splitForChat", () => {
  it("último mensaje user → prior sin él y message = content", () => {
    const history: AiMessage[] = [
      { role: "user", content: "hola" },
      { role: "assistant", content: "qué tal" },
      { role: "user", content: "listá proyectos" },
    ];
    const { prior, message } = splitForChat(history);
    expect(prior).toEqual([
      { role: "user", content: "hola" },
      { role: "assistant", content: "qué tal" },
    ]);
    expect(message).toBe("listá proyectos");
  });

  it("cola de tools → prior hasta el assistant y message = functionResponse parts", () => {
    const history: AiMessage[] = [
      { role: "user", content: "listá" },
      {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "c1", name: "list_projects", args: {} }],
      },
      {
        role: "tool",
        toolCallId: "c1",
        name: "list_projects",
        result: { output: [] },
      },
    ];
    const { prior, message } = splitForChat(history);
    expect(prior).toEqual([
      { role: "user", content: "listá" },
      {
        role: "assistant",
        content: "",
        toolCalls: [{ id: "c1", name: "list_projects", args: {} }],
      },
    ]);
    expect(Array.isArray(message)).toBe(true);
    const parts = message as Array<Record<string, unknown>>;
    expect(parts[0]).toMatchObject({
      functionResponse: {
        id: "c1",
        name: "list_projects",
      },
    });
  });

  it("historial vacío → prior vacío y message vacío", () => {
    const { prior, message } = splitForChat([]);
    expect(prior).toEqual([]);
    expect(message).toBe("");
  });
});
