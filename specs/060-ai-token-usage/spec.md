# Spec 060 — Consumo de tokens y requests del asistente (auditoría + recorte RAG-aware)

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/060-ai-token-usage/` · Fecha: 2026-08-20
> Baseline al empezar: `SCHEMA_VERSION` **sin bump** (uso de IA y embeddings viven en IndexedDB del dispositivo, igual que `aiConfig` y `aiRag:*`)
> Depende de (reusa, no re-implementa): Spec 006 (registry + `rateLimiter` RPM/TPM/RPD), Spec 007 (RAG semántico, `checkStale`, `buildRagContext`), Spec 031 (fail-open del RAG, errores), Spec 047 (proveedores + `streamTurn`), Spec 050 (skip RAG, ventana de historial N=12, contexto de pantalla).
> Principios: **I** (local-first: el log de uso no sale del dispositivo ni viaja en `workspace.json`), **IV** (diseño limpio: un chip por turno, una card de auditoría, sin gráficos), **V** (simplicidad incremental: tools completas se quedan; no hay routing por intención).

## 1. Contexto

El asistente ya recorta historial y saltea embeddings en continuaciones (spec 050), y puede inyectar top-5 semántico (spec 007). Aun así Gemini Flash se agota: **6 RPM / 250k TPM / 20 RPD**. El dolor es simultáneo: **tokens por request** (prompt gordo) y **cantidad de requests** (cada ronda ReAct es un `generateContent` aparte).

### 1.1 Qué se manda hoy en cada ronda

Cada `send()` en `useChatStore.ts` hace, en el caso típico:

1. **Embedding de la pregunta** (`buildRagContext` → `embedText`) si `ragEnabled` y no `skipRag` — 1 request extra, aunque el índice esté `partial`.
2. **`buildSystemPrompt`** con el **índice completo** del workspace (todos los proyectos, productos, tipos, plantillas) + bloque de pantalla (050) + top-5 RAG.
3. **Catálogo completo de tools** (~40 function declarations) en **cada** ronda de `runAgentTurn` (hasta 8). Spec 050 D9 lo dejó así a propósito.
4. **Historial** recortado a 12 `AiMessage` (050 D8), incluyendo resultados de tools sin compactar.
5. **1+ `streamTurn`** al proveedor. El `rateLimiter.recordRequest` de `runAgentTurn.ts` se dispara **una vez por `send()`**, no por ronda: el recuento local de RPD **subestima** lo que Gemini cobra.

No hay `usageMetadata` / `usage` parseado. TPM se alimenta con el default `tokenEstimate = 500` (`rateLimiter.recordRequest`). `RateLimitStatus` muestra ventanas deslizantes estimadas, no un historial auditable.

### 1.2 RAG fresco vs. desactualizado

`RagStatus` ya existe (`idle` | `indexing` | `up-to-date` | `partial` | `error`). `checkStale()` compara `updatedAt` de entidades vs embeddings, pero **solo al montar `RagSettingsCard`**. En el chat, `send()` no consulta frescura: si `ragEnabled`, embebe siempre (salvo skip 050).

Consecuencia: un índice `partial` igual paga 1 request de embedding para buscar sobre vectores viejos, y el prompt sigue mandando el índice completo **más** hits posiblemente obsoletos.

### 1.3 Qué NO es el problema (fuera de esta spec)

- Routing / filtrado del catálogo de tools (050 D9; decisión de diseño: tools completas).
- Bajar `MAX_ROUNDS` de 8.
- Auditar `improve.ts` / `generate-transform.ts` (misma ventana Gemini, v2).
- Página dedicada con gráficos.
- Persistencia del cache de embeddings de query entre sesiones.
- Recorte “top-N peor salud” en dashboard.
- Multi-proveedor nuevo, proxy, schema del workspace.

## 2. Objetivo

Bajar **tokens por ronda** y **requests por turno** en el asistente, y hacer **auditable** el consumo real (o estimado) en este dispositivo.

En concreto:

1. Contar cada `streamTurn` y cada embedding como 1 request, con tokens de la API cuando existan.
2. Cuando el RAG está **fresco** (`up-to-date`): inyectar top-k y mandar un **índice recortado al foco de pantalla**.
3. Cuando el RAG **no** está fresco: **no embeber** (ahorra 1 request inútil) y mandar el índice completo.
4. Mostrar el último turno en un chip del asistente y el acumulado del día/sesión en una card de Configuración.
5. Cache LRU en memoria de embeddings de query (texto exacto) y compactar resultados de tools en el historial **del próximo** turno.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Alcance v1 = chat del asistente + embeddings RAG. No `improve` ni `generate-transform`. | Cierra el dolor del hilo; esos callers se pueden enganchar al mismo log después. |
| **D2** | Log de uso en IndexedDB (`aiUsage:events`), nunca en `workspace.json`. Sin bump de `SCHEMA_VERSION`. | Principio I; mismo patrón que `aiConfig` / `aiRag:*`. |
| **D3** | Tokens **reales** del proveedor (`usageMetadata` Gemini, `usage` OpenAI-compatible). Si no hay, `source: "estimated"` y tilde `~` en UI. | Hoy 500 tok/ronda miente; el usuario necesita auditar. |
| **D4** | Cada `streamTurn` = 1 request en `rateLimiter` **y** en el log. Embedding API = otro request. | Corrige el subconteo actual (1 `recordRequest` por `send()`). |
| **D5** | Eventos separados `chat` vs `embedding`, agrupados por `turnId` (uuid al inicio de `send()`). El chip suma el turno. | Settings puede desglosar embeddings; el chip no miente en el total. |
| **D6** | RAG fresco ⇔ `ragEnabled` && `status === "up-to-date"` && `entityCount > 0` **después** de `checkStale()` al inicio de `send()`. No es un recorte por reloj. | `up-to-date` ya significa “embeddings alineados con `updatedAt`”. |
| **D7** | Fresco + no `skipRag`: auto-embebe (o cache hit) + inyecta top-k=5 + **índice recortado**. | Elección de diseño “suave”: RAG + índice del foco; tools completas. |
| **D8** | No fresco (`partial` / `idle` / `error` / `indexing` / `ragEnabled=false`): **no** auto-embebe; índice **completo**. | No pagar 1 request para buscar sobre vectores viejos o inexistentes, ni a mitad de una indexación. |
| **D9** | `skipRag` (050 D7) sigue ganando: no embebe aunque esté fresco. Si está fresco, el índice **igual** se recorta. | Continuaciones no se benefician del embed; el recorte de índice sí ahorra tokens. |
| **D10** | Catálogo de tools **completo** en cada ronda. Sin routing por intención. | 050 D9; riesgo de agente mudo. El ahorro de TPM viene del índice + compactación, no de ocultar tools. |
| **D11** | Cache LRU **en memoria**, 50 entradas, clave = query normalizada exacta. No IDB. | Regenerar / repetir en la misma pestaña ahorra 1 request; cosine-cache no evita el embed. |
| **D12** | Compactar resultados de tools (`maxChars = 4000` por mensaje `role: "tool"`) al armar el historial del **siguiente** `send()`. El loop ReAct del turno actual ve resultados completos. | No cegar al modelo a mitad de turno; sí achicar el prompt de los turnos siguientes. |
| **D13** | Si se inyectó RAG: bloque `## Prioridad de evidencia` en el system prompt (usar hits + foco antes de `list_*` / `search_workspace`). | Baja requests de descubrimiento sin filtrar tools. |
| **D14** | UI de auditoría: card `AiUsageCard` en Settings **debajo** de `RagSettingsCard`, deep-link `#uso`. | El usuario eligió “card en Configuración + chip en el asistente”. |
| **D15** | Chip compacto en el header del asistente al terminar el turno: `2 req · 4.2k tok`. Click abre popover con desglose. Oculto durante streaming. Estimado → `~4.2k`. | Principio IV; el detalle largo vive en Settings. |
| **D16** | `RateLimitStatus` se queda (ventanas RPM/TPM/RPD). Pasa a alimentarse con tokens reales cuando existan. No se fusiona con la card de auditoría. | Ventana deslizante ≠ historial del día. |
| **D17** | Fail-open: IDB de uso falla → memoria de sesión; `checkStale` falla → tratar como no-fresco; embed falla → no inyectar, pero si ya era fresco **mantener** índice recortado. | Spec 031: el turno no muere por una mejora opcional. |
| **D18** | Retención: ring buffer de **500** eventos **o** **14 días**, lo que recorte primero. | Auditoría útil sin crecer IndexedDB sin techo. |
| **D19** | `AGENT_HISTORY_WINDOW = 12` se mantiene. La compactación es extra. | 050 D8 sigue vigente. |
| **D20** | `topK` RAG se mantiene en 5. | Recorte “suave”; no retocar relevancia en esta spec. |
| **D21** | `MAX_ROUNDS = 8` se mantiene. | El tope ya existe; D13 apunta a usarlo menos, no a cortar mudo. |
| **D22** | Session totals = desde que cargó la pestaña (memoria). Día = fecha local `YYYY-MM-DD` sobre eventos persistidos. | “Hoy” sobrevive reload; “sesión” es la pestaña. |
| **D23** | OpenAI-compatible: mandar `stream_options.include_usage: true`. Gemini: leer `usageMetadata` del último chunk. | Sin esto D3 no existe en streaming. |
| **D24** | Exportar JSON del log y vaciar historial desde la card. El JSON no incluye API keys ni textos de mensajes, solo metadatos de uso. | Auditoría portable; Principio I. |
| **D25** | Toggle “Incluir estimados” en la card, default **on**. | Transparencia: no esconder lo que no vino de la API, marcarlo. |

