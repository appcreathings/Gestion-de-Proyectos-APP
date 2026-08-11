# Design 050 — Chat IA: UX + eficiencia de llamados

> Decisiones técnicas para `spec.md`. Sin dependencias npm nuevas. Sin bump de schema.
> Lógica testeable se extrae a módulos puros bajo `src/features/assistant/` o `src/ai/chat/`.

## 0. Mapa de archivos

| Área | Archivo | Rol |
|------|---------|-----|
| Nuevo | `src/ai/chat/uiContext.ts` | Leer foco de pantalla desde pathname + search + stores (puro / casi puro) |
| Nuevo | `src/ai/chat/uiContext.test.ts` | Tests CA-01.* |
| Nuevo | `src/ai/chat/quickActions.ts` | Catálogo de chips + follow-ups + metadata `skipRag` |
| Nuevo | `src/ai/chat/quickActions.test.ts` | Tests de selección contextual |
| Nuevo | `src/ai/chat/slashCommands.ts` | Parse/expand de `/comandos` |
| Nuevo | `src/ai/chat/slashCommands.test.ts` | CA-03.* |
| Nuevo | `src/ai/chat/skipRag.ts` | Heurística D7 |
| Nuevo | `src/ai/chat/skipRag.test.ts` | CA-06.1 |
| Nuevo | `src/ai/chat/historyWindow.ts` | `trimAgentHistory(history, max=12)` |
| Nuevo | `src/ai/chat/historyWindow.test.ts` | CA-06.2 |
| Existente | `src/ai/gemini/systemPrompt.ts` | Aceptar `screenContext: string` y anexarlo al prompt |
| Existente | `src/ai/gemini/systemPrompt.test.ts` | Bloque de contexto presente/ausente |
| Existente | `src/store/useChatStore.ts` | `send` con skip RAG + trim history; `regenerateLast`; capturar contexto al enviar |
| Existente | `src/features/assistant/AssistantPanel.tsx` | Chip de contexto, banner reintentar, wire chips |
| Existente | `src/features/assistant/AssistantEmptyState.tsx` | Usa `quickActions` en vez de array hardcodeado |
| Nuevo | `src/features/assistant/QuickActionChips.tsx` | Fila de chips reutilizable |
| Nuevo | `src/features/assistant/FollowUpChips.tsx` | Chips bajo el último mensaje |
| Existente | `src/features/assistant/ChatInput.tsx` | Menú slash ligero al escribir `/` |
| Existente | `src/features/assistant/ChatMessageBubble.tsx` | Copiar + Regenerar en asistente |
| Existente | `src/features/assistant/ChatMessageList.tsx` | Pasar props de acciones / follow-ups |
| Opcional | `src/features/releases/data/roadmap.ts` | Marcar `assistant-project-context` como shipped al cerrar |

```
URL / stores ──► uiContext ──► buildSystemPrompt(+bloque)
                         └──► quickActions / followUps
ChatInput / chips / slash ──► send({ text, skipRag? })
send ──► skipRag? ──► (no buildRagContext)
     ──► trimAgentHistory(agentHistory)
     ──► runAgentTurn(...)
```

## 1. HU-01 — Contexto de pantalla

### 1.1 `resolveUiContext(input) → UiContext`

```ts
// src/ai/chat/uiContext.ts
export type UiContext =
  | { kind: "project"; projectId: string; projectName: string; status?: string; health?: string }
  | {
      kind: "task";
      projectId: string;
      projectName: string;
      taskId: string;
      taskTitle: string;
      status?: string;
      priority?: string;
    }
  | { kind: "section"; section: string } // "dashboard" | "products" | "my-tasks" | ...
  | { kind: "none" };

export interface ResolveUiContextInput {
  pathname: string;
  search: string; // "?detail=...&tab=tasks"
  /** Snapshot mínimo del índice / stores */
  getProject: (id: string) => { id: string; name: string; status?: string; health?: string } | null;
  getTask: (
    projectId: string,
    taskId: string,
  ) => { id: string; title: string; status?: string; priority?: string } | null;
}
```

**Reglas de resolución (orden):**

1. Si `pathname` match `/app/projects/:projectId` (y no es exactamente `/app/projects`):
   - Leer `detail` de `URLSearchParams`.
   - Si hay `detail` y `getTask` devuelve tarea → `{ kind: "task", ... }`.
   - Else si `getProject` ok → `{ kind: "project", ... }`.
   - Else → `{ kind: "section", section: "projects" }` o `none` si id basura.
2. Else mapear prefijos conocidos:
   - `/app` exact → dashboard  
   - `/app/products` → products  
   - `/app/my-tasks` → my-tasks  
   - `/app/daily` → daily  
   - `/app/library` → library  
   - `/app/automations` \| `/app/flows` → automations/flows  
   - `/app/settings` → settings  
   - default → `{ kind: "none" }`

