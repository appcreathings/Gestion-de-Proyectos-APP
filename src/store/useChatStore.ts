import { create } from "zustand";
import { uuid } from "@/lib/utils";
import { runAgentTurn, type ToolCallView } from "@/ai/agent/runAgentTurn";
import { buildSystemPrompt, buildRagContextDetailed } from "@/ai/gemini/systemPrompt";
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
import { useAiUsageStore } from "./useAiUsageStore";
import { useDataStore } from "./useDataStore";
import { useRagStore } from "./useRagStore";
import { resolveUiContext, formatUiContextBlock } from "@/ai/chat/uiContext";
import { expandSlash } from "@/ai/chat/slashCommands";
import { shouldSkipRag } from "@/ai/chat/skipRag";
import { trimAgentHistory } from "@/ai/chat/historyWindow";
import { shouldFocusIndex, shouldAutoRag } from "@/ai/chat/ragPolicy";
import { selectWorkspaceIndex } from "@/ai/chat/workspaceIndex";
import { compactToolResults } from "@/ai/chat/toolResultCompact";
import { estimateTokensFromChars } from "@/ai/usage/parseUsage";
import type { RagSkipReason, TokenUsage, UsageEvent } from "@/ai/usage/types";
import type { RagStatus } from "@/ai/rag/types";
import type { Project } from "@/domain/schemas";

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
  /** Desktop panel width in px (device-local; ignored on mobile full-screen). */
  panelWidth: number;
  messages: ChatMessage[];
  status: ChatStatus;
  error: AiErrorKind | null;
  /** Mensaje crudo del SDK (ApiError.message) del último error, para el detalle técnico
   * colapsable en el AssistantPanel. Vive solo en la sesión de React (Principio I). spec 031 §6. */
  errorDetail: string | null;
  hydrated: boolean;

  toggleOpen: (v?: boolean) => void;
  /**
   * Clamp desktop assistant width (for resize handle + TaskDetailDrawer).
   * Pass `persist: false` while dragging; default persists to localStorage.
   */
  setPanelWidth: (width: number, opts?: { persist?: boolean }) => void;
  /**
   * Snapshot de la ruta actual de la app (spec 050 D1/B2). La actualiza
   * `AssistantPanel`/`AppLayout` desde `useLocation` — el store no puede usar
   * hooks de React Router directamente.
   */
  setChatRouteSnapshot: (route: { pathname: string; search: string }) => void;
  send: (text: string, opts?: { skipRag?: boolean; regenerate?: boolean }) => Promise<void>;
  /** Re-envía el último mensaje del usuario (limpia la respuesta previa). spec 050 HU-05. */
  regenerateLast: () => Promise<void>;
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

/** Default desktop assistant panel width (px). Shared with TaskDetailDrawer (spec 048 HU-02). */
export const ASSISTANT_PANEL_WIDTH = 400;
export const ASSISTANT_PANEL_MIN_WIDTH = 320;
export const ASSISTANT_PANEL_MAX_WIDTH = 800;

/** Neutral history for the next turn (D2). */
let agentHistory: AiMessage[] = [];
let abortController: AbortController | null = null;
const pendingResolvers = new Map<string, (approved: boolean) => void>();
/** Turn-scoped auto-approval for remaining write tool calls (spec 048 HU-03 / D7). */
let autoApproveRestOfTurn = false;

/**
 * Snapshot de la ruta actual para resolver el contexto de pantalla en `send`
 * (spec 050 D1, design §1.3). Variables de módulo — no requieren re-render.
 */
let chatRoute: { pathname: string; search: string } = { pathname: "/", search: "" };

/**
 * Para `regenerateLast` (spec 050 HU-05 / design §4.2). Longitud de
 * `agentHistory` justo antes de que `runAgentTurn` devuelva el nuevo history,
 * y texto del último user message — permiten recortar atómicamente al regenerar.
 */
let lastTurnHistoryLength = 0;
let lastTurnUserText: string | null = null;

const OPEN_KEY = "assistant.open";
const WIDTH_KEY = "assistant.panelWidth";

function clampPanelWidth(width: number): number {
  const n = Math.round(width);
  if (!Number.isFinite(n)) return ASSISTANT_PANEL_WIDTH;
  return Math.min(ASSISTANT_PANEL_MAX_WIDTH, Math.max(ASSISTANT_PANEL_MIN_WIDTH, n));
}

