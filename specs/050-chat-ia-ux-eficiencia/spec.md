# Spec 050 — Chat IA: interacción más fácil + llamados más eficientes

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/050-chat-ia-ux-eficiencia/` · Fecha: 2026-08-11
> Baseline al empezar: `SCHEMA_VERSION` **19** (sin bump — preferencias de UI y contexto de sesión)
> Depende de (reusa): Spec 047 (proveedores multi), Spec 048 (layout asistente + aprobar todo), Spec 031 (errores), Spec 007 (RAG).
> Roadmap alineado: `assistant-project-context` en `src/features/releases/data/roadmap.ts`.
> Principios: **IV** (diseño limpio, sin ruido), **V** (simplicidad incremental), **I** (local-first: keys y chat en el dispositivo).

## 1. Contexto

El asistente ya es usable (streaming, tools, confirmación de escrituras, multi-proveedor,
panel redimensionable, “Aprobar todo”). La fricción actual no es “falta de IA”, sino
**fricción de interacción** y **costo/latencia por turnos innecesarios**.

### 1.1 UX hoy (con anclas de código)

| Pieza | Estado actual | Fricción |
|-------|---------------|----------|
| Empty state | 4 sugerencias fijas en `AssistantEmptyState.tsx` | Solo al inicio; no reaparecen con conversación ni se adaptan a la pantalla |
| Input | `ChatInput.tsx`: textarea + Enviar/Stop | Todo es texto libre; no hay atajos ni chips post-respuesta |
| Burbujas | `ChatMessageBubble.tsx`: texto / tool chips / confirm | Sin copiar, sin reintentar, sin regenerar |
| Errores | banner en `AssistantPanel.tsx` | No hay botón “Reintentar” que re-envíe el último mensaje |
| Contexto de pantalla | **No existe** en el prompt | El modelo no sabe qué proyecto/tarea mira el usuario; suele gastar 1–2 tool rounds en `list_projects` / `get_project` |
| Confirmaciones | `WriteConfirmCard` + “Todo” (spec 048) | OK; no se reabre |

### 1.2 Costo de llamados hoy

Cada `send()` en `useChatStore.ts` hace, en el caso típico:

1. **RAG opcional** (`buildRagContext`) → embedding + búsqueda (si RAG on + key Gemini).
2. **`buildSystemPrompt`** con índice completo del workspace (proyectos/productos/tipos/plantillas).
3. **`createBoundTools()`** → catálogo completo de tools (~40) en **cada ronda** del loop (`runAgentTurn`, hasta 8).
4. **Historial completo** `agentHistory` acumulado de la conversación (sin ventana).
5. **1+ streamTurn** al proveedor (más rondas si hay tool calls).

Problemas de eficiencia medibles en UX:

- Preguntas del tipo “resumí **este** proyecto” sin ids → extra round-trips de tools.
- Mensajes cortos de continuación (“sí”, “continúa”, “dale”) igual disparan RAG.
- Chats largos reenvían historial completo → más tokens, más latencia, más riesgo de rate-limit.
- El usuario escribe prompts repetidos que podrían ser un chip o un `/comando`.

### 1.3 Qué NO es el problema (fuera de esta spec)

- Multi-proveedor / CORS / proxy (047, 049).
- Layout lado a lado con drawer de tarea (048).
- “Aprobar todo” en escrituras (048).
- Reescribir el loop ReAct ni paralelizar tool calls (complejidad alta, riesgo de regresiones).

## 2. Objetivo

Mejorar la **experiencia de interacción** con el chat y **reducir llamados/tokens innecesarios**,
sin cambiar el modelo de datos del workspace ni el stack de proveedores.

En concreto:

1. El asistente “sabe” en qué proyecto/tarea está el usuario (contexto de pantalla).
2. El usuario puede actuar con **chips, comandos y reintentos**, no solo escribiendo de cero.
3. Se **evitan** llamadas RAG y se **limita** el historial cuando no aportan.
4. Sigue siendo local-first, con confirmación de escrituras intacta.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Contexto de pantalla se deriva de la **URL** (`/app/projects/:projectId`, `?detail=<taskId>` ya usado por el Kanban) + stores de datos; **no** se inventa un store paralelo de “focus” salvo un mini módulo de lectura. | El drawer ya publica la tarea en `?detail=` (`TasksTab.tsx`); el proyecto ya está en la ruta. Cero desync. |
| **D2** | Ese contexto se inyecta en el **system prompt** como bloque `## Contexto de pantalla actual` (ids + nombres + estado/prioridad si hay tarea). | Reduce tool rounds de descubrimiento; el índice global se mantiene. |
| **D3** | Chips de acción y follow-ups son **plantillas client-side** (texto listo para `send()`). **No** se pide al LLM que genere sugerencias en v1. | Cero costo de API extra; predecible; Principio V. |
| **D4** | Los chips se muestran: (a) empty state (reemplazan/amplían las 4 fijas), (b) **encima del input** cuando hay mensajes (compactos), (c) **debajo del último mensaje del asistente** (follow-ups contextuales). | Cubre onboarding + uso continuo sin saturar el hilo. |
| **D5** | Comandos **slash** (`/resumen`, `/vencidos`, `/salud`, `/crear-tarea`, `/ayuda`) se expanden en el cliente a un prompt completo **antes** de `send()`. Si el texto no es un comando conocido, se envía tal cual. | Atajo de poder sin nuevo endpoint; mismos paths de agente. |
| **D6** | Acciones de mensaje v1: **Copiar** (texto del asistente), **Reintentar / Regenerar** (re-envía el último mensaje de usuario, recortando la respuesta fallida o a regenerar del historial UI + `agentHistory`). | Cubre el 90 % de “no me gustó / falló” sin editar mensajes mid-thread. |
| **D7** | **Skip RAG** cuando: (1) el mensaje es un slash expandido, (2) el mensaje es una plantilla de chip marcada `skipRag: true`, (3) el mensaje normalizado es continuación corta (`continúa`, `continua`, `sí`, `si`, `ok`, `dale`, `proseguí`, etc.). | Esos turnos no se benefician de embeddings y hoy pagan un round-trip extra. |
| **D8** | **Ventana de historial hacia el modelo**: se envían como máximo las últimas **N = 12** entradas de `AiMessage` en `agentHistory` (sin contar el `userMessage` del turno actual). La UI puede seguir mostrando hasta 50 mensajes persistidos. | Corta tokens en chats largos; N es constante exportada y testeable. |
| **D9** | **No** filtrar el catálogo de tools por intención en v1. | Filtrar tools mal puede dejar al agente mudo; el win principal de esta spec es contexto + menos RAG + menos historial. |
| **D10** | **No** hay segundo llamado al LLM para “sugerencias inteligentes”. Follow-ups = reglas + plantillas según: pantalla actual + última acción del usuario (slash/chip/heurística de verbos). | Evita duplicar costo y latencia en cada respuesta. |
| **D11** | Sin bump de `SCHEMA_VERSION`. Preferencias nuevas (si las hay) van a `localStorage` con prefijo `hito:` o quedan en memoria de sesión. | Coherente con 046–048. |
| **D12** | El chip de contexto en el header del panel es **informativo** (“Proyecto: X · Tarea: Y”) y se puede **descartar** (solo oculta el chip en UI; el prompt **sigue** recibiendo el contexto de URL mientras la pantalla no cambie). | Transparencia sin inventar “modo desanclado” complejo en v1. |
| **D13** | Copy del asistente: solo partes `kind: "text"` unidas; no se copian tool dumps ni tarjetas de confirmación. | Útil y limpio. |
| **D14** | Regenerar solo está disponible sobre el **último** par user→assistant cuando `status === "idle" \| "error"`. No se regenera a mitad de streaming. | Evita estados corruptos del loop. |

