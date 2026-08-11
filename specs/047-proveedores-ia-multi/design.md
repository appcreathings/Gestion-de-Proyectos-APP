# Design 047 — Proveedores de IA intercambiables

> Complementa `spec.md`. Baseline: `SCHEMA_VERSION = 19`, **954 tests / 90 archivos** verdes
> (2026-08-11). Todas las decisiones D1–D15 del spec están fijadas; acá va el *cómo*.

## 0. Mapa del cambio

```
                       ANTES                                    DESPUÉS

useChatStore ──> ai/gemini/agent.runAgentTurn        useChatStore ──> ai/agent/runAgentTurn
                    │  (Content[], @google/genai)                        │  (AiMessage[], neutro)
                    ├─> createClient (SDK)                               ├─> getProvider(id)  ← import() diferido
                    ├─> getFunctionDeclarations                          │      ├─ GeminiProvider ──> ai/gemini/* (intacto)
                    ├─> modelSelector / rateLimiter                      │      └─ OpenAiCompatibleProvider ──> fetch + SSE
                    └─> classifyAiError                                  ├─> getFunctionDeclarations | toOpenAiTool
                                                                         ├─> modelSelector / rateLimiter (ids calificados)
improve.ts / generate-transform.ts ──> createClient                      └─> provider.classifyError
rag/search.ts ──> createClient (embeddings)
                                                      improve / generate-transform ──> getProvider(activo)
                                                      rag/search ──> getProvider("gemini")  ← anclado (D11)
```

Regla de oro del refactor: **`src/ai/gemini/` no se reescribe**. Se envuelve. Sus tests
(`agent.test.ts`, `errors.test.ts`, `systemPrompt.test.ts`) deben seguir pasando sin editarlos; si
hay que editarlos, es una regresión, no un test viejo.

## 1. La interfaz `AiProvider`

`src/ai/providers/types.ts` (nuevo):

```ts
export type ProviderId = "gemini" | "openai" | "zai" | "nvidia" | "opencode-zen";

/** Mensaje neutro: formato canónico del historial (D2). Nada de tipos del SDK acá. */
export type AiMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; toolCalls?: AiToolCall[] }
  | { role: "tool"; toolCallId: string; name: string; result: unknown };

export interface AiToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
}

export interface StreamTurnOptions {
  apiKey: string;
  /** Sobrescribe el baseUrl del catálogo (proxy propio, D7). */
  baseUrl?: string;
  /** Id **sin** prefijo de proveedor: el adaptador ya sabe quién es. */
  model: string;
  systemInstruction: string;
  history: AiMessage[];
  tools: AiTool[];
  signal?: AbortSignal;
  onTextDelta: (delta: string) => void;
}

export interface StreamTurnResult {
  /** Texto acumulado del turno (para reconstruir el mensaje assistant). */
  text: string;
  toolCalls: AiToolCall[];
  /** Tokens gastados si el proveedor los reporta; alimenta el rateLimiter. */
  usageTokens?: number;
}

export interface AiProvider {
  readonly id: ProviderId;
  validateKey(apiKey: string, baseUrl?: string): Promise<KeyValidation>;
  streamTurn(opts: StreamTurnOptions): Promise<StreamTurnResult>;
  classifyError(e: unknown): AiErrorKind;
  /** Solo Gemini lo implementa en esta spec (D11). */
  embed?(text: string, apiKey: string, model: string): Promise<number[]>;
}
```

`KeyValidation` y `AiErrorKind` se **reusan** de `src/ai/gemini/errors.ts` / `client.ts`; se mueven
a `src/ai/providers/types.ts` con re-export desde su ubicación actual para no romper imports
existentes de un saque.

`streamTurn` **no** hace fallback ni ejecuta tools: eso vive en el loop (D3). Recibe un modelo ya
resuelto y devuelve o lanza. El loop clasifica lo que lanza con `provider.classifyError`.

## 2. Catálogo de proveedores (datos, no código)

`src/ai/providers/catalog.ts` (nuevo):

