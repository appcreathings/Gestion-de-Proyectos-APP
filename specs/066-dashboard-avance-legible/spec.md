# Spec 066 — Dashboard: avance legible y listas con «ver más»

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/066-dashboard-avance-legible/` · Fecha: 2026-08-24
> Baseline: `SCHEMA_VERSION` **23, sin bump** (solo UI + agregación pura)
> Depende de: Spec 063 (drill-down, IMPLEMENTADO), Overview dual (`ProgressRow` + `ProgressStat`), tokens 065
> No incluye: Spec 017 HU-15 / roadmap `dashboard-trends` (historial 30 días)
> Principios: **IV** (diseño limpio y enfocado), **V** (simplicidad), **VI** (accesibilidad)
> Copy UI: Rioplatense **tuteo** (vos)
> Brainstorming: corte de hoy (no tendencias); métrica dual; «ver más» en todas las listas largas; Layout A; barras nativas

## 1. Contexto

El dashboard (`/app`, `DashboardPage` + `computePortfolio`) es un **corte del presente**. Spec 063 ya hizo que cada KPI abra la lista que representa. Quedan tres problemas de lectura:

| Superficie | Hoy | Problema |
|------------|-----|----------|
| Tile «Avance medio» | media de `projectChecklistProgress(p).pct` sobre abiertos | Promedio de promedios, sin denominador. 1 ítem al 100 % empata a 99 al 0 %. |
| Avance por proyecto | no existe | Solo `ProductRollup.avgProgress` como texto. Overview sí muestra dual (checklists + tareas). |
| Estado | `<Progress value={count/total}>` | `Progress` tiene `role="progressbar"`: se lee como *completion*, es *composición*. |
| Salud RAG | barra apilada + conteos | No hay frase scaneable. |
| Vencidos / por vencer / estancados / carga | listan **todas** las filas | Sin tope de scan. DueCard anida `lg:grid-cols-2` dentro de otro 2-col → fechas a ~¼ de ancho. |
| Carga | cuenta toda tarea con `assigneeId` en abiertos | Incluye hechas y archivadas. Mis tareas (061) las oculta. |

No hay librería de charts. Overview ya pinta barras nativas. HU-15 (tendencias) sigue en el roadmap: este spec **no** la adelanta.

## 2. Objetivo

Que en 5 segundos se lea **cuánto falta** (portafolio y por proyecto) y **qué hay que atender**, sin salir de `/app`:

- Avance dual ponderado (`done/total · pct%`, checklists **y** tareas).
- Ranking de proyectos abiertos (RAG + trabajo restante) con click al proyecto.
- Listas largas recortadas a 5 + «Ver N más» in situ.
- Tiles de atención (se va el vanity «Avance medio»; entra «Por vencer»).
- Mapa de clicks 063 intacto.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Snapshot de **hoy**. Cero persistencia de series. HU-15 fuera. | Inventar historial implica schema. YAGNI. |
| **D2** | Métrica **dual** (checklists y tareas). Si `total === 0`, **se omite esa barra**. | Labels como Overview. Datos de tareas = live (D18). Overview **sí** pinta 0/0; el dashboard no. |
| **D3** | «Ver más» en **todas** las listas largas, expandir in situ (sin modal, sin navegación). | El dump de filas es el segundo dolor. |
| **D4** | **Layout A.** Orden DOM: tiles → hero → ranking → atención (fechas, estancados, carga) → secundaria (salud, estado) → producto ancho completo. | B (insertar panel) no reordena. C (dos columnas) parte el scan en mobile. |
| **D5** | Barras nativas (`Progress` + `div` CSS). **Cero** librería de charts. | No hay Recharts. Overview y 065 ya pintan nativo. |
| **D6** | Se **elimina** el tile «Avance medio». 4.º tile = **Por vencer**. Orden: Activos · Vencidos · Por vencer · Estancados. | El % vive en el hero con denominador. «Por vencer» es atención accionable (`stats.dueSoon` ya existe). |
| **D7** | Mapa 063 intacto. Por vencer **también** → `#vencimientos`. El hero **no es link**. | Un click, una lista. Un ancla, un scroll. |
| **D8** | Avance **ponderado**: `aggregateChecklistProgress(open)` + `aggregateTaskProgress(open)`. Se **elimina** `PortfolioStats.avgProgress`. | Un ítem al 100 % no vale lo mismo que 99 al 0 %. |
| **D9** | `ExpandableList`: inicial **5**. `n ≤ 5` sin botón. `n > 5` → «Ver N más» (`N = n − 5`) / «Ver menos». No persistido. Aplica a ranking, vencidos, por vencer, estancados, carga, productos. **No** a salud ni estado. | Tope de scan. Salud/estado son enumeraciones fijas. |
| **D10** | Workload: `assigneeId` **y** `status !== "done"` **y** `!archived`. | Alinea con Mis tareas 061. Una persona solo con archivadas no aparece. |
| **D11** | Ranking: solo abiertos. Sort `red → amber → green`, tie-break más `remainingWork`, luego `localeCompare(name, "es", { sensitivity: "base" })`. Triple empate → `0` (sort estable). Click → `ROUTES.project(id)`. | Atención primero. Tests deterministas. |
| **D12** | `StatusCard` **deja de usar** `Progress`. Composición = barra apilada (sin `role="progressbar"`) + «8 de 20». | `Progress` comunica completion. |
| **D13** | Salud: barra existente **decorativa** (`aria-hidden`) + frase en `<p>` `3 en rojo · 2 ámbar · 8 verdes` (ceros incluidos; pluraliza solo verde/verdes). Filas 063 se quedan. | Labels on-bar en 8 px son ilegibles. |
| **D14** | Se **desanida** DueCard. Atención: Vencidos \| Por vencer, debajo Estancados \| Carga. Wrapper `#vencimientos`. Ambas vacías = Panel único de hoy + `CheckCircle2`. Una vacía + hermana con filas = frase muted, **sin** icono. | El grid anidado aplasta fechas a ¼. |
| **D15** | Producto: dots RAG 063 + **una** mini-barra (checklists si `total > 0`; si no, tareas; si ambas 0, sin barra). Se quita `· N% avance`. «Sin producto» no enlaza. | Dual vive en hero/ranking. |
| **D16** | Sin rutas nuevas. Sin bump de schema (sigue 23). Copy tuteo. | Nada que migrar. |
| **D17** | `PortfolioStats` reemplaza `avgProgress` por `checklistProgress` + `taskProgress` (`ProgressStat`) y añade `projectRows`. `ProductRollup` igual. | Un solo tipo de avance. |
| **D18** | Nuevo `projectLiveTaskProgress`: como `projectTaskProgress` pero **excluye** `t.archived`. `aggregateTaskProgress` agrega *esa*. Overview e informe de **proyecto** siguen en `projectTaskProgress`. | Ranking/hero no pueden heredar el denominador de Overview. |
| **D19** | Extraer `ProgressRow` de Overview **sin cambiar Overview**. El hero omite `total === 0`. No hay `ProgressMeter`. | Reusa `Progress`. |
| **D20** | `dashboardHrefs.dueSoonAnchor()` ≡ `overdueAnchor()` → `/app#vencimientos`. No hay `#por-vencer`. | DueCard ya tiene ambas secciones. |
| **D21** | `remainingWork` usa checklists + **live** tasks. Archivada incompleta no suma. Las barras del ranking pintan el mismo `ProgressStat`. | Una definición de “falta trabajo”. |
| **D22** | Informe 052 y tool IA se actualizan en el PR de dominio. DTO de informe **conserva** `totals.avgProgress` = `checklistProgress.pct` ponderado. Markdown dual, **omite** línea si `total === 0`. Tool: `avgChecklistProgressPct` ponderado + `ProgressStat`s; `byProduct.avgProgress` alias ponderado. | 052 exige dashboard ↔ informe. No romper payload del tool. |
| **D23** | `ExpandableList` en `src/components/ExpandableList.tsx`. Helpers puros testeables. Sin RTL de páginas (criterio 063). | El recuento sí es unitario. |
| **D24** | Sin feature flags. Rollout = merge. Rollback = revert. | Local-first. |
| **D25** | Carga vacía: «No hay tareas abiertas asignadas.» | Tras D10 el empty es “nadie tiene trabajo vivo pendiente”. |
| **D26** | `stats.stalled` sale de `computePortfolio` **ya ordenado** por `updatedAt` asc. `StalledCard` no re-ordena. Truncar **después**. | Si se trunca antes, «Ver N más» esconde a los más estancados. |

