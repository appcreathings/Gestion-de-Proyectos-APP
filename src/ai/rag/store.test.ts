import { describe, expect, it, vi, beforeEach } from "vitest";
import { loadMeta, saveMeta, loadEmbeddings, saveEmbeddings } from "./store";
import type { RagEntry } from "./types";

vi.mock("@/storage/idb", () => ({
  idbGet: vi.fn(),
  idbSet: vi.fn(),
}));

function makeEntry(id: string): RagEntry {
  return {
    id,
    embedding: [0.1, 0.2, 0.3],
    entity: {
      id,
      entityType: "project",
      entityId: "abc",
      text: "test",
      updatedAt: "2026-01-01T00:00:00.000Z",
      indexedAt: "2026-07-05T00:00:00.000Z",
    },
  };
}

describe("RagStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loadMeta", () => {
    it("devuelve valores por defecto si no hay datos", async () => {
      const { idbGet } = await import("@/storage/idb");
      vi.mocked(idbGet).mockResolvedValue(null);

      const meta = await loadMeta();
      expect(meta.lastIndexedAt).toBeNull();
      expect(meta.entityCount).toBe(0);
    });

    it("devuelve meta guardada", async () => {
      const { idbGet } = await import("@/storage/idb");
      vi.mocked(idbGet).mockResolvedValue({
        lastIndexedAt: "2026-07-05T12:00:00.000Z",
        entityCount: 42,
      });

      const meta = await loadMeta();
      expect(meta.lastIndexedAt).toBe("2026-07-05T12:00:00.000Z");
      expect(meta.entityCount).toBe(42);
    });

    it("devuelve por defecto si hay error", async () => {
      const { idbGet } = await import("@/storage/idb");
      vi.mocked(idbGet).mockRejectedValue(new Error("IDB error"));

      const meta = await loadMeta();
      expect(meta.lastIndexedAt).toBeNull();
      expect(meta.entityCount).toBe(0);
    });
  });

  describe("saveMeta", () => {
    it("guarda meta en IDB", async () => {
      const { idbSet } = await import("@/storage/idb");
      await saveMeta({ lastIndexedAt: "2026-07-05T12:00:00.000Z", entityCount: 10 });
      expect(idbSet).toHaveBeenCalledWith("aiRag:meta", {
        lastIndexedAt: "2026-07-05T12:00:00.000Z",
        entityCount: 10,
      });
    });
  });

  describe("loadEmbeddings", () => {
    it("devuelve Map vacio si no hay datos", async () => {
      const { idbGet } = await import("@/storage/idb");
      vi.mocked(idbGet).mockResolvedValue(null);

      const map = await loadEmbeddings();
      expect(map.size).toBe(0);
    });

    it("devuelve Map con entradas", async () => {
      const { idbGet } = await import("@/storage/idb");
      const entries: [string, RagEntry][] = [
        ["p:abc", makeEntry("p:abc")],
        ["t:def", makeEntry("t:def")],
      ];
      vi.mocked(idbGet).mockResolvedValue(entries);

      const map = await loadEmbeddings();
      expect(map.size).toBe(2);
      expect(map.get("p:abc")?.id).toBe("p:abc");
    });

    it("devuelve Map vacio si hay error", async () => {
      const { idbGet } = await import("@/storage/idb");
      vi.mocked(idbGet).mockRejectedValue(new Error("IDB error"));

      const map = await loadEmbeddings();
      expect(map.size).toBe(0);
    });
  });

  describe("saveEmbeddings", () => {
    it("serializa Map como array de tuplas", async () => {
      const { idbSet } = await import("@/storage/idb");
      const map = new Map([
        ["p:abc", makeEntry("p:abc")],
      ]);
      await saveEmbeddings(map);
      expect(idbSet).toHaveBeenCalledWith("aiRag:embeddings", [
        ["p:abc", map.get("p:abc")],
      ]);
    });
  });
});
