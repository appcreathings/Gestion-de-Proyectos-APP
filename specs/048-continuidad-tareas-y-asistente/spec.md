# Spec 048 — Continuidad de navegación + productividad en tareas y asistente

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/048-continuidad-tareas-y-asistente/` · Fecha: 2026-08-11
> Baseline al empezar: `SCHEMA_VERSION` **19** (sin bump de schema — features de UI/estado de cliente)
> Depende de: nada (no toca dominio ni storage)
> Principios: **IV** (diseño limpio), **V** (simplicidad incremental)

## 1. Contexto

Cuatro fricciones de uso diario detectadas por el usuario, sin relación de dependencia entre
sí pero agrupadas en un solo spec por ser todas mejoras puntuales de UX ya acotadas:

1. **`ProjectDetailPage.tsx`** siempre abre en la pestaña "Resumen" (`activeTab =
   searchParams.get("tab") ?? "overview"`, línea 52) salvo que la URL traiga `?tab=...`
   explícito (p. ej. al llegar desde un link de tarea, spec 043). No hay memoria de cuál fue
   la última pestaña que el usuario miró — si trabaja mayormente en "Tareas", tiene que
   hacer clic ahí cada vez que abre cualquier proyecto.

2. **`AssistantPanel.tsx`** se monta como `<aside>` hermano de `<main>` dentro del `<div
   className="flex h-dvh">` raíz de `AppLayout.tsx` (línea 448) — ocupa `w-[400px]` fijo,
   anclado al borde derecho por flujo normal de flexbox. **`TaskDetailDrawer.tsx`**, en
   cambio, es `fixed inset-y-0 right-0 z-50` (línea 439-452) — se ancla al viewport,
   ignorando el flujo. Ambos comparten `z-50`. Como `AssistantPanel` está más abajo en el
   DOM que el contenido de `<main>` (donde vive `TaskDetailDrawer`, montado dentro de
   `TasksTab`/`AreasTab`), en empate de `z-index` gana el que aparece después en el DOM: hoy,
   con el asistente abierto, sus 400px de ancho **tapan visualmente el borde derecho del
   panel de tarea** en vez de convivir uno al lado del otro.

3. **`onConfirmWrite`** (`runAgentTurn.ts:227-239`, `useChatStore.ts:201-209`) resuelve una
   `Promise<boolean>` por cada tool call de escritura, y el loop de tool calls en
   `runAgentTurn.ts:160-176` es **secuencial**: `for (const call of toolCalls) { await
   executeCall(...) }`. Esto significa que solo puede haber **una** tarjeta
   `WriteConfirmCard` visible a la vez — el siguiente tool call de escritura ni se dispara
   hasta que el usuario responde el actual. Cuando el asistente propone una tanda de
   acciones (p. ej. "creá estas 5 tareas"), el usuario tiene que hacer clic en "Confirmar"
   5 veces seguidas, una por una, esperando cada round-trip.

4. **`AttachmentsSection.tsx`** (usada en `TaskDetailDrawer.tsx:960-964` y otros formularios)
   solo acepta archivos por click-to-pick o drag&drop (`AttachmentDropZone.tsx`) — no hay
   forma de pegar una imagen del portapapeles (p. ej. una captura de pantalla recién
   copiada) sin guardarla primero a disco y luego arrastrarla.

## 2. Objetivo

1. Recordar globalmente la última pestaña de proyecto vista (Resumen/Áreas/Tareas/
   Automatizaciones/Actividad) y usarla como default al abrir **cualquier** proyecto que no
   traiga `?tab=` explícito en la URL.
2. Cuando el asistente de IA y el panel de detalle de tarea están abiertos a la vez en
   escritorio, mostrarlos **lado a lado** (info de tarea a la izquierda, chat a la derecha)
   en vez de superpuestos.
3. Agregar un botón "Aprobar todo" en la tarjeta de confirmación de escritura que apruebe la
   acción actual y **auto-apruebe sin volver a preguntar** el resto de escrituras que la IA
   pida durante el resto de esa misma respuesta/turno. El próximo mensaje que el usuario
   envíe vuelve a pedir confirmación normalmente.
4. Permitir pegar una imagen del portapapeles (`Ctrl+V` / `Cmd+V`) directamente sobre la
   sección de anexos para adjuntarla, sin pasar por el selector de archivos.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| D1 | Memoria de pestaña **global**, no por proyecto: una sola clave `localStorage` (`hito:last-project-tab`), no un mapa por `projectId`. | Confirmado con el usuario (opción recomendada) — es lo que resuelve literalmente "no quiero estar dando click a Tareas siempre"; un mapa por proyecto es más estado para un beneficio marginal no pedido. |
| D2 | Si la URL trae `?tab=` explícito (deep link, p. ej. desde un link de tarea de spec 043), **ese valor gana** sobre la memoria guardada, y además la pisa como nueva "última pestaña" — visitar una pestaña por cualquier vía cuenta como "la última que viste". | Comportamiento intuitivo: un link compartido a `?tab=activity` no debería ser silenciosamente reemplazado por una preferencia vieja; y si el usuario llegó ahí, es razonable asumir que es donde quiere seguir la próxima vez. |
| D3 | Valor guardado se valida contra el set de pestañas válidas (`overview\|areas\|tasks\|automations\|activity`) antes de usarse; si es inválido/corrupto, fallback a `"overview"` (comportamiento actual). | Defensivo ante `localStorage` editado a mano o una futura pestaña removida. |
| D4 | El layout lado a lado (HU-02) aplica **solo en escritorio** (`useBreakpoint("lg")`, mismo criterio que `AssistantPanel.tsx`). En mobile, `TaskDetailDrawer` sigue full-screen (`w-full`) tapando lo que hubiera debajo, igual que hoy — no hay espacio para dos paneles a la vez en una pantalla chica. | Coherente con que `AssistantPanel` mismo ya es full-screen en mobile (`fixed inset-0`) — dos overlays full-screen en mobile no tienen forma sensata de convivir lado a lado. |
| D5 | El ancho del asistente (`400`px) se extrae a una constante exportada (`ASSISTANT_PANEL_WIDTH`) reusada por `AssistantPanel.tsx` y `TaskDetailDrawer.tsx`, en vez de duplicar el número mágico. | Evita que ambos archivos se desincronicen si el ancho del asistente cambia en el futuro. |
| D6 | Cuando ambos paneles están abiertos en escritorio, el ancho **máximo** al que se puede arrastrar `TaskDetailDrawer` (hoy clamp `[320, 800]`) se reduce dinámicamente para que `drawerWidth + ASSISTANT_PANEL_WIDTH` no exceda `window.innerWidth - 200` (200px de margen mínimo visible del contenido principal detrás). El clamp mínimo (`320`) no cambia. | Evita que arrastrar el borde del panel de tarea empuje al asistente fuera de pantalla o deje 0px de contenido principal visible; 200px es un margen conservador, no un valor crítico a ajustar con precisión. |
| D7 | "Aprobar todo" = **auto-aprobar el resto de la respuesta actual**, no toda la conversación. El flag de auto-aprobación vive en memoria (no persiste en `localStorage`/IndexedDB) y se resetea al iniciar cada `send()` nuevo. | Confirmado con el usuario (opción recomendada) — evita el riesgo de una sesión larga donde el usuario olvida que dejó auto-aprobación activada y la IA modifica datos sin más confirmaciones en mensajes futuros no relacionados. |
| D8 | La tarjeta `WriteConfirmCard` no cambia su copy individual; el botón "Aprobar todo" es un **tercer botón** además de "Cancelar"/"Confirmar", visible siempre (no solo cuando se detecta que vienen más escrituras — el store no puede saber de antemano cuántos tool calls de escritura pedirá el modelo en el resto del turno). | El modelo decide sus próximos tool calls dinámicamente en base a la respuesta de cada uno (arquitectura ReAct-like de `runAgentTurn.ts`); no hay forma de saber "cuántas quedan" sin ejecutarlas. Ofrecer el botón siempre es más simple que intentar predecirlo (Principio V). |
| D9 | Pegado de imágenes: se reconstruye el `File` con un nombre generado a partir del MIME type del portapapeles (`image/png` → `pegado-<timestamp>.png`, etc.), **no** se confía en `DataTransferItem.getAsFile().name`. | `classifyFile()` (`allowlist.ts:42-62`) exige una extensión válida en el nombre del archivo para aceptarlo; el nombre que entrega el portapapeles no está garantizado por spec en todos los navegadores/casos, así que depender de él es frágil. |
| D10 | El paste handler se agrega en `AttachmentsSection.tsx` (no en `AttachmentDropZone.tsx` ni como listener global de `window` en `AppLayout`), activo mientras el componente está montado, sin requerir que la zona de drop tenga foco. Se ignora si `disabled` o si ya se llegó a `maxCount` (mismos guards que `addFiles`/dropzone). | `AttachmentsSection` es el componente reusado en todos los formularios con anexos (tarea, área, producto, plantillas); agregarlo ahí beneficia a todos sin duplicar lógica. Scoparlo al montaje evita un listener global permanente en `AppLayout` que tendría que resolver a qué entidad pertenece el paste. |
| D11 | Si el portapapeles no contiene ninguna imagen (paste de texto normal, p. ej. en el campo Título o Descripción), el handler no hace nada y dej a que el paste de texto siga su curso normal — no se llama `preventDefault()` salvo cuando efectivamente se va a adjuntar una imagen. | No romper el paste de texto en ningún campo del drawer; el 042/044 (RichTextField, links) no debe verse afectado. |

## 4. Historias de usuario y criterios de aceptación

### HU-01 — Recordar la última pestaña de proyecto · **núcleo**

**Como** usuario que trabaja mayormente en una sección (p. ej. Tareas), **quiero** que al
abrir cualquier proyecto se muestre esa misma sección **para** no tener que hacer clic en
ella cada vez.

- **CA-01.1** Abrir un proyecto, cambiar a la pestaña "Tareas", navegar a otro proyecto (o
  recargar el mismo) sin `?tab=` en la URL → abre directo en "Tareas".
- **CA-01.2** Repetir con "Áreas", "Automatizaciones", "Actividad" → cada una se recuerda
  igual (la última pestaña vista, sea cual sea).
- **CA-01.3** Llegar a un proyecto vía un link que trae `?tab=activity&focus=...` (spec 043)
  → se respeta `activity` aunque la memoria guardada fuera otra pestaña; después de esa
  visita, la memoria queda en `activity`.
- **CA-01.4** Primera vez que se usa la app (sin nada en `localStorage` para esta clave) →
  default `"overview"`, igual que hoy.
- **CA-01.5** Si `localStorage` no está disponible o el valor guardado es inválido → fallback
  silencioso a `"overview"`, sin romper la carga del proyecto.

### HU-02 — Panel de tarea y chat de IA lado a lado en escritorio

**Como** usuario que usa el asistente mientras reviso una tarea, **quiero** ver el detalle de
la tarea y el chat al mismo tiempo, sin que uno tape al otro, **para** poder pedirle
cambios a la IA mientras leo el contexto de la tarea.

- **CA-02.1** Con el asistente abierto y luego abrir el detalle de una tarea (o al revés,
  abrir el asistente con el detalle ya abierto) en escritorio (`lg`+) → el panel de tarea
  queda anclado inmediatamente a la izquierda del panel del asistente, sin superponerse ni
  dejar espacio vacío entre ambos.
- **CA-02.2** Cerrar el asistente con el panel de tarea abierto → el panel de tarea vuelve a
  anclarse al borde derecho del viewport (comportamiento actual).
- **CA-02.3** Cerrar el panel de tarea con el asistente abierto → el asistente sigue en su
  posición normal, sin cambios.
- **CA-02.4** Redimensionar el panel de tarea (drag del borde) con el asistente abierto → el
  ancho máximo alcanzable respeta D6 (no empuja al asistente fuera de pantalla ni dejan
  <200px de contenido principal visible detrás).
- **CA-02.5** En mobile/tablet (por debajo de `lg`) el comportamiento no cambia: ambos siguen
  siendo overlays full-screen independientes, como hoy (D4).

### HU-03 — Aprobar todas las escrituras pendientes del turno actual

**Como** usuario que le pide a la IA una tanda de cambios, **quiero** un botón para aprobar
todo de una vez **para** no tener que confirmar cada acción individualmente cuando confío en
lo que el asistente está por hacer.

- **CA-03.1** El asistente propone una escritura → la tarjeta de confirmación muestra tres
  botones: "Cancelar", "Confirmar" y "Aprobar todo".
- **CA-03.2** Click en "Aprobar todo" → se aprueba la acción actual y la tarjeta desaparece,
  igual que "Confirmar".
- **CA-03.3** Si el asistente pide una nueva escritura más adelante en la **misma**
  respuesta (mismo `send()`), se ejecuta directamente sin mostrar tarjeta de confirmación
  (auto-aprobada).
- **CA-03.4** En el **siguiente** mensaje que el usuario envíe, si el asistente vuelve a
  pedir una escritura, la tarjeta de confirmación vuelve a aparecer normalmente (el flag no
  persiste entre turnos).
- **CA-03.5** Click en "Cancelar" en cualquier tarjeta (auto-aprobación no haya sido activada
  o no) sigue cancelando solo esa acción puntual, sin afectar acciones futuras.
- **CA-03.6** Detener la generación (botón "Stop"/`stop()`) mientras hay auto-aprobación
  activa para el turno la corta igual que hoy (no quedan escrituras "fantasma" aprobadas
  para un turno que ya terminó).

### HU-04 — Pegar imagen del portapapeles en anexos

**Como** usuario que acaba de tomar una captura de pantalla, **quiero** pegarla directamente
en los anexos de una tarea **para** no tener que guardarla a disco primero.

- **CA-04.1** Con el foco en cualquier parte de la sección de Anexos de una tarea (o dentro
  del drawer, ver D10) y una imagen en el portapapeles, `Ctrl+V`/`Cmd+V` → la imagen se sube
  como anexo nuevo, igual que si se hubiera arrastrado un archivo.
- **CA-04.2** El anexo pegado aparece con un nombre legible (`pegado-<fecha/hora>.<ext>`) y
  el `kind`/miniatura correctos según su tipo MIME (`image`).
- **CA-04.3** Pegar mientras el campo Título/Resumen/Descripción tiene el foco y el
  portapapeles solo tiene texto → el paste de texto funciona normal, sin interferencia
  (D11).
- **CA-04.4** Pegar una imagen cuando ya se llegó a `maxCount` anexos, o con la sección
  `disabled` → no agrega nada (mismo guard que drag&drop/picker).
- **CA-04.5** Pegar una imagen que excede `maxBytes` → mismo mensaje de error (`toast`) que
  hoy muestra `addFiles` para un archivo demasiado grande.
- **CA-04.6** Funciona igual en cualquier otro formulario que use `AttachmentsSection`
  (Área, Producto, plantillas), no solo en tareas — ver D10.

## 5. Requisitos no funcionales

- Sin nuevas dependencias npm.
- Sin cambios de schema ni migración (`SCHEMA_VERSION` se queda en 19) — todo el estado
  nuevo es de cliente (`localStorage`, estado en memoria de Zustand).
- No degradar comportamiento existente: pestañas de proyecto sin memoria guardada siguen
  abriendo en "Resumen" (HU-01); el asistente y el panel de tarea abiertos por separado se
  ven igual que hoy (HU-02); confirmar/cancelar una escritura individual sin tocar "Aprobar
  todo" se comporta exactamente igual que hoy (HU-03); drag&drop y file picker de anexos no
  cambian (HU-04).
- Tests: HU-01 (validación de pestaña guardada) y HU-03 (lógica de auto-aprobación en
  `useChatStore`) son testeables con Vitest puro (sin DOM) — cubrir con unit tests. HU-02
  (layout) y HU-04 (evento `paste` del navegador) son mayormente visuales/de integración
  DOM — cobertura vía smoke manual (mismo criterio que specs 045/046, no hay RTL en el
  repo).

## 6. Archivos afectados (previsto)

| Archivo | Cambio |
|---------|--------|
| `src/features/projects/ProjectDetailPage.tsx` | HU-01: lee/escribe `hito:last-project-tab` en `localStorage`, valida contra pestañas conocidas |
| `src/features/assistant/AssistantPanel.tsx` | HU-02: exporta `ASSISTANT_PANEL_WIDTH` (D5) |
| `src/features/projects/components/kanban/TaskDetailDrawer.tsx` | HU-02: lee `useChatStore((s) => s.open)` + `useBreakpoint("lg")`, ajusta `right`/ancho máximo cuando el asistente está abierto (D4, D6) |
| `src/store/useChatStore.ts` | HU-03: flag de auto-aprobación en memoria, lo consulta/resetea `send()` y lo usa `onConfirmWrite`/`approvePendingWrite` |
| `src/features/assistant/WriteConfirmCard.tsx` | HU-03: botón "Aprobar todo" nuevo |
| `src/components/attachments/AttachmentsSection.tsx` | HU-04: listener de `paste`, construye `File` desde el item de imagen del portapapeles, llama `addFiles` |
| Ningún cambio en `src/domain/`, `src/storage/`, ni schema | — |

**No tocar:** `AttachmentDropZone.tsx` (sigue siendo solo drag&drop + picker, sin lógica de
paste), `runAgentTurn.ts` (el loop secuencial de tool calls no cambia — la auto-aprobación
vive enteramente en el store, no en el agente), `TasksTab.tsx`/`AreasTab.tsx` (no necesitan
saber de la memoria de pestaña, eso vive en `ProjectDetailPage.tsx`).

## 7. Fuera de alcance

- Memoria de pestaña **por proyecto** (D1 — descartado, confirmado con el usuario).
- Auto-aprobación que persista entre conversaciones o mensajes (D7 — descartado, confirmado
  con el usuario).
- Un modo "confiar siempre en la IA" configurable en Ajustes (equivalente a desactivar
  `config.confirmWrites` por completo) — ya existe esa opción hoy en Ajustes de IA; este
  spec no la modifica.
- Layout lado a lado en mobile/tablet (D4).
- Pegar imágenes dentro de `RichTextField` (descripción con formato) como imagen inline — el
  pegado de esta spec es exclusivamente para la sección de Anexos, no para insertar imágenes
  dentro del texto enriquecido.
- Pegar archivos que no sean imagen desde el portapapeles (p. ej. copiar un PDF desde el
  explorador de archivos del SO) — fuera de alcance, solo imágenes (el caso de uso pedido es
  capturas de pantalla).
- Cambiar el orden/contenido de las pestañas de `ProjectDetailPage` o agregar pestañas
  nuevas.

## 8. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| HU-02: acoplar `TaskDetailDrawer.tsx` (feature de Tareas) a `useChatStore` (feature de Asistente) es una dependencia cruzada nueva entre dos áreas antes independientes | Acotado a leer un solo booleano (`open`) y una constante de ancho — no se importa lógica de chat ni se modifica `useChatStore` desde el drawer; el acoplamiento es de solo lectura y unidireccional |
| HU-03: un usuario hace click en "Aprobar todo" pensando que aprueba *toda la conversación futura* (ambigüedad de nombre) y se sorprende cuando el próximo mensaje vuelve a pedir confirmación | Tooltip/texto de ayuda en el botón aclarando el alcance ("resto de esta respuesta"); nombrar el botón de forma que no prometa más que D7 |
| HU-04: en navegadores/SO donde `getAsFile()` en un `paste` de imagen se comporta distinto (Safari, Firefox) el `kind`/`type` del `File` podría venir vacío | `classifyFile()` ya tiene fallback (`file.type \|\| allowed.mime`, `allowlist.ts:60`); D9 fuerza el nombre/extensión desde el MIME reportado por `clipboardData`, no desde el navegador — reduce la superficie de inconsistencia entre navegadores a solo el MIME type, que es más estable que el nombre |
| HU-01: si en el futuro se agregan/renombran pestañas de `ProjectDetailPage`, un valor viejo en `localStorage` podría apuntar a una pestaña que ya no existe | D3 ya contempla validación contra el set vigente de pestañas antes de usarlo |

## 9. Definición de hecho

- [x] Spec + design + tasks en esta carpeta
- [x] HU-01: memoria global de pestaña funcionando, con deep link (`?tab=`) con prioridad
- [x] HU-02: panel de tarea y asistente lado a lado en escritorio, sin superposición
- [x] HU-03: botón "Aprobar todo" en `WriteConfirmCard`, auto-aprobación acotada al turno
- [x] HU-04: paste de imagen funcionando en `AttachmentsSection` (tareas y demás formularios)
- [x] Unit tests HU-01 (`projectTabMemory.test.ts`) + HU-03 (`useChatStore.approveAll.test.ts`);
      smoke visual HU-02/HU-04 pendiente de pasar en navegador al usar la app
- [x] `npm run typecheck` + `npm test` verdes (lint: solo error preexistente en
      `useBreakpoint`/`useIsTablet`, no introducido por esta spec)
- [x] Estado → **IMPLEMENTADO**
