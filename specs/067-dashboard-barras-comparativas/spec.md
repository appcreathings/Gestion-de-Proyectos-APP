# Spec 067 — Dashboard: barras comparativas (trabajo restante y carga)

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/067-dashboard-barras-comparativas/` · Fecha: 2026-08-24
> Baseline: `SCHEMA_VERSION` **23, sin bump**. Spec 066 **IMPLEMENTADO**.
> Depende de: 066 (`projectRows.remainingWork`, `ExpandableList`, `WorkloadCard.maxTasks` del array completo)
> No incluye: librería de charts, HU-15 tendencias, tortas/gauges, graficar vencidos
> Principios: **IV**, **V**, **VI**
> Copy UI: tuteo
> Brainstorming: las barras nativas de 066 están bien para *completitud* (hero); el ranking necesita *comparación* (eje compartido)

## 1. Contexto

066 cambió el vanity «Avance medio» por un hero dual ponderado y un ranking por proyecto. El ranking **ordena** por RAG + `remainingWork`, pero **pinta** `Progress` de `%` en una columna `sm:w-36` (~9 rem):

```228:249:src/features/dashboard/DashboardPage.tsx
          <div className="flex w-full shrink-0 flex-col gap-1 sm:w-36">
            {row.checklist.total > 0 && (
              ...
                <Progress value={row.checklist.pct} className="h-1.5" />
```

Eso es un medidor de *sí mismo*, no una gráfica de barras. Un proyecto 90 % de 2 ítems se ve igual que uno 90 % de 80. El ojo y el sort se contradicen.

Carga ya es una barra relativa a `maxTasks` (066 CA-04.8). El número vive **arriba** de la barra, no al lado; `· 0h` aparece aunque no haya estimaciones.

El hero (`ProgressRow` + `done/total · pct%`) es el encoding correcto para un solo total. No se toca.

## 2. Objetivo

Que el ranking se lea como **quién tiene más trabajo pendiente** (longitud alineada, eje compartido) y que la carga se lea en la misma gramática. Sin Recharts. Sin cambiar compute ni schema.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | **Cero** librería de charts. CSS + un `MagnitudeBar`. | Mismo encoding que Recharts (longitud); 5–12 barras no pagan bundle ni tematizar 065. |
| **D2** | Ranking pinta **trabajo restante**, no `%`. El `%` y `done/total` quedan como texto / `title`. | El sort ya es remaining; el visual tiene que coincidir. |
| **D3** | Eje compartido: `maxRemaining = max(0, ...projectRows.map(r => r.remainingWork))` sobre el array **completo**, no el slice visible. | Igual que `maxTasks` (066 CA-04.8). Expandir no cambia anchos. |
| **D4** | Dos pistas agrupadas, **mismo eje** (`maxRemaining`): checklists restantes (`bg-primary`) y tareas restantes (`bg-success`). Si `total === 0` en una métrica, se omite esa pista (066 D2). | Dual de 066, comparable. |
| **D5** | Barras a **ancho completo** de la fila. Se elimina `sm:w-36`. Nombre + `N restante(s)` en la primera línea; pistas debajo. | 9 rem no compara. Una gráfica de barras necesita el ancho del panel. |
| **D6** | Ranking y carga **no** usan `<Progress>` (`role="progressbar"`). `MagnitudeBar` = track + fill, `role="img"`. | Remaining y taskCount son magnitud, no completion. 066 D12 ya lo dijo para Estado. |
| **D7** | Carga: el recuento pasa **a la derecha de la barra**. Se omite `· 0h` si `totalEstimate === 0`. `maxTasks` sigue siendo el array completo. | La barra es la comparación; el número es la lectura. |
| **D8** | No se tocan: hero, tiles, salud, estado, producto, vencidos, estancados, hrefs 063, `computePortfolio`, `projectTaskProgress`. | YAGNI. Conteos RAG/estado ya tienen frase + «N de T». |
| **D9** | Sin bump de schema. Sin rutas nuevas. Copy tuteo. | UI pura. |
| **D10** | Helper puro `magnitudeBarWidth(value, max)` testeable. Si `max <= 0` o `value <= 0` → `0`. Cap 100. | Evita `NaN` cuando todos están al 100 %. |
| **D11** | Copy ranking: `{n} restante` si n === 1, `{n} restantes` si no. `title` del wrapper: `Checklists {done}/{total}` / `Tareas {done}/{total}` (066). | Tuteo. |
| **D12** | `ExpandableList` N=5, sort 066, click → `ROUTES.project(id)`: **sin cambio**. | Solo cambia el markup de `renderItem`. |
| **D13** | Título del panel ranking: «Qué falta por proyecto». Label sigue «Proyectos». | El encoding ya no es “avance %”. |
| **D14** | `remainingWork === 0`: pista a ancho 0, texto «0 restantes». Si ambas `total === 0`, no hay pistas (066). | Honesto; no ocultar el proyecto. |

## 4. Historias de usuario

### HU-01 — Ranking comparativo

**Como** PM, **quiero** ver barras de lo que **falta** alineadas al mismo máximo **para** distinguir un proyecto chico casi hecho de uno grande a medias.

- **CA-01.1** El panel se titula «Qué falta por proyecto».
- **CA-01.2** Cada fila: `HealthDot` + nombre + `{n} restante(s)` (`n = row.remainingWork`) en la primera línea. Debajo, 0–2 pistas a ancho completo.
- **CA-01.3** Pista checklists si `checklist.total > 0`: fill `width = magnitudeBarWidth(checklist.total - checklist.done, maxRemaining)`, `bg-primary`. `title` «Checklists {done}/{total}».
- **CA-01.4** Pista tareas si `tasks.total > 0`: fill con `tasks.total - tasks.done`, `bg-success`. `title` «Tareas {done}/{total}».
- **CA-01.5** `maxRemaining` se calcula **una vez** sobre `rows` completo (antes de ExpandableList). Expandir no cambia anchos.
- **CA-01.6** No hay `<Progress>` dentro de `RankingCard`.
- **CA-01.7** Click, sort, «Ver N más», empty «No hay proyectos abiertos.»: igual 066.
- **CA-01.8** Fixture: A remaining 10, B remaining 5, resto 0 → fill de A = 100 %, fill de B = 50 %. El `%` de completion de A/B **no** determina el ancho.

### HU-02 — Carga, misma gramática

- **CA-02.1** Cada persona: nombre (link 063) en la primera línea. Segunda línea: `MagnitudeBar` (taskCount / maxTasks) + texto a la derecha `{n} tarea(s)` y, si `totalEstimate > 0`, ` · {h}h`.
- **CA-02.2** Si `totalEstimate === 0`, no se pinta ` · 0h`.
- **CA-02.3** `maxTasks` sigue sobre el array completo. No `<Progress>`.
- **CA-02.4** Empty, sort, «Persona eliminada», href `?person=` sin `done=1`: igual 066.

### HU-03 — Primitiva

- **CA-03.1** `magnitudeBarWidth(0, 10) === 0`, `(5, 10) === 50`, `(10, 10) === 100`, `(3, 0) === 0`, `(-1, 10) === 0`, `(12, 10) === 100`.
- **CA-03.2** `MagnitudeBar` tiene `role="img"` y `aria-label` con el valor (no `progressbar`).

## 5. Fuera de alcance

- Recharts / Chart.js / Nivo / cualquier dep de charts.
- Tendencias 30 días (017 HU-15).
- Tortas, donuts, gauges, ejes, ticks, tooltips de librería.
- Graficar vencidos / estancados.
- Barras de conteo extra en Salud/Estado/Producto (066 ya es scaneable).
- Cambiar `remainingWorkOf`, sort, workload filter, schema, hero.
- Tests RTL de `DashboardPage`.
- Persistencia de «Ver más».

## 6. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Un proyecto 100 % hecho con `remainingWork 0` “desaparece” visualmente | D14: pista a 0 + texto «0 restantes». Sigue en la lista (sort lo manda abajo). |
| `maxRemaining === 0` (todos al 100 %) → división por 0 | D10: width 0. |
| Confundir restante con % (color primary = “avance” en el hero) | Título «Qué falta»; copy «N restantes»; dual success en tareas igual que el hero, pero el **ancho** es restante. |
| Expandir cambia anchos | D3: max del array completo. |
| `Progress` se reusa por inercia | D6: primitiva nueva; grep `RankingCard`/`WorkloadCard` sin `Progress`. |

## 7. Tests mínimos (puros)

1. `magnitudeBarWidth` — CA-03.1.
2. Ranking: no hace falta RTL. Helper de fila opcional `rankingTrackWidths(row, max)` si se extrae; si el ancho vive inline, el test del helper + CA-01.8 documentado en design basta.
3. Carga: sin tests de componente. Copy `0h` es visual; no hace falta unit si no hay helper.

## 8. Definición de hecho

- [x] Spec revisado
- [x] Fases A–C en `tasks.md`
- [x] HU-01…03
- [x] Tests §7 verdes
- [x] typecheck + suite `--exclude ".worktrees/**"`
- [x] `graphify update .`
- [x] spec.md → **IMPLEMENTADO**
- [ ] Smoke `smoke.md` (sin browser interactivo en esta sesión; verificado por tests + lectura del markup)

## 9. Documentos

| Archivo | Rol |
|---------|-----|
| `spec.md` | Este documento |
| `design.md` | `MagnitudeBar`, markup ranking/carga |
| `tasks.md` | Fases A–C |
| `smoke.md` | Guion |
| `PROMPT-EJECUCION.md` | Primer mensaje de otra conversación |
