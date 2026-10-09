# Design 073 — Etapas del kanban y árbol de proyectos

> Autoridad: `spec.md` (D1–D15, HU-01…07). Si este archivo y el spec chocan, gana el spec.
> Snippets de esta página. `SCHEMA_VERSION` **23 → 24**.

## 0. Mapa de archivos

| Archivo | Qué |
|---------|-----|
| `src/domain/kanbanStages.ts` | **Nuevo.** Paleta, defaults, `normalizeStages`, nombre, etiqueta, columnas del tablero, punto de color |
| `src/domain/kanbanStages.test.ts` | **Nuevo.** Casos §8 |
| `src/domain/schemas/common.ts` | `SCHEMA_VERSION = 24`. El enum `TaskStatus` se queda (cuatro id base) |
| `src/domain/schemas/project.ts` | `Project.stages`. `Task.status` pasa a `string` |
| `src/domain/factories.ts` | `newProject` escribe `DEFAULT_STAGES` |
| `src/domain/migrations.ts` | Paso `projects` `{ to: 24 }` |
| `src/domain/migrations.test.ts` | El default del registry deja de ser v23. Caso v23 → v24 |
| `src/domain/projectOps.ts` | `addStage`, `renameStage`, `recolorStage`, `moveStage`, `removeStage` |
| `src/ai/keys-never-exported.test.ts` | El pin `SCHEMA_VERSION === 23` pasa a 24 |
| `src/features/projects/components/TasksTab.tsx` | Columnas desde `boardColumns`. Alta, borrado, archivo de Hecha. Flechas al vecino |
| `src/features/projects/components/kanban/KanbanColumn.tsx` | Nombre, punto, menú. WIP solo en id base |
| `src/features/projects/components/kanban/KanbanColumnPager.tsx` | Pills por etapa + «+» |
| `src/features/projects/components/kanban/columnScroll.ts` | El desempate usa el orden que le pasan |
| `src/features/projects/components/kanban/KanbanListView.tsx` | Badge con `stageLabel` |
| `src/features/projects/components/kanban/ArchivedTasksList.tsx` | Igual |
| `src/features/projects/components/kanban/TaskDetailDrawer.tsx` | Select de `project.stages` |
| `src/features/projects/components/TaskFormDialog.tsx` | Igual |
| `src/features/my-tasks/filterMyTasks.ts` | `status=otras` |
| `src/features/my-tasks/filterMyTasks.test.ts` | Casos §8.3 |
| `src/features/my-tasks/MyTasksPage.tsx` | Opción «Otras etapas» y `stageLabel` |
| `src/automations/activity.ts` | `task.statusChanged` usa `stageLabel` |
| `src/features/projects/calendar/buildCalendarItems.ts` | `statusLabel` |
| `src/features/projects/calendar/TaskCalendarView.tsx` | Muestra `statusLabel` |
| `src/features/projects/calendar/PortfolioCalendarView.tsx` | Igual |
| `src/features/reports/statusReport.ts` | `statusLabel` en la fila |
| `src/features/reports/statusReportMarkdown.ts` | Imprime `statusLabel` |
| `src/components/layout/ProjectTree.tsx` | Fila «Proyectos» y abrir/cerrar todos |

No se toca: `wipLimits`, el color de `TaskCard` (spec 065), `ActionConfigFields` (sigue en `TASK_COLUMNS`), las herramientas de IA que tipan el status con el enum `TaskStatus`, `package.json`.

`taskStatusLabel` y `TASK_COLUMNS` se quedan. Son el fallback de los cuatro id base y el catálogo de flujos e IA. Dejan de ser la fuente del tablero.

Reusar: `Dialog` / `DialogContent` / `DialogTitle` (`@/components/ui/dialog`), `DropdownMenu` (`@/components/ui/dropdown-menu`), `Input`, `Button`, `uuid` de `@/lib/utils`. Sin librerías nuevas. PowerShell: sin `&&`.

## 1. `kanbanStages.ts`

