import type { RagStatus } from "@/ai/rag/types";
import type { RagSkipReason } from "@/ai/usage/types";

/** Índice enfocado solo en RAG fresco (D6/D9): independiente del skip de embed. */
export function shouldFocusIndex(input: {
  ragEnabled: boolean;
  status: RagStatus;
  entityCount: number;
}): boolean {
  return input.ragEnabled && input.status === "up-to-date" && input.entityCount > 0;
}

/**
 * Decide auto-embed RAG (D6–D9). `skip` distingue slash vs continuation;
 * `indexing` / partial / idle / error / entityCount 0 → stale.
 */
export function shouldAutoRag(input: {
  ragEnabled: boolean;
  status: RagStatus;
  entityCount: number;
  skip: false | "slash" | "continuation";
  hasGeminiKey: boolean;
}): { auto: boolean; skipReason?: RagSkipReason } {
  if (input.skip === "slash" || input.skip === "continuation") {
    return { auto: false, skipReason: input.skip };
  }
  if (!input.ragEnabled) return { auto: false, skipReason: "disabled" };
  if (!input.hasGeminiKey) return { auto: false, skipReason: "no-key" };
  if (input.status !== "up-to-date" || input.entityCount <= 0) {
    return { auto: false, skipReason: "stale" };
  }
  return { auto: true };
}
