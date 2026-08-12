import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  Github,
  ExternalLink,
  Link2,
  Loader2,
  Plus,
  Trash2,
  Unlink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Panel } from "@/components/ui/Panel";
import { Select } from "@/components/ui/select";
import { newProject } from "@/domain/factories";
import {
  createGitHubRepository,
  getGitHubProjects,
  getGitHubRepositories,
  isGitHubBffConfigured,
  revokeGitHubConnection,
  type GitHubProjectSummary,
} from "@/integrations/github-bff";
import {
  pullProjectMetaFromGitHub,
  pushProjectMetaToGitHub,
} from "@/integrations/github-project-sync";
import {
  buildGitHubLink,
  deleteGitHubConnection,
  deleteGitHubLink,
  getGitHubConnections,
  getGitHubLinks,
  saveGitHubLink,
  type GitHubConnection,
  type GitHubLink,
} from "@/integrations/github-sync";
import type { GitHubRepository } from "@/integrations/github-types";
import { ROUTES } from "@/routes/paths";
import { useDataStore } from "@/store/useDataStore";
import { useToastStore } from "@/store/useToastStore";

type WizardMode = "idle" | "link";
type RepoMode = "existing" | "create";
type LocalMode = "new" | "existing" | "multi";

function slugifyRepoName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9_.-]/g, "")
    .replace(/\.+/g, ".")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

