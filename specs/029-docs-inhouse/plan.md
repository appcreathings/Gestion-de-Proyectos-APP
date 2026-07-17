# Plan Técnico — Documentación pública in-house (`/docs`)

- **Feature:** 029-docs-inhouse
- **Constitución:** alineado con IV (diseño limpio) y V (simplicidad). Sin violaciones — no toca
  esquema de datos (II) ni storage (I/VI): es contenido público nuevo, igual que spec 009 (blog).

## Alcance técnico

Ninguna dependencia nueva. Se replica **exactamente** la arquitectura de `src/features/blog/`
(spec 009), cambiando "artículo" por "guía" y "categoría filtrable" por "grupo fijo de tabla de
contenidos". Reutiliza `SeoPage`, `SeoArticle`, `Breadcrumb` ya existentes.

## Archivos nuevos

```
src/features/docs/
  types.ts                 # DocGroup, DocModule (mismo shape que BlogArticle, sin `featured`/`category` filtrable)
  data/
    groups.ts               # Record<DocGroup, { label, order }> — 4 grupos fijos
    modules.tsx             # DOC_MODULES: DocModule[] — las 12 guías (intro + sections como ReactNode)
    slugs.ts                # DOC_SLUGS — usado por vite.config.ts para el sitemap dinámico
  components/
    DocCard.tsx              # tarjeta de guía en el índice (título + excerpt), análogo a BlogCard
  pages/
    DocsIndexPage.tsx        # `/docs` — 4 secciones (grupos) en orden fijo, cada una con sus DocCard
    DocModulePage.tsx        # `/docs/:slug` — SeoPage + SeoArticle, redirect a /docs si el slug no existe
```

## Archivos modificados

| Archivo | Cambio |
|---|---|
| `src/App.tsx` | Import de `DocsIndexPage`/`DocModulePage` en vez de `DocsPage`; ruta `{ path: "/docs", element: page(<DocsIndexPage />) }` + nueva `{ path: "/docs/:slug", element: page(<DocModulePage />) }` |
| `vite.config.ts` | Import `DOC_SLUGS` desde `src/features/docs/data/slugs.ts`; agregar `"/docs"` + `DOC_SLUGS.map(slug => \`/docs/${slug}\`)` a `dynamicRoutes` (mismo patrón que `BLOG_SLUGS`) |
| `src/features/seo/DocsPage.tsx` | Se elimina (reemplazado por `docs/pages/DocsIndexPage.tsx`) |
| `src/features/landing/components/LandingFooter.tsx` | Sin cambio de comportamiento — ya enlaza a `/docs`, sigue apuntando ahí; se verifica que el link sobreviva |

## Tipos (`types.ts`)

```ts
export type DocGroup = "empezar" | "organizar" | "plantillas-ia" | "seguimiento";

export type DocModule = {
  slug: string;
  title: string;
  excerpt: string;
  group: DocGroup;
  seo: { title: string; description: string; ogImageAlt?: string };
  content: {
    eyebrow: string;
    intro: ReactNode;
    sections: { heading: string; body: ReactNode }[];
  };
};
```

Idéntico shape a `BlogArticle` salvo `group` en vez de `category`/`categoryLabel`/`featured`/
`publishedAt`/`readingTime` (una guía de docs no tiene fecha editorial ni tiempo de lectura — no es
contenido de blog).

## Diseño de página

- **`DocsIndexPage`**: hero corto (título + 1 párrafo, mismo patrón que `DocsPage.tsx` actual) +
  4 bloques `<section>` en el orden fijo de `DOC_GROUPS` (por `order`), cada uno con su label y un
  grid de `DocCard` (`DOC_MODULES.filter(m => m.group === groupKey)`).
- **`DocModulePage`**: `useParams<{slug}>` → `getModuleBySlug(slug)` (helper análogo a
  `getArticleBySlug`) → si no existe, `<Navigate to="/docs" replace />`; si existe, `SeoPage` +
  `SeoArticle` con `cta={{ label: "Probar Hito — sin registro" }}` (mismo texto que blog, ya en
  tuteo neutro) + un link "← Volver a Documentación" arriba del artículo (usa `Breadcrumb` o un
  simple `Link` con `ArrowLeft`, a criterio de implementación — no hay `RelatedPosts` equivalente
  porque 12 guías con grupos fijos no necesitan "relacionados" calculados, ya se navega por grupo
  desde el índice).
- **JSON-LD**: `SeoPage` ya acepta `schemaJson` (usado por `BlogPostPage` con `BlogPosting`); acá se
  pasa `"@type": "TechArticle"` con `headline`/`description`/`author`/`publisher`/
  `mainEntityOfPage: https://hito.autos/docs/${slug}`.

## Redacción del contenido (las 12 guías)

Cada guía sigue el mismo shape `intro + sections[]` que un artículo de blog, pero con voz de
**how-to** (instrucciones accionables, "dónde encontrarlo en la app") en vez de voz editorial. Antes
de escribir cada una se verifica el código real del feature correspondiente (mismo criterio de spec
028): componentes, stores y schemas listados abajo.

