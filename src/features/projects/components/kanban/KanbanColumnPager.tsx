import { cn } from "@/lib/utils";
import { taskStatusLabel } from "@/domain/labels";
import type { TaskStatus } from "@/domain/schemas";

interface Props {
  columns: { status: TaskStatus; count: number }[];
  active: TaskStatus;
  onSelect: (status: TaskStatus) => void;
}

/** Pager de columnas del carrusel móvil (spec 054). Solo se monta en &lt; sm. */
export function KanbanColumnPager({ columns, active, onSelect }: Props) {
  return (
    <div
      className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin"
      role="tablist"
      aria-label="Columnas del tablero"
    >
      {columns.map(({ status, count }) => {
        const isActive = status === active;
        return (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(status)}
            className={cn(
              "min-h-11 shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition-colors",
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            {taskStatusLabel[status]}{" "}
            <span className={cn("tabular-nums", isActive ? "opacity-80" : "opacity-70")}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
