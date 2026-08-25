# Tasks 067 — Barras comparativas

Fases secuenciales. Después de cada una: `npx tsc --noEmit` y
`npx vitest run --exclude ".worktrees/**"` verdes.

TDD en A. Rama: `feat/067-dashboard-barras-comparativas`.
`SCHEMA_VERSION` **23, sin bump**.

## Fase A — Primitiva

- [x] A1 Tests `src/components/MagnitudeBar.test.ts` — CA-03.1 / design §4.
      Deben **fallar**.
- [x] A2 `src/components/MagnitudeBar.tsx` — `magnitudeBarWidth` + `MagnitudeBar`
      (design §1). `role="img"`, no `progressbar`. Tests A1 verdes.

## Fase B — Ranking

- [x] B1 `RankingCard` en `DashboardPage.tsx` (design §2). Título «Qué falta por
      proyecto». `maxRemaining` sobre `rows` completo. Pistas duales a ancho
      completo. Copy «N restante(s)». Sin `<Progress>`.
- [x] B2 Sort, ExpandableList, click a `ROUTES.project(id)`, empty 066: **sin
      cambio**. Verificar a ojo en el diff que no se tocó `compareProjectRankingRows`.

## Fase C — Carga + cierre

- [x] C1 `WorkloadCard` (design §3). Recuento a la derecha de la barra. Omitir
      ` · 0h`. Sin `<Progress>`. Hrefs 063 intactos.
- [x] C2 Grep: `RankingCard` / `WorkloadCard` no importan `Progress`. Hero y
      producto **sí** siguen usándolo.
- [x] C3 `npx tsc --noEmit` + `npx vitest run --exclude ".worktrees/**"` +
      `npx eslint src` (lint preexistente de `useBreakpoint` no es de esta spec).
- [x] C4 `graphify update .`
- [x] C5 `spec.md` → **IMPLEMENTADO**; casillas de este archivo.
- [ ] C6 Smoke `smoke.md` (sin browser interactivo en esta sesión).
