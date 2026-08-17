# Spec 059 — Blog: experiencia de lectura y textura visual del artículo

> Estado: **IMPLEMENTADO** (2026-08-17).
> Baseline al empezar: **118 archivos / 1169 tests**. Al cerrar: **121 / 1194**.
> Gates: `typecheck` ✅ · `lint` ✅ (el único error de `eslint src` vive en
> `src/hooks/useBreakpoint.ts` y es previo a esta spec) · `test` ✅ · `build` ✅
> (75 rutas prerenderizadas) · verificación visual con Playwright en light/dark
> × 1440/1024/768/390 ✅.
>
> **Desvíos respecto de lo planeado** (ver `design.md` §8): `SeoArticle` recibió
> un flag `hasOwnHeader` en vez de un `headerSlot`; la TOC viaja en un único
> nodo responsivo en lugar de dos slots; y apareció un bug de fechas que no
> estaba en la auditoría (ver §1.1, hallazgo #17).
> Feature dir: `specs/059-blog-lectura-visual/` · Fecha: 2026-08-17
> Antecede: 009 (blog + SEO), 028 (refresh LATAM), 035 (performance/organización),
> 040 (clusters + prerender de `/blogs/:slug`), 058 (mejora SEO guiada por GSC).
> Alcance de esta spec: **la vista de artículo** (`/blogs/:slug`). El índice
> (`/blogs`) y las páginas de categoría quedan para la Fase 2 (§8).
> Principios: **II** (el formato es la prueba — nada de imágenes raster),
> **V** (incremental: se reusa `SeoArticle`, no se reescribe el blog).

---

## 1. Contexto

El blog ya tiene lo difícil resuelto: 40+ artículos, clusters con pilares y satélites,
schema `BlogPosting`/`FAQPage`/`HowTo`, prerender estático por slug, y un roadmap SEO vivo
alimentado por Search Console (058). Lo que falta es **lo que ve el lector cuando llega**.

Hoy, abrir un artículo da esto: breadcrumb → una línea de metadata en gris chico → ~200px
de vacío → un H1 negro sobre blanco → párrafos. No hay un solo elemento visual que diga
"esto es Hito", ni nada que ayude a orientarse dentro de un texto de 8–14 minutos.

Los datos de GSC del spec 058 lo respaldan desde el otro lado: **1.886 impresiones, 6 clics,
CTR 0.32%**, posición media ~29. El 058 ataca la mitad de *llegar* (posición y snippet).
Esta spec ataca la mitad de *quedarse*: cuando el lector por fin entra, la página tiene que
verse como algo hecho con cuidado y tiene que dejarse leer. Eso además retroalimenta el
ranking — dwell time, scroll depth y anclas por sección son señales reales.

### 1.1 Auditoría del estado actual

Todo lo de abajo está verificado en el código, no es opinión sobre el diseño.

| # | Hallazgo | Dónde | Severidad |
|---|---|---|---|
| 1 | **Doble padding vertical.** El bloque de metadata trae `pt-24 sm:pt-32` y `SeoArticle` abre con `py-24 sm:py-32`. Entre el breadcrumb y el H1 hay ~200px de nada. | `BlogPostPage.tsx:82` + `SeoArticle.tsx:20` | Alta |
| 2 | **`<article>` anidado y borde duplicado.** `BlogPostView` envuelve todo en `<article className="border-b border-border/60">` y `SeoArticle` renderiza **otro** `<article>` con la misma clase. Dos líneas divisorias pegadas y semántica HTML confusa para el parser de Google. | `BlogPostPage.tsx:81` + `SeoArticle.tsx:19` | Alta |
| 3 | **Categoría escrita dos veces.** Aparece en la fila de metadata (`meta.categoryLabel`) y otra vez como `eyebrow` de `SeoArticle`, casi siempre con el mismo texto. | `BlogPostPage.tsx:88` y `:105` | Media |
| 4 | **`prose` es CSS muerto.** `SeoArticle` aplica `prose prose-neutral dark:prose-invert`, pero **`@tailwindcss/typography` no está instalado** (`package.json` solo trae `tailwindcss-animate`). Esas clases no generan una sola regla. | `SeoArticle.tsx:27` | Alta |
| 5 | **Consecuencia del #4: estilos a mano, artículo por artículo.** Cada `<ul>` repite `list-disc space-y-2 pl-6 text-muted-foreground` a mano en 40+ archivos. Lo que se olvida, sale sin estilo (viñetas pegadas al margen, `<a>` del color del texto). | p. ej. `data/articles/kanban-limites-wip.tsx:66` | Alta |
| 6 | **Sin tabla de contenidos.** Artículos de 6–10 `<h2>` y ninguna forma de ver la estructura ni saltar. También se pierden los *sitelinks* de sección en Google. | `SeoArticle.tsx:28-35` | Alta |
| 7 | **Los `<h2>` no tienen `id`.** `index.css` ya define `section[id] { scroll-margin-top: 5rem }` pensando en anclas, pero `SeoArticle` nunca emite un `id` → no existe deep-link a una sección. | `SeoArticle.tsx:29`, `index.css` | Media |
| 8 | **Línea de lectura demasiado larga.** `max-w-3xl` (768px) con `text-base` (16px) da ~95–105 caracteres por línea. El rango cómodo es 60–75. Es la causa silenciosa de que un texto correcto "canse". | `SeoArticle.tsx:20` | Alta |
| 9 | **FAQ como `<dl>` plano.** Sin affordance de apertura, sin separadores. En artículos con 3+ preguntas es un muro. | `SeoArticle.tsx:41-50` | Media |
| 10 | **El autor nunca se muestra.** `meta.author` existe, alimenta el schema `BlogPosting`… y no se renderiza en ningún lado. Señal E-E-A-T desperdiciada: para Google hay autor, para el lector no. | `types.ts:38`, `BlogPostPage.tsx:36` | Media |
| 11 | **`updatedAt` compite con `publishedAt`.** "Actualizado el X" va en el mismo gris del mismo tamaño que la fecha de publicación, cuando es la señal de frescura que más importa (y la que Google lee). | `BlogPostPage.tsx:96` | Baja |
| 12 | **Sin progreso de lectura ni forma de compartir.** Nada indica cuánto falta; no hay copiar-enlace. | — | Media |
| 13 | **`StickyCta` calcula mal su umbral en el blog.** Busca `document.querySelector("section")` asumiendo el Hero de la landing; en un post el primer `<section>` es la primera sección del artículo, así que el CTA flotante aparece tarde y en un punto arbitrario. | `StickyCta.tsx:19-21` | Media |
| 14 | **`CategoryBadge asLink` apunta a una URL legacy.** Va a `/blogs?categoria=X`, que `BlogIndexPage` redirige a `/blogs/categoria/X`. Un redirect evitable en cada click. | `CategoryBadge.tsx:16` vs `BlogIndexPage.tsx:24` | Baja |
| 15 | **Dark mode sin tratamiento propio.** Sobre `--background: 222 47% 7%` el header es texto claro sobre negro plano; no hay ni una capa que dé profundidad. | — | Media |
| 16 | **`RelatedPosts` no muestra tiempo de lectura** y usa `max-w-3xl` mientras el índice usa `max-w-6xl` — el cierre de página se siente más angosto que el resto del sitio. | `RelatedPosts.tsx:17` | Baja |
| 17 | **Las fechas salían corridas un día.** Encontrado *durante* la implementación, no en la auditoría: `new Date("2026-12-28")` es medianoche UTC, y sin fijar `timeZone` el `toLocaleDateString("es-CO")` la corría al día anterior en toda América — justo la audiencia del blog. Un artículo publicado el 28 se mostraba como 27. | `BlogPostPage.tsx:25` (previo) | Alta |

### 1.2 Lo que ya sirve y no se toca

- El contrato `BlogArticleMeta` / `BlogArticleContent` (`sections[]` como datos, no como HTML
  suelto) — es exactamente lo que hace posible una tabla de contenidos sin parsear el DOM.
- El prerender por slug vía `BlogPostView` (`prerender/entry.tsx:82`) y la separación
  presentacional / carga de `BlogPostPage`.
- Todo el schema JSON-LD y los metadatos de `SeoPage`.
- `Breadcrumb`, `CategoryBadge`, `RelatedPosts` como piezas — se ajustan, no se reemplazan.
- La cadencia de contenido y el roadmap SEO del 058. **Esta spec no toca ni un texto de artículo.**

---

## 2. Objetivo

Que abrir un artículo de Hito se sienta como abrir una publicación cuidada, y que un texto
de 12 minutos se pueda **escanear** antes de leerse.

En concreto, un lector que entra desde Google a `/blogs/kanban-limites-wip` debe:

1. Ver de inmediato **de qué trata y a qué categoría pertenece**, con una firma visual propia
   de esa categoría (no un H1 flotando en blanco).
2. Entender **cuánto le va a costar** (tiempo de lectura, estructura del artículo) sin scrollear.
3. Poder **saltar a la sección que le interesa** y compartir el enlace de esa sección.
4. Leer un cuerpo con **medida, ritmo y jerarquía** consistentes en los 40+ artículos, sin que
   dependa de si el autor se acordó de poner las clases a mano.
5. Terminar con una **salida clara**: quién escribió esto, qué leer después, y el CTA de Hito.

Sin romper: prerender estático, JSON-LD, peso de bundle, ni la promesa de marca (cero
scripts de terceros, cero tracking, cero imágenes raster).

---

## 3. Decisiones de diseño (resueltas)

| Decisión | Elegido | Por qué |
|---|---|---|
| Identidad del header | **Color por categoría** (10 hues) | Con 40+ artículos y 10 categorías, un solo degradado hace que todo se vea igual. El hue por categoría da variedad y orienta: el lector reconoce "esto es de privacidad" antes de leer el badge. |
| Cómo se aplica el color | Un **hue HSL por categoría** inyectado como custom property `--cat-h`, consumido por capas a ≤12% de alfa | Tailwind es estático: nombres de clase dinámicos (`bg-${cat}-500`) los purga el build. Con una CSS var el degradado varía sin generar 10 variantes de clase. |
| Contraste | El hue **nunca** toca el texto: solo fondos ≤12% y el punto del badge. Todo el texto sigue en `foreground`/`muted-foreground` | Hace imposible romper AA por elegir mal un hue, en light y en dark. Cumple además la regla de oro de la guía de marca (el color dominante es el fondo). |
| Tipografía del cuerpo | **Capa `.article-prose` propia en `index.css` con `:where()`**, no instalar `@tailwindcss/typography` | `:where()` tiene especificidad 0, así que las clases inline que ya traen los 40+ artículos siguen ganando y **nada se rompe hacia atrás**. El plugin, en cambio, pelearía con ellas (`--tw-prose-body` vs `text-muted-foreground`) y sumaría dependencia + CSS para elementos que el blog no usa. |
| FAQ desplegable | **`<details>/<summary>` nativo**, no Radix Accordion | Radix desmonta el contenido cerrado: el texto de las FAQ **desaparecería del HTML prerenderizado** y el schema `FAQPage` quedaría sin respaldo visible. `<details>` siempre está en el DOM, funciona sin JS, y trae accesibilidad de fábrica. Además no existe `ui/accordion` en el repo. |
| Compartir | `navigator.share` cuando existe + **copiar enlace** como fallback | Cero SDK de terceros. Coherente con "sin GA, sin Meta Pixel, sin Hotjar" de la guía de marca. |
| Barra de progreso | Elemento propio bajo el nav, alimentado por scroll con rAF | Barato, sin dependencias, y se apaga con `prefers-reduced-motion`. |

---

## 4. Historias de usuario (con criterios de aceptación)

### H1 — Header con textura e identidad de categoría

> Como lector que llega de Google, quiero que la cabecera del artículo se vea como algo
> diseñado, para confiar en lo que voy a leer.

**Criterios**

- [ ] El header ocupa el ancho completo y trae **tres capas** superpuestas, todas CSS:
  (a) un radial suave con el hue de la categoría, (b) el patrón de grid/puntos ya usado en el
  Hero de la landing con `maskImage` para que se desvanezca, (c) un `border-b` que cierra el bloque.
- [ ] El hue viene de `BLOG_CATEGORIES[category].hue`. Ninguna clase de Tailwind se construye
  por interpolación de string.
- [ ] En dark mode las mismas capas usan alfas reducidas (definidas una sola vez, no duplicadas
  por categoría) y el bloque sigue teniendo profundidad — no es negro plano.
- [ ] La jerarquía es: **eyebrow de categoría (link) → H1 → intro/lead → fila de metadata**.
  El eyebrow aparece **una sola vez** (se elimina la duplicación del hallazgo #3).
- [ ] El H1 usa `text-balance` y escala `4xl → 5xl → 6xl` (mobile → sm → lg).
- [ ] El lead (la intro del artículo) se distingue del cuerpo: mayor tamaño, `text-pretty`,
  color `foreground/80`.
- [ ] La metadata muestra: fecha de publicación, tiempo de lectura y, si existe, `updatedAt`
  destacado con un ícono y no como texto gris más.
- [ ] El espacio muerto del hallazgo #1 desaparece: entre breadcrumb y H1 hay ritmo, no un hueco.
- [ ] Un solo `<article>` en el árbol y un solo `border-b` (hallazgo #2).
- [ ] Cero imágenes: el header no descarga ni un byte extra.

### H2 — El cuerpo se lee cómodo y consistente

> Como lector, quiero que el texto tenga una medida y un ritmo que no me cansen.

**Criterios**

- [ ] La columna de lectura queda en **60–75 caracteres por línea** (~`max-w-[40rem]` con
  cuerpo de 18px), mientras el header y el pie pueden seguir siendo más anchos.
- [ ] Existe `.article-prose` en `index.css` (`@layer components`, selectores con `:where()`)
  cubriendo: `p`, `ul`/`ol`/`li`, `a`, `strong`, `blockquote`, `code`, `pre`, `table`, `hr`, `h3`, `h4`.
- [ ] **Regresión cero**: como `:where()` tiene especificidad 0, cualquier `<ul className="...">`
  que ya exista en los artículos sigue mandando. Se verifica sobre al menos 5 artículos con
  marcados distintos.
- [ ] Los `<a>` dentro del cuerpo se distinguen del texto (color + subrayado sutil) — hoy son
  indistinguibles salvo que el autor los haya estilado a mano.
- [ ] Los `<h2>` de sección ganan peso y aire: separación superior mayor que la inferior
  (ritmo vertical), y una marca sutil que los ancla (regla fina o punto con el hue de categoría).
- [ ] `code` inline y `pre` usan `font-mono` — coherente con "JetBrains Mono muestra la evidencia".

### H3 — Índice y navegación dentro del artículo

> Como lector con prisa, quiero ver la estructura y saltar a lo que me interesa.

**Criterios**

- [ ] Cada `<h2>` de sección recibe `id={slugify(heading)}` — reusa `blog/utils/slugify.ts`.
- [ ] Cada `<h2>` expone un ancla de enlace permanente (`#`), visible en hover/focus, que copia
  la URL de esa sección.
- [ ] En `≥1280px` aparece una **tabla de contenidos sticky** en la columna lateral, construida
  desde `content.sections` (no parseando el DOM → funciona en prerender).
- [ ] La TOC marca la sección activa mientras se scrollea (`IntersectionObserver`, solo cliente).
- [ ] En `<1280px` la TOC se muestra como un `<details>` colapsable arriba del cuerpo
  ("En este artículo"), cerrado por defecto.
- [ ] Existe una **barra de progreso de lectura** fija bajo el nav, que refleja el avance sobre
  el `<article>` (no sobre la página entera, que incluye footer y relacionados).
- [ ] Con `prefers-reduced-motion: reduce`, la barra no anima transiciones y el scroll a ancla
  es instantáneo.
- [ ] Todo esto es *progressive enhancement*: sin JS, el artículo se lee completo y la TOC
  sigue funcionando como lista de enlaces.

### H4 — FAQ y cierre del artículo

> Como lector que llegó al final, quiero resolver dudas puntuales y saber qué hacer después.

**Criterios**

- [ ] Las FAQ se renderizan como `<details>` con `<summary>` (pregunta) y respuesta dentro.
- [ ] **El texto de las respuestas está en el HTML prerenderizado**, abierto o cerrado — se
  verifica sobre el output de `npm run prerender`.
- [ ] La primera FAQ viene abierta por defecto (`open`), como pista de la interacción.
- [ ] `<summary>` tiene target táctil ≥44px, indicador de estado (chevron que rota) y
  `focus-visible` propio.
- [ ] Aparece una **card de autor** al final: `meta.author.name` + `role` si existe, con una
  línea de contexto. Si `meta.author` falta, cae a `DEFAULT_AUTHOR` sin romper el layout.
- [ ] La card de autor y el CTA final no compiten: el CTA queda al final, la autoría antes.
- [ ] `RelatedPosts` alinea su ancho con el resto del pie de página y muestra el tiempo de lectura.

### H5 — Compartir y micro-detalles

> Como lector que quiere guardarse o pasar el artículo, quiero hacerlo en un click.

**Criterios**

- [ ] Botón **Compartir** en el header (o sticky junto a la TOC en desktop): usa
  `navigator.share` si está disponible; si no, copia la URL y muestra confirmación.
- [ ] Cero scripts, iframes o pixeles de terceros. Sin botones de redes sociales embebidos.
- [ ] `CategoryBadge asLink` apunta directo a `/blogs/categoria/:category` (fin del redirect).
- [ ] `StickyCta` deja de depender de `querySelector("section")`: usa un sentinel explícito, de
  modo que en el blog aparece cuando el lector pasó el header, no en un punto arbitrario.

### H6 — No romper nada de lo que ya funciona

**Criterios**

- [ ] `npm run prerender` genera para cada slug un HTML con: H1, intro, **todas** las secciones,
  **todas** las FAQ y los tres bloques JSON-LD intactos.
- [ ] `BlogPostView` sigue siendo **presentacional puro** (sin hooks de carga), como exige
  `prerender/entry.tsx:82`. Toda la lógica de scroll/observer vive en componentes hijos, detrás
  de `useEffect`, y no altera el HTML del primer render.
- [ ] Los tres schemas (`BlogPosting`, `FAQPage`, `HowTo`) salen idénticos a los actuales.
- [ ] Ningún archivo de `data/articles/*.tsx` cambia. Ningún slug, `publishedAt` ni texto cambia.
- [ ] Contraste AA verificado en light y dark para los 10 hues, en header, badge y TOC activa.
- [ ] Navegación completa por teclado: breadcrumb → eyebrow → TOC → anclas → `<summary>` → CTA,
  todos con `focus-visible` visible sobre el fondo con degradado.

---

## 5. Alcance

**Entra**

- `src/features/blog/pages/BlogPostPage.tsx` (`BlogPostView`) — recomposición del header.
- Componentes nuevos en `src/features/blog/components/`: `ArticleHeader`, `ArticleToc`,
  `ReadingProgress`, `ArticleFaq`, `AuthorCard`, `ShareButton`, `SectionAnchor`.
- `src/features/blog/data/categories.ts` — un `hue` (y opcionalmente `icon`) por categoría.
- `src/features/seo/SeoArticle.tsx` — se refactoriza para componer los nuevos bloques; sigue
  sirviendo a las páginas satélite SEO que hoy lo usan.
- `src/index.css` — capa `.article-prose` + variables de acento de categoría.
- `src/features/blog/components/CategoryBadge.tsx`, `RelatedPosts.tsx` — ajustes puntuales.
- `src/features/landing/components/StickyCta.tsx` — sentinel en lugar de `querySelector`.
- Tests nuevos junto a los componentes + verificación del output de prerender.

**No entra (por ahora)**

- `/blogs` y `/blogs/categoria/:category` → **Fase 2**, ver §8.
- Imágenes de portada / OG dinámicas por artículo.
- Reescritura de contenido, cambios de SEO on-page, o cualquier cosa del roadmap del 058.
- Comentarios, newsletter, reacciones, "me gustó esto".
- Modo lectura / tipografía configurable por el usuario.
- Instalar `@tailwindcss/typography` (ver §3 — decisión explícita en contra).

---

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| La capa `.article-prose` pisa estilos inline de artículos viejos | Todos los selectores con `:where()` → especificidad 0. Revisión visual sobre 5 artículos de marcado heterogéneo antes de cerrar. |
| El FAQ colapsable esconde texto del HTML y daña el SEO | `<details>` nativo (el contenido siempre está en el DOM) + gate de verificación sobre el HTML prerenderizado. |
| Hues por categoría que rompen contraste | El hue solo vive en fondos ≤12% de alfa; el texto nunca lo usa. Checklist AA de 10 hues × 2 temas. |
| `IntersectionObserver` / scroll rompen el prerender | Todo dentro de `useEffect`; el primer render (SSR y cliente) es idéntico. `BlogPostView` se mantiene sin hooks de carga. |
| El header queda demasiado alto y empuja el contenido | Se fija un techo de altura y se valida en 360px, 768px y 1440px que el H1 y el inicio del lead entren sobre el pliegue. |
| Crecimiento del bundle del chunk de blog | Sin dependencias nuevas. Los componentes nuevos son pequeños y viven en el chunk que ya se carga para `/blogs/:slug`. |

---

## 7. Gates de aceptación

```
npm run typecheck     # tsc --noEmit
npm run lint          # eslint src
npm run test          # vitest run — sin regresiones sobre la baseline
npm run build         # incluye prerender
```

Más, manual:

- HTML prerenderizado de 3 slugs (uno con `faq`, uno con `howTo`, uno sin ninguno de los dos):
  secciones y FAQ presentes, 3 schemas intactos.
- Recorrido con teclado completo en `/blogs/kanban-limites-wip`.
- Light y dark en 360 / 768 / 1440px.
- `prefers-reduced-motion: reduce` activo: sin animaciones de progreso ni scroll animado.

---

## 8. Fase 2 (spec aparte, no en este commit)

Coherencia del listado con la nueva vista de artículo:

- `/blogs`: hero con el mismo tratamiento de capas; `BlogCard` con el acento de su categoría;
  destacado que use la firma visual del post en vez de una cita fija hardcodeada
  (`BlogIndexPage.tsx:92`).
- `/blogs/categoria/:category`: header teñido con el hue de esa categoría y su `description`
  como lead — la metadata ya existe en `categories.ts` y hoy se desaprovecha.
- Filtros de categoría como chips con el acento correspondiente.
- OG images por categoría (una plantilla, 10 variantes) — hoy los 40+ artículos comparten
  `og-image.png`.
