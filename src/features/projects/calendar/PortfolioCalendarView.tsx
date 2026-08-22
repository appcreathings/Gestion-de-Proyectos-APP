import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronLeft, ChevronRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  dayKeyFromDate,
  daysBetween,
  eachDay,
  formatDay,
  formatRange,
  monthRangeContaining,
  parseDayKey,
  shiftRange,
  todayKey,
  weekRangeContaining,
  type DayRange,
} from "@/lib/dates";
import type { Project, Quarter } from "@/domain/schemas";
import { taskStatusLabel } from "@/domain/labels";
import { taskUrgency } from "@/domain/taskUrgency";
import {
  TONES,
  TONE_KEYS,
  URGENCY_ARIA,
  URGENCY_DOT,
  URGENCY_RAIL,
} from "@/lib/urgencyStyles";
import { ROUTES } from "@/routes/paths";
import {
  bandsCoveringDay,
  buildPortfolioCalendarModel,
  monthsOverlapping,
  packRangeLanes,
  partitionDayChips,
  scopeProjectsByQuarter,
  tasksOnDay,
  type CalendarRangeBand,
  type CalendarTaskItem,
  type PortfolioCalendarModel,
} from "./buildCalendarItems";

export type QuarterFilter = "all" | "unassigned" | string;

type Density = "week" | "month" | "quarter";

const WEEKDAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

/* Los tonos pastel vienen de la familia única de `urgencyStyles.ts`
   (spec 065 D12): esta era una de las dos copias que existían. */

const QUARTER_COLOR =
  "border-foreground/30 bg-muted/60 text-foreground dark:bg-muted/40";

interface Props {
  projects: Project[];
  quarters: Quarter[];
  onOpenTask: (taskId: string, projectId: string) => void;
}

