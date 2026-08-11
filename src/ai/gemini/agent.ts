/**
 * Compatibility façade: the agent loop lives in `src/ai/agent/runAgentTurn.ts`.
 * This module keeps the previous Content[]-based signature so remaining
 * consumers (and legacy tests) keep working until Phase F migrates them.
 */
import type { Content } from "@google/genai";
import {
  runAgentTurn as runAgentTurnNeutral,
  type AgentCallbacks,
  type AgentTurnResult as NeutralResult,
  type ToolCallView,
} from "@/ai/agent/runAgentTurn";
import { geminiProvider, fromGeminiContents, toGeminiContents } from "@/ai/providers/gemini";
import type { AiTool } from "@/ai/tools";
import type { AiErrorKind } from "./errors";
import type { FallbackEvent } from "@/ai/modelSelector";

export type { ToolCallView, AgentCallbacks };

export interface AgentTurnOptions {
  apiKey: string;
  preferredModel: string;
  autoFallback?: boolean;
  fallbackGroup?: string;
  confirmWrites: boolean;
  tools: AiTool[];
  systemInstruction: string;
  history: Content[];
  userMessage: string;
  signal?: AbortSignal;
  callbacks: AgentCallbacks;
}

export interface AgentTurnResult {
  history: Content[];
  roundsExceeded: boolean;
  error?: AiErrorKind;
  rawMessage?: string;
  modelSwitch?: FallbackEvent;
}

export async function runAgentTurn(opts: AgentTurnOptions): Promise<AgentTurnResult> {
  const neutralHistory = fromGeminiContents(opts.history);
  const result: NeutralResult = await runAgentTurnNeutral({
    provider: geminiProvider,
    apiKey: opts.apiKey,
    preferredModel: opts.preferredModel,
    autoFallback: opts.autoFallback,
    fallbackGroup: opts.fallbackGroup,
    confirmWrites: opts.confirmWrites,
    tools: opts.tools,
    systemInstruction: opts.systemInstruction,
    history: neutralHistory,
    userMessage: opts.userMessage,
    signal: opts.signal,
    callbacks: opts.callbacks,
  });
  return {
    history: toGeminiContents(result.history),
    roundsExceeded: result.roundsExceeded,
    error: result.error,
    rawMessage: result.rawMessage,
    modelSwitch: result.modelSwitch,
  };
}
