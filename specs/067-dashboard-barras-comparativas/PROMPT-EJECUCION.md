# Prompt de ejecución — Spec 067

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 067 de este proyecto: `specs/067-dashboard-barras-comparativas/`.

Es un delta chico sobre 066 **ya implementado**: el ranking deja de pintar `%`
en un sidecar de 9 rem y pasa a **barras de trabajo restante con eje
compartido**. Carga mueve el número a la derecha de la barra. **No re-diseñes
ni re-preguntes**: ejecutá `spec.md`, `design.md` y `tasks.md`. Si algo es
ambiguo, D1–D14. Solo preguntá si chocás con un invariante o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `Claude.md` / `CLAUDE.md` — `graphify query` antes de leer a ciegas;
   `graphify update .` al terminar.
2. `specs/067-dashboard-barras-comparativas/spec.md` — D1–D14, HU-01…03. **Manda.**
3. `specs/067-dashboard-barras-comparativas/design.md` — snippets.
4. `specs/067-dashboard-barras-comparativas/tasks.md` — A→C.
5. `specs/067-dashboard-barras-comparativas/smoke.md`.
6. Código de referencia (releerlo; 066 ya está en main/rama actual):
   - `src/features/dashboard/DashboardPage.tsx` — `RankingCard` (~L211–256,
     sidecar `sm:w-36` + `Progress` de `pct`); `WorkloadCard` (~L578–629,
     número arriba de la barra, ` · {h}h` siempre).
   - `src/features/dashboard/portfolio.ts` — `remainingWork`, `ProjectRankingRow`
     (**no los cambies**).
   - `src/components/ProgressRow.tsx` / `progress.tsx` — hero y producto **siguen**
     usándolos; ranking/carga no.
   - `src/components/ExpandableList.tsx` — N=5, no tocar API.

## Baseline al empezar

```
npx tsc --noEmit
npx vitest run --exclude ".worktrees/**"
npx eslint src
```

Anotá el número de tests. Solo puede subir o mantenerse.
**`SCHEMA_VERSION` se queda en 23.** Sin bump, sin seed, sin Recharts.

## Cómo ejecutar

Rama `feat/067-dashboard-barras-comparativas`. Worktree si el checkout está sucio.

`tasks.md` A→C. TDD en A. Después de cada fase: typecheck + vitest
`--exclude ".worktrees/**"`.

1. **A** — `magnitudeBarWidth` + `MagnitudeBar`.
2. **B** — `RankingCard` (título, pistas duales full-width, max del array completo).
3. **C** — `WorkloadCard` + grep + graphify + spec IMPLEMENTADO + smoke.

Commits por fase: `feat(dashboard): comparative remaining-work bars (spec 067)`.
PowerShell: `git commit -m "mensaje"` (sin heredoc). Este shell no acepta `&&`.

## Decisiones ya fijadas — no re-preguntar

1. Cero librería de charts. CSS + `MagnitudeBar`.
2. Ranking pinta **restante**, no `%`. `%` / `done/total` solo en texto/`title`.
3. `maxRemaining` sobre **todas** las `projectRows`, no el slice visible.
4. Dos pistas, mismo eje: checklists `bg-primary`, tareas `bg-success`. Omitir
   si `total === 0`.
5. Barras a ancho completo. Se va `sm:w-36`.
6. Ni ranking ni carga usan `<Progress>`. `role="img"`, no `progressbar`.
7. Carga: recuento a la derecha. Sin ` · 0h` si no hay estimate.
8. Hero, tiles, salud, estado, producto, vencidos, estancados, compute, sort,
   hrefs 063: **no se tocan**.
9. Título ranking: «Qué falta por proyecto». Copy: «1 restante» / «N restantes».
10. Fuera: HU-15, tortas, graficar vencidos, barras extra en RAG/estado.

## Invariantes (no romper)

- No bump de `SCHEMA_VERSION`. No tocar `computePortfolio` / `remainingWorkOf`
  / `compareProjectRankingRows`.
- ExpandableList N=5, getKey, click a `ROUTES.project(id)`.
- Hero sigue `ProgressRow`. Producto sigue mini `Progress` de %.
- Carga href `?person=` sin `done=1`. «Persona eliminada» no es link.
- Vitest nunca corre `.worktrees/`.
- No anidar `<a>`. No añadir deps.

## Trampas conocidas

- **No reuses `Progress`.** Es completion (0–100 de *esa* fila). Remaining es
  magnitud vs el máximo del portafolio.
- `maxRemaining` / `maxTasks` **fuera** de `renderItem`. Si los calculás sobre
  `visible`, expandir achica las barras.
- `max === 0` (todos al 100 %) → width 0, no `NaN`.
- El color `primary` en restante **no** significa “avance”. El título y
  «N restantes» son los que desambiguan; no inviertas D2 para “que se vea
  como progreso”.
- Producto (066 D15) **sigue** siendo % de sí mismo. No lo pases a remaining.

## Definición de hecho

- [ ] Fases A–C
- [ ] HU-01…03
- [ ] Tests §7 verdes
- [ ] typecheck + suite
- [ ] `graphify update .`
- [ ] spec.md → **IMPLEMENTADO**
- [ ] Smoke `smoke.md`

No pushees a origin salvo que te lo pidan.
