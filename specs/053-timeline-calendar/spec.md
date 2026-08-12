# Spec 053 — Vista línea de tiempo / calendario

> Estado: **SOLO DOCUMENTADO** (planning). No se toca `src/`. Ejecutable en otra conversación.
> Feature dir: `specs/053-timeline-calendar/` · Fecha: 2026-08-11
> Roadmap: `timeline-calendar` en `src/features/releases/data/roadmap.ts`
>   («Ver vencimientos y sprints en un eje temporal, no solo columnas Kanban»).
> Antecede: spec 008 (sprints + fechas + `SprintSwitcher`), 010/017 (Kanban + vista lista),
> `collectDatedEntities` / `daysUntil` / `formatRange` / `react-day-picker`.
> Baseline al empezar: **1096 tests en 109 archivos**, `SCHEMA_VERSION` **19**, sin lib de Gantt.
> Principios: **IV** diseño limpio (una vista más, no un producto paralelo), **V** incremental
> (calendario de vencimientos primero; Gantt con dependencias fuera).

## 1. Contexto

Hoy el trabajo con fechas vive **disperso** y siempre se mira **en columnas de estado**:

| Superficie | Qué muestra | Qué no da |
|------------|-------------|-----------|
| Kanban / lista (`TasksTab`) | Estado, sprint scope, due en la card | Eje temporal de la semana |
| `SprintSwitcher` | Rango del sprint activo (`formatRange`) | Dónde caen las tareas *dentro* del rango |
| Dashboard / portfolio | Vencidos y por vencer globales | Planificación *dentro* de un proyecto |
| Daily / Mis tareas | Cortes personales o standup | Calendario del proyecto |
| `Milestone` en schema | Modelo existe | **Sin UI** (grep en features = 0) |

El PM que planifica la semana necesita responder de un vistazo:

- ¿Qué vence **lunes–viernes**?
- ¿Qué **sprint** cubre estos días?
- ¿Hay un hueco o un atasco de fechas el mismo día?

Eso no se ve en cuatro columnas Kanban. El roadmap lo pide explícitamente
(`timeline-calendar`, horizon `later`).

Specs **001** y **017** dejaron fuera *«Diagramas de Gantt / dependencias entre tareas»*. Esta
spec **respeta** ese límite: no introduce red de dependencias ni ruta crítica. Introduce un
**calendario / eje temporal de vencimientos y sprints** — el 80 % del valor de planificación
semanal con una fracción del costo de un Gantt.

### 1.1 Qué reutilizamos

- `Task.dueDate`, `Task.sprintId`, `Sprint.startDate` / `endDate` / `status` (008).
- `Project.startDate` / `dueDate`.
- Helpers: `todayKey`, `daysBetween`, `formatDay`, `relativeDay`, `formatRange` (`lib/dates.ts`).
- UI de fecha: `Calendar` (`react-day-picker` + locale `es`), ya en formularios.
- Toggle de vista en `TasksTab`: hoy `"kanban" | "list"` + `localStorage` `kanban-view-mode`.
- `TaskDetailDrawer` para abrir detalle sin salir de la vista.
- Filtros existentes: sprint scope, búsqueda, área (`?area=`), no archivadas.

### 1.2 Qué no es esta spec

- Gantt con dependencias, holgura, ruta crítica, resource leveling.
- Drag de *duración* de tarea (las tareas **no** tienen `startDate`; solo `dueDate`).
- Vista de portafolio multi-proyecto en un solo calendario (follow-up; Mis tareas / dashboard
  cubren parte del dolor).
- UI de milestones (el schema existe; activarlos es otra feature).
- Sincronización con Google Calendar / ICS (local-first; export ICS podría ser follow-up).

## 2. Objetivo

Que en el tab **Tareas** de un proyecto el PM pueda cambiar a una vista **Calendario** (y una
franja **Línea de tiempo** compacta) y ver **vencimientos de tareas** y **rangos de sprints**
sobre un eje de días — ideal para planificar la semana — sin abandonar filtros, drawer ni
modelo de datos actual.

## 3. Decisiones fijadas (no re-preguntar)

1. **Alcance v1 = un proyecto** (tab Tareas). No página global nueva en el rail.
2. **Tercer modo de vista:** `viewMode: "kanban" | "list" | "calendar"`. Persistencia en
   `localStorage` (misma clave o clave nueva `tasks-view-mode` con migración desde
   `kanban-view-mode`).
