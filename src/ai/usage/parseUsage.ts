import type { TokenUsage } from "./types";

function asFiniteNumber(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export function parseGeminiUsage(meta: unknown): TokenUsage | null {
  if (meta == null || typeof meta !== "object") return null;
  const m = meta as Record<string, unknown>;
  const inputTokens = asFiniteNumber(m.promptTokenCount);
  const outputTokens = asFiniteNumber(m.candidatesTokenCount);
  if (inputTokens == null || outputTokens == null) return null;
  const total = asFiniteNumber(m.totalTokenCount);
  return {
    inputTokens,
    outputTokens,
    totalTokens: total ?? inputTokens + outputTokens,
    source: "provider",
  };
}

export function parseOpenAiUsage(usage: unknown): TokenUsage | null {
  if (usage == null || typeof usage !== "object") return null;
  const u = usage as Record<string, unknown>;
  const inputTokens = asFiniteNumber(u.prompt_tokens);
  const outputTokens = asFiniteNumber(u.completion_tokens);
  if (inputTokens == null || outputTokens == null) return null;
  const total = asFiniteNumber(u.total_tokens);
  return {
    inputTokens,
    outputTokens,
    totalTokens: total ?? inputTokens + outputTokens,
    source: "provider",
  };
}

export function estimateTokensFromChars(chars: number): number {
  return Math.max(1, Math.ceil(chars / 4));
}

export function estimateTurnUsage(input: {
  systemInstruction: string;
  historyJson: string;
  userMessage: string;
  outputText: string;
}): TokenUsage {
  const inputChars =
    input.systemInstruction.length +
    input.historyJson.length +
    input.userMessage.length;
  const inputTokens = estimateTokensFromChars(inputChars);
  const outputTokens = estimateTokensFromChars(input.outputText.length);
  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
    source: "estimated",
  };
}
