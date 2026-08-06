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
import { PersonSelect } from "@/components/forms/PersonSelect";
import { RichTextField } from "@/components/forms/RichTextField";
import { SortableItem } from "@/components/dnd/SortableItem";
import { fieldAria, useFieldErrors } from "@/lib/formErrors";
import { cn, uuid } from "@/lib/utils";
import type { Person, Process, ProcessStep } from "@/domain/schemas";
import { newProcess } from "@/domain/factories";
import { AttachmentsSection } from "@/components/attachments/AttachmentsSection";
import { useDataStore } from "@/store/useDataStore";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  process?: Process;
  /** Requerido para anexos al editar un proceso existente (spec 042). */
  projectId?: string;
  people?: Person[];
  onSubmit: (p: Process) => void | Promise<void>;
}

export function ProcessEditorDialog({
  open,
  onOpenChange,
  process,
  projectId,
  people = [],
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();

  useEffect(() => {
    if (open) {
      setName(process?.name ?? "");
      setDescription(process?.description ?? "");
      setSteps(process?.steps ?? []);
      setOwnerId(process?.ownerId ?? "");
      clear();
    }
  }, [open, process, clear]);

  function addStep() {
    setSteps((s) => [...s, { id: uuid(), text: "", details: "" }]);
  }
  function setStep(id: string, text: string) {
    setSteps((s) => s.map((x) => (x.id === id ? { ...x, text } : x)));
  }
  function delStep(id: string) {
    setSteps((s) => s.filter((x) => x.id !== id));
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

  async function submit() {
    const errs = validate(
      { name },
      [{ field: "name", message: "El nombre no puede estar vacío", test: (v) => v.name.trim().length > 0 }],
    );
    if (errs.length > 0) {
      nameRef.current?.focus();
      return;
    }
    // Preservar anexos del store al guardar el form del proceso.
    let base = process ?? newProcess(name);
    if (process && projectId) {
      const proj = useDataStore.getState().projects.find((p) => p.id === projectId);
      for (const a of proj?.areas ?? []) {
        const live = a.processes.find((pr) => pr.id === process.id);
        if (live) {
          base = live;
          break;
        }
      }
    }
    setSaving(true);
    try {
      await onSubmit({
        ...base,
        name: name.trim(),
        description,
        steps: steps.filter((s) => s.text.trim()),
        version: process ? base.version + 1 : 1,
        ownerId: ownerId || null,
        attachments: base.attachments ?? [],
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
      <DialogContent size="lg" description="Documenta el proceso (SOP), su responsable y sus pasos.">
        <DialogHeader>
          <DialogTitle>{process ? "Editar proceso" : "Nuevo proceso"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-2">
            <Label htmlFor="proc-name">Nombre del proceso (SOP)</Label>
            <Input
              id="proc-name"
              ref={nameRef}
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!description && steps.length === 0) submit();
                }
              }}
              placeholder="p. ej. Despliegue a producción"
              {...fieldAria("name", errors)}
            />
            {errors.name && (
              <p id="name-err" role="alert" className="text-xs text-destructive">
                {errors.name}
              </p>
            )}
          </div>

          {people.length > 0 && (
          <div className="grid gap-2">
              <Label htmlFor="proc-owner">Responsable del proceso</Label>
              <PersonSelect
                id="proc-owner"
                value={ownerId}
                onChange={setOwnerId}
                people={people}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="proc-desc">Descripción</Label>
            <RichTextField
              id="proc-desc"
              value={description}
              onChange={setDescription}
              textareaClassName="min-h-28"
              placeholder="Documenta el proceso. Admite **negrita**, listas, `código`…"
            />
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label>Pasos</Label>
              <Button variant="ghost" size="sm" onClick={addStep}>
                <Plus className="size-4" />
                Añadir paso
              </Button>
            </div>
            {steps.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Sin pasos. Añade los pasos secuenciales del proceso.
              </p>
            )}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={steps.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <ol className="grid gap-3">
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
                            <GripVertical className="size-4 shrink-0" />
                          </button>
                          <span className="w-5 shrink-0 text-xs tabular-nums text-muted-foreground">
                            {i + 1}.
                          </span>
                          <Input
                            value={s.text}
                            onChange={(e) => setStep(s.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                // Add next step automatically
                                addStep();
                              }
                            }}
                            placeholder="Describe el paso"
                            className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={() => delStep(s.id)}
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
            entityType="process"
            fields={{ name, description, steps, ownerId }}
            onApply={(field, value) => {
              switch (field) {
                case "name":
                  setName(value as string);
                  break;
                case "description":
                  setDescription(value as string);
                  break;
                case "ownerId":
                  setOwnerId(value as string);
                  break;
              }
            }}
          />
          {process && projectId && (
            <AttachmentsSection
              parent={{ type: "process", projectId, processId: process.id }}
              attachments={process.attachments ?? []}
            />
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} pending={saving}>
            {process ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
