# Design 060 — Consumo de tokens y requests (auditoría + recorte RAG-aware)

> Decisiones técnicas para `spec.md`. Sin dependencias npm nuevas. Sin bump de schema.
> Lógica testeable en módulos puros bajo `src/ai/usage/` y `src/ai/chat/`.

## 0. Mapa de archivos

| Área | Archivo | Rol |
|------|---------|-----|
| Nuevo | `src/ai/usage/types.ts` | `TokenUsage`, `UsageEvent`, `UsageSource` |
| Nuevo | `src/ai/usage/parseUsage.ts` | Extraer usage de chunk Gemini / JSON OpenAI; estimar fallback |
| Nuevo | `src/ai/usage/idb.ts` | `loadEvents` / `saveEvents` / prune 500 y 14 días |
| Nuevo | `src/ai/usage/aggregate.ts` | Totales hoy / por modelo / por `turnId` |
| Nuevo | `src/ai/usage/format.ts` | `formatTurnChip({ requests, tokens, estimated })` |
| Nuevo | `src/ai/chat/ragPolicy.ts` | `shouldAutoRag`, `shouldFocusIndex` |
| Nuevo | `src/ai/chat/workspaceIndex.ts` | `selectWorkspaceIndex(index, uiCtx)` |
| Nuevo | `src/ai/chat/toolResultCompact.ts` | `compactToolResults(history, maxChars)` |
| Nuevo | `src/ai/rag/queryCache.ts` | LRU 50, clave normalizada |
| Nuevo | `src/store/useAiUsageStore.ts` | Zustand: eventos, sesión, lastTurn, hydrate, record |
| Nuevo | `src/features/settings/AiUsageCard.tsx` | Card `#uso` |
| Nuevo | `src/features/assistant/TurnUsageChip.tsx` | Chip + popover |
| Existente | `src/ai/providers/types.ts` | `StreamTurnResult.usage?` |
| Existente | `src/ai/providers/gemini/streamTurn.ts` | Leer `usageMetadata` |
| Existente | `src/ai/providers/openai-compatible/index.ts` | `stream_options.include_usage` + parse `usage` |
| Existente | `src/ai/agent/runAgentTurn.ts` | `recordRequest` **por ronda**; devolver `rounds` + `usage[]` |
| Existente | `src/ai/gemini/systemPrompt.ts` | Índice seleccionado + bloque evidencia |
| Existente | `src/ai/rag/search.ts` | Consultar LRU antes de `embedText` |
| Existente | `src/store/useChatStore.ts` | Orquesta turnId, política RAG, compact, record |
| Existente | `src/store/useRagStore.ts` | `checkStale` ya existe; se invoca desde `send()` |
| Existente | `src/features/settings/SettingsPage.tsx` | Montar `AiUsageCard` |
| Existente | `src/features/settings/RagSettingsCard.tsx` | Copy CA-02.7 |
| Existente | `src/features/assistant/AssistantPanel.tsx` | Montar `TurnUsageChip` |

```
send(text)
  turnId = uuid()
  checkStale? ──► ragPolicy (autoRag, focusIndex)
       │
       ├─ autoRag ─► queryCache hit? ─yes─► vector local
       │                         └─no──► embedText + cache.set + UsageEvent(embedding)
       │              buildRagContext from vector/search
       ├─ skip/stale ─► ragContext = ""
       │
       ├─ index = focusIndex ? selectWorkspaceIndex(...) : full
       ├─ history' = compactToolResults(trimAgentHistory(agentHistory))
       │
       └─ runAgentTurn
            each streamTurn ─► parseUsage ─► recordRequest(model, tokens)
            return { rounds, usages[] }
       record UsageEvent(chat, turnId)
       lastTurnUsage = aggregate(turnId)
```

## 1. Tipos — `src/ai/usage/types.ts`

```ts
export type UsageSource = "provider" | "estimated";
export type UsageKind = "chat" | "embedding";

export type RagSkipReason =
  | "continuation"
  | "slash"
  | "stale"
  | "disabled"
  | "cache-hit"
  | "error"
  | "no-key";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  source: UsageSource;
}

export interface UsageEvent {
  id: string;
  ts: string; // ISO
  turnId: string;
  kind: UsageKind;
  provider: string;
  modelId: string; // calificado, p.ej. "gemini:gemini-2.5-flash"
  requests: number; // chat: rounds de streamTurn; embedding: 0 o 1
  rounds?: number; // solo chat
  usage: TokenUsage;
  rag?: {
    attempted: boolean;
    injected: boolean;
    skipReason?: RagSkipReason;
    indexFocused: boolean;
    hits: number;
  };
}

export interface TurnUsageView {
  turnId: string;
  requests: number;
  rounds: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimated: boolean;
  rag?: UsageEvent["rag"];
}
```

