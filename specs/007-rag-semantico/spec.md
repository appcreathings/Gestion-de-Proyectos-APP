# 007 — Busqueda Semantica (RAG) con Embeddings

**Estado:** Completado  
**Prioridad:** Media  
**Dependencias:** 006-model-management (rate limiter, model registry)  
**Commits:** (ver tareas abajo)

---

## 1. Motivacion

El asistente IA entiende las consultas del usuario pero no tiene acceso al **contenido semantico** de los datos. Puede buscar por nombre exacto o substring (tool `search_workspace`), pero no entiende relaciones conceptuales. Ejemplos de consultas que hoy fallan:

- *"Que tareas estan relacionadas con la landing page?"* — busca substring "landing", se pierde si la tarea dice "pagina de aterrizaje"
- *"En que proyectos participa Juan?"* — necesita cruzar assigneeIds manualmente
- *"Muestrame los objetivos del producto principal"* — no sabe cual es el "principal"

La busqueda semantica (RAG) permite al asistente encontrar entidades por **significado**, no solo por coincidencia de texto.

---

## 2. Arquitectura General

```
Asistente pregunta
       │
       ▼
┌──────────────────┐
│  Gemini Embedding │  ← 1 llamada API por consulta
│  API              │
│  (embed query)    │
└────────┬─────────┘
         │ vector de la query
         ▼
┌──────────────────┐
│  search.ts        │  ← cosine similarity local
│  (compara contra  │
│   embeddings      │
│   guardados)      │
└────────┬─────────┘
         │ top-5 entidades mas similares
         ▼
┌──────────────────────────┐
│  useChatStore.send()     │  ← buildRagContext() antes del turno
│  + systemPrompt.ts       │  ← inyecta en seccion "Contexto semantico"
│  + semantic_search tool  │  ← tool disponible para el modelo
└──────────────────────────┘
         │
         ▼
┌──────────────────┐
│  Gemini Chat     │
│  (respuesta      │
│   contextualizada)│
└──────────────────┘

Indexacion (manual, desde Settings):
  Entidades → limpiar texto → Gemini Embedding API → IndexedDB

Detectcion de cambios:
  Cada entidad tiene updatedAt.
  Al indexar: si embedding.updatedAt === entity.updatedAt → skip.
  Si cambio o no existe → regenera embedding.
```

**Ver seccion 3 "Decisiones de Diseno" para el razonamiento detras de tener ambos caminos de RAG.**

---

## 3. Decisiones de Diseno

### 3.1 Dos caminos de RAG

Se implementaron dos mecanismos complementarios, no uno solo:

| Camino | Donde se ejecuta | Latencia | Proposito |
|--------|-----------------|----------|-----------|
| **Contexto automatico** | `useChatStore.send()` antes de `runAgentTurn()` | ~500ms | Inyecta top-5 resultados en el system prompt de cada mensaje. No requiere accion del modelo. |
| **Tool bajo demanda** | El modelo llama `semantic_search` | ~500ms | Para cuando el modelo necesita explorar el espacio semantico durante una conversacion (ej. "buscame cosas relacionadas con X"). |

**Por que ambos?** El contexto automatico asegura que el modelo siempre tenga informacion relevante disponible sin necesidad de elegir una herramienta. La tool le da la capacidad de profundizar cuando lo necesita. Es redundancia deliberada.

### 3.2 Embedding model no registrado en el selector de chat

`gemini-embedding-001` se agrego al `MODEL_REGISTRY` para que el rate limiter pueda trackear su consumo, pero se filtro de `AI_MODELS` (el array usado por el selector de UI). Los modelos de embedding no tienen sentido como modelo de chat principal.

### 3.3 `ragEnabled` en `AiConfigSchema`, no en `RagState`

El toggle de activacion se persistio en `AiConfigSchema` (IndexedDB, clave `aiConfig`) en lugar de en el store de RAG. Esto evita duplicar la logica de persistencia y centraliza toda la config del asistente en un solo lugar. El store de RAG solo maneja estado transitorio (progreso, errores, metadata).

### 3.4 Store en `src/store/`, no en `src/ai/rag/`

