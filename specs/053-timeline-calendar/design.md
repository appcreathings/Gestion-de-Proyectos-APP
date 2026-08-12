# Design 053 — Vista línea de tiempo / calendario

Diseño técnico de la spec 053. Anclado al código post-008/017:
`TasksTab` con `viewMode` kanban|list, sprints embebidos, `Task.dueDate` sin `startDate`.

Principio: **agregar un renderer temporal**, no un subsistema de scheduling. El Kanban sigue
siendo el hogar del estado; el calendario es el hogar del *cuándo*.

---

## 0. Mapa de archivos (previsto)

| Área | Archivos | Naturaleza |
|------|----------|------------|
| Puro | **nuevo** `features/projects/calendar/buildCalendarItems.ts` (+ test) | Rango → ítems |
| Puro | **nuevo** `features/projects/calendar/dateRange.ts` (+ test) | week/month bounds |
| UI | **nuevo** `TaskCalendarView.tsx`, `CalendarDayCell.tsx`, `CalendarEventChip.tsx` | Grilla |
| UI | **nuevo** `TaskTimelineView.tsx` | Eje horizontal |
| UI | **nuevo** `UnscheduledTasksPanel.tsx` | Sin fecha |
| Integración | `TasksTab.tsx` | 3er modo + wiring |
| Opcional | `lib/dates.ts` | `startOfWeek`, `addDays`, `eachDay` si no existen |

**Sin** cambios de schema, migraciones, storage, ni deps npm.

---

## 1. Modelo de ítems (puro)

```ts
export type CalendarItemKind = "task" | "sprint" | "projectDue";

export interface CalendarRange {
  /** Inclusive YYYY-MM-DD */
  start: string;
  end: string;
}

export interface CalendarTaskItem {
  kind: "task";
  id: string;          // taskId
  title: string;
  day: string;         // dueDate
  status: TaskStatus;
  priority: Priority;
  sprintId: string | null;
  areaId: string | null;
  assigneeId: string | null;
  archived: boolean;
}

export interface CalendarSprintItem {
  kind: "sprint";
  id: string;
  name: string;
  start: string;
  end: string;
  status: SprintStatus;
  goal: string;
}

export interface CalendarProjectDueItem {
  kind: "projectDue";
  id: string; // projectId
  name: string;
  day: string;
}

export interface CalendarModel {
  range: CalendarRange;
  tasks: CalendarTaskItem[];
  sprints: CalendarSprintItem[];
  projectDue: CalendarProjectDueItem | null;
  unscheduled: CalendarTaskItem[]; // dueDate null; day unused
}
```

### 1.1 Builder

```ts
export interface BuildCalendarInput {
  project: Project;
  range: CalendarRange;
  /** Same as SprintSwitcher: "all" | "backlog" | sprintId */
  sprintScope: SprintScope;
  /** Lowercase query; empty = no filter */
  searchQuery: string;
  areaId: string | null;
  includeDone: boolean; // default false
  now?: Date; // unused for filter; useful for “is overdue” flags later
}

export function buildCalendarModel(input: BuildCalendarInput): CalendarModel
```

**Reglas de inclusión de tareas (chips):**

1. `!task.archived`
2. Si `!includeDone` → `task.status !== "done"`
3. Sprint scope: idéntico a `TasksTab` (misma función extraída si hoy está inline — **DRY**:
   sacar `taskMatchesSprintScope(task, scope)` a un helper compartido kanban/calendar).
4. Área: `!areaId || task.areaId === areaId`
5. Search: título/summary/tags como en Kanban (reutilizar la misma predicado si existe).
6. Con `dueDate`:
   - si `dueDate` ∈ [range.start, range.end] → `tasks[]`
   - si `dueDate == null` → `unscheduled[]` (siempre que pase 1–5; el panel no depende del
     range visible)
7. Fuera de range con fecha → no entra a `tasks` ni a unscheduled.

**Sprints (bandas):** todos los `project.sprints` con `startDate && endDate` que **intersecten**
el range:

```
sprint.start <= range.end && sprint.end >= range.start
```

(no filtrar bandas por sprintScope — contexto visual; CA-03.1 design).

**Project due:** si `project.dueDate` en range → un `CalendarProjectDueItem`.

### 1.2 Rangos de navegación (`dateRange.ts`)

