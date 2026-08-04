# Design 042 — Anexos multimedia en carpeta local

> Decisiones técnicas para `spec.md`. Ancladas al storage y schemas actuales (`SCHEMA_VERSION` 16).
> Introduce **binarios** por primera vez en el contrato de `StorageAdapter` y un árbol
> `attachments/` navegable al lado de las colecciones JSON.

## 0. Mapa de archivos tocados (previsto)

| Área | Archivos | Naturaleza |
|------|----------|------------|
| A · Schema + migración | `domain/schemas/common.ts` (o **nuevo** `attachment.ts`), `project.ts`, `product.ts`, `checklistTemplate.ts`, `schemas/index.ts`, `migrations.ts`, `migrations.test.ts`, factories | `Attachment` + `attachments[]`, v17 |
| B · Contrato storage | `storage/StorageAdapter.ts`, `FileSystemAdapter.ts`, `DownloadAdapter.ts`, tests de adapters | API de blobs + bootstrap `attachments/` |
| C · Paths y validación (puras) | **nuevo** `domain/attachments/paths.ts`, `allowlist.ts`, `format.ts` + tests | path, safe name, kind, límites |
| D · Store / ops | `store/useDataStore.ts` (o **nuevo** `store/attachmentOps.ts`), `domain/projectOps.ts` si la cascada vive ahí | add/remove attachment + cascade delete |
| E · UI compartida | **nuevo** `components/attachments/AttachmentsSection.tsx`, `AttachmentRow.tsx`, `AttachmentDropZone.tsx`, `lib/formatBytes.ts` | una sola superficie |
| F · Integración pantallas | `TaskDetailDrawer.tsx`, detalle/proyecto, área, proceso, producto, plantilla proceso | montar sección |
| G · Docs in-app (opcional) | `features/docs/**` o nota en Ajustes | “cómo se guardan los anexos” |

**Sin cambios de comportamiento** en: motor de flujos, integraciones, RAG (más allá de metadatos ya en JSON), kanban DnD, comments.

---

## 1. Schema

### 1.1 `Attachment` (nuevo)

Preferible en `src/domain/schemas/attachment.ts` (o bloque en `common.ts` si se quiere un archivo menos):

```ts
export const AttachmentKind = z.enum([
  "image",
  "document",
  "video",
  "audio",
  "archive",
]);
export type AttachmentKind = z.infer<typeof AttachmentKind>;

export const AttachmentSchema = z.object({
  id: Id,
  /** Nombre original mostrado en UI (p.ej. "Acta kickoff.pdf"). */
  name: z.string().min(1),
  /** Extensión normalizada sin punto: "pdf", "png". */
  ext: z.string().min(1),
  mimeType: z.string().default("application/octet-stream"),
  kind: AttachmentKind,
  /** Bytes del archivo. */
  size: z.number().int().nonnegative(),
  /**
   * Ruta relativa a la raíz del workspace, con `/` como separador.
   * Ej: "attachments/projects/<projectId>/tasks/<taskId>/<id>__acta-kickoff.pdf"
   * En DownloadAdapter es la clave lógica del blob (mismo string).
   */
  relativePath: z.string().min(1),
  description: z.string().default(""),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
export type Attachment = z.infer<typeof AttachmentSchema>;
```

### 1.2 Campos en entidades

```ts
// ProjectSchema
attachments: z.array(AttachmentSchema).default([]),

// AreaSchema
attachments: z.array(AttachmentSchema).default([]),

// ProcessSchema
attachments: z.array(AttachmentSchema).default([]),

// TaskSchema
attachments: z.array(AttachmentSchema).default([]),

// ProductSchema
attachments: z.array(AttachmentSchema).default([]),

// ProcessTemplateSchema
attachments: z.array(AttachmentSchema).default([]),
```

`ChecklistTemplate` **no** lleva anexos en v1 (solo process templates, que suelen ser SOPs con material).

### 1.3 `SCHEMA_VERSION` 16 → 17

```ts
// common.ts
export const SCHEMA_VERSION = 17;
```

### 1.4 Migraciones

```ts
// migrations.ts — identidad, documentar el bump
projects: [
  // ...existentes...
  // v16 -> v17 (spec 042): Project/Area/Process/Task.attachments
  { to: 17, up: (data) => data },
],
products: [
  { to: 17, up: (data) => data },
],
"process-templates": [
  { to: 17, up: (data) => data },
],
```

