# Diseño técnico — Spec 059 (Blog: experiencia de lectura)

Complemento de `spec.md`. Acá van las decisiones concretas: tokens, contratos de componente,
CSS y las trampas de SSR/prerender.

---

## 1. Acento por categoría

### 1.1 El dato

`BLOG_CATEGORIES` (`src/features/blog/data/categories.ts`) crece con un `hue` (número HSL,
0–360) por categoría. La `description` que ya existe se aprovecha en la Fase 2.

| Categoría | `hue` | Lectura del color |
|---|---|---|
| `privacidad` | `220` | Azul del `--primary` — la categoría fundacional de la marca |
| `gestion-proyectos` | `245` | Índigo, vecino del primary sin confundirse |
| `procesos` | `38` | Ámbar — documentación, SOPs |
| `automatizacion` | `265` | Violeta — flujos, reglas |
| `inteligencia-artificial` | `291` | Magenta/púrpura — se separa claro del violeta de automatización |
| `productividad` | `158` | Verde `--brand-accent` |
| `pensamiento` | `12` | Terracota — la única categoría "editorial" |
| `comparativas` | `190` | Teal |
| `implementacion` | `200` | Celeste |
| `plantillas` | `80` | Lima/oliva |

Separación mínima entre hues vecinos: ~20°, suficiente para distinguirlos en fondos de baja
saturación. Ajustable tras la revisión visual — es un solo número por fila.

### 1.2 Cómo llega al CSS

Tailwind purga clases construidas por interpolación (`bg-${x}-500` nunca existe en el build).
La forma correcta es **una custom property por instancia**:

```tsx
// ArticleHeader.tsx
const hue = BLOG_CATEGORIES[category].hue;

<header
  className="relative isolate overflow-hidden border-b border-border/60"
  style={{ "--cat-h": hue } as React.CSSProperties}
>
  {/* capa 1 — radial teñido */}
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 -z-10
               bg-[radial-gradient(ellipse_at_top,hsl(var(--cat-h)_70%_50%/0.12),transparent_62%)]
               dark:bg-[radial-gradient(ellipse_at_top,hsl(var(--cat-h)_70%_60%/0.16),transparent_62%)]"
  />
  {/* capa 2 — grid con mask, mismo patrón que el Hero de la landing */}
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-20"
    style={{
      backgroundImage:
        "linear-gradient(hsl(var(--border)/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)/0.5) 1px, transparent 1px)",
      backgroundSize: "56px 56px",
      maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000, transparent)",
      WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, #000, transparent)",
    }}
  />
  {/* contenido */}
</header>
```

Las clases arbitrarias (`bg-[radial-gradient(...)]`) son literales estáticos en el archivo →
Tailwind las ve. Lo único variable es `--cat-h`, un número inline. **Un solo par de reglas
light/dark sirve para las 10 categorías.**

`isolate` + `-z-10` mantienen las capas detrás del contenido sin escapar del stacking context
del `<header>` (el Hero de la landing usa `-z-10` sin `isolate` porque no tiene hermanos
compitiendo; acá sí).

### 1.3 Regla de contraste

El hue aparece **solo** en:
- fondos con alfa ≤ 0.16,
- el punto (`size-1.5`) junto al eyebrow de categoría,
- el borde izquierdo (2px) de la sección activa en la TOC.

Nunca en texto de párrafo, título ni label. Así el checklist AA se reduce a verificar
que el texto `foreground` / `muted-foreground` mantenga ratio sobre el fondo teñido —
que a 12–16% de alfa es prácticamente el fondo base.

---

## 2. Tipografía del cuerpo: `.article-prose`

### 2.1 Por qué no `@tailwindcss/typography`

Los 40+ artículos ya traen clases inline en su marcado (`data/articles/*.tsx`), p. ej.
`<ul className="list-disc space-y-2 pl-6 text-muted-foreground">`. El plugin define sus reglas
con especificidad de clase y variables propias (`--tw-prose-body`, `--tw-prose-bullets`), lo
que produce peleas impredecibles archivo por archivo: en algunos ganaría el plugin, en otros
la utility, y habría que auditar 40 archivos. Además suma dependencia y CSS para elementos
que el blog no usa.

### 2.2 La capa

En `src/index.css`, dentro de `@layer components`, con **todos** los selectores envueltos en
`:where()` → especificidad 0 → cualquier utility inline existente gana automáticamente:

