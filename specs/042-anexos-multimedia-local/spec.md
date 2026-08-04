# Spec 042 — Anexos multimedia en carpeta local

> Estado: **IMPLEMENTADO** (fases A–G en código). Smoke manual en `smoke.md`.
> Feature dir: `specs/042-anexos-multimedia-local/` · Fecha: 2026-08-03
> Baseline al empezar: `SCHEMA_VERSION` **16**, storage solo JSON (colecciones + docs).
> Depende de: storage local-first (001), drawer de tarea (013/016), UX feedback (040, toast + guardado veraz).
> Principios (constitución): **I** (datos del usuario en su carpeta), **II** (schema + migración),
> **V** (simplicidad incremental), **VI** (todo I/O vía `StorageAdapter`).

## 1. Contexto

Hito es **local-first**: proyectos, procesos, tareas y el resto viven como `.json` en una carpeta
que el usuario elige (`FileSystemAdapter`) o en IndexedDB (`DownloadAdapter` / demo). Hoy **no
existe** forma de asociar un archivo real (PDF, captura, video de demo, audio de reunión, mockup)
a una entidad del dominio.

Eso deja huecos cotidianos del PM:

1. **Evidencia de proceso / checklist** — un SOP dice “adjuntar el contrato firmado” y no hay
   dónde colgarlo.
2. **Contexto de tarea** — diseños, capturas de bug, grabaciones cortas o PDFs de requisitos
   viven en Drive/WhatsApp y se pierden al reabrir la tarea.
3. **Documentación de proyecto / área** — briefs, actas, diagramas no tienen un ancla en el
   árbol del proyecto.
4. **Biblioteca de procesos** — las plantillas de proceso no pueden llevar el material de
   referencia (manual, checklist en PDF) que se reutiliza al instanciar.
5. **Producto** — assets de marca, one-pagers o vision decks no tienen hogar en Hito.

El storage actual solo conoce texto JSON (`writeJsonFile` / IndexedDB serializado). No hay API de
binarios, no hay carpeta `attachments/`, y `exportAll` solo empaqueta JSON.

## 2. Objetivo

Permitir **anexar archivos multimedia y documentos** a las entidades relevantes del dominio,
guardándolos de forma **eficiente y navegable en la carpeta local** (y con paridad degradada en
modo navegador), con una UI reutilizable y criterios claros de tipos, tamaño y limpieza al
borrar entidades.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Rativa |
|---|----------|--------|
| D1 | **Metadatos en el JSON de la entidad; bytes en carpeta `attachments/`** (FS) o blob store (IDB). | Principio I: el usuario ve y respalda archivos reales. El `.json` no se infla con base64. |
| D2 | **Árbol de carpetas jerárquico por proyecto** (ver `design.md` §2). | Navegable en el Explorador de archivos / Finder sin abrir Hito. |
| D3 | **Entidades con anexos en v1:** `Project`, `Area`, `Process`, `Task`, `Product`, `ProcessTemplate`. | Cubre operación diaria + biblioteca. Checklist items y comentarios quedan fuera (v2). |
| D4 | **Un solo componente UI** (`AttachmentsSection`) montado en cada superficie. | Evita N implementaciones distintas; Principio V. |
| D5 | **Límites v1:** 25 MB por archivo (FS), 5 MB por archivo (modo navegador/demo); máx. 50 anexos por entidad; tipos allowlist. | Evita saturar IDB y da feedback predecible. |
| D6 | **Respaldo FS = la carpeta entera.** `exportAll` JSON **no** embebe binarios; se documenta y, si hay anexos, el UI avisa. En modo download, export ampliado opcional en fase posterior. | Hoy no hay dependencia ZIP; la carpeta ya es el backup real en Chromium. |
| D7 | **Borrado en cascada de bytes** al borrar proyecto / entidad / anexo. | Sin basura huérfana en disco. |
| D8 | **`SCHEMA_VERSION` 16 → 17**, migración identidad (campos default `[]`). | Igual patrón que comments/subtasks. |
| D9 | **Sin librería de preview pesada** en v1: miniatura nativa para imágenes; el resto abre descarga / nueva pestaña `blob:`. | Cero deps nuevas salvo que el diseño de ZIP se abra más adelante. |
| D10 | **Modo demo / DownloadAdapter:** anexos funcionan con cupo reducido y aviso de “solo en este navegador”. | Paridad de producto sin mentir sobre persistencia. |
| D11 | **No se indexan bytes en RAG** en v1 (solo nombre + descripción + mime en metadatos si el indexador ya lee el JSON). | Evita coste y complejidad de OCR/transcripción. |
| D12 | **Tono de copy: tuteo**, alineado a superficies nuevas (030/040). | Consistencia de voz. |

