import { toOpenAiTool } from "@/ai/tools/schema";
import { parseOpenAiUsage } from "@/ai/usage/parseUsage";
import type { TokenUsage } from "@/ai/usage/types";
import type { ProviderDefinition } from "../catalog";
import type {
  AiProvider,
  KeyValidation,
  StreamTurnOptions,
  StreamTurnResult,
} from "../types";
import { classifyOpenAiError, HttpError } from "./errors";
import {
  accumulateToolCallDelta,
  createToolCallAccumulator,
  finalizeToolCalls,
  parseOpenAiChunk,
  parseOpenAiUsageField,
  toOpenAiMessages,
} from "./mapping";
import { consumeSseStream } from "./sse";

export function buildOpenAiChatBody(input: {
  model: string;
  messages: unknown;
  tools?: unknown;
  includeUsage: boolean;
}): Record<string, unknown> {
  const body: Record<string, unknown> = {
    model: input.model,
    messages: input.messages,
    stream: true,
  };
  if (input.tools !== undefined) body.tools = input.tools;
  if (input.includeUsage) body.stream_options = { include_usage: true };
  return body;
}

export function shouldRetryWithoutStreamOptions(status: number, bodyText: string): boolean {
  return status === 400 && /stream_options/i.test(bodyText);
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function authHeaders(def: ProviderDefinition, apiKey: string): HeadersInit {
  if (def.auth.header === "Authorization") {
    return {
      Authorization: `${def.auth.scheme} ${apiKey}`,
      "Content-Type": "application/json",
    };
  }
  return {
    [def.auth.header]: apiKey,
    "Content-Type": "application/json",
  };
}

export function createOpenAiCompatibleProvider(def: ProviderDefinition): AiProvider {
  return {
    id: def.id,

    async validateKey(apiKey: string, baseUrl?: string): Promise<KeyValidation> {
      const base = normalizeBaseUrl(baseUrl?.trim() || def.defaultBaseUrl);
      try {
        const res = await fetch(`${base}/models`, {
          method: "GET",
          headers: authHeaders(def, apiKey),
        });
        if (res.status === 401 || res.status === 403) {
          return { ok: false, error: "invalid-key" };
        }
        if (res.status === 400) {
          const body = await res.text().catch(() => "");
          if (/api key|token|auth/i.test(body)) {
            return { ok: false, error: "invalid-key" };
          }
        }
        if (res.ok || res.status === 404) return { ok: true };
        return { ok: false, error: "unknown" };
      } catch (e) {
        return { ok: false, error: classifyOpenAiError(e) };
      }
    },

    async streamTurn(opts: StreamTurnOptions): Promise<StreamTurnResult> {
      const base = normalizeBaseUrl(opts.baseUrl?.trim() || def.defaultBaseUrl);
      const messages = toOpenAiMessages(opts.history, opts.systemInstruction);
      const tools = opts.tools.length ? opts.tools.map(toOpenAiTool) : undefined;
      const url = `${base}/chat/completions`;
      const headers = authHeaders(def, opts.apiKey);

      const post = (includeUsage: boolean) =>
        fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(
            buildOpenAiChatBody({
              model: opts.model,
              messages,
              tools,
              includeUsage,
            }),
          ),
          signal: opts.signal,
        });

      let includeUsage = true;
      let res = await post(true);

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        if (shouldRetryWithoutStreamOptions(res.status, errText)) {
          includeUsage = false;
          res = await post(false);
        } else {
          throw new HttpError(res.status, errText);
        }
      }

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new HttpError(res.status, errText);
      }
      if (!res.body) {
        throw new Error("Respuesta sin body (stream no disponible)");
      }

      let text = "";
      const acc = createToolCallAccumulator();
      let usage: TokenUsage | undefined;

      await consumeSseStream(
        res.body,
        (data) => {
          if (includeUsage) {
            const parsed = parseOpenAiUsage(parseOpenAiUsageField(data));
            if (parsed) usage = parsed;
          }
          const delta = parseOpenAiChunk(data);
          if (!delta) return;
          if (delta.content) {
            text += delta.content;
            opts.onTextDelta(delta.content);
          }
          if (delta.tool_calls?.length) {
            accumulateToolCallDelta(acc, delta.tool_calls);
          }
        },
        opts.signal,
      );

      return {
        text,
        toolCalls: finalizeToolCalls(acc),
        usage,
      };
    },

    classifyError(e: unknown) {
      return classifyOpenAiError(e);
    },
  };
}
