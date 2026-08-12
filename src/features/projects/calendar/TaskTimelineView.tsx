import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  dayKeyFromDate,
  daysBetween,
  eachDay,
  shiftRange,
  todayKey,
  weekRangeContaining,
  type DayRange,
} from "@/lib/dates";
import type { Project } from "@/domain/schemas";
import { buildCalendarModel } from "./buildCalendarItems";
import { cn } from "@/lib/utils";

interface Props {
  project: Project;
  includeDone: boolean;
  onOpenTask: (taskId: string) => void;
}

/** Franja de ~4 semanas: barras de sprint + puntos de vencimiento (spec 053 HU-05). */
export function TaskTimelineView({
  project,
  includeDone,
  onOpenTask,
}: Props) {
  const [anchor, setAnchor] = useState(() => todayKey());

  const range: DayRange = useMemo(() => {
    const week = weekRangeContaining(anchor);
    const start = week.start;
    const endDate = new Date(
      parseInt(start.slice(0, 4)),
      parseInt(start.slice(5, 7)) - 1,
      parseInt(start.slice(8, 10)) + 27,
    );
    return { start, end: dayKeyFromDate(endDate) };
  }, [anchor]);

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

  function shift(delta: number) {
    const w = weekRangeContaining(anchor);
    const next = shiftRange(w, "week", delta);
    setAnchor(next.start);
  }

  if (model.sprints.length === 0 && model.tasks.length === 0) return null;

  return (
    <div className="space-y-2 rounded-xl border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Línea de tiempo</p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => shift(-1)} aria-label="Semanas anteriores">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => shift(1)} aria-label="Semanas siguientes">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="relative min-w-[640px]" style={{ height: 28 + model.sprints.length * 28 + 36 }}>
          {/* Day ticks every 7 days */}
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

          {/* Sprint bars */}
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
                title={`${s.name}: ${s.start} – ${s.end}`}
              >
                {s.name}
              </div>
            );
          })}

          {/* Task markers */}
          <div
            className="absolute inset-x-0"
            style={{ top: 22 + model.sprints.length * 26 + 4, height: 24 }}
          >
            {model.tasks.map((t) => {
              const off = daysBetween(range.start, t.day);
              if (off < 0 || off >= totalDays) return null;
              return (
                <button
                  key={t.id}
                  type="button"
                  title={t.title}
                  onClick={() => onOpenTask(t.id)}
                  className={cn(
                    "absolute size-2.5 -translate-x-1/2 rounded-full border border-background",
                    t.status === "blocked"
                      ? "bg-red-500"
                      : t.status === "doing"
                        ? "bg-blue-500"
                        : "bg-foreground/70",
                  )}
                  style={{ left: `${((off + 0.5) / totalDays) * 100}%`, top: 6 }}
                  aria-label={t.title}
                />
              );
            })}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-muted-foreground">
        Barras = sprints · puntos = vencimientos de tareas (sin duración: las tareas solo tienen fecha de vencimiento).
      </p>
    </div>
  );
}
