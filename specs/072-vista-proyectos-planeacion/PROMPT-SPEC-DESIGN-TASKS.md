# Prompt — Spec 072 · Vista de proyectos para planear

> **Ya corrido.** Spec, design, tasks, smoke y el prompt de implementación están en esta carpeta.
> Para implementar en un chat nuevo, pegá `PROMPT-EJECUCION.md`. No vuelvas a generar estos documentos.

---

Vas a documentar la spec **072** de Hito: una vista de `/app/projects` para recorrer muchos proyectos, filtrarlos, ordenarlos y leer lo necesario para planear, y en `/app/products` la lista de proyectos de cada producto al lado del conteo «N proyectos».

El alcance de producto **ya está cerrado** en este prompt (sección «Decisiones cerradas»). Transcribilo a `spec.md` como D1…Dn con su razón. No reabras esas decisiones ni armes un brainstorm. Si el código de hoy contradice el mapa de «Estado actual», gana el código: anotá el desvío en la tabla de contexto y segúí con la misma decisión. Parate solo si una decisión cerrada es imposible sin romper un invariante (schema, contrato 063 de hrefs del dashboard, o `projectTaskProgress`).

## Orden de lectura (antes de escribir)

1. `CLAUDE.md` — hay grafo en `graphify-out/`. `graphify query "..."` antes de leer a ciegas.
2. `.specify/memory/constitution.md` — principios **IV** (claridad, cada elemento se justifica), **V** (rebanada vertical, sin librerías), **II** (el esquema no se toca).
3. Código de la vista, en este orden:
   - `src/features/projects/ProjectsPage.tsx` — filtros, `viewMode` en `useState`, `ProjectCard`, `GroupedProjects`, `useEffect` de `?quarter=`.
   - `src/features/projects/filterProjects.ts` + `filterProjects.test.ts` — contrato 063. `quarter` **no** filtra.
   - `src/domain/schemas/project.ts` — campos ya persistidos (`status`, `priority`, `health`, `ownerId`, `startDate`, `dueDate`, `quarterId`, `productId`, `tags`, `tasks`, `milestones`).
   - `src/domain/compute.ts` — `daysUntil`, `projectChecklistProgress`, `projectLiveTaskProgress`, `aggregateChecklistProgress`, `aggregateTaskProgress`, `isStalled`.
   - `src/domain/health.ts` — `effectiveHealth`.
   - `src/features/dashboard/portfolio.ts` — `healthSentence`.
   - `src/routes/paths.ts` — `projects`, `projectsByProduct`, `projectsByQuarter`.
   - Callers de `ROUTES.projectsByQuarter` y de `?quarter=` (Trimestres, command palette, lo que aparezca).
   - `src/features/dashboard/dashboardHrefs.ts` — hrefs 063 que **tienen que seguir resolviendo**.
   - `src/features/products/ProductsPage.tsx` — tarjeta ~L76–99: cuenta `productId` y muestra «N proyectos →» hacia `projectsByProduct`. No lista nombres. Cero proyectos: «Sin proyectos aún.»
   - `src/components/ExpandableList.tsx` — tope de 5 + «Ver N más» (spec 066). Reusalo en la tarjeta de producto.
   - `src/components/EntityCard.tsx` — la usan Productos y Biblioteca. No cambies su API. La tarjeta de producto **no** es un link (tiene editar/borrar): los nombres van como links en el cuerpo.
4. Contratos previos, solo para no pisarlos:
   - `specs/063-dashboard-drill-down/spec.md` — D2, D5, D13, D14, D15. **D15 se enmienda** (ver D4).
   - `specs/061-mis-tareas-filtros/spec.md` — patrón de URL (`replace: true`, default = param ausente, id desconocido no filtra, «mostrar hechas» ↔ `status=done`). No copies sus params a esta ruta.
   - `specs/066-dashboard-avance-legible/spec.md` — D18: `projectTaskProgress` no se toca. Las tareas de esta vista son **vivas** (`projectLiveTaskProgress`, `!archived`).
5. Estilo de salida: `specs/066-dashboard-avance-legible/spec.md`, `design.md`, `tasks.md` y `PROMPT-EJECUCION.md`. Misma voz, mismas secciones, español, copy de UI en rioplatense **tuteo**.

`SCHEMA_VERSION` hoy es **23** (`src/domain/schemas/common.ts`). Se queda en 23.

