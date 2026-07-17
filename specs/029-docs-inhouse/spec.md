# Especificación — Documentación pública in-house (`/docs`)

- **Feature ID:** 029-docs-inhouse
- **Estado:** Implementado (2026-07-17) — `tsc --noEmit`, 510/510 tests Vitest y `vite build` en
  verde; sitemap dinámico confirmado con las 13 rutas nuevas. Pendiente smoke visual manual del
  usuario en navegador (sin Playwright instalado en el proyecto).
- **Fecha:** 2026-07-17
- **Principios afectados (constitución):** IV (diseño limpio y enfocado), V (simplicidad y entrega incremental)

## Resumen

Reemplazar la página estática única de `/docs` (`src/features/seo/DocsPage.tsx`, una sola pantalla
hardcodeada con 4 secciones) por un **hub de documentación real** dentro de la misma SPA: un índice
(`/docs`) con guías agrupadas por tema y una página por guía (`/docs/:slug`). Sin CMS, sin generador
de sitio externo (Docusaurus/Starlight/VitePress/Mintlify) y sin dependencias nuevas: se replica
exactamente el patrón ya usado por el blog (spec 009) — páginas TSX estáticas con contenido tipado en
un archivo de datos, servidas por el mismo `react-router-dom` y el mismo `SeoPage`/`SeoArticle`.

Se descartó cualquier framework externo de docs (ver conversación previa) porque ninguno se puede
"insertar" dentro de una SPA Vite + React Router existente sin convertirse en un segundo
build/deploy — lo cual contradice el requisito explícito de que viva en la misma app, mismo dominio,
mismo repo.

## Problema / Necesidad

- **`/docs` ya es un link público (`hito.autos/docs`)** enlazado desde `LandingFooter.tsx`, pero solo
  responde 200 por el rewrite catch-all de SPA en `vercel.json` (`/(.*)` → `/index.html`) — el
  contenido real es una sola pantalla con 4 párrafos (`DocsPage.tsx`), sin cubrir la mayoría de
  módulos del producto.
- **El producto creció mucho desde que se escribió esa página.** Hoy existen 12+ áreas funcionales
  sin ninguna guía: Sprints/Trimestres (spec 008), Mis tareas y Daily Standup, Tipos/Plantillas de
  Biblioteca, Flujos e Integraciones (specs 018–027, el módulo más grande del roadmap), Asistente IA
  con RAG semántico y fallback de modelos (specs 006–007, 012), Dashboard de portafolio, exportar/
  importar por colección, y la capa de seguridad de conexiones (vault).
- **No hay tabla de contenidos ni navegación entre temas** — un visitante que busca "cómo conectar
  HubSpot" o "qué es RACI en Hito" no tiene dónde buscarlo salvo leyendo el README del repo (que no es
  público en el sentido de estar pensado para usuarios finales, sino para desarrolladores).

## Decisiones explícitas (no re-preguntar)

- **In-house, mismo patrón que el blog (spec 009):** páginas TSX estáticas, contenido tipado en
  `src/features/docs/data/modules.tsx` (mismo shape que `BlogArticle`: `intro` + `sections[]` como
  `ReactNode`). Sin markdown, sin MDX, sin `react-markdown`/`prismjs` (esas libs ya existen para el
  chat del asistente IA, pero introducirlas acá sería un segundo mecanismo de render de contenido
  conviviendo con el patrón JSX que ya usa blog/landing/seo — inconsistente sin necesidad).
  Se descartó explícitamente en la conversación previa cualquier generador de sitio externo
  (Docusaurus/Starlight/VitePress/Mintlify): no se pueden montar dentro de la misma SPA sin un
  segundo build/deploy.
- **Rutas:** `/docs` (índice agrupado) y `/docs/:slug` (guía). Mismo esquema que `/blogs` y
  `/blogs/:slug`.
- **Agrupación fija en 4 secciones** (no categorías filtrables por query string como el blog, porque
  acá el orden de lectura importa más que el descubrimiento libre): **Primeros pasos**, **Organizar tu
  trabajo**, **Plantillas, automatización e IA**, **Seguimiento y configuración**. El índice muestra
  las 4 secciones como tabla de contenidos vertical, cada una con sus guías.
  Ver tabla completa de 12 guías más abajo.
- **`DocsPage.tsx` se elimina** (reemplazado por `DocsIndexPage`); la ruta `/docs` en `App.tsx` pasa a
  apuntar a la nueva página. Se agrega `/docs/:slug`.
- **Slug inválido → redirect a `/docs`** (idéntico a `BlogPostPage` con `/blogs`).
- **SEO:** cada guía usa `SeoPage` + `SeoArticle` (mismos componentes que blog) con
  `title`/`description`/`canonical`/OG/Twitter + JSON-LD `TechArticle` (en vez de `BlogPosting`, más
  apropiado para contenido de documentación de producto). El índice también entra al sitemap
  dinámico (`vite.config.ts`, mismo mecanismo que `BLOG_SLUGS`).
- **Español neutro (tuteo), no voseo** — coherente con la dirección ya tomada en spec 028 para el
  resto del contenido público. No se reabre spec 028 (esa spec sigue en curso sobre landing/blog); acá
  solo se aplica el mismo criterio al contenido nuevo que se escribe en esta spec.
- **Sin buscador de texto libre ni versionado de docs** en esta iteración — 12 guías son pocas como
  para justificar un índice invertido o Pagefind-like; la tabla de contenidos agrupada alcanza.
- **Contenido reflejando el producto real, verificado en código** (mismo criterio que spec 028: cada
  guía se escribe leyendo los archivos/`features` reales, no confiando en el campo `Estado` de specs
  individuales que a veces queda desactualizado).

## Guías incluidas (v1)

