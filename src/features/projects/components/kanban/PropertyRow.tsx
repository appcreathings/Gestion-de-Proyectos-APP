import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PropertyRowProps {
  label: string;
  /** Id del control que va dentro — mantiene la etiqueta clicable. */
  htmlFor?: string;
  /** Ocupa las dos columnas del grid (fecha límite, etiquetas). */
  wide?: boolean;
  className?: string;
  children: ReactNode;
}

/** Fila etiqueta + control del detalle de tarea (spec 064 D1).
 *
 * Sustituye al patrón "etiqueta de 12 px sobre control de 40 px" que ocupaba
 * 62 px por propiedad. Aquí la etiqueta vive en una columna fija de 78 px y el
 * control comparte línea: 32 px.
 *
 * El componente no tiene estado ni decide qué control va dentro — es solo
 * layout. Esa es justamente la razón de que sea seguro aplicarlo a las ocho
 * propiedades sin tocar sus manejadores. */
export function PropertyRow({
  label,
  htmlFor,
  wide,
  className,
  children,
}: PropertyRowProps) {
  return (
    <div
      className={cn(
        "flex min-h-8 items-center gap-2.5 rounded-md px-2 transition-colors hover:bg-muted/60",
        wide && "sm:col-span-2",
        className,
      )}
    >
      <Label
        htmlFor={htmlFor}
        className="w-[78px] shrink-0 text-xs font-normal text-muted-foreground"
      >
        {label}
      </Label>
      {/* `Select` envuelve su `<select>` en un `div.relative` sin ancho: como
          item flex se encogería a su contenido y el `w-full` de dentro se
          mediría contra esa caja colapsada. Estirar el último hijo lo arregla
          para todas las filas — incluidas las que llevan un punto de color
          delante del control. */}
      <div className="flex min-w-0 flex-1 items-center [&>*:last-child]:min-w-0 [&>*:last-child]:flex-1">
        {children}
      </div>
    </div>
  );
}

/** Clases del control "sin caja hasta que se usa" (spec 064 §3).
 *
 * El control sigue montado y enfocable siempre: solo cambia su piel. Así se
 * conservan el `persist()` por campo, el Tab y el `htmlFor` de cada etiqueta,
 * que es lo que un modo de edición en línea habría puesto en riesgo.
 *
 * Deliberadamente **sin padding horizontal**: `Select size="sm"` reserva
 * `pr-7` para su flecha y `DateFieldPreview compact` reserva `pr-8` para el
 * botón de calendario. Un `px-*` aquí llegaría después en la cadena y
 * `tailwind-merge` lo dejaría ganar, metiendo el texto debajo del icono.
 * Los campos que sí necesitan apretar el margen izquierdo usan `QUIET_INPUT`. */
export const QUIET_CONTROL =
  "h-8 border-transparent bg-transparent text-[13px] sm:text-[13px] " +
  "hover:border-input focus-visible:border-input focus-visible:bg-background " +
  // El desplegable nativo de un `<select>` hereda el `background-color`
  // *calculado* del control. Con `bg-transparent` el navegador pinta el popup
  // sin fondo propio y en tema oscuro salían opciones ilegibles (texto claro
  // sobre blanco). Las opciones necesitan color explícito; el control no.
  "[&>option]:bg-popover [&>option]:text-popover-foreground";

/** `QUIET_CONTROL` para controles sin icono a la derecha (inputs de texto y
 * número): ahí sí se puede recortar el padding a ambos lados. */
export const QUIET_INPUT = `${QUIET_CONTROL} px-1.5`;

/** `QUIET_CONTROL` para `DateFieldPreview compact`: recorta solo la izquierda,
 * porque la derecha la ocupa el botón del calendario. */
export const QUIET_DATE = `${QUIET_CONTROL} pl-1.5`;
