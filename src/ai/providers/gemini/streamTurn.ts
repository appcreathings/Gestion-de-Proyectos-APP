import type { Content, FunctionCall, PartListUnion } from "@google/genai";
import { getFunctionDeclarations } from "@/ai/tools";
import { createClient } from "@/ai/gemini/client";
import type { StreamTurnOptions, StreamTurnResult, AiToolCall } from "../types";
import { toGeminiContents } from "./mapping";

/**
 * Un solo turno de streaming contra Gemini. Sin fallback ni ejecución de tools
 * (eso vive en el loop provider-agnóstico).
 */
export async function geminiStreamTurn(opts: StreamTurnOptions): Promise<StreamTurnResult> {
  const ai = await createClient(opts.apiKey);
  const history = toGeminiContents(opts.history);

  // El último mensaje user debe ir como sendMessage; si history ya termina en user
  // con el texto del turno, el loop pasa history *sin* el user actual y lo manda
  // como mensaje. Aquí: history es el contexto previo; el user actual es el último
  // AiMessage user o se envía vacío (el loop siempre appende antes).
  // Design: streamTurn receives full history including the current user message.
  const { prior, message } = splitLastUser(history, opts);

  const chat = ai.chats.create({
    model: opts.model,
    history: prior,
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
  const functionCalls: FunctionCall[] = [];

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

function splitLastUser(
  history: Content[],
  opts: StreamTurnOptions,
): { prior: Content[]; message: PartListUnion } {
  // Prefer the last user text Content as the outbound message.
  if (history.length > 0) {
    const last = history[history.length - 1];
    if (last.role === "user") {
      const hasFr = last.parts?.some((p) => "functionResponse" in p && p.functionResponse);
      if (hasFr) {
        // Tool results are the message for the next round.
        return { prior: history.slice(0, -1), message: last.parts as PartListUnion };
      }
      const text = (last.parts ?? [])
        .map((p) => ("text" in p && typeof p.text === "string" ? p.text : ""))
        .join("");
      return { prior: history.slice(0, -1), message: text || opts.history.at(-1)?.role === "user"
        ? (opts.history.at(-1) as { content: string }).content
        : text };
    }
  }
  // Fallback: last neutral user message content
  const lastUser = [...opts.history].reverse().find((m) => m.role === "user");
  return {
    prior: history,
    message: lastUser && lastUser.role === "user" ? lastUser.content : "",
  };
}
