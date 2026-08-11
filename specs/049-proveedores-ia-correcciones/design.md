# Design 049 — Correcciones post-review de la spec 047 (proveedores de IA)

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/049-proveedores-ia-correcciones/` · Fecha: 2026-08-11
> Baseline: `SCHEMA_VERSION` **19** · **1001 tests / 100 archivos** verdes · commit `b2b9f3c`
> Cierre código: **1020 tests / 101 archivos** · typecheck/lint/build OK · smoke manual S1–S5 pendiente (sin Worker/keys en el entorno)
> Depende de: **Spec 047** (implementada y commiteada) — esta spec **corrige**, no re-diseña.
> Principios: **IV** (el error tiene que decir la verdad), **V** (fixes puntuales sobre lo ya
> construido), **I** (las keys siguen sin salir del dispositivo).
> No hay `spec.md` aparte: el alcance es la lista de hallazgos del review de la 047, que se
> transcribe entera acá abajo. Si preferís un `spec.md` formal, se puede extraer de §1–§3.

## 1. Contexto

La spec 047 quedó **IMPLEMENTADO** y commiteada (`b2b9f3c`) con los gates verdes: typecheck,
1001 tests, lint sin regresiones nuevas y build OK. El review posterior encontró **un bloqueante,
uno mayor, cuatro menores y tres nits**, más el smoke manual H3 sin ejecutar.

El bloqueante importa más de lo que su tamaño sugiere: **NVIDIA y OpenCode Zen no pueden enviar
un solo mensaje** con la configuración por defecto, y son exactamente los dos proveedores que
justifican la decisión D7 de la 047 (URL base propia). Ya existe la guía operativa del proxy
(`specs/047-proveedores-ia-multi/PROXY-CLOUDFLARE.md`), así que el proxy no es el problema: el
problema está del lado de la app.

## 2. Objetivo

1. Que un **modelo escrito a mano** (NVIDIA / OpenCode Zen a través del proxy) llegue realmente al
   proveedor en vez de morir en el selector.
2. Que **ningún error mienta**: "no elegiste modelo" no puede reportarse como "todos los modelos
   alcanzaron su límite".
3. Que **rotar una API key no toque la configuración** del usuario.
4. Cerrar las cuatro desviaciones menores contra el design de la 047.
5. **Ejecutar el smoke H3** que la 047 dejó declarado como deuda.

## 3. Hallazgos a corregir (alcance cerrado — no ampliar)

| # | Sev. | Qué | Dónde |
|---|---|---|---|
| **F1** | Bloqueante | Ids de modelo fuera de `MODEL_REGISTRY` ⇒ `select()` devuelve `none-available` ⇒ `all-models-exhausted` sin hacer un request | `modelSelector.ts:30-33` |
| **F2** | Bloqueante (b) | Sin modelo elegido el error miente ("todos los modelos alcanzaron su límite") | `runAgentTurn.ts:78-85`, `config.ts:128-132` |
| **F3** | Mayor | `saveAndValidateKey` pisa `model` y `fallbackGroup` al re-guardar la key del proveedor ya activo | `useAiConfigStore.ts:101-110` |
| **F4** | Menor | Tool-calls con `arguments` JSON roto se descartan en silencio; el design 047 §5.2 pedía devolverle el error al modelo | `openai-compatible/mapping.ts:116-118` |
| **F5** | Menor | `splitLastUser` con precedencia confusa y cast no verificado | `gemini/streamTurn.ts:71-77` |
| **F6** | Menor | El aviso de "configurá tu API key" no nombra el proveedor activo (CA-01.6 de la 047) | `AssistantEmptyState.tsx:33-34` |
| **F7** | Menor | Comentarios que documentaban invariantes (Principio I, spec 031 §4/§6) borrados en el refactor | `useChatStore.ts` |
| **F8** | Nit | `usageTokens` declarado y nunca poblado ni consumido | `providers/types.ts:39` |
| **F9** | Nit | `getProvider()` resuelto dos veces en el `catch` | `improve.ts` |
| **F10** | Nit | Sin test de `MAX_ROUNDS` excedido ni de abort en el loop | `agent/runAgentTurn.test.ts` |

## 4. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|---|---|
| **D1** | El fix de F1 va en **`modelSelector.select()`**, no en `runAgentTurn`. Si `getModelDef(id)` no encuentra nada pero el id **está bien calificado**, se devuelve tal cual como `reason: "preferred"`. | El selector es el único que decide qué modelo se usa; parchearlo en el loop dejaría a `improve.ts` y a cualquier consumidor futuro con el mismo bug. |
| **D2** | Se agrega `isQualifiedModelId(id)` a `models.ts`. **No** se reusa `splitQualified()` para esto: su rama de compatibilidad devuelve `{provider:"gemini"}` para ids inválidos, así que `"nvidia:"` pasaría como válido. | Es justo el caso que produce el error mentiroso; hay que distinguirlo, no taparlo. |
| **D3** | Un modelo ad-hoc **no participa del fallback**: es el preferido o nada. `canMakeRequest()` ya devuelve `true` para ids desconocidos, así que el `rateLimiter` lo deja pasar y solo lo frena si un 429 real lo satura. | No hay cadena a la que pertenezca; inventarle una sería adivinar. Consistente con D5 de la 047 (fallback solo dentro del proveedor). |
| **D4** | `AiErrorKind` gana **`no-model-selected`**. `defaultModelForProvider()` devuelve **`""`** en vez de `` `${id}:` `` cuando el proveedor no tiene modelos sembrados. | Un id sintáctico inválido circulando por la config es una bomba de tiempo; el string vacío es inequívoco. |
| **D5** | F3 se arregla aplicando `model`/`fallbackGroup` **solo cuando cambia el proveedor** (`prev.activeProvider !== providerId` o el `model` actual pertenece a otro proveedor). | Guardar una key es guardar una key. |
| **D6** | F4: la tool-call con args rotos **se conserva** con `argsError`, y `runAgentTurn` la corta antes de `executeCall` devolviéndole el error al modelo. **No** se ejecuta con `args: {}`. | Ejecutar con args vacíos una tool de escritura cuyos campos son todos opcionales haría una acción equivocada. El modelo se auto-corrige en la ronda siguiente, que es lo que pedía el design 047. |
| **D7** | F8: se **elimina** `usageTokens` de `StreamTurnResult`. | Poblarlo con OpenAI exige `stream_options: {include_usage: true}`, que no todos los compatibles soportan; un campo que nunca se llena miente. Si algún día se necesita, vuelve con su implementación. |
| **D8** | **Sin dependencias npm nuevas. Sin cambios de schema.** `SCHEMA_VERSION` sigue en 19. La interfaz `AiProvider` y el loop único no se re-diseñan. | Esta spec corrige; el diseño de la 047 se mantiene. |

## 5. Cambios archivo por archivo

### 5.1 `src/ai/models.ts` — helper nuevo

```ts
/** `true` solo si el id tiene forma `<proveedor válido>:<modelo no vacío>`. */
export function isQualifiedModelId(id: string): boolean {
  const idx = id.indexOf(":");
  if (idx <= 0) return false;
  return isProviderId(id.slice(0, idx)) && id.slice(idx + 1).length > 0;
}
```

`splitQualified()` **no cambia** (su rama de compat la usan ids viejos legítimos).

### 5.2 `src/ai/modelSelector.ts` — F1

```ts
const preferred = getModelDef(preferredId);
if (!preferred) {
  // Modelo ad-hoc (id escrito a mano para nvidia / opencode-zen vía proxy, spec 047 D7):
  // no está en el registry pero es un id válido. Es el preferido o nada — no entra al
  // fallback porque no pertenece a ninguna cadena (D3).
  if (
    isQualifiedModelId(preferredId) &&
    !excludeIds?.has(preferredId) &&
    this.limiter.canMakeRequest(preferredId)
  ) {
    return { modelId: preferredId, switched: false, reason: "preferred" };
  }
  return { modelId: null, switched: false, reason: "none-available" };
}
```

El resto del método queda intacto.

### 5.3 `src/ai/gemini/errors.ts` — F2

```ts
export type AiErrorKind = … | "no-model-selected" | …;