## 4. Historias de usuario y criterios de aceptación

### HU-01 — Contexto de pantalla en el prompt · **núcleo (eficiencia)**

**Como** PM con un proyecto o tarea abiertos, **quiero** que el asistente sepa qué estoy mirando
**para** no tener que repetir el nombre/id y para que responda en menos pasos.

- **CA-01.1** En `/app/projects/:id` sin `?detail=`, el system prompt del siguiente `send()` incluye el id y nombre del proyecto (y estado/salud si están en el índice).
- **CA-01.2** Con `?detail=<taskId>` y la tarea existente, el prompt también incluye id, título, status y priority de esa tarea, y el `projectId` padre.
- **CA-01.3** Fuera de detalle de proyecto (dashboard, productos, settings…), el bloque de contexto de pantalla indica la **sección** (p. ej. “Dashboard”) sin inventar ids.
- **CA-01.4** Si el `projectId` o `taskId` de la URL no existe en datos, el bloque lo omite o marca “no encontrado” sin romper el turno.
- **CA-01.5** El header del `AssistantPanel` muestra un chip legible del contexto activo cuando hay proyecto y/o tarea (CA visual; no sustituye D2).

### HU-02 — Acciones rápidas contextuales (chips) · **núcleo (UX)**

**Como** usuario, **quiero** botones de acción frecuentes según dónde estoy **para** no redactar prompts repetidos.