## 4. Historias de usuario y criterios de aceptación

### HU-01 — Tokens y requests reales por ronda · **núcleo (medición)**

**Como** PM con cuota Gemini, **quiero** que cada ronda y cada embedding cuenten con los tokens que cobró el proveedor **para** que las ventanas TPM/RPD dejen de ser un estimado ciego.

- **CA-01.1** Tras un `streamTurn` de Gemini cuyo último chunk trae `usageMetadata`, el log guarda `inputTokens = promptTokenCount`, `outputTokens = candidatesTokenCount`, `totalTokens = totalTokenCount` (o suma in+out si falta total), `source: "provider"`.
- **CA-01.2** Tras un `streamTurn` OpenAI-compatible, si el SSE trae `usage` (habilitado con `stream_options.include_usage`), se persiste igual con `source: "provider"`.
- **CA-01.3** Si el proveedor no manda usage, el evento se persiste con `source: "estimated"` (heurística: `ceil(chars/4)` sobre system + history + user del turno, mínimo 1) y la UI muestra `~`.
- **CA-01.4** Un `send()` con 3 rondas ReAct registra **3** `recordRequest` en el rate limiter (una por `streamTurn` exitoso) y `requests: 3` en el evento `chat`. Hoy registraría 1.
- **CA-01.5** Un embedding de query (cache miss) registra 1 evento `embedding` y 1 `recordRequest` en el modelo de embedding, con tokens reales o estimados.
- **CA-01.6** `rateLimiter.recordRequest(modelId, totalTokens)` usa el total real/estimado de esa ronda, no el default 500, cuando hay cifra.

