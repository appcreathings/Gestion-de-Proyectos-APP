# Spec 072 — Vista de proyectos para planear

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/072-vista-proyectos-planeacion/` · Fecha: 2026-10-05
> Baseline al empezar: `SCHEMA_VERSION` **23** (sin bump — UI + URL)
> Depende de: 063 (contrato de `/app/projects`), 066 (`projectLiveTaskProgress`, `healthSentence`, `ExpandableList`), 061 (filtros de Mis tareas)
> Enmienda: 063 **D15** — `quarter` pasa a filtrar y deja de forzar la vista agrupada. 061 **D4** — una visita a `/app/my-tasks` sin query restaura la última query; un link que ya trae params sigue ganando.
> Principios: **IV** (claridad), **V** (rebanada vertical, sin librerías), **II** (el esquema no se toca)
> Copy de UI en rioplatense, **tuteo**

## 1. Contexto

`/app/projects` es una grilla de tarjetas. Con varios proyectos no se puede planear desde ahí.

| Superficie | Hoy | Hueco |
|------------|-----|--------|
| Filtros con control en la página | Producto y estado (`Select`, URL) | Salud y estancados solo llegan como chip desde el dashboard. No hay búsqueda, prioridad, responsable ni ventana de vencimiento del proyecto. |
| `?quarter=` | `useEffect` en `ProjectsPage` salta a «Por trimestre» y resalta el grupo. No excluye otros trimestres (063 D15). | Elegir un trimestre no achica la lista. |
| Vista | `list` \| `quarter` \| `product` en `useState` | Se pierde al recargar. No está en la URL. |
| `ProjectCard` | Estado, producto, prioridad, barra de checklists, «N áreas · N tareas» | `N tareas` usa `p.tasks.length` (incluye archivadas). No hay salud, fecha ni avance de tareas vivas. |
| Grupos | Conteo + `%` de checklists | El rollup de tareas vivas (066) no aparece. |
| Cerrados | `done` y `archived` entran en «Todos los estados» | La lista de planeación se mezcla con lo cerrado. |
| Orden | El del array del store | No hay orden de atención, fecha o nombre. |
| Productos (`/app/products`) | «N proyectos →» o «Sin proyectos aún.» | El conteo no dice cuáles son. |
| Mis tareas | Filtros solo en la URL (061 D4). El ítem del menú es `ROUTES.myTasks` (`/app/my-tasks`, sin query). | Al irse y volver, persona, estado, prioridad, fecha, proyecto, tipo, hechas y vista vuelven al default. |

El dashboard (063, 066, 067) responde «¿cómo viene el portafolio?». Esta spec responde «¿con qué proyectos trabajo ahora?». El panel «Por producto» del dashboard no se toca.

Callers de `ROUTES.projectsByQuarter`: `QuartersPage` (el link es «N proyectos →», no promete resaltado). El texto se queda. El destino pasa a mostrar solo ese trimestre.

## 2. Objetivo

En `/app/projects` la persona ve una lista compacta, la filtra y la ordena por URL, oculta cerrados por defecto y lee un resumen del conjunto filtrado. En `/app/products` cada tarjeta lista los nombres de sus proyectos. En Mis tareas, volver a la pantalla recupera el último filtro.

## 3. Decisiones

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Tres toques: `ProjectsPage` + `filterProjects`, la tarjeta de `ProductsPage`, y la memoria de query de `MyTasksPage`. Sin rutas nuevas. El panel «Por producto» del dashboard no entra. Mis tareas no se rediseña. | El trabajo es la lista, saber cuáles proyectos tiene un producto, y no rearmar el filtro de tareas al volver. |
| **D2** | URL = fuente de verdad. `setSearchParams(..., { replace: true })`. La página no guarda filtros en `useState`. El input de búsqueda puede tener un borrador hasta el debounce; al cambiar la URL desde afuera, el borrador vuelve al param. | Mismo contrato que 063. Un link del dashboard sigue siendo la lista. |
| **D3** | Params nuevos, todos AND con los de 063: `q`, `priority`, `owner`, `due`, `closed`, `sort`, `view`. Los viejos se quedan: `product`, `status`, `health`, `stalled`, `quarter`. Valor inválido o id desconocido no filtra y no rompe. | Componer filtros. No inventar otro dialecto para `status` / `health`. |
| **D4** | Enmienda 063 D15: `quarter` filtra (`p.quarterId === quarter`) cuando el id existe en los trimestres del workspace. Se borra el `useEffect` que fuerza la vista trimestre. El resaltado del grupo vive solo en `view=quarter`. | Un trimestre tiene que achicar la lista. Forzar la vista agrupada deja un solo grupo y pisa la vista elegida. |
| **D5** | `projectsByQuarter` sigue siendo `/app/projects?quarter=`. No se cambia `paths.ts` ni el copy de Trimestres. | El deep link pasa a significar «estos proyectos». El copy actual no miente. |
| **D6** | Cerrados (`done`, `archived`) ocultos por defecto. `closed=1` los muestra. Elegir estado `done` o `archived` escribe ese `status` y `closed=1`. Apagar «Mostrar cerrados» borra `closed` y, si `status` era `done` o `archived`, también borra `status`. Una URL manual `?status=done` sin `closed` igual muestra los terminados. | Misma trampa que 061 D7. El default sirve para planear. |
| **D7** | `q` busca solo en `project.name`. Trim, sin mayúsculas ni diacríticos (`NFD` + marcas combinantes). Param ausente o vacío = no filtra. Debounce 200 ms y `replace: true`, escribiendo con la forma funcional de `setSearchParams` para no pisar un filtro cambiado durante la espera. | Alcanza para encontrar un proyecto. Tags ensucian los resultados. |
| **D8** | `priority`: `critical` \| `high` \| `medium` \| `low`. El control lista las cuatro. | El dominio ya tiene `critical`. |
| **D9** | `owner` es un id de `people`. No hay usuario «yo». Id desconocido no filtra. Fila sin responsable: «Sin responsable». | La app no tiene sesión de persona (061 D9). |
| **D10** | `due` mira `project.dueDate`. `overdue` = `daysUntil < 0`. `soon` = `0..14` inclusive. `none` = sin fecha. Otro valor se ignora. `now` inyectable. | El horizonte de un proyecto no es el `this-week` del Kanban. |
| **D11** | `sort` ausente = `attention`: salud red → ámbar → verde, luego `dueDate` ascendente con sin fecha al final, luego `localeCompare(name, "es", { sensitivity: "base" })`. Otros: `due`, `name`, `progress` (pct checklists desc, empate pct tareas vivas desc, nombre), `updated` (`updatedAt` desc, nombre). Inválido = `attention`. El mismo comparador ordena la grilla y el interior de cada grupo. Los grupos siguen el orden de trimestres/productos; «Sin trimestre» / «Sin producto» al final. Empate total → `0` (sort estable). | La planeación mira primero lo rojo y lo que vence. |
| **D12** | Salud del orden, del punto y del resumen = `effectiveHealth(p, settings, now)`. Sin `settings`: el punto y el orden usan `p.health`; `health` y `stalled` no filtran; no se muestra «Estancado». | Mismo criterio que el filtro de hoy. La fila no queda sin color. |
| **D13** | `view` ausente o inválido = `plan`. Valores: `plan` \| `list` \| `quarter` \| `product`. Ausencia = plan (URL limpia). Tabs: **Plan · Lista · Por trimestre · Por producto**. | Con muchos proyectos la grilla no se escanea. La grilla actual sigue en Lista. |
| **D14** | Fila Plan: punto de salud, nombre, estado, prioridad, responsable, vencimiento relativo, avance de checklists, avance de tareas vivas, y si aplica «Estancado» y «N vencidas». Producto y trimestre en texto muted. En mobile, identidad arriba y meta abajo. La fila entera es un solo `Link` a `ROUTES.project(id)`. | Datos que ya están en el proyecto. Un solo link. |
| **D15** | «N vencidas» = tareas con `!archived`, `status !== "done"` y `daysUntil(dueDate) < 0`. Si es 0, no se pinta. No cuenta ítems de checklist. Copy: `1 vencida` / `N vencidas`. | Señal de atención, no un segundo Mis tareas. |
| **D16** | Barras: `projectChecklistProgress` y `projectLiveTaskProgress`. Si `total === 0`, se omite esa barra. No usar `projectTaskProgress`. En la tarjeta, el conteo de tareas es `projectLiveTaskProgress(p).total` (no archivadas; las hechas sí cuentan). El conteo de áreas se queda. | Alinea el denominador con 066 D18. |
| **D17** | La vista Lista agrega solo: punto de salud, vencimiento relativo si hay fecha, y la segunda barra de tareas vivas. No agrega responsable, «Estancado» ni «N vencidas». | La tarjeta no se convierte en la fila. |
| **D18** | Cabecera de grupo: «N proyectos» + pct de checklists + pct de tareas vivas (`aggregateChecklistProgress`, `aggregateTaskProgress`). Si `total === 0`, se omite ese pct. | El grupo mentía al mostrar solo checklists. |
| **D19** | Resumen del conjunto filtrado, una línea, entre filtros y tabs: «N proyectos» + tres botones cuyas etiquetas, unidas con ` · `, equivalen a `healthSentence` + «N vencidos» solo si N > 0. Cada botón de salud escribe `health` (si ya estaba, lo borra). «N vencidos» escribe `due=overdue`. Si `filtered.length === 0`, no hay resumen. | Análisis del recorte, no un clon del dashboard. |
| **D20** | Controles, fila con wrap; bajo `sm`, cada uno a `w-full`. Orden: búsqueda, producto, estado, prioridad, responsable, vencimiento, salud, «Solo estancados», «Mostrar cerrados». Sin chips. «Limpiar filtros» si hay alguno de `product`, `status`, `health`, `stalled`, `priority`, `owner`, `q`, `due`, `closed`, `quarter`. Borra esos y `sort`. No borra `view`. | El control que pone el filtro lo saca. Limpiar no cambia la tab. |
| **D21** | `sort` es un `Select` junto a las tabs. `attention` = param ausente. | Separar «qué proyectos» de «en qué orden». |
| **D22** | Lógica pura en `src/features/projects/filterProjects.ts`. `now` y `settings` entran por argumento. Las páginas leen la URL y renderizan. El conteo de la tarjeta de producto sale de `projectsOfProduct`. | Principio V. |
| **D23** | Sin bump de `SCHEMA_VERSION`. Sin vistas guardadas. | Todo cabe en la URL. |
| **D24** | Cero dependencias. Punto de salud = `HealthDot` de `src/components/HealthBadge.tsx`. Barras = `Progress`. Listas largas de producto = `ExpandableList`. | Ya existen. |
| **D25** | Copy tuteo. El empty de `projects.length === 0` no se toca. Empty de filtros: «Ningún proyecto coincide con los filtros actuales.» + botón «Limpiar filtros». | El primer uso sigue invitando a crear. |
| **D26** | Búsqueda y cada `Select` con nombre accesible. Casillas: `Checkbox` (ya es `type="button"`) con `aria-label` igual al texto visible de al lado. Botones de resumen y «Limpiar» con `type="button"`. La fila es un solo link. El punto lleva `aria-hidden` (el estado y la fecha están en texto). | El color no va solo. `Button` no defaulta `type`. |
| **D27** | Sin feature flag. Rollout = merge. Rollback = revert. | Local-first. |
| **D28** | En la tarjeta de producto, debajo de «N proyectos →», los proyectos con ese `productId`: nombre (link al proyecto) y `projectStatusLabel`. El conteo sigue yendo a `projectsByProduct`. La lista incluye `done` y `archived`, orden `localeCompare` es, y su largo es el conteo. No aplica D6. Cero: «Sin proyectos aún.». Más de 5: `ExpandableList`. | El conteo y los nombres tienen que coincidir. |
| **D29** | Mis tareas recuerda la última query en `localStorage` (`hito.myTasks.lastQuery`). Claves, en este orden: `person`, `status`, `priority`, `date`, `project`, `workType`, `done`, `view`. Cada `commit` de la página guarda el canónico. Al entrar a `/app/my-tasks` **sin** ninguna de esas claves, se restaura una sola vez con `replace: true`. Si la URL ya trae alguna, se usa esa y **no** se pisa la memoria (un link del dashboard no borra el filtro guardado). «Limpiar filtros» sigue la regla 061 D11 y lo que queda también se guarda. `localStorage` que lance se ignora. Sin bump de schema. | El menú apunta a la ruta pelada. La URL sigue siendo lo que se ve y lo que se comparte. La memoria solo cubre la vuelta. |

063 D14 se mantiene: con `health` seteado, `done` y `archived` quedan afuera aunque `closed=1`.

## 4. Contrato de URL

Ruta: `/app/projects`

| Param | Ausente significa | Valores válidos | Notas |
|-------|-------------------|-----------------|-------|
| `product` | todos | id de producto | Id desconocido se ignora. |
| `status` | todos los que pasen D6 | `backlog` \| `active` \| `paused` \| `blocked` \| `done` \| `archived` | `done`/`archived` muestran esa fila aunque no haya `closed` (D6). |
| `health` | todas | `green` \| `amber` \| `red` | Sin `settings`, no filtra. Excluye done/archived (063 D14). |
| `stalled` | no | `1` | Sin `settings`, no filtra. |
| `quarter` | todos | id de trimestre | Id desconocido se ignora. Id conocido filtra. No cambia `view`. |
| `q` | no busca | texto | Trim. Vacío tras trim = ausente. |
| `priority` | todas | `critical` \| `high` \| `medium` \| `low` | |
| `owner` | todos | id de persona | Id desconocido se ignora. |
| `due` | todas | `overdue` \| `soon` \| `none` | Sobre `project.dueDate`. `soon` = 0..14. |
| `closed` | ocultar done y archived | `1` | Otro valor = ausente. |
| `sort` | `attention` | `due` \| `name` \| `progress` \| `updated` | `attention` no se escribe. |
| `view` | `plan` | `list` \| `quarter` \| `product` | `plan` no se escribe. |

Params desconocidos se ignoran.

## 5. Pipeline

1. Partir de `projects`.
2. Puerta de cerrados (D6).
3. AND en este orden: producto, estado, salud, estancados, trimestre, prioridad, responsable, vencimiento, `q`.
4. `view` no filtra. El orden es un paso aparte (`compareProjects`), sobre el resultado.

## 6. Qué se pinta

**Fila Plan (D14–D16).** Vencimiento: «vence hoy» / «vence en N días» / «venció hace N días» / «Sin fecha». Barras con `title` en un wrapper (el `Progress` no lo reenvía): «Checklists done/total» y «Tareas done/total».

**Tarjeta Lista (D17).** Meta actual + punto de salud. Fecha relativa solo si hay `dueDate`. Segunda barra solo si hay tareas vivas. Conteo de tareas = `projectLiveTaskProgress.total`.

**Cabecera de grupo (D18).** `N proyectos · checklists P% · tareas P%`, omitiendo cada pct cuyo total sea 0.

**Tarjeta de producto (D28).** El link de conteo se queda. Debajo, la lista.

## 7. Historias

### HU-01 — Filtros se combinan

Dado un portafolio con producto, prioridad, responsable, salud y estancados distintos, cuando la URL trae varios de esos params válidos, la lista muestra la intersección. Un valor inválido o un id desconocido no saca proyectos.

### HU-02 — Cerrados ocultos

Dado proyectos `done` y `archived`, sin `closed` y sin `status` de cerrado, no aparecen. Con `closed=1` aparecen. Con `?status=done` y sin `closed` aparecen solo los terminados. Elegir «Terminado» en el select deja `status=done` y `closed=1`. Apagar «Mostrar cerrados» borra ambos si el estado era `done` o `archived`.

### HU-03 — El trimestre filtra

Dado `?quarter=<id conocido>`, la lista son solo esos proyectos y la tab sigue siendo Plan si `view` no está. Un id desconocido no filtra. No queda un `useEffect` que pise la vista.

### HU-04 — Vista en la URL

Sin `view`, se ve Plan. «Lista», «Por trimestre» y «Por producto» escriben `view` y sobreviven al recargar. Volver a Plan borra `view`.

### HU-05 — Orden

Sin `sort`, rojo antes que ámbar antes que verde; a igualdad de salud, la fecha más próxima; sin fecha al final; a igualdad, nombre es. Los otros cuatro valores ordenan como D11. Dentro de un grupo el orden es el mismo.

### HU-06 — Fila y tarjeta

La fila Plan muestra los campos de D14. «N vencidas» sale solo si hay tareas vivas vencidas. Una barra con total 0 no se renderiza. La tarjeta Lista no muestra responsable ni «Estancado», y su conteo de tareas no incluye archivadas. El click de la fila abre el proyecto. No hay un link adentro de otro.

### HU-07 — Resumen y limpiar

Con resultados, la línea muestra el conteo y la frase de salud equivalente a `healthSentence`. Pulsar «N en rojo» deja `health=red`; pulsarlo de nuevo lo borra. «N vencidos» deja `due=overdue`. Sin resultados no hay línea de resumen y sí el empty con «Limpiar filtros». Limpiar borra los filtros y el orden, y deja la tab.

### HU-08 — Deep links 063

`?status=active`, `?stalled=1`, `?health=red` y `?product=` abren esta página ya filtrada, en vista Plan, con el control correspondiente marcado. `dashboardHrefs` no se edita.

### HU-09 — Nombres en el producto

Una tarjeta con proyectos muestra esos nombres y su estado, incluidos cerrados, ordenados por nombre. El nombre abre el proyecto. «N proyectos» abre `?product=`. El largo de la lista es el número del conteo. Sin proyectos sigue «Sin proyectos aún.». Con más de 5, «Ver N más» en la misma tarjeta.

### HU-10 — Mis tareas recuerda el filtro

Dado que la persona eligió persona, prioridad y vista en Mis tareas, cuando abre otra pantalla y vuelve por el menú a `/app/my-tasks`, la URL recupera esa query y la lista es la misma. Un link que ya trae params (por ejemplo `?person=` desde el dashboard) muestra eso y no mezcla el filtro guardado. Recargar una URL con params no la reescribe desde la memoria. «Limpiar filtros» deja persona, hechas y vista, y la próxima entrada pelada restaura solo eso.

## 8. Fuera de alcance

Vistas guardadas de proyectos, edición masiva, drag, Gantt o calendario (053), otro árbol de productos, rediseño del dashboard, del detalle o de Overview, rediseño de Mis tareas más allá de D29, filtro por tag, cambiar `projectTaskProgress` o `paths.ts` o `dashboardHrefs` o la API de `EntityCard`, virtualizar, tests de página con React Testing Library, dependencias npm, bump de schema.

## 9. Verificación

Tests unitarios en `filterProjects.test.ts` (design §8) y en `filterMyTasks.test.ts` (design §10). Smoke manual en `smoke.md`. Sin RTL de página.

## 10. Definición de hecho (implementación)

- [ ] D1–D29 en código
- [ ] Tests del design §8 verdes
- [ ] `npx tsc --noEmit` verde
- [ ] `npx vitest run --exclude ".worktrees/**"` verde
- [ ] `npx eslint src` sin errores nuevos en los archivos tocados
- [ ] `smoke.md` recorrido
- [ ] `graphify update .`
- [ ] Este encabezado pasa a **IMPLEMENTADO**
