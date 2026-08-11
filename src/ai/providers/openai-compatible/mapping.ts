import type { AiMessage, AiToolCall } from "../types";

/** OpenAI chat message shapes we emit / consume. */
export type OpenAiMessage =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | {
      role: "assistant";
      content: string | null;
      tool_calls?: Array<{
        id: string;
        type: "function";
        function: { name: string; arguments: string };
      }>;
    }
  | { role: "tool"; tool_call_id: string; content: string };

export function toOpenAiMessages(
  history: AiMessage[],
  systemInstruction?: string,
): OpenAiMessage[] {
  const out: OpenAiMessage[] = [];
  if (systemInstruction) {
    out.push({ role: "system", content: systemInstruction });
  }
  for (const msg of history) {
    if (msg.role === "user") {
      out.push({ role: "user", content: msg.content });
    } else if (msg.role === "assistant") {
      const tool_calls = msg.toolCalls?.map((tc) => ({
        id: tc.id,
        type: "function" as const,
        function: {
          name: tc.name,
          arguments: JSON.stringify(tc.args ?? {}),
        },
      }));
      out.push({
        role: "assistant",
        content: msg.content || null,
        ...(tool_calls?.length ? { tool_calls } : {}),
      });
    } else if (msg.role === "tool") {
      out.push({
        role: "tool",
        tool_call_id: msg.toolCallId,
        content: safeStringify(msg.result),
      });
    }
  }
  return out;
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return JSON.stringify(String(value));
  }
}

/** Accumulator for streamed tool_calls deltas, keyed by `index`. */
export interface ToolCallAcc {
  id: string;
  name: string;
  arguments: string;
}

export function createToolCallAccumulator(): Map<number, ToolCallAcc> {
  return new Map();
}

/**
 * Merge a single streaming delta into the accumulator.
 * `name` typically arrives only on the first delta; `arguments` in pieces.
 */
export function accumulateToolCallDelta(
  acc: Map<number, ToolCallAcc>,
  deltas: Array<{
    index?: number;
    id?: string;
    function?: { name?: string; arguments?: string };
  }>,
): void {
  for (const d of deltas) {
    const index = d.index ?? 0;
    let entry = acc.get(index);
    if (!entry) {
      entry = { id: d.id ?? "", name: "", arguments: "" };
      acc.set(index, entry);
    }
    if (d.id) entry.id = d.id;
    if (d.function?.name) entry.name = d.function.name;
    if (typeof d.function?.arguments === "string") {
      entry.arguments += d.function.arguments;
    }
  }
}

/**
 * Finalize accumulated tool calls. Broken JSON args are kept with `argsError`
 * so the agent loop can return the error to the model (spec 049 D6 / design 047 §5.2).
 */
export function finalizeToolCalls(acc: Map<number, ToolCallAcc>): AiToolCall[] {
  const calls: AiToolCall[] = [];
  const indices = [...acc.keys()].sort((a, b) => a - b);
  for (const i of indices) {
    const entry = acc.get(i)!;
    if (!entry.name) continue;
    let args: Record<string, unknown> = {};
    try {
      const parsed = entry.arguments.trim() ? JSON.parse(entry.arguments) : {};
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        args = parsed as Record<string, unknown>;
      }
    } catch {
      calls.push({
        id: entry.id || `call_${i}`,
        name: entry.name,
        args: {},
        argsError: "el JSON de arguments no parsea",
      });
      continue;
    }
    calls.push({
      id: entry.id || `call_${i}`,
      name: entry.name,
      args,
    });
  }
  return calls;
}

export interface OpenAiStreamDelta {
  content?: string | null;
  /** Some gateways (OpenCode Zen free models) stream thinking here with empty `content`. */
  reasoning_content?: string | null;
  tool_calls?: Array<{
    index?: number;
    id?: string;
    function?: { name?: string; arguments?: string };
  }>;
}

/**
 * Extract the stream delta. Prefer `content`; if empty/null, fall back to
 * `reasoning_content` so OpenCode free models (big-pickle, deepseek-v4-flash-free)
 * still surface text in the chat.
 */
export function parseOpenAiChunk(raw: string): OpenAiStreamDelta | null {
  try {
    const json = JSON.parse(raw) as {
      choices?: Array<{
        delta?: {
          content?: string | null;
          reasoning_content?: string | null;
          tool_calls?: OpenAiStreamDelta["tool_calls"];
        };
      }>;
    };
    const delta = json.choices?.[0]?.delta;
    if (!delta) return null;

    const hasContent = typeof delta.content === "string" && delta.content.length > 0;
    const hasReasoning =
      typeof delta.reasoning_content === "string" && delta.reasoning_content.length > 0;

    return {
      content: hasContent
        ? delta.content
        : hasReasoning
          ? delta.reasoning_content
          : delta.content ?? null,
      tool_calls: delta.tool_calls,
    };
  } catch {
    return null;
  }
}
