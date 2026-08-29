# Roadmap de blog — 68 artículos de gestión de proyectos (specs 040, 058 y 068)

> Nace de una auditoría del blog existente (18 artículos, ver `specs/035-blog-performance-organizacion/`):
> 14 de 18 hablan de Hito/local-first/privacidad — contenido de fondo de embudo. Falta cobertura de
> búsquedas informacionales puras de gestión de proyectos, que es el público que después necesita una
> app como Hito. Este documento planeó 32 artículos en 5 clusters con estructura pilar→satélite
> (más 3 plantillas extra del Cluster 4 en spec 058), a los que spec 068 sumó 12 artículos en 3
> clusters nuevos (control y métricas, stakeholders y equipo, dinero del proyecto) detectados por
> demanda de búsqueda. Se tacha a medida que se publica.

## Cómo leer esta tabla

- **Estado**: 🟩 publicado · 🟨 en escritura · ⬜ pendiente.
- **Pilar**: el artículo largo del cluster; los satélites lo enlazan y él los enlaza a todos
  (`related`/`pillar` en `src/features/blog/data/articles-index.ts`).
- Cada fila, al publicarse, es 3 archivos: `data/articles/<slug>.tsx` + entrada en
  `articles-index.ts` + entrada en `articles/index.ts` (patrón de spec 035).

---

## Cluster 1 — Fundamentos

*Pilar: `gestion-de-proyectos-guia-completa`*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| 🟩 | `gestion-de-proyectos-guia-completa` | **PILAR** — Gestión de proyectos: la guía completa y práctica | "gestión de proyectos", "qué es gestión de proyectos" |
| 🟩 | `fases-de-un-proyecto` | Las 5 fases de un proyecto, con ejemplos | "fases de un proyecto" |
| 🟩 | `como-estimar-tiempos-proyecto` | Cómo estimar tiempos de un proyecto sin fallar siempre | "cómo estimar tiempos de un proyecto" |
| 🟩 | `alcance-de-proyecto-scope-creep` | Alcance de proyecto: definirlo y evitar el scope creep | "scope creep", "alcance de proyecto" |
| 🟩 | `matriz-raci` | Matriz RACI: qué es, cómo armarla y plantilla | "matriz RACI", "qué es RACI" |
| 🟩 | `ruta-critica-proyecto` | Ruta crítica: qué tareas no se pueden atrasar | "ruta crítica proyecto", "método del camino crítico" |
| 🟩 | `objetivos-proyecto-smart-okr` | Objetivos de proyecto: SMART, OKR y cuándo cada uno | "objetivos SMART proyecto", "OKR vs SMART" |
| 🟩 | `gestion-de-riesgos-simple` | Gestión de riesgos para equipos pequeños | "gestión de riesgos en proyectos" |

## Cluster 2 — Metodologías

*Pilar: `metodologias-gestion-proyectos`*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| 🟩 | `metodologias-gestion-proyectos` | **PILAR** — Metodologías de gestión de proyectos: cuál usar según tu equipo | "metodologías de gestión de proyectos" |
| 🟩 | `scrum-vs-kanban` | Scrum vs Kanban: diferencias reales y cuál elegir | "scrum vs kanban" |
| 🟩 | `que-es-scrum-equipos-pequenos` | Qué es Scrum, sin certificaciones | "qué es scrum" |
| 🟩 | `kanban-limites-wip` | Kanban en la práctica: límites WIP | "límites WIP kanban", "qué es WIP" |
| 🟩 | `sprint-planning-como-hacerlo` | Sprint planning que se cumple | "cómo hacer sprint planning" |
| 🟩 | `daily-standup-util` | Daily standup que no sea pérdida de tiempo | "daily standup", "reunión diaria scrum" |
| 🟩 | `retrospectivas-formatos` | Retrospectivas: 5 formatos y cómo elegir | "formatos de retrospectiva", "retrospectiva de sprint" |
| 🟩 | `waterfall-vs-agile` | Waterfall vs Agile: cuándo cascada es la respuesta correcta | "waterfall vs agile" |

## Cluster 3 — Tips y problemas reales

