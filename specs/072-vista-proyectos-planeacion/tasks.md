# Tasks 072 — Vista de proyectos para planear

Fases en orden. Después de A–D: `npx tsc --noEmit` y
`npx vitest run --exclude ".worktrees/**" src/features/projects/filterProjects.test.ts`.
Después de E, el mismo typecheck y
`npx vitest run --exclude ".worktrees/**" src/features/my-tasks/filterMyTasks.test.ts`.
Al cerrar F, la suite entera con el mismo exclude.

TDD en A, B y E: el test nuevo falla antes de la implementación. Los casos 063
y 061 que ya están verdes tienen que seguir verdes.

Rama: `feat/072-vista-proyectos-planeacion`. `SCHEMA_VERSION` **23, sin bump**.
Snippets: `design.md`. Autoridad: `spec.md` D1–D29.

A y B tocan el mismo archivo: **no van en paralelo**. D y E pueden ir en
paralelo con C. El cierre espera a las tres.

PowerShell: sin `&&`. Un comando por línea.

## Fase A — Parse, writers, filtro, orden

- [x] A1 En `filterProjects.test.ts`, extender `q()` con los defaults de design §1
      y cambiar el 5º argumento de `filterProjectsByQuery` a `KnownProjectRefs`.
      Agregar los casos de design §8 de parse, writers, puerta de cerrados,
      trimestre, `q`, owner, `due` y `compareProjects`. Deben **fallar**
      (o no compilar) antes de A2.
- [x] A2 En `filterProjects.ts`: tipos, `parseProjectsQuery`, `applyProjectsFilter`
      (reglas D6 de `status`/`closed`, y borrado de `sort=attention` /
      `view=plan`), `passesClosed`, `filterProjectsByQuery` con `known`,
      `foldName`, `matchesDue` (14 días), `compareProjects`. No ordenar dentro
      del filtro. No tocar `projectTaskProgress`.
- [x] A3 Casos 063 siguen verdes: status, health sin settings, stalled, producto
      desconocido, health excluye done/archived. `closed=1` + `health=red`
      tampoco deja entrar un done (D14).

## Fase B — Etiquetas, resumen, producto

- [x] B1 Tests de design §8 para `projectDueLabel`, `overdueLiveTaskCount`,
      `summarizeProjects`, `healthSentence` sobre ese `byHealth`,
      `projectsOfProduct`, `clearProjectFilters`, `hasProjectFilters`.
      Deben **fallar**.
- [x] B2 Implementar esas funciones en `filterProjects.ts` (design §2 y §4).
      `projectsOfProduct` incluye done/archived y no llama al filtro de la URL.

## Fase C — Página de proyectos

Deps: B.

- [x] C1 Borrar en `ProjectsPage.tsx` el `useState` de `viewMode` y el
      `useEffect` que fuerza «Por trimestre» cuando hay `?quarter=`.
      La vista sale de `query.view`.
- [x] C2 Controles de design §5: búsqueda con debounce 200 ms vía
      `setSearchParams(prev => …, { replace: true })`, selects, casillas,
      «Limpiar filtros» solo si `hasProjectFilters`. Sin chips.
- [x] C3 Resumen D19 entre controles y tabs. Tres botones de salud cuya unión
      con ` · ` equivale a `healthSentence`. «N vencidos» solo si N > 0.
      Si `ordered.length === 0`, no hay resumen: frase de empty + Limpiar.
- [x] C4 Tabs Plan · Lista · Por trimestre · Por producto, y el `Select` de
      orden. Plan y Atención borran el param.
- [x] C5 `ProjectPlanRow.tsx` (design §5). Un solo `Link`. Barras omitidas si
      `total === 0`. `title` en el wrapper, no en `Progress`. Punto
      `aria-hidden`.
- [x] C6 Vista Lista (D17): punto de salud, fecha solo si hay `dueDate`,
      segunda barra de tareas vivas, conteo = `projectLiveTaskProgress.total`.
- [x] C7 Cabeceras de grupo (design §7) sobre la lista ya ordenada. El
      `highlightId` del trimestre solo en `view=quarter`.
- [x] C8 Empty de `projects.length === 0` sin cambios.

## Fase D — Tarjeta de producto

Deps: B. Puede ir junto con C.

- [x] D1 `ProductsPage.tsx`: el conteo sale de `projectsOfProduct`. Debajo,
      `ExpandableList` con nombre + estado (design §6). `renderItem` sin `<li>`
      extra. Cero proyectos: «Sin proyectos aún.».
- [x] D2 El link «N proyectos →» sigue en `ROUTES.projectsByProduct`. La lista
      incluye cerrados. El panel «Por producto» del dashboard no se toca.

## Fase E — Memoria de Mis tareas

Puede ir en paralelo con C y D. No toca `filterProjects.ts`.

- [x] E1 Tests en `filterMyTasks.test.ts` para design §10: canónico solo con las 8 claves y en ese orden; query vacía; `restore` devuelve null si la URL ya tiene una clave; `restore` devuelve null si lo guardado canoniza a vacío; `restore` arma los params si la URL está pelada; `read`/`write` con un storage falso, y `write` que lanza no rompe. Deben **fallar**.
- [x] E2 Implementar en `filterMyTasks.ts`. El pipeline `filterAndSortMyTasks` y los writers 061 quedan igual.
- [x] E3 `MyTasksPage`: `commit` guarda. El efecto del `person` desconocido guarda la URL ya limpia. Restaurar una sola vez por montaje si `restoreMyTasksSearch` no es null. Un `?person=` entrante no escribe la memoria en el montaje.

## Fase F — Cierre

Deps: C, D y E.

- [x] F1 `npx tsc --noEmit`.
- [x] F2 `npx vitest run --exclude ".worktrees/**"`.
- [x] F3 `npx eslint src` en los archivos tocados. El error preexistente de
      `useBreakpoint`, si sigue, no es de esta spec.
- [x] F4 Recorrer `smoke.md`. Si no hay browser, anotar qué no se pudo clicar.
- [x] F5 `graphify update .`.
- [x] F6 `spec.md` → estado **IMPLEMENTADO**.

Commits sugeridos, uno por fase:

- `feat(projects): filter and sort the portfolio list (spec 072)`
- `feat(projects): summary and product membership helpers (spec 072)`
- `feat(projects): planning list on the projects page (spec 072)`
- `feat(products): list project names on the product card (spec 072)`
- `feat(my-tasks): remember the last filter (spec 072)`
