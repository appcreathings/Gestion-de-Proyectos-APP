# Spec 047 — Proveedores de IA intercambiables para el asistente

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/047-proveedores-ia-multi/` · Fecha: 2026-08-11
> Baseline al empezar: `SCHEMA_VERSION` **19** (sin bump — la config de IA no vive en el workspace)
> Depende de (reusa, no re-implementa): Spec 006 (registry de modelos, `rateLimiter`,
> `modelSelector`), Spec 007 (RAG semántico), Spec 012 (patrón de fallback en `improve.ts`),
> Spec 031 (resiliencia de errores y bucle de fallback real en `agent.ts`).
> Principios: **I** (local-first: las keys nunca salen del dispositivo), **IV** (diseño limpio: el
> error tiene que decir la verdad, incluido "este proveedor no se puede llamar desde el navegador"),
> **V** (simplicidad incremental: una abstracción con dos adaptadores, no cinco integraciones),
> **VI** (migrabilidad: la config existente migra sola, sin que el usuario reconfigure nada).

## 1. Contexto

Hoy el asistente está cableado a **Gemini** de punta a punta:

| Capa | Archivo | Acoplamiento actual |
|---|---|---|
| Config | `src/ai/config.ts` | `AiConfigSchema` tiene **una sola** `apiKey` (string) y `model` con default `"gemini-2.5-flash"` |
| Catálogo | `src/ai/models.ts` | `MODEL_REGISTRY` y `FALLBACK_CHAINS` son 100% ids de Gemini/Gemma |
| Transporte | `src/ai/gemini/client.ts` | `createClient()` hace `import("@google/genai")` diferido; `validateApiKey()` usa `ai.models.list()` |
| Loop agéntico | `src/ai/gemini/agent.ts` | `ai.chats.create({ tools: [{ functionDeclarations }] })`, historial `Content[]` del SDK, hasta 8 rondas |
| Herramientas | `src/ai/tools/schema.ts` | `toFunctionDeclaration()` produce `{ name, description, parametersJsonSchema }` — forma de Gemini |
| Errores | `src/ai/gemini/errors.ts` | `AiErrorKind` + copy que nombra "Gemini"; parsea el JSON de error de Google (`quota_limit_value: 0`) |
| RAG | `src/ai/rag/search.ts` | `embedText()` usa `ai.models.embedContent` con modelos `gemini-embedding-*` |
| Otros consumidores | `src/ai/improve.ts`, `src/ai/generate-transform.ts` | mismos `createClient` + `classifyAiError` + `rateLimiter` |
| Estado | `src/store/useChatStore.ts` | variable de módulo `geminiHistory: Content[]`, persistida en IndexedDB (`aiChat:last`) |
| UI | `src/features/settings/AiSettingsCard.tsx` | título "Asistente IA (Gemini)", un solo campo de key, copy de Google AI Studio |

El usuario quiere **elegir entre varios proveedores de API key** para el mismo chat: OpenCode Zen,
Z.ai, NVIDIA (keys gratuitas de NIM), Codex/OpenAI, además del Gemini actual — y que **sumar el
siguiente proveedor sea barato**.

## 2. El hallazgo que define el alcance: CORS

Esta app es un **SPA sin backend** (Vite + Vercel estático; `vercel.json` solo tiene
redirects/rewrites/headers, no hay `api/` ni funciones serverless). Todo request sale del
**navegador**, así que un proveedor solo es usable si responde con cabeceras CORS.

**Medición real hecha el 2026-08-11** (preflight `OPTIONS` con `Origin: https://example.com` +
`Access-Control-Request-Headers: authorization,content-type`, y `POST` real con key inválida):