```ts
import type { Project, Task } from "./schemas";

export const STAGE_COLORS = [
  "slate", "blue", "amber", "green", "rose", "violet", "teal", "orange",
] as const;
export type StageColor = (typeof STAGE_COLORS)[number];

export const BUILTIN_STAGE_IDS = ["todo", "doing", "blocked", "done"] as const;
export type BuiltinStageId = (typeof BUILTIN_STAGE_IDS)[number];

export interface KanbanStage {
  id: string;
  name: string;
  color: StageColor;
}

export const DEFAULT_STAGES: KanbanStage[] = [
  { id: "todo", name: "Por hacer", color: "slate" },
  { id: "doing", name: "En curso", color: "blue" },
  { id: "blocked", name: "Bloqueada", color: "amber" },
  { id: "done", name: "Hecha", color: "green" },
];

const STAGE_DOT: Record<StageColor, string> = {
  slate: "bg-muted-foreground",
  blue: "bg-info-soft-foreground",
  amber: "bg-warning-soft-foreground",
  green: "bg-success-soft-foreground",
  rose: "bg-destructive-soft-foreground",
  violet: "bg-violet-500",
  teal: "bg-teal-500",
  orange: "bg-orange-500",
};

export function isBuiltinStageId(id: string): id is BuiltinStageId {
  return (BUILTIN_STAGE_IDS as readonly string[]).includes(id);
}

export function isDoneStatus(status: string): boolean {
  return status === "done";
}

export function stageDotClass(color: StageColor): string {
  return STAGE_DOT[color];
}

export function foldStageName(name: string): string {
  return name.trim().toLocaleLowerCase("es");
}

/** null = válido. El input de la UI lleva maxLength={40}. */
export function stageNameError(
  stages: readonly KanbanStage[],
  name: string,
  ignoreId?: string,
): "empty" | "duplicate" | null {
  const folded = foldStageName(name);
  if (!folded) return "empty";
  const taken = stages.some(
    (s) => s.id !== ignoreId && foldStageName(s.name) === folded,
  );
  return taken ? "duplicate" : null;
}

export function nextStageColor(stages: readonly KanbanStage[]): StageColor {
  const used = new Set(stages.map((s) => s.color));
  return STAGE_COLORS.find((c) => !used.has(c)) ?? "slate";
}
```

`normalizeStages` (pura, copia siempre; no muta el input):

1. Si `input` no es un array, o después de filtrar no queda nada usable, devolver una copia de `DEFAULT_STAGES`.
2. Un elemento usable tiene `id` string no vacío. Nombre: string recortado, o el de fábrica si el id es base y el nombre queda vacío, o `"Etapa"` si es custom. Recortar a 40. Color fuera de `STAGE_COLORS` → `slate`.
3. Ids repetidos: gana el primero.
4. Cada id de `BUILTIN_STAGE_IDS` que falte se inserta, con su nombre y color de fábrica, en el índice que tenía en `DEFAULT_STAGES` (recorrido de izquierda a derecha sobre el array ya deduplicado).
5. Si `done` no está al final, se mueve al final.

`stageLabel(project, statusId)`:

1. `project.stages.find(s => s.id === statusId)?.name`
2. si no, y el id es base, el nombre de `DEFAULT_STAGES`
3. si no, `"etapa eliminada"`

`boardColumns(project)` devuelve `{ stage: KanbanStage; ghost: boolean }[]`:

- Primero `project.stages` con `ghost: false`, ya normalizadas si hace falta llamar a `normalizeStages` antes de pintar (el proyecto guardado ya está normalizado; igual se pinta `project.stages` tal cual).
- Después, un ghost por cada `task.status` de tareas **no archivadas** cuyo id no está en `stages`. Orden de primera aparición. `stage` es `{ id, name: id, color: "slate" }`, `ghost: true`.
- El encabezado del ghost es `stage.name` (el id crudo), no `stageLabel`.

