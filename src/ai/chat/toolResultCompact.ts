import type { AiMessage } from "@/ai/providers/types";

/** Cap de caracteres del JSON de un resultado de tool enviado al modelo (spec 060 CA-04). */
export const TOOL_RESULT_MAX_CHARS = 4000;

/**
 * Compacta resultados de tools sobredimensionados en la proyección al proveedor.
 * No muta el historial original. Si nadie excede el cap, devuelve el mismo array.
 */
export function compactToolResults(
  history: AiMessage[],
  maxChars: number = TOOL_RESULT_MAX_CHARS,
): AiMessage[] {
  let changed = false;
  const out: AiMessage[] = history.map((msg) => {
    if (msg.role !== "tool") return msg;
    const raw = JSON.stringify(msg.result ?? null);
    if (raw.length <= maxChars) return msg;
    changed = true;
    return {
      ...msg,
      result: {
        truncated: true,
        name: msg.name,
        preview: raw.slice(0, maxChars),
      },
    };
  });
  return changed ? out : history;
}