### HU-02 — RAG fresco recorta el índice; RAG stale no embebe · **núcleo (ahorro)**

**Como** usuario que indexó hace poco, **quiero** que el asistente use ese RAG y no vuelva a mandar todo el portafolio **para** gastar menos tokens. **Como** usuario con índice viejo, **quiero** que no pague un embedding inútil.

- **CA-02.1** Al inicio de `send()`, si `ragEnabled`, se llama `checkStale()` (local, sin API). El resultado gobierna D6.
- **CA-02.2** `up-to-date` + no skip: se llama `buildRagContext` (o cache hit) y el system prompt incluye el bloque semántico **y** el índice recortado según §5.
- **CA-02.3** `partial` | `idle` | `error` | `indexing` | `ragEnabled=false`: **no** se llama `embedText` / `buildRagContext`; el índice va **completo** como hoy.
- **CA-02.4** `skipRag=true` o continuación corta: no embed, aunque esté fresco; si está fresco, índice igual recortado. `rag.skipReason` es `"slash"` cuando el skip viene de chip/comando (`explicitFlag`) y `"continuation"` cuando viene de la heurística de `shouldSkipRag`.
- **CA-02.5** Cache hit de query normalizada: no hay request de embedding; se reusa el vector; el evento de embedding **no** se escribe (no hubo request). El evento `chat` puede marcar `rag.skipReason: "cache-hit"`.
- **CA-02.6** Si `buildRagContext` lanza, el turno continúa (031); no hay bloque semántico; si el status era fresco, el índice **sigue** recortado.
- **CA-02.7** `RagSettingsCard` en estado `partial` aclara que el asistente no embebe la pregunta hasta reindexar.

