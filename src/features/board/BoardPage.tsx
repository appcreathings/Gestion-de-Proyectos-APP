import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { LayoutGrid, Bookmark, Check, Search, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { uuid } from "@/lib/utils";
import { priorityLabel } from "@/domain/labels";
import { stageDotClass } from "@/domain/kanbanStages";
import * as ops from "@/domain/projectOps";
import type { Project, Task } from "@/domain/schemas";
import { TaskDetailDrawer } from "@/features/projects/components/kanban/TaskDetailDrawer";
import { KanbanColumnPager } from "@/features/projects/components/kanban/KanbanColumnPager";
import { useDataStore } from "@/store/useDataStore";
import { useAppStore } from "@/store/useAppStore";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useDebounce } from "@/hooks/useDebounce";
import {
  boardColumns,
  boardProjectRank,
  canonicalBoardSearch,
  collectBoardCards,
  matchingViewId,
  parseBoardQuery,
  viewNameError,
  type BoardCard,
  type BoardColumnModel,
  type BoardQuery,
  type KnownBoardRefs,
  type ViewNameError,
} from "./boardQuery";
import { GlobalTaskCard } from "./GlobalTaskCard";

/** Claves que «Limpiar filtros» borra (D13). `done` no está: es el marco. */
const CLEARABLE_KEYS = ["product", "project", "person", "priority", "date", "q", "view"] as const;

type BoardView = { id: string; name: string; query: string };

const VIEW_NAME_ERROR: Record<ViewNameError, string> = {
  empty: "Escribí un nombre.",
  duplicate: "Ya hay una vista con ese nombre.",
  limit: "Podés guardar hasta 20 vistas.",
};

