# Plan Técnico — Comentarios en tareas

- **Feature:** 014-kanban-comments
- **Constitución:** alineado con IV (diseño limpio) y V (simplicidad). Requiere migración de schema
  v3 → v4 (agregar `comments` con default seguro). No toca persistencia ni storage.
- **Depende de:** 013-kanban-task-detail-drawer (el drawer es el contenedor de los comentarios)

## Alcance técnico

Se agrega un schema `CommentSchema` y un campo `comments: Comment[]` al `TaskSchema`. Los comentarios
se gestionan desde el `TaskDetailDrawer` (spec 013) y se muestran en orden cronológico. Se agrega un
evento de actividad `task.commented` y un badge contador en la `TaskCard`.

**Nuevos archivos:** ninguno (la UI de comentarios vive en `TaskDetailDrawer.tsx`).

**Archivos a extender:**
- `src/domain/schemas/project.ts` — agregar `CommentSchema` y `comments` a `TaskSchema`
- `src/domain/migrations.ts` — migración v3→v4
- `src/domain/factories.ts` — `newTask()` incluye `comments: []`
- `src/domain/projectOps.ts` — agregar `addComment(taskId, comment)` (opcional, o inline con `updateTask`)
- `src/automations/events.ts` — detectar evento `task.commented`
- `src/automations/activity.ts` — generar mensaje para `task.commented`
- `src/features/projects/components/kanban/TaskDetailDrawer.tsx` — agregar sección de comentarios
- `src/features/projects/components/kanban/TaskCard.tsx` — mostrar badge contador

**Sin dependencias nuevas.** Se reutilizan componentes de shadcn/ui (Textarea, Button) y el patrón
de mutación existente.

## Diseño de la UI de comentarios

### En el drawer

```
┌─────────────────────────────────────────┐
│  ... (contenido del drawer, ver 013)    │
├─────────────────────────────────────────┤
│  Comentarios                            │
│  ┌───────────────────────────────────┐  │
│  │ Texto del comentario más antiguo. │  │
│  │ — Sin autor · hace 2 días         │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ Texto del comentario más reciente.│  │
│  │ — Juan · hace 2 horas             │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Escribe un comentario...          │  │
│  └───────────────────────────────────┘  │
│  [Comentar]                             │
└─────────────────────────────────────────┘
```

### En la card del kanban

```
┌─────────────────────────────┐
│ 🔴 Alta    [Área] [Sprint]  │
│ Título de la tarea          │
│ Resumen corto de la tarea   │
│ 👤 Juan  📅 15 jul  💬 3    │  ← badge con contador de comentarios
│ [←] [→] [🔒] [✏️] [🗑️]      │
└─────────────────────────────┘
```

- Si `comments.length === 0`, no se muestra el badge.
- Si `comments.length > 0`, se muestra el ícono de chat + número.
- Estilo: `text-xs text-muted-foreground` con ícono `MessageCircle` de lucide-react.

## Migración de schema (v3 → v4)

```typescript
// En src/domain/schemas/common.ts
export const SCHEMA_VERSION = 4; // era 3

// En src/domain/schemas/project.ts
export const CommentSchema = z.object({
  id: Id,
  authorId: Id.nullable().default(null),
  text: z.string().min(1),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
export type Comment = z.infer<typeof CommentSchema>;

export const TaskSchema = z.object({
  // ... campos existentes (incluyendo summary de 013)
  comments: z.array(CommentSchema).default([]),
  // ...
});

// En src/domain/migrations.ts
// Agregar migración v3 → v4:
if (project.schemaVersion === 3) {
  project.tasks = project.tasks.map(t => ({
    ...t,
    comments: t.comments ?? [],
  }));
  project.schemaVersion = 4;
}
```

## Diseño de la interacción

### Agregar comentario

