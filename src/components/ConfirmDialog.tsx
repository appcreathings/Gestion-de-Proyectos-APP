import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  /** Estilo del botón de confirmar. `"destructive"` (default) para acciones
   * irreversibles tipo eliminar; `"default"` para acciones reales pero no
   * destructivas (ej. "Ejecutar ahora" un flujo). */
  confirmVariant?: "destructive" | "default";
  /** Acción a confirmar. Puede ser síncrona o async; el diálogo no cierra hasta
   *  que resuelve, y si rechaza se queda abierto (el error lo anuncia quien lo
   *  provoca, vía toast — design 040 §F2, CA-07.2). */
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Eliminar",
  confirmVariant = "destructive",
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch {
      // El error ya se anuncia por el toast de quien implementa onConfirm;
      // ConfirmDialog no duplica el aviso, solo deja de cerrar en falso.
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancelar
          </Button>
          <Button variant={confirmVariant} pending={pending} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
