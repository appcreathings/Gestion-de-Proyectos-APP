import { describe, expect, it } from "vitest";
import { expandSlash, findSlashCommand, listSlashCommands, parseSlashInput } from "./slashCommands";
import type { UiContext } from "./uiContext";

const projectCtx: UiContext = {
  kind: "project",
  projectId: "p1",
  projectName: "Lanzamiento web",
  status: "active",
  health: "on-track",
};
const taskCtx: UiContext = {
  kind: "task",
  projectId: "p1",
  projectName: "Lanzamiento web",
  taskId: "t1",
  taskTitle: "Redactar landing",
  status: "doing",
  priority: "high",
};
const globalCtx: UiContext = { kind: "none" };

describe("parseSlashInput", () => {
  it("detecta comando simple", () => {
    expect(parseSlashInput("/resumen")).toEqual({ kind: "command", name: "resumen", rest: "" });
  });

  it("separa comando y resto con args", () => {
    expect(parseSlashInput("/crear-tarea bug en login")).toEqual({
      kind: "command",
      name: "crear-tarea",
      rest: "bug en login",
    });
  });

  it("texto plano sin barra → plain", () => {
    expect(parseSlashInput("hola que tal")).toEqual({ kind: "plain", text: "hola que tal" });
  });

  it("no confunde 'no/empezó con /'", () => {
    expect(parseSlashInput("texto / con barra en el medio")).toMatchObject({ kind: "plain" });
  });
});

describe("expandSlash", () => {
  it("/resumen con proyecto interpola el id (CA-03.2)", () => {
    const { text, skipRag, wasCommand } = expandSlash("/resumen", projectCtx);
    expect(wasCommand).toBe(true);
    expect(skipRag).toBe(true); // CA-03.5
    expect(text).toContain("`p1`");
    expect(text.toLowerCase()).not.toContain("portafolio");
  });

  it("/resumen sin proyecto expande a portafolio (CA-03.2)", () => {
    const { text } = expandSlash("/resumen", globalCtx);
    expect(text.toLowerCase()).toContain("portafolio");
  });

  it("/crear-tarea con proyecto y args", () => {
    const { text } = expandSlash("/crear-tarea bug en login", taskCtx);
    expect(text).toContain("`p1`");
    expect(text).toContain("bug en login");
  });

  it("/crear-tarea sin args pide título", () => {
    const { text } = expandSlash("/crear-tarea", projectCtx);
    expect(text.toLowerCase()).toContain("título");
  });

  it("comando desconocido se envía literal, sin skipRag (CA-03.3)", () => {
    const { text, skipRag, wasCommand } = expandSlash("/foo-bar algo", globalCtx);
    expect(wasCommand).toBe(false);
    expect(skipRag).toBe(false);
    expect(text).toBe("/foo-bar algo");
  });

  it("texto plano pasa tal cual, sin skipRag", () => {
    const { text, skipRag, wasCommand } = expandSlash("dame un reporte", projectCtx);
    expect(wasCommand).toBe(false);
    expect(skipRag).toBe(false);
    expect(text).toBe("dame un reporte");
  });

  it("/vencidos con contexto nombra el proyecto; sin contexto lista todo", () => {
    expect(expandSlash("/vencidos", projectCtx).text).toContain("`p1`");
    expect(expandSlash("/vencidos", globalCtx).text.toLowerCase()).toContain("portafolio");
  });

  it("/salud con y sin contexto", () => {
    expect(expandSlash("/salud", projectCtx).text).toContain("`p1`");
    expect(expandSlash("/salud", globalCtx).text.toLowerCase()).toContain("estancados");
  });

  it("/ayuda genera prompt corto", () => {
    const { text, skipRag } = expandSlash("/ayuda", globalCtx);
    expect(text.length).toBeGreaterThan(10);
    expect(skipRag).toBe(true);
  });
});

describe("catálogo", () => {
  it("lista incluye los comandos mínimos v1 (CA-03.1)", () => {
    const names = listSlashCommands().map((c) => c.name);
    for (const required of ["ayuda", "resumen", "vencidos", "salud", "crear-tarea"]) {
      expect(names).toContain(required);
    }
  });

  it("findSlashCommand normaliza minúsculas", () => {
    expect(findSlashCommand("RESUMEN")?.name).toBe("resumen");
    expect(findSlashCommand("inexistente")).toBeNull();
  });
});
