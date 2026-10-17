# Spec 077 — Gantt de proyectos: lo hecho y lo que viene

> Estado: **BORRADOR** (rama a crear: `feat/077-gantt-proyectos`)
> Feature dir: `specs/077-gantt-proyectos/` · Fecha: 2026-10-16
> Baseline al empezar: `SCHEMA_VERSION` **26** → **27**
> Depende de: 015 (archivo de tareas), 053 (calendario y helpers `buildCalendarItems`, `lib/dates`), 061 (URL como fuente de verdad + memoria del último query), 065 (`taskUrgency`), 073 (solo `status === "done"` cierra una tarea), 075 (chips de producto/proyecto, `boardProjectRank`, `canonicalBoardSearch`)
> Enmienda: el Gantt figuraba fuera de alcance en 001, 053 (§1.2), 072, 075 (D24) y 076 (D14). Este spec lo trae como **vista de lectura**; el resto de lo que esos specs excluían (dependencias, duración de tarea, arrastrar barras) sigue afuera.
> Principios: **I** (la fecha de cierre viaja en el JSON del proyecto), **II** (el esquema sube de versión con migración), **IV** (claridad: una fila por proyecto, detalle a pedido), **V** (rebanada vertical, sin librerías nuevas)
> Copy de UI en rioplatense, **tuteo**

## 1. Contexto

El usuario quiere ver en una sola pantalla **lo que hizo** (hacia atrás) y **lo que viene** (hacia adelante), proyecto por proyecto, y poder recortar por proyecto.

| Hoy | Falta |
|-----|-------|
| `Project.startDate` / `dueDate` existen (`project.ts:199-200`). | Una vista que los dibuje como barras, una fila por proyecto, a lo largo de meses. |
| `Task.dueDate` existe. | **No hay fecha de cierre.** No existe `completedAt`. `updatedAt` cambia con cualquier edición. |
| El log de actividad guarda `task.statusChanged` (`automations/events.ts:13`). | Tiene tope de 500 entradas para todo el workspace (`ACTIVITY_CAP`): no sirve como histórico. |
| `PortfolioCalendarView` (053, en Trimestres) pinta bandas de proyecto y trimestre. | No filtra por proyecto ni producto, y es un calendario, no un Gantt. |
| El Tablero (075) tiene chips de producto y proyecto con URL canónica. | Nada de eso existe para una vista temporal. |

Toda escritura de un proyecto termina en `persistProject` (`src/store/useDataStore.ts:732`). La usan `saveProject` y `createProject` (kanban, drawer, Tablero, IA, integraciones) y también los caminos que **no** pasan por `saveProject`: `applyFlowResult` (`:805`), las automatizaciones legacy (`:1000`) y `runTemporal` (`:200`). Es el único lugar donde estampar la fecha de cierre sin perseguir cada camino.

## 2. Objetivo

Una página **Gantt** muestra una fila por proyecto con su barra (inicio → vencimiento) sobre una línea de tiempo con el pasado sombreado y una línea de **hoy**. Sobre cada barra, las tareas son puntos: **hechas** en el día en que se cerraron, **pendientes** en su vencimiento, **vencidas** en rojo. Un clic en el proyecto lo despliega con una fila por tarea (layout "C" elegido en el brainstorming). Arriba, chips para elegir productos y proyectos, y una escala de tiempo. La combinación vive en la URL.

Para que "lo hecho" sea real, cada tarea empieza a guardar **cuándo pasó a hecha**.

