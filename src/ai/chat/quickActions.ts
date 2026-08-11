/**
 * Catálogo client-side de chips de acción y follow-ups (spec 050 HU-02, HU-04, D3, D10).
 * Plantillas puras — sin segundo LLM. Los prompts interpolan ids reales desde
 * `UiContext` en `selectQuickActions` / `selectFollowUps`.
 *
 * Slots:
 *  - `empty`: empty state (densidad baja, botones full width).
 *  - `composer`: fila compacta sobre el input cuando ya hay hilo.
 *
 * Follow-ups van bajo el último mensaje del asistente, derivados de heurística
 * de verbos sobre el último pedido del usuario (D10).
 */

import type { UiContext } from "./uiContext";

export interface QuickAction {
  id: string;
  /** Corto, UI. */
  label: string;
  /** Texto enviado a `send`. */
  prompt: string;
  /** default false. `true` en resúmenes/atajos cerrados que no requieren embeddings. */
  skipRag?: boolean;
  /** Dónde aplica este chip. */
  when: ReadonlyArray<"global" | "project" | "task" | "empty">;
}

const GENERIC_FOLLOWUPS: QuickAction[] = [
  {
    id: "follow-deepen",
    label: "Profundizá",
    prompt: "Profundizá en lo anterior con más detalle.",
    skipRag: true,
    when: [],
  },
  {
    id: "follow-what-else",
    label: "¿Qué más puedo hacer acá?",
    prompt: "¿Qué otras acciones útiles puedo pedirte sobre esto?",
    skipRag: true,
    when: [],
  },
];

function ctxKind(ctx: UiContext): "global" | "project" | "task" {
  switch (ctx.kind) {
    case "task":
      return "task";
    case "project":
      return "project";
    default:
      return "global";
  }
}

/**
 * Construye el catálogo activo según el contexto (interpola ids).
 * Exportado para que los tests verifiquen el set completo por contexto.
 */
export function buildCatalog(ctx: UiContext): QuickAction[] {
  const actions: QuickAction[] = [
    {
      id: "day-summary",
      label: "Resumen del día",
      prompt:
        "Dame el resumen del día: tareas vencidas, por vencer y bloqueadas en el portafolio.",
      skipRag: true,
      when: ["global", "empty"],
    },
    {
      id: "stalled",
      label: "Proyectos estancados",
      prompt: "¿Qué proyectos están estancados o en riesgo? Justificá cada uno.",
      skipRag: true,
      when: ["global", "empty"],
    },
    {
      id: "overdue",
      label: "Vencidos y por vencer",
      prompt:
        "Listá las tareas vencidas y por vencer con proyecto, status y due date, las más urgentes primero.",
      skipRag: true,
      when: ["global"],
    },
  ];

  if (ctx.kind === "project" || ctx.kind === "task") {
    actions.push(
      {
        id: "project-summary",
        label: "Resumen de este proyecto",
        prompt: `Dame un resumen ejecutivo del proyecto id=\`${ctx.projectId}\` (${ctx.projectName}): salud, bloqueos, próximos pasos.`,
        skipRag: true,
        when: ["project", "task"],
      },
      {
        id: "project-risks",
        label: "Tareas en riesgo / bloqueadas",
        prompt: `En el proyecto id=\`${ctx.projectId}\` (${ctx.projectName}), ¿qué tareas están bloqueadas o en riesgo? Listalas con status y priority.`,
        skipRag: true,
        when: ["project", "task"],
      },
      {
        id: "create-task-here",
        label: "Crear tarea aquí",
        prompt: `Creá una tarea en el proyecto id=\`${ctx.projectId}\` (${ctx.projectName}). Pedime título y prioridad si hace falta, y confirmá antes de escribir.`,
        skipRag: true,
        when: ["project", "task"],
      },
    );
  }

  if (ctx.kind === "task") {
    actions.push(
      {
        id: "task-summary",
        label: "Resumí esta tarea",
        prompt: `Resumí la tarea id=\`${ctx.taskId}\` ("${ctx.taskTitle}") del proyecto id=\`${ctx.projectId}\`, y sugerí el próximo paso.`,
        skipRag: true,
        when: ["task"],
      },
      {
        id: "task-subtasks",
        label: "Proponé subtareas",
        prompt: `Proponé subtareas concretas para la tarea id=\`${ctx.taskId}\` ("${ctx.taskTitle}") del proyecto id=\`${ctx.projectId}\`.`,
        skipRag: true,
        when: ["task"],
      },
      {
        id: "task-improve-desc",
        label: "Mejorá la descripción",
        prompt: `Mejorá la descripción de la tarea id=\`${ctx.taskId}\` ("${ctx.taskTitle}") del proyecto id=\`${ctx.projectId}\`. Leé la tarea primero y pedí confirmación antes de escribir.`,
        when: ["task"],
      },
    );
  }

  return actions;
}

