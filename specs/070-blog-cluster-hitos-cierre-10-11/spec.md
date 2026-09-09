# Spec 070 — Blog: 24 posts (cierre Clusters 10–11 + Cluster 12 "Hitos" nuevo)

## Progreso

- **Estado general: 🟩 IMPLEMENTADO (2026-09-08).** Cierra el roadmap pendiente y suma un
  cluster nuevo definido por demanda real del export GSC del 2026-09-08
  (`d:\Downloads\hito.autos-Performance-on-Search-2026-09-08\`, búsqueda Web, últimos 3 meses).
  Total: **24 artículos** en 3 lotes, ejecutados en una sola sesión según lo pedido por el
  usuario. El roadmap de 100 artículos queda completo: **107/107 slugs publicados**.
- **Lote A (5) — Cluster 10 cierre (slugs 18–22 del spec 069):** 🟩 hecho. `definition-of-done`,
  `plan-de-trabajo`, `matriz-eisenhower`, `tareas-recurrentes`, `calendario-de-proyecto`
  (2026-09-04 → 09-08), `pillar: "tablero-kanban"`.
- **Lote B (10) — Cluster 11 completo (Fase 3 del spec 069):** 🟩 hecho. Pilar `scrumban`
  (featured) + 9 satélites (PERT, control de cambios, línea base, plan de comunicación,
  MoSCoW, dashboard, software, portafolio, triple restricción), `pillar: "scrumban"`.
- **Lote C (9) — Cluster 12 "Hitos" (nuevo, este spec):** 🟩 hecho. Los 9 satélites con
  `pillar: "hito-project-gestion-por-hitos"` + `related` del pilar poblado con los 9.
- **Interlinking de salida:** 🟩 hecho — `related` actualizado en 16 posts existentes
  (tabla de este spec) en `articles-index.ts`.

### Gates (2026-09-08)

- `npx tsc --noEmit` ✅
- `npx eslint src/features/blog` ✅
- `npx vitest run src/features/blog` ✅ 64/64 (anti-drift incluye los 24 slugs nuevos)
- `npm run build` ✅ — 140 rutas prerenderizadas, incluidas las 24 nuevas

Fuente de datos: Consultas, Páginas, Países, Dispositivos, Filtros, Gráfico y
`Aparición en búsquedas.csv` (este último solo cabecera, vacío) del export 2026-09-08.

---

## Diagnóstico GSC (baseline 2026-09-08, vs. spec 069)

| Métrica | ago-2026 (069) | sep-2026 (este) | Lectura |
|---|---|---|---|
| Impresiones (páginas) | ~2.470 | ~2.500 | Estable |
| Clics (páginas) | 8 | 9 | Casi sin cambio |
| CTR medio | ~0,32 % | ~0,36 % | Igual de bajo |
| `que-es-un-hito-gestion-proyectos` | 718 / pos 13,41 | 776 / pos 13,0 | Página #1 del sitio, atascada en pos ~13 |
| `hito-project-gestion-por-hitos` | 154 / pos 14,26 | 193 / pos 13,63 | Crece sin URL satélite que la apoye |
| Fase 1 (Cluster 9) | — | Indexada: `mcp-vs-function-calling-vs-rag` pos 9, `hito-vs-clickup` 7,53, `local-first` 8,87 | Los posts nuevos sí perforan top 10 |
| Fase 8 lote 1 (tablero) | — | `tablero-kanban` 15 impr / pos 16,47 en ~1 semana | Arranque sano |

**Conclusiones que definen este spec:**

1. El problema sigue siendo posición/snippet, no cobertura. Pero los posts publicados en las
   fases recientes sí entran al top 10 rápido — la palanca correcta sigue siendo **contenido
   nuevo interlinkeado**, no reescrituras.
2. La familia de **"hito"** domina el sitio (Consultas.csv: `hito` 188, `que es un hito` 99,
   `que es hito` 85, `hito que es` 24, `hito project` 20, `hito en project` 3, `hito app` 11,
   `hito software` pos 1,75… — más de **500 impresiones** acumuladas, todas en pos 9–16, la
   zona quick-win) y tiene **tres queries con demanda y sin URL propia**: `diagrama de hitos`
   (15 impr, **pos 75,93** — enterrada), `cronograma de hitos` (3, pos 68,33) y la familia
   MS Project (`hito project` 20 / pos 21,8; `que es un hito en project` 15 / pos 36,53;
   `hito en project` 3 / pos 8,67). Además `hitos de un proyecto` (8 / 31,88), `ejemplos de
   hitos` (5 / 9), `hitos del proyecto` (4 / 33,25) y `que es un hito en construccion` (1 / 12).
   → Se abre el **Cluster 12 "Hitos"**: 9 satélites que cuelgan del pilar de facto existente
   `hito-project-gestion-por-hitos` (featured, 193 impr). Es además el concepto de marca:
   refuerza la SERP de `hito`/`que es un hito` desde adentro.
3. Otros rescates que este lote cubre de paso (ya estaban mapeados en 069): `es compatible
   mezclar kanban y scrum` (33) y `kanban versus scrum` (89) → `scrumban`; `formula de tiempo
   esperado` (33) → PERT; `priorizar acciones según impacto en resultados` (74,71) →
   `matriz-eisenhower`/`priorizacion-moscow`; `proyecto ordenado de actividades` (49) →
   `plan-de-trabajo`; `tablero kanban ejemplo` (62) / `como hacer un kanban` (46) → refuerzo
   del cluster tablero.
4. Track A residual (titles/FAQ de `fases-de-un-proyecto` 39,72, `como-priorizar-tareas` 47,48,
   `servidores-mcp-para-que-sirven` 35,57): **fuera de alcance** aquí; medir en el próximo
   export (4–6 semanas desde los parches de 058).

---

## Los 24 posts (3 lotes)

### Lote A — Cluster 10 cierre (5, definidos en spec 069 Fase 2)

Pilar del cluster: `tablero-kanban` (ya publicado). Todos con `pillar: "tablero-kanban"`.

| # | Slug | `publishedAt` | Keyword primaria | Ángulo |
|---|---|---|---|---|
| 1 | `definition-of-done` | 2026-09-04 | definition of done / definición de hecho | DoD vs DoR, checklist copiable, el "¿está listo?" que evita re-trabajo |
| 2 | `plan-de-trabajo` | 2026-09-05 | plan de trabajo / cómo hacer un plan de trabajo | El plan operativo de la semana, distinto del plan de proyecto formal (`plantilla-plan-de-proyecto`) |
| 3 | `matriz-eisenhower` | 2026-09-06 | matriz eisenhower / matriz de eisenhower | 4 cuadrantes en la práctica + la trampa de lo urgente; puente a MoSCoW |
| 4 | `tareas-recurrentes` | 2026-09-07 | tareas recurrentes / tareas repetitivas | Recurrencia vs plantilla vs SOP; cuándo cada una |
| 5 | `calendario-de-proyecto` | 2026-09-08 | calendario de proyecto | La vista día/semana del equipo, distinta de Gantt y cronograma |

### Lote B — Cluster 11 completo (10, definidos en spec 069 Fase 3)

Pilar: `scrumban` (featured). Satélites con `pillar: "scrumban"`.

| # | Slug | `publishedAt` | Keyword primaria | Señal GSC |
|---|---|---|---|---|
| 6 | `scrumban` **PILAR, featured** | 2026-09-04 | scrumban / mezclar kanban y scrum | `scrumban` pos 92; `es compatible mezclar kanban y scrum` pos 33 |
| 7 | `formula-tiempo-esperado-pert` | 2026-09-05 | fórmula de tiempo esperado / PERT | `formula de tiempo esperado` pos 33 |
| 8 | `control-de-cambios-proyecto` | 2026-09-06 | control de cambios / change request | Puente de `alcance-de-proyecto-scope-creep` |
| 9 | `linea-base-proyecto` | 2026-09-07 | línea base / baseline de proyecto | Alcance+cronograma+costo |
| 10 | `plan-de-comunicacion-proyecto` | 2026-09-08 | plan de comunicación de un proyecto | Satélite de stakeholders/informe semanal |
| 11 | `priorizacion-moscow` | 2026-09-04 | MoSCoW / priorización moscow | Satélite de priorizar tareas; `priorizar acciones según impacto` 74,71 |
| 12 | `dashboard-de-proyectos` | 2026-09-05 | dashboard de proyectos / tablero de control | Distinto de `kpis-gestion-proyectos` |
| 13 | `gestion-proyectos-software` | 2026-09-06 | gestión de proyectos de software | Por industria, sin clon de Jira |
| 14 | `portafolio-de-proyectos` | 2026-09-07 | portafolio de proyectos | Puente de `gestionar-varios-proyectos-a-la-vez` |
| 15 | `triple-restriccion-proyecto` | 2026-09-08 | triple restricción / triángulo de hierro | Cierre de autoridad alcance-tiempo-costo |

### Lote C — Cluster 12 "Hitos" (9, NUEVO en este spec)

*Pilar: `hito-project-gestion-por-hitos` (ya publicado y featured — el cluster refuerza un
activo que ya rankea, no crea uno nuevo). Satélites con `pillar: "hito-project-gestion-por-hitos"`.*

| # | Slug | `publishedAt` | Keyword primaria | Señal GSC / gap |
|---|---|---|---|---|
| 16 | `hitos-de-un-proyecto-ejemplos` | 2026-09-04 | hitos de un proyecto / ejemplos de hitos | `hitos de un proyecto` 8/31,88; `ejemplos de hitos` 5/9; `hitos del proyecto` 4/33,25; `que son los hitos de un proyecto` 2/29,5 |
| 17 | `diagrama-de-hitos` | 2026-09-05 | diagrama de hitos | `diagrama de hitos` 15/**75,93** — enterrada, sin URL. howTo. |
| 18 | `cronograma-de-hitos` | 2026-09-06 | cronograma de hitos | `cronograma de hitos` 3/68,33 — sin URL. Categoría `plantillas`. |
| 19 | `hito-en-ms-project` | 2026-09-07 | hito en project / hito project | `hito project` 20/21,8; `que es un hito en project` 15/36,53; `hito en project` 3/8,67. howTo. |
| 20 | `hito-vs-entregable` | 2026-09-08 | diferencia entre hito y entregable | `hito vs` 1/9 + hueco conceptual del pilar (tarea–entregable–hito) |
| 21 | `hitos-en-construccion` | 2026-09-04 | hitos en construcción / hito de obra | `que es un hito en construccion` 1/12 + precedente vertical (`hito-para-estudio-juridico`) |
| 22 | `hitos-en-metodologias-agiles` | 2026-09-05 | hitos en scrum / hito en agile | Puente hitos ↔ sprints/releases; sin URL (los agiles "no tienen hitos" y sí los necesitan) |
| 23 | `software-de-gestion-por-hitos` | 2026-09-06 | software de gestión por hitos | `hito app` 11/10,82; `hito software` 2/**1,75**; intención comercial del cluster |
| 24 | `alternativa-a-ms-project` | 2026-09-07 | alternativa a MS Project | Demanda MS Project confirmada en el export; cierra la serie `alternativa-a-{asana,monday,jira}`. Categoría `comparativas`. |

`publishedAt`: todos ≤ 2026-09-08 (día de la sesión). La cadencia semanal previa se comprime
en un sprint de publicación con varias URLs por día; `datePublished` nunca futuro (regla 069).

---

## Briefs del Lote C (estructura obligatoria por post)

Convenciones compartidas (de spec 069, aplican a los 3 lotes): H1 con keyword; intro
`<strong>En una línea:</strong>` de 45–55 palabras con la keyword en las primeras 100; 4–7 H2;
≥1 tabla (`className="w-full border-collapse text-sm"`); 5 FAQ (pregunta = query real,
primera frase = respuesta directa); links internos `<Link to="/blogs/<slug>"
className="underline underline-offset-2">`; Hito solo en el CTA final (o mención honesta si
el criterio es local-first); 1.400–2.200 palabras; tuteo neutro, sin voseo ni marcas de España;
longitud/meta title ≤60 + `| Hito`, description ≤155.

**16. `hitos-de-un-proyecto-ejemplos`** — H1: "Hitos de un proyecto: los que sí o sí se
marcan (con ejemplos)". H2: qué es un hito (resumen 2 líneas → link `que-es-un-hito-gestion-proyectos`);
los hitos típicos por fase (inicio: kickoff, acta aprobada; planificación: plan/línea base
aprobada; ejecución: prototipo, beta, entrega parcial; cierre: entrega final, aceptación del
cliente, lecciones aprendidas); tabla por industria (software, agencia, consultoría,
construcción → link `hitos-en-construccion`); cómo elegir TUS hitos (verificable, pocos,
con fecha); errores (confundir hito con tarea → link `hito-vs-entregable`, hitos en exceso,
hitos sin criterio). FAQ: cuáles son los hitos de un proyecto / qué es un hito con ejemplo /
cuántos hitos debe tener un proyecto / diferencia entre hito y entregable / qué hitos tiene
un proyecto de construcción. Related: pilar, `que-es-un-hito-gestion-proyectos`,
`hito-vs-entregable`, `fases-de-un-proyecto`.

**17. `diagrama-de-hitos`** — H1: "Diagrama de hitos: qué es y cómo hacerlo (con ejemplo)".
H2: qué es (línea de tiempo de mojones); diagrama de hitos vs Gantt (tabla; link
`diagrama-de-gantt`); cómo hacerlo en 5 pasos (`howTo`: listar hitos → verificar criterio →
fechar → ordenar → dibujar/publicar); ejemplo completo (proyecto web: kickoff, plan aprobado,
beta, lanzamiento); herramientas (tabla honesta: Excel, TeamGantt, GanttPro, MS Project →
link `hito-en-ms-project`, Hito). FAQ: qué es un diagrama de hitos / cómo hacer un diagrama
de hitos / diferencia entre diagrama de hitos y diagrama de Gantt / qué debe incluir /
sirve Excel. Related: pilar, `diagrama-de-gantt`, `cronograma-de-hitos`,
`plantilla-cronograma-proyecto`.

**18. `cronograma-de-hitos`** — H1: "Cronograma de hitos: el calendario mínimo que tu
cliente sí lee". H2: qué es (tabla fecha–mojón–responsable–criterio); cronograma de hitos vs
cronograma de actividades vs diagrama de hitos (tabla, links `plantilla-cronograma-proyecto`,
`diagrama-de-hitos`); cómo armarlo en 5 pasos; plantilla copiable con ejemplo de agencia;
cómo mantenerlo vivo (revisión semanal, control de cambios → link
`control-de-cambios-proyecto`). FAQ: qué es un cronograma de hitos / cómo se hace /
diferencia con cronograma de actividades / qué columnas lleva / cuándo usar hitos y cuándo
tareas. Related: pilar, `plantilla-cronograma-proyecto`, `diagrama-de-hitos`,
`calendario-de-proyecto`. Categoría `plantillas`.

**19. `hito-en-ms-project`** — H1: "Hito en MS Project: qué es y cómo crearlo paso a paso".
H2: qué es un hito en MS Project (duración cero, rombo); cómo crearlo (`howTo` 6 pasos:
insertar tarea → 0 días → marcar rombo → fecha → dependencias → hito periódico); hito de
duración cero vs hito con duración; ejemplo de plan con hitos; límites de MS Project para
equipos pequeños (precio, curva, desktop) + alternativa ligera. FAQ: qué es un hito en MS
Project / cómo se crea un hito en Project / por qué el hito tiene duración cero / cómo poner
el símbolo de hito / diferencia entre hito y tarea resumen. Related: pilar,
`diagrama-de-hitos`, `alternativa-a-ms-project`, `ruta-critica-proyecto`.

**20. `hito-vs-entregable`** — H1: "Hito vs entregable: la diferencia que evita planes
inflados". H2: definiciones en dos líneas cada una; tabla hito/entregable/tarea (qué es,
duración, ejemplo, quién lo valida); cómo se relacionan (entregable → hito de aceptación);
errores (contar entregables como hitos, hitos sin entregable asociado); ejemplo extremo a
extremo (rediseño de marca). FAQ: qué es un entregable / diferencia entre hito y entregable /
¿un hito puede tener duración? / ¿el entregable final es un hito? / hito vs tarea. Related:
`que-es-un-hito-gestion-proyectos`, `hitos-de-un-proyecto-ejemplos`,
`wbs-estructura-desglose-trabajo`, pilar.

**21. `hitos-en-construccion`** — H1: "Hitos en construcción: los 10 que toda obra debería
marcar". H2: por qué la construcción ES gestión por hitos (pagos, permisos, inspecciones);
los 10 hitos típicos (tabla por fase: permiso de obra, movimiento de tierras, cimentación,
estructura, cierre de techo, instalaciones, acabados, inspección, entrega, acta de recepción);
hitos de pago vs hitos técnicos; llevarlos sin software enterprise (carpeta compartida,
local); ejemplo de cronograma de hitos de una casa. FAQ: qué es un hito en construcción /
cuáles son los hitos de una obra / qué es el cierre de techo / cómo se relacionan con los
pagos / qué herramienta sirve para hitos de obra. Related: pilar,
`hitos-de-un-proyecto-ejemplos`, `cronograma-de-hitos`, `hito-para-estudio-juridico`.

**22. `hitos-en-metodologias-agiles`** — H1: "¿Los proyectos ágiles tienen hitos? Sí: estos
son los que cuentan". H2: la objeción ágil (los hitos "huelen a cascada") y por qué es falsa;
hitos que sí existen en agile (tabla: MVP, release, onboarding de cliente, cierre de quarter
— el fin de sprint NO es hito); cómo marcarlos sin traicionar la iteración; dónde caben según
el método (Scrum, Kanban, híbrido → link `scrumban`); ejemplo: roadmap de 2 quarters con 5
hitos. FAQ: qué es un hito en Scrum / ¿el fin de sprint es un hito? / ¿cómo se llaman los
hitos en agile? / ¿qué es un milestone en un roadmap? / hito vs sprint goal. Related: pilar,
`scrumban`, `historias-de-usuario`, `sprint-planning-como-hacerlo`.

**23. `software-de-gestion-por-hitos`** — H1: "Software de gestión por hitos: qué debe
tener y 6 opciones". H2: qué necesita una herramienta de hitos (fecha, estado verificable,
criterio, vista de línea de tiempo); tabla honesta de 6 (MS Project, TeamGantt, GanttPro,
ClickUp, Asana, Hito) con "ideal para" y techo; por qué el enterprise sobra en equipos de
1–15; checklist de prueba (5 cosas en 15 min); errores al elegir (comprar Gantt cuando el
problema es disciplina de hitos). FAQ: qué software sirve para gestionar por hitos /
¿Excel alcanza? / ¿Trello tiene hitos? / ¿qué es la app Hito? / ¿cuánto cuesta? Related:
pilar, `software-gestion-proyectos`, `hito-en-ms-project`, `app-kanban`.

**24. `alternativa-a-ms-project`** — H1: "Alternativas a MS Project en 2026: 7 opciones
según tu caso". H2: por qué se busca alternativa (precio, curva, desktop/Windows, sobrado
para equipos pequeños); tabla honesta de 7 (TeamGantt, GanttPro, OpenProject, ProjectLibre,
ClickUp, monday.com, Hito) con techo de cada uno; cuál según tu caso (pyme de servicios,
agencia, obra ligera, equipo técnico); qué vas a perder al salir de MS Project (calendarios
de recursos, nivelación, EVM nativo → link `valor-ganado-evm` — honestidad); migración en una
tarde (exportar, mapear WBS→hitos, un piloto). FAQ: cuál es la mejor alternativa a MS Project
/ ¿hay alternativa gratis? / ¿ProjectLibre es igual? / ¿qué pierdo si lo dejo? / ¿qué usa un
equipo pequeño en su lugar? Related: `software-gestion-proyectos`, `hito-en-ms-project`,
`alternativa-a-jira`, pilar. Categoría `comparativas`.

---

## Interlinking de salida (posts ya publicados — editar `related` en articles-index.ts)

| Post existente | Añadir a `related` |
|---|---|
| `hito-project-gestion-por-hitos` (pilar C12, hoy sin related) | los 9 satélites nuevos del Cluster 12 (encabezan `hitos-de-un-proyecto-ejemplos`, `diagrama-de-hitos`, `hito-en-ms-project`) |
| `que-es-un-hito-gestion-proyectos` | `hitos-de-un-proyecto-ejemplos` |
| `diagrama-de-gantt` | `diagrama-de-hitos` |
| `plantilla-cronograma-proyecto` | `cronograma-de-hitos` |
| `hito-para-estudio-juridico` | `hitos-en-construccion` |
| `scrum-vs-kanban` | `scrumban` |
| `kanban-limites-wip` | `scrumban` |
| `como-estimar-tiempos-proyecto` | `formula-tiempo-esperado-pert` |
| `alcance-de-proyecto-scope-creep` | `control-de-cambios-proyecto` |
| `presupuesto-de-proyecto` | `linea-base-proyecto`, `triple-restriccion-proyecto` |
| `que-son-stakeholders` | `plan-de-comunicacion-proyecto` |
| `kpis-gestion-proyectos` | `dashboard-de-proyectos` |
| `gestionar-varios-proyectos-a-la-vez` | `portafolio-de-proyectos` |
| `como-priorizar-tareas` | `matriz-eisenhower`, `priorizacion-moscow` |
| `como-documentar-procesos-equipos` | `tareas-recurrentes` |
| `plantilla-plan-de-proyecto` | `plan-de-trabajo` |

`pillar` de los pilares nuevos: `scrumban` (Cluster 11) sin `pillar` propio; los 9 satélites
del Lote B con `pillar: "scrumban"`. Los 9 del Lote C con `pillar:
"hito-project-gestion-por-hitos"`. Lote A con `pillar: "tablero-kanban"`.

---

## Estilo

Mismo de specs 040/058/068/069: tuteo neutro latino, sin voseo ni marcas de España, intro
"En una línea:", FAQ con queries literales, comparativas honestas, `publishedAt` nunca futuro,
productos con hechos (Hito local-first, JSON, sin cuenta, kanban WIP, SOPs, automatizaciones,
GitHub sync, dashboard de portafolio, IA opcional MCP/RAG, PWA offline, 1–15 personas).

## Archivos que toca

- `src/features/blog/data/articles/<slug>.tsx` × 24 (nuevos)
- `src/features/blog/data/articles-index.ts` (24 metas + related de 16 posts existentes)
- `src/features/blog/data/articles/index.ts` (24 loaders)
- `ROADMAP_BLOG.md` (Cluster 12 + estados + progreso + calendario)
- Este spec (marcar lotes 🟩 al cerrar gates)

Prerender/sitemap salen de `BLOG_SLUGS`; no hace falta lista a mano.

## Verificación (gates)

- `npx tsc --noEmit`
- `npx eslint src/features/blog`
- `npx vitest run src/features/blog` (anti-drift cubre los 24 slugs nuevos)
- `npm run build` (prerender de las 24 rutas nuevas)

## Fuera de alcance

- Track A residual de 058 (titles/FAQ de posts existentes): medir en próximo export.
- Traducciones; landings satélite; cambios de diseño (spec 059).

## Cómo retomar

> Los 3 lotes se ejecutan en la misma sesión (pedido del usuario). Si algo queda a medias,
> completar primero `articles-index.ts`/`articles/index.ts` de los archivos que existan, correr
> gates, y marcar en la sección Progreso qué slugs quedaron fuera.

### KPIs (heredados de 069, a medir en el export de octubre 2026)

| Métrica | Baseline sep-2026 | Objetivo 30 días | Objetivo 90 días |
|---|---|---|---|
| Clics / 3 meses | 9 | 15 | 40 |
| `hito` / `que es un hito` | pos 13 / 0 CTR | pos ≤ 8, CTR > 1 % | featured snippet |
| `diagrama de hitos` | pos 75,93 | pos ≤ 30 | pos ≤ 10 |
| `hito project` (MS Project) | pos 21,8 | pos ≤ 15 | pos ≤ 8 |
| Queries comerciales MS Project/software hitos | sin URL | indexadas | pos ≤ 30 |
