import { useState } from "react";
import { FolderInput, FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

interface ConnectFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Three-outcome dialog for connecting a folder from browser mode (spec 030 §6).
 * Built directly on `ui/dialog` (not `ConfirmDialog`, which only supports one
 * confirm action). `showDirectoryPicker` runs as the first await inside the
 * click handler, preserving the user-gesture chain (design.md §Riesgos #5).
 */
export function ConnectFolderDialog({ open, onOpenChange }: ConnectFolderDialogProps) {
  const connectFolderFromBrowser = useAppStore((s) => s.connectFolderFromBrowser);
  // Tracks which of the two actions is in flight so each button can show its
  // own progress label instead of a generic disabled state.
  const [runningAction, setRunningAction] = useState<"clean" | "keep" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pending = runningAction !== null;

  async function run(keepDemo: boolean) {
    setError(null);
    setRunningAction(keepDemo ? "keep" : "clean");
    try {
      await connectFolderFromBrowser({ keepDemo });
      // Success triggers `window.location.reload()` inside the action.
    } catch (e) {
      setRunningAction(null);
      const msg = e instanceof Error ? e.message : String(e);
      // Cancelling the native picker is not an error worth surfacing.
      if (!/abort|cancel/i.test(msg)) setError(msg);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (pending) return;
        setError(null);
        onOpenChange(o);
      }}
    >
      <DialogContent className="md:max-w-lg sm:h-auto md:h-auto lg:h-auto">
        <DialogHeader>
          <DialogTitle>Conectar carpeta</DialogTitle>
          <DialogDescription>
            Tus datos dejarán de vivir solo en este navegador y se guardarán como
            archivos .json en la carpeta que elijas. Nada sale de tu equipo.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {error && (
            <p className="mr-auto self-center font-mono text-xs text-destructive">{error}</p>
          )}
          <Button variant="outline" disabled={pending} onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="outline" disabled={pending} onClick={() => run(false)}>
            <FolderPlus className="size-4" />
            {runningAction === "clean" ? "Conectando…" : "Empezar limpio"}
          </Button>
          <Button disabled={pending} onClick={() => run(true)}>
            <FolderInput className="size-4" />
            {runningAction === "keep" ? "Guardando…" : "Llevar mis datos"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
