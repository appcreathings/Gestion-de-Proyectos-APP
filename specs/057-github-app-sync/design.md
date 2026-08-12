# Design 057 — GitHub App + archivos de proyecto en el repo

## Fronteras

```text
React/Vite (local-first)
        │ HTTPS, sin secretos
        ▼
BFF Vercel /api/github/*
        │ installation token (+ user token cifrado para crear repos)
        ▼
GitHub REST (repos, contents)
```

## Endpoints BFF

```text
GET  /api/github/connect
GET  /api/github/callback
GET  /api/github/health
GET  /api/github/connection/:id
GET|POST /api/github/connection/:id/repositories
GET|PUT  /api/github/connection/:id/contents   ← archivos .hito/*
POST /api/github/connection/:id/revoke
```

**No hay** endpoints de GitHub Projects ni de issues en esta versión.

## Persistencia local

- `GitHubConnection` — instalación / login
- `GitHubLink` — proyecto local ↔ owner/repo + `syncMode` + timestamps de sync
- Sin `GitHubMapping` de issues (reservado / no usado en UI)

## Sync de archivos

- Push: `PUT contents` de `.hito/projects/{id}.json` (+ manifest)
- Pull: `GET contents`, validar con Zod, aplicar o reportar conflicto
- Conflicto: `local.updatedAt !== remote.updatedAt` y ambos ≠ lastSuccess snapshot hash

## Permisos App

| Permiso | Nivel |
|---|---|
| Administration | Read and write (crear repos) |
| Contents | Read and write (sync archivos) |
| Metadata | Read-only |
| Issues | No access |
| Projects | No requerido |

## Niveles (syncMode)

Implementados en `buildProjectRepoPayload(project, mode)`.
