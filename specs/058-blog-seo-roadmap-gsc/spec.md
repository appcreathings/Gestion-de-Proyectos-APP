# Spec 058 — Blog: roadmap de mejora SEO guiado por Search Console

## Progreso

- **Estado general: 🟨 EN CURSO.** Nace de un export de Google Search Console (últimos 3 meses,
  búsqueda Web) aportado por el usuario: 6 CSV (Consultas, Páginas, Países, Dispositivos, Gráfico,
  Aparición en búsquedas). El sitio tiene tráfico real (1.886 impresiones/3 meses, 6 clics, CTR
  ~0.32%) pero la mayoría de páginas rankean en posición 30-90, fuera de los 3 primeros resultados
  donde ocurre el CTR real. Este spec no reemplaza `ROADMAP_BLOG.md` (spec 040) — lo continúa y le
  suma un **track de mejora de posts existentes** basado en datos reales de búsqueda, más un
  cluster nuevo detectado por demanda (`mcp`).

### Lote 1 — 🟩 hecho (mejora SEO, 6 posts existentes)

Parche on-page en `articles-index.ts` + `articles/<slug>.tsx`. Slug, `publishedAt` y `sections`
intactos. Redacción en tuteo neutro; se corrigió voseo residual al paso.

| Slug | Qué cambió |
|---|---|
| `que-es-mcp` | Title/H1 con "MCP" + "Model Context Protocol" + "protocolo". Description cubre protocolo MCP y primitives. FAQ nuevo (¿Qué es MCP?, Model Context Protocol, MCP primitives). Intro ya tenía la query dominante. Link interno + `related` a `rag-local-explicado`. |
| `fases-de-un-proyecto` | Title lidera con "Fases de un proyecto" y suma "etapas". Description cubre "etapa de un proyecto". Intro reescrita con la frase exacta + `usás`/`preguntás` → `usas`/`preguntas`. FAQ nuevo (fases de un proyecto, etapa de un proyecto, fases del proyecto). Link + `related` a `objetivos-proyecto-smart-okr`. |
| `como-priorizar-tareas` | Title/description incorporan "priorizar tareas" y "priorización de tareas". Intro: "priorizar tareas" en la primera línea. FAQ nuevo (cómo priorizar, priorización, priorizacion sin tilde). Link + `related` a `alcance-de-proyecto-scope-creep`. |
| `scrum-vs-kanban` | Title/H1 invierten a "Kanban vs Scrum" (la forma más buscada) y conservan "Scrum vs Kanban". Description cubre "Kanban y Scrum". Intro abre con Kanban vs Scrum. 3 FAQ nuevas con esas queries. `Elegí` → `Elige`. Link + `related` a `kanban-limites-wip`. |
| `alcance-de-proyecto-scope-creep` | Title lidera con "scope creep" y "corrupción del alcance". Description cubre "scope creep en español". Intro suma "corrupción del alcance". 3 FAQ nuevas (scope creep, corrupción del alcance, scope creep in Spanish). Voseo: Documentá/Definí/hacé/Reservá → Documenta/Define/haz/Reserva. Link en cuerpo a `fases-de-un-proyecto`. |
| `matriz-raci` | Title/description cubren "matriz RACI", "ejemplo" y "RASCI". Intro: "la matriz RACI" en la primera línea. 3 FAQ nuevas (qué es una matriz RACI, matriz RACI ejemplo, matriz RASCI). Voseo: Listá/tenés/asigná/Revisá/Compartila/Reservá/vos → Lista/tienes/asigna/Revisa/Compártela/Reserva/tú. Link en cuerpo a `alcance-de-proyecto-scope-creep`. |

### Lote 2 — 🟩 hecho (4 mejoras + 2 satélites MCP)

Parche Track A restante + inicio del mini-cluster MCP. Tuteo neutro; voseo residual corregido al paso.

