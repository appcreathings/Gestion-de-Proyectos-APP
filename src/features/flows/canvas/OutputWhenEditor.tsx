import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { FlowCondition, OutputWhen } from "@/domain/schemas/flow";
import { ConditionConfigFields } from "./ConditionConfigFields";
import type { VariableRow } from "./variables";

interface Props {
  when: OutputWhen | undefined;
  variables: VariableRow[];
  sample?: Record<string, unknown>[];
  previewRecordIndex?: number;
  onChange: (when: OutputWhen | undefined) => void;
}

const emptyCondition = (): FlowCondition => ({
  field: "",
  op: "==",
  value: "",
});

/**
 * Guarda opcional por acción (spec 055 / 033 §B2): "Solo ejecutar si…".
 * Reusa el editor de condiciones del trigger; ausente o lista vacía = siempre.
 */
export function OutputWhenEditor({
  when,
  variables,
  sample,
  previewRecordIndex,
  onChange,
}: Props) {
  const conditions = when?.conditions ?? [];
  const conditionMode = when?.conditionMode ?? "all";
  const enabled = conditions.length > 0;

  function setConditions(next: FlowCondition[]) {
    if (next.length === 0) {
      onChange(undefined);
      return;
    }
    onChange({
      conditions: next,
      conditionMode: when?.conditionMode,
    });
  }

  function updateAt(index: number, updates: Partial<FlowCondition>) {
    setConditions(
      conditions.map((c, i) => (i === index ? { ...c, ...updates } : c)),
    );
  }

  function removeAt(index: number) {
    setConditions(conditions.filter((_, i) => i !== index));
  }

  function addCondition() {
    setConditions([...conditions, emptyCondition()]);
  }

  function enable() {
    onChange({ conditions: [emptyCondition()], conditionMode: "all" });
  }

  function disable() {
    onChange(undefined);
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium">Solo ejecutar si…</p>
          <p className="text-xs text-muted-foreground">
            Guarda de este paso. Si no se cumple, la acción se omite y el flujo sigue con las
            demás. Las condiciones se evalúan sobre el registro ya transformado.
          </p>
        </div>
        {enabled ? (
          <Button type="button" variant="ghost" size="sm" onClick={disable}>
            Quitar
          </Button>
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={enable}>
            Añadir guarda
          </Button>
        )}
      </div>

      {enabled && (
        <div className="space-y-4">
          {conditions.length > 1 && (
            <div className="grid gap-2">
              <Label htmlFor="output-when-mode">Combinar condiciones</Label>
              <Select
                id="output-when-mode"
                value={conditionMode}
                onChange={(e) =>
                  onChange({
                    conditions,
                    conditionMode: e.target.value as "all" | "any",
                  })
                }
              >
                <option value="all">Todas deben cumplirse (Y)</option>
                <option value="any">Basta con una (O)</option>
              </Select>
            </div>
          )}

          {conditions.map((condition, index) => (
            <div
              key={index}
              className="space-y-2 rounded-md border border-border/60 bg-background p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Condición {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={`Quitar condición ${index + 1}`}
                  onClick={() => removeAt(index)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <ConditionConfigFields
                condition={condition}
                variables={variables}
                sample={sample}
                previewRecordIndex={previewRecordIndex}
                onChange={(updates) => updateAt(index, updates)}
              />
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" onClick={addCondition}>
            <Plus className="size-4" />
            Añadir condición
          </Button>
        </div>
      )}
    </div>
  );
}
