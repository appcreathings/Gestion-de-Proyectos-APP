# Plan 035 — Blog: performance y organización

Referencia: [spec.md](./spec.md).

## Estrategia

Mover de un monolito `articles.tsx` (metadata + content acoplados) a **metadata estática separada** +
**content diferido por slug**. Se hace en dos pasos para acotar riesgo: primero el mecanismo (Fase A,
sin mover texto), luego la extracción física (Fase B).

## Archivos afectados

| Archivo | Acción |
| --- | --- |
| `src/features/blog/types.ts` | Dividir `BlogArticle` en `BlogArticleMeta` + `BlogArticleContent`. |
| `src/features/blog/data/articles-index.ts` | **Nuevo.** `BLOG_ARTICLES_META` + helpers de listado. |
| `src/features/blog/data/articles/index.ts` | **Nuevo.** Registro `slug → () => import()`, `loadArticle()`. |
| `src/features/blog/data/articles/<slug>.tsx` | **Nuevos (18).** Un artículo por archivo (Fase B). |
| `src/features/blog/data/articles.tsx` | Reducir en Fase A; eliminar en Fase B. |
| `src/features/blog/data/slugs.ts` | Derivar `BLOG_SLUGS` de la metadata; limpiar duplicación. |
| `src/features/blog/pages/BlogPostPage.tsx` | Metadata síncrona + `content` diferido con `Suspense`/estado. |
| `src/features/blog/pages/BlogIndexPage.tsx` | Consumir `BLOG_ARTICLES_META`. |
| `src/features/blog/components/BlogCard.tsx` | Tipar a `BlogArticleMeta`. |
| `src/features/blog/components/RelatedPosts.tsx` | Consumir metadata (`getRelatedMeta`). |

## Riesgos y mitigaciones

- **Drift slug ↔ loader:** un slug en metadata sin archivo de content rompería el post. → Test de paridad
  (Fase C) y `loadArticle` devuelve `undefined` → `Navigate` a `/blogs`.
- **Regresión SEO:** `BlogPostPage` arma schema/`SeoPage` con metadata → debe estar disponible de forma
  **síncrona** desde el índice; solo el cuerpo (`content`) se difiere.
- **Flash de carga:** mostrar un estado de carga mínimo mientras resuelve el chunk del post; mantener el
  header (categoría/fecha/tiempo) desde metadata para evitar layout shift.

## Verificación

`tsc --noEmit` · `eslint .` · `vitest run` · `vite build` + inspección de chunks (un chunk por artículo,
índice más liviano que baseline).