```css
@layer components {
  .article-prose {
    font-size: 1.125rem;      /* 18px */
    line-height: 1.75;
    color: hsl(var(--muted-foreground));
  }

  .article-prose :where(p) { margin-block: 1.25em; text-wrap: pretty; }
  .article-prose :where(strong) { color: hsl(var(--foreground)); font-weight: 600; }

  .article-prose :where(ul) { list-style: disc; padding-left: 1.5rem; margin-block: 1.25em; }
  .article-prose :where(ol) { list-style: decimal; padding-left: 1.5rem; margin-block: 1.25em; }
  .article-prose :where(li) { margin-block: 0.5em; }
  .article-prose :where(li)::marker { color: hsl(var(--cat-h, var(--primary-h)) 60% 50% / 0.7); }

  .article-prose :where(a) {
    color: hsl(var(--primary));
    text-decoration: underline;
    text-decoration-color: hsl(var(--primary) / 0.35);
    text-underline-offset: 3px;
  }
  .article-prose :where(a:hover) { text-decoration-color: hsl(var(--primary) / 0.8); }

  .article-prose :where(h3) {
    color: hsl(var(--foreground));
    font-size: 1.25rem; font-weight: 600; letter-spacing: -0.01em;
    margin-block: 2em 0.75em;
  }

  .article-prose :where(blockquote) {
    border-left: 2px solid hsl(var(--cat-h, 220) 60% 50% / 0.4);
    padding-left: 1.25rem;
    font-style: normal;
    color: hsl(var(--foreground) / 0.85);
  }

  .article-prose :where(code) {
    font-family: theme(fontFamily.mono);
    font-size: 0.875em;
    background: hsl(var(--muted));
    padding: 0.15em 0.4em;
    border-radius: calc(var(--radius) - 4px);
    color: hsl(var(--foreground));
  }

  .article-prose :where(table) { width: 100%; font-size: 0.9375rem; border-collapse: collapse; }
  .article-prose :where(th, td) {
    border-bottom: 1px solid hsl(var(--border));
    padding: 0.625rem 0.75rem; text-align: left;
  }
  .article-prose :where(th) { color: hsl(var(--foreground)); font-weight: 600; }
}
```

> Nota: `--cat-h` se hereda del `<article>`, así que viñetas y citas se tiñen con la categoría
> sin pasar props. El fallback `220` cubre las páginas satélite SEO que usan `SeoArticle` sin
> categoría.

Las tablas necesitan además un contenedor con `overflow-x: auto` en móvil — se agrega en la
misma capa o en el wrapper de sección.

### 2.3 Medida de lectura

- Contenedor de página: `max-w-3xl` (768px) — se mantiene para header, FAQ y CTA.
- Columna de texto: `max-w-[40rem]` (640px). A 18px eso da **~68 caracteres por línea**.
- El header puede respirar más ancho que el cuerpo: es lo que produce la sensación editorial.

---

## 3. Componentes

Todos en `src/features/blog/components/`, salvo donde se indique.

### `ArticleHeader`

```ts
type ArticleHeaderProps = {
  meta: BlogArticleMeta;
  /** Lead del artículo — `content.intro ?? meta.excerpt`. */
  intro: React.ReactNode;
};
```

Renderiza: capas de fondo → `Breadcrumb` → eyebrow de categoría (link + punto teñido) →
`<h1>` → lead → fila de metadata (fecha · lectura · actualizado) + `ShareButton`.
Sin estado, sin efectos → SSR directo.

### `ReadingProgress`

```ts
type ReadingProgressProps = {
  /** Ref al <article> cuyo avance se mide. */
  targetRef: React.RefObject<HTMLElement>;
};
```

- Primer render: barra en `0%` (idéntico en SSR y cliente → sin hydration mismatch).
- `useEffect` engancha `scroll`/`resize` con `{ passive: true }` y coalescing por
  `requestAnimationFrame`.
- Progreso = avance sobre el `<article>`, no sobre `document.body` (que incluye relacionados y footer).
- `fixed top-14` (justo bajo el nav de `h-14`), `h-0.5`, `z-40` (bajo el nav `z-50`).
- Con `prefers-reduced-motion: reduce` → sin `transition` en el ancho.

### `ArticleToc`

```ts
type ArticleTocProps = {
  sections: { heading: string; body: React.ReactNode }[];
  className?: string;
};
```

- Los `id` salen de `slugify(heading)` — **la misma función** que usa `SeoArticle` para los
  `<h2>`, así no se pueden desincronizar.
- Desktop `≥1280px`: `<nav>` sticky (`sticky top-24`) en una columna lateral. La grilla del
  artículo pasa a `xl:grid xl:grid-cols-[minmax(0,1fr)_16rem] xl:gap-12`.
- `<1280px`: `<details>` "En este artículo", cerrado.
- Scroll-spy: `IntersectionObserver` sobre los `<h2>` con
  `rootMargin: "-80px 0px -70% 0px"`, dentro de `useEffect`. El estado inicial es "ninguna
  activa" → el HTML del primer render es estable.
