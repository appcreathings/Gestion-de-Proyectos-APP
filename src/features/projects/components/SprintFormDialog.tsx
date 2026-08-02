import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { DateFieldPreview, DateRangeSummary } from "@/components/forms/DateFieldPreview";
import { fieldAria, useFieldErrors } from "@/lib/formErrors";
import { sprintStatusLabel } from "@/domain/labels";
import { newSprint } from "@/domain/factories";
import type { Sprint, SprintStatus } from "@/domain/schemas";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  sprint?: Sprint;
  onSubmit: (s: Sprint) => void;
}

export function SprintFormDialog({ open, onOpenChange, sprint, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<SprintStatus>("planned");
  const nameRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();

  useEffect(() => {
    if (open) {
      setName(sprint?.name ?? "");
      setGoal(sprint?.goal ?? "");
      setStartDate(sprint?.startDate ?? "");
      setEndDate(sprint?.endDate ?? "");
      setStatus(sprint?.status ?? "planned");
      clear();
    }
  }, [open, sprint, clear]);

  function submit() {
    const errs = validate(
      { name },
      [{ field: "name", message: "El nombre no puede estar vacío", test: (v) => v.name.trim().length > 0 }],
    );
    if (errs.length > 0) {
      nameRef.current?.focus();
      return;
    }
    const base = sprint ?? newSprint(name);
    onSubmit({
      ...base,
      name: name.trim(),
      goal,
      startDate: startDate || null,
      endDate: endDate || null,
      status,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" description="Completa los datos del sprint: nombre, rango de fechas, estado y meta.">
        <DialogHeader>
          <DialogTitle>{sprint ? "Editar sprint" : "Nuevo sprint"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-2">
            <Label htmlFor="sp-name">Nombre</Label>
            <Input
              id="sp-name"
              ref={nameRef}
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="Sprint 7"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              {...fieldAria("name", errors)}
            />
            {errors.name && (
              <p id="name-err" role="alert" className="text-xs text-destructive">
                {errors.name}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="sp-start">Fecha de inicio</Label>
              <DateFieldPreview id="sp-start" value={startDate} onChange={setStartDate} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sp-end">Fecha de fin</Label>
              <DateFieldPreview id="sp-end" value={endDate} onChange={setEndDate} />
            </div>
          </div>
          <DateRangeSummary start={startDate} end={endDate} />
          <div className="grid gap-2">
            <Label htmlFor="sp-status">Estado</Label>
            <Select
              id="sp-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as SprintStatus)}
            >
              {Object.entries(sprintStatusLabel).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sp-goal">Meta</Label>
            <Textarea
              id="sp-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="¿Qué queremos lograr en este sprint?"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit}>
            {sprint ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
