import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import type { Task } from "@/domain/schemas";
import { daysBetween, formatDay } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/paths";
import {
  dotTooltip,
  ganttTasks,
  placeDay,
  projectBar,
  type DotKind,
  type GanttDot,
  type GanttProjectRow,
  type GanttTaskRow,
  type GanttWindow,
} from "./ganttModel";

/** Grilla del Gantt (spec 077 §5, layout "C"): columna de nombres sticky +
 * pista de tiempo con posicionamiento absoluto en %. Solo lectura (D2). */

/** D21: la pista tiene un ancho mínimo por escala y scrollea dentro de su
 * contenedor; la columna de nombres se angosta debajo de `sm`. Clases
 * literales para el escáner de Tailwind. */
const ROW_COLS = {
  month: "grid-cols-[10rem_minmax(60rem,1fr)] sm:grid-cols-[15rem_minmax(60rem,1fr)]",
  quarter: "grid-cols-[10rem_minmax(44rem,1fr)] sm:grid-cols-[15rem_minmax(44rem,1fr)]",
  year: "grid-cols-[10rem_minmax(40rem,1fr)] sm:grid-cols-[15rem_minmax(40rem,1fr)]",
} as const;

const NAME_CELL =
  "sticky left-0 z-20 flex min-w-0 items-center border-r border-border/60 bg-background";

/** D8/D11: hecha = verde lleno; estimada = hueco punteado verde; pendiente =
 * borde de acento; vencida = borde rojo. */
function dotClass(kind: DotKind, estimated: boolean): string {
  if (kind === "done") {
    return estimated
      ? "border-2 border-dashed border-success bg-background text-success"
      : "border-2 border-success bg-success text-success-foreground";
  }
  if (kind === "overdue") return "border-2 border-destructive bg-background text-destructive";
  return "border-2 border-primary bg-background text-primary";
}

/** Vencida arriba de todo cuando dos puntos comparten día (nota 2 del controlador). */
const DOT_Z: Record<DotKind, number> = { done: 1, pending: 2, overdue: 3 };

const VERB: Record<DotKind, [string, string]> = {
  done: ["hecha el", "hechas el"],
  pending: ["vence el", "vencen el"],
  overdue: ["vencida el", "vencidas el"],
};

/** D22: «<título>, hecha el <fecha>[, fecha aproximada]». */
export function dotAriaLabel(tasks: readonly Task[], day: string, kind: DotKind, estimated: boolean) {
  const plural = tasks.length > 1;
  const who = plural ? `${tasks.length} tareas: ${tasks.map((t) => t.title).join(", ")}` : tasks[0].title;
  const verb = VERB[kind][plural ? 1 : 0];
  return `${who}, ${verb} ${formatDay(day)}${estimated ? ", fecha aproximada" : ""}`;
}

