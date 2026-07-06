# Especificación — Comentarios en tareas

- **Feature ID:** 014-kanban-comments
- **Estado:** Borrador
- **Fecha:** 2026-07-06
- **Epic:** kanban-task-experience
- **Depende de:** 013-kanban-task-detail-drawer
- **Principios afectados (constitución):** IV (diseño limpio y enfocado), V (simplicidad)

## Resumen

Agregar un sistema de **comentarios** embebidos en las tareas, accesible desde el drawer de detalle (spec 013). Los comentarios son texto simple con autor y timestamp, pensados para dejar notas, decisiones y seguimientos sobre la tarea.

## Problema / Necesidad

Actualmente la tarea tiene un campo `description` pero:

1. **No tiene noción de tiempo ni autor**: es un texto estático que cualquiera puede sobrescribir.
2. **No hay lugar para contexto efímero**: notas como "Pendiente de aprobación de X", "Decidimos cambiar el enfoque a Y", o "Bloqueado por Z" no tienen dónde vivir.
3. **El PM necesita un hilo de contexto**: cuando retoma una tarea después de días, necesita ver qué se dijo/decidió, no solo el estado actual.

## Decisiones explícitas

- **Texto simple, sin markdown**: los comentarios son texto plano con saltos de línea. Sin formato enriquecido (negritas, listas, links). Se puede evolucionar a markdown en el futuro si hay necesidad real.
- **Los comentarios se muestran en el drawer** (spec 013), debajo de la descripción. No aparecen en la card del kanban.
- **Orden cronológico**: los comentarios más recientes aparecen al final (abajo).
- **No se pueden editar ni eliminar** (v1): una vez publicado, el comentario es inmutable. Se puede agregar edición/eliminación en una iteración futura si se necesita.
- **El `authorId` es opcional**: si no hay un sistema de usuarios activo, el comentario se guarda sin autor (o con un autor por defecto). Se prepara el campo para cuando haya autenticación.
- **Los comentarios se registran en el log de actividad**: evento `task.commented` que genera un mensaje tipo "Comentario en 'X': texto del comentario...".

## Migración de schema (v2 → v3)

```typescript
// Nuevo schema
export const CommentSchema = z.object({
  id: Id,
  authorId: Id.nullable().default(null),
  text: z.string().min(1),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
export type Comment = z.infer<typeof CommentSchema>;

// En TaskSchema, agregar:
comments: z.array(CommentSchema).default([]),
```

Migración no destructiva: todas las tareas existentes obtienen `comments: []`.

## Historias de usuario

### HU-01 — Agregar un comentario
**Como** PM, **quiero** escribir un comentario en una tarea **para** dejar una nota, decisión o seguimiento.
- ✅ En el drawer de detalle, hay una sección "Comentarios" al final.
- ✅ Un textarea permite escribir el comentario.
- ✅ Click en "Comentar" o `Ctrl+Enter` publica el comentario.
- ✅ El comentario aparece inmediatamente en la lista.
- ✅ El textarea se limpia después de publicar.
- ✅ Si el texto está vacío, el botón está deshabilitado.

### HU-02 — Ver el historial de comentarios
**Como** PM, **quiero** ver todos los comentarios de una tarea **para** entender el contexto y las decisiones tomadas.
- ✅ Los comentarios se muestran en orden cronológico (más antiguo arriba, más reciente abajo).
- ✅ Cada comentario muestra: texto, fecha/hora relativa ("hace 2 horas"), y autor (si tiene `authorId`).
- ✅ Si no hay autor, se muestra "Sin autor" o se omite el nombre.
- ✅ Los comentarios largos se muestran completos (sin truncar).

### HU-03 — Notificación en el log de actividad
**Como** PM que revisa el tab Actividad, **quiero** ver cuando alguien comentó en una tarea **para** estar al tanto de novedades.
- ✅ Agregar un comentario genera un evento `task.commented`.
- ✅ El `ActivityTab` muestra: "Comentario en 'X': [primeros 50 chars del texto]...".
- ✅ Click en la entrada de actividad abre el drawer de la tarea (con `?detail=<taskId>`).

### HU-04 — Contador de comentarios visible en la card
**Como** PM, **quiero** ver cuántos comentarios tiene una tarea en la card del kanban **para** saber si hay contexto adicional antes de abrirla.
- ✅ Si la tarea tiene comentarios, la card muestra un badge con el ícono de chat y el número (ej: "💬 3").
- ✅ Si no tiene comentarios, no se muestra nada.

## Requisitos no funcionales

- **Persistencia inmediata**: al publicar, se llama a `mutate()` y se persiste en el mismo flujo que otras operaciones.
- **Sin nuevas dependencias**: el textarea es nativo de HTML, sin editor enriquecido.
- **Accesibilidad**: el textarea tiene `aria-label="Nuevo comentario"`, el botón tiene texto visible.
- **Performance**: la lista de comentarios se renderiza completa (sin virtualización) hasta que haya evidencia de que tareas con >100 comentarios causen problemas.

## Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `src/domain/schemas/project.ts` | Agregar `CommentSchema` y `comments` a `TaskSchema` |
| `src/domain/schemas/common.ts` | (Sin cambios, se reutiliza `Id`, `IsoDate`) |
| `src/domain/migrations.ts` | Migración v2→v3 (agregar `comments: []` a tareas existentes) |
| `src/domain/factories.ts` | `newTask()` incluye `comments: []` |
| `src/domain/projectOps.ts` | Agregar `addComment(taskId, comment)` (opcional, o se hace inline con `updateTask`) |
| `src/automations/events.ts` | Detectar evento `task.commented` |
| `src/automations/activity.ts` | Generar mensaje para `task.commented` |
| `src/features/projects/components/kanban/TaskDetailDrawer.tsx` | Agregar sección de comentarios |
| `src/features/projects/components/kanban/TaskCard.tsx` | Mostrar badge con contador de comentarios |

## Fuera de alcance (este spec)

- Edición o eliminación de comentarios
- Formato markdown o enriquecido
- Notificaciones push/email cuando alguien comenta
- Mencionar a otros usuarios (@mention)
- Adjuntar archivos o imágenes
- Comentarios en checklists o procesos (solo en tareas)

## Métricas de éxito

- Las 4 historias de usuario cumplen sus criterios de aceptación.
- `tsc --noEmit`, `vitest run` y `vite build` en verde.
- Los comentarios se persisten y persisten entre recargas de la página.
- El log de actividad muestra los comentarios correctamente.
