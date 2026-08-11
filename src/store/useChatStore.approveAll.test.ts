import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Spec 048 HU-03 / C7 — "Aprobar todo" auto-approves the rest of the current
 * turn only; a subsequent send() asks for confirmation again.
 */

const agentCalls = vi.hoisted(() => vi.fn());
const confirmResults = vi.hoisted(() => [] as boolean[]);

vi.mock("@/ai/gemini/systemPrompt", () => ({
  buildRagContext: async () => "",
  buildSystemPrompt: () => "system prompt",
}));

vi.mock("@/ai/agent/runAgentTurn", () => ({
  runAgentTurn: async (opts: {
    signal?: AbortSignal;
    callbacks: {
      onConfirmWrite: (
        call: { id: string; name: string; args: Record<string, unknown> },
        description: string,
      ) => Promise<boolean>;
    };
  }) => {
    agentCalls(opts);
    const n = agentCalls.mock.calls.length;
    if (n === 1) {
      // First turn: two sequential write confirmations (unless aborted mid-turn)
      const r1 = await opts.callbacks.onConfirmWrite(
        { id: "w1", name: "createTask", args: {} },
        "crear tarea 1",
      );
      confirmResults.push(r1);
      if (opts.signal?.aborted) {
        return { history: [], roundsExceeded: false, error: "aborted" as const };
      }
      const r2 = await opts.callbacks.onConfirmWrite(
        { id: "w2", name: "createTask", args: {} },
        "crear tarea 2",
      );
      confirmResults.push(r2);
    } else {
      // Later turns: one confirmation (should require card again after flag reset)
      const r3 = await opts.callbacks.onConfirmWrite(
        { id: "w3", name: "createTask", args: {} },
        "crear tarea 3",
      );
      confirmResults.push(r3);
    }
    return { history: [], roundsExceeded: false };
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

import { useChatStore } from "./useChatStore";
import { useAiConfigStore } from "./useAiConfigStore";
import { useAppStore } from "./useAppStore";

function pendingWrites() {
  return useChatStore
    .getState()
    .messages.flatMap((m) => m.parts)
    .filter((p) => p.kind === "pendingWrite");
}

function waitUntil(pred: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (pred()) return resolve();
      if (Date.now() - start > timeoutMs) {
        return reject(new Error("waitUntil timed out"));
      }
      setTimeout(tick, 5);
    };
    tick();
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  confirmResults.length = 0;
  useChatStore.setState({
    messages: [],
    status: "idle",
    error: null,
    errorDetail: null,
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
      confirmWrites: true,
      ragEnabled: false,
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
  useAppStore.setState({ workspace: { projects: [], products: [] } } as never);
});

describe("approveAll (spec 048 HU-03)", () => {
  it("auto-approves remaining writes of the same turn, then asks again on next send", async () => {
    const firstSend = useChatStore.getState().send("creá 2 tareas");

    await waitUntil(() => pendingWrites().some((p) => p.id === "w1"));
    expect(useChatStore.getState().status).toBe("awaiting-confirmation");
    expect(pendingWrites()).toHaveLength(1);

    useChatStore.getState().approveAll("w1");

    await firstSend;

    // First write approved via approveAll; second auto-approved without a card.
    expect(confirmResults).toEqual([true, true]);
    expect(pendingWrites()).toHaveLength(0);
    expect(useChatStore.getState().status).toBe("idle");

    // New user message resets the flag — next write must ask again.
    const secondSend = useChatStore.getState().send("otra más");
    await waitUntil(() => pendingWrites().some((p) => p.id === "w3"));
    expect(useChatStore.getState().status).toBe("awaiting-confirmation");
    expect(pendingWrites()).toHaveLength(1);
    expect(pendingWrites()[0]?.id).toBe("w3");

    useChatStore.getState().approvePendingWrite("w3", true);
    await secondSend;

    expect(confirmResults).toEqual([true, true, true]);
    expect(pendingWrites()).toHaveLength(0);
  });

  it("stop() cancels pending confirmation and a later turn asks again (CA-03.6)", async () => {
    const firstSend = useChatStore.getState().send("creá tareas");

    await waitUntil(() => pendingWrites().some((p) => p.id === "w1"));
    // Stop without approving — rejects the pending resolver and clears auto-approve flag.
    useChatStore.getState().stop();
    await firstSend;

    expect(confirmResults[0]).toBe(false);

    const secondSend = useChatStore.getState().send("otra");
    await waitUntil(() => pendingWrites().some((p) => p.id === "w3"));
    expect(useChatStore.getState().status).toBe("awaiting-confirmation");
    // Flag was cleared by stop + reset again at send() — confirmation required.
    useChatStore.getState().approvePendingWrite("w3", true);
    await secondSend;
    expect(confirmResults.at(-1)).toBe(true);
  });
});