### 1.2 Formato del bloque en el system prompt

```ts
export function formatUiContextBlock(ctx: UiContext): string {
  // retorna "" si none; si no, markdown corto
}
```

Ejemplo generado:

```markdown
## Contexto de pantalla actual
El usuario tiene abierta la UI en este foco. Priorizá este contexto cuando diga "este proyecto", "esta tarea", "aquí", etc. Usá los ids exactos; no pidas confirmación del id si ya está aquí.

- Vista: detalle de tarea
- Proyecto: "Lanzamiento web" (id: `b0d6eeb0-...`, estado: active, salud: on-track)
- Tarea en foco: "Redactar landing" (id: `task-...`, status: doing, priority: high)
```

En `buildSystemPrompt(workspace, ragContext, today, screenContextBlock = "")`:

- Si `screenContextBlock` no vacío, insertarlo **después** del índice del workspace (o justo antes de “Herramientas” — preferir **después del índice**, para que el modelo vea el catálogo y luego el foco).
- Test existente de `buildSystemPrompt` se extiende con un caso que incluye el bloque.

### 1.3 Quién resuelve el contexto en runtime

En `useChatStore.send` **no** se puede usar `useLocation` (no es un componente). Opciones:

| Opción | Veredicto |
|--------|-----------|
| A. Módulo con `let lastPath` actualizado desde `AssistantPanel`/`AppLayout` via `setChatUiRoute({ pathname, search })` | **Elegida** — 3 líneas en panel, cero acoplamiento a React Router dentro del store de chat |
| B. Pasar pathname en cada `send(text, { pathname, search })` desde UI | También válido; más prop-drilling |
| C. Importar `window.location` dentro de `send` | Funciona en browser; más feo en tests |

**D-design-1:** `setChatRouteSnapshot({ pathname, search })` en `useChatStore` (campos de estado o variables de módulo, no hace falta re-render global). `AssistantPanel` (o un hook `useSyncChatRoute()` montado en `AppLayout`) hace:

```ts
const { pathname, search } = useLocation();
useEffect(() => {
  setChatRouteSnapshot({ pathname, search });
}, [pathname, search]);
```

Al `send()`, se lee el snapshot + `useDataStore` / `useAppStore` para `getProject`/`getTask`.

### 1.4 Chip de header

En `AssistantPanel` header, si `ctx.kind` es `project` o `task`:

```
[Proyecto · Lanzamiento web]
[Tarea · Redactar landing]
```

Badges `outline` `text-[10px]` truncados con `title` completo. Clic opcional v1: **ninguno** (solo informativo; D12). No hace falta botón “descartar” si complica el header — si hay espacio, “×” solo oculta localmente con `useState` (no cambia el prompt).

## 2. HU-02 / HU-04 — Quick actions y follow-ups

### 2.1 Modelo de acción

```ts
// src/ai/chat/quickActions.ts
export interface QuickAction {
  id: string;
  label: string;          // corto, UI
  prompt: string;         // lo que se envía
  skipRag?: boolean;      // default false; true en resúmenes/atajos cerrados
  /** Dónde aplica */
  when: Array<"global" | "project" | "task" | "empty">;
}

export function selectQuickActions(ctx: UiContext, slot: "empty" | "composer"): QuickAction[]
export function selectFollowUps(ctx: UiContext, lastUserText: string): QuickAction[]
```

**Catálogo mínimo (labels en español):**

| id | when | skipRag | prompt (idea) |
|----|------|---------|----------------|
| `day-summary` | global, empty | true | Resumen del día: vencidos, por vencer y bloqueadas en el portafolio. |
| `stalled` | global, empty | true | ¿Qué proyectos están estancados o en riesgo? |
| `overdue` | global | true | Listá tareas vencidas y por vencer con proyecto y due date. |
| `project-summary` | project, task | true | Resumí el estado del proyecto id=… (salud, bloqueos, próximos pasos). |
| `project-risks` | project, task | true | En el proyecto id=…, ¿qué tareas están bloqueadas o en riesgo? |
| `create-task-here` | project, task | true* | Creá una tarea en el proyecto id=… (pedime título y prioridad si faltan). |
| `task-summary` | task | true | Resumí la tarea id=… del proyecto id=… y sugerí el próximo paso. |
| `task-subtasks` | task | true | Proponé subtareas concretas para la tarea id=…. |
| `task-improve-desc` | task | false | Mejorá la descripción de la tarea id=… (pedí confirmación antes de escribir). |

\* `create-task-here` skipRag true: no necesita embeddings.

Los prompts **interpolan ids reales** desde `UiContext` en `selectQuickActions` (función pura que recibe ctx).

