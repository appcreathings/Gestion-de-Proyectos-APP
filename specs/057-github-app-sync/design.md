# Design 057 — GitHub App y sincronización local-first

## 1. Decisiones de arquitectura

### 1.1 Fronteras

```text
React/Vite + Zustand + StorageAdapter
              │ HTTPS, sin secretos
              ▼
Backend/BFF serverless de GitHub
              │ App private key + installation token
              ▼
GitHub REST / GraphQL API
```

El frontend sigue siendo dueño del workspace y de los datos locales. El backend no almacena
usuarios Hito ni datos de proyectos; únicamente mantiene estado efímero de autorización y
resuelve llamadas autorizadas a GitHub.

### 1.2 Responsabilidades

| Capa | Responsabilidad |
|---|---|
| UI | Conectar, configurar, previsualizar, confirmar y mostrar ejecuciones |
| Store | Estado transitorio de conexión y sincronización; no persistir tokens aquí |
| StorageAdapter | Persistir links, mappings, scheduler e historial local |
| GitHub client | Contratos tipados, paginación y normalización |
| Sync engine | Planificar cambios, detectar conflictos y ejecutar operaciones idempotentes |
| Backend | OAuth callback, validación de instalación, tokens temporales y proxy GitHub |
| GitHub App | Permisos mínimos sobre repositorios instalados |

## 2. Autenticación e instalación

### 2.1 Flujo

```text
1. Frontend → GET /github/connect?linkId=...
2. Backend crea state aleatorio con expiración corta y redirige a GitHub
3. Usuario autoriza/instala la App
4. GitHub → GET /github/callback?code=...&state=...
5. Backend valida state y canjea code
6. Backend obtiene identidad e installation_id
7. Backend crea token temporal de instalación
8. Backend redirige al frontend con un connectionId opaco y efímero
9. Frontend → GET /github/connection/:id/repositories
10. Backend verifica que el repositorio pertenece a la instalación
```

El callback nunca entrega private key, client secret ni token permanente al navegador. El `state`
debe ser de un solo uso, tener TTL corto y estar ligado al origen/dispositivo que inició el flujo.

### 2.2 Contratos BFF

```ts
type GitHubConnectStart = {
  redirectUrl: string;
};

type GitHubConnectionSummary = {
  connectionId: string;
  githubUserId: number;
  githubLogin: string;
  installationId: number;
  expiresAt: string;
};

type GitHubRepository = {
  id: number;
  owner: string;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
};

type GitHubProject = {
  id: string;
  number: number;
  title: string;
  ownerLogin: string;
};
```

Endpoints mínimos:

```text
GET  /github/connect
GET  /github/callback
GET  /github/connection/:id
GET  /github/connection/:id/repositories
GET  /github/connection/:id/projects?owner=...
POST /github/connection/:id/sync/preview
POST /github/connection/:id/sync/apply
POST /github/connection/:id/revoke
```

El backend debe validar el `connectionId`, el repositorio y el Project en cada request. Nunca debe
confiar en que el frontend ya validó esos valores.

## 3. Persistencia local

Las entidades se añaden a la base de integración/workspace mediante el adapter existente. Los
secretos no forman parte del JSON exportable.

```ts
type PersistedGitHubConnection = {
  id: string;
  provider: "github";
  githubUserId: number;
  githubLogin: string;
  installationId: number;
  backendConnectionId: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
};

type PersistedGitHubLink = {
  id: string;
  projectId: string;
  connectionId: string;
  owner: string;
  repository: string;
  repositoryId: number;
  projectNumber?: number;
  projectNodeId?: string;
  direction: "local-to-github" | "two-way";
  schedule: "manual" | "5m" | "15m" | "30m" | "1h" | "6h" | "24h";
  status: "active" | "paused" | "error" | "disconnected";
  consecutiveFailures: number;
  lastSyncAt: string | null;
  lastSuccessAt: string | null;
  nextSyncAt: string | null;
  updatedAt: string;
};
```

Migración: añadir tablas/colecciones sin alterar proyectos ni tareas existentes. Si se importa un
workspace sin la conexión remota, las tareas y mappings se conservan y el link queda desconectado.

## 4. Cliente GitHub y normalización

El frontend no llama directamente a GitHub. El cliente llama al BFF, que responde con contratos
propios estables. Esto evita acoplar la UI a cambios de REST/GraphQL y permite cambiar OAuth por
otro mecanismo sin modificar el dominio.

### 4.1 REST

Usar REST para:

- repositorios accesibles;
- issues;
- labels;
- assignees;
- milestones;
- creación y actualización de issues.

### 4.2 GraphQL

Usar GraphQL para GitHub Projects modernos, items, status y custom fields. Las queries deben usar
cursor pagination y solicitar únicamente los campos necesarios.

### 4.3 Normalización

```ts
type RemoteIssue = {
  id: number;
  nodeId: string;
  number: number;
  title: string;
  body: string;
  state: "open" | "closed";
  labels: string[];
  assigneeLogins: string[];
  updatedAt: string;
  htmlUrl: string;
};
```

Toda respuesta externa se valida en el límite con Zod. Una respuesta inválida produce error de
integración; no se persiste parcialmente como si fuera dato confiable.

## 5. Modelo de sincronización

### 5.1 Pipeline

```text
load local snapshot
      ↓
read mappings + last published hashes
      ↓
fetch remote changes (paginated)
      ↓
build sync plan
      ↓
show preview / require confirmation for creates
      ↓
apply safe operations
      ↓
persist mappings, hashes and run result atomically
```

La vista previa informa: crear, actualizar, sin cambios, conflicto, remoto inexistente y error.