| Proveedor | Endpoint probado | Preflight | `Access-Control-Allow-Origin` | Veredicto |
|---|---|---|---|---|
| **Gemini** | `generativelanguage.googleapis.com/v1beta/models` | 200 | ✅ echo del origin + `allow-headers: x-goog-api-key,content-type` | ✅ usable (es lo que ya funciona hoy) |
| **OpenAI** | `api.openai.com/v1/chat/completions` | 200 | ✅ echo del origin + `allow-headers: authorization,content-type`, `max-age: 86400` | ✅ usable |
| **Z.ai** | `api.z.ai/api/paas/v4/chat/completions` | 200 | ✅ echo del origin + `allow-methods: POST`; el `POST` real (401) **también** trae ACAO | ✅ usable |
| **NVIDIA NIM** | `integrate.api.nvidia.com/v1/chat/completions` | 200 pero **sin** ACAO (solo `Vary`) | ❌ | ❌ bloqueado en navegador |
| **OpenCode Zen** | `opencode.ai/zen/v1/chat/completions` | **404 HTML del sitio** (no hay handler de `OPTIONS`); el `POST` responde 401/JSON **sin** ACAO | ❌ | ❌ bloqueado en navegador |

El caso de NVIDIA está además confirmado fuera de nuestra medición: hay un pedido abierto en el
foro de desarrolladores de NVIDIA para que habiliten CORS / un header equivalente al
`anthropic-dangerous-direct-browser-access` justamente sobre
`https://integrate.api.nvidia.com/v1/chat/completions`.

**Revisión de documentación oficial (2026-08-11), por pedido explícito:**

- `docs.api.nvidia.com/nim/reference/models-1` es un índice de categorías de modelos, sin
  especificación de API. La página real (`.../llm-apis`) confirma lo que ya usamos:
  base `https://integrate.api.nvidia.com`, endpoint `POST /v1/chat/completions`, formato
  **OpenAI-compatible**. **No documenta CORS ni uso desde navegador** — o sea, nada en la doc
  oficial contradice la medición: el adaptador OpenAI-compatible le sirve, pero solo a través de
  una URL base propia (D7).
- `opencode.ai/docs/es/sdk/` **no es el gateway Zen**: es el cliente JS del **servidor local de
  opencode** (`127.0.0.1:4096` por defecto), pensado para Node, con endpoints de sesiones/archivos
  /agentes — no `/chat/completions` con API key. No habilita a Zen desde el navegador y **no
  cambia D7**. Abre otro camino distinto (hablarle al opencode local del usuario), evaluado y
  descartado en **D16**.

**Consecuencia:** NVIDIA y OpenCode Zen **no pueden ser proveedores de primera clase con key
directa** sin romper el "sin backend". Pero ambos son **OpenAI-compatible**, así que quedan
soportados por el mismo adaptador vía **URL base personalizada** (D7): quien quiera usarlos pone
la URL de su propio proxy (un Worker de Cloudflare de 10 líneas, su LAN, LiteLLM, lo que sea).
Nosotros no shipeamos ni hosteamos ese proxy.

Guía operativa para armarlo: **`PROXY-CLOUDFLARE.md`** en esta misma carpeta (Cloudflare Workers,
plan gratuito, conserva el streaming, **sin cambios en el código de la app**). Apps Script también
sirve como proxy y ya hay precedente en el repo (`src/integrations/outbound/email-via-apps-script.ts`
evita el preflight con `Content-Type: text/plain`), pero `UrlFetchApp` buffea la respuesta entera:
obligaría a `stream: false` y a agregar `supportsStreaming`/`endpointStyle` al catálogo. Por eso la
guía recomendada es Cloudflare.

Dato secundario útil: el catálogo real de OpenCode Zen (`GET /zen/v1/models`, verificado)
incluye modelos `gpt-5.x-codex`, `claude-*`, `glm-*`, `kimi-*`, `deepseek-*` y varios `*-free`.
O sea: **"Codex" es alcanzable vía OpenCode Zen con proxy**, además de vía OpenAI directo.

## 3. Objetivo