Cero preguntas abiertas.

## 4. Mapa de clicks (normativo)

| Origen | Destino |
|--------|---------|
| Tile Proyectos activos | `/app/projects?status=active` (063) |
| Tile Vencidos | `/app#vencimientos` (063) |
| Tile Por vencer | `/app#vencimientos` (D20) |
| Tile Estancados | `/app/projects?stalled=1` (063) |
| Hero de avance | — (no link) |
| Fila ranking | `/app/projects/:id` |
| Fila salud / estado / producto | igual 063 |
| Fila estancado | `/app/projects/:id` (sin cambio) |
| Fila vencimiento | proyecto + `tab`/`focus` (sin cambio) |
| Nombre en carga | `/app/my-tasks?person=<id>` sin `done=1` (063) |
| «Ver N más» / «Ver menos» | no navega |

Tiles con 0 **sí** enlazan (063 D9).

## 5. Historias de usuario

### HU-01 — Tiles de atención

**Como** PM, **quiero** Activos / Vencidos / Por vencer / Estancados **para** saltar a la lista que cada número representa.

- **CA-01.1** Exactamente 4 tiles, en este orden: «Proyectos activos» (`stats.byStatus.active`, `FolderKanban`, `tone="default"`) · «Vencidos» (`overdue.length`, `AlertTriangle`, `destructive`) · «Por vencer» (`dueSoon.length`, `CalendarClock`, `warning`) · «Estancados» (`stalled.length`, `Hourglass`, `warning`).
- **CA-01.2** No existe el tile «Avance medio» ni el icono `Gauge` en el dashboard.
- **CA-01.3** Activos → `dashboardHrefs.activeProjects()`.
- **CA-01.4** Estancados → `dashboardHrefs.stalledProjects()`.
- **CA-01.5** Vencidos **y** Por vencer → `overdueAnchor()` / `dueSoonAnchor()` = `/app#vencimientos`. Tiles en 0 sí enlazan. `ScrollToHash` ya está montado.
- **CA-01.6** El hero no es `<Link>` ni tiene `cursor-pointer`.

