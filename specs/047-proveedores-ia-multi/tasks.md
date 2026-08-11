# Tasks 047 — Proveedores de IA intercambiables

Baseline al empezar (2026-08-11): **954 tests / 90 archivos** verdes, `SCHEMA_VERSION = 19`.
El conteo de tests **solo puede subir**. Cada fase cierra con `npm run typecheck` + `npm test` +
`npm run lint` en verde antes de pasar a la siguiente.

## Fase A — Contratos y catálogo (sin tocar nada existente)
- [x] A1 `src/ai/providers/types.ts`: `ProviderId`, `AiMessage`, `AiToolCall`, `StreamTurnOptions`, `StreamTurnResult`, `AiProvider`, re-export de `KeyValidation`/`AiErrorKind`
- [x] A2 `src/ai/providers/catalog.ts`: `ProviderDefinition` + `PROVIDER_CATALOG` (5 proveedores, `browserBlocked` según spec §2) + `getProviderDef(id)`
- [x] A3 `src/ai/tools/schema.ts`: agregar `toOpenAiTool()` (D14) — **no tocar** `toFunctionDeclaration` ni `toMcpTool`
- [x] A4 `catalog.test.ts` + test de `toOpenAiTool` (shape `{type:"function", function:{name,description,parameters}}`, sin `$ref`)

## Fase B — Modelos calificados
- [x] B1 `models.ts`: `provider` + `modelId` + `limitsUnknown` en `ModelDefinition`; ids y `fallbackGroup` calificados (`"gemini:…"`)
- [x] B2 `qualify()` / `splitQualified()` / `getModelsByProvider()`; `isModelAvailable` respeta `limitsUnknown`
- [x] B3 Sembrar catálogos de `openai` (`gpt-5.4`, `-mini`, `-nano`) y `zai` (`glm-5.2`, `glm-4.7-flash`, `glm-4.5-air`) con `limitsUnknown: true`; `nvidia`/`opencode-zen` sin modelos fijos (id personalizado en UI, design §3)
- [x] B4 Adaptar fixtures de `modelSelector.test.ts` y `rateLimiter.test.ts` a ids calificados (**solo ids** — si hay que cambiar aserciones de lógica, parar: es una regresión)
- [x] B5 `models.qualified.test.ts`
- [x] B6 `AI_MODELS` de `config.ts` sigue compilando (lo consume `AiSettingsCard`)

## Fase C — Config multi-key + store
- [x] C1 `config.ts`: `AiProviderConfigSchema` + `AiConfigSchema` v2 (D9)
- [x] C2 `migrate()` v1→v2 dentro de `loadAiConfig` (D10) — la key existente **no se pierde ni se re-valida**
- [x] C3 Selectores `activeKey` / `activeBaseUrl` / `activeProviderId` / `geminiKey` / `hasKey`
- [x] C4 `useAiConfigStore`: acciones por proveedor, `keyStatus: Record<ProviderId, KeyStatus>`, `setActiveProvider`, `setBaseUrl`
- [x] C5 `config.migration.test.ts` + `useAiConfigStore.multi.test.ts`
- [x] C6 Verificar que `SCHEMA_VERSION` sigue en **19** y que no se tocó ninguna migración de workspace

## Fase D — Adaptador OpenAI-compatible (primero el nuevo, design §11)
- [x] D1 `openai-compatible/sse.ts`: parser de `text/event-stream` con buffer persistente entre chunks + abort
- [x] D2 `openai-compatible/mapping.ts`: `toOpenAiMessages`, `fromOpenAiDelta` (acumulación de tool_calls por `index`), `arguments` string↔objeto con `try/catch`
- [x] D3 `openai-compatible/errors.ts`: `classifyOpenAiError` + `cors-blocked`
- [x] D4 `openai-compatible/index.ts`: `createOpenAiCompatibleProvider(def)` con `validateKey` (`GET {baseUrl}/models`) y `streamTurn`
- [x] D5 `providers/index.ts`: `getProvider()` con `import()` diferido
- [x] D6 `sse.test.ts`, `mapping.test.ts`, `errors.test.ts` (casos del design §9)

## Fase E — Adaptador Gemini + loop agéntico único
- [x] E1 `gemini/agent.ts` → extraer `geminiStreamTurn()` que cumple `AiProvider["streamTurn"]`
- [x] E2 `providers/gemini/index.ts`: `geminiProvider` (envuelve `client.ts`, `errors.ts`, `geminiStreamTurn`, `embed`)
- [x] E3 `mapping` de Gemini: `toGeminiContents` / `fromGeminiContents` (esta última también convierte snapshots viejos)
- [x] E4 `src/ai/agent/runAgentTurn.ts`: loop provider-agnóstico — **portar literal** rondas (8), fallback de la spec 031, `executeCall`/`onConfirmWrite`, `rawMessage`, `onModelSwitch`
- [x] E5 `errors.ts`: agregar `cors-blocked` a `AiErrorKind`/`AI_ERROR_MESSAGES`; generalizar el copy que nombra "Gemini" (interpolar proveedor activo)
- [x] E6 `runAgentTurn.test.ts` con `AiProvider` fake (migra lo que cubría `gemini/agent.test.ts`)
- [x] E7 **Gate de no-regresión**: `gemini/errors.test.ts` y `systemPrompt.test.ts` pasan **sin editarse**

