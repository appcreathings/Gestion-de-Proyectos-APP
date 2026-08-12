import { useMemo } from "react";
import {
  dayKeyFromDate,
  daysBetween,
  eachDay,
  formatDay,
  todayKey,
  weekRangeContaining,
  type DayRange,
} from "@/lib/dates";
import type { Project } from "@/domain/schemas";
import { buildCalendarModel, type CalendarTaskItem } from "./buildCalendarItems";
import { cn } from "@/lib/utils";

interface Props {
  project: Project;
  includeDone: boolean;
  /** Day inside the calendar's visible range — timeline starts on that week's Monday. */
  anchorDay: string;
  onOpenTask: (taskId: string) => void;
}

/** Franja de ~4 semanas: barras de sprint + puntos de vencimiento (spec 053 HU-05). */
export function TaskTimelineView({
  project,
  includeDone,
  anchorDay,
  onOpenTask,
}: Props) {
  const range: DayRange = useMemo(() => {
    const week = weekRangeContaining(anchorDay);
    const start = week.start;
    const endDate = new Date(
      parseInt(start.slice(0, 4), 10),
      parseInt(start.slice(5, 7), 10) - 1,
      parseInt(start.slice(8, 10), 10) + 27,
    );
    return { start, end: dayKeyFromDate(endDate) };
  }, [anchorDay]);

  const days = useMemo(() => eachDay(range), [range]);
  const totalDays = days.length;

  const model = useMemo(
    () =>
      buildCalendarModel({
        project,
        range,
        sprintScope: "all",
        searchQuery: "",
        areaId: null,
        includeDone,
      }),
    [project, range, includeDone],
  );

  const today = todayKey();
  const todayOffset =
    today >= range.start && today <= range.end ? daysBetween(range.start, today) : null;

  const markersByDay = useMemo(() => {
    const map = new Map<string, CalendarTaskItem[]>();
    for (const t of model.tasks) {
      const list = map.get(t.day) ?? [];
      list.push(t);
      map.set(t.day, list);
    }
    return map;
  }, [model.tasks]);

  if (model.sprints.length === 0 && model.tasks.length === 0) return null;

  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      <p className="text-sm font-medium">Línea de tiempo</p>

      <div className="overflow-x-auto">
        <div className="relative min-w-[640px]" style={{ height: 28 + model.sprints.length * 28 + 40 }}>
          <div className="absolute inset-x-0 top-0 flex h-5 text-[9px] text-muted-foreground">
            {days.map((d, i) =>
              i % 7 === 0 ? (
                <span
                  key={d}
                  className="absolute"
                  style={{ left: `${(i / totalDays) * 100}%` }}
                >
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

          {model.sprints.map((s, i) => {
            const startOff = Math.max(0, daysBetween(range.start, s.start));
            const endOff = Math.min(totalDays - 1, daysBetween(range.start, s.end));
            const left = (startOff / totalDays) * 100;
            const width = ((endOff - startOff + 1) / totalDays) * 100;
            return (
              <div
                key={s.id}
                className={cn(
                  "absolute h-5 truncate rounded px-2 text-[10px] font-medium leading-5",
                  i % 2 === 0
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                    : "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
                )}
                style={{
                  top: 22 + i * 26,
                  left: `${left}%`,
                  width: `${Math.max(width, 2)}%`,
                }}
                title={`${s.name}: ${s.start} – ${s.end}${s.goal ? ` — ${s.goal}` : ""}`}
              >
                {s.name}
              </div>
            );
          })}

          <div
            className="absolute inset-x-0"
            style={{ top: 22 + model.sprints.length * 26 + 4, height: 28 }}
          >
            {[...markersByDay.entries()].flatMap(([day, tasks]) => {
              const off = daysBetween(range.start, day);
              if (off < 0 || off >= totalDays) return [];
              return tasks.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  title={`${t.title} · ${formatDay(t.day)}`}
                  onClick={() => onOpenTask(t.id)}
                  className={cn(
                    "absolute size-2.5 -translate-x-1/2 rounded-full border border-background",
                    t.status === "blocked"
                      ? "bg-red-500"
                      : t.status === "doing"
                        ? "bg-blue-500"
                        : "bg-foreground/70",
                  )}
                  style={{
                    left: `${((off + 0.5) / totalDays) * 100}%`,
                    top: 4 + Math.min(i, 3) * 6,
                  }}
                  aria-label={`${t.title}, vence ${formatDay(t.day)}`}
                />
              ));
            })}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">
        4 semanas desde la semana visible. Barras = sprints · puntos = vencimientos (las tareas no tienen duración).
      </p>
    </div>
  );
}
