# Design 074 — Duplicar tareas

> Autoridad: `spec.md` (D1–D17, HU-01…07). Si este archivo y el spec chocan, gana el spec.
> Snippets de referencia. `SCHEMA_VERSION` **24** sin cambio.

## 0. Mapa de archivos

| Archivo | Qué |
|---------|-----|
| `src/domain/duplicateTask.ts` | **Nuevo.** `cloneTask`, `copyTitle`, `insertTaskCopies`, `appendTasks` (puras) |
| `src/domain/duplicateTask.test.ts` | **Nuevo.** Casos §6.1 |
| `src/automations/events.test.ts` | Caso §6.2: copias emiten `task.added` |
| `src/features/projects/components/kanban/DuplicateTasksDialog.tsx` | **Nuevo.** Diálogo con selector de proyecto destino |
| `src/features/projects/components/kanban/TaskCard.tsx` | Props `onDuplicate`, `onDuplicateElsewhere`; 2 ítems en el menú `⋯` |
| `src/features/projects/components/kanban/TaskDetailDrawer.tsx` | Props `onDuplicate`, `onDuplicateElsewhere`; botones en el pie |
| `src/features/projects/components/TasksTab.tsx` | Handlers, estado del diálogo, botón en la barra de selección |

No se toca: esquemas, `migrations.ts`, `factories.ts`, `projectOps.ts`, `events.ts`, flujos, herramientas de IA, `KanbanListView`, `ArchivedTasksList`, Mis tareas, `package.json`.

Reusar: `Dialog`/`DialogContent`/`DialogTitle` (`@/components/ui/dialog`), `EntitySelect` (`@/components/forms/EntitySelect`), `Button`, `DropdownMenuItem`, `uuid`/`nowIso` (los mismos imports que `factories.ts`), `useDataStore`, `useToastStore`. Íconos `lucide-react`: `Copy` y `CopyPlus` (existen en `node_modules`). Sin librerías nuevas. PowerShell: sin `&&`.

## 1. `src/domain/duplicateTask.ts`

```ts
import type { Project, Task } from "./schemas";
import { nowIso, uuid } from "@/lib/utils";

export const COPY_SUFFIX = " (copia)";

/** D5: agrega « (copia)» una sola vez. */
export function copyTitle(title: string): string {
  return title.endsWith(COPY_SUFFIX) ? title : `${title}${COPY_SUFFIX}`;
}

export interface CloneTaskOptions {
  /** true = la copia queda en el mismo proyecto (D5, D7). */
  sameProject: boolean;
}

/** D3–D8. Pura: no lee ni escribe proyectos. */
export function cloneTask(task: Task, { sameProject }: CloneTaskOptions): Task {
  const ts = nowIso();
  return {
    ...task,
    id: uuid(),
    title: sameProject ? copyTitle(task.title) : task.title,
    status: "todo",
    archived: false,
    areaId: sameProject ? task.areaId : null,
    sprintId: sameProject ? task.sprintId : null,
    tags: [...task.tags],
    links: task.links.map((l) => ({ ...l, id: uuid(), createdAt: ts, updatedAt: ts })),
    subtasks: task.subtasks.map((s) => ({
      ...s,
      id: uuid(),
      done: false,
      createdAt: ts,
      updatedAt: ts,
    })),
    comments: [],
    attachments: [],
    actualHours: null,
    krCurrent: null,
    sourceItemId: null,
    dedupeKey: null,
    createdAt: ts,
    updatedAt: ts,
  };
}

export interface TaskCopy {
  sourceId: string;
  task: Task;
}

/** D9: cada copia justo después de su original; varias copias del mismo
 * origen no aplican (una copia por origen). Si el origen ya no existe, va al final. */
export function insertTaskCopies(p: Project, copies: TaskCopy[]): Project {
  if (copies.length === 0) return p;
  const bySource = new Map(copies.map((c) => [c.sourceId, c.task]));
  const tasks: Task[] = [];
  for (const t of p.tasks) {
    tasks.push(t);
    const copy = bySource.get(t.id);
    if (copy) {
      tasks.push(copy);
      bySource.delete(t.id);
    }
  }
  tasks.push(...bySource.values());
  return { ...p, tasks };
}

/** D10: al final del destino, en el orden recibido. */
export function appendTasks(p: Project, tasks: Task[]): Project {
  if (tasks.length === 0) return p;
  return { ...p, tasks: [...p.tasks, ...tasks] };
}
```

