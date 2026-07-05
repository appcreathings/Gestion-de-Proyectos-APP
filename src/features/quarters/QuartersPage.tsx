import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CalendarRange, Plus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { EntityCard } from "@/components/EntityCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { QuarterFormDialog } from "./QuarterFormDialog";
import { useDataStore } from "@/store/useDataStore";
import { quarterStatusLabel, quarterStatusVariant } from "@/domain/labels";
import { quarterRollup } from "@/domain/compute";
import { formatRange } from "@/lib/dates";
import { ROUTES } from "@/routes/paths";
import type { Quarter } from "@/domain/schemas";

export function QuartersPage() {
  return (
    <>
      <Helmet>
        <title>Trimestres | Hito</title>
        <meta
          name="description"
          content="Agrupa proyectos por trimestre y sigue el progreso agregado en Hito."
        />
      </Helmet>
      <QuartersContent />
    </>
  );
}

function QuartersContent() {
  const quarters = useDataStore((s) => s.quarters);
  const projects = useDataStore((s) => s.projects);
  const createQuarter = useDataStore((s) => s.createQuarter);
  const updateQuarter = useDataStore((s) => s.updateQuarter);
  const deleteQuarter = useDataStore((s) => s.deleteQuarter);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Quarter | undefined>();
  const [toDelete, setToDelete] = useState<Quarter | undefined>();

  function openNew() {
    setEditing(undefined);
    setFormOpen(true);
  }
  function openEdit(q: Quarter) {
    setEditing(q);
    setFormOpen(true);
  }

  return (
    <div>
      <PageHeader
        label="Trimestres"
        title="Trimestres"
        description="Agrupa proyectos por trimestre y sigue su progreso agregado."
        actions={
          <Button onClick={openNew}>
            <Plus className="size-4" />
            Nuevo trimestre
          </Button>
        }
      />

      {quarters.length === 0 ? (
        <EmptyState
          icon={CalendarRange}
          title="Aún no hay trimestres"
          description="Crea un trimestre (p. ej. Q3 2026) y asígnale proyectos para ver su progreso agregado."
          action={
            <Button onClick={openNew}>
              <Plus className="size-4" />
              Nuevo trimestre
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quarters.map((q) => {
            const rollup = quarterRollup(q, projects);
            return (
              <EntityCard
                key={q.id}
                title={q.name}
                meta={
                  <Badge variant={quarterStatusVariant[q.status]}>
                    {quarterStatusLabel[q.status]}
                  </Badge>
                }
                onEdit={() => openEdit(q)}
                onDelete={() => setToDelete(q)}
              >
                {q.goal && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">{q.goal}</p>
                )}
                {q.startDate && q.endDate && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {formatRange(q.startDate, q.endDate)}
                  </p>
                )}
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progreso agregado</span>
                    <span>
                      {rollup.done}/{rollup.total} · {rollup.pct}%
                    </span>
                  </div>
                  <Progress value={rollup.pct} />
                </div>
                {rollup.projectCount > 0 ? (
                  <Link
                    to={ROUTES.projectsByQuarter(q.id)}
                    className="mt-3 block text-xs text-primary hover:underline"
                  >
                    {rollup.projectCount}{" "}
                    {rollup.projectCount === 1 ? "proyecto" : "proyectos"} →
                  </Link>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">Sin proyectos aún.</p>
                )}
              </EntityCard>
            );
          })}
        </div>
      )}

      <QuarterFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        quarter={editing}
        onSubmit={(q) => (editing ? updateQuarter(q) : createQuarter(q))}
      />

      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(undefined)}
        title={`¿Eliminar "${toDelete?.name}"?`}
        description="Los proyectos asociados no se borrarán; quedarán sin trimestre."
        onConfirm={() => toDelete && deleteQuarter(toDelete.id)}
      />
    </div>
  );
}
