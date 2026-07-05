import { z } from "zod";
import { newPerson } from "@/domain/factories";
import { personView } from "../serializers";
import { defineTool, type AiTool, type ToolContext } from "../types";
import { personLabel } from "../glossary";

export function createPersonWriteTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "create_person",
      description: "Crea una persona para asignaciones de tareas y roles RACI.",
      mode: "write",
      input: z.object({
        name: z.string().min(1),
        email: z.string().optional(),
        roleTitle: z.string().optional(),
      }),
      describeCall: (a) => `Crear persona "${a.name}"`,
      execute: async (a) => {
        const person = newPerson(a.name);
        if (a.email) person.email = a.email;
        if (a.roleTitle) person.roleTitle = a.roleTitle;
        await actions.createPerson(person);
        return personView(person);
      },
    }),

    defineTool({
      name: "update_person",
      description: "Actualiza los datos de una persona (nombre, email, rol).",
      mode: "write",
      input: z.object({
        personId: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
        roleTitle: z.string().optional(),
      }),
      describeCall: (a) => `Actualizar persona "${personLabel(ctx, a.personId)}"`,
      execute: async (a) => {
        const person = getData().people.find((x) => x.id === a.personId);
        if (!person) throw new Error(`Persona no encontrada: ${a.personId}`);
        const next = {
          ...person,
          ...(a.name !== undefined && { name: a.name }),
          ...(a.email !== undefined && { email: a.email }),
          ...(a.roleTitle !== undefined && { roleTitle: a.roleTitle }),
        };
        await actions.updatePerson(next);
        return personView(next);
      },
    }),

    defineTool({
      name: "delete_person",
      description:
        "Elimina una persona. No reasigna automáticamente sus tareas o roles RACI existentes. Requiere confirmación.",
      mode: "write",
      input: z.object({ personId: z.string() }),
      describeCall: (a) => `Eliminar la persona "${personLabel(ctx, a.personId)}"`,
      execute: async (a) => {
        if (!getData().people.find((x) => x.id === a.personId))
          throw new Error(`Persona no encontrada: ${a.personId}`);
        await actions.deletePerson(a.personId);
        return { ok: true };
      },
    }),
  ];
}