"no-model-selected":
  "Todavía no elegiste un modelo para este proveedor. Escribí el id del modelo en " +
  "Ajustes → Asistente IA (por ejemplo `meta/llama-3.1-8b-instruct`).",
```

### 5.4 `src/ai/agent/runAgentTurn.ts` — F2 y F4

Antes de `resolveInitialModel()`:

```ts
if (!isQualifiedModelId(preferredModel)) {
  return { history: opts.history, roundsExceeded: false, error: "no-model-selected" };
}
```

Y en el bucle de tool-calls, antes de `executeCall`:

```ts
if (call.argsError) {
  callbacks.onToolCallEnd(view, { status: "error", error: call.argsError });
  history = [...history, {
    role: "tool", toolCallId: call.id, name: call.name,
    result: { error: `Argumentos inválidos: ${call.argsError}. Reintentá con JSON válido.` },
  }];
  continue;
}
```

### 5.5 `src/ai/config.ts` — F2

```ts
export function defaultModelForProvider(id: ProviderId): string {
  const models = getModelsByProvider(id).filter((m) => m.category !== "embedding");
  return models[0]?.id ?? "";      // era `${id}:`
}
```

Verificar que `AssistantPanel` (badge del modelo) y `AiSettingsCard` (input de modelo custom)
toleran `""` — hoy lo hacen, pero entra en el smoke.

### 5.6 `src/store/useAiConfigStore.ts` — F3

```ts
const switchingProvider =
  prev.activeProvider !== providerId ||
  splitQualified(prev.model).provider !== providerId;

