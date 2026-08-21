import type { TurnUsageView, UsageEvent } from "./types";

export function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function aggregateTurn(
  events: UsageEvent[],
  turnId: string,
): TurnUsageView | null {
  const matched = events.filter((e) => e.turnId === turnId);
  if (matched.length === 0) return null;

  const chat = matched.find((e) => e.kind === "chat");
  let requests = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  let totalTokens = 0;
  let estimated = false;

  for (const e of matched) {
    requests += e.requests;
    inputTokens += e.usage.inputTokens;
    outputTokens += e.usage.outputTokens;
    totalTokens += e.usage.totalTokens;
    if (e.usage.source === "estimated") estimated = true;
  }

  const view: TurnUsageView = {
    turnId,
    requests,
    rounds: chat?.rounds ?? 0,
    inputTokens,
    outputTokens,
    totalTokens,
    estimated,
  };
  if (chat?.rag) view.rag = chat.rag;
  return view;
}

export function aggregateDay(
  events: UsageEvent[],
  day: string,
  includeEstimated: boolean,
): {
  requests: number;
  inputTokens: number;
  outputTokens: number;
  byModel: Record<
    string,
    { requests: number; inputTokens: number; outputTokens: number }
  >;
} {
  const filtered = events.filter((e) => {
    if (localDateKey(new Date(e.ts)) !== day) return false;
    if (!includeEstimated && e.usage.source === "estimated") return false;
    return true;
  });

  const byModel: Record<
    string,
    { requests: number; inputTokens: number; outputTokens: number }
  > = {};
  let requests = 0;
  let inputTokens = 0;
  let outputTokens = 0;

  for (const e of filtered) {
    requests += e.requests;
    inputTokens += e.usage.inputTokens;
    outputTokens += e.usage.outputTokens;
    const bucket = byModel[e.modelId] ?? {
      requests: 0,
      inputTokens: 0,
      outputTokens: 0,
    };
    bucket.requests += e.requests;
    bucket.inputTokens += e.usage.inputTokens;
    bucket.outputTokens += e.usage.outputTokens;
    byModel[e.modelId] = bucket;
  }

  return { requests, inputTokens, outputTokens, byModel };
}
