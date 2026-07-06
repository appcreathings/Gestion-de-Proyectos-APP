# Plan Técnico — Archivado de tareas

- **Feature:** 015-kanban-archive
- **Constitución:** alineado con IV (diseño limpio) y V (simplicidad). Requiere migración de schema
  v4 → v5 (agregar `archived` con default seguro). No toca persistencia ni storage.
- **Depende de:** 013-kanban-task-detail-drawer (el drawer contiene los botones de archivar/desarchivar)

## Alcance técnico

Se agrega un campo `archived: boolean` al `TaskSchema`. Las tareas archivadas se ocultan del tablero
por defecto y se muestran en una vista de lista plana accesible desde un toggle "Archivadas". Se
pueden archivar desde el drawer o desde un menú contextual en la card.

**Nuevos archivos:**
- `src/features/projects/components/kanban/ArchivedTasksList.tsx` — componente de lista plana de tareas archivadas

**Archivos a extender:**
- `src/domain/schemas/project.ts` — agregar `archived` a `TaskSchema`
- `src/domain/migrations.ts` — migración v4→v5
- `src/domain/factories.ts` — `newTask()` incluye `archived: false`
- `src/domain/projectOps.ts` — agregar `archiveTask(taskId)` y `unarchiveTask(taskId)` (opcional, o inline con `updateTask`)
- `src/automations/events.ts` — detectar eventos `task.archived` y `task.unarchived`
- `src/automations/activity.ts` — generar mensajes para archivado/desarchivado
- `src/features/projects/components/TasksTab.tsx` — filtrar tareas archivadas por defecto; agregar toggle "Archivadas"; cambiar a vista de lista cuando el toggle está activo
- `src/features/projects/components/kanban/TaskCard.tsx` — agregar botón de archivar en menú contextual
- `src/features/projects/components/kanban/TaskDetailDrawer.tsx` — agregar botones "Archivar" y "Desarchivar"
- `src/features/projects/components/OverviewTab.tsx` — ajustar progreso para incluir/excluir archivadas según status

**Sin dependencias nuevas.** Se reutilizan componentes de shadcn/ui (Button, Toggle) y el patrón de mutación existente.

## Diseño de la UI de archivado

### Botón de archivar en el drawer

```
┌─────────────────────────────────────────┐
│  [X]                                    │
├─────────────────────────────────────────┤
│  ... (contenido del drawer)             │
├─────────────────────────────────────────┤
│  [Archivar tarea]  [Eliminar tarea]     │  ← botones al final, estilo destructivo
└─────────────────────────────────────────┘
```

- Botón "Archivar" con ícono `Archive` de lucide-react.
- Click en "Archivar" marca `archived: true`, cierra el drawer, registra evento.
- Si la tarea ya está archivada, el botón cambia a "Desarchivar" con ícono `ArchiveRestore`.

### Menú contextual en la card

```
┌─────────────────────────────┐
│ 🔴 Alta    [Área] [Sprint]  │
│ Título de la tarea          │
│ Resumen corto               │
│ 👤 Juan  📅 15 jul          │
│ [←] [→] [🔒] [⋮]            │  ← menú "..." con opciones adicionales
└─────────────────────────────┘

Al hacer click en [⋮]:
┌──────────────────┐
│ ✏️ Editar        │
│ 📦 Archivar      │
│ 🗑️ Eliminar      │
└──────────────────┘
```

- Menú desplegable con opciones: Editar, Archivar, Eliminar.
- Click en "Archivar" marca la tarea como archivada, la card desaparece.

### Toggle "Archivadas" en la barra del kanban

```
┌─────────────────────────────────────────────────────────────┐
│ [Sprint Switcher]  [Filtro Área]  [📦 Archivadas (12)]     │
└─────────────────────────────────────────────────────────────┘
```

- Toggle/botón "Archivadas" con contador de tareas archivadas.
- Al activarlo, el tablero cambia a una vista de lista plana.
- Al desactivarlo, vuelve al tablero kanban normal.

### Vista de lista de tareas archivadas

```
┌─────────────────────────────────────────────────────────────┐
│ Tareas archivadas (12)                                      │
├─────────────────────────────────────────────────────────────┤
│ Ordenar por: [Fecha de archivado ▼]                         │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ✅ Hecha · Título de la tarea                           │ │
│ │ Resumen corto · 👤 Juan · 📅 15 jul · 📦 Archivada hace 2 días │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🚫 Bloqueada · Otra tarea                               │ │
│ │ Resumen · 📦 Archivada hace 5 días                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ...                                                         │
└─────────────────────────────────────────────────────────────┘
```

- Lista plana con cards similares a las del kanban pero con info de archivado.
- Ordenable por fecha de archivado (default: más reciente primero) o fecha de creación.
- Click en una card abre el drawer en modo lectura (con botón "Desarchivar").

## Migración de schema (v4 → v5)

```typescript
// En src/domain/schemas/common.ts
export const SCHEMA_VERSION = 5; // era 4

// En src/domain/schemas/project.ts
export const TaskSchema = z.object({
  // ... campos existentes (incluyendo summary y comments)
  archived: z.boolean().default(false),
  // ...
});

// En src/domain/migrations.ts
// Agregar migración v4 → v5:
if (project.schemaVersion === 4) {
  project.tasks = project.tasks.map(t => ({
    ...t,
    archived: t.archived ?? false,
  }));
  project.schemaVersion = 5;
}
```

