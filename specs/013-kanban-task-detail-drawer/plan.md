# Plan Técnico — Panel de detalle (drawer) + campo summary

- **Feature:** 013-kanban-task-detail-drawer
- **Constitución:** alineado con IV (diseño limpio) y V (simplicidad). Requiere migración de schema
  v2 → v3 (agregar `summary` con default seguro). No toca persistencia ni storage.

## Alcance técnico

Se agrega un campo `summary: string` al `TaskSchema` y se introduce un nuevo componente
`TaskDetailDrawer` que se integra en `TasksTab`. La interacción con el kanban existente (drag,
filtros, sprint switcher) se preserva, bloqueando el drag mientras el drawer está abierto.

**Nuevos archivos:**
- `src/features/projects/components/kanban/TaskDetailDrawer.tsx`

**Archivos a extender:**
- `src/domain/schemas/project.ts` — agregar `summary` a `TaskSchema`
- `src/domain/migrations.ts` — migración v2→v3
- `src/domain/factories.ts` — `newTask()` incluye `summary: ""`
- `src/features/projects/components/kanban/TaskCard.tsx` — mostrar summary + click abre drawer
- `src/features/projects/components/TasksTab.tsx` — integrar drawer + `?detail=` URL param

**Sin dependencias nuevas.** Se reutilizan componentes de shadcn/ui ya existentes (Dialog, Button,
Input, Textarea, Select, etc.) y hooks del proyecto.

## Diseño del drawer

### Estructura visual

```
┌─────────────────────────────────────────┐
│  [X]                                    │  ← Header con botón cerrar
├─────────────────────────────────────────┤
│  Título (editable)                      │
│  Summary (editable, máx 140 chars)      │
├─────────────────────────────────────────┤
│  Descripción (editable, textarea)       │
├─────────────────────────────────────────┤
│  Status: [select]    Priority: [select] │
│  Assignee: [select]  Area: [select]     │
│  Sprint: [select]    Due: [date input]  │
├─────────────────────────────────────────┤
│  Tags: badge1, badge2 (readonly v1)     │
├─────────────────────────────────────────┤
│  Creada: 2026-07-01                     │
│  Actualizada: 2026-07-05                │
└─────────────────────────────────────────┘
```

### Comportamiento

- **Apertura**: click en card (excepto botones de acción) o `?detail=<taskId>` en URL.
- **Cierre**: click en overlay, tecla Escape, o click en botón X.
- **Cambio de tarea**: click en otra card mientras el drawer está abierto cambia el contenido
  sin cerrar/reabrir (smooth transition del contenido).
- **Edición inline**: cada campo editable persiste al blur o al cambiar el select. No hay botón
  "Guardar". Se usa `mutate()` con `ops.updateTask()`.
- **Bloqueo de drag**: mientras el drawer está abierto, el `DndContext` del kanban tiene
  `disabled={true}` para evitar conflictos de interacción.

### Responsive

- **Desktop (≥ md)**: drawer fijo a la derecha, ~400px de ancho, tablero visible a la izquierda.
- **Móvil (< md)**: drawer ocupa 100% del viewport como overlay (slide desde la derecha).

### URL sync

- `?detail=<taskId>` abre el drawer al cargar.
- Al abrir drawer, se actualiza la URL con `?detail=<taskId>` (sin recargar).
- Al cerrar drawer, se remueve el param `detail` de la URL.
- Compatible con `?focus=` (pueden coexistir: focus resalta la card, detail abre el drawer).

## Diseño del campo summary

### En la card del kanban

```
┌─────────────────────────────┐
│ 🔴 Alta    [Área] [Sprint]  │
│ Título de la tarea          │
│ Resumen corto de la tarea   │  ← summary, máx 2 líneas con ellipsis
│ que explica el alcance      │
│ 👤 Juan  📅 15 jul          │
│ [←] [→] [🔒] [✏️] [🗑️]      │
└─────────────────────────────┘
```

- Si `summary` está vacío, no se renderiza la línea (la card no cambia de alto).
- Si `summary` es largo, se trunca a 2 líneas con `line-clamp-2` y `text-ellipsis`.
- Estilo: `text-sm text-muted-foreground` (más tenue que el título).

