import { describe, expect, it } from "vitest";
import { emptyWorkspace, type WorkspaceIndex } from "@/domain/schemas";
import type { UiContext } from "@/ai/chat/uiContext";
import { selectWorkspaceIndex } from "./workspaceIndex";

function fixtureIndex(): WorkspaceIndex {
  return {
    ...emptyWorkspace().index,
    products: [{ id: "prod1", name: "Prod", status: "active" }],
    projects: [
      {
        id: "p-alpha",
        name: "Alpha",
        productId: "prod1",
        status: "active",
        health: "green",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "p-beta",
        name: "Beta",
        productId: null,
        status: "active",
        health: "green",
        updatedAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    types: [{ id: "ty1", name: "Tipo Lanzamiento" }],
    templates: [{ id: "ct1", name: "Checklist QA" }],
    processTemplates: [{ id: "pt1", name: "SOP Publicacion" }],
  };
}

function names(entries: { name: string }[]): string[] {
  return entries.map((e) => e.name);
}

describe("selectWorkspaceIndex", () => {
  it("con foco project de Alpha deja solo ese proyecto, el producto padre y templates vacios", () => {
    const index = fixtureIndex();
    const uiCtx: UiContext = {
      kind: "project",
      projectId: "p-alpha",
      projectName: "Alpha",
    };
    const result = selectWorkspaceIndex(index, uiCtx);
    expect(names(result.projects)).toEqual(["Alpha"]);
    expect(names(result.products)).toEqual(["Prod"]);
    expect(result.templates).toEqual([]);
    expect(result.types).toEqual([]);
    expect(result.processTemplates).toEqual([]);
  });

  it("con dashboard deja ambos proyectos y products, sin templates", () => {
    const index = fixtureIndex();
    const uiCtx: UiContext = { kind: "section", section: "dashboard" };
    const result = selectWorkspaceIndex(index, uiCtx);
    expect(names(result.projects)).toEqual(["Alpha", "Beta"]);
    expect(names(result.products)).toEqual(["Prod"]);
    expect(result.templates).toEqual([]);
    expect(result.types).toEqual([]);
    expect(result.processTemplates).toEqual([]);
  });

  it("no muta el indice de entrada", () => {
    const index = fixtureIndex();
    const snapshot = structuredClone(index);
    selectWorkspaceIndex(index, {
      kind: "project",
      projectId: "p-alpha",
      projectName: "Alpha",
    });
    expect(index).toEqual(snapshot);
  });

  it("devuelve un objeto nuevo (no reusa la referencia del input)", () => {
    const index = fixtureIndex();
    const result = selectWorkspaceIndex(index, {
      kind: "section",
      section: "dashboard",
    });
    expect(result).not.toBe(index);
    expect(result.projects).not.toBe(index.projects);
    result.projects.pop();
    expect(index.projects).toHaveLength(2);
  });

  it("con foco task recorta igual que project", () => {
    const result = selectWorkspaceIndex(fixtureIndex(), {
      kind: "task",
      projectId: "p-alpha",
      projectName: "Alpha",
      taskId: "t1",
      taskTitle: "Redactar",
    });
    expect(names(result.projects)).toEqual(["Alpha"]);
    expect(names(result.products)).toEqual(["Prod"]);
    expect(result.templates).toEqual([]);
  });

  it("sin productId no incluye productos", () => {
    const result = selectWorkspaceIndex(fixtureIndex(), {
      kind: "project",
      projectId: "p-beta",
      projectName: "Beta",
    });
    expect(names(result.projects)).toEqual(["Beta"]);
    expect(result.products).toEqual([]);
  });

  it("section products deja solo productos", () => {
    const result = selectWorkspaceIndex(fixtureIndex(), {
      kind: "section",
      section: "products",
    });
    expect(result.projects).toEqual([]);
    expect(names(result.products)).toEqual(["Prod"]);
    expect(result.templates).toEqual([]);
  });

  it("section projects deja solo proyectos", () => {
    const result = selectWorkspaceIndex(fixtureIndex(), {
      kind: "section",
      section: "projects",
    });
    expect(names(result.projects)).toEqual(["Alpha", "Beta"]);
    expect(result.products).toEqual([]);
    expect(result.templates).toEqual([]);
  });

  it("section library deja types, templates y processTemplates", () => {
    const result = selectWorkspaceIndex(fixtureIndex(), {
      kind: "section",
      section: "library",
    });
    expect(result.projects).toEqual([]);
    expect(result.products).toEqual([]);
    expect(names(result.types)).toEqual(["Tipo Lanzamiento"]);
    expect(names(result.templates)).toEqual(["Checklist QA"]);
    expect(names(result.processTemplates)).toEqual(["SOP Publicacion"]);
  });

  it.each(["my-tasks", "daily", "flows", "automations", "settings"] as const)(
    "section %s deja projects + products (portafolio)",
    (section) => {
      const result = selectWorkspaceIndex(fixtureIndex(), {
        kind: "section",
        section,
      });
      expect(names(result.projects)).toEqual(["Alpha", "Beta"]);
      expect(names(result.products)).toEqual(["Prod"]);
      expect(result.templates).toEqual([]);
      expect(result.types).toEqual([]);
    },
  );

  it("kind none deja projects + products", () => {
    const result = selectWorkspaceIndex(fixtureIndex(), { kind: "none" });
    expect(names(result.projects)).toEqual(["Alpha", "Beta"]);
    expect(names(result.products)).toEqual(["Prod"]);
    expect(result.templates).toEqual([]);
  });
});
