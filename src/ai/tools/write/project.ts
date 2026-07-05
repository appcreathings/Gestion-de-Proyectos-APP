import { z } from "zod";
import { newProject } from "@/domain/factories";
import { Health, Priority, ProjectStatus } from "@/domain/schemas";
import { projectSummary } from "../serializers";
import { defineTool, type AiTool, type ToolContext } from "../types";
import { projectName } from "../glossary";

const DayDateInput = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato requerido: YYYY-MM-DD");

export function createProjectWriteTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "create_project",
      description:
        "Crea un proyecto vacío. Si existe un Tipo de Proyecto adecuado, prefiere create_project_from_type (despliega áreas, procesos y checklists).",
      mode: "write",
      input: z.object({
        name: z.string().min(1),
        productId: z.string().optional(),
        description: z.string().optional(),
        priority: Priority.optional(),
        dueDate: DayDateInput.optional(),
      }),
      describeCall: (a) => `Crear proyecto "${a.name}"`,
      execute: async (a) => {
        const project = newProject(a.name, a.productId ?? null);
        if (a.description) project.description = a.description;
        if (a.priority) project.priority = a.priority;
        if (a.dueDate) project.dueDate = a.dueDate;
        await actions.createProject(project);
        return projectSummary(project);
      },
    }),

    defineTool({
      name: "create_project_from_type",
      description:
        "Crea un proyecto instanciando un Tipo de Proyecto (despliega sus áreas, procesos y checklists por defecto). Usa list_project_types para ver los tipos.",
      mode: "write",
      input: z.object({
        typeId: z.string(),
        name: z.string().min(1),
        productId: z.string().optional(),
      }),
      describeCall: (a) => {
        const type = getData().projectTypes.find((t) => t.id === a.typeId);
        return `Crear proyecto "${a.name}" desde el tipo "${type?.name ?? a.typeId}"`;
      },
      execute: async (a) => {
        const id = await actions.createProjectFromType(
          a.typeId,
          a.name,
          a.productId ?? null,
        );
        if (!id) throw new Error(`Tipo de proyecto no encontrado: ${a.typeId}`);
        return projectSummary(getData().projects.find((x) => x.id === id)!);
      },
    }),

    defineTool({
      name: "update_project",
      description:
        "Actualiza campos de un proyecto (estado, salud, prioridad, fecha límite, descripción, nombre).",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: ProjectStatus.optional(),
        health: Health.optional(),
        priority: Priority.optional(),
        dueDate: DayDateInput.nullable().optional(),
      }),
      describeCall: (a) => {
        const changes = [
          a.status && `estado → ${a.status}`,
          a.health && `salud → ${a.health}`,
          a.priority && `prioridad → ${a.priority}`,
          a.dueDate !== undefined && `fecha límite → ${a.dueDate ?? "sin fecha"}`,
          a.name && `nombre → "${a.name}"`,
        ]
          .filter(Boolean)
          .join(", ");
        return `Actualizar proyecto "${projectName(ctx, a.projectId)}" (${changes || "cambios"})`;
      },
      execute: async (a) => {
        const project = getData().projects.find((x) => x.id === a.projectId);
        if (!project) throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        const next = {
          ...project,
          ...(a.name !== undefined && { name: a.name }),
          ...(a.description !== undefined && { description: a.description }),
          ...(a.status !== undefined && { status: a.status }),
          ...(a.health !== undefined && { health: a.health }),
          ...(a.priority !== undefined && { priority: a.priority }),
          ...(a.dueDate !== undefined && { dueDate: a.dueDate }),
        };
        await actions.saveProject(next);
        return projectSummary(next);
      },
    }),

    defineTool({
      name: "delete_project",
      description:
        "Elimina un proyecto completo, incluidas sus áreas, procesos, checklists y tareas. Acción irreversible; requiere confirmación explícita del usuario, nunca la asumas.",
      mode: "write",
      input: z.object({ projectId: z.string() }),
      describeCall: (a) =>
        `Eliminar el proyecto "${projectName(ctx, a.projectId)}" y todo su contenido (áreas, checklists, tareas)`,
      execute: async (a) => {
        if (!getData().projects.find((x) => x.id === a.projectId))
          throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        await actions.deleteProject(a.projectId);
        return { ok: true };
      },
    }),
  ];
}
