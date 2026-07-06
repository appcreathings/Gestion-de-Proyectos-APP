# Epic — Mejora de la experiencia de tareas en el Kanban

- **Epic ID:** kanban-task-experience
- **Estado:** Propuesta
- **Fecha:** 2026-07-06
- **Principios afectados (constitución):** IV (diseño limpio y enfocado), V (simplicidad)

## Visión

Transformar las tarjetas del kanban de elementos puramente operativos (mover entre columnas) en **fichas de trabajo enriquecidas** que permitan al PM entender el alcance, dejar contexto, y limpiar el tablero sin perder información.

## Problema actual

1. **Las tarjetas no comunican alcance**: solo muestran título + badges. El PM tiene que abrir el formulario de edición para entender qué implica la tarea.
2. **No hay lugar para contexto colaborativo**: si alguien necesita dejar una nota, decisión o seguimiento, no tiene dónde hacerlo (la descripción es estática y no tiene noción de tiempo/autor).
3. **El tablero se satura**: las tareas hechas permanecen en la columna "done" indefinidamente, compitiendo por atención con las activas. No hay forma de archivarlas sin eliminarlas.

## Specs que componen este epic

| Spec | Descripción | Campos de schema nuevos |
|------|-------------|------------------------|
| **013-kanban-task-detail-drawer** | Panel lateral (drawer) para ver y editar la tarea en contexto. Incluye campo `summary` para resumen de alcance visible en la card. | `summary: string` |
| **014-kanban-comments** | Sistema de comentarios en las tareas. Texto simple con autor y timestamp. | `comments: Comment[]` |
| **015-kanban-archive** | Botón de archivar, filtro de tareas archivadas, y opción de desarchivar. | `archived: boolean` |

## Orden de implementación sugerido

```
013 (drawer + summary) → 014 (comentarios) → 015 (archivado)
```

**Racional**: el drawer (013) es el contenedor visual donde vivirán los comentarios (014) y desde donde se archivará (015). Cada spec es usable independientemente pero la experiencia se construye incrementalmente.

## Cambios de schema acumulados (migración v2 → v3)

```typescript
// TaskSchema — nuevos campos
summary: z.string().max(140).default(""),
archived: z.boolean().default(false),
comments: z.array(CommentSchema).default([]),

// Nuevo schema
const CommentSchema = z.object({
  id: Id,
  authorId: Id.nullable().default(null),
  text: z.string(),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
```

Todos los campos tienen defaults seguros → migración no destructiva.

## Casos de uso habilitados

| # | Caso de uso | Spec |
|---|-------------|------|
| 1 | Ver el contexto rápido de una tarea sin abrirla (summary en card) | 013 |
| 2 | Abrir la tarea en un panel lateral sin perder el contexto del tablero | 013 |
| 3 | Editar metadata de la tarea inline (status, priority, assignee, etc.) | 013 |
| 4 | Dejar una nota/comentario sobre una decisión o seguimiento | 014 |
| 5 | Ver el historial de comentarios con autor y fecha | 014 |
| 6 | Archivar tareas hechas para limpiar el tablero | 015 |
| 7 | Consultar tareas archivadas cuando sea necesario | 015 |
| 8 | Desarchivar una tarea si se reactiva | 015 |

## Fuera de alcance (para specs futuros)

- Subtareas / checklists embebidos en tareas
- Estimación de esfuerzo (story points / horas)
- Filtros enriquecidos (prioridad, assignee, fecha)
- Búsqueda por texto
- Tags en UI (el campo ya existe en schema)
- WIP limits por columna
- Operaciones bulk
- Vista "Mis tareas" cross-proyecto
- Historial de cambios de campos (audit trail)

## Métricas de éxito del epic

- Las tarjetas comunican el alcance de la tarea de un vistazo (summary visible).
- El PM puede abrir, leer, editar y comentar una tarea sin salir del kanban.
- El tablero se puede limpiar de tareas hechas sin perderlas.
- Cero regresión en las funcionalidades existentes (drag-and-drop, filtros, sprint switcher).
