import type { Content, Part } from "@google/genai";
import type { AiMessage, AiToolCall } from "../types";

/** Neutro → Content[] del SDK de Gemini. */
export function toGeminiContents(history: AiMessage[]): Content[] {
  const out: Content[] = [];
  for (const msg of history) {
    if (msg.role === "user") {
      out.push({ role: "user", parts: [{ text: msg.content }] });
    } else if (msg.role === "assistant") {
      const parts: Part[] = [];
      if (msg.content) parts.push({ text: msg.content });
      for (const tc of msg.toolCalls ?? []) {
        parts.push({
          functionCall: {
            id: tc.id,
            name: tc.name,
            args: tc.args,
          },
        });
      }
      if (parts.length === 0) parts.push({ text: "" });
      out.push({ role: "model", parts });
    } else if (msg.role === "tool") {
      // Gemini espera functionResponse en un turno user
      const last = out[out.length - 1];
      const fr: Part = {
        functionResponse: {
          id: msg.toolCallId,
          name: msg.name,
          response:
            msg.result && typeof msg.result === "object"
              ? (msg.result as Record<string, unknown>)
              : { output: msg.result ?? null },
        },
      };
      if (last?.role === "user" && last.parts?.some((p) => "functionResponse" in p)) {
        last.parts = [...(last.parts ?? []), fr];
      } else {
        out.push({ role: "user", parts: [fr] });
      }
    }
  }
  return out;
}

/**
 * Content[] (SDK o snapshot viejo de aiChat:last) → AiMessage[].
 * Best-effort: si la forma no se reconoce, se omite ese Content.
 */
export function fromGeminiContents(contents: Content[]): AiMessage[] {
  const out: AiMessage[] = [];
  for (const c of contents) {
    const parts = c.parts ?? [];
    if (c.role === "user" || c.role === undefined) {
      const textParts = parts.filter((p) => typeof (p as { text?: string }).text === "string");
      const frParts = parts.filter((p) => "functionResponse" in p && p.functionResponse);
      if (frParts.length > 0) {
        for (const p of frParts) {
          const fr = p.functionResponse!;
          out.push({
            role: "tool",
            toolCallId: fr.id ?? "",
            name: fr.name ?? "",
            result: fr.response ?? null,
          });
        }
      } else if (textParts.length > 0 || parts.length === 0) {
        const text = textParts.map((p) => (p as { text: string }).text).join("");
        out.push({ role: "user", content: text });
      }
    } else if (c.role === "model") {
      const text = parts
        .filter((p) => typeof (p as { text?: string }).text === "string")
        .map((p) => (p as { text: string }).text)
        .join("");
      const toolCalls: AiToolCall[] = [];
      for (const p of parts) {
        if ("functionCall" in p && p.functionCall) {
          const fc = p.functionCall;
          toolCalls.push({
            id: fc.id ?? crypto.randomUUID(),
            name: fc.name ?? "",
            args: (fc.args as Record<string, unknown>) ?? {},
          });
        }
      }
      out.push({
        role: "assistant",
        content: text,
        ...(toolCalls.length ? { toolCalls } : {}),
      });
    }
  }
  return out;
}

/** Detecta si un valor parece historial Gemini (Content[]) vs AiMessage[]. */
export function looksLikeGeminiHistory(history: unknown): history is Content[] {
  if (!Array.isArray(history) || history.length === 0) return false;
  const first = history[0] as Record<string, unknown>;
  return (
    first != null &&
    typeof first === "object" &&
    ("parts" in first || first.role === "model" || first.role === "user")
  );
}

export function looksLikeNeutralHistory(history: unknown): history is AiMessage[] {
  if (!Array.isArray(history) || history.length === 0) return false;
  const first = history[0] as Record<string, unknown>;
  return (
    first != null &&
    typeof first === "object" &&
    (first.role === "user" || first.role === "assistant" || first.role === "tool") &&
    ("content" in first || "toolCallId" in first)
  );
}
