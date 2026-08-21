import { createClient } from "@/ai/gemini/client";
import { classifyAiError } from "@/ai/gemini/errors";
import { getModelsByGroup } from "@/ai/models";
import { rateLimiter } from "@/ai/rateLimiter";
import { getCachedEmbedding, setCachedEmbedding } from "./queryCache";
import { loadEmbeddings } from "./store";
import type { SearchResult, RagEntry } from "./types";

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

/**
 * Embedding de un texto probando los modelos del grupo "gemini:embedding" en orden
 * (gemini-embedding-001, luego gemini-embedding-2). Solo cae al siguiente modelo ante errores
 * de cuota transitorios (`rate-limit`/`quota-exhausted`); otros (project-quota-zero, invalid-key,
 * offline, unknown) se relanzan directo porque probar otro modelo no va a ayudar.
 *
 * Mismo patrón que `runImproveWithFallback` (`src/ai/improve.ts`, spec 012). spec 031 §5.
 * Ids de rateLimiter son calificados (`gemini:gemini-embedding-001`); el request al SDK usa
 * el modelId sin prefijo.
 */
export async function embedText(
  text: string,
  apiKey: string,
): Promise<{ vector: number[]; modelId: string }> {
  const candidates = getModelsByGroup("gemini:embedding");
  let lastError: unknown = new Error("no embedding models available");

  for (const modelDef of candidates) {
    if (!rateLimiter.canMakeRequest(modelDef.id)) {
      // Saltamos modelos saturados en el rate limiter local; seguimos al siguiente candidato.
      continue;
    }
    try {
      const ai = await createClient(apiKey);
      const response = await ai.models.embedContent({
        model: `models/${modelDef.modelId}`,
        contents: [text],
      });
      const embedding = response.embeddings?.[0]?.values;
      if (!embedding) throw new Error("No embedding returned");
      rateLimiter.recordRequest(modelDef.id, Math.ceil(text.length / 4));
      return { vector: embedding, modelId: modelDef.id };
    } catch (e) {
      lastError = e;
      const kind = classifyAiError(e);
      if (kind === "rate-limit" || kind === "quota-exhausted") {
        rateLimiter.markSaturated(modelDef.id, 60);
        continue; // probar el siguiente modelo de embedding
      }
      // project-quota-zero / invalid-key / offline / aborted / unknown: no tiene caso probar
      // el otro modelo — la causa raíz afecta a todos (misma cuenta/proyecto/región o misma red).
      throw e;
    }
  }
  throw lastError;
}

export async function semanticSearchDetailed(
  query: string,
  apiKey: string,
  topK = 5,
): Promise<{ results: SearchResult[]; fromCache: boolean; modelId?: string }> {
  let queryVec = getCachedEmbedding(query);
  const fromCache = queryVec !== undefined;
  let modelId: string | undefined;
  if (queryVec === undefined) {
    const embedded = await embedText(query, apiKey);
    queryVec = embedded.vector;
    modelId = embedded.modelId;
    setCachedEmbedding(query, queryVec);
  }

  const entries = await loadEmbeddings();
  if (entries.size === 0) return { results: [], fromCache, modelId };

  const scored: SearchResult[] = [];
  for (const [, entry] of entries) {
    const score = cosineSimilarity(queryVec, entry.embedding);
    if (score > 0) {
      scored.push({ entity: entry.entity, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return { results: scored.slice(0, topK), fromCache, modelId };
}

export async function semanticSearch(
  query: string,
  apiKey: string,
  topK = 5,
): Promise<SearchResult[]> {
  return (await semanticSearchDetailed(query, apiKey, topK)).results;
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
