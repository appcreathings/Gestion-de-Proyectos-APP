import { Select } from "@/components/ui/select";

interface Entity {
  id: string;
  name: string;
}

interface EntitySelectProps {
  id?: string;
  value: string;
  onChange: (id: string) => void;
  options: Entity[];
  placeholder?: string;
  className?: string;
  /** If true, the "none" option is omitted (for required selects). */
  required?: boolean;
  /**
   * Tamaño del `<select>` subyacente. Se expone porque `default` incluye
   * `text-base sm:text-sm` y `tailwind-merge` conserva la variante responsive
   * al pisar la tipografía por `className` (ver `ui/select.tsx`, spec 037 §E):
   * las filas compactas del detalle de tarea (spec 064) necesitan `sm`, no un
   * override de clase que reaparece en ≥ 640 px.
   */
  size?: "default" | "sm";
}

/**
 * Generic select for any list of {id, name} entities.
 * Renders a "— placeholder —" first option unless `required` is true.
 */
export function EntitySelect({
  id,
  value,
  onChange,
  options,
  placeholder = "— Ninguno —",
  className,
  required = false,
  size,
}: EntitySelectProps) {
  return (
    <Select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      size={size}
    >
      {!required && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </Select>
  );
}
