import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EntitySelect } from "@/components/forms/EntitySelect";
import { useDataStore } from "@/store/useDataStore";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Cantidad de tareas a duplicar: define el título (spec 074 §5). */
  count: number;
  currentProjectId: string;
  /** Spec 074 D13: false desde una tarea (excluye el actual), true desde el lote. */
  includeCurrent: boolean;
  onConfirm: (targetProjectId: string) => void;
}

/** Elige el proyecto destino de una duplicación (spec 074). No escribe nada:
 * `onConfirm` recibe el id y quien lo abre hace la copia. */
export function DuplicateTasksDialog({
  open,
  onOpenChange,
  count,
  currentProjectId,
  includeCurrent,
  onConfirm,
}: Props) {
  const projects = useDataStore((s) => s.projects);

  const options = useMemo(() => {
    const others = projects
      .filter((p) => p.status !== "archived" && p.id !== currentProjectId)
      .sort((a, b) => a.name.localeCompare(b.name, "es"))
      .map((p) => ({ id: p.id, name: p.name }));
    const current = projects.find((p) => p.id === currentProjectId);
    if (includeCurrent && current) {
      return [{ id: current.id, name: `${current.name} (este proyecto)` }, ...others];
    }
    return others;
  }, [projects, currentProjectId, includeCurrent]);

  const [target, setTarget] = useState("");

  useEffect(() => {
    if (open) setTarget(options[0]?.id ?? "");
    // Valor inicial solo al abrir: un mutate de proyectos con el diálogo
    // abierto no debe pisar la elección.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const title = count === 1 ? "Duplicar en otro proyecto" : `Duplicar ${count} tareas`;
  const hasOptions = options.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {hasOptions ? (
            <div className="space-y-1.5">
              <Label htmlFor="duplicate-target">Proyecto destino</Label>
              <EntitySelect
                id="duplicate-target"
                value={target}
                onChange={setTarget}
                options={options}
                required
              />
              <p className="text-xs text-muted-foreground">
                La copia queda en Por hacer, sin comentarios, adjuntos ni horas registradas.
              </p>
              {target && target !== currentProjectId && (
                <p className="text-xs text-muted-foreground">
                  Fuera de este proyecto se quitan el área y el sprint.
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No hay otros proyectos activos.</p>
          )}
        </DialogBody>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={!hasOptions || !target} onClick={() => onConfirm(target)}>
            Duplicar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