### HU-03 — Índice recortado al foco · **núcleo (tokens)**

**Como** PM mirando un proyecto, **quiero** que el prompt no liste los otros 40 proyectos **para** no quemar TPM.

El recorte aplica solo en modo fresco (D7). Tabla normativa:

| `UiContext.kind` | Qué entra en el índice |
|------------------|------------------------|
| `task` / `project` | Esa entrada de proyecto + el producto padre si `productId` existe. Sin tipos ni plantillas ni el resto de proyectos. |
| `section: products` | Solo `index.products`. |
| `section: projects` | Solo `index.projects`. |
| `section: library` | `types` + `templates` + `processTemplates`. |
| `section: dashboard` \| `my-tasks` \| `daily` \| `none` | `projects` + `products` (portafolio). Sin tipos/plantillas. |
| Cualquier otra sección (`flows`, `automations`, `settings`, `quarters`, `integrations`, `notifications`) | `projects` + `products`. Sin tipos/plantillas. |

- **CA-03.1** Con foco proyecto y RAG fresco, el system prompt **no** contiene nombres de otros proyectos del índice.
- **CA-03.2** Con foco dashboard y RAG fresco, el prompt **sí** lista todos los proyectos y productos, y **no** lista tipos/plantillas.
- **CA-03.3** Con RAG no fresco, el prompt lista proyectos + productos + tipos + plantillas como hoy (`buildSystemPrompt` actual).
- **CA-03.4** El bloque `## Contexto de pantalla actual` (050) se sigue inyectando igual, independiente del recorte.
- **CA-03.5** Con RAG inyectado, el prompt incluye `## Prioridad de evidencia` (D13) pidiendo no llamar `list_projects` / `list_tasks` / `search_workspace` si foco + hits alcanzan; `get_project` con id concreto sigue permitido.
- **CA-03.6** En modo recortado, las secciones del índice con array vacío **no** se serializan (ni el encabezado ni el placeholder `(ninguno)`). El workspace sin datos (null) sigue mostrando `(ninguno)` como hoy.

### HU-04 — Compactar tools en el historial siguiente · **ahorro de tokens**

**Como** usuario en un chat largo, **quiero** que los dumps de `get_project` no se reenvíen enteros **para** no inflar las siguientes rondas.

- **CA-04.1** `compactToolResults(history, 4000)` recorta cada `role: "tool"` cuyo `JSON.stringify(result)` exceda 4000 caracteres a `{ truncated: true, name, preview }` (preview = los primeros caracteres del JSON).
- **CA-04.2** Se aplica a la copia que entra a `runAgentTurn` **junto con** `trimAgentHistory`, no al array `agentHistory` a mitad del loop actual.
- **CA-04.3** La UI (`ToolCallChip`) sigue pudiendo mostrar el resultado completo del turno visible (no se mutan `ChatPart`s).
- **CA-04.4** Mensajes `user` / `assistant` no se compactan por esta función (el recorte de cantidad sigue siendo N=12).

### HU-05 — Chip de turno en el asistente · **auditoría inmediata**

**Como** usuario que acaba de hablar con el asistente, **quiero** ver cuánto costó ese turno **para** no tener que ir a Settings cada vez.

- **CA-05.1** Con `status === "idle"` y al menos un evento del último `turnId`, el header muestra un chip `N req · X tok` (tokens = suma in+out de todos los eventos de ese `turnId`, incluido embedding si lo hubo).
- **CA-05.2** Si algún evento del turno es `estimated`, el chip usa `~X tok`.
- **CA-05.3** Durante `streaming` / `awaiting-confirmation` el chip del turno en curso no se muestra (el anterior puede quedarse hasta que el nuevo termine, o ocultarse; default: **ocultar el chip hasta que el turno actual termine**).
- **CA-05.4** Click abre un popover (no navega) con: requests, rondas, in/out, `source`, estado RAG (`inyectado` / `skip: stale|continuación|cache|off`), y si el índice fue recortado.
- **CA-05.5** `aria-label` del chip: `Este turno: N requests, X tokens`.
- **CA-05.6** `RateLimitStatus` sigue detrás de su botón/panel actual; no se reemplaza.

