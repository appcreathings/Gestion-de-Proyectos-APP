import { Badge } from "@/components/ui/badge";
import { workTypeLabel, workTypeVariant } from "@/domain/labels";
import type { WorkType } from "@/domain/schemas";

/** Badge de tipo de trabajo (spec 062 D5): oculto cuando la tarea es
 * genérica (`task`) para no ensuciar el 80 % de las tarjetas. Un solo
 * componente reusado por card, lista y fila de Mis tareas (principio V). */
export function WorkTypeBadge({ workType }: { workType: WorkType }) {
  if (workType === "task") return null;
  return (
    <Badge variant={workTypeVariant[workType]} className="text-[11px] leading-tight px-1.5 py-0.5">
      {workTypeLabel[workType]}
    </Badge>
  );
}
