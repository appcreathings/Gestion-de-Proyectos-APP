import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Github, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { Project } from "@/domain/schemas";
import {
  pullProjectFromRepo,
  pushProjectToRepo,
  SYNC_MODE_HINTS,
  SYNC_MODE_LABELS,
} from "@/integrations/github-repo-sync";
import {
  getGitHubConnections,
  getGitHubLinks,
  saveGitHubLink,
  type GitHubConnection,
  type GitHubLink,
} from "@/integrations/github-sync";
import type { GitHubSyncMode } from "@/storage/integration-db";
import { useDataStore } from "@/store/useDataStore";
import { useToastStore } from "@/store/useToastStore";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/paths";

type Props = {
  project: Project;
};

/**
 * Controles de sync GitHub en la ficha del proyecto.
 * Solo aparece si hay un vínculo activo a un repositorio.
 */
export function GitHubProjectSyncButton({ project }: Props) {
  const toast = useToastStore((s) => s.toast);
  const saveProject = useDataStore((s) => s.saveProject);
  const [link, setLink] = useState<GitHubLink | null>(null);
  const [connection, setConnection] = useState<GitHubConnection | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState<{
    remote: Project;
    localUpdatedAt: string;
    remoteUpdatedAt: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const links = await getGitHubLinks(project.id);
      const active = links.find((l) => l.status !== "disconnected") ?? null;
      if (cancelled) return;
      setLink(active);
      if (active) {
        const conns = await getGitHubConnections();
        setConnection(conns.find((c) => c.id === active.connectionId) ?? null);
      } else {
        setConnection(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [project.id, project.updatedAt]);

  if (!link || !connection) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
        <p className="font-medium flex items-center gap-2">
          <Github className="size-4" /> GitHub
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Este proyecto no está vinculado a un repositorio.{" "}
          <Link className="underline" to={`${ROUTES.integrations}?tab=github`}>
            Vincular en Integraciones
          </Link>
        </p>
      </div>
    );
  }

  async function push() {
    if (!link || !connection) return;
    setBusy(true);
    setError(null);
    try {
      const result = await pushProjectToRepo({
        backendConnectionId: connection.backendConnectionId,
        link,
        project,
        syncMode: link.syncMode,
      });
      if (!result.ok) {
        setError(result.message);
        toast.error("No se pudo enviar al repo.");
        return;
      }
      setLink(result.link);
      toast.success(`Enviado a ${link.owner}/${link.repository}`);
    } finally {
      setBusy(false);
    }
  }

  async function pull(resolve?: "remote" | "local") {
    if (!link || !connection) return;
    setBusy(true);
    setError(null);
    setConflict(null);
    try {
      const result = await pullProjectFromRepo({
        backendConnectionId: connection.backendConnectionId,
        link,
        localProject: project,
        resolve,
      });
      if (!result.ok && "kind" in result && result.kind === "conflict") {
        setConflict({
          remote: result.remoteProject,
          localUpdatedAt: result.localUpdatedAt,
          remoteUpdatedAt: result.remoteUpdatedAt,
        });
        setError(result.message);
        return;
      }
      if (!result.ok) {
        setError(result.message);
        toast.error("No se pudo recibir del repo.");
        return;
      }
      if (result.changed) await saveProject(result.project);
      setLink(result.link);
      toast.success(result.changed ? "Proyecto actualizado desde el repo." : "Sin cambios.");
    } finally {
      setBusy(false);
    }
  }

  async function setMode(mode: GitHubSyncMode) {
    if (!link) return;
    const next = { ...link, syncMode: mode, updatedAt: new Date().toISOString() };
    await saveGitHubLink(next);
    setLink(next);
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium flex items-center gap-2">
            <Github className="size-4" /> Repositorio
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {link.owner}/{link.repository}
            {link.lastSyncAt
              ? ` · última sync ${new Date(link.lastSyncAt).toLocaleString()}`
              : " · aún no sincronizado"}
          </p>
        </div>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
          {SYNC_MODE_LABELS[link.syncMode ?? "medium"]}
        </span>
      </div>

      <div className="space-y-1">
        <Label htmlFor="sync-mode-detail" className="text-xs">
          Nivel de sync
        </Label>
        <Select
          id="sync-mode-detail"
          size="sm"
          value={link.syncMode ?? "medium"}
          disabled={busy}
          onChange={(e) => void setMode(e.target.value as GitHubSyncMode)}
        >
          {(Object.keys(SYNC_MODE_LABELS) as GitHubSyncMode[]).map((m) => (
            <option key={m} value={m}>
              {SYNC_MODE_LABELS[m]} — {SYNC_MODE_HINTS[m]}
            </option>
          ))}
        </Select>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {conflict && (
        <div className="space-y-2 rounded-md border border-warning/40 bg-warning/10 p-2 text-xs">
          <p className="font-medium">Conflicto de sincronización</p>
          <p className="text-muted-foreground">
            Local: {new Date(conflict.localUpdatedAt).toLocaleString()} · Repo:{" "}
            {new Date(conflict.remoteUpdatedAt).toLocaleString()}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" disabled={busy} onClick={() => void pull("local")}>
              Mantener local
            </Button>
            <Button size="sm" disabled={busy} onClick={() => void pull("remote")}>
              Usar versión del repo
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={busy} onClick={() => void push()}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowUpFromLine className="size-4" />}
          Enviar al repo
        </Button>
        <Button size="sm" variant="outline" disabled={busy} onClick={() => void pull()}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : <ArrowDownToLine className="size-4" />}
          Recibir del repo
        </Button>
        <Button size="sm" variant="secondary" disabled={busy} onClick={() => void push()}>
          <RefreshCw className="size-4" />
          Sync
        </Button>
      </div>
    </div>
  );
}