Claves IDB:

| Key | Contenido |
|-----|-----------|
| `aiUsage:events` | `UsageEvent[]` ya pruneado |

No hay tabla de días: `aggregate.ts` filtra por `ts` local `YYYY-MM-DD` al leer.

Prune al escribir: descartar eventos con `ts` > 14 días **o** recortar a los 500 más recientes (el más estricto).

## 2. Parseo — `src/ai/usage/parseUsage.ts`

```ts
export function parseGeminiUsage(meta: unknown): TokenUsage | null
export function parseOpenAiUsage(usage: unknown): TokenUsage | null
export function estimateTokensFromChars(chars: number): number // Math.max(1, Math.ceil(chars / 4))
```

Gemini (último chunk del stream, campos documentados del SDK):

- `promptTokenCount` → input
- `candidatesTokenCount` → output
- `totalTokenCount` → total (si falta, in+out)

OpenAI-compatible (objeto `usage` del último evento SSE, no de cada delta):

- `prompt_tokens` → input
- `completion_tokens` → output
- `total_tokens` → total

Si parsea campos no numéricos o el objeto es `null`/`undefined` → `null` (el caller estima). Un `0/0/0` legítimo (respuesta vacía) se acepta como `source: "provider"`.

Estimación de una ronda de chat (cuando `null`):

```
chars = systemInstruction.length + JSON.stringify(history).length + userMessage.length
inputTokens = estimateTokensFromChars(chars)
outputTokens = estimateTokensFromChars(text.length)
```

No se cuenta el schema de tools en la estimación v1 (aproximación consciente; la UI marca `~`).

## 3. `StreamTurnResult` y adaptadores

```ts
// providers/types.ts
export interface StreamTurnResult {
  text: string;
  toolCalls: AiToolCall[];
  usage?: TokenUsage;
}
```

**Gemini** (`streamTurn.ts`): en el `for await` del stream, si `chunk.usageMetadata` existe, guardar el último. Al return, `usage: parseGeminiUsage(lastMeta) ?? undefined`.

**OpenAI-compatible** (`index.ts`): el body pasa a:

```ts
{
  model, messages, tools, stream: true,
  stream_options: { include_usage: true },
}
```

El parser de chunks (mapping) ya ignora campos extra: si un evento trae `usage` y `choices` vacío (patrón OpenAI), capturarlo. `parseOpenAiUsage` al final.

Proveedores que rechacen `stream_options`: el `classifyError` no debe tratarlo como fatal si el stream igual funciona — si el POST 400 menciona `stream_options`, **reintentar una vez sin el campo** y marcar usage ausente. (Solo este fallback; no un detector genérico.)

## 4. `runAgentTurn` — 1 request por ronda

Hoy `recordRequest` vive en los returns terminales (1 vez por `send()`). Moverlo **dentro de `attemptTurn`** tras un `streamTurn` **ok**:

```ts
const result = await provider.streamTurn(...);
const tokens = result.usage?.totalTokens ?? estimate...;
rateLimiter.recordRequest(qualifiedModelId, tokens);
usages.push(result.usage ?? estimated);
rounds += 1;
```

No registrar request en el branch de error de `attemptTurn` si **no** hubo HTTP exitoso. CA-07.4: si **ninguna** ronda ok y el error es de red/proveedor, `runAgentTurn` devuelve `error` y `useChatStore` escribe un evento chat con `requests: 1`, `usage` estimado 0, para no perder el intento. Si hubo rondas ok y luego fallo, se registran solo las ok.

`AgentTurnResult` gana:

```ts
rounds: number;
usages: TokenUsage[];
```

## 5. Política RAG — `src/ai/chat/ragPolicy.ts`

```ts
export function shouldFocusIndex(input: {
  ragEnabled: boolean;
  status: RagStatus;
  entityCount: number;
}): boolean {
  return input.ragEnabled && input.status === "up-to-date" && input.entityCount > 0;
}

export function shouldAutoRag(input: {
  ragEnabled: boolean;
  status: RagStatus;
  entityCount: number;
  skip: false | "slash" | "continuation";
  hasGeminiKey: boolean;
}): { auto: boolean; skipReason?: RagSkipReason } {
  if (input.skip === "slash" || input.skip === "continuation") {
    return { auto: false, skipReason: input.skip };
  }
  if (!input.ragEnabled) return { auto: false, skipReason: "disabled" };
  if (!input.hasGeminiKey) return { auto: false, skipReason: "no-key" };
  if (input.status !== "up-to-date" || input.entityCount <= 0) {
    return { auto: false, skipReason: "stale" };
  }
  return { auto: true };
}
```

