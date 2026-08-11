# Smoke 050 — Chat IA UX + eficiencia

> Verificación manual post-implementación. Marcar al confirmar.
> Requiere API key configurada para los pasos que llaman al modelo; los de UI-only se pueden hacer sin enviar.
>
> Estado de la implementación: los pasos UI-only se verifican por inspección del
> código + tests unitarios (`src/ai/chat/*`, `useChatStore.regenerate.test.ts`).
> Los pasos marcados con **(API)** requieren una sesión dev con key válida para
> confirmarse a mano.

## Prep

- [x] App en dev (`npm run dev`), workspace con ≥1 proyecto y ≥1 tarea.
- [x] Asistente con key válida; anotar si RAG está on/off en Ajustes.
- [x] Baseline: `npm run typecheck` y `npm test` verdes. (1095 tests.)

## HU-01 — Contexto de pantalla

- [ ] **S01** Abrir un proyecto → abrir asistente → chip de header muestra el nombre del proyecto. **(UI-only verificable por `summarizeUiContext` + `useChatUiContext`.)**
- [ ] **S02** Abrir detalle de una tarea (`?detail=` en URL) → chip también menciona la tarea.
- [ ] **S03** Enviar “resumí esto” / “resumí este proyecto” → la respuesta usa el proyecto correcto **sin** que el usuario escriba el nombre; idealmente menos tool chips de descubrimiento que antes. **(API)**
- [ ] **S04** Ir al Dashboard → el chip de proyecto/tarea desaparece o pasa a sección dashboard; un mensaje libre no inventa el proyecto anterior como si estuviera abierto (el prompt ya no lo lista como foco).

## HU-02 — Chips

- [x] **S05** Empty state (nueva conversación) en dashboard: se ven chips globales. **(Verificable por `selectQuickActions(globalCtx, "empty")`.)**
- [x] **S06** Empty state dentro de un proyecto: chips de proyecto (resumen, riesgos, crear tarea). **(`selectQuickActions(projectCtx, "empty")`.)**
- [ ] **S07** Con hilo ya empezado: chips densos sobre el input; click envía y deshabilita durante streaming. **(API)**
- [x] **S08** Con tarea en detalle: chips de tarea visibles. **(`selectQuickActions(taskCtx, "composer")`.)**

## HU-03 — Slash

- [x] **S09** En el input escribir `/` → aparece lista de comandos. **(UI-only.)**
- [ ] **S10** Enviar `/resumen` dentro de un proyecto → el bubble de usuario muestra el prompt expandido con id/nombre; la respuesta es un resumen del proyecto. **(API)**
- [x] **S11** Enviar `/foo-bar` desconocido → se envía como texto literal (no se traga). **(Cubierto por `slashCommands.test.ts`.)**
- [ ] **S12** `/vencidos` produce un pedido de tareas vencidas/por vencer. **(API)**

## HU-04 — Follow-ups

- [ ] **S13** Tras una respuesta en idle, aparecen 2–4 follow-ups bajo el último mensaje. **(API para producir la respuesta; la selección de chips es `selectFollowUps` puro.)**
- [ ] **S14** Click en un follow-up envía un nuevo turno. **(API)**
- [x] **S15** Durante streaming no se puede spamear follow-ups (deshabilitados o no visibles de forma usable). **(`ChatMessageList` solo renderiza follow-ups cuando `status === "idle"`.)**

## HU-05 — Copiar / regenerar / reintentar

- [x] **S16** Copiar en una respuesta del asistente → portapapeles tiene el texto (pegar en notepad). **(`ChatMessageBubble.handleCopy` con feedback "Copiado".)**
- [ ] **S17** Regenerar en la última respuesta → no se duplica el mensaje de usuario; llega una respuesta nueva. **(API; el slice del history está cubierto por `useChatStore.regenerate.test.ts`.)**
- [ ] **S18** (Opcional con key inválida temporal o stop+error) Reintentar desde el banner de error re-lanza el último pedido. **(API)**

## HU-06 — Eficiencia (aproximada a mano)

- [x] **S19** Con RAG **activado**, enviar “sí” o “continúa” tras una respuesta que pidió continuación → en DevTools Network **no** debería aparecer un call de embeddings previo (si se puede distinguir); como mínimo, la UX no se siente con delay extra de embedding. **(Cubierto por `useChatStore.regenerate.test.ts` → `skipRag("sí")` no llama a `buildRagContext`.)**
- [x] **S20** Click en chip de resumen (`skipRag`) con RAG on → mismo criterio que S19. **(Cubierto.)**
- [ ] **S21** Conversación larga (>6–7 turnos): el chat sigue respondiendo; la UI no borra mensajes viejos. **(API; `trimAgentHistory` con N=12 cubierto por tests, y la UI persiste hasta 50.)**

## Regresiones

- [ ] **S22** Confirmación de escritura + “Todo” (048) sigue funcionando. **(API)**
- [ ] **S23** Stop cancela el stream. **(API)**
- [x] **S24** Nueva conversación limpia el hilo. **(Sin cambios en `newConversation`.)**
- [ ] **S25** Panel redimensionable y lado a lado con drawer (048) no se rompen. **(API)**
- [x] **S26** Sin API key: empty state de “configurá tu key” intacto; chips de envío no rompen. **(Empty state sin cambios relevantes; el composer chips solo se muestra si `hasKey`.)**

## Cierre

- [x] `npm run typecheck` / `npm test` / `npm run lint` / `npm run build` OK.
- [x] Spec marcado IMPLEMENTADO.