3. **Dos sub-modos dentro de Calendario** (toggle local, default **Semana**):
   - **Semana** — 7 columnas (lun–dom o según locale), foco “planificar la semana”.
   - **Mes** — grilla mensual clásica.
4. **Franja Timeline** opcional *sobre* la grilla (o pestaña hermanada “Línea”): eje horizontal
   de ~2–6 semanas con **barras de sprint** y **chips de tarea en su dueDate**. Si el esfuerzo
   aprieta, la franja puede ser Fase 2; Semana+Mes son el MVP de aceptación.
5. **Eventos en el calendario:**
   - Tarea con `dueDate` → chip en ese día (color por estado o prioridad).
   - Sprint con `startDate`+`endDate` → banda/rango en los días que cubre (no es “evento de un
     solo día”).
   - Due del proyecto → marcador distinto (outline) si cae en el rango visible.
6. **Tareas sin fecha:** panel lateral o sección **“Sin fecha”** (lista compacta), no inventar
   fecha. Mismo espíritu que backlog.
7. **Respetar sprint scope** del `SprintSwitcher`: si el scope es un sprint, la grilla sigue
   mostrando el rango del sprint resaltado y solo las tareas de ese scope (como Kanban).
8. **Click en chip de tarea** → abre `TaskDetailDrawer` (mismo que Kanban). Click en banda de
   sprint → opcional: enfocar ese sprint en el switcher.
9. **Reprogramar (v1 mínimo):** desde el drawer se sigue cambiando `dueDate`. **Drag de chip a
   otro día** para cambiar `dueDate` es **deseable en la misma spec si cabe** (Fase 2 de
   tasks); si no, queda como CA opcional marcado.
10. **Sin schema bump.** No hay `Task.startDate` en v1.
11. **Sin dependencias npm nuevas** si `react-day-picker` + CSS grid bastan; no FullCalendar.
12. **Archivadas y done:** por defecto **ocultar archivadas**; tareas `done` con due en el rango
    se pueden mostrar atenuadas o filtrarse con toggle “Mostrar hechas” (default off).

## 4. Historias de usuario y criterios de aceptación

### HU-01 — Ver la semana del proyecto en un calendario

Como PM, quiero abrir el proyecto y ver qué vence esta semana sin pasar tarjeta por tarjeta.

- **CA-01.1** En Tareas hay un control de vista con al menos tres opciones: Kanban, Lista,
  **Calendario** (iconos + `aria-label` / tooltip).
- **CA-01.2** Al elegir Calendario, por defecto se muestra la **semana que contiene hoy**
  (navegación prev/next semana y “Hoy”).
- **CA-01.3** Cada tarea no archivada del scope actual con `dueDate` en esa semana aparece
  como chip en su día (título truncado, estado o prioridad visible).
- **CA-01.4** Los sprints con rango que intersecta la semana se indican visualmente (banda
  bajo el header de días o barra de fondo en las celdas del rango), con nombre del sprint.
- **CA-01.5** Si el due del proyecto cae en la semana, se marca de forma distinguible.
- **CA-01.6** Días sin ítems se ven vacíos (no placeholders falsos de “0 tareas” ruidosos).

### HU-02 — Cambiar a vista mes y navegar

- **CA-02.1** Toggle **Semana | Mes** dentro del modo calendario.
- **CA-02.2** En mes, chips por día; si hay más de N (p. ej. 3) en un día, “+K más” y al
  expandir/día seleccionado se listan todas.
- **CA-02.3** Prev/next mes y “Hoy” re-centran el rango.

### HU-03 — Coherencia con sprint scope y filtros

- **CA-03.1** Con scope = sprint X, solo se listan tareas de ese sprint (y bandas: al menos la
  de X; otras sprints pueden mostrarse tenues como contexto o ocultarse — **decisión design:
  mostrar todas las bandas de sprint del proyecto como contexto, filtrar solo chips de tarea**).
- **CA-03.2** Búsqueda y filtro de área aplican a los chips (igual semántica que lista/kanban).
- **CA-03.3** “Sin fecha”: las tareas del scope sin `dueDate` no desaparecen del producto —
  hay un cajón/listado accesible “Sin fecha (N)”.

### HU-04 — Abrir y actuar sin cambiar de paradigma