El caller distingue `slash` vs `continuation` con el `explicitFlag` / `shouldSkipRag` ya existentes. `status === "indexing"` se trata como no-fresco (`stale`) para no embeber a mitad de indexar.

`checkStale()` se invoca **await** al inicio de `send()` solo si `ragEnabled`. Si lanza, status efectivo = `error` → no-fresco.

## 6. Índice recortado — `src/ai/chat/workspaceIndex.ts`

Puro. Input: `WorkspaceIndex` + `UiContext`. Output: `WorkspaceIndex` (arrays vacíos en secciones omitidas).

Reglas: spec §5 / CA-03.*.

`buildSystemPrompt` recibe el índice ya seleccionado (no el workspace crudo) **o** un flag `indexMode`. Preferir pasar `Workspace` con `index` ya recortado en una copia superficial. En modo recortado, **omitir** secciones cuyo array quedó vacío (CA-03.6); no imprimir `(ninguno)` en esas secciones. El caso `workspace === null` no cambia.

```ts
const index = shouldFocus
  ? selectWorkspaceIndex(workspace.index, uiCtx)
  : workspace.index;
buildSystemPrompt(
  workspace ? { ...workspace, index } : null,
  ragContext,
  new Date(),
  screenContextBlock,
  { omitEmptyIndexSections: shouldFocus },
);
```

Bloque evidencia (solo si `ragContext` no vacío), insertado **después** del bloque RAG, **antes** de `## Estilo`:

```
## Prioridad de evidencia
El índice de abajo está recortado al foco de pantalla. El bloque "Contexto semántico" son hits del RAG (índice actualizado). Usalos antes de llamar list_projects, list_tasks o search_workspace. Si necesitás detalle de un id concreto, usá get_project / list_tasks filtrado por ese id. No re-descubras el portafolio si el foco + RAG alcanzan para responder.
```

## 7. Cache de query — `src/ai/rag/queryCache.ts`

```ts
const MAX = 50;
function normalize(q: string) { return q.trim().toLowerCase().replace(/\s+/g, " "); }

export function getCachedEmbedding(query: string): number[] | undefined
export function setCachedEmbedding(query: string, vector: number[]): void
```

Map con orden de inserción; al exceder 50, borrar la clave más vieja. Módulo singleton (como `rateLimiter`). No persistir.

`buildRagContext` / `semanticSearch`: si hay hit, **no** llamar `embedText`; cosine local igual. `semantic_search` tool también se beneficia (misma función).

## 8. Compactación — `src/ai/chat/toolResultCompact.ts`

```ts
export const TOOL_RESULT_MAX_CHARS = 4000;

export function compactToolResults(
  history: AiMessage[],
  maxChars?: number,
): AiMessage[]
```

Para cada elemento `role === "tool"`: `raw = JSON.stringify(result ?? null)`. Si `raw.length <= maxChars`, dejar igual (misma referencia si no hay cambios en el array → devolver el original si nadie se compactó, mismo truco que `trimAgentHistory`). Si excede:

```ts
result: {
  truncated: true,
  name,
  preview: raw.slice(0, maxChars),
}
```

En `send()`:

```ts
history: compactToolResults(trimAgentHistory(agentHistory)),
```

`agentHistory` en memoria **guarda** resultados completos (el modelo del turno actual y el chip de tools los necesitan). Solo se compacta la **proyección** al proveedor. Implicación: chats muy largos siguen ocupando RAM; el techo sigue siendo `MAX_PERSISTED_MESSAGES = 50` en UI, y `agentHistory` crece con el hilo. Fuera de alcance achicar RAM.

## 9. Store — `src/store/useAiUsageStore.ts`

```ts
interface AiUsageState {
  events: UsageEvent[];
  session: { requests: number; inputTokens: number; outputTokens: number };
  lastTurn: TurnUsageView | null;
  includeEstimated: boolean;
  loaded: boolean;
  hydrate: () => Promise<void>;
  record: (event: UsageEvent) => Promise<void>;
  clear: () => Promise<void>;
  setIncludeEstimated: (v: boolean) => void;
  exportEvents: () => UsageEvent[];
}
```

- `includeEstimated` en `localStorage` clave `hito:aiUsage:includeEstimated` (default true). No va a IDB ni al workspace.
- `hydrate()` al montar `AiUsageCard` y `AssistantPanel` (idempotente, como el chat).
- `record` actualiza memoria, sesión, `lastTurn` (recalcula por `turnId`), persiste pruneado.
- `clear` borra IDB + `events`; **no** resetea `session` ni `rateLimiter`. (Vaciar auditoría ≠ fingir que las ventanas están vacías.) Alternativa considerada: resetear sesión también. Decisión: **resetear `events` y `lastTurn`; dejar `session` y limiter.** El usuario que vacía quiere el historial, no mentir sobre la pestaña.

