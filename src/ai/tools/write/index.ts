import type { AiTool, ToolContext } from "../types";
import { createTaskWriteTools } from "./task";
import { createProjectWriteTools } from "./project";
import { createAreaWriteTools } from "./area";
import { createChecklistWriteTools } from "./checklist";
import { createTemplateWriteTools } from "./template";
import { createPersonWriteTools } from "./person";
import { createAutomationWriteTools } from "./automation";
import { createNotificationWriteTools } from "./notification";
import { createProductWriteTools } from "./product";

export function createWriteTools(ctx: ToolContext): AiTool[] {
  return [
    ...createTaskWriteTools(ctx),
    ...createProjectWriteTools(ctx),
    ...createAreaWriteTools(ctx),
    ...createChecklistWriteTools(ctx),
    ...createTemplateWriteTools(ctx),
    ...createPersonWriteTools(ctx),
    ...createAutomationWriteTools(ctx),
    ...createNotificationWriteTools(ctx),
    ...createProductWriteTools(ctx),
  ];
}
