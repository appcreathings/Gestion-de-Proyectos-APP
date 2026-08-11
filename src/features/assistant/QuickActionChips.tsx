import type { QuickAction } from "@/ai/chat/quickActions";
import { cn } from "@/lib/utils";

interface Props {
  actions: QuickAction[];
  disabled?: boolean;
  onPick: (a: QuickAction) => void;
  /** Fila densa (composer / follow-ups) vs botones full (empty state). */
  dense?: boolean;
  /** Estilo aún más suave para follow-ups bajo el último mensaje. */
  subtle?: boolean;
  className?: string;
}

/**
 * Fila de chips de acción reutilizable (spec 050 design §2.2).
 * - Empty state: `dense={false}`, full-width, etiqueta más grande.
 * - Composer: `dense`, scroll horizontal.
 * - Follow-ups: `dense` + `subtle`.
 */
export function QuickActionChips({
  actions,
  disabled,
  onPick,
  dense,
  subtle,
  className,
}: Props) {
  if (actions.length === 0) return null;
  return (
    <div
      className={cn(
        dense ? "flex flex-wrap gap-1" : "grid w-full gap-1",
        className,
      )}
    >
      {actions.map((a) => (
        <button
          key={a.id}
          type="button"
          disabled={disabled}
          onClick={() => onPick(a)}
          title={a.prompt}
          className={cn(
            "rounded-lg border text-left transition-colors hover:border-primary/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50",
            dense ? "px-2 py-1 text-[11px]" : "px-2.5 py-1.5 text-[11px]",
            subtle
              ? "border-transparent bg-transparent text-muted-foreground/80 hover:bg-muted/40"
              : "text-muted-foreground",
          )}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