| Slug | Qué cambió |
|---|---|
| `gestionar-varios-proyectos-a-la-vez` | Title/H1 lideran con "proyectos múltiples". Description e intro cubren esa query. 2 FAQ nuevas (proyectos múltiples / proyectos multiples). Voseo: sabés/sos/Empezás/Tenés/listá/Vos/Definí/Priorizá/usá/Hacé/Elegí/necesitás → tuteo. |
| `como-documentar-procesos-equipos` | Title lidera con "documentar un proceso". Description cubre "documentar procesos". Intro con ambas frases. FAQ schema nuevo (antes solo un `<dl>` en una sección). `Aprendé`/`Hacelo` → `Aprende`/`Hazlo`. Link + `related` a `organizar-proyectos-tareas-jerarquia`. |
| `waterfall-vs-agile` | Title/H1: "Metodología Waterfall vs Agile" y "Agile vs Waterfall". Description cubre "metodología agile cascada". 3 FAQ nuevas. Voseo: elegí/conocés/contestá/sos/Escribí/Marcá/Definí/Revisá/Negociá/Traducí → tuteo. |
| `kanban-limites-wip` | Title lidera con "Kanban WIP" y "qué significa". Description cubre W.I.P. y WIP en Scrum. 3 FAQ nuevas (qué significa WIP, Kanban WIP, WIP en Scrum). Voseo: podés/tenés/mirá/chocás/Priorizá/Terminá/etc. → tuteo. |
| **nuevo** `como-funciona-mcp-paso-a-paso` | Satélite de `que-es-mcp`. Procedimiento con `howTo` (schema). Targetea "mcp session", "introducing mcp", "mcp can". FAQ + link al pilar y a la comparativa. `publishedAt`: 2027-03-29. |
| **nuevo** `mcp-vs-function-calling-vs-rag` | Satélite de `que-es-mcp`. Comparativa a fondo + tabla. Cross-link con `rag-local-explicado`. `publishedAt`: 2027-04-05. |
| `que-es-mcp` (related) | `related` ahora apunta a los 2 satélites + `rag-local-explicado`. Links nuevos en el cuerpo a ambos satélites. |

### Pendiente (no va en este commit)

Track A (mejora de posts existentes) quedó cerrado en Lotes 1–2. Falta Track B
completo y el satélite de cierre de MCP. **Siguiente paso: Lote 3.**

| Lote | Estado | Qué falta |
|---|---|---|
| **3** | ⬜ | Cluster 4 de `ROADMAP_BLOG.md`: 6 artículos **nuevos** — pilar `plantillas-gestion-proyectos` + satélites `plantilla-plan-de-proyecto`, `acta-constitucion-proyecto`, `informe-de-estado-semanal`, `gestion-proyectos-excel`, `herramientas-gestion-proyectos-gratis`. Patrón B (3 archivos). Category `plantillas`. Enlazar satélites existentes del Cluster 4 (`hito-vs-trello`, `alternativas-a-notion`, `migrar-trello-a-hito`, `hito-vs-clickup`, `hito-para-estudio-juridico`) hacia el pilar. Marcar Cluster 4 🟩 en `ROADMAP_BLOG.md`. Cadencia: siguiente lunes después de `2027-04-05` → empezar en `2027-04-12`. |
| **4** | ⬜ | Cluster 5 (2 nuevos, sin pilar propio): `gestion-proyectos-freelancers`, `gestion-proyectos-agencias`. Cierre MCP: `servidores-mcp-para-que-sirven` (pillar `que-es-mcp`, related a los 2 satélites del Lote 2, casos de uso no técnicos). Marcar Cluster 5 🟩. Cerrar este spec como IMPLEMENTADO (10 mejoras + 11 artículos nuevos). |

Al retomar: el prompt autocontenido de cada lote está más abajo en «Prompts de ejecución».
Estilo: español latino neutro, tuteo (tú), sin voseo ni marcas de España. Gates del Lote 3/4:
`tsc --noEmit`, `eslint src`, `vitest run`, `vite build`.