A diferencia del spec original que ubicaba `useRagStore.ts` dentro de `src/ai/rag/`, se movio a `src/store/` por consistencia con los otros stores (`useChatStore`, `useDataStore`, `useAiConfigStore`, `useAppStore`). El patron del proyecto es que los stores de Zustand vivan en `src/store/`.

### 3.5 `checkStale()` no se ejecuta automaticamente

`checkStale()` se llama al montar `RagSettingsCard` pero no en segundo plano ni con cada mutacion de datos. Hacerlo reaktivo requeriria suscribirse a cambios en `useDataStore` o ejecutarlo despues de cada escritura, lo que agregaria complejidad y llamadas a IndexedDB innecesarias. La alternativa pragmatica es que el usuario vea el estado al abrir Settings y decida si re-indexar.

### 3.6 Cosine similarity inline

Se implemento cosine similarity a mano en vez de usar una libreria (TensorFlow.js, ml-matrix) para mantener el bundle pequeno. Con ~1000 vectores de 768 dimensiones, el calculo toma ~2ms en un navegador moderno.

### 3.7 Embeddings en IndexedDB, no en workspace.json

Los embeddings son especificos del dispositivo (dependen de la API key local) y no deben viajar con el workspace cuando se exporta. IndexedDB es la opcion natural: persistente, asincronica, y aislada por origen.

### 3.8 Sin cache de queries

Cada mensaje del chat genera una llamada a Gemini Embedding API para vectorizar la consulta (~300-500ms). No se implemento cache porque:
- El numero de mensajes por sesion tipicamente es bajo (<50)
- Cada consulta es diferente (cachear por相似idad >0.95 requeriria otro embedding)
- Es una optimizacion prematura

---

## 4. Estructura de Archivos

```
src/ai/rag/
+-- types.ts                — tipos compartidos
+-- store.ts                — persistencia en IndexedDB
+-- search.ts               — embedding + busqueda por similitud
+-- indexer.ts              — indexacion de entidades

src/store/
+-- useRagStore.ts          — store Zustand (progreso, estado)

src/ai/
+-- config.ts               — + ragEnabled en AiConfigSchema
+-- gemini/systemPrompt.ts  — + buildRagContext(), parametro ragContext
+-- tools/read/workspace.ts — + semantic_search tool

src/features/settings/
+-- RagSettingsCard.tsx      — UI en Settings
+-- SettingsPage.tsx         — + RagSettingsCard

src/store/
+-- useAiConfigStore.ts      — + setRagEnabled
+-- useChatStore.ts          — + buildRagContext() antes de runAgentTurn()
```

---

## 5. Tipos de Datos — `src/ai/rag/types.ts`

```typescript
export interface RagEntity {
  id: string;                      // "product:p123" | "task:t456"
  entityType: string;              // "product" | "project" | "task" | "area" | "checklist_item" | "person" | "checklist_template" | "process_template" | "project_type" | "automation"
  entityId: string;                // id real de la entidad
  parentProjectId?: string;        // para tareas/areas/checklists
  text: string;                    // texto plano concatenado para embed
  updatedAt: string;               // updatedAt de la entidad al indexar
  indexedAt: string;               // timestamp de indexacion
}

export interface RagEntry {
  id: string;                      // mismo que RagEntity.id
  embedding: number[];             // vector de Gemini (768 dims)
  entity: RagEntity;               // datos planos para busqueda
}

export type RagStatus =
  | "idle"                         // nunca indexado
  | "indexing"                     // indexando ahora
  | "up-to-date"                   // todo sincronizado (o fue indexado alguna vez)
  | "partial"                      // algunos cambios sin indexar (detectado por checkStale)
  | "error";                       // error en ultima indexacion

export interface RagMeta {
  lastIndexedAt: string | null;
  entityCount: number;
}

export interface RagProgress {
  current: number;
  total: number;
  phase: string;                   // entityType actual ("product", "project", etc.)

export interface SearchResult {
  entity: RagEntity;
  score: number;                   // cosine similarity 0-1
}
```

---

## 6. Persistencia — `src/ai/rag/store.ts`

Usa el mismo `idb.ts` helper que el resto de la app.

**Claves en IndexedDB:**

| Key | Contenido |
|---|---|
| `aiRag:embeddings` | `[string, RagEntry][]` — serializacion de Map para IDB |
| `aiRag:meta` | `{ lastIndexedAt, entityCount }` |

