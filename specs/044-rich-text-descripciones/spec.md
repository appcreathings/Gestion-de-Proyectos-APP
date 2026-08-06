# Spec 044 — Formato de texto en descripciones (Markdown + toolbar)

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/044-rich-text-descripciones/` · Fecha: 2026-08-05
> Baseline al empezar: `SCHEMA_VERSION` **19** (sin bump de schema)
> Depende de: `Markdown.tsx` + `react-markdown` (ya en el proyecto); formularios con `Textarea`.
> Principios: **V** (simplicidad incremental), **IV** (diseño limpio), **II** (schema estable — reutiliza `z.string()`).

## 1. Contexto

Hoy las descripciones de tareas, proyectos, productos y procesos son **texto plano**
en un `<Textarea>`. El usuario no puede marcar negrita, cursiva ni listas de forma
guiada. Al visualizar, casi todo se muestra como texto crudo (salvo procesos en
`AreaCard`, que **ya** renderizan con `<Markdown>`).

En plantillas de proceso el label ya dice *“Descripción (Markdown)”* y el placeholder
menciona `**negrita**`, pero no hay toolbar ni preview — solo mono + texto plano.

El stack ya incluye:

| Pieza | Estado |
|-------|--------|
| `react-markdown` | dependencia |
| `src/components/Markdown.tsx` | render con prose tokens |
| Chunk Vite `vendor-markdown` | ya configurado |
| Campos `description: z.string()` | sin cambio de tipo |

## 2. Objetivo

Permitir **formatear** el texto de descripciones largas (negrita, cursiva, listas,
enlaces, código inline) mediante:

1. Una **barra de herramientas** que inserta sintaxis Markdown.
2. Un **preview** opcional (Editar | Ver).
3. **Render Markdown** consistente al mostrar (no solo en procesos).

El valor almacenado sigue siendo **string Markdown**. No hay HTML en storage.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| D1 | **Formato de almacenamiento: Markdown** en los `description` existentes (`z.string()`). | Zero migración; compatible con AI, RAG, flujos, export JSON local. |
| D2 | **Sin bump de `SCHEMA_VERSION`**. | El tipo no cambia; datos viejos son Markdown “trivial” (texto plano). |
| D3 | **Editor: Markdown + toolbar + preview**, no TipTap/Lexical en v1. | Menos deps, reusa lo que hay; suficiente para PM notes. |
| D4 | **Componente compartido** `RichTextField` (nombre tentativo) que envuelve value/onChange/onBlur y reemplaza `Textarea` en los puntos de edición. | Un solo sitio de UX/a11y. |
| D5 | **Alcance v1 = descripciones largas**: Task, Project, Product, Process (+ plantillas de proceso y project type si tienen description). | Donde el texto se lee después y puede ser largo. |
| D6 | **Fuera de v1**: comentarios de tarea, metas de sprint/trimestre, notas de checklist item, chat, campos de flujos/config. | Evitar UI densa en textos cortos; se puede reutilizar el componente después. |
| D7 | **Toolbar mínima v1**: Negrita, Cursiva, Lista con guiones, Lista numerada, Enlace, Código inline. | Cubre el 90 %; sin headings complejos ni tablas. |
| D8 | **Modo Editar / Ver** (toggle). En Editar se ve Markdown + toolbar; en Ver se renderiza con `Markdown`. | El usuario controla el preview sin librería WYSIWYG. |
| D9 | **Atajos de teclado** en el textarea: `Ctrl/Cmd+B` negrita, `Ctrl/Cmd+I` cursiva. | Productividad sin cambiar el flujo. |
| D10 | **Inserción por selección**: si hay texto seleccionado, se envuelve (`**sel**`); si no, se insertan marcadores y se coloca el cursor en medio. | Comportamiento estándar de editores Markdown ligeros. |
| D11 | **Seguridad al render**: `react-markdown` por defecto no ejecuta HTML raw; enlaces `http(s)` (comportamiento actual de `Markdown.tsx`). No se habilita `rehype-raw`. | XSS. |
| D12 | **Tono de copy: tuteo**. Labels: “Descripción”, hint sutil “Admite formato (negrita, listas…)”. | Consistencia 030/040/043. |
| D13 | **Sin dependencia npm nueva en v1** si es viable con helpers propios + `Textarea` + botones shadcn. | Principio V; si se evalúa un wrapper minúsculo después, aparte. |
| D14 | **AI Improve / tools / RAG** siguen enviando el string tal cual (Markdown). No se “limpia” a plain. | El modelo ya habla Markdown; el indexer indexa el texto con sintaxis (aceptable en v1). |
| D15 | **Process steps** (`text` / `details`) y **summary** (max 140) **no** usan el editor rico. | Campos cortos / estructurados. |

## 4. Modelo de datos

Sin cambios de schema.

```ts
// Ya existe — sin modificar el tipo:
description: z.string().default("")
```

Convención de contenido (documentar en design, no en Zod):

| Elemento | Sintaxis |
|----------|----------|
| Negrita | `**texto**` |
| Cursiva | `*texto*` o `_texto_` |
| Lista | `- item` / `1. item` |
| Enlace | `[etiqueta](https://…)` |
| Código | `` `código` `` |
| Párrafos | línea en blanco entre bloques |

## 5. Historias de usuario y criterios de aceptación

### HU-01 — Formatear descripción de tarea · **núcleo**
**Como** PM, **quiero** poner negrita/listas en la descripción de una tarea **para** resaltar criterios de aceptación.

- **CA-01.1** En `TaskFormDialog` y `TaskDetailDrawer`, el campo Descripción usa `RichTextField` (no `Textarea` plano).
- **CA-01.2** Toolbar visible con al menos: Negrita, Cursiva, Lista, Lista numerada, Enlace, Código.
- **CA-01.3** Seleccionar “aceptación” + Negrita → queda `**aceptación**` en el valor.
- **CA-01.4** `Ctrl/Cmd+B` y `Ctrl/Cmd+I` aplican negrita/cursiva.
- **CA-01.5** Toggle **Ver** muestra el render Markdown; **Editar** vuelve al texto fuente.
- **CA-01.6** Al blur/guardar, se persiste el string Markdown (mismo `onUpdate` / submit que hoy).

### HU-02 — Proyecto y producto
**Como** PM, **quiero** el mismo editor en proyecto y producto **para** no aprender dos UIs.

- **CA-02.1** `ProjectFormDialog` y `ProductFormDialog` usan `RichTextField` en description.
- **CA-02.2** `OverviewTab` renderiza `project.description` con `<Markdown>` (no texto plano).
- **CA-02.3** Texto plano legacy se ve igual que antes (sin `**`).

### HU-03 — Procesos y plantillas
**Como** PM, **quiero** toolbar en procesos (donde ya se promete Markdown) **para** no escribir sintaxis a mano.

- **CA-03.1** `ProcessEditorDialog` y `ProcessTemplateDialog` usan `RichTextField`.
- **CA-03.2** `ProjectTypeDialog` description usa `RichTextField` si el campo es descripción libre larga.
- **CA-03.3** `AreaCard` sigue mostrando con `<Markdown>` (ya implementado); sin regresión.

### HU-04 — Datos existentes y compatibilidad
**Como** usuario con proyectos viejos, **quiero** abrir la app sin migración ni pérdida de texto.

- **CA-04.1** No se incrementa `SCHEMA_VERSION`.
- **CA-04.2** Descripciones sin Markdown se muestran idénticas.
- **CA-04.3** Descripciones que ya tenían `**` (procesos) se ven formateadas en todos los viewers actualizados.

### HU-05 — Accesibilidad y teclado
**Como** usuario de teclado, **quiero** usar la toolbar y el textarea sin ratón.

- **CA-05.1** Botones de toolbar con `aria-label` y `type="button"`.
- **CA-05.2** Focus visible; el textarea mantiene `id` + `Label` asociados.
- **CA-05.3** Atajos B/I no disparan acciones globales de la app (stopPropagation / preventDefault cuando aplica).

## 6. Requisitos no funcionales

- **Sin nuevas dependencias npm** en v1 (salvo decisión explícita posterior).
- **Mobile**: toolbar en wrap horizontal o scroll-x; altura táctil razonable (~32–36px botones).
- **Performance**: sin virtualizar; descripciones típicas &lt; 10k chars.
- **Tests**: helpers de wrap/insert unitarios; smoke de render `Markdown` ya cubierto indirectamente.
- **i18n**: copy en español (tuteo).

## 7. Archivos afectados (previsto)

| Archivo | Cambio |
|---------|--------|
| **nuevo** `src/components/forms/RichTextField.tsx` | Editor + toolbar + preview |
| **nuevo** `src/lib/markdownEdit.ts` (+ test) | insertWrap, insertLinePrefix, insertLink |
| `src/components/Markdown.tsx` | Ajustes menores de estilos si faltan (énfasis, ol) |
| `TaskFormDialog.tsx` | Textarea → RichTextField |
| `TaskDetailDrawer.tsx` | description → RichTextField |
| `ProjectFormDialog.tsx` | description → RichTextField |
| `ProductFormDialog.tsx` | description → RichTextField |
| `ProcessEditorDialog.tsx` | description → RichTextField |
| `ProcessTemplateDialog.tsx` | description → RichTextField |
| `ProjectTypeDialog.tsx` | description → RichTextField |
| `OverviewTab.tsx` | render con `<Markdown>` |

**No tocar en v1:** comments, sprint/quarter goal, ItemEditor notes, flow config textareas, ChatInput.

## 8. Fuera de alcance (v1)

- WYSIWYG true (cursor sobre texto ya formateado).
- Imágenes inline, tablas, blockquotes, headings en toolbar (se pueden escribir a mano y el renderer puede mostrar lo que `react-markdown` soporte).
- Sanitización extra de URLs en el editor (sí al *abrir* links en render si se añade componente `a` custom — opcional).
- Colaboración en tiempo real / diff de Markdown.
- Comentarios con formato (candidatos a v1.1 reutilizando el mismo componente).

## 9. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Usuarios ven `**texto**` al copiar/exportar | Es el formato canónico; preview educa. |
| Toolbar no cabe en drawer estrecho | Wrap + iconos Lucide sin labels largos. |
| AI Improve reescribe Markdown “feo” | Aceptable; el prompt ya pide JSON/texto libre. |
| Doble interpretación de `_` en español | Documentar preferencia `*cursiva*`; toolbar usa `*`. |

## 10. Definición de hecho

- [x] Spec + design + tasks en esta carpeta
- [x] `RichTextField` + helpers + tests
- [x] Sustitución en todos los puntos del §7
- [x] OverviewTab con Markdown
- [x] `npm run typecheck` + `npm test` verdes
- [x] Smoke manual: tarea / proyecto / proceso (edit + preview + persist)
- [x] Estado → **IMPLEMENTADO**