- Sin JS sigue siendo una lista de `<a href="#...">` funcional.

**Colisión de slugs**: dos `<h2>` con el mismo texto en un artículo darían `id` duplicado.
Se resuelve deduplicando con sufijo (`-2`) en un helper compartido, y se cubre con un test.

### `SectionAnchor`

Ancla `#` junto al `<h2>`: `opacity-0 group-hover:opacity-100 focus-visible:opacity-100`.
Copia la URL absoluta con el hash. Nunca oculta al lector de pantalla el heading; el ancla
lleva `aria-label` explícito (`Enlace a la sección "…"`).

### `ArticleFaq`

```ts
type ArticleFaqProps = { faq: { question: string; answer: string }[] };
```

- `<details>` nativo, primera pregunta con `open`.
- `<summary>` con `list-style: none` + chevron propio rotado por `[&[open]>summary_svg]:rotate-180`.
- `summary` con `cursor-pointer`, padding para ≥44px de target y `focus-visible` propio.
- **No** usa Radix: el contenido cerrado debe seguir en el DOM para el prerender y para el
  respaldo visible del schema `FAQPage`.

### `AuthorCard`

```ts
type AuthorCardProps = { author?: { name: string; role?: string }; updatedAt?: string };
```

Cae a `DEFAULT_AUTHOR` (`data/articles-index.ts`) cuando falta. Iniciales en un círculo teñido
con `--cat-h` — cero imágenes, coherente con "mockup = HTML+Tailwind, no raster".

### `ShareButton`

```ts
type ShareButtonProps = { title: string; url: string };
```

1. `navigator.share` si existe (móvil).
2. Si no, `navigator.clipboard.writeText(url)` + estado "¡Copiado!" por ~2s.
3. Si tampoco, el botón no se renderiza (nada roto, nada muerto).

Detección **dentro de `useEffect`**, no en render: `typeof navigator` en SSR rompería el
prerender, y decidir en render provocaría hydration mismatch.

---

## 4. Recomposición de `SeoArticle` y `BlogPostView`

`SeoArticle` lo usan también `AlternativaTrelloPage`, `AlternativaNotionPage` y
`GestorOfflinePage`, así que **su firma no cambia**: solo se le suman props opcionales, y sin
ellas el comportamiento es el de siempre.

```ts
type SeoArticleProps = {
  eyebrow: string;
  title: React.ReactNode;
  intro: React.ReactNode;
  sections: { heading: string; body: React.ReactNode }[];
  faq?: { question: string; answer: string }[];
  cta: { label: string; href?: string };
  /** Nuevo: el caller ya renderizó su cabecera (caso blog) → no repetir eyebrow/h1/intro
      ni abrir un `<article>` propio, y el padding superior lo aporta ese header. */
  hasOwnHeader?: boolean;
  /** Nuevo: la TOC. En ≥xl sale del flujo y cuelga al costado; debajo queda en el flujo. */
  asideSlot?: React.ReactNode;
  /** Nuevo: se inserta después de las FAQ y antes del CTA final (card de autor). */
  footerSlot?: React.ReactNode;
};
```

`SectionAnchor` y `ArticleFaq` viven en `src/features/seo/` junto a `SeoArticle`, no en
`blog/components/`: los consume el layout compartido, así que las páginas satélite los heredan
igual que el blog. Solo `buildSectionIds` cruza de feature (`blog/utils/`), y es una función
pura sin dependencias.

Cambios internos de `SeoArticle`:

