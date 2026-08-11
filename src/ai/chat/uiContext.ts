/**
 * Resolución del foco de pantalla para el system prompt del asistente (spec 050
 * HU-01 / D1–D2). Pura: recibe `pathname`, `search` y callbacks de lectura; no
 * toca React Router ni stores directamente, así es testeable sin DOM.
 */

export type UiContext =
  | {
      kind: "project";
      projectId: string;
      projectName: string;
      status?: string;
      health?: string;
    }
  | {
      kind: "task";
      projectId: string;
      projectName: string;
      taskId: string;
      taskTitle: string;
      status?: string;
      priority?: string;
    }
  | { kind: "section"; section: string }
  | { kind: "none" };

/** Vista legible para los prompts y los chips del header. */
export type UiContextKind = UiContext["kind"];

export interface UiProjectLike {
  id: string;
  name: string;
  status?: string;
  health?: string;
}

export interface UiTaskLike {
  id: string;
  title: string;
  status?: string;
  priority?: string;
}

export interface ResolveUiContextInput {
  pathname: string;
  search: string;
  getProject: (id: string) => UiProjectLike | null;
  getTask: (projectId: string, taskId: string) => UiTaskLike | null;
}

const PROJECT_ROUTE_RE = /^\/app\/projects\/([^/]+)\/?$/;

const SECTION_PREFIXES: ReadonlyArray<[string, string]> = [
  // Lista de proyectos (sin id). El detalle /app/projects/:id ya se procesó antes.
  ["/app/projects", "projects"],
  ["/app/products", "products"],
  ["/app/my-tasks", "my-tasks"],
  ["/app/daily", "daily"],
  ["/app/library", "library"],
  ["/app/automations", "automations"],
  ["/app/flows", "flows"],
  ["/app/quarters", "quarters"],
  ["/app/integrations", "integrations"],
  ["/app/notifications", "notifications"],
  ["/app/settings", "settings"],
];

/**
 * Resuelve el contexto de pantalla desde la URL + los stores de datos.
 * Orden (D1): `/app/projects/:id` (+ `?detail=`) → sección conocida → none.
 * Si los ids de la URL no existen en datos, degrada sin romper el turno (CA-01.4).
 */
export function resolveUiContext(input: ResolveUiContextInput): UiContext {
  const { pathname, search, getProject, getTask } = input;

  // /app exact → dashboard
  if (pathname === "/app" || pathname === "/app/") {
    return { kind: "section", section: "dashboard" };
  }

  const projectMatch = pathname.match(PROJECT_ROUTE_RE);
  if (projectMatch) {
    const projectId = decodeURIComponent(projectMatch[1]);
    const params = new URLSearchParams(search);
    const detailId = params.get("detail");

    if (detailId) {
      const task = getTask(projectId, detailId);
      if (task) {
        const project = getProject(projectId);
        const projectName = project?.name ?? "(proyecto)";
        return {
          kind: "task",
          projectId,
          projectName,
          taskId: task.id,
          taskTitle: task.title,
          status: task.status,
          priority: task.priority,
        };
      }
      // detail presente pero tarea inexistente → cae al proyecto si existe.
    }

    const project = getProject(projectId);
    if (project) {
      return {
        kind: "project",
        projectId: project.id,
        projectName: project.name,
        status: project.status,
        health: project.health,
      };
    }
    // id de proyecto que no existe en datos → sección projects (no inventa ids).
    return { kind: "section", section: "projects" };
  }

  for (const [prefix, section] of SECTION_PREFIXES) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return { kind: "section", section };
    }
  }

  return { kind: "none" };
}

/**
 * Bloque markdown para el system prompt. Vacío cuando no hay foco útil (D2).
 * Se inserta después del índice del workspace en `buildSystemPrompt`.
 */
export function formatUiContextBlock(ctx: UiContext): string {
  switch (ctx.kind) {
    case "none":
      return "";
    case "section":
      return `## Contexto de pantalla actual
El usuario tiene abierta la UI en este foco. Priorizá este contexto cuando diga "este proyecto", "esta tarea", "aquí", etc.

- Vista: ${ctx.section}
`;
    case "project":
      return `## Contexto de pantalla actual
El usuario tiene abierta la UI en este foco. Priorizá este contexto cuando diga "este proyecto", "esta tarea", "aquí", etc. Usá los ids exactos; no pidas confirmación del id si ya está aquí.

- Vista: detalle de proyecto
- Proyecto: ${ctx.projectName} (id: \`${ctx.projectId}\`${
        ctx.status ? `, estado: ${ctx.status}` : ""
      }${ctx.health ? `, salud: ${ctx.health}` : ""})
`;
    case "task": {
      const lines = [
        "- Vista: detalle de tarea",
        `- Proyecto: ${ctx.projectName} (id: \`${ctx.projectId}\`)`,
        `- Tarea en foco: ${ctx.taskTitle} (id: \`${ctx.taskId}\`${
          ctx.status ? `, status: ${ctx.status}` : ""
        }${ctx.priority ? `, priority: ${ctx.priority}` : ""})`,
      ];
      return `## Contexto de pantalla actual
El usuario tiene abierta la UI en este foco. Priorizá este contexto cuando diga "este proyecto", "esta tarea", "aquí", etc. Usá los ids exactos; no pidas confirmación del id si ya está aquí.

${lines.join("\n")}
`;
    }
  }
}

/** Label corto para el chip del header (D12). Vacío si no hay nada útil. */
export function summarizeUiContext(ctx: UiContext): { primary?: string; secondary?: string } {
  switch (ctx.kind) {
    case "task":
      return { primary: "Tarea", secondary: ctx.taskTitle };
    case "project":
      return { primary: "Proyecto", secondary: ctx.projectName };
    case "section":
      return { primary: sectionLabel(ctx.section) };
    case "none":
      return {};
  }
}

const SECTION_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  products: "Productos",
  projects: "Proyectos",
  "my-tasks": "Mis tareas",
  daily: "Daily",
  library: "Biblioteca",
  automations: "Automatizaciones",
  flows: "Flujos",
  quarters: "Trimestres",
  integrations: "Integraciones",
  notifications: "Notificaciones",
  settings: "Ajustes",
};

function sectionLabel(section: string): string {
  return SECTION_LABELS[section] ?? section;
}
