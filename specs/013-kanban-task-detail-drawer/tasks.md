# Tasks — Panel de detalle (drawer) + campo summary (013)

Tareas numeradas por fase. `[P]` = paralelizable dentro de la fase. Cada fase deja la app usable de
punta a punta y termina con `tsc --noEmit` + `vitest run` + smoke visual manual confirmado antes de
avanzar.

## Fase 1 — Schema y migración
- [x] T1301 `src/domain/schemas/common.ts`: actualizar `SCHEMA_VERSION` de 2 a 3.
- [x] T1302 `src/domain/schemas/project.ts`: agregar `summary: z.string().max(140).default("")` a
  `TaskSchema`.
- [x] T1303 `src/domain/migrations.ts`: agregar migración v2→v3 que agrega `summary: ""` a tareas
  existentes (si no tienen el campo).
- [x] T1304 `src/domain/factories.ts`: actualizar `newTask()` para incluir `summary: ""`.
- [x] T1305 Verificar: `npx tsc --noEmit` y `npx vitest run` pasan sin errores.

## Fase 2 — TaskDetailDrawer (núcleo)
- [x] T1310 `[P]` Crear `src/features/projects/components/kanban/TaskDetailDrawer.tsx` con estructura
  visual básica (header con botón cerrar, secciones para título, summary, descripción, metadata).
- [x] T1311 `[P]` Implementar apertura/cierre con animación CSS (`transform: translateX()` con
  transición). Desktop: ~400px ancho fijo a la derecha. Móvil: 100% viewport como overlay.
- [x] T1312 Implementar edición inline de campos de texto (title, summary, description): persisten
  al blur o al presionar Enter. Usar `ops.updateTask()` vía `mutate()`.
- [x] T1313 Implementar edición inline de campos de selección (status, priority, assignee, area,
  sprint, dueDate): persisten al cambiar el select.
- [x] T1314 Mostrar campos de solo lectura (createdAt, updatedAt) en formato legible.
- [x] T1315 Implementar URL sync: leer `?detail=<taskId>` al cargar, actualizar URL al abrir/cerrar
  drawer. Usar `useSearchParams` de react-router-dom.
- [x] T1316 Agregar accesibilidad: `role="dialog"`, `aria-modal="false"`, focus trap mientras está
  abierto, cierre con Escape.
- [x] T1317 Verificar: drawer se abre/cierra correctamente, campos editables persisten, URL se
  actualiza, animación es suave en desktop y móvil.

## Fase 3 — Integración con TasksTab y TaskCard
- [x] T1320 `TaskCard.tsx`: mostrar `summary` como subtítulo debajo del título, con `line-clamp-2` y
  `text-sm text-muted-foreground`. Si está vacío, no renderizar la línea.
- [x] T1321 `TaskCard.tsx`: click en cualquier parte de la card (excepto botones de acción) abre el
  drawer. Agregar `onClick` handler que llama a callback `onOpenDetail(taskId)`.
- [x] T1322 `TaskCard.tsx`: prevenir que el click en botones de acción (mover, bloquear, editar,
  eliminar) dispare la apertura del drawer (usar `e.stopPropagation()`).
- [x] T1323 `TasksTab.tsx`: integrar `TaskDetailDrawer`, pasar `taskId` del drawer abierto como prop.
  Estado `detailTaskId: string | null` en `TasksTab`.
- [x] T1324 `TasksTab.tsx`: bloquear drag mientras drawer está abierto. Implementado vía guard en
  `onDragStart` (DndContext no soporta `disabled` prop).
- [x] T1325 `TasksTab.tsx`: leer `?detail=` de URL al cargar (con `useSearchParams`), setear
  `detailTaskId` inicial. Actualizar URL al abrir/cerrar drawer.
- [x] T1326 `TasksTab.tsx`: implementar callback `onOpenDetail(taskId)` que se pasa a `TaskCard`.
  Implementar callback `onCloseDetail()` que cierra el drawer.
- [x] T1327 Verificar: HU-01 (summary visible en card), HU-02 (click abre drawer), HU-03 (edición
  inline), HU-04 (teclado: Enter abre, Escape cierra). Smoke visual en desktop y móvil.
- [x] T1328 Verificar: `npx tsc --noEmit`, `npx vitest run`, `npm run build` pasan sin errores.
  Actualizar memoria del proyecto con resumen de 013.

## Explícitamente fuera de este tasks.md
- Comentarios (spec 014)
- Archivado (spec 015)
- Subtareas / checklists embebidos
- Tags editables (el campo existe pero no se expone en UI en este spec)
- Historial de cambios

## Verificación por fase
Tras cada fase: `npx tsc --noEmit`, `npx vitest run`, smoke visual manual en dev server de los
casos listados. No se avanza con typecheck o tests rotos, ni sin confirmación visual. Al cerrar la
fase 3: `npm run build` y actualización de la memoria del proyecto con el resumen de 013.
