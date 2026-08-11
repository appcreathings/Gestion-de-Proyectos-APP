# Prompt de ejecución — Spec 049

> Pegar esto como primer mensaje en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 049 de este proyecto: `specs/049-proveedores-ia-correcciones/`.

Son las **correcciones del review de la spec 047** (proveedores de IA intercambiables), que quedó
implementada y commiteada en `b2b9f3c` con un bloqueante abierto: los ids de modelo escritos a mano
no llegan al proveedor, así que **NVIDIA y OpenCode Zen no pueden enviar un solo mensaje** con la
configuración por defecto. El alcance está cerrado en `design.md` §3 (10 hallazgos, F1–F10).
**No re-diseñes la 047**: la interfaz `AiProvider`, el catálogo de proveedores, el loop agéntico
único y el historial neutro se mantienen tal cual. Si algo es ambiguo en el borde de una decisión
ya documentada, elegí la opción alineada a D1–D8 y seguí; solo preguntá si chocás con un invariante
real o un bug bloqueante no previsto.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` (raíz) y `.claude/CLAUDE.md` — reglas graphify. Hay grafo en `graphify-out/`: usá
   `graphify query "..."` / `graphify explain "..."` antes de leer fuentes a ciegas, y
   `graphify update .` al terminar.
2. `specs/049-proveedores-ia-correcciones/design.md` — contexto, los 10 hallazgos con archivo y
   línea, decisiones D1–D8, **§5 con el código exacto de cada fix**, CA-1…CA-8, tests y smoke.
3. `specs/049-proveedores-ia-correcciones/tasks.md` — fases A→F.
4. `specs/047-proveedores-ia-multi/spec.md` y `design.md` — el diseño que estás corrigiendo, no
   reemplazando. Prestá atención a D3 (loop único), D4 (ids calificados), D5 (fallback solo dentro
   del proveedor) y D7 (URL base propia).
5. `specs/047-proveedores-ia-multi/PROXY-CLOUDFLARE.md` — la guía del proxy; su §7 se borra en la
   Fase E porque deja de ser cierta cuando termines.
6. `specs/031-gemini-resiliencia-errores/` — el bucle de fallback y la clasificación de errores que
   ni la 047 ni esta spec reescriben.
7. Código a tocar (leerlo, no asumirlo): `src/ai/models.ts`, `src/ai/modelSelector.ts`,
   `src/ai/gemini/errors.ts`, `src/ai/config.ts`, `src/ai/agent/runAgentTurn.ts`,
   `src/store/useAiConfigStore.ts`, `src/ai/providers/types.ts`,
   `src/ai/providers/openai-compatible/mapping.ts`, `src/ai/providers/gemini/streamTurn.ts`,
   `src/features/assistant/AssistantEmptyState.tsx`, `src/store/useChatStore.ts`,
   `src/ai/improve.ts`.

## Baseline a verificar al empezar

```bash
npm run typecheck
npm test        # esperado: 1001 tests / 100 archivos, verdes
npm run lint    # 2 errores PREEXISTENTES fuera de src/ai (AttachmentsSection, useBreakpoint)
```

El conteo de tests **solo puede subir**. `SCHEMA_VERSION` se queda en **19**: no hay migración de
workspace ni cambios de schema en esta spec.

## Cómo ejecutar

Seguí `tasks.md` en orden A→F:

1. **Fase A** — El bloqueante: `isQualifiedModelId`, rama de modelo ad-hoc en `modelSelector`,
   error `no-model-selected`, `defaultModelForProvider` devuelve `""`.
2. **Fase B** — Rotar una key deja de pisar `model`/`fallbackGroup`.
3. **Fase C** — Adaptadores: `argsError` en tool-calls con JSON roto, `splitForChat` tipado,
   eliminar `usageTokens`.
4. **Fase D** — Copy con el nombre del proveedor, comentarios de invariantes restaurados, nits.
5. **Fase E** — Actualizar la doc de la 047 (borrar la §7 de la guía del proxy).
6. **Fase F** — Smoke manual real y cierre.

Después de **cada fase**: `npm run typecheck` + `npm test` + `npm run lint` limpios. Al cerrar,
además `npm run build`.

Marcá casillas en `tasks.md`. Al final, actualizá el estado del `design.md` a **IMPLEMENTADO**.

## Decisiones ya fijadas — no re-preguntar

1. **El fix del bloqueante va en `modelSelector.select()`**, no en `runAgentTurn`. Parchear el loop
   dejaría a `improve.ts` y a cualquier consumidor futuro con el mismo bug.
2. **No reuses `splitQualified()` para validar.** Su rama de compatibilidad devuelve
   `{provider:"gemini"}` para ids inválidos, así que `"nvidia:"` pasaría como bueno — que es
   justo el caso que produce el error mentiroso. Por eso existe `isQualifiedModelId()`.
3. **Un modelo ad-hoc no participa del fallback**: es el preferido o nada. No le inventes una
   cadena.
4. `defaultModelForProvider` devuelve **`""`**, no `` `${id}:` ``. Un id sintáctico inválido dando
   vueltas por la config es una bomba de tiempo.
5. **Una tool-call con args rotos NO se ejecuta** con `args: {}`. Se marca con `argsError` y el
   loop le devuelve el error al modelo para que se auto-corrija. Ejecutar con args vacíos una tool
   de escritura cuyos campos sean todos opcionales haría una acción equivocada.
6. **`usageTokens` se elimina**, no se implementa: poblarlo con OpenAI exige
   `stream_options: {include_usage: true}`, que no todos los compatibles soportan.
7. **Sin dependencias npm nuevas. Sin cambios de schema. Sin backend.**
8. Copy en español/tuteo. Cero componentes de UI nuevos.

## Invariantes (no romper)

- **No re-diseñar la 047**: una interfaz `AiProvider`, dos adaptadores, un solo loop, historial
  neutro `AiMessage[]`, ids calificados, catálogo como datos. Si te encontrás escribiendo
  `if (providerId === "nvidia")` en lógica de transporte, parás.
- **Gemini no puede regresionar.** `src/ai/gemini/errors.test.ts` y `systemPrompt.test.ts` tienen
  que pasar **sin editarse**. Los 9 casos de `runAgentTurn.test.ts` siguen verdes (les sumás, no
  los cambiás).
- **El único test existente que cambia de aserción** es el de args rotos en
  `openai-compatible/mapping.test.ts` (C3), y es deliberado. Si aparece cualquier otro que haya
  que modificar, **parás y reportás**: significa que cambiaste comportamiento sin querer.
- El bucle de fallback de la spec 031 (`tried`, solo `rate-limit`/`quota-exhausted` cambian de
  modelo, `markSaturated(id, 60)`, `all-models-exhausted`, `quota_limit_value: 0`) se conserva
  literal. `MAX_ROUNDS = 8`, `confirmWrites` y el `AbortSignal` no cambian.
- **Principio I**: las keys siguen viviendo solo en IndexedDB (`aiConfig`), nunca en
  `workspace.json`, export, snapshot del chat, `console` ni en el `rawMessage` que la UI muestra.
  `keys-never-exported.test.ts` sigue verde.
- `SCHEMA_VERSION` = 19.

## Definición de hecho

- Fases A–F de `tasks.md` hechas.
- CA-1…CA-8 del `design.md` cubiertos.
- `npm run typecheck`, `npm test` (> 1001), `npm run lint` (sin errores nuevos en `src/ai/**`),
  `npm run build` verdes.
- **Smoke S1 corrido de verdad**: `nvidia` a través de un Worker de Cloudflare, con modelo escrito
  a mano y `autoFallback` activado, respondiendo en el chat. Es la prueba de que el bloqueante
  murió; sin eso la spec no está hecha. Si no podés levantar el Worker, decilo explícitamente y
  dejá S1 sin marcar — no lo marques con un mock.
- §7 de `PROXY-CLOUDFLARE.md` borrada.
- `design.md` marcado **IMPLEMENTADO**; `graphify update .` al final.

## Arranque

Empezá por **A1** (`isQualifiedModelId` en `src/ai/models.ts`). No escribas un plan paralelo: usá
`tasks.md` como checklist y reportá al cerrar cada fase qué quedó verde y qué falta.

---
