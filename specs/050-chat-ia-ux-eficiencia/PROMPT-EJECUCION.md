# Prompt de ejecución — Spec 050

> Pegar esto como primer mensaje en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 050 de este proyecto: `specs/050-chat-ia-ux-eficiencia/`.

Objetivo: mejorar la **UX del chat con IA** (chips contextuales, slash, copiar/regenerar,
follow-ups) y **optimizar llamados** (contexto de pantalla en el system prompt, skip RAG
en atajos/continuaciones, ventana de historial al modelo). **No re-diseñes ni re-preguntes
el alcance**: ejecutá lo que `spec.md`, `design.md` y `tasks.md` ya fijaron. Si algo es
ambiguo en el borde de una decisión documentada, elegí la opción alineada a las
“Decisiones fijadas” del spec y seguí; solo preguntá si chocás con un invariante o un bug
bloqueante no previsto.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` del proyecto (raíz) — reglas graphify. Usá `graphify query "..."` /
   `graphify explain "..."` antes de explorar código a ciegas; al terminar,
   `graphify update .`.
2. `.specify/memory/constitution.md` — si algo en tasks contradice la constitución, gana
   la constitución y avisá.
3. `specs/050-chat-ia-ux-eficiencia/spec.md` — contexto, D1–D14, HU-01…06, fuera de alcance.
4. `specs/050-chat-ia-ux-eficiencia/design.md` — módulos puros, firma de `send`, regenerate,
   formato del bloque de contexto, catálogo de chips/slash.
5. `specs/050-chat-ia-ux-eficiencia/tasks.md` — fases A→F.
6. `specs/050-chat-ia-ux-eficiencia/smoke.md` — verificación final.
7. Código de referencia (leer el estado real, puede haber divergido del snapshot del spec):
   - `src/store/useChatStore.ts` (`send`, history, RAG, persist)
   - `src/ai/agent/runAgentTurn.ts` (no reescribir el loop; solo pasar history trimmeado)
   - `src/ai/gemini/systemPrompt.ts` + tests
   - `src/features/assistant/*` (`AssistantPanel`, `ChatInput`, `ChatMessageBubble`,
     `AssistantEmptyState`, `ChatMessageList`)
   - `src/features/projects/components/TasksTab.tsx` — `?detail=` como fuente de tarea en foco

## Baseline a verificar al empezar

```bash
npm run typecheck
npm test
npm run lint
```

Anotá el número de tests. **Solo puede subir**. `SCHEMA_VERSION` no cambia.

## Cómo ejecutar

Seguí `tasks.md` en orden:

1. **Fase A** — módulos puros en `src/ai/chat/*` + tests (sin UI).
2. **Fase B** — cablear `buildSystemPrompt`, snapshot de ruta, `send` con expand/slash,
   skip RAG, trim history, flags de regenerate.
3. **Fase C** — chips UI (empty, composer, header, follow-ups).
4. **Fase D** — menú slash en `ChatInput`.
5. **Fase E** — copiar + `regenerateLast` + reintentar en error.
6. **Fase F** — smoke, build, graphify, marcar spec IMPLEMENTADO.

Después de cada fase: `npm run typecheck` + `npx vitest run` (o `npm test`) limpios antes
de seguir. Commits por fase en español (`feat(assistant): … (spec 050)`).

## Decisiones ya fijadas — no re-preguntar

1. Contexto de pantalla desde **URL** (`/app/projects/:id`, `?detail=`) + stores — no un
   segundo sistema de focus.
2. Contexto va al **system prompt**, no al bubble del usuario.
3. Chips y follow-ups son **plantillas client-side** — sin segundo LLM.
4. Slash se **expande en el cliente**; el hilo muestra el texto expandido.
5. Skip RAG solo por lista blanca (slash, `skipRag` en chips, continuaciones cortas).
6. Ventana de historial al modelo = **12** `AiMessage`; la UI no borra el hilo por eso.
7. **No** filtrar el catálogo de tools en v1.
8. Sin dependencias npm nuevas, sin bump de schema, sin tocar providers ni `approveAll`.

## Lo intocable

- Loop de `runAgentTurn` / tool confirmation / `approveAll` (048).
- Contratos de storage / `SCHEMA_VERSION`.
- Multi-proveedor (047/049) salvo leer `activeKey` / config como ya hace el chat.
- Editor de flujos, Kanban (solo **leer** `?detail=` y la ruta de proyecto).

## Al terminar

1. `smoke.md` marcado en lo razonable (pasos con API real según disponibilidad de key).
2. Spec → **IMPLEMENTADO**.
3. `graphify update .`
4. Resumen breve al usuario: qué se implementó, tests agregados, y 2–3 limitaciones v1
   (sin tool filtering, sin sugerencias LLM, N=12).
