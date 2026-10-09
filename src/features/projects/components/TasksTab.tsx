import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  closestCorners,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Archive, CalendarDays, CheckSquare, Filter, LayoutGrid, List, MoreHorizontal, Plus, Search, Settings, Trash2, X } from "lucide-react";
import { TaskCalendarView } from "../calendar/TaskCalendarView";
import { taskMatchesSearch, taskMatchesSprintScope } from "../calendar/buildCalendarItems";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import * as ops from "@/domain/projectOps";
import { workTypeLabel, WORK_TYPE_OPTIONS } from "@/domain/labels";
import {
  STAGE_COLORS,
  boardColumns,
  isBuiltinStageId,
  neighborStageId,
  nextStageColor,
  stageDotClass,
  stageNameError,
  type KanbanStage,
  type StageColor,
} from "@/domain/kanbanStages";
import type { StageMenu } from "./kanban/KanbanColumn";
import { WorkType } from "@/domain/schemas";
import type { Person, Priority, Project, Sprint, Task } from "@/domain/schemas";
import { TaskFormDialog } from "./TaskFormDialog";
import { SprintFormDialog } from "./SprintFormDialog";
import { SprintSwitcher, type SprintScope } from "./SprintSwitcher";
import { KanbanColumn } from "./kanban/KanbanColumn";
import { TaskCard } from "./kanban/TaskCard";
import { TaskDetailDrawer } from "./kanban/TaskDetailDrawer";
import { ArchivedTasksList } from "./kanban/ArchivedTasksList";
import { KanbanListView } from "./kanban/KanbanListView";
import { WipLimitConfig } from "./kanban/WipLimitConfig";
import { KanbanColumnPager } from "./kanban/KanbanColumnPager";
import { pickActiveStatus, scrollBoardToColumn } from "./kanban/columnScroll";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface Props {
  project: Project;
  people: Person[];
  mutate: (recipe: (p: Project) => Project) => void;
  /** If set, scroll to and highlight this task id (from deep-link ?focus=). */
  focusId?: string;
}

/** Texto del diálogo de borrado (spec 073 §5.4): N cuenta archivadas y no
 * archivadas; el destino se calcula con la misma regla de `removeStage`. */
function stageDeleteText(
  name: string,
  n: number,
  destName: string | undefined,
): { title: string; description: string } {
  if (n === 0) {
    return { title: `Eliminar "${name}"`, description: "No hay tareas en esta etapa." };
  }
  if (n === 1) {
    return { title: `Eliminar "${name}"`, description: `1 tarea pasa a "${destName}".` };
  }
  return {
    title: `Eliminar "${name}"`,
    description: `${n} tareas pasan a "${destName}".`,
  };
}

