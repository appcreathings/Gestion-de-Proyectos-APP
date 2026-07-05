import type { AiTool, ToolContext } from "../types";
import { createWorkspaceReadTools } from "./workspace";
import { createProductReadTools } from "./product";
import { createProjectReadTools } from "./project";
import { createTaskReadTools } from "./task";
import { createTemplateReadTools } from "./template";
import { createPeopleReadTools } from "./people";
import { createAutomationReadTools } from "./automation";
import { createNotificationReadTools } from "./notification";

export function createReadTools(ctx: ToolContext): AiTool[] {
  return [
    ...createWorkspaceReadTools(ctx),
    ...createProductReadTools(ctx),
    ...createProjectReadTools(ctx),
    ...createTaskReadTools(ctx),
    ...createTemplateReadTools(ctx),
    ...createPeopleReadTools(ctx),
    ...createAutomationReadTools(ctx),
    ...createNotificationReadTools(ctx),
  ];
}
