# Tasks — Sprints, Trimestres y navegación en árbol (008)

Tareas numeradas por fase. Cada fase deja la app usable de punta a punta (Principio V) y se
verificó con `npx tsc --noEmit` + `npx vitest run` antes de avanzar.

## Fase 1 — Modelo de datos + almacenamiento + base de fechas ✅
- [x] T801 `src/domain/schemas/common.ts`: `SCHEMA_VERSION` 1→2; enums `SprintStatus`,
  `QuarterStatus`.
- [x] T802 `src/domain/schemas/project.ts`: `SprintSchema`; `Project.sprints`,
  `Project.quarterId`; `Task.sprintId`.
- [x] T803 `src/domain/schemas/quarter.ts` (nuevo): `QuarterSchema`.
- [x] T804 `src/domain/schemas/index.ts`: export de `quarter.ts`.
- [x] T805 `src/domain/schemas/workspace.ts`: `QuarterIndexEntry`, `WorkspaceIndexSchema.quarters`.
- [x] T806 `src/domain/migrations.ts`: `"quarters"` en `MigrationKind`; paso
  `projects: [{ to: 2, up: (d) => d }]`.
- [x] T807 `src/storage/StorageAdapter.ts`: `"quarters"` en `Collection` + `collectionSchema`.
- [x] T808 `src/storage/FileSystemAdapter.ts`: `"quarters"` en `COLLECTION_DIRS`.
- [x] T809 `src/storage/DownloadAdapter.ts`: `"quarters"` en los arrays `cols` de
  `exportAll`/`importAll`.
- [x] T810 `src/store/useDataStore.ts`: estado `quarters`; `createQuarter`/`updateQuarter`/
  `deleteQuarter`; carga en `hydrate()`; inclusión en `reindex()`.
- [x] T811 `src/domain/projectOps.ts`: `addSprint`/`updateSprint`/`removeSprint`/
  `assignTaskToSprint`.
- [x] T812 `src/domain/factories.ts`: `newSprint`, `newQuarter`; fix de `schemaVersion`
  hardcodeado → `SCHEMA_VERSION` importado en todos los factories.
- [x] T813 `src/domain/labels.ts`: `sprintStatusLabel/Variant`, `quarterStatusLabel/Variant`.
- [x] T814 `src/lib/dates.ts`: `daysBetween`, `formatDay`, `relativeDay`, `formatRange`.
- [x] T815 `src/lib/dates.test.ts` (nuevo, 10 tests).
- [x] T816 `src/components/forms/DateFieldPreview.tsx` (nuevo): `DateFieldPreview` +
  `DateRangeSummary`.
- [x] T817 Integración del preview en `TaskFormDialog.tsx`, `ItemEditorDialog.tsx`,
  `ProjectFormDialog.tsx`.
- [x] T818 `src/domain/migrations.test.ts`: test actualizado para reflejar la migración real
  `projects v1→v2` (antes asumía "sin migraciones en v1").
- [x] T819 `src/domain/projectOps.test.ts`: tests de `assignTaskToSprint`/`removeSprint` (+3).

  Verificado: `tsc --noEmit` limpio, 115/115 tests.

## Fase 2 — Sprints en el proyecto ✅
- [x] T820 `src/features/projects/components/SprintFormDialog.tsx` (nuevo).
- [x] T821 `src/features/projects/components/SprintSwitcher.tsx` (nuevo): scope Todas/Backlog/
  sprint, prev/next, editar/eliminar sprint.
- [x] T822 `TasksTab.tsx`: filtro combinado área+sprint (`?sprint=`), default al sprint activo del
  proyecto si existe; drag & drop opera sobre el subconjunto doblemente filtrado.
- [x] T823 `TaskFormDialog.tsx`: campo Sprint + `defaultSprintId`.

  Verificado: `tsc --noEmit` limpio, 115/115 tests.

## Fase 3 — Trimestres ✅
- [x] T830 `src/domain/compute.ts`: `aggregateChecklistProgress`, `quarterRollup`.
- [x] T831 `src/features/quarters/QuartersPage.tsx` + `QuarterFormDialog.tsx` (nuevo).
- [x] T832 `ROUTES.quarters`, `ROUTES.projectsByQuarter` en `paths.ts`; ruta registrada en
  `App.tsx`; entrada "Trimestres" en `NAV` de `AppLayout.tsx` (5ª posición, fuera del slice móvil
  primario).
- [x] T833 `ProjectFormDialog.tsx`: selector de Trimestre.
- [x] T834 `ProjectsPage.tsx`: toggle Lista/Por trimestre/Por producto (`Tabs`) +
  `GroupedProjects` con progreso agregado por grupo; deep-link `?quarter=` resalta el grupo.

  Verificado: `tsc --noEmit` limpio, 147/147 tests.

## Fase 4 — Navegación híbrida ✅
- [x] T840 `src/components/layout/ProjectTree.tsx` (nuevo): árbol Producto→Proyecto(→Área),
  auto-expansión del grupo activo.
- [x] T841 `AppLayout.tsx`: árbol de 2 niveles bajo "Proyectos" en el rail.
- [x] T842 `src/features/projects/ProjectsLayout.tsx` (nuevo): 2 columnas
  (`lg:grid-cols-[240px_1fr]`) con árbol de 3 niveles + `<Outlet/>`.
- [x] T843 `App.tsx`: `projects`/`projects/:id` anidadas bajo `ProjectsLayout` (antes rutas
  planas).
- [x] T844 `AppLayout.tsx`: contenedor principal `max-w-6xl` → `max-w-7xl`.

  Verificado: `tsc --noEmit` limpio (2 errores preexistentes en archivos de la sesión concurrente
  `007-rag-semantico`, no relacionados), 147/147 tests.

## Fase 5 — Pulido visual ✅
- [x] T850 `TaskCard.tsx`: badge de Sprint cuando el scope es "Todas las tareas".
- [x] T851 Revisión de breadcrumb existente — sin cambios (el chip decorativo `.json` del mockup
  se descarta por ser ruido sin función, principio IV).
- [x] T852 `TasksTab.tsx`: al crear un sprint nuevo, el `SprintSwitcher` salta automáticamente a
  ese sprint para que el usuario pueda empezar a añadirle tareas.

  Verificado: `tsc --noEmit` limpio, 147/147 tests.

## Verificación final ✅
- Smoke visual end-to-end con Playwright: crear sprint, crear trimestre, navegar por el árbol,
  verificar preview de fechas, alternar vistas de Proyectos. **0 errores de consola.**
- `npx tsc --noEmit` limpio.
- `npx vitest run` en verde (154/154 tests tras integrar los tests del spec 007).

## Pendiente explícito (fuera de este ciclo)
- Reconciliar el copy de `ProductMockup.tsx` con las funciones reales (fuera de alcance, ver
  `spec.md`).
- Los 2 errores de `tsc` en `src/components/ai/AiImproveButton.tsx` y
  `src/features/library/ProjectTypeDialog.tsx` pertenecen a la sesión concurrente
  `007-rag-semantico` y no se tocaron.