export function TasksTab({ project, people, mutate, focusId }: Props) {
  const [dialog, setDialog] = useState<{ open: boolean; task?: Task; status?: string }>(
    { open: false },
  );
  const [sprintDialog, setSprintDialog] = useState<{ open: boolean; sprint?: Sprint }>({
    open: false,
  });
  const [deleteSprint, setDeleteSprint] = useState<Sprint | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  // Ephemeral drag preview: mirrors board-by-column while a drag is in progress so cards reflow
  // live (onDragOver) instead of "jumping" only on drop. Null when no drag is active — render then
  // falls back to `boardFromScope` derived straight from props.
  const [dragBoard, setDragBoard] = useState<Record<string, string[]> | null>(null);
  // Touch drags are restricted to intra-column reorder (see spec 010) — cross-column moves on
  // touch happen via the existing move buttons instead, to avoid fighting the column snap-scroll.
  const isTouchDragRef = useRef(false);
  const focusRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  // Etapa activa del pager móvil (spec 054). El fallback es la primera etapa
  // del proyecto, no "todo" fijo (spec 073 §5.1): el orden puede cambiar.
  const [activeKanbanCol, setActiveKanbanCol] = useState<string>(
    () => project.stages[0]?.id ?? "todo",
  );
  // Alta y edición de etapas (spec 073 §5.2/§5.3); archivar Hecha (§5.5).
  const [newStageOpen, setNewStageOpen] = useState(false);
  const [renameStageTarget, setRenameStageTarget] = useState<KanbanStage | null>(null);
  const [renameName, setRenameName] = useState("");
  const [renameError, setRenameError] = useState<string | null>(null);
  const [deleteStageTarget, setDeleteStageTarget] = useState<KanbanStage | null>(null);
  const [archiveDone, setArchiveDone] = useState<{ ids: string[] } | null>(null);
  const isCarousel = !useBreakpoint("sm");
  const [searchParams, setSearchParams] = useSearchParams();
  const areaFilterId = searchParams.get("area");
  const areaFilter = areaFilterId ? project.areas.find((a) => a.id === areaFilterId) : undefined;

  // Columnas del tablero desde Project.stages + ghosts (spec 073 §5.1).
  const boardCols = useMemo(() => boardColumns(project), [project]);
  const columnIds = useMemo(() => boardCols.map((c) => c.stage.id), [boardCols]);
  const columnIdSet = useMemo(() => new Set(columnIds), [columnIds]);
  const ghostIds = useMemo(
    () => new Set(boardCols.filter((c) => c.ghost).map((c) => c.stage.id)),
    [boardCols],
  );

  // Si el proyecto cambió o se borró la etapa activa, vuelve al frente del tablero.
  useEffect(() => {
    if (!columnIds.includes(activeKanbanCol)) {
      setActiveKanbanCol(columnIds[0] ?? "todo");
    }
  }, [columnIds, activeKanbanCol]);

  // Search state (spec 017)
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);

  // View mode (spec 017 + 053 calendar)
  type TasksViewMode = "kanban" | "list" | "calendar";
  const [viewMode, setViewMode] = useState<TasksViewMode>(() => {
    try {
      const saved =
        localStorage.getItem("tasks-view-mode") ?? localStorage.getItem("kanban-view-mode");
      if (saved === "list" || saved === "calendar" || saved === "kanban") return saved;
      return "kanban";
    } catch {
      return "kanban";
    }
  });

  function setTasksViewMode(next: TasksViewMode) {
    setViewMode(next);
    try {
      localStorage.setItem("tasks-view-mode", next);
    } catch {
      // Ignore localStorage errors
    }
  }

  // WIP limits state (spec 017)
  const [wipConfigOpen, setWipConfigOpen] = useState(false);

  function handleSaveWipLimits(limits: { todo: number | null; doing: number | null; blocked: number | null; done: number | null }) {
    mutate((p) => ({ ...p, wipLimits: limits }));
  }

  // Bulk selection state (spec 017)
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  // Selection mode toggle (spec 017 HU-13)
  const [selectionMode, setSelectionMode] = useState(false);
  // Multi-drag state (spec 017 HU-13)
  const [draggedSelectedIds, setDraggedSelectedIds] = useState<string[]>([]);

  function toggleTaskSelection(taskId: string) {
    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  }

  function selectAllTasks() {
    setSelectedTaskIds(new Set(tasksInScope.map((t) => t.id)));
  }

  function clearSelection() {
    setSelectedTaskIds(new Set());
  }

  function getColumnSelectionState(status: string): "none" | "some" | "all" {
    const columnTaskIds = board[status] ?? [];
    const selectedInColumn = columnTaskIds.filter((id) => selectedTaskIds.has(id));
    if (selectedInColumn.length === 0) return "none";
    if (selectedInColumn.length === columnTaskIds.length) return "all";
    return "some";
  }

  function toggleColumnSelection(status: string) {
    const columnTaskIds = board[status] ?? [];
    const allSelected = columnTaskIds.every((id) => selectedTaskIds.has(id));

    setSelectedTaskIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        columnTaskIds.forEach((id) => next.delete(id));
      } else {
        columnTaskIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  function handleBulkMove(status: string) {
    selectedTaskIds.forEach((taskId) => {
      const task = project.tasks.find((t) => t.id === taskId);
      if (task) {
        mutate((p) => ops.updateTask(p, { ...task, status }));
      }
    });
    clearSelection();
  }

  function handleBulkArchive() {
    selectedTaskIds.forEach((taskId) => {
      const task = project.tasks.find((t) => t.id === taskId);
      if (task) {
        mutate((p) => ops.updateTask(p, { ...task, archived: true }));
      }
    });
    clearSelection();
  }

  function handleBulkDelete() {
    selectedTaskIds.forEach((taskId) => {
      mutate((p) => ops.removeTask(p, taskId));
    });
    clearSelection();
  }

  // Filter state (spec 017)
  const priorityFilter = searchParams.get("priority") as Priority | null;
  const assigneeFilter = searchParams.get("assignee");
  const dateFilter = searchParams.get("date");
  // Spec 062 D15: valor inválido se ignora (no filtra), igual que priority basura.
  const workTypeRaw = searchParams.get("workType");
  const workTypeFilter = WorkType.safeParse(workTypeRaw).success
    ? (workTypeRaw as WorkType)
    : null;

  function setFilter(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  }

  function clearFilters() {
    const next = new URLSearchParams(searchParams);
    next.delete("priority");
    next.delete("assignee");
    next.delete("date");
    next.delete("workType");
    setSearchParams(next, { replace: true });
  }

  const activeFiltersCount = [priorityFilter, assigneeFilter, dateFilter, workTypeFilter].filter(Boolean).length;

  // Detail drawer state (spec 013)
  const detailTaskId = searchParams.get("detail");
  const detailTask = detailTaskId ? project.tasks.find((t) => t.id === detailTaskId) ?? null : null;

  // Archived filter state (spec 015)
  const showArchived = searchParams.get("archived") === "true";

  function toggleArchived() {
    const next = new URLSearchParams(searchParams);
    if (showArchived) {
      next.delete("archived");
    } else {
      next.set("archived", "true");
    }
    setSearchParams(next, { replace: true });
  }

  function openDetail(taskId: string) {
    const next = new URLSearchParams(searchParams);
    next.set("detail", taskId);
    setSearchParams(next, { replace: true });
  }

  function closeDetail() {
    const next = new URLSearchParams(searchParams);
    next.delete("detail");
    setSearchParams(next, { replace: true });
  }

  function handleUpdateTask(updatedTask: Task) {
    mutate((p) => ops.updateTask(p, updatedTask));
  }

  function handleUnarchive(taskId: string) {
    const task = project.tasks.find((t) => t.id === taskId);
    if (task) {
      mutate((p) => ops.updateTask(p, { ...task, archived: false }));
    }
  }

  // Default scope: the project's active sprint if it has one, otherwise "all"
  // (unchanged behavior for projects with no sprints — principio V).
  const activeSprint = project.sprints.find((s) => s.status === "active");
  const sprintScope: SprintScope =
    searchParams.get("sprint") ?? (activeSprint ? activeSprint.id : "all");

  function setSprintScope(scope: SprintScope) {
    const next = new URLSearchParams(searchParams);
    if (scope === "all") next.delete("sprint");
    else next.set("sprint", scope);
    setSearchParams(next, { replace: true });
  }

  // Filter by archived status (spec 015): exclude archived tasks by default
  const archivedFiltered = showArchived
    ? project.tasks.filter((t) => t.archived)
    : project.tasks.filter((t) => !t.archived);

  const areaScoped = areaFilterId
    ? archivedFiltered.filter((t) => t.areaId === areaFilterId)
    : archivedFiltered;

  // Tasks visible in the board: area filter combined with the sprint scope, search query and enriched filters (spec 017).
  const tasksInScope = useMemo(() => {
    let result = areaScoped.filter((t) => taskMatchesSprintScope(t, sprintScope));

    if (debouncedQuery) {
      result = result.filter((t) => taskMatchesSearch(t, debouncedQuery));
    }

    // Apply priority filter
    if (priorityFilter) {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Apply work type filter (spec 062)
    if (workTypeFilter) {
      result = result.filter((t) => t.workType === workTypeFilter);
    }

    // Apply assignee filter
    if (assigneeFilter) {
      result = result.filter((t) => t.assigneeId === assigneeFilter);
    }

    // Apply date filter
    if (dateFilter) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case "overdue":
          result = result.filter((t) => {
            if (!t.dueDate) return false;
            const due = new Date(t.dueDate);
            due.setHours(0, 0, 0, 0);
            return due < today;
          });
          break;
        case "due-soon": {
          const threeDaysFromNow = new Date(today);
          threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
          result = result.filter((t) => {
            if (!t.dueDate) return false;
            const due = new Date(t.dueDate);
            due.setHours(0, 0, 0, 0);
            return due >= today && due <= threeDaysFromNow;
          });
          break;
        }
        case "this-week": {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          result = result.filter((t) => {
            if (!t.dueDate) return false;
            const due = new Date(t.dueDate);
            due.setHours(0, 0, 0, 0);
            return due >= today && due <= weekFromNow;
          });
          break;
        }
      }
    }

    return result;
  }, [areaScoped, sprintScope, debouncedQuery, priorityFilter, assigneeFilter, dateFilter, workTypeFilter]);

  // Spec 054: sync pager with carousel scroll.
  useEffect(() => {
    if (!isCarousel || viewMode !== "kanban" || showArchived) return;
    const board = boardRef.current;
    if (!board) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const ratios = entries
          .map((e) => {
            const status = (e.target as HTMLElement).dataset.kanbanStatus;
            if (!status) return null;
            return { status, intersectionRatio: e.intersectionRatio };
          })
          .filter((x): x is { status: string; intersectionRatio: number } => x !== null);
        if (ratios.length === 0) return;
        // El desempate usa el orden del tablero del proyecto (spec 073 §5.1).
        setActiveKanbanCol((prev) => pickActiveStatus(ratios, prev, columnIds));
      },
      { root: board, threshold: [0.35, 0.55, 0.75] },
    );

    for (const col of columnIds) {
      const el = document.getElementById(`kanban-col-${col}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isCarousel, viewMode, showArchived, tasksInScope.length, columnIds]);

  function scrollToKanbanColumn(status: string) {
    const board = boardRef.current;
    const col = document.getElementById(`kanban-col-${status}`);
    if (board && col) {
      scrollBoardToColumn(board, col);
      setActiveKanbanCol(status);
    }
  }

  // Archived tasks: only apply area filter, not sprint scope (spec 016)
  const archivedTasks = useMemo(() => {
    const archived = project.tasks.filter((t) => t.archived);
    return areaFilterId ? archived.filter((t) => t.areaId === areaFilterId) : archived;
  }, [project.tasks, areaFilterId]);

  // Visible task ids per column, derived from props. The single source of truth outside a drag.
  // Columnas desde Project.stages + ghosts (spec 073 §5.1).
  const boardFromScope = useMemo(() => {
    const board: Record<string, string[]> = {};
    for (const col of boardCols) {
      board[col.stage.id] = tasksInScope.filter((t) => t.status === col.stage.id).map((t) => t.id);
    }
    return board;
  }, [boardCols, tasksInScope]);

  // While dragging, render from the ephemeral preview; otherwise from the derived scope.
  const board = dragBoard ?? boardFromScope;

  function clearAreaFilter() {
    const next = new URLSearchParams(searchParams);
    next.delete("area");
    setSearchParams(next, { replace: true });
  }

  // Distance constraint keeps the card buttons clickable; keyboard sensor for a11y.
  // Mouse + Touch (not the generic Pointer sensor) so each activates independently — mixing
  // Pointer and Touch caused double-activation on touch devices.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Resolves the column empty-space droppable first (fixes dropping on an empty column), then
  // falls back to rect/corner-based resolution for dropping over a specific card.
  const collisionDetection: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) return rectCollisions;
    return closestCorners(args);
  };

  // Scroll focused task into view on first render (deep-link)
  useEffect(() => {
    if (focusId && focusRef.current) {
      focusRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusId]);

  // Escape key to exit selection mode (spec 017 HU-13)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && selectionMode) {
        setSelectionMode(false);
        clearSelection();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectionMode]);

  function submitTask(t: Task) {
    if (project.tasks.some((x) => x.id === t.id)) {
      mutate((p) => ops.updateTask(p, t));
    } else {
      mutate((p) => ops.addTask(p, t));
    }
  }

  function submitSprint(s: Sprint) {
    const isNew = !project.sprints.some((x) => x.id === s.id);
    mutate((p) => (isNew ? ops.addSprint(p, s) : ops.updateSprint(p, s)));
    // Jump straight into the newly created sprint so the user can start adding tasks.
    if (isNew) setSprintScope(s.id);
  }

  function confirmDeleteSprint() {
    if (!deleteSprint) return;
    mutate((p) => ops.removeSprint(p, deleteSprint.id));
    if (sprintScope === deleteSprint.id) setSprintScope("all");
    setDeleteSprint(null);
  }

  function columnOf(b: Record<string, string[]>, taskId: string): string | undefined {
    return columnIds.find((col) => b[col]?.includes(taskId));
  }

  function onDragStart(event: DragStartEvent) {
    // Block drag while the detail drawer is open (spec 013)
    if (detailTaskId) {
      event.activatorEvent.preventDefault?.();
      return;
    }
    const activeTaskId = String(event.active.id);
    setActiveId(activeTaskId);
    // Touch drags are restricted to intra-column reorder (onDragOver below) — column changes on
    // touch go through the existing move buttons instead.
    isTouchDragRef.current = event.activatorEvent.type.startsWith("touch");
    setDragBoard(boardFromScope);
    
    // Multi-drag: if the dragged card is selected and there are other selected cards (spec 017 HU-13)
    if (selectionMode && selectedTaskIds.has(activeTaskId) && selectedTaskIds.size > 1) {
      setDraggedSelectedIds(Array.from(selectedTaskIds));
    } else {
      setDraggedSelectedIds([]);
    }
    
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }

  // Live preview: reflows `dragBoard` on every hover so the drop position is visible before the
  // user lets go — this is what removes the "jump" at drop time.
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeTaskId = String(active.id);
    const overId = String(over.id);

    setDragBoard((prev) => {
      if (!prev) return prev;
      const fromCol = columnOf(prev, activeTaskId);
      const toCol = columnIdSet.has(overId) ? overId : columnOf(prev, overId);
      if (!fromCol || !toCol) return prev;
      // Touch: ignore hovers that would move the card to a different column.
      if (isTouchDragRef.current && toCol !== fromCol) return prev;
      // Ghost de un status desconocido (spec 073 §5.1): origen, no destino.
      if (ghostIds.has(toCol) && toCol !== fromCol) return prev;

      if (toCol === fromCol) {
        const ids = prev[fromCol];
        const oldIndex = ids.indexOf(activeTaskId);
        const newIndex = columnIdSet.has(overId) ? ids.length - 1 : ids.indexOf(overId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
        return { ...prev, [fromCol]: arrayMove(ids, oldIndex, newIndex) };
      }

      const fromIds = prev[fromCol].filter((id) => id !== activeTaskId);
      const toIds = prev[toCol].filter((id) => id !== activeTaskId);
      const insertAt = columnIdSet.has(overId) ? toIds.length : toIds.indexOf(overId);
      const nextToIds = [...toIds];
      nextToIds.splice(insertAt === -1 ? nextToIds.length : insertAt, 0, activeTaskId);
      return { ...prev, [fromCol]: fromIds, [toCol]: nextToIds };
    });
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const finalBoard = dragBoard;
    setActiveId(null);
    setDragBoard(null);
    if (!over || !finalBoard) return;

    const activeTaskId = String(active.id);
    const activeTask = project.tasks.find((t) => t.id === activeTaskId);
    if (!activeTask) return;
    const finalCol = columnOf(finalBoard, activeTaskId);
    if (!finalCol) return;
    // Soltar en un ghost no escribe nada (spec 073 §5.1): el ghost es origen.
    // Solo se permite si la tarea ya vivía ahí (reorden interno del ghost).
    if (ghostIds.has(finalCol) && activeTask.status !== finalCol) return;

    // Multi-drag: move all selected tasks together (spec 017 HU-13)
    if (draggedSelectedIds.length > 1) {
      mutate((p) => {
        let next = p;
        // Move each selected task to the destination column
        draggedSelectedIds.forEach((taskId) => {
          const task = next.tasks.find((t) => t.id === taskId);
          if (task && task.status !== finalCol) {
            next = ops.updateTask(next, { ...task, status: finalCol });
          }
        });
        // Reorder tasks in the destination column
        const orderedIds = finalBoard[finalCol];
        return ops.reorderTasks(next, orderedIds);
      });
      setDraggedSelectedIds([]);
      return;
    }

    // Individual drag (normal behavior)
    const orderedIds = finalBoard[finalCol];
    const unchanged =
      finalCol === activeTask.status &&
      orderedIds.length === boardFromScope[finalCol].length &&
      orderedIds.every((id, i) => id === boardFromScope[finalCol][i]);
    if (unchanged) return;

    // Single persistence for the whole gesture: status change (if any) + final column order.
    mutate((p) => {
      const next =
        finalCol === activeTask.status ? p : ops.updateTask(p, { ...activeTask, status: finalCol });
      return ops.reorderTasks(next, orderedIds);
    });
    setDraggedSelectedIds([]);
  }

  function onDragCancel() {
    setActiveId(null);
    setDragBoard(null);
    setDraggedSelectedIds([]);
  }

  function stageMenuFor(stage: KanbanStage): StageMenu {
    const stages = project.stages;
    const index = stages.findIndex((s) => s.id === stage.id);
    return {
      // Hecha no muestra ninguno; la etapa pegada a Hecha no va a la derecha
      // (spec 073 §5.2: se oculta el sentido que moveStage rechazaría).
      // moveStage vuelve a validar: la op es la red de seguridad.
      canMoveLeft: stage.id !== "done" && index > 0,
      canMoveRight: stage.id !== "done" && index >= 0 && index < stages.length - 2,
      canDelete: !isBuiltinStageId(stage.id),
      onRename: () => openRenameStage(stage),
      onRecolor: (color) => mutate((p) => ops.recolorStage(p, stage.id, color)),
      onMove: (direction) => mutate((p) => ops.moveStage(p, stage.id, direction)),
      onDelete: () => setDeleteStageTarget(stage),
    };
  }

  function openRenameStage(stage: KanbanStage) {
    setRenameStageTarget(stage);
    setRenameName(stage.name);
    setRenameError(null);
  }

  function saveRenameStage() {
    if (!renameStageTarget) return;
    const err = stageNameError(project.stages, renameName, renameStageTarget.id);
    if (err === "empty") {
      setRenameError("Escribí un nombre.");
      return;
    }
    if (err === "duplicate") {
      setRenameError("Ya hay una etapa con ese nombre.");
      return;
    }
    mutate((p) => ops.renameStage(p, renameStageTarget.id, renameName));
    setRenameStageTarget(null);
  }

  function confirmArchiveDone() {
    if (!archiveDone) return;
    const ids = archiveDone.ids;
    // Un solo mutate: el store escribe una vez para todo el lote (spec 073 §5.5).
    mutate((p) =>
      ids.reduce((acc, id) => {
        const task = acc.tasks.find((t) => t.id === id);
        return task ? ops.updateTask(acc, { ...task, archived: true }) : acc;
      }, p),
    );
    setArchiveDone(null);
  }

  // Safe lookup for the DragOverlay — avoids a non-null assertion that could crash on a stray
  // re-render mid-drag if the active task were ever removed.
  const activeTask = activeId ? project.tasks.find((t) => t.id === activeId) : undefined;
  const doneStage = project.stages.find((s) => s.id === "done");
  const doneVisibleIds = doneStage ? board[doneStage.id] ?? [] : [];
  const deleteStageInfo = (() => {
    if (!deleteStageTarget) return null;
    const stages = project.stages;
    const index = stages.findIndex((s) => s.id === deleteStageTarget.id);
    if (index === -1) return null;
    const dest = index > 0 ? stages[index - 1] : stages[index + 1];
    const n = project.tasks.filter((t) => t.status === deleteStageTarget.id).length;
    return stageDeleteText(deleteStageTarget.name, n, dest?.name);
  })();
  return (
    <div>
      <SprintSwitcher
        sprints={project.sprints}
        scope={sprintScope}
        onScopeChange={setSprintScope}
        taskCount={tasksInScope.length}
        onCreateSprint={() => setSprintDialog({ open: true })}
        onEditSprint={(s) => setSprintDialog({ open: true, sprint: s })}
        onDeleteSprint={setDeleteSprint}
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          {areaFilter ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Filtrando por área:
              <Badge variant="secondary">{areaFilter.name}</Badge>
              <Button variant="ghost" size="sm" onClick={clearAreaFilter}>
                <X className="size-3.5" />
                Quitar filtro
              </Button>
            </div>
          ) : null}
          {showArchived && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">Archivadas</Badge>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[8rem] flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 pl-9 sm:h-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative min-h-11 sm:min-h-9">
                <Filter className="size-3.5 sm:mr-1.5" />
                <span className="hidden sm:inline">Filtros</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1.5 size-5 p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-2 py-1.5 text-sm font-semibold">Filtrar por</div>
              <DropdownMenuSeparator />
              <div className="space-y-3 p-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Prioridad</label>
                  <Select
                    value={priorityFilter ?? ""}
                    onChange={(e) => setFilter("priority", e.target.value || null)}
                  >
                    <option value="">Todas</option>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Assignee</label>
                  <Select
                    value={assigneeFilter ?? ""}
                    onChange={(e) => setFilter("assignee", e.target.value || null)}
                  >
                    <option value="">Todos</option>
                    {people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Fecha</label>
                  <Select
                    value={dateFilter ?? ""}
                    onChange={(e) => setFilter("date", e.target.value || null)}
                  >
                    <option value="">Todas</option>
                    <option value="overdue">Vencidas</option>
                    <option value="due-soon">Por vencer (3 días)</option>
                    <option value="this-week">Esta semana</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Tipo</label>
                  <Select
                    value={workTypeFilter ?? ""}
                    onChange={(e) => setFilter("workType", e.target.value || null)}
                  >
                    <option value="">Todas</option>
                    {WORK_TYPE_OPTIONS.map((v) => (
                      <option key={v} value={v}>
                        {workTypeLabel[v]}
                      </option>
                    ))}
                  </Select>
                </div>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full">
                    <X className="size-3.5 mr-1.5" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* Vistas: iconos en móvil, texto en sm+ */}
          <div className="flex items-center rounded-md border border-border/70">
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTasksViewMode("kanban")}
              className="min-h-11 rounded-r-none px-2.5 sm:min-h-9 sm:px-3"
              title="Vista Kanban"
              aria-label="Vista Kanban"
              aria-pressed={viewMode === "kanban"}
            >
              <LayoutGrid className="size-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Kanban</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTasksViewMode("list")}
              className="min-h-11 rounded-none border-l border-border/70 px-2.5 sm:min-h-9 sm:px-3"
              title="Vista Lista"
              aria-label="Vista Lista"
              aria-pressed={viewMode === "list"}
            >
              <List className="size-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Lista</span>
            </Button>
            <Button
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTasksViewMode("calendar")}
              className="min-h-11 rounded-l-none border-l border-border/70 px-2.5 sm:min-h-9 sm:px-3"
              title="Vista Calendario"
              aria-label="Vista Calendario"
              aria-pressed={viewMode === "calendar"}
            >
              <CalendarDays className="size-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Calendario</span>
            </Button>
          </div>

          {/* Spec 054: acciones secundarias en menú Más en móvil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="min-h-11 sm:hidden" aria-label="Más opciones">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setWipConfigOpen(true)}>
                <Settings className="mr-2 size-4" /> WIP
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleArchived}>
                <Archive className="mr-2 size-4" />
                {showArchived ? "Ver activas" : `Archivadas (${project.tasks.filter((t) => t.archived).length})`}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={showArchived}
                onClick={() => {
                  if (selectionMode) {
                    setSelectionMode(false);
                    clearSelection();
                  } else {
                    setSelectionMode(true);
                  }
                }}
              >
                <CheckSquare className="mr-2 size-4" />
                {selectionMode ? "Cancelar selección" : "Seleccionar"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setWipConfigOpen(true)}
            title="Configurar WIP limits"
            className="hidden sm:inline-flex"
          >
            <Settings className="size-3.5 mr-1.5" />
            WIP
          </Button>
          <Button
            variant={showArchived ? "secondary" : "outline"}
            size="sm"
            onClick={toggleArchived}
            className="hidden sm:inline-flex"
          >
            <Archive className="size-3.5 mr-1.5" />
            {showArchived ? "Ver activas" : `Archivadas (${project.tasks.filter((t) => t.archived).length})`}
          </Button>
          <Button
            variant={selectionMode ? "secondary" : "outline"}
            size="sm"
            className="hidden sm:inline-flex"
            onClick={() => {
              if (selectionMode) {
                setSelectionMode(false);
                clearSelection();
              } else {
                setSelectionMode(true);
              }
            }}
            disabled={showArchived}
          >
            <CheckSquare className="size-3.5 mr-1.5" />
            {selectionMode ? "Cancelar" : "Seleccionar"}
          </Button>
          <Button
            className="min-h-11 sm:min-h-9"
            onClick={() =>
              setDialog({
                open: true,
                // En el carrusel, la tarea nace en la columna visible. Un ghost
                // no es destino: el alta cae en la etapa por defecto del formulario.
                status:
                  isCarousel && viewMode === "kanban" && !ghostIds.has(activeKanbanCol)
                    ? activeKanbanCol
                    : undefined,
              })
            }
            disabled={showArchived}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nueva tarea</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        </div>
      </div>

      {selectedTaskIds.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <span className="text-sm font-medium">
            {selectedTaskIds.size} tarea{selectedTaskIds.size !== 1 ? "s" : ""} seleccionada{selectedTaskIds.size !== 1 ? "s" : ""}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" onClick={selectAllTasks}>
              Seleccionar todas
            </Button>
            <Select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkMove(e.target.value);
                }
              }}
              value=""
              className="h-8 py-1 text-sm"
            >
              <option value="">Mover a...</option>
              {project.stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
            <Button variant="outline" size="sm" onClick={handleBulkArchive}>
              <Archive className="size-3.5 mr-1.5" />
              Archivar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="size-3.5 mr-1.5" />
              Eliminar
            </Button>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              <X className="size-3.5 mr-1.5" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {showArchived ? (
        <ArchivedTasksList
          project={project}
          tasks={archivedTasks}
          areas={project.areas}
          people={people}
          onOpenDetail={openDetail}
          onUnarchive={handleUnarchive}
        />
      ) : viewMode === "list" ? (
        <KanbanListView
          project={project}
          tasks={tasksInScope}
          areas={project.areas}
          people={people}
          onOpenDetail={openDetail}
        />
      ) : viewMode === "calendar" ? (
        <TaskCalendarView
          project={project}
          tasksInScope={tasksInScope}
          sprintScope={sprintScope}
          onOpenTask={openDetail}
          onFocusSprint={(id) => setSprintScope(id)}
        />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetection}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          {/* Spec 054: pager de columnas en carrusel móvil */}
          {isCarousel && (
            <div className="sticky top-0 z-10 -mx-1 mb-3 bg-background/95 px-1 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <KanbanColumnPager
                columns={boardCols.map(({ stage }) => ({
                  id: stage.id,
                  name: stage.name,
                  color: stage.color,
                  count: board[stage.id]?.length ?? 0,
                }))}
                active={activeKanbanCol}
                onSelect={scrollToKanbanColumn}
                onAddStage={() => setNewStageOpen(true)}
              />
            </div>
          )}
          <div
            ref={boardRef}
            className="flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-thin sm:snap-none sm:gap-4"
          >
            {boardCols.map(({ stage, ghost }) => {
              const ids = board[stage.id] ?? [];
              const tasks = ids
                .map((id) => project.tasks.find((t) => t.id === id))
                .filter((t): t is Task => !!t);
              const isDoneCol = !ghost && stage.id === "done";
              return (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  ghost={ghost}
                  count={tasks.length}
                  // WIP solo para las cuatro etapas base (spec 073 D10).
                  wipLimit={
                    !ghost && isBuiltinStageId(stage.id)
                      ? project.wipLimits?.[stage.id] ?? null
                      : null
                  }
                  taskIds={ids}
                  onAdd={
                    ghost
                      ? undefined
                      : () => setDialog({ open: true, status: stage.id })
                  }
                  archiveAction={
                    isDoneCol && doneVisibleIds.length > 0
                      ? {
                          label: `Archivar ${doneVisibleIds.length}`,
                          onOpen: () => setArchiveDone({ ids: [...doneVisibleIds] }),
                        }
                      : undefined
                  }
                  stageMenu={ghost ? undefined : stageMenuFor(stage)}
                  selectionMode={selectionMode}
                  columnSelectionState={getColumnSelectionState(stage.id)}
                  onToggleColumnSelection={() => toggleColumnSelection(stage.id)}
                >
                  {tasks.map((t) => {
                    const prevStatus = neighborStageId(project.stages, t.status, -1);
                    const nextStatus = neighborStageId(project.stages, t.status, 1);
                    return (
                      <TaskCard
                        key={t.id}
                        task={t}
                        area={project.areas.find((a) => a.id === t.areaId)}
                        assignee={people.find((p) => p.id === t.assigneeId)}
                        sprint={
                          sprintScope === "all"
                            ? project.sprints.find((s) => s.id === t.sprintId)
                            : undefined
                        }
                        focused={t.id === focusId}
                        focusRef={focusRef}
                        disabled={!!detailTaskId}
                        searchQuery={debouncedQuery}
                        selected={selectedTaskIds.has(t.id)}
                        onToggleSelect={() => toggleTaskSelection(t.id)}
                        selectionMode={selectionMode}
                        // Flechas al vecino del tablero; en el extremo no se
                        // muestran (spec 073 §5.1).
                        onMoveBack={
                          prevStatus
                            ? () =>
                                mutate((p) =>
                                  ops.updateTask(p, { ...t, status: prevStatus }),
                                )
                            : undefined
                        }
                        onMove={
                          nextStatus
                            ? () =>
                                mutate((p) =>
                                  ops.updateTask(p, { ...t, status: nextStatus }),
                                )
                            : undefined
                        }
                        onToggleBlock={() =>
                          mutate((p) =>
                            ops.updateTask(p, {
                              ...t,
                              status: t.status === "blocked" ? "doing" : "blocked",
                            })
                          )
                        }
                        onEdit={() => openDetail(t.id)}
                        onDelete={() => mutate((p) => ops.removeTask(p, t.id))}
                        onOpenDetail={() => openDetail(t.id)}
                        onArchive={() =>
                          mutate((p) => ops.updateTask(p, { ...t, archived: !t.archived }))
                        }
                      />
                    );
                  })}
                </KanbanColumn>
              );
            })}
            {/* Alta de etapa al final de la fila (spec 073 §5.3). En el
                carrusel el «+» del pager ya cumple ese papel. */}
            <button
              type="button"
              onClick={() => setNewStageOpen(true)}
              className="hidden w-16 shrink-0 flex-col items-center justify-center gap-1.5 self-start rounded-xl border-2 border-dashed border-border/70 px-1 py-4 text-center text-[11px] leading-tight text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground sm:flex"
            >
              <Plus className="size-4 shrink-0" />
              Nueva etapa
            </button>
          </div>
          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: "cubic-bezier(0.2, 0, 0, 1)",
            }}
          >
            {activeTask ? (
              <div className="relative">
                <TaskCard
                  task={activeTask}
                  area={project.areas.find((a) => a.id === activeTask.areaId)}
                  assignee={people.find((p) => p.id === activeTask.assigneeId)}
                  focused={false}
                  isOverlay
                  selectionMode={selectionMode}
                  selected={selectedTaskIds.has(activeTask.id)}
                  onMoveBack={() => {}}
                  onMove={() => {}}
                  onToggleBlock={() => {}}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onOpenDetail={() => {}}
                  onArchive={() => {}}
                />
                {draggedSelectedIds.length > 1 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 size-6 p-0 flex items-center justify-center text-xs font-bold shadow-lg"
                  >
                    {draggedSelectedIds.length}
                  </Badge>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <TaskFormDialog
        open={dialog.open}
        onOpenChange={(o) => setDialog((s) => ({ ...s, open: o }))}
        task={dialog.task}
        areas={project.areas}
        people={people}
        sprints={project.sprints}
        stages={project.stages}
        defaultStatus={dialog.status}
        defaultSprintId={sprintScope === "all" || sprintScope === "backlog" ? null : sprintScope}
        onSubmit={submitTask}
      />

      <SprintFormDialog
        open={sprintDialog.open}
        onOpenChange={(o) => setSprintDialog((s) => ({ ...s, open: o }))}
        sprint={sprintDialog.sprint}
        onSubmit={submitSprint}
      />

      <ConfirmDialog
        open={!!deleteSprint}
        onOpenChange={(o) => !o && setDeleteSprint(null)}
        title={`¿Eliminar "${deleteSprint?.name}"?`}
        description="Las tareas del sprint volverán al backlog."
        onConfirm={confirmDeleteSprint}
      />

      <TaskDetailDrawer
        task={detailTask}
        projectId={project.id}
        areas={project.areas}
        people={people}
        sprints={project.sprints}
        stages={project.stages}
        onUpdate={handleUpdateTask}
        onClose={closeDetail}
      />

      <WipLimitConfig
        open={wipConfigOpen}
        wipLimits={project.wipLimits ?? { todo: null, doing: null, blocked: null, done: null }}
        onSave={handleSaveWipLimits}
        onClose={() => setWipConfigOpen(false)}
      />

      {/* Alta de etapa (spec 073 §5.3): nombre + muestras de color. */}
      <NewStageDialog
        open={newStageOpen}
        onOpenChange={setNewStageOpen}
        stages={project.stages}
        onCreate={(name, color) => mutate((p) => ops.addStage(p, { name, color }))}
      />

      {/* Renombrar etapa (spec 073 §5.2): valida contra project.stages. */}
      <Dialog
        open={!!renameStageTarget}
        onOpenChange={(o) => {
          if (!o) setRenameStageTarget(null);
        }}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Renombrar etapa</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Input
              value={renameName}
              maxLength={40}
              autoFocus
              aria-label="Nombre de la etapa"
              onChange={(e) => {
                setRenameName(e.target.value);
                if (renameError) setRenameError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  saveRenameStage();
                }
              }}
            />
            {renameError && (
              <p role="alert" className="mt-1.5 text-xs text-destructive">
                {renameError}
              </p>
            )}
          </DialogBody>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRenameStageTarget(null)}>
              Cancelar
            </Button>
            <Button onClick={saveRenameStage}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Eliminar etapa nueva (spec 073 §5.4): avisa cuántas tareas se mueven
          y a dónde. Cancelar no cambia nada. */}
      <ConfirmDialog
        open={!!deleteStageTarget && !!deleteStageInfo}
        onOpenChange={(o) => {
          if (!o) setDeleteStageTarget(null);
        }}
        title={deleteStageInfo?.title ?? ""}
        description={deleteStageInfo?.description ?? ""}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (!deleteStageTarget) return;
          const id = deleteStageTarget.id;
          mutate((p) => ops.removeStage(p, id));
          setDeleteStageTarget(null);
        }}
      />

      {/* Archivar lo visible en Hecha (spec 073 §5.5): un solo mutate. */}
      <ConfirmDialog
        open={!!archiveDone}
        onOpenChange={(o) => {
          if (!o) setArchiveDone(null);
        }}
        title={
          archiveDone
            ? archiveDone.ids.length === 1
              ? `Archivar 1 tarea de ${doneStage?.name}? Sale del tablero y queda en Archivadas.`
              : `Archivar ${archiveDone.ids.length} tareas de ${doneStage?.name}? Salen del tablero y quedan en Archivadas.`
            : ""
        }
        confirmLabel="Archivar"
        confirmVariant="default"
        onConfirm={confirmArchiveDone}
      />
    </div>
  );
}

/** Alta de etapa (spec 073 §5.3). El color inicial es la primera clave libre
 * de la paleta; el error se muestra debajo del input y no cierra. */
function NewStageDialog({
  open,
  onOpenChange,
  stages,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  stages: KanbanStage[];
  onCreate: (name: string, color: StageColor) => void;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<StageColor>("rose");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setColor(nextStageColor(stages));
      setError(null);
    }
    // `stages` solo alimenta el color inicial: recomputarlo en cada mutate
    // del proyecto no cambia nada visible con el diálogo abierto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function submit() {
    const err = stageNameError(stages, name);
    if (err === "empty") {
      setError("Escribí un nombre.");
      return;
    }
    if (err === "duplicate") {
      setError("Ya hay una etapa con ese nombre.");
      return;
    }
    onCreate(name.trim(), color);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Nueva etapa</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Input
            value={name}
            maxLength={40}
            autoFocus
            aria-label="Nombre de la etapa"
            placeholder="Ej: Revisión"
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
          {error && (
            <p role="alert" className="mt-1.5 text-xs text-destructive">
              {error}
            </p>
          )}
          <div
            role="group"
            aria-label="Color de la etapa"
            className="mt-3 flex items-center gap-1.5"
          >
            {STAGE_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                aria-pressed={c === color}
                className={cn(
                  "size-5 rounded-full transition-transform hover:scale-110",
                  stageDotClass(c),
                  c === color && "ring-2 ring-foreground ring-offset-2",
                )}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit}>Crear</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
