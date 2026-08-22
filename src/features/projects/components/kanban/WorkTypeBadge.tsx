import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { workTypeLabel, workTypeTone } from "@/domain/labels";
import type { WorkType } from "@/domain/schemas";
import { TONES } from "@/lib/urgencyStyles";

/** Badge de tipo de trabajo (spec 062 D5): oculto cuando la tarea es
 * genérica (`task`) para no ensuciar el 80 % de las tarjetas. Un solo
 * componente reusado por card, lista y fila de Mis tareas (principio V).
 *
 * Spec 065 D9: tonos propios (`teal`/`sky` de la familia pastel única) que
 * no comparten tono con ningún nivel de urgencia; `bug` y `prd` van
 * neutros. */
export function WorkTypeBadge({ workType }: { workType: WorkType }) {
  if (workType === "task") return null;
  const tone = workTypeTone[workType];
  return (
    <Badge
      variant="neutral"
      className={cn(
        "text-[11px] leading-tight px-1.5 py-0.5",
        tone !== "neutral" && TONES[tone],
      )}
    >
      {workTypeLabel[workType]}
    </Badge>
  );
}