## 3. Decisiones

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Ruta nueva `ROUTES.gantt = "/app/gantt"`, página lazy. Entra en `NAV` justo después de «Tablero», label **«Gantt»**, ícono `GanttChart` de lucide (si la versión instalada no lo trae, `ChartGantt` o `CalendarRange`). `MOBILE_PRIMARY_NAV` no cambia. | El usuario lo pidió como "diagrama de Gantt"; es el nombre que va a buscar. No desplaza los accesos del celular. |
| **D2** | La vista es **de lectura**. No se arrastran ni redimensionan barras ni puntos. Lo único que edita es abrir `TaskDetailDrawer` (clic en un punto o en una fila de tarea) y el enlace al proyecto. | Objetivo = ver histórico y lo que viene. Editar fechas arrastrando es otro spec. |
| **D3** | `Task` suma `completedAt: IsoDate.nullable().default(null)` y `completedAtEstimated: z.boolean().default(false)`. | Sin esto no hay histórico confiable. El flag distingue lo reconstruido de lo registrado. |
| **D4** | Regla de estampado, función pura `stampTaskCompletions(prev: Project \| null, next: Project, now: string): Project` en `src/domain/taskCompletion.ts`. Por cada tarea de `next`: **(a)** si `status === "done"` y es una **transición** (`prev` es null, `prev` no tenía esa tarea, o la tenía con otro status) → `completedAt = now`, `completedAtEstimated = false`. **(b)** Si `status === "done"` y ya estaba hecha en `prev` → se conservan los dos campos como vienen en `next` (aunque `completedAt` sea null; ver D8). **(c)** Si `status !== "done"` → `completedAt = null`, `completedAtEstimated = false`. Sin cambios, devuelve el mismo objeto `next`. | Solo una transición real fecha un cierre: así un guardado posterior nunca le pone "hoy" a una tarea cerrada hace meses. Volver atrás borra el cierre. Pura → testeable sin store. |
| **D5** | `persistProject` aplica `stampTaskCompletions(previo, p, nowIso())` al **entrar**, antes de actualizar el estado y escribir. `previo` = el proyecto con ese id en `useDataStore.getState().projects` (null si no existe). Así quedan cubiertos `saveProject`, `createProject`, `applyFlowResult`, automatizaciones legacy y `runTemporal`. `saveProject` sigue calculando `diffProjectEvents` como hoy (los eventos no dependen de `completedAt`). Ningún otro módulo escribe `completedAt`. | Decisión de Claude tras la revisión: `saveProject` no es el único camino; los flujos escriben por `persistProject` directo. |
| **D6** | Migración `projects` `{ to: 27 }`: a cada tarea con `status === "done"` y sin `completedAt` le escribe `completedAt = task.updatedAt` y `completedAtEstimated = true`. Al resto, `completedAt: null`, `completedAtEstimated: false`. Los demás kinds suben por el fallback de `migrateRecord`. | Decisión de Claude (el usuario dejó la elección): mejor un histórico aproximado y marcado que uno vacío. |
| **D7** | El log de actividad **no** se usa para refinar fechas. | Decisión de Claude tras la revisión: las entradas no guardan el estado destino de forma estructurada (solo un texto con nombres de etapa renombrables); parsearlo sería frágil. |
| **D8** | Día de cierre que usa el Gantt, función pura `completionDay(task)`: si `completedAt` existe → ese día, estimado = `completedAtEstimated`. Si la tarea está hecha y `completedAt` es null (seed de demo, backup importado a v27, caso D4 b) → día de `updatedAt`, estimado = true. Un punto **estimado** se dibuja hueco con borde verde punteado y tooltip «Fecha aproximada»; uno registrado es verde lleno. El seed de demo (`domain/demo/seed.ts`) carga `completedAt` en sus tareas hechas. | Ninguna tarea hecha desaparece del Gantt, y el usuario ve qué parte del pasado es reconstruida. |
| **D9** | Barra del proyecto: de `startDate` a `dueDate`. Si falta una punta, se completa con las tareas del proyecto: inicio = el día más temprano entre `createdAt` de tareas y `completedAt`; fin = el día más tardío entre `dueDate` y `completedAt`. Una barra con alguna punta derivada se dibuja con borde punteado. Sin fechas propias ni de tareas, la fila muestra «Sin fechas» y ninguna barra. | Muchos proyectos no cargan inicio/vencimiento; igual tienen historia. |
| **D10** | Relleno de avance: la barra muestra en tono fuerte la proporción hechas / total (tareas no archivadas + hechas archivadas, ver D12). Junto al nombre, el contador «hechas/total». | Lectura rápida de cuánto falta. |
| **D11** | Puntos de tareas: **hecha** → en `completionDay` (D8), verde. **Pendiente con `dueDate`** → en `dueDate`, borde de acento; si `dueDate < hoy`, borde rojo (vencida). **Pendiente sin `dueDate`** → sin punto; en la fila desplegada aparece al final con el texto «Sin fecha». | Es lo que el usuario eligió en el boceto. |
| **D12** | Entran tareas no archivadas **y** tareas archivadas que estén hechas. Una pendiente archivada no entra. | Archivar hechas es limpieza del kanban (015); no debe borrar el histórico. |
| **D13** | Proyectos que entran: todos salvo `status === "archived"`. Los `done` **sí** entran. Sin chips de proyecto, se listan los proyectos que tienen barra o algún punto dentro de la ventana visible; los demás no se muestran. | El histórico necesita los proyectos cerrados. Sin filtro, mostrar solo lo que cae en la ventana evita filas vacías. |
| **D14** | Orden de filas: el de la barra lateral, **incluyendo proyectos `done`**. `boardProjectRank` (075) descarta los cerrados, así que se agrega un parámetro opcional `{ includeDone: true }` (default false: el Tablero no cambia) o una variante `ganttProjectRank` con el mismo algoritmo: orden de productos (076), después `sidebarOrder` del grupo; los que no están en la lista van al final del grupo en orden del store. | Decisión de Claude: un proyecto cerrado queda donde estaba en la barra, junto a los de su producto. |
| **D14b** | El selector «+ Proyecto» ofrece todos los proyectos no archivados, con los `done` en un grupo aparte «Cerrados». El selector de producto lista todos los productos. Los parsers/canónicos de 075 se reusan si aceptan ids de proyectos cerrados; si no, versión propia en `src/features/gantt/ganttQuery.ts`. | HU-06: para filtrar el histórico hay que poder elegir proyectos cerrados. |
| **D15** | Fila colapsada = barra + puntos. Varios puntos en el mismo día se juntan en uno con un número. Tooltip / `title` lista los títulos (máx. 5 + «y N más»). Clic en el nombre (o en el chevron) despliega/colapsa; el estado de despliegue es de la sesión (no va a la URL). Un ícono junto al nombre abre el proyecto. | Layout "C": compacto por defecto, detalle a pedido. |
| **D16** | Fila desplegada: una fila por tarea bajo el proyecto, en este orden: hechas por `completedAt` ascendente, después pendientes por `dueDate` ascendente, al final las sin fecha. Clic en el punto o en el título abre `TaskDetailDrawer` del proyecto. | Se lee como historia → futuro. |
| **D17** | Escalas: **Mes** (columna = día, ventana ≈ 6 semanas), **Trimestre** (columna = semana, ventana ≈ 3 meses), **Año** (columna = mes, ventana = 12 meses). Default **Trimestre**. La ventana se centra en hoy al abrir; «‹» / «›» la desplazan un período; «Hoy» vuelve. | Mes para el detalle diario, Año para el histórico largo. |
| **D18** | URL fuente de verdad, `setSearchParams(..., { replace: true })`. Params: `product`, `project` (ids separados por coma, orden lexicográfico, como 075 D11), `scale` (`month`\|`quarter`\|`year`, ausente = `quarter`), `at` (`YYYY-MM-DD` del ancla de la ventana, ausente = hoy). Ids desconocidos o valores inválidos se ignoran. `product` y `project` combinan con AND (075 §5). | Mismo contrato que 061/072/075; un link reproduce la vista. |
| **D19** | Memoria del último query (como 061/072 D4): al entrar sin params se restaura el último de `localStorage` clave `hito.gantt.lastQuery`, **sin** `at` (siempre arranca en hoy). Lectura y escritura en try/catch. | Volver al Gantt con tus proyectos de siempre, sin tener que elegirlos otra vez. |
| **D20** | «Limpiar filtros» borra `product` y `project`. No toca `scale`. | La escala es el marco, no un filtro. |
| **D21** | Layout: columna de nombres fija (sticky) a la izquierda; la grilla de tiempo hace scroll horizontal dentro de su contenedor (nunca el body). Debajo de `sm`, la columna de nombres se angosta y el nombre se trunca con tooltip. Sin arrastre en ningún tamaño. | Celular usable sin un layout aparte. |
| **D22** | Teclado y lectores: cada fila de proyecto es un botón con `aria-expanded`; los puntos son botones con `aria-label` «<título>, hecha el <fecha>» / «vence el <fecha>» / «vencida el <fecha>» / «fecha aproximada». La línea de hoy tiene `aria-hidden`. | Principio IV. |
| **D23** | Toda la lógica (ventana, columnas, posición de barra/punto, agrupado por día, filtro, orden, parseo/canónico de la URL) va en funciones puras en `src/features/gantt/` con tests, sin montar React. Reusar `lib/dates` (`eachDay`, `daysBetween`, `todayKey`, `DayRange`) y `canonicalBoardSearch`/parsers de 075 donde encajen. Render con CSS grid/posicionamiento absoluto. **Sin librerías nuevas.** | Mismo corte que 053/061/075. |
| **D24** | Estado vacío: sin proyectos en la ventana → `EmptyState` «No hay proyectos con fechas ni tareas en este período.» con acción «Ir a hoy» o «Limpiar filtros» según corresponda. | Principio IV: el vacío guía a la siguiente acción. |
| **D25** | Flujos, herramientas de IA, dashboard, informe (052) y export no cambian en este spec. `completedAt` viaja en el JSON pero nadie más lo lee todavía. El chip del asistente en `/app/gantt` dice «Gantt» (`uiContext`). | Rebanada vertical. Consumirlo en métricas es otro spec. |
| **D26** | Quedan afuera: dependencias entre tareas, fecha de inicio/duración de tarea, barras de sprints, trimestres o hitos (milestones) dentro del Gantt, arrastrar para cambiar fechas, vistas guardadas con nombre, exportar el Gantt a imagen/PDF, cambios al calendario de 053 o al Tablero. | Para que el chat que implemente no los agregue. |