### 2.2 UI

`QuickActionChips`:

```tsx
export function QuickActionChips({
  actions,
  disabled,
  onPick,
  dense,
}: {
  actions: QuickAction[];
  disabled?: boolean;
  onPick: (a: QuickAction) => void;
  dense?: boolean;
})
```

- Empty state: `dense={false}`, full width buttons (como hoy).
- Composer: `dense`, horizontal scroll si hace falta (`flex gap-1 overflow-x-auto`), chips `text-[11px]`.
- Follow-ups: debajo del último assistant message en `ChatMessageList` solo si `message.id === lastAssistantId` && status idle.

### 2.3 Follow-up heuristics (simple)

```ts
export function selectFollowUps(ctx: UiContext, lastUserText: string): QuickAction[] {
  const t = lastUserText.toLowerCase();
  // si habló de crear / tarea → follow-ups de desglose / prioridad
  // si habló de resumen / salud → "listá bloqueadas", "proponé plan de la semana"
  // fallback: 2 genéricos
}
```

Sin NLP pesado: `includes` de verbos clave.

## 3. HU-03 — Slash commands

```ts
// src/ai/chat/slashCommands.ts
export interface SlashCommand {
  name: string; // "resumen"
  description: string;
  expand: (ctx: UiContext, rest: string) => string;
  skipRag: true;
}

export function parseSlashInput(raw: string): { kind: "command"; name: string; rest: string } | { kind: "plain"; text: string }
export function expandSlash(raw: string, ctx: UiContext): { text: string; skipRag: boolean; wasCommand: boolean }
export function listSlashCommands(): SlashCommand[]
```