*Pilar: `gestionar-varios-proyectos-a-la-vez`*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| 🟩 | `gestionar-varios-proyectos-a-la-vez` | **PILAR** — Cómo gestionar varios proyectos a la vez | "gestionar varios proyectos a la vez" |
| 🟩 | `proyecto-atrasado-que-hacer` | Tu proyecto va atrasado: 6 movimientos antes de pedir plazo | "proyecto atrasado qué hacer" |
| 🟩 | `reuniones-de-status-eliminar` | Reemplazar reuniones de status por un tablero | "eliminar reuniones de status" |
| 🟩 | `como-delegar-tareas` | Cómo delegar y dejar de ser el cuello de botella | "cómo delegar tareas" |
| 🟩 | `seguimiento-de-tareas-equipo` | Seguimiento de tareas sin microgestionar | "seguimiento de tareas de equipo" |
| 🟩 | `cierre-de-proyecto-checklist` | Cierre de proyecto: el checklist que casi nadie hace | "checklist cierre de proyecto" |
| 🟩 | `gestionar-proyectos-con-clientes` | Proyectos con clientes externos | "gestionar proyectos con clientes" |
| 🟩 | `reducir-trabajo-en-curso` | Por qué tu equipo entrega poco: demasiado trabajo empezado | "reducir trabajo en curso", "WIP alto equipo" |

## Cluster 4 — Plantillas y herramientas

*Pilar: `plantillas-gestion-proyectos`*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| 🟩 | `plantillas-gestion-proyectos` | **PILAR** — Las 8 plantillas de gestión de proyectos que sí se usan | "plantillas gestión de proyectos" |
| 🟩 | `plantilla-plan-de-proyecto` | Plantilla de plan de proyecto y cómo llenarla | "plantilla plan de proyecto" |
| 🟩 | `acta-constitucion-proyecto` | Acta de constitución (project charter): plantilla | "acta de constitución de proyecto", "project charter" |
| 🟩 | `informe-de-estado-semanal` | Informe de estado semanal en 5 líneas | "informe de estado de proyecto" |
| 🟩 | `gestion-proyectos-excel` | Gestión de proyectos en Excel: cuándo alcanza y cuándo no | "gestión de proyectos excel" |
| 🟩 | `herramientas-gestion-proyectos-gratis` | Herramientas gratis de gestión de proyectos | "herramientas gratis gestión de proyectos" |
| 🟩 | `kickoff-de-proyecto` | Kickoff de proyecto: agenda, plantilla y errores | "kickoff de proyecto" |
| 🟩 | `wbs-estructura-desglose-trabajo` | WBS: estructura de desglose de trabajo, con ejemplo | "WBS", "estructura de desglose de trabajo" |
| 🟩 | `plantilla-cronograma-proyecto` | Plantilla de cronograma de proyecto (sin Gantt eterno) | "cronograma de proyecto", "plantilla cronograma" |

*(Los satélites existentes `hito-vs-trello`, `alternativas-a-notion`, `migrar-trello-a-hito`,
`hito-vs-clickup` y `hito-para-estudio-juridico` — categoría `comparativas`/`implementacion` —
quedan enlazados a este pilar.)*

## Cluster 5 — Por rol

*Sin pilar propio — enlazan a los cuatro pilares anteriores según el tema que toquen.*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| 🟩 | `gestion-proyectos-freelancers` | Gestión de proyectos para freelancers | "gestión de proyectos para freelancers" |
| 🟩 | `gestion-proyectos-agencias` | Gestión de proyectos para agencias y estudios | "gestión de proyectos agencias" |

## Cluster 6 — Control y métricas

*Pilar: `kpis-gestion-proyectos`. Temas validados con demanda de búsqueda (spec 068).*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| 🟩 | `kpis-gestion-proyectos` | **PILAR** — KPIs de gestión de proyectos: los que sí importan | "kpi gestión de proyectos", "indicadores de un proyecto" |
| 🟩 | `diagrama-de-gantt` | Diagrama de Gantt: qué es, cómo hacerlo y cuándo sobra | "diagrama de gantt", "diagrama de gantt para qué sirve", "gantt ejemplo" |
| 🟩 | `burndown-chart` | Burndown chart: qué es y cómo leerlo (sin jerga) | "burndown chart", "burndown scrum que es", "burndown vs burnup" |
| 🟩 | `lecciones-aprendidas-proyecto` | Lecciones aprendidas de un proyecto: formato y ejemplo | "lecciones aprendidas de un proyecto", "lecciones aprendidas ejemplo", "formato" |

## Cluster 7 — Stakeholders y equipo

