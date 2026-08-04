import type { FlowNodeKind } from "@/flows/graph";
import type { DialogSize } from "@/components/ui/dialog";

/**
 * Tamaño del diálogo de configuración de nodo (spec 041+).
 * Usa `xl` (acotado a ~88vh / max-w-5xl) para no tapar el canvas; la
 * condición va en `md` porque el formulario es corto.
 */
export function nodeConfigDialogSize(kind: FlowNodeKind): DialogSize {
  switch (kind) {
    case "condition":
      return "md";
    case "trigger":
    case "transform":
    case "action":
      return "xl";
  }
}
