# Spec 057 — GitHub App: autenticación y sincronización local-first

> Estado: **SOLO DOCUMENTADO** (planning). No se toca `src/`.
> Feature dir: `specs/057-github-app-sync/` · Fecha: 2026-08-11.
> Principios: I local-first, II esquema como contrato, V entrega incremental, VI migrabilidad.

## 1. Contexto

Hito es una SPA local-first sin administración propia de usuarios. Se desea conectar una
GitHub App desde el frontend para vincular un repositorio y, opcionalmente, un GitHub Project.
El proyecto local es la fuente de verdad; GitHub es un destino sincronizado. La integración no
debe convertir GitHub en el almacenamiento principal ni requerir cuentas internas en esta fase.

## 2. Objetivo

Permitir que una persona:

1. Se autentique con GitHub mediante la GitHub App.
2. Autorice la App únicamente sobre repositorios seleccionados.
3. Vincule un repositorio a un proyecto local.
4. Configure una frecuencia de sincronización.
5. Publique cambios locales hacia GitHub de forma incremental, idempotente y auditable.
6. Consulte el estado, última ejecución, errores y conflictos.
7. Desconecte la integración sin perder datos locales.

## 3. Decisiones de producto

1. No habrá registro, login, perfiles, roles ni administración de usuarios propios.
2. La identidad de GitHub se conserva solo como identidad de conexión (`githubLogin`, `githubUserId`).
3. Una conexión pertenece al dispositivo/workspace local, no a una cuenta interna.
4. La fuente de verdad es Hito: los cambios locales pueden publicarse en GitHub; los cambios
   remotos se importan solo mediante una acción explícita de sincronización.
5. La v1 usa sincronización manual y programada mientras la aplicación está abierta. No promete
   sincronización cuando el navegador está cerrado.
6. La v1 no elimina automáticamente datos locales ni issues remotos.
7. Los permisos de escritura se solicitan solo para issues y Project items necesarios; nunca
   permisos administrativos del repositorio.
8. La sincronización bidireccional completa, webhooks y multiusuario quedan fuera de v1.

## 4. Arquitectura autorizada

La GitHub App debe tener un backend mínimo o funciones serverless para completar OAuth, custodiar
la clave privada y crear tokens de instalación. El frontend nunca recibe la private key ni un
client secret. El backend no se convierte en base de datos de usuarios: solo mantiene estado
transitorio/seguro de OAuth e instalaciones, y actúa como proxy controlado hacia GitHub.

Para prototipo local se permite un modo PAT explícito, separado y marcado como avanzado; no es el
flujo objetivo ni debe mezclarse con el contrato de GitHub App.

## 5. Alcance funcional v1

- Botón “Conectar GitHub”.
- Callback OAuth/App y validación de identidad.
- Selección de cuenta/organización, repositorio y Project disponible.
- Vinculación a un proyecto interno.
- Lectura de issues, labels, assignees, milestones y Project status.
- Creación/actualización de issues desde tareas locales.
- Mapeo configurable de estados y prioridad.
- Sincronización manual.
- Frecuencias: manual, 5 min, 15 min, 30 min, 1 h, 6 h y 24 h.
- Programación solo mientras la app está abierta y visible/activa; al volver a foco se ejecuta
  una sincronización pendiente si corresponde.
- Registro local de ejecuciones, conteos, errores y conflictos.
- Desconexión y revocación.

## 6. Modelo de datos mínimo

```ts
type GitHubLink = {
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
  lastSyncAt: string | null;
  lastSuccessAt: string | null;
  nextSyncAt: string | null;
  updatedAt: string;
};

type GitHubMapping = {
  id: string;
  linkId: string;
  localTaskId: string;
  remoteIssueId: number;
  remoteIssueNodeId: string;
  remoteIssueNumber: number;
  lastPublishedHash: string | null;
  lastRemoteUpdatedAt: string | null;
  state: "linked" | "conflict" | "remote-missing" | "local-only";
};

type GitHubSyncRun = {
  id: string;
  linkId: string;
  startedAt: string;
  finishedAt: string | null;
  status: "running" | "success" | "partial" | "failed" | "cancelled";
  created: number;
  updated: number;
  skipped: number;
  conflicts: number;
  errors: string[];
};
```