Por qué las copias se arman **fuera** del `mutate`: `TasksTab` necesita el id de la copia para abrir el drawer (D12), y la receta de `mutate` no devuelve nada. Se clona desde `project.tasks` del render, que es el mismo estado que verá la receta.

Orden de las copias en lote hacia otro proyecto (D10): filtrar `project.tasks` por los ids seleccionados (orden del array), no iterar el `Set`.

## 2. `DuplicateTasksDialog.tsx`

```ts
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Cantidad de tareas a duplicar: define el título (§5 del spec). */
  count: number;
  currentProjectId: string;
  /** D13: false desde una tarea (excluye el actual), true desde el lote. */
  includeCurrent: boolean;
  onConfirm: (targetProjectId: string) => void;
}
```

- Proyectos: `useDataStore((s) => s.projects)`, filtrar `status !== "archived"`, excluir `currentProjectId` si `!includeCurrent`, ordenar con `localeCompare(…, "es")`. El actual, si se incluye, va primero con la etiqueta `"{nombre} (este proyecto)"`.
- Valor inicial al abrir: el actual si `includeCurrent`, si no el primero de la lista, o `""` sin opciones. Reset al abrir (mismo patrón de reset-on-open de los otros diálogos; el lint de set-state-in-effect está apagado a propósito).
- `EntitySelect` con `required` (sin opción vacía). Sin opciones → texto «No hay otros proyectos activos.» en lugar del select y botón Duplicar `disabled`.
- La ayuda «Fuera de este proyecto se quitan el área y el sprint.» solo si el valor ≠ `currentProjectId`.
- El diálogo no escribe nada: llama `onConfirm(targetId)` y `TasksTab` hace el resto.

## 3. Tarjeta y drawer

`TaskCard` gana dos props obligatorias y dos ítems entre Editar y Archivar:

```tsx
<DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDuplicate(); }}>
  <Copy className="size-4 mr-2" /> Duplicar
</DropdownMenuItem>
<DropdownMenuItem onClick={(e: React.MouseEvent) => { e.stopPropagation(); onDuplicateElsewhere(); }}>
  <CopyPlus className="size-4 mr-2" /> Duplicar en otro proyecto…
</DropdownMenuItem>
```

La instancia del `DragOverlay` en `TasksTab` (la que pasa `onEdit={() => {}}`) recibe también `() => {}`.

`TaskDetailDrawer` gana `onDuplicate: () => void` y `onDuplicateElsewhere: () => void`. En el pie, a la izquierda de Archivar, dos botones `variant="ghost" size="sm"` con el mismo estilo que Archivar: «Duplicar» (`Copy`) y «Duplicar en otro proyecto…» (`CopyPlus`). En móvil, si el pie no entra en una línea, el texto de metadatos se trunca (ya tiene `truncate`); los botones envuelven con `flex-wrap` si hace falta, sin ocultar ninguno.

## 4. `TasksTab.tsx`

```ts
const mutateProject = useDataStore((s) => s.mutateProject);
const projects = useDataStore((s) => s.projects);

// D12: una tarea, mismo proyecto.
function handleDuplicate(taskId: string) {
  const source = project.tasks.find((t) => t.id === taskId);
  if (!source) return;
  const copy = cloneTask(source, { sameProject: true });
  mutate((p) => insertTaskCopies(p, [{ sourceId: source.id, task: copy }]));
  openDetail(copy.id);
}

// Diálogo: null = cerrado. ids en orden del array (D10).
const [duplicateIds, setDuplicateIds] = useState<string[] | null>(null);
const [duplicateFromSelection, setDuplicateFromSelection] = useState(false);

function openDuplicateDialog(ids: string[], fromSelection: boolean) {
  const ordered = project.tasks.filter((t) => ids.includes(t.id)).map((t) => t.id);
  setDuplicateIds(ordered);
  setDuplicateFromSelection(fromSelection);
}

function handleConfirmDuplicate(targetId: string) {
  if (!duplicateIds) return;
  const sources = project.tasks.filter((t) => duplicateIds.includes(t.id));
  const sameProject = targetId === project.id;
  if (sameProject) {
    const copies = sources.map((s) => ({ sourceId: s.id, task: cloneTask(s, { sameProject: true }) }));
    mutate((p) => insertTaskCopies(p, copies));
  } else {
    const copies = sources.map((s) => cloneTask(s, { sameProject: false }));
    void mutateProject(targetId, (p) => appendTasks(p, copies));
  }
  const name = projects.find((p) => p.id === targetId)?.name ?? "";
  const n = sources.length;
  useToastStore.getState().toast.success(
    n === 1 ? `1 tarea duplicada en «${name}»` : `${n} tareas duplicadas en «${name}»`,
  );
  setDuplicateIds(null);
  if (duplicateFromSelection) clearSelection();
}
```

