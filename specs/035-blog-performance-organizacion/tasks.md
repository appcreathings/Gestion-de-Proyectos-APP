# Tasks 035 — Blog: performance y organización

Referencia: [spec.md](./spec.md) · [plan.md](./plan.md).

## Fase A — Metadata separada + content diferido (núcleo)

- [ ] A1. `types.ts`: definir `BlogArticleMeta`, `BlogArticleContent`; `BlogArticle = Meta & { content }`.
- [ ] A2. Crear `data/articles-index.ts` con `BLOG_ARTICLES_META` (metadata de los 18, sin JSX) y helpers
  `getFeaturedArticles` / `getRecentArticles` / `getRelatedMeta` sobre metadata.
- [ ] A3. Crear `data/articles/index.ts` con el registro `slug → () => import('./<slug>')` y
  `loadArticle(slug): Promise<BlogArticle | undefined>`.
- [ ] A4. `BlogPostPage`: metadata síncrona desde el índice para `SeoPage`/schema/header; cargar `content`
  con `loadArticle` + `Suspense`/estado de carga; slug inválido → `Navigate("/blogs")`.
- [ ] A5. `BlogIndexPage`, `BlogCard`, `RelatedPosts`: consumir `BLOG_ARTICLES_META` (tipos a `Meta`).
- [ ] A6. Verificar: `tsc` · `eslint` · `vitest` · `vite build`; confirmar chunk del índice sin cuerpos.

## Fase B — Un archivo por artículo + slugs derivados

- [ ] B1. Extraer cada `content` a `data/articles/<slug>.tsx` (`export const article: BlogArticle`).
- [ ] B2. Eliminar el monolito `data/articles.tsx`; actualizar imports.
- [ ] B3. Derivar `BLOG_SLUGS` de `BLOG_ARTICLES_META`; limpiar/retirar `data/slugs.ts`.
- [ ] B4. Verificar: `tsc` · `eslint` · `vitest` · `vite build`; confirmar un chunk por artículo.

## Fase C — Ergonomía y anti-drift (opcional)

- [ ] C1. Test: cada slug de `BLOG_ARTICLES_META` tiene loader en `articles/index.ts` y viceversa.
- [ ] C2. Plantilla/snippet "nuevo artículo" (archivo por-slug + entrada de metadata + loader).

## Verificación final

- [ ] `tsc --noEmit` ✅ · `eslint .` ✅ · `vitest run` ✅ · `vite build` ✅
- [ ] `/blogs` y `/blogs/<slug>` renderizan idénticos (texto, SEO, schema); network muestra carga diferida
  por artículo.
