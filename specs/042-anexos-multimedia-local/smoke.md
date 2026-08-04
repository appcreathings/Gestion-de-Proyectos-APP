# Smoke 042 — Anexos multimedia local

> Checklist manual post-implementación. Dos pasadas: **carpeta local (Chromium)** y **modo
> navegador / demo** (o Firefox, o Chromium sin carpeta).

## Precondiciones

- [ ] Build/dev server OK.
- [ ] Hay al menos un proyecto con un área, un proceso y una tarea.
- [ ] (FS) Carpeta de workspace conectada y visible en el Explorador.

## A · Tarea (HU-01)

1. Abrir detalle de una tarea.
2. [ ] Se ve la sección **Anexos (0)**.
3. Adjuntar un PNG pequeño (< 1 MB) por botón.
4. [ ] Aparece en la lista con miniatura; contador = 1.
5. [ ] En FS: el archivo existe bajo  
   `attachments/projects/<projectId>/tasks/<taskId>/`.
6. Adjuntar un PDF por drag-and-drop.
7. [ ] Lista muestra ambos; filtro “Documentos” deja solo el PDF.
8. Descargar el PDF.
9. [ ] Se descarga con el nombre original.
10. Intentar un `.exe` o extensión no permitida.
11. [ ] Error claro; lista sin cambios.
12. Intentar un archivo > límite del modo.
13. [ ] Error de tamaño; sin metadato fantasma.
14. Eliminar el PNG (confirmar).
15. [ ] Sale de la lista; en FS el archivo ya no está.

## B · Proyecto / área / proceso (HU-02)

1. [ ] Anexar un MD al **proyecto**; path bajo `.../project/`.
2. [ ] Anexar una imagen a un **área**; path bajo `.../areas/<areaId>/`.
3. [ ] Anexar un PDF a un **proceso**; path bajo `.../processes/<processId>/`.
4. [ ] Filtros y descripción editable funcionan en al menos una superficie.

## C · Producto y plantilla (HU-03)

1. [ ] Anexar asset al **producto** → `attachments/products/<id>/`.
2. [ ] Anexar PDF a **plantilla de proceso** → `attachments/process-templates/<id>/`.
3. [ ] Texto de ayuda visible: no se copian al instanciar (v1).

## D · Cascada (HU-05)

1. Crear proyecto temporal, anexar 1 archivo a una tarea.
2. Borrar el proyecto.
3. [ ] Desaparece `attachments/projects/<id>/` completo (o no quedan archivos bajo ese id).

## E · Modo download / demo (HU-06)

1. Sin carpeta (o DownloadAdapter).
2. [ ] Se puede anexar archivo ≤ 5 MB.
3. [ ] Aviso de “solo en este navegador” visible.
4. [ ] Archivo > 5 MB rechazado.
5. Recargar la app.
6. [ ] Metadato y blob siguen (IDB) hasta limpiar datos del sitio.

## F · Export (design §8)

1. Con anexos presentes, exportar JSON desde Ajustes.
2. [ ] Aviso de que los binarios no van en el JSON (FS).
3. [ ] El JSON de la entidad sí lista `attachments` con `relativePath`.

## G · Regresiones rápidas

1. [ ] Comentarios y subtareas del drawer siguen OK.
2. [ ] Kanban drag-and-drop intacto.
3. [ ] Demo seed (030) carga sin error de schema.
4. [ ] Toast / WorkspaceStatus (040) no rompen al fallar un write de blob (simular si se puede).

## Resultado

| Pasada | Fecha | OK / FAIL | Notas |
|--------|-------|-----------|-------|
| FS Chromium | | | |
| Download/demo | | | |
