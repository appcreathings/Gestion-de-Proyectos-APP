import { Link } from "react-router-dom";
import { HealthDot } from "@/components/HealthBadge";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  isStalled,
  projectChecklistProgress,
  projectLiveTaskProgress,
  type ProgressStat,
} from "@/domain/compute";
import { effectiveHealth } from "@/domain/health";
import {
  priorityLabel,
  priorityVariant,
  projectStatusLabel,
  projectStatusVariant,
} from "@/domain/labels";
import { ROUTES } from "@/routes/paths";
import type { Project, Settings } from "@/domain/schemas";
import { overdueLiveTaskCount, projectDueLabel } from "../filterProjects";

interface ProjectPlanRowProps {
  project: Project;
  settings: Settings | null;
  now: Date;
  productName?: string;
  quarterName?: string;
  ownerName?: string;
}

/** Barra con `title` en el wrapper: `Progress` no lo reenvía (072 D26). */
function PlanBar({
  label,
  stat,
  indicatorClassName,
}: {
  label: string;
  stat: ProgressStat;
  indicatorClassName?: string;
}) {
  return (
    <span title={`${label} ${stat.done}/${stat.total}`} className="min-w-0 flex-1">
      <span className="block text-[10px] leading-tight text-muted-foreground">{label}</span>
      <Progress value={stat.pct} className="h-1.5" indicatorClassName={indicatorClassName} />
    </span>
  );
}

/** Fila de la vista Plan (spec 072 D14–D16). La fila entera es un solo link:
 *  no anclar nada adentro. Salud = effectiveHealth; sin settings, p.health (D12). */
export function ProjectPlanRow({
  project: p,
  settings,
  now,
  productName,
  quarterName,
  ownerName,
}: ProjectPlanRowProps) {
  const health = settings ? effectiveHealth(p, settings, now) : p.health;
  const checks = projectChecklistProgress(p);
  const tasks = projectLiveTaskProgress(p);
  const overdue = overdueLiveTaskCount(p, now);
  const stalled = settings ? isStalled(p, settings.stalledAfterDays, now) : false;

  const meta = [
    ownerName ?? "Sin responsable",
    projectDueLabel(p.dueDate, now),
    [productName, quarterName].filter(Boolean).join(" · ") || null,
    stalled ? "Estancado" : null,
    overdue > 0 ? `${overdue} ${overdue === 1 ? "vencida" : "vencidas"}` : null,
  ].filter((part): part is string => part !== null);

  return (
    <Link
      to={ROUTES.project(p.id)}
      className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:border-primary/40 sm:flex-row sm:items-center sm:gap-3"
    >
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <HealthDot health={health} ariaHidden />
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
        <Badge variant={projectStatusVariant[p.status]}>{projectStatusLabel[p.status]}</Badge>
        <Badge variant={priorityVariant[p.priority]}>{priorityLabel[p.priority]}</Badge>
      </span>
      <span className="text-xs text-muted-foreground">{meta.join(" · ")}</span>
      {(checks.total > 0 || tasks.total > 0) && (
        <span className="flex gap-3 sm:w-40">
          {checks.total > 0 && <PlanBar label="Checklists" stat={checks} />}
          {tasks.total > 0 && (
            <PlanBar label="Tareas" stat={tasks} indicatorClassName="bg-success" />
          )}
        </span>
      )}
    </Link>
  );
}
