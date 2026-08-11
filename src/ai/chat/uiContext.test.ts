import { describe, expect, it } from "vitest";
import {
  formatUiContextBlock,
  resolveUiContext,
  summarizeUiContext,
  type ResolveUiContextInput,
} from "./uiContext";

function input(over: Partial<ResolveUiContextInput> = {}): ResolveUiContextInput {
  return {
    pathname: "/app",
    search: "",
    getProject: () => null,
    getTask: () => null,
    ...over,
  };
}

describe("resolveUiContext", () => {
  it("devuelve section dashboard en /app exacto (CA-01.3)", () => {
    expect(resolveUiContext(input({ pathname: "/app" }))).toEqual({
      kind: "section",
      section: "dashboard",
    });
  });

  it("resuelve proyecto en /app/projects/:id (CA-01.1)", () => {
    const getProject = () => ({
      id: "p1",
      name: "Lanzamiento web",
      status: "active",
      health: "on-track",
    });
    const ctx = resolveUiContext(input({ pathname: "/app/projects/p1", getProject }));
    expect(ctx).toMatchObject({
      kind: "project",
      projectId: "p1",
      projectName: "Lanzamiento web",
      status: "active",
      health: "on-track",
    });
  });

  it("resuelve tarea cuando hay ?detail existente (CA-01.2)", () => {
    const getProject = () => ({ id: "p1", name: "Lanzamiento web", status: "active" });
    const getTask = () => ({
      id: "t1",
      title: "Redactar landing",
      status: "doing",
      priority: "high",
    });
    const ctx = resolveUiContext(
      input({
        pathname: "/app/projects/p1",
        search: "?detail=t1",
        getProject,
        getTask,
      }),
    );
    expect(ctx).toMatchObject({
      kind: "task",
      projectId: "p1",
      projectName: "Lanzamiento web",
      taskId: "t1",
      taskTitle: "Redactar landing",
      status: "doing",
      priority: "high",
    });
  });

  it("cae a proyecto si ?detail no existe como tarea (CA-01.4)", () => {
    const getProject = () => ({ id: "p1", name: "Lanzamiento web" });
    const getTask = () => null;
    const ctx = resolveUiContext(
      input({
        pathname: "/app/projects/p1",
        search: "?detail=NOPE",
        getProject,
        getTask,
      }),
    );
    expect(ctx.kind).toBe("project");
  });

  it("cae a sección projects si el id de proyecto no existe (CA-01.4)", () => {
    const ctx = resolveUiContext(
      input({ pathname: "/app/projects/garbage", getProject: () => null }),
    );
    expect(ctx).toEqual({ kind: "section", section: "projects" });
  });

  it("mapea prefijos conocidos a secciones (CA-01.3)", () => {
    expect(resolveUiContext(input({ pathname: "/app/products" }))).toEqual({
      kind: "section",
      section: "products",
    });
    expect(resolveUiContext(input({ pathname: "/app/settings" }))).toEqual({
      kind: "section",
      section: "settings",
    });
    expect(resolveUiContext(input({ pathname: "/app/library/templates" }))).toEqual({
      kind: "section",
      section: "library",
    });
  });

  it("devuelve none en rutas desconocidas", () => {
    expect(resolveUiContext(input({ pathname: "/otra-cosa" }))).toEqual({ kind: "none" });
  });

  it("no trata /app/projects (lista) como detalle", () => {
    // La ruta exacta de lista no matchea el regex de /:id
    expect(resolveUiContext(input({ pathname: "/app/projects" }))).toEqual({
      kind: "section",
      section: "projects",
    });
  });
});

describe("formatUiContextBlock", () => {
  it("vacío para none", () => {
    expect(formatUiContextBlock({ kind: "none" })).toBe("");
  });

  it("sección solo nombra la vista, sin inventar ids", () => {
    const block = formatUiContextBlock({ kind: "section", section: "dashboard" });
    expect(block).toContain("Contexto de pantalla actual");
    expect(block).toContain("Vista: dashboard");
    expect(block).not.toContain("Proyecto:");
  });

  it("proyecto incluye id, nombre, estado y salud", () => {
    const block = formatUiContextBlock({
      kind: "project",
      projectId: "p1",
      projectName: "Lanzamiento web",
      status: "active",
      health: "on-track",
    });
    expect(block).toContain("`p1`");
    expect(block).toContain("Lanzamiento web");
    expect(block).toContain("estado: active");
    expect(block).toContain("salud: on-track");
  });

  it("tarea incluye ids de proyecto y tarea + status y priority", () => {
    const block = formatUiContextBlock({
      kind: "task",
      projectId: "p1",
      projectName: "Lanzamiento web",
      taskId: "t1",
      taskTitle: "Redactar landing",
      status: "doing",
      priority: "high",
    });
    expect(block).toContain("`p1`");
    expect(block).toContain("`t1`");
    expect(block).toContain("status: doing");
    expect(block).toContain("priority: high");
  });
});

describe("summarizeUiContext (chip de header)", () => {
  it("proyecto", () => {
    expect(
      summarizeUiContext({
        kind: "project",
        projectId: "p1",
        projectName: "Lanzamiento web",
      }),
    ).toEqual({ primary: "Proyecto", secondary: "Lanzamiento web" });
  });

  it("tarea", () => {
    expect(
      summarizeUiContext({
        kind: "task",
        projectId: "p1",
        projectName: "Lanzamiento web",
        taskId: "t1",
        taskTitle: "Redactar landing",
      }),
    ).toEqual({ primary: "Tarea", secondary: "Redactar landing" });
  });

  it("none no aporta nada", () => {
    expect(summarizeUiContext({ kind: "none" })).toEqual({});
  });
});