`neighborStageId(stages, id, direction: -1 | 1): string | null` devuelve el id vecino dentro de `stages`. No envuelve. Fuera de rango, o id ausente → `null`. Las flechas de la tarjeta usan esto. En el extremo el botón no se renderiza. Los ghosts no entran en `stages`, así que no son destino de la flecha.

## 2. Esquema

`Task.status` en `project.ts`:

```ts
status: z.string().min(1).default("todo"),
```

El enum `TaskStatus` de `common.ts` no se borra. Flujos e IA siguen importándolo.

`Project.stages`:

```ts
stages: z
  .array(
    z.object({
      id: z.string().min(1),
      name: z.string().min(1).max(40),
      color: z.enum(STAGE_COLORS),
    }),
  )
  .default(DEFAULT_STAGES),
```

El default de Zod tiene que ser una copia por parse (`default(() => DEFAULT_STAGES.map((s) => ({ ...s })))`), no el mismo array.

`newProject` incluye `stages: DEFAULT_STAGES.map((s) => ({ ...s }))`.

## 3. Migración

En `MIGRATIONS.projects`, después del paso v23:

```ts
{
  to: 24,
  up(data) {
    data.stages = normalizeStages(data.stages);
    return data;
  },
},
```

No lee ni escribe `tasks`. Un proyecto v23 sin `stages` queda con las cuatro de fábrica y los `status` iguales.

Tests que hoy significan «la versión actual»:

- `migrations.test.ts`: el caso `projects v1 -> v23` que espera `schemaVersion === 23` pasa a esperar **24**, y el documento migrado tiene `stages` de largo 4 con ids `todo`, `doing`, `blocked`, `done`.
- `src/ai/keys-never-exported.test.ts`: `expect(SCHEMA_VERSION).toBe(24)`.

No reescribir los tests históricos que migran *hacia* v22 o v23 a propósito.

Caso nuevo: un doc `{ schemaVersion: 23, tasks: [{ status: "doing" }] }` migrado a 24 tiene `schemaVersion: 24`, `stages` default, y esa tarea sigue en `"doing"`. Idempotente: un v24 con `stages` ya válidas no las reordena de más (sí puede correr `normalizeStages` y dejarlas iguales).

## 4. Operaciones — `projectOps.ts`

Todas devuelven un `Project` nuevo. Si el pedido no es válido, devuelven `p` (misma referencia, para que la UI pueda ver que no hubo cambio).

```ts
addStage(p, { name, color }: { name: string; color: StageColor }): Project
renameStage(p, id: string, name: string): Project
recolorStage(p, id: string, color: StageColor): Project
moveStage(p, id: string, direction: -1 | 1): Project
removeStage(p, id: string): Project
```

Reglas, encima de `normalizeStages(p.stages)` al armar el resultado:

- `addStage`: `stageNameError` distinto de null → `p`. Color inválido → `p`. Id = `uuid()`. Insertar en el índice de `done` (queda inmediatamente antes).
- `renameStage`: error de nombre (ignorando `id`) o id ausente → `p`.
- `recolorStage`: id ausente o color inválido → `p`.
- `moveStage`: id ausente, id `done`, o el destino cae fuera de `0 .. length - 2` → `p`. Intercambiar con el vecino. `done` sigue en el último índice.
- `removeStage`: id base o ausente → `p`. Destino de las tareas: la etapa en `index - 1`, o `index + 1` si era la primera. Reescribir **todas** las tareas con ese `status` (archivadas incluidas) al id destino. Quitar la etapa. Las cuatro base siempre están, así que el destino nunca es «ninguno».

El formulario valida con `stageNameError` y no llama a la op si hay error. Mensajes: `"empty"` → «Escribí un nombre.» `"duplicate"` → «Ya hay una etapa con ese nombre.»

## 5. Tablero

### 5.1 Datos

`TasksTab` deja de usar `TASK_COLUMNS` para pintar. Arma las columnas con `boardColumns(project)`.

`activeKanbanCol` pasa a `string`. El primer id de `project.stages` es el fallback, no `"todo"` fijo, por si alguien reordenó.