- **CA-02.1** Empty state: chips contextuales (si hay proyecto/tarea) + un set global mínimo; al click se envía el prompt (mismo path que hoy `onSuggestion`).
- **CA-02.2** Con mensajes en el hilo, una fila compacta de chips **encima de `ChatInput`** ofrece 3–6 acciones relevantes al contexto actual (no más de ~6 visibles; el resto no se lista en v1).
- **CA-02.3** Chips de proyecto incluyen al menos: “Resumen de este proyecto”, “Tareas en riesgo / bloqueadas”, “Crear tarea aquí”.
- **CA-02.4** Con tarea en `?detail=`, chips incluyen al menos: “Resumí esta tarea”, “Proponé subtareas”, “Mejorá la descripción”.
- **CA-02.5** Sin contexto de proyecto: chips globales (“Resumen del día”, “Vencidos y por vencer”, “Proyectos estancados”).
- **CA-02.6** Mientras `streaming` o `awaiting-confirmation`, los chips están deshabilitados (no encolan un segundo send).

### HU-03 — Comandos slash · **UX + eficiencia**

**Como** usuario frecuente, **quiero** atajos tipo `/resumen` **para** disparar intenciones comunes sin escribir el párrafo.

- **CA-03.1** Escribir `/` en el input muestra un menú pequeño de comandos (o al menos al enviar se expanden). Mínimo v1: `/ayuda`, `/resumen`, `/vencidos`, `/salud`, `/crear-tarea`.
- **CA-03.2** Enviar `/resumen` con proyecto en contexto expande a un prompt que nombra el proyecto por id; sin proyecto, expande a resumen de portafolio / día.
- **CA-03.3** Comando desconocido (`/foo`) se envía como texto literal (no error silencioso que trague el mensaje).
- **CA-03.4** La expansión ocurre **antes** de `runAgentTurn` y el mensaje **visible en el hilo** es el texto expandido (o el slash + etiqueta legible — ver design; default: **mostrar el prompt expandido** para que el usuario vea qué se pidió).
- **CA-03.5** Los slash conocidos van con `skipRag: true` (D7).

### HU-04 — Follow-ups post-respuesta · **UX (0 API extra)**

**Como** usuario que acaba de recibir una respuesta, **quiero** 2–4 siguientes pasos obvios **para** continuar sin pensar el prompt.

- **CA-04.1** Tras un mensaje del asistente en estado `idle`, debajo de la última burbuja aparecen follow-ups (chips) según contexto + tipo de último pedido.
- **CA-04.2** Click en follow-up = `send(prompt)` igual que un chip de HU-02.
- **CA-04.3** No hay request al proveedor solo para generar follow-ups.
- **CA-04.4** Si no hay heurística útil, se muestran 2 genéricos (“Profundizá”, “¿Qué más puedo hacer aquí?”) o se oculta la fila (preferir **siempre 2 genéricos** para no dejar vacío raro).

### HU-05 — Acciones de mensaje: copiar y regenerar/reintentar · **UX**

**Como** usuario, **quiero** copiar la respuesta y reintentar si falló o no me sirvió **para** no reescribir.

