const MAX = 50;

const cache = new Map<string, number[]>();

function normalize(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getCachedEmbedding(query: string): number[] | undefined {
  const key = normalize(query);
  const vector = cache.get(key);
  if (vector === undefined) return undefined;
  cache.delete(key);
  cache.set(key, vector);
  return vector;
}

export function setCachedEmbedding(query: string, vector: number[]): void {
  const key = normalize(query);
  cache.set(key, vector);
  if (cache.size > MAX) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) cache.delete(oldest);
  }
}

/** Clears the Map (tests only). */
export function resetQueryCacheForTests(): void {
  cache.clear();
}
