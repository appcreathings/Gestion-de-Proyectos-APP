# Prompt de ejecución — Spec 066

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 066 de este proyecto: `specs/066-dashboard-avance-legible/`.

Es una feature ya diseñada: **dashboard con avance dual ponderado (checklists +
tareas), ranking por proyecto, tile «Por vencer», y «Ver N más» in situ en las
listas largas.** **No re-diseñes ni re-preguntes el alcance**: ejecutá `spec.md`,
`design.md` y `tasks.md`. Si algo es ambiguo en el borde de una decisión ya
documentada, elegí la opción de “Decisiones fijadas” (D1–D26) y seguí. Solo
preguntá si chocás con un invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `Claude.md` / `CLAUDE.md` — reglas graphify. Hay grafo en `graphify-out/`:
   `graphify query "..."` antes de leer a ciegas; `graphify update .` al terminar.
2. `.specify/memory/constitution.md` — si tasks contradice la constitución, gana
   la constitución y avisá.
3. `specs/066-dashboard-avance-legible/spec.md` — D1–D26, mapa de clicks,
   HU-01…08, fuera de alcance. **Esto manda.**
4. `specs/066-dashboard-avance-legible/design.md` — tipos, snippets, layout, tests.
5. `specs/066-dashboard-avance-legible/tasks.md` — fases A→F.
6. `specs/066-dashboard-avance-legible/smoke.md` — verificación final.
7. Código de referencia (releerlo; puede haber cambiado):
   - `src/features/dashboard/DashboardPage.tsx` (tiles ~L115–146; DueCard anidado
     L158–161 + L347; Stalled sort en JSX L309–311; workload L432–479)
   - `src/features/dashboard/portfolio.ts` (`avgProgress` media de pct L74–79;
     workload cuenta hechas L83–91; `ProductRollup.avgProgress`)
   - `src/features/dashboard/dashboardHrefs.ts` + `.test.ts` (063)
   - `src/domain/compute.ts` (`ProgressStat`, `projectChecklistProgress`,
     `projectTaskProgress` — **no lo cambies** —, `aggregateChecklistProgress`)
   - `src/domain/factories.ts` (`newProject`, `newArea`, `newChecklist`,
     `newItem`, `newTask`)
   - `src/features/projects/components/OverviewTab.tsx` (`ProgressRow` L133–159)
   - `src/components/ui/progress.tsx` (`role="progressbar"`; **no** spread de attrs)
   - `src/components/ui/button.tsx` (L40–48: **no** defaulta `type`)
   - `src/features/reports/statusReport.ts` + `statusReportMarkdown.ts`
   - `src/ai/tools/read/workspace.ts` (`avgChecklistProgressPct: stats.avgProgress`)
   - `src/features/my-tasks/filterMyTasks.ts` L135 (salta `t.archived`)
   - `src/components/ScrollToHash.tsx` (ya montado en el dashboard, 063)

## Baseline al empezar

```
npx tsc --noEmit
npx vitest run --exclude ".worktrees/**"
npx eslint src
```

Anotá el número de tests. **Solo puede subir o mantenerse.** Lint: el error
preexistente de `useBreakpoint` no es de esta spec.

**`SCHEMA_VERSION` se queda en 23.** Sin bump, sin migración, sin seed, sin
librería de charts.

## Cómo ejecutar

Trabajá en rama `feat/066-dashboard-avance-legible`, no en `main`, salvo que te
pidan lo contrario. Worktree aislado si el checkout actual está sucio
(skill `using-git-worktrees`).

Seguí `tasks.md` en orden A→F. TDD en A y B. Después de **cada fase**: typecheck +
vitest con `--exclude ".worktrees/**"`.

1. **A — Dominio** (`projectLiveTaskProgress`, `computePortfolio` dual,
   ranking, workload sin hechas/archivadas, stalled sort, informe + tool).
   Puente mínimo en `DashboardPage` para que typecheck pase.
2. **B — `ExpandableList`** primitiva + tests de helpers. Sin UI de página.
3. **C — Layout A**: tiles (Por vencer, se va Avance medio), hero dual, ranking
   **con** ExpandableList, DueCard `col-span-full`, Producto full width al final.
4. **D — Due desanidado** + «ver más» en listas que ya existían. No reordenar
   el shell de C.
5. **E — Secundarias**: frase RAG, Estado sin `Progress`, mini-barra de producto.
6. **F — Cierre**: spec IMPLEMENTADO, `graphify update .`, smoke.

A y B pueden ir en paralelo. C espera a ambas. Main espera a F.

Commits por fase, mensajes tipo `feat(dashboard): dual weighted portfolio progress (spec 066)`.
PowerShell: `git commit -m "mensaje"` (sin heredoc). El shell de Grok **no**
acepta `&&`; comandos secuenciales separados.

