# Prompt de ejecución — Spec 063

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 063 de este proyecto: `specs/063-dashboard-drill-down/`.

Es una feature ya diseñada: **drill-down del dashboard** a listas filtradas
(URL como fuente de verdad). Cierra 017 HU-14 y el hueco que 061 dejó para
hipervínculos. **No re-diseñes ni re-preguntes el alcance**: ejecutá `spec.md`,
`design.md` y `tasks.md`. Si algo es ambiguo en el borde de una decisión ya
documentada, elegí la opción de “Decisiones fijadas” y seguí. Solo preguntá si
chocás con un invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `Claude.md` / `CLAUDE.md` — reglas graphify. Hay grafo en `graphify-out/`:
   `graphify query "..."` antes de leer a ciegas; `graphify update .` al terminar.
2. `.specify/memory/constitution.md` — si tasks contradice la constitución, gana
   la constitución y avisá.
3. `specs/063-dashboard-drill-down/spec.md` — D1–D15, mapa de clicks, HU-01…04,
   fuera de alcance. **Esto manda.**
4. `specs/063-dashboard-drill-down/design.md` — parse, hrefs, chips, wiring.
5. `specs/063-dashboard-drill-down/tasks.md` — fases A→D.
6. `specs/063-dashboard-drill-down/smoke.md` — verificación final.
7. Código de referencia (releerlo; puede haber cambiado):
   - `src/features/dashboard/DashboardPage.tsx` (tiles ~L106–136; cards internas)
   - `src/features/dashboard/portfolio.ts` (`computePortfolio`, `stats.active` =
     abiertos; **el tile deja de usarlo**, D13)
   - `src/features/projects/ProjectsPage.tsx` (`statusFilter` es `useState`,
     `productFilter` se desincroniza al recargar)
   - `src/features/my-tasks/filterMyTasks.ts` — patrón de parse/writers URL (061)
   - `src/domain/health.ts` (`effectiveHealth`)
   - `src/domain/compute.ts` (`isStalled`)
   - `src/domain/labels.ts` (`projectStatusLabel`, `healthLabel`)
   - `src/routes/paths.ts` (`ROUTES.projects`, `projectsByProduct`, `myTasks`, `dashboard`)
   - `src/components/ScrollToHash.tsx` (hoy solo landing/SEO)
   - `src/components/ScrollToTop.tsx` (ya skipea si hay hash)

## Baseline al empezar

```bash
npx tsc --noEmit
npx vitest run --exclude ".worktrees/**"
npx eslint src
```

Anotá el número de tests. **Solo puede subir o mantenerse.** Lint: el error
preexistente de `useBreakpoint` no es de esta spec.

**`SCHEMA_VERSION` se queda en 22.** Sin bump, sin migración, sin seed.

## Cómo ejecutar

Trabajá en rama `feat/063-dashboard-drill-down`, no en `main`, salvo que te
pidan lo contrario. Worktree aislado si el checkout actual está sucio
(skill `using-git-worktrees`).

Seguí `tasks.md` en orden A→D. TDD en A. Después de **cada fase**: typecheck +
vitest con `--exclude ".worktrees/**"`.

1. **A — Módulos puros** (`filterProjects` + `dashboardHrefs` + tests). Sin UI.
2. **B — ProjectsPage**: URL fuente de verdad, Selects, chips, empty de lista.
3. **C — Dashboard**: tiles, filas, hash vencimientos, carga → Mis tareas.
4. **D — Cierre**: spec IMPLEMENTADO, `graphify update .`, smoke.

Commits por fase, mensajes tipo `feat(dashboard): parse project query filters (spec 063)`.
PowerShell: `git commit -m "mensaje"` (sin heredoc). El shell de Grok **no**
acepta `&&`; comandos secuenciales separados.

## Decisiones ya fijadas — no re-preguntar

1. Destinos por grano: proyecto/salud/estado/estancado/producto →
   `/app/projects?...`; persona → `/app/my-tasks?person=`; vencidos del tile →
   `/app#vencimientos`.
2. Params nuevos: `status`, `health`, `stalled=1`. `product` y `quarter` se quedan.
   Combinación = **AND**. Inválidos se ignoran. `stalled` solo si vale exactamente `1`.
3. **D13 (fácil de pifiar):** el tile «Proyectos activos» muestra
   `stats.byStatus.active`, **no** `stats.active` (`open.length`). Destino
   `?status=active`. No cambies `computePortfolio.active`; informes y tools
   siguen hablando de abiertos.
4. **D14:** con `health` presente se excluyen `done` y `archived`.
5. **D15:** chips quitables para `health` y `stalled`. No hay Select extra.
   `quarter` no entra en `filterProjectsByQuery` (sigue siendo vista + highlight).
6. Tile Avance medio: **no** es Link.
7. Carga: solo el **nombre** es Link. Sin `done=1`. «Persona eliminada» no enlaza.
   El recuento del dashboard incluye hechas; Mis tareas las oculta (061) — no
   cambies `workload` en `portfolio.ts`.
8. Filas de fecha/estancados: siguen yendo al proyecto (tab/focus). No tocar.
9. Copy tuteo. Helper `dashboardHrefs` puro; no esparcir strings en el JSX.
10. `replace: true` al escribir searchParams (igual 061).
11. Product id desconocido: **no filtra** (aunque hoy un id inventado dejaba
    la grilla vacía — se corrige).
12. Fuera: HU-15 tendencias, `workType` en dashboard/proyectos, `date=` en
    `/app/projects`, lista global de tareas vencidas, bump de schema, Daily.

## Invariantes (no romper)

- No bump de `SCHEMA_VERSION`. No tocar `computePortfolio` salvo que un test
  de informe se rompa por el **tile** (no debería: el campo `active` no cambia).
- Contrato 061 de Mis tareas: no agregar params; el href es solo `?person=`.
- `ROUTES.projectsByProduct` / `projectsByQuarter` siguen funcionando
  (Productos, Trimestres, Command Palette).
- Vitest **nunca** corre tests de `.worktrees/`.
- No anidar `<a>`: `Link` envuelve `StatTile`/`<li>`, `HealthBadge` no es link.
- `ScrollToTop` ya ignora hash; montar `ScrollToHash` en el dashboard, no
  copiar el `useEffect` de Settings `#uso`.
- Principio V: un parse/filter reusado, no filtrar otra vez en el JSX.

## Trampas conocidas

- `DueCard` a veces es un `Panel` vacío y a veces un grid de dos secciones.
  El `id="vencimientos"` va en un **wrapper**, no en `Panel`.
- `StatusCard` ya oculta estados con count 0; `HealthCard` lista los tres
  colores (el 0 no enlaza).
- Selects de Proyectos tienen que **escribir** la URL: hoy el de producto solo
  setea estado React y se pierde al recargar.
- Si `settings` aún no hidrató, no crashear: status/product aplican;
  health/stalled se ignoran.

## Definición de hecho

- [ ] Fases A–D en `tasks.md`
- [ ] HU-01…HU-04 del spec
- [ ] Tests §9 verdes
- [ ] typecheck + suite con exclude de worktrees
- [ ] `graphify update .`
- [ ] spec.md → **IMPLEMENTADO**
- [ ] Smoke `smoke.md` (si hay browser; si no, anotá lo que no se pudo clicar)

Si al terminar el usuario quiere merge: skill finishing-a-development-branch;
no pushees a origin a menos que te lo pidan.
