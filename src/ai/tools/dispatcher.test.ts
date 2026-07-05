import { describe, expect, it, vi } from "vitest";
import { newProject } from "@/domain/factories";
import { emptyWorkspace } from "@/domain/schemas";
import { createAiTools, callTool } from "./registry";
import type { ToolContext, ToolData } from "./types";

function makeCtx() {
  const data: ToolData = {
    products: [],
    projects: [newProject("Demo")],
    people: [],
    checklistTemplates: [],
    processTemplates: [],
    projectTypes: [],
    automations: [],
    notifications: [],
  };
  const ctx: ToolContext = {
    getData: () => data,
    getWorkspace: () => emptyWorkspace(),
    actions: {
      mutateProject: vi.fn(),
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
  return ctx;
}

describe("dispatcher", () => {
  it("rechaza herramienta desconocida con error legible", async () => {
    const ctx = makeCtx();
    const res = await callTool(createAiTools(ctx), "no_existe", {});
    expect(res.ok).toBe(false);
    expect(res.error).toContain("no_existe");
  });

  it("rechaza args inválidos devolviendo el detalle de Zod (no lanza)", async () => {
    const ctx = makeCtx();
    const res = await callTool(createAiTools(ctx), "create_task", { title: "x" });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("projectId");
  });

  it("devuelve error de ejecución como dato (proyecto inexistente)", async () => {
    const ctx = makeCtx();
    const res = await callTool(createAiTools(ctx), "get_project", {
      projectId: "nope",
    });
    expect(res.ok).toBe(false);
    expect(res.error).toContain("nope");
  });
});