### HU-06 — Card de uso en Configuración · **auditoría**

**Como** PM, **quiero** ver el consumo del día y de la sesión por modelo **para** saber qué ventana estoy quemando.

- **CA-06.1** Settings renderiza `AiUsageCard` debajo de `RagSettingsCard`. El contenedor tiene `id="uso"` (deep-link `/app/settings#uso`, el scroll existente de Settings ya honra el hash).
- **CA-06.2** La card muestra **Hoy** (fecha local): total requests, tokens in, tokens out; desglose por modelo (label del registry).
- **CA-06.3** Muestra **Sesión** (esta pestaña): requests + tokens totales.
- **CA-06.4** Lista los últimos turnos (máx. 20 filas visibles): hora, fuente (`chat`/`embedding`), modelo corto, req, tokens, marca RAG si aplica.
- **CA-06.5** Copy de privacidad: el desglose queda en este dispositivo; no se envía a ningún servidor de Hito.
- **CA-06.6** Acciones: **Exportar JSON** (metadatos de eventos, sin keys ni texto de chat) y **Vaciar historial** (con confirmación existente `ConfirmDialog`). Vaciar borra eventos persistidos y `lastTurn`; **no** resetea las ventanas del `rateLimiter` ni los totales de **sesión** de la pestaña.
- **CA-06.7** Toggle “Incluir estimados” (D25). Off: totales y lista omiten eventos `source: "estimated"`.
- **CA-06.8** Sin eventos: empty state “Todavía no hay consumo registrado. Se empieza a contar en el próximo mensaje.”
- **CA-06.9** Sin API key: la card se muestra igual (el historial viejo sigue siendo válido).

### HU-07 — Fallos no rompen el turno · **resiliencia**

- **CA-07.1** Fallo al persistir `aiUsage:events`: el turno de chat termina igual; los totales de sesión en memoria se actualizan; no hay toast.
- **CA-07.2** `checkStale()` lanza: se trata como no-fresco (D17) y el turno sigue.
- **CA-07.3** Abort/`stop` a mitad de stream: se registran las rondas **completadas** (con usage si llegó); no se inventa una ronda extra.
- **CA-07.4** Error de proveedor antes del primer `streamTurn` ok: el evento `chat` se escribe con `requests: 1`, tokens 0, `source: "estimated"` (el intento queda auditable). El `rateLimiter` **no** incrementa en esa rama: D4 solo registra `streamTurn` **exitosos**. Un 429 sigue yendo a `markSaturated` como hoy.

## 5. Índice recortado — reglas (normativo)

Función pura `selectWorkspaceIndex(index, uiCtx) → WorkspaceIndex`. No muta el índice del workspace. Las secciones omitidas se serializan como `(recortado)` o se omiten del markdown; default: **omitir el encabezado de sección vacío** para no gastar tokens en placeholders.

El system prompt base (rol, fecha, stalled/dueSoon, bloque Herramientas, bloque Plantillas y tipos, Estilo) **no se recorta**. Solo cambia el bloque `## Índice del workspace`.

## 6. Fuera de alcance

- Filtrar el catálogo de tools / tool routing.
- Bajar `MAX_ROUNDS`.
- Auditar `improve.ts` y `generate-transform.ts`.
- Página o gráficos de uso.
- LRU de embeddings persistido en IDB.
- Recorte top-N por salud en dashboard.
- Cambiar `topK`, `AGENT_HISTORY_WINDOW`, o el modelo de embeddings.
- Enviar telemetría a un backend.
- Reindexación automática en background.
- Paralelizar tool calls.

