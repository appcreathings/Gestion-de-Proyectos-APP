import { beforeEach, describe, expect, it } from "vitest";
import {
  getCachedEmbedding,
  resetQueryCacheForTests,
  setCachedEmbedding,
} from "./queryCache";

describe("queryCache", () => {
  beforeEach(() => {
    resetQueryCacheForTests();
  });

  it('set "Hola  Mundo" hace hit en get "hola mundo" (normaliza)', () => {
    setCachedEmbedding("Hola  Mundo", [0.1, 0.2, 0.3]);
    expect(getCachedEmbedding("hola mundo")).toEqual([0.1, 0.2, 0.3]);
  });

  it("el 51.er key distinto evicta el más viejo", () => {
    setCachedEmbedding("oldest", [1]);
    for (let i = 0; i < 49; i++) {
      setCachedEmbedding(`k${i}`, [i]);
    }

    setCachedEmbedding("newest", [99]);
    expect(getCachedEmbedding("oldest")).toBeUndefined();
    expect(getCachedEmbedding("newest")).toEqual([99]);
    expect(getCachedEmbedding("k0")).toEqual([0]);
  });

  it("resetQueryCacheForTests deja miss", () => {
    setCachedEmbedding("hola mundo", [1, 2]);
    expect(getCachedEmbedding("hola mundo")).toEqual([1, 2]);

    resetQueryCacheForTests();
    expect(getCachedEmbedding("hola mundo")).toBeUndefined();
  });

  it("get refresca recencia: el accedido no se evicta al insertar el 51.er", () => {
    setCachedEmbedding("oldest", [1]);
    for (let i = 0; i < 49; i++) {
      setCachedEmbedding(`k${i}`, [i]);
    }
    expect(getCachedEmbedding("oldest")).toEqual([1]);

    setCachedEmbedding("newest", [99]);
    expect(getCachedEmbedding("oldest")).toEqual([1]);
    expect(getCachedEmbedding("k0")).toBeUndefined();
  });
});