```ts
export interface ProviderDefinition {
  id: ProviderId;
  label: string;
  kind: "gemini" | "openai-compatible";
  /** Base por defecto; el usuario puede sobrescribirla (D7). */
  defaultBaseUrl: string;
  /** Cómo viaja la key. */
  auth: { header: "Authorization"; scheme: "Bearer" } | { header: "x-goog-api-key" };
  /** Medido el 2026-08-11 — ver spec §2. `true` ⇒ exige baseUrl propia. */
  browserBlocked: boolean;
  /** Dónde saca el usuario la key. */
  keyUrl: string;
  keyHint: string;
}

export const PROVIDER_CATALOG: ProviderDefinition[] = [
  { id: "gemini", label: "Google Gemini", kind: "gemini",
    defaultBaseUrl: "https://generativelanguage.googleapis.com",
    auth: { header: "x-goog-api-key" }, browserBlocked: false,
    keyUrl: "https://aistudio.google.com/apikey", keyHint: "AIza…" },

  { id: "openai", label: "OpenAI (API key de platform)", kind: "openai-compatible",
    defaultBaseUrl: "https://api.openai.com/v1",
    auth: { header: "Authorization", scheme: "Bearer" }, browserBlocked: false,
    keyUrl: "https://platform.openai.com/api-keys", keyHint: "sk-…" },

  { id: "zai", label: "Z.ai (GLM)", kind: "openai-compatible",
    defaultBaseUrl: "https://api.z.ai/api/paas/v4",
    auth: { header: "Authorization", scheme: "Bearer" }, browserBlocked: false,
    keyUrl: "https://z.ai/manage-apikey/apikey-list", keyHint: "…" },

  { id: "nvidia", label: "NVIDIA NIM", kind: "openai-compatible",
    defaultBaseUrl: "https://integrate.api.nvidia.com/v1",
    auth: { header: "Authorization", scheme: "Bearer" }, browserBlocked: true,
    keyUrl: "https://build.nvidia.com/", keyHint: "nvapi-…" },

  { id: "opencode-zen", label: "OpenCode Zen", kind: "openai-compatible",
    defaultBaseUrl: "https://opencode.ai/zen/v1",
    auth: { header: "Authorization", scheme: "Bearer" }, browserBlocked: true,
    keyUrl: "https://opencode.ai/auth", keyHint: "…" },
];
```

`browserBlocked: true` es **dato medido**, no opinión: sin `Access-Control-Allow-Origin` el
navegador descarta la respuesta antes de que el JS la vea. Con `baseUrl` propia apuntando a un
proxy del usuario, el mismo adaptador funciona sin un `if` extra.

`src/ai/providers/index.ts`:

```ts
export async function getProvider(id: ProviderId): Promise<AiProvider> {
  const def = getProviderDef(id);
  if (def.kind === "gemini") {
    const { geminiProvider } = await import("./gemini");   // arrastra @google/genai
    return geminiProvider;
  }
  const { createOpenAiCompatibleProvider } = await import("./openai-compatible");
  return createOpenAiCompatibleProvider(def);
}
```

El `import()` diferido conserva el motivo original del patrón (`gemini/client.ts:5`): la app
tiene que bootear rápido para quien nunca configura el asistente.

## 3. Modelos: ids calificados y límites desconocidos

`src/ai/models.ts`:

```ts
export interface ModelDefinition {
  id: string;            // "gemini:gemini-2.5-flash"  ← AHORA calificado (D4)
  provider: ProviderId;  // nuevo
  modelId: string;       // "gemini-2.5-flash"  ← lo que viaja en el request
  label: string;
  category: …;           // sin cambios
  limits: ModelLimit;
  limitsUnknown?: boolean;  // nuevo (ver abajo)
  unlimitedTpm?: boolean; unlimitedRpm?: boolean; unlimitedRpd?: boolean;
  fallbackGroup: string;    // ahora también calificado: "gemini:flash", "openai:general"
  priority: number;
}

export function isModelAvailable(def: ModelDefinition): boolean {
  if (def.limitsUnknown) return true;   // ← nuevo: sin límites publicados ≠ sin cuota
  return def.limits.rpm > 0 || def.limits.tpm > 0 || def.limits.rpd > 0 || !!def.unlimitedTpm;
}

export function getModelsByProvider(p: ProviderId): ModelDefinition[];
export function qualify(p: ProviderId, modelId: string): string;   // "openai" + "gpt-5.4" → "openai:gpt-5.4"
export function splitQualified(id: string): { provider: ProviderId; modelId: string };
```

**Sin `limitsUnknown`, `isModelAvailable()` devuelve `false` para todo modelo con límites en 0** —
que es exactamente el caso de los proveedores nuevos, cuyos rate limits no publicamos. Sin este
flag, el selector no ofrecería ningún modelo de OpenAI/Z.ai y la feature "funcionaría" sin llamar
a nadie.