function filterBySlot(actions: QuickAction[], slot: "empty" | "composer", ctx: UiContext): QuickAction[] {
  if (slot === "empty") {
    return actions.filter((a) => a.when.includes("empty"));
  }
  const kind = ctxKind(ctx);
  return actions.filter((a) => a.when.includes(kind));
}

/**
 * Selección de chips para empty state o composer (HU-02).
 * Limita a ~6 visibles en composer (CA-02.2).
 */
export function selectQuickActions(ctx: UiContext, slot: "empty" | "composer"): QuickAction[] {
  const actions = filterBySlot(buildCatalog(ctx), slot, ctx);
  if (slot === "empty") return actions.slice(0, 6);
  return actions.slice(0, 6);
}

/**
 * Follow-ups post-respuesta (HU-04). Heurística simple sobre el último pedido.
 * Siempre devuelve al menos 2 (genéricos) — CA-04.4.
 */
export function selectFollowUps(ctx: UiContext, lastUserText: string): QuickAction[] {
  const t = lastUserText.toLowerCase();
  const kind = ctxKind(ctx);
  const out: QuickAction[] = [];

  if (kind === "task" && ctx.kind === "task") {
    if (/subtarea|desglos|plan/.test(t)) {
      out.push({
        id: "fu-task-priority",
        label: "¿Cuál es la prioridad real?",
        prompt: `De esa tarea id=\`${ctx.taskId}\`, ¿cuál es la prioridad real hoy y por qué?`,
        skipRag: true,
        when: [],
      });
    } else {
      out.push({
        id: "fu-task-subtasks",
        label: "Proponé subtareas",
        prompt: `Proponé subtareas concretas para la tarea id=\`${ctx.taskId}\`.`,
        skipRag: true,
        when: [],
      });
    }
  } else if (kind === "project" && ctx.kind === "project") {
    if (/resum|salud|estado/.test(t)) {
      out.push({
        id: "fu-proj-blocked",
        label: "Tareas bloqueadas",
        prompt: `En el proyecto id=\`${ctx.projectId}\`, ¿qué tareas están bloqueadas?`,
        skipRag: true,
        when: [],
      });
    } else {
      out.push({
        id: "fu-proj-next",
        label: "Próximos pasos",
        prompt: `Para el proyecto id=\`${ctx.projectId}\`, proponé los próximos 2-3 pasos accionables.`,
        skipRag: true,
        when: [],
      });
    }
  } else if (/vencid|por vencer|overdue/.test(t)) {
    out.push({
      id: "fu-global-stalled",
      label: "¿Proyectos estancados?",
      prompt: "¿Qué proyectos están estancados o en riesgo?",
      skipRag: true,
      when: [],
    });
  } else if (/resum|día|dia|daily/.test(t)) {
    out.push({
      id: "fu-global-overdue",
      label: "Listá vencidos",
      prompt: "Listá las tareas vencidas con proyecto, status y due date.",
      skipRag: true,
      when: [],
    });
  }

  // Siempre 2 genéricos al final si hay lugar; CA-04.4.
  return [...out, ...GENERIC_FOLLOWUPS].slice(0, 4);
}