## Problema que la spec tiene que nombrar

`/app/projects` es una grilla de tarjetas. Con varios proyectos no se puede planear desde ahí:

| Superficie | Hoy | Hueco |
|------------|-----|--------|
| Filtros con control en la página | Producto y estado (`Select`, URL) | Salud y estancados solo llegan como chip desde el dashboard: la página no los puede activar. No hay búsqueda, prioridad, responsable ni ventana de vencimiento del proyecto. |
| `?quarter=` | Salta a «Por trimestre» y resalta el grupo (`useEffect` ~L73). **No excluye** otros trimestres (063 D15). | Elegir un trimestre no achica la lista. |
| Vista | `list` \| `quarter` \| `product` en `useState` | Se pierde al recargar. No está en la URL. |
| `ProjectCard` | Estado, producto, prioridad, barra de checklists, «N áreas · N tareas» | `N tareas` cuenta `p.tasks.length` (incluye archivadas). No hay salud, fecha, responsable, avance de tareas vivas, ni señal de estancado. |
| Grupos | Conteo + `%` de checklists (`aggregateChecklistProgress`) | El rollup de tareas vivas (066) no aparece. |
| Cerrados | `done` y `archived` entran en «Todos los estados» | La lista de planeación se mezcla con lo cerrado. |
| Orden | El del array del store | No hay orden de atención, fecha o nombre. |
| Productos (`/app/products`) | «N proyectos →» o «Sin proyectos aún.» | El conteo no dice **cuáles** son. |

El dashboard (063, 066, 067) ya responde «¿cómo viene el portafolio?». Esta spec responde «¿con qué proyectos trabajo ahora y cómo los recorto?». No es un segundo dashboard.

## Objetivo

En `/app/projects`, con muchos proyectos, la persona puede:

- ver una **lista de planeación** (una fila por proyecto) con salud, fecha, responsable y avance dual;
- filtrar y ordenar con la URL como fuente de verdad, y recuperar esa vista al recargar o compartir el link;
- ocultar cerrados por defecto;
- leer un resumen corto del conjunto **ya filtrado**;
- en cada producto, ver el nombre de sus proyectos sin salir de `/app/products`.

La grilla de tarjetas, «Por trimestre» y «Por producto» se quedan.

## Decisiones cerradas

