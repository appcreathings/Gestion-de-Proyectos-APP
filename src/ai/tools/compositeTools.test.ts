import { describe, expect, it, vi } from "vitest";
import {
  newArea,
  newChecklist,
  newItem,
  newProject,
  newProjectType,
  newTask,
} from "@/domain/factories";
import { emptyWorkspace } from "@/domain/schemas";
import type { Project, ProjectType } from "@/domain/schemas";
import { createAiTools, callTool } from "./registry";
import type { ToolContext, ToolData } from "./types";

function seededCtx(overrides?: {
  project?: Partial<Project>;
  projectType?: Partial<ProjectType>;
}) {
  const area = newArea("Lanzamiento");
  const cl = newChecklist("QA");
  cl.items = [
    newItem("Probar build", true),
    newItem("Avisar al equipo", false),
    newItem("Desplegar", true),
  ];
  area.checklists = [cl];
  const today = new Date();
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(today.getDate() - 3);
  const fiveDaysFromNow = new Date(today);
  fiveDaysFromNow.setDate(today.getDate() + 5);
  const task = { ...newTask("Deploy"), dueDate: threeDaysAgo.toISOString().slice(0, 10) };

  const project: Project = {
    ...newProject("Demo"),
    areas: [area],
    tasks: [task],
    ...overrides?.project,
  };

  const projectType: ProjectType = {
    ...newProjectType("Tipo Demo"),
    defaultAreas: [
      { name: "QA", icon: "test-tube", checklistTemplateIds: [], processTemplateIds: [] },
    ],
    ...overrides?.projectType,
  };

  const data: ToolData = {
    products: [],
    projects: [project],
    people: [],
    checklistTemplates: [],
    processTemplates: [],
    projectTypes: [projectType],
    automations: [],
    notifications: [],
  };

  const mutateProject = vi.fn(async (id: string, recipe: (p: Project) => Project) => {
    data.projects = data.projects.map((p) => (p.id === id ? recipe(p) : p));
  });

  const ctx: ToolContext = {
    getData: () => data,
    getWorkspace: () => emptyWorkspace(),
    actions: {
      mutateProject,
      saveProject: vi.fn(),
      createProject: vi.fn(),
      createProjectFromType: vi.fn(),
      deleteProject: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      createChecklistTemplate: vi.fn(),
      updateChecklistTemplate: vi.fn(),
      deleteChecklistTemplate: vi.fn(),
      createProcessTemplate: vi.fn(),
      updateProcessTemplate: vi.fn(),
      deleteProcessTemplate: vi.fn(),
      createProjectType: vi.fn(),
      updateProjectType: vi.fn(),
      deleteProjectType: vi.fn(),
      createAutomation: vi.fn(),
      updateAutomation: vi.fn(),
      deleteAutomation: vi.fn(),
      createPerson: vi.fn(),
      updatePerson: vi.fn(),
      deletePerson: vi.fn(),
      addNotifications: vi.fn(),
      markNotificationRead: vi.fn(),
      markAllNotificationsRead: vi.fn(),
      clearNotifications: vi.fn(),
    },
  };
  return { ctx, mutateProject, project, area, cl, projectType };
}

describe("composite tools", () => {
  it("summarize_project_health devuelve KPIs sin mutar", async () => {
    const { ctx, project } = seededCtx();
    const res = await callTool(createAiTools(ctx), "summarize_project_health", {
      projectId: project.id,
    });
    expect(res.ok).toBe(true);
    const r = res.result as {
      project: { name: string };
      areas: { name: string; progressPct: number }[];
      totals: { overdueItems: number; requiredIncomplete: number };
    };
    expect(r.project.name).toBe("Demo");
    expect(r.areas[0].name).toBe("Lanzamiento");
    expect(r.totals.overdueItems).toBe(0);
    expect(r.totals.requiredIncomplete).toBe(2);
  });

  it("complete_checklist mode=all marca todos los ítems", async () => {
    const { ctx, mutateProject, project, area, cl } = seededCtx();
    const tools = createAiTools(ctx);

    const all = await callTool(tools, "complete_checklist", {
      projectId: project.id,
      areaId: area.id,
      checklistId: cl.id,
      mode: "all",
    });
    expect(all.ok).toBe(true);
    expect((all.result as { marked: number }).marked).toBe(3);
    expect(mutateProject).toHaveBeenCalledTimes(3);

    const updated = ctx.getData().projects[0].areas[0].checklists[0].items;
    expect(updated.every((i) => i.done)).toBe(true);
  });

  it("complete_checklist mode=required marca solo obligatorios", async () => {
    const { ctx, project, area, cl } = seededCtx();
    const tools = createAiTools(ctx);

    const required = await callTool(tools, "complete_checklist", {
      projectId: project.id,
      areaId: area.id,
      checklistId: cl.id,
      mode: "required",
    });
    expect(required.ok).toBe(true);
    expect((required.result as { marked: number }).marked).toBe(2);

    const updated = ctx.getData().projects[0].areas[0].checklists[0].items;
    expect(updated.filter((i) => i.done).length).toBe(2);
  });

  it("complete_checklist con projectId inválido da error", async () => {
    const { ctx, area, cl } = seededCtx();
    const tools = createAiTools(ctx);

    const bad = await callTool(tools, "complete_checklist", {
      projectId: "nope",
      areaId: area.id,
      checklistId: cl.id,
      mode: "all",
    });
    expect(bad.ok).toBe(false);
    expect(bad.error).toContain("nope");
  });

  it("apply_type_to_project agrega áreas faltantes vía mutateProject", async () => {
    const { ctx, mutateProject, project, projectType } = seededCtx();
    const res = await callTool(createAiTools(ctx), "apply_type_to_project", {
      projectId: project.id,
      typeId: projectType.id,
    });
    expect(res.ok).toBe(true);
    const r = res.result as { addedAreas: { name: string }[] };
    expect(r.addedAreas.length).toBe(1);
    expect(r.addedAreas[0].name).toBe("QA");
    expect(mutateProject).toHaveBeenCalled();

    const bad = await callTool(createAiTools(ctx), "apply_type_to_project", {
      projectId: "nope",
      typeId: projectType.id,
    });
    expect(bad.ok).toBe(false);
    expect(bad.error).toContain("nope");
  });
});
