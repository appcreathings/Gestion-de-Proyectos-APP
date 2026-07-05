import { z } from "zod";
import {
  EntityRefSchema,
  Severity,
  type Notification,
} from "@/domain/schemas";
import { nowIso, uuid } from "@/lib/utils";
import { notificationView } from "../serializers";
import { defineTool, type AiTool, type ToolContext } from "../types";

export function createNotificationWriteTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "create_notification",
      description:
        "Crea una notificación manual (p. ej. para registrar una recomendación o alerta accionable). Usa list_notifications antes para evitar duplicados.",
      mode: "write",
      input: z.object({
        type: z.string().min(1),
        message: z.string().min(1),
        severity: Severity.optional(),
        entityRef: EntityRefSchema.optional(),
      }),
      describeCall: (a) => `Crear notificación: "${a.message}"`,
      execute: async (a) => {
        const notification: Notification = {
          id: uuid(),
          type: a.type,
          severity: a.severity ?? "info",
          message: a.message,
          entityRef: a.entityRef ?? null,
          read: false,
          createdAt: nowIso(),
        };
        await actions.addNotifications([notification]);
        return notificationView(notification);
      },
    }),

    defineTool({
      name: "mark_notification_read",
      description: "Marca una notificación como leída.",
      mode: "write",
      input: z.object({ notificationId: z.string() }),
      describeCall: (a) => `Marcar como leída la notificación ${a.notificationId}`,
      execute: async (a) => {
        if (!getData().notifications.some((n) => n.id === a.notificationId))
          throw new Error(`Notificación no encontrada: ${a.notificationId}`);
        await actions.markNotificationRead(a.notificationId);
        return { ok: true };
      },
    }),

    defineTool({
      name: "clear_notifications",
      description: "Elimina todas las notificaciones del workspace. Requiere confirmación.",
      mode: "write",
      input: z.object({}),
      describeCall: () => `Eliminar todas las notificaciones`,
      execute: async () => {
        await actions.clearNotifications();
        return { ok: true };
      },
    }),
  ];
}
