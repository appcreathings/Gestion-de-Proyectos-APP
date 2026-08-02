import { useEffect, useRef, useState } from "react";
import { ListChecks } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { PersonSelect } from "@/components/forms/PersonSelect";
import { DateFieldPreview } from "@/components/forms/DateFieldPreview";
import { fieldAria, useFieldErrors } from "@/lib/formErrors";
import type { ChecklistItem, Person } from "@/domain/schemas";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  item: ChecklistItem;
  people: Person[];
  hasTask: boolean;
  onSubmit: (item: ChecklistItem) => void;
  onConvertToTask: () => void;
}

export function ItemEditorDialog({
  open,
  onOpenChange,
  item,
  people,
  hasTask,
  onSubmit,
  onConvertToTask,
}: Props) {
  const [text, setText] = useState(item.text);
  const [required, setRequired] = useState(item.required);
  const [dueDate, setDueDate] = useState(item.dueDate ?? "");
  const [assigneeId, setAssigneeId] = useState(item.assigneeId ?? "");
  const [notes, setNotes] = useState(item.notes);
  const textRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();

  useEffect(() => {
    if (open) {
      setText(item.text);
      setRequired(item.required);
      setDueDate(item.dueDate ?? "");
      setAssigneeId(item.assigneeId ?? "");
      setNotes(item.notes);
      clear();
    }
  }, [open, item, clear]);

  function submit() {
    const errs = validate(
      { text },
      [{ field: "text", message: "El texto no puede estar vacío", test: (v) => v.text.trim().length > 0 }],
    );
    if (errs.length > 0) {
      textRef.current?.focus();
      return;
    }
    onSubmit({
      ...item,
      text: text.trim(),
      required,
      dueDate: dueDate || null,
      assigneeId: assigneeId || null,
      notes,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" description="Edita el texto, la fecha límite y el responsable de este ítem de checklist.">
        <DialogHeader>
          <DialogTitle>Editar ítem</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-2">
            <Label htmlFor="it-text">Texto</Label>
            <Input
              id="it-text"
              ref={textRef}
              value={text}
              autoFocus
              onChange={(e) => setText(e.target.value)}
              {...fieldAria("text", errors)}
            />
            {errors.text && (
              <p id="text-err" role="alert" className="text-xs text-destructive">
                {errors.text}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={required} onCheckedChange={setRequired} aria-label="Requerido" />
            <Label className="cursor-pointer" onClick={() => setRequired(!required)}>
              Requerido
            </Label>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="it-due">Fecha límite</Label>
              <DateFieldPreview id="it-due" value={dueDate} onChange={setDueDate} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="it-assignee">Responsable</Label>
              <PersonSelect
                id="it-assignee"
                value={assigneeId}
                onChange={setAssigneeId}
                people={people}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="it-notes">Notas</Label>
            <Textarea id="it-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div>
            <Button variant="outline" size="sm" disabled={hasTask} onClick={onConvertToTask}>
              <ListChecks className="size-4" />
              {hasTask ? "Ya tiene tarea" : "Convertir en tarea"}
            </Button>
          </div>
          <AiImproveButton
            entityType="checklist-item"
            fields={{ text, required, dueDate, assigneeId, notes }}
            onApply={(field, value) => {
              switch (field) {
                case "text":
                  setText(value as string);
                  break;
                case "notes":
                  setNotes(value as string);
                  break;
                case "dueDate":
                  setDueDate(value as string);
                  break;
                case "assigneeId":
                  setAssigneeId(value as string);
                  break;
                case "required":
                  setRequired(Boolean(value));
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
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
