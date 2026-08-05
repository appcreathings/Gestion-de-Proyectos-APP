# Roadmap de blog — 32 artículos de gestión de proyectos (spec 040)

> Nace de una auditoría del blog existente (18 artículos, ver `specs/035-blog-performance-organizacion/`):
> 14 de 18 hablan de Hito/local-first/privacidad — contenido de fondo de embudo. Falta cobertura de
> búsquedas informacionales puras de gestión de proyectos, que es el público que después necesita una
> app como Hito. Este documento planea 32 artículos nuevos en 5 clusters con estructura pilar→satélite,
> y se tacha a medida que se publica.

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
| ⬜ | `reuniones-de-status-eliminar` | Reemplazar reuniones de status por un tablero | "eliminar reuniones de status" |
| ⬜ | `como-delegar-tareas` | Cómo delegar y dejar de ser el cuello de botella | "cómo delegar tareas" |
| ⬜ | `seguimiento-de-tareas-equipo` | Seguimiento de tareas sin microgestionar | "seguimiento de tareas de equipo" |
| ⬜ | `cierre-de-proyecto-checklist` | Cierre de proyecto: el checklist que casi nadie hace | "checklist cierre de proyecto" |
| ⬜ | `gestionar-proyectos-con-clientes` | Proyectos con clientes externos | "gestionar proyectos con clientes" |
| ⬜ | `reducir-trabajo-en-curso` | Por qué tu equipo entrega poco: demasiado trabajo empezado | "reducir trabajo en curso", "WIP alto equipo" |

## Cluster 4 — Plantillas y herramientas

*Pilar: `plantillas-gestion-proyectos`*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| ⬜ | `plantillas-gestion-proyectos` | **PILAR** — Las 8 plantillas de gestión de proyectos que sí se usan | "plantillas gestión de proyectos" |
| ⬜ | `plantilla-plan-de-proyecto` | Plantilla de plan de proyecto y cómo llenarla | "plantilla plan de proyecto" |
| ⬜ | `acta-constitucion-proyecto` | Acta de constitución (project charter): plantilla | "acta de constitución de proyecto", "project charter" |
| ⬜ | `informe-de-estado-semanal` | Informe de estado semanal en 5 líneas | "informe de estado de proyecto" |
| ⬜ | `gestion-proyectos-excel` | Gestión de proyectos en Excel: cuándo alcanza y cuándo no | "gestión de proyectos excel" |
| ⬜ | `herramientas-gestion-proyectos-gratis` | Herramientas gratis de gestión de proyectos | "herramientas gratis gestión de proyectos" |

*(Los satélites existentes `hito-vs-trello`, `alternativas-a-notion`, `migrar-trello-a-hito`,
`hito-vs-clickup` y `hito-para-estudio-juridico` — categoría `comparativas`/`implementacion` — se
enlazarán a este pilar cuando se publique.)*

## Cluster 5 — Por rol

*Sin pilar propio — enlazan a los cuatro pilares anteriores según el tema que toquen.*

| Estado | Slug | Título | Intención de búsqueda |
|---|---|---|---|
| ⬜ | `gestion-proyectos-freelancers` | Gestión de proyectos para freelancers | "gestión de proyectos para freelancers" |
| ⬜ | `gestion-proyectos-agencias` | Gestión de proyectos para agencias y estudios | "gestión de proyectos agencias" |

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
- **Siguiente (Fase 4):** completar Cluster 3 (6 satélites restantes), empezando por
  `reuniones-de-status-eliminar` y `reducir-trabajo-en-curso` (este último ya enlazado desde
  `kanban-limites-wip` en el cuerpo). Luego Cluster 4 (plantillas) con su pilar.

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