## 4. Modelo

`TaskSchema` suma, después de `actualHours`:

```ts
/** Cuándo pasó a `done` (spec 077 D4). null si no está hecha. Lo escribe
 * solo `stampTaskCompletions` en el store. */
completedAt: IsoDate.nullable().default(null),
/** true si `completedAt` se reconstruyó en la migración v27 (D6). */
completedAtEstimated: z.boolean().default(false),
```

`SCHEMA_VERSION` 26 → 27. Paso `projects` `{ to: 27 }` según D6. Los tests que fijan `SCHEMA_VERSION` (p. ej. `migrations.test.ts`, `ai/keys-never-exported.test.ts`) pasan a 27.

## 5. Pantalla

```
[Producto ▾] [Hito App ✕] [Blog SEO ✕] [+ Proyecto]   [Limpiar filtros]   [‹] [Hoy] [›]  [Mes|Trimestre|Año]
┌──────────────────────┬──────────── May ─── Jun ─── Jul ─│─ Ago ─── Sep ─── Oct ─┐
│ ▾ Hito App · 6/10  ↗ │      ███████●═══●═════●══○══│══○═══════                │
│     Modelo de datos  │            ●                │                          │
│     Filtros Gantt    │                        ○(rojo)                         │
│     Exportar PDF     │                             │        ○                 │
│     Docs (Sin fecha) │                             │                          │
│ ▸ Blog SEO · 4/12  ↗ │                  ════●══●═══│══○══════○                │
└──────────────────────┴───── pasado sombreado ───────┴─ hoy ─────────────────────┘
```