*Pilar: `que-son-stakeholders`.*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| 🟩 | `que-son-stakeholders` | **PILAR** — Stakeholders: qué son y cómo gestionarlos en un proyecto | "que son stakeholders", "stakeholders en un proyecto", "stakeholders ejemplos" |
| 🟩 | `matriz-de-stakeholders` | Matriz de stakeholders: plantilla poder-interés con ejemplo | "matriz de stakeholders", "matriz stakeholders plantilla", "poder interés" |
| 🟩 | `gestion-de-recursos-proyecto` | Gestión de recursos en proyectos: asignar sin sobrecargar | "gestión de recursos en proyectos", "asignación de recursos", "sobrecarga equipo" |
| 🟩 | `que-hace-un-project-manager` | Qué hace un project manager: el rol, sin humo | "que hace un project manager", "rol project manager", "project manager vs product manager" |

## Cluster 8 — Dinero del proyecto

*Pilar: `presupuesto-de-proyecto`. Gap de cobertura total: el blog no tenía ni un artículo de costos.*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| 🟩 | `presupuesto-de-proyecto` | **PILAR** — Presupuesto de un proyecto: cómo armarlo y controlarlo | "presupuesto de un proyecto", "cómo hacer un presupuesto de proyecto" |
| 🟩 | `costos-directos-e-indirectos` | Costos directos e indirectos de un proyecto (con ejemplos) | "costos directos e indirectos", "costos directos ejemplos" |
| 🟩 | `valor-ganado-evm` | Valor ganado (EVM): si tu proyecto va bien, en 3 números | "valor ganado", "evm", "cpi spi", "valor ganado fórmula" |
| 🟩 | `sobrecosto-de-proyecto` | Sobrecosto en proyectos: 7 causas y cómo frenarlo | "sobrecosto", "desviación de costos proyecto", "costos de un proyecto" |

---

## Progreso

- **Fase 1 (2026-07-31, spec 040):** 6 artículos publicados — el pilar de Fundamentos completo
  (`gestion-de-proyectos-guia-completa`) + 4 satélites del mismo cluster + `scrum-vs-kanban` adelantado
  del cluster 2 (cuelga del pilar de Fundamentos hasta que exista el propio).
- **Fase 2 (2026-08-03):** 6 artículos publicados — Completado Cluster 1 de Fundamentos (3 artículos adicionales)
  + iniciado Cluster 2 de Metodologías con su pilar y 2 satélites.
- **Fase 3 (2026-08-04):** 6 artículos publicados —
  - **Cluster 2 cerrado** (4): `sprint-planning-como-hacerlo` (2027-01-04), `daily-standup-util`
    (2027-01-11), `retrospectivas-formatos` (2027-01-18), `waterfall-vs-agile` (2027-01-25, featured).
  - **Cluster 3 abierto** (2): pilar `gestionar-varios-proyectos-a-la-vez` (2027-02-01, featured) +
    `proyecto-atrasado-que-hacer` (2027-02-08).
  - Interlinking: `related` del pilar de metodologías y de `que-es-scrum` actualizado; dead link
    `waterfall-vs-agile` del cuerpo del pilar resuelto.
- **Fase 4 (2026-08-10):** 6 artículos publicados — **Cluster 3 cerrado** (completo, 8/8):
  `reuniones-de-status-eliminar` (2027-02-15), `reducir-trabajo-en-curso` (2027-02-22),
  `como-delegar-tareas` (2027-03-01), `seguimiento-de-tareas-equipo` (2027-03-08),
  `cierre-de-proyecto-checklist` (2027-03-15), `gestionar-proyectos-con-clientes` (2027-03-22).
  Interlinking: dead links del cuerpo del pilar (`gestionar-varios-proyectos-a-la-vez`) hacia
  "reuniones de status" y "delegar decisiones RACI" resueltos; `reducir-trabajo-en-curso` sumado
  al `related` de `kanban-limites-wip`.
- **Fase 5 (2026-08-24, spec 058 Lotes 3–4):** 12 artículos publicados —
  - **Cluster 4 cerrado** (9): pilar `plantillas-gestion-proyectos` (2027-04-12, featured) +
    5 satélites del roadmap original + 3 satélites extra que completan las 8 plantillas del
    pilar (`kickoff-de-proyecto`, `wbs-estructura-desglose-trabajo`,
    `plantilla-cronograma-proyecto`).
  - **Cluster 5 cerrado** (2): `gestion-proyectos-freelancers` (2027-06-14),
    `gestion-proyectos-agencias` (2027-06-21).
  - **Mini-cluster MCP cerrado:** `servidores-mcp-para-que-sirven` (2027-06-28).
  - Interlinking: `related` de comparativas (`hito-vs-trello`, `alternativas-a-notion`,
    `migrar-trello-a-hito`, `hito-vs-clickup`, `hito-para-estudio-juridico`) hacia el pilar
    de plantillas; `que-es-mcp` y sus satélites hacia el cierre MCP.