Fuera de este spec (no commitear como parte del lote): artefactos de `graphify-out/`
generados al actualizar el grafo.

## Contexto — lectura de los datos GSC

### Panorama

- 3 meses: **1.886 impresiones, 6 clics, CTR 0.32%, posición media ~29**. El patrón es consistente
  con contenido bien orientado a intención informacional pero que aún no perfora el top 10 en la
  mayoría de sus términos — la ventana de mejora es de **posicionamiento**, no de "escribir más".
- País: España (464 impr) y México (414) dominan volumen; Colombia y El Salvador tienen el mejor
  CTR (3.8% y 6.25%) con poco volumen — señal de que cuando el título/snippet calza con la
  intención, sí se hace clic.
- Dispositivo: 70% de las impresiones son desktop; el CTR en desktop (0.38%) dobla el de móvil
  (0.18%) — no hay indicio de un problema de mobile, es puramente de posición.

### Track A — Posts existentes con impresiones altas y posición floja

De `Páginas.csv`, cruzando con las queries de `Consultas.csv` que aterrizan en cada uno. Son el
**mayor apalancamiento**: ya tienen indexación, backlinks internos y algo de autoridad — subir de
posición 40→15 es más barato que escribir un artículo nuevo desde cero.

| Slug | Impresiones | Posición | Queries reales que no calzan bien con el título actual |
|---|---|---|---|
| `que-es-mcp` | 133 | 37.74 | "mcp" (79 impr, pos 32.66), "model context protocol" (14, 78.57), "mcp protocol", "mcp primitives", "mcp session", "introducing mcp" — muchas variantes long-tail sin cobertura directa |
| `fases-de-un-proyecto` | 265 | 38.4 | "fases de un proyecto" (129, 42.31), "fases de proyecto" (32), "etapa de un proyecto" (18), "fase proyecto" (16), "fase de un proyecto" (12), "fases del proyecto" (8) |
| `como-priorizar-tareas` | 108 | 47.48 | "priorizar tareas" (24, 34.33), "priorización de tareas" (24, 56.5), "priorizacion de tareas" (23, 56.96), "cómo priorizar tareas" (13, 57.69) |
| `scrum-vs-kanban` | 58 | 75.45 | "kanban vs scrum" (15, **90.8**), "kanban y scrum" (9, 62.78), "kanban vs. scrum" (8, 86.62), "scrum vs kanban" (4, 91.5) — el título usa el orden inverso al que más busca la gente |
| `alcance-de-proyecto-scope-creep` | 51 | 70.86 | "scope creep" (37, **79.54**), "corrupción del alcance" (4, 74.25), "scope creep in spanish" (3, 36.67) |
| `matriz-raci` | 22 | 71.86 | "matriz raci" (8, 86.75), "matriz raci ejemplo" (4, 66), "raci" (1, 96), "que es una matriz raci" (1, 98), "matriz rasci" (1, 56) — variante ortográfica "rasci" sin cubrir |
| `gestionar-varios-proyectos-a-la-vez` | 11 | 45.27 | "proyectos multiples" (8, 58.38) |
| `como-documentar-procesos-equipos` | 10 | 58.1 | "como documentar un proceso" (5, 61.4), "documentar un proceso" (3, 67), "documentar procesos" (1, 68) |
| `waterfall-vs-agile` | 12 | 34.58 | "metodologia waterfall vs agile" (5, 31.2), "agile vs waterfall" (3, 44), "metodologia agile cascada" (2, 42.5) |
| `kanban-limites-wip` | 10 | 28.8 | "kanban wip" (2, 20), "w.i.p significado" (2, 80), "wip scrum" (1, 53) — variante "qué significa WIP" sin FAQ propia |

**Lo que NO se toca** (ya funcionan bien, no son parte de este spec): `hito.autos/` home (14.12),
`que-es-un-hito-gestion-proyectos` (13.54), `local-first-guia-definitiva-2026` (9.46),
`prompts-gestion-proyectos-ia` (11.89), `proyecto-atrasado-que-hacer` (6.27),
`organizar-proyectos-tareas-jerarquia` (11.06), `hito-vs-clickup` (7.86),
`como-estimar-tiempos-proyecto` (12.09).

