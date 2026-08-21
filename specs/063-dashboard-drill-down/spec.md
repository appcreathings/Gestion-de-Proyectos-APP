# Spec 063 — Dashboard: drill-down a listas filtradas

> Estado: **PROPUESTO**
> Feature dir: `specs/063-dashboard-drill-down/` · Fecha: 2026-08-20
> Baseline: `SCHEMA_VERSION` **sin bump** (solo UI + searchParams)
> Depende de (reusa): Spec 061 (contrato URL de Mis tareas), Spec 017 HU-14 (KPI click, implementado a medias: todo cae en `/app/projects` sin filtro), `computePortfolio` / `effectiveHealth` / `isStalled`.
> Cierra la terna del brainstorm 061: filtros Mis tareas → **hipervínculos del dashboard** → tipos de trabajo (062, ya shipped).
> No incluye tendencias históricas (017 HU-15 / roadmap `dashboard-trends`).
> Principios: **IV** (un click, un listado), **V** (reusar URLs; no una tercera vista de tareas).

## 1. Contexto

El dashboard (`/app`) ya calcula el portafolio (`computePortfolio`) y muestra tiles y cards. El click casi no hace lo que promete 017 HU-14:

| Superficie | Hoy | Problema |
|------------|-----|----------|
| Tile «Proyectos activos» | `Link` a `/app/projects` | No filtra `status=active`. |
| Tile «Avance medio» | sin link | Correcto: es un agregado, no una lista. |
| Tile «Vencidos» | `Link` a `/app/projects` | El número es **entidades con fecha** (tareas, ítems de checklist…), no proyectos. La lista real ya está en la card «Vencimientos». |
| Tile «Estancados» | `Link` a `/app/projects` | `stats.stalled` existe; la lista de proyectos no tiene `?stalled=`. |
| Salud RAG (filas rojo/ámbar/verde) | texto | 017 pedía lista por color. `ProjectsPage` no lee `health`. |
| Distribución por estado | texto | El Select de estado en Proyectos es **estado React**, no URL. |
| Por producto | texto | `?product=` ya existe (`ROUTES.projectsByProduct`) pero las filas no enlazan. |
| Carga de trabajo | texto | 061 dejó el contrato `?person=` para esto. |
| Filas de estancados / vencimientos | ya van al **proyecto** | Se mantienen. |

Mis tareas **exige** `?person=`. Un KPI de portafolio (vencidos globales) no puede caer ahí sin inventar una persona. Por eso este spec parte el grano:

- **Proyecto / salud / estado / estancado / producto** → lista de proyectos con query.
- **Persona** → Mis tareas (061).
- **Fechas urgentes** (tareas e ítems, no proyectos) → ancla en el mismo dashboard, donde ya está la lista.

## 2. Objetivo

