# Spec 035 — Blog: performance y organización (split por artículo + metadata separada)

## Progreso

- **Estado general: 🟩 IMPLEMENTADO Fases A+B (2026-07-22).** Nace de una petición del usuario para
  optimizar los blog posts en **velocidad** y **organización**. Se auditó el estado real del feature blog:
  `articles.tsx` era un monolito de **5.232 líneas con 18 artículos** (JSX inline), `slugs.ts` una lista de
  slugs duplicada a mano, y cuatro consumidores (`BlogIndexPage`, `BlogPostPage`, `RelatedPosts` y el
  `BlogTeaser` de la **landing**) importaban el array completo `BLOG_ARTICLES` — que mezclaba metadata
  ligera con el `content` pesado. Resultado: abrir un solo artículo descargaba el cuerpo de los 18, el
  índice arrastraba todo el contenido, y la landing empaquetaba los 18 cuerpos.

- **✅ Fases A+B (2026-07-22).** Se ejecutaron juntas (el split por artículo requiere los archivos por-slug
  de todos modos). Se partió el monolito con un script mecánico (respetando la indentación Prettier) en
  **18 archivos `data/articles/<slug>.tsx`**, cada uno `export const article: BlogArticle`. Nuevos módulos:
  `data/articles-index.ts` (`BLOG_ARTICLES_META` sin JSX + helpers `getArticleMeta`/`getFeaturedArticles`/
  `getRecentArticles`/`getRelatedMeta` + `BLOG_SLUGS` **derivado**) y `data/articles/index.ts` (registro
  `slug → import()` + `loadArticle`). `types.ts` dividido en `BlogArticleMeta`/`BlogArticleContent`/
  `BlogArticle`. `BlogPostPage` resuelve metadata síncrona (SEO/schema/H1) + cuerpo diferido con estado de
  carga (sin layout shift: eyebrow/intro caen a `categoryLabel`/`excerpt` mientras carga). Índice, tarjeta,
  relacionados y teaser pasan a metadata. Se eliminaron `articles.tsx` y `slugs.ts`; `vite.config.ts` toma
  `BLOG_SLUGS` de `articles-index`. **Bug de drift corregido de paso:** `slugs.ts` listaba 17 slugs pero
  había 18 artículos → `hito-para-estudio-juridico` faltaba en el sitemap; ahora se deriva y entra solo.
  - **Archivos:** `src/features/blog/types.ts`, `src/features/blog/data/articles-index.ts` (nuevo),
    `src/features/blog/data/articles/*.tsx` (18 nuevos) + `articles/index.ts` (nuevo),
    `pages/BlogPostPage.tsx`, `pages/BlogIndexPage.tsx`, `components/BlogCard.tsx`,
    `components/RelatedPosts.tsx`, `src/features/landing/components/BlogTeaser.tsx`, `vite.config.ts`,
    `src/features/docs/data/modules.tsx` (doc "cómo agregar un artículo" actualizada). Eliminados:
    `data/articles.tsx`, `data/slugs.ts`.
  - **Verificación:** `tsc --noEmit` ✅ · `eslint src` ✅ (3 errores preexistentes ajenos, 0 nuevos) ·
    `vitest run` ✅ 640/640 · `vite build` ✅.
  - **Resultado de chunks:** 18 chunks por artículo (carga diferida) + `articles-index` 12 kB (2.85 kB
    gzip) para la lista. `BlogIndexPage` 4.3 kB · `BlogPostPage` 6.1 kB, sin cuerpos embebidos. La landing
    ya no empaqueta el contenido de ningún artículo.
  - **Pendiente:** Fase C opcional (test anti-drift slug↔loader + plantilla de nuevo artículo).

## Context

### Estado actual (auditado)

- **`src/features/blog/data/articles.tsx`** — 5.232 líneas, 18 artículos. Cada `BlogArticle` incluye
  `content: { eyebrow, intro: ReactNode, sections: {heading, body: ReactNode}[] }` con todo el cuerpo en
  JSX inline. Helpers al final: `getArticleBySlug`, `getFeaturedArticles`, `getRecentArticles`.
- **`src/features/blog/data/slugs.ts`** — `BLOG_SLUGS` (18 slugs) mantenido a mano; duplica la fuente de
  verdad de `articles.tsx` y puede desincronizarse.
- **`src/features/blog/types.ts`** — `BlogArticle` acopla metadata + `content`.
- **Consumidores:**
  - `pages/BlogIndexPage.tsx` — usa `BLOG_ARTICLES` para listar/filtrar. **Solo lee metadata.**
  - `components/BlogCard.tsx` — usa `slug, title, excerpt, category, categoryLabel, readingTime`. **Solo metadata.**
  - `components/RelatedPosts.tsx` — importa `BLOG_ARTICLES`, filtra por categoría. **Solo metadata.**
  - `pages/BlogPostPage.tsx` — `getArticleBySlug(slug)` → **único consumidor de `content`.**
- **Routing:** `BlogIndexPage` y `BlogPostPage` ya son `lazy()` en `App.tsx`. Pero como todo vive en un
  módulo, cualquier ruta del blog empaqueta el `content` de los 18 artículos en su chunk.

### Problema

1. **Velocidad.** No hay code-splitting por artículo. `content` (la parte pesada) se envía siempre en
   bloque. El índice descarga 18 cuerpos JSX para renderizar solo tarjetas de metadata.
