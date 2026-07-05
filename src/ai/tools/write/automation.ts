import { z } from "zod";
import { newAutomation } from "@/domain/factories";
import {
  ActionSchema,
  ConditionSchema,
  ScopeSchema,
  TriggerSchema,
} from "@/domain/schemas";
import type { AutomationRule } from "@/domain/schemas";
import { automationView } from "../serializers";
import { defineTool, type AiTool, type ToolContext } from "../types";
import { automationName } from "../glossary";

export function createAutomationWriteTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "create_automation",
      description:
        "Crea una regla de automatización (disparador → condiciones → acciones). Usa list_automations para revisar reglas existentes y evitar duplicados.",
      mode: "write",
      input: z.object({
        name: z.string().min(1),
        enabled: z.boolean().optional(),
        scope: ScopeSchema.optional().describe("Por defecto ámbito global"),
        trigger: TriggerSchema,
        conditions: z.array(ConditionSchema).optional(),
        actions: z.array(ActionSchema).min(1),
      }),
      describeCall: (a) => `Crear automatización "${a.name}" (disparador: ${a.trigger.type})`,
      execute: async (a) => {
        const rule: AutomationRule = newAutomation(a.name);
        if (a.enabled !== undefined) rule.enabled = a.enabled;
        if (a.scope) rule.scope = a.scope;
        rule.trigger = a.trigger;
        if (a.conditions) rule.conditions = a.conditions;
        rule.actions = a.actions;
        await actions.createAutomation(rule);
        return automationView(rule);
      },
    }),

    defineTool({
      name: "update_automation",
      description:
        "Actualiza una regla de automatización existente (nombre, activa/inactiva, ámbito, disparador, condiciones, acciones).",
      mode: "write",
      input: z.object({
        automationId: z.string(),
        name: z.string().optional(),
        enabled: z.boolean().optional(),
        scope: ScopeSchema.optional(),
        trigger: TriggerSchema.optional(),
        conditions: z.array(ConditionSchema).optional(),
        actions: z.array(ActionSchema).min(1).optional(),
      }),
      describeCall: (a) => `Actualizar automatización "${automationName(ctx, a.automationId)}"`,
      execute: async (a) => {
        const rule = getData().automations.find((x) => x.id === a.automationId);
        if (!rule) throw new Error(`Automatización no encontrada: ${a.automationId}`);
        const next = {
          ...rule,
          ...(a.name !== undefined && { name: a.name }),
          ...(a.enabled !== undefined && { enabled: a.enabled }),
          ...(a.scope !== undefined && { scope: a.scope }),
          ...(a.trigger !== undefined && { trigger: a.trigger }),
          ...(a.conditions !== undefined && { conditions: a.conditions }),
          ...(a.actions !== undefined && { actions: a.actions }),
        };
        await actions.updateAutomation(next);
        return automationView(next);
      },
    }),

    defineTool({
      name: "delete_automation",
      description: "Elimina una regla de automatización. Requiere confirmación.",
      mode: "write",
      input: z.object({ automationId: z.string() }),
      describeCall: (a) => `Eliminar la automatización "${automationName(ctx, a.automationId)}"`,
      execute: async (a) => {
        if (!getData().automations.find((x) => x.id === a.automationId))
          throw new Error(`Automatización no encontrada: ${a.automationId}`);
        await actions.deleteAutomation(a.automationId);
        return { ok: true };
      },
    }),
  ];
}
