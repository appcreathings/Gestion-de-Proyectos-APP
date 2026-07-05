import { z } from "zod";
import { newItem } from "@/domain/factories";
import * as ops from "@/domain/projectOps";
import { defineTool, type AiTool, type ToolContext } from "../types";
import { projectName } from "../glossary";

const DayDateInput = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato requerido: YYYY-MM-DD");

export function createChecklistWriteTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "set_checklist_item",
      description:
        "Marca o desmarca un ítem de checklist. Usa get_project para obtener areaId, checklistId e itemId.",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        areaId: z.string(),
        checklistId: z.string(),
        itemId: z.string(),
        done: z.boolean(),
      }),
      describeCall: (a) => {
        const p = getData().projects.find((x) => x.id === a.projectId);
        const item = p?.areas
          .find((x) => x.id === a.areaId)
          ?.checklists.find((c) => c.id === a.checklistId)
          ?.items.find((i) => i.id === a.itemId);
        return `${a.done ? "Marcar" : "Desmarcar"} el ítem "${item?.text ?? a.itemId}" en "${p?.name ?? a.projectId}"`;
      },
      execute: async (a) => {
        const project = getData().projects.find((x) => x.id === a.projectId);
        if (!project) throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        const item = project.areas
          .find((x) => x.id === a.areaId)
          ?.checklists.find((c) => c.id === a.checklistId)
          ?.items.find((i) => i.id === a.itemId);
        if (!item) throw new Error(`Ítem no encontrado: ${a.itemId}`);
        await actions.mutateProject(a.projectId, (p) =>
          ops.updateItem(p, a.areaId, a.checklistId, { ...item, done: a.done }),
        );
        return { ok: true, item: { id: item.id, text: item.text, done: a.done } };
      },
    }),

    defineTool({
      name: "add_checklist_item",
      description:
        "Añade un ítem a un checklist existente. Usa get_project para obtener areaId y checklistId.",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        areaId: z.string(),
        checklistId: z.string(),
        text: z.string().min(1),
        required: z.boolean().optional(),
      }),
      describeCall: (a) => `Añadir ítem "${a.text}" al checklist en "${projectName(ctx, a.projectId)}"`,
      execute: async (a) => {
        if (!getData().projects.find((x) => x.id === a.projectId))
          throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        const item = newItem(a.text, a.required ?? false);
        await actions.mutateProject(a.projectId, (p) =>
          ops.addItem(p, a.areaId, a.checklistId, item),
        );
        return { ok: true, item: { id: item.id, text: item.text } };
      },
    }),

    defineTool({
      name: "update_checklist_item",
      description:
        "Actualiza un ítem de checklist (texto, obligatoriedad, estado, fecha, responsable, notas). Usa get_project para los ids.",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        areaId: z.string(),
        checklistId: z.string(),
        itemId: z.string(),
        text: z.string().optional(),
        required: z.boolean().optional(),
        done: z.boolean().optional(),
        dueDate: DayDateInput.nullable().optional(),
        assigneeId: z.string().nullable().optional(),
        notes: z.string().optional(),
      }),
      describeCall: (a) => {
        const item = getData()
          .projects.find((p) => p.id === a.projectId)
          ?.areas.find((x) => x.id === a.areaId)
          ?.checklists.find((c) => c.id === a.checklistId)
          ?.items.find((i) => i.id === a.itemId);
        return `Actualizar ítem "${item?.text ?? a.itemId}" en "${projectName(ctx, a.projectId)}"`;
      },
      execute: async (a) => {
        const project = getData().projects.find((x) => x.id === a.projectId);
        if (!project) throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        const item = project.areas
          .find((x) => x.id === a.areaId)
          ?.checklists.find((c) => c.id === a.checklistId)
          ?.items.find((i) => i.id === a.itemId);
        if (!item) throw new Error(`Ítem no encontrado: ${a.itemId}`);
        const next = {
          ...item,
          ...(a.text !== undefined && { text: a.text }),
          ...(a.required !== undefined && { required: a.required }),
          ...(a.done !== undefined && { done: a.done }),
          ...(a.dueDate !== undefined && { dueDate: a.dueDate }),
          ...(a.assigneeId !== undefined && { assigneeId: a.assigneeId }),
          ...(a.notes !== undefined && { notes: a.notes }),
        };
        await actions.mutateProject(a.projectId, (p) =>
          ops.updateItem(p, a.areaId, a.checklistId, next),
        );
        return { ok: true, item: { id: next.id, text: next.text, done: next.done } };
      },
    }),

    defineTool({
      name: "remove_checklist_item",
      description: "Elimina un ítem de checklist. Requiere confirmación.",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        areaId: z.string(),
        checklistId: z.string(),
        itemId: z.string(),
      }),
      describeCall: (a) => `Eliminar el ítem del checklist en "${projectName(ctx, a.projectId)}"`,
      execute: async (a) => {
        if (!getData().projects.find((x) => x.id === a.projectId))
          throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        await actions.mutateProject(a.projectId, (p) =>
          ops.removeItem(p, a.areaId, a.checklistId, a.itemId),
        );
        return { ok: true };
      },
    }),
  ];
}
