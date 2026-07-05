#!/usr/bin/env node

// Servidor MCP de sólo lectura.
// Para usar el asistente con datos reales use el panel interno Cmd/Ctrl+J.

import { createMcpServer } from "../src/ai/tools/server";
import { createAiTools, callTool } from "../src/ai/tools/registry";

const ctx = {
  getData: () => ({
    products: [],
    projects: [],
    people: [],
    checklistTemplates: [],
    processTemplates: [],
    projectTypes: [],
    automations: [],
    notifications: [],
  }),
  getWorkspace: () => null,
  actions: {
    mutateProject: () => {
      throw new Error("read-only: mutateProject no disponible en modo MCP");
    },
    saveProject: () => {
      throw new Error("read-only: saveProject no disponible en modo MCP");
    },
    createProject: () => {
      throw new Error("read-only: createProject no disponible en modo MCP");
    },
    createProjectFromType: () => {
      throw new Error("read-only: createProjectFromType no disponible en modo MCP");
    },
    deleteProject: () => {
      throw new Error("read-only: deleteProject no disponible en modo MCP");
    },
    createProduct: () => {
      throw new Error("read-only: createProduct no disponible en modo MCP");
    },
    updateProduct: () => {
      throw new Error("read-only: updateProduct no disponible en modo MCP");
    },
    deleteProduct: () => {
      throw new Error("read-only: deleteProduct no disponible en modo MCP");
    },
    createChecklistTemplate: () => {
      throw new Error("read-only: createChecklistTemplate no disponible en modo MCP");
    },
    updateChecklistTemplate: () => {
      throw new Error("read-only: updateChecklistTemplate no disponible en modo MCP");
    },
    deleteChecklistTemplate: () => {
      throw new Error("read-only: deleteChecklistTemplate no disponible en modo MCP");
    },
    createProcessTemplate: () => {
      throw new Error("read-only: createProcessTemplate no disponible en modo MCP");
    },
    updateProcessTemplate: () => {
      throw new Error("read-only: updateProcessTemplate no disponible en modo MCP");
    },
    deleteProcessTemplate: () => {
      throw new Error("read-only: deleteProcessTemplate no disponible en modo MCP");
    },
    createProjectType: () => {
      throw new Error("read-only: createProjectType no disponible en modo MCP");
    },
    updateProjectType: () => {
      throw new Error("read-only: updateProjectType no disponible en modo MCP");
    },
    deleteProjectType: () => {
      throw new Error("read-only: deleteProjectType no disponible en modo MCP");
    },
    createAutomation: () => {
      throw new Error("read-only: createAutomation no disponible en modo MCP");
    },
    updateAutomation: () => {
      throw new Error("read-only: updateAutomation no disponible en modo MCP");
    },
    deleteAutomation: () => {
      throw new Error("read-only: deleteAutomation no disponible en modo MCP");
    },
    createPerson: () => {
      throw new Error("read-only: createPerson no disponible en modo MCP");
    },
    updatePerson: () => {
      throw new Error("read-only: updatePerson no disponible en modo MCP");
    },
    deletePerson: () => {
      throw new Error("read-only: deletePerson no disponible en modo MCP");
    },
    addNotifications: () => {
      throw new Error("read-only: addNotifications no disponible en modo MCP");
    },
    markNotificationRead: () => {
      throw new Error("read-only: markNotificationRead no disponible en modo MCP");
    },
    markAllNotificationsRead: () => {
      throw new Error("read-only: markAllNotificationsRead no disponible en modo MCP");
    },
    clearNotifications: () => {
      throw new Error("read-only: clearNotifications no disponible en modo MCP");
    },
  },
};

const tools = createAiTools(ctx);
const mcp = createMcpServer(tools, (name, args) => callTool(tools, name, args));

console.error("[mcp-server] Starting MCP server (read-only fixtures)...");
await mcp.connect();
console.error("[mcp-server] Connected via stdio");