`pickActiveStatus` recibe el orden (`stages.map(s => s.id)` más los ids ghost, en el orden de `boardColumns`). El desempate usa `order.indexOf`, no `TASK_COLUMNS`.

El `Set` de columnas válidas para el DnD incluye los ids de `boardColumns` (persistidas y ghost). Soltar una tarjeta en un ghost no se ofrece como alta: el ghost es un origen. Soltar en una etapa real escribe `task.status = stage.id`.

`wipLimit` de `KanbanColumn`: `null` si `ghost` o si el id no es base. Si es base, `project.wipLimits[id]` como hoy.

### 5.2 Encabezado

`KanbanColumn` recibe `stage`, `ghost`, y deja de leer `taskStatusLabel[status]`.

```tsx
<span className={cn("size-2 shrink-0 rounded-full", stageDotClass(stage.color))} aria-hidden />
<span className="truncate">{stage.name}</span>
```

El menú (solo si `!ghost`) es un `DropdownMenu` con trigger `MoreHorizontal`, `aria-label="Opciones de {stage.name}"`.

| Ítem | Regla |
|------|--------|
| Renombrar | Abre un `Dialog` con el nombre actual. Guardar llama `renameStage` |
| Color | Ocho botones `size-5 rounded-full` con `stageDotClass`. El activo lleva `ring-2 ring-foreground ring-offset-2`. Click llama `recolorStage` y cierra |
| Mover a la izquierda / Mover a la derecha | No se muestran si `moveStage` devolvería `p`. Hecha no muestra ninguno |
| Eliminar | Solo si `!isBuiltinStageId(stage.id)`. Abre el diálogo de §5.4 |

Cada acción hace `mutate((p) => ops.…(p, …))`.

### 5.3 Alta

Después de las columnas (también después de los ghosts), un botón «Nueva etapa». En `< sm`, el pager suma un botón «+» con `aria-label="Nueva etapa"` que abre el mismo diálogo. El «+» no es una columna y no entra en `pickActiveStatus`.

Diálogo: input nombre (`maxLength={40}`, autoFocus) y las ocho muestras. Color inicial: `nextStageColor(project.stages)`. Crear llama `addStage` y cierra. Si `stageNameError` no es null, no cierra y muestra el mensaje debajo del input.

### 5.4 Eliminar

N = cantidad de `project.tasks` con ese `status`, archivadas incluidas. Destino = la regla de `removeStage`, calculada para el texto (no hace falta borrar para saber el nombre).

- N === 0 → `Eliminar "{nombre}". No hay tareas en esta etapa.`
- N === 1 → `Eliminar "{nombre}". 1 tarea pasa a "{destino}".`
- N > 1 → `Eliminar "{nombre}". {N} tareas pasan a "{destino}".`

Botones: Cancelar y Eliminar. Eliminar: `mutate((p) => ops.removeStage(p, id))`.

### 5.5 Archivar Hecha

Solo en la columna con `stage.id === "done"` y `visibleCount > 0`. `visibleCount` es el largo de las tareas que esa columna ya está pintando (los filtros de `TasksTab` ya corrieron; las archivadas no están).

Botón: `Archivar 1` o `Archivar {N}`.

Diálogo:

- N === 1 → `Archivar 1 tarea de {stage.name}? Sale del tablero y queda en Archivadas.`
- N > 1 → `Archivar {N} tareas de {stage.name}? Salen del tablero y quedan en Archivadas.`

Confirmar, en **un solo** `mutate`, para que el store escriba una vez:

```ts
mutate((p) =>
  ids.reduce((acc, id) => {
    const task = acc.tasks.find((t) => t.id === id);
    return task ? ops.updateTask(acc, { ...task, archived: true }) : acc;
  }, p),
);
```

`status` no se toca. No usa la selección del modo lote. Cancelar no llama a `mutate`.

### 5.6 Selects y badges del proyecto