| # | Slug | Título | Grupo | Cubre |
|---|---|---|---|---|
| 1 | `primeros-pasos` | Primeros pasos | Primeros pasos | Elegir carpeta (File System API), instalar PWA, crear primer producto/proyecto, fallback de descarga |
| 2 | `productos-y-proyectos` | Productos y proyectos | Organizar tu trabajo | Jerarquía Producto→Proyecto→Área, estado/prioridad, RACI |
| 3 | `procesos-y-checklists` | Procesos y checklists | Organizar tu trabajo | SOPs por área, checklists, convertir ítem en tarea |
| 4 | `tareas-y-kanban` | Tareas y Kanban | Organizar tu trabajo | Drag & drop, comentarios, archivado, drawer de detalle, subtareas |
| 5 | `sprints-y-trimestres` | Trimestres | Organizar tu trabajo | Agrupar proyectos por trimestre (`QuartersPage`), progreso agregado por período |
| 6 | `mis-tareas-y-daily` | Mis tareas y Daily Standup | Organizar tu trabajo | Vista personal cross-proyecto, ritual diario |
| 7 | `tipos-y-plantillas` | Tipos y plantillas | Plantillas, automatización e IA | Biblioteca: Tipos de Proyecto, Plantillas de checklist/proceso, instanciación automática |
| 8 | `automatizaciones-y-flujos` | Automatizaciones y Flujos | Plantillas, automatización e IA | Builder visual, triggers (webhook/poll/evento), integraciones (HubSpot/Sheets/Email/Webhook saliente con HMAC), reintentos |
| 9 | `asistente-ia` | Asistente IA | Plantillas, automatización e IA | Chat Gemini, tools de lectura/escritura, búsqueda semántica (RAG), fallback automático de modelos |
| 10 | `dashboard-y-portafolio` | Dashboard y portafolio | Seguimiento y configuración | Salud de proyecto (semáforo), vista de portafolio, proyectos estancados |
| 11 | `notificaciones` | Notificaciones | Seguimiento y configuración | Recordatorios por fecha, deep-links |
| 12 | `ajustes-y-datos` | Ajustes y datos | Seguimiento y configuración | Personas, exportar/importar por colección, seguridad de conexiones (vault), privacidad |

## Historias de usuario (con criterios de aceptación)

### HU-01 — Tabla de contenidos en `/docs`
**Como** visitante o usuario de Hito, **quiero** ver todas las guías agrupadas por tema al entrar a
`/docs`, **para** encontrar rápido la que necesito sin buscar afuera de la app.
- ✅ `/docs` muestra las 4 secciones (Primeros pasos, Organizar tu trabajo, Plantillas/automatización/
  IA, Seguimiento y configuración) con sus guías como lista/grid clicable.
- ✅ Cada entrada muestra título + una línea de resumen (`excerpt`).

### HU-02 — Leer una guía
**Como** usuario, **quiero** abrir `/docs/:slug` con una URL limpia, **para** leerla y compartirla.
- ✅ Layout editorial igual al de un artículo de blog (`SeoArticle`): eyebrow, título, intro,
  secciones con heading.
- ✅ Slug inexistente → redirect a `/docs`.
- ✅ Metadatos SEO completos (`title`, `description`, canonical, OG, Twitter, JSON-LD `TechArticle`).

### HU-03 — Navegación entre guías
**Como** usuario leyendo una guía, **quiero** ver a qué grupo pertenece y volver fácilmente al índice,
**para** no quedar en un callejón sin salida.
- ✅ Breadcrumb o link "← Volver a Documentación" en cada página de guía.
- ✅ CTA final hacia `/app` (mismo patrón que blog), reusando `SeoArticle`.

### HU-04 — Contenido fiel al producto actual
**Como** usuario, **quiero** que la guía de cada módulo describa funciones que existen de verdad,
**para** no perder tiempo con instrucciones obsoletas.
- ✅ Las 12 guías fueron escritas verificando el código real de cada feature (no solo el texto de su
  spec original).
- ✅ Ninguna guía menciona una función eliminada o renombrada.

### HU-05 — SEO técnico
**Como** motor de búsqueda, **quiero** descubrir e indexar `/docs` y cada guía.
- ✅ `sitemap.xml` incluye `/docs` y las 12 rutas `/docs/:slug` (mismo mecanismo dinámico que
  `BLOG_SLUGS` en `vite.config.ts`).
- ✅ `robots.txt` no bloquea `/docs` (hoy solo bloquea `/app`).

## Fuera de alcance

- Buscador de texto libre, versionado de docs, o comentarios por guía.
- Cualquier framework de documentación externo (Docusaurus/Starlight/VitePress/Nextra/Mintlify) o
  segundo deploy/proxy hacia otro origen.
- Traducción a otros idiomas.
- Cambios a `src/domain`, schemas o lógica de `/app` — 100% contenido público, igual que spec 009/028.
- Reescribir o tocar `SeoArticle.tsx`/`SeoPage.tsx` más allá de reutilizarlos tal cual (si en el
  futuro spec 028 cambia su copy hardcodeado de voseo a tuteo, esta spec no depende de eso ni lo
  bloquea).
- Capturas de pantalla o assets gráficos — mismo lenguaje 100% texto + iconos que el resto del sitio
  público.

## Métricas de éxito

- Las 12 guías existen, son accesibles desde `/docs` y cada una carga en `/docs/:slug` sin error.
- 0 menciones de funciones que no existen en código (verificado guía por guía contra los archivos
  reales de cada `feature`).
- `sitemap.xml` generado incluye 13 rutas nuevas (`/docs` + 12 slugs).
- `tsc --noEmit`, la suite de tests Vitest y `vite build` en verde tras los cambios.
