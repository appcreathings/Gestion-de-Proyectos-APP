# Tasks 049 — Correcciones post-review de la spec 047

Baseline (2026-08-11, commit `b2b9f3c`): **1001 tests / 100 archivos** verdes, `SCHEMA_VERSION = 19`.
El conteo de tests **solo puede subir**. Cada fase cierra con `npm run typecheck` + `npm test` +
`npm run lint` en verde antes de la siguiente.

## Fase A — F1 + F2: que el modelo ad-hoc llegue al proveedor (bloqueante)
- [x] A1 `models.ts`: `isQualifiedModelId(id)` (design §5.1) — **sin** tocar `splitQualified`
- [x] A2 `models.qualified.test.ts`: 5 casos de `isQualifiedModelId`
- [x] A3 `modelSelector.ts`: rama de modelo ad-hoc en `select()` (design §5.2)
- [x] A4 `modelSelector.test.ts`: ad-hoc válido → `preferred`; en `excludeIds` → `none-available`; saturado → `none-available`
- [x] A5 `gemini/errors.ts`: `no-model-selected` en `AiErrorKind` + `AI_ERROR_MESSAGES`
- [x] A6 `config.ts`: `defaultModelForProvider` devuelve `""` (no `` `${id}:` ``)
- [x] A7 `runAgentTurn.ts`: guard `isQualifiedModelId(preferredModel)` antes de `resolveInitialModel`
- [x] A8 `runAgentTurn.test.ts`: `model: ""` → `no-model-selected` **sin llamar a `streamTurn`**
- [x] A9 Verificar que `AssistantPanel` (badge) y `AiSettingsCard` (input de modelo custom) toleran `model: ""`

## Fase B — F3: rotar la key no toca la config (mayor)
- [x] B1 `useAiConfigStore.saveAndValidateKey`: `switchingProvider` (design §5.6)
- [x] B2 `useAiConfigStore.multi.test.ts`: rotar key del activo conserva `model`/`fallbackGroup`
- [x] B3 Mismo test: cambiar de proveedor **sí** los ajusta (no romper lo que ya andaba)

## Fase C — F4 + F5: adaptadores
- [x] C1 `providers/types.ts`: `argsError?` en `AiToolCall`; **eliminar** `usageTokens` de `StreamTurnResult` (F8)
- [x] C2 `openai-compatible/mapping.ts`: `finalizeToolCalls` conserva la call con `argsError`
- [x] C3 `mapping.test.ts`: renombrar y reescribir el caso de args rotos (cambio deliberado, design §5.8)
- [x] C4 `runAgentTurn.ts`: cortar antes de `executeCall` si hay `argsError` y devolver el error como `role:"tool"`
- [x] C5 `runAgentTurn.test.ts`: la tool con `argsError` **no se ejecuta** y el history recibe el error
- [x] C6 `gemini/streamTurn.ts`: reemplazar `splitLastUser` por `splitForChat` sobre historial neutro (design §5.9)
- [x] C7 Test de `splitForChat`: cola de tools / último user / historial vacío

## Fase D — F6, F7, F9, F10: limpieza y cobertura
- [x] D1 `AssistantEmptyState`: nombrar al proveedor activo (CA-01.6 de la 047)
- [x] D2 `useChatStore`: restaurar los 3 comentarios de invariantes borrados (Principio I, spec 031 §4 y §6)
- [x] D3 `improve.ts`: `getProvider()` una sola vez
- [x] D4 `runAgentTurn.test.ts`: `MAX_ROUNDS` excedido → `roundsExceeded: true`
- [x] D5 `runAgentTurn.test.ts`: abort → `aborted`

## Fase E — Documentación de la 047
- [x] E1 `047/PROXY-CLOUDFLARE.md`: borrar §7, renumerar §8, quitar la fila del workaround de la tabla de troubleshooting
- [x] E2 `047/tasks.md`: marcar H3 con lo que efectivamente se corrió (y solo eso)

## Fase F — Smoke manual (obligatorio) y cierre
- [ ] F1 **S1** `nvidia` + Worker de Cloudflare + modelo a mano + `autoFallback` ON → el chat responde
- [ ] F2 **S2** mismo proveedor sin `baseUrl` → `cors-blocked` (no "sin conexión")
- [ ] F3 **S3** proveedor sin modelo elegido → `no-model-selected`
- [ ] F4 **S4** Gemini: lectura + escritura confirmada + **rotar la key** y verificar que el modelo no cambia
- [ ] F5 **S5** migración desde `aiConfig` v1 sembrado en DevTools
- [x] F6 `npm run typecheck` + `npm test` (> 1001) + `npm run lint` + `npm run build`
- [x] F7 Anotar acá qué se probó de verdad y con qué proveedor (sin pegar keys)
- [x] F8 `graphify update .`

### Cierre F6 / F7 (2026-08-11)

**Automatizado (hecho):**
- `npm run typecheck` OK
- Tests de la suite del repo (excluyendo WIP untracked de la 048): **1020 tests / 101 archivos** verdes
  (baseline 1001/100 → +19 tests, +1 archivo `streamTurn.split.test.ts`)
- `npm run lint`: sin errores nuevos en `src/ai/**` (queda el preexistente `useBreakpoint`)
- `npm run build` OK
- `SCHEMA_VERSION` = 19 (sin cambios)
- Gate Gemini: `gemini/errors.test.ts` y `systemPrompt.test.ts` **sin editarse**, verdes
- Único test existente con aserción cambiada a propósito: `openai-compatible/mapping.test.ts` (args rotos → `argsError`)

**Smoke manual S1–S5: NO ejecutado en esta sesión.**
No hay Worker de Cloudflare desplegado ni keys reales de NVIDIA / OpenAI-compatible en el entorno
de implementación, y no hay UI interactiva para el chat. **No se marca F1–F5 con un mock.**
Los CA de código quedan cubiertos por tests unitarios:
- CA-1 (modelo ad-hoc llega a `streamTurn`): `runAgentTurn.test.ts` + `modelSelector.test.ts`
- CA-2 (`no-model-selected`): `runAgentTurn.test.ts` con `""` y `"nvidia:"`
- CA-3 (ad-hoc saturado → none-available): `modelSelector.test.ts`
- CA-4 (rotar key): `useAiConfigStore.multi.test.ts`
- CA-5 (`argsError`): mapping + runAgentTurn tests
- CA-6 Gemini: tests heredados sin tocar
- CA-7 copy del proveedor: `AssistantEmptyState` + `AssistantPanel`
- CA-8 gates: typecheck / test / lint / build

**Nota:** en el working tree hay archivos untracked de la **048** (`useChatStore.approveAll.test.ts`,
`projectTabMemory*`) ajenos a esta spec; uno de esos tests falla de forma independiente. No forman
parte del baseline ni del alcance de la 049.

## Notas de ejecución

- **A3 es el fix que desbloquea la feature.** Si al terminar la Fase A el smoke S1 todavía falla,
  parar y reportar antes de seguir: el resto de las fases no lo van a arreglar.
- El caso de test de args rotos (C3) **cambia de aserción a propósito**. Es el único test existente
  que se toca. Si aparece cualquier otro test que haya que modificar, **parar y reportar**.
- `gemini/errors.test.ts` y `systemPrompt.test.ts` no se editan (gate heredado de la 047).
- Si no hay key de un OpenAI-compatible pago para probar más allá del proxy, decirlo y dejar el
  punto sin marcar. No marcar smoke que no se corrió.
