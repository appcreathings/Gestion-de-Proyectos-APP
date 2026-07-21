import { useState } from "react";
import { X } from "lucide-react";
import { FileSystemAdapter } from "@/storage";
import { dismissDemoBanner, isDemoBannerDismissed } from "@/storage/mode";
import { useAppStore } from "@/store/useAppStore";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ConnectFolderDialog } from "./ConnectFolderDialog";

/**
 * Dismissible banner shown over the outlet while the user is browsing the demo
 * (spec 030 §7). Non-modal: communicates "sin sincronizar" and offers the two
 * exits (conectar carpeta / empezar de cero).
 */
export function DemoBanner() {
  const isDemo = useAppStore((s) => s.isDemo);
  const clearWorkspace = useAppStore((s) => s.clearWorkspace);
  const [dismissed, setDismissed] = useState(() => isDemoBannerDismissed());
  const [connectOpen, setConnectOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  if (!isDemo || dismissed) return null;
  const fsSupported = FileSystemAdapter.isSupported();

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-xs">
        <span className="min-w-[200px] flex-1">
          Estás explorando datos de ejemplo — los cambios viven solo en este navegador.
        </span>
        {fsSupported && (
          <button
            onClick={() => setConnectOpen(true)}
            className="font-medium underline hover:no-underline"
          >
            Conectar carpeta
          </button>
        )}
        <button onClick={() => setClearOpen(true)} className="underline hover:no-underline">
          Empezar de cero
        </button>
        <button
          onClick={() => {
            dismissDemoBanner();
            setDismissed(true);
          }}
          aria-label="Cerrar aviso"
          className="rounded p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <ConnectFolderDialog open={connectOpen} onOpenChange={setConnectOpen} />
      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Empezar de cero"
        description="Se borrarán todos los datos de ejemplo (y cualquier cambio que hayas hecho) de este navegador. No se puede deshacer."
        confirmLabel="Vaciar y empezar de cero"
        confirmVariant="destructive"
        onConfirm={() => void clearWorkspace()}
      />
    </>
  );
}
