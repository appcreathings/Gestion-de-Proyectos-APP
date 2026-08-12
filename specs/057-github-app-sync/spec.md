# Spec 057 — GitHub App y sincronización de proyectos al repositorio

## Resumen

Hito se conecta a GitHub mediante una **GitHub App** (OAuth + installation). El usuario puede:

1. **Crear o elegir un repositorio** (público o privado).
2. **Vincular uno o varios proyectos locales** a ese repositorio.
3. **Sincronizar la información del proyecto** como archivos JSON en el repo (carpeta `.hito/`), en ambos sentidos.

**Fuera de alcance de esta versión:**

- Issues de GitHub ↔ tareas
- GitHub Projects (boards)
- Webhooks de GitHub
- Cuentas de usuario propias de Hito (sigue local-first)

## Objetivos

- Conectar sin secretos en el frontend (BFF en Vercel).
- Crear repositorios cuando la App tenga permiso Administration.
- Guardar y recuperar el proyecto completo (o un subconjunto) en el repositorio.
- Ofrecer niveles de sync: **ligera**, **media**, **completa**.
- Detectar conflictos al recibir datos del repo.
- UI clara: estado de sync, sincronizar todo, sincronizar desde la ficha del proyecto.

## Niveles de sincronización

| Nivel | Contenido |
|---|---|
| **Ligera** | Nombre, descripción, estado, prioridad, health, fechas, tags, stakeholders |
| **Media** | Ligera + tareas (sin comentarios ni adjuntos de tarea), áreas (estructura y procesos), milestones, sprints, wipLimits |
| **Completa** | Media + comentarios de tareas + metadatos de adjuntos (no binarios) |

Los blobs de adjuntos **no** se suben al repo en ningún nivel (solo metadatos de referencia).

## Almacenamiento en el repositorio

```text
.hito/
  manifest.json
  projects/
    {projectId}.json
```

Cada archivo incluye `format`, `version`, `syncMode`, `exportedAt` y el proyecto serializado.

## Criterios de aceptación

- CA-01: OAuth/connect y callback funcionan; la private key no sale del BFF.
- CA-02: Se puede crear un repositorio privado o público (con permisos correctos).
- CA-03: Se pueden vincular N proyectos locales al mismo repo.
- CA-04: «Sincronizar todo» sube todos los vínculos activos al repo.
- CA-05: Enviar / Recibir por proyecto funciona con el nivel elegido.
- CA-06: Al recibir, si local y remoto cambiaron, se muestra conflicto y se elige lado.
- CA-07: Desde la ficha del proyecto se puede sincronizar si hay vínculo.
- CA-08: No se crean issues ni GitHub Projects por esta integración.

## Fuera de alcance

- Sincronización de issues / PRs
- GitHub Projects v2
- Sync en background con el navegador cerrado
- Multi-dispositivo vía GitHub como backend de verdad (es un export/sync, no multiplayer)
