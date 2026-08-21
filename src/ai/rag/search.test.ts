import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  cosineSimilarity,
  embedText,
  searchByEntityId,
  semanticSearch,
  semanticSearchDetailed,
} from "./search";
import { resetQueryCacheForTests } from "./queryCache";
import type { RagEntry } from "./types";

vi.mock("@/ai/gemini/client", () => ({
  createClient: vi.fn(),
}));

vi.mock("./store", () => ({
  loadEmbeddings: vi.fn(async () => new Map()),
}));

import { createClient } from "@/ai/gemini/client";
import { rateLimiter } from "@/ai/rateLimiter";
import { loadEmbeddings } from "./store";

const originalOnLine = navigator.onLine;
function forceOnline(on: boolean) {
  Object.defineProperty(navigator, "onLine", {
    value: on,
    configurable: true,
    writable: true,
  });
}

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

function sdkError(body: string, status = 429): Error {
  const err = new Error(body);
  (err as unknown as { status: number }).status = status;
  err.name = "ApiError";
  return err;
}

function makeEmbeddingClient(models: Record<string, () => unknown>): unknown {
  return {
    models: {
      embedContent: vi.fn().mockImplementation((opts: { model: string }) => {
        const fn = models[opts.model];
        if (!fn) throw new Error(`modelo no mockeado: ${opts.model}`);
        return Promise.resolve(fn());
      }),
    },
  };
}

const RATE_LIMIT_BODY =
  '{"error":{"code":429,"message":"rate limit","status":"RESOURCE_EXHAUSTED"}}';
const PROJECT_QUOTA_ZERO_BODY =
  '{"error":{"code":429,"details":[{"metadata":{"quota_limit_value":"0"}}]}}';

describe("embedText — fallback entre modelos de embedding (spec 031)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    forceOnline(true);
    // Resetea saturación de tests previos para ambos modelos del grupo.
    for (const id of ["gemini:gemini-embedding-001", "gemini:gemini-embedding-2"]) {
      rateLimiter.markSaturated(id, 0);
      rateLimiter.canMakeRequest(id);
    }
  });
  afterEach(() => forceOnline(originalOnLine));

  it("usa el primer modelo del grupo (gemini-embedding-001) cuando tiene éxito", async () => {
    const client = makeEmbeddingClient({
      "models/gemini-embedding-001": () => ({ embeddings: [{ values: [0.1, 0.2] }] }),
    });
    vi.mocked(createClient).mockResolvedValue(client as never);

    const vec = await embedText("hola", "key");
    expect(vec).toEqual([0.1, 0.2]);
  });

  it("T3133: cae a gemini-embedding-2 cuando embedding-001 falla por rate-limit", async () => {
    const client = makeEmbeddingClient({
      "models/gemini-embedding-001": () => {
        throw sdkError(RATE_LIMIT_BODY);
      },
      "models/gemini-embedding-2": () => ({ embeddings: [{ values: [0.9, 0.8] }] }),
    });
    vi.mocked(createClient).mockResolvedValue(client as never);

    const vec = await embedText("hola", "key");
    expect(vec).toEqual([0.9, 0.8]);
    // El primer modelo quedó marcado saturado en el rate limiter local.
    expect(rateLimiter.getStatus("gemini:gemini-embedding-001").saturated).toBe(true);
  });

  it("T3133: NO prueba el segundo modelo ante project-quota-zero (relanza directo)", async () => {
    const client = makeEmbeddingClient({
      "models/gemini-embedding-001": () => {
        throw sdkError(PROJECT_QUOTA_ZERO_BODY);
      },
      // Si el código probara el 2º modelo, este mock lanzaría un error de "modelo no mockeado"
      // desde makeEmbeddingClient, haciendo fallar el test explícitamente.
    });
    vi.mocked(createClient).mockResolvedValue(client as never);

    await expect(embedText("hola", "key")).rejects.toBeDefined();
    // No debería haber marcado saturado al primer modelo (eso solo aplica a rate-limit/cuota).
    expect(rateLimiter.getStatus("gemini:gemini-embedding-001").saturated).toBe(false);
  });

  it("lanza el último error cuando todos los modelos del grupo fallan por rate-limit", async () => {
    const client = makeEmbeddingClient({
      "models/gemini-embedding-001": () => {
        throw sdkError(RATE_LIMIT_BODY);
      },
      "models/gemini-embedding-2": () => {
        throw sdkError(RATE_LIMIT_BODY);
      },
    });
    vi.mocked(createClient).mockResolvedValue(client as never);

    await expect(embedText("hola", "key")).rejects.toBeDefined();
    expect(rateLimiter.getStatus("gemini:gemini-embedding-001").saturated).toBe(true);
    expect(rateLimiter.getStatus("gemini:gemini-embedding-2").saturated).toBe(true);
  });

  it("lanza directamente ante invalid-key (no prueba el segundo modelo)", async () => {
    const err400 = sdkError('{"error":{"code":400,"message":"bad key"}}', 400);
    const client = makeEmbeddingClient({
      "models/gemini-embedding-001": () => {
        throw err400;
      },
    });
    vi.mocked(createClient).mockResolvedValue(client as never);

    await expect(embedText("hola", "key")).rejects.toBe(err400);
    expect(rateLimiter.getStatus("gemini:gemini-embedding-001").saturated).toBe(false);
  });
});

describe("semanticSearchDetailed — cache de embeddings de query (spec 060)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetQueryCacheForTests();
    forceOnline(true);
    for (const id of ["gemini:gemini-embedding-001", "gemini:gemini-embedding-2"]) {
      rateLimiter.markSaturated(id, 0);
      rateLimiter.canMakeRequest(id);
    }
    vi.mocked(loadEmbeddings).mockResolvedValue(new Map());
  });
  afterEach(() => forceOnline(originalOnLine));

  it("la segunda llamada con la misma query no llama embedText (fromCache)", async () => {
    const entry = makeEntry("project:a", "a");
    entry.embedding = [0.1, 0.2];
    vi.mocked(loadEmbeddings).mockResolvedValue(new Map([["project:a", entry]]));

    const client = makeEmbeddingClient({
      "models/gemini-embedding-001": () => ({ embeddings: [{ values: [0.1, 0.2] }] }),
    });
    vi.mocked(createClient).mockResolvedValue(client as never);

    const first = await semanticSearchDetailed("q", "k");
    expect(first.fromCache).toBe(false);
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(first.results).toHaveLength(1);
    expect(first.results[0].entity.entityId).toBe("a");
    expect(first.results[0].score).toBeCloseTo(1);

    const second = await semanticSearchDetailed("q", "k");
    expect(second.fromCache).toBe(true);
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(second.results).toEqual(first.results);
  });

  it("semanticSearch devuelve SearchResult[] (unwrap de detailed)", async () => {
    const client = makeEmbeddingClient({
      "models/gemini-embedding-001": () => ({ embeddings: [{ values: [0.1, 0.2] }] }),
    });
    vi.mocked(createClient).mockResolvedValue(client as never);

    const results = await semanticSearch("q", "k");
    expect(Array.isArray(results)).toBe(true);
    expect(results).toEqual((await semanticSearchDetailed("q", "k")).results);
  });
});