| Comando | Expand (idea) |
|---------|----------------|
| `/ayuda` | Lista comandos y qué hace el asistente (texto local **sin** llamar al modelo? — **No**: v1 igual puede enviar un user message “Listá brevemente…” **o** insertar respuesta local. **Preferido v1:** expand a prompt corto al modelo para no inventar un path paralelo de “pseudo-respuestas”. |
| `/resumen` | Según ctx: proyecto o portafolio |
| `/vencidos` | Tareas vencidas / por vencer |
| `/salud` | Proyectos en riesgo / estancados |
| `/crear-tarea` | Si hay projectId, “Creá una tarea en proyecto id=… con: {rest}”; si rest vacío, pedir título |

**ChatInput:**

- Si `text.startsWith("/")` y no hay espacio aún, mostrar popover/lista bajo el textarea con `listSlashCommands()` filtrado.
- Tab o click inserta `/{name} `.
- Enter sigue enviando (con expand en el store, no en el input).

**Display (D CA-03.4):** el mensaje de usuario en el hilo guarda el **texto expandido** (transparente). Opcional: prefix visual no requerido en v1.

## 4. HU-05 — Copiar y regenerar

### 4.1 Copiar

En `ChatMessageBubble` (assistant), toolbar hover/focus:

```tsx
<button onClick={() => navigator.clipboard.writeText(plainText)}>Copiar</button>
```

`plainText` = parts text joined. Usar toast del proyecto si existe (`useToast` / store de 040); si no, `aria-live` local “Copiado”.

### 4.2 `regenerateLast()` en `useChatStore`

```ts
regenerateLast: () => Promise<void>;
```

Algoritmo:

1. Si `status` es `streaming` o `awaiting-confirmation` → no-op (o `stop()` primero si reintentar desde error — ver abajo).
2. Encontrar el **último** mensaje `role: "user"` en `messages`.
3. Extraer su texto.
4. Quitar del array de messages todo lo posterior a ese user message (incluido el assistant roto/previo).
5. Recortar `agentHistory`: eliminar el último user del history y todo lo que venga después (tool turns, assistant). Implementación robusta:  
   - Opción simple: mientras el último message del history no sea “estado antes del último user”, pop.  
   - **Implementación elegida:** guardar en el momento del `send` el `historyLengthBeforeTurn`; al regenerar, `agentHistory = agentHistory.slice(0, historyLengthBeforeTurn)` y borrar el assistant message del UI. Variable de módulo `lastTurnHistoryLength: number`.
6. Llamar `send(userText)` de nuevo (respetará skipRag del texto libre / heurística).

Para **Reintentar** en error: mismo `regenerateLast()` (el assistant puede estar vacío o parcial).

```ts
// en send(), tras armar history local antes de runAgentTurn:
lastTurnHistoryLength = agentHistory.length; // length ANTES de que runAgentTurn devuelva el history nuevo
// al final exitoso/error:
// agentHistory = result.history (como hoy)
// lastTurnUserText = trimmed
```

Al regenerar:

```ts
agentHistory = agentHistory.slice(0, lastTurnHistoryLength);
// messages: slice hasta incluir el user message; quitar assistant posterior
// luego send(lastTurnUserText) — O re-ejecutar sin duplicar el user bubble

```

**Importante:** `send()` hoy **siempre** pushea un nuevo user message. Para regenerar:

- Añadir opción `send(text, { regenerate?: boolean })`.  
- Si `regenerate: true`, **no** duplicar el bubble de usuario; solo crear assistant vacío nuevo y correr el turno.

## 5. HU-06 — Skip RAG + ventana de historial

### 5.1 Skip RAG

```ts
// skipRag.ts
const CONTINUATIONS = new Set(["continúa", "continua", "sí", "si", "ok", "dale", "prosegui", "proseguí", "sigue", "continuar"]);

export function shouldSkipRag(text: string, explicitFlag?: boolean): boolean {
  if (explicitFlag) return true;
  const n = text.trim().toLowerCase();
  if (CONTINUATIONS.has(n)) return true;
  // slash ya expande con flag; si llegara crudo:
  if (n.startsWith("/")) return true;
  return false;
}
```

En `send`:

```ts
const expanded = expandSlash(trimmed, ctx);
const text = expanded.text;
const skip = shouldSkipRag(text, expanded.skipRag || opts?.skipRag);

const ragContext =
  !skip && config.ragEnabled && gKey
    ? await buildRagContext(text, gKey).catch(() => "")
    : "";
```

Chips llaman `send(action.prompt, { skipRag: action.skipRag })`.

### 5.2 History window

```ts
// historyWindow.ts
export const AGENT_HISTORY_WINDOW = 12;

export function trimAgentHistory<T>(history: T[], max = AGENT_HISTORY_WINDOW): T[] {
  if (history.length <= max) return history;
  return history.slice(-max);
}
```

En `runAgentTurn` call:

```ts
history: trimAgentHistory(agentHistory),
```

No mutar `agentHistory` almacenado con el trim (solo la vista enviada). El history devuelto por el turno se reasigna completo como hoy; el trim es **por request**.

> Nota: si el provider devuelve history extendido y nosotros reasignamos `agentHistory = result.history`, el array local puede crecer > 12; eso está bien. Solo se trimea al **enviar**.

## 6. Cambios en `send` (contrato)

```ts
send: (text: string, opts?: { skipRag?: boolean; regenerate?: boolean }) => Promise<void>;
regenerateLast: () => Promise<void>;
setChatRouteSnapshot: (r: { pathname: string; search: string }) => void;
```

Flujo `send`:

1. Guard status / key (igual).
2. `expandSlash` + resolver `UiContext` + `formatUiContextBlock`.
3. UI messages: user bubble (si no regenerate) + assistant vacío.
4. `lastTurnHistoryLength = agentHistory.length`, `lastTurnUserText = text`.
5. RAG condicional.
6. `runAgentTurn({ history: trimAgentHistory(agentHistory), systemInstruction: buildSystemPrompt(..., block), ... })`.
7. Igual que hoy: callbacks, persist, errors.

## 7. Alternativas descartadas

| Idea | Por qué no en v1 |
|------|------------------|
| Segundo LLM para sugerencias | Duplica costo; contradice el objetivo de eficiencia |
| Filtrar tools por intent | Alto riesgo de cegar al agente; se puede estudiar en 051 |
| Comprimir historial con resumen LLM | Otro llamado; la ventana fija es más simple y predecible |
| Contexto solo en el user message (“[ctx] …”) | Contamina el hilo visible; system prompt es el lugar correcto |
| Store global de `focusedTaskId` aparte de URL | Duplica la fuente de verdad del Kanban |

## 8. Testing

| Módulo | Casos |
|--------|-------|
| `uiContext` | project route, task detail, missing ids, dashboard, unknown |
| `slashCommands` | expand con/sin proyecto, unknown slash, rest args |
| `skipRag` | flags, continuations, free text largo |
| `historyWindow` | <12, =12, >12 |
| `quickActions` | select por kind global/project/task |
| `systemPrompt` | bloque insertado |
| `useChatStore` (opcional) | regenerate no duplica user; skipRag no llama buildRag (mock) |

Verificación de UI: `smoke.md` manual.

## 9. Estilo visual (Principio IV)

- Chips: mismo lenguaje que empty state actual (`rounded-lg border … hover:border-primary/40`).
- No gradientes nuevos ni icon-spam; un icono pequeño opcional (`Sparkles`/`Zap`) solo en la fila de composer si aporta.
- Follow-ups: más suaves (`text-muted-foreground`), no compiten con `WriteConfirmCard`.
- Acciones de burbuja: aparecen en hover/focus-within para no ensuciar cada mensaje.
