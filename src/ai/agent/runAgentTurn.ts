import { callTool, findTool, type AiTool } from "@/ai/tools";
import type { AiErrorKind } from "@/ai/gemini/errors";
import { rateLimiter } from "@/ai/rateLimiter";
import { modelSelector, type FallbackEvent } from "@/ai/modelSelector";
import { isQualifiedModelId, splitQualified } from "@/ai/models";
import type { AiMessage, AiProvider, AiToolCall } from "@/ai/providers/types";
import { estimateTurnUsage } from "@/ai/usage/parseUsage";
import type { TokenUsage } from "@/ai/usage/types";

const MAX_ROUNDS = 8;

export interface ToolCallView {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface AgentCallbacks {
  onTextDelta: (text: string) => void;
  onToolCallStart: (call: ToolCallView) => void;
  onToolCallEnd: (
    call: ToolCallView,
    outcome: { status: "ok" | "error" | "cancelled"; result?: unknown; error?: string },
  ) => void;
  onConfirmWrite: (call: ToolCallView, description: string) => Promise<boolean>;
  onModelSwitch?: (event: FallbackEvent) => void;
}

export interface AgentTurnOptions {
  provider: AiProvider;
  apiKey: string;
  baseUrl?: string;
  preferredModel: string;
  autoFallback?: boolean;
  fallbackGroup?: string;
  confirmWrites: boolean;
  tools: AiTool[];
  systemInstruction: string;
  history: AiMessage[];
  userMessage: string;
  signal?: AbortSignal;
  callbacks: AgentCallbacks;
}

export interface AgentTurnResult {
  history: AiMessage[];
  roundsExceeded: boolean;
  error?: AiErrorKind;
  /** Mensaje crudo del último error (detalle técnico colapsable). Principio I. */
  rawMessage?: string;
  modelSwitch?: FallbackEvent;
  rounds: number;
  usages: TokenUsage[];
}

/**
 * Loop agéntico provider-agnóstico (D3). Porta literal el bucle de fallback de
 * la spec 031 y la confirmación de escrituras; el adaptador solo aporta streamTurn.
 */
export async function runAgentTurn(opts: AgentTurnOptions): Promise<AgentTurnResult> {
  const { callbacks, tools, signal, preferredModel, autoFallback = true, fallbackGroup, provider } =
    opts;

  let successfulRounds = 0;
  const usages: TokenUsage[] = [];

  if (!isQualifiedModelId(preferredModel)) {
    return {
      history: opts.history,
      roundsExceeded: false,
      error: "no-model-selected",
      rounds: 0,
      usages: [],
    };
  }

  let lastFallbackEvent: FallbackEvent | undefined;
  let history: AiMessage[] = [
    ...opts.history,
    { role: "user", content: opts.userMessage },
  ];

  async function resolveInitialModel(): Promise<string | null> {
    if (!autoFallback) {
      return rateLimiter.canMakeRequest(preferredModel) ? preferredModel : null;
    }
    const selection = modelSelector.select(preferredModel, fallbackGroup);
    if (selection.fallbackEvent) {
      lastFallbackEvent = selection.fallbackEvent;
      callbacks.onModelSwitch?.(selection.fallbackEvent);
    }
    return selection.modelId;
  }

  const resolved = await resolveInitialModel();
  if (!resolved) {
    return {
      history: opts.history,
      roundsExceeded: false,
      error: autoFallback ? "all-models-exhausted" : "rate-limit",
      rounds: 0,
      usages: [],
    };
  }
  let currentModelId: string = resolved;

  let roundsExceeded = false;
  let lastRawMessage: string | undefined;

  try {
    for (let round = 0; round < MAX_ROUNDS; round++) {
      const tried = new Set<string>();
      let modelId: string = currentModelId;
      tried.add(modelId);

      let outcome = await attemptTurn(modelId);

      while (!outcome.ok) {
        if (outcome.kind !== "rate-limit" && outcome.kind !== "quota-exhausted") {
          return {
            history,
            roundsExceeded,
            error: outcome.kind,
            rawMessage: outcome.rawMessage,
            modelSwitch: lastFallbackEvent,
            rounds: successfulRounds,
            usages,
          };
        }
        rateLimiter.markSaturated(modelId, 60);
        lastRawMessage = outcome.rawMessage ?? lastRawMessage;
        if (!autoFallback) {
          return {
            history,
            roundsExceeded,
            error: outcome.kind,
            rawMessage: outcome.rawMessage,
            modelSwitch: lastFallbackEvent,
            rounds: successfulRounds,
            usages,
          };
        }
        const selection = modelSelector.select(preferredModel, fallbackGroup, tried);
        if (!selection.modelId) {
          return {
            history,
            roundsExceeded,
            error: "all-models-exhausted",
            rawMessage: lastRawMessage,
            modelSwitch: lastFallbackEvent,
            rounds: successfulRounds,
            usages,
          };
        }
        if (selection.fallbackEvent) {
          lastFallbackEvent = selection.fallbackEvent;
          callbacks.onModelSwitch?.(selection.fallbackEvent);
        }
        modelId = selection.modelId;
        tried.add(modelId);
        currentModelId = modelId;
        outcome = await attemptTurn(modelId);
      }

      const { text, toolCalls } = outcome;

      if (toolCalls.length === 0) {
        history = [
          ...history,
          { role: "assistant", content: text },
        ];
        return {
          history,
          roundsExceeded: false,
          modelSwitch: lastFallbackEvent,
          rounds: successfulRounds,
          usages,
        };
      }

      history = [
        ...history,
        {
          role: "assistant",
          content: text,
          toolCalls,
        },
      ];

      for (const call of toolCalls) {
        const view: ToolCallView = {
          id: call.id,
          name: call.name,
          args: call.args,
        };
        // Spec 049 D6: args JSON rotos no se ejecutan — se devuelve el error al modelo.
        if (call.argsError) {
          callbacks.onToolCallEnd(view, { status: "error", error: call.argsError });
          history = [
            ...history,
            {
              role: "tool",
              toolCallId: call.id,
              name: call.name,
              result: {
                error: `Argumentos inválidos: ${call.argsError}. Reintentá con JSON válido.`,
              },
            },
          ];
          continue;
        }
        const response = await executeCall(view, opts);
        history = [
          ...history,
          {
            role: "tool",
            toolCallId: call.id,
            name: call.name,
            result: response,
          },
        ];
      }
    }
    roundsExceeded = true;
    return {
      history,
      roundsExceeded,
      modelSwitch: lastFallbackEvent,
      rounds: successfulRounds,
      usages,
    };
  } catch (e) {
    return {
      history,
      roundsExceeded,
      error: provider.classifyError(e),
      rawMessage: e instanceof Error ? e.message : String(e),
      modelSwitch: lastFallbackEvent,
      rounds: successfulRounds,
      usages,
    };
  }

  async function attemptTurn(
    qualifiedModelId: string,
  ): Promise<
    | { ok: true; text: string; toolCalls: AiToolCall[] }
    | { ok: false; kind: AiErrorKind; rawMessage?: string }
  > {
    const { modelId } = splitQualified(qualifiedModelId);
    try {
      const result = await provider.streamTurn({
        apiKey: opts.apiKey,
        baseUrl: opts.baseUrl,
        model: modelId,
        systemInstruction: opts.systemInstruction,
        history,
        tools,
        signal,
        onTextDelta: callbacks.onTextDelta,
      });
      const usage =
        result.usage ??
        estimateTurnUsage({
          systemInstruction: opts.systemInstruction,
          historyJson: JSON.stringify(history),
          userMessage: opts.userMessage,
          outputText: result.text,
        });
      rateLimiter.recordRequest(qualifiedModelId, usage.totalTokens);
      usages.push(usage);
      successfulRounds++;
      return { ok: true, text: result.text, toolCalls: result.toolCalls };
    } catch (e) {
      return {
        ok: false,
        kind: provider.classifyError(e),
        rawMessage: e instanceof Error ? e.message : String(e),
      };
    }
  }
}

async function executeCall(
  call: ToolCallView,
  opts: AgentTurnOptions,
): Promise<Record<string, unknown>> {
  const { callbacks, tools } = opts;
  const tool = findTool(tools, call.name);

  if (tool?.mode === "write" && opts.confirmWrites) {
    const description = safeDescribe(tool, call.args) ?? `Ejecutar ${call.name}`;
    const approved = await callbacks.onConfirmWrite(call, description);
    if (!approved) {
      callbacks.onToolCallEnd(call, {
        status: "cancelled",
        error: "Cancelada por el usuario",
      });
      return {
        error: "El usuario canceló esta acción. No la reintentes; pregunta qué prefiere.",
      };
    }
  }

  callbacks.onToolCallStart(call);
  const res = await callTool(tools, call.name, call.args);
  if (res.ok) {
    callbacks.onToolCallEnd(call, { status: "ok", result: res.result });
    return { output: res.result ?? null };
  }
  callbacks.onToolCallEnd(call, { status: "error", error: res.error });
  return { error: res.error ?? "Error desconocido" };
}

function safeDescribe(tool: AiTool, args: Record<string, unknown>): string | null {
  try {
    const parsed = tool.input.safeParse(args);
    if (!parsed.success || !tool.describeCall) return null;
    return tool.describeCall(parsed.data);
  } catch {
    return null;
  }
}