## Diseño de la interacción

### Archivar desde el drawer

1. Usuario abre el drawer de una tarea.
2. Click en botón "Archivar" al final del drawer.
3. Se llama a `mutate()` con `ops.updateTask(taskId, { archived: true })`.
4. El drawer se cierra automáticamente.
5. La tarea desaparece del tablero.
6. Se registra evento `task.archived` en el log de actividad.

### Archivar desde la card

1. Usuario hace click en menú "..." en la card.
2. Click en "Archivar".
3. Se llama a `mutate()` con `ops.updateTask(taskId, { archived: true })`.
4. La card desaparece del tablero.
5. Se registra evento `task.archived`.

### Ver tareas archivadas

1. Usuario hace click en toggle "Archivadas" en la barra del kanban.
2. El tablero se oculta, se muestra `ArchivedTasksList` con todas las tareas archivadas.
3. Lista ordenable por fecha de archivado o creación.
4. Click en una card abre el drawer en modo lectura.

### Desarchivar

1. Usuario abre el drawer de una tarea archivada.
2. Click en botón "Desarchivar".
3. Se llama a `mutate()` con `ops.updateTask(taskId, { archived: false })`.
4. El drawer se cierra.
5. La tarea vuelve al tablero en su columna original.
6. Se registra evento `task.unarchived`.

### Filtrado por defecto

- Por defecto, `TasksTab` filtra `project.tasks` para excluir `archived: true`.
- El filtro se aplica antes de derivar las columnas del kanban.
- El `SprintSwitcher` no cuenta tareas archivadas.
- El `OverviewTab` cuenta tareas archivadas si su status es "done", pero las muestra como "archivadas" en el tooltip.

## Orden de implementación (4 fases)

**Fase 1 — Schema y migración (bajo riesgo, aislado):**
1. Actualizar `SCHEMA_VERSION` a 5.
2. Agregar `archived` a `TaskSchema`.
3. Agregar migración v4→v5 en `migrations.ts`.
4. Actualizar `newTask()` en `factories.ts`.
5. Verificar: `tsc --noEmit`, `vitest run`.

**Fase 2 — Filtrado y toggle en TasksTab:**
6. En `TasksTab.tsx`, filtrar `project.tasks` para excluir `archived: true` por defecto.
7. Agregar estado `showArchived: boolean` en `TasksTab`.
8. Agregar toggle "Archivadas" en la barra del kanban (junto a filtros de área y sprint).
9. Cuando `showArchived` es true, mostrar `ArchivedTasksList` en vez del kanban.
10. Verificar: tareas archivadas no aparecen en el tablero por defecto, toggle funciona.

**Fase 3 — ArchivedTasksList y botones de archivar:**
11. Crear componente `ArchivedTasksList.tsx` con lista plana de tareas archivadas.
12. Implementar ordenamiento por fecha de archivado o creación.
13. Click en card de archivada abre drawer en modo lectura.
14. En `TaskDetailDrawer.tsx`, agregar botón "Archivar" (o "Desarchivar" si ya está archivada).
15. En `TaskCard.tsx`, agregar menú contextual "..." con opción "Archivar".
16. Verificar: archivar desde drawer y card funciona, lista de archivadas se muestra correctamente.

**Fase 4 — Integración con actividad y OverviewTab:**
17. Agregar detección de eventos `task.archived` y `task.unarchived` en `events.ts`.
18. Agregar mensajes de actividad en `activity.ts`.
19. En `OverviewTab.tsx`, ajustar progreso para incluir/excluir archivadas según status.
20. Verificar: eventos se registran, mensajes aparecen en ActivityTab, progreso se calcula correctamente.
21. Smoke visual final, `tsc --noEmit`, `vitest run`, `npm run build`.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| El filtrado de tareas archivadas puede romper el drag-and-drop si no se maneja correctamente | El filtrado se aplica antes de derivar las columnas. El drag-and-drop opera sobre `tasksInScope` que ya excluye archivadas. |
| La vista de archivadas puede ser confusa si no está clara la diferencia con el kanban | La vista de archivadas es una lista plana, no columnas. El toggle "Archivadas" indica claramente el modo. |
| El progreso del proyecto puede cambiar si se excluyen/incluyen archivadas incorrectamente | El `OverviewTab` cuenta tareas archivadas si su status es "done". Se muestra "archivadas" en el tooltip para claridad. |
| La migración v4→v5 puede fallar si hay proyectos en schema < 4 | La migración v4→v5 es aditiva. Si el proyecto está en schema anterior, corren las migraciones previas primero. |

## Estrategia de verificación por fase

Después de cada fase: `npx tsc --noEmit`, `npx vitest run`, smoke visual manual en dev server.
No se avanza a la fase siguiente sin confirmar que la fase actual no rompió nada.

## Gates de la constitución

- ✅ **I Local-first:** sin cambios de persistencia ni red.
- ✅ **II Esquema-contrato:** migración v4→v5 aditiva, no destructiva.
- ✅ **III Plantillas/Tipos:** no aplica.
- ✅ **IV Diseño limpio:** reutiliza lenguaje visual existente (cards, badges, botones).
- ✅ **V Simplicidad/incremental:** 4 fases independientes, reutiliza `ops.updateTask` existente.
- ✅ **VI Migrabilidad:** migración registrada en `migrations.ts`, sigue el patrón existente.