```typescript
const IDB_EMBEDDINGS = "aiRag:embeddings";
const IDB_META = "aiRag:meta";

export async function loadEmbeddings(): Promise<Map<string, RagEntry>> { ... }
export async function saveEmbeddings(map: Map<string, RagEntry>): Promise<void> { ... }
export async function loadMeta(): Promise<RagMeta> { ... }
export async function saveMeta(meta: RagMeta): Promise<void> { ... }
```

**Tamaño estimado:** ~3KB por embedding (vector de 768 floats ≈ 3KB + texto plano). Para ~1000 entradas: ~3-4MB en IndexedDB, perfectamente aceptable.

---

## 7. Indexacion — `src/ai/rag/indexer.ts`

### 7.1 Entidades a indexar

| Tipo | Campos indexados | Formato del texto |
|------|-----------------|-------------------|
| `product` | name, description, vision, objectives | `Producto: {name} — Descripcion: {desc} — Vision: {vision} — Objetivo: {obj}` |
| `project` | name, description | `Proyecto: {name} — Descripcion: {desc}` |
| `task` | title, description | `Tarea: {title} — Descripcion: {desc}` |
| `area` | name | `Area: {name}` |
| `checklist_item` | text, notes | `Checklist: {text} — Nota: {notes}` |
| `person` | name, roleTitle | `Persona: {name} — Rol: {role}` |
| `checklist_template` | name, category | `Plantilla de checklist: {name} — Categoria: {cat}` |
| `process_template` | name, description, category | `Plantilla de proceso: {name} — Desc: {desc} — Cat: {cat}` |
| `project_type` | name, description | `Tipo de proyecto: {name} — Desc: {desc}` |
| `automation` | name | `Automatizacion: {name}` |

### 7.2 Funciones exportadas

```typescript
export async function indexAllEntities(
  data: ToolData,
  apiKey: string,
  onProgress?: (progress: RagProgress) => void,
  signal?: AbortSignal,
): Promise<void>

export async function removeStaleEmbeddings(
  data: ToolData,
): Promise<number>
```

### 7.3 Algoritmo de `indexAllEntities`

```
1. Cargar embeddings existentes desde IDB (Map<string, RagEntry>)
2. Recolectar todas las entidades via collectEntities(data) → RagEntity[]
3. Por cada entidad:
   a. Si existe embedding con mismo updatedAt → actualizar solo indexedAt, saltar
   b. Si no existe o cambio → llamar Gemini Embedding API
   c. Guardar en el Map
   d. Reportar progreso via onProgress()
4. Guardar Map actualizado en IDB
5. Guardar metadata (lastIndexedAt, entityCount)
```

### 7.4 `removeStaleEmbeddings`

Elimina embeddings de entidades que ya no existen en el snapshot actual. Se ejecuta despues de `indexAllEntities`.

### 7.5 Limites de API

- Usa `gemini-embedding-001` (registrado en `MODEL_REGISTRY` con `category: "embedding"`)
- El rate limiter trackea RPM/TPM/RPD para embedding igual que para chat
- `AI_MODELS` filtra modelos con `category === "embedding"` para que no aparezcan en el selector de chat
- Si se alcanza un rate-limit real de API, la llamada lanza error y se propaga al store

---

## 8. Busqueda — `src/ai/rag/search.ts`

### 8.1 Funciones

```typescript
export async function embedText(
  text: string,
  apiKey: string,
): Promise<number[]>

export async function semanticSearch(
  query: string,
  apiKey: string,
  topK: number = 5,
): Promise<SearchResult[]>

export async function searchByEntityId(
  entries: Map<string, RagEntry>,
  entityId: string,
): Promise<RagEntry | undefined>
```

### 8.2 Algoritmo de `semanticSearch`

```
1. Llamar embedText(query) → vector de 768 dims
2. Cargar todos los embeddings desde IDB
3. Cosine similarity contra cada embedding
4. Filtrar scores > 0
5. Ordenar por score descendente
6. Devolver top-K como SearchResult[]
```

### 8.3 Cosine similarity

Implementacion inline, sin dependencias externas:

```typescript
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}
```

---

## 9. Store — `src/store/useRagStore.ts`