Que un click en un KPI o fila del dashboard abra **la lista que ese número representa**, con la URL como fuente de verdad, recargable y compartible.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Destinos según grano (opción «Proyectos con query params»). | Mis tareas no tiene sentido sin persona; vencidos del tile no son proyectos. |
| **D2** | `ProjectsPage`: URL es la fuente de verdad de filtros (`replace: true`), igual que 061 D4. Se **sube** `status` a la URL (hoy es `useState`). | El dashboard no puede deep-linkear un filtro que vive solo en memoria. |
| **D3** | Params nuevos en `/app/projects`: `status`, `health`, `stalled`. `product` y `quarter` se quedan. Combinación = **AND**. | Mismos tokens de dominio; `stalled` no se puede fakear con `health=red` si `deriveHealth` está off. |
| **D4** | `health` usa `effectiveHealth` (manual o derivado), **idéntico** a `computePortfolio`. `stalled=1` usa `isStalled` + `settings.stalledAfterDays`; done/archivados nunca matchean (igual que el dashboard). | Un click no puede mostrar otra población que el número. |
| **D5** | Valores inválidos o desconocidos: se **ignoran** (no filtran, no crashean). `stalled` solo actúa si vale exactamente `1`. | Mismo patrón 061 D15 / 062 D15. |
| **D6** | Tile **Avance medio**: no es link. | No hay lista de «avance». |
| **D7** | Tiles **Vencidos** y el ancla de «Por vencer»: `to="/app#vencimientos"`. La card `DueCard` recibe `id="vencimientos"`. Las **filas** siguen yendo al proyecto (tab/focus actuales). | El conteo mezcla tareas y checklists; 061 no cubre eso. |
| **D8** | Carga de trabajo: el **nombre** de cada persona es `Link` a `/app/my-tasks?person=<id>` (defaults 061: hechas ocultas, vista plana). No se añaden `date` ni `status` salvo que el click sea desde un contexto de fechas (v1: no). | Cierra 061 §10 «Hipervínculos del dashboard». |
| **D9** | Filas de salud / estado / producto son links. Conteo `0` en una fila de salud: **no** se pinta el link (la fila ya se oculta o muestra 0; si `byHealth[h]===0` hoy no se enfatiza — si se lista, el 0 no enlaza). Tiles con 0 **sí** enlazan (lista vacía honesta). | Evita un `/app/projects?health=red` vacío por accidente al clickear un 0 escondido. |
| **D10** | Sin bump de `SCHEMA_VERSION`. Sin tendencias (HU-15). Sin `workType` en el dashboard (062 §10). | YAGNI. |
| **D11** | Copy en tuteo. Helper de hrefs puro y testeable (`dashboardHrefs` o equivalente) para no esparcir strings. | Consistencia 061. |
| **D12** | El Select de producto/estado en `ProjectsPage` **escribe** la URL (hoy el de producto actualiza estado local y se desincroniza al recargar). Vista lista/trimestre/producto no es param de este spec (el `quarter` ya fuerza vista trimestre). | Un deep-link `?status=active` tiene que verse en el Select. |
| **D13** | El tile «Proyectos activos» muestra `byStatus.active` (enum `status === "active"`), **no** `stats.active` actual (`open.length` = todo lo no done/archivado). Destino `?status=active`. | D4: el número y la lista tienen que ser la misma población. `stats.active` (abiertos) sigue usándose en salud/producto/carga; no tiene tile propio. |
| **D14** | Con `health` presente, se excluyen `done` y `archived` (igual que `byHealth` en `computePortfolio`). `status` exacto no excluye nada extra. `product` no recorta por abierto (contrato ya usado desde Productos). | Salud del dashboard solo cuenta abiertos; un done con `health: "red"` manual no puede inflar la lista. |
| **D15** | Filtros sin Select (`health`, `stalled`) se muestran como **chips** quitables. `quarter` no entra en `filterProjectsByQuery` (sigue siendo vista + highlight). | Un `?health=red` sin chip es un filtro invisible. |

## 4. Contrato de URL — `/app/projects`

| Param | Ausente | Valores válidos | Semántica |
|-------|---------|-----------------|-----------|
| `product` | todos | id de producto | Ya existe. Id desconocido (no está en `products`): **se ignora**, no filtra. |
| `quarter` | todos | id de trimestre | Ya existe; además abre vista «Por trimestre». |
| `status` | todos | `backlog` \| `active` \| `paused` \| `blocked` \| `done` \| `archived` | Misma enum que el Select. |
| `health` | todos | `red` \| `amber` \| `green` | `effectiveHealth`. |
| `stalled` | no filtrar por estancamiento | `1` | Solo proyectos que `isStalled` daría true. |

AND entre params. Un proyecto `done` puede aparecer con `status=done` pero **nunca** con `stalled=1`.

No se inventa `date=` en esta ruta: las fechas urgentes no son un atributo de proyecto.

## 5. Mapa de clicks (normativo)

| Origen | Destino |
|--------|---------|
| Tile Proyectos activos | `/app/projects?status=active` |
| Tile Avance medio | — (no link) |
| Tile Vencidos | `/app#vencimientos` |
| Tile Estancados | `/app/projects?stalled=1` |
| Fila salud (count > 0) | `/app/projects?health=<red\|amber\|green>` |
| Fila estado (count > 0) | `/app/projects?status=<status>` |
| Fila producto | `/app/projects?product=<id>` ; «sin producto» → `product` ausente + opcional no se filtra (v1: fila «sin producto» **no** enlaza, o `product=` vacío no filtra — **no enlaza**, para no perder el resto). |
| Fila estancado (card) | `/app/projects/:id` (sin cambio) |
| Fila vencimiento (card) | proyecto + `tab`/`focus` (sin cambio) |
| Nombre en carga de trabajo | `/app/my-tasks?person=<id>` |

`id="estancados"` en la card de estancados **no** es destino de tile (el tile va a la lista de proyectos). Sirve si más adelante se quiere ancla; no es CA.

## 6. Historias de usuario

### HU-01 — Tiles de portafolio

**Como** PM, **quiero** clickear Activos / Estancados **para** ver exactamente esos proyectos.

- **CA-01.1** «Proyectos activos» muestra el conteo `byStatus.active` y navega a `/app/projects?status=active`. El Select de estado muestra Activo; la grilla no incluye backlog/paused/etc.
- **CA-01.2** «Estancados» navega a `?stalled=1`. La lista coincide con `stats.stalled` (mismos ids) a igual `now` y settings.
- **CA-01.3** «Vencidos» no sale de `/app`; el scroll/hash muestra `#vencimientos`.
- **CA-01.4** «Avance medio» no es un enlace (ni `cursor-pointer` engañoso).
- **CA-01.5** Recargar `/app/projects?status=active&stalled=1` conserva ambos filtros.