Cableado:

- Tarjetas: `onDuplicate={() => handleDuplicate(t.id)}`, `onDuplicateElsewhere={() => openDuplicateDialog([t.id], false)}`.
- Drawer: `onDuplicate={() => detailTask && handleDuplicate(detailTask.id)}`, `onDuplicateElsewhere={() => detailTask && openDuplicateDialog([detailTask.id], false)}`. `openDetail(copy.id)` reemplaza `?detail=`, así que el drawer pasa a la copia sin cerrarse.
- Barra de selección: botón `variant="outline" size="sm"` «Duplicar» (`Copy`) entre «Mover a…» y Archivar → `openDuplicateDialog([...selectedTaskIds], true)`.
- `<DuplicateTasksDialog open={duplicateIds !== null} count={duplicateIds?.length ?? 0} currentProjectId={project.id} includeCurrent={duplicateFromSelection} onConfirm={handleConfirmDuplicate} onOpenChange={(o) => !o && setDuplicateIds(null)} />`.

Una sola escritura por confirmación (D15). No copiar el patrón de `handleBulkArchive` (un `mutate` por tarea).

`TasksTab` hoy no importa `useDataStore` ni `useToastStore`: agregar ambos imports (`@/store/useDataStore`, `@/store/useToastStore`).

## 5. Eventos

Nada que cambiar: `diffProjectEvents(prev, next)` (`events.ts`) emite `task.added` por cada id nuevo en `next.tasks`, tanto en el proyecto actual como en el destino. El test §6.2 lo fija para que un cambio futuro al diff no lo rompa en silencio.

## 6. Tests

### 6.1 `src/domain/duplicateTask.test.ts`

Fixture: una tarea con `status: "doing"`, `archived: true`, área, sprint, 2 subtareas (una `done`), 1 link, 1 comentario, 1 adjunto, `actualHours: 3`, `krCurrent: 5`, `krTarget: 10`, `sourceItemId`, `dedupeKey`, tags, responsable, fecha, estimación.

1. `cloneTask(…, { sameProject: true })`: id distinto; título con « (copia)»; `status "todo"`; `archived false`; área y sprint iguales; comentarios, adjuntos vacíos; `actualHours`, `krCurrent`, `sourceItemId`, `dedupeKey` en `null`; `krTarget`, `krUnit`, tags, responsable, fecha, estimación, descripción, resumen, prioridad, tipo iguales.
2. Subtareas: misma cantidad y títulos, ids nuevos y distintos de los originales, todas `done: false`.
3. Links: misma URL y label, ids nuevos.
4. `tags` es otro array (mutar la copia no toca la original).
5. `{ sameProject: false }`: título igual, `areaId` y `sprintId` en `null`, `assigneeId` igual.
6. `copyTitle("A (copia)")` → `"A (copia)"`; `copyTitle("A")` → `"A (copia)"`.
7. Dos clones de la misma tarea tienen ids distintos.
8. `insertTaskCopies`: tareas `[a, b, c]`, copias de `a` y `c` → `[a, a', b, c, c']`.
9. `insertTaskCopies` con un `sourceId` inexistente → la copia al final.
10. `insertTaskCopies(p, [])` y `appendTasks(p, [])` devuelven la misma referencia.
11. `appendTasks`: `[x]` + `[a', b']` → `[x, a', b']`.

### 6.2 `src/automations/events.test.ts`

Proyecto con `[a, b]` → `insertTaskCopies` con copias de ambos → el diff emite exactamente 2 `task.added` con los ids de las copias y ningún `task.statusChanged`.

## 7. Trampas

- **Ids compartidos:** `{ ...task }` sin regenerar ids de `subtasks` y `links` deja hijos con el mismo id en dos tareas. El drawer edita por id.
- **Arrays compartidos:** sin copiar `tags`, editar la copia mutaría la original en memoria (Zustand compara por referencia).
- **N escrituras:** un `mutate` por tarea (como `handleBulkArchive`) escribe N veces y dispara N persistencias.
- **Orden del lote:** iterar el `Set` de selección da el orden de clic, no el del tablero.
- **Copia fuera del `mutate`:** si se clona dentro de la receta, el id no llega a `openDetail`.
- **Overlay del DnD:** la `TaskCard` del `DragOverlay` también necesita las props nuevas (no-op), o no compila.
- **Destino archivado:** filtrar `status !== "archived"` en el diálogo; no confiar en el orden de la lista.