Transcribí cada fila a la tabla de decisiones del spec. Cero preguntas abiertas.

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Dos superficies: `ProjectsPage` + `filterProjects`, y la tarjeta de `ProductsPage`. Sin rutas nuevas. El panel «Por producto» del dashboard **no** entra. | El trabajo es la lista de proyectos y saber, desde Productos, cuáles son. El dashboard sigue siendo el corte de portafolio. |
| **D2** | URL = fuente de verdad. `setSearchParams(..., { replace: true })`. La página no guarda filtros en `useState`. | Mismo contrato que 063 y 061. Un link del dashboard sigue siendo la lista. |
| **D3** | Params **nuevos**, todos AND con los de 063: `q`, `priority`, `owner`, `due`, `closed`, `sort`, `view`. Los viejos se quedan: `product`, `status`, `health`, `stalled`, `quarter`. Valor inválido o id desconocido **no filtra y no rompe** (igual que `product` en 063). | Componer filtros. No inventar un segundo dialecto para `status` / `health`. |
| **D4** | **Enmienda 063 D15:** `quarter` **sí filtra** (`p.quarterId === quarter`). Se **borra** el `useEffect` que fuerza `viewMode = "quarter"`. El resaltado del grupo se queda solo cuando la vista activa es trimestre. | Un trimestre tiene que achicar la lista. Forzar la vista agrupada deja un solo grupo y pisa la vista elegida. |
| **D5** | Callers de `projectsByQuarter` (Trimestres y cualquier palette) **siguen apuntando a la misma URL**. Si algún copy promete «ver todos, resaltado», se actualiza en esta spec para decir que entra filtrado a ese trimestre. No se cambia `paths.ts`. | El deep link pasa a significar «estos proyectos». El copy no puede mentir. |
| **D6** | Cerrados (`done`, `archived`) **ocultos por defecto**. `closed=1` los muestra. Elegir estado `done` o `archived` escribe ese `status` **y** `closed=1`. Apagar «Mostrar cerrados» borra `closed` y, si `status` era `done` o `archived`, también borra `status`. El resto de params no se toca. | Misma trampa que 061 D7: filtrar cerrados con el interruptor apagado dejaría la lista vacía. El default sirve para planear. |
| **D7** | `q` busca solo en `project.name`. Trim, sin distinguir mayúsculas ni diacritíticos (`NFD`, quitar marcas, `toLowerCase`). Param ausente o vacío = no filtra. Al escribir, debounce ~200 ms y `replace: true`. | Alcanza para encontrar un proyecto. Tags y descripción ensucian los resultados. |
| **D8** | `priority`: `critical` \| `high` \| `medium` \| `low`. El control lista las cuatro, crítica incluida. | El dominio ya tiene `critical`. 061 D6: no repetir el hueco del Kanban. |
| **D9** | `owner` es un id de `people`. No hay usuario «yo» ni `currentPersonId`. Opción vacía = todos. Id desconocido no filtra. Fila sin responsable muestra «Sin responsable». | 061 D9: la app no tiene sesión de persona. |
| **D10** | `due` mira **`project.dueDate`**, no las fechas de las tareas. `overdue` = `daysUntil < 0`. `soon` = `0..14` inclusive. `none` = sin fecha. Otro valor se ignora. `daysUntil` es el de `compute.ts`, `now` inyectable. | El horizonte de un proyecto no es el `this-week` del Kanban. 14 días es una quincena de planeación. |
| **D11** | `sort` ausente = `attention`: salud efectiva red → ámbar → verde, luego `dueDate` ascendente con **sin fecha al final**, luego `localeCompare(name, "es", { sensitivity: "base" })`. Otros valores: `due` (fecha asc, sin fecha al final, después nombre), `name`, `progress` (pct de checklists desc, empate pct de tareas vivas desc, después nombre), `updated` (`updatedAt` desc, después nombre). Inválido = `attention`. El mismo comparador ordena la grilla y cada grupo. Los grupos en sí siguen el orden de trimestres/productos; «Sin trimestre» / «Sin producto» al final. | La planeación mira primero lo rojo y lo que vence. El orden de grupos ya es el del dominio. |
| **D12** | Salud del orden, del punto y del resumen = `effectiveHealth(p, settings, now)`. Sin `settings` (workspace sin hidratar): el punto usa `p.health`; `health` y `stalled` **no filtran** (ya es así); no se muestra «Estancado». | Mismo criterio que `filterProjects` hoy. La fila no queda sin color. |
| **D13** | `view` ausente o inválido = **`plan`** (lista compacta, una fila). Valores: `plan` \| `list` \| `quarter` \| `product`. Ausencia = plan, para que la URL default quede limpia (igual que 061 con la vista plana). Tabs, en este orden: **Plan · Lista · Por trimestre · Por producto**. | Con muchos proyectos la grilla no se escanea. La grilla actual sigue en «Lista». |
| **D14** | Fila de Plan, de izquierda a derecha, y en mobile en dos líneas (identidad arriba, meta abajo): punto de salud, nombre, estado, prioridad, responsable, vencimiento relativo del proyecto («vence en N días» / «vence hoy» / «venció hace N días» / «Sin fecha»), avance de checklists, avance de tareas vivas, y si aplica el texto «Estancado» y «N vencidas». Producto y trimestre van como texto muted. La fila entera es un solo `Link` a `ROUTES.project(id)`. | Datos que ya están en el proyecto y que cambian una decisión de planeación. Un solo link: no hay `<a>` anidados. |
| **D15** | «N vencidas» = tareas con `!archived`, `status !== "done"` y `daysUntil(dueDate) < 0`. Si el conteo es 0, no se pinta. No cuenta ítems de checklist ni archivadas. | Es señal de atención, no un segundo Mis tareas. |
| **D16** | Barras de la fila y de la tarjeta: `projectChecklistProgress` y `projectLiveTaskProgress`. Si `total === 0`, **se omite esa barra**. No uses `projectTaskProgress`. En la tarjeta, el conteo de tareas pasa a ser tareas no archivadas (las hechas sí cuentan). El conteo de áreas se queda. | Alinea el denominador con 066 D18. Archivadas hoy inflan «N tareas». |
| **D17** | La vista **Lista** (tarjetas) agrega solo: punto de salud, vencimiento relativo si hay fecha, y la segunda barra de tareas vivas. No agrega responsable, «Estancado» ni «N vencidas». Esos viven en Plan. | Principio IV: la tarjeta no se convierte en la fila. |
| **D18** | Cabecera de grupo: «N proyectos» + pct de checklists + pct de tareas vivas, con `aggregateChecklistProgress` y `aggregateTaskProgress`. Si `total === 0`, se omite ese pct. | El grupo mentía al mostrar solo checklists. |
| **D19** | Resumen del conjunto **filtrado**, una sola línea, entre los filtros y las tabs: «N proyectos» + `healthSentence` + «N vencidos» (proyectos con `due=overdue`, solo si N > 0). Cada tramo de salud es un `<button>` que escribe `health` (si ya estaba ese valor, lo borra). «N vencidos» escribe `due=overdue`. Si `filtered.length === 0`, no hay resumen: queda el empty con botón «Limpiar filtros». | Análisis del recorte actual, no un clon del dashboard. Los ceros de `healthSentence` se mantienen (066 D13). |
| **D20** | Controles en la página, en una fila que hace wrap; en mobile cada control a ancho completo. Orden: búsqueda, producto, estado, prioridad, responsable, vencimiento, salud, casilla «Solo estancados», casilla «Mostrar cerrados». **No hay chips** de quitar: el control que pone el filtro lo saca. «Limpiar filtros» aparece si hay alguno de: `product`, `status`, `health`, `stalled`, `priority`, `owner`, `q`, `due`, `closed`, `quarter`. Borra esos y también `sort`. **No** borra `view`. | 063 usaba chips porque salud y estancados no tenían control. Con selects, el chip duplica. Limpiar no te cambia de vista. |
| **D21** | Sort es un `Select` junto a las tabs (es organización de la vista, no un filtro). Default `attention` = param ausente. | Separar «qué proyectos» de «en qué orden». |
| **D22** | Lógica pura en `src/features/projects/filterProjects.ts` (parse, apply, filter, sort), un helper puro de resumen + conteo de vencidas, y `projectsOfProduct`, testeables sin montar React. `now` y `settings` entran por argumento. Las páginas solo leen datos y renderizan. | Principio V. 063 ya dejó el filtro ahí. El conteo de la tarjeta de producto sale de `projectsOfProduct`, no de un `.filter` suelto en el JSX. |
| **D23** | Sin bump de `SCHEMA_VERSION`. Sin migración, sin seed, sin preferencia persistida en el workspace, sin vistas guardadas. | Todo cabe en la URL. |
| **D24** | Cero dependencias npm. Cero librería de virtualización, de tabla o de charts. Barras = `Progress` que ya existe. Punto de salud = el mismo tratamiento visual del dashboard (`HealthDot` si se puede reutilizar sin arrastrar el dashboard; si está cerrado en `DashboardPage`, un punto de 8 px con los mismos tokens, sin sistema de color nuevo). | La lista de un portafolio chico no necesita react-table. |
| **D25** | Copy tuteo. Empty de «aún no hay proyectos» (el de `projects.length === 0`) **no se toca**. Empty de filtros: «Ningún proyecto coincide con los filtros actuales.» + botón «Limpiar filtros». | El primer uso sigue invitando a crear. El recorte vacío tiene salida. |
| **D26** | Accesible: búsqueda y cada `Select` con nombre accesible; casillas con label visible; botones del resumen y «Limpiar» con `type="button"` (`Button` no lo defaulta — ver spec 066); la fila es un solo link; el punto de salud no es el único indicador (el texto de estado y de vencimiento también está). | Teclado y nombre accesible. El color no va solo. |
| **D27** | Sin feature flag. Rollout = merge. Rollback = revert. | Local-first, igual que 066 D24. |
| **D28** | En la tarjeta de producto, debajo de «N proyectos →», una lista de los proyectos con ese `productId`. Cada ítem es el **nombre** (link a `ROUTES.project(id)`) y el estado (`projectStatusLabel`). El conteo sigue y sigue yendo a `ROUTES.projectsByProduct(id)`. La lista **incluye** `done` y `archived`, en el mismo orden `localeCompare(name, "es", { sensitivity: "base" })`, y su largo es el número del conteo. No aplica el ocultar cerrados de D6. Cero proyectos: se queda «Sin proyectos aún.», sin lista. Más de 5: `ExpandableList` (5, «Ver N más» / «Ver menos», in situ). | El conteo solo no dice cuáles son. Tiene que coincidir con los nombres. Ocultar cerrados acá desfasaría el «3» de la lista. El tope de 5 ya existe y evita una tarjeta infinita. |