## 4. Tipos de archivo soportados (allowlist)

| Familia | Extensiones (minúsculas) | `kind` |
|---------|--------------------------|--------|
| Imagen | `png`, `jpg`, `jpeg`, `webp`, `gif`, `svg` | `image` |
| Documento | `pdf`, `txt`, `md`, `csv`, `doc`, `docx`, `xls`, `xlsx`, `ppt`, `pptx` | `document` |
| Video | `mp4`, `webm`, `mov` | `video` |
| Audio | `mp3`, `wav`, `ogg`, `m4a` | `audio` |
| Otro permitido | `zip` | `archive` |

Cualquier otra extensión se **rechaza** con mensaje claro (no “otros genéricos” silenciosos).
El `mimeType` se toma del `File.type` del navegador cuando existe; si viene vacío, se infiere
por extensión con un mapa fijo (`design.md` §3).

## 5. Historias de usuario y criterios de aceptación

### HU-01 — Anexar a una tarea · **núcleo**
**Como** PM, **quiero** adjuntar archivos a una tarea desde su detalle **para** tener evidencia y
contexto junto al trabajo.

- **CA-01.1** En `TaskDetailDrawer` hay una sección **Anexos** con contador.
- **CA-01.2** Puedo añadir por botón “Adjuntar” (file picker multi-select) y por **arrastrar y soltar** sobre la zona de la sección.
- **CA-01.3** Tras un adjunto válido: aparece en la lista, se persiste el metadato en `Task.attachments` y los bytes en storage; toast de éxito (spec 040).
- **CA-01.4** Si el archivo supera el límite del modo o no está en la allowlist: no se guarda, toast/error en sección con el motivo.
- **CA-01.5** Puedo **descargar**, **eliminar** (con confirmación) y, si es imagen, ver **miniatura** y abrir preview ligero (lightbox o nueva pestaña).

### HU-02 — Anexar a proyecto, área y proceso
**Como** PM, **quiero** el mismo patrón en proyecto, área y proceso **para** centralizar briefs, actas y material de SOP.

- **CA-02.1** `ProjectDetailPage` (o pestaña/resumen del proyecto) expone `AttachmentsSection` a nivel proyecto.
- **CA-02.2** En la UI de área (detalle/editor de área) hay anexos de área.
- **CA-02.3** En el editor de proceso de un área hay anexos de proceso.
- **CA-02.4** Los paths en disco reflejan la jerarquía proyecto → área/proceso/tarea (`design.md` §2).

### HU-03 — Anexar a producto y plantilla de proceso
**Como** PM, **quiero** adjuntar material de marca al producto y material de referencia a una plantilla de proceso **para** reutilizarlo.

- **CA-03.1** Formulario/detalle de producto tiene sección Anexos.
- **CA-03.2** Editor de plantilla de proceso (Biblioteca) tiene sección Anexos.
- **CA-03.3** Al **instanciar** un proyecto desde tipo/plantilla, los anexos de `ProcessTemplate` **no se copian automáticamente** a cada instancia en v1 (evita duplicar megas); la plantilla sigue siendo la fuente. Documentado en UI con texto de ayuda.

### HU-04 — Organización en carpeta local (filesystem)
**Como** usuario con carpeta conectada, **quiero** encontrar los archivos en el Explorador **sin** abrir Hito.

- **CA-04.1** Bajo la raíz del workspace existe `attachments/` creado en bootstrap.
- **CA-04.2** Un anexo de tarea queda en una ruta predecible del estilo  
  `attachments/projects/<projectId>/tasks/<taskId>/<attachmentId>__<safeName>.<ext>`.
- **CA-04.3** Productos y plantillas de proceso usan ramas `attachments/products/...` y `attachments/process-templates/...`.
- **CA-04.4** El nombre en disco es **seguro** (sin path traversal, sin caracteres reservados) y conserva la extensión original en minúsculas.
- **CA-04.5** Borrar el anexo en la UI elimina el archivo en disco (o lo mejor esfuerzo si ya no existe).

### HU-05 — Cascada al borrar entidades
**Como** usuario, **quiero** que al borrar un proyecto o una tarea no queden archivos huérfanos.

- **CA-05.1** Borrar un anexo concreto elimina solo ese blob + su entrada de metadatos.
- **CA-05.2** Borrar una tarea elimina todos sus blobs bajo su carpeta.
- **CA-05.3** Borrar un proyecto elimina el árbol `attachments/projects/<projectId>/` completo (áreas, procesos y tareas incluidas).
- **CA-05.4** Borrar producto / plantilla de proceso elimina su rama de anexos.

