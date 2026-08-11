import type { AiTool } from "@/ai/tools/types";
import type { AiErrorKind } from "@/ai/gemini/errors";
import type { KeyValidation } from "@/ai/gemini/client";

export type { AiErrorKind, KeyValidation };

export type ProviderId = "gemini" | "openai" | "zai" | "nvidia" | "opencode-zen";

/** Mensaje neutro: formato canónico del historial (D2). Nada de tipos del SDK acá. */
export type AiMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; toolCalls?: AiToolCall[] }
  | { role: "tool"; toolCallId: string; name: string; result: unknown };

export interface AiToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  /** El modelo emitió `arguments` que no parsean: no ejecutar, devolver el error (D6). */
  argsError?: string;
}

export interface StreamTurnOptions {
  apiKey: string;
  /** Sobrescribe el baseUrl del catálogo (proxy propio, D7). */
  baseUrl?: string;
  /** Id **sin** prefijo de proveedor: el adaptador ya sabe quién es. */
  model: string;
  systemInstruction: string;
  history: AiMessage[];
  tools: AiTool[];
  signal?: AbortSignal;
  onTextDelta: (delta: string) => void;
}

export interface StreamTurnResult {
  /** Texto acumulado del turno (para reconstruir el mensaje assistant). */
  text: string;
  toolCalls: AiToolCall[];
}

export interface AiProvider {
  readonly id: ProviderId;
  validateKey(apiKey: string, baseUrl?: string): Promise<KeyValidation>;
  streamTurn(opts: StreamTurnOptions): Promise<StreamTurnResult>;
  classifyError(e: unknown): AiErrorKind;
  /** Solo Gemini lo implementa en esta spec (D11). */
  embed?(text: string, apiKey: string, model: string): Promise<number[]>;
}
