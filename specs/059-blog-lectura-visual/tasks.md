# Tareas — Spec 059 (Blog: experiencia de lectura y textura visual)

> Referencias: `spec.md` (qué y por qué), `design.md` (cómo).
> Convención: `[P]` = paralelizable con la tarea anterior (no comparten archivo).
> Cada fase cierra con `npm run typecheck && npm run lint && npm run test`.

---

## Fase A — Cimientos (sin cambio visible todavía)

- [x] **T001** — `data/categories.ts`: sumar `hue: number` a las 10 categorías con la tabla de
  `design.md` §1.1. Tipar el `Record` para que agregar una categoría sin `hue` no compile.
- [x] **T002** [P] — `data/categories.test.ts`: test de que las 10 categorías tienen `hue`
  en rango 0–360 y que no hay dos hues a menos de 15° de distancia.
- [x] **T003** — `blog/utils/sectionId.ts`: helper `buildSectionIds(sections)` sobre `slugify`,
  con deduplicación por sufijo (`-2`, `-3`). Es la **única** fuente de ids: la consumen tanto
  los `<h2>` como la TOC.
- [x] **T004** [P] — Test de `buildSectionIds`: headings repetidos, headings con tildes y
  signos, heading vacío.
- [x] **T005** — `index.css`: capa `.article-prose` en `@layer components`, todos los
  selectores con `:where()` (design.md §2.2). Incluir el wrapper `overflow-x:auto` de tablas.
- [x] **T006** — Verificación de regresión de T005: abrir 5 artículos de marcado heterogéneo
  (`kanban-limites-wip`, `matriz-raci`, `mcp-vs-function-calling-vs-rag`,
  `local-first-guia-definitiva-2026`, `hito-vs-trello`) y confirmar que las clases inline
  existentes siguen ganando y nada se descoloca.

**Gate A**: `typecheck` + `lint` + `test` en verde; ningún cambio visual no intencional.

---

## Fase B — Header del artículo (el pedido central)

- [x] **T010** — `components/ArticleHeader.tsx`: las tres capas de fondo (radial teñido con
  `--cat-h`, grid con `maskImage`, `border-b`), `isolate`, clases arbitrarias **estáticas**.
