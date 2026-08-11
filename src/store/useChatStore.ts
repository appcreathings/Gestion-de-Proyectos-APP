import { create } from "zustand";
import { uuid } from "@/lib/utils";
import { runAgentTurn, type ToolCallView } from "@/ai/agent/runAgentTurn";
import { buildSystemPrompt, buildRagContext } from "@/ai/gemini/systemPrompt";
import type { AiErrorKind } from "@/ai/gemini/errors";
import type { AiMessage } from "@/ai/providers/types";
import { getProvider } from "@/ai/providers";
import {
  fromGeminiContents,
  looksLikeGeminiHistory,
  looksLikeNeutralHistory,
} from "@/ai/providers/gemini";
import { createBoundTools } from "@/ai/tools";
import { idbDel, idbGet, idbSet } from "@/storage/idb";
import {
  activeBaseUrl,
  activeKey,
  activeProviderId,
  geminiKey,
} from "@/ai/config";
import { splitQualified } from "@/ai/models";
import { useAppStore } from "./useAppStore";
import { useAiConfigStore } from "./useAiConfigStore";

export type ChatPart =
  | { kind: "text"; text: string }
  | {
      kind: "toolCall";
      id: string;
      name: string;
      args: Record<string, unknown>;
      status: "running" | "ok" | "error" | "cancelled";
      result?: unknown;
      error?: string;
    }
  | { kind: "pendingWrite"; id: string; name: string; description: string };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  parts: ChatPart[];
}

export type ChatStatus = "idle" | "streaming" | "awaiting-confirmation" | "error";

interface ChatState {
  open: boolean;
  messages: ChatMessage[];
  status: ChatStatus;
  error: AiErrorKind | null;
  /** Mensaje crudo del SDK (ApiError.message) del último error, para el detalle técnico
   * colapsable en el AssistantPanel. Vive solo en la sesión de React (Principio I). spec 031 §6. */
  errorDetail: string | null;
  hydrated: boolean;

  toggleOpen: (v?: boolean) => void;
  send: (text: string) => Promise<void>;
  stop: () => void;
  approvePendingWrite: (id: string, approved: boolean) => void;
  /** Approve current write + auto-approve remaining writes of this turn only (spec 048 HU-03). */
  approveAll: (id: string) => void;
  newConversation: () => Promise<void>;
  hydrateFromIdb: () => Promise<void>;
}

/** Device-local snapshot of the last conversation (never in the workspace). */
const IDB_KEY = "aiChat:last";
const MAX_PERSISTED_MESSAGES = 50;

/** Desktop assistant panel width (px). Shared so TaskDetailDrawer can sit side-by-side (spec 048 HU-02). */
export const ASSISTANT_PANEL_WIDTH = 400;

/** Neutral history for the next turn (D2). */
let agentHistory: AiMessage[] = [];
let abortController: AbortController | null = null;
const pendingResolvers = new Map<string, (approved: boolean) => void>();
/** Turn-scoped auto-approval for remaining write tool calls (spec 048 HU-03 / D7). */
let autoApproveRestOfTurn = false;

const OPEN_KEY = "assistant.open";

