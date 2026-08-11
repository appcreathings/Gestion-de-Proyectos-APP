# Prompt de ejecución — Spec 047

> Pegar esto como primer mensaje en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 047 de este proyecto: `specs/047-proveedores-ia-multi/`.

Es una feature ya planificada: **hacer que el asistente de chat funcione con varios proveedores de
API key** (Gemini, OpenAI, Z.ai y, vía URL base propia, NVIDIA y OpenCode Zen), detrás de una
interfaz `AiProvider` con dos adaptadores. **No re-diseñes ni re-preguntes el alcance**: ejecutá
lo que `spec.md`, `design.md` y `tasks.md` ya fijaron. Si algo es ambiguo en el borde de una
decisión ya documentada, elegí la opción alineada a las "Decisiones fijadas" D1–D15 y seguí; solo
preguntá si chocás con un invariante real o un bug bloqueante no previsto.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` del proyecto (raíz) y `.claude/CLAUDE.md` — reglas graphify. Este repo tiene grafo
   en `graphify-out/`: usá `graphify query "..."` / `graphify explain "..."` antes de leer archivos
   fuente a ciegas, y `graphify update .` al terminar.
2. `specs/047-proveedores-ia-multi/spec.md` — contexto, **la medición de CORS de §2** (es lo que
   define qué proveedores entran y cómo), objetivo, decisiones D1–D15, HU-01…HU-06, fuera de
   alcance.
3. `specs/047-proveedores-ia-multi/design.md` — interfaz `AiProvider`, catálogo, ids calificados,
   config v2 + migración, adaptador OpenAI-compatible (SSE + mapping + errores), loop único,
   UI, tests, y **§11 el porqué del orden de fases**.
4. `specs/047-proveedores-ia-multi/tasks.md` — fases A→H.
5. `.specify/memory/constitution.md` — Principios I, IV, V, VI.
6. `specs/031-gemini-resiliencia-errores/` completa — el fallback y la clasificación de errores que
   esta spec **conserva**, no reescribe.
7. Código de referencia (leerlo, no asumirlo): `src/ai/config.ts`, `src/ai/models.ts`,
   `src/ai/modelSelector.ts`, `src/ai/rateLimiter.ts`, `src/ai/gemini/{client,agent,errors}.ts`,
   `src/ai/tools/{schema,registry}.ts`, `src/ai/rag/search.ts`, `src/ai/improve.ts`,
   `src/store/{useAiConfigStore,useChatStore}.ts`, `src/features/settings/AiSettingsCard.tsx`,
   `src/components/ai/AiModelSelector.tsx`.

## Baseline a verificar al empezar

```bash
npm run typecheck
npm test        # esperado: 954 tests / 90 archivos, verdes
npm run lint
```

El número de tests **solo puede subir**. `SCHEMA_VERSION` se queda en **19** — no hay migración de
workspace (la config de IA vive en IndexedDB, fuera del workspace, y así se queda).

## Cómo ejecutar

Seguí `tasks.md` en orden A→H:

1. **Fase A** — Tipos `AiProvider` + `PROVIDER_CATALOG` + `toOpenAiTool()`. No toca nada existente.
2. **Fase B** — Ids de modelo calificados (`"proveedor:modelo"`), `limitsUnknown`, catálogos de
   OpenAI y Z.ai.
3. **Fase C** — Config multi-key v2 + migración silenciosa desde la config actual + store por
   proveedor.
4. **Fase D** — Adaptador OpenAI-compatible (`fetch` + SSE, mapping, errores). **Va antes que el de
   Gemini a propósito** (design §11): escribir primero el adaptador nuevo es lo que obliga a que la
   interfaz sea realmente neutra.
5. **Fase E** — Adaptador Gemini (envuelve lo existente) + loop agéntico único provider-agnóstico.
6. **Fase F** — Consumidores: `useChatStore`, `improve`, `generate-transform`, RAG.
7. **Fase G** — UI de Ajustes y selector de modelo.
8. **Fase H** — Test de fuga de keys, smoke manual por proveedor, cierre.

Después de **cada fase**: `npm run typecheck` + `npm test` + `npm run lint` limpios antes de la
siguiente. Al cerrar, además `npm run build`.

Marcá casillas en `tasks.md` al completar. Actualizá el estado del `spec.md` a **IMPLEMENTADO** al
final.

## Decisiones ya fijadas — no re-preguntar

1. **CORS ya está medido** (spec §2, 2026-08-11): Gemini, OpenAI y Z.ai responden con
   `Access-Control-Allow-Origin`; **NVIDIA y OpenCode Zen no**. No vuelvas a "investigar si se
   puede": si querés reconfirmar, hacelo con un `curl -X OPTIONS` de 10 segundos, no con un
   rediseño.
2. NVIDIA y OpenCode Zen entran como proveedores con `browserBlocked: true` que **exigen una URL
   base propia** (proxy del usuario). **No** se shipea proxy, ni función serverless, ni backend.
3. **"Codex" = OpenAI API key de platform.** Nada de OAuth de ChatGPT ni de Codex CLI.
   Y el **SDK de opencode** (`opencode.ai/docs/es/sdk/`) es el cliente del **servidor local**
   `127.0.0.1:4096`, no del gateway Zen: está fuera de alcance por D16. No lo instales ni lo uses.
4. Una interfaz `AiProvider` + **dos** adaptadores (`gemini`, `openai-compatible`). Los proveedores
   concretos son **datos** en el catálogo. Si te encontrás escribiendo `if (providerId === "zai")`
   en lógica de transporte, parás: eso va como campo del `ProviderDefinition`.
5. **Un solo loop agéntico** en `src/ai/agent/runAgentTurn.ts`. Nada de duplicar rondas/tools/
   confirmaciones por proveedor.
6. **Historial neutro `AiMessage[]`** como formato canónico (store + snapshot). Cada adaptador
   traduce. Es lo que permite cambiar de proveedor sin perder la conversación.
7. Ids de modelo **calificados** (`"gemini:gemini-2.5-flash"`). `rateLimiter`/`modelSelector` no
   cambian de lógica, solo de forma del id.
8. **Fallback solo dentro del proveedor activo.** Cross-provider está fuera de alcance.
9. **RAG sigue anclado a Gemini.** Si hay key de Gemini, los embeddings usan esa key aunque el chat
   esté en otro proveedor; si no, RAG se deshabilita con aviso honesto y el chat sigue.
10. **`cors-blocked` es un `AiErrorKind` nuevo.** Un `fetch` bloqueado llega como `TypeError`; sin
    este kind el usuario leería "sin conexión a internet", que es mentira.
11. **Sin dependencias npm nuevas.** El adaptador OpenAI-compatible es `fetch` + parseo de SSE a
    mano. No agregues el SDK `openai`.
12. Copy en español/tuteo; reusar `Card`/`Input`/`Select`/`Badge`/`Button`/`Checkbox` de
    `AiSettingsCard`. Cero componentes nuevos de UI.

## Invariantes (no romper)

- **Principio I sin excepciones**: las API keys viven solo en IndexedDB (`aiConfig`). Nunca en
  `workspace.json`, ni en export/backup, ni en el snapshot del chat, ni en `console`, ni en el
  `rawMessage` crudo que la UI muestra como detalle técnico. La Fase H1 lo testea.
- **Gemini no puede regresionar.** `src/ai/gemini/errors.test.ts` y `systemPrompt.test.ts` tienen
  que pasar **sin editarse** (gate E7). En `modelSelector.test.ts`/`rateLimiter.test.ts` solo está
  permitido cambiar los **ids de los fixtures**; si necesitás tocar una aserción de lógica, parás y
  reportás.
- El bucle de fallback real de la spec 031 (`tried: Set`, solo `rate-limit`/`quota-exhausted`
  ameritan otro modelo, `markSaturated(id, 60)`, `all-models-exhausted`) y la detección de
  `quota_limit_value: 0` se **portan literal**, no se "mejoran de paso".
- `MAX_ROUNDS = 8`, la confirmación previa de tools de escritura (`confirmWrites`) y el `AbortSignal`
  funcionan igual en todos los proveedores.
- El registry de tools (`src/ai/tools/registry.ts`, `read/`, `write/`, `compositTools.ts`) y sus
  tests **no se tocan**: a `schema.ts` solo se le **agrega** `toOpenAiTool()`.
- `SCHEMA_VERSION` se queda en 19. Cero migraciones de workspace.
- Los adaptadores se cargan con `import()` diferido — el bundle inicial no debe crecer para quien
  nunca configura el asistente.

## Definición de hecho

- Fases A–H de `tasks.md` hechas.
- CA de HU-01…HU-06 del `spec.md` cubiertos.
- `npm run typecheck`, `npm test` (> 954), `npm run lint`, `npm run build` verdes.
- **Smoke manual de la Fase H3 hecho de verdad**, no solo marcado. Si no tenés key real de un
  proveedor OpenAI-compatible, dejá H3.2 sin marcar y decilo — no lo marques con un mock.
- Spec marcada **IMPLEMENTADO**.
- `graphify update .` al final.

## Arranque

Empezá por **A1** (`src/ai/providers/types.ts`). No escribas un plan paralelo: usá `tasks.md` como
checklist y reportá al cerrar cada fase qué quedó verde y qué falta.

---