## Fuera de este ciclo

No los metas en historias ni en tasks «por si acaso»:

- Vistas guardadas, pins, o recordar la vista en `workspace.json`.
- Edición masiva, selección múltiple, drag para reordenar proyectos.
- Gantt, calendario o timeline (eso es la spec 053; `PortfolioCalendarView` no se toca).
- Otro árbol Producto → Proyecto (el rail global ya existe; `ProjectsLayout` no vuelve a tener sidebar).
- Rediseño del dashboard (el «N proyectos» de «Por producto» se queda), de Mis tareas, del detalle del proyecto, de Overview.
- Filtrar por tag, tipo de trabajo, sprint, hito o área.
- Cambiar `projectTaskProgress`, `computePortfolio`, `SCHEMA_VERSION`, `EntityCard` (API), `paths.ts`, o los destinos de `dashboardHrefs`.
- Buscar dentro de tareas desde esta página.
- Virtualizar la lista.
- Tests de página con React Testing Library (el criterio de 063: la lógica es pura; la página se verifica en `smoke.md`).

## Qué tiene que quedar escrito

Carpeta: `specs/072-vista-proyectos-planeacion/`.

### 1. `spec.md`

Misma forma que 066:

- Encabezado: estado **DISEÑADO** (no implementes), fecha, `SCHEMA_VERSION` 23 sin bump, depende de 063 y 066, principios IV y V, tuteo, y una línea de que D4 enmienda 063 D15.
- §1 Contexto con la tabla de huecos (ajustada si el código se movió).
- §2 Objetivo, en una frase operativa.
- §3 Decisiones D1–D28. Cero preguntas abiertas.
- §4 Contrato de URL normativo (param, ausente significa, valores, notas). Incluí la regla de `closed` ↔ `status` done/archived y la de `quarter` que ahora filtra.
- §5 Pipeline en orden: partir de `projects` → cerrados → el resto de los AND → `q` → sort. `view` no filtra.
- §6 Mapa de la fila Plan, de la tarjeta Lista, de la cabecera de grupo y de la tarjeta de producto (D28). Qué se pinta y qué se omite cuando `total === 0`.
- §7 Historias con criterios comprobables:
  - **HU-01** Filtros nuevos y los de 063 siguen combinándose en AND.
  - **HU-02** Cerrados ocultos por defecto, con la excepción de D6.
  - **HU-03** Trimestre filtra y no cambia la vista.
  - **HU-04** Vista Plan por defecto, persistida en la URL; Lista / trimestre / producto siguen.
  - **HU-05** Orden `attention` y los otros cuatro.
  - **HU-06** Fila con la información de D14–D16.
  - **HU-07** Resumen del conjunto filtrado (D19) y «Limpiar filtros» (D20).
  - **HU-08** Deep links 063 (`?status=active`, `?health=`, `?stalled=1`, `?product=`) siguen abriendo esta página ya filtrada, ahora sobre la vista Plan.
  - **HU-09** La tarjeta de producto lista los nombres (D28). El conteo y «Ver los proyectos» siguen yendo a `?product=`. Un nombre abre ese proyecto.