## Fase F — Consumidores
- [x] F1 `useChatStore`: `history: AiMessage[]`, `activeKey(config)`, nuevo `runAgentTurn`, copy de `onModelSwitch` con `splitQualified`
- [x] F2 `useChatStore.hydrateFromIdb`: convertir snapshot en formato Gemini; si falla, descartar en silencio
- [x] F3 `improve.ts` y `generate-transform.ts` vía `getProvider()` (fallback por grupo intacto)
- [x] F4 `rag/search.ts`: `embedText` anclado a la key de Gemini (D11); sin key → error tragado por el `.catch(() => "")` que ya existe en `useChatStore`
- [x] F5 `useChatStore.ragFallback.test.ts` sigue verde (o se ajusta solo en el setup de config)

## Fase G — UI
- [x] G1 `AiSettingsCard`: selector de proveedor con ✓ por key guardada; bloque único del proveedor seleccionado
- [x] G2 Campo de key por proveedor + estado + `keyUrl` + botón borrar (sin tocar los demás proveedores)
- [x] G3 Aviso + campo `baseUrl` solo para `browserBlocked`, con validación `https://` (o `http://localhost`)
- [x] G4 `AiModelSelector`: modelos del proveedor activo + input de "id de modelo personalizado" para `nvidia`/`opencode-zen`
- [x] G5 Toggle de RAG deshabilitado con razón si no hay key de Gemini
- [x] G6 Copy de `features/assistant/*` sin "Gemini" hardcodeado

## Fase H — Seguridad, smoke y cierre
- [x] H1 `keys-never-exported.test.ts` (CA-06.2): export de workspace con N keys configuradas no contiene ninguna
- [x] H2 Grep de control: ninguna key en `console.*`, ni en el `rawMessage` que se muestra en UI
  - Verificado: keys viven solo en `aiConfig` (IndexedDB); `exportAll` no lee `aiConfig`;
    `rawMessage` es el mensaje del SDK/HTTP (no se le inyecta la key); no hay `console.log` de keys.
- [ ] H3 **Smoke manual** (design §10, obligatorio — no marcar sin hacerlo):
  - [ ] H3.1 Gemini sin regresiones (lectura + escritura confirmada + key inválida + cambio de modelo)
  - [ ] H3.2 Un OpenAI-compatible con key real: streaming, tool de lectura, escritura confirmada, Detener
  - [ ] H3.3 `nvidia` sin baseUrl → mensaje `cors-blocked` (no "sin conexión")
  - [ ] H3.4 Cambio de proveedor a mitad de conversación conserva contexto
  - [ ] H3.5 Migración desde `aiConfig` v1 sembrado a mano en DevTools
  - **Nota (2026-08-11 / spec 049):** el bloqueante que impedía chatear con nvidia/opencode-zen
    (modelo ad-hoc → `all-models-exhausted`) y el pisa de `model` al rotar la key se corrigieron
    en `specs/049-proveedores-ia-correcciones/`. El smoke real de nvidia vía proxy se declara en
    la Fase F de la 049 (S1–S5); no se marca H3 acá hasta correrlo de verdad.
- [x] H4 `npm run typecheck` + `npm test` (> 954) + `npm run lint` + `npm run build`
  - Cierre: **1001 tests / 100 archivos**, typecheck OK, build OK.
  - Lint: mismos errores preexistentes fuera de `src/ai` (AttachmentsSection, useBreakpoint); `src/ai/**` limpio.
- [x] H5 Anotar en este archivo qué proveedores se probaron de verdad y con qué key (sin pegar la key)
  - **Smoke H3 no ejecutado en la sesión de la 047** (sin keys reales de OpenAI/Z.ai ni UI interactiva).
  - Cobertura automatizada: SSE, mapping, errores (cors-blocked), migración v1→v2, multi-key store, keys-never-exported, loop con provider fake, gate E7 Gemini.
  - Continuación del smoke: ver `specs/049-proveedores-ia-correcciones/tasks.md` Fase F.
- [x] H6 Spec → **IMPLEMENTADO**
- [x] H7 `graphify update .`

## Notas de ejecución

- Si en la Fase D aparece que un proveedor exige un header extra no previsto (p. ej. una versión de
  API), agregarlo como campo opcional del `ProviderDefinition` — **no** como `if` por id.
- Si algún test existente de Gemini necesita cambios más allá de ids de fixtures, **parar y
  reportar**: significa que el refactor cambió comportamiento, que es exactamente lo que D3 y el
  gate E7 quieren evitar.
- Si no hay key real de ningún proveedor OpenAI-compatible para el smoke H3.2, decirlo
  explícitamente y dejar H3.2 sin marcar en vez de marcarlo con un mock. Una spec con un smoke
  pendiente y declarado es honesta; una con un smoke marcado en falso es la spec 044.
