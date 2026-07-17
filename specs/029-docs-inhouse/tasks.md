# Tasks — Documentación pública in-house (029)

Tareas numeradas por fase. Cada fase deja la app usable de punta a punta (Principio V) y termina con
`tsc --noEmit` + `vitest run` + smoke visual manual confirmado antes de avanzar (mismo criterio que
specs 003/010).

## Fase 1 — Esqueleto
- [x] T2901 `src/features/docs/types.ts`: `DocGroup`, `DocModule` (ver plan.md).
- [x] T2902 `src/features/docs/data/groups.ts`: `DOC_GROUPS: Record<DocGroup, {label, order}>` con
  los 4 grupos fijos (Primeros pasos, Organizar tu trabajo, Plantillas/automatización/IA,
  Seguimiento y configuración).
- [x] T2903 `src/features/docs/data/slugs.ts`: `DOC_SLUGS` con los 12 slugs (tabla de spec.md).
- [x] T2904 `src/features/docs/components/DocCard.tsx`: tarjeta título + excerpt + link a
  `/docs/:slug` (análogo a `BlogCard`, sin badge de categoría/fecha).
- [x] T2905 `src/features/docs/pages/DocsIndexPage.tsx`: hero + 4 secciones por `DOC_GROUPS` (orden
  fijo), cada una con grid de `DocCard` de `DOC_MODULES.filter(...)`.
- [x] T2906 `src/features/docs/pages/DocModulePage.tsx`: `useParams` + `getModuleBySlug` +
  redirect a `/docs` si no existe + `SeoPage`/`SeoArticle` + link "← Volver a Documentación".
- [x] T2907 `App.tsx`: reemplazar el import/ruta de `DocsPage` por `DocsIndexPage`; agregar ruta
  `/docs/:slug` → `DocModulePage`.
- [x] T2908 Eliminar `src/features/seo/DocsPage.tsx`.
- [x] T2909 `vite.config.ts`: importar `DOC_SLUGS`, agregar `"/docs"` + rutas `/docs/${slug}` a
  `dynamicRoutes` del sitemap.
- [x] T2910 Verificar: `tsc --noEmit`, `vite build` en verde. **Smoke visual pendiente** (el proyecto
  no tiene Playwright instalado ni harness de navegador — se corrió `vite` dev server y se confirmó
  HTTP 200 en `/`, pero falta confirmación visual manual del usuario de `/docs` y un slug).

## Fase 2 — Contenido (las 12 guías)
- [x] T2920 `data/modules.tsx` — Guía 1: `primeros-pasos` (verificar `FileSystemAdapter`,
  `DownloadAdapter`, PWA en `vite.config.ts`).
- [x] T2921 Guía 2: `productos-y-proyectos` (verificar schemas product/project, RACI vía
  `MultiPersonSelect`).
- [x] T2922 Guía 3: `procesos-y-checklists` (verificar `instantiate.ts`, `ChecklistSection`,
  `ProcessEditorDialog`).
- [x] T2923 Guía 4: `tareas-y-kanban` (verificar `TasksTab`, `KanbanColumn`/`TaskCard`, drawer de
  detalle con comentarios/archivado/subtareas).
- [x] T2924 Guía 5: `sprints-y-trimestres` (verificar `QuartersPage`/`QuarterFormDialog`).
- [x] T2925 Guía 6: `mis-tareas-y-daily` (verificar `MyTasksPage`, `DailyStandupPage`).
- [x] T2926 Guía 7: `tipos-y-plantillas` (verificar `LibraryPage`, `ApplyTemplateDialog`,
  `instantiate.ts`).
- [x] T2927 Guía 8: `automatizaciones-y-flujos` (verificar `flows/*`, `engine.ts`, `validation.ts`,
  `templates.ts`, integraciones HubSpot/Sheets/Email/Webhook + HMAC).
- [x] T2928 Guía 9: `asistente-ia` (verificar `gemini/client.ts`/`agent.ts`, `ai/tools/*`,
  `ai/rag/*`, `modelSelector.ts`).
- [x] T2929 Guía 10: `dashboard-y-portafolio` (verificar `DashboardPage`, salud RAG en
  `domain/portfolio.ts`).
- [x] T2930 Guía 11: `notificaciones` (verificar `NotificationsPage`, `automations/temporal.ts`).
- [x] T2931 Guía 12: `ajustes-y-datos` (verificar `PeopleCard`, `CollectionTransferCard`,
  `integrations/vault.ts`).
- [ ] T2932 Smoke visual: `/docs` lista las 12 guías en sus 4 grupos; abrir al menos una guía por
  grupo sin error. **Pendiente** (sin harness de navegador en el proyecto).

## Fase 3 — Cierre
- [x] T2940 Confirmar que `LandingFooter.tsx` sigue enlazando `/docs` sin romperse.
- [x] T2941 `npm run typecheck && npm test && npm run build`.
- [x] T2942 Actualizar memoria del proyecto con el resumen de la spec 029 (mismo hábito que specs
  anteriores).

## Explícitamente fuera de este tasks.md
- Buscador de texto libre o versionado de docs.
- Cualquier framework de documentación externo o segundo deploy.
- Cambios a `SeoArticle.tsx`/`SeoPage.tsx` (se reutilizan tal cual).
- Traducción a otros idiomas.

## Verificación por fase
Tras cada fase: `npx tsc --noEmit`, `npx vitest run`, smoke visual manual en dev server de los casos
listados. No se avanza a la fase siguiente sin confirmar visualmente que la fase actual no rompió
nada.