Zod `.default([])` cubre registros viejos sin el campo. Actualizar `migrations.test.ts` para el target 17 (el test que hoy espera 16).

### 1.5 Por qué no colección global `attachments/*.json`

Alternativa descartada: una colección `attachments` con filas independientes y FK a entidad.

- **Pros:** un solo índice, query “todos los anexos del workspace”.
- **Contras:** rompe el modelo actual “proyecto = un archivo”; export por proyecto se complica; borrar proyecto exige escanear otra colección.

**Elegido:** metadatos embebidos (como `comments` / `subtasks`) + bytes fuera. Un “explorador global” futuro puede escanear proyectos en memoria.

---

## 2. Árbol en disco (FileSystemAdapter)

### 2.1 Layout

```
<workspace-root>/
  workspace.json
  projects/
    <projectId>.json          # incluye attachments[] en project, areas, processes, tasks
  products/
    <productId>.json
  process-templates/
    <templateId>.json
  ...
  attachments/                # NUEVO — bootstrap
    projects/
      <projectId>/
        project/
          <attachmentId>__<safeBase>.<ext>
        areas/
          <areaId>/
            <attachmentId>__<safeBase>.<ext>
        processes/
          <processId>/
            <attachmentId>__<safeBase>.<ext>
        tasks/
          <taskId>/
            <attachmentId>__<safeBase>.<ext>
    products/
      <productId>/
        <attachmentId>__<safeBase>.<ext>
    process-templates/
      <templateId>/
        <attachmentId>__<safeBase>.<ext>
```

**Por qué este layout**

1. Un solo proyecto = un subárbol; borrar proyecto = `removeEntry(projectId, { recursive: true })` bajo `attachments/projects/`.
2. El usuario puede abrir `attachments/projects/<id>/tasks/...` y ver evidencia sin parsear JSON.
3. IDs estables evitan renombrar carpetas cuando cambia el título de la tarea.
4. Prefijo `<attachmentId>__` garantiza unicidad aunque dos PDFs se llamen igual.

### 2.2 `safeBase`

Función pura:

```ts
/** "Acta Kickoff (final).PDF" → "acta-kickoff-final" (max 60 chars, sin ext) */
export function safeFileBase(originalName: string): string
```

Reglas:

- Quitar extensión.
- NFD + strip diacríticos opcional o mapear a ASCII simple.
- Reemplazar todo lo que no sea `[a-zA-Z0-9._-]` por `-`.
- Colapsar guiones; trim; si queda vacío → `file`.
- Truncar a 60 caracteres.

Nombre en disco:

```ts
`${attachmentId}__${safeFileBase(name)}.${ext}`
```

### 2.3 Resolución de `relativePath`

```ts
export type AttachmentParent =
  | { type: "project"; projectId: string }
  | { type: "area"; projectId: string; areaId: string }
  | { type: "process"; projectId: string; processId: string }
  | { type: "task"; projectId: string; taskId: string }
  | { type: "product"; productId: string }
  | { type: "processTemplate"; templateId: string };

export function attachmentRelativePath(
  parent: AttachmentParent,
  attachmentId: string,
  safeBase: string,
  ext: string,
): string
```