1. Introducir una **interfaz `AiProvider`** con dos adaptadores: `gemini` (envuelve lo existente)
   y `openai-compatible` (parametrizado por `baseUrl`/headers), de forma que agregar un proveedor
   nuevo sea **agregar una entrada de datos al catálogo**, no una integración nueva.
2. Permitir **N API keys guardadas a la vez** (una por proveedor), con un proveedor activo
   seleccionable desde Ajustes, todo device-local en IndexedDB.
3. Que **cambiar de proveedor no rompa la conversación en curso**: el historial del chat pasa a un
   formato neutro y cada adaptador lo traduce.
4. Que **todo lo que hoy funciona con Gemini siga funcionando idéntico** sin que el usuario
   reconfigure nada (migración automática de la config actual).
5. Que el error diga la verdad: si un proveedor está bloqueado por CORS, el mensaje lo dice y
   ofrece la salida (URL personalizada), en vez de mentir con "sin conexión a internet".

## 4. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | **Interfaz `AiProvider`** (`validateKey`, `streamTurn`, `classifyError`, `embed?`) con **dos** implementaciones: `GeminiProvider` (envuelve `@google/genai`, tal cual hoy) y `OpenAiCompatibleProvider` (`fetch` + SSE contra `/chat/completions`). Los proveedores concretos son **datos** en `PROVIDER_CATALOG`, no clases. | Cuatro de los cinco proveedores pedidos hablan el dialecto OpenAI; una sola implementación los cubre a todos y al siguiente que aparezca (Principio V). |
| **D2** | **Historial neutro** `AiMessage[]` (`{ role, content, toolCalls?, toolResults? }`) como formato canónico en `useChatStore` y en el snapshot de IndexedDB. Cada adaptador traduce a/desde su forma nativa (`Content[]` de Gemini, `messages[]` de OpenAI). | Es lo que permite cambiar de proveedor sin perder la conversación (HU-03) y saca `@google/genai` de los tipos del store. |
| **D3** | **Un solo loop agéntico** en `src/ai/agent/runAgentTurn.ts`, provider-agnóstico (rondas, confirmación de escrituras, ejecución de tools, fallback). El adaptador solo aporta `streamTurn`: recibe historial neutro + tools y emite deltas de texto y tool-calls. | Duplicar el loop por proveedor es el error caro; el loop es donde vive la lógica de negocio (specs 006/031). |
| **D4** | **Ids de modelo calificados**: `"<provider>:<model>"` (ej. `"gemini:gemini-2.5-flash"`, `"openai:gpt-5.4-mini"`, `"zai:glm-5.2"`). `ModelDefinition` gana `provider`. El `rateLimiter` (mapa por string) y `modelSelector` pasan a operar sobre ids calificados sin cambiar su lógica. | Evita colisiones (`glm-5.2` existe en Z.ai y en OpenCode Zen) y hace explícito a quién se le está pegando. |
| **D5** | **El fallback automático opera dentro del proveedor activo.** Fallback *entre* proveedores (ej. Gemini agotado → seguir en Z.ai) queda **fuera de alcance** de esta spec. | Cambiar de proveedor a mitad de turno cambia el tokenizer, el soporte de tools y el costo sin que el usuario lo pida; es una decisión de producto aparte. |
| **D6** | Proveedores de **primera clase** (key directa, funcionan en navegador, verificado): `gemini`, `openai`, `zai`. | Es lo que la medición de §2 respalda. Nada de shipear un botón que falla en runtime. |
| **D7** | `nvidia` y `opencode-zen` se incluyen en el catálogo marcados `browserBlocked: true`: la UI los muestra, explica que necesitan una **URL base propia (proxy)**, y solo habilita el guardado de la key cuando el usuario configuró esa URL. Con `baseUrl` puesta, funcionan por el mismo adaptador que Z.ai/OpenAI. | Cumple el pedido sin mentir ni meter backend. La URL base personalizada es una línea de config, no código nuevo. |
| **D8** | **"Codex" ≠ Codex CLI.** Codex CLI se autentica con suscripción de ChatGPT (OAuth), no con una key pegable; **no se implementa ningún flujo OAuth de ChatGPT en esta app**. El proveedor se llama **"OpenAI (API key de platform)"** y cubre los modelos `gpt-*`/`*-codex` de la API. Los `gpt-5.x-codex` de OpenCode Zen quedan alcanzables por D7. | Es la única lectura implementable de "codex" en una app web sin backend. |
| **D9** | **Config multi-key**: `AiConfigSchema` pasa a `{ configVersion, activeProvider, providers: Record<id, { apiKey, baseUrl?, model? }>, model, confirmWrites, autoFallback, fallbackGroup, ragEnabled }`. Sigue viviendo **solo** en IndexedDB (`aiConfig`), nunca en `workspace.json`, export, backup ni logs. | Principio I sin excepciones. |
| **D10** | **Migración silenciosa** (`configVersion 1 → 2`): `apiKey` suelta → `providers.gemini.apiKey`; `model: "gemini-2.5-flash"` → `"gemini:gemini-2.5-flash"`; `activeProvider: "gemini"`. Quien ya tenía key validada **no vuelve a validar nada**. **Sin bump de `SCHEMA_VERSION`** (19) porque `aiConfig` no es workspace. | Principio VI. |
| **D11** | **RAG sigue anclado a Gemini.** Si hay key de Gemini guardada, los embeddings se calculan con ella **aunque el proveedor de chat sea otro**. Si no la hay, `ragEnabled` se muestra desactivado con aviso honesto y el chat funciona sin contexto semántico (ya es best-effort en `useChatStore`). Embeddings de otros proveedores: **fuera de alcance**. | Un índice con embeddings de dos modelos distintos no es comparable (dimensiones y espacio vectorial distintos); re-indexar al cambiar de proveedor es una feature aparte. |
| **D12** | `AiErrorKind` gana **`cors-blocked`**. Un `fetch` bloqueado por CORS llega como `TypeError` con `navigator.onLine === true`; hoy `classifyAiError` lo mapearía a `offline` — mensaje falso. La clasificación pasa a ser **por proveedor**: el clasificador de Gemini se conserva **intacto** (incluido `quota_limit_value: 0` de la spec 031) y el OpenAI-compatible clasifica por status HTTP + body. | Principio IV: el error tiene que ser accionable. |
| **D13** | **Sin dependencias npm nuevas.** El adaptador OpenAI-compatible se implementa con `fetch` + parseo de SSE a mano (~120 líneas); no se agrega el SDK `openai`. El SDK de Gemini sigue cargándose con `import()` diferido. | El SDK de OpenAI son ~cientos de KB para lo que aquí es un POST con streaming; el patrón lazy actual existe justamente para no inflar el bundle. |
| **D14** | Las tools se serializan a **dos formas** desde el mismo Zod: la actual `toFunctionDeclaration()` (Gemini, sin tocar) y una nueva `toOpenAiTool()` (`{ type: "function", function: { name, description, parameters } }`), ambas en `src/ai/tools/schema.ts`. | El registry de tools y sus tests no se tocan: solo se agrega un serializador. |
| **D15** | Copy en español/tuteo, reusando `Card`/`Input`/`Select`/`Badge`/`Button` ya usados en `AiSettingsCard`. Sin look nuevo. | Consistencia con el resto de Ajustes. |
| **D16** | **El SDK de opencode (servidor local en `127.0.0.1:4096`) queda fuera de alcance.** Es una tercera forma de API (sesiones/agentes, no `/chat/completions`), exige que el usuario tenga opencode corriendo, y su modelo de tools es el del agente de opencode — no el registry de esta app. Si más adelante se quiere, entra como un `kind: "opencode-local"` nuevo **sin tocar** los dos adaptadores de esta spec: para eso existe la interfaz. | Un tercer adaptador con semántica ajena duplicaría el costo de la spec por un caso de uso que el usuario no pidió (pidió "API keys de proveedores"). |

