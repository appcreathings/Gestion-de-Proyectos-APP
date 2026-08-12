import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  eachDay,
  formatDay,
  monthRangeContaining,
  shiftRange,
  todayKey,
  weekRangeContaining,
  daysBetween,
  type DayRange,
} from "@/lib/dates";
import type { Project, Task } from "@/domain/schemas";
import { priorityVariant, taskStatusLabel } from "@/domain/labels";
import type { SprintScope } from "../components/SprintSwitcher";
import {
  buildCalendarModel,
  partitionDayChips,
  tasksOnDay,
  type CalendarTaskItem,
} from "./buildCalendarItems";
import { TaskTimelineView } from "./TaskTimelineView";

interface Props {
  project: Project;
  /** Tareas ya filtradas (scope/sprint/búsqueda/filtros de TasksTab). */
  tasksInScope: Task[];
  sprintScope: SprintScope;
  onOpenTask: (taskId: string) => void;
  onFocusSprint?: (sprintId: string) => void;
}

const WEEKDAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

export function TaskCalendarView({
  project,
  tasksInScope,
  onOpenTask,
  onFocusSprint,
}: Props) {
  const [anchor, setAnchor] = useState(() => todayKey());
  const [density, setDensity] = useState<"week" | "month">("week");
  const [includeDone, setIncludeDone] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const range: DayRange = useMemo(
    () =>
      density === "week" ? weekRangeContaining(anchor) : monthRangeContaining(anchor),
    [anchor, density],
  );

  // Project narrowed to in-scope tasks so calendar respects TasksTab filters.
  const scopedProject = useMemo(
    () => ({ ...project, tasks: tasksInScope }),
    [project, tasksInScope],
  );

  const model = useMemo(
    () =>
      buildCalendarModel({
        project: scopedProject,
        range,
        sprintScope: "all", // already filtered by parent
        searchQuery: "",
        areaId: null,
        includeDone,
      }),
    [scopedProject, range, includeDone],
  );

  const days = useMemo(() => eachDay(range), [range]);
  const today = todayKey();

  const rangeLabel =
    density === "week"
      ? `${formatDay(range.start)} – ${formatDay(range.end)}`
      : new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(
          new Date(parseInt(range.start.slice(0, 4)), parseInt(range.start.slice(5, 7)) - 1, 1),
        );

  function goToday() {
    setAnchor(todayKey());
  }

  function shift(delta: number) {
    const next = shiftRange(range, density, delta);
    setAnchor(next.start);
  }

  const hasAnyDates =
    model.tasks.length > 0 ||
    model.sprints.length > 0 ||
    model.projectDue ||
    model.unscheduled.length > 0 ||
    project.tasks.some((t) => t.dueDate && !t.archived);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="icon" className="size-9" onClick={() => shift(-1)} aria-label="Anterior">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Hoy
          </Button>
          <Button variant="outline" size="icon" className="size-9" onClick={() => shift(1)} aria-label="Siguiente">
            <ChevronRight className="size-4" />
          </Button>
          <span className="text-sm font-medium capitalize">{rangeLabel}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-md border border-border/70">
            <Button
              variant={density === "week" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setDensity("week")}
            >
              Semana
            </Button>
            <Button
              variant={density === "month" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none border-l"
              onClick={() => setDensity("month")}
            >
              Mes
            </Button>
          </div>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="size-3.5"
              checked={includeDone}
              onChange={(e) => setIncludeDone(e.target.checked)}
            />
            Mostrar hechas
          </label>
        </div>
      </div>

      {!hasAnyDates ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          <CalendarDays className="mx-auto mb-2 size-8 opacity-50" />
          No hay vencimientos ni sprints con fechas — cargá fechas en tareas o en el sprint.
        </div>
      ) : (
        <>
          {/* Sprint bands legend */}
          {model.sprints.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {model.sprints.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onFocusSprint?.(s.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs",
                    sprintColor(i),
                  )}
                  title={s.goal || s.name}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}

          {density === "week" ? (
            <WeekGrid
              days={days}
              model={model}
              today={today}
              onOpenTask={onOpenTask}
            />
          ) : (
            <MonthGrid
              days={days}
              model={model}
              today={today}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onOpenTask={onOpenTask}
            />
          )}

          {density === "month" && selectedDay && (
            <div className="rounded-lg border border-border p-3">
              <p className="mb-2 text-sm font-medium">{formatDay(selectedDay)}</p>
              <div className="flex flex-wrap gap-2">
                {tasksOnDay(model, selectedDay).length === 0 ? (
                  <p className="text-xs text-muted-foreground">Sin tareas este día.</p>
                ) : (
                  tasksOnDay(model, selectedDay).map((t) => (
                    <TaskChip key={t.id} task={t} onOpen={() => onOpenTask(t.id)} />
                  ))
                )}
              </div>
            </div>
          )}

          <TaskTimelineView
            project={scopedProject}
            includeDone={includeDone}
            onOpenTask={onOpenTask}
          />

          {model.unscheduled.length > 0 && (
            <details className="rounded-lg border border-border/70 bg-muted/20 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Sin fecha ({model.unscheduled.length})
              </summary>
              <ul className="mt-2 space-y-1">
                {model.unscheduled.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      className="text-left text-sm text-primary hover:underline"
                      onClick={() => onOpenTask(t.id)}
                    >
                      {t.title}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {taskStatusLabel[t.status]}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}
    </div>
  );
}

function sprintColor(i: number): string {
  const colors = [
    "border-blue-300 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
    "border-violet-300 bg-violet-50 text-violet-900 dark:bg-violet-950/40",
    "border-teal-300 bg-teal-50 text-teal-900 dark:bg-teal-950/40",
    "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/40",
  ];
  return colors[i % colors.length];
}

function WeekGrid({
  days,
  model,
  today,
  onOpenTask,
}: {
  days: string[];
  model: ReturnType<typeof buildCalendarModel>;
  today: string;
  onOpenTask: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      {/* Sprint band row */}
      {model.sprints.length > 0 && (
        <div
          className="grid border-b border-border/60 bg-muted/20"
          style={{ gridTemplateColumns: `repeat(${days.length}, minmax(7rem, 1fr))` }}
        >
          <div className="col-span-full relative h-8 px-1 py-1">
            {model.sprints.map((s, i) => {
              const colStart = Math.max(0, daysBetween(days[0], s.start));
              const colEnd = Math.min(days.length - 1, daysBetween(days[0], s.end));
              const left = (colStart / days.length) * 100;
              const width = ((colEnd - colStart + 1) / days.length) * 100;
              return (
                <div
                  key={s.id}
                  className={cn(
                    "absolute top-1 h-6 truncate rounded px-2 text-[10px] font-medium leading-6",
                    sprintColor(i),
                  )}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={s.name}
                >
                  {s.name}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${days.length}, minmax(7rem, 1fr))` }}
      >
        {days.map((day, i) => (
          <div
            key={day}
            className={cn(
              "min-h-[10rem] border-r border-border/50 p-1.5 last:border-r-0",
              day === today && "bg-primary/5",
            )}
          >
            <div className="mb-1.5 flex items-center justify-between px-0.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {WEEKDAYS[i]}
              </span>
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  day === today && "rounded-full bg-primary px-1.5 text-primary-foreground",
                )}
              >
                {day.slice(8)}
              </span>
            </div>
            {model.projectDue?.day === day && (
              <div className="mb-1 flex items-center gap-1 rounded border border-dashed border-foreground/30 px-1 py-0.5 text-[10px]">
                <Flag className="size-3" />
                Vence proyecto
              </div>
            )}
            <div className="space-y-1">
              {tasksOnDay(model, day).map((t) => (
                <TaskChip key={t.id} task={t} onOpen={() => onOpenTask(t.id)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthGrid({
  days,
  model,
  today,
  selectedDay,
  onSelectDay,
  onOpenTask,
}: {
  days: string[];
  model: ReturnType<typeof buildCalendarModel>;
  today: string;
  selectedDay: string | null;
  onSelectDay: (d: string) => void;
  onOpenTask: (id: string) => void;
}) {
  // Pad to Monday start of first week
  const first = days[0];
  const firstDate = new Date(
    parseInt(first.slice(0, 4)),
    parseInt(first.slice(5, 7)) - 1,
    parseInt(first.slice(8, 10)),
  );
  const padStart = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;
  const cells: (string | null)[] = [
    ...Array.from({ length: padStart }, () => null),
    ...days,
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-xl border border-border">
      <div className="grid grid-cols-7 border-b border-border/60 bg-muted/20">
        {WEEKDAYS.map((w) => (
          <div key={w} className="px-1 py-1.5 text-center text-[10px] uppercase text-muted-foreground">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) {
            return <div key={`pad-${i}`} className="min-h-[5.5rem] bg-muted/10" />;
          }
          const dayTasks = tasksOnDay(model, day);
          const { visible, more } = partitionDayChips(dayTasks, 3);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={cn(
                "min-h-[5.5rem] border-b border-r border-border/40 p-1 text-left align-top last:border-r-0",
                day === today && "bg-primary/5",
                selectedDay === day && "ring-2 ring-inset ring-primary/40",
              )}
            >
              <span
                className={cn(
                  "text-xs tabular-nums",
                  day === today && "font-semibold text-primary",
                )}
              >
                {day.slice(8)}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {visible.map((t) => (
                  <div
                    key={t.id}
                    role="presentation"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTask(t.id);
                    }}
                    className="truncate rounded bg-muted px-1 text-[10px] hover:bg-muted/80"
                  >
                    {t.title}
                  </div>
                ))}
                {more > 0 && (
                  <span className="text-[10px] text-muted-foreground">+{more} más</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TaskChip({ task, onOpen }: { task: CalendarTaskItem; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex w-full items-start gap-1 rounded border border-border/60 bg-background px-1.5 py-1 text-left text-[11px] leading-snug hover:border-border",
        task.status === "blocked" && "border-l-2 border-l-red-500",
        task.status === "doing" && "border-l-2 border-l-blue-500",
      )}
      aria-label={`${task.title}, ${taskStatusLabel[task.status]}`}
    >
      <Badge variant={priorityVariant[task.priority]} className="mt-0.5 h-4 shrink-0 px-1 text-[9px]">
        {task.priority.slice(0, 1).toUpperCase()}
      </Badge>
      <span className="min-w-0 flex-1 truncate">{task.title}</span>
    </button>
  );
}
