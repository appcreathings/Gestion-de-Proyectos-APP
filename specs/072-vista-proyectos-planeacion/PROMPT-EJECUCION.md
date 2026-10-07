# Prompt de ejecución — Spec 072

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 072 de este proyecto: `specs/072-vista-proyectos-planeacion/`.

Es una feature ya diseñada: **lista de planeación en `/app/projects`** (filtros y orden en la URL, cerrados ocultos, resumen del recorte), **nombres de proyectos en la tarjeta de `/app/products`**, y **memoria del último filtro de Mis tareas**. **No re-diseñes ni re-preguntes el alcance**: ejecutá `spec.md`, `design.md` y `tasks.md`. Si algo es ambiguo al borde de una decisión ya documentada, elegí la opción de D1–D29 y seguí. Solo preguntá si chocás con un invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` — hay grafo en `graphify-out/`. `graphify query "..."` antes de leer a ciegas; `graphify update .` al terminar.
2. `.specify/memory/constitution.md` — si tasks contradice la constitución, gana la constitución y avisá.
3. `specs/072-vista-proyectos-planeacion/spec.md` — D1–D29, contrato de URL, HU-01…10. **Esto manda.**
4. `specs/072-vista-proyectos-planeacion/design.md` — tipos, writers, filtro, fila, tarjeta de producto, tests §8.
5. `specs/072-vista-proyectos-planeacion/tasks.md` — fases A→F.
6. `specs/072-vista-proyectos-planeacion/smoke.md` — verificación final.
7. Código de referencia (releerlo; puede haber cambiado):
   - `src/features/projects/ProjectsPage.tsx` — `viewMode` en `useState`, `useEffect` de `?quarter=` (~L73), `ProjectCard` (~L225), `GroupedProjects`.
   - `src/features/projects/filterProjects.ts` + `filterProjects.test.ts` — contrato 063. El 5º argumento hoy es un `Set` de productos: pasa a `KnownProjectRefs`.
   - `src/features/products/ProductsPage.tsx` — «N proyectos →» ~L90, sin nombres.
   - `src/domain/compute.ts` — `daysUntil`, `isStalled`, `projectLiveTaskProgress`, `aggregateChecklistProgress`, `aggregateTaskProgress`. **No** cambies `projectTaskProgress`.
   - `src/domain/health.ts` — `effectiveHealth`.
   - `src/features/dashboard/portfolio.ts` — `healthSentence`. Reusala; no la reescribas.
   - `src/features/dashboard/dashboardHrefs.ts` — no se edita. Los destinos tienen que seguir cayendo en esta página.
   - `src/components/HealthBadge.tsx` — `HealthDot`.
   - `src/components/ExpandableList.tsx` — tope 5. `renderItem` no envuelve otro `<li>`.
   - `src/components/ui/checkbox.tsx` — ya es `type="button"`.
   - `src/components/ui/button.tsx` — **no** defaulta `type`.
   - `src/components/EntityCard.tsx` — no cambies la API.
   - `src/routes/paths.ts` — `projectsByProduct`, `projectsByQuarter`. No los cambies.
   - `src/features/quarters/QuartersPage.tsx` ~L178 — el link «N proyectos →» se queda.
   - `src/features/my-tasks/filterMyTasks.ts` + `MyTasksPage.tsx` — la query vive en la URL (061). El menú (`AppLayout`) entra a `ROUTES.myTasks` sin query. D29 agrega memoria; no reescribas el pipeline.

## Baseline al empezar

```
npx tsc --noEmit
npx vitest run --exclude ".worktrees/**"
npx eslint src
```

Anotá el número de tests. **Solo puede subir o mantenerse.** Lint: el error preexistente de `useBreakpoint` no es de esta spec.

**`SCHEMA_VERSION` se queda en 23.** Sin bump, sin migración, sin seed, sin vistas guardadas, sin dependencias npm.

## Cómo ejecutar

Trabajá en rama `feat/072-vista-proyectos-planeacion`, no en `main`, salvo que te pidan lo contrario. Worktree aislado si el checkout actual está sucio (skill `using-git-worktrees`).

Seguí `tasks.md` en orden A→F. TDD en A, B y E. Después de **cada fase**: typecheck + vitest del archivo de esa fase, con `--exclude ".worktrees/**"`.

1. **A — Parse, writers, filtro, orden** en `filterProjects.ts`. El filtro no ordena.
2. **B — Etiquetas, resumen, `projectsOfProduct`, limpiar.** Mismo archivo: después de A, no en paralelo.
3. **C — ProjectsPage + `ProjectPlanRow` + cabeceras.** Quitar el `useEffect` de quarter.
4. **D — ProductsPage.** Puede ir en paralelo con C.
5. **E — Memoria de Mis tareas.** Puede ir en paralelo con C y D.
6. **F — Cierre:** suite entera, eslint, smoke, `graphify update .`, spec **IMPLEMENTADO**.

Commits por fase, mensajes de `tasks.md`. PowerShell: `git commit -m "mensaje"` (sin heredoc). El shell de Grok **no** acepta `&&`.

## Decisiones ya fijadas — no re-preguntar

1. Vista default **Plan** (`view` ausente). Tabs: Plan · Lista · Por trimestre · Por producto.
2. URL es la fuente de verdad. `replace: true`. Plan y sort `attention` no se escriben (se borra el param).
3. Params nuevos: `q`, `priority`, `owner`, `due`, `closed`, `sort`, `view`. Los de 063 se quedan. AND. Id desconocido o valor inválido no filtra.
4. **D4 enmienda 063 D15:** `quarter` filtra si el id existe. No cambia la vista. Borrar el `useEffect`.
5. Cerrados ocultos por defecto. `closed=1` los muestra. Elegir Terminado o Archivado escribe `status` y `closed=1`. Apagar la casilla borra `closed` y ese `status`. Una URL `?status=done` sin `closed` igual muestra los terminados.
6. Con `health` seteado, done y archived siguen afuera (063 D14), aunque `closed=1`.
7. `q` solo en el nombre, sin acentos ni mayúsculas, debounce 200 ms, `setSearchParams` en forma funcional.
8. `due` es la fecha **del proyecto**: `overdue`, `soon` = 0..14, `none`.
9. Orden default: rojo → ámbar → verde, fecha ascendente, sin fecha al final, nombre `es`. Sin `settings`, la salud del orden y del punto es `p.health`, y health/stalled no filtran.
10. Fila Plan = un solo link, con la info de D14. «N vencidas» = tareas vivas no hechas con fecha vencida. Barras de `projectChecklistProgress` y `projectLiveTaskProgress`; si `total === 0`, no se pintan.
11. La tarjeta Lista suma punto, fecha (si hay) y barra de tareas vivas. El conteo de tareas deja de usar `p.tasks.length`.
12. Resumen del conjunto **ya filtrado**. Botones de salud = cláusulas de `healthSentence`. Sin filas, no hay resumen.
13. «Limpiar filtros» no borra `view`.
14. En Productos, bajo «N proyectos →», los nombres (incluye cerrados, ordenados por nombre). Más de 5: `ExpandableList`. El conteo y la lista miden lo mismo. El dashboard no lista nombres.
15. Copy tuteo. Cero rutas nuevas. Cero deps. `paths.ts` y `dashboardHrefs` intactos.
16. Mis tareas guarda la última query en `localStorage` (`hito.myTasks.lastQuery`): persona, estado, prioridad, fecha, proyecto, tipo, hechas y vista. Entrar sin query la restaura una vez. Un link que ya trae params se respeta y no pisa lo guardado. «Limpiar filtros» sigue siendo 061 D11. Sin schema.

## Invariantes (no romper)

- No bump de `SCHEMA_VERSION`. No tocar `projectTaskProgress`.
- Contrato 063 de hrefs: mismos destinos. Esta página los interpreta con la vista Plan y, en el caso de `quarter`, ahora filtrando.
- `ROUTES.projectsByProduct` y `projectsByQuarter` siguen iguales.
- Empty de «Aún no hay proyectos» sin cambios.
- API de `EntityCard` sin cambios. La tarjeta de producto no se envuelve en un link (tiene editar/borrar).
- Vitest **nunca** corre tests de `.worktrees/`.
- No anidar `<a>`. `title` no va en `Progress` (no hace spread): va en un wrapper.
- `HealthDot` con `aria-hidden`. El estado y la fecha están en texto.
- Principio V: filtrar y ordenar en `filterProjects.ts`, no otra vez en el JSX.

## Trampas conocidas

- El `useEffect` de `?quarter=` pisa la vista. Hay que borrarlo, no condicionarlo.
- `p.tasks.length` cuenta archivadas. El conteo visible es `projectLiveTaskProgress(p).total`.
- `Button` no defaulta `type="button"`. `Checkbox` sí lo trae.
- Sin `settings`, health y stalled no filtran; el punto usa `p.health`.
- `closed` y `status=done|archived` se escriben juntos desde el select, pero un `?status=done` pegado a mano tiene que funcionar igual.
- La lista de la tarjeta de producto **incluye** cerrados. Si la pasás por `filterProjectsByQuery`, el «3» y los nombres dejan de coincidir.
- El debounce de `q` tiene que leer los params previos. Un `URLSearchParams` capturado al tipear pisa un filtro que el usuario cambió durante los 200 ms.
- Sets vacíos de `known` (store aún no hidratado) hacen que ese id se ignore, no que la lista quede vacía.
- La memoria de Mis tareas se escribe en `commit`, no al montar una URL que ya tiene params. Si la escribís en un efecto que mira cualquier `searchParams`, un link del dashboard borra el filtro de la persona.
- Restaurá una sola vez por montaje (`useRef`). Sin ese corte, URL vacía → restaurar → efecto de persona inválida → URL vacía otra vez, y queda un loop.
- `localStorage` puede lanzar. `read`/`write` lo tragan.
- `ExpandableList` ya renderiza el `<li>`. Otro `<li>` en `renderItem` rompe el HTML.
- No reordenes los grupos de trimestre/producto. Ordená los proyectos antes de agrupar y conservá ese orden al armar el bucket.

## Definición de hecho

- [ ] Fases A–F en `tasks.md`
- [ ] HU-01…HU-10 del spec
- [ ] Tests design §8 verdes, casos 063 incluidos
- [ ] typecheck + suite con exclude de worktrees
- [ ] `graphify update .`
- [ ] spec.md → **IMPLEMENTADO**
- [ ] Smoke `smoke.md` (si hay browser; si no, anotá lo que no se pudo clicar)

Si al terminar el usuario quiere merge: skill finishing-a-development-branch; no pushees a origin a menos que te lo pidan.