`rateLimiter` y `modelSelector` **no cambian de lógica**: ya son mapas por string. Lo único que
cambia es que la string ahora es calificada, y que `recordRequest`/`markSaturated` reciben el id
calificado. Sus tests se adaptan cambiando los ids de los fixtures.

Catálogo inicial mínimo por proveedor (ampliable sin tocar código):

| Proveedor | Modelos sembrados | Grupo de fallback |
|---|---|---|
| `gemini` | los 12 actuales, re-etiquetados con prefijo | `gemini:flash`, `gemini:flash-extended`, `gemini:pro`, `gemini:audio`, `gemini:embedding` |
| `openai` | `gpt-5.4`, `gpt-5.4-mini`, `gpt-5.4-nano` (`limitsUnknown`) | `openai:general` |
| `zai` | `glm-5.2`, `glm-4.7-flash`, `glm-4.5-air` (`limitsUnknown`) | `zai:general` |
| `nvidia` | vacío por defecto + entrada "modelo personalizado" (el usuario escribe el id) | `nvidia:general` |
| `opencode-zen` | vacío por defecto + "modelo personalizado" | `opencode-zen:general` |

Para `nvidia`/`opencode-zen` sembrar ids fijos sería mentir: su catálogo rota seguido (el `GET
/zen/v1/models` de OpenCode Zen listaba `gpt-5.6-*`, `claude-*`, `kimi-*`, `*-free` el 2026-08-11 y
va a ser otro dentro de un mes). Un campo de texto libre para el id de modelo es más honesto y no
caduca.

## 4. Config multi-key y migración

`src/ai/config.ts`:

```ts
export const AiProviderConfigSchema = z.object({
  apiKey: z.string().default(""),
  baseUrl: z.string().optional(),        // D7
  lastModel: z.string().optional(),      // recuerda el modelo por proveedor
});

export const AiConfigSchema = z.object({
  configVersion: z.literal(2).default(2),
  activeProvider: z.string().default("gemini"),
  providers: z.record(AiProviderConfigSchema).default({}),
  model: z.string().default("gemini:gemini-2.5-flash"),   // calificado
  confirmWrites: z.boolean().default(true),
  autoFallback: z.boolean().default(true),
  fallbackGroup: z.string().default("gemini:flash"),
  ragEnabled: z.boolean().default(true),
});
```

`loadAiConfig()` gana un paso de migración antes del `safeParse` (D10):

```ts
function migrate(raw: unknown): unknown {
  if (!raw || typeof raw !== "object") return raw;
  const r = raw as Record<string, unknown>;
  if (r.configVersion === 2) return r;
  // v1: { apiKey, model, confirmWrites, autoFallback, fallbackGroup, ragEnabled }
  const apiKey = typeof r.apiKey === "string" ? r.apiKey : "";
  const model = typeof r.model === "string" ? r.model : "gemini-2.5-flash";
  const group = typeof r.fallbackGroup === "string" ? r.fallbackGroup : "flash";
  return {
    ...r,
    configVersion: 2,
    activeProvider: "gemini",
    providers: apiKey ? { gemini: { apiKey } } : {},
    model: model.includes(":") ? model : `gemini:${model}`,
    fallbackGroup: group.includes(":") ? group : `gemini:${group}`,
    apiKey: undefined,
  };
}
```

`saveAiConfig` escribe siempre v2. **No hay migración de workspace y `SCHEMA_VERSION` se queda en
19**: `aiConfig` es una key suelta de IndexedDB (`src/ai/config.ts:32`), no parte del documento del
workspace — por eso mismo la key nunca viajó en un export y no debe empezar ahora.

Selectores derivados (evitan repetir `config.providers[config.activeProvider]?.apiKey ?? ""` en
seis lugares):

```ts
export function activeKey(c: AiConfig): string;
export function activeBaseUrl(c: AiConfig): string | undefined;
export function activeProviderId(c: AiConfig): ProviderId;
export function geminiKey(c: AiConfig): string;   // para RAG (D11)
export function hasKey(c: AiConfig, id: ProviderId): boolean;
```

`useAiConfigStore` pasa a:

```ts
saveAndValidateKey(providerId: ProviderId, apiKey: string): Promise<boolean>;
clearKey(providerId: ProviderId): Promise<void>;
setActiveProvider(providerId: ProviderId): Promise<void>;   // ajusta `model` al lastModel del proveedor
setBaseUrl(providerId: ProviderId, baseUrl: string): Promise<void>;
keyStatus: Record<ProviderId, KeyStatus>;                    // era un solo KeyStatus
```

El contrato **"solo se persiste lo validado"** se mantiene por proveedor.

