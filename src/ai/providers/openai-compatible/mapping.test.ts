import { describe, expect, it } from "vitest";
import type { AiMessage } from "../types";
import {
  accumulateToolCallDelta,
  createToolCallAccumulator,
  finalizeToolCalls,
  parseOpenAiChunk,
  toOpenAiMessages,
} from "./mapping";

describe("toOpenAiMessages", () => {
  it("traduce user / assistant / tool ida", () => {
    const history: AiMessage[] = [
      { role: "user", content: "hola" },
      {
        role: "assistant",
        content: "voy a listar",
        toolCalls: [{ id: "c1", name: "list_projects", args: { q: "x" } }],
      },
      { role: "tool", toolCallId: "c1", name: "list_projects", result: [{ id: "p1" }] },
    ];
    const msgs = toOpenAiMessages(history, "sys");
    expect(msgs[0]).toEqual({ role: "system", content: "sys" });
    expect(msgs[1]).toEqual({ role: "user", content: "hola" });
    expect(msgs[2]).toMatchObject({
      role: "assistant",
      content: "voy a listar",
      tool_calls: [
        {
          id: "c1",
          type: "function",
          function: { name: "list_projects", arguments: '{"q":"x"}' },
        },
      ],
    });
    expect(msgs[3]).toEqual({
      role: "tool",
      tool_call_id: "c1",
      content: JSON.stringify([{ id: "p1" }]),
    });
  });
});

describe("tool_calls accumulation by index", () => {
  it("acumula name en el primer delta y arguments en pedazos", () => {
    const acc = createToolCallAccumulator();
    accumulateToolCallDelta(acc, [
      { index: 0, id: "call_abc", function: { name: "list_projects", arguments: "" } },
    ]);
    accumulateToolCallDelta(acc, [
      { index: 0, function: { arguments: '{"lim' } },
    ]);
    accumulateToolCallDelta(acc, [
      { index: 0, function: { arguments: 'it":5}' } },
    ]);
    const calls = finalizeToolCalls(acc);
    expect(calls).toEqual([
      { id: "call_abc", name: "list_projects", args: { limit: 5 } },
    ]);
  });

  it("marca la tool-call con argsError cuando el JSON no parsea", () => {
    const acc = createToolCallAccumulator();
    accumulateToolCallDelta(acc, [
      { index: 0, id: "x", function: { name: "foo", arguments: "{not-json" } },
    ]);
    expect(finalizeToolCalls(acc)).toEqual([
      {
        id: "x",
        name: "foo",
        args: {},
        argsError: "el JSON de arguments no parsea",
      },
    ]);
  });

  it("soporta dos tool_calls en paralelo por index", () => {
    const acc = createToolCallAccumulator();
    accumulateToolCallDelta(acc, [
      { index: 0, id: "a", function: { name: "one", arguments: "{}" } },
      { index: 1, id: "b", function: { name: "two", arguments: '{"n":1}' } },
    ]);
    expect(finalizeToolCalls(acc)).toEqual([
      { id: "a", name: "one", args: {} },
      { id: "b", name: "two", args: { n: 1 } },
    ]);
  });
});

describe("parseOpenAiChunk", () => {
  it("extrae delta de un chunk válido", () => {
    const delta = parseOpenAiChunk(
      JSON.stringify({ choices: [{ delta: { content: "hi" } }] }),
    );
    expect(delta).toEqual({ content: "hi" });
  });

  it("usa reasoning_content cuando content viene vacío (OpenCode free)", () => {
    const delta = parseOpenAiChunk(
      JSON.stringify({
        choices: [{ delta: { content: null, reasoning_content: "Hola" } }],
      }),
    );
    expect(delta).toEqual({ content: "Hola" });
  });

  it("prioriza content sobre reasoning_content", () => {
    const delta = parseOpenAiChunk(
      JSON.stringify({
        choices: [{ delta: { content: "respuesta", reasoning_content: "pienso…" } }],
      }),
    );
    expect(delta).toEqual({ content: "respuesta" });
  });

  it("devuelve null si el JSON está roto", () => {
    expect(parseOpenAiChunk("{")).toBeNull();
  });
});