## 7. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Índice recortado “amnesia” en un proyecto que no es el foco | Modo fresco solo; no-fresco manda índice completo. D13 permite `get_project` por id. |
| `checkStale` en cada send agrega latencia | Es local (IDB + `updatedAt`); sin API. Si duele, ya está el fail-open. |
| Compactar tools borra ids que el modelo iba a reusar | Solo en el **siguiente** turno; 4000 chars alcanzan para ids. El modelo puede volver a llamar `get_project`. |
| `usageMetadata` ausente en streaming Gemini | CA-01.3; chip con `~`; no bloquear. |
| OpenAI-compatible ignora `stream_options` | Igual CA-01.3. |
| Subconteo histórico vs. cuota real de Google | D4 alinea el limiter local hacia adelante; no reescribe el pasado. |
| Card de Settings satura | Sin gráficos; 20 filas; Principio IV. |

## 8. Métricas de éxito

- Un `send()` con 2 tool-rounds deja **3** requests de chat en el log (o 2 si la última ronda no corre) más 0–1 de embedding, visible en chip y card.
- Con RAG `up-to-date` y foco de proyecto, el system prompt de “resumí este proyecto” **no** incluye otros proyectos (test puro de `selectWorkspaceIndex`).
- Con RAG `partial`, DevTools no muestra `embedContent` en ese `send()` (salvo skip ya cubierto por 050).
- La misma pregunta dos veces en la sesión: el segundo `send()` no llama a la API de embeddings.
- `RateLimitStatus` TPM se mueve con magnitudes reales (miles), no saltos de 500.
- `tsc`, tests unitarios nuevos verdes; el número de tests solo sube.

## 9. Key Decisions

1. **Medir de verdad, estimar solo de fallback** — sin esto la auditoría es teatro (D3, D4, D23).
2. **RAG fresco = retriever + índice del foco; RAG stale = índice completo y cero embed** — prioriza el índice recién actualizado sin apagar tools (D6–D9).
3. **Tools completas** — el ahorro no pasa por esconder funciones (D10).
4. **Dos superficies de UI** — chip de turno (inmediato) + card de día/sesión (auditoría); `RateLimitStatus` sigue siendo la ventana (D14–D16).
5. **Fail-open y local-first** — el log es dispositivo; un fallo de uso no cancela el chat (D2, D17).

## 10. PR Plan

PRs incrementales, cada uno mergeable con tests del recorte que toca.

| PR | Título | Archivos / componentes | Depende de | Cambio |
|----|--------|------------------------|------------|--------|
| **PR1** | Parseo de usage + 1 request por ronda | `providers/types.ts`, `gemini/streamTurn.ts`, `openai-compatible/index.ts` + mapping/sse, `runAgentTurn.ts`, `rateLimiter` callers, tests de parseo | — | `StreamTurnResult.usage`; `recordRequest` por ronda con tokens reales/estimados. Sin UI. |
| **PR2** | Log IndexedDB + store | `src/ai/usage/*`, `src/store/useAiUsageStore.ts`, tests de persistencia/agregación | PR1 | Eventos `chat`/`embedding`, ring buffer, día/sesión en memoria. |
| **PR3** | Política RAG + índice recortado + cache query | `ragPolicy.ts`, `workspaceIndex.ts`, `queryCache.ts`, `systemPrompt.ts`, `useChatStore.ts`, `RagSettingsCard.tsx`, tests puros + send() | PR2 | D6–D9, D11, D13. |
| **PR4** | Compactar tool results en historial | `toolResultCompact.ts`, `useChatStore.ts` (pre-`runAgentTurn`), tests | — (puede ir en paralelo a PR3; merge after PR1 no es obligatorio) | D12 / HU-04. |
| **PR5** | UI: card `#uso` + chip de turno | `AiUsageCard.tsx`, `TurnUsageChip.tsx`, `SettingsPage.tsx`, `AssistantPanel.tsx` | PR2 (PR3 para campos RAG del popover) | HU-05, HU-06. |

Orden recomendado: PR1 → PR2 → PR3 y PR4 en paralelo → PR5.

## 11. Documentos de esta carpeta

| Archivo | Rol |
|---------|-----|
| `spec.md` | Este documento (qué, por qué, CA, decisiones) |
| `design.md` | Cómo (archivos, tipos, snippets, flujo de `send()`) |
| `plan.md` | Plan de implementación (tareas TDD, archivos, commits) |
| `smoke.md` | Checklist manual post-implementación (tokens, RAG fresco, card `#uso`) |
