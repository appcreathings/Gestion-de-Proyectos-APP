import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: "Ctrl/Cmd + K", description: "Buscar global" },
  { keys: "Ctrl/Cmd + J", description: "Abrir/cerrar asistente IA" },
  { keys: "Ctrl/Cmd + ?", description: "Mostrar atajos de teclado" },
];

export function KeyboardShortcutsModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Atajos de teclado"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md rounded-2xl border border-border/70 bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <h2 className="text-lg font-semibold">Atajos de teclado</h2>
            <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </div>
          <div className="px-6 py-4">
            <dl className="space-y-3">
              {SHORTCUTS.map(({ keys, description }) => (
                <div key={keys} className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">{description}</dt>
                  <dd>
                    <kbd className="rounded border border-border/70 bg-muted px-2 py-1 text-xs font-mono">
                      {keys}
                    </kbd>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