- Deja de emitir su propio `<article>` cuando el caller ya trae uno → se resuelve pasando
  `headerSlot`; el `<article>` queda **solo** en `BlogPostView` (hallazgo #2).
- `py-24 sm:py-32` sale del contenedor cuando hay `headerSlot` (el header ya aporta el aire) →
  hallazgo #1.
- Los `<h2>` reciben `id` y `SectionAnchor`.
- El bloque de secciones gana `.article-prose` y `max-w-[40rem]`; se quitan las clases `prose*`
  muertas.
- Las FAQ pasan a `ArticleFaq`.

`BlogPostView` queda así:

```
<article ref={articleRef} style={{ "--cat-h": hue }}>   ← único <article>
  <ReadingProgress targetRef={articleRef} />
  <ArticleHeader meta intro />
  <SeoArticle hasOwnHeader asideSlot={<ArticleToc/>} footerSlot={<AuthorCard/>} … />
</article>
<RelatedPosts … />
```

La TOC solo se pasa cuando el artículo tiene más de una sección: un índice de un ítem no
orienta a nadie.

`articleRef` es un `useRef` — permitido: **no** es un hook de carga de datos y no cambia el
HTML del primer render, así que `BlogPostView` sigue cumpliendo el contrato de
`prerender/entry.tsx:82` (nada de `useEffect` que traiga contenido).

---

## 5. Arreglos puntuales fuera del artículo

**`CategoryBadge.tsx:16`** — `/blogs?categoria=${category}` → `/blogs/categoria/${category}`.
Elimina un redirect por click. `BlogIndexPage` mantiene el manejo del parámetro legacy para
enlaces externos viejos.

**`StickyCta.tsx:19`** — hoy `document.querySelector("section")` asume el Hero de la landing.
Se reemplaza por un sentinel explícito: `SeoPage` (o cada hero) renderiza
`<div data-cta-sentinel aria-hidden />` al final de su bloque superior, y `StickyCta` observa
ese nodo con `IntersectionObserver`, con el comportamiento actual como fallback si no existe.

**`RelatedPosts.tsx:17`** — alinear ancho con el pie y sumar `readingTime` a cada card.

---

## 6. Riesgos de SSR / prerender (checklist)

| Trampa | Regla |
|---|---|
| `navigator`, `window`, `document` en render | Solo dentro de `useEffect`. |
| Hydration mismatch | El primer render del cliente debe ser byte-idéntico al del servidor: progreso en 0%, ninguna sección activa en la TOC, `ShareButton` con markup estable. |
| FAQ colapsadas fuera del DOM | `<details>`, nunca Radix. Verificado sobre el HTML generado. |
| `id` de sección desincronizados entre TOC y `<h2>` | Un único helper compartido, con test de deduplicación. |
| `BlogPostView` deja de ser presentacional | Solo `useRef`. Nada que cargue datos. |

---

## 7. Tests

No hay `jsdom` ni `@testing-library` en el proyecto (`vitest.config.ts` corre en
`environment: "node"`), y esta spec no justifica sumarlos. Los tests usan
**`renderToStaticMarkup`** de `react-dom/server` —que ya es dependencia— dentro
de un `StaticRouter`. No es un rodeo: reproduce exactamente el HTML que produce
`npm run prerender`, que es justo lo que hay que proteger acá. Los `useEffect`
no corren, igual que en el servidor, así que lo que se verifica es el primer
render, el mismo que después hidrata.

| Archivo | Qué cubre |
|---|---|
| `components/articleView.test.tsx` | Un archivo para toda la vista: header (categoría sin duplicar, URL indexable, `updatedAt` opcional, fecha sin correr, sentinel del CTA), `SeoArticle` (sin `<article>` anidado, sin `h1` repetido, `article-prose` en lugar de las clases `prose*` muertas, ids + anclas por sección, respuestas de FAQ presentes con el `<details>` cerrado y solo la primera abierta), `ArticleToc` (mismos ids que los `<h2>`, anclas y no botones, vacío sin secciones) y `AuthorCard` (fallback, rol ausente sin separador huérfano) |
| `utils/sectionId.test.ts` | slugs por heading, deduplicación, headings sin caracteres alfanuméricos, lista vacía |
| `data/categories.test.ts` | las 10 categorías tienen `hue` en 0–360 y separación ≥15° entre vecinos, incluido el salto circular 292°→12° |
| verificación de prerender | secciones + FAQ + 3 schemas en el HTML de 3 slugs (uno con `faq`, uno con `howTo`, uno sin ninguno) |
| verificación con Playwright | capturas light/dark × 1440/1024/768/390, contraste computado, scroll-spy, barra de progreso, `prefers-reduced-motion`, orden de foco, y no-regresión de las 3 páginas satélite SEO |

## 8. Desvíos respecto de lo planeado

Tres cosas cambiaron al construir, y conviene que queden escritas:

1. **`hasOwnHeader: boolean` en vez de `headerSlot: ReactNode`.** El caller del
   blog ya renderiza `ArticleHeader` como hermano, antes de `SeoArticle`; pasarlo
   por un slot solo lo habría metido dentro de un contenedor que no le
   corresponde. Un flag booleano dice lo mismo con menos indirección: «la
   cabecera ya la puso otro, no la repitas y no abras un `<article>`».
2. **La TOC viaja en un solo nodo, no en dos slots.** `ArticleToc` ya trae
   adentro sus dos formas (un `<details>` `xl:hidden` y un `<nav>` sticky
   `hidden xl:block`); `SeoArticle` lo envuelve en un contenedor que en `≥xl`
   pasa a `absolute left-full`. Renderizarlo dos veces habría duplicado el
   `IntersectionObserver`.
3. **Bug de zona horaria en las fechas** (hallazgo #17 de `spec.md`), ajeno al
   alcance original y arreglado al paso porque afectaba a todos los artículos.