## 5. Historias de usuario y criterios de aceptación

### HU-01 — Elegir proveedor y guardar su key · **núcleo**

**Como** usuario, **quiero** conectar la API key del proveedor que ya pago o tengo gratis
**para** no depender de una sola cuenta de Google.

- **CA-01.1** En Ajustes → Asistente IA hay un selector de **proveedor** con, al menos: Gemini,
  OpenAI, Z.ai, NVIDIA, OpenCode Zen.
- **CA-01.2** Cada proveedor tiene su propio campo de API key, su propio estado
  (`unset`/`validating`/`valid`/`invalid`/`network-error`) y su propio enlace "obtener una key".
- **CA-01.3** Guardar una key **solo persiste si la validación contra el proveedor pasa** (mismo
  contrato que hoy en `useAiConfigStore.saveAndValidateKey`).
- **CA-01.4** Guardar la key de un proveedor **no borra** las de los demás. Borrar la de uno no
  toca las otras.
- **CA-01.5** El selector de modelo muestra solo los modelos del **proveedor activo**, con su
  etiqueta de límites cuando se conocen y "límites no publicados" cuando no.
- **CA-01.6** Si el proveedor activo no tiene key, el chat muestra el mismo aviso de
  "configura tu API key" que hoy, apuntando a ese proveedor por nombre.