Siempre con `/` (no `\`), sin `..`, sin absolutos. Validar al leer metadatos viejos: si `relativePath` no empieza por `attachments/`, rechazar operaciones de blob.

### 2.4 Bootstrap

En `FileSystemAdapter.bootstrap()`:

```ts
await root.getDirectoryHandle("attachments", { create: true });
// No hace falta precrear projects/products: se crean al primer writeBlob
```

---

## 3. Allowlist, kind y límites

### 3.1 Mapa extensión → kind + mime fallback

```ts
export const ATTACHMENT_ALLOWLIST: Record<string, { kind: AttachmentKind; mime: string }> = {
  png:  { kind: "image", mime: "image/png" },
  jpg:  { kind: "image", mime: "image/jpeg" },
  jpeg: { kind: "image", mime: "image/jpeg" },
  webp: { kind: "image", mime: "image/webp" },
  gif:  { kind: "image", mime: "image/gif" },
  svg:  { kind: "image", mime: "image/svg+xml" },
  pdf:  { kind: "document", mime: "application/pdf" },
  txt:  { kind: "document", mime: "text/plain" },
  md:   { kind: "document", mime: "text/markdown" },
  csv:  { kind: "document", mime: "text/csv" },
  doc:  { kind: "document", mime: "application/msword" },
  docx: { kind: "document", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  xls:  { kind: "document", mime: "application/vnd.ms-excel" },
  xlsx: { kind: "document", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  ppt:  { kind: "document", mime: "application/vnd.ms-powerpoint" },
  pptx: { kind: "document", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
  mp4:  { kind: "video", mime: "video/mp4" },
  webm: { kind: "video", mime: "video/webm" },
  mov:  { kind: "video", mime: "video/quicktime" },
  mp3:  { kind: "audio", mime: "audio/mpeg" },
  wav:  { kind: "audio", mime: "audio/wav" },
  ogg:  { kind: "audio", mime: "audio/ogg" },
  m4a:  { kind: "audio", mime: "audio/mp4" },
  zip:  { kind: "archive", mime: "application/zip" },
};
```

```ts
export function classifyFile(file: File): 
  | { ok: true; ext: string; kind: AttachmentKind; mimeType: string }
  | { ok: false; reason: string }
```

### 3.2 Límites

| Modo | Max por archivo | Max por entidad | Notas |
|------|-----------------|-----------------|-------|
| `filesystem` | 25 × 1024 × 1024 | 50 | Configurable en un solo módulo `limits.ts` |
| `download` | 5 × 1024 × 1024 | 20 | Cupo más bajo por IDB |

Constantes exportadas; la UI y el store leen del adapter `kind`.

### 3.3 SVG

SVG puede ser vector malicioso en contextos web. En v1:

- Se permite adjuntar y descargar.
- Preview: **no** `dangerouslySetInnerHTML`; usar `<img src={blobUrl}>` (el motor trata SVG como imagen) o solo icono + descarga si se prefiere más estricto.
- Decisión: **`<img>` con object URL** para thumbnails; no inline SVG en DOM.

---

## 4. Contrato `StorageAdapter` — binarios

### 4.1 Nuevos métodos

```ts
export interface StorageAdapter {
  // ... métodos actuales ...

  /**
   * Escribe bytes en `relativePath` (bajo la raíz del workspace / clave IDB).
   * Crea directorios intermedios en filesystem.
   * `data` es ArrayBuffer | Blob | Uint8Array.
   */
  writeBlob(relativePath: string, data: Blob | ArrayBuffer | Uint8Array): Promise<void>;

  /** Lee bytes; lanza si no existe. */
  readBlob(relativePath: string): Promise<Blob>;

  /** Elimina un archivo; no-op si no existe. */
  removeBlob(relativePath: string): Promise<void>;

  /**
   * Elimina un prefijo de directorio (p.ej. "attachments/projects/<id>").
   * En FS: removeEntry recursive del último segmento.
   * En download: borra todas las claves IDB con ese prefijo.
   */
  removeBlobTree(relativePrefix: string): Promise<void>;
}
```

### 4.2 FileSystemAdapter

- Parsear `relativePath` en segmentos; partir del `root`; `getDirectoryHandle(seg, { create })` hasta el penúltimo; `getFileHandle` + `createWritable` + `write(blob)`.
- **Rechazar** paths con `..`, absolutos, o que no empiecen por `attachments/`.
- `removeBlobTree`: obtener handle del directorio y `removeEntry(name, { recursive: true })` desde el padre.
- Extender `writeRaw` o añadir `writeBinary` que acepte `BufferSource | Blob`.

### 4.3 DownloadAdapter

```ts
const BLOB_KEY = (path: string) => `download:blob:${path}`;
const BLOB_INDEX = "download:blob-index"; // string[] de paths, para removeBlobTree y depuración
```

- `writeBlob` → `idbSet(BLOB_KEY(path), blob)` + actualizar índice.
- `readBlob` → `idbGet` o throw.
- `removeBlobTree` → filtrar índice por `startsWith(prefix)`.
- `exportAll` **no** incluye blobs en v1 (igual que la decisión D6). Opcional: método futuro `exportAllWithBlobs`.

### 4.4 Orden de escritura (anti-huérfanos de metadatos)

Al **añadir** un anexo:

1. Validar allowlist + tamaño + cupo de entidad.
2. Generar `id`, `relativePath`, metadato completo.
3. `await writeBlob(relativePath, file)`.
4. Si OK → mutar entidad (`attachments` + `updatedAt`) y `persist*` vía `withPersist` (040).
5. Si (4) falla → `removeBlob(relativePath)` best-effort + toast (revertir no deja basura… o al revés: si se prefiere no perder el archivo, dejar blob y toast “metadato no guardado; reintenta”).  
   **Elegido:** blob primero; si falla persist JSON, intentar borrar blob y toast de error (estado consistente: o ambos o ninguno).

Al **eliminar** un anexo:

1. Quitar de array en entidad y persistir.
2. `removeBlob` best-effort (si el archivo ya no está, OK).

Al **borrar proyecto**:

1. Borrar JSON del proyecto (flujo actual).
2. `removeBlobTree(\`attachments/projects/${id}\`)`.

---

## 5. Capa de dominio / store

### 5.1 API pública sugerida en `useDataStore` (o `attachmentOps`)

```ts
addAttachment(parent: AttachmentParent, file: File): Promise<Attachment>
removeAttachment(parent: AttachmentParent, attachmentId: string): Promise<void>
updateAttachmentMeta(parent: AttachmentParent, attachmentId: string, patch: { description?: string; name?: string }): Promise<void>
// name rename solo UI label — no renombra el archivo en disco en v1 (relativePath inmutable)
```

Helpers internos:

```ts
function getAttachments(parent, state): Attachment[]
function setAttachments(parent, next, state): /* muta Project | Product | ProcessTemplate */
```

Para `area` / `process` / `task`, el store ya tiene el `projectId` en contexto de las pantallas; la firma `AttachmentParent` lo hace explícito.

### 5.2 Cascada en deletes existentes

| Acción actual | Extensión |
|---------------|-----------|
| `deleteProject` | + `removeBlobTree(attachments/projects/id)` |
| `updateProject` que filtra tasks | al borrar task en UI, llamar `removeAttachment` N veces o `removeBlobTree(.../tasks/taskId)` + filtrar array |
| `deleteProduct` | + tree products |
| `deleteProcessTemplate` | + tree process-templates |

Preferir **una función** `purgeAttachmentsForParent(parent)` usada por deletes.

### 5.3 Activity log (opcional v1)

Si el log de actividad ya registra comentarios, añadir:

- `attachment.added` / `attachment.removed` con nombre de archivo.

Si complica el scope, **diferir** a fase F opcional; no bloquea HUs principales.

---

## 6. UI

### 6.1 `AttachmentsSection`

Props:

```ts
interface AttachmentsSectionProps {
  parent: AttachmentParent;
  attachments: Attachment[];
  /** true mientras el store escribe */
  busy?: boolean;
  disabled?: boolean;
  onAdd: (files: FileList | File[]) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
  onUpdateDescription: (id: string, description: string) => Promise<void>;
  onDownload: (attachment: Attachment) => Promise<void>;
  adapterKind: "filesystem" | "download";
  maxBytes: number;
  maxCount: number;
}
```

Layout:

1. Cabecera: “Anexos (N)” + filtro chip por kind.
2. `AttachmentDropZone`: borde dashed, “Arrastra archivos aquí o elige…”, input `multiple` hidden.
3. Lista `AttachmentRow`:
   - icono Lucide por kind (`FileImage`, `FileText`, `Film`, `Music`, `FileArchive`)
   - thumb 40×40 si `kind === "image"` (object URL con revoke al unmount)
   - nombre, `formatBytes(size)`, fecha corta
   - menú: Descargar, Eliminar; descripción en línea expandible
4. Empty state: una línea (“Aún no hay anexos — adjunta PDFs, capturas o videos cortos.”)

### 6.2 Dónde montar

| Superficie | Ubicación UX |
|------------|--------------|
| Tarea | `TaskDetailDrawer` — sección debajo de subtareas / antes o después de comentarios |
| Proyecto | `ProjectDetailPage` — bloque en overview o pestaña “Anexos” si ya hay tabs; si no, card en cabecera inferior |
| Área | `AreaFormDialog` o panel de detalle de área en `AreasTab` — sección al final del formulario / card expandida |
| Proceso | `ProcessEditorDialog` (o equivalente) — al final del editor de pasos |
| Producto | `ProductFormDialog` / página de producto |
| Plantilla proceso | diálogo de plantilla en Biblioteca |

Reutilizar el patrón visual de “Comentarios” del drawer (lista + input) para coherencia.

### 6.3 Download / open

```ts
async function downloadAttachment(adapter, att: Attachment) {
  const blob = await adapter.readBlob(att.relativePath);
  const url = URL.createObjectURL(blob);
  // <a download={att.name} href={url}> o window.open para preview PDF/imagen
  // revokeObjectURL tras delay
}
```

### 6.4 Confirmación al borrar

Usar `ConfirmDialog` existente (spec 040 pending-aware si ya está): “¿Eliminar «Acta.pdf»? Se borrará del disco / de este navegador.”

### 6.5 Accesibilidad

- Drop zone: `role="button"` + teclado (Enter abre picker) o label asociado al input file.
- Lista con nombres accesibles; botones con `aria-label`.
- Toasts de error/éxito vía canal 040.

---

## 7. Formato de tamaños y fechas

```ts
// lib/formatBytes.ts
export function formatBytes(n: number): string // "1.2 MB", "340 KB", "12 B"
```

Fechas: reutilizar helpers de `lib/dates.ts` / etiquetas relativas si existen; si no, `toLocaleDateString` corto.

---

## 8. Export / import / backup

| Operación | Comportamiento v1 |
|-----------|-------------------|
| Carpeta FS + OneDrive/Git | Usuario copia/respalda la carpeta entera → JSON + `attachments/` viajan juntos. **Este es el camino feliz.** |
| `exportAll()` | Sigue siendo JSON de entidades (metadatos de anexos incluidos, **sin** bytes). |
| UI al exportar | Si alguna entidad tiene `attachments.length > 0` y `kind === "filesystem"`, toast/info: “El JSON no incluye los archivos; respalda también la carpeta `attachments/`.” |
| `importAll` | Restaura metadatos; los `relativePath` pueden quedar rotos si no se copió `attachments/` — UI al abrir anexo: “Archivo no encontrado en disco”. |
| `backup()` FS | Hoy copia `snapshot.json` de exportAll. **Mejora opcional fase G:** además copiar árbol attachments al stamp de `.backups/`. No bloqueante para MVP de HUs 01–06. |
| DownloadAdapter export | Igual aviso; fase posterior puede añadir ZIP. |

---

## 9. Seguridad de paths

Toda entrada a `writeBlob` / `readBlob` / `removeBlob`:

1. Normalizar `\` → `/`.
2. Split por `/`; rechazar `""`, `.`, `..`.
3. Debe empezar por `attachments`.
4. Longitud total path < 512 chars.
5. `attachmentId` y segmentos de entidad: solo de IDs generados por la app (uuid), no input libre de path.

---

## 10. Pruebas (puras, Node)

Sin jsdom (como el resto del repo):

| Módulo | Casos |
|--------|-------|
| `safeFileBase` | acentos, espacios, vacío, muy largo, path-like `../x` |
| `classifyFile` | ext ok/fail, mime vacío, mayúsculas `.PDF` |
| `attachmentRelativePath` | cada `AttachmentParent` type |
| `assertSafeAttachmentPath` | `..`, absoluto, sin prefijo |
| límites | 25MB vs 5MB según kind simulado |
| migración | project v16 → v17 con `attachments` default |

Adapters: tests con mocks de IDB / o tests de lógica de path en helpers extraídos del adapter si el FS real no es testeable en Node.

---

## 11. Secuencia de implementación recomendada

1. Puras (paths, allowlist, format) + tests.  
2. Schema + migración + factories.  
3. Storage blob API + bootstrap.  
4. Ops store + cascada deletes.  
5. UI `AttachmentsSection`.  
6. Montar en Task drawer (HU-01) → smoke.  
7. Resto de superficies (HU-02, HU-03).  
8. Mensajes export + polish límites demo (HU-06, §8).

---

## 12. Decisiones abiertas diferidas (no bloquean)

- ¿Pestaña global “Archivos del workspace”? → v2.
- ¿Copiar anexos de plantilla al instanciar? → v2 con opt-in.
- ¿Thumbnails persistidos en disco? → solo si el coste de re-decode molesta.
- ¿Dependencia JSZip para export completo? → solo si usuarios en modo download lo piden.
