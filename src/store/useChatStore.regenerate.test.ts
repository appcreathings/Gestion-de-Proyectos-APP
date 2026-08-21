import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Spec 050 — `regenerateLast()` y `skipRag` en `send()`.
 *
 * Mocks mínimos: `runAgentTurn` devuelve un history creciente por cada turno;
 * `buildRagContext` es un spy para verificar cuándo se invoca.
 */

const ragContextCalls = vi.hoisted(() => vi.fn());
const agentCalls = vi.hoisted(() => vi.fn());

const ragState = vi.hoisted(() => ({
  status: "up-to-date" as string,
  meta: { entityCount: 10, lastIndexedAt: "2026-08-20T00:00:00.000Z" },
  checkStale: vi.fn(async () => {}),
}));

vi.mock("@/store/useRagStore", () => ({
  useRagStore: Object.assign(() => ragState, { getState: () => ragState }),
}));

vi.mock("@/ai/gemini/systemPrompt", () => ({
  buildRagContext: async (...args: unknown[]) => {
    ragContextCalls(...args);
    return "";
  },
  buildRagContextDetailed: async (...args: unknown[]) => {
    ragContextCalls(...args);
    return { block: "", hits: 0, fromCache: true };
  },
  buildSystemPrompt: () => "system prompt",
}));

vi.mock("@/ai/agent/runAgentTurn", () => ({
  runAgentTurn: (...args: unknown[]) => {
    agentCalls(...args);
    // Devuelve el history que recibió + 2 mensajes (assistant vacío + text).
    const opts = args[0] as { history: unknown[]; userMessage: string };
    return Promise.resolve({
      history: [
        ...opts.history,
        { role: "user", content: opts.userMessage },
        { role: "assistant", content: "respuesta" },
      ],
      roundsExceeded: false,
      rounds: 1,
      usages: [],
    });
  },
}));

vi.mock("@/ai/providers", () => ({
  getProvider: async () => ({
    id: "gemini",
    validateKey: async () => ({ ok: true }),
    streamTurn: async () => ({ text: "", toolCalls: [] }),
    classifyError: () => "unknown",
  }),
}));

vi.mock("@/ai/tools", () => ({
  createBoundTools: () => [],
}));

vi.mock("@/storage/idb", () => ({
  idbGet: () => Promise.resolve(null),
  idbSet: () => Promise.resolve(),
  idbDel: () => Promise.resolve(),
}));

import { emptyWorkspace } from "@/domain/schemas";
import { useChatStore } from "./useChatStore";
import { useAiConfigStore } from "./useAiConfigStore";
import { useAppStore } from "./useAppStore";

beforeEach(async () => {
  vi.clearAllMocks();
  ragState.status = "up-to-date";
  ragState.meta = { entityCount: 10, lastIndexedAt: "2026-08-20T00:00:00.000Z" };
  // Reset del agentHistory del módulo (variable interna persistente entre tests).
  await useChatStore.getState().newConversation();
  useChatStore.setState({
    messages: [],
    status: "idle",
    error: null,
    open: true,
    hydrated: true,
  });
  useAiConfigStore.setState({
    config: {
      configVersion: 2,
      activeProvider: "gemini",
      providers: { gemini: { apiKey: "test-key" } },
      model: "gemini:gemini-2.5-flash",
      autoFallback: true,
      fallbackGroup: "gemini:flash",
      confirmWrites: false,
      ragEnabled: true,
    } as never,
    loaded: true,
    keyStatus: {
      gemini: "valid",
      openai: "unset",
      zai: "unset",
      nvidia: "unset",
      "opencode-zen": "unset",
    },
    lastError: null,
  });
  useAppStore.setState({ workspace: emptyWorkspace() });
});

describe("useChatStore.send — skipRag (spec 050 D7 / CA-06.1)", () => {
  it("una continuación corta ('sí') no llama a buildRagContext", async () => {
    await useChatStore.getState().send("sí");
    expect(ragContextCalls).not.toHaveBeenCalled();
    expect(agentCalls).toHaveBeenCalledTimes(1);
  });

  it("un slash expandido salta RAG (CA-03.5)", async () => {
    await useChatStore.getState().send("/resumen");
    expect(ragContextCalls).not.toHaveBeenCalled();
    expect(agentCalls).toHaveBeenCalledTimes(1);
  });

  it("un chip con skipRag:true no llama a buildRagContext", async () => {
    await useChatStore.getState().send("Resumen del día", { skipRag: true });
    expect(ragContextCalls).not.toHaveBeenCalled();
  });

  it("texto libre largo SÍ llama a buildRagContext (CA-06.5)", async () => {
    await useChatStore.getState().send("Dame un análisis detallado del portafolio");
    expect(ragContextCalls).toHaveBeenCalledTimes(1);
  });
});

describe("useChatStore.regenerateLast (spec 050 HU-05 / D14)", () => {
  it("no duplica el mensaje de usuario: tras regenerar hay 1 user + 1 assistant", async () => {
    await useChatStore.getState().send("dame un resumen del proyecto");
    const before = useChatStore.getState().messages;
    expect(before.filter((m) => m.role === "user")).toHaveLength(1);

    await useChatStore.getState().regenerateLast();
    const after = useChatStore.getState().messages;
    expect(after.filter((m) => m.role === "user")).toHaveLength(1);
    expect(after.filter((m) => m.role === "assistant")).toHaveLength(1);
    // El assistant es una burbuja nueva (no el mismo id).
    expect(after[after.length - 1].id).not.toBe(before[before.length - 1].id);
  });

  it("no opera durante streaming o awaiting-confirmation", async () => {
    useChatStore.setState({ status: "streaming" });
    await useChatStore.getState().regenerateLast();
    expect(agentCalls).not.toHaveBeenCalled();
  });

  it("recorta el agentHistory al snapshot previo al último turno", async () => {
    await useChatStore.getState().send("primera pregunta");
    // El mock devuelve history con 2 entradas (user + assistant).
    const agentCallsAfterFirst = agentCalls.mock.calls.length;
    expect(agentCallsAfterFirst).toBe(1);

    await useChatStore.getState().regenerateLast();
    // Se llamó de nuevo al agente (no skip), pero el history enviado debería
    // tener length 0 (recortado al snapshot previo al primer turno).
    const regenerateArgs = agentCalls.mock.calls[1][0] as { history: unknown[] };
    expect(regenerateArgs.history).toHaveLength(0);
  });
});