export const useChatStore = create<ChatState>((set, get) => ({
  open: typeof localStorage !== "undefined" && localStorage.getItem(OPEN_KEY) === "1",
  messages: [],
  status: "idle",
  error: null,
  errorDetail: null,
  hydrated: false,

  toggleOpen(v) {
    const open = v ?? !get().open;
    localStorage.setItem(OPEN_KEY, open ? "1" : "0");
    set({ open });
  },

  async hydrateFromIdb() {
    try {
      const snap = await idbGet<{ messages: ChatMessage[]; history: unknown }>(IDB_KEY);
      if (snap) {
        agentHistory = normalizeHistory(snap.history);
        set({ messages: snap.messages ?? [] });
      }
    } catch {
      // best-effort: chat history is disposable
    }
    set({ hydrated: true });
  },

  async send(text) {
    const trimmed = text.trim();
    if (!trimmed || get().status === "streaming") return;
    const { config } = useAiConfigStore.getState();
    const apiKey = activeKey(config);
    if (!apiKey) return;

    const assistantId = uuid();
    set({
      status: "streaming",
      error: null,
      errorDetail: null,
      messages: [
        ...get().messages,
        { id: uuid(), role: "user", parts: [{ kind: "text", text: trimmed }] },
        { id: assistantId, role: "assistant", parts: [] },
      ],
    });

    abortController = new AbortController();
    autoApproveRestOfTurn = false;

    const patchAssistant = (fn: (parts: ChatPart[]) => ChatPart[]) => {
      set({
        messages: get().messages.map((m) =>
          m.id === assistantId ? { ...m, parts: fn(m.parts) } : m,
        ),
      });
    };
    const patchToolCall = (id: string, patch: Partial<ChatPart & { kind: "toolCall" }>) =>
      patchAssistant((parts) =>
        parts.map((p) =>
          p.kind === "toolCall" && p.id === id ? { ...p, ...patch } : p,
        ),
      );

    // RAG es una mejora opcional: si falla (cuota, red, embeddings, lo que sea), el turno del
    // agente continúa sin contexto semántico (spec 031 §4). Mismo patrón best-effort que
    // `hydrateFromIdb`/`persistSnapshot` en este archivo.
    const gKey = geminiKey(config);
    const ragContext =
      config.ragEnabled && gKey
        ? await buildRagContext(trimmed, gKey).catch(() => "")
        : "";

    const providerId = activeProviderId(config);
    const provider = await getProvider(providerId);

    const result = await runAgentTurn({
      provider,
      apiKey,
      baseUrl: activeBaseUrl(config),
      preferredModel: config.model,
      autoFallback: config.autoFallback,
      fallbackGroup: config.autoFallback ? config.fallbackGroup : undefined,
      confirmWrites: config.confirmWrites,
      tools: createBoundTools(),
      systemInstruction: buildSystemPrompt(useAppStore.getState().workspace, ragContext),
      history: agentHistory,
      userMessage: trimmed,
      signal: abortController.signal,
      callbacks: {
        onTextDelta: (delta) =>
          patchAssistant((parts) => {
            const last = parts[parts.length - 1];
            if (last?.kind === "text") {
              return [...parts.slice(0, -1), { kind: "text", text: last.text + delta }];
            }
            return [...parts, { kind: "text", text: delta }];
          }),
        onToolCallStart: (call) =>
          patchAssistant((parts) => [
            ...parts,
            {
              kind: "toolCall",
              id: call.id,
              name: call.name,
              args: call.args,
              status: "running",
            },
          ]),
        onToolCallEnd: (call, outcome) => {
          const exists = get()
            .messages.find((m) => m.id === assistantId)
            ?.parts.some((p) => p.kind === "toolCall" && p.id === call.id);
          if (!exists) {
            patchAssistant((parts) => [
              ...parts,
              {
                kind: "toolCall",
                id: call.id,
                name: call.name,
                args: call.args,
                status: outcome.status,
                result: outcome.result,
                error: outcome.error,
              },
            ]);
            return;
          }
          patchToolCall(call.id, {
            status: outcome.status,
            result: outcome.result,
            error: outcome.error,
          });
        },
        onConfirmWrite: (call: ToolCallView, description: string) => {
          if (autoApproveRestOfTurn) return Promise.resolve(true);
          return new Promise<boolean>((resolve) => {
            pendingResolvers.set(call.id, resolve);
            set({ status: "awaiting-confirmation" });
            patchAssistant((parts) => [
              ...parts,
              { kind: "pendingWrite", id: call.id, name: call.name, description },
            ]);
          });
        },
        onModelSwitch: (event) => {
          const from = splitQualified(event.from).modelId;
          const to = splitQualified(event.to).modelId;
          patchAssistant((parts) => [
            ...parts,
            {
              kind: "text",
              text: `\n\n_🤖 Cambio automático: ${from} → ${to} (${event.reason === "saturated" ? "saturado" : "límite alcanzado"})_`,
            },
          ]);
        },
      },
    });

    abortController = null;
    agentHistory = result.history;

    if (result.roundsExceeded) {
      patchAssistant((parts) => [
        ...parts,
        {
          kind: "text",
          text: "\n\n_He alcanzado el límite de pasos de esta petición. Dime «continúa» si quieres que siga._",
        },
      ]);
    }

    set({
      status: result.error && result.error !== "aborted" ? "error" : "idle",
      error: result.error && result.error !== "aborted" ? result.error : null,
      errorDetail:
        result.error && result.error !== "aborted" && result.rawMessage
          ? result.rawMessage
          : null,
    });
    await persistSnapshot(get().messages);
  },

  stop() {
    autoApproveRestOfTurn = false;
    for (const [id, resolve] of pendingResolvers) {
      resolve(false);
      pendingResolvers.delete(id);
    }
    abortController?.abort();
  },

  approvePendingWrite(id, approved) {
    const resolve = pendingResolvers.get(id);
    if (!resolve) return;
    pendingResolvers.delete(id);
    set({
      status: "streaming",
      messages: get().messages.map((m) => ({
        ...m,
        parts: m.parts.filter((p) => !(p.kind === "pendingWrite" && p.id === id)),
      })),
    });
    resolve(approved);
  },

  approveAll(id) {
    autoApproveRestOfTurn = true;
    get().approvePendingWrite(id, true);
  },

  async newConversation() {
    get().stop(); // also resets autoApproveRestOfTurn
    agentHistory = [];
    set({ messages: [], status: "idle", error: null, errorDetail: null });
    await idbDel(IDB_KEY).catch(() => undefined);
  },
}));

function normalizeHistory(raw: unknown): AiMessage[] {
  try {
    if (looksLikeNeutralHistory(raw)) return raw;
    if (looksLikeGeminiHistory(raw)) return fromGeminiContents(raw);
  } catch {
    // corrupt snapshot → discard
  }
  return [];
}

async function persistSnapshot(messages: ChatMessage[]): Promise<void> {
  try {
    const trimmed = messages
      .slice(-MAX_PERSISTED_MESSAGES)
      .map((m) => ({
        ...m,
        parts: m.parts
          .filter((p) => p.kind !== "pendingWrite")
          .map((p) => (p.kind === "toolCall" ? { ...p, result: undefined } : p)),
      }));
    await idbSet(IDB_KEY, { messages: trimmed, history: agentHistory });
  } catch {
    // best-effort
  }
}