## 5. Adaptador OpenAI-compatible

### 5.1 Request

```ts
POST {baseUrl}/chat/completions
Authorization: Bearer {apiKey}
Content-Type: application/json

{ "model": modelId,
  "messages": [{ role: "system", content: systemInstruction }, ...toOpenAiMessages(history), lastUser],
  "tools": tools.map(toOpenAiTool),
  "stream": true }
```

Nota: `defaultBaseUrl` de Z.ai (`…/api/paas/v4`) ya incluye el segmento de versión, igual que
`…/v1` en OpenAI/NVIDIA/Zen. El adaptador concatena `"/chat/completions"` y nada más — no inventa
`/v1`. La `baseUrl` se normaliza quitando la barra final.

### 5.2 Mapeo de historial (`mapping.ts`)

| Neutro | OpenAI | Gemini |
|---|---|---|
| `{role:"user", content}` | `{role:"user", content}` | `{role:"user", parts:[{text}]}` |
| `{role:"assistant", content, toolCalls}` | `{role:"assistant", content, tool_calls:[{id, type:"function", function:{name, arguments: JSON.stringify(args)}}]}` | `{role:"model", parts:[{text},{functionCall:{name,args}}]}` |
| `{role:"tool", toolCallId, name, result}` | `{role:"tool", tool_call_id, content: JSON.stringify(result)}` | `{role:"user", parts:[{functionResponse:{id,name,response}}]}` |

Cuatro funciones puras, todas testeables sin red:
`toOpenAiMessages`, `fromOpenAiDelta`, `toGeminiContents`, `fromGeminiContents`.
`fromGeminiContents` es además lo que convierte el snapshot viejo de `aiChat:last` (CA-03.2).

**`arguments` viaja como string JSON** en OpenAI y como objeto en Gemini. El mapping parsea con
`try/catch`: si el JSON viene roto (pasa con modelos chicos), la tool-call se descarta y se le
devuelve al modelo un `functionResponse` de error — el mismo camino que ya usa `callTool` para
args inválidos (`registry.ts`), o sea, el modelo se auto-corrige en la ronda siguiente.

### 5.3 Parseo de SSE (`sse.ts`)

`fetch` con `stream: true` devuelve `ReadableStream`. El parser:

1. `response.body.getReader()` + `TextDecoder("utf-8", { stream: true })`.
2. Buffer acumulado, corte por `\n\n`, cada bloque `data: {json}`; `data: [DONE]` termina.
3. **Un chunk de red puede partir una línea `data:` por la mitad** — por eso el buffer es
   persistente entre chunks y solo se consumen bloques completos. Test explícito con el JSON
   cortado en medio de un carácter multibyte.
4. `signal.aborted` ⇒ `reader.cancel()` + `DOMException("aborted", "AbortError")` para que
   `classifyError` lo mapee a `"aborted"` como hoy.

Acumulación de tool-calls en streaming: los deltas llegan como
`choices[0].delta.tool_calls[{index, id?, function:{name?, arguments?}}]`, con `name` solo en el
primer delta y `arguments` en pedazos. Se acumula **por `index`**, no por `id`.

### 5.4 Clasificación de errores (`openai-compatible/errors.ts`)

```ts
export function classifyOpenAiError(e: unknown): AiErrorKind {
  if (isAbort(e)) return "aborted";
  if (e instanceof HttpError) {
    if (e.status === 401 || e.status === 403) return "invalid-key";
    if (e.status === 400 && /api key|token/i.test(e.body)) return "invalid-key";
    if (e.status === 429) return /token|quota|daily/i.test(e.body) ? "quota-exhausted" : "rate-limit";
    if (e.status >= 500) return "unknown";
  }
  // fetch bloqueado: TypeError sin status. Offline REAL solo si el navegador lo dice.
  if (e instanceof TypeError) {
    return typeof navigator !== "undefined" && navigator.onLine === false ? "offline" : "cors-blocked";
  }
  return "unknown";
}
```

`AiErrorKind` gana `"cors-blocked"` con copy accionable (D12):

> «Tu navegador bloqueó la llamada a {proveedor} (CORS). Este proveedor no permite llamadas
> directas desde una web. Configurá una URL base propia (un proxy tuyo) en Ajustes → Asistente IA,
> o elegí otro proveedor.»

El clasificador de Gemini (`src/ai/gemini/errors.ts`) **se conserva tal cual**, incluido
`hasZeroQuota()`/`project-quota-zero` de la spec 031. Solo se generaliza el copy que dice "Gemini"
para que reciba el nombre del proveedor activo.