2. **Organización.** Un archivo de 5.232 líneas es hostil para navegar, revisar y mergear. Agregar un
   artículo implica editar el monolito. `slugs.ts` duplica la lista y puede divergir.

## Objetivo

- Cada página del blog descarga **solo lo que necesita**: el índice, únicamente metadata; un post,
  únicamente su propio contenido.
- Agregar/editar un artículo es tocar **un archivo pequeño y aislado**.
- **Cero cambios de comportamiento visible**: mismas URLs, mismo texto, mismo SEO, mismo render.

## Decisiones (confirmadas con el usuario)

- **Autoría:** se mantiene **JSX por archivo** (no MDX). Riesgo mínimo, sin toolchain nueva.
- **Alcance:** solución completa — **split por artículo + metadata separada**.

## Diseño destino

### Estructura de archivos

```
src/features/blog/data/
  articles/
    <slug>.tsx            # 18 archivos, uno por artículo → export const article = { content, ... }
    index.ts             # registro: map slug -> () => import('./<slug>')  (carga diferida)
  articles-index.ts       # BLOG_ARTICLES_META: metadata de los 18 (SIN content), estático y ligero
  categories.ts           # (sin cambios)
```

### Tipos (`types.ts`)

- Separar `BlogArticle` en:
  - `BlogArticleMeta` = todo menos `content` (`slug, title, excerpt, category, categoryLabel,
    publishedAt, readingTime, featured, seo`).
  - `BlogArticleContent` = `{ eyebrow, intro, sections }`.
  - `BlogArticle = BlogArticleMeta & { content: BlogArticleContent }` (para el archivo por-slug).

### Metadata estática (`articles-index.ts`)

- `export const BLOG_ARTICLES_META: BlogArticleMeta[]` — array plano, sin JSX. Fuente de verdad de la
  lista. Los helpers de listado se reescriben sobre metadata:
  - `getFeaturedArticles(): BlogArticleMeta[]`
  - `getRecentArticles(limit?): BlogArticleMeta[]`
  - `getRelatedMeta(currentSlug, category): BlogArticleMeta[]`
- `BLOG_SLUGS` se **deriva** de aquí (`BLOG_ARTICLES_META.map(a => a.slug)`) → se elimina la duplicación
  de `slugs.ts` (o el archivo pasa a re-exportar el derivado para no romper imports).

### Contenido diferido (`articles/index.ts`)

- Registro de imports dinámicos por slug:
  ```ts
  const loaders: Record<string, () => Promise<{ article: BlogArticle }>> = {
    "gestion-proyectos-sin-nube": () => import("./gestion-proyectos-sin-nube"),
    // …18
  };
  export async function loadArticle(slug: string): Promise<BlogArticle | undefined> { … }
  ```
- Vite genera **un chunk por artículo**; abrir un post baja solo su chunk.

### Consumidores

- `BlogIndexPage`, `BlogCard`, `RelatedPosts` → pasan a `BLOG_ARTICLES_META` (tipos a `BlogArticleMeta`).
  No cambian de comportamiento; solo dejan de arrastrar `content`.
- `BlogPostPage` → resuelve metadata desde el índice (síncrono, para el `<SeoPage>`/schema) y **carga el
  `content` de forma diferida** por slug con `Suspense`/estado de carga. Slug inválido → `Navigate` como
  hoy.

## Fases

- **Fase A — Separación metadata/content + split por slug (núcleo de performance).**
  - Nuevos tipos en `types.ts`.
  - Crear `articles-index.ts` con la metadata de los 18.
  - Crear `articles/index.ts` con el registro de loaders.
  - Adaptar `BlogPostPage` a carga diferida del content; adaptar índice/tarjetas/relacionados a metadata.
  - `articles.tsx` se conserva temporalmente como fuente de los `content` importados por los archivos
    por-slug, o se va vaciando en Fase B.
- **Fase B — Extracción a un archivo por artículo + derivar slugs.**
  - Mover cada `content` a `articles/<slug>.tsx`. Eliminar el monolito `articles.tsx`.
  - Derivar `BLOG_SLUGS` desde la metadata; limpiar `slugs.ts`.
- **Fase C (opcional) — Ergonomía de autoría.** Snippet/plantilla para “nuevo artículo” y un test que
  verifique que cada slug de la metadata tiene un loader y viceversa (evita drift).

## Criterios de aceptación

- El índice `/blogs` renderiza idéntico y su chunk **ya no incluye** el cuerpo JSX de ningún artículo.
- `/blogs/<slug>` renderiza idéntico; el network muestra **un chunk de contenido por artículo** cargado
  bajo demanda (no los 18).
- Slug inexistente → redirige a `/blogs` (comportamiento actual).
- No queda una lista de slugs duplicada mantenible a mano.
- No hay regresión de SEO (title, description, schema `BlogPosting`, canonical).

## Verificación (gates, estilo spec 034)

- `tsc --noEmit` ✅
- `eslint .` ✅ (sin errores nuevos)
- `vitest run` ✅ (incluye, si se hace Fase C, el test de paridad slug↔loader)
- `vite build` ✅ + inspección del manifiesto/salida: existe un chunk por artículo y el chunk del índice
  encoge respecto al baseline.

## Fuera de alcance

- Reescribir el texto o el diseño de los artículos.
- Migrar a MDX u otro formato de autoría.
- Cambios de routing, URLs o estructura de categorías.
- Paginación/buscador del índice (posible spec futuro).
