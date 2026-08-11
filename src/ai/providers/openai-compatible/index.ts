import { toOpenAiTool } from "@/ai/tools/schema";
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
  toOpenAiMessages,
} from "./mapping";
import { consumeSseStream } from "./sse";

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
      const body = {
        model: opts.model,
        messages,
        tools: opts.tools.length ? opts.tools.map(toOpenAiTool) : undefined,
        stream: true,
      };

      const res = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: authHeaders(def, opts.apiKey),
        body: JSON.stringify(body),
        signal: opts.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new HttpError(res.status, text);
      }
      if (!res.body) {
        throw new Error("Respuesta sin body (stream no disponible)");
      }

      let text = "";
      const acc = createToolCallAccumulator();

      await consumeSseStream(
        res.body,
        (data) => {
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
      };
    },

    classifyError(e: unknown) {
      return classifyOpenAiError(e);
    },
  };
}