### En el drawer

- Input de texto con `maxLength={140}`.
- Placeholder: "Resumen corto del alcance de la tarea...".
- Persiste al blur.

## Migración de schema (v2 → v3)

```typescript
// En src/domain/schemas/common.ts
export const SCHEMA_VERSION = 3; // era 2

// En src/domain/schemas/project.ts
export const TaskSchema = z.object({
  // ... campos existentes
  summary: z.string().max(140).default(""),
  // ...
});

// En src/domain/migrations.ts
// Agregar migración v2 → v3:
if (project.schemaVersion === 2) {
  project.tasks = project.tasks.map(t => ({
    ...t,
    summary: t.summary ?? "",
  }));
  project.schemaVersion = 3;
}
```

## Orden de implementación (3 fases)

**Fase 1 — Schema y migración (bajo riesgo, aislado):**
1. Actualizar `SCHEMA_VERSION` a 3.
2. Agregar `summary` a `TaskSchema`.
3. Agregar migración v2→v3 en `migrations.ts`.
4. Actualizar `newTask()` en `factories.ts`.
5. Verificar: `tsc --noEmit`, `vitest run` (sin cambios esperados en tests existentes).

**Fase 2 — TaskDetailDrawer (núcleo):**
6. Crear componente `TaskDetailDrawer.tsx` con estructura visual.
7. Implementar edición inline de todos los campos (title, summary, description, status, priority,
   assignee, area, sprint, dueDate).
8. Implementar apertura/cierre con animación CSS (`transform: translateX()`).
9. Implementar URL sync (`?detail=<taskId>`).
10. Verificar: drawer se abre/cierra, campos editables persisten, URL se actualiza.

**Fase 3 — Integración con TasksTab y TaskCard:**
11. En `TaskCard.tsx`: mostrar `summary` como subtítulo (con `line-clamp-2`).
12. En `TaskCard.tsx`: click en card (excepto botones) abre drawer.
13. En `TasksTab.tsx`: integrar `TaskDetailDrawer`, pasar `taskId` abierto.
14. En `TasksTab.tsx`: bloquear drag mientras drawer está abierto (`DndContext disabled`).
15. En `TasksTab.tsx`: leer `?detail=` de URL al cargar, actualizar URL al abrir/cerrar drawer.
16. Verificar: HU-01 a HU-04, smoke visual en desktop y móvil.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| El drawer bloquea la interacción con el tablero y el usuario no puede comparar tareas | El drawer no es modal (`aria-modal="false"`), el tablero sigue visible. Solo se bloquea el drag para evitar conflictos. |
| La edición inline puede perder datos si el usuario cierra el drawer sin hacer blur | Cada campo persiste al blur. Para selects, persisten al cambiar. Para inputs de texto, se puede agregar persistencia al presionar Enter como fallback. |
| El `?detail=` en URL puede conflictuar con `?focus=` | Son params independientes. `focus` resalta la card, `detail` abre el drawer. Pueden coexistir. |
| La migración v2→v3 puede fallar si hay proyectos con schema muy antiguo | La migración v2→v3 es aditiva (solo agrega `summary: ""`). Si el proyecto ya está en v2, la migración es segura. Si está en v1, primero corre v1→v2 (ya existente) y luego v2→v3. |

## Estrategia de verificación por fase

Después de cada fase: `npx tsc --noEmit`, `npx vitest run`, smoke visual manual en dev server.
No se avanza a la fase siguiente sin confirmar que la fase actual no rompió nada.

## Gates de la constitución

- ✅ **I Local-first:** sin cambios de persistencia ni red.
- ✅ **II Esquema-contrato:** migración v2→v3 aditiva, no destructiva.
- ✅ **III Plantillas/Tipos:** no aplica (tasks no tiene plantillas).
- ✅ **IV Diseño limpio:** drawer reutiliza lenguaje visual existente (shadcn/ui, badges, selects).
- ✅ **V Simplicidad/incremental:** 3 fases independientes, reutiliza `ops.updateTask` existente.
- ✅ **VI Migrabilidad:** migración registrada en `migrations.ts`, sigue el patrón v1→v2.