### HU-02 — Hero de avance dual y ponderado

- **CA-02.1** `stats.checklistProgress` ≡ `aggregateChecklistProgress(open)`. `stats.taskProgress` ≡ `aggregateTaskProgress(open)` (live, sin archivadas). `open` = no done/archivado. El dashboard **no** usa `projectTaskProgress`.
- **CA-02.2** Antivanity: A 1/1, B 0/99 → ponderado **1/100 · 1 %**, no ~50 %.
- **CA-02.3** Si `checklistProgress.total > 0`: `ProgressRow` «Avance de checklists», `{done}/{total} · {pct}%`. Si `total === 0`, no se pinta.
- **CA-02.4** Si `taskProgress.total > 0`: «Tareas completadas» con `indicatorClassName="bg-success"`. Si `total === 0`, se omite.
- **CA-02.5** Si ambas `total === 0`: «Todavía no hay checklists ni tareas en los proyectos abiertos.» si `stats.active > 0`; «No hay proyectos abiertos.» si `stats.active === 0`. El hero mira **`stats.active` (abiertos)**, nunca `byStatus.active`.
- **CA-02.6** `Panel` `label="Avance"` `title="Avance del portafolio"`, ancho completo, debajo de tiles, encima del ranking.

### HU-03 — Ranking por proyecto

- **CA-03.1** `projectRows`: un row por abierto. Sin done/archivados.
- **CA-03.2** Orden: red < amber < green; a igual salud, `remainingWork` desc; a igual remaining, `localeCompare(..., "es", { sensitivity: "base" })`. Triple empate → comparator `0`.
- **CA-03.3** `remainingWork` = checklists restantes + live tasks restantes. Archivadas no entran. Las barras pintan esos mismos `ProgressStat`.
- **CA-03.4** Cada fila es `Link` a `ROUTES.project(id)` con `cn(ROW_LINK_CLASS, "flex-col items-stretch sm:flex-row sm:items-center")`. `HealthDot` + nombre + metros compactos (omitir `total === 0`). `title` en el **wrapper**, no en `Progress`. `%` con `min-w-[2.25rem] tabular-nums`.
- **CA-03.5** Cero rows: «No hay proyectos abiertos.»
- **CA-03.6** Si `length > 5`, `ExpandableList`. `Panel` `label="Proyectos"` `title="Avance por proyecto"`, full width.