- **Fase 6 (2026-08-29, spec 068):** 12 artículos publicados — 3 clusters nuevos detectados por
  demanda de búsqueda (autocomplete de Google) y gaps de cobertura:
  - **Cluster 6 — Control y métricas (4):** pilar `kpis-gestion-proyectos` (2027-07-05, featured) +
    `diagrama-de-gantt`, `burndown-chart`, `lecciones-aprendidas-proyecto`.
  - **Cluster 7 — Stakeholders y equipo (4):** pilar `que-son-stakeholders` (2027-08-02, featured) +
    `matriz-de-stakeholders`, `gestion-de-recursos-proyecto`, `que-hace-un-project-manager`.
  - **Cluster 8 — Dinero del proyecto (4):** pilar `presupuesto-de-proyecto` (2027-08-30, featured) +
    `costos-directos-e-indirectos`, `valor-ganado-evm`, `sobrecosto-de-proyecto`.
  - Interlinking: `plantilla-cronograma-proyecto` ↔ `diagrama-de-gantt` (related recíproco) y
    `cierre-de-proyecto-checklist` ↔ `lecciones-aprendidas-proyecto`.
- **Siguiente:** el roadmap de 68 artículos está completo. Medir en Search Console 4–6 semanas
  después de indexar cada cluster; si aparece un export nuevo de GSC, priorizar mejoras Track A
  sobre estos 12.

## Cadencia

Un artículo semanal aproximadamente (ver `publishedAt` en `articles-index.ts`), priorizando terminar
un cluster (incluido su pilar) antes de saltar al siguiente — un pilar sin satélites no compite tan
bien como un cluster completo.

### Calendario editorial Fase 3

| `publishedAt` | Slug |
|---|---|
| 2027-01-04 | `sprint-planning-como-hacerlo` |
| 2027-01-11 | `daily-standup-util` |
| 2027-01-18 | `retrospectivas-formatos` |
| 2027-01-25 | `waterfall-vs-agile` |
| 2027-02-01 | `gestionar-varios-proyectos-a-la-vez` |
| 2027-02-08 | `proyecto-atrasado-que-hacer` |

### Calendario editorial Fase 4

| `publishedAt` | Slug |
|---|---|
| 2027-02-15 | `reuniones-de-status-eliminar` |
| 2027-02-22 | `reducir-trabajo-en-curso` |
| 2027-03-01 | `como-delegar-tareas` |
| 2027-03-08 | `seguimiento-de-tareas-equipo` |
| 2027-03-15 | `cierre-de-proyecto-checklist` |
| 2027-03-22 | `gestionar-proyectos-con-clientes` |

### Calendario editorial Fase 5

| `publishedAt` | Slug |
|---|---|
| 2027-04-12 | `plantillas-gestion-proyectos` |
| 2027-04-19 | `plantilla-plan-de-proyecto` |
| 2027-04-26 | `acta-constitucion-proyecto` |
| 2027-05-03 | `informe-de-estado-semanal` |
| 2027-05-10 | `gestion-proyectos-excel` |
| 2027-05-17 | `herramientas-gestion-proyectos-gratis` |
| 2027-05-24 | `kickoff-de-proyecto` |
| 2027-05-31 | `wbs-estructura-desglose-trabajo` |
| 2027-06-07 | `plantilla-cronograma-proyecto` |
| 2027-06-14 | `gestion-proyectos-freelancers` |
| 2027-06-21 | `gestion-proyectos-agencias` |
| 2027-06-28 | `servidores-mcp-para-que-sirven` |

### Calendario editorial Fase 6

| `publishedAt` | Slug |
|---|---|
| 2027-07-05 | `kpis-gestion-proyectos` |
| 2027-07-12 | `diagrama-de-gantt` |
| 2027-07-19 | `burndown-chart` |
| 2027-07-26 | `lecciones-aprendidas-proyecto` |
| 2027-08-02 | `que-son-stakeholders` |
| 2027-08-09 | `matriz-de-stakeholders` |
| 2027-08-16 | `gestion-de-recursos-proyecto` |
| 2027-08-23 | `que-hace-un-project-manager` |
| 2027-08-30 | `presupuesto-de-proyecto` |
| 2027-09-06 | `costos-directos-e-indirectos` |
| 2027-09-13 | `valor-ganado-evm` |
| 2027-09-20 | `sobrecosto-de-proyecto` |