### HU-02 — Chatear con cualquier proveedor, con las mismas herramientas

**Como** usuario, **quiero** que el asistente lea y escriba mis datos igual sin importar el
proveedor **para** que cambiar no me degrade la app.

- **CA-02.1** Con `openai` o `zai` activos, el chat responde en **streaming** (el texto aparece
  progresivamente, no de golpe).
- **CA-02.2** Las **tool-calls funcionan**: el modelo puede listar proyectos (tool de lectura) y
  crear/modificar (tool de escritura) con la **misma confirmación previa** (`confirmWrites`) que
  con Gemini.
- **CA-02.3** El botón "Detener" aborta el turno en cualquier proveedor (`AbortSignal`).
- **CA-02.4** El límite de 8 rondas y el mensaje de "límite de pasos" se comportan igual.
- **CA-02.5** Con Gemini activo, el comportamiento es **byte-por-byte el de hoy**: mismo fallback
  de la spec 031, mismo detalle técnico crudo colapsable, mismo `quota_limit_value: 0`.

### HU-03 — Cambiar de proveedor sin perder la conversación

- **CA-03.1** Con una conversación en curso, cambiar de proveedor en Ajustes y seguir escribiendo
  **conserva los mensajes anteriores** como contexto (historial neutro, D2).
- **CA-03.2** El snapshot persistido (`aiChat:last`) sobrevive al cambio; si el snapshot viejo
  está en formato Gemini, se convierte al neutro al hidratar (y si la conversión falla, se
  descarta en silencio — el chat ya es descartable).
- **CA-03.3** "Nueva conversación" sigue limpiando todo igual.

### HU-04 — Proveedores bloqueados por navegador, dichos con honestidad

- **CA-04.1** NVIDIA y OpenCode Zen aparecen en la lista marcados como "requiere URL propia
  (proxy)", con una explicación de una línea de por qué.
- **CA-04.2** Con `baseUrl` personalizada configurada y alcanzable, funcionan exactamente como
  Z.ai/OpenAI (streaming + tools).
- **CA-04.3** Si un request falla por CORS, el mensaje es el de `cors-blocked` — que nombra el
  problema y la salida — **no** "sin conexión a internet".
- **CA-04.4** La `baseUrl` personalizada se valida como URL `https://` (o `http://localhost`) antes
  de guardarse.

### HU-05 — Migración invisible