El token de instalación y cualquier secreto se guarda cifrado con el vault existente o, si lo
gestiona el backend, nunca se persiste en los datos exportables del workspace.

## 7. Reglas de sincronización

- Solo se publican entidades explícitamente vinculadas o marcadas como “publicar”.
- Las tareas locales nuevas no crean issues automáticamente en la primera sincronización; debe
  existir una confirmación del usuario.
- Nunca se borran tareas locales por la ausencia de un issue remoto.
- Un issue remoto cerrado se refleja como estado local según el mapeo configurado.
- Un cambio local posterior al último hash publicado puede actualizar el issue remoto.
- Si también cambió GitHub desde la última sincronización, se crea conflicto y no se sobrescribe.
- Los reintentos deben ser seguros: repetir una ejecución no duplica issues.
- Los rate limits, timeouts y errores parciales dejan el enlace usable y muestran una acción de
  reintento.
- La sincronización programada se pausa después de tres fallos consecutivos y requiere reactivar.

## 8. Mapeos iniciales

```text
Título de tarea       ↔ Issue title
Descripción           ↔ Issue body
Estado local          → Issue state / Project status
Prioridad             → Label configurable
Etiquetas             ↔ Labels
Responsable           → Assignee solo si existe identidad compatible
Fecha límite          → Project custom field opcional
```

El sentido efectivo de cada campo debe aparecer en la UI. El estado local prevalece cuando hay
cambio local y remoto simultáneo; si no se puede determinar el origen, se crea conflicto.

## 9. Criterios de aceptación

- El usuario completa el flujo de GitHub sin crear una cuenta Hito.
- La private key y los secretos nunca llegan al navegador.
- El usuario solo ve repositorios permitidos por la instalación.
- Puede vincular un repositorio a un proyecto local y guardar la configuración.
- Puede elegir una frecuencia y verla reflejada en “Próxima sincronización”.
- La app sincroniza al abrirse, volver a foco y según el intervalo configurado.
- La sincronización no corre con datos locales sin guardar.
- Repetir la sincronización no duplica issues ni mappings.
- Los cambios locales aprobados se publican en GitHub.
- Los cambios remotos detectados se muestran como propuesta o conflicto, sin pérdida local.
- Un issue remoto eliminado no elimina la tarea local.
- La app funciona offline y conserva la última configuración conocida.
- El usuario puede cancelar, pausar, reintentar y desconectar.
- Se registra el resultado de cada ejecución sin guardar tokens ni cuerpos sensibles en logs.

## 10. Fuera de alcance

- Usuarios, sesiones, organizaciones internas, roles y billing.
- Sincronización con navegador cerrado.
- Webhooks de GitHub.
- Pull requests, commits, releases y workflows.
- Sincronización de comentarios en v1.
- Resolución automática de conflictos.
- Eliminación remota o local automática.
- Soporte de múltiples workspaces remotos.

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| SPA sin backend expone secretos | Backend mínimo para OAuth/App y private key |
| Rate limit | Paginación, cache local, backoff y estado visible |
| Navegador cerrado | Declarar sincronización “mientras la app está abierta” |
| Duplicados | Mappings por IDs estables e idempotencia |
| Conflictos | Hash publicado + `updated_at`; no sobrescribir silenciosamente |
| Repo eliminado o permisos revocados | Estado `error`, conservar datos locales y pedir reconexión |
| Markdown/XSS | Sanitizar antes de renderizar |

## 12. Plan de implementación

1. Contratos, migración y provider `github` en la capa de conexiones.
2. Backend mínimo OAuth/GitHub App y callback.
3. UI de conexión, selección y vínculo.
4. Lectura paginada de repositorios/issues/projects.
5. Publicación explícita de tareas locales.
6. Mappings, hashes e idempotencia.
7. Scheduler visible, pausa, reintentos y foco de ventana.
8. Historial, conflictos, seguridad y pruebas E2E.
