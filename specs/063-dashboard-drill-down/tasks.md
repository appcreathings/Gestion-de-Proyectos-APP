# Tasks 063 — Dashboard drill-down

Fases secuenciales. Después de cada una: `npx tsc --noEmit` y
`npx vitest run --exclude ".worktrees/**"` verdes.

TDD en A: tests primero. B y C cablean UI sobre esas funciones.

## Fase A — Módulos puros

- [ ] A1 `src/features/projects/filterProjects.ts`
      `ProjectsQuery`, `parseProjectsQuery`, `applyProjectsFilter`,
      `filterProjectsByQuery` — snippets en `design.md` §1.
- [ ] A2 `src/features/projects/filterProjects.test.ts` — casos spec §9.1–7
      (status, stalled, health manual, health derivado, AND, stalled basura,
      product desconocido, `health=purple`).
- [ ] A3 `src/features/dashboard/dashboardHrefs.ts` — `design.md` §2.
- [ ] A4 `src/features/dashboard/dashboardHrefs.test.ts` — spec §9.8.

## Fase B — ProjectsPage (URL = fuente de verdad)

- [ ] B1 Borrar `productFilter` / `statusFilter` y el `useEffect` de sync.
      Leer `parseProjectsQuery(searchParams)`. `commit` con `replace: true`.
- [ ] B2 Selects de producto/estado escriben URL vía `applyProjectsFilter`.
      `quarter` + `viewMode` **igual que hoy**.
- [ ] B3 `filterProjectsByQuery` con `settings` de `useAppStore` y
      `knownProductIds`. Si no hay settings, health/stalled se ignoran;
      status/product sí aplican (`design.md` §5).
- [ ] B4 Chips quitables para `health` y `stalled` (D15). Copy: `healthLabel`
      y «Estancados». Cada chip borra **solo** su param.
- [ ] B5 Empty de lista plana: «Ningún proyecto coincide con los filtros actuales.»

## Fase C — Dashboard

- [ ] C1 Montar `<ScrollToHash />`. Tiles: Activos → `byStatus.active` +
      `dashboardHrefs.activeProjects()` (**no** `stats.active`). Avance medio
      sin Link. Vencidos → `#vencimientos`. Estancados → `stalled=1`.
- [ ] C2 Filas Health/Status/Product: Link si count > 0; «Sin producto» no enlaza.
- [ ] C3 `DueCard`: wrapper `id="vencimientos"` `scroll-mt-6`. Filas de fecha
      sin cambio.
- [ ] C4 `WorkloadCard`: el **nombre** es Link a `personTasks` si el id está
      en `people`; «Persona eliminada» no es link. La barra no es clickeable.
      Pasar `people` o un `Set` de ids.

## Fase D — Cierre

- [ ] D1 typecheck + vitest `--exclude ".worktrees/**"` + lint
      (no fallar por `useBreakpoint` preexistente).
- [ ] D2 `graphify update .`
- [ ] D3 spec.md → **IMPLEMENTADO**; casillas de este archivo.
- [ ] D4 Smoke: `smoke.md`.
