export interface RagEntity {
  id: string;
  entityType: string;
  entityId: string;
  parentProjectId?: string;
  text: string;
  updatedAt: string;
  indexedAt: string;
}

export interface RagEntry {
  id: string;
  embedding: number[];
  entity: RagEntity;
}

export type RagStatus =
  | "idle"
  | "indexing"
  | "up-to-date"
  | "partial"
  | "error";

export interface RagMeta {
  lastIndexedAt: string | null;
  entityCount: number;
}

export interface RagProgress {
  current: number;
  total: number;
  phase: string;
}

export interface SearchResult {
  entity: RagEntity;
  score: number;
}
