# Especificación — MCP mejorado (005)

- **Feature ID:** 005-mcps-mejorados
- **Estado:** Completado
- **Fecha:** 2026-07-05
- **Commit:** `0c06399`
- **Principios afectados (constitución):** II (esquema-contrato), V (simplicidad/incremental),
  VI (migrabilidad). **No** toca I (local-first) ni IV (diseño limpio).

## Resumen

Se refactorizó la capa **MCP-style de tools** del M9 (`src/ai/tools/`): los dos monolitos
(`readTools.ts` 291 líneas, `writeTools.ts` 1090 líneas) se dividieron en 18 módulos por dominio,
se expuso un **servidor MCP real** vía `@modelcontextprotocol/sdk`, y se agregaron 3 tools
compuestos. Todo sin cambiar el contrato público ni la UI del chat.

Tres ejes (completados):

1. **Servidor MCP estándar:** `createMcpServer()` envuelve cualquier `AiTool[]` en un `Server` del
   SDK. Entrypoint `scripts/mcp-server.mjs` (read-only, fixtures) vía `tsx`, probado con
   `InMemoryTransport`.
2. **Split por dominio:** 8 módulos en `read/` + 9 en `write/` + `compositTools.ts`. Cada módulo
   exporta `createX<Domain>Tools(ctx): AiTool[]` usando `defineTool` + schemas zod.
3. **Tres tools compuestos:** `summarize_project_health`, `complete_checklist`,
   `apply_type_to_project` — reúsen `@/domain/compute` y `@/domain/instantiate`.

Sin cambios de schema, storage, UI, automatizaciones ni notificaciones.

## Problema / Necesidad

- `writeTools.ts` con 31 tools y 1090 líneas es difícil de navegar y refactorizar.
- El contrato ya es "MCP-compatible" (`toMcpTool`, nombres snake_case, schemas sin `$ref`) pero
  no se ejecuta contra un SDK, así que no se puede conectar un cliente MCP real para probarlo.
- Faltan 3 operaciones compuestos útiles que hoy requieren 3–5 llamadas secuenciales cada una
  (resumen de salud por proyecto, completar checklist entero, aplicar tipo a proyecto existente).

## Decisiones explícitas (no re-preguntar)

- **Servidor MCP opcional via entrypoint Node (`scripts/mcp-server.mjs`).** Sólo stdio; HTTP/WS
  sería sobre-ingeniería y no aplica al carácter local-first del producto.
- **El agente Gemini sigue ejecutando la misma capa via `callTool()`.** Cambia la organización
  interna, no la API pública de `src/ai/tools/index.ts`.
- **Sin nuevos permisos ni acceso a red** por parte del servidor: lee/escribe a través del
  contexto inyectado (igual que el agente), no se le pasa un filesystem.
- **`createBoundTools()` se conserva.** Los tests existentes siguen funcionando sin cambios.
- **Sin nuevos UI/UX.** Los chips del Asistente y el `WriteConfirmCard` siguen iguales: la única
  cara visible del refactor es que ahora hay 3 tools compuestos disponibles para el modelo.

## Historias de usuario (criterios de aceptación)

### HU-01 — Servidor MCP estándar arrancable
**Como** mantenedor, **quiero** `npm run mcp:server` **para** conectar clientes MCP externos.
- ✅ El servidor se conecta por stdio y lista tools MCP `tools/list` con los mismos nombres y
  schemas que ve Gemini (sin `$ref`).
- ✅ `tools/call` valida args con `safeParse` y devuelve `isError` si falla.

### HU-02 — Tools organizados por dominio
**Como** mantenedor, **quiero** que los tools vivan en módulos por dominio **para** encontrarlos.
- ✅ `src/ai/tools/{read,write}/<dominio>.ts` (8 read + 8 write + search/workspace + composite).
- ✅ `createAiTools(ctx)` agrega todos en una sola colección; nombres únicos validados por tests.

### HU-03 — `summarize_project_health`
**Como** PM hablando con el asistente, **quiero** un resumen por proyecto en una sola llamada.
- ✅ Input: `{ projectId }`. Output: KPIs de salud, áreas con % avance, conteos de tareas,
  ítems vencidos, ítems requeridos sin completar, próximos vencimientos (7 días).
- ✅ Idempotente. No muta.

### HU-04 — `complete_checklist`
**Como** PM, **quiero** marcar todos los ítems de un checklist en una sola acción de asistente.
- ✅ Input: `{ projectId, areaId, checklistId, mode: "all" | "required" | "ids" }`.
- ✅ Si `mode: "ids"`, recibe `itemIds: string[]` y solo marca esos.
- ✅ Pasa por la misma `mutateProject` (automatizaciones + persistencia gratis).

### HU-05 — `apply_type_to_project`
**Como** PM, **quiero** desplegar las áreas de un Tipo de Proyecto en uno ya existente.
- ✅ Input: `{ projectId, typeId, onlyMissing?: boolean }`. `onlyMissing` por defecto `true`.
- ✅ Si el proyecto ya tiene áreas cuyos nombres coinciden (case-insensitive), no las duplica.
- ✅ Devuelve resumen: áreas añadidas, checklists y procesos instanciados.
- ✅ Valida que el tipo exista. No aplica a proyectos vacíos sin nombre de tipo.

## Requisitos no funcionales

- **Migrabilidad:** split por dominio preserva el contrato público (`AiTool`, `ToolContext`,
  `callTool`, `createBoundTools`, `getFunctionDeclarations`, `findTool`).
- **Compatibilidad Gemini:** `getFunctionDeclarations(tools)` sigue produciendo el mismo
  `parametersJsonSchema` inline (sin `$ref`, requerido estricto).
- **Aislamiento del SDK:** el SDK sólo se importa desde `src/ai/tools/server.ts`. El resto del
  código (incluido `agent.ts`) sigue dependiendo sólo de `register.ts`/tipos.

## Fuera de alcance

- HTTP/WS MCP transport (basta stdio).
- Auth/permisos sobre el servidor MCP.
- Clientes MCP empaquetados o instrucciones de instalación de Claude Desktop.
- Nuevos tools compuestos adicionales a los 3 listados.
- Cambios en UI del chat, schema, automatizaciones, notificaciones, exports.
- Persistencia del API key fuera de IndexedDB.

## Supuestos

- Node ≥ 18 disponible para `scripts/mcp-server.mjs`.
- Los clientes MCP envían `tools/call` con `arguments` (no `args`); se normaliza dentro del
  adaptador para reusar `callTool`.

## Métricas de éxito (verificadas)

- ✅ `npm run typecheck` — 0 errores TS estrictos.
- ✅ `npm run test` — **84 tests** (52 previos + **32 nuevos**) en 13 suites, 0 fallos.
  - dispatcher (3), namesAndShapes (1), composite (5), server (2), tools (7), registry (2),
    dispatcher/gemini (7), más los 52 preexistentes.
- ✅ `npm run build` — `tsc -b && vite build` limpio.
- ✅ Total líneas: +2114 / −1451 (eliminados `readTools.ts` y `writeTools.ts`).