```ts
/** Lunes como inicio de semana (ISO), en calendario local. */
export function weekRangeContaining(dayKey: string): CalendarRange;
export function monthRangeContaining(dayKey: string): CalendarRange; // 1er–último día del mes
export function shiftRange(range: CalendarRange, unit: "week" | "month", delta: number): CalendarRange;
export function eachDay(range: CalendarRange): string[]; // lista YYYY-MM-DD inclusive
export function intersects(a: CalendarRange, b: CalendarRange): boolean;
```

Implementar con `parseDayKey` local (copiar patrón privado de `dates.ts` o **exportar**
helpers desde `lib/dates.ts` para no duplicar — preferible extender `lib/dates.ts`).

**Semana ISO (lunes):** consistente con `weekKey` en `dates.ts`. No usar domingo-first USA.

---

## 2. UI — `TaskCalendarView`

### 2.1 Props

```tsx
interface TaskCalendarViewProps {
  project: Project;
  people: Person[];
  sprintScope: SprintScope;
  searchQuery: string;
  areaId: string | null;
  includeDone: boolean;
  onToggleIncludeDone: () => void;
  onOpenTask: (taskId: string) => void;
  onFocusSprint?: (sprintId: string) => void;
  /** Para drag reprogramar (Fase 4) */
  onMoveTaskDue?: (taskId: string, newDue: string) => void;
}
```

Estado local:

- `anchorDay: string` (un día del rango visible; default `todayKey()`)
- `density: "week" | "month"` (default `"week"`)
- `showTimeline: boolean` (default `true` en desktop, `false` en mobile — o timeline siempre
  debajo en Fase 3)

### 2.2 Layout semana

```
[ < Semana ]  7–13 jul 2026  [ Semana > ]  [ Hoy ]   ( Semana | Mes )
---------------------------------------------------------
| lun 7 | mar 8 | mié 9 | jue 10 | vie 11 | sáb 12 | dom 13 |
| bandas de sprint (row span visual)                         |
| chips...| chips |     | chips  |        |        |        |
---------------------------------------------------------
Sin fecha (3)  [lista compacta colapsable]
```

- CSS grid `grid-cols-7`.
- Header sticky con nombre corto del día + número.
- Hoy: ring o `bg-primary/5` en la columna.
- Overdue (day < today && task not done): chip con borde destructive sutil.

### 2.3 Layout mes

- Grid 7 columnas × 5–6 filas (incluye días del mes adyacente en muted, sin chips fuera de
  mes **o** chips solo del mes actual — **decisión: solo días del mes actual en celdas
  activas; padding days vacíos muted**).
- Max 3 chips visibles + “+N”; click en el día selecciona y muestra lista en panel inferior.

### 2.4 Chips

`CalendarEventChip`:

- `button` type, focus ring, truncate.
- Color izquierdo por `status` (reusar semántica visual del kanban si hay tokens; si no,
  `border-l-2` + badge de prioridad).
- No usar el `Calendar` de day-picker para la grilla principal (está pensado para pickers).
  Day-picker **sí** puede usarse solo si simplifica el mes — pero un grid propio es más
  controlable para chips densos.

### 2.5 Bandas de sprint

Opciones:

| A. Fila encima de chips | B. Fondo en celdas del rango |
|-------------------------|------------------------------|
| Más legible nombre      | Más compacto                 |

**Decisión: A** en semana (una fila de “lanes” con `position`/grid column span). En mes, B
sutil (border-top color en celdas del rango) + leyenda de sprints bajo el header.

Cálculo de columna span en semana:

```
colStart = daysBetween(range.start, sprint.start) + 1  // clamp 1..7
colEnd   = daysBetween(range.start, sprint.end) + 1    // clamp 1..7
```

Si el sprint empieza antes de la semana, colStart = 1; si termina después, colEnd = 7.

### 2.6 Panel sin fecha

`UnscheduledTasksPanel`: collapsible, cuenta N, lista botones que llaman `onOpenTask`.
No permite “asignar fecha” inline en v1 (se hace en drawer) salvo drag futuro desde el panel
hacia un día (Fase 4 nice-to-have).

---

## 3. UI — `TaskTimelineView` (HU-05)

Rango default: **desde start de la semana actual hasta +4 semanas** (28 días), navegable.

```
        |---- Sprint 12 ----|  |-- Sprint 13 --|
  ·  ·  ●     ●        ●            ●     ·
 lun…                                           →
```

