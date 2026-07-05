import { ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatRange } from "@/lib/dates";
import { sprintStatusLabel, sprintStatusVariant } from "@/domain/labels";
import type { Sprint } from "@/domain/schemas";

export type SprintScope = "all" | "backlog" | string;

interface Props {
  sprints: Sprint[];
  scope: SprintScope;
  onScopeChange: (scope: SprintScope) => void;
  taskCount: number;
  onCreateSprint: () => void;
  onEditSprint: (sprint: Sprint) => void;
  onDeleteSprint: (sprint: Sprint) => void;
}

/**
 * Sprint bar shown above the Kanban board: a scope switcher (todas / backlog /
 * un sprint concreto) with prev/next stepping through the project's sprints,
 * plus the eyebrow + range + task count that echo the landing preview
 * ("Proyecto · Sprint 7").
 */
export function SprintSwitcher({
  sprints,
  scope,
  onScopeChange,
  taskCount,
  onCreateSprint,
  onEditSprint,
  onDeleteSprint,
}: Props) {
  const currentSprint = sprints.find((s) => s.id === scope);
  const currentIndex = currentSprint ? sprints.indexOf(currentSprint) : -1;

  function step(delta: 1 | -1) {
    if (sprints.length === 0) return;
    const nextIndex =
      currentIndex === -1
        ? delta === 1
          ? 0
          : sprints.length - 1
        : (currentIndex + delta + sprints.length) % sprints.length;
    onScopeChange(sprints[nextIndex].id);
  }

  const eyebrow = currentSprint
    ? `Proyecto · ${currentSprint.name}`
    : scope === "backlog"
      ? "Proyecto · Backlog"
      : "Proyecto · Todas las tareas";

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <SectionLabel>{eyebrow}</SectionLabel>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={() => step(-1)}
            disabled={sprints.length === 0}
            aria-label="Sprint anterior"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Select
            value={scope}
            onChange={(e) => onScopeChange(e.target.value)}
            className="h-9 w-auto min-w-[10rem]"
          >
            <option value="all">Todas las tareas</option>
            <option value="backlog">Backlog</option>
            {sprints.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={() => step(1)}
            disabled={sprints.length === 0}
            aria-label="Sprint siguiente"
          >
            <ChevronRight className="size-4" />
          </Button>
          {currentSprint && (
            <>
              <Badge variant={sprintStatusVariant[currentSprint.status]} className="text-[10px]">
                {sprintStatusLabel[currentSprint.status]}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => onEditSprint(currentSprint)}
                aria-label="Editar sprint"
              >
                <Pencil className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0"
                onClick={() => onDeleteSprint(currentSprint)}
                aria-label="Eliminar sprint"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </>
          )}
        </div>
        {currentSprint?.startDate && currentSprint?.endDate && (
          <p className="mt-1 text-xs text-muted-foreground">
            {formatRange(currentSprint.startDate, currentSprint.endDate)}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="secondary">
          {taskCount} {taskCount === 1 ? "tarea" : "tareas"}
        </Badge>
        <Button variant="outline" size="sm" onClick={onCreateSprint}>
          <Plus className="size-4" />
          Nuevo sprint
        </Button>
      </div>
    </div>
  );
}