export function BoardPage() {
  const projects = useDataStore((s) => s.projects);
  const products = useDataStore((s) => s.products);
  const people = useDataStore((s) => s.people);
  const mutateProject = useDataStore((s) => s.mutateProject);
  const workspaceReady = useAppStore((s) => s.workspace !== null);
  const sidebarOrder = useAppStore((s) => s.workspace?.settings.sidebarOrder);
  const productOrder = useAppStore((s) => s.workspace?.settings.productOrder);
  const boardViews = useAppStore((s) => s.workspace?.settings.boardViews ?? []);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [searchParams, setSearchParams] = useSearchParams();

  const known = useMemo<KnownBoardRefs>(
    () => ({
      productIds: new Set(products.map((p) => p.id)),
      projectIds: new Set(projects.map((p) => p.id)),
      personIds: new Set(people.map((p) => p.id)),
    }),
    [products, projects, people],
  );

  // La URL es la fuente de verdad (D10): un id o valor desconocido se ignora.
  const query = useMemo(() => parseBoardQuery(searchParams, known), [searchParams, known]);
  const hasClearable = CLEARABLE_KEYS.some((key) => searchParams.has(key));

  function commit(patch: Partial<BoardQuery>) {
    // Cambiar un filtro mantiene `view`: la vista pasa a figurar modificada (D14).
    const next = canonicalBoardSearch({ ...query, ...patch });
    if (query.viewId) next.set("view", query.viewId);
    setSearchParams(next, { replace: true });
  }

  function clearFilters() {
    const next = new URLSearchParams(searchParams);
    for (const key of CLEARABLE_KEYS) next.delete(key);
    setSearchParams(next, { replace: true });
  }

  // Búsqueda con debounce ~200 ms (D11): la URL solo recibe el valor asentado.
  const [searchInput, setSearchInput] = useState(query.q);
  const debouncedQ = useDebounce(searchInput, 200);
  useEffect(() => {
    setSearchInput(query.q);
  }, [query.q]);
  useEffect(() => {
    if (debouncedQ === query.q) return;
    commit({ q: debouncedQ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  // Datos del tablero. `collectBoardCards` ya saltea proyectos done/archived
  // (D8); para el vacío «sin proyectos» hace falta el mismo recorte acá.
  const eligibleProjects = useMemo(
    () => projects.filter((p) => p.status !== "done" && p.status !== "archived"),
    [projects],
  );
  const rank = useMemo(
    // El orden de la barra manda como primera clave (spec 076 D9); la página no
    // se apoya en el default de `boardProjectRank`.
    () => boardProjectRank(products, projects, sidebarOrder ?? {}, productOrder ?? []),
    [products, projects, sidebarOrder, productOrder],
  );
  const cards = useMemo(() => collectBoardCards(projects, query, new Date()), [projects, query]);
  const columns = useMemo(
    () => boardColumns(cards, query.showDone, rank),
    [cards, query.showDone, rank],
  );

  // Select de proyecto: proyectos vivos en el orden de la barra (design §6).
  const projectOptions = useMemo(() => {
    const rankOf = (id: string) => rank.get(id) ?? Number.MAX_SAFE_INTEGER;
    return [...eligibleProjects]
      .sort((a, b) => rankOf(a.id) - rankOf(b.id))
      .map((p) => ({
        id: p.id,
        label: p.productId
          ? `${p.name} · ${products.find((prod) => prod.id === p.productId)?.name ?? ""}`
          : p.name,
      }));
  }, [eligibleProjects, products, rank]);

  const nameById = (id: string) =>
    products.find((p) => p.id === id)?.name ?? projects.find((p) => p.id === id)?.name ?? id;

  // Drawer (D9): el clic abre la tarea en su proyecto, como Mis tareas.
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  function openDetail(card: BoardCard) {
    const project = projects.find((p) => p.id === card.projectId) ?? null;
    setDetailTask(card.task);
    setDetailProject(project);
  }

  function closeDetail() {
    setDetailTask(null);
    setDetailProject(null);
  }

  function handleUpdateTask(updated: Task) {
    if (!detailProject) return;
    void mutateProject(detailProject.id, (p) => ops.updateTask(p, updated));
    // Si al guardar deja de pasar el filtro (p. ej. pasó a hecha con el
    // interruptor apagado), el drawer se cierra (design §6).
    const projectAfter: Project = {
      ...detailProject,
      tasks: detailProject.tasks.map((t) => (t.id === updated.id ? updated : t)),
    };
    const stillVisible = collectBoardCards([projectAfter], query, new Date());
    if (!stillVisible.some((c) => c.task.id === updated.id)) {
      closeDetail();
      return;
    }
    setDetailTask(updated);
  }

  const noProjectsAtAll = eligibleProjects.length === 0 && !hasClearable;
  const nothingMatches = !noProjectsAtAll && cards.length === 0;

  // Vistas guardadas (D14): la que coincide con los filtros de la URL lleva
  // marca; si `view` apunta a una vista y ya no coincide, está modificada.
  const matchedViewId = useMemo(() => matchingViewId(boardViews, searchParams), [boardViews, searchParams]);
  const activeView = boardViews.find((v) => v.id === query.viewId) ?? null;
  const viewModified = activeView !== null && matchedViewId !== activeView.id;
  const atLimit = boardViews.length >= 20;

  // `view` con id que no existe se ignora al pintar; con el workspace ya
  // cargado se saca del param (design §5).
  useEffect(() => {
    if (!workspaceReady || !query.viewId) return;
    if (boardViews.some((v) => v.id === query.viewId)) return;
    const next = new URLSearchParams(searchParams);
    next.delete("view");
    setSearchParams(next, { replace: true });
  }, [workspaceReady, query.viewId, boardViews, searchParams, setSearchParams]);

  function applyView(view: BoardView) {
    const params = new URLSearchParams(view.query);
    params.set("view", view.id);
    setSearchParams(params, { replace: true });
  }

  // Diálogo de guardar / renombrar (design §7). El error vive mientras el
  // diálogo está abierto y se limpia al escribir.
  const [viewDialog, setViewDialog] = useState<{ mode: "save" } | { mode: "rename"; id: string } | null>(null);
  const [viewName, setViewName] = useState("");
  const [viewError, setViewError] = useState<ViewNameError | null>(null);

  function openSaveDialog() {
    setViewName("");
    setViewError(null);
    setViewDialog({ mode: "save" });
  }

  function openRenameDialog() {
    if (!activeView) return;
    setViewName(activeView.name);
    setViewError(null);
    setViewDialog({ mode: "rename", id: activeView.id });
  }

  async function submitViewDialog() {
    if (!viewDialog) return;
    const trimmed = viewName.trim();
    if (viewDialog.mode === "save") {
      const err = viewNameError(boardViews, trimmed);
      if (err) {
        setViewError(err);
        return;
      }
      const view: BoardView = {
        id: uuid(),
        name: trimmed,
        // El query canónico de lo que hay ahora, sin `view` y con `done`
        // incluido si está prendido (D14).
        query: canonicalBoardSearch(query).toString(),
      };
      // Esperar la escritura: si se aplica antes de tiempo, el efecto que
      // limpia un `view` desconocido corre con la lista vieja y se lo come.
      await updateSettings({ boardViews: [...boardViews, view] });
      setViewDialog(null);
      // Después de guardar, la vista queda aplicada en la URL (design §5).
      applyView(view);
      return;
    }
    const err = viewNameError(boardViews, trimmed, viewDialog.id);
    if (err) {
      setViewError(err);
      return;
    }
    void updateSettings({
      boardViews: boardViews.map((v) =>
        v.id === viewDialog.id ? { ...v, name: trimmed } : v,
      ),
    });
    setViewDialog(null);
  }

  /** Reemplaza el `query` de la vista activa por los filtros actuales (D3).
   *  No suma una vista nueva. */
  function updateActiveView() {
    if (!activeView) return;
    void updateSettings({
      boardViews: boardViews.map((v) =>
        v.id === activeView.id ? { ...v, query: canonicalBoardSearch(query).toString() } : v,
      ),
    });
  }

  /** Sin confirmación: es una preferencia, no borra tareas (design §7). */
  function deleteActiveView() {
    if (!activeView) return;
    void updateSettings({ boardViews: boardViews.filter((v) => v.id !== activeView.id) });
    if (query.viewId === activeView.id) {
      // Saca el param `view` y deja los filtros en pantalla (D14).
      const next = new URLSearchParams(searchParams);
      next.delete("view");
      setSearchParams(next, { replace: true });
    }
  }

  return (
    <div>
      <PageHeader
        label="Tablero"
        title="Todas las tareas"
        description="Un kanban con las tareas de tus proyectos. Filtrá por producto o guardá tu propio recorte."
      />

      {!noProjectsAtAll && !nothingMatches && (
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[11rem] flex-1">
              <label className="mb-1.5 block text-sm font-medium">Producto</label>
              <Select
                value=""
                onChange={(e) => {
                  if (e.target.value) commit({ productIds: [...query.productIds, e.target.value] });
                }}
                aria-label="Agregar producto"
              >
                <option value="">Agregar producto</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="min-w-[11rem] flex-1">
              <label className="mb-1.5 block text-sm font-medium">Proyecto</label>
              <Select
                value=""
                onChange={(e) => {
                  if (e.target.value) commit({ projectIds: [...query.projectIds, e.target.value] });
                }}
                aria-label="Agregar proyecto"
              >
                <option value="">Agregar proyecto</option>
                {projectOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="min-w-[9rem] flex-1">
              <label className="mb-1.5 block text-sm font-medium">Persona</label>
              <Select
                value={query.personId ?? ""}
                onChange={(e) => commit({ personId: e.target.value || null })}
              >
                <option value="">Todas</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="min-w-[9rem] flex-1">
              <label className="mb-1.5 block text-sm font-medium">Prioridad</label>
              <Select
                value={query.priority ?? ""}
                onChange={(e) => commit({ priority: (e.target.value || null) as BoardQuery["priority"] })}
              >
                <option value="">Todas</option>
                <option value="critical">{priorityLabel.critical}</option>
                <option value="high">{priorityLabel.high}</option>
                <option value="medium">{priorityLabel.medium}</option>
                <option value="low">{priorityLabel.low}</option>
              </Select>
            </div>

            <div className="min-w-[11rem] flex-1">
              <label className="mb-1.5 block text-sm font-medium">Vencimiento</label>
              <Select
                value={query.date ?? ""}
                onChange={(e) => commit({ date: (e.target.value || null) as BoardQuery["date"] })}
              >
                <option value="">Todas</option>
                <option value="overdue">Vencidas</option>
                <option value="due-soon">Por vencer (3 días)</option>
                <option value="this-week">Esta semana</option>
              </Select>
            </div>

            <div className="min-w-[10rem] flex-1">
              <label className="mb-1.5 block text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar tarea"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <label className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Checkbox
                checked={query.showDone}
                onCheckedChange={(c) => commit({ showDone: c })}
                aria-label="Mostrar hechas"
              />
              Mostrar hechas
            </label>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mb-1"
              onClick={clearFilters}
              disabled={!hasClearable}
            >
              Limpiar filtros
            </Button>

            <div className="mb-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Bookmark className="size-3.5 sm:mr-1.5" />
                    <span className="hidden sm:inline">Vistas</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  {boardViews.length === 0 ? (
                    <DropdownMenuItem disabled>Sin vistas guardadas</DropdownMenuItem>
                  ) : (
                    boardViews.map((v) => (
                      <DropdownMenuItem key={v.id} onSelect={() => applyView(v)}>
                        <Check
                          className={cn(
                            "mr-2 size-4 shrink-0",
                            v.id === matchedViewId ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <span className="truncate">{v.name}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled={atLimit} onSelect={openSaveDialog}>
                    Guardar vista
                  </DropdownMenuItem>
                  {viewModified && activeView && (
                    <>
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        Vista modificada
                      </div>
                      <DropdownMenuItem onSelect={updateActiveView}>
                        Actualizar &quot;{activeView.name}&quot;
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={atLimit} onSelect={openSaveDialog}>
                        Guardar como nueva
                      </DropdownMenuItem>
                    </>
                  )}
                  {(matchedViewId !== null || viewModified) && activeView && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={openRenameDialog}>Renombrar</DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={deleteActiveView}
                      >
                        Eliminar
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {(query.productIds.length > 0 || query.projectIds.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {query.productIds.map((id) => (
                <Chip key={id} name={nameById(id)} onRemove={() => commit({ productIds: query.productIds.filter((x) => x !== id) })} />
              ))}
              {query.projectIds.map((id) => (
                <Chip key={id} name={nameById(id)} onRemove={() => commit({ projectIds: query.projectIds.filter((x) => x !== id) })} />
              ))}
            </div>
          )}
        </div>
      )}

      {noProjectsAtAll ? (
        <EmptyState
          icon={LayoutGrid}
          title="Todavía no hay proyectos."
          description="Creá un proyecto para ver sus tareas acá."
        />
      ) : nothingMatches ? (
        <EmptyState
          icon={LayoutGrid}
          title="Ninguna tarea coincide con estos filtros."
          action={
            <Button type="button" size="sm" variant="outline" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <BoardBoard
          columns={columns}
          cards={cards}
          people={people}
          onOpenDetail={openDetail}
          onMoveCard={handleMoveCard}
        />
      )}

      {/* Guardar / renombrar vista (design §7): el error no cierra el diálogo. */}
      <Dialog
        open={viewDialog !== null}
        onOpenChange={(o) => {
          if (!o) setViewDialog(null);
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>{viewDialog?.mode === "rename" ? "Renombrar vista" : "Guardar vista"}</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Input
              value={viewName}
              maxLength={40}
              autoFocus
              aria-label="Nombre"
              placeholder="Ej: Bloqueos"
              onChange={(e) => {
                setViewName(e.target.value);
                if (viewError) setViewError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitViewDialog();
                }
              }}
            />
            {viewError && (
              <p role="alert" className="mt-1.5 text-sm text-destructive">
                {VIEW_NAME_ERROR[viewError]}
              </p>
            )}
          </DialogBody>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setViewDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={submitViewDialog}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {detailTask && detailProject && (
        <TaskDetailDrawer
          task={detailTask}
          projectId={detailProject.id}
          areas={detailProject.areas}
          people={people}
          sprints={detailProject.sprints}
          stages={detailProject.stages}
          onUpdate={handleUpdateTask}
          onClose={closeDetail}
        />
      )}
    </div>
  );

  function handleMoveCard(card: BoardCard, columnId: BoardColumnModel["id"]) {
    // «Otras» no es destino y soltar en la misma columna no cambia nada (D4/D6).
    if (columnId === "otras" || card.task.status === columnId) return;
    void mutateProject(card.projectId, (p) => ops.updateTask(p, { ...card.task, status: columnId }));
  }
}

function Chip({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      {name}
      <button
        type="button"
        aria-label={`Quitar ${name}`}
        onClick={onRemove}
        className="flex size-4 items-center justify-center rounded-full hover:bg-foreground/10"
      >
        <X className="size-3" />
      </button>
    </Badge>
  );
}

const isCompactColumn = (id: string) => id !== "otras";

function BoardBoard({
  columns,
  cards,
  people,
  onOpenDetail,
  onMoveCard,
}: {
  columns: BoardColumnModel[];
  cards: BoardCard[];
  people: { id: string; name: string }[];
  onOpenDetail: (card: BoardCard) => void;
  onMoveCard: (card: BoardCard, columnId: BoardColumnModel["id"]) => void;
}) {
  const hasDrag = useBreakpoint("sm");
  const assigneeName = (card: BoardCard) =>
    people.find((p) => p.id === card.task.assigneeId)?.name ?? null;

  return hasDrag ? (
    <BoardColumns
      columns={columns}
      cards={cards}
      assigneeName={assigneeName}
      onOpenDetail={onOpenDetail}
      onMoveCard={onMoveCard}
    />
  ) : (
    <BoardPager columns={columns} assigneeName={assigneeName} onOpenDetail={onOpenDetail} />
  );
}

/** sm+: columnas juntas con scroll horizontal, tarjetas arrastrables (D19).
 *  «Otras» no es droppable (D4). */
function BoardColumns({
  columns,
  cards,
  assigneeName,
  onOpenDetail,
  onMoveCard,
}: {
  columns: BoardColumnModel[];
  cards: BoardCard[];
  assigneeName: (card: BoardCard) => string | null;
  onOpenDetail: (card: BoardCard) => void;
  onMoveCard: (card: BoardCard, columnId: BoardColumnModel["id"]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
  );
  const collisionDetection: CollisionDetection = (args) => {
    const pointer = pointerWithin(args);
    if (pointer.length > 0) return pointer;
    const rects = rectIntersection(args);
    if (rects.length > 0) return rects;
    return closestCorners(args);
  };

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const card = cards.find((c) => c.task.id === String(active.id));
    if (!card) return;
    onMoveCard(card, String(over.id) as BoardColumnModel["id"]);
  }

  const activeCard = activeId ? cards.find((c) => c.task.id === activeId) : undefined;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="flex min-w-0 gap-3 overflow-x-auto pb-1 scrollbar-thin sm:gap-4">
        {columns.map((col) => (
          <BoardColumn key={col.id} column={col} onOpenDetail={onOpenDetail} assigneeName={assigneeName} />
        ))}
      </div>
      <DragOverlay
        dropAnimation={{ duration: 200, easing: "cubic-bezier(0.2, 0, 0, 1)" }}
      >
        {activeCard ? (
          <div className="w-56">
            <GlobalTaskCard
              card={activeCard}
              assigneeName={assigneeName(activeCard)}
              inOtras={!isBuiltinId(activeCard.task.status)}
              isOverlay
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function isBuiltinId(status: string): boolean {
  return status === "todo" || status === "doing" || status === "blocked" || status === "done";
}

function BoardColumn({
  column,
  onOpenDetail,
  assigneeName,
}: {
  column: BoardColumnModel;
  onOpenDetail: (card: BoardCard) => void;
  assigneeName: (card: BoardCard) => string | null;
}) {
  const droppable = isCompactColumn(column.id);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    disabled: !droppable,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-[85vw] min-w-[85vw] max-w-[85vw] shrink-0 snap-start flex-col rounded-xl border-2 border-transparent bg-background p-3 transition-colors sm:w-auto sm:min-w-[16rem] sm:max-w-[22rem] sm:flex-[1_0_16rem] sm:border-border/70",
        droppable && isOver && "border-foreground/40 bg-foreground/[0.06]",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-1 px-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className={cn("size-2 shrink-0 rounded-full", stageDotClass(column.color))} aria-hidden="true" />
          <span className="truncate font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {column.name}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {column.id === "done" && column.hiddenCount > 0 && (
            <span className="text-[11px] text-muted-foreground">{column.hiddenCount} ocultas</span>
          )}
          <Badge variant="outline" className="px-1.5 py-0.5 font-mono text-[11px]">
            {column.cards.length}
          </Badge>
        </div>
      </div>
      <div className="flex-1 space-y-2.5">
        {column.cards.map((card) => (
          <DraggableCard
            key={card.task.id}
            card={card}
            inOtras={column.id === "otras"}
            assigneeName={assigneeName(card)}
            onOpenDetail={() => onOpenDetail(card)}
          />
        ))}
      </div>
    </div>
  );
}

/** La tarjeta es arrastrable por su asa; el cuerpo abre el drawer. Debajo de
 * sm no se monta (D19). */
function DraggableCard({
  card,
  inOtras,
  assigneeName,
  onOpenDetail,
}: {
  card: BoardCard;
  inOtras: boolean;
  assigneeName: string | null;
  onOpenDetail: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: card.task.id });
  return (
    <div ref={setNodeRef} className={cn(isDragging && "opacity-40")}>
      <GlobalTaskCard
        card={card}
        inOtras={inOtras}
        assigneeName={assigneeName}
        onClick={onOpenDetail}
        handle={{ attributes, listeners }}
      />
    </div>
  );
}

/** Debajo de sm: una columna por vez con el pager de la 054, sin arrastre.
 *  El cambio de estado se hace desde el drawer (D19). */
function BoardPager({
  columns,
  assigneeName,
  onOpenDetail,
}: {
  columns: BoardColumnModel[];
  assigneeName: (card: BoardCard) => string | null;
  onOpenDetail: (card: BoardCard) => void;
}) {
  const [active, setActive] = useState<string>(() => columns[0]?.id ?? "todo");

  useEffect(() => {
    if (!columns.some((c) => c.id === active)) setActive(columns[0]?.id ?? "todo");
  }, [columns, active]);

  const current = columns.find((c) => c.id === active);

  return (
    <div className="space-y-3">
      <div className="sticky top-0 z-10 -mx-1 bg-background/95 px-1 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <KanbanColumnPager
          columns={columns.map((c) => ({ id: c.id, name: c.name, color: c.color, count: c.cards.length }))}
          active={active}
          onSelect={setActive}
        />
      </div>
      {current && (
        <div className="space-y-2.5">
          {current.cards.map((card) => (
            <GlobalTaskCard
              key={card.task.id}
              card={card}
              inOtras={current.id === "otras"}
              assigneeName={assigneeName(card)}
              onClick={() => onOpenDetail(card)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
