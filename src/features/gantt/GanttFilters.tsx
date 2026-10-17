import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { GanttScale } from "./ganttQuery";

/** Barra de filtros del Gantt (spec 077 D14b, D17, D20). Presentacional: el
 * estado vive en la URL y lo maneja `GanttPage`. */

export interface GanttOption {
  id: string;
  label: string;
}

const SCALE_LABEL: Record<GanttScale, string> = {
  month: "Mes",
  quarter: "Trimestre",
  year: "Año",
};
const SCALES: GanttScale[] = ["month", "quarter", "year"];

export function GanttFilters({
  productOptions,
  openProjectOptions,
  doneProjectOptions,
  productChips,
  projectChips,
  hasFilters,
  scale,
  rangeLabel,
  onAddProduct,
  onRemoveProduct,
  onAddProject,
  onRemoveProject,
  onClear,
  onShift,
  onToday,
  onScale,
}: {
  productOptions: GanttOption[];
  openProjectOptions: GanttOption[];
  doneProjectOptions: GanttOption[];
  productChips: GanttOption[];
  projectChips: GanttOption[];
  hasFilters: boolean;
  scale: GanttScale;
  rangeLabel: string;
  onAddProduct: (id: string) => void;
  onRemoveProduct: (id: string) => void;
  onAddProject: (id: string) => void;
  onRemoveProject: (id: string) => void;
  onClear: () => void;
  onShift: (delta: number) => void;
  onToday: () => void;
  onScale: (scale: GanttScale) => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          size="sm"
          className="w-[10rem]"
          value=""
          onChange={(e) => {
            if (e.target.value) onAddProduct(e.target.value);
          }}
          aria-label="Agregar producto"
        >
          <option value="">Producto</option>
          {productOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </Select>

        {/* D14b: los proyectos cerrados van en su propio grupo. */}
        <Select
          size="sm"
          className="w-[10rem]"
          value=""
          onChange={(e) => {
            if (e.target.value) onAddProject(e.target.value);
          }}
          aria-label="Agregar proyecto"
        >
          <option value="">+ Proyecto</option>
          {openProjectOptions.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
          {doneProjectOptions.length > 0 && (
            <optgroup label="Cerrados">
              {doneProjectOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </optgroup>
          )}
        </Select>

        <Button type="button" variant="ghost" size="sm" onClick={onClear} disabled={!hasFilters}>
          Limpiar filtros
        </Button>

        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => onShift(-1)}
              aria-label="Período anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onToday}>
              Hoy
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-9"
              onClick={() => onShift(1)}
              aria-label="Período siguiente"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
          <div
            className="flex rounded-md border border-border/70"
            role="group"
            aria-label="Escala de tiempo"
          >
            {SCALES.map((s, i) => (
              <Button
                key={s}
                type="button"
                variant={scale === s ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  i === 0 && "rounded-r-none",
                  i === 1 && "rounded-none border-l",
                  i === 2 && "rounded-l-none border-l",
                )}
                aria-pressed={scale === s}
                onClick={() => onScale(s)}
              >
                {SCALE_LABEL[s]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium capitalize">{rangeLabel}</span>
        {productChips.map((c) => (
          <Chip key={c.id} name={c.label} onRemove={() => onRemoveProduct(c.id)} />
        ))}
        {projectChips.map((c) => (
          <Chip key={c.id} name={c.label} onRemove={() => onRemoveProject(c.id)} />
        ))}
      </div>
    </div>
  );
}

/** Mismo patrón que el chip del Tablero (075); copia local, no import. */
function Chip({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1">
      {name}
      <button
        type="button"
        aria-label={`Quitar ${name}`}
        onClick={onRemove}
        className="flex size-4 items-center justify-center rounded-full hover:bg-foreground/10"
      >
        <X className="size-3" />
      </button>
    </Badge>
  );
}