- **CA-04.1** Click en chip → `TaskDetailDrawer` con la tarea correcta.
- **CA-04.2** Desde el drawer, cambiar due/status se refleja al cerrar/actualizar sin recargar
  la página.
- **CA-04.3** Crear tarea (botón existente) sigue disponible; si se crea con due en el rango
  visible, aparece el chip.

### HU-05 — Línea de tiempo compacta (sprint + dues)

Como PM, quiero ver 4 semanas en un eje y las barras de sprint encima de los puntos de
vencimiento.

- **CA-05.1** Existe una subvista o sección **“Línea de tiempo”** (junto a Semana/Mes o debajo)
  con eje de días, **barras** por sprint (`startDate`–`endDate`) y **marcadores** por tarea con
  due.
- **CA-05.2** Hover/focus en barra o marcador muestra nombre y fechas (tooltip o title).
- **CA-05.3** Si un sprint no tiene ambas fechas, no se dibuja barra (o se dibuja solo el
  extremo conocido — design: **requiere ambas fechas**).
- **CA-05.4** Si el esfuerzo de HU-05 compite con HU-01/02, se implementa en fase posterior de
  la misma spec pero **no se borra del alcance documentado**.

### HU-06 — Reprogramar arrastrando (opcional de cierre)

- **CA-06.1** Arrastrar un chip de un día a otro actualiza `dueDate` vía `mutate` /
  `ops.updateTask` y queda persistido.
- **CA-06.2** No se puede soltar en un sitio que no sea día (cancel = sin cambio).
- **CA-06.3** Si no entra en el primer ship, queda explícito en Progreso como pendiente; el
  resto de la spec puede cerrarse sin esto.

## 5. Contenido visual (contrato)

### Chip de tarea

- Título (1 línea, truncate)
- Indicador de estado (dot o borde) y/o prioridad
- Opcional: inicial del assignee si hay espacio
- `aria-label`: “{título}, vence {formatDay}, {estado}”

### Banda de sprint

- Nombre + color suave por sprint (paleta estable por id hash o índice)
- Tooltip: `formatRange(start, end)` + goal truncado

### Estados vacíos

- Proyecto sin ninguna fecha ni sprint con fechas: empty state
  “No hay vencimientos ni sprints con fechas — cargá fechas en tareas o en el sprint.”
- Scope con tareas pero todas sin due: calendario vacío + cajón “Sin fecha” lleno.

## 6. Roadmap de implementación

| Fase | Entrega |
|------|---------|
| **0** | Modelo puro: ítems de calendario/timeline a partir de `Project` + rango visible |
| **1** | UI modo Calendario semana + mes + navegación + chips + bandas sprint + sin fecha |
| **2** | Integración filtros/scope/drawer + persistencia viewMode |
| **3** | Línea de tiempo horizontal (HU-05) |
| **4** | Drag reprogramar (HU-06) si hay margen; cierre tests/docs |

## 7. Fuera de alcance (documentado)

- Dependencias entre tareas / Gantt clásico (001, 017).
- `Task.startDate` y barras de duración de tarea.
- Calendario multi-proyecto en `/app`.
- Export ICS / sync Google.
- CRUD de milestones en esta vista.
- Timezone por proyecto (día local del dispositivo, igual que el resto de Hito).

## 8. Archivos clave (previsto)

| Área | Archivos |
|------|----------|
| Modelo puro | **nuevo** `src/features/projects/calendar/buildCalendarItems.ts` (+ test) |
| UI | **nuevo** `TaskCalendarView.tsx`, `TaskTimelineView.tsx`, celdas/chips |
| Integración | `TasksTab.tsx` (toggle 3 modos), posible extracción del toggle |
| Fechas | `src/lib/dates.ts` (helpers de rango de semana/mes si faltan) |
| Estilos | Tailwind; reutilizar tokens de `calendar.tsx` donde aporte |

## 9. Verificación

1. `typecheck` + `lint` + `test` + `build`.
2. Tests del builder: tareas en rango, fuera de rango, sprint parcial, scope sprint, archivadas.
3. Smoke: semana con 3 dues + 1 sprint; mes; abrir drawer; cambiar a kanban y volver.
4. Actualizar Progreso + roadmap `timeline-calendar` al shippear; `graphify update .`.

## 10. Progreso

- **Estado general: 📝 Solo documentado (2026-08-11).** Spec + design + tasks listos.
- Código de producto no implementado en esta pasada (solo enlace de roadmap a 053 si se
  actualiza).