### HU-06 — Modo navegador / demo
**Como** usuario en Firefox/Safari o en demo, **quiero** poder adjuntar archivos pequeños **sabiendo** que viven solo en el navegador.

- **CA-06.1** `DownloadAdapter` implementa la misma interfaz de blobs (IDB).
- **CA-06.2** Límite 5 MB/archivo; mensaje si se excede.
- **CA-06.3** Banner o texto de ayuda en la sección cuando `adapter.kind === "download"`.
- **CA-06.4** Si la cuota de IDB falla, toast de error y estado de entidad sin el anexo a medias (metadato no se confirma sin blob).

### HU-07 — Listado y filtros en la sección
**Como** PM, **quiero** ver mis anexos ordenados y filtrables por tipo **para** encontrar un PDF o una captura rápido.

- **CA-07.1** Lista ordenada por `createdAt` descendente (más reciente arriba).
- **CA-07.2** Filtro por `kind`: todos | imágenes | documentos | video | audio | archivos.
- **CA-07.3** Cada fila muestra: icono por kind, nombre original, tamaño legible, fecha relativa/absoluta corta.
- **CA-07.4** Descripción opcional editable inline (blur/Enter guarda).

### HU-08 — Integridad y contrato de storage
**Como** desarrollador / principio VI, **quiero** que la UI no toque la File System Access API directamente.

- **CA-08.1** Nuevos métodos en `StorageAdapter`: `writeBlob`, `readBlob`, `removeBlob`, `removeBlobPrefix` (o equivalente documentado en design).
- **CA-08.2** Solo `FileSystemAdapter` / `DownloadAdapter` implementan I/O de bytes.
- **CA-08.3** Lectura/escritura de metadatos sigue Zod en el borde de la entidad contenedora.
- **CA-08.4** Tests unitarios de: allowlist, safe filename, resolución de path, cascada de paths, límites de tamaño.

### HU-09 — Feedback y estados de carga
**Como** usuario, **quiero** ver progreso o al menos “guardando…” al subir un archivo grande.

- **CA-09.1** Mientras se escribe el blob, la fila o la zona muestra estado pendiente (no doble-submit del mismo file input).
- **CA-09.2** Fallo de disco → toast error + sin metadato huérfano (transacción lógica: blob primero o rollback de metadato).
- **CA-09.3** Éxito → toast breve (o actualización silenciosa de lista + contador; al menos un canal visible).

### HU-10 — Fuera de alcance explícito (v1)

No se implementa en esta spec (anotar para no “colarse”):

- Anexos en comentarios, checklist items, sprints, milestones, flows, automatizaciones.
- Copia de anexos al instanciar plantillas.
- OCR / transcripción / indexación semántica del contenido binario.
- Edición de imágenes in-app, streaming de video embebido avanzado.
- Sincronización multi-dispositivo más allá de “la carpeta en OneDrive/Git”.
- Compresión automática o generación de thumbnails en disco (solo object URL en sesión para imágenes).
- Export ZIP multi-parte con binarios (fase posterior opcional; ver design §8).

## 6. Migración de schema (v16 → v17)

Nuevo tipo reutilizable `Attachment` y campo `attachments: Attachment[]` (default `[]`) en:

- `Project`
- `Area`
- `Process`
- `Task`
- `Product`
- `ProcessTemplate`

Migración identidad en `projects`, `products`, `process-templates` (y cualquier kind que persista esos árboles). Detalle en `design.md` §1.

## 7. Métricas de “listo”

- [ ] Spec + design + tasks revisables sin ambigüedad de path ni de entidad.
- [ ] Implementación: `tsc --noEmit`, Vitest, lint, build OK.
- [ ] Smoke manual (`smoke.md`) en FS y en modo download.
- [ ] `graphify update .` tras el código.

## 8. Referencias de código actual (anclaje)

| Tema | Dónde |
|------|--------|
| Adapter contrato | `src/storage/StorageAdapter.ts` |
| FS bootstrap / write JSON | `src/storage/FileSystemAdapter.ts` (`bootstrap`, `writeRaw`) |
| IDB fallback | `src/storage/DownloadAdapter.ts` |
| Task / Area / Process / Project | `src/domain/schemas/project.ts` |
| Product | `src/domain/schemas/product.ts` |
| ProcessTemplate | `src/domain/schemas/checklistTemplate.ts` |
| SCHEMA_VERSION | `src/domain/schemas/common.ts` (`16`) |
| Migraciones | `src/domain/migrations.ts` |
| Drawer tarea | `src/features/projects/components/kanban/TaskDetailDrawer.tsx` |
| Toast / persist veraz | spec 040 (`useToastStore`, `withPersist`) |
| Demo / modo navegador | spec 030 |
