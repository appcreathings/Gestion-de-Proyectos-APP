import { createClient } from "@/ai/gemini/client";
import { rateLimiter } from "@/ai/rateLimiter";
import { loadEmbeddings } from "./store";
import type { SearchResult, RagEntry } from "./types";

const EMBEDDING_MODEL = "gemini-embedding-001";

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

export async function embedText(
  text: string,
  apiKey: string,
): Promise<number[]> {
  if (!rateLimiter.canMakeRequest(EMBEDDING_MODEL)) {
    throw new Error("rate-limit");
  }
  const ai = await createClient(apiKey);
  const response = await ai.models.embedContent({
    model: `models/${EMBEDDING_MODEL}`,
    contents: [text],
  });
  const embedding = response.embeddings?.[0]?.values;
  if (!embedding) throw new Error("No embedding returned");
  rateLimiter.recordRequest(EMBEDDING_MODEL, Math.ceil(text.length / 4));
  return embedding;
}

export async function semanticSearch(
  query: string,
  apiKey: string,
  topK = 5,
): Promise<SearchResult[]> {
  const queryVec = await embedText(query, apiKey);

  const entries = await loadEmbeddings();
  if (entries.size === 0) return [];

  const scored: SearchResult[] = [];
  for (const [, entry] of entries) {
    const score = cosineSimilarity(queryVec, entry.embedding);
    if (score > 0) {
      scored.push({ entity: entry.entity, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

export async function searchByEntityId(
  entries: Map<string, RagEntry>,
  entityId: string,
): Promise<RagEntry | undefined> {
  for (const [, entry] of entries) {
    if (entry.entity.entityId === entityId) return entry;
  }
  return undefined;
}
