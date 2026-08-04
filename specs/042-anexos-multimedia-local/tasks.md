# Tasks 042 — Anexos multimedia en carpeta local

> Numeración **T4200+**. Fases verticales; cada fase deja la app usable y se verifica
> (`tsc --noEmit` + Vitest + lint; build al cerrar fase).
> `∥` = paralelizable. Cada tarea ancla a `design.md` / `spec.md`.
> Estado: **implementado A–G (código)**. Smoke manual pendiente en carpeta real.
> Baseline schema: **16** → target **17**.

## Fase A — Fundamentos puros (sin UI) · base de todo

- **T4200** Nuevo `src/domain/attachments/allowlist.ts`: `ATTACHMENT_ALLOWLIST`, `classifyFile`,
  `AttachmentKind` alineado al schema. (design §3, CA-01.4, HU-08)
- **T4201** Nuevo `src/domain/attachments/paths.ts`: `safeFileBase`, `attachmentRelativePath`,
  `assertSafeAttachmentPath`, `AttachmentParent`. (design §2, §9, CA-04.*)
- **T4202** Nuevo `src/domain/attachments/limits.ts`: `maxBytesFor(kind)`, `maxCountFor(kind)`
  (FS 25 MB/50, download 5 MB/20). (design §3.2, CA-01.4, CA-06.2)
- **T4203** Nuevo `src/lib/formatBytes.ts` (+ test). (design §7)
- **T4204** Tests Vitest: allowlist, safeBase (casos borde), paths por cada parent, reject `..`,
  límites. (CA-08.4)
- **Checkpoint A:** tests verdes; cero imports de React/storage en estos módulos.

## Fase B — Schema y migración (v17)

- **T4210** `AttachmentSchema` + tipo exportado (`domain/schemas/attachment.ts` o `common.ts`).
  (design §1.1, CA-08.3)
- **T4211** Añadir `attachments: z.array(AttachmentSchema).default([])` a Project, Area, Process,
  Task, Product, ProcessTemplate. (design §1.2, CA-01.3)
- **T4212** `SCHEMA_VERSION = 17`; migraciones identidad en `projects`, `products`,
  `process-templates`; actualizar `migrations.test.ts` (expect 17). (design §1.3–1.4)
- **T4213** Factories / demo seed: campos default sin romper seed 030. (HU-06 no regresión)
- **Checkpoint B:** `tsc` limpio; tests de migración pasan; proyecto v16 se lee como v17 con
  `attachments: []`.

## Fase C — Storage de binarios

- **T4220** Extender `StorageAdapter` con `writeBlob`, `readBlob`, `removeBlob`,
  `removeBlobTree`. (design §4.1, CA-08.1)
- **T4221** `FileSystemAdapter`: bootstrap `attachments/`; implementar los 4 métodos con
  validación de path; escritura binaria. (design §2.4, §4.2, CA-04.1)
- **T4222** `DownloadAdapter`: claves IDB `download:blob:*` + índice; mismos 4 métodos.
  (design §4.3, CA-06.1)
- **T4223** Tests de helpers de path del adapter (y/o mock del índice IDB para
  `removeBlobTree`). (CA-08.4)
- **Checkpoint C:** en dev Chromium, escribir/leer/borrar un blob de prueba vía consola o test
  de integración mínimo; en download mode, mismo contrato.

## Fase D — Operaciones de store y cascada

- **T4230** `addAttachment(parent, file)`: classify → límites → path → `writeBlob` → push
  metadato → `persist*` con `withPersist` si está disponible (040); rollback blob si falla JSON.
  (design §4.4, §5.1, CA-01.3, CA-09.2)
- **T4231** `removeAttachment` + `updateAttachmentMeta` (description; name solo label).
  (design §5.1, CA-01.5, CA-07.4)
- **T4232** Cascada: `deleteProject` / delete product / delete process-template →
  `removeBlobTree`. Borrado de task/area/process limpia su carpeta. (design §5.2, HU-05)
- **T4233** Tests de la lógica de construcción de `Attachment` y de la decisión de límites
  (mock adapter). (CA-08.4)
- **Checkpoint D:** añadir y quitar anexo a una task en memoria+adapter mock sin UI.

## Fase E — UI compartida

- **T4240** `AttachmentDropZone`: click + drag/drop + multi-file; disabled/busy.
  (design §6.1, CA-01.2, CA-09.1)
- **T4241** `AttachmentRow`: icono/thumb, bytes, fecha, menú descargar/eliminar, descripción.
  (design §6.1, CA-01.5, CA-07.3–7.4)
- **T4242** `AttachmentsSection`: filtro por kind, contador, empty state, wiring props,
  aviso modo download. (design §6.1, CA-06.3, CA-07.1–7.2)
- **T4243** Hook o helper `useAttachmentActions(parent)` que conecta store + adapter
  download/preview con revoke de object URLs. (design §6.3)
- **Checkpoint E:** Story mental / montaje temporal: la sección funciona aislada con callbacks
  mock.

## Fase F — Integración en pantallas (valor usuario)

- **T4250** `TaskDetailDrawer`: sección Anexos (HU-01 completa + smoke drawer).
  (CA-01.*)
- **T4251** Proyecto: overview / card Anexos (HU-02.1).
- **T4252** Área: formulario o detalle (HU-02.2).
- **T4253** Proceso: editor de proceso (HU-02.3).
- **T4254** Producto (HU-03.1).
- **T4255** Plantilla de proceso en Biblioteca + copy de ayuda “no se copian al instanciar”
  (HU-03.2–03.3).
- **T4256** ConfirmDialog al eliminar; toasts éxito/error. (CA-01.5, CA-09.3)
- **Checkpoint F:** smoke.md HU-01 → HU-03 en carpeta local real.

## Fase G — Export, mensajes, polish, docs

- **T4260** Aviso al `exportAll` / UI de Ajustes si hay anexos y no van en el JSON.
  (design §8, D6)
- **T4261** Mensaje “archivo no encontrado” al fallar `readBlob` (import incompleto).
  (design §8)
- **T4262** (Opcional) `backup()` FS copia también árbol `attachments/` al stamp.
  (design §8)
- **T4263** Nota breve en docs in-house o Ajustes: estructura de carpetas.
  (design §0 G)
- **T4264** `smoke.md` ejecutado; `graphify update .`.
- **Checkpoint G:** feature cerrada para merge; fuera de alcance v1 respetado (HU-10).

---

## Orden sugerido de PRs

1. **PR1** Fases A+B (schema + puras) — riesgo bajo, desbloquea.  
2. **PR2** Fase C+D (storage + store) — contrato binario.  
3. **PR3** Fase E+F T4250 (UI + tareas) — primer valor visible.  
4. **PR4** Resto F + G.

## Criterios de cierre globales

- [ ] Allowlist y límites documentados coinciden con código.
- [ ] Árbol `attachments/` navegable a mano en FS.
- [ ] No quedan blobs al borrar proyecto (verificado en carpeta).
- [ ] Modo download no rompe demo 030.
- [ ] Cero acceso FS Access API desde `features/**` (solo adapter).
- [ ] Tests + typecheck + lint + build.