## Decisiones ya fijadas — no re-preguntar

1. Snapshot de hoy. **No** tendencias HU-15. **No** persistir series.
2. Dual checklists + tareas. Si `total === 0`, omitir esa barra en el dashboard
   (Overview **sí** pinta 0/0: no lo cambies).
3. Ponderado (`aggregate*Progress`), no media de pct. Se elimina
   `PortfolioStats.avgProgress`. El DTO del informe **conserva**
   `totals.avgProgress` = `checklistProgress.pct`.
4. Layout A: tiles → hero → ranking → atención → salud/estado → producto.
5. Tile «Avance medio» **fuera**. 4.º tile = Por vencer → `#vencimientos`
   (mismo hash que Vencidos). Hero no es link.
6. Mapa 063 intacto (Activos `?status=active`, Estancados `?stalled=1`,
   salud/estado/producto, carga → Mis tareas sin `done=1`).
7. `ExpandableList` N=5, in situ, no persistido. «Ver N más» / «Ver menos».
   No en salud ni estado.
8. Tareas del dashboard = **vivas** (`projectLiveTaskProgress`, `!archived`).
   `projectTaskProgress` no se toca. Archivar hechas baja el % del dashboard,
   no el de Overview — aceptado.
9. Workload: `!archived && status !== "done"`. Copy vacío: «No hay tareas
   abiertas asignadas.»
10. Stalled se ordena por `updatedAt` asc **en** `computePortfolio`. La card
    no re-ordena.
11. `Progress` no se usa para share-of-portfolio (Estado). `title` no va en
    `Progress` (no hace spread): va en un wrapper.
12. `type="button"` en ExpandableList es obligatorio (`Button` no lo defaulta).
13. Copy tuteo. Cero deps npm. Cero rutas nuevas.
14. Fuera: Recharts, layout B/C, métrica única, `#por-vencer`, RTL de páginas,
    bump de schema, `workType` en dashboard.

## Invariantes (no romper)

- No bump de `SCHEMA_VERSION`. No tocar `projectTaskProgress`.
- Contrato 063 de hrefs: no cambiar destinos existentes. Solo **añadir**
  `dueSoonAnchor` como alias.
- Contrato 061 de Mis tareas: href de carga sigue siendo solo `?person=`.
- `stats.active` sigue = `open.length`. El tile Activos sigue siendo
  `byStatus.active` (063 D13).
- Empty de página sin proyectos (L57–98) sin cambios.
- Filas de fecha: mismos `tab`/`focus`.
- Vitest **nunca** corre tests de `.worktrees/`.
- No anidar `<a>`. No `display: contents` en `#vencimientos`.
- No añadir Recharts ni otra lib. No tocar `progress.tsx` / `StatTile`.
- Principio V: helpers puros (`remainingWorkOf`, `healthSentence`,
  `expandableRemaining`); no recalcular sort en el JSX.

## Trampas conocidas

- **DueCard** a veces es un Panel vacío y a veces un grid de dos secciones.
  El `id="vencimientos"` va en un **wrapper** `col-span-full`, no en `Panel`.
  Si una lista tiene filas y la otra no, **no** hagas `return null` en
  `DueSection` (deja un hueco 2-col): pintá la frase muted.
- En fase C DueCard puede seguir con inner 2-col **si** ya es `col-span-full`
  (fechas a 50/50 de la página). Fase D aplana ese inner. No vuelvas a poner
  Due al lado de Carga en una celda de 50 %.
- `avgProgress` tiene **tres** consumidores (Dashboard, informe, tool). Hay
  que actualizarlos en A o typecheck rompe. El DTO del informe y
  `byProduct.avgProgress` del tool **conservan el nombre** como alias ponderado.
- Ranking: si pasás `stats.stalled` / `projectRows` sin el sort de
  `computePortfolio` y ordenás dentro de `renderItem`, ExpandableList muestra
  las 5 **equivocadas**.
- Extraer `ProgressRow` sin cambiar Overview (ese sí pinta 0/0).
- Archivar una tarea hecha (Kanban 015) baja el % del hero y **no** el de
  Overview. Es D18, no un bug. No agregues tooltip de archivadas en el
  portafolio.
- El tile puente de A (`checklistProgress.pct` en un StatTile) **se borra** en
  C. No lo dejes.

## Definición de hecho

- [ ] Fases A–F en `tasks.md`
- [ ] HU-01…HU-08 del spec
- [ ] Tests spec §9 / design §10 verdes
- [ ] typecheck + suite con exclude de worktrees
- [ ] `graphify update .`
- [ ] spec.md → **IMPLEMENTADO**
- [ ] Smoke `smoke.md` (si hay browser; si no, anotá lo que no se pudo clicar)

Si al terminar el usuario quiere merge: skill finishing-a-development-branch;
no pushees a origin a menos que te lo pidan.
