/**
 * Comandos slash para el chat del asistente (spec 050 HU-03 / D5).
 *
 * - `parseSlashInput`: detecta si el texto es `/cmd ...` o texto plano.
 * - `expandSlash`: expande un comando conocido a un prompt completo usando el
 *   contexto de pantalla; los desconocidos se devuelven literal (CA-03.3).
 * - `listSlashCommands`: catálogo para el menú del input.
 *
 * La expansión ocurre antes de `runAgentTurn`; el hilo muestra el texto
 * expandido (CA-03.4). Todo slash conocido va con `skipRag: true` (D7).
 */

import type { UiContext } from "./uiContext";

export interface SlashCommand {
  /** Nombre sin la barra. */
  name: string;
  description: string;
  expand: (ctx: UiContext, rest: string) => string;
}

/** Resultado de parsear el input del textarea. */
export type ParsedSlashInput =
  | { kind: "command"; name: string; rest: string }
  | { kind: "plain"; text: string };

/** Resultado de expandir. `wasCommand=false` → texto literal (CA-03.3). */
export interface ExpandedSlash {
  text: string;
  skipRag: boolean;
  wasCommand: boolean;
}

const CMD_RE = /^\/([a-záéíóúñ-]+)\b\s*(.*)$/is;

export function parseSlashInput(raw: string): ParsedSlashInput {
  const trimmed = raw.trim();
  const match = trimmed.match(CMD_RE);
  if (!match) return { kind: "plain", text: raw };
  const [, name, rest] = match;
  return { kind: "command", name: name.toLowerCase(), rest: rest ?? "" };
}

const COMMANDS: SlashCommand[] = [
  {
    name: "ayuda",
    description: "Mostrar qué puede hacer el asistente",
    expand: () =>
      "Mostrame una lista breve de las cosas que podés hacer por mí: leer proyectos, crear tareas, plantillas, etc. Sé conciso.",
  },
  {
    name: "resumen",
    description: "Resumen del proyecto en foco o del portafolio",
    expand: (ctx) => {
      if (ctx.kind === "project" || ctx.kind === "task") {
        const pid = ctx.projectId;
        return `Dame un resumen ejecutivo del proyecto id=\`${pid}\`: salud general, tareas bloqueadas o en riesgo, próximos hitos y próximos pasos recomendados. Sé conciso.`;
      }
      return "Dame un resumen ejecutivo del portafolio: proyectos activos, cuáles están en riesgo o estancados, tareas vencidas y prioridades de hoy.";
    },
  },
  {
    name: "vencidos",
    description: "Tareas vencidas y por vencer",
    expand: (ctx) => {
      if (ctx.kind === "project" || ctx.kind === "task") {
        return `Listá las tareas vencidas y por vencer del proyecto id=\`${ctx.projectId}\`, con status, priority y due date. Marcá las más urgentes primero.`;
      }
      return "Listá todas las tareas vencidas y por vencer del portafolio, agrupadas por proyecto, con status, priority y due date.";
    },
  },
  {
    name: "salud",
    description: "Proyectos en riesgo / estancados",
    expand: (ctx) => {
      if (ctx.kind === "project" || ctx.kind === "task") {
        return `Analizá la salud del proyecto id=\`${ctx.projectId}\`: indicadores de riesgo, tareas bloqueadas, presupuesto de tiempo. ¿Está on-track, en riesgo o estancado?`;
      }
      return "¿Qué proyectos están estancados o en riesgo? Justificá cada uno con datos (salud, días sin cambios, tareas bloqueadas).";
    },
  },
  {
    name: "crear-tarea",
    description: "Crear una tarea (aquí si hay proyecto)",
    expand: (ctx, rest) => {
      if (ctx.kind === "project" || ctx.kind === "task") {
        const detail = rest.trim()
          ? ` Detalles: ${rest.trim()}.`
          : " Pedime un título breve antes de crearla.";
        return `Creá una tarea en el proyecto id=\`${ctx.projectId}\`.${detail} Si falta prioridad o área, proponé valores razonables y pedí confirmación antes de escribir.`;
      }
      return `Creá una tarea nueva.${rest.trim() ? ` Detalles: ${rest.trim()}.` : ""} Pedime en qué proyecto crearla si hay ambigüedad, y confirma antes de escribir.`;
    },
  },
];

const COMMANDS_BY_NAME = new Map(COMMANDS.map((c) => [c.name, c]));

export function listSlashCommands(): SlashCommand[] {
  return COMMANDS;
}

export function findSlashCommand(name: string): SlashCommand | null {
  return COMMANDS_BY_NAME.get(name.toLowerCase()) ?? null;
}

export function expandSlash(raw: string, ctx: UiContext): ExpandedSlash {
  const parsed = parseSlashInput(raw);
  if (parsed.kind === "plain") {
    return { text: raw, skipRag: false, wasCommand: false };
  }
  const cmd = findSlashCommand(parsed.name);
  if (!cmd) {
    // CA-03.3: comando desconocido se envía literal, sin expandir ni skipRag.
    return { text: raw, skipRag: false, wasCommand: false };
  }
  return {
    text: cmd.expand(ctx, parsed.rest),
    skipRag: true,
    wasCommand: true,
  };
}