const config: AiConfig = {
  ...prev,
  activeProvider: providerId,
  providers: { ...prev.providers, [providerId]: { ...prevProv, apiKey: trimmed } },
  ...(switchingProvider
    ? {
        model: prevProv.lastModel ?? defaultModelForProvider(providerId),
        fallbackGroup: defaultFallbackGroupForProvider(providerId),
      }
    : {}),
};
```

### 5.7 `src/ai/providers/types.ts` — F4 y F8

```ts
export interface AiToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  /** El modelo emitió `arguments` que no parsean: no ejecutar, devolver el error (D6). */
  argsError?: string;
}

export interface StreamTurnResult {
  text: string;
  toolCalls: AiToolCall[];
  // usageTokens eliminado (D7)
}
```

### 5.8 `src/ai/providers/openai-compatible/mapping.ts` — F4

En `finalizeToolCalls`, reemplazar el `continue` del `catch` por:

```ts
} catch {
  calls.push({ id: entry.id || `call_${i}`, name: entry.name, args: {},
              argsError: "el JSON de arguments no parsea" });
  continue;
}
```

**El test existente `"descarta tool-call con JSON de args roto"` cambia de aserción** — es un
cambio de comportamiento deliberado (design 047 §5.2), no una regresión. Renombrarlo a
`"marca la tool-call con argsError cuando el JSON no parsea"`.

### 5.9 `src/ai/providers/gemini/streamTurn.ts` — F5

Reescribir `splitLastUser` para que opere sobre el **historial neutro** (tipado) y no sobre
`Content[]` con casts:

```ts
function splitForChat(history: AiMessage[]): { prior: AiMessage[]; message: PartListUnion } {
  const tail = [...history];
  const trailingTools: AiMessage[] = [];
  while (tail.length && tail[tail.length - 1].role === "tool") {
    trailingTools.unshift(tail.pop()!);
  }
  if (trailingTools.length > 0) {
    return { prior: tail, message: toGeminiContents(trailingTools)[0].parts as PartListUnion };
  }
  const last = tail.pop();
  if (last?.role === "user") return { prior: tail, message: last.content };
  return { prior: history, message: "" };   // no debería pasar: el loop siempre appende user
}
```

Sin `||`/`?:` anidados y sin `as { content: string }`.

### 5.10 UI y limpieza — F6, F7, F9

- `AssistantEmptyState`: recibe el `label` del proveedor activo
  (`getProviderDef(activeProviderId(config)).label`) e interpola: *"Configurá tu API key de
  {proveedor} en Ajustes"*.
- `useChatStore`: restaurar los tres comentarios borrados (snapshot device-local / `errorDetail`
  con Principio I y spec 031 §6 / RAG best-effort con spec 031 §4).
- `improve.ts`: resolver `getProvider()` una sola vez, fuera del `try`.

### 5.11 Documentación

- `specs/047-proveedores-ia-multi/PROXY-CLOUDFLARE.md`: **borrar la §7** ("esto todavía no
  alcanza para chatear") y renumerar la §8 de troubleshooting; quitar de esa tabla la fila del
  workaround de apagar el fallback.
- `specs/047-proveedores-ia-multi/tasks.md`: marcar H3 con lo que efectivamente se pruebe.

## 6. Criterios de aceptación

| CA | Verificación |
|---|---|
| **CA-1** | Con proveedor `nvidia`, `baseUrl` de proxy, key guardada y modelo escrito a mano, `autoFallback` **activado**, el turno llega a `provider.streamTurn` (hoy corta antes). Test unitario con `modelSelector` + test del loop. |
| **CA-2** | Con `model: ""` o `"nvidia:"`, el error es `no-model-selected`, **no** `all-models-exhausted`. |
| **CA-3** | Un modelo ad-hoc saturado por 429 real cae a `all-models-exhausted` (no hay a dónde ir) — el mensaje ahí sí es correcto. |
| **CA-4** | Re-guardar la key del proveedor **ya activo** deja `model` y `fallbackGroup` **idénticos**. Cambiar de proveedor sí los ajusta. |
| **CA-5** | Una tool-call con `arguments` roto **no se ejecuta**, aparece como error en el chip de la UI y el modelo recibe un `role:"tool"` con el error. |
| **CA-6** | Gemini sin regresiones: `gemini/errors.test.ts` y `systemPrompt.test.ts` siguen **sin editarse**; los 9 casos de `runAgentTurn.test.ts` siguen verdes. |
| **CA-7** | El aviso de key faltante nombra al proveedor activo. |
| **CA-8** | `npm run typecheck` + `npm test` (> 1001) + `npm run lint` (sin errores nuevos en `src/ai/**`) + `npm run build`. |

## 7. Tests

| Archivo | Casos nuevos |
|---|---|
| `src/ai/models.qualified.test.ts` | `isQualifiedModelId`: `"nvidia:meta/llama-3.1"` ✓, `"nvidia:"` ✗, `"gemini-2.5-flash"` ✗, `"noexiste:x"` ✗, `""` ✗ |
| `src/ai/modelSelector.test.ts` | id ad-hoc válido → `preferred`; ad-hoc en `excludeIds` → `none-available`; ad-hoc saturado → `none-available` |
| `src/ai/agent/runAgentTurn.test.ts` | `model: ""` → `no-model-selected` sin llamar a `streamTurn`; tool-call con `argsError` → no se ejecuta y el history recibe el error; **+ F10**: `MAX_ROUNDS` excedido → `roundsExceeded: true`; abort → `aborted` |
| `src/store/useAiConfigStore.multi.test.ts` | rotar key del proveedor activo conserva `model`/`fallbackGroup`; cambiar de proveedor los ajusta |
| `openai-compatible/mapping.test.ts` | el caso de args rotos pasa a esperar `argsError` (renombrado) |
| `providers/gemini/mapping.test.ts` o nuevo `streamTurn.test.ts` | `splitForChat`: cola de tools, último user, historial vacío |

## 8. Smoke manual (obligatorio)

Tres de los cinco **no necesitan keys pagas** y son los que cubren estos fixes:

- **S1** — `nvidia` + Worker de Cloudflare (guía de la 047) + modelo a mano + `autoFallback` ON →
  el chat responde. **Es el CA-1 de verdad.**
- **S2** — mismo proveedor **sin** `baseUrl` → mensaje `cors-blocked`, no "sin conexión".
- **S3** — proveedor sin modelo elegido → `no-model-selected`.
- **S4** — Gemini: lectura + escritura confirmada + rotar la key y verificar que el modelo elegido
  **no cambia** (CA-4).
- **S5** — migración desde `aiConfig` v1 sembrado a mano en DevTools.

Si no hay key de un OpenAI-compatible pago, decirlo y dejar ese punto sin marcar. **No marcar
nada que no se haya corrido** — es lo que la 044 hizo mal y la 047 evitó bien.

## 9. Fuera de alcance

- Re-diseñar la interfaz `AiProvider`, el catálogo o el loop.
- Fallback entre proveedores, embeddings multi-proveedor, streaming en Apps Script / n8n.
- Traer catálogos de modelos en vivo desde `/v1/models`.
- Cualquier mejora de UX no listada en §3.