| Guía | Código verificado |
|---|---|
| Primeros pasos | `src/storage/FileSystemAdapter.ts`, `DownloadAdapter.ts`, `vite-plugin-pwa` en `vite.config.ts` |
| Productos y proyectos | `src/domain/schemas/{product,project}.ts`, `ProjectFormDialog.tsx`, `PersonSelect`/`MultiPersonSelect` (RACI) |
| Procesos y checklists | `src/domain/instantiate.ts`, `ChecklistSection`, `ProcessEditorDialog.tsx` |
| Tareas y Kanban | `TasksTab.tsx`, `kanban/{KanbanColumn,TaskCard}.tsx`, `TaskDetailDrawer` (comentarios/archivado/subtareas) |
| Sprints y trimestres | `src/features/quarters/{QuartersPage,QuarterFormDialog}.tsx` |
| Mis tareas y Daily | `src/features/my-tasks/MyTasksPage.tsx`, `src/features/daily/DailyStandupPage.tsx` |
| Tipos y plantillas | `src/features/library/LibraryPage.tsx`, `ApplyTemplateDialog.tsx`, `src/domain/instantiate.ts` |
| Automatizaciones y Flujos | `src/features/flows/*`, `src/flows/{engine,validation,templates,retry-delay}.ts`, `src/integrations/*` |
| Asistente IA | `src/ai/gemini/{client,agent}.ts`, `src/ai/tools/*`, `src/ai/rag/*`, `src/ai/modelSelector.ts` |
| Dashboard y portafolio | `src/features/dashboard/DashboardPage.tsx`, `src/domain/portfolio.ts` (salud RAG) |
| Notificaciones | `src/features/notifications/NotificationsPage.tsx`, `src/automations/temporal.ts` |
| Ajustes y datos | `src/features/settings/{PeopleCard,CollectionTransferCard}.tsx`, `src/integrations/vault.ts` |

## Orden de implementación (3 fases)

**Fase 1 — Esqueleto (bajo riesgo, aislado):**
1. `types.ts`, `data/groups.ts`, `data/slugs.ts` (slugs primero, sin contenido — permite cablear
   routing/sitemap antes de escribir texto).
2. `components/DocCard.tsx`, `pages/DocsIndexPage.tsx`, `pages/DocModulePage.tsx` con
   `DOC_MODULES` vacío (o 1 guía dummy) para verificar routing/build antes de invertir en contenido.
3. `App.tsx`: reemplazar ruta `/docs`, agregar `/docs/:slug`; borrar `DocsPage.tsx`.
4. `vite.config.ts`: agregar `DOC_SLUGS` al sitemap dinámico.
5. Verificar: `tsc --noEmit`, `vite build`, smoke visual de `/docs` (vacío pero sin crashear).

**Fase 2 — Contenido (las 12 guías):**
6. Escribir `data/modules.tsx` completo, guía por guía, verificando cada una contra el código listado
   arriba antes de redactar sus `sections`.
7. Verificar: `/docs` lista las 12 guías agrupadas; cada `/docs/:slug` abre sin error.

**Fase 3 — Cierre:**
8. Confirmar que `LandingFooter` sigue apuntando a `/docs` sin cambios rotos.
9. `npm run typecheck && npm test && npm run build`.
10. Smoke visual manual: índice + al menos 3 guías representativas (una de cada grupo distinto) +
    slug inexistente → redirect.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Contenido desactualizado apenas se escribe (el producto sigue cambiando, ej. Flujos tuvo 10 specs en 2 semanas) | Cada guía verifica código al momento de escritura (esta spec), no promete mantenimiento continuo — igual trade-off que spec 009/028 ya aceptan para blog/landing |
| 12 guías es contenido considerable de escribir de una sola vez, riesgo de inconsistencia de tono | Mismo componente `SeoArticle` fuerza estructura idéntica (eyebrow/intro/sections); redactar todas en la misma sesión con la tabla de "código verificado" como checklist |
| Sitemap dinámico mal formado si `DOC_SLUGS` no coincide con `data/modules.tsx` | `getModuleBySlug` + un test simple (mismo patrón que blog, si existe) que valida `DOC_SLUGS.length === DOC_MODULES.length` y que cada slug tiene módulo |

## Gates de la constitución (revisión)

- ✅ **I Local-first:** sin cambios de persistencia ni red — contenido estático.
- ✅ **II Esquema-contrato:** sin cambios de esquema ni migraciones.
- ✅ **III Plantillas/Tipos:** no aplica (contenido público, no dominio de la app).
- ✅ **IV Diseño limpio:** reutiliza el lenguaje visual ya validado de blog/seo (mismo `SeoArticle`),
  sin componentes nuevos de UI más allá de una tarjeta de guía.
- ✅ **V Simplicidad/incremental:** 3 fases verificables, cero dependencias nuevas, reutiliza
  `SeoPage`/`SeoArticle`/`Breadcrumb` existentes.
- ✅ **VI Migrabilidad:** no toca `StorageAdapter`.