- Contenedor `overflow-x-auto`, ancho min por día ~28–32px.
- Fila 0: ticks de días (1 cada 7 = etiqueta de semana).
- Filas 1..S: una barra por sprint (`left%` / `width%` por `daysBetween`).
- Fila final: marcadores absolutos por task.day.
- Click marcador → `onOpenTask`.

Fórmulas:

```
offset = daysBetween(range.start, day)
left = (offset / totalDays) * 100%
widthSprint = ((daysBetween(s,e)+1) / totalDays) * 100%
```

---

## 4. Integración en `TasksTab`

### 4.1 viewMode

```ts
type TasksViewMode = "kanban" | "list" | "calendar";
const STORAGE_KEY = "tasks-view-mode"; // nuevo

// migración:
// const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem("kanban-view-mode");
```

UI del toggle: tres botones `LayoutGrid` | `List` | `CalendarDays` (lucide), `aria-pressed`.

### 4.2 Render

```tsx
{viewMode === "kanban" && ( ... existing ... )}
{viewMode === "list" && ( <KanbanListView ... /> )}
{viewMode === "calendar" && (
  <TaskCalendarView
    project={project}
    people={people}
    sprintScope={scope}
    searchQuery={debouncedQuery}
    areaId={areaFilterId}
    includeDone={includeDone}
    onOpenTask={(id) => { /* set drawer task */ }}
    onFocusSprint={(id) => setScope(id)}
    onMoveTaskDue={handleMoveDue} // si Fase 4
  />
)}
```

DndContext del kanban **no** debe envolver el calendario (evitar sensores peleando). Hoy el
Dnd envuelve todo el tab — **acotar** el `DndContext` solo al branch kanban (refactor
prudente en la misma spec).

### 4.3 Drawer

Reutilizar estado de detalle existente en `TasksTab` (`detailTask` / focus). Si el calendario
solo tiene `taskId`, resolver `project.tasks.find`.

### 4.4 Reprogramar drag (Fase 4)

Sin dnd-kit obligatorio: HTML5 drag o pointer events simples.

```ts
function handleMoveDue(taskId: string, newDue: string) {
  mutate((p) => {
    const t = p.tasks.find(x => x.id === taskId);
    if (!t || t.dueDate === newDue) return p;
    return ops.updateTask(p, { ...t, dueDate: newDue });
  });
}
```

Drop target = celda con `data-day={dayKey}`.

---

## 5. Accesibilidad

- Navegación de rango con botones etiquetados (“Semana anterior”).
- Chips son `button`, no `div` clickable.
- En mes, no depender solo del color para “hoy” / “vencido”.
- Timeline: teclado al menos tab a marcadores; si es costoso, documentar como mejora y
  garantizar click + title.

---

## 6. Performance

- `buildCalendarModel` en `useMemo` deps: project, range, scope, query, area, includeDone.
- Proyectos con cientos de tareas: filtrar por range en O(n) una pasada — OK.
- No virtualizar en v1 salvo que el mes con 31×N se trabe (improbables N grandes por día).

---

## 7. Tests

| Módulo | Casos |
|--------|--------|
| `weekRangeContaining` | lunes–domingo correctos alrededor de un miércoles |
| `monthRangeContaining` | feb 2026, etc. |
| `buildCalendarModel` | task in/out range; archived excluded; done excluded default; sprint intersect; unscheduled; area filter; sprint scope backlog |
| (opcional) chip list length “+N” | unit del helper `partitionDayChips(items, max)` |

Sin jsdom obligatorio para el core.

---

## 8. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| DndContext global rompe clicks del calendar | Acotar Dnd al kanban |
| Sobrecarga visual en mes | Cap 3 chips + “+N” |
| Usuario espera Gantt de duración | Empty copy + docs: “marcamos vencimientos, no duración” |
| Sprint sin fechas | No banda; switcher ya muestra “sin fechas” vía formatRange parcial — no crashear |
| Timezone | Solo day keys locales, igual que el resto de la app |

---

## 9. Secuencia

1. Helpers de rango + builder + tests  
2. Toggle 3 modos + `TaskCalendarView` semana  
3. Mes + sin fecha + bandas sprint  
4. Wiring drawer/filtros + Dnd acotado  
5. Timeline  
6. Drag due (opcional) + cierre  

Ver `tasks.md`.