- **CA-05.1** En mensajes del asistente con texto, botón “Copiar” pone el markdown/texto en el portapapeles y feedback breve (toast existente o `title` “Copiado”).
- **CA-05.2** Si `status === "error"` y hay un último mensaje de usuario, botón “Reintentar” en el banner de error re-envía ese texto (tras limpiar la respuesta fallida del historial de agente).
- **CA-05.3** Si `status === "idle"` y el último mensaje es del asistente, acción “Regenerar” en esa burbuja elimina la última respuesta del UI + history y re-envía el último user message.
- **CA-05.4** Regenerar/Reintentar no se muestran durante `streaming` / `awaiting-confirmation`.
- **CA-05.5** Confirmaciones de escritura pendientes se cancelan si el usuario regenera (equivalente a `stop` parcial + re-send limpio).

### HU-06 — Optimización de llamados (RAG + ventana de historial) · **núcleo (eficiencia)**

**Como** usuario con cuota limitada, **quiero** que la app no gaste embeddings ni reenvíe chats eternos **para** que las respuestas lleguen más rápido y fallen menos por rate-limit.

- **CA-06.1** Mensajes con `skipRag` (chips marcados, slash, continuaciones cortas) **no** llaman a `buildRagContext` / `semanticSearch` / embeddings.
- **CA-06.2** Con historial de agente > 12 `AiMessage`, solo se pasan las últimas 12 a `runAgentTurn` (D8); el resto no se envía al proveedor en ese turno.
- **CA-06.3** La UI **no** borra mensajes viejos solo por la ventana del modelo (siguen visibles hasta el límite de persistencia actual de 50).
- **CA-06.4** Unit tests cubren: detector de skip-RAG, expansión de slash, recorte de historial, builder de bloque de contexto (funciones puras).
- **CA-06.5** Turno normal con pregunta libre y RAG enabled **sigue** pudiendo usar RAG (no se desactiva globalmente).

## 5. Fuera de alcance

- Filtrado dinámico del catálogo de tools / tool routing ML.
- Paralelizar tool calls en `runAgentTurn`.
- Sugerencias generadas por un segundo LLM.
- Multi-hilo de conversaciones, renombrar chats, export de chat.
- Voz, adjuntos en el chat, @-menciones de entidades con picker rico (v1 usa chips + contexto URL).
- Cambios de proveedores, proxy, rate limiter interno.
- Cambios de schema / migraciones.
- Reabrir el editor de flujos o el drawer de tarea más allá de leer `?detail=`.

## 6. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Contexto de URL desactualizado si el usuario cambia de tarea mid-stream | El contexto se captura **al inicio de `send()`**, no en cada delta. |
| Ventana de historial corta “amnesia” | N=12 es generoso para PM chat; el system prompt sigue trayendo índice + contexto de pantalla. |
| Chips que saturan la UI | Máx. ~6 chips en input; follow-ups 2–4; Principio IV. |
| Regenerar deja history desfasado | Una sola función `regenerateLast()` que recorta UI + `agentHistory` de forma atómica antes de `send`. |
| Skip RAG de más | Solo listas blancas explícitas (slash, flags, continuaciones); free-text largo siempre puede RAG. |

## 7. Métricas de éxito (cualitativas / smoke)

- “Resumí este proyecto” desde el detalle **sin** escribir el nombre → respuesta útil en **menos tool chips** visibles que antes (smoke comparativo).
- `/vencidos` y chips no disparan red de embeddings (verificable en tests unitarios del flag + en Network si se prueba a mano con RAG on).
- Usuario puede copiar y reintentar sin reescribir.
- `tsc`, tests y build verdes; número de tests solo sube.

## 8. Documentos de esta carpeta

| Archivo | Rol |
|---------|-----|
| `spec.md` | Este documento (qué y por qué) |
| `design.md` | Cómo (archivos, APIs, snippets) |
| `tasks.md` | Fases y checklist de implementación |
| `smoke.md` | Guion manual de verificación |
| `PROMPT-EJECUCION.md` | Prompt listo para una sesión de implementación |
