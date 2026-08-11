import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { AiErrorKind } from "@/ai/gemini/errors";
import type { AiProvider, StreamTurnResult } from "@/ai/providers/types";
import { rateLimiter } from "@/ai/rateLimiter";
import { runAgentTurn, type AgentTurnOptions } from "./runAgentTurn";

const originalOnLine = navigator.onLine;
function forceOnline(on: boolean) {
  Object.defineProperty(navigator, "onLine", {
    value: on,
    configurable: true,
    writable: true,
  });
}

const FLASH_MODELS = [
  "gemini:gemini-2.5-flash",
  "gemini:gemini-2.5-flash-lite",
  "gemini:gemini-3-flash",
  "gemini:gemini-3.5-flash",
];

type Behavior =
  | { kind: "rate-limit" }
  | { kind: "project-quota-zero" }
  | { kind: "ok-text"; text?: string }
  | { kind: "ok-tools"; text?: string; toolCalls: StreamTurnResult["toolCalls"] };

function makeFakeProvider(sequence: Behavior[]): {
  provider: AiProvider;
  streamCalls: () => number;
} {
  let i = 0;
  let streams = 0;
  const provider: AiProvider = {
    id: "gemini",
    validateKey: async () => ({ ok: true }),
    classifyError: (e) => {
      if (e instanceof Error && e.message === "rate-limit") return "rate-limit";
      if (e instanceof Error && e.message === "project-quota-zero") return "project-quota-zero";
      return "unknown";
    },
    streamTurn: async (opts) => {
      streams++;
      if (i >= sequence.length) {
        throw new Error(`streamTurn extra call #${i + 1}`);
      }
      const b = sequence[i++];
      if (b.kind === "rate-limit") throw new Error("rate-limit");
      if (b.kind === "project-quota-zero") throw new Error("project-quota-zero");
      if (b.kind === "ok-tools") {
        if (b.text) opts.onTextDelta(b.text);
        return { text: b.text ?? "", toolCalls: b.toolCalls };
      }
      const text = b.text ?? "Hola";
      opts.onTextDelta(text);
      return { text, toolCalls: [] };
    },
  };
  return { provider, streamCalls: () => streams };
}

function baseOpts(
  provider: AiProvider,
  overrides: Partial<AgentTurnOptions> = {},
): AgentTurnOptions {
  return {
    provider,
    apiKey: "test-key",
    preferredModel: "gemini:gemini-2.5-flash",
    autoFallback: true,
    fallbackGroup: "gemini:flash",
    confirmWrites: false,
    tools: [],
    systemInstruction: "",
    history: [],
    userMessage: "hola",
    callbacks: {
      onTextDelta: () => undefined,
      onToolCallStart: () => undefined,
      onToolCallEnd: () => undefined,
      onConfirmWrite: () => Promise.resolve(true),
    },
    ...overrides,
  };
}

beforeEach(() => {
  forceOnline(true);
  for (const id of FLASH_MODELS) {
    rateLimiter.markSaturated(id, 0);
    rateLimiter.canMakeRequest(id);
  }
});
afterEach(() => forceOnline(originalOnLine));