export function PortfolioCalendarView({ projects, quarters, onOpenTask }: Props) {
  const [anchor, setAnchor] = useState(() => todayKey());
  const [density, setDensity] = useState<Density>("month");
  const [includeDone, setIncludeDone] = useState(false);
  const [quarterFilter, setQuarterFilter] = useState<QuarterFilter>("all");
  const [spanQuarterId, setSpanQuarterId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const today = todayKey();

  const datedQuarters = useMemo(
    () =>
      quarters
        .filter((q) => q.startDate && q.endDate)
        .slice()
        .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? "")),
    [quarters],
  );

  const filterQuarter = datedQuarters.find((q) => q.id === quarterFilter) ?? null;

  const viewQuarter = useMemo(() => {
    if (filterQuarter) return filterQuarter;
    return (
      datedQuarters.find((q) => q.id === spanQuarterId) ??
      datedQuarters.find(
        (q) => q.startDate && q.endDate && q.startDate <= today && q.endDate >= today,
      ) ??
      datedQuarters[0] ??
      null
    );
  }, [filterQuarter, datedQuarters, spanQuarterId, today]);

  useEffect(() => {
    if (filterQuarter?.startDate) setAnchor(filterQuarter.startDate);
  }, [filterQuarter?.id, filterQuarter?.startDate]);

  const scopedProjects = useMemo(
    () => scopeProjectsByQuarter(projects, quarterFilter),
    [projects, quarterFilter],
  );

  const quarterSpan: DayRange | null = useMemo(() => {
    if (!viewQuarter?.startDate || !viewQuarter.endDate) return null;
    return { start: viewQuarter.startDate, end: viewQuarter.endDate };
  }, [viewQuarter?.startDate, viewQuarter?.endDate]);

  const range: DayRange = useMemo(() => {
    if (density === "week") return weekRangeContaining(anchor);
    if (density === "month") return monthRangeContaining(anchor);
    if (quarterSpan) return quarterSpan;
    return monthRangeContaining(anchor);
  }, [anchor, density, quarterSpan]);

  const visibleQuarters = useMemo(
    () => (quarterFilter === "all" ? quarters : filterQuarter ? [filterQuarter] : []),
    [quarterFilter, quarters, filterQuarter],
  );

  const model = useMemo(
    () =>
      buildPortfolioCalendarModel({
        projects: scopedProjects,
        quarters: visibleQuarters,
        range,
        includeDone,
      }),
    [scopedProjects, visibleQuarters, range, includeDone],
  );

  const days = useMemo(() => eachDay(range), [range]);
  const quarterMonths = useMemo(
    () => (density === "quarter" ? monthsOverlapping(range) : []),
    [density, range],
  );

  const rangeLabel =
    density === "week"
      ? formatRange(range.start, range.end)
      : density === "quarter"
        ? viewQuarter
          ? `${viewQuarter.name} · ${formatRange(range.start, range.end)}`
          : formatRange(range.start, range.end)
        : new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(
            new Date(parseInt(range.start.slice(0, 4), 10), parseInt(range.start.slice(5, 7), 10) - 1, 1),
          );

  function applyQuarterFilter(next: QuarterFilter) {
    setQuarterFilter(next);
    setSelectedDay(null);
    if (next === "all") {
      setSpanQuarterId(null);
      setAnchor(todayKey());
      setDensity((d) => (d === "quarter" ? "month" : d));
      return;
    }
    if (next === "unassigned") {
      setDensity((d) => (d === "quarter" ? "month" : d));
    }
  }

  function goToday() {
    setAnchor(todayKey());
    setSelectedDay(todayKey());
  }

  function shift(delta: number) {
    setSelectedDay(null);
    if (density === "quarter") {
      const currentId = filterQuarter?.id ?? viewQuarter?.id;
      const idx = currentId ? datedQuarters.findIndex((q) => q.id === currentId) : -1;
      const next = datedQuarters[idx + delta];
      if (!next) return;
      if (filterQuarter) applyQuarterFilter(next.id);
      else {
        setSpanQuarterId(next.id);
        if (next.startDate) setAnchor(next.startDate);
      }
      return;
    }
    const next = shiftRange(range, density, delta);
    setAnchor(next.start);
  }

  const shiftIndex = viewQuarter
    ? datedQuarters.findIndex((q) => q.id === viewQuarter.id)
    : -1;
  const canPrev = density !== "quarter" || shiftIndex > 0;
  const canNext = density !== "quarter" || (shiftIndex >= 0 && shiftIndex < datedQuarters.length - 1);

  const showEmpty =
    model.tasks.length === 0 &&
    model.projectDues.length === 0 &&
    model.bands.length === 0 &&
    model.unscheduled.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            onClick={() => shift(-1)}
            disabled={density === "quarter" ? !canPrev : false}
            aria-label={
              density === "week" ? "Semana anterior" : density === "month" ? "Mes anterior" : "Trimestre anterior"
            }
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>
            Hoy
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            onClick={() => shift(1)}
            disabled={density === "quarter" ? !canNext : false}
            aria-label={
              density === "week" ? "Semana siguiente" : density === "month" ? "Mes siguiente" : "Trimestre siguiente"
            }
          >
            <ChevronRight className="size-4" />
          </Button>
          <span className="text-sm font-medium capitalize">{rangeLabel}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            size="sm"
            className="w-[13rem]"
            value={quarterFilter}
            onChange={(e) => applyQuarterFilter(e.currentTarget.value)}
            aria-label="Filtrar por trimestre"
          >
            <option value="all">Todos los proyectos</option>
            <option value="unassigned">Sin trimestre</option>
            {quarters.map((q) => (
              <option key={q.id} value={q.id}>
                {q.name}
              </option>
            ))}
          </Select>
          <div className="flex rounded-md border border-border/70" role="group" aria-label="Densidad del calendario">
            <Button
              variant={density === "week" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              aria-pressed={density === "week"}
              onClick={() => setDensity("week")}
            >
              Semana
            </Button>
            <Button
              variant={density === "month" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-none border-l"
              aria-pressed={density === "month"}
              onClick={() => setDensity("month")}
            >
              Mes
            </Button>
            <Button
              variant={density === "quarter" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none border-l"
              aria-pressed={density === "quarter"}
              disabled={!quarterSpan && datedQuarters.length === 0}
              title={
                quarterSpan || datedQuarters.length
                  ? "Tres meses del trimestre"
                  : "Elegí un trimestre con fechas"
              }
              onClick={() => {
                if (quarterFilter === "all" || quarterFilter === "unassigned") {
                  const focus =
                    datedQuarters.find(
                      (q) =>
                        q.startDate &&
                        q.endDate &&
                        q.startDate <= today &&
                        q.endDate >= today,
                    ) ?? datedQuarters[0];
                  if (focus?.startDate) setAnchor(focus.startDate);
                }
                setDensity("quarter");
              }}
            >
              Trimestre
            </Button>
          </div>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Checkbox
              checked={includeDone}
              onCheckedChange={setIncludeDone}
              className="size-3.5"
              aria-label="Mostrar tareas hechas"
            />
            Mostrar hechas
          </label>
        </div>
      </div>

      {showEmpty ? (
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          <CalendarDays className="mx-auto mb-2 size-8 opacity-50" />
          No hay vencimientos ni rangos con fechas en este recorte. Cargá fechas en
          proyectos, trimestres o tareas.
        </div>
      ) : (
        <>
          {model.bands.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {model.bands.map((b) => (
                <button
                  key={`${b.kind}-${b.id}`}
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs",
                    bandColor(b),
                  )}
                  title={bandTooltip(b)}
                  onClick={() => {
                    if (b.kind === "quarter") applyQuarterFilter(b.id);
                  }}
                >
                  <span className="text-[9px] uppercase tracking-wide opacity-70">
                    {b.kind === "quarter" ? "T" : "P"}
                  </span>
                  {b.name}
                </button>
              ))}
            </div>
          )}

          {density === "week" && (
            <WeekGrid
              days={days}
              model={model}
              today={today}
              onOpenTask={onOpenTask}
              onFocusQuarter={applyQuarterFilter}
            />
          )}

          {density === "month" && (
            <MonthGrid
              days={days}
              model={model}
              today={today}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onOpenTask={onOpenTask}
            />
          )}

          {density === "quarter" && (
            <div className="space-y-4">
              {quarterMonths.map((month) => {
                const monthModel = buildPortfolioCalendarModel({
                  projects: scopedProjects,
                  quarters: visibleQuarters,
                  range: month,
                  includeDone,
                });
                return (
                  <div key={month.start} className="space-y-2">
                    <p className="text-sm font-medium capitalize">
                      {new Intl.DateTimeFormat("es", { month: "long", year: "numeric" }).format(
                        new Date(
                          parseInt(month.start.slice(0, 4), 10),
                          parseInt(month.start.slice(5, 7), 10) - 1,
                          1,
                        ),
                      )}
                    </p>
                    <MonthGrid
                      days={eachDay(month)}
                      model={monthModel}
                      today={today}
                      selectedDay={selectedDay}
                      onSelectDay={setSelectedDay}
                      onOpenTask={onOpenTask}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {selectedDay && density !== "week" && (
            <DayPanel
              day={selectedDay}
              model={
                density === "quarter"
                  ? buildPortfolioCalendarModel({
                      projects: scopedProjects,
                      quarters: visibleQuarters,
                      range: { start: selectedDay, end: selectedDay },
                      includeDone,
                    })
                  : model
              }
              today={today}
              onOpenTask={onOpenTask}
            />
          )}

          <PortfolioTimeline
            model={
              density === "quarter"
                ? model
                : buildPortfolioCalendarModel({
                    projects: scopedProjects,
                    quarters: visibleQuarters,
                    range: timelineRangeFrom(anchor),
                    includeDone,
                  })
            }
            onOpenTask={onOpenTask}
          />

          {model.unscheduled.length > 0 && (
            <details className="rounded-lg border border-border/70 bg-muted/20 p-3">
              <summary className="cursor-pointer text-sm font-medium">
                Sin fecha ({model.unscheduled.length})
              </summary>
              <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                {model.unscheduled.slice(0, 40).map((t) => (
                  <li key={`${t.projectId}-${t.id}`}>
                    <button
                      type="button"
                      className="text-left text-sm text-primary hover:underline"
                      onClick={() => onOpenTask(t.id, t.projectId)}
                    >
                      {t.title}
                      <span className="ml-2 text-xs text-muted-foreground">{t.projectName}</span>
                    </button>
                  </li>
                ))}
              </ul>
              {model.unscheduled.length > 40 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  …y {model.unscheduled.length - 40} más.
                </p>
              )}
            </details>
          )}
        </>
      )}

    </div>
  );
}

function timelineRangeFrom(anchor: string): DayRange {
  const week = weekRangeContaining(anchor);
  const endDate = new Date(
    parseInt(week.start.slice(0, 4), 10),
    parseInt(week.start.slice(5, 7), 10) - 1,
    parseInt(week.start.slice(8, 10), 10) + 27,
  );
  return { start: week.start, end: dayKeyFromDate(endDate) };
}

function colorIndex(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return h % TONE_KEYS.length;
}

function bandColor(b: CalendarRangeBand): string {
  return b.kind === "quarter" ? QUARTER_COLOR : TONES[TONE_KEYS[colorIndex(b.projectId ?? b.id)]];
}

function bandTooltip(b: CalendarRangeBand): string {
  const range = formatRange(b.start, b.end);
  const goal = b.goal?.trim();
  return goal ? `${b.name} · ${range} — ${goal}` : `${b.name} · ${range}`;
}

function WeekGrid({
  days,
  model,
  today,
  onOpenTask,
  onFocusQuarter,
}: {
  days: string[];
  model: PortfolioCalendarModel;
  today: string;
  onOpenTask: (taskId: string, projectId: string) => void;
  onFocusQuarter: (id: string) => void;
}) {
  const packed = packRangeLanes(model.bands, model.range);
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      {packed.laneCount > 0 && (
        <div
          className="grid gap-y-1 border-b border-border/60 bg-muted/20 p-1"
          style={{
            gridTemplateColumns: `repeat(${days.length}, minmax(7rem, 1fr))`,
            gridTemplateRows: `repeat(${packed.laneCount}, 1.5rem)`,
          }}
        >
          {packed.bands.map((b) => {
            const cls = cn(
              "truncate rounded px-2 text-left text-[10px] font-medium leading-6",
              bandColor(b),
            );
            const style = {
              gridColumn: `${b.colStart + 1} / ${b.colEnd + 2}`,
              gridRow: b.lane + 1,
            };
            if (b.kind === "project" && b.projectId) {
              return (
                <Link
                  key={`${b.kind}-${b.id}`}
                  to={ROUTES.project(b.projectId)}
                  className={cls}
                  style={style}
                  title={bandTooltip(b)}
                >
                  {b.name}
                </Link>
              );
            }
            return (
              <button
                key={`${b.kind}-${b.id}`}
                type="button"
                className={cls}
                style={style}
                title={bandTooltip(b)}
                onClick={() => onFocusQuarter(b.id)}
              >
                {b.name}
              </button>
            );
          })}
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
            {model.projectDues
              .filter((d) => d.day === day)
              .map((d) => (
                <Link
                  key={d.id}
                  to={ROUTES.project(d.id)}
                  className="mb-1 flex items-center gap-1 rounded border border-dashed border-foreground/30 px-1 py-0.5 text-[10px] hover:bg-muted/40"
                >
                  <Flag className="size-3 shrink-0" />
                  <span className="truncate">{d.name}</span>
                </Link>
              ))}
            <div className="space-y-1">
              {tasksOnDay(model, day).map((t) => (
                <TaskChip
                  key={`${t.projectId}-${t.id}`}
                  task={t}
                  today={today}
                  onOpen={() => onOpenTask(t.id, t.projectId)}
                />
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
  model: PortfolioCalendarModel;
  today: string;
  selectedDay: string | null;
  onSelectDay: (d: string) => void;
  onOpenTask: (taskId: string, projectId: string) => void;
}) {
  const first = days[0];
  const firstDate = new Date(
    parseInt(first.slice(0, 4), 10),
    parseInt(first.slice(5, 7), 10) - 1,
    parseInt(first.slice(8, 10), 10),
  );
  const padStart = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;
  const cells: (string | null)[] = [...Array.from({ length: padStart }, () => null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-xl border border-border" role="grid" aria-label="Calendario mensual">
      <div className="grid grid-cols-7 border-b border-border/60 bg-muted/20">
        {WEEKDAYS.map((w) => (
          <div key={w} className="px-1 py-1.5 text-center text-[10px] uppercase text-muted-foreground">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} className="min-h-[5.5rem] bg-muted/10" />;
          const dayTasks = tasksOnDay(model, day);
          const { visible, more } = partitionDayChips(dayTasks, 3);
          const covering = bandsCoveringDay(model.bands, day);
          const firstBand = covering[0];
          return (
            <div
              key={day}
              role="gridcell"
              aria-selected={selectedDay === day}
              onClick={() => onSelectDay(day)}
              className={cn(
                "min-h-[5.5rem] cursor-pointer border-b border-r border-border/40 p-1 text-left align-top",
                day === today && "bg-primary/5",
                selectedDay === day && "ring-2 ring-inset ring-primary/40",
                firstBand && "border-t-2",
                firstBand && (firstBand.kind === "quarter" ? "border-t-foreground/40" : "border-t-primary/50"),
              )}
            >
              <span className={cn("text-xs tabular-nums", day === today && "font-semibold text-primary")}>
                {day.slice(8)}
              </span>
              <div className="mt-0.5 space-y-0.5">
                {model.projectDues
                  .filter((d) => d.day === day)
                  .map((d) => (
                    <Link
                      key={d.id}
                      to={ROUTES.project(d.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-0.5 truncate text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      <Flag className="size-2.5 shrink-0" />
                      {d.name}
                    </Link>
                  ))}
                {visible.map((t) => (
                  <TaskChip
                    key={`${t.projectId}-${t.id}`}
                    task={t}
                    today={today}
                    compact
                    onOpen={() => onOpenTask(t.id, t.projectId)}
                  />
                ))}
                {more > 0 && <span className="text-[10px] text-muted-foreground">+{more} más</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayPanel({
  day,
  model,
  today,
  onOpenTask,
}: {
  day: string;
  model: PortfolioCalendarModel;
  today: string;
  onOpenTask: (taskId: string, projectId: string) => void;
}) {
  const items = tasksOnDay(model, day);
  const dues = model.projectDues.filter((d) => d.day === day);
  return (
    <div className="rounded-lg border border-border p-3">
      <p className="mb-2 text-sm font-medium">{formatDay(day)}</p>
      {dues.length === 0 && items.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sin ítems este día.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {dues.map((d) => (
            <Link
              key={d.id}
              to={ROUTES.project(d.id)}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Flag className="size-3.5" />
              Vence {d.name}
            </Link>
          ))}
          {items.map((t) => (
            <TaskChip
              key={`${t.projectId}-${t.id}`}
              task={t}
              today={today}
              onOpen={() => onOpenTask(t.id, t.projectId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function PortfolioTimeline({
  model,
  onOpenTask,
}: {
  model: PortfolioCalendarModel;
  onOpenTask: (taskId: string, projectId: string) => void;
}) {
  const days = eachDay(model.range);
  const totalDays = days.length;
  if (totalDays === 0) return null;
  if (model.bands.length === 0 && model.tasks.length === 0 && model.projectDues.length === 0) {
    return null;
  }

  const today = todayKey();
  const todayOffset =
    today >= model.range.start && today <= model.range.end
      ? days.findIndex((d) => d === today)
      : null;

  const markersByDay = new Map<string, CalendarTaskItem[]>();
  for (const t of model.tasks) {
    const list = markersByDay.get(t.day) ?? [];
    list.push(t);
    markersByDay.set(t.day, list);
  }

  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      <p className="text-sm font-medium">Línea de tiempo</p>
      <div className="overflow-x-auto">
        <div
          className="relative min-w-[640px]"
          style={{ height: 28 + model.bands.length * 26 + 40 }}
        >
          <div className="absolute inset-x-0 top-0 h-5 text-[9px] text-muted-foreground">
            {days.map((d, i) =>
              i % 7 === 0 ? (
                <span key={d} className="absolute" style={{ left: `${(i / totalDays) * 100}%` }}>
                  {d.slice(5)}
                </span>
              ) : null,
            )}
          </div>
          {todayOffset !== null && (
            <div
              className="absolute bottom-0 top-5 w-px bg-primary/60"
              style={{ left: `${((todayOffset + 0.5) / totalDays) * 100}%` }}
              title="Hoy"
            />
          )}
          {model.bands.map((b, i) => {
            const startOff = Math.max(0, daysBetween(model.range.start, b.start));
            const endOff = Math.min(totalDays - 1, daysBetween(model.range.start, b.end));
            const left = (startOff / totalDays) * 100;
            const width = ((Math.max(endOff, startOff) - startOff + 1) / totalDays) * 100;
            const inner = (
              <div
                className={cn(
                  "absolute h-5 truncate rounded px-2 text-[10px] font-medium leading-5",
                  bandColor(b),
                )}
                style={{ top: 22 + i * 26, left: `${left}%`, width: `${Math.max(width, 2)}%` }}
                title={bandTooltip(b)}
              >
                {b.name}
              </div>
            );
            return b.kind === "project" && b.projectId ? (
              <Link key={`${b.kind}-${b.id}`} to={ROUTES.project(b.projectId)}>
                {inner}
              </Link>
            ) : (
              <div key={`${b.kind}-${b.id}`}>{inner}</div>
            );
          })}
          <div
            className="absolute inset-x-0"
            style={{ top: 22 + model.bands.length * 26 + 4, height: 28 }}
          >
            {[...markersByDay.entries()].flatMap(([day, tasks]) => {
              const off = days.findIndex((d) => d === day);
              if (off < 0) return [];
              return tasks.map((t, i) => (
                <button
                  key={`${t.projectId}-${t.id}`}
                  type="button"
                  title={`${t.title} · ${t.projectName} · ${formatDay(t.day)}`}
                  onClick={() => onOpenTask(t.id, t.projectId)}
                  className={cn(
                    "absolute size-2.5 -translate-x-1/2 rounded-full border border-background",
                    // Color = urgencia (spec 065 D1): la regla única decide el tono.
                    URGENCY_DOT[
                      taskUrgency({ status: t.status, priority: t.priority, dueDate: t.day })
                    ],
                  )}
                  style={{
                    left: `${((off + 0.5) / totalDays) * 100}%`,
                    top: 4 + Math.min(i, 3) * 6,
                  }}
                  aria-label={`${t.title}, ${t.projectName}, vence ${formatDay(t.day)}`}
                />
              ));
            })}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Barras = trimestres y proyectos con inicio/fin · puntos = vencimientos de tareas.
      </p>
    </div>
  );
}

function TaskChip({
  task,
  today,
  onOpen,
  compact = false,
}: {
  task: CalendarTaskItem;
  today: string;
  onOpen: () => void;
  compact?: boolean;
}) {
  // Urgencia por la regla única (spec 065 D5): el chip es una superficie de
  // tarea más, no una regla propia. `now` sale del `today` del calendario.
  const urgency = taskUrgency(
    { status: task.status, priority: task.priority, dueDate: task.day },
    parseDayKey(today),
  );
  const rail = URGENCY_RAIL[urgency];
  const urgencyAria = URGENCY_ARIA[urgency];
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      className={cn(
        "flex w-full flex-col rounded border border-border/60 border-l-2 bg-background text-left hover:border-border",
        compact ? "px-1 py-0 text-[10px] leading-4" : "px-1.5 py-1 text-[11px] leading-snug",
        rail ?? "border-l-border/60",
      )}
      aria-label={`${task.title}, ${task.projectName}, vence ${formatDay(task.day)}, ${taskStatusLabel[task.status]}${urgencyAria ? `, ${urgencyAria}` : ""}`}
    >
      <span className="truncate">{task.title}</span>
      <span className="truncate text-[9px] text-muted-foreground">{task.projectName}</span>
    </button>
  );
}
