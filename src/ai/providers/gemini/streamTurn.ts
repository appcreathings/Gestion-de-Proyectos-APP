import type { PartListUnion } from "@google/genai";
import { getFunctionDeclarations } from "@/ai/tools";
import { createClient } from "@/ai/gemini/client";
import type {
  AiMessage,
  StreamTurnOptions,
  StreamTurnResult,
  AiToolCall,
} from "../types";
import { toGeminiContents } from "./mapping";

/**
 * Un solo turno de streaming contra Gemini. Sin fallback ni ejecución de tools
 * (eso vive en el loop provider-agnóstico).
 */
export async function geminiStreamTurn(opts: StreamTurnOptions): Promise<StreamTurnResult> {
  const ai = await createClient(opts.apiKey);
  const { prior, message } = splitForChat(opts.history);

  const chat = ai.chats.create({
    model: opts.model,
    history: toGeminiContents(prior),
    config: {
      systemInstruction: opts.systemInstruction,
      tools: opts.tools.length
        ? [{ functionDeclarations: getFunctionDeclarations(opts.tools) }]
        : undefined,
      abortSignal: opts.signal,
    },
  });

  const stream = await chat.sendMessageStream({ message });
  let text = "";
  const functionCalls: Array<{ id?: string; name?: string; args?: Record<string, unknown> }> = [];

  for await (const chunk of stream) {
    if (opts.signal?.aborted) throw new DOMException("aborted", "AbortError");
    if (chunk.text) {
      text += chunk.text;
      opts.onTextDelta(chunk.text);
    }
    if (chunk.functionCalls?.length) {
      functionCalls.push(...chunk.functionCalls);
    }
  }

  const toolCalls: AiToolCall[] = functionCalls.map((fc) => ({
    id: fc.id ?? crypto.randomUUID(),
    name: fc.name ?? "",
    args: (fc.args as Record<string, unknown>) ?? {},
  }));

  return { text, toolCalls };
}

/**
 * Separa el historial neutro en contexto previo + mensaje a enviar.
 * Exportada para tests (spec 049 F5).
 */
export function splitForChat(history: AiMessage[]): {
  prior: AiMessage[];
  message: PartListUnion;
} {
  const tail = [...history];
  const trailingTools: AiMessage[] = [];
  while (tail.length && tail[tail.length - 1].role === "tool") {
    trailingTools.unshift(tail.pop()!);
  }
  if (trailingTools.length > 0) {
    return {
      prior: tail,
      message: toGeminiContents(trailingTools)[0].parts as PartListUnion,
    };
  }
  const last = tail.pop();
  if (last?.role === "user") return { prior: tail, message: last.content };
  // no debería pasar: el loop siempre appende user
  return { prior: history, message: "" };
}
