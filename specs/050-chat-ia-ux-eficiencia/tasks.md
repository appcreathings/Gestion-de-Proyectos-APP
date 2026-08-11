# Tasks 050 — Chat IA: UX + eficiencia de llamados

> Orden sugerido: **A (núcleo pure) → B (send/prompt) → C (chips UI) → D (slash) → E (mensaje actions) → F (cierre)**.  
> A es independiente de la UI y desbloquea tests tempranos.  
> Marcar cada ítem al completar.

## Fase A — Módulos puros (sin UI)

- [x] **A1** Crear `src/ai/chat/uiContext.ts`: tipos `UiContext`, `resolveUiContext`, `formatUiContextBlock` (design §1).
- [x] **A2** Tests `uiContext.test.ts`: proyecto, tarea+detail, id inexistente, dashboard, settings, none (CA-01.1–01.4).
- [x] **A3** Crear `src/ai/chat/historyWindow.ts` + test (CA-06.2).
- [x] **A4** Crear `src/ai/chat/skipRag.ts` + test (CA-06.1, D7).
- [x] **A5** Crear `src/ai/chat/slashCommands.ts` (`parse`, `expand`, `list`) + test (CA-03.1–03.3, 03.5).
- [x] **A6** Crear `src/ai/chat/quickActions.ts` (catálogo + `selectQuickActions` + `selectFollowUps`) + test (CA-02.*, CA-04.* a nivel de datos).
- [x] **A7** Checkpoint: `npx vitest run src/ai/chat` verde.

## Fase B — Cablear contexto + eficiencia en el agente

- [x] **B1** Extender `buildSystemPrompt(..., screenContextBlock?)` e insertar bloque (design §1.2). Actualizar `systemPrompt.test.ts`.
- [x] **B2** `useChatStore`: `setChatRouteSnapshot` + variables de módulo / estado para `{ pathname, search }` (design §1.3).
- [x] **B3** Montar sync de ruta: en `AssistantPanel` con `useLocation` → `setChatRouteSnapshot` (CA-01.* runtime).
- [x] **B4** En `send()`: resolver `UiContext` desde snapshot + `useDataStore`/`useAppStore`; pasar bloque a `buildSystemPrompt`.
- [x] **B5** En `send()`: `expandSlash` antes de armar el turno; mensaje de usuario = texto expandido (CA-03.4).
- [x] **B6** En `send()`: `shouldSkipRag` + no llamar `buildRagContext` cuando skip (CA-06.1, 06.5).
- [x] **B7** En `send()`: `history: trimAgentHistory(agentHistory)` al invocar `runAgentTurn` (CA-06.2–06.3).
- [x] **B8** Extender firma `send(text, opts?: { skipRag?: boolean; regenerate?: boolean })` (design §6).
- [x] **B9** Guardar `lastTurnHistoryLength` + `lastTurnUserText` al iniciar turno (prep HU-05).
- [x] **B10** Checkpoint: `npx vitest run` + `npm run typecheck` verdes.

## Fase C — Chips UI (empty, composer, header, follow-ups)

- [x] **C1** Componente `QuickActionChips.tsx` (design §2.2).
- [x] **C2** `AssistantEmptyState`: reemplazar `SUGGESTIONS` hardcodeadas por `selectQuickActions(ctx, "empty")` (necesita ctx o actions por props).
- [x] **C3** `AssistantPanel`: resolver ctx en render (location + stores) para header chip (CA-01.5) y pasar actions al empty state.
- [x] **C4** Fila de chips densos encima de `ChatInput` cuando `messages.length > 0` (CA-02.2–02.6); deshabilitar si streaming/awaiting.
- [x] **C5** `FollowUpChips` / integración en `ChatMessageList` solo en último assistant + idle (CA-04.1–04.4).
- [x] **C6** `onPick` → `send(prompt, { skipRag: action.skipRag })`.
- [x] **C7** Checkpoint visual smoke parcial: empty + composer chips con/sin proyecto.

## Fase D — Slash en el input

- [x] **D1** `ChatInput`: detectar prefijo `/`, lista filtrada de `listSlashCommands()`, insertar al elegir (CA-03.1).
- [x] **D2** Accesibilidad: teclado (flechas/Enter o Tab) básico; Escape cierra lista.
- [x] **D3** Verificar que el envío pasa por expand del store (no expandir dos veces en el input).
- [x] **D4** Checkpoint: smoke `/resumen` con y sin proyecto en URL.

## Fase E — Copiar, reintentar, regenerar

- [x] **E1** `ChatMessageBubble`: botón Copiar en mensajes assistant con texto (CA-05.1).
- [x] **E2** Implementar `regenerateLast()` (design §4.2) + `send(..., { regenerate: true })` sin duplicar user bubble (CA-05.3–05.5).
- [x] **E3** Botón Regenerar en la última burbuja assistant cuando idle (CA-05.3–05.4).
- [x] **E4** Banner de error en `AssistantPanel`: botón “Reintentar” → `regenerateLast()` (CA-05.2).
- [x] **E5** Test de store o de helpers de recorte de history para regenerate (al menos un test unitario del slice de history).
- [x] **E6** Checkpoint: error simulado / regenerar no duplica mensajes de usuario.

## Fase F — Cierre

- [x] **F1** Ejecutar `smoke.md` completo y marcar casillas.
- [x] **F2** `npm run typecheck` + `npm test` + `npm run lint` + `npm run build`.
- [x] **F3** Actualizar estado del spec → **IMPLEMENTADO**.
- [ ] **F4** Opcional: en `roadmap.ts`, `assistant-project-context` → `status: "shipped"` (o equivalente del archivo).
- [x] **F5** `graphify update .`
- [ ] **F6** Commits por fase (`feat(assistant): … (spec 050)`), en español, estilo del repo.

## Invariantes (no tocar)

- `runAgentTurn` loop / `MAX_ROUNDS` — no reescribir salvo pasar `history` ya trimmeado.
- Confirmación de escrituras y `approveAll` (048) — intactos.
- `SCHEMA_VERSION` / migraciones — sin cambios.
- Providers 047/049 — sin cambios de transporte.
- No agregar dependencias npm.
- No filtrar el catálogo de tools (D9).

## Orden de commits sugerido

1. `feat(assistant): contexto de pantalla y módulos de chat eficientes (spec 050 A-B)`
2. `feat(assistant): chips contextuales y follow-ups (spec 050 C)`
3. `feat(assistant): comandos slash en el input (spec 050 D)`
4. `feat(assistant): copiar y regenerar respuestas (spec 050 E)`
