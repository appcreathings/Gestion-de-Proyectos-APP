# Especificación — Archivado de tareas

- **Feature ID:** 015-kanban-archive
- **Estado:** Borrador
- **Fecha:** 2026-07-06
- **Epic:** kanban-task-experience
- **Depende de:** 013-kanban-task-detail-drawer
- **Principios afectados (constitución):** IV (diseño limpio y enfocado), V (simplicidad)

## Resumen

Agregar la capacidad de **archivar tareas** para limpiar el tablero kanban de tareas hechas o que ya no son relevantes, sin eliminarlas. Las tareas archivadas se ocultan del tablero por defecto, pero se pueden consultar en un filtro dedicado y desarchivar si es necesario.

## Problema / Necesidad

Actualmente las tareas hechas permanecen en la columna "done" indefinidamente. Esto causa:

1. **Saturación visual**: la columna "done" crece sin control, especialmente en proyectos largos o sprints con muchas tareas.
2. **Dificultad para enfocarse en lo activo**: el PM tiene que filtrar por sprint o área para ver solo lo relevante, pero las tareas hechas de sprints anteriores siguen ahí.
3. **No hay forma de "limpiar" sin perder**: si el PM quiere ocultar las tareas hechas, la única opción es eliminarlas, lo cual pierde el historial y la referencia.

## Decisiones explícitas

- **`archived` es un booleano**, no un estado nuevo. Las tareas archivadas conservan su `status` (todo/doing/blocked/done). Esto permite archivar tareas en cualquier estado, no solo "done".
- **Las tareas archivadas se ocultan del tablero por defecto**: no aparecen en ninguna columna.
- **Filtro "Archivadas"**: un toggle/botón en la barra del kanban que cambia la vista para mostrar solo tareas archivadas.
- **Las tareas archivadas se muestran en una lista plana**, no en columnas kanban. Esto refleja que ya no están en flujo activo.
- **Desarchivar restaura la tarea al tablero**: la tarea vuelve a su columna original según su `status`.
- **El archivado se puede hacer desde el drawer** (spec 013) y desde un menú contextual en la card.
- **Las tareas archivadas cuentan en el progreso del proyecto** (OverviewTab) si su status es "done". Si están archivadas con status "todo" o "doing", también cuentan pero se muestran como "archivadas" en el tooltip.

## Migración de schema (v2 → v3)

```typescript
// En TaskSchema, agregar:
archived: z.boolean().default(false),
```

Migración no destructiva: todas las tareas existentes obtienen `archived: false`.

## Historias de usuario

### HU-01 — Archivar una tarea desde el drawer
**Como** PM, **quiero** archivar una tarea desde el panel de detalle **para** limpiar el tablero sin eliminarla.
- ✅ En el drawer de detalle, hay un botón "Archivar" (ícono de caja/archivo).
- ✅ Click en "Archivar" marca la tarea como `archived: true`.
- ✅ La tarea desaparece inmediatamente del tablero.
- ✅ El drawer se cierra automáticamente después de archivar.
- ✅ Se registra en el log de actividad: "Tarea 'X' archivada".

### HU-02 — Archivar una tarea desde la card
**Como** PM, **quiero** archivar una tarea rápidamente desde la card **para** no tener que abrir el drawer.
- ✅ En la card, hay un menú de "..." (más opciones) o un botón de archivo directo.
- ✅ Click en "Archivar" marca la tarea como archivada.
- ✅ La card desaparece del tablero.
- ✅ Si se usa un menú "..." también debe incluir las acciones existentes (mover, bloquear, editar, eliminar) para no fragmentar la UX.

### HU-03 — Ver tareas archivadas
**Como** PM, **quiero** ver todas las tareas archivadas **para** consultar el historial o recuperar contexto.
- ✅ En la barra del kanban (junto a los filtros de área y sprint), hay un toggle/botón "Archivadas".
- ✅ Al activarlo, el tablero cambia a una vista de lista plana con todas las tareas archivadas.
- ✅ La lista muestra: título, summary, status, priority, assignee, fecha de archivado (si se trackea), y fecha de creación.
- ✅ La lista se puede ordenar por fecha de archivado (más reciente primero, por defecto) o por fecha de creación.
- ✅ Click en una tarea archivada abre el drawer en modo lectura.

