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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Select } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import * as ops from "@/domain/projectOps";
import { TASK_COLUMNS, workTypeLabel, WORK_TYPE_OPTIONS } from "@/domain/labels";
import { WorkType } from "@/domain/schemas";
import type { Person, Priority, Project, Sprint, Task, TaskStatus } from "@/domain/schemas";
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
import { useDebounce } from "@/hooks/useDebounce";
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface Props {
  project: Project;
  people: Person[];
  mutate: (recipe: (p: Project) => Project) => void;
  /** If set, scroll to and highlight this task id (from deep-link ?focus=). */
  focusId?: string;
}

const NEXT: Record<TaskStatus, TaskStatus> = {
  todo: "doing",
  doing: "done",
  blocked: "doing",
  done: "todo",
};

const PREV: Record<TaskStatus, TaskStatus> = {
  todo: "done",
  doing: "todo",
  blocked: "doing",
  done: "doing",
};

const COLUMN_IDS = new Set<string>(TASK_COLUMNS);

export function TasksTab({ project, people, mutate, focusId }: Props) {
  const [dialog, setDialog] = useState<{ open: boolean; task?: Task; status?: TaskStatus }>(
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
  const [dragBoard, setDragBoard] = useState<Record<TaskStatus, string[]> | null>(null);
  // Touch drags are restricted to intra-column reorder (see spec 010) — cross-column moves on
  // touch happen via the existing move buttons instead, to avoid fighting the column snap-scroll.
  const isTouchDragRef = useRef(false);
  const focusRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [activeKanbanCol, setActiveKanbanCol] = useState<TaskStatus>("todo");
  const isCarousel = !useBreakpoint("sm");
  const [searchParams, setSearchParams] = useSearchParams();
  const areaFilterId = searchParams.get("area");
  const areaFilter = areaFilterId ? project.areas.find((a) => a.id === areaFilterId) : undefined;

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

  function getColumnSelectionState(status: TaskStatus): "none" | "some" | "all" {
    const columnTaskIds = board[status];
    const selectedInColumn = columnTaskIds.filter((id) => selectedTaskIds.has(id));
    if (selectedInColumn.length === 0) return "none";
    if (selectedInColumn.length === columnTaskIds.length) return "all";
    return "some";
  }

  function toggleColumnSelection(status: TaskStatus) {
    const columnTaskIds = board[status];
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

  function handleBulkMove(status: TaskStatus) {
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
            const status = (e.target as HTMLElement).dataset.kanbanStatus as TaskStatus | undefined;
            if (!status) return null;
            return { status, intersectionRatio: e.intersectionRatio };
          })
          .filter((x): x is { status: TaskStatus; intersectionRatio: number } => x !== null);
        if (ratios.length === 0) return;
        setActiveKanbanCol((prev) => pickActiveStatus(ratios, prev));
      },
      { root: board, threshold: [0.35, 0.55, 0.75] },
    );

    for (const col of TASK_COLUMNS) {
      const el = document.getElementById(`kanban-col-${col}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [isCarousel, viewMode, showArchived, tasksInScope.length]);

  function scrollToKanbanColumn(status: TaskStatus) {
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
  const boardFromScope = useMemo(() => {
    const board = {} as Record<TaskStatus, string[]>;
    for (const col of TASK_COLUMNS) {
      board[col] = tasksInScope.filter((t) => t.status === col).map((t) => t.id);
    }
    return board;
  }, [tasksInScope]);

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

  function columnOf(b: Record<TaskStatus, string[]>, taskId: string): TaskStatus | undefined {
    return TASK_COLUMNS.find((col) => b[col].includes(taskId));
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
      const toCol = COLUMN_IDS.has(overId) ? (overId as TaskStatus) : columnOf(prev, overId);
      if (!fromCol || !toCol) return prev;
      // Touch: ignore hovers that would move the card to a different column.
      if (isTouchDragRef.current && toCol !== fromCol) return prev;

      if (toCol === fromCol) {
        const ids = prev[fromCol];
        const oldIndex = ids.indexOf(activeTaskId);
        const newIndex = COLUMN_IDS.has(overId) ? ids.length - 1 : ids.indexOf(overId);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return prev;
        return { ...prev, [fromCol]: arrayMove(ids, oldIndex, newIndex) };
      }

      const fromIds = prev[fromCol].filter((id) => id !== activeTaskId);
      const toIds = prev[toCol].filter((id) => id !== activeTaskId);
      const insertAt = COLUMN_IDS.has(overId) ? toIds.length : toIds.indexOf(overId);
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

  // Safe lookup for the DragOverlay — avoids a non-null assertion that could crash on a stray
  // re-render mid-drag if the active task were ever removed.
  const activeTask = activeId ? project.tasks.find((t) => t.id === activeId) : undefined;

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
                status: isCarousel && viewMode === "kanban" ? activeKanbanCol : undefined,
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
                  handleBulkMove(e.target.value as TaskStatus);
                }
              }}
              value=""
              className="h-8 py-1 text-sm"
            >
              <option value="">Mover a...</option>
              <option value="todo">Por hacer</option>
              <option value="doing">En curso</option>
              <option value="blocked">Bloqueada</option>
              <option value="done">Hecha</option>
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
          tasks={archivedTasks}
          areas={project.areas}
          people={people}
          onOpenDetail={openDetail}
          onUnarchive={handleUnarchive}
        />
      ) : viewMode === "list" ? (
        <KanbanListView
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
                columns={TASK_COLUMNS.map((status) => ({
                  status,
                  count: board[status].length,
                }))}
                active={activeKanbanCol}
                onSelect={scrollToKanbanColumn}
              />
            </div>
          )}
          <div
            ref={boardRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-4 xl:grid-cols-4 xl:gap-3 sm:snap-none sm:overflow-visible"
          >
            {TASK_COLUMNS.map((col) => {
              const ids = board[col];
              const tasks = ids
                .map((id) => project.tasks.find((t) => t.id === id))
                .filter((t): t is Task => !!t);
              return (
                <KanbanColumn
                  key={col}
                  status={col}
                  count={tasks.length}
                  wipLimit={project.wipLimits?.[col]}
                  taskIds={ids}
                  onAdd={() => setDialog({ open: true, status: col })}
                  selectionMode={selectionMode}
                  columnSelectionState={getColumnSelectionState(col)}
                  onToggleColumnSelection={() => toggleColumnSelection(col)}
                >
                  {tasks.map((t) => (
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
                      onMoveBack={() =>
                        mutate((p) => ops.updateTask(p, { ...t, status: PREV[t.status] }))
                      }
                      onMove={() =>
                        mutate((p) => ops.updateTask(p, { ...t, status: NEXT[t.status] }))
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
                  ))}
                </KanbanColumn>
              );
            })}
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
        onUpdate={handleUpdateTask}
        onClose={closeDetail}
      />

      <WipLimitConfig
        open={wipConfigOpen}
        wipLimits={project.wipLimits ?? { todo: null, doing: null, blocked: null, done: null }}
        onSave={handleSaveWipLimits}
        onClose={() => setWipConfigOpen(false)}
      />
    </div>
  );
}
