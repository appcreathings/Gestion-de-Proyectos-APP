import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Archive, Link2, MessageCircle, Send, X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { EntitySelect } from "@/components/forms/EntitySelect";
import { PersonSelect } from "@/components/forms/PersonSelect";
import { DateFieldPreview } from "@/components/forms/DateFieldPreview";
import { RichTextField } from "@/components/forms/RichTextField";
import { priorityLabel, taskStatusLabel, TASK_COLUMNS, workTypeLabel, WORK_TYPE_OPTIONS } from "@/domain/labels";
import { daysUntil } from "@/domain/compute";
import { krProgress } from "@/domain/krProgress";
import { uuid, nowIso, cn } from "@/lib/utils";
import {
  MAX_TASK_LINKS,
  normalizeTaskLinkUrl,
  taskLinkDisplayLabel,
} from "@/lib/taskLinks";
import type {
  Area,
  Comment,
  Person,
  Priority,
  Sprint,
  Subtask,
  Task,
  TaskLink,
  TaskStatus,
  WorkType,
} from "@/domain/schemas";
import { AttachmentsSection } from "@/components/attachments/AttachmentsSection";
import { useChatStore } from "@/store/useChatStore";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { PropertyRow, QUIET_CONTROL, QUIET_DATE, QUIET_INPUT } from "./PropertyRow";
import { dueLabel, dueSuffix, metaLabel, relativeSince } from "./taskDetailLabels";

/** Pastilla de estado de la cabecera (spec 064 D5, design §5).
 *
 * `blocked` y `done` llevan pareja clara/oscura explícita en vez de
 * `bg-destructive/10 text-destructive`: en tema oscuro ese token es un rojo
 * apagado (#bb2a2a) que sobre el fondo casi negro del panel no llegaba a AA.
 * Es el mismo patrón que ya usa el chip ámbar de "vence pronto". */
const STATUS_PILL: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  doing: "bg-accent text-accent-foreground",
  blocked: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100",
  done: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
};

const STATUS_DOT: Record<TaskStatus, string> = {
  todo: "bg-muted-foreground",
  doing: "bg-primary",
  blocked: "bg-destructive",
  done: "bg-success",
};

/** Punto de prioridad: `low` va hueco para que "sin urgencia" no pese. */
const PRIORITY_DOT: Record<Priority, string> = {
  low: "border border-muted-foreground",
  medium: "bg-muted-foreground",
  high: "bg-warning",
  critical: "bg-destructive",
};

/** Ancho de panel a partir del cual las propiedades caben en dos columnas.
 *
 * Es el ancho del **drawer**, no del viewport: el panel es redimensionable y
 * guarda su ancho en `localStorage`, así que una media query de viewport daría
 * el resultado equivocado en una ventana ancha con el panel estrecho
 * (spec 064 D3, CA-05). */
const TWO_COLUMN_MIN_WIDTH = 460;

interface Props {
  task: Task | null;
  /** Id del proyecto contenedor — requerido para anexos (spec 042). */
  projectId?: string | null;
  areas: Area[];
  people: Person[];
  sprints: Sprint[];
  onUpdate: (updated: Task) => void;
  onClose: () => void;
}