### HU-04 — Desarchivar una tarea
**Como** PM, **quiero** desarchivar una tarea **para** volver a trabajarla si se reactiva.
- ✅ En el drawer de una tarea archivada, hay un botón "Desarchivar".
- ✅ Click en "Desarchivar" marca la tarea como `archived: false`.
- ✅ La tarea desaparece de la lista de archivadas y vuelve al tablero en su columna original.
- ✅ Se registra en el log de actividad: "Tarea 'X' desarchivada".

### HU-05 — Las tareas archivadas no interfieren con el tablero activo
**Como** PM, **quiero** que las tareas archivadas no aparezcan en el tablero por defecto **para** enfocarme en lo activo.
- ✅ Por defecto, el tablero solo muestra tareas con `archived: false`.
- ✅ Los filtros de área y sprint solo aplican a tareas no archivadas.
- ✅ El contador de tareas en el `SprintSwitcher` no incluye tareas archivadas.
- ✅ El progreso del proyecto (OverviewTab) incluye tareas archivadas si su status es "done", pero las muestra como "archivadas" en el tooltip si se pasa el mouse.

## Requisitos no funcionales

- **Persistencia inmediata**: archivar/desarchivar llama a `mutate()` y se persiste.
- **Sin nuevas dependencias**: el toggle/botón usa componentes existentes.
- **Accesibilidad**: el botón de archivar tiene `aria-label="Archivar tarea"`, el toggle de archivadas tiene `aria-pressed`.
- **Performance**: la lista de archivadas se renderiza completa hasta que haya evidencia de que >500 tareas archivadas causen problemas (en cuyo caso se puede agregar virtualización o paginación).

## Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `src/domain/schemas/project.ts` | Agregar `archived` a `TaskSchema` |
| `src/domain/migrations.ts` | Migración v2→v3 (agregar `archived: false` a tareas existentes) |
| `src/domain/factories.ts` | `newTask()` incluye `archived: false` |
| `src/domain/projectOps.ts` | Agregar `archiveTask(taskId)` y `unarchiveTask(taskId)` (o se hace inline con `updateTask`) |
| `src/automations/events.ts` | Detectar eventos `task.archived` y `task.unarchived` |
| `src/automations/activity.ts` | Generar mensajes para archivado/desarchivado |
| `src/features/projects/components/TasksTab.tsx` | Filtrar tareas archivadas por defecto; agregar toggle "Archivadas"; cambiar a vista de lista cuando el toggle está activo |
| `src/features/projects/components/kanban/TaskCard.tsx` | Agregar botón de archivar en menú contextual o directo |
| `src/features/projects/components/kanban/TaskDetailDrawer.tsx` | Agregar botones "Archivar" y "Desarchivar" |
| `src/features/projects/components/kanban/ArchivedTasksList.tsx` | **Nuevo**. Componente de lista plana de tareas archivadas |
| `src/features/projects/components/OverviewTab.tsx` | Ajustar progreso para incluir/excluir archivadas según status |

## Fuera de alcance (este spec)

- Archivado automático de tareas hechas después de X días (se puede agregar como automatización en el futuro)
- Eliminación permanente de tareas archivadas (purge)
- Exportar tareas archivadas a CSV/JSON
- Búsqueda dentro de tareas archivadas (se puede hacer con el filtro de texto, pero no es prioritario)
- Archivado de proyectos completos (ya existe `ProjectStatus.archived`)

## Métricas de éxito

- Las 5 historias de usuario cumplen sus criterios de aceptación.
- `tsc --noEmit`, `vitest run` y `vite build` en verde.
- Las tareas archivadas no aparecen en el tablero por defecto.
- El toggle "Archivadas" muestra correctamente todas las tareas archivadas.
- Desarchivar restaura la tarea a su columna original sin pérdida de datos.
