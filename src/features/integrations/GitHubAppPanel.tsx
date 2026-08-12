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

  // Wizard state
  const [mode, setMode] = useState<WizardMode>("idle");
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [ghProjects, setGhProjects] = useState<GitHubProjectSummary[]>([]);
  const [repoKey, setRepoKey] = useState("");
  const [ghProjectId, setGhProjectId] = useState("");
  const [localMode, setLocalMode] = useState<"existing" | "new">("new");
  const [existingProjectId, setExistingProjectId] = useState("");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [productId, setProductId] = useState("");
  const [createRemoteProject, setCreateRemoteProject] = useState(true);
  /** Projects en GitHub se crean privados por defecto (repos privados incluidos). */
  const [makeRemotePrivate, setMakeRemotePrivate] = useState(true);
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

  async function startLinkWizard(connection: GitHubConnection) {
    setError(null);
    setBusy(true);
    setActiveConnectionId(connection.id);
    setMode("link");
    setRepoKey("");
    setGhProjectId("");
    setLocalMode("new");
    setExistingProjectId(projects[0]?.id ?? "");
    setNewProjectName("");
    setNewProjectDescription("");
    setProductId(products[0]?.id ?? "");
    setCreateRemoteProject(true);
    setMakeRemotePrivate(true);
    setProjectsWarning(null);
    try {
      const result = await getGitHubRepositories(connection.backendConnectionId);
      if (!result.ok) {
        setError(result.message);
        setRepos([]);
        return;
      }
      // Privados primero: suele ser lo que se quiere vincular.
      const sorted = [...result.data].sort((a, b) => Number(b.private) - Number(a.private));
      setRepos(sorted);
      if (sorted[0]) {
        const first = sorted[0];
        setRepoKey(`${first.owner}/${first.name}`);
        setNewProjectName(first.name);
        setNewProjectDescription(first.description?.trim() || "");
        setMakeRemotePrivate(true);
        await loadProjectsForOwner(connection.backendConnectionId, first.owner);
      }
    } finally {
      setBusy(false);
    }
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

  async function onRepoChange(value: string) {
    setRepoKey(value);
    const repo = repos.find((r) => `${r.owner}/${r.name}` === value);
    if (!repo || !activeConnection) return;
    // Al cambiar de repo, prellenar nombre/desc del repo (usuario puede editar).
    setNewProjectName(repo.name);
    setNewProjectDescription(repo.description?.trim() || "");
    setMakeRemotePrivate(true);
    setGhProjectId("");
    setBusy(true);
    try {
      await loadProjectsForOwner(activeConnection.backendConnectionId, repo.owner);
    } finally {
      setBusy(false);
    }
  }

  async function saveLink() {
    if (!activeConnection || !selectedRepo) {
      setError("Elige un repositorio de GitHub.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      let projectId = existingProjectId;
      let project = projects.find((p) => p.id === projectId) ?? null;

      if (localMode === "new") {
        const name = newProjectName.trim() || selectedRepo.name;
        if (!name) {
          setError("Escribe un nombre para el proyecto nuevo.");
          return;
        }
        const created = newProject(name, productId || null);
        created.description = newProjectDescription.trim();
        // Se guardan nombre/descripcion; tareas/áreas vacías en un proyecto nuevo.
        await createProject(created);
        projectId = created.id;
        project = created;
      } else {
        if (!project) {
          setError("Elige un proyecto de Hito existente.");
          return;
        }
        // Conservar todas las tareas/áreas; solo rellenar descripción vacía si hay texto.
        const next = { ...project };
        let touched = false;
        if (!next.description.trim() && newProjectDescription.trim()) {
          next.description = newProjectDescription.trim();
          touched = true;
        }
        if (touched) {
          next.updatedAt = new Date().toISOString();
          await saveProject(next);
          project = next;
        }
      }

      if (!project || !projectId) {
        setError("No hay proyecto local para vincular.");
        return;
      }

      let projectNodeId = selectedGhProject?.id;
      let projectNumber = selectedGhProject?.number;
      let remoteTitle = selectedGhProject?.title ?? null;
      let remoteDesc = selectedGhProject?.shortDescription ?? null;

      const baseLink = buildGitHubLink({
        projectId,
        connectionId: activeConnection.id,
        owner: selectedRepo.owner,
        repository: selectedRepo.name,
        repositoryId: selectedRepo.id,
        projectNodeId,
        projectNumber,
        remoteProjectTitle: remoteTitle,
        remoteProjectDescription: remoteDesc,
        remoteRepositoryDescription: selectedRepo.description ?? null,
      });

      // Crear Project en GitHub (privado por defecto) si se pidió y no hay uno elegido.
      if (createRemoteProject && !projectNodeId) {
        const pushed = await pushProjectMetaToGitHub({
          backendConnectionId: activeConnection.backendConnectionId,
          link: baseLink,
          local: {
            name: project.name,
            description: project.description,
          },
          repositoryNodeId: selectedRepo.nodeId || null,
          makePrivate: makeRemotePrivate,
        });
        if (!pushed.ok) {
          // El proyecto local ya se creó: guardar vínculo local y avisar del fallo remoto.
          await saveGitHubLink(baseLink);
          await refresh();
          setError(
            `Proyecto local guardado, pero no se pudo crear el GitHub Project: ${pushed.message}`,
          );
          toast.error("GitHub Project no creado. Revisa permisos Projects de la App.");
          return;
        }
        await refresh();
        setMode("idle");
        toast.success(
          `Proyecto vinculado${selectedRepo.private ? " (repo privado)" : ""}: ${project.name} ↔ ${selectedRepo.fullName}`,
        );
        return;
      }

      // Si el Project ya existe y se pidió privado, intentar forzar public:false en push.
      if (projectNodeId && makeRemotePrivate) {
        const pushed = await pushProjectMetaToGitHub({
          backendConnectionId: activeConnection.backendConnectionId,
          link: baseLink,
          local: { name: project.name, description: project.description },
          repositoryNodeId: selectedRepo.nodeId || null,
          makePrivate: true,
        });
        if (!pushed.ok) {
          await saveGitHubLink(baseLink);
          await refresh();
          setError(`Vínculo local guardado. No se pudo actualizar el Project: ${pushed.message}`);
          return;
        }
        await refresh();
        setMode("idle");
        toast.success(`Proyecto vinculado: ${project.name} ↔ ${selectedRepo.fullName}`);
        return;
      }

      await saveGitHubLink(baseLink);
      await refresh();
      setMode("idle");
      toast.success(
        `Proyecto vinculado: ${project.name} ↔ ${selectedRepo.fullName}`,
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
      const result = await pushProjectMetaToGitHub({
        backendConnectionId: connection.backendConnectionId,
        link,
        local: { name: project.name, description: project.description },
      });
      if (!result.ok) {
        setError(result.message);
        return;
      }
      await refresh();
      toast.success(`Enviado a GitHub: metadatos de «${project.name}».`);
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
      if (result.changed) {
        await saveProject(result.project);
      }
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

  const projectNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of projects) map.set(p.id, p.name);
    return map;
  }, [projects]);

  return (
    <Panel
      label="GitHub App"
      title="Proyectos con GitHub"
      description="Conecta la GitHub App y vincula un proyecto de Hito con un repositorio y un GitHub Project. Se sincronizan los datos del proyecto (nombre y descripción), no issues ni tareas."
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
            Autoriza la App, elige repositorio y crea o vincula un proyecto de Hito. Tus datos
            locales se conservan.
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
                Vincular proyecto
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
            <h3 className="text-sm font-semibold">Vincular proyecto (sin issues)</h3>
            {busy && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gh-repo">Repositorio de GitHub</Label>
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
            {selectedRepo?.private && (
              <p className="text-xs text-muted-foreground">
                Repo privado: la App debe estar instalada con acceso a este repositorio. El Project
                se creará privado y enlazado al repo.
              </p>
            )}
            {repos.length === 0 && !busy && (
              <p className="text-xs text-warning">
                No hay repositorios visibles. Reinstala la App y marca los repos privados que
                quieras usar (o “All repositories”).
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gh-project">GitHub Project (opcional)</Label>
            <Select
              id="gh-project"
              value={ghProjectId}
              onChange={(e) => {
                setGhProjectId(e.target.value);
                const p = ghProjects.find((x) => x.id === e.target.value);
                if (p) {
                  if (localMode === "new") {
                    setNewProjectName(p.title);
                    setNewProjectDescription(p.shortDescription?.trim() || "");
                  }
                  setCreateRemoteProject(false);
                } else {
                  setCreateRemoteProject(true);
                }
              }}
              disabled={busy || !selectedRepo}
            >
              <option value="">Ninguno — crear uno nuevo al guardar</option>
              {ghProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  #{p.number} {p.title}
                  {p.public === false ? " · privado" : p.public ? " · público" : ""}
                </option>
              ))}
            </Select>
            {projectsWarning && (
              <p className="text-xs text-warning">{projectsWarning}</p>
            )}
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="size-3.5 rounded border-input"
                checked={createRemoteProject && !ghProjectId}
                disabled={Boolean(ghProjectId) || busy}
                onChange={(e) => setCreateRemoteProject(e.target.checked)}
              />
              Crear un GitHub Project nuevo con el nombre del proyecto de Hito
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                className="size-3.5 rounded border-input"
                checked={makeRemotePrivate}
                disabled={busy || (!createRemoteProject && !ghProjectId)}
                onChange={(e) => setMakeRemotePrivate(e.target.checked)}
              />
              Project privado en GitHub (recomendado con repos privados)
            </label>
          </div>

          <div className="space-y-2">
            <Label>Proyecto en Hito</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={localMode === "new" ? "default" : "outline"}
                onClick={() => setLocalMode("new")}
                disabled={busy}
              >
                <Plus className="size-4" />
                Crear nuevo
              </Button>
              <Button
                type="button"
                size="sm"
                variant={localMode === "existing" ? "default" : "outline"}
                onClick={() => setLocalMode("existing")}
                disabled={busy || projects.length === 0}
              >
                Usar existente
              </Button>
            </div>
          </div>

          {localMode === "existing" ? (
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
                Se conservan todas las tareas, áreas y datos que ya tiene el proyecto.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="new-name">Nombre del proyecto</Label>
                <Input
                  id="new-name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder={selectedRepo?.name ?? "Mi proyecto"}
                  disabled={busy}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="new-desc">Descripción</Label>
                <Input
                  id="new-desc"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  placeholder="Se puede rellenar desde el repo o el Project de GitHub"
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
            <Button disabled={busy || !selectedRepo} onClick={() => void saveLink()}>
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Link2 className="size-4" />}
              Guardar vínculo
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
                    title="Enviar nombre y descripción a GitHub"
                  >
                    <ArrowUpFromLine className="size-4" />
                    Enviar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => void handlePull(link)}
                    title="Recibir nombre y descripción desde GitHub"
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