- §8 Fuera de alcance (la lista de arriba).
- §9 Verificación: tests unitarios nombrados + smoke manual. Sin RTL de página.
- Definición de hecho de la **implementación futura** (no la marques hecha).

Cada criterio tiene que poder fallar un test o un paso de smoke. Nada de «la UI se siente más clara».

### 2. `design.md`

- Mapa de archivos: qué se edita, qué se crea, qué **no** se toca (`projectTaskProgress`, `common.ts`, `EntityCard`, `paths.ts`, `dashboardHrefs.ts`, `package.json`, vistas 053).
- Tipos: extender `ProjectsQuery`. Firmas de `parseProjectsQuery`, `applyProjectsFilter` (las claves nuevas), `filterProjectsByQuery`, `compareProjects`, helper del resumen, helper de «N vencidas» y `projectsOfProduct(projects, productId)` (orden por nombre, incluye cerrados).
- Snippets cortos del comparador y de la regla `closed`. No un rediseño de `ProjectsPage` línea por línea: puntos de enganche (dónde muere el `useState` de `viewMode`, dónde se va el `useEffect` de quarter, dónde la tarjeta suma la segunda barra).
- Layout: orden DOM filtros → resumen → tabs + sort → contenido. Breakpoint: los controles pasan a `w-full` bajo `sm`, igual que los `Select` actuales.
- Tests nuevos dentro de `filterProjects.test.ts` (o un archivo hermano si el de filtro ya está cargado): casos de D4, D6, D7 (diacríticos), D10 con `now` fijo, D11 (triple empate de nombre estable), regresión 063 (product desconocido no filtra; health/stalled sin settings no filtran; health excluye done/archived). `projectsOfProduct`: incluye `done`/`archived`, ordena por nombre, ignora otro `productId`, y `length` es el conteo.
- Fases que `tasks.md` va a usar: **A** parse/filter/sort → **B** resumen, conteo de vencidas y `projectsOfProduct` → **C** página de proyectos (controles, Plan, tarjetas, quitar el effect) → **D** cabeceras, empty, nombres accesibles, lista en la tarjeta de producto → **E** cierre (smoke, graphify, spec IMPLEMENTADO). A y B pueden ir en paralelo. C espera a ambas. D puede ir en paralelo con C.