### HU-04 — «Ver más» in situ

- **CA-04.1** `expandableRemaining(n) = max(0, n - 5)`. `(5) === 0`, `(6) === 1`, `(12) === 7`.
- **CA-04.2** `n ≤ 5`: no hay botón.
- **CA-04.3** Colapsado: «Ver {n-5} más». Expandido: todas las filas + «Ver menos».
- **CA-04.4** Botón `type="button"` **después** del `<ul>`. `aria-expanded`, `aria-controls` (`useId` interno). Truncar **después** de ordenar.
- **CA-04.5** Estado no persistido (ni URL ni storage). Recalcular stats remonta y vuelve a 5 — aceptable.
- **CA-04.6** Superficies: ranking, vencidos, por vencer, estancados, carga, producto. **No** salud ni estado.
- **CA-04.7** `StalledCard` no re-sort. Las 5 visibles son las más estancadas (`updatedAt` más viejo).
- **CA-04.8** `maxTasks` de carga se calcula sobre el array **completo**. Expandir no cambia anchos.

### HU-05 — Carga honesta

- **CA-05.1** 2 todo + 1 done (ninguna archivada) → `taskCount === 2`. Estimate solo de las vivas no hechas.
- **CA-05.2** Solo hechas **o** solo archivadas → no aparece. Empty: «No hay tareas abiertas asignadas.»
- **CA-05.3** Nombre → `personTasks(id)` sin `done=1` si el id está en `people`. «Persona eliminada» no es link.
- **CA-05.4** Sort `taskCount` desc (igual que hoy).
- **CA-05.5** `archived: true` + `status: "todo"` **no** suma. Si es la única asignación de Ana, Ana no está en `workload`.

### HU-06 — Cards secundarias

- **CA-06.1** Salud: barra `aria-hidden` + `<p>` con `healthSentence` + filas 063. **No** `role="img"` en la barra de salud.
- **CA-06.2** Estado: **cero** `<Progress>`. Barra `role="img"` + `aria-label` de segmentos no nulos + filas `{label}` / `{count} de {total}`. Links 063 si count > 0.
- **CA-06.3** Producto: `{n} proyecto(s)` **sin** `· N% avance`. Mini `Progress` D15. `title` en wrapper. «Sin producto» no enlaza.

### HU-07 — Layout, vacío, responsive

- **CA-07.1** `projects.length === 0`: empty actual **sin cambios**.
- **CA-07.2** Con proyectos, orden DOM: `PageHeader` → tiles → hero → ranking → atención (Vencidos, Por vencer, Estancados, Carga) → secundaria (Salud, Estado) → Producto.
- **CA-07.3** Tiles: `sm:grid-cols-2 lg:grid-cols-4`. Hero y ranking full. Atención y secundaria: `lg:grid-cols-2`. Producto full debajo.
- **CA-07.4** Copy vacío de fechas: «No hay fechas vencidas.» / «No hay próximos vencimientos.» Ambas vacías = Panel único de hoy + `CheckCircle2` + «No hay fechas vencidas ni próximos vencimientos.» Una con filas: las **dos** `DueSection`; la vacía es frase muted, **sin** icono (`DueSection` no retorna `null`).
- **CA-07.5** Wrapper del bloque de fechas con `id="vencimientos"` `scroll-mt-6`. **Prohibido** `display: contents`.

### HU-08 — Informe y tool

- **CA-08.1** `buildPortfolioReport` no lee `stats.avgProgress`. `totals.avgProgress` del DTO = `checklistProgress.pct`. Markdown: líneas duales **solo si** `total > 0`. Se elimina `**Avance medio:** N%`. Nada de `0/0 · 0%`.
- **CA-08.2** Columna de producto usa `p.checklistProgress.pct`. Header «Avance» (YAGNI: no añadir columna de tareas al MD).
- **CA-08.3** Tool: `avgChecklistProgressPct` ponderado + `checklistProgress` / `taskProgress`. `byProduct` conserva `avgProgress: checklistProgress.pct` **más** los dos `ProgressStat`. Tests `totalProjects` / `openProjects` siguen verdes.

