import { z } from "zod";
import { Health, ProjectStatus } from "@/domain/schemas";
import { projectDetail, projectSummary } from "../serializers";
import { defineTool, type AiTool, type ToolContext } from "../types";

export function createProjectReadTools(ctx: ToolContext): AiTool[] {
  const { getData } = ctx;
  return [
    defineTool({
      name: "list_projects",
      description:
        "Lista proyectos como resúmenes (estado, salud, avance, conteo de tareas). Filtros opcionales por estado, producto o salud.",
      mode: "read",
      input: z.object({
        status: ProjectStatus.optional(),
        productId: z.string().optional(),
        health: Health.optional(),
      }),
      execute: ({ status, productId, health }) =>
        getData()
          .projects.filter(
            (p) =>
              (!status || p.status === status) &&
              (!productId || p.productId === productId) &&
              (!health || p.health === health),
          )
          .map(projectSummary),
    }),

    defineTool({
      name: "get_project",
      description:
        "Detalle completo de un proyecto: áreas con checklists e ítems (con sus ids), procesos y tareas. Necesario antes de escrituras que requieren ids internos (áreas, checklists, ítems).",
      mode: "read",
      input: z.object({ projectId: z.string() }),
      execute: ({ projectId }) => {
        const data = getData();
        const p = data.projects.find((x) => x.id === projectId);
        if (!p) throw new Error(`Proyecto no encontrado: ${projectId}`);
        return projectDetail(p, data.people);
      },
    }),
  ];
}