## 6. Loop agéntico único (`src/ai/agent/runAgentTurn.ts`)

Es el `runAgentTurn` de `gemini/agent.ts` con tres cambios quirúrgicos y **cero cambios de
comportamiento**:

1. `createClient` + `chat.sendMessageStream` → `provider.streamTurn(...)`.
2. `chat.getHistory(true)` → historial neutro que el loop mantiene él mismo (append de
   `{role:"assistant", content, toolCalls}` y de los `{role:"tool", …}` de cada resultado).
3. `classifyAiError(e)` → `provider.classifyError(e)`.

Todo lo demás se conserva **literal**: `MAX_ROUNDS = 8`, el bucle de fallback real de la spec 031
(`tried: Set`, solo `rate-limit`/`quota-exhausted` ameritan otro modelo, `markSaturated(id, 60)`,
`all-models-exhausted`), `executeCall` con `onConfirmWrite` para tools de escritura, `rawMessage`
crudo para el detalle técnico colapsable, `onModelSwitch`.

El fallback recorre solo modelos **del proveedor activo** (D5): `modelSelector.select()` ya filtra
por grupo, y los grupos ahora están calificados (`"gemini:flash"`), así que la restricción sale
gratis.

`src/ai/gemini/agent.ts` queda reducido a `geminiStreamTurn()` (crear cliente, `chats.create` con
`functionDeclarations`, consumir el stream, devolver `StreamTurnResult`). Sus tests actuales
cubren el loop → **se mueven** a `src/ai/agent/runAgentTurn.test.ts` con un `AiProvider` fake, y
lo que quede específico de Gemini se queda donde está.

## 7. Consumidores

| Consumidor | Cambio |
|---|---|
| `useChatStore.send()` | `config.apiKey` → `activeKey(config)`; `geminiHistory: Content[]` → `history: AiMessage[]`; `runAgentTurn` del nuevo módulo; el copy de `onModelSwitch` deja de hacer `.replace("gemini-", "")` y usa `splitQualified()` |
| `hydrateFromIdb` | si el snapshot trae `history` en forma Gemini (detectable por `parts`), lo pasa por `fromGeminiContents`; si tira, `history = []` (best-effort, ya es el patrón del archivo) |
| `improve.ts` / `generate-transform.ts` | `createClient` → `getProvider(activeProviderId(config))`; el fallback por grupo se mantiene, ahora con ids calificados. Para proveedores OpenAI-compatible usan `streamTurn` sin tools y parsean el JSON de la respuesta igual que hoy (`parseImproveResponse` no cambia) |
| `rag/search.ts` `embedText(text, apiKey)` | pasa a `embedText(text, geminiKey)` explícito y usa `provider.embed` de Gemini. Si no hay key de Gemini → lanza `AiErrorKind = "unknown"`… **no**: devuelve un error tipado `rag-unavailable` que `useChatStore` ya traga con `.catch(() => "")`. La UI de Ajustes muestra el toggle de RAG deshabilitado con la razón (D11) |
| `AiSettingsCard` | ver §8 |
| `AiModelSelector` | lista `getModelsByProvider(activeProviderId)`; para `nvidia`/`opencode-zen` agrega un input de "id de modelo personalizado" |
| `features/assistant/*` | textos "Gemini" → `label` del proveedor activo |

## 8. UI de Ajustes (un bloque, no cinco)

```
┌ Asistente IA ────────────────────────────────────────────────┐
│ Proveedor  [ Google Gemini            ▾ ]   ✓ key guardada   │
│            (el desplegable marca con ✓ los que ya tienen key)│
│                                                              │
│ API key    [ ••••••••••••          ] [Guardar] [🗑]  ● válida│
│            Obtener una key ↗  ·  se guarda solo en este      │
│            dispositivo (IndexedDB), nunca en workspace.json  │
│                                                              │
│ ⚠ (solo si browserBlocked) Este proveedor no permite         │
│   llamadas directas desde el navegador. Necesitás una URL     │
│   base propia (proxy):                                        │
│   URL base [ https://mi-proxy.workers.dev/v1        ]        │
│                                                              │
│ Modelo     [ Gemini 2.5 Flash          ▾ ]                   │
│ ☑ Confirmar antes de escribir   ☑ Fallback automático        │
│ Cadena     [ Flash (rápido…)           ▾ ]                   │
│ ☑ Contexto semántico (RAG)  — requiere key de Gemini         │
└──────────────────────────────────────────────────────────────┘
```

