export type UsageSource = "provider" | "estimated";
export type UsageKind = "chat" | "embedding";
export type RagSkipReason =
  | "continuation"
  | "slash"
  | "stale"
  | "disabled"
  | "cache-hit"
  | "error"
  | "no-key";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  source: UsageSource;
}

export interface UsageEvent {
  id: string;
  ts: string;
  turnId: string;
  kind: UsageKind;
  provider: string;
  modelId: string;
  requests: number;
  rounds?: number;
  usage: TokenUsage;
  rag?: {
    attempted: boolean;
    injected: boolean;
    skipReason?: RagSkipReason;
    indexFocused: boolean;
    hits: number;
  };
}

export interface TurnUsageView {
  turnId: string;
  requests: number;
  rounds: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimated: boolean;
  rag?: UsageEvent["rag"];
}
