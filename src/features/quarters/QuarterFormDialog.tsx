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
import { quarterStatusLabel } from "@/domain/labels";
import { newQuarter } from "@/domain/factories";
import type { Quarter, QuarterStatus } from "@/domain/schemas";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  quarter?: Quarter;
  onSubmit: (q: Quarter) => void | Promise<void>;
}

export function QuarterFormDialog({ open, onOpenChange, quarter, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<QuarterStatus>("planned");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();

  useEffect(() => {
    if (open) {
      setName(quarter?.name ?? "");
      setGoal(quarter?.goal ?? "");
      setStartDate(quarter?.startDate ?? "");
      setEndDate(quarter?.endDate ?? "");
      setStatus(quarter?.status ?? "planned");
      clear();
    }
  }, [open, quarter, clear]);

  async function submit() {
    const errs = validate(
      { name },
      [{ field: "name", message: "El nombre no puede estar vacío", test: (v) => v.name.trim().length > 0 }],
    );
    if (errs.length > 0) {
      nameRef.current?.focus();
      return;
    }
    const base = quarter ?? newQuarter(name);
    setSaving(true);
    try {
      await onSubmit({
        ...base,
        name: name.trim(),
        goal,
        startDate: startDate || null,
        endDate: endDate || null,
        status,
      });
      onOpenChange(false);
    } catch {
      // El error ya se anuncia por el toast de Fase B; dejamos el diálogo abierto.
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" description="Completa los datos del trimestre: nombre, rango de fechas, estado y meta.">
        <DialogHeader>
          <DialogTitle>{quarter ? "Editar trimestre" : "Nuevo trimestre"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-2">
            <Label htmlFor="q-name">Nombre</Label>
            <Input
              id="q-name"
              ref={nameRef}
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="Q3 2026"
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
              <Label htmlFor="q-start">Fecha de inicio</Label>
              <DateFieldPreview id="q-start" value={startDate} onChange={setStartDate} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="q-end">Fecha de fin</Label>
              <DateFieldPreview id="q-end" value={endDate} onChange={setEndDate} />
            </div>
          </div>
          <DateRangeSummary start={startDate} end={endDate} />
          <div className="grid gap-2">
            <Label htmlFor="q-status">Estado</Label>
            <Select
              id="q-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as QuarterStatus)}
            >
              {Object.entries(quarterStatusLabel).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="q-goal">Meta</Label>
            <Textarea
              id="q-goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="¿Qué queremos lograr este trimestre?"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} pending={saving}>
            {quarter ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
