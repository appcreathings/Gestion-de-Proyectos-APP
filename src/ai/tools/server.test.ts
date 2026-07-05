import { describe, expect, it, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { emptyWorkspace } from "@/domain/schemas";
import { createAiTools, callTool } from "./registry";
import { createMcpServer } from "./server";
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

describe("MCP server", () => {
  async function setup() {
    const ctx = makeCtx();
    const tools = createAiTools(ctx);
    const { server } = createMcpServer(tools, (name, args) =>
      callTool(tools, name, args),
    );

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    const client = new Client(
      { name: "test-client", version: "0.0.1" },
      { capabilities: {} },
    );

    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    return { client, server };
  }

  it("tools/list devuelve tool names", async () => {
    const { client } = await setup();
    const result = await client.listTools();
    const names = result.tools.map((t) => t.name);
    expect(names).toContain("get_workspace_overview");
    expect(names).toContain("create_task");
    expect(names).toContain("summarize_project_health");
    expect(names.length).toBeGreaterThan(45);
  });

  it("tools/call con args válidas devuelve ok, inválidas devuelve isError", async () => {
    const { client } = await setup();

    const res = await client.callTool({
      name: "get_workspace_overview",
      arguments: {},
    });
    expect(res.isError).toBeFalsy();
    const content = res.content as { type: string; text: string }[];
    expect(content[0].type).toBe("text");

    const bad = await client.callTool({
      name: "create_task",
      arguments: { title: "x" },
    });
    expect(bad.isError).toBe(true);
  });
});
