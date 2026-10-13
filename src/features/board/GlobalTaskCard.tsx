import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { priorityLabel, priorityVariant } from "@/domain/labels";
import { taskUrgency } from "@/domain/taskUrgency";
import { URGENCY_ARIA, URGENCY_RAIL } from "@/lib/urgencyStyles";
import { cn } from "@/lib/utils";
import type { BoardCard } from "./boardQuery";

interface Props {
  card: BoardCard;
  /** Nombre visible del responsable, si la tarea tiene uno (D9). */
  assigneeName?: string | null;
  /** Badge con el nombre de la etapa: solo en la columna Otras (D4/D9). */
  inOtras?: boolean;
  /** El clic abre el drawer de la tarea en su proyecto (D9). */
  onClick?: () => void;
  isOverlay?: boolean;
  /** Asa de arrastre: solo sm+; debajo de sm no hay drag (D19). */
  handle?: {
    attributes: DraggableAttributes;
    listeners: DraggableSyntheticListeners | undefined;
  };
}

/** Tarjeta del tablero global: título, proyecto, prioridad, vencimiento,
 * responsable y — en Otras — el nombre de la etapa. Franja de urgencia 065.
 * Sin flechas de etapa ni selección masiva: eso vive en el tablero del
 * proyecto (D9/D21). */
export function GlobalTaskCard({
  card,
  assigneeName,
  inOtras,
  onClick,
  isOverlay,
  handle,
}: Props) {
  const { task, projectName } = card;
  const urgency = taskUrgency(task);
  const rail = URGENCY_RAIL[urgency];
  const urgencyAria = URGENCY_ARIA[urgency];

  return (
    <div
      className={cn(
        "group/card relative rounded-xl border border-border/70 border-l-[3px] bg-background text-left transition-colors",
        rail ?? "border-l-transparent",
        urgency === "done" && "opacity-70",
        isOverlay && "shadow-lg",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={`Abrir detalle de ${task.title}${urgencyAria ? ` — ${urgencyAria}` : ""}`}
        className="w-full rounded-[inherit] p-3 pr-7"
      >
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{projectName}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <Badge variant={priorityVariant[task.priority]} className="text-xs">
            {priorityLabel[task.priority]}
          </Badge>
          {inOtras && (
            <Badge variant="neutral" className="text-xs">
              {card.stageName}
            </Badge>
          )}
          {task.dueDate && (
            <Badge
              variant={
                urgency === "overdue"
                  ? "destructive"
                  : urgency === "soon"
                    ? "warning"
                    : "outline"
              }
              className="text-xs"
            >
              {task.dueDate}
            </Badge>
          )}
          {assigneeName && (
            <span className="truncate text-xs text-muted-foreground">{assigneeName}</span>
          )}
        </div>
      </button>
      {handle && (
        <button
          type="button"
          aria-label={`Mover ${task.title}`}
          className="absolute right-1 top-1 flex size-6 cursor-grab touch-none items-center justify-center rounded text-muted-foreground/0 transition-colors hover:text-muted-foreground focus-visible:text-muted-foreground group-hover/card:text-muted-foreground/60 active:cursor-grabbing"
          {...handle.attributes}
          {...handle.listeners}
        >
          <GripVertical className="size-3.5" />
        </button>
      )}
    </div>
  );
}