function readPanelWidth(): number {
  if (typeof localStorage === "undefined") return ASSISTANT_PANEL_WIDTH;
  try {
    const raw = localStorage.getItem(WIDTH_KEY);
    if (!raw) return ASSISTANT_PANEL_WIDTH;
    return clampPanelWidth(parseInt(raw, 10));
  } catch {
    return ASSISTANT_PANEL_WIDTH;
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  open: typeof localStorage !== "undefined" && localStorage.getItem(OPEN_KEY) === "1",
  panelWidth: readPanelWidth(),
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

  setPanelWidth(width, opts) {
    const panelWidth = clampPanelWidth(width);
    if (opts?.persist !== false) {
      try {
        localStorage.setItem(WIDTH_KEY, String(panelWidth));
      } catch {
        // best-effort: layout prefs are disposable
      }
    }
    set({ panelWidth });
  },

  setChatRouteSnapshot(route) {
    chatRoute = route;
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

  async send(text, opts) {
    const rawTrimmed = text.trim();
    if (!rawTrimmed || get().status === "streaming") return;
    const { config } = useAiConfigStore.getState();
    const apiKey = activeKey(config);
    if (!apiKey) return;

    const turnId = uuid();

    // Contexto de pantalla (D1) y bloque para el system prompt (D2).
    const uiCtx = resolveUiContext({
      pathname: chatRoute.pathname,
      search: chatRoute.search,
      getProject: (id) => {
        const p = useAppStore
          .getState()
          .workspace?.index?.projects.find((x) => x.id === id);
        return p ? { id: p.id, name: p.name, status: p.status, health: p.health } : null;
      },
      getTask: (projectId, taskId) => {
        const project = findProject(projectId);
        if (!project) return null;
        const t = project.tasks.find((x) => x.id === taskId);
        return t
          ? { id: t.id, title: t.title, status: t.status, priority: t.priority }
          : null;
      },
    });

    // Slash expand (CA-03.4) + skip RAG (D7). El hilo muestra el texto expandido.
    const expanded = expandSlash(rawTrimmed, uiCtx);
    const trimmed = expanded.text;
    const skipKind: false | "slash" | "continuation" =
      expanded.skipRag || opts?.skipRag
        ? "slash"
        : shouldSkipRag(trimmed)
          ? "continuation"
          : false;

    const isRegenerate = opts?.regenerate === true;

    const assistantId = uuid();
    const prevMessages = get().messages;
    // Para regenerate: reemplazar la última burbuja assistant por una nueva vacía.
    const lastAssistantId = [...prevMessages].reverse().find((m) => m.role === "assistant")?.id;
    set({
      status: "streaming",
      error: null,
      errorDetail: null,
      messages: isRegenerate
        ? prevMessages.map((m) =>
            m.id === lastAssistantId
              ? { id: assistantId, role: "assistant" as const, parts: [] }
              : m,
          )
        : [
            ...prevMessages,
            { id: uuid(), role: "user", parts: [{ kind: "text", text: trimmed }] },
            { id: assistantId, role: "assistant", parts: [] },
          ],
    });

    abortController = new AbortController();
    autoApproveRestOfTurn = false;

    // Para regenerateLast (design §4.2): snapshot antes del turno.
    lastTurnHistoryLength = agentHistory.length;
    lastTurnUserText = trimmed;

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
    // Spec 060 D6–D9: solo embebe si el índice está fresco; skip 050 sigue sin embeddings.
    const gKey = geminiKey(config);

    let checkStaleFailed = false;
    if (config.ragEnabled) {
      await useRagStore
        .getState()
        .checkStale()
        .catch(() => {
          checkStaleFailed = true;
        });
    }

    const ragSnap = useRagStore.getState();
    const status: RagStatus = checkStaleFailed ? "error" : ragSnap.status;
    const entityCount = ragSnap.meta.entityCount;

    const focus = shouldFocusIndex({
      ragEnabled: config.ragEnabled,
      status,
      entityCount,
    });
    const auto = shouldAutoRag({
      ragEnabled: config.ragEnabled,
      status,
      entityCount,
      skip: skipKind,
      hasGeminiKey: Boolean(gKey),
    });

    let ragContext = "";
    let ragHits = 0;
    let ragSkipReason: RagSkipReason | undefined = auto.skipReason;

    if (auto.auto && gKey) {
      const detailed = await buildRagContextDetailed(trimmed, gKey).catch(() => null);
      if (detailed === null) {
        ragContext = "";
        ragHits = 0;
        ragSkipReason = "error";
      } else {
        ragContext = detailed.block;
        ragHits = detailed.hits;
        if (detailed.fromCache) {
          ragSkipReason = "cache-hit";
        }
        if (!detailed.fromCache && detailed.modelId) {
          const embedTokens = estimateTokensFromChars(trimmed.length);
          await recordUsageEvent({
            id: uuid(),
            ts: new Date().toISOString(),
            turnId,
            kind: "embedding",
            provider: "gemini",
            modelId: detailed.modelId,
            requests: 1,
            usage: {
              inputTokens: embedTokens,
              outputTokens: 0,
              totalTokens: embedTokens,
              source: "estimated",
            },
          });
        }
      }
    }

    const screenContextBlock = formatUiContextBlock(uiCtx);
    const ws = useAppStore.getState().workspace;
    const promptWorkspace =
      ws && focus && ws.index
        ? { ...ws, index: selectWorkspaceIndex(ws.index, uiCtx) }
        : ws;

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
      systemInstruction: buildSystemPrompt(
        promptWorkspace,
        ragContext,
        new Date(),
        screenContextBlock,
        { omitEmptyIndexSections: focus },
      ),
      history: compactToolResults(trimAgentHistory(agentHistory)),
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

    const rounds = result.rounds ?? 0;
    const usages = result.usages ?? [];
    const ragSnapshot: NonNullable<UsageEvent["rag"]> = {
      attempted: auto.auto,
      injected: Boolean(ragContext),
      indexFocused: focus,
      hits: ragHits,
    };
    if (ragSkipReason) ragSnapshot.skipReason = ragSkipReason;

    // CA-07.3: abort on the first streamTurn must not invent a request.
    // CA-07.4: real provider errors with 0 rounds still get a phantom estimated event.
    if (result.error !== "aborted" || rounds > 0) {
      if (result.error && rounds === 0) {
        await recordUsageEvent({
          id: uuid(),
          ts: new Date().toISOString(),
          turnId,
          kind: "chat",
          provider: providerId,
          modelId: config.model,
          requests: 1,
          rounds: 0,
          usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0, source: "estimated" },
          rag: ragSnapshot,
        });
      } else {
        await recordUsageEvent({
          id: uuid(),
          ts: new Date().toISOString(),
          turnId,
          kind: "chat",
          provider: providerId,
          modelId: config.model,
          requests: rounds,
          rounds,
          usage: sumTokenUsages(usages),
          rag: ragSnapshot,
        });
      }
    }

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

  async regenerateLast() {
    // D14: no regenerar a mitad de streaming o con escrituras pendientes.
    const status = get().status;
    if (status === "streaming" || status === "awaiting-confirmation") return;

    // Reapuntar el agentHistory al estado previo al último turno (design §4.2).
    agentHistory = agentHistory.slice(0, lastTurnHistoryLength);

    const userText = lastTurnUserText;
    if (!userText) return;
    await get().send(userText, { regenerate: true });
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
    lastTurnHistoryLength = 0;
    lastTurnUserText = null;
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

/** Lookup de un proyecto desde el store de datos (para resolver la tarea en foco). */
function findProject(id: string): Project | undefined {
  return useDataStore.getState().projects.find((p) => p.id === id);
}

function sumTokenUsages(usages: TokenUsage[]): TokenUsage {
  if (usages.length === 0) {
    return { inputTokens: 0, outputTokens: 0, totalTokens: 0, source: "estimated" };
  }
  let inputTokens = 0;
  let outputTokens = 0;
  let totalTokens = 0;
  let allProvider = true;
  for (const u of usages) {
    inputTokens += u.inputTokens;
    outputTokens += u.outputTokens;
    totalTokens += u.totalTokens;
    if (u.source !== "provider") allProvider = false;
  }
  return {
    inputTokens,
    outputTokens,
    totalTokens,
    source: allProvider ? "provider" : "estimated",
  };
}

async function recordUsageEvent(event: UsageEvent): Promise<void> {
  try {
    await useAiUsageStore.getState().record(event);
  } catch {
    // fail-open: usage must not fail the chat turn
  }
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
