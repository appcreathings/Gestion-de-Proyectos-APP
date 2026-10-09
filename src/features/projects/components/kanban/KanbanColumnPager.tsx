import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { stageDotClass, type StageColor } from "@/domain/kanbanStages";

interface Props {
  columns: { id: string; name: string; color: StageColor; count: number }[];
  active: string;
  onSelect: (id: string) => void;
  /** Abre el alta de etapa (spec 073 §5.3). El «+» no es una columna. */
  onAddStage?: () => void;
}

/** Pager de columnas del carrusel móvil (spec 054). Solo se monta en &lt; sm. */
export function KanbanColumnPager({ columns, active, onSelect, onAddStage }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin">
      <div role="tablist" aria-label="Columnas del tablero" className="flex shrink-0 gap-1.5">
        {columns.map(({ id, name, color, count }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(id)}
              className={cn(
                "min-h-11 shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn("mr-1.5 inline-block size-1.5 shrink-0 rounded-full align-middle", stageDotClass(color))}
                aria-hidden="true"
              />
              {name}{" "}
              <span className={cn("tabular-nums", isActive ? "opacity-80" : "opacity-70")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      {onAddStage && (
        <button
          type="button"
          aria-label="Nueva etapa"
          onClick={onAddStage}
          className="min-h-11 shrink-0 rounded-full border border-dashed border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          <Plus className="inline size-3.5 align-middle" />
        </button>
      )}
    </div>
  );
}