### HU-02 — Salud y estado

- **CA-02.1** Click en la fila «En rojo» (si count > 0) → `?health=red`. Los proyectos listados tienen `effectiveHealth === "red"`.
- **CA-02.2** Click en «Activo» (u otro estado con count > 0) → `?status=` correspondiente. El label es `projectStatusLabel`.
- **CA-02.3** `?health=purple` (basura) no filtra.

### HU-03 — Producto y carga

- **CA-03.1** Click en un producto con id → `/app/projects?product=<id>` (el Select de producto queda en ese valor).
- **CA-03.2** Click en el nombre de una persona en Carga → `/app/my-tasks?person=<id>`. Sin `done=1`; hechas ocultas (061 D1). Si `personId` no está en `people` («Persona eliminada»), el nombre **no** es link.
- **CA-03.3** Persona sin tareas no aparece en la card (hoy ya); no hay link huérfano.

### HU-04 — Proyectos: URL ↔ controles

- **CA-04.1** Cambiar el Select de estado escribe `status` (o lo borra si «Todos») con `replace: true`.
- **CA-04.2** Cambiar el Select de producto escribe `product` igual.
- **CA-04.3** No hay Select de salud ni de estancados. Si `health` o `stalled=1` están activos, se muestra un chip quitable (`healthLabel` · Estancados) que borra **solo** ese param.
- **CA-04.4** Función pura `filterProjectsByQuery(projects, query, settings, now, productIds)` cubre status, health, stalled, product. Tests unitarios.
- **CA-04.5** Lista plana con filtros y cero coincidencias: mensaje «Ningún proyecto coincide con los filtros actuales.» (el agrupado ya lo tiene).

## 7. Fuera de alcance

- Gráficos de tendencias / historial 30 días (017 HU-15).
- Filtro `workType` en dashboard o en Proyectos.
- Deep-link `detail` / drawer desde el dashboard (las filas de fecha ya usan `focus`).
- Identidad «yo» para Mis tareas.
- Convertir vencidos del tile en lista global de tareas (requeriría una vista nueva o relajar `person` en 061).
- Filtro `date` en `/app/projects`.
- Cambiar `StatTile` a botón; se envuelve en `Link`.
- Bump de schema, demo seed, Daily, calendario.

## 8. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| `health=red` ≠ `stalled=1` con salud manual | D3/D4: dos params; el tile Estancados usa stalled, las filas RAG usan health. |
| Select de estado y URL pelean con `useState` inicial `""` | Eliminar el estado paralelo; leer/escribir `searchParams` (061). |
| Hash `#vencimientos` lo come el layout / scroll-mt | `id` + `scroll-mt-6` como Settings `#uso` (060). |
| Link alrededor de `StatTile` (div) | `Link` `className="block"` como el tile Activos hoy; no anidar `<a>`. |
| `filter` de proyectos archivados en `stalled` | `isStalled` ya excluye done/archived. |
| Tile «Activos» hoy cuenta abiertos, no `status=active` | D13: el número pasa a `byStatus.active`. |
| `?health=red` sin chip es filtro invisible | D15: chip quitable. |
| Carga cuenta tareas hechas; Mis tareas las oculta | Aceptado (061 D1). No se cambia `computePortfolio.workload` en este spec. |

## 9. Tests mínimos (puros)

`filterProjectsByQuery` + parse de query:

1. `status=active` deja solo active.
2. `stalled=1` coincide con `isStalled`; un done viejo no entra.
3. `health=red` con `deriveHealth=false` usa `project.health`; un done `health: "red"` **no** entra.
4. `health=red` con `deriveHealth=true` usa `deriveHealth()`.
5. AND: `status=active&health=green` recorta ambos.
6. `stalled=yes` (basura) ≡ ausente.
7. `product` desconocido no recorta.
8. Helper de hrefs: tile estancados → `stalled=1`; workload → my-tasks con person; tile activos → `status=active`.

## 10. Definición de hecho

- [ ] Spec revisado por el usuario
- [ ] HU-01…HU-04
- [ ] Tests §9 verdes
- [ ] `typecheck` + suite
- [ ] Smoke: click Activos / Estancados / Rojo / persona; recargar URL; hash vencimientos

## 11. Documentos

| Archivo | Rol |
|---------|-----|
| `spec.md` | Este documento |
| `design.md` | Archivos, parse de query, chips, hrefs |
| `tasks.md` | Fases A–D |
| `smoke.md` | Guion de verificación |
| `PROMPT-EJECUCION.md` | Primer mensaje para una conversación nueva |