export function TaskDetailDrawer({
  task,
  projectId,
  areas,
  people,
  sprints,
  onUpdate,
  onClose,
}: Props) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<Priority>("medium");
  const [workType, setWorkType] = useState<WorkType>("task");
  // Métrica KR como strings — vacío → null; nunca se persiste NaN (spec 062 D8).
  const [krCurrent, setKrCurrent] = useState("");
  const [krTarget, setKrTarget] = useState("");
  const [krUnit, setKrUnit] = useState("");
  const [areaId, setAreaId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sprintId, setSprintId] = useState("");
  const [newComment, setNewComment] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const [estimate, setEstimate] = useState("");
  const [actualHours, setActualHours] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [showAddLink, setShowAddLink] = useState(false);
  const [drawerWidth, setDrawerWidth] = useState(() => {
    try {
      const saved = localStorage.getItem("kanban-drawer-width");
      return saved ? parseInt(saved, 10) : 400;
    } catch {
      return 400;
    }
  });
  const drawerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  // Spec 048 HU-02: sit drawer to the left of the assistant on desktop when both open.
  const assistantOpen = useChatStore((s) => s.open);
  const assistantPanelWidth = useChatStore((s) => s.panelWidth);
  const isDesktop = useBreakpoint("lg");
  const isMdUp = useBreakpoint("md");
  const isMobile = !isMdUp;
  const sideBySide = assistantOpen && isDesktop;
  const commentComposerRef = useRef<HTMLTextAreaElement>(null);

  // Spec 054: lock body scroll while drawer is open on mobile.
  useEffect(() => {
    if (!task || !isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [task, isMobile]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setSummary(task.summary ?? "");
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setWorkType(task.workType ?? "task");
      setKrCurrent(task.krCurrent !== null && task.krCurrent !== undefined ? String(task.krCurrent) : "");
      setKrTarget(task.krTarget !== null && task.krTarget !== undefined ? String(task.krTarget) : "");
      setKrUnit(task.krUnit ?? "");
      setAreaId(task.areaId ?? "");
      setAssigneeId(task.assigneeId ?? "");
      setDueDate(task.dueDate ?? "");
      setSprintId(task.sprintId ?? "");
      setEstimate(task.estimate !== null && task.estimate !== undefined ? String(task.estimate) : "");
      setActualHours(
        task.actualHours !== null && task.actualHours !== undefined
          ? String(task.actualHours)
          : "",
      );
      setSubtasks(task.subtasks ?? []);
    }
  }, [task]);

  // Al cambiar de tarea, cierra el formulario de links sin pelear con updates del mismo id.
  useEffect(() => {
    setLinkUrl("");
    setLinkLabel("");
    setLinkError(null);
    setShowAddLink(false);
  }, [task?.id]);

  useEffect(() => {
    if (!task) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [task, onClose]);

  // El título crece hacia abajo en vez de recortarse: es un textarea de una
  // línea al que se le ajusta el alto al contenido (spec 064 D4).
  //
  // No se le pone foco al abrir la tarea a propósito: robaba el cursor y
  // dejaba el panel en modo edición sin que nadie lo pidiera.
  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [title, task?.id]);

  // Get all existing tags from all tasks for autocomplete
  const allExistingTags = useMemo(() => {
    const tags = new Set<string>();
    // We need to get tags from all tasks in the project, but we only have access to the current task
    // For now, we'll use tags from the current task only
    // In a real implementation, we'd pass all project tasks as a prop
    if (task?.tags) {
      for (const tag of task.tags) {
        tags.add(tag);
      }
    }
    return Array.from(tags);
  }, [task]);

  const filteredTagSuggestions = useMemo(() => {
    if (!tagInput) return [];
    const input = tagInput.toLowerCase();
    return allExistingTags.filter(
      (tag) => tag.toLowerCase().includes(input) && !(task?.tags ?? []).includes(tag),
    );
  }, [tagInput, allExistingTags, task]);

  const addTag = useCallback(
    (tag: string) => {
      if (!task) return;
      const trimmed = tag.trim();
      if (!trimmed) return;
      if ((task.tags ?? []).includes(trimmed)) return;
      onUpdate({
        ...task,
        tags: [...(task.tags ?? []), trimmed],
        updatedAt: nowIso(),
      });
      setTagInput("");
      setShowTagSuggestions(false);
    },
    [task, onUpdate],
  );

  const removeTag = useCallback(
    (tag: string) => {
      if (!task) return;
      onUpdate({
        ...task,
        tags: (task.tags ?? []).filter((t) => t !== tag),
        updatedAt: nowIso(),
      });
    },
    [task, onUpdate],
  );

  /** Estimación y tiempo real comparten forma: horas, vacío → null.
   *
   * Un solo manejador para los dos (spec 064 D12). Se valida con `Number` y no
   * con `parseFloat`, que aceptaba "8abc" y guardaba 8 en silencio; el mismo
   * criterio de "no persistir NaN" que la métrica de KR (spec 062 D8). */
  const handleHoursChange = useCallback(
    (field: "estimate" | "actualHours", value: string) => {
      if (!task) return;
      if (field === "estimate") setEstimate(value);
      else setActualHours(value);

      const trimmed = value.trim();
      const num = trimmed === "" ? null : Number(trimmed);
      if (num !== null && !Number.isFinite(num)) return;
      if (num === (task[field] ?? null)) return;
      onUpdate({ ...task, [field]: num, updatedAt: nowIso() });
    },
    [task, onUpdate],
  );

  const handleKrNumberChange = useCallback(
    (field: "krCurrent" | "krTarget", value: string) => {
      if (!task) return;
      if (field === "krCurrent") setKrCurrent(value);
      else setKrTarget(value);
      const trimmed = value.trim();
      // Vacío → null (KR cualitativo). No finito → no se toca el draft ni se
      // persiste: nunca guardar NaN.
      if (trimmed === "") {
        if ((task[field] ?? null) !== null) {
          onUpdate({ ...task, [field]: null, updatedAt: nowIso() });
        }
        return;
      }
      const num = Number(trimmed);
      if (!Number.isFinite(num)) return;
      if (num === (task[field] ?? null)) return;
      onUpdate({ ...task, [field]: num, updatedAt: nowIso() });
    },
    [task, onUpdate],
  );

  const handleKrUnitBlur = useCallback(() => {
    if (!task) return;
    const next = krUnit.trim();
    if (next !== (task.krUnit ?? "")) {
      onUpdate({ ...task, krUnit: next, updatedAt: nowIso() });
    }
  }, [task, krUnit, onUpdate]);

  const addSubtask = useCallback(() => {
    if (!task || !newSubtaskTitle.trim()) return;
    const newSubtask: Subtask = {
      id: uuid(),
      title: newSubtaskTitle.trim(),
      done: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    const updatedSubtasks = [...subtasks, newSubtask];
    setSubtasks(updatedSubtasks);
    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
      updatedAt: nowIso(),
    });
    setNewSubtaskTitle("");
  }, [task, subtasks, newSubtaskTitle, onUpdate]);

  const toggleSubtask = useCallback(
    (subtaskId: string) => {
      if (!task) return;
      const updatedSubtasks = subtasks.map((s) =>
        s.id === subtaskId
          ? { ...s, done: !s.done, updatedAt: nowIso() }
          : s,
      );
      setSubtasks(updatedSubtasks);
      onUpdate({
        ...task,
        subtasks: updatedSubtasks,
        updatedAt: nowIso(),
      });
    },
    [task, subtasks, onUpdate],
  );

  const deleteSubtask = useCallback(
    (subtaskId: string) => {
      if (!task) return;
      const updatedSubtasks = subtasks.filter((s) => s.id !== subtaskId);
      setSubtasks(updatedSubtasks);
      onUpdate({
        ...task,
        subtasks: updatedSubtasks,
        updatedAt: nowIso(),
      });
    },
    [task, subtasks, onUpdate],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const rightEdge = sideBySide
        ? window.innerWidth - assistantPanelWidth
        : window.innerWidth;
      const newWidth = rightEdge - e.clientX;
      const maxWidth = sideBySide
        ? Math.min(800, window.innerWidth - assistantPanelWidth - 200)
        : 800;
      const clamped = Math.min(maxWidth, Math.max(320, newWidth));
      setDrawerWidth(clamped);
    };

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        try {
          localStorage.setItem("kanban-drawer-width", String(drawerWidth));
        } catch {
          // Ignore localStorage errors
        }
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drawerWidth, sideBySide, assistantPanelWidth]);

  // Re-clamp drawer width when the assistant opens or is resized beside it (D6).
  useEffect(() => {
    if (!sideBySide) return;
    const maxWidth = Math.min(800, window.innerWidth - assistantPanelWidth - 200);
    setDrawerWidth((w) => Math.min(w, Math.max(320, maxWidth)));
  }, [sideBySide, assistantPanelWidth]);

  const persist = useCallback(
    (field: string, value: string | null) => {
      if (!task) return;
      const updates: Partial<Task> = {};
      switch (field) {
        case "title":
          if ((value as string).trim() && (value as string).trim() !== task.title)
            updates.title = (value as string).trim();
          break;
        case "summary":
          if ((value as string) !== (task.summary ?? "")) updates.summary = value as string;
          break;
        case "description":
          if (value !== task.description) updates.description = value as string;
          break;
        case "status":
          if (value !== task.status) updates.status = value as TaskStatus;
          break;
        case "priority":
          if (value !== task.priority) updates.priority = value as Priority;
          break;
        case "workType":
          if (value !== task.workType) updates.workType = value as WorkType;
          break;
        case "areaId":
          {
            const v = (value as string) || null;
            if (v !== task.areaId) updates.areaId = v;
          }
          break;
        case "assigneeId":
          {
            const v = (value as string) || null;
            if (v !== task.assigneeId) updates.assigneeId = v;
          }
          break;
        case "dueDate":
          {
            const v = (value as string) || null;
            if (v !== task.dueDate) updates.dueDate = v;
          }
          break;
        case "sprintId":
          {
            const v = (value as string) || null;
            if (v !== task.sprintId) updates.sprintId = v;
          }
          break;
      }
      if (Object.keys(updates).length > 0) {
        onUpdate({ ...task, ...updates, updatedAt: new Date().toISOString() });
      }
    },
    [task, onUpdate],
  );

  const addComment = useCallback(() => {
    if (!task || !newComment.trim()) return;
    const comment: Comment = {
      id: uuid(),
      authorId: null,
      text: newComment.trim(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    onUpdate({
      ...task,
      comments: [...(task.comments ?? []), comment],
      updatedAt: nowIso(),
    });
    setNewComment("");
    setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, [task, newComment, onUpdate]);

  const links = task?.links ?? [];
  const linksAtLimit = links.length >= MAX_TASK_LINKS;

  const addLink = useCallback(() => {
    if (!task) return;
    if ((task.links ?? []).length >= MAX_TASK_LINKS) {
      setLinkError(`Máximo ${MAX_TASK_LINKS} links por tarea.`);
      return;
    }
    const normalized = normalizeTaskLinkUrl(linkUrl);
    if (!normalized.ok) {
      setLinkError(normalized.error);
      return;
    }
    const entry: TaskLink = {
      id: uuid(),
      url: normalized.url,
      label: linkLabel.trim(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    onUpdate({
      ...task,
      links: [...(task.links ?? []), entry],
      updatedAt: nowIso(),
    });
    setLinkUrl("");
    setLinkLabel("");
    setLinkError(null);
    setShowAddLink(false);
  }, [task, linkUrl, linkLabel, onUpdate]);

  const openAddLink = useCallback(() => {
    if (linksAtLimit) return;
    setShowAddLink(true);
    setLinkError(null);
  }, [linksAtLimit]);

  const cancelAddLink = useCallback(() => {
    setShowAddLink(false);
    setLinkUrl("");
    setLinkLabel("");
    setLinkError(null);
  }, []);

  const removeLink = useCallback(
    (linkId: string) => {
      if (!task) return;
      onUpdate({
        ...task,
        links: (task.links ?? []).filter((l) => l.id !== linkId),
        updatedAt: nowIso(),
      });
    },
    [task, onUpdate],
  );

  const toggleArchive = useCallback(() => {
    if (!task) return;
    onUpdate({
      ...task,
      archived: !task.archived,
      updatedAt: nowIso(),
    });
    if (!task.archived) {
      onClose();
    }
  }, [task, onUpdate, onClose]);

  if (!task) return null;

  const d = daysUntil(task.dueDate);
  const overdue = task.status !== "done" && d !== null && d < 0;
  const dueSoon = task.status !== "done" && d !== null && d >= 0 && d <= 3;
  const isBlocked = task.status === "blocked";

  // Dos columnas solo cuando el panel da de sí. En móvil ocupa el viewport
  // completo y los controles necesitan el ancho entero (CA-05, CA-06).
  const twoColumns = !isMobile && drawerWidth >= TWO_COLUMN_MIN_WIDTH;

  const doneSubtasks = subtasks.filter((s) => s.done).length;
  const subtaskProgress =
    subtasks.length > 0 ? Math.round((doneSubtasks / subtasks.length) * 100) : 0;
  const krPercent = krProgress(task.krCurrent ?? null, task.krTarget ?? null);

  function changeStatus(next: TaskStatus) {
    setStatus(next);
    persist("status", next);
  }

  /** Encabezado de sección: versalita fina, sin caja (spec 064 D6). */
  const SECTION = "text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground";

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity md:bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de tarea: ${task.title}`}
        style={
          isMobile
            ? undefined
            : {
                width: drawerWidth,
                right: sideBySide ? assistantPanelWidth : 0,
              }
        }
        className={cn(
          // Solid bg-background only: full-panel red/amber tints (esp. dark:/20)
          // wash through the form and make fields hard to read.
          // Spec 054: full viewport en móvil; panel lateral en md+.
          "fixed z-50 flex flex-col bg-background shadow-lg transition-transform duration-200 ease-out",
          isMobile
            ? "inset-0 w-full max-w-none border-0"
            : "inset-y-0 w-full max-w-[800px] border-l md:max-w-none",
          isBlocked && "border-l-4 border-l-red-500",
          !isBlocked && overdue && "border-l-4 border-l-red-500",
          !isBlocked && dueSoon && !overdue && "border-l-4 border-l-amber-500",
        )}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize bg-transparent hover:bg-primary/50 active:bg-primary hidden md:block"
          onMouseDown={(e) => {
            isResizingRef.current = true;
            e.preventDefault();
          }}
          aria-hidden="true"
        />

        {/* Cabecera: estado y urgencia, lo primero que se lee (spec 064 D5). */}
        <div className="flex items-center justify-between gap-2 border-b px-4 py-2.5">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-full pl-2.5",
                STATUS_PILL[status],
              )}
            >
              <span
                className={cn("size-1.5 shrink-0 rounded-full", STATUS_DOT[status])}
                aria-hidden="true"
              />
              <Select
                id="d-status"
                size="sm"
                value={status}
                aria-label="Estado de la tarea"
                onChange={(e) => changeStatus(e.target.value as TaskStatus)}
                className="h-6 w-auto rounded-full border-transparent bg-transparent pl-0 pr-6 font-medium [&>option]:bg-popover [&>option]:font-normal [&>option]:text-popover-foreground"
              >
                {Object.entries(taskStatusLabel).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>

            {overdue && (
              <Badge variant="destructive" className="text-[11px] leading-tight px-2 py-0.5">
                {dueLabel(d)}
              </Badge>
            )}
            {dueSoon && !overdue && (
              <Badge
                variant="outline"
                className="border-amber-500/50 bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100 text-[11px] leading-tight px-2 py-0.5"
              >
                {dueLabel(d)}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-11 min-h-11 min-w-11 shrink-0 sm:size-8 sm:min-h-8 sm:min-w-8"
            onClick={onClose}
            aria-label="Cerrar detalle"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto pb-[max(1rem,env(safe-area-inset-bottom))]">

            {/* Encabezado: qué es esta tarea (spec 064 D4). */}
            <div className="grid gap-1 px-5 pb-3 pt-4">
              <Label htmlFor="d-title" className="sr-only">
                Título
              </Label>
              <Textarea
                ref={titleRef}
                id="d-title"
                rows={1}
                value={title}
                placeholder="Título de la tarea"
                className="min-h-0 resize-none overflow-hidden border-transparent bg-transparent px-0 py-0 text-xl font-semibold leading-snug tracking-tight sm:text-xl focus-visible:ring-offset-0"
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => persist("title", title)}
                onKeyDown={(e) => {
                  // Enter confirma; el salto de línea no aporta nada a un
                  // título y rompería la fila del Kanban.
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
              />
              <Label htmlFor="d-summary" className="sr-only">
                Resumen
              </Label>
              <Input
                id="d-summary"
                value={summary}
                maxLength={140}
                placeholder="Resumen corto del alcance…"
                className="h-auto border-transparent bg-transparent px-0 py-0 text-[13.5px] text-muted-foreground sm:text-[13.5px] focus-visible:ring-offset-0"
                onChange={(e) => setSummary(e.target.value)}
                onBlur={() => persist("summary", summary)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.blur();
                  }
                }}
              />
              {summary.length > 120 && (
                <span className="text-right text-[10px] text-muted-foreground">
                  {summary.length}/140
                </span>
              )}
            </div>

            {/* Spec 054: estado táctil en móvil, por encima del fold. */}
            <div className="grid gap-1.5 px-5 pb-3 md:hidden">
              <span className={SECTION}>Cambiar estado</span>
              <div className="grid grid-cols-4 gap-1">
                {TASK_COLUMNS.map((col) => (
                  <Button
                    key={col}
                    type="button"
                    size="sm"
                    variant={status === col ? "default" : "outline"}
                    className="min-h-11 px-1 text-[11px]"
                    disabled={status === col}
                    onClick={() => changeStatus(col)}
                  >
                    {taskStatusLabel[col]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Propiedades: filas de 32 px, dos columnas si el panel da (D1, D3). */}
            <div
              className={cn(
                "grid gap-x-1.5 gap-y-0.5 px-3 pb-3",
                twoColumns ? "sm:grid-cols-2" : "grid-cols-1",
              )}
            >
              <PropertyRow label="Responsable" htmlFor="d-assignee">
                <PersonSelect
                  id="d-assignee"
                  size="sm"
                  value={assigneeId}
                  className={QUIET_CONTROL}
                  onChange={(v) => {
                    setAssigneeId(v);
                    persist("assigneeId", v);
                  }}
                  people={people}
                />
              </PropertyRow>

              <PropertyRow label="Prioridad" htmlFor="d-priority">
                <span
                  className={cn(
                    "mr-1.5 size-[7px] shrink-0 rounded-full",
                    PRIORITY_DOT[priority],
                  )}
                  aria-hidden="true"
                />
                <Select
                  id="d-priority"
                  size="sm"
                  value={priority}
                  className={QUIET_CONTROL}
                  onChange={(e) => {
                    setPriority(e.target.value as Priority);
                    persist("priority", e.target.value);
                  }}
                >
                  {Object.entries(priorityLabel).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </Select>
              </PropertyRow>

              <PropertyRow label="Área" htmlFor="d-area">
                <EntitySelect
                  id="d-area"
                  size="sm"
                  value={areaId}
                  className={QUIET_CONTROL}
                  onChange={(v) => {
                    setAreaId(v);
                    persist("areaId", v);
                  }}
                  options={areas}
                  placeholder="— Sin área —"
                />
              </PropertyRow>

              <PropertyRow label="Tipo" htmlFor="d-worktype">
                <Select
                  id="d-worktype"
                  size="sm"
                  value={workType}
                  className={QUIET_CONTROL}
                  onChange={(e) => {
                    setWorkType(e.target.value as WorkType);
                    persist("workType", e.target.value);
                  }}
                >
                  {WORK_TYPE_OPTIONS.map((v) => (
                    <option key={v} value={v}>
                      {workTypeLabel[v]}
                    </option>
                  ))}
                </Select>
              </PropertyRow>

              {/* Estimación y tiempo real comparten fila SIEMPRE, no solo en
                  modo dos columnas: la promesa y el hecho se leen juntos o no
                  dicen nada (spec 064 D12). Caben porque son dos números de
                  tres caracteres — no necesitan media fila cada uno. */}
              <PropertyRow
                label={workType === "spike" ? "Time-box" : "Estimación"}
                htmlFor="d-estimate"
                wide={twoColumns}
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Input
                    id="d-estimate"
                    type="number"
                    min="0"
                    step="0.5"
                    value={estimate}
                    onChange={(e) => handleHoursChange("estimate", e.target.value)}
                    placeholder="— h"
                    className={cn(QUIET_INPUT, "w-16 shrink-0")}
                  />
                  <Label
                    htmlFor="d-actual"
                    className="shrink-0 pl-1 text-xs font-normal text-muted-foreground"
                  >
                    Tiempo real
                  </Label>
                  <Input
                    id="d-actual"
                    type="number"
                    min="0"
                    step="0.5"
                    value={actualHours}
                    onChange={(e) => handleHoursChange("actualHours", e.target.value)}
                    placeholder="— h"
                    className={cn(QUIET_INPUT, "w-16 shrink-0")}
                  />
                </div>
              </PropertyRow>

              {/* Sprint a ancho completo: si ocupara media fila, aparecer o no
                  (depende de si el proyecto tiene sprints) descolocaría el
                  emparejamiento de las filas siguientes. */}
              {sprints.length > 0 && (
                <PropertyRow label="Sprint" htmlFor="d-sprint" wide={twoColumns}>
                  <Select
                    id="d-sprint"
                    size="sm"
                    value={sprintId}
                    className={QUIET_CONTROL}
                    onChange={(e) => {
                      setSprintId(e.target.value);
                      persist("sprintId", e.target.value);
                    }}
                  >
                    <option value="">— Backlog —</option>
                    {sprints.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </Select>
                </PropertyRow>
              )}

              <PropertyRow label="Fecha límite" htmlFor="d-due" wide={twoColumns}>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <DateFieldPreview
                    id="d-due"
                    compact
                    value={dueDate}
                    className={QUIET_DATE}
                    onChange={(v) => {
                      setDueDate(v);
                      persist("dueDate", v);
                    }}
                  />
                  {dueDate && d !== null && (
                    <span
                      className={cn(
                        "shrink-0 text-xs",
                        overdue
                          ? "text-destructive"
                          : dueSoon
                            ? "text-amber-700 dark:text-amber-400"
                            : "text-muted-foreground",
                      )}
                    >
                      · {dueSuffix(d)}
                    </span>
                  )}
                </div>
              </PropertyRow>

              <PropertyRow label="Etiquetas" wide={twoColumns}>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 py-1">
                  {(task.tags ?? []).map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 pr-1 font-normal">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        aria-label={`Eliminar tag ${tag}`}
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                  <div className="relative min-w-[7rem] flex-1">
                    <Label htmlFor="d-tag" className="sr-only">
                      Añadir etiqueta
                    </Label>
                    <Input
                      id="d-tag"
                      value={tagInput}
                      onChange={(e) => {
                        setTagInput(e.target.value);
                        setShowTagSuggestions(true);
                      }}
                      onFocus={() => setShowTagSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowTagSuggestions(false), 200)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && tagInput.trim()) {
                          e.preventDefault();
                          addTag(tagInput);
                        }
                      }}
                      placeholder="Añadir…"
                      className={QUIET_INPUT}
                    />
                    {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
                        {filteredTagSuggestions.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => addTag(tag)}
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </PropertyRow>

              {/* Key result: la métrica es una fila, no tres campos sueltos (D10). */}
              {workType === "key_result" && (
                <>
                  {krPercent !== null && (
                    <PropertyRow label="Progreso" wide={twoColumns}>
                      <div className="flex min-w-0 flex-1 items-center gap-2.5">
                        <div className="h-1 min-w-0 flex-1 rounded-full bg-muted">
                          <div
                            className="h-1 rounded-full bg-brand-accent"
                            style={{ width: `${Math.round(krPercent * 100)}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {task.krCurrent} / {task.krTarget}
                          {task.krUnit ? ` ${task.krUnit}` : ""} · {Math.round(krPercent * 100)}%
                        </span>
                      </div>
                    </PropertyRow>
                  )}
                  <PropertyRow label="Métrica" htmlFor="d-kr-current" wide={twoColumns}>
                    <div className="grid min-w-0 flex-1 grid-cols-3 gap-1.5">
                      <Input
                        id="d-kr-current"
                        type="number"
                        step="any"
                        value={krCurrent}
                        onChange={(e) => handleKrNumberChange("krCurrent", e.target.value)}
                        placeholder="Actual"
                        aria-label="Valor actual"
                        className={QUIET_INPUT}
                      />
                      <Input
                        id="d-kr-target"
                        type="number"
                        step="any"
                        value={krTarget}
                        onChange={(e) => handleKrNumberChange("krTarget", e.target.value)}
                        placeholder="Meta"
                        aria-label="Meta"
                        className={QUIET_INPUT}
                      />
                      <Input
                        id="d-kr-unit"
                        value={krUnit}
                        onChange={(e) => setKrUnit(e.target.value)}
                        onBlur={handleKrUnitBlur}
                        placeholder="Unidad"
                        aria-label="Unidad"
                        className={QUIET_INPUT}
                      />
                    </div>
                  </PropertyRow>
                </>
              )}
            </div>

            <div className="mx-5 h-px bg-border" />

            {/* Descripción */}
            <div className="grid gap-2 px-5 py-4">
              <Label htmlFor="d-desc" className={SECTION}>
                Descripción
              </Label>
              <RichTextField
                key={task.id}
                id="d-desc"
                value={description}
                onChange={setDescription}
                onBlur={() => persist("description", description)}
                placeholder="Añade contexto, criterios de aceptación o notas relevantes…"
                textareaClassName="min-h-[120px]"
              />
              {workType === "prd" && (
                <p className="text-xs text-muted-foreground">El PRD vive en la descripción.</p>
              )}
              {workType === "spike" && (
                <p className="text-xs text-muted-foreground">
                  El time-box es el techo de horas de la prueba de concepto. No es una promesa de
                  entrega.
                </p>
              )}
            </div>

            <div className="mx-5 h-px bg-border" />

            {/* Subtareas, con su avance a la vista */}
            <div className="grid gap-2.5 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className={SECTION}>Subtareas</span>
                {subtasks.length > 0 && (
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {doneSubtasks} / {subtasks.length}
                  </span>
                )}
              </div>
              {subtasks.length > 0 && (
                <>
                  <div
                    className="h-[3px] overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={subtaskProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Avance de subtareas"
                  >
                    <div
                      className="h-[3px] rounded-full bg-brand-accent transition-all"
                      style={{ width: `${subtaskProgress}%` }}
                    />
                  </div>
                  <div className="grid">
                    {subtasks.map((subtask) => (
                      <div key={subtask.id} className="group flex items-center gap-2.5 py-1">
                        <Checkbox
                          checked={subtask.done}
                          onCheckedChange={() => toggleSubtask(subtask.id)}
                          aria-label={subtask.title}
                          className="size-4"
                        />
                        <span
                          className={cn(
                            "flex-1 text-[13.5px]",
                            subtask.done && "text-muted-foreground line-through",
                          )}
                        >
                          {subtask.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-6 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                          onClick={() => deleteSubtask(subtask.id)}
                          aria-label={`Eliminar subtarea ${subtask.title}`}
                        >
                          <Trash2 className="size-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="flex gap-2">
                <Label htmlFor="d-subtask" className="sr-only">
                  Nueva subtarea
                </Label>
                <Input
                  id="d-subtask"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newSubtaskTitle.trim()) {
                      e.preventDefault();
                      addSubtask();
                    }
                  }}
                  placeholder="Añadir subtarea…"
                  className="h-9 text-[13.5px] sm:text-[13.5px]"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={addSubtask}
                  disabled={!newSubtaskTitle.trim()}
                  aria-label="Añadir subtarea"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mx-5 h-px bg-border" />

            {/* Referencias: links y anexos bajo un mismo encabezado (D7).
                Los anexos conservan su propia interfaz — ver spec 064 §6. */}
            <div className="grid gap-2.5 px-5 py-4">
              <span className={SECTION}>Referencias</span>

              <div className="flex flex-wrap items-center gap-1.5" aria-label="Links de la tarea">
                {links.map((link) => {
                  const display = taskLinkDisplayLabel(link);
                  return (
                    <div key={link.id} className="group relative max-w-full">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.url}
                        aria-label={`Abrir ${display}`}
                        className={cn(
                          "inline-flex h-7 max-w-[11rem] items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                        )}
                      >
                        <Link2 className="size-3 shrink-0 opacity-60" aria-hidden />
                        <span className="truncate">{display}</span>
                      </a>
                      <button
                        type="button"
                        title="Eliminar link"
                        aria-label={`Eliminar link ${display}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeLink(link.id);
                        }}
                        className={cn(
                          "absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full",
                          "border border-border bg-background text-muted-foreground shadow-sm",
                          "hover:border-destructive hover:bg-destructive hover:text-destructive-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          "opacity-80 group-hover:opacity-100",
                        )}
                      >
                        <X className="size-2.5" strokeWidth={2.5} />
                      </button>
                    </div>
                  );
                })}

                {!linksAtLimit && !showAddLink && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7 shrink-0 border-dashed"
                    title="Añadir link"
                    aria-label="Añadir link"
                    aria-expanded={false}
                    onClick={openAddLink}
                  >
                    <Plus className="size-3.5" />
                  </Button>
                )}
              </div>

              {showAddLink && !linksAtLimit && (
                <div className="flex flex-col gap-1.5 rounded-md border border-border/60 bg-muted/20 p-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="d-link-url" className="sr-only">
                      URL del link
                    </Label>
                    <Input
                      id="d-link-url"
                      type="url"
                      inputMode="url"
                      autoComplete="off"
                      autoFocus
                      placeholder="URL o dominio.com/…"
                      value={linkUrl}
                      className="h-8 flex-1 text-xs sm:text-xs"
                      onChange={(e) => {
                        setLinkUrl(e.target.value);
                        if (linkError) setLinkError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addLink();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          e.stopPropagation();
                          cancelAddLink();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      className="h-8 shrink-0 px-2.5 text-xs"
                      disabled={!linkUrl.trim()}
                      onClick={addLink}
                    >
                      Añadir
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 shrink-0"
                      title="Cancelar"
                      aria-label="Cancelar añadir link"
                      onClick={cancelAddLink}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                  {linkError && (
                    <p className="text-[11px] text-destructive" role="alert">
                      {linkError}
                    </p>
                  )}
                </div>
              )}

              {linksAtLimit && (
                <p className="text-[11px] text-muted-foreground">
                  Máximo {MAX_TASK_LINKS} links.
                </p>
              )}

              {projectId && (
                <AttachmentsSection
                  parent={{ type: "task", projectId, taskId: task.id }}
                  attachments={task.attachments ?? []}
                />
              )}
            </div>

            <div className="mx-5 h-px bg-border" />

            {/* Actividad */}
            <div className="grid gap-3 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className={cn(SECTION, "flex items-center gap-1.5")}>
                  <MessageCircle className="size-3.5" />
                  Actividad
                </span>
                {(task.comments?.length ?? 0) > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {task.comments!.length}{" "}
                    {task.comments!.length === 1 ? "comentario" : "comentarios"}
                  </span>
                )}
              </div>

              {(task.comments?.length ?? 0) > 0 && (
                <div className="max-h-[40vh] space-y-3 overflow-y-auto md:max-h-[300px]">
                  {task.comments!.map((comment) => (
                    <div key={comment.id} className="rounded-lg bg-muted/50 p-3">
                      <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed">
                        {comment.text}
                      </p>
                      <p className="mt-1.5 text-[10px] text-muted-foreground">
                        {relativeSince(comment.createdAt)}
                      </p>
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>
              )}

              {/* Spec 054: text-base evita zoom iOS; min-h táctil en botón. */}
              <div className="space-y-2">
                <Label htmlFor="d-comment" className="sr-only">
                  Nuevo comentario
                </Label>
                <Textarea
                  id="d-comment"
                  ref={commentComposerRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onFocus={() => {
                    setTimeout(
                      () =>
                        commentComposerRef.current?.scrollIntoView({
                          block: "nearest",
                          behavior: "smooth",
                        }),
                      100,
                    );
                  }}
                  placeholder="Escribe un comentario…"
                  className="min-h-[72px] resize-y text-base"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      addComment();
                    }
                  }}
                />
                <Button
                  onClick={addComment}
                  disabled={!newComment.trim()}
                  size="sm"
                  className="min-h-11 w-full sm:min-h-9"
                >
                  <Send className="size-3.5" />
                  Comentar
                </Button>
              </div>
            </div>
          </div>

          {/* Pie: metadatos y archivar en una línea (D9). */}
          <div className="flex items-center justify-between gap-3 border-t px-5 py-2">
            <span className="truncate text-[11.5px] text-muted-foreground">
              {metaLabel(task.createdAt, task.updatedAt)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleArchive}
              className="h-8 shrink-0 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Archive className="size-3.5" />
              {task.archived ? "Desarchivar" : "Archivar"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