## 6. Empty states (normativo)

| Superficie | Condición | Copy |
|------------|-----------|------|
| Página | `projects.length === 0` | Empty actual |
| Hero | `active === 0` | «No hay proyectos abiertos.» |
| Hero | `active > 0` y ambas `total === 0` | «Todavía no hay checklists ni tareas en los proyectos abiertos.» |
| Ranking | `projectRows.length === 0` | «No hay proyectos abiertos.» |
| Vencimientos | ambas listas 0 | Panel único + check (hoy) |
| Vencidos (hermana con filas) | overdue 0, dueSoon > 0 | «No hay fechas vencidas.» |
| Por vencer (hermana con filas) | dueSoon 0, overdue > 0 | «No hay próximos vencimientos.» |
| Estancados | 0 | «👌 Todo se mueve.» |
| Carga | 0 | «No hay tareas abiertas asignadas.» |
| Salud / Estado / Producto | sin abiertos | copy actual 063 |

## 7. Fuera de alcance

- Tendencias / historial 30 días (017 HU-15, `dashboard-trends`).
- Recharts u otra lib.
- Layout B y C. Métrica única.
- Nuevas rutas o params en `/app/projects`.
- Bump de `SCHEMA_VERSION`. Snapshots. Feature flags.
- Cambiar `projectTaskProgress` (Overview e informe de proyecto se quedan).
- `workType` en dashboard. Identidad «yo». Demo seed.
- Tests RTL de `DashboardPage`. Persistencia de «Ver más». Hash `#por-vencer`.
- Tile para `stats.active` (abiertos). 063 D13: el tile es `byStatus.active`.

## 8. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| El % ponderado baja vs vanity | Copy con denominador. Test antivanity. No mostrar el número viejo al lado. |
| `display:contents` rompe `#vencimientos` | Prohibido. Wrapper real `col-span-full`. |
| Truncar estancados antes de ordenar | D26: sort en `computePortfolio`. |
| Archivar hechas baja el % del dashboard, no el de Overview | Aceptado (D18). 9 done archivadas + 1 live todo → Overview 9/10, hero 0/1. Sin tooltip de portafolio. |
| `Progress` no acepta `title` | Tooltip en wrapper. No tocar `progress.tsx`. |
| Informe y dashboard divergen | D22: mismo PR de dominio. |
| Extraer `ProgressRow` rompe Overview | Extraer sin cambiar markup. Overview no omite 0/0. |

## 9. Tests mínimos (puros)

Ver `design.md` §10 para fixtures. Resumen:

1. `aggregateTaskProgress` / `projectLiveTaskProgress` (archivada fuera; Overview `projectTaskProgress` intacto).
2. Antivanity: 1/1 + 0/99 → 1/100 · 1 %. `avgProgress` **no existe** en `PortfolioStats`.
3. Ranking: RAG, remaining, `localeCompare` es, remaining **sin** archivadas, done/archivados omitidos.
4. Workload: hechas y archivadas fuera; estimate solo de vivas.
5. `stalled` ordenado por `updatedAt` asc.
6. `healthSentence` plural.
7. `expandableRemaining` / labels.
8. `dueSoonAnchor() === overdueAnchor() === "/app#vencimientos"`.
9. Markdown: no contiene «Avance medio» ni `0/0` en fixture vacío.

## 10. Definición de hecho

- [x] Spec revisado por el usuario
- [x] `design.md` + `tasks.md` + `smoke.md` + `PROMPT-EJECUCION.md`
- [x] Fases A–F en `tasks.md`
- [x] HU-01…HU-08
- [x] Tests §9 verdes
- [x] `typecheck` + suite `--exclude ".worktrees/**"`
- [x] `graphify update .`
- [x] spec.md → **IMPLEMENTADO**
- [x] Smoke `smoke.md` (pasos 1–8 verificados por código/tests; clickeable queda pendiente de browser)

## 11. Documentos

| Archivo | Rol |
|---------|-----|
| `spec.md` | Este documento (autoridad de producto) |
| `design.md` | Archivos, tipos, snippets, layout, wiring |
| `tasks.md` | Fases A–F |
| `smoke.md` | Guion de verificación |
| `PROMPT-EJECUCION.md` | Primer mensaje para una conversación nueva |
