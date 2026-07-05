import { create } from "zustand";
import {
  indexAllEntities,
  removeStaleEmbeddings,
  collectEntities,
} from "@/ai/rag/indexer";
import { loadEmbeddings, loadMeta, type RagMeta } from "@/ai/rag/store";
import type { RagProgress, RagStatus } from "@/ai/rag/types";
import { useAiConfigStore } from "./useAiConfigStore";
import { useDataStore } from "./useDataStore";
import type { ToolData } from "@/ai/tools/types";

interface RagState {
  status: RagStatus;
  progress: RagProgress | null;
  meta: RagMeta;
  error: string | null;
  loaded: boolean;

  hydrate: () => Promise<void>;
  startIndexing: () => Promise<void>;
  clearEmbeddings: () => Promise<void>;
  checkStale: () => Promise<void>;
  cancelIndexing: () => void;
}

function collectToolData(): ToolData {
  const ds = useDataStore.getState();
  return {
    products: ds.products,
    projects: ds.projects,
    people: ds.people,
    checklistTemplates: ds.checklistTemplates,
    processTemplates: ds.processTemplates,
    projectTypes: ds.projectTypes,
    automations: ds.automations,
    notifications: ds.notifications,
  };
}

let abortController: AbortController | null = null;

export const useRagStore = create<RagState>((set, get) => ({
  status: "idle",
  progress: null,
  meta: { lastIndexedAt: null, entityCount: 0 },
  error: null,
  loaded: false,

  async hydrate() {
    const meta = await loadMeta();
    set({
      meta,
      loaded: true,
      status: meta.entityCount > 0 ? "up-to-date" : "idle",
    });
  },

  async startIndexing() {
    const apiKey = useAiConfigStore.getState().config.apiKey;
    if (!apiKey) {
      set({ status: "error", error: "API key no configurada" });
      return;
    }

    const data = collectToolData();
    abortController = new AbortController();
    const signal = abortController.signal;
    set({ status: "indexing", progress: null, error: null });

    try {
      await indexAllEntities(data, apiKey, (progress) => {
        set({ progress });
      }, signal);

      if (signal.aborted) return;

      await removeStaleEmbeddings(data);
      const meta = await loadMeta();
      set({
        status: "up-to-date",
        progress: null,
        meta,
        error: null,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const message =
        err instanceof Error ? err.message : "Error desconocido";
      set({ status: "error", error: message, progress: null });
    } finally {
      abortController = null;
    }
  },

  cancelIndexing() {
    abortController?.abort();
    abortController = null;
    set({ status: "idle", progress: null, error: null });
  },

  async clearEmbeddings() {
    const { saveEmbeddings, saveMeta } = await import("@/ai/rag/store");
    await saveEmbeddings(new Map());
    await saveMeta({ lastIndexedAt: null, entityCount: 0 });
    set({
      status: "idle",
      progress: null,
      meta: { lastIndexedAt: null, entityCount: 0 },
      error: null,
    });
  },

  async checkStale() {
    const meta = get().meta;
    if (meta.entityCount === 0) return;

    const embeddings = await loadEmbeddings();
    if (embeddings.size === 0) {
      set({ status: "idle" });
      return;
    }

    const data = collectToolData();
    const current = collectEntities(data);
    let staleCount = 0;

    for (const entity of current) {
      const entry = embeddings.get(entity.id);
      if (!entry || entry.entity.updatedAt !== entity.updatedAt) {
        staleCount++;
      }
    }

    const nextStatus: RagStatus =
      staleCount > 0 ? "partial" : "up-to-date";
    set({ status: nextStatus });
  },
}));
