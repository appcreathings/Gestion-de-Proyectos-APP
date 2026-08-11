import { describe, expect, it } from "vitest";
import type { UiContext } from "./uiContext";
import { selectFollowUps, selectQuickActions } from "./quickActions";

const projectCtx: UiContext = {
  kind: "project",
  projectId: "p1",
  projectName: "Lanzamiento web",
};
const taskCtx: UiContext = {
  kind: "task",
  projectId: "p1",
  projectName: "Lanzamiento web",
  taskId: "t1",
  taskTitle: "Redactar landing",
};
const globalCtx: UiContext = { kind: "none" };

describe("selectQuickActions — composer", () => {
  it("sin contexto (dashboard): chips globales (CA-02.5)", () => {
    const ids = selectQuickActions(globalCtx, "composer").map((a) => a.id);
    expect(ids).toContain("day-summary");
    expect(ids).toContain("stalled");
    expect(ids).toContain("overdue");
    // No aparecen chips de proyecto sin contexto
    expect(ids).not.toContain("project-summary");
  });

  it("con proyecto: incluye resumen, riesgos y crear tarea (CA-02.3)", () => {
    const actions = selectQuickActions(projectCtx, "composer");
    const ids = actions.map((a) => a.id);
    expect(ids).toContain("project-summary");
    expect(ids).toContain("project-risks");
    expect(ids).toContain("create-task-here");
    // Los prompts interpolan el id real
    expect(actions.find((a) => a.id === "project-summary")?.prompt).toContain("`p1`");
  });

  it("con tarea: incluye resumir, subtareas y mejorar descripción (CA-02.4)", () => {
    const actions = selectQuickActions(taskCtx, "composer");
    const ids = actions.map((a) => a.id);
    expect(ids).toContain("task-summary");
    expect(ids).toContain("task-subtasks");
    expect(ids).toContain("task-improve-desc");
    expect(actions.find((a) => a.id === "task-summary")?.prompt).toContain("`t1`");
  });

  it("no devuelve más de 6 chips (CA-02.2)", () => {
    expect(selectQuickActions(projectCtx, "composer").length).toBeLessThanOrEqual(6);
    expect(selectQuickActions(taskCtx, "composer").length).toBeLessThanOrEqual(6);
    expect(selectQuickActions(globalCtx, "composer").length).toBeLessThanOrEqual(6);
  });

  it("los chips de resumen/atajo marcan skipRag (D7)", () => {
    const actions = selectQuickActions(globalCtx, "composer");
    for (const a of actions) {
      expect(a.skipRag).toBe(true);
    }
  });
});

describe("selectQuickActions — empty", () => {
  it("vacío en dashboard trae globales marcados empty", () => {
    const ids = selectQuickActions(globalCtx, "empty").map((a) => a.id);
    expect(ids).toContain("day-summary");
    expect(ids).toContain("stalled");
  });

  it("vacío en proyecto también muestra chips globales de empty", () => {
    // El slot empty siempre muestra los marcados `empty` (mínimo global útil),
    // aunque haya proyecto — el composer ya muestra los específicos.
    const ids = selectQuickActions(projectCtx, "empty").map((a) => a.id);
    expect(ids).toContain("day-summary");
  });
});

describe("selectFollowUps", () => {
  it("siempre devuelve al menos 2 (CA-04.4)", () => {
    expect(selectFollowUps(globalCtx, "cosas raras").length).toBeGreaterThanOrEqual(2);
  });

  it("con texto sobre resumen en global → follow-up de vencidos", () => {
    const actions = selectFollowUps(globalCtx, "dame el resumen del día");
    const ids = actions.map((a) => a.id);
    expect(ids).toContain("fu-global-overdue");
  });

  it("con texto sobre vencidos en global → follow-up de estancados", () => {
    const ids = selectFollowUps(globalCtx, "listá los vencidos").map((a) => a.id);
    expect(ids).toContain("fu-global-stalled");
  });

  it("con proyecto y pedido de resumen → follow-up de bloqueadas", () => {
    const ids = selectFollowUps(projectCtx, "resumen de este proyecto").map((a) => a.id);
    expect(ids).toContain("fu-proj-blocked");
  });

  it("con tarea y pedido de subtareas → follow-up de prioridad", () => {
    const ids = selectFollowUps(taskCtx, "proponé subtareas").map((a) => a.id);
    expect(ids).toContain("fu-task-priority");
  });

  it("follow-ups genéricos siempre presentes al final", () => {
    const actions = selectFollowUps(globalCtx, "listá los vencidos");
    const lastTwo = actions.slice(-2).map((a) => a.id);
    expect(lastTwo).toContain("follow-deepen");
    expect(lastTwo).toContain("follow-what-else");
  });

  it("máximo 4 follow-ups", () => {
    expect(selectFollowUps(taskCtx, "plan de subtareas").length).toBeLessThanOrEqual(4);
  });
});
