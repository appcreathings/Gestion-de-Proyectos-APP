import { useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { IconPicker } from "@/components/forms/IconPicker";
import { fieldAria, useFieldErrors } from "@/lib/formErrors";
import { AREA_ICONS } from "@/features/projects/components/AreaFormDialog";
import type {
  ChecklistTemplate,
  DefaultArea,
  ProcessTemplate,
  ProjectType,
} from "@/domain/schemas";
import { newProjectType } from "@/domain/factories";
import { AttachmentsSection } from "@/components/attachments/AttachmentsSection";
import { EMPTY_ATTACHMENTS } from "@/domain/attachments/ops";
import { useDataStore } from "@/store/useDataStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  type?: ProjectType;
  checklistTemplates: ChecklistTemplate[];
  processTemplates: ProcessTemplate[];
  onSubmit: (t: ProjectType) => void | Promise<void>;
}

export function ProjectTypeDialog({
  open,
  onOpenChange,
  type,
  checklistTemplates,
  processTemplates,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [areas, setAreas] = useState<DefaultArea[]>([]);
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();
  const typeId = type?.id;
  const liveAttachments = useDataStore((s) => {
    if (!typeId) return EMPTY_ATTACHMENTS;
    return s.projectTypes.find((t) => t.id === typeId)?.attachments ?? EMPTY_ATTACHMENTS;
  });

  useEffect(() => {
    if (open) {
      setName(type?.name ?? "");
      setDescription(type?.description ?? "");
      setAreas(type?.defaultAreas ?? []);
      clear();
    }
  }, [open, type?.id, clear]); // eslint-disable-line react-hooks/exhaustive-deps

  function addArea() {
    setAreas((s) => [
      ...s,
      { name: "", icon: "folder", checklistTemplateIds: [], processTemplateIds: [] },
    ]);
  }
  function patchArea(idx: number, patch: Partial<DefaultArea>) {
    setAreas((s) => s.map((a, i) => (i === idx ? { ...a, ...patch } : a)));
  }
  function toggle(idx: number, key: "checklistTemplateIds" | "processTemplateIds", id: string) {
    setAreas((s) =>
      s.map((a, i) => {
        if (i !== idx) return a;
        const has = a[key].includes(id);
        return {
          ...a,
          [key]: has ? a[key].filter((x) => x !== id) : [...a[key], id],
        };
      }),
    );
  }

  async function submit() {
    const errs = validate(
      { name },
      [{ field: "name", message: "El nombre no puede estar vacío", test: (v) => v.name.trim().length > 0 }],
    );
    if (errs.length > 0) {
      nameRef.current?.focus();
      return;
    }
    const wasNew = !type;
    const live = type
      ? useDataStore.getState().projectTypes.find((t) => t.id === type.id)
      : undefined;
    const base = live ?? type ?? newProjectType(name);
    setSaving(true);
    try {
      await onSubmit({
        ...base,
        name: name.trim(),
        description,
        defaultAreas: areas.filter((a) => a.name.trim()),
        attachments: live?.attachments ?? base.attachments ?? [],
      });
      if (!wasNew) onOpenChange(false);
    } catch {
      // El error ya se anuncia por el toast de Fase B; dejamos el diálogo abierto.
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" description="Define las áreas y plantillas que se generan al crear un proyecto de este tipo.">
        <DialogHeader>
          <DialogTitle>
            {type ? "Editar tipo de proyecto" : "Nuevo tipo de proyecto"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-2">
            <Label htmlFor="ty-name">Nombre</Label>
            <Input
              id="ty-name"
              ref={nameRef}
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="p. ej. Proyecto de Software"
              {...fieldAria("name", errors)}
            />
            {errors.name && (
              <p id="name-err" role="alert" className="text-xs text-destructive">
                {errors.name}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ty-desc">Descripción</Label>
            <Textarea
              id="ty-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Áreas por defecto</Label>
              <Button variant="ghost" size="sm" onClick={addArea}>
                <Plus className="size-4" />
                Añadir área
              </Button>
            </div>
            {areas.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Sin áreas. Define áreas y asóciales plantillas para que se generen al crear un
                proyecto de este tipo.
              </p>
            )}
            <div className="space-y-3">
              {areas.map((area, idx) => (
                <div key={idx} className="rounded-lg border p-3">
                  <div className="mb-3">
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">Icono</p>
                    <IconPicker
                      icons={AREA_ICONS}
                      value={area.icon}
                      onChange={(icon) => patchArea(idx, { icon })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      value={area.name}
                      onChange={(e) => patchArea(idx, { name: e.target.value })}
                      placeholder="Nombre del área"
                      className="h-9"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-9"
                      onClick={() => setAreas((s) => s.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <TemplatePicker
                    title="Checklists por defecto"
                    empty="No hay plantillas de checklist. Créalas en la pestaña Checklists."
                    options={checklistTemplates}
                    selected={area.checklistTemplateIds}
                    onToggle={(id) => toggle(idx, "checklistTemplateIds", id)}
                  />
                  <TemplatePicker
                    title="Procesos por defecto"
                    empty="No hay plantillas de proceso."
                    options={processTemplates}
                    selected={area.processTemplateIds}
                    onToggle={(id) => toggle(idx, "processTemplateIds", id)}
                  />
                </div>
              ))}
            </div>
          </div>
          <AiImproveButton
            entityType="project-type"
            fields={{ name, description, defaultAreas: areas }}
            onApply={(field, value) => {
              switch (field) {
                case "name":
                  setName(value as string);
                  break;
                case "description":
                  setDescription(value as string);
                  break;
              }
            }}
          />
          {type ? (
            <div className="space-y-2 border-t border-border pt-4">
              <AttachmentsSection
                parent={{ type: "projectType", typeId: type.id }}
                attachments={liveAttachments}
              />
              <p className="text-[11px] text-muted-foreground">
                Los anexos se guardan al adjuntarlos. Son material de referencia del tipo (no se
                copian a cada proyecto instanciado).
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Guardá el tipo primero para poder adjuntar archivos.
            </p>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} pending={saving}>
            {type ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TemplatePicker({
  title,
  empty,
  options,
  selected,
  onToggle,
}: {
  title: string;
  empty: string;
  options: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="mt-3">
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{title}</p>
      {options.length === 0 ? (
        <p className="text-xs text-muted-foreground">{empty}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {options.map((o) => {
            const on = selected.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => onToggle(o.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  on ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent",
                )}
              >
                {o.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