Store Zustand para el estado de RAG en la UI:

```typescript
interface RagState {
  status: RagStatus;
  progress: RagProgress | null;
  meta: RagMeta;
  error: string | null;
  loaded: boolean;

  hydrate: () => Promise<void>;          // carga metadata desde IDB
  checkStale: () => Promise<void>;       // compara updatedAt y marca partial si hay cambios
  startIndexing: () => Promise<void>;    // ejecuta indexAllEntities (con AbortController interno)
  cancelIndexing: () => void;            // aborta la indexacion en curso
  clearEmbeddings: () => Promise<void>;  // borra todo de IDB
}
```

### Acciones

| Accion | Descripcion |
|--------|-------------|
| `hydrate()` | Carga `RagMeta` desde IDB. Marca `loaded: true`. Status: `up-to-date` si `entityCount > 0`, si no `idle` |
| `checkStale()` | Compara `updatedAt` de entidades actuales contra `entity.updatedAt` de embeddings. Si hay desfase, status pasa a `partial` |
| `startIndexing()` | Crea un `AbortController`, lee API key de `useAiConfigStore`, recolecta datos de `useDataStore`, llama `indexAllEntities` con callback de progreso y signal. Al terminar, ejecuta `removeStaleEmbeddings` y carga el meta actualizado |
| `cancelIndexing()` | Aborta el controlador activo y resetea status a `idle` |
| `clearEmbeddings()` | Borra embeddings y meta de IDB, resetea estado a `idle` |

### `ragEnabled` NO esta en este store

El toggle de activacion se persiste en `AiConfigSchema` (`aiRag:enabled`) y se accede via `useAiConfigStore`. El store de RAG solo maneja estado de indexacion.

---

## 10. Modificaciones al *System Prompt* — `src/ai/gemini/systemPrompt.ts`

### `buildRagContext()`

```typescript
export async function buildRagContext(
  query: string,
  apiKey: string,
  topK: number = 5,
): Promise<string>
```

Devuelve un bloque de texto formateado, o cadena vacia si no hay embeddings:

```
## Contexto semantico (busqueda: "{query}")
Los siguientes registros coinciden semanticamente con la consulta del usuario. Usalos si son relevantes para responder, pero verifica los detalles actuales con herramientas de lectura cuando sea necesario.

[1] project:p123
   "Proyecto: Lanzamiento web — Descripcion: Migracion completa del sitio"
   (similitud: 92%)

[2] person:p456
   "Persona: Juan Perez — Rol: Project Manager"
   (similitud: 85%)
```

### Firma modificada

```typescript
export function buildSystemPrompt(
  workspace: Workspace | null,
  ragContext: string = "",
  today: Date = new Date(),
): string
```

El `ragContext` se inyecta antes de la seccion "## Estilo".

---

## 11. Tool `semantic_search` — `src/ai/tools/read/workspace.ts`

```typescript
defineTool({
  name: "semantic_search",
  description: "Busqueda semantica (IA) sobre el contenido indexado de proyectos, tareas, checklists y demas entidades...",
  mode: "read",
  input: z.object({
    query: z.string().min(1),
    topK: z.number().min(1).max(20).default(5),
  }),
  execute: async ({ query, topK }) => {
    const { useAiConfigStore } = await import("@/store/useAiConfigStore");
    const apiKey = useAiConfigStore.getState().config.apiKey;
    if (!apiKey) return { error: "API key no configurada" };
    return await semanticSearch(query, apiKey, topK);
  },
})
```

Nota: Usa import dinamico de `useAiConfigStore` porque el tool se construye en un contexto puro (`ToolContext`) sin acceso directo al store. Es el mismo patron que usan otros tools que necesitan config.

---

## 12. UI: Settings — `RagSettingsCard.tsx`

En la pagina de Settings, debajo de `AiSettingsCard`:

```
+-- Busqueda semantica (RAG) ------------------------------------+
|                                                                  |
|  [x] Inyectar contexto semantico en cada mensaje                 |
|      Al enviar un mensaje al asistente, busca automaticamente    |
|      entidades relevantes y las incluye en el prompt.            |
|                                                                  |
|  Estado: [Actualizado]       142 entidades indexadas · 14/3 15:30|
|                                                                  |
|  [████████████░░░░░░░░░░]  28/42 (project)                      |
|                                                                  |
|  [Indexar]  [Borrar indices]                                    |
+------------------------------------------------------------------+
```

