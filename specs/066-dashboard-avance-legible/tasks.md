# Tasks 066 — Dashboard: avance legible y listas con «ver más»

Fases secuenciales. Después de **cada una**: `npx tsc --noEmit` y
`npx vitest run --exclude ".worktrees/**"` verdes.

TDD en A y B: tests primero. C–E cablean UI sobre esas funciones.

Rama: `feat/066-dashboard-avance-legible`. `SCHEMA_VERSION` **23, sin bump**.
Snippets: `design.md`. Autoridad: `spec.md` D1–D26.

A y B pueden ir en paralelo. C espera a ambas. Main espera a F.

## Fase A — Dominio (PR1)

- [ ] A1 Tests `src/domain/compute.test.ts` — casos design §10 (`projectLiveTaskProgress`,
      `aggregateTaskProgress`, antivanity vs media de pct, Overview
      `projectTaskProgress` intacto). Fábricas `newProject` / `newArea` /
      `newChecklist` / `newItem` / `newTask`. Deben **fallar**.
- [ ] A2 Implementar `projectLiveTaskProgress` + `aggregateTaskProgress` en
      `src/domain/compute.ts` (design §1). **No** modificar `projectTaskProgress`.
      Tests A1 verdes.
- [ ] A3 Tests `src/features/dashboard/portfolio.test.ts` — casos design §10
      (antivanity, no `avgProgress`, ranking, remaining sin archivadas,
      workload D10, stalled D26, `healthSentence`, dueSoon/overdue regresión).
      Deben **fallar**.
- [ ] A4 `portfolio.ts`: tipos D17, `remainingWorkOf`, `compareProjectRankingRows`,
      `healthSentence`, cuerpo de `computePortfolio`, workload, `rollupByProduct`
      (design §2). Tests A3 verdes.
- [ ] A5 Informe 052: `statusReport.ts` + `statusReportMarkdown.ts` (design §9.1–9.2).
      DTO conserva `totals.avgProgress` = `checklistProgress.pct`. MD omite
      línea si `total === 0`. Test: no contiene «Avance medio» ni `0/0`.
- [ ] A6 Tool `src/ai/tools/read/workspace.ts` (design §9.3). Alias
      `byProduct.avgProgress`. Descripción sin «avance medio». Tests
      `totalProjects` / `openProjects` siguen verdes.
- [ ] A7 Puente typecheck en `DashboardPage.tsx`: el tile temporal usa
      `stats.checklistProgress.pct`; producto deja de leer `r.avgProgress`
      (design §2.4). **Sin** rediseño visual todavía.

## Fase B — Primitiva `ExpandableList` (PR2)

- [ ] B1 Tests `src/components/ExpandableList.test.ts` — `expandableRemaining`,
      `expandableMoreLabel`, `EXPANDABLE_LESS_LABEL`, `EXPANDABLE_LIST_INITIAL`
      (design §10). Deben **fallar**.
- [ ] B2 `src/components/ExpandableList.tsx` (design §4). `type="button"`
      obligatorio. `useId` interno. Botón después del `<ul>`. Tests B1 verdes.
      Aún **no** se usa en el dashboard.

## Fase C — Layout A + tiles + hero + ranking (PR3)

Deps: A + B. El ranking **debe** usar `ExpandableList` (no dump nuevo).

- [ ] C1 Extraer `ProgressRow` a `src/components/ProgressRow.tsx` (design §5).
      `OverviewTab.tsx` importa el extraído; **mismo** markup (Overview sigue
      pintando 0/0).
- [ ] C2 `dashboardHrefs.dueSoonAnchor` + test (design §3).
- [ ] C3 Tiles HU-01 (design §6.2): Activos · Vencidos · Por vencer · Estancados.
      Quitar «Avance medio» y `Gauge`.
- [ ] C4 Hero HU-02 (design §6.3). Panel full width. No es link.
- [ ] C5 Ranking HU-03 **con** `ExpandableList` (design §6.4). Click →
      `ROUTES.project(id)`.
- [ ] C6 Shell Layout A (design §6.1): DueCard `col-span-full` (inner 2-col
      puede quedarse); Stalled + Workload ya en zona atención; Producto **ancho
      completo al final** (sale de `Producto | Estancados`). Empty de página
      sin cambios.
- [ ] C7 Crear `smoke.md` pasos 1–4. Nota en
      `specs/063-dashboard-drill-down/smoke.md` paso 6: 066 reemplazó el tile
      «Avance medio».

## Fase D — Due desanidado + «ver más» (PR4)

Deps: B + C. **No** reordenar Producto, hero, Estancados ni Carga.

- [ ] D1 Aplanar el `lg:grid-cols-2` **interno** de DueCard a dos `DueSection`
      hermanas (design §7.1). Wrapper `#vencimientos` `scroll-mt-6` `col-span-full`.
      CA-07.4: ambas vacías = Panel único + `CheckCircle2`; una vacía = frase
      muted, sin icono, **no** `return null`.
- [ ] D2 `ExpandableList` en vencidos, por vencer, estancados, carga.
      `listClassName` por superficie (design §4). Stalled **no** re-sort (D26).
      Carga: `maxTasks` del array completo; copy D25.
- [ ] D3 Filas de fecha: mismos `tab`/`focus` 063. `renderItem` sin `<li>` extra.
- [ ] D4 Extender `smoke.md` pasos 5–7.

## Fase E — Cards secundarias (PR5)

Deps: A (frase + ProductRollup dual), B, C (Producto ya full width).

- [ ] E1 `HealthCard`: frase en `<p>` + barra `aria-hidden` (design §8.1). Filas
      063 intactas. **No** `role="img"` en salud.
- [ ] E2 `StatusCard`: **cero** `<Progress>`. Barra composición `role="img"` +
      «N de T» (design §8.2). Links 063.
- [ ] E3 `ProductCard`: mini-barra D15, `title` en wrapper, sin `· N% avance`.
      `ExpandableList` si `length > 5`. «Sin producto» no enlaza (design §8.3).
- [ ] E4 Extender `smoke.md` paso 8.

## Fase F — Cierre

- [ ] F1 `npx tsc --noEmit` + `npx vitest run --exclude ".worktrees/**"` +
      `npx eslint src` (no fallar por lint preexistente de `useBreakpoint`).
- [ ] F2 Recorrer HU-01…HU-08 y spec §9: cada CA tiene código o test.
- [ ] F3 `graphify update .`
- [ ] F4 `spec.md` → **IMPLEMENTADO**; casillas de este archivo.
- [ ] F5 Smoke `smoke.md` (si hay browser; si no, anotá lo que no se pudo clicar).