Solo se ve el bloque del proveedor **seleccionado**. Cambiar el selector no cambia el proveedor
activo hasta que hay key válida — o sí lo cambia y el chat avisa "configura tu key"; **elegido:
cambia el activo igual** (más simple, y el chat ya sabe avisar: CA-01.6).

Componentes reusados: `Card`, `Select`, `Input`, `Button`, `Badge`, `Checkbox`, `Label`,
`fieldAria`/`useFieldErrors` — los mismos que ya usa `AiSettingsCard` hoy. Cero componentes nuevos.

Validación de `baseUrl` (CA-04.4): `https://` obligatorio salvo `http://localhost` /
`http://127.0.0.1`. Reusar el patrón de `normalizeTaskLinkUrl` como referencia de estilo, **sin**
reusar la función (semántica distinta: acá no se antepone protocolo, se exige).

## 9. Estrategia de tests

Nuevos archivos, todos Vitest puro sin DOM (el repo no tiene RTL — ver decisión C de la spec 045):

| Test | Cubre |
|---|---|
| `src/ai/providers/openai-compatible/mapping.test.ts` | ida y vuelta de los 3 tipos de mensaje; `arguments` string↔objeto; JSON de args roto; tool-calls acumulados por `index` |
| `src/ai/providers/openai-compatible/sse.test.ts` | `data:` partido entre chunks; multibyte partido; `[DONE]`; línea vacía; `event:` ignorado; abort a mitad |
| `src/ai/providers/openai-compatible/errors.test.ts` | 401/403/429(token vs rate)/500; `TypeError` con `navigator.onLine` true → `cors-blocked` y false → `offline` |
| `src/ai/providers/catalog.test.ts` | todo `browserBlocked` tiene `keyUrl`; ids únicos; `defaultBaseUrl` sin barra final |
| `src/ai/config.migration.test.ts` | v1→v2 con key, sin key, ya-v2, corrupto; `model`/`fallbackGroup` calificados; **la key sobrevive** |
| `src/ai/models.qualified.test.ts` | `qualify`/`splitQualified` round-trip; `isModelAvailable` con `limitsUnknown`; `getModelsByProvider` |
| `src/ai/agent/runAgentTurn.test.ts` | el loop contra un `AiProvider` **fake**: rondas, tools, confirmación de escritura, fallback, `all-models-exhausted`, abort (migra lo que hoy cubre `gemini/agent.test.ts`) |
| `src/store/useAiConfigStore.multi.test.ts` | guardar key de A no borra la de B; `keyStatus` por proveedor; cambio de activo |
| `src/ai/keys-never-exported.test.ts` | **CA-06.2**: config con N keys → export del workspace no contiene ninguna |

Los tests existentes de `gemini/errors.test.ts` y `systemPrompt.test.ts` **no se tocan**.
Los de `modelSelector.test.ts`/`rateLimiter.test.ts` se adaptan solo en los ids de los fixtures.

## 10. Smoke manual (obligatorio, por proveedor)

No es opcional ni marcable sin hacerlo — la spec 044 se saltó su smoke y costó la spec 045
entera. Contra `npm run dev`:

1. **Gemini** (regresión): chat con tool de lectura + una escritura confirmada; key inválida;
   cambio de modelo. Debe verse **idéntico a hoy**.
2. **Un OpenAI-compatible con key real** (Z.ai u OpenAI, lo que el usuario tenga): streaming
   visible, una tool de lectura, una escritura con confirmación, botón Detener.
3. **CORS**: configurar `nvidia` **sin** baseUrl y forzar el envío → debe aparecer el mensaje
   `cors-blocked`, no "sin conexión".
4. **Cambio de proveedor a mitad de conversación**: el contexto anterior se conserva.
5. **Migración**: partir de un IndexedDB con `aiConfig` v1 (se puede sembrar a mano desde
   DevTools) → tras recargar, Gemini activo con la key intacta y sin re-validar.

## 11. Orden de implementación y por qué

A (tipos+catálogo) → B (modelos calificados) → C (config+store) → D (adaptador OpenAI) →
E (adaptador Gemini + loop único) → F (consumidores) → G (UI) → H (tests+smoke+cierre).

La razón del orden: **D antes que E**. Escribir primero el adaptador nuevo obliga a que la
interfaz `AiProvider` sea realmente neutra; si se empieza envolviendo Gemini, la interfaz termina
siendo "Gemini con otro nombre" y el segundo adaptador no entra sin deformarla.