- [x] **T011** — Jerarquía dentro del header: `Breadcrumb` → eyebrow de categoría (link a
  `/blogs/categoria/:cat` + punto teñido) → `<h1>` (`text-balance`, `4xl/5xl/6xl`) → lead →
  fila de metadata. La categoría aparece **una sola vez** (hallazgo #3).
- [x] **T012** — Metadata: fecha de publicación, tiempo de lectura y `updatedAt` destacado con
  ícono (no como texto gris más). `updatedAt` ausente no debe dejar separadores huérfanos.
- [x] **T013** — Tratamiento dark: alfas propias para las capas, definidas una sola vez para
  las 10 categorías.
- [x] **T014** — `BlogPostView`: un único `<article>` (dueño de `--cat-h` y del `ref`), un solo
  `border-b`, y eliminar el bloque de metadata viejo (`BlogPostPage.tsx:81-102`). Cierra los
  hallazgos #1, #2 y #3.
- [x] **T015** [P] — Tests del header (en `components/articleView.test.tsx`): categoría sin duplicar,
  URL indexable, `updatedAt` opcional, sentinel del CTA, fecha sin correrse de día.
- [x] **T016** — Revisión visual del header en 360 / 768 / 1440px, light y dark, en 4 categorías
  de hues distintos. Validar el techo de altura: H1 + inicio del lead sobre el pliegue.

**Gate B**: el header se ve terminado por sí solo; `npm run build` pasa y el HTML
prerenderizado de un slug conserva H1, intro y los 3 schemas.

---

## Fase C — Cuerpo legible

- [x] **T020** — `SeoArticle`: props `hasOwnHeader` / `asideSlot` / `footerSlot` (opcionales, sin
  romper a las páginas satélite SEO que ya lo usan). Implementado como flag booleano y no
  como `headerSlot` — ver `design.md` §8.
- [x] **T021** — `SeoArticle`: quitar `prose prose-neutral dark:prose-invert` (CSS muerto,
  hallazgo #4) y aplicar `.article-prose` + `max-w-[40rem]` a la columna de texto.
- [x] **T022** — `SeoArticle`: con `hasOwnHeader`, no emitir `<article>` propio ni
  `py-24 sm:py-32` en el contenedor.
- [x] **T023** — `<h2>` de sección: `id` desde `buildSectionIds`, más peso tipográfico, ritmo
  vertical asimétrico (más aire arriba que abajo) y marca sutil con el hue.
- [x] **T024** — `SectionAnchor` (en `features/seo/`, junto a `SeoArticle`, porque lo consume el
  layout compartido): ancla `#` visible en hover/focus, `aria-label` explícito.
- [x] **T025** — Verificar que `section[id] { scroll-margin-top: 5rem }` de `index.css` aplica
  también a los `<h2>` con `id` (o extender el selector) para que el salto a ancla no quede
  bajo el nav fijo.

**Gate C**: los 40+ artículos se leen con medida y ritmo consistentes; las páginas satélite SEO
que usan `SeoArticle` no cambian de comportamiento.

---

## Fase D — Navegación dentro del artículo

- [x] **T030** — `components/ArticleToc.tsx`: construcción desde `content.sections`, variante
  sticky `≥xl` y variante `<details>` colapsada por debajo.
- [x] **T031** — Ubicación de la TOC en ≥xl: `absolute left-full` colgando del contenedor, en vez de
  una grilla — así el texto sigue alineado con el header en lugar de correrse. Ver `design.md` §8.
- [x] **T032** — Scroll-spy con `IntersectionObserver` dentro de `useEffect`; estado inicial
  "ninguna activa" para que SSR y primer render del cliente coincidan.
- [x] **T033** — `components/ReadingProgress.tsx`: barra fija bajo el nav, progreso medido sobre
  el `<article>`, rAF coalescing, listeners `passive`.
- [x] **T034** — `prefers-reduced-motion: reduce`: sin transición en la barra, sin scroll animado
  al saltar a un ancla.
- [x] **T035** [P] — Tests de la TOC (en `components/articleView.test.tsx`): ids consistentes con los
  `<h2>` que emite `SeoArticle`, anclas y no botones, vacío sin secciones.
- [x] **T036** — Verificar *progressive enhancement*: con JS deshabilitado, el artículo se lee
  entero y la TOC funciona como lista de enlaces.

**Gate D**: navegación por teclado completa (breadcrumb → eyebrow → TOC → anclas), con
`focus-visible` visible sobre el fondo teñido.

---

## Fase E — Cierre del artículo

- [x] **T040** — `components/ArticleFaq.tsx` con `<details>/<summary>` nativo, primera pregunta
  `open`, chevron rotado, target ≥44px, `focus-visible` propio.
- [x] **T041** [P] — Test de FAQ: las respuestas están en el DOM con el `<details>` cerrado y solo
  la primera abre (respaldo visible del schema `FAQPage`).
- [x] **T042** — `components/AuthorCard.tsx`: nombre + rol, iniciales en círculo teñido con
  `--cat-h`, fallback a `DEFAULT_AUTHOR`. Se inserta vía `footerSlot`, tras las FAQ y antes del CTA.
- [x] **T043** [P] — Test de `AuthorCard`: fallback a `DEFAULT_AUTHOR` y `role` ausente sin dejar un
  separador huérfano.
- [x] **T044** — `components/ShareButton.tsx`: `navigator.share` → clipboard → no renderizar.
  Detección dentro de `useEffect`. Cero scripts de terceros.
- [x] **T045** — `RelatedPosts.tsx`: alinear ancho con el pie de página y sumar `readingTime`.

---

## Fase F — Arreglos colaterales

- [x] **T050** — `CategoryBadge.tsx:16`: `/blogs?categoria=X` → `/blogs/categoria/X`
  (hallazgo #14). `BlogIndexPage` conserva el manejo del parámetro legacy.
- [x] **T051** — `StickyCta.tsx:19`: sentinel `data-cta-sentinel` + `IntersectionObserver`, con
  el comportamiento actual como fallback si el sentinel no existe (hallazgo #13). Verificar en
  landing **y** en blog.

---

## Fase G — Verificación final

- [x] **T060** — `npm run typecheck` · `npm run lint` · `npm run test` · `npm run build`.
- [x] **T061** — Prerender: inspeccionar el HTML de 3 slugs — uno con `faq`
  (`kanban-limites-wip`), uno con `howTo` (`como-funciona-mcp-paso-a-paso`), uno sin ninguno.
  Confirmar H1, intro, **todas** las secciones, **todas** las FAQ y los 3 bloques JSON-LD.
- [x] **T062** — Contraste AA: 10 hues × light/dark, sobre header, eyebrow, punto de categoría y
  TOC activa.
- [x] **T063** — Confirmar que **ningún** archivo de `data/articles/*.tsx` fue modificado
  (`git diff --stat src/features/blog/data/articles/` vacío).
- [x] **T064** — `graphify update .` para refrescar el grafo (los artefactos de `graphify-out/`
  no van en el commit del feature).
- [x] **T065** — Marcar el spec como IMPLEMENTADO con la fecha y dejar anotada la Fase 2
  (§8 de `spec.md`) como spec siguiente.