`useChatStore.send()` no importa el store al tope del módulo de forma circular: `record` se llama al final con `useAiUsageStore.getState().record(...)`.

## 10. Orquestación en `send()` (orden fijo)

1. Validaciones actuales (texto, key, streaming).
2. `turnId = uuid()`. Guardar en variable local del send (no en el state de chat).
3. Resolver `uiCtx` + slash + `skipRag` (050, sin cambios).
4. Si `ragEnabled`: `await useRagStore.getState().checkStale().catch(() => {})` y leer `status`/`meta`.
5. `ragPolicy` → `{ auto, skipReason }`, `focusIndex`.
6. RAG:
   - si `auto`: cache o `buildRagContext`; hits count; si embed real, `record(embedding)`.
   - si no: `ragContext = ""`.
7. `selectWorkspaceIndex` si `focusIndex`.
8. `runAgentTurn({ history: compactToolResults(trimAgentHistory(agentHistory)), ... })`.
9. `record(chat)` con `rounds`, suma de usages, `rag` snapshot.
10. `lastTurn` queda listo para el chip. `status` pasa a idle/error como hoy.

El `turnId` de un `regenerateLast` es **nuevo** (otro turno de uso).

## 11. UI

### 11.1 `TurnUsageChip`

Header de `AssistantPanel`, junto al chip de contexto de pantalla (050 D12). No se muestra si `!lastTurn` o si `status` es streaming/awaiting-confirmation.

Texto: `formatTurnChip` → `"2 req · 4.2k tok"` o `"2 req · ~4.2k tok"`.

Popover (componente `Popover` del design system si existe; si no, `title` nativo **no alcanza** — CA-05.4 pide click. Usar el patrón de dropdown/popover ya usado en el header, o un `Panel` anclado. Si no hay Popover shadcn en el repo, un `<div>` absoluto con click-outside, mismo patrón que menús del canvas).

Contenido del popover: lista de definición, `text-xs`, sin gráfico.

### 11.2 `AiUsageCard`

Misma anatomía que `RagSettingsCard`: `Card` + `CardHeader` (icono `BarChart3`) + `CardContent max-w-xl`. `id="uso"` en el `Card`.

Hoy / sesión / por modelo / lista 20 / toggle / exportar / vaciar.

Empty y sin-key: spec CA-06.8/06.9.

Export: `JSON.stringify({ exportedAt, events: exportEvents() }, null, 2)` download `hito-uso-YYYY-MM-DD.json`.

Vaciar: `ConfirmDialog` existente.

### 11.3 `RagSettingsCard`

Añadir al hint de `partial`:

> El asistente no embebe la pregunta hasta reindexar (ahorra 1 request) y usa el índice completo del workspace.

## 12. Errores (mapa rápido)

| Fallo | Comportamiento |
|-------|----------------|
| Sin `usage` del proveedor | `source: "estimated"` |
| 400 por `stream_options` | Reintento sin el campo; estimated |
| IDB write | Sesión en RAM; sin toast |
| `checkStale` throw | no-fresco |
| `embedText` throw | no inject; índice recortado si ya fresco |
| Abort mid-stream | rondas ok previas sí; la incompleta no |

## 13. Tests

| Archivo | Casos mínimos |
|---------|----------------|
| `parseUsage.test.ts` | Gemini meta ok; OpenAI usage ok; basura → null; estimate chars |
| `aggregate.test.ts` | suma por turnId; día local; filtro estimated |
| `ragPolicy.test.ts` | tabla D6–D9 (fresco/skip/stale/disabled/no-key/indexing) |
| `workspaceIndex.test.ts` | project no filtra otros; dashboard sin templates; full path no se usa aquí (identity = input) |
| `toolResultCompact.test.ts` | bajo umbral misma ref; sobre umbral `truncated`; no toca user/assistant |
| `queryCache.test.ts` | hit exacto normalizado; miss; evict 51.º |
| `format.test.ts` | `~` si estimated |
| `idb` / store | prune 500; prune 14d; record fail-open (mock) |
| `useChatStore` (extender ragFallback / regenerate) | stale no llama `buildRagContext`; fresco sí; skipRag fresco no llama embed; `recordRequest` 2 veces si el agent mockea 2 rondas |
| `runAgentTurn.test.ts` | 2 streamTurn ok → 2 `recordRequest` |
| `systemPrompt.test.ts` | evidence block solo con ragContext; índice pasado recortado se refleja |

No hace falta RTL pesado de las cards; smoke manual en `smoke.md` queda para el plan de implementación (fuera de este design).

## 14. Fuera de este design (igual que spec §6)

Tool routing, MAX_ROUNDS, improve/transform, gráficos, LRU persistido, top-N dashboard, telemetría, reindex auto.
