# Prompt de ejecución — Spec 048

> Pegar esto como primer mensaje en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 048 de este proyecto: `specs/048-continuidad-tareas-y-asistente/`.

Son 4 mejoras de UX/productividad, independientes entre sí (no se pisan en archivos ni en
lógica), ya planificadas: (1) recordar globalmente la última pestaña de proyecto vista y
usarla como default al abrir cualquier proyecto, (2) mostrar el panel de detalle de tarea y
el chat del asistente lado a lado en escritorio en vez de superpuestos, (3) un botón
"Aprobar todo" en las confirmaciones de escritura de la IA que auto-aprueba el resto de
escrituras del turno actual (no de toda la conversación), y (4) poder pegar una imagen del
portapapeles directamente en la sección de Anexos. **No re-diseñes ni re-preguntes el
alcance**: ejecutá lo que `spec.md`, `design.md` y `tasks.md` ya fijaron. Si algo es
ambiguo en el borde de una decisión ya documentada, elegí la opción alineada a las
"Decisiones fijadas" del spec y seguí; solo preguntá si chocás con un invariante real o un
bug bloqueante no previsto.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` del proyecto (raíz) y `.claude/CLAUDE.md` — reglas graphify. Este repo tiene
   grafo en `graphify-out/`: usá `graphify query "..."` / `graphify explain "..."` antes de
   leer archivos fuente a ciegas, y `graphify update .` al terminar.
2. `specs/048-continuidad-tareas-y-asistente/spec.md` — contexto de las 4 fricciones
   (con cita de línea exacta de dónde viene cada una), decisiones D1-D11, HU-01 a HU-04 con
   sus CA, fuera de alcance, riesgos.
3. `specs/048-continuidad-tareas-y-asistente/design.md` — snippets exactos de cada cambio,
   por HU (§1 memoria de pestaña, §2 layout lado a lado con la explicación de por qué la
   constante de ancho vive en `useChatStore.ts` y no en `AssistantPanel.tsx`, §3
   auto-aprobación con el flag turn-scoped, §4 paste de imagen), y §5 alternativas
   descartadas y por qué.
4. `specs/048-continuidad-tareas-y-asistente/tasks.md` — fases A-E (A a D son
   independientes entre sí, podés hacerlas en el orden que prefieras; E es el cierre).
5. Código de referencia ya existente (leerlo, no asumirlo — puede haber cambiado desde que
   se escribió el spec):
   - `src/features/projects/ProjectDetailPage.tsx` (HU-01)
   - `src/store/useChatStore.ts` completo (HU-02 constante, HU-03 flag+acción) — en
     particular el loop `for (const call of toolCalls)` en
     `src/ai/agent/runAgentTurn.ts` (**no se toca**, solo hay que entender por qué es
     secuencial y por qué la auto-aprobación vive en el store y no ahí)
   - `src/features/assistant/AssistantPanel.tsx` y `WriteConfirmCard.tsx` (HU-02, HU-03)
   - `src/features/projects/components/kanban/TaskDetailDrawer.tsx` completo, en particular
     el `useEffect` de `handleMouseMove`/`handleMouseUp` que ya existe (HU-02)
   - `src/components/attachments/AttachmentsSection.tsx`,
     `src/hooks/useAttachmentActions.ts` (`addFiles`), y
     `src/domain/attachments/allowlist.ts` (`classifyFile` — por qué el nombre del File
     pegado importa) (HU-04)

## Baseline a verificar al empezar

```bash
npm run typecheck
npm test
npm run lint
```

Anotá el número de tests. **Solo puede subir** (fase C agrega al menos un test nuevo de
`useChatStore`, ver tasks.md C7). `SCHEMA_VERSION` no cambia — sin migración.

## Cómo ejecutar

Las fases A, B, C, D son independientes (HU distintas, sin archivos compartidos entre sí
salvo que B y C comparten `useChatStore.ts` pero en secciones distintas — sin conflicto real
si se hacen una detrás de la otra). Orden sugerido, de menor a mayor superficie de cambio:

1. **Fase A** (HU-01) — memoria de pestaña, contenida en un solo archivo
   (`ProjectDetailPage.tsx`). Verificá especialmente CA-01.3 (deep link `?tab=` gana sobre
   la memoria) y CA-01.5 (localStorage corrupto no rompe nada).
2. **Fase D** (HU-04) — paste de imagen, contenida en `AttachmentsSection.tsx`. Prestá
   atención a D9/D11 del spec: el nombre del archivo pegado se genera desde el MIME type
   (no confiar en el nombre que da el navegador), y no hacer `preventDefault()` cuando el
   portapapeles no trae imagen (no romper paste de texto en los campos del formulario).
3. **Fase C** (HU-03) — botón "Aprobar todo". Ojo con el alcance exacto (D7): auto-aprobar
   **el resto del turno actual**, no la conversación completa — el flag se resetea en
   `send()`, `stop()` y `newConversation()` (design §3.2, los tres puntos).
4. **Fase B** (HU-02) — layout lado a lado. Es la que toca más archivos (3) y tiene el
   detalle más sutil: la constante `ASSISTANT_PANEL_WIDTH` va en `useChatStore.ts`, **no**
   en `AssistantPanel.tsx`, justamente para no romper el `lazy()` de ese componente en
   `AppLayout.tsx` — leé la explicación completa en design.md §2.1 antes de decidir dónde
   ponerla si te tienta simplificar.
5. **Fase E** — typecheck/tests/lint/build, marcar spec **IMPLEMENTADO**, `graphify update .`.

Después de **cada fase**: `npm run typecheck` + `npm test` (+ lint) limpios antes de la
siguiente.

Marcá casillas en `tasks.md` al completar. Actualizá el estado del `spec.md` a
**IMPLEMENTADO** al final.

## Decisiones ya fijadas — no re-preguntar

1. HU-01: memoria **global** (una sola clave `localStorage`, no por proyecto). Deep link
   `?tab=` explícito siempre gana y además se guarda como nueva "última pestaña".
2. HU-02: el layout lado a lado aplica **solo en escritorio** (`useBreakpoint("lg")`). En
   mobile/tablet no cambia nada — ambos overlays siguen siendo full-screen independientes.
3. HU-02: `ASSISTANT_PANEL_WIDTH` vive en `useChatStore.ts` (no en `AssistantPanel.tsx`) para
   no romper el code-splitting del `lazy()` en `AppLayout.tsx`.
4. HU-03: "Aprobar todo" auto-aprueba **el resto del turno/respuesta actual**, no la
   conversación completa. El próximo mensaje que el usuario envíe vuelve a pedir
   confirmación normalmente. El flag vive en memoria (variable de módulo), no en
   `localStorage`/IndexedDB.
5. HU-03: no se toca `runAgentTurn.ts` — el loop de tool calls sigue secuencial, la
   auto-aprobación es enteramente responsabilidad del store (`onConfirmWrite` corta camino
   antes de crear la tarjeta).
6. HU-04: el paste funciona en toda la sección de Anexos (`AttachmentsSection.tsx`), no solo
   en el drawer de tarea — beneficia a todos los formularios que la reusan (Área, Producto,
   plantillas). No se toca `AttachmentDropZone.tsx`.
7. HU-04: si el portapapeles no trae imagen, no se llama `preventDefault()` — el paste de
   texto en cualquier campo (Título, Resumen, Descripción) sigue funcionando sin cambios.
8. Sin dependencias npm nuevas en ninguna de las 4 HU. Sin cambios de schema/migración.

## Invariantes (no romper)

- No tocar `src/domain/`, `src/storage/`, ni ningún schema/migración.
- No tocar `src/ai/agent/runAgentTurn.ts` (HU-03 vive enteramente en `useChatStore.ts`).
- No tocar `src/components/attachments/AttachmentDropZone.tsx` (HU-04 vive en
  `AttachmentsSection.tsx`).
- No convertir el import de `AssistantPanel.tsx` en `TaskDetailDrawer.tsx` en un import
  estático directo — solo se importa la constante desde `useChatStore.ts` (ver decisión 3).
- El comportamiento existente sin las 4 mejoras activas no cambia: proyecto sin pestaña
  guardada abre en "Resumen"; asistente y panel de tarea abiertos por separado se ven igual
  que hoy; confirmar/cancelar una escritura individual sin usar "Aprobar todo" se comporta
  exactamente igual que hoy; drag&drop y file picker de anexos no cambian.

## Definición de hecho

- Fases A-E de `tasks.md` hechas.
- CA de HU-01, HU-02, HU-03, HU-04 del `spec.md` cubiertos.
- `npm run typecheck`, `npm test`, `npm run lint`, `npm run build` OK.
- Smoke manual de verdad en el navegador para HU-01, HU-02 y HU-04 (no solo marcado) — en
  particular CA-01.3 (deep link), CA-02.4 (resize con clamp), CA-04.3 (paste de texto no
  roto). HU-03 tiene además cobertura de unit test (tasks.md C7).
- Spec marcada **IMPLEMENTADO**.
- `graphify update .` al final.

## Arranque

Empezá por **Fase A** (memoria de pestaña, `ProjectDetailPage.tsx`) — es la más chica y
autocontenida, buen calentamiento antes de las otras tres. No escribas un plan paralelo: usá
`tasks.md` como checklist y reportá al cerrar cada fase qué quedó verde y qué falta.

---