### Track B — Continuación de `ROADMAP_BLOG.md` (spec 040)

Sigue vigente sin cambios: **Cluster 4 (Plantillas y herramientas, 6 artículos, pilar incluido)**
y **Cluster 5 (Por rol, 2 artículos)**, pendientes desde la Fase 4. Este spec los incorpora al plan
de lotes para no mantener dos roadmaps en paralelo.

### Track C — Gap nuevo detectado: cluster MCP

`que-es-mcp` (133 impresiones, la página con más volumen del sitio después de `fases-de-un-proyecto`)
recibe una cola larga de variantes ("mcp protocol", "mcp primitives", "mcp session", "introducing
mcp", "mcp can", "mcp-handler", "mcp's", "mcp what", "model communication protocol", "echo mcp",
"mcp seven") que un solo artículo pilar no puede cubrir bien sin perder foco. Es señal de demanda
real de un concepto que además **es el diferenciador de producto de Hito** (IA local vía MCP) — alto
valor de fondo de embudo. Se abre como mini-cluster de 3 (pilar existente + 2 satélites nuevos +
1 satélite adicional en el último lote), categoría `inteligencia-artificial`.

## Estilo de redacción

Español latino genérico (el usuario es de Colombia), no español de España ni voseo argentino.
Precedente ya establecido en el sitio: commit `e143823` ("normalizar textos del home a español
latino colombiano") reemplazó voseo mezclado por tuteo neutro en la landing.

- **Tuteo neutro** (tú/tu/tus): "vincula", "elige", "puedes", "crea" — nunca voseo ("vinculá",
  "elegís", "podés", "creá", "tenés", "hacé").
- Evitar marcas de España: "vale", "tío/tía", "coger" (usar "tomar"/"agarrar" según contexto),
  "os"/"vuestro" (usar "ustedes"/"su"), "ordenador" (usar "computador"/"computadora").
- Evitar modismos muy locales de un solo país (rioplatenses, mexicanismos marcados, etc.) — el
  registro debe leerse natural en Colombia, México, Perú, Chile, etc. por igual.
- **Los 24 artículos ya publicados no están libres de voseo residual** (ej. `matriz-raci.tsx` tiene
  "Listá", "asigná", "Revisá", "Compartila"). Cuando un lote toca un post existente (Track A),
  corregir el voseo que encuentre en el camino, aunque no esté en la lista de cambios de SEO — no
  hace falta un lote aparte solo para eso, pero no se deja pasar si ya se está editando ese archivo.

## Objetivo

- Subir de posición los 10 posts del Track A sin reescribirlos desde cero — parches de SEO
  on-page dirigidos por las queries reales que ya los encuentran.
- Cerrar Cluster 4 y 5 de `ROADMAP_BLOG.md` (8 artículos).
- Abrir el mini-cluster MCP (3 artículos: 2 satélites nuevos + 1 de cierre).
- Total: **10 mejoras + 11 artículos nuevos = 21 items**, repartidos en lotes de 6 (el último de 3),
  igual que las Fases 1-4 de spec 040.

## Esqueleto base

### A. Mejora de post existente (Track A) — no reescribir, parchear

Por cada slug del Track A, tocar únicamente `src/features/blog/data/articles-index.ts` (metadata)
y `src/features/blog/data/articles/<slug>.tsx` (contenido), sin cambiar la URL/slug:

1. **`seo.title`**: reescribir para que contenga la query de mayor volumen en su forma exacta
   (ej. `scrum-vs-kanban` → agregar "Kanban vs Scrum" además de "Scrum vs Kanban" en el title o el
   H1, ya que esa es la forma que más se busca).
2. **`seo.description`**: reescribir integrando 1-2 variantes long-tail de la tabla de arriba,
   manteniendo el tono y ≤160 caracteres.
3. **`content.faq`**: agregar 2-3 preguntas nuevas con la redacción literal de las queries reales
   (ej. matriz-raci → "¿Qué es la matriz RASCI?"; kanban-limites-wip → "¿Qué significa WIP?"). Si el
   artículo no tiene `faq` todavía, crearlo (alimenta schema `FAQPage`, ver `types.ts`).
4. **`content.intro`**: solo si la query dominante no aparece ya en las primeras 2 líneas —
   agregarla de forma natural, sin keyword stuffing.
5. **Internal linking**: 1 link nuevo hacia/desde otro post del mismo cluster si no existe ya
   (revisar `related` en la metadata).
6. **No tocar**: slug, `publishedAt`, estructura de `sections` existente, diseño.
7. **De paso**: corregir cualquier voseo residual del archivo (ver "Estilo de redacción").

### B. Artículo nuevo (Track B y C) — patrón de spec 035/040, 3 archivos

```ts
// 1. src/features/blog/data/articles/<slug>.tsx
import type { BlogArticle } from "../../types";
import { DEFAULT_AUTHOR } from "../articles-index"; // solo si lleva author explícito

export const article: BlogArticle = {
  slug: "<slug>",
  title: "...",
  excerpt: "...",
  category: "gestion-proyectos" /* o la que aplique */,
  categoryLabel: "Gestión de proyectos",
  publishedAt: "YYYY-MM-DD", // siguiente en la cadencia semanal
  readingTime: "N min",
  featured: false,
  pillar: "<slug-del-pilar-del-cluster>", // vacío si ESTE es el pilar
  related: ["<slug-1>", "<slug-2>"],
  seo: { title: "... | Hito", description: "...", ogImageAlt: "..." },
  content: {
    eyebrow: "...",
    intro: <>...</>,
    sections: [{ heading: "...", body: <>...</> }],
    faq: [{ question: "...", answer: "..." }], // recomendado, targetea long-tail real
    howTo: undefined, // solo si el post es un procedimiento paso a paso
  },
};
```

```ts
// 2. src/features/blog/data/articles-index.ts → agregar a RAW_ARTICLES (sin `content`)
```

```ts
// 3. src/features/blog/data/articles/index.ts → agregar al registro `loaders`
"<slug>": () => import("./<slug>"),
```

Contenido agnóstico de herramienta (Hito solo en el CTA final), con tablas/FAQ donde aplique y
enlazado cruzado dentro del cluster — mismo patrón que los 24 artículos ya publicados.

## Plan de lotes (6 en 6, salvo el último)

| Lote | Track | Items |
|---|---|---|
| **1** | A (mejora, prioridad alta) | `que-es-mcp`, `fases-de-un-proyecto`, `como-priorizar-tareas`, `scrum-vs-kanban`, `alcance-de-proyecto-scope-creep`, `matriz-raci` |
| **2** | A (mejora, resto) + C (nuevo, inicio) | `gestionar-varios-proyectos-a-la-vez`, `como-documentar-procesos-equipos`, `waterfall-vs-agile`, `kanban-limites-wip`, **nuevo** `como-funciona-mcp-paso-a-paso`, **nuevo** `mcp-vs-function-calling-vs-rag` |
| **3** | B (Cluster 4 completo) | **nuevo** `plantillas-gestion-proyectos` (pilar), `plantilla-plan-de-proyecto`, `acta-constitucion-proyecto`, `informe-de-estado-semanal`, `gestion-proyectos-excel`, `herramientas-gestion-proyectos-gratis` |
| **4** | B (Cluster 5) + C (cierre) | `gestion-proyectos-freelancers`, `gestion-proyectos-agencias`, **nuevo** `servidores-mcp-para-que-sirven` |

Notas de contenido para los 3 nuevos de MCP:
- `como-funciona-mcp-paso-a-paso`: procedimiento con `howTo` (schema), targetea "mcp session",
  "introducing mcp", "mcp can".
- `mcp-vs-function-calling-vs-rag`: comparativa a fondo (la intro de `que-es-mcp` solo la roza),
  cross-link con `rag-local-explicado`.
- `servidores-mcp-para-que-sirven`: casos de uso no técnicos, targetea "mcp-handler", "mcp's",
  ángulo de producto (conecta con el uso de MCP en Hito).

## Prompts de ejecución

Cada bloque es un prompt autocontenido para correr en este repo (respeta `CLAUDE.md` / reglas de
graphify del proyecto). Ejecutar en orden; cada uno termina con los mismos gates de spec 035/040.

### Lote 1 — Mejora SEO, prioridad alta (6 posts existentes)

```
Lee specs/058-blog-seo-roadmap-gsc/spec.md completo antes de empezar. Ejecuta el Lote 1 (sección
"Esqueleto base → A. Mejora de post existente"). Aplica el parche de SEO (título, descripción, FAQ
con queries reales, intro, 1 link interno) a estos 6 slugs, en este orden: que-es-mcp,
fases-de-un-proyecto, como-priorizar-tareas, scrum-vs-kanban, alcance-de-proyecto-scope-creep,
matriz-raci. Usa la tabla "Track A" del spec para saber qué queries reales debe cubrir el
FAQ/título de cada uno. No cambies slug, publishedAt ni la estructura de `sections` existente.

Toda la redacción (títulos, descripciones, FAQ, intro, cualquier texto que toques) va en español
latino genérico — tuteo neutro (tú/tu/tus), nunca voseo argentino ni español de España. Ver la
sección "Estilo de redacción" del spec: si al editar un archivo encuentras voseo residual
("Listá", "asigná", "podés", etc.), corrígelo también aunque no esté en la lista de cambios de SEO.

Al terminar: tsc --noEmit, eslint src, vitest run, y actualiza la sección Progreso de
specs/058-blog-seo-roadmap-gsc/spec.md marcando el Lote 1 como hecho con un resumen de qué cambió
en cada slug.
```

### Lote 2 — Mejora SEO resto + inicio cluster MCP (4 mejoras + 2 posts nuevos)

```
Lee specs/058-blog-seo-roadmap-gsc/spec.md completo antes de empezar. Ejecuta el Lote 2. Primero
aplica el mismo parche de SEO del Lote 1 (sección "Esqueleto base → A") a:
gestionar-varios-proyectos-a-la-vez, como-documentar-procesos-equipos, waterfall-vs-agile,
kanban-limites-wip. Luego crea 2 artículos nuevos siguiendo el patrón de "Esqueleto base → B" (3
archivos: data/articles/<slug>.tsx + articles-index.ts + articles/index.ts), con pillar
"que-es-mcp" y related cruzado entre ellos y con que-es-mcp: como-funciona-mcp-paso-a-paso (con
howTo/schema, ver notas del spec) y mcp-vs-function-calling-vs-rag (comparativa, cross-link con
rag-local-explicado). Actualiza también el `related` de que-es-mcp para incluir estos 2 nuevos.

Toda la redacción va en español latino genérico — tuteo neutro (tú/tu/tus), nunca voseo argentino
ni español de España (ver sección "Estilo de redacción" del spec). Corrige también voseo residual
en cualquier archivo existente que toques.

Al terminar: tsc --noEmit, eslint src, vitest run, vite build, y actualiza la sección Progreso del
spec 058 marcando el Lote 2 como hecho.
```

### Lote 3 — Cluster 4 completo: Plantillas y herramientas (6 posts nuevos)

```
Lee specs/058-blog-seo-roadmap-gsc/spec.md completo antes de empezar. Ejecuta el Lote 3: el
Cluster 4 completo de ROADMAP_BLOG.md (pilar `plantillas-gestion-proyectos` + sus 5 satélites:
plantilla-plan-de-proyecto, acta-constitucion-proyecto, informe-de-estado-semanal,
gestion-proyectos-excel, herramientas-gestion-proyectos-gratis). Usa las intenciones de búsqueda de
la tabla del Cluster 4 en ROADMAP_BLOG.md. Sigue el patrón de "Esqueleto base → B" del spec 058 (3
archivos por artículo), category "plantillas", cada satélite con pillar
"plantillas-gestion-proyectos" y related al pilar + a un satélite hermano. Actualiza el `related`
del pilar para enlazar a los 5 satélites. Enlaza también los satélites existentes mencionados en
ROADMAP_BLOG.md (hito-vs-trello, alternativas-a-notion, migrar-trello-a-hito, hito-vs-clickup,
hito-para-estudio-juridico) hacia este pilar nuevo.

Toda la redacción va en español latino genérico — tuteo neutro (tú/tu/tus), nunca voseo argentino
ni español de España (ver sección "Estilo de redacción" del spec 058).

Al terminar: tsc --noEmit, eslint src, vitest run, vite build, y marca el Cluster 4 como 🟩 en
ROADMAP_BLOG.md y el Lote 3 como hecho en el Progreso del spec 058.
```

### Lote 4 — Cluster 5 + cierre cluster MCP (3 posts nuevos)

```
Lee specs/058-blog-seo-roadmap-gsc/spec.md completo antes de empezar. Ejecuta el Lote 4 (último):
Cluster 5 de ROADMAP_BLOG.md (gestion-proyectos-freelancers, gestion-proyectos-agencias — sin
pilar propio, related a los 4 pilares existentes según el tema que toquen cada uno) más el tercer
artículo del mini-cluster MCP: servidores-mcp-para-que-sirven (pillar "que-es-mcp", related a los 2
satélites del Lote 2, ángulo de casos de uso no técnicos — ver notas del spec). Sigue "Esqueleto
base → B".

Toda la redacción va en español latino genérico — tuteo neutro (tú/tu/tus), nunca voseo argentino
ni español de España (ver sección "Estilo de redacción" del spec 058).

Al terminar: tsc --noEmit, eslint src, vitest run, vite build, marca Cluster 5 como 🟩 en
ROADMAP_BLOG.md, y cierra la sección Progreso del spec 058 como IMPLEMENTADO con el resumen final
de los 21 items (10 mejoras + 11 artículos nuevos).
```

## Criterios de aceptación

- Los 10 slugs del Track A conservan su URL; su `seo.title`/`seo.description`/`faq` incorporan las
  queries reales de la tabla sin quedar como keyword stuffing legible.
- Los 11 artículos nuevos siguen exactamente el patrón de 3 archivos (sin duplicar la lista de
  slugs a mano, ver spec 035) y aparecen en `ROADMAP_BLOG.md` marcados 🟩 al cerrar su lote.
- `que-es-mcp` pasa a tener `pillar` propio de facto (es el pilar del mini-cluster) con 3
  satélites en su `related`.
- No hay regresión de schema (`FAQPage`/`HowTo`/`BlogPosting`) ni de comportamiento visible fuera
  de lo descrito.
- Resultado no medible en este repo (posición real en Google): se revisa en Search Console
  4-6 semanas después de publicar cada lote, no como gate de CI.

## Verificación (gates, estilo spec 034/035/040)

- `tsc --noEmit` ✅
- `eslint src` ✅ (sin errores nuevos)
- `vitest run` ✅ (incluye el test anti-drift slug↔loader de `data/articles.test.ts`)
- `vite build` ✅ tras cada lote que agregue artículos nuevos (Lotes 2, 3, 4)

## Fuera de alcance

- Reescribir por completo los 10 posts del Track A — es un parche dirigido por datos, no una
  reescritura.
- Cluster 5 alternativo, paginación/buscador del índice, migración a MDX (ídem spec 035).
- Cualquier cambio de infraestructura de tracking/analytics — este spec consume un export manual
  de GSC, no integra la API de Search Console.
