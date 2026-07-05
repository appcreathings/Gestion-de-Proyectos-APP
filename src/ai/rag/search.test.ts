import { describe, expect, it } from "vitest";
import { cosineSimilarity, searchByEntityId } from "./search";
import type { RagEntry } from "./types";

function makeEntry(id: string, entityId: string): RagEntry {
  return {
    id,
    embedding: [],
    entity: {
      id,
      entityType: "project",
      entityId,
      text: "test",
      updatedAt: "",
      indexedAt: "",
    },
  };
}

describe("cosineSimilarity", () => {
  it("devuelve 1 para vectores idénticos", () => {
    const a = [1, 2, 3];
    expect(cosineSimilarity(a, a)).toBeCloseTo(1, 10);
  });

  it("devuelve 0 para vectores ortogonales", () => {
    const a = [1, 0];
    const b = [0, 1];
    expect(cosineSimilarity(a, b)).toBeCloseTo(0, 10);
  });

  it("devuelve -1 para vectores opuestos", () => {
    const a = [1, 1];
    const b = [-1, -1];
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1, 10);
  });

  it("devuelve valor positivo para vectores similares", () => {
    const a = [1, 2, 3, 4, 5];
    const b = [1.1, 2.1, 2.9, 4.2, 5.1];
    const score = cosineSimilarity(a, b);
    expect(score).toBeGreaterThan(0.9);
    expect(score).toBeLessThan(1);
  });

  it("devuelve 0 si un vector es todo ceros", () => {
    const a = [0, 0, 0];
    const b = [1, 2, 3];
    expect(cosineSimilarity(a, b)).toBe(0);
  });

  it("devuelve 0 si ambos vectores son todo ceros", () => {
    const a = [0, 0, 0];
    const b = [0, 0, 0];
    expect(cosineSimilarity(a, b)).toBe(0);
  });
});

describe("searchByEntityId", () => {
  it("encuentra entrada por entityId", async () => {
    const map = new Map([
      ["project:a", makeEntry("project:a", "a")],
      ["task:b", makeEntry("task:b", "b")],
    ]);
    expect(await searchByEntityId(map, "a")).toBeDefined();
    expect((await searchByEntityId(map, "a"))!.id).toBe("project:a");
  });

  it("devuelve undefined si no existe", async () => {
    const map = new Map<string, RagEntry>();
    expect(await searchByEntityId(map, "x")).toBeUndefined();
  });

  it("devuelve undefined en mapa vacío", async () => {
    expect(await searchByEntityId(new Map(), "x")).toBeUndefined();
  });
});
