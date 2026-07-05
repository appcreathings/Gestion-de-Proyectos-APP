import { describe, expect, it, vi } from "vitest";
import { emptyWorkspace } from "@/domain/schemas";
import { createAiTools, getFunctionDeclarations } from "./registry";
import type { ToolContext, ToolData } from "./types";

function makeCtx() {
  const data: ToolData = {
    products: [],
    projects: [],
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

describe("names and shapes", () => {
  it("todos los nombres snake_case únicos; schemas sin $ref; required correcto", () => {
    const ctx = makeCtx();
    const tools = createAiTools(ctx);

    const names = tools.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    for (const n of names) expect(n).toMatch(/^[a-z][a-z0-9_]*$/);

    const decls = getFunctionDeclarations(tools);
    const json = JSON.stringify(decls);
    expect(json).not.toContain("$ref");
    expect(json).not.toContain("$schema");

    const createTask = decls.find((d) => d.name === "create_task")!;
    const params = createTask.parametersJsonSchema as {
      type: string;
      required?: string[];
    };
    expect(params.type).toBe("object");
    expect(params.required).toEqual(expect.arrayContaining(["projectId", "title"]));
    expect(params.required).not.toContain("dueDate");
  });
});