export function GitHubAppPanel() {
  const navigate = useNavigate();
  const toast = useToastStore((s) => s.toast);
  const projects = useDataStore((s) => s.projects);
  const products = useDataStore((s) => s.products);
  const createProject = useDataStore((s) => s.createProject);
  const saveProject = useDataStore((s) => s.saveProject);

  const [connections, setConnections] = useState<GitHubConnection[]>([]);
  const [links, setLinks] = useState<GitHubLink[]>([]);
  const [configured, setConfigured] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<WizardMode>("idle");
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [ghProjects, setGhProjects] = useState<GitHubProjectSummary[]>([]);
  const [repoMode, setRepoMode] = useState<RepoMode>("existing");
  const [repoKey, setRepoKey] = useState("");
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDescription, setNewRepoDescription] = useState("");
  const [newRepoPrivate, setNewRepoPrivate] = useState(true);
  const [ghProjectId, setGhProjectId] = useState("");
  const [localMode, setLocalMode] = useState<LocalMode>("new");
  const [existingProjectId, setExistingProjectId] = useState("");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [productId, setProductId] = useState("");
  const [projectsWarning, setProjectsWarning] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const [c, l] = await Promise.all([getGitHubConnections(), getGitHubLinks()]);
    setConnections(c);
    setLinks(l);
  }, []);

  useEffect(() => {
    setConfigured(isGitHubBffConfigured());
    void refresh().catch(() => {
      setConnections([]);
      setLinks([]);
    });
  }, [refresh]);

  const selectedRepo = useMemo(
    () => repos.find((r) => `${r.owner}/${r.name}` === repoKey) ?? null,
    [repos, repoKey],
  );

  const selectedGhProject = useMemo(
    () => ghProjects.find((p) => p.id === ghProjectId) ?? null,
    [ghProjects, ghProjectId],
  );

  const activeConnection = useMemo(
    () => connections.find((c) => c.id === activeConnectionId) ?? connections[0] ?? null,
    [connections, activeConnectionId],
  );

  const projectNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) map.set(p.id, p.name);
    return map;
  }, [projects]);

  const allSelected =
    projects.length > 0 && selectedProjectIds.length === projects.length;

  async function loadRepos(connection: GitHubConnection): Promise<GitHubRepository[]> {
    const result = await getGitHubRepositories(connection.backendConnectionId);
    if (!result.ok) {
      setError(result.message);
      setRepos([]);
      return [];
    }
    const sorted = [...result.data].sort((a, b) => Number(b.private) - Number(a.private));
    setRepos(sorted);
    return sorted;
  }

  async function loadProjectsForOwner(backendConnectionId: string, owner: string) {
    const result = await getGitHubProjects(backendConnectionId, owner);
    if (!result.ok) {
      setGhProjects([]);
      setProjectsWarning(
        result.message ||
          "No se pudieron listar GitHub Projects. ¿La App tiene permiso Projects (read/write)?",
      );
      return;
    }
    setProjectsWarning(null);
    setGhProjects(result.data);
  }

  async function startLinkWizard(connection: GitHubConnection) {
    setError(null);
    setBusy(true);
    setActiveConnectionId(connection.id);
    setMode("link");
    setRepoMode("existing");
    setRepoKey("");
    setNewRepoName("");
    setNewRepoDescription("");
    setNewRepoPrivate(true);
    setGhProjectId("");
    setLocalMode(projects.length > 1 ? "multi" : "new");
    setExistingProjectId(projects[0]?.id ?? "");
    setSelectedProjectIds(projects.map((p) => p.id));
    setNewProjectName("");
    setNewProjectDescription("");
    setProductId(products[0]?.id ?? "");
    setProjectsWarning(null);
    try {
      const sorted = await loadRepos(connection);
      if (sorted[0]) {
        const first = sorted[0];
        setRepoKey(`${first.owner}/${first.name}`);
        setNewProjectName(first.name);
        setNewProjectDescription(first.description?.trim() || "");
        setNewRepoName(slugifyRepoName(first.name) || "hito-project");
        await loadProjectsForOwner(connection.backendConnectionId, first.owner);
      } else {
        setRepoMode("create");
        setNewRepoName("hito-project");
      }
    } finally {
      setBusy(false);
    }
  }

  async function onRepoChange(value: string) {
    setRepoKey(value);
    const repo = repos.find((r) => `${r.owner}/${r.name}` === value);
    if (!repo || !activeConnection) return;
    setNewProjectName(repo.name);
    setNewProjectDescription(repo.description?.trim() || "");
    setGhProjectId("");
    setBusy(true);
    try {
      await loadProjectsForOwner(activeConnection.backendConnectionId, repo.owner);
    } finally {
      setBusy(false);
    }
  }

  async function createRepo(): Promise<GitHubRepository | null> {
    if (!activeConnection) return null;
    const name = slugifyRepoName(newRepoName);
    if (!name) {
      setError("Escribe un nombre válido para el repositorio.");
      return null;
    }
    const result = await createGitHubRepository(activeConnection.backendConnectionId, {
      name,
      description: newRepoDescription.trim() || undefined,
      private: newRepoPrivate,
      autoInit: true,
      owner: activeConnection.githubLogin,
    });
    if (!result.ok) {
      setError(result.message);
      return null;
    }
    const sorted = await loadRepos(activeConnection);
    const created =
      sorted.find((r) => r.id === result.data.id) ??
      sorted.find((r) => r.fullName === result.data.fullName) ??
      result.data;
    setRepos((prev) => {
      if (prev.some((r) => r.id === created.id)) return prev;
      return [created, ...prev];
    });
    setRepoKey(`${created.owner}/${created.name}`);
    setRepoMode("existing");
    setNewProjectName(created.name);
    setNewProjectDescription(created.description?.trim() || "");
    await loadProjectsForOwner(activeConnection.backendConnectionId, created.owner);
    toast.success(
      `Repositorio ${created.private ? "privado" : "público"} creado: ${created.fullName}`,
    );
    return created;
  }

  async function ensureRepo(): Promise<GitHubRepository | null> {
    if (repoMode === "create") {
      return createRepo();
    }
    return selectedRepo;
  }

  /**
   * Solo guarda el vínculo local proyecto Hito ↔ repositorio GitHub.
   * No llama a createProjectV2 (las Apps no pueden crear Projects en cuentas user).
   * Si hay un Project ya existente elegido, solo se adjunta su id al vínculo.
   */
  async function linkOneProject(
    connection: GitHubConnection,
    repo: GitHubRepository,
    project: { id: string; name: string; description: string },
    opts: {
      projectNodeId?: string;
      projectNumber?: number;
      remoteTitle?: string | null;
      remoteDesc?: string | null;
    },
  ): Promise<{ ok: true }> {
    const baseLink = buildGitHubLink({
      projectId: project.id,
      connectionId: connection.id,
      owner: repo.owner,
      repository: repo.name,
      repositoryId: repo.id,
      projectNodeId: opts.projectNodeId,
      projectNumber: opts.projectNumber,
      remoteProjectTitle: opts.remoteTitle ?? project.name,
      remoteProjectDescription: opts.remoteDesc ?? project.description,
      remoteRepositoryDescription: repo.description ?? null,
    });
    await saveGitHubLink(baseLink);
    return { ok: true };
  }

  async function saveLink() {
    if (!activeConnection) {
      setError("No hay conexión de GitHub activa.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const repo = await ensureRepo();
      if (!repo) {
        if (repoMode !== "create") setError("Elige o crea un repositorio de GitHub.");
        return;
      }

      // --- Varios proyectos existentes ---
      if (localMode === "multi") {
        if (selectedProjectIds.length === 0) {
          setError("Selecciona al menos un proyecto de Hito (o «Seleccionar todos»).");
          return;
        }
        const chosen = projects.filter((p) => selectedProjectIds.includes(p.id));
        let linked = 0;
        for (const project of chosen) {
          const useShared = Boolean(selectedGhProject);
          await linkOneProject(activeConnection, repo, project, {
            projectNodeId: useShared ? selectedGhProject?.id : undefined,
            projectNumber: useShared ? selectedGhProject?.number : undefined,
            remoteTitle: useShared ? selectedGhProject?.title : null,
            remoteDesc: useShared ? selectedGhProject?.shortDescription : null,
          });
          linked += 1;
        }
        await refresh();
        setMode("idle");
        setError(null);
        toast.success(
          `${linked} proyecto${linked === 1 ? "" : "s"} vinculado${linked === 1 ? "" : "s"} a ${repo.fullName}`,
        );
        return;
      }

      // --- Uno: nuevo o existente ---
      let projectId = existingProjectId;
      let project = projects.find((p) => p.id === projectId) ?? null;

      if (localMode === "new") {
        const name = newProjectName.trim() || repo.name;
        if (!name) {
          setError("Escribe un nombre para el proyecto nuevo.");
          return;
        }
        const created = newProject(name, productId || null);
        created.description = newProjectDescription.trim();
        await createProject(created);
        projectId = created.id;
        project = created;
      } else {
        if (!project) {
          setError("Elige un proyecto de Hito existente.");
          return;
        }
        const next = { ...project };
        if (!next.description.trim() && newProjectDescription.trim()) {
          next.description = newProjectDescription.trim();
          next.updatedAt = new Date().toISOString();
          await saveProject(next);
          project = next;
        }
      }

      if (!project || !projectId) {
        setError("No hay proyecto local para vincular.");
        return;
      }

      await linkOneProject(activeConnection, repo, project, {
        projectNodeId: selectedGhProject?.id,
        projectNumber: selectedGhProject?.number,
        remoteTitle: selectedGhProject?.title ?? null,
        remoteDesc: selectedGhProject?.shortDescription ?? null,
      });

      await refresh();
      setMode("idle");
      setError(null);
      toast.success(
        `Proyecto vinculado${repo.private ? " (repo privado)" : ""}: ${project.name} ↔ ${repo.fullName}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el vínculo.");
    } finally {
      setBusy(false);
    }
  }

  async function handlePush(link: GitHubLink) {
    const connection = connections.find((c) => c.id === link.connectionId);
    const project = projects.find((p) => p.id === link.projectId);
    if (!connection || !project) {
      setError("Falta la conexión o el proyecto local.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      // Solo actualiza un Project ya existente; no crea uno nuevo (allowCreateProject: false).
      const result = await pushProjectMetaToGitHub({
        backendConnectionId: connection.backendConnectionId,
        link,
        local: { name: project.name, description: project.description },
        allowCreateProject: false,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      await refresh();
      if (link.projectNodeId) {
        toast.success(`Enviado a GitHub Project: «${project.name}».`);
      } else {
        toast.success(
          `Metadatos guardados en el vínculo local de «${project.name}» (sin GitHub Project).`,
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function handlePull(link: GitHubLink) {
    const connection = connections.find((c) => c.id === link.connectionId);
    const project = projects.find((p) => p.id === link.projectId);
    if (!connection || !project) {
      setError("Falta la conexión o el proyecto local.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await pullProjectMetaFromGitHub({
        backendConnectionId: connection.backendConnectionId,
        link,
        project,
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      if (result.changed) await saveProject(result.project);
      await refresh();
      toast.success(
        result.changed
          ? `Recibido de GitHub: se actualizó «${result.project.name}».`
          : "Sin cambios: el proyecto local ya coincidía con GitHub.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleUnlink(linkId: string) {
    setBusy(true);
    try {
      await deleteGitHubLink(linkId);
      await refresh();
      toast.success("Vínculo eliminado. El proyecto local se conserva intacto.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDisconnect(connection: GitHubConnection) {
    setBusy(true);
    setError(null);
    try {
      await revokeGitHubConnection(connection.backendConnectionId);
      await deleteGitHubConnection(connection.id);
      await refresh();
      setMode("idle");
      toast.success("GitHub desconectado. Se eliminó la conexión local.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo desconectar.");
    } finally {
      setBusy(false);
    }
  }

  function toggleProjectId(id: string) {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function selectAllProjects() {
    setSelectedProjectIds(projects.map((p) => p.id));
  }

  function clearProjectSelection() {
    setSelectedProjectIds([]);
  }

  return (
    <Panel
      label="GitHub App"
      title="Proyectos con GitHub"
      description="Conecta la App, crea o elige un repositorio (también privado), y vincula uno o todos tus proyectos de Hito. Se sincronizan nombre y descripción del proyecto — no issues."
      actions={
        <Button
          size="sm"
          disabled={!configured || busy}
          onClick={() => navigate(ROUTES.githubConnect)}
        >
          <Github className="size-4" />
          {connections.length ? "Reconectar" : "Conectar GitHub"}
        </Button>
      }
    >
      {!configured && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-warning" />
          <div>
            <p className="font-medium">Falta configurar el backend de GitHub</p>
            <p className="mt-1 text-muted-foreground">
              Define los secretos del servidor en Vercel. El cliente usa{" "}
              <code className="font-mono">/api</code> por defecto.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}

      {connections.length === 0 ? (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-6 text-center">
          <Github className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">GitHub aún no está conectado</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Autoriza la App. Luego podrás crear un repo privado y guardar uno o todos tus proyectos
            de Hito.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3"
            >
              <CheckCircle2 className="size-4 text-success" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">@{connection.githubLogin}</p>
                <p className="truncate text-xs text-muted-foreground">
                  Instalación {connection.installationId}
                </p>
              </div>
              <Badge variant={connection.enabled ? "success" : "outline"}>
                {connection.enabled ? "Activa" : "Pausada"}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                disabled={busy}
                onClick={() => void startLinkWizard(connection)}
              >
                <Link2 className="size-4" />
                Vincular proyectos
              </Button>
              <Button
                size="sm"
                variant="ghost"
                disabled={busy}
                onClick={() => void handleDisconnect(connection)}
              >
                <Unlink className="size-4" />
                Desconectar
              </Button>
            </div>
          ))}
        </div>
      )}

      {mode === "link" && activeConnection && (
        <div className="mt-6 space-y-4 rounded-xl border border-border bg-muted/20 p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Vincular a GitHub (sin issues)</h3>
            {busy && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          </div>

          {/* —— Repositorio —— */}
          <div className="space-y-2">
            <Label>Repositorio de GitHub</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={repoMode === "existing" ? "default" : "outline"}
                disabled={busy}
                onClick={() => setRepoMode("existing")}
              >
                Elegir existente
              </Button>
              <Button
                type="button"
                size="sm"
                variant={repoMode === "create" ? "default" : "outline"}
                disabled={busy}
                onClick={() => {
                  setRepoMode("create");
                  if (!newRepoName) {
                    setNewRepoName(
                      slugifyRepoName(newProjectName || "hito-project") || "hito-project",
                    );
                  }
                }}
              >
                <Plus className="size-4" />
                Crear repositorio nuevo
              </Button>
            </div>
          </div>

          {repoMode === "existing" ? (
            <div className="space-y-2">
              <Select
                id="gh-repo"
                value={repoKey}
                onChange={(e) => void onRepoChange(e.target.value)}
                disabled={busy || repos.length === 0}
              >
                <option value="">Selecciona un repositorio…</option>
                {repos.map((r) => (
                  <option key={r.id} value={`${r.owner}/${r.name}`}>
                    {r.fullName}
                    {r.private ? " · privado" : " · público"}
                  </option>
                ))}
              </Select>
              {repos.length === 0 && !busy && (
                <p className="text-xs text-warning">
                  No hay repos visibles. Crea uno nuevo o reinstala la App con acceso a tus repos
                  privados.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-3 rounded-lg border border-border bg-background/60 p-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="new-repo-name">Nombre del repositorio</Label>
                <Input
                  id="new-repo-name"
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  placeholder="mi-proyecto-hito"
                  disabled={busy}
                />
                <p className="text-xs text-muted-foreground">
                  Se creará como{" "}
                  <code className="font-mono">
                    {activeConnection.githubLogin}/{slugifyRepoName(newRepoName) || "…"}
                  </code>
                </p>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="new-repo-desc">Descripción (opcional)</Label>
                <Input
                  id="new-repo-desc"
                  value={newRepoDescription}
                  onChange={(e) => setNewRepoDescription(e.target.value)}
                  disabled={busy}
                />
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  className="size-3.5 rounded border-input"
                  checked={newRepoPrivate}
                  disabled={busy}
                  onChange={(e) => setNewRepoPrivate(e.target.checked)}
                />
                Repositorio privado
              </label>
              <div className="space-y-2 text-xs text-muted-foreground sm:col-span-2">
                <p>
                  Si ves <strong>Resource not accessible by integration</strong>, la GitHub App
                  necesita permiso <strong>Administration → Read and write</strong> (no basta
                  Metadata). Guarda, acepta el permiso en la instalación y{" "}
                  <button
                    type="button"
                    className="font-medium text-foreground underline"
                    onClick={() => navigate(ROUTES.githubConnect)}
                  >
                    reconecta GitHub
                  </button>
                  .
                </p>
                <p>
                  Alternativa:{" "}
                  <a
                    className="font-medium text-foreground underline"
                    href={`https://github.com/new?name=${encodeURIComponent(slugifyRepoName(newRepoName) || "hito-project")}${newRepoPrivate ? "" : ""}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    crear el repo en github.com/new
                  </a>
                  , añádelo a la instalación de la App, luego{" "}
                  <button
                    type="button"
                    className="font-medium text-foreground underline"
                    disabled={busy || !activeConnection}
                    onClick={() => {
                      if (!activeConnection) return;
                      setBusy(true);
                      void loadRepos(activeConnection)
                        .then(() => setRepoMode("existing"))
                        .finally(() => setBusy(false));
                    }}
                  >
                    actualizar lista
                  </button>{" "}
                  y elígelo en “Elegir existente”.
                </p>
              </div>
            </div>
          )}

          {/* —— GitHub Project (solo adjuntar existente; no se crea por API) —— */}
          <div className="space-y-2">
            <Label htmlFor="gh-project">GitHub Project (opcional)</Label>
            <Select
              id="gh-project"
              value={ghProjectId}
              onChange={(e) => {
                setGhProjectId(e.target.value);
                const p = ghProjects.find((x) => x.id === e.target.value);
                if (p && localMode === "new") {
                  setNewProjectName(p.title);
                  setNewProjectDescription(p.shortDescription?.trim() || "");
                }
              }}
              disabled={busy || (repoMode === "existing" && !selectedRepo)}
            >
              <option value="">Ninguno (solo repositorio — recomendado)</option>
              {ghProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.number} {p.title}
                  {p.public === false ? " · privado" : p.public ? " · público" : ""}
                </option>
              ))}
            </Select>
            {projectsWarning && <p className="text-xs text-warning">{projectsWarning}</p>}
            <p className="text-xs text-muted-foreground">
              Se guarda el vínculo <strong>proyecto Hito ↔ repositorio</strong> en este dispositivo.
              No se crean GitHub Projects por API (la App no puede en cuentas personales). Si ya
              tienes un Project, elígelo arriba solo para anotarlo.
            </p>
          </div>

          {/* —— Proyectos Hito —— */}
          <div className="space-y-2">
            <Label>Proyectos en Hito</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={localMode === "new" ? "default" : "outline"}
                onClick={() => setLocalMode("new")}
                disabled={busy}
              >
                <Plus className="size-4" />
                Crear uno nuevo
              </Button>
              <Button
                type="button"
                size="sm"
                variant={localMode === "existing" ? "default" : "outline"}
                onClick={() => setLocalMode("existing")}
                disabled={busy || projects.length === 0}
              >
                Uno existente
              </Button>
              <Button
                type="button"
                size="sm"
                variant={localMode === "multi" ? "default" : "outline"}
                onClick={() => {
                  setLocalMode("multi");
                  setSelectedProjectIds(projects.map((p) => p.id));
                }}
                disabled={busy || projects.length === 0}
              >
                Varios / todos
              </Button>
            </div>
          </div>

          {localMode === "multi" && (
            <div className="space-y-2 rounded-lg border border-border bg-background/60 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={busy || allSelected}
                  onClick={selectAllProjects}
                >
                  Seleccionar todos ({projects.length})
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={busy || selectedProjectIds.length === 0}
                  onClick={clearProjectSelection}
                >
                  Quitar selección
                </Button>
                <span className="text-xs text-muted-foreground">
                  {selectedProjectIds.length} seleccionado
                  {selectedProjectIds.length === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="max-h-48 space-y-1 overflow-y-auto">
                {projects.map((p) => (
                  <li key={p.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted/50">
                      <input
                        type="checkbox"
                        className="size-3.5 rounded border-input"
                        checked={selectedProjectIds.includes(p.id)}
                        disabled={busy}
                        onChange={() => toggleProjectId(p.id)}
                      />
                      <span className="min-w-0 truncate">{p.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Cada proyecto de Hito se vincula al mismo repositorio. Se conservan todas las
                tareas y datos locales.
              </p>
            </div>
          )}

          {localMode === "existing" && (
            <div className="space-y-2">
              <Label htmlFor="hito-project">Proyecto existente</Label>
              <Select
                id="hito-project"
                value={existingProjectId}
                onChange={(e) => setExistingProjectId(e.target.value)}
                disabled={busy}
              >
                <option value="">Selecciona…</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground">
                Se conservan tareas, áreas y el resto de datos del proyecto.
              </p>
            </div>
          )}

          {localMode === "new" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="new-name">Nombre del proyecto en Hito</Label>
                <Input
                  id="new-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder={selectedRepo?.name ?? (newRepoName || "Mi proyecto")}
                  disabled={busy}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="new-desc">Descripción</Label>
                <Input
                  id="new-desc"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  disabled={busy}
                />
              </div>
              {products.length > 0 && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="product">Producto (opcional)</Label>
                  <Select
                    id="product"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    disabled={busy}
                  >
                    <option value="">Sin producto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              disabled={
                busy ||
                (repoMode === "existing" && !selectedRepo) ||
                (repoMode === "create" && !slugifyRepoName(newRepoName)) ||
                (localMode === "multi" && selectedProjectIds.length === 0)
              }
              onClick={() => void saveLink()}
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Link2 className="size-4" />}
              {localMode === "multi"
                ? `Guardar ${selectedProjectIds.length || ""} vínculo${selectedProjectIds.length === 1 ? "" : "s"}`
                : repoMode === "create"
                  ? "Crear repo y vincular"
                  : "Guardar vínculo"}
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => {
                setMode("idle");
                setError(null);
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {links.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-semibold">Proyectos vinculados</h3>
          {links.map((link) => {
            const title = projectNameById.get(link.projectId) ?? "Proyecto eliminado";
            return (
              <div
                key={link.id}
                className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {link.owner}/{link.repository}
                    {link.projectNumber != null ? ` · Project #${link.projectNumber}` : ""}
                    {link.remoteProjectTitle ? ` · ${link.remoteProjectTitle}` : ""}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="outline">solo proyecto</Badge>
                    <Badge variant={link.status === "active" ? "success" : "outline"}>
                      {link.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void handlePush(link)}
                  >
                    <ArrowUpFromLine className="size-4" />
                    Enviar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void handlePull(link)}
                  >
                    <ArrowDownToLine className="size-4" />
                    Recibir
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => navigate(ROUTES.project(link.projectId))}
                  >
                    Abrir
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => void handleUnlink(link.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <a
        className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        href="/docs"
      >
        Ver guía de configuración <ExternalLink className="size-3" />
      </a>
    </Panel>
  );
}
