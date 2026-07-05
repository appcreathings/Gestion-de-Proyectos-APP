import { z } from "zod";
import { newArea } from "@/domain/factories";
import * as ops from "@/domain/projectOps";
import { defineTool, type AiTool, type ToolContext } from "../types";
import { areaLabel, projectName } from "../glossary";

export function createAreaWriteTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "add_area",
      description:
        "Añade un área a un proyecto (puede disparar automatizaciones de plantillas automáticas).",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        name: z.string().min(1),
        icon: z.string().optional().describe("Nombre de icono lucide, p. ej. 'rocket'"),
      }),
      describeCall: (a) =>
        `Añadir área "${a.name}" al proyecto "${projectName(ctx, a.projectId)}"`,
      execute: async (a) => {
        if (!getData().projects.find((x) => x.id === a.projectId))
          throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        const area = newArea(a.name, a.icon ?? "folder");
        await actions.mutateProject(a.projectId, (p) => ops.addArea(p, area));
        return { ok: true, area: { id: area.id, name: area.name } };
      },
    }),

    defineTool({
      name: "update_area",
      description:
        "Actualiza campos de un área (nombre, icono, responsable, completada). Usa get_project para obtener areaId.",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        areaId: z.string(),
        name: z.string().optional(),
        icon: z.string().optional(),
        ownerId: z.string().nullable().optional(),
        completed: z.boolean().optional(),
      }),
      describeCall: (a) =>
        `Actualizar área "${areaLabel(ctx, a.projectId, a.areaId)}" en "${projectName(ctx, a.projectId)}"`,
      execute: async (a) => {
        const project = getData().projects.find((x) => x.id === a.projectId);
        if (!project) throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        const area = project.areas.find((x) => x.id === a.areaId);
        if (!area) throw new Error(`Área no encontrada: ${a.areaId}`);
        const next = {
          ...area,
          ...(a.name !== undefined && { name: a.name }),
          ...(a.icon !== undefined && { icon: a.icon }),
          ...(a.ownerId !== undefined && { ownerId: a.ownerId }),
          ...(a.completed !== undefined && { completed: a.completed }),
        };
        await actions.mutateProject(a.projectId, (p) => ops.updateArea(p, next));
        return { ok: true, area: { id: next.id, name: next.name, completed: next.completed } };
      },
    }),

    defineTool({
      name: "delete_area",
      description:
        "Elimina un área de un proyecto junto con sus procesos y checklists. Requiere confirmación.",
      mode: "write",
      input: z.object({ projectId: z.string(), areaId: z.string() }),
      describeCall: (a) =>
        `Eliminar el área "${areaLabel(ctx, a.projectId, a.areaId)}" (y sus procesos/checklists) de "${projectName(ctx, a.projectId)}"`,
      execute: async (a) => {
        if (!getData().projects.find((x) => x.id === a.projectId))
          throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        await actions.mutateProject(a.projectId, (p) => ops.removeArea(p, a.areaId));
        return { ok: true };
      },
    }),
  ];
}
