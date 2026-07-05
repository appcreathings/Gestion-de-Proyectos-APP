import { describe, expect, it, vi, beforeEach } from "vitest";
import { emptyWorkspace, type Workspace } from "@/domain/schemas";
import { buildSystemPrompt } from "./systemPrompt";

vi.mock("@/ai/rag/store", () => ({
  loadEmbeddings: vi.fn(),
}));

vi.mock("@/ai/rag/search", () => ({
  semanticSearch: vi.fn(),
}));

describe("buildSystemPrompt", () => {
  it("incluye organizacion, fecha, umbrales e indice de proyectos", () => {
    const ws: Workspace = {
      ...emptyWorkspace(),
      org: { name: "Acme Corp" },
      settings: {
        theme: "system",
        stalledAfterDays: 10,
        dueSoonDays: 3,
        deriveHealth: false,
      },
      index: {
        ...emptyWorkspace().index,
        projects: [
          {
            id: "p1",
            name: "Lanzamiento web",
            productId: null,
            status: "active",
            health: "amber",
            updatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
        templates: [{ id: "ct1", name: "Checklist QA" }],
        processTemplates: [{ id: "pt1", name: "SOP Publicacion" }],
      },
    };
    const prompt = buildSystemPrompt(ws, "", new Date("2026-07-02T10:00:00Z"));
    expect(prompt).toContain("Acme Corp");
    expect(prompt).toContain("2026-07-02");
    expect(prompt).toContain("10 días sin cambios");
    expect(prompt).toContain("3 días o menos");
    expect(prompt).toContain("Lanzamiento web (id: p1, estado: active, salud: amber)");
    expect(prompt).toContain("Checklist QA (id: ct1)");
    expect(prompt).toContain("Plantillas de proceso");
    expect(prompt).toContain("SOP Publicacion (id: pt1)");
    expect(prompt).toContain("español");
  });

  it("incluye la guia de plantillas y tipos de proyecto", () => {
    const prompt = buildSystemPrompt(null, "", new Date("2026-07-02T10:00:00Z"));
    expect(prompt).toContain("Plantillas y tipos de proyecto");
    expect(prompt).toContain("create_project_type");
    expect(prompt).toContain("Buenos ítems de checklist");
  });

  it("funciona sin workspace (defaults)", () => {
    const prompt = buildSystemPrompt(null, "", new Date("2026-07-02T10:00:00Z"));
    expect(prompt).toContain("Mi Empresa");
    expect(prompt).toContain("14 días");
    expect(prompt).toContain("(ninguno)");
    expect(prompt).toContain("Plantillas de proceso");
  });

  it("inyecta contexto semantico cuando se provee", () => {
    const ctx = "## Contexto semantico (busqueda: \"test\")\n[1] project:abc\n   \"Proyecto de prueba\"\n   (similitud: 95%)\n\n";
    const prompt = buildSystemPrompt(null, ctx, new Date("2026-07-02T10:00:00Z"));
    expect(prompt).toContain("Contexto semantico");
    expect(prompt).toContain("Proyecto de prueba");
    expect(prompt).toContain("similitud: 95%");
  });
});

describe("buildRagContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devuelve string vacio si no hay embeddings", async () => {
    const { loadEmbeddings } = await import("@/ai/rag/store");
    vi.mocked(loadEmbeddings).mockResolvedValue(new Map());

    const { buildRagContext } = await import("./systemPrompt");
    const result = await buildRagContext("test query", "fake-key");
    expect(result).toBe("");
  });
});
