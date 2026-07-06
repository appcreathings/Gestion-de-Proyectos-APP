# Especificación — Panel de detalle (drawer) + campo summary

- **Feature ID:** 013-kanban-task-detail-drawer
- **Estado:** Borrador
- **Fecha:** 2026-07-06
- **Epic:** kanban-task-experience
- **Principios afectados (constitución):** IV (diseño limpio y enfocado), V (simplicidad)

## Resumen

Introducir un **panel lateral (drawer)** que se abre al hacer click en una tarjeta del kanban, mostrando toda la información de la tarea y permitiendo edición inline. Además, agregar un campo `summary` (resumen corto, máx. 140 caracteres) visible como subtítulo en la card del kanban para comunicar el alcance de un vistazo.

## Problema / Necesidad

Actualmente la única forma de ver los detalles de una tarea es hacer click en "Editar" (lápiz), que abre el `TaskFormDialog` en modo edición. Esto tiene dos problemas:

1. **No hay vista de solo lectura**: el PM que quiere consultar un dato (fecha, assignee, descripción) tiene que entrar en modo edición innecesariamente.
2. **El modal tapa el tablero**: al abrir el dialog, el PM pierde el contexto visual de las columnas y el estado general del sprint.
3. **Las cards no comunican alcance**: el título solo no basta para entender qué implica la tarea. El PM tiene que abrirla para leer la descripción.

## Decisiones explícitas

- **Drawer lateral desde la derecha**, no modal centrado. Permite ver la tarea y el tablero simultáneamente.
- **El drawer no bloquea la interacción con el tablero**: el PM puede cerrar el drawer haciendo click fuera o con Escape, pero no puede mover tareas del kanban con el drawer abierto (se bloquea el drag para evitar conflictos).
- **Edición inline**: los campos editables se pueden modificar directamente en el drawer sin un botón "Editar" separado. Se persiste al blur o con Enter (según el campo).
- **`summary` es un campo nuevo**, no un truncamiento de `description`. Es un texto corto pensado para la card, no para el detalle.
- **El drawer se puede abrir con `?detail=<taskId>`** en la URL, análogo al `?focus=` existente.

## Migración de schema (v2 → v3)

```typescript
// En TaskSchema, agregar:
summary: z.string().max(140).default(""),
```

Migración no destructiva: todas las tareas existentes obtienen `summary: ""`.

## Historias de usuario

### HU-01 — Resumen visible en la card del kanban
**Como** PM, **quiero** ver un texto corto de contexto debajo del título de cada tarjeta **para** entender el alcance sin abrir la tarea.
- ✅ El `summary` aparece como subtítulo en la `TaskCard`, truncado a 2 líneas con ellipsis.
- ✅ Si `summary` está vacío, no se muestra ningún subtítulo (la card no cambia de alto innecesariamente).
- ✅ El summary es editable en el drawer (ver HU-03).

### HU-02 — Abrir drawer de detalle al hacer click en una tarjeta
**Como** PM, **quiero** hacer click en una tarjeta y que se abra un panel lateral con toda la info **para** ver el detalle sin perder el contexto del tablero.
- ✅ Click en cualquier parte de la card (excepto botones de acción) abre el drawer.
- ✅ El drawer se desliza desde la derecha, ocupando ~400px en desktop, 100% en móvil.
- ✅ El tablero sigue visible a la izquierda del drawer.
- ✅ La URL se actualiza con `?detail=<taskId>` (permite deep-link y refresh).
- ✅ Click en otra card cambia el drawer a esa tarea (sin cerrar y reabrir).
- ✅ Click fuera del drawer o tecla Escape lo cierra.

### HU-03 — Ver y editar metadata en el drawer
**Como** PM, **quiero** ver todos los campos de la tarea en el drawer y editarlos inline **para** no tener que abrir un formulario separado.
- ✅ El drawer muestra: título (editable), summary (editable), descripción (editable), status, priority, assignee, area, sprint, due date, tags (readonly por ahora), fechas de creación y actualización.
- ✅ Los campos editables se muestran como inputs/selects inline (no en un formulario con botón "Guardar").
- ✅ Los cambios se persisten automáticamente al blur o al cambiar el select.
- ✅ Los campos de solo lectura (fechas) se muestran en formato legible.

### HU-04 — Navegación por teclado
**Como** PM que no usa mouse, **quiero** abrir/cerrar el drawer y navegar entre tareas por teclado **para** no depender del mouse.
- ✅ `Enter` sobre una card enfocada abre el drawer.
- ✅ `Escape` cierra el drawer.
- ✅ `?detail=<taskId>` en la URL abre el drawer al cargar la página.

## Requisitos no funcionales

- **Animación suave**: el drawer usa `transform: translateX()` con transición CSS (no reflow del layout del tablero).
- **Responsive**: en móvil (< `md`), el drawer ocupa el 100% del viewport como un overlay.
- **Accesibilidad**: el drawer tiene `role="dialog"`, `aria-modal="false"` (no bloquea el tablero), focus trap mientras está abierto.
- **Performance**: el drawer no monta/desmonta las columnas del kanban; estas siguen montadas pero con pointer-events bloqueados mientras el drawer está abierto.

## Archivos afectados

| Archivo | Cambio |
|---------|--------|
| `src/domain/schemas/project.ts` | Agregar `summary` a `TaskSchema` |
| `src/domain/migrations.ts` | Migración v2→v3 (agregar `summary: ""` a tareas existentes) |
| `src/domain/factories.ts` | `newTask()` incluye `summary: ""` |
| `src/features/projects/components/kanban/TaskCard.tsx` | Mostrar `summary` como subtítulo; click abre drawer |
| `src/features/projects/components/kanban/TaskDetailDrawer.tsx` | **Nuevo**. Componente del drawer con vista/edición inline. |
| `src/features/projects/components/TasksTab.tsx` | Integrar drawer; manejar `?detail=` URL param; bloquear drag con drawer abierto |

## Fuera de alcance (este spec)

- Comentarios (spec 014)
- Archivado (spec 015)
- Subtareas / checklists embebidos
- Tags editables (el campo existe pero no se expone en UI en este spec)
- Historial de cambios

## Métricas de éxito

- Las 4 historias de usuario cumplen sus criterios de aceptación.
- `tsc --noEmit`, `vitest run` y `vite build` en verde.
- El drawer se abre en < 100ms (sin layout shift perceptible).
- El `summary` es visible y legible en las cards sin saturarlas visualmente.