### 3. `tasks.md`

Fases A→E, cada una con archivos, comando de verificación y mensaje de commit sugerido (`feat(projects): ... (spec 072)`). TDD en A y B: el test falla antes del código. Después de cada fase: `npx tsc --noEmit` y `npx vitest run --exclude ".worktrees/**"` del archivo tocado. PowerShell: sin `&&`.

### 4. `smoke.md`

Pasos clicables en `/app/projects`, desktop y mobile (~390 px):

- default Plan, sin `view` en la URL;
- buscar con acento;
- combinar producto + prioridad + «Solo estancados»;
- «Mostrar cerrados» off, luego elegir estado Hecho y comprobar que no queda la lista vacía;
- abrir desde Trimestres (`?quarter=`) y ver solo esos proyectos, en Plan;
- abrir desde el dashboard `?status=active`, `?stalled=1`, `?health=red` y ver el control ya puesto;
- recargar y ver los mismos filtros;
- «Limpiar filtros» conserva la tab;
- una fila lleva al proyecto;
- empty de filtros ofrece limpiar;
- empty de cero proyectos en el workspace sigue igual;
- en `/app/products`, un producto con proyectos muestra esos nombres (estado incluido); el nombre abre el proyecto; «N proyectos» abre `?product=`; uno sin proyectos sigue en «Sin proyectos aún.»; con más de 5 aparece «Ver N más». Desktop y mobile.

### 5. `PROMPT-EJECUCION.md`

Lo escribís **al final**, copiando el molde de `specs/066-dashboard-avance-legible/PROMPT-EJECUCION.md`:

- primer mensaje de una conversación nueva que **sí implementa**;
- orden de lectura con paths reales que hayas confirmado;
- baseline `tsc` + `vitest` con `--exclude ".worktrees/**"` + `eslint src`;
- rama `feat/072-vista-proyectos-planeacion`;
- fases A→E;
- las decisiones D1–D28 en corto, para que no se re-pregunten;
- invariantes: schema 23, hrefs 063, `projectTaskProgress` intacto, `EntityCard` intacto, el panel de producto del dashboard intacto, vitest sin `.worktrees/`;
- trampas: el `useEffect` de quarter, el conteo `p.tasks.length`, `Button` sin `type` por defecto, health/stalled sin settings, `closed` ↔ `status`, y la lista de la tarjeta de producto que tiene que incluir cerrados para no desfasar el «N».

No dejes el prompt de ejecución genérico. Tiene que citar las decisiones con su número.

## Cómo trabajar esta conversación

- Leé primero. Después escribí los cinco archivos. No edites `src/`.
- Si una decisión cerrada choca con el código, no la cambies en silencio: decilo en el spec (contexto) y, si es un invariante, **parate y preguntá** esa sola cosa.
- No numerés otra spec. La carpeta es `072-vista-proyectos-planeacion`.
- No corras `graphify update` (no hay cambio de código).

## Definición de hecho de esta conversación

- [ ] `spec.md` con D1–D28, contrato de URL, HU-01…09, fuera de alcance
- [ ] `design.md` con mapa de archivos, firmas y lista de tests
- [ ] `tasks.md` con fases A→E
- [ ] `smoke.md`
- [ ] `PROMPT-EJECUCION.md` listo para pegar en un chat de implementación
- [ ] Cero cambios en `src/`