export function GanttGrid({
  rows,
  win,
  today,
  expanded,
  onToggle,
  onOpenTask,
}: {
  rows: GanttProjectRow[];
  win: GanttWindow;
  today: string;
  expanded: ReadonlySet<string>;
  onToggle: (projectId: string) => void;
  onOpenTask: (projectId: string, taskId: string) => void;
}) {
  const cols = ROW_COLS[win.scale];
  // Un punto va al centro de su día; la barra cubre días completos.
  const halfDay = 50 / win.totalDays;
  const todayLeft = placeDay(win, today);
  const pastWidth = today > win.end ? 100 : todayLeft === null ? 0 : todayLeft + halfDay;

  const backdrop = (
    <>
      {pastWidth > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-muted/60"
          style={{ width: `${pastWidth}%` }}
        />
      )}
      {todayLeft !== null && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 z-[5] w-0.5 -translate-x-1/2 bg-destructive/80"
          style={{ left: `${todayLeft + halfDay}%` }}
        />
      )}
    </>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-border scrollbar-thin">
      <div className={cn("grid border-b border-border/60 bg-muted/30 text-xs", cols)}>
        <div className={cn(NAME_CELL, "bg-muted px-3 py-2 font-medium text-muted-foreground")}>
          Proyecto / tarea
        </div>
        <div className="relative h-9">
          {win.columns.map((c) => {
            const left = placeDay(win, c.start) ?? 0;
            const width = ((daysBetween(c.start, c.end) + 1) / win.totalDays) * 100;
            return (
              <div
                key={c.start}
                className="absolute inset-y-0 flex items-center justify-center overflow-hidden border-l border-border/50 text-[10px] text-muted-foreground first:border-l-0"
                style={{ left: `${left}%`, width: `${width}%` }}
                title={c.start === c.end ? formatDay(c.start) : undefined}
              >
                <span className="truncate px-0.5">{c.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {rows.map((row) => {
        const isOpen = expanded.has(row.project.id);
        return (
          <div key={row.project.id} className="border-b border-border/60 last:border-b-0">
            <ProjectRow
              row={row}
              cols={cols}
              isOpen={isOpen}
              halfDay={halfDay}
              backdrop={backdrop}
              onToggle={() => onToggle(row.project.id)}
              onOpenTask={(taskId) => onOpenTask(row.project.id, taskId)}
            />
            {isOpen &&
              row.taskRows.map((tr) => (
                <TaskRow
                  key={tr.task.id}
                  row={tr}
                  cols={cols}
                  halfDay={halfDay}
                  backdrop={backdrop}
                  onOpen={() => onOpenTask(row.project.id, tr.task.id)}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
}

function ProjectRow({
  row,
  cols,
  isOpen,
  halfDay,
  backdrop,
  onToggle,
  onOpenTask,
}: {
  row: GanttProjectRow;
  cols: string;
  isOpen: boolean;
  halfDay: number;
  backdrop: React.ReactNode;
  onToggle: () => void;
  onOpenTask: (taskId: string) => void;
}) {
  const { project, bar, done, total } = row;
  // D9: «Sin fechas» solo si el proyecto no tiene ninguna fecha; una barra
  // fuera de la ventana no es lo mismo.
  const hasDates = bar !== null || projectBar(project, ganttTasks(project)) !== null;
  const Chevron = isOpen ? ChevronDown : ChevronRight;

  // Puntos del mismo día (distinto tipo) se apilan en vertical para que todos
  // queden visibles y clickeables.
  const sameDay = new Map<string, GanttDot[]>();
  for (const d of row.dots) sameDay.set(d.day, [...(sameDay.get(d.day) ?? []), d]);

  return (
    <div className={cn("grid", cols)}>
      <div className={cn(NAME_CELL, "gap-1 py-1.5 pl-1.5 pr-2")}>
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={onToggle}
          title={project.name}
          className="flex min-w-0 flex-1 items-center gap-1 rounded-md px-1 py-1 text-left text-sm font-medium hover:bg-muted/60"
        >
          <Chevron className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <span className="truncate">{project.name}</span>
          <span className="shrink-0 font-mono text-[11px] font-normal text-muted-foreground">
            {done}/{total}
          </span>
        </button>
        <Link
          to={ROUTES.project(project.id)}
          aria-label={`Abrir proyecto ${project.name}`}
          title="Abrir proyecto"
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <ExternalLink className="size-3.5" />
        </Link>
      </div>

      <div className="relative h-12">
        {backdrop}
        {bar ? (
          <div
            className={cn(
              "absolute top-1/2 h-3.5 -translate-y-1/2 overflow-hidden rounded-full border bg-primary/15",
              bar.derived ? "border-dashed border-primary/60" : "border-primary/30",
            )}
            style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
            title={`${formatDay(bar.start)} – ${formatDay(bar.end)}`}
          >
            {/* D10: tramo fuerte = hechas / total. */}
            {total > 0 && (
              <div
                className="h-full bg-primary/60"
                style={{ width: `${(done / total) * 100}%` }}
              />
            )}
          </div>
        ) : (
          !hasDates && (
            <span className="absolute left-2 top-1/2 z-[6] -translate-y-1/2 text-xs text-muted-foreground">
              Sin fechas
            </span>
          )
        )}

        {[...sameDay.values()].flatMap((group) =>
          group.map((dot, i) => (
            <DotButton
              key={`${dot.day}|${dot.kind}|${dot.estimated}`}
              tasks={dot.tasks}
              day={dot.day}
              kind={dot.kind}
              estimated={dot.estimated}
              left={dot.left + halfDay}
              offset={(i - (group.length - 1) / 2) * 15}
              title={dotTooltip(dot)}
              onClick={() => (dot.tasks.length === 1 ? onOpenTask(dot.tasks[0].id) : onToggle())}
            />
          )),
        )}
      </div>
    </div>
  );
}

function TaskRow({
  row,
  cols,
  halfDay,
  backdrop,
  onOpen,
}: {
  row: GanttTaskRow;
  cols: string;
  halfDay: number;
  backdrop: React.ReactNode;
  onOpen: () => void;
}) {
  const { task, day, kind, estimated, left } = row;
  return (
    <div className={cn("grid", cols)}>
      <div className={cn(NAME_CELL, "py-1 pl-7 pr-2")}>
        <button
          type="button"
          onClick={onOpen}
          title={task.title}
          className="min-w-0 flex-1 truncate rounded-md px-1 py-0.5 text-left text-xs text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          {task.title}
        </button>
      </div>
      <div className="relative h-8">
        {backdrop}
        {day === null ? (
          // D11/D16: pendiente sin vencimiento.
          <span className="absolute left-2 top-1/2 z-[6] -translate-y-1/2 text-xs text-muted-foreground">
            Sin fecha
          </span>
        ) : (
          left !== null && (
            <DotButton
              tasks={[task]}
              day={day}
              kind={kind}
              estimated={estimated}
              left={left + halfDay}
              offset={0}
              title={task.title}
              onClick={onOpen}
            />
          )
        )}
      </div>
    </div>
  );
}

function DotButton({
  tasks,
  day,
  kind,
  estimated,
  left,
  offset,
  title,
  onClick,
}: {
  tasks: readonly Task[];
  day: string;
  kind: DotKind;
  estimated: boolean;
  left: number;
  offset: number;
  title: string;
  onClick: () => void;
}) {
  const many = tasks.length > 1;
  return (
    <button
      type="button"
      aria-label={dotAriaLabel(tasks, day, kind, estimated)}
      // D8: el estimado lo dice también el tooltip.
      title={estimated ? `${title}\nFecha aproximada` : title}
      onClick={onClick}
      className="absolute top-1/2 flex size-4 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        left: `${left}%`,
        transform: `translate(-50%, calc(-50% + ${offset}px))`,
        zIndex: 10 + DOT_Z[kind],
      }}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center rounded-full font-mono text-[9px] font-semibold leading-none",
          many ? "size-4" : "size-3",
          dotClass(kind, estimated),
        )}
      >
        {many ? tasks.length : null}
      </span>
    </button>
  );
}