describe("runAgentTurn — bucle de fallback real (spec 031, provider-agnóstico)", () => {
  it("T3123: recorre los 4 modelos del grupo flash antes de devolver all-models-exhausted", async () => {
    const { provider, streamCalls } = makeFakeProvider([
      { kind: "rate-limit" },
      { kind: "rate-limit" },
      { kind: "rate-limit" },
      { kind: "rate-limit" },
    ]);
    const result = await runAgentTurn(baseOpts(provider));
    expect(result.error).toBe("all-models-exhausted");
    expect(result.roundsExceeded).toBe(false);
    expect(streamCalls()).toBe(4);
  });

  it("T3123 (variante): 3 fallos + éxito en el 4º modelo no reporta error", async () => {
    const deltas: string[] = [];
    const { provider, streamCalls } = makeFakeProvider([
      { kind: "rate-limit" },
      { kind: "rate-limit" },
      { kind: "rate-limit" },
      { kind: "ok-text", text: "respuesta del 4º modelo" },
    ]);
    const result = await runAgentTurn(
      baseOpts(provider, {
        callbacks: {
          onTextDelta: (t) => deltas.push(t),
          onToolCallStart: () => undefined,
          onToolCallEnd: () => undefined,
          onConfirmWrite: () => Promise.resolve(true),
        },
      }),
    );
    expect(result.error).toBeUndefined();
    expect(streamCalls()).toBe(4);
    expect(deltas.join("")).toBe("respuesta del 4º modelo");
  });

  it("T3124: project-quota-zero corta el bucle en el primer intento", async () => {
    const { provider, streamCalls } = makeFakeProvider([{ kind: "project-quota-zero" }]);
    const result = await runAgentTurn(baseOpts(provider));
    expect(result.error).toBe("project-quota-zero");
    expect(streamCalls()).toBe(1);
  });

  it("T3124 (variante): project-quota-zero NO dispara onModelSwitch", async () => {
    const switches: unknown[] = [];
    const { provider } = makeFakeProvider([{ kind: "project-quota-zero" }]);
    await runAgentTurn(
      baseOpts(provider, {
        callbacks: {
          onTextDelta: () => undefined,
          onToolCallStart: () => undefined,
          onToolCallEnd: () => undefined,
          onConfirmWrite: () => Promise.resolve(true),
          onModelSwitch: (ev) => switches.push(ev),
        },
      }),
    );
    expect(switches).toHaveLength(0);
  });

  it("T3125: camino feliz sin errores", async () => {
    const deltas: string[] = [];
    const { provider } = makeFakeProvider([{ kind: "ok-text", text: "hola desde gemini" }]);
    const result = await runAgentTurn(
      baseOpts(provider, {
        callbacks: {
          onTextDelta: (t) => deltas.push(t),
          onToolCallStart: () => undefined,
          onToolCallEnd: () => undefined,
          onConfirmWrite: () => Promise.resolve(true),
        },
      }),
    );
    expect(result.error).toBeUndefined();
    expect(result.roundsExceeded).toBe(false);
    expect(deltas.join("")).toBe("hola desde gemini");
    expect(result.history.some((m) => m.role === "assistant")).toBe(true);
  });

  it("T3125: éxito tras un solo fallback", async () => {
    const switches: { from: string; to: string }[] = [];
    const { provider, streamCalls } = makeFakeProvider([
      { kind: "rate-limit" },
      { kind: "ok-text", text: "ok" },
    ]);
    const result = await runAgentTurn(
      baseOpts(provider, {
        callbacks: {
          onTextDelta: () => undefined,
          onToolCallStart: () => undefined,
          onToolCallEnd: () => undefined,
          onConfirmWrite: () => Promise.resolve(true),
          onModelSwitch: (ev) => switches.push({ from: ev.from, to: ev.to }),
        },
      }),
    );
    expect(result.error).toBeUndefined();
    expect(streamCalls()).toBe(2);
    expect(switches).toHaveLength(1);
    expect(switches[0].from).toBe("gemini:gemini-2.5-flash");
  });

  it("T3121: project-quota-zero tras rate-limit corta sin más intentos", async () => {
    const { provider, streamCalls } = makeFakeProvider([
      { kind: "rate-limit" },
      { kind: "project-quota-zero" },
    ]);
    const result = await runAgentTurn(baseOpts(provider));
    expect(result.error).toBe("project-quota-zero");
    expect(streamCalls()).toBe(2);
  });

  it("autoFallback=false: rate-limit se reporta sin otro modelo", async () => {
    const { provider, streamCalls } = makeFakeProvider([{ kind: "rate-limit" }]);
    const result = await runAgentTurn(baseOpts(provider, { autoFallback: false }));
    expect(result.error).toBe("rate-limit" satisfies AiErrorKind);
    expect(streamCalls()).toBe(1);
  });

  it("tool call + confirmación de escritura cancelada", async () => {
    const { z } = await import("zod");
    const { defineTool } = await import("@/ai/tools/types");
    const tool = defineTool({
      name: "create_project",
      description: "crea",
      mode: "write",
      input: z.object({ name: z.string() }),
      execute: async () => ({ id: "p1" }),
      describeCall: (a) => `Crear proyecto ${a.name}`,
    });
    const { provider } = makeFakeProvider([
      {
        kind: "ok-tools",
        text: "",
        toolCalls: [{ id: "c1", name: "create_project", args: { name: "X" } }],
      },
      { kind: "ok-text", text: "cancelado ok" },
    ]);
    const ends: string[] = [];
    const result = await runAgentTurn(
      baseOpts(provider, {
        confirmWrites: true,
        tools: [tool],
        callbacks: {
          onTextDelta: () => undefined,
          onToolCallStart: () => undefined,
          onToolCallEnd: (_c, o) => ends.push(o.status),
          onConfirmWrite: async () => false,
        },
      }),
    );
    expect(ends).toContain("cancelled");
    expect(result.error).toBeUndefined();
  });
});