`TaskFormDialog`, `TaskDetailDrawer` y el «Mover a…» del lote listan `project.stages` en orden. El `<option value>` es el id. El texto es el nombre, con el punto al lado cuando el control lo permite (en un `<select>` nativo el punto no entra en el option: el punto va en el badge y en el encabezado; en el `<select>` alcanza el nombre).

`KanbanListView` y `ArchivedTasksList` usan `stageLabel(project, task.status)` y el punto del color de esa etapa. Si la etapa no existe, punto `slate` y la etiqueta «etapa eliminada».

`KanbanColumnPager` muestra el punto, `stage.name` y el conteo. `columns` pasa a `{ id: string; name: string; color: StageColor; count: number }`.

## 6. Fuera del tablero, misma etiqueta

Donde el compilador se queje de `taskStatusLabel[task.status]` porque `status` ya es `string`, no se castea a `TaskStatus`. Se resuelve el nombre.

| Lugar | Cómo |
|-------|------|
| `activity.ts` `task.statusChanged` | `stageLabel(project, event.from)` y `stageLabel(project, event.to)`. El `project` ya está en el formateador |
| `buildCalendarItems.ts` | El ítem gana `statusLabel: stageLabel(project, task.status)`. `status` queda `string`. Las dos vistas leen `statusLabel` |
| `statusReport.ts` `ReportTaskRow` | Gana `statusLabel`. Se llena al mapear `focusTasks` con `stageLabel(project, t.status)`. El markdown imprime `statusLabel`, no `taskStatusLabel[t.status]` |
| `MyTasksPage` | La fila busca el proyecto por `projectId` y usa `stageLabel`. Si no está, «etapa eliminada» |

`ActionConfigFields` sigue en `TASK_COLUMNS` / `taskStatusLabel`. No listar etapas del proyecto.

Contar hechas no cambia: sigue siendo `status === "done"` (`isDoneStatus`). No reemplazar esos `if` por «la última columna».

## 7. Mis tareas — `status=otras`

```ts
export type MyTasksStatusFilter = BuiltinStageId | "otras";
```

`isTaskStatus` acepta los cuatro id base **o** `"otras"`. Cualquier otro valor sigue siendo null (no filtra).

En `filterAndSortMyTasks`, donde hoy está `t.status === query.status`:

```ts
if (query.status === "otras") {
  filtered = filtered.filter((t) => !isBuiltinStageId(t.status));
} else if (query.status) {
  filtered = filtered.filter((t) => t.status === query.status);
}
```

`applyStatus` solo fuerza `done=1` cuando el valor es `"done"`. `"otras"` no lo hace.

`showDone` sigue escondiendo únicamente `status === "done"`. Una etapa custom se ve sin marcar «Mostrar hechas».

En `MyTasksPage`, después de Hecha:

```tsx
<option value="otras">Otras etapas</option>
```

## 8. Árbol — `ProjectTree.tsx`

La fila va dentro del `<div className="space-y-0.5">`, antes del `groups.map`. El componente sigue devolviendo `null` si `groups.length === 0`.

```tsx
const skipGroup = useRef<string | null>(null);

useEffect(() => {
  if (!activeGroupId) return;
  if (skipGroup.current === activeGroupId) return;
  skipGroup.current = null;
  setExpanded((s) => (s.has(activeGroupId) ? s : new Set(s).add(activeGroupId)));
}, [activeGroupId]);
```

El efecto **no** depende de `expanded` ni de `groups`. Si se los agrega, «Cerrar todos» se vuelve a abrir solo.

```tsx
function expandAll() {
  skipGroup.current = null;
  setExpanded(new Set(groups.map((g) => g.id)));
}

function collapseAll() {
  skipGroup.current = activeGroupId ?? "";
  setExpanded(new Set());
}
```

`allOpen = groups.every((g) => expanded.has(g.id))`. Botón nativo `type="button"`, texto y `aria-label` iguales: `allOpen ? "Cerrar todos" : "Abrir todos"`.

