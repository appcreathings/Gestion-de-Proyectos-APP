import { idbGet, idbSet } from "@/storage/idb";
import type { RagEntry, RagMeta } from "./types";
export type { RagMeta };

const IDB_EMBEDDINGS = "aiRag:embeddings";
const IDB_META = "aiRag:meta";

export async function loadEmbeddings(): Promise<Map<string, RagEntry>> {
  try {
    const raw = await idbGet<[string, RagEntry][]>(IDB_EMBEDDINGS);
    return new Map(raw ?? []);
  } catch {
    return new Map();
  }
}

export async function saveEmbeddings(
  map: Map<string, RagEntry>,
): Promise<void> {
  await idbSet(IDB_EMBEDDINGS, Array.from(map.entries()));
}

export async function loadMeta(): Promise<RagMeta> {
  try {
    const raw = await idbGet<RagMeta>(IDB_META);
    return raw ?? { lastIndexedAt: null, entityCount: 0 };
  } catch {
    return { lastIndexedAt: null, entityCount: 0 };
  }
}

export async function saveMeta(meta: RagMeta): Promise<void> {
  await idbSet(IDB_META, meta);
}