### Comportamiento

| Estado | Badge | Acciones habilitadas |
|--------|-------|---------------------|
| `idle` | outline "Sin datos" | Indexar |
| `indexing` | secondary "Indexando..." | Indexar (disabled, con spinner), Cancelar |
| `up-to-date` | success "Actualizado" | Indexar, Borrar indices |
| `partial` | warning "Desactualizado" | Indexar, Borrar indices |
| `error` | destructive "Error" | Indexar |

### Responsive

La card usa `max-w-xl` y se adapta al ancho del panel de settings.

---

## 13. Flujo Completo (ciclo de vida)

### Primera vez (usuario nuevo)

```
1. Usuario configura API key → ya existe
2. Usuario navega a Settings → card "Busqueda semantica" — estado: idle
3. Hace clic en "Indexar"
4. useRagStore.startIndexing():
   a. collectToolData() → lee useDataStore completo
   b. indexAllEntities() → recorre N entidades
   c. Por cada una: embedText() via Gemini Embedding API
   d. Progreso en vivo via callback
5. Se guardan N embeddings en IndexedDB
6. Estado: "up-to-date"
```

### Consulta del asistente

```
1. Usuario escribe en el chat
2. useChatStore.send():
   a. Si ragEnabled → buildRagContext(trimmed, apiKey)
      - embedText(trimmed) → vector query
      - cosine similarity contra todos los embeddings en IDB
      - formatea top-5 como texto
   b. buildSystemPrompt(workspace, ragContext)
   c. runAgentTurn({ systemInstruction, ... })
3. Modelo recibe contexto semantico en el system prompt
4. Ademas, el modelo puede llamar semantic_search() como tool
```

---

## 14. Desviaciones del Spec Original

| Aspecto | Spec Original | Implementacion |
|---------|--------------|----------------|
| Store location | `src/ai/rag/useRagStore.ts` | `src/store/useRagStore.ts` (consistente con otros stores) |
| `ragEnabled` | En `RagState.enabled` | En `AiConfigSchema.ragEnabled` (unifica config en un solo lugar) |
| `checkStale()` | Store action para detectar cambios | IMPLEMENTADO — `useRagStore.checkStale()` compara `updatedAt` de entidades actuales vs embeddings y activa estado `partial` cuando hay cambios sin indexar |
| `setEnabled()` | Store action | `useAiConfigStore.setRagEnabled()` |
| Nombre del componente | `QueriesSettingsCard` | `RagSettingsCard` |
| Modelo de embedding | `gemini-embedding-1` (registrado) | `gemini-embedding-001` (registrado en model registry con `category: "embedding"`, filtrado del selector de chat) |
| `embedText` signature | Sin `apiKey` | Con `apiKey: string` (necesario para `createClient`) |
| `DataSnapshot` type | Nombre usado en pseudocodigo | `ToolData` (nombre real en `@/ai/tools/types`) |
| Build RAG context | Solo via tool | Tambien via contexto automatico pre-turno en `useChatStore` |

---

## 15. Gaps Conocidos

| Gap | Impacto | Solucion propuesta |
|-----|---------|-------------------|
| ~~**Sin tests**~~ | ~~No hay cobertura~~ | **RESUELTO** — 35 tests nuevos: `search.test.ts` (9), `indexer.test.ts` (13), `store.test.ts` (8), `systemPrompt.test.ts` (5) |
| ~~**`checkStale()` no implementado**~~ | ~~Estado `partial` nunca se activa~~ | **RESUELTO** — `useRagStore.checkStale()` compara `updatedAt` y marca `partial`; se invoca al montar `RagSettingsCard` |
| ~~**Sin AbortSignal wiring**~~ | ~~No se puede cancelar desde UI~~ | **RESUELTO** — `startIndexing()` crea un `AbortController`, `cancelIndexing()` expone abort al indexer y UI muestra boton "Cancelar" |
| **Sin cache de query embeddings** | Cada mensaje hace 1 llamada API extra | Cache LRU de queries similares (umbral de cosine similarity > 0.95) |
| ~~**Embedding model no registrado**~~ | ~~No aparece en RateLimitStatus~~ | **RESUELTO** — `gemini-embedding-001` registrado en `MODEL_REGISTRY` como `category: "embedding"`; filtrado del selector de chat |

