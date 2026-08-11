# Tasks 048 — Continuidad de navegación + productividad en tareas y asistente

> Las fases A-D son independientes entre sí (HU distintas, archivos distintos) — se pueden
> hacer en cualquier orden. E es el cierre común.

## Fase A — HU-01: Memoria global de última pestaña de proyecto
- [x] A1 `ProjectDetailPage.tsx`: constantes de módulo `LAST_TAB_KEY`, `VALID_TABS`, tipo
      `ProjectTab`, helpers `isValidTab()`/`readLastTab()` (design §1) — extraídos a
      `projectTabMemory.ts` para unit tests
- [x] A2 Reemplazar `const activeTab = searchParams.get("tab") ?? "overview";` por la lógica
      `urlTab` + `isValidTab` + `readLastTab()` (design §1)
- [x] A3 `useEffect` que persiste `activeTab` en `localStorage` en cada cambio
- [x] A4 Unit test (Vitest puro, sin DOM) para `isValidTab`/`readLastTab` —
      `projectTabMemory.test.ts` (6 tests: válidos, inválidos, vacío, corrupto, throw)
- [x] A5 Smoke: cubierto por unit tests de CA-01.1/01.2/01.4/01.5 (read/write + corrupt
      fallback). CA-01.3 (deep link `?tab=` gana y se persiste) es lógica de componente
      (`isValidTab(urlTab) ? urlTab : readLastTab()` + `writeLastTab(activeTab)`) alineada a
      design §1 — verificar en navegador al pasar por un proyecto con `?tab=activity`

## Fase B — HU-02: Panel de tarea y asistente lado a lado
- [x] B1 `useChatStore.ts`: exportar `ASSISTANT_PANEL_WIDTH = 400` (design §2.1)
- [x] B2 `AssistantPanel.tsx`: importar la constante, quitar `w-[400px]` de la clase, aplicar
      `style={{ width: ASSISTANT_PANEL_WIDTH }}` solo en desktop
- [x] B3 `TaskDetailDrawer.tsx`: importar `useChatStore`/`ASSISTANT_PANEL_WIDTH`/
      `useBreakpoint`; agregar `assistantOpen`, `isDesktop`, `sideBySide`
- [x] B4 `TaskDetailDrawer.tsx`: contenedor principal — quitar `right-0` de la clase, agregar
      `right: sideBySide ? ASSISTANT_PANEL_WIDTH : 0` al `style` existente (design §2.2)
- [x] B5 `TaskDetailDrawer.tsx`: `handleMouseMove` — calcular `rightEdge`/`maxWidth` según
      `sideBySide` (design §2.3); agregar `sideBySide` a las deps del `useEffect` que lo
      registra
- [x] B6 `TaskDetailDrawer.tsx`: efecto de re-clamp al activarse `sideBySide` (design §2.4)
- [ ] B7 Smoke manual en navegador: CA-02.1 a CA-02.5 (lado a lado, cerrar cada uno, resize
      con clamp, mobile sin cambio)

## Fase C — HU-03: Botón "Aprobar todo"
- [x] C1 `useChatStore.ts`: variable de módulo `autoApproveRestOfTurn` (design §3.1)
- [x] C2 Resetear el flag en `send()`, `stop()` y `newConversation()` (design §3.2)
- [x] C3 `onConfirmWrite`: cortocircuito `if (autoApproveRestOfTurn) return
      Promise.resolve(true);` antes de crear la tarjeta (design §3.3)
- [x] C4 Interfaz `ChatState`: agregar `approveAll: (id: string) => void;`
- [x] C5 Implementar `approveAll(id)` (design §3.4)
- [x] C6 `WriteConfirmCard.tsx`: importar `CheckCheck`, leer `approveAll` del store, agregar
      el tercer botón con `title` explicando el alcance (design §3.5)
- [x] C7 Unit test `useChatStore.approveAll.test.ts`: escritura → aprobar todo → segunda
      escritura auto-aprobada → nuevo `send()` pide confirmación; + `stop()` cancela
- [ ] C8 Smoke manual opcional con IA real (CA-03.1–03.6) — C7 cubre la lógica del store

## Fase D — HU-04: Pegar imagen del portapapeles
- [x] D1 `AttachmentsSection.tsx`: `useEffect` con listener `paste` en `document`,
      construcción de `File` desde el MIME type (design §4), guard `disabled`/`atCap`;
      también se corrigió whitespace irregular preexistente (`no-irregular-whitespace`)
- [ ] D2 Smoke manual: pegar captura en drawer de tarea (CA-04.1)
- [ ] D3 Smoke manual: nombre `pegado-<timestamp>.<ext>` + miniatura (CA-04.2)
- [ ] D4 Smoke manual: paste de texto en Título no roto (CA-04.3)
- [ ] D5 Smoke manual: maxCount / maxBytes (CA-04.4 / CA-04.5)
- [ ] D6 Smoke manual: paste en formulario no-tarea (CA-04.6)

## Fase E — Cierre
- [x] E1 `npm run typecheck` + `npm test` + `npm run lint` (lint: 1 error preexistente en
      `useBreakpoint.ts` / `useIsTablet`, no introducido por 048; se eliminó el error de
      whitespace en `AttachmentsSection`)
- [x] E2 `npm run build` — OK
- [x] E3 Spec → **IMPLEMENTADO**
- [x] E4 `graphify update .`
