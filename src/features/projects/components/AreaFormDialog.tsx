import { useEffect, useRef, useState } from "react";
import { AiImproveButton } from "@/components/ai/AiImproveButton";
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
import { PersonSelect } from "@/components/forms/PersonSelect";
import { IconPicker } from "@/components/forms/IconPicker";
import { fieldAria, useFieldErrors } from "@/lib/formErrors";
import type { Area, Person } from "@/domain/schemas";
import { newArea } from "@/domain/factories";

export const AREA_ICONS = [
  "folder",
  "code",
  "palette",
  "megaphone",
  "scale",
  "wallet",
  "settings",
  "users",
  "shield",
  "truck",
] as const;

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  area?: Area;
  people?: Person[];
  onSubmit: (a: Area) => void;
}

export function AreaFormDialog({ open, onOpenChange, area, people = [], onSubmit }: Props) {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>("folder");
  const [ownerId, setOwnerId] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();

  useEffect(() => {
    if (open) {
      setName(area?.name ?? "");
      setIcon(area?.icon ?? "folder");
      setOwnerId(area?.ownerId ?? "");
      clear();
    }
  }, [open, area, clear]);

  function submit() {
    const errs = validate(
      { name },
      [{ field: "name", message: "El nombre no puede estar vacío", test: (v) => v.name.trim().length > 0 }],
    );
    if (errs.length > 0) {
      nameRef.current?.focus();
      return;
    }
    const base = area ?? newArea(name, icon);
    onSubmit({ ...base, name: name.trim(), icon, ownerId: ownerId || null });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm" description="Completa los datos del área: nombre, icono y responsable." className="sm:min-h-[65vh]">
        <DialogHeader>
          <DialogTitle>{area ? "Editar área" : "Nueva área"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-2">
            <Label htmlFor="ar-name">Nombre</Label>
            <Input
              id="ar-name"
              ref={nameRef}
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="p. ej. Desarrollo, Diseño, Legal"
              {...fieldAria("name", errors)}
            />
            {errors.name && (
              <p id="name-err" role="alert" className="text-xs text-destructive">
                {errors.name}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Icono</Label>
            <IconPicker icons={AREA_ICONS} value={icon} onChange={setIcon} />
          </div>
          {people.length > 0 && (
            <div className="grid gap-2">
              <Label htmlFor="ar-owner">Responsable del área</Label>
              <PersonSelect
                id="ar-owner"
                value={ownerId}
                onChange={setOwnerId}
                people={people}
              />
            </div>
          )}
          <AiImproveButton
            entityType="area"
            fields={{ name, icon, ownerId }}
            onApply={(field, value) => {
              switch (field) {
                case "name":
                  setName(value as string);
                  break;
                case "icon":
                  setIcon(value as string);
                  break;
                case "ownerId":
                  setOwnerId(value as string);
                  break;
              }
            }}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit}>
            {area ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