---

## 16. Plan de Implementacion (Ejecutado)

| Fase | Archivos | Descripcion | Estimacion |
|------|----------|-------------|------------|
| **1** | `src/ai/rag/types.ts`, `store.ts` | Tipos y persistencia en IDB | 1h |
| **2** | `src/ai/rag/search.ts` | Cosine similarity + embed + busqueda local | 1h |
| **3** | `src/ai/rag/indexer.ts` | Indexacion de entidades con deteccion de cambios | 2h |
| **4** | `src/store/useRagStore.ts`, `src/ai/config.ts` | Store Zustand + schema | 1h |
| **5** | `src/ai/gemini/systemPrompt.ts` | Inyeccion de contexto RAG | 0.5h |
| **6** | `src/ai/tools/read/workspace.ts` | Tool `semantic_search` | 1h |
| **7** | `src/features/settings/RagSettingsCard.tsx` | UI de settings | 2h |
| **8** | Integracion (useChatStore, useAiConfigStore) + compilacion | Conectar todo, corregir errores tsc | 2h |
| | **Total** | | **~10.5h** |

---

## 17. Riesgos y Consideraciones

| Riesgo | Mitigacion |
|--------|-----------|
| Embedding API rate-limited durante indexacion | El rate limiter trackea; si falla, el error se propaga al store y se muestra en UI |
| IndexedDB lento con muchos embeddings | Tamano estimado ~3-4MB para 1000 entradas, perfectamente aceptable |
| Embedding de consulta agrega latencia (1 API call por mensaje) | ~300-500ms por embedding. Si el usuario desactiva RAG, no hay latencia extra |
| Usuario sin conexion no puede generar embeddings | La indexacion falla con error; los embeddings existentes siguen funcionando para busqueda local |
| Costos de API por embeddings de indexacion | ~$0.0001 por 1000 embeddings (casi gratis); ~$0.15 para 1400 entradas |
| Vector de alta dimension (768) | Cosine similarity sobre 1000 vectores es ~2ms en un navegador moderno |

---

## 18. Registro de Tareas y Resultados de Verificacion

### Tareas ejecutadas

| # | Tarea | Archivos principales | Estado |
|---|-------|---------------------|--------|
| 1 | Tipos y persistencia IDB | `src/ai/rag/types.ts`, `src/ai/rag/store.ts` | Completado |
| 2 | Embedding + busqueda local | `src/ai/rag/search.ts` | Completado |
| 3 | Indexacion de entidades | `src/ai/rag/indexer.ts` | Completado |
| 4 | Store Zustand + config | `src/store/useRagStore.ts`, `src/ai/config.ts` | Completado |
| 5 | Inyeccion de contexto RAG | `src/ai/gemini/systemPrompt.ts` | Completado |
| 6 | Tool `semantic_search` | `src/ai/tools/read/workspace.ts` | Completado |
| 7 | UI Settings | `src/features/settings/RagSettingsCard.tsx`, `SettingsPage.tsx` | Completado |
| 8 | Integracion y correcciones | `src/store/useChatStore.ts`, `src/store/useAiConfigStore.ts`, `src/ai/models.ts` | Completado |
| 9 | Tests unitarios | `src/ai/rag/*.test.ts`, `src/ai/gemini/systemPrompt.test.ts` | Completado |

### Tests

- **Total de suites:** 19 archivos de test
- **Tests RAG nuevos:** 35
  - `src/ai/rag/search.test.ts`: 9 tests
  - `src/ai/rag/indexer.test.ts`: 13 tests
  - `src/ai/rag/store.test.ts`: 8 tests
  - `src/ai/gemini/systemPrompt.test.ts`: 5 tests (2 nuevos para RAG)
- **Resultado:** 147 tests pasan, 0 fallos
- **TypeScript:** `tsc --noEmit` limpio (errores pre-existentes no relacionados en `TaskFormDialog.tsx`, `ProjectFormDialog.tsx`)

### Commits

- (pendiente — codigo no commiteado aun)