1. Usuario escribe en el textarea al final de la sección de comentarios.
2. Click en "Comentar" o `Ctrl+Enter` publica el comentario.
3. Se genera un nuevo `Comment` con `id` (UUID), `authorId: null` (v1), `text`, `createdAt`, `updatedAt`.
4. Se llama a `mutate()` con `ops.updateTask(taskId, { comments: [...task.comments, newComment] })`.
5. El comentario aparece inmediatamente en la lista.
6. El textarea se limpia.
7. Se registra evento `task.commented` en el log de actividad.

### Ver comentarios

- Los comentarios se muestran en orden cronológico (más antiguo arriba, más reciente abajo).
- Cada comentario muestra: texto, fecha relativa (usar `formatRelative` o similar), autor (si tiene `authorId`).
- Si no hay autor, se muestra "Sin autor" o se omite el nombre.
- Los comentarios largos se muestran completos (sin truncar).

### Evento de actividad

- En `src/automations/events.ts`, agregar detección de `task.commented`:
  - Comparar `prevTask.comments.length` vs `nextTask.comments.length`.
  - Si aumentó, emitir evento `task.commented` con el último comentario.
- En `src/automations/activity.ts`, generar mensaje:
  - "Comentario en 'X': [primeros 50 chars del texto]..."
  - Click en la entrada de actividad abre el drawer con `?detail=<taskId>`.

## Orden de implementación (3 fases)

**Fase 1 — Schema y migración (bajo riesgo, aislado):**
1. Actualizar `SCHEMA_VERSION` a 4.
2. Agregar `CommentSchema` y `comments` a `TaskSchema`.
3. Agregar migración v3→v4 en `migrations.ts`.
4. Actualizar `newTask()` en `factories.ts`.
5. Verificar: `tsc --noEmit`, `vitest run`.

**Fase 2 — UI de comentarios en el drawer:**
6. Agregar sección "Comentarios" al final del `TaskDetailDrawer`.
7. Implementar lista de comentarios (orden cronológico, fecha relativa, autor).
8. Implementar textarea + botón "Comentar" (o `Ctrl+Enter`).
9. Implementar persistencia al publicar (llamar a `mutate()` con nuevo comentario).
10. Verificar: comentarios se agregan, persisten, se muestran correctamente.

**Fase 3 — Integración con actividad y card:**
11. Agregar detección de evento `task.commented` en `events.ts`.
12. Agregar mensaje de actividad en `activity.ts`.
13. Agregar badge contador en `TaskCard.tsx` (ícono de chat + número).
14. Verificar: evento se registra, mensaje aparece en ActivityTab, badge se muestra en card.
15. Smoke visual final, `tsc --noEmit`, `vitest run`, `npm run build`.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Los comentarios pueden crecer mucho y afectar performance | En v1, renderizar todos los comentarios sin virtualización. Si hay >100 comentarios, considerar virtualización o paginación en una iteración futura. |
| El `authorId` es null en v1 (no hay sistema de usuarios) | Mostrar "Sin autor" o omitir el nombre. El campo está preparado para cuando haya autenticación. |
| El evento `task.commented` puede dispararse múltiples veces si se agregan varios comentarios rápido | Cada comentario genera un evento independiente. El log de actividad muestra cada uno. |
| La migración v3→v4 puede fallar si hay proyectos en schema < 3 | La migración v3→v4 es aditiva. Si el proyecto está en v2 o v1, primero corren las migraciones anteriores (v1→v2, v2→v3) y luego v3→v4. |

## Estrategia de verificación por fase

Después de cada fase: `npx tsc --noEmit`, `npx vitest run`, smoke visual manual en dev server.
No se avanza a la fase siguiente sin confirmar que la fase actual no rompió nada.

## Gates de la constitución

- ✅ **I Local-first:** sin cambios de persistencia ni red.
- ✅ **II Esquema-contrato:** migración v3→v4 aditiva, no destructiva.
- ✅ **III Plantillas/Tipos:** no aplica.
- ✅ **IV Diseño limpio:** reutiliza lenguaje visual existente (badges, textarea nativo).
- ✅ **V Simplicidad/incremental:** 3 fases independientes, reutiliza `ops.updateTask` existente.
- ✅ **VI Migrabilidad:** migración registrada en `migrations.ts`, sigue el patrón existente.
