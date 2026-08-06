import { useEffect, useRef, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { AiImproveButton } from "@/components/ai/AiImproveButton";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
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
import { SortableItem } from "@/components/dnd/SortableItem";
import { RichTextField } from "@/components/forms/RichTextField";
import { fieldAria, useFieldErrors } from "@/lib/formErrors";
import { cn, uuid } from "@/lib/utils";
import type { ProcessTemplate } from "@/domain/schemas";
import { newProcessTemplate } from "@/domain/factories";
import { AttachmentsSection } from "@/components/attachments/AttachmentsSection";
import { EMPTY_ATTACHMENTS } from "@/domain/attachments/ops";
import { useDataStore } from "@/store/useDataStore";

interface Step {
  id: string;
  text: string;
  details: string;
}

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  template?: ProcessTemplate;
  onSubmit: (t: ProcessTemplate) => void | Promise<void>;
}

export function ProcessTemplateDialog({ open, onOpenChange, template, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();
  // Anexos viven en el store. EMPTY estable — `?? []` re-crea array y crashea React.
  const templateId = template?.id;
  const liveAttachments = useDataStore((s) => {
    if (!templateId) return EMPTY_ATTACHMENTS;
    return (
      s.processTemplates.find((t) => t.id === templateId)?.attachments ??
      EMPTY_ATTACHMENTS
    );
  });

  useEffect(() => {
    if (open) {
      setName(template?.name ?? "");
      setCategory(template?.category ?? "");
      setDescription(template?.description ?? "");
      setSteps(template?.steps ?? []);
      clear();
    }
  }, [open, template?.id, clear]); // eslint-disable-line react-hooks/exhaustive-deps -- solo al abrir / cambiar plantilla

  async function submit() {
    const errs = validate(
      { name },
      [{ field: "name", message: "El nombre no puede estar vacío", test: (v) => v.name.trim().length > 0 }],
    );
    if (errs.length > 0) {
      nameRef.current?.focus();
      return;
    }
    // Preferir el snapshot del store para no pisar anexos añadidos en el diálogo.
    const wasNew = !template;
    const live = template
      ? useDataStore.getState().processTemplates.find((t) => t.id === template.id)
      : undefined;
    const base = live ?? template ?? newProcessTemplate(name);
    setSaving(true);
    try {
      await onSubmit({
        ...base,
        name: name.trim(),
        category,
        description,
        steps: steps.filter((s) => s.text.trim()),
        attachments: live?.attachments ?? base.attachments ?? [],
      });
      // Tras crear, el padre pasa a `editing = t` y re-renderiza con anexos.
      // No cerramos: el usuario puede adjuntar de inmediato.
      if (!wasNew) onOpenChange(false);
    } catch {
      // El error ya se anuncia por el toast de Fase B; dejamos el diálogo abierto.
    } finally {
      setSaving(false);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSteps((s) => {
      const oldIndex = s.findIndex((x) => x.id === active.id);
      const newIndex = s.findIndex((x) => x.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return s;
      return arrayMove(s, oldIndex, newIndex);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" description="Define los pasos y la descripción de esta plantilla de proceso reutilizable.">
        <DialogHeader>
          <DialogTitle>
            {template ? "Editar plantilla de proceso" : "Nueva plantilla de proceso"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="pt-name">Nombre</Label>
              <Input
                id="pt-name"
                ref={nameRef}
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                placeholder="p. ej. Onboarding cliente"
                {...fieldAria("name", errors)}
              />
              {errors.name && (
                <p id="name-err" role="alert" className="text-xs text-destructive">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pt-cat">Categoría</Label>
              <Input
                id="pt-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ops, Ventas…"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="pt-desc">Descripción</Label>
            <RichTextField
              id="pt-desc"
              value={description}
              onChange={setDescription}
              textareaClassName="min-h-28"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Pasos</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSteps((s) => [...s, { id: uuid(), text: "", details: "" }])}
              >
                <Plus className="size-4" />
                Añadir paso
              </Button>
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={steps.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <ol className="grid gap-2">
                  {steps.map((s, i) => (
                    <SortableItem key={s.id} id={s.id}>
                      {({ setNodeRef, style, attributes, listeners, isDragging }) => (
                        <li
                          ref={setNodeRef}
                          style={style}
                          className={cn(
                            "flex items-center gap-2 rounded-md border bg-background p-2 shadow-sm",
                            isDragging && "z-10 opacity-80",
                          )}
                        >
                          <button
                            type="button"
                            className="cursor-grab touch-none text-muted-foreground/50 transition-colors hover:text-foreground active:cursor-grabbing"
                            aria-label={`Arrastrar paso ${i + 1}`}
                            {...listeners}
                            {...attributes}
                          >
                            <GripVertical className="size-4" />
                          </button>
                          <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
                            {i + 1}.
                          </span>
                          <Input
                            value={s.text}
                            onChange={(e) =>
                              setSteps((arr) =>
                                arr.map((x) =>
                                  x.id === s.id ? { ...x, text: e.target.value } : x,
                                ),
                              )
                            }
                            placeholder="Describe el paso"
                            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => setSteps((arr) => arr.filter((x) => x.id !== s.id))}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </li>
                      )}
                    </SortableItem>
                  ))}
                </ol>
              </SortableContext>
            </DndContext>
          </div>
          <AiImproveButton
            entityType="process-template"
            fields={{ name, category, description, steps }}
            onApply={(field, value) => {
              switch (field) {
                case "name":
                  setName(value as string);
                  break;
                case "category":
                  setCategory(value as string);
                  break;
                case "description":
                  setDescription(value as string);
                  break;
              }
            }}
          />
          {template ? (
            <div className="space-y-2 border-t border-border pt-4">
              <AttachmentsSection
                parent={{ type: "processTemplate", templateId: template.id }}
                attachments={liveAttachments}
              />
              <p className="text-[11px] text-muted-foreground">
                Los anexos se guardan al adjuntarlos (no hace falta pulsar Guardar). No se
                copian al instanciar un proyecto: la plantilla sigue siendo la fuente.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Guardá la plantilla primero para poder adjuntar archivos de referencia.
            </p>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} pending={saving}>
            {template ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
