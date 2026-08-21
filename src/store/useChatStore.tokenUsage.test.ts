import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Spec 060 — política RAG en send() (fresco vs stale), skip, checkStale fail-open
 * y evento de uso CA-07.4 cuando el agente falla sin rondas.
 */

const ragContextCalls = vi.hoisted(() => vi.fn());
const agentCalls = vi.hoisted(() => vi.fn());
const agentResult = vi.hoisted(() => ({
  current: {
    history: [] as unknown[],
    roundsExceeded: false,
    rounds: 1,
    usages: [] as unknown[],
    error: undefined as string | undefined,
  },
}));

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
    return Promise.resolve({ ...agentResult.current });
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
import { useAiUsageStore } from "./useAiUsageStore";

const LONG_TEXT = "Dame un análisis detallado del portafolio";

beforeEach(async () => {
  vi.clearAllMocks();
  ragState.status = "up-to-date";
  ragState.meta = { entityCount: 10, lastIndexedAt: "2026-08-20T00:00:00.000Z" };
  agentResult.current = {
    history: [],
    roundsExceeded: false,
    rounds: 1,
    usages: [],
    error: undefined,
  };
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
  useAiUsageStore.setState({
    events: [],
    session: { requests: 0, inputTokens: 0, outputTokens: 0 },
    lastTurn: null,
    includeEstimated: true,
    loaded: false,
  });
});

describe("useChatStore.send — política RAG y usage (spec 060)", () => {
  it("status partial + texto largo no llama a buildRagContext; el agente sí corre (CA-02.3)", async () => {
    ragState.status = "partial";

    await useChatStore.getState().send(LONG_TEXT);

    expect(ragContextCalls).not.toHaveBeenCalled();
    expect(agentCalls).toHaveBeenCalledTimes(1);
  });

  it('up-to-date + "sí" no llama a buildRagContext (050 + D9)', async () => {
    await useChatStore.getState().send("sí");

    expect(ragContextCalls).not.toHaveBeenCalled();
    expect(agentCalls).toHaveBeenCalledTimes(1);
  });

  it("up-to-date + texto largo SÍ llama a buildRagContext", async () => {
    await useChatStore.getState().send(LONG_TEXT);

    expect(ragContextCalls).toHaveBeenCalledTimes(1);
    expect(agentCalls).toHaveBeenCalledTimes(1);
  });

  it("checkStale rechaza: no llama a buildRagContext y el agente corre (CA-07.2)", async () => {
    ragState.checkStale.mockRejectedValueOnce(new Error("stale check failed"));

    await useChatStore.getState().send(LONG_TEXT);

    expect(ragContextCalls).not.toHaveBeenCalled();
    expect(agentCalls).toHaveBeenCalledTimes(1);
    expect(useChatStore.getState().status).toBe("idle");
  });

  it("agente error con rounds 0 registra evento chat requests: 1 (CA-07.4)", async () => {
    agentResult.current = {
      history: [],
      roundsExceeded: false,
      rounds: 0,
      usages: [],
      error: "unknown",
    };

    await useChatStore.getState().send(LONG_TEXT);

    const chatEvents = useAiUsageStore.getState().events.filter((e) => e.kind === "chat");
    expect(chatEvents).toHaveLength(1);
    expect(chatEvents[0]?.requests).toBe(1);
    expect(chatEvents[0]?.usage).toEqual({
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
      source: "estimated",
    });
  });
});