### 5.2 Fuente de verdad

Para cada tarea vinculada:

```text
localSnapshotHash = hash(campos sincronizables locales)
lastPublishedHash = hash del último contenido enviado a GitHub
remoteUpdatedAt   = fecha remota observada
```

Reglas:

```text
localChanged  = localSnapshotHash !== lastPublishedHash
remoteChanged = remote.updatedAt > lastRemoteUpdatedAt

localChanged && !remoteChanged → publicar local
!localChanged && remoteChanged → importar/proponer remoto
localChanged && remoteChanged  → conflicto; no sobrescribir
!localChanged && !remoteChanged → no-op
```

Si GitHub no ofrece una fecha fiable para un campo concreto, se compara el contenido normalizado
con el último snapshot remoto y se marca el caso como de confianza reducida.

### 5.3 Idempotencia

- Crear issue solo si no existe mapping confirmado.
- Persistir el mapping inmediatamente después de una creación exitosa.
- Reintentos de una actualización usan el mismo `remoteIssueId`.
- Una ejecución repetida con los mismos hashes produce `no-op`.
- La aplicación nunca usa el título como clave de deduplicación.

## 6. Publicación local → GitHub

La publicación requiere una acción explícita en v1:

1. El usuario selecciona tareas o pulsa “Previsualizar sincronización”.
2. Hito genera el plan.
3. El usuario confirma las creaciones/actualizaciones.
4. El engine ejecuta operaciones en lotes pequeños.
5. Se guardan mappings e historial.

Campos publicados:

```text
task.name        → issue.title
task.description → issue.body
task.status      → issue.state + Project status
task.priority    → label configurable
task.tags        → labels
task.assignee    → assignee si hay login GitHub configurado
```

No se publican por defecto campos desconocidos, datos de IA, credenciales ni archivos adjuntos.

## 7. Importación GitHub → local

La importación remota no sobrescribe silenciosamente un campo local modificado. Puede producir:

- propuesta de cambio;
- conflicto explícito;
- actualización automática solo si el local no cambió desde la última publicación.

Un issue cerrado actualiza el estado según el mapping. Un issue eliminado o inaccesible cambia el
mapping a `remote-missing`; la tarea local permanece intacta.

## 8. Scheduler

El scheduler vive en el frontend porque no hay servicio de ejecución persistente.

```ts
const INTERVAL_MS = {
  manual: null,
  "5m": 5 * 60_000,
  "15m": 15 * 60_000,
  "30m": 30 * 60_000,
  "1h": 60 * 60_000,
  "6h": 6 * 60 * 60_000,
  "24h": 24 * 60 * 60_000,
} as const;
```

Reglas:

- usar un único timer por link;
- no iniciar una ejecución si otra del mismo link está activa;
- al volver a foco, comparar `nextSyncAt` y ejecutar si está vencido;
- pausar al cerrar la pestaña y mostrar “se ejecutará al volver a abrir”;
- detener tras tres fallos consecutivos;
- aplicar backoff para errores transitorios;
- respetar `Retry-After` cuando GitHub lo envíe;
- actualizar `lastSyncAt` siempre y `lastSuccessAt` solo en éxito completo.

El scheduler no debe impedir editar datos locales ni bloquear el arranque de la aplicación.

## 9. Conflictos y errores

```ts
type SyncConflict = {
  id: string;
  linkId: string;
  localTaskId: string;
  fields: Array<{
    field: string;
    localValue: unknown;
    remoteValue: unknown;
  }>;
  status: "open" | "resolved-local" | "resolved-remote" | "dismissed";
  createdAt: string;
};
```

Resoluciones v1:

- conservar local y publicar;
- aceptar remoto y actualizar local;
- posponer.

No se resuelven conflictos automáticamente. Errores de autenticación, permisos, rate limit y
red se clasifican para que la UI pueda ofrecer una acción específica.

## 10. Seguridad

- private key y client secret únicamente en variables secretas del backend;
- `state` de un solo uso y con expiración;
- token de instalación temporal, nunca persistido en workspace;
- autorización de repositorio verificada en cada request;
- allowlist de operaciones y rutas, sin proxy HTTP genérico;
- logs con IDs y metadatos, nunca tokens, bodies completos ni credenciales;
- sanitización de Markdown remoto antes de renderizar;
- rate limiting del BFF;
- CORS limitado al dominio de Hito;
- revocación que invalida la conexión local y limpia referencias remotas sensibles;
- datos locales disponibles sin conexión y sin depender de GitHub.

## 11. Pruebas

### Unitarias

- hashes estables y normalización;
- reglas de detección de cambios;
- idempotencia;
- mapeo de estados y labels;
- scheduler y backoff;
- clasificación de errores;
- migración y serialización sin secretos.

### Integración

- callback con `state` válido, expirado, repetido y ausente;
- repositorio fuera de la instalación;
- paginación REST/GraphQL;
- rate limit y `Retry-After`;
- token expirado o instalación revocada;
- creación seguida de reintento;
- respuesta remota inválida.

### E2E

- conectar → seleccionar repo → vincular → previsualizar → publicar;
- configurar frecuencia → cerrar/reabrir → sincronizar al volver a foco;
- cambio local + remoto → conflicto sin pérdida;
- issue eliminado → tarea local conservada;
- desconectar → datos locales intactos.

## 12. Observaciones de despliegue

El frontend Vite puede permanecer en Vercel como SPA. El BFF puede vivir como funciones serverless
del mismo proyecto o como servicio separado. En ambos casos, las rutas de callback deben ser HTTPS,
y desarrollo/producción deben usar GitHub Apps y credenciales distintas.