Fila: `flex items-center justify-between px-2 py-1`. El rótulo «Proyectos» es `text-xs font-medium text-muted-foreground`. El botón es `text-xs text-muted-foreground hover:text-foreground`.

Abrir un producto con su chevron no toca `skipGroup`. No hay `localStorage`. Con el sidebar en rail, `SidebarContent` no monta el árbol: no hace falta otro `if`.

## 9. Pruebas

`kanbanStages.test.ts` (fallán antes de implementar):

**normalizeStages**

- `undefined`, `[]`, `"no"` → cuatro ids en orden de fábrica.
- Falta `blocked` → aparece, con nombre «Bloqueada», y `done` queda último.
- `done` está primera → termina última; el resto conserva su orden relativo.
- Dos etapas con el mismo id → queda una.
- Color `"rosa"` → `slate`.
- Nombre vacío en `todo` → «Por hacer». Nombre vacío en un id custom → «Etapa».
- No muta el array de entrada.

**nombres y color**

- `stageNameError` con `"  Revisión "` contra una etapa `"revisión"` → `"duplicate"`.
- `"Revision"` contra `"Revisión"` → null (el acento distingue).
- `""` y `"   "` → `"empty"`.
- `nextStageColor` con las cuatro de fábrica usadas → `"rose"`. Con las ocho usadas → `"slate"`.

**ops** (proyecto de `newProject("P")` más una tarea `todo` y una archivada en la etapa que se borra)

- `addStage` inserta antes de `done` y no mueve las tareas.
- Nombre vacío, repetido y color inválido devuelven la misma referencia.
- `renameStage` de `done` a «Listo» no cambia el id. Las tareas en `done` siguen ahí.
- `moveStage(blocked, -1)` la deja antes de `doing`. `moveStage(done, 1)` y `moveStage(done, -1)` devuelven la misma referencia. La etapa pegada a `done` no se mueve a la derecha.
- `removeStage("todo")` devuelve la misma referencia.
- `removeStage` de una custom con una tarea viva y una archivada: las dos pasan a la etapa de la izquierda y conservan `archived`.
- `removeStage` de una custom que quedó primera: las tareas pasan a la de la derecha.

**migración** en `migrations.test.ts`, como dice §3.

**Mis tareas** en `filterMyTasks.test.ts`:

- `status=otras` deja una tarea con status `"custom-1"` y excluye `todo`, `doing`, `blocked`, `done`.
- `status=done` no incluye `"custom-1"`.
- Sin `showDone`, `"custom-1"` sigue en la lista y `done` no.
- `status=no-existe` no filtra (igual que hoy un status inválido).

No hace falta un test de componente del árbol. La fase D se verifica con el smoke del prompt.

## 10. Trampas

- `taskStatusLabel[task.status]` deja de compilar cuando `status` es `string`. No caster a `TaskStatus`: se pierde el nombre custom y el índice es `undefined`.
- Un `Project` armado a mano en un test o en el seed, sin `stages`, deja de asignar al tipo. Spread de `DEFAULT_STAGES` o `newProject`. El default de Zod cubre el parse, no el literal de TypeScript.
- Archivar en un `forEach` de `mutate` escribe N veces. Va un solo `reduce` dentro de un `mutate`.
- `removeStage` que olvida las archivadas las deja con un status huérfano y aparecen como ghost al desarchivar.
- Mover `done` «porque el menú lo ocultó» igual tiene que ser un no-op en la op. El menú no es la red de seguridad.
- El efecto del árbol con `groups` en las deps reabre el producto activo apenas se cierra.
- `skipGroup.current === activeGroupId` tiene que compararse con el id, no con un boolean. Un boolean tragado en el efecto de navegación no abre el producto nuevo (CA-07.3).
- El ghost no se guarda. Si `addStage` o `normalizeStages` lo persisten, el id crudo queda como etapa.
- `applyStatus("otras")` no debe escribir `done=1`.
- El lavado ámbar de WIP sigue en las columnas base que superan el límite. Una etapa custom no lo muestra aunque tenga muchas tarjetas.