- **CA-05.1** Un usuario con la config vieja (`{ apiKey: "AIza…", model: "gemini-2.5-flash" }`) abre
  la app tras la actualización y **no tiene que hacer nada**: proveedor activo Gemini, key intacta,
  modelo equivalente, estado `valid`.
- **CA-05.2** `SCHEMA_VERSION` sigue en **19**; no hay migración de workspace.
- **CA-05.3** Un `aiConfig` corrupto o de una versión desconocida cae al default sin romper la app
  (comportamiento actual de `loadAiConfig`).

### HU-06 — Las keys no se filtran

- **CA-06.1** Ninguna key aparece en `workspace.json`, ni en export/backup, ni en el snapshot del
  chat, ni en `console`, ni en el detalle técnico crudo del error (que hoy sí se muestra en UI).
- **CA-06.2** Test automatizado que exporta un workspace con las N keys configuradas y verifica que
  el JSON resultante no contiene ninguna.

## 6. Requisitos no funcionales

- **Sin dependencias npm nuevas** (D13). Si la implementación demuestra que hace falta una,
  documentar por qué antes de agregarla.
- **Sin backend**: cero funciones serverless, cero proxy propio shipeado.
- El adaptador OpenAI-compatible se carga con `import()` diferido, igual que el de Gemini, para no
  entrar al bundle inicial.
- Tests unitarios (Vitest, sin DOM) de: traducción de historial en ambos sentidos, serialización de
  tools a forma OpenAI, parseo de SSE (incluidos chunks partidos por la mitad), clasificación de
  errores por proveedor, migración de config, ids calificados en `modelSelector`/`rateLimiter`.
- El conteo de tests **solo puede subir**.

## 7. Archivos afectados (previsto)

| Archivo | Cambio |
|---|---|
| `src/ai/providers/types.ts` | **nuevo** — `AiProvider`, `AiMessage`, `StreamTurnOptions`, `ProviderId` |
| `src/ai/providers/catalog.ts` | **nuevo** — `PROVIDER_CATALOG` (id, label, baseUrl, authHeader, docsUrl, `browserBlocked`, modelos) |
| `src/ai/providers/gemini/index.ts` | **nuevo** — adaptador que envuelve `src/ai/gemini/*` (que se conserva) |
| `src/ai/providers/openai-compatible/index.ts` | **nuevo** — adaptador `fetch` + SSE |
| `src/ai/providers/openai-compatible/sse.ts` | **nuevo** — parser de `text/event-stream` |
| `src/ai/providers/openai-compatible/mapping.ts` | **nuevo** — `AiMessage[] ↔ messages[]`, tools, tool_calls |
| `src/ai/providers/openai-compatible/errors.ts` | **nuevo** — clasificador por status/body |
| `src/ai/providers/index.ts` | **nuevo** — `getProvider(id)` con `import()` diferido |
| `src/ai/agent/runAgentTurn.ts` | **nuevo** — loop agéntico provider-agnóstico (migra la lógica de `gemini/agent.ts`) |
| `src/ai/gemini/agent.ts` | pasa a ser solo el `streamTurn` de Gemini (o queda como thin wrapper) |
| `src/ai/gemini/errors.ts` | agrega `cors-blocked`; copy generalizado; el clasificador de Google se conserva |
| `src/ai/config.ts` | `AiConfigSchema` v2 + migración (D9/D10) |
| `src/ai/models.ts` | `provider` en `ModelDefinition`, ids calificados, `limitsUnknown`, catálogos de OpenAI/Z.ai |
| `src/ai/modelSelector.ts`, `src/ai/rateLimiter.ts` | operan sobre ids calificados (lógica intacta) |
| `src/ai/tools/schema.ts` | agrega `toOpenAiTool()` (D14) |
| `src/ai/rag/search.ts` | `embedText` toma la key de **Gemini** explícitamente (D11) |
| `src/ai/improve.ts`, `src/ai/generate-transform.ts` | pasan por `getProvider()` en vez de `createClient` |
| `src/store/useAiConfigStore.ts` | acciones por proveedor (`saveAndValidateKey(providerId, key)`, `setActiveProvider`, `setBaseUrl`, …) |
| `src/store/useChatStore.ts` | `geminiHistory` → `history: AiMessage[]`; conversión del snapshot viejo |
| `src/features/settings/AiSettingsCard.tsx` | UI multi-proveedor |
| `src/components/ai/AiModelSelector.tsx` | modelos del proveedor activo |
| `src/features/assistant/*` | copy que dice "Gemini" → nombre del proveedor activo |

