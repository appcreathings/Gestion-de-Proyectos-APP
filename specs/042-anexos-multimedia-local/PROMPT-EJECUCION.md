# Prompt de ejecución — Spec 042

> Pegar esto como primer mensaje en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 042 de este proyecto: `specs/042-anexos-multimedia-local/`.

Es una feature ya planificada (anexos multimedia en carpeta local). **No re-diseñes ni re-preguntes el alcance**: ejecutá lo que `spec.md`, `design.md` y `tasks.md` ya fijaron. Si algo es ambiguo en el borde de una decisión ya documentada, elegí la opción alineada a las “Decisiones fijadas” del spec y seguí; solo preguntá si chocás con un invariante de la constitución o con un bug bloqueante real.

## Orden de lectura obligatorio (antes de tocar código)

1. `Claude.md` del proyecto (raíz) y, si existe, `.specify/memory/constitution.md` — principios local-first, schema, `StorageAdapter`.
2. `specs/042-anexos-multimedia-local/spec.md` — objetivo, decisiones D1–D12, HUs, CA, fuera de alcance (HU-10).
3. `specs/042-anexos-multimedia-local/design.md` — schema `Attachment`, árbol `attachments/`, API de blobs, store, UI, cascada, export.
4. `specs/042-anexos-multimedia-local/tasks.md` — fases A→G, tareas T4200+, checkpoints, orden de PRs.
5. `specs/042-anexos-multimedia-local/smoke.md` — verificación manual al final.

## Regla de exploración del repo

Hay grafo en `graphify-out/`. Seguí la regla del proyecto: para código no anclado ya en el design, usá `graphify query "<pregunta>"` / `graphify explain` antes de barrer el repo a ciegas.

Al terminar cada fase con cambios de código: `graphify update .` (AST-only).

## Baseline a verificar al empezar

```bash
npx tsc --noEmit
npx vitest run
npm run lint
```

Anotá el número de tests. **Solo puede subir** (o mantenerse si una fase no añade tests). `SCHEMA_VERSION` actual es **16** → target **17**.

## Cómo ejecutar

Seguí `tasks.md` en este orden:

1. **Fase A** — módulos puros (`allowlist`, `paths`, `limits`, `formatBytes`) + tests  
2. **Fase B** — schema `Attachment`, campos `attachments[]`, migración v17  
3. **Fase C** — `writeBlob` / `readBlob` / `removeBlob` / `removeBlobTree` en `StorageAdapter`, `FileSystemAdapter`, `DownloadAdapter`  
4. **Fase D** — `addAttachment` / `removeAttachment` / cascada en deletes del store  
5. **Fase E** — UI `AttachmentsSection` + drop zone + rows  
6. **Fase F** — montar en Task drawer primero (HU-01), luego proyecto/área/proceso/producto/plantilla  
7. **Fase G** — avisos de export, polish, smoke, `graphify update .`

Después de **cada fase**: `tsc --noEmit` + `vitest run` + `lint` limpios antes de la siguiente.  
Al cerrar F o G: `npm run build` si el repo lo usa como gate habitual.

Marcá checkpoints de `tasks.md` y casillas de `smoke.md` cuando las confirmes.

## Decisiones ya fijadas — no re-preguntar

1. Metadatos en JSON de la entidad; bytes en `attachments/` (FS) o IDB (download). **Sin base64** en el JSON.
2. Árbol jerárquico:  
   `attachments/projects/<projectId>/{project|areas|processes|tasks}/...`  
   + `attachments/products/...` + `attachments/process-templates/...`
3. Entidades v1: Project, Area, Process, Task, Product, ProcessTemplate. Nada de comments/checklist items/sprints/flows.
4. Allowlist estricta (imagen/doc/video/audio/zip). Límites: 25 MB FS / 5 MB download; 50/20 anexos por entidad.
5. UI única reutilizable (`AttachmentsSection`); no N implementaciones distintas.
6. `exportAll` JSON **no** embebe binarios; en FS el backup real es la carpeta. Aviso en UI si hay anexos.
7. Blob primero, luego metadato; si falla persist JSON → borrar blob best-effort (estado consistente).
8. Plantillas: anexos **no se copian** al instanciar (v1); solo texto de ayuda.
9. Sin deps nuevas de preview/ZIP en v1. Tests en Node (puras), no jsdom.
10. Tuteo en copy nuevo. Toasts vía canal de spec 040 si ya está en el árbol.

## Invariantes (no romper)

- Principio VI: la UI **no** llama File System Access API directo; solo `StorageAdapter`.
- Flujos, integraciones, RAG de contenido binario, kanban DnD, comentarios: no reabrir specs ajenas.
- Demo/seed 030 y modo download deben seguir hidratando sin error de schema.
- No inventar colección global `attachments/*.json`; metadatos embebidos como en design.

## Definición de hecho

- Tareas T4200–T4264 hechas o explícitamente diferidas con motivo (solo T4262 opcional).
- CA de HU-01…HU-09 cubiertos; HU-10 respetado.
- Smoke FS + smoke download/demo razonables.
- Typecheck, tests, lint (y build al cierre) OK.
- `graphify update .` al final.

## Arranque

Empezá por **T4200** (Fase A). No escribas un plan paralelo: usá `tasks.md` como checklist y reportá al cerrar cada fase qué quedó verde y qué falta.

---
