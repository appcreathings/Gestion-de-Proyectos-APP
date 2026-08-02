import { useState } from "react";
import { CheckCircle2, HardDriveDownload, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { FileSystemAdapter } from "@/storage";
import { useAppStore } from "@/store/useAppStore";
import { useDataStore } from "@/store/useDataStore";
import { ConnectFolderDialog } from "./ConnectFolderDialog";

/**
 * Sidebar footer that replaces the old read-only indicator (spec 030 §6).
 * Shows "sincronizado" in filesystem mode, or "sin sincronizar" + a CTA in
 * browser mode: "Conectar carpeta" where the File System Access API exists,
 * "Exportar copia" (download) on Firefox/Safari.
 * Also shows write status (spec 040): synced/writing/error with retry.
 */
export function WorkspaceStatus() {
  const mode = useAppStore((s) => s.mode);
  const adapter = useAppStore((s) => s.adapter);
  const connectFolderFromBrowser = useAppStore((s) => s.connectFolderFromBrowser);
  const productCount = useDataStore((s) => s.products.length);
  const projectCount = useDataStore((s) => s.projects.length);
  const writeStatus = useAppStore((s) => s.writeStatus);
  const lastWriteError = useAppStore((s) => s.lastWriteError);
  const retryLastFailedOperation = useAppStore((s) => s.retryLastFailedOperation);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  // `mode` is resolved by bootstrap(); this component only renders once the
  // gate has passed (connection === "ready"), so filesystem === synced.
  if (mode === "filesystem") {
    if (writeStatus === "error") {
      return (
        <div className="border-t border-border/70 px-5 py-3 font-mono text-[10px] text-destructive">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="font-medium">Error de escritura</div>
              <div className="mt-0.5 truncate" title={lastWriteError ?? undefined}>
                {lastWriteError ?? "Error desconocido"}
              </div>
              <button
                onClick={async () => {
                  setRetrying(true);
                  try {
                    await retryLastFailedOperation();
                  } finally {
                    setRetrying(false);
                  }
                }}
                disabled={retrying}
                className="mt-1.5 flex items-center gap-1 text-xs font-medium hover:underline disabled:opacity-50"
              >
                {retrying ? (
                  <>
                    <Loader2 className="size-3 animate-spin" />
                    Reintentando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-3" />
                    Reintentar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (writeStatus === "writing") {
      return (
        <div className="border-t border-border/70 px-5 py-3 font-mono text-[10px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <Loader2 className="size-3.5 animate-spin" />
            escribiendo...
          </div>
        </div>
      );
    }

    return (
      <div className="border-t border-border/70 px-5 py-3 font-mono text-[10px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-3.5 text-success" />
          sincronizado · carpeta local
        </div>
      </div>
    );
  }

  const empty = productCount === 0 && projectCount === 0;
  const fsSupported = FileSystemAdapter.isSupported();

  async function connectOrOpen() {
    if (empty) {
      // Nothing to carry — skip the dialog and connect clean directly.
      setError(null);
      setBusy(true);
      try {
        await connectFolderFromBrowser({ keepDemo: false });
      } catch (e) {
        setBusy(false);
        const msg = e instanceof Error ? e.message : String(e);
        // Cancelling the native picker is not an error worth surfacing.
        if (!/abort|cancel/i.test(msg)) setError(msg);
      }
      return;
    }
    setDialogOpen(true);
  }

  async function exportCopy() {
    const blob = await adapter.exportAll();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hito-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="border-t border-border/70 px-5 py-3">
      <div className="flex items-center gap-2 font-mono text-[10px] text-warning">
        <HardDriveDownload className="size-3.5" />
        sin sincronizar · en este navegador
      </div>
      {fsSupported ? (
        <>
          <button
            onClick={connectOrOpen}
            disabled={busy}
            className="mt-1.5 text-xs underline hover:no-underline disabled:opacity-50"
          >
            Conectar carpeta
          </button>
          {error && <p className="mt-1 font-mono text-[10px] text-destructive">{error}</p>}
        </>
      ) : (
        <div className="mt-1.5 space-y-1">
          <button
            onClick={exportCopy}
            className="block text-xs underline hover:no-underline"
          >
            Exportar copia
          </button>
          <p className="text-[10px] text-muted-foreground">
            Tu navegador no permite carpeta local.
          </p>
        </div>
      )}
      <ConnectFolderDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}