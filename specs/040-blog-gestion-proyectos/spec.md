# Spec 040 — Blog: roadmap de gestión de proyectos + prerender de rutas públicas

## Progreso

- **Estado general: 🟩 IMPLEMENTADO (2026-07-31).** Nace de una auditoría del blog (18 artículos):
  14 de 18 hablan de Hito/local-first/privacidad/comparativas — contenido de fondo de embudo. Faltaba
  cobertura de búsquedas informacionales puras de gestión de proyectos (el público que después necesita
  una app como Hito). Se planeó un roadmap de 32 artículos en 5 clusters pilar→satélite (ver
  `ROADMAP_BLOG.md`) y se implementaron los primeros 6, junto con 4 mejoras estructurales del blog y
  prerender de HTML estático para todas las rutas públicas.

- **Fase A — Modelo de datos y estructura editorial.**
  - `BlogCategory` (`src/features/blog/types.ts`) gana `gestion-proyectos` y `plantillas`
    (`data/categories.ts`).
  - `BlogArticleMeta` gana `author?` (E-E-A-T, con default `DEFAULT_AUTHOR` aplicado en
    `articles-index.ts` para no editar los 18 artículos existentes), `updatedAt?`, `pillar?` y
    `related?`. `BlogArticleContent` gana `faq?` y `howTo?` (alimentan schema y render).
  - `getRelatedMeta` (`articles-index.ts`) pasa a resolver en cascada: `related` explícito → resto del
    cluster (`pillar`) → relleno por categoría (comportamiento previo). `RelatedPosts` sube de 2 a 3
    relacionados.
  - Páginas de categoría indexables: `BlogCategoryPage.tsx` en `/blogs/categoria/:category` (antes
    `?categoria=X` era una sola URL para las 10 categorías ante Google). `BlogIndexPage` redirige el
    query param viejo a la ruta nueva para conservar link equity; `vite.config.ts` añade
    `BLOG_CATEGORY_SLUGS` al sitemap.
  - Schema enriquecido en `BlogPostPage`/`BlogPostView`: `author`, `dateModified`, `image`, y
    `FAQPage`/`HowTo` en `@graph` cuando el artículo los declara. `SeoPage` gana `ogType` configurable
    (`"article"` para posts) y soporta `schemaJson` como array (varios `<script ld+json>`). Render
    visible: bloque de FAQ en `SeoArticle` y "Actualizado el…" junto a la fecha cuando hay `updatedAt`.
  - **Archivos:** `types.ts`, `data/categories.ts`, `data/articles-index.ts`, `components/RelatedPosts.tsx`,
    `pages/BlogCategoryPage.tsx` (nuevo), `pages/BlogIndexPage.tsx`, `pages/BlogPostPage.tsx`,
    `features/seo/SeoPage.tsx`, `features/seo/SeoArticle.tsx`, `App.tsx`, `vite.config.ts`.

- **Fase B — Roadmap de 32 artículos + primeros 6.**
  - `ROADMAP_BLOG.md`: 32 artículos en 5 clusters (Fundamentos, Metodologías, Tips y problemas reales,
    Plantillas y herramientas, Por rol), cada uno con pilar propio salvo el último.
  - 6 artículos publicados (cluster Fundamentos completo + `scrum-vs-kanban` adelantado del cluster
    Metodologías, colgando temporalmente del pilar general): `gestion-de-proyectos-guia-completa`
    (pilar), `fases-de-un-proyecto`, `como-estimar-tiempos-proyecto`, `matriz-raci`, `scrum-vs-kanban`,
    `alcance-de-proyecto-scope-creep`. Contenido agnóstico de herramienta (Hito solo aparece en el CTA
    final), con tablas/FAQ/HowTo y enlazado interno cruzado.
  - Test anti-drift (`data/articles.test.ts`, fase C pendiente de spec 035): valida que todo slug tenga
    loader, no haya duplicados, y que `pillar`/`related` apunten a slugs existentes.
  - **Archivos:** `ROADMAP_BLOG.md` (nuevo), `data/articles/<slug>.tsx` × 6 (nuevos),
    `data/articles/index.ts`, `data/articles.test.ts` (nuevo).

- **Fase C — Prerender de rutas públicas.**
  - `src/routes/marketingRoutes.tsx` (nuevo): fuente única de las rutas de marketing, extraída de
    `App.tsx` — la reutilizan tanto el router de la app como el entry de prerender.
  - `BlogPostPage.tsx` partido en `BlogPostView` (presentacional, sin hooks de carga) + `BlogPostPage`
    (resuelve `useParams`/`loadArticle` en `useEffect`, sin cambiar el comportamiento del cliente).
  - `src/prerender/entry.tsx` (nuevo): `renderRoute(url)` para rutas genéricas (vía `useRoutes` +
    `StaticRouter`) y `renderBlogPost(slug)` que resuelve `loadArticle` de antemano y renderiza
    `BlogPostView` directo — evita el problema de que `useEffect` no corre en SSR. Usa
    `renderToPipeableStream`+`onAllReady` (no `renderToString`, que no espera los `React.lazy()` de
    `marketingRoutes` y renderizaría el fallback "Cargando…").
  - `scripts/prerender.mjs` (nuevo, corre vía `tsx` — mismo patrón que `scripts/mcp-server.mjs`, sin
    necesidad de un segundo build de Vite): toma `dist/index.html` como plantilla, reemplaza
    `<title>`/`<meta description>` genéricos por el `<head>` real de Helmet por ruta, e inyecta el HTML
    en `<div id="root">`. Escribe `dist/<ruta>/index.html` para las 13 rutas estáticas, 10 categorías,
    13 docs y 24 posts de blog (54 rutas totales). `package.json`: `build` ahora corre
    `tsc -b && vite build && npm run prerender`.
  - `vite.config.ts`: `navigateFallbackDenylist` en el plugin PWA para `/blogs`, `/docs`, `/changelog` y
    las páginas SEO satélite — sin esto, un visitante recurrente con el service worker instalado
    recibiría el shell vacío de `navigateFallback` en vez del HTML prerenderizado.
  - **Verificado en HTML crudo** (no en el navegador): `<title>`/OG/canonical/JSON-LD (BlogPosting +
    FAQPage + BreadcrumbList) presentes y sin duplicados; `<h1>` y cuerpo del artículo presentes sin
    "Cargando…"; sitemap con 61 `<loc>`.
  - **Archivos:** `src/routes/marketingRoutes.tsx` (nuevo), `App.tsx`, `pages/BlogPostPage.tsx`,
    `src/prerender/entry.tsx` (nuevo), `scripts/prerender.mjs` (nuevo), `package.json`, `vite.config.ts`.

- **Verificación:** `tsc --noEmit` ✅ · `eslint src` ✅ (3 errores preexistentes ajenos, 0 nuevos) ·
  `vitest run` ✅ 830/830 · `vite build && prerender` ✅ 54 rutas escritas.
- **Pendiente:** completar cluster 1 (3 artículos), luego cluster 2 (empezando por su pilar), y así
  sucesivamente por `ROADMAP_BLOG.md`. Reasignar el `pillar` de `scrum-vs-kanban` cuando se publique
  `metodologias-gestion-proyectos`.

## Context

Ver `ROADMAP_BLOG.md` para el detalle completo de los 32 artículos planeados y el estado de cada uno.