**No tocar:** el registry de tools (`src/ai/tools/registry.ts`, `read/`, `write/`, `compositTools.ts`)
ni sus tests; `src/ai/rag/{indexer,store,types}.ts`; nada del dominio ni de storage del workspace.

## 8. Fuera de alcance

- Fallback **entre** proveedores (D5).
- Embeddings/RAG con proveedores distintos de Gemini y re-indexado al cambiar (D11).
- OAuth de ChatGPT / Codex CLI / Claude Code subscriptions (D8).
- Hablarle al **servidor local de opencode** (`127.0.0.1:4096`) vía su SDK (D16).
- Proxy propio shipeado, funciones serverless o cualquier backend.
- Modelos de imagen/audio/TTS de los proveedores nuevos (el catálogo actual ya tiene grupo `audio`
  para Gemini; no se extiende).
- Costos/contabilidad de tokens por proveedor, selección automática por precio.
- Traer el catálogo de modelos en vivo desde `/v1/models` de cada proveedor: en esta spec el
  catálogo es **estático** en el repo (con el campo `baseUrl` personalizable). Refresco dinámico
  se puede pedir aparte.

## 9. Riesgos

| Riesgo | Mitigación |
|---|---|
| El tool-calling de un proveedor OpenAI-compatible difiere en detalles (`arguments` como string vs objeto, ids ausentes, tool_calls partidos entre chunks del stream) | El mapping tiene tests con fixtures de chunks reales, incluidos `arguments` en string JSON y acumulación por `index`. Fase de smoke manual obligatoria **por proveedor**. |
| Z.ai/OpenAI cambian sus cabeceras CORS después de esta spec | La medición de §2 queda fechada en el spec; `cors-blocked` (D12) hace que el fallo sea legible en vez de misterioso, y la salida (URL propia) ya existe para todos. |
| El loop agéntico refactorizado rompe el comportamiento de la spec 031 con Gemini | El adaptador de Gemini envuelve el código existente sin reescribir su clasificación de errores; los tests de `agent.test.ts` y `errors.test.ts` deben pasar **sin modificarse** (si hay que tocarlos, es señal de regresión, no de test viejo). |
| Modelos sin límites publicados rompen `isModelAvailable()` (hoy devuelve `false` si todo es 0) | `limitsUnknown: true` cuenta como disponible; el `rateLimiter` solo los marca saturados ante un 429 real. |
| La UI de N proveedores se vuelve un muro de campos | Un solo bloque visible: el del proveedor seleccionado. Los demás se resumen en el selector con un check si tienen key guardada. |

## 10. Definición de hecho

- [ ] `spec.md`, `design.md`, `tasks.md`, `PROMPT-EJECUCION.md` en esta carpeta
- [ ] `AiProvider` + los dos adaptadores + catálogo
- [ ] Loop agéntico único, provider-agnóstico, con tools y confirmación de escrituras
- [ ] Config multi-key migrada sin intervención del usuario
- [ ] Gemini sin regresiones (tests de 006/012/031 verdes sin tocarlos)
- [ ] Smoke manual real con **al menos** Gemini + un proveedor OpenAI-compatible (Z.ai u OpenAI)
- [ ] `npm run typecheck` + `npm test` + `npm run lint` + `npm run build` verdes
- [ ] Estado → **IMPLEMENTADO**; `graphify update .`