Referencia visual: boceto "C" en `.superpowers/brainstorm/*/content/gantt-layout.html`.

## 6. Historias

- **HU-01** Abro Gantt desde el nav y veo, en Trimestre centrado en hoy, una fila por proyecto con barra, puntos verdes de lo hecho y puntos de lo que vence.
- **HU-02** Muevo una tarea a Hecha en el kanban; vuelvo al Gantt y aparece un punto verde lleno en el día de hoy. La regreso a En curso y el punto vuelve a su vencimiento.
- **HU-03** Una tarea que ya estaba hecha antes de actualizar aparece con punto hueco punteado y tooltip «Fecha aproximada».
- **HU-04** Elijo dos proyectos como chips, recargo, y la vista sigue filtrada; salgo y vuelvo al Gantt sin params y se restauran esos dos proyectos.
- **HU-05** Despliego un proyecto, veo sus tareas ordenadas de lo hecho a lo pendiente, hago clic en una y se abre su drawer.
- **HU-06** Cambio a Año y retrocedo un período: veo proyectos cerrados del año pasado con sus tareas hechas.
- **HU-07** Archivo una tarea hecha y sigue en el Gantt; archivo una pendiente y desaparece.
- **HU-08** Un flujo mueve una tarea a Hecha; en el Gantt aparece con punto verde lleno en el día en que corrió el flujo.
- **HU-09** Elijo en «+ Proyecto» un proyecto del grupo «Cerrados» y veo solo su historia.

## 7. Fuera de alcance

Ver D26. Además: cambios a `PortfolioCalendarView`, a `TaskTimelineView`, al Tablero, a Mis tareas o a `/app/projects`.
