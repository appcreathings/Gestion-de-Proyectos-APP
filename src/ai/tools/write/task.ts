import { z } from "zod";
import { newTask } from "@/domain/factories";
import * as ops from "@/domain/projectOps";
import { Priority, TaskStatus } from "@/domain/schemas";
import { taskView } from "../serializers";
import { defineTool, type AiTool, type ToolContext } from "../types";
import { projectName } from "../glossary";

const DayDateInput = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato requerido: YYYY-MM-DD");

export function createTaskWriteTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "create_task",
      description:
        "Crea una tarea en el Kanban de un proyecto. areaId y assigneeId son opcionales (usa get_project / list_people para obtenerlos).",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        status: TaskStatus.optional(),
        priority: Priority.optional(),
        areaId: z.string().optional(),
        assigneeId: z.string().optional(),
        dueDate: DayDateInput.optional(),
      }),
      describeCall: (a) =>
        `Crear tarea "${a.title}" en el proyecto "${projectName(ctx, a.projectId)}"`,
      execute: async (a) => {
        const project = getData().projects.find((x) => x.id === a.projectId);
        if (!project) throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        if (a.areaId && !project.areas.some((x) => x.id === a.areaId))
          throw new Error(`Área no encontrada: ${a.areaId}`);
        const task = newTask(a.title, a.areaId ?? null);
        if (a.description) task.description = a.description;
        if (a.status) task.status = a.status;
        if (a.priority) task.priority = a.priority;
        if (a.assigneeId) task.assigneeId = a.assigneeId;
        if (a.dueDate) task.dueDate = a.dueDate;
        await actions.mutateProject(a.projectId, (p) => ops.addTask(p, task));
        return taskView(task, getData().projects.find((x) => x.id === a.projectId)!, getData().people);
      },
    }),

    defineTool({
      name: "update_task",
      description:
        "Actualiza campos de una tarea existente (estado, prioridad, fecha, responsable, título, descripción).",
      mode: "write",
      input: z.object({
        projectId: z.string(),
        taskId: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: TaskStatus.optional(),
        priority: Priority.optional(),
        assigneeId: z.string().nullable().optional(),
        dueDate: DayDateInput.nullable().optional(),
      }),
      describeCall: (a) => {
        const t = getData()
          .projects.find((p) => p.id === a.projectId)
          ?.tasks.find((x) => x.id === a.taskId);
        const changes = [
          a.status && `estado → ${a.status}`,
          a.priority && `prioridad → ${a.priority}`,
          a.dueDate !== undefined && `fecha → ${a.dueDate ?? "sin fecha"}`,
          a.title && `título → "${a.title}"`,
        ]
          .filter(Boolean)
          .join(", ");
        return `Actualizar tarea "${t?.title ?? a.taskId}" (${changes || "cambios"})`;
      },
      execute: async (a) => {
        const project = getData().projects.find((x) => x.id === a.projectId);
        if (!project) throw new Error(`Proyecto no encontrado: ${a.projectId}`);
        const task = project.tasks.find((t) => t.id === a.taskId);
        if (!task) throw new Error(`Tarea no encontrada: ${a.taskId}`);
        const next = {
          ...task,
          ...(a.title !== undefined && { title: a.title }),
          ...(a.description !== undefined && { description: a.description }),
          ...(a.status !== undefined && { status: a.status }),
          ...(a.priority !== undefined && { priority: a.priority }),
          ...(a.assigneeId !== undefined && { assigneeId: a.assigneeId }),
          ...(a.dueDate !== undefined && { dueDate: a.dueDate }),
        };
        await actions.mutateProject(a.projectId, (p) => ops.updateTask(p, next));
        return taskView(next, getData().projects.find((x) => x.id === a.projectId)!, getData().people);
      },
    }),
  ];
}
