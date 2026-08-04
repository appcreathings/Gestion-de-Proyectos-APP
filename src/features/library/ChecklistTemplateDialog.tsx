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
import { Checkbox } from "@/components/ui/checkbox";
import { SortableItem } from "@/components/dnd/SortableItem";
import { fieldAria, useFieldErrors } from "@/lib/formErrors";
import { cn, uuid } from "@/lib/utils";
import type { ChecklistTemplate, TemplateItem } from "@/domain/schemas";
import { newChecklistTemplate } from "@/domain/factories";
import { AttachmentsSection } from "@/components/attachments/AttachmentsSection";
import { EMPTY_ATTACHMENTS } from "@/domain/attachments/ops";
import { useDataStore } from "@/store/useDataStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  template?: ChecklistTemplate;
  onSubmit: (t: ChecklistTemplate) => void | Promise<void>;
}

export function ChecklistTemplateDialog({ open, onOpenChange, template, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();
  const templateId = template?.id;
  const liveAttachments = useDataStore((s) => {
    if (!templateId) return EMPTY_ATTACHMENTS;
    return (
      s.checklistTemplates.find((t) => t.id === templateId)?.attachments ??
      EMPTY_ATTACHMENTS
    );
  });

  useEffect(() => {
    if (open) {
      setName(template?.name ?? "");
      setCategory(template?.category ?? "");
      setItems(template?.items ?? []);
      setDraft("");
      clear();
    }
  }, [open, template?.id, clear]); // eslint-disable-line react-hooks/exhaustive-deps

  function addItem() {
    if (!draft.trim()) return;
    setItems((s) => [...s, { id: uuid(), text: draft.trim(), required: false }]);
    setDraft("");
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
    const wasNew = !template;
    const live = template
      ? useDataStore.getState().checklistTemplates.find((t) => t.id === template.id)
      : undefined;
    const base = live ?? template ?? newChecklistTemplate(name);
    setSaving(true);
    try {
      await onSubmit({
        ...base,
        name: name.trim(),
        category,
        items,
        attachments: live?.attachments ?? base.attachments ?? [],
      });
      // Tras crear, el padre deja la plantilla en edición para adjuntar archivos.
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
    setItems((s) => {
      const oldIndex = s.findIndex((x) => x.id === active.id);
      const newIndex = s.findIndex((x) => x.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return s;
      return arrayMove(s, oldIndex, newIndex);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" description="Define los ítems reutilizables de esta plantilla de checklist y su orden.">
        <DialogHeader>
          <DialogTitle>
            {template ? "Editar plantilla de checklist" : "Nueva plantilla de checklist"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="ct-name">Nombre</Label>
              <Input
                id="ct-name"
                ref={nameRef}
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                placeholder="p. ej. QA Release"
                {...fieldAria("name", errors)}
              />
              {errors.name && (
                <p id="name-err" role="alert" className="text-xs text-destructive">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ct-cat">Categoría</Label>
              <Input
                id="ct-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="QA, Legal…"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Ítems</Label>
            {items.length === 0 && (
              <p className="text-xs text-muted-foreground">Sin ítems todavía.</p>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={items.map((it) => it.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className="space-y-1.5">
                  {items.map((it) => (
                    <SortableItem key={it.id} id={it.id}>
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
                            aria-label={`Arrastrar ítem ${it.text || "sin texto"}`}
                            {...listeners}
                            {...attributes}
                          >
                            <GripVertical className="size-4" />
                          </button>
                          <Checkbox
                            checked={it.required}
                            onCheckedChange={(c) =>
                              setItems((s) =>
                                s.map((x) => (x.id === it.id ? { ...x, required: c } : x)),
                              )
                            }
                            aria-label="Requerido"
                          />
                          <Input
                            value={it.text}
                            onChange={(e) =>
                              setItems((s) =>
                                s.map((x) =>
                                  x.id === it.id ? { ...x, text: e.target.value } : x,
                                ),
                              )
                            }
                            placeholder="Texto del ítem"
                            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => setItems((s) => s.filter((x) => x.id !== it.id))}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </li>
                      )}
                    </SortableItem>
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
            <div className="flex gap-2">
              <Input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
                placeholder="Texto del ítem…  (marca la casilla para 'requerido')"
                className="h-9"
              />
              <Button size="icon" variant="secondary" className="size-9" onClick={addItem}>
                <Plus className="size-4" />
              </Button>
            </div>
          </div>
          <AiImproveButton
            entityType="checklist-template"
            fields={{ name, category, items }}
            onApply={(field, value) => {
              switch (field) {
                case "name":
                  setName(value as string);
                  break;
                case "category":
                  setCategory(value as string);
                  break;
              }
            }}
          />
          {template ? (
            <div className="space-y-2 border-t border-border pt-4">
              <AttachmentsSection
                parent={{ type: "checklistTemplate", templateId: template.id }}
                attachments={liveAttachments}
              />
              <p className="text-[11px] text-muted-foreground">
                Los anexos se guardan al adjuntarlos. No se copian al aplicar la plantilla a un área.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              Guardá la plantilla primero para poder adjuntar archivos.
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
