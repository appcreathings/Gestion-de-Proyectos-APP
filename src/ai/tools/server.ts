import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { AiTool } from "./types";
import { toMcpTool } from "./schema";
import type { ToolCallResult } from "./registry";

export function createMcpServer(
  tools: AiTool[],
  callToolImpl: (
    name: string,
    args: unknown,
  ) => Promise<ToolCallResult>,
) {
  const server = new Server(
    { name: "gestion-proyectos-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: tools.map(toMcpTool),
  }));

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request) => {
      const params = request.params as {
        name?: string;
        arguments?: Record<string, unknown>;
      };
      const name = params.name ?? "";
      const rawArgs = params.arguments ?? {};
      const result = await callToolImpl(name, rawArgs);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result.result ?? result.error),
          },
        ],
        isError: !result.ok,
      };
    },
  );

  return {
    server,
    async connect() {
      const transport = new StdioServerTransport();
      await server.connect(transport);
    },
  };
}
