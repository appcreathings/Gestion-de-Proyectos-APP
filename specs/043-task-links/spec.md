# Spec 043 — Links en tareas (botones clickeables)

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/043-task-links/` · Fecha: 2026-08-05
> Baseline al empezar: `SCHEMA_VERSION` **18**
> Depende de: drawer de tarea unificado (013/016), UX feedback (040, toast + guardado).
> Principios: **IV** (diseño limpio y enfocado), **V** (simplicidad incremental), **II** (schema + migración).

## 1. Contexto

Las tareas tienen `description` (texto libre) y `attachments` (archivos en carpeta local).
En el día a día del PM es muy habitual necesitar **ir rápido a un recurso externo**:

- Figma / prototipo
- Ticket en Jira / Linear / GitHub
- Doc de Notion / Google Docs
- Brief en Drive
- Loom / video de contexto
- PR o deploy de staging

Hoy esas URLs se entierran en la descripción (texto plano, difíciles de clickear en móvil/tablet)
o viven fuera de Hito. No hay un sitio dedicado, ni un control grande y confiable para abrirlas.

## 2. Objetivo

Permitir **agregar, listar, abrir y eliminar links** asociados a una tarea, mostrados
**debajo de la descripción** como **botones fáciles de clickear** (no solo texto subrayado).

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| D1 | **Campo estructurado `Task.links: TaskLink[]`**, no auto-parse de la descripción. | Editable, ordenable, validable; no rompe texto libre. |
| D2 | Cada link tiene **`url` + `label` opcional**. Si `label` vacío, UI muestra hostname o URL acortada. | El PM nombra el recurso (“Mockups Figma”) sin depender del path feo. |
| D3 | **Solo `http://` y `https://`**. Se rechazan `javascript:`, `data:`, etc. | Seguridad (XSS / phishing). |
| D4 | **Normalizar al guardar**: si pegan `ejemplo.com/x` se antepone `https://`. | Menos fricción al copiar/pegar. |
| D5 | **UI principal en `TaskDetailDrawer`**, sección **Links** justo **debajo de Descripción**. | Encaja con el flujo “abro la tarea → veo contexto → salgo al recurso”. |
| D6 | Cada link es un **botón/fila ancha** (`outline` o fila con área táctil ≥ 40px) que abre en **nueva pestaña** (`target="_blank"` + `rel="noopener noreferrer"`). | “Fáciles de clickear”; no se pierde el drawer. |
| D7 | **Agregar / eliminar en v1**. Editar label/url in-place queda fuera (se borra y se vuelve a crear). | Menos UI; cubre el 90 % del uso. |
| D8 | **Máx. 20 links por tarea**. | Evita basura; suficiente para un ticket real. |
| D9 | **Badge en `TaskCard`** con contador cuando hay ≥1 link (ícono `Link` / `ExternalLink`). | Señala que hay recursos sin abrir el drawer. |
| D10 | **`SCHEMA_VERSION` 18 → 19**, migración identidad (`links: []` via default Zod). | Mismo patrón que comments/subtasks/attachments. |
| D11 | **Sin actividad / sin toasts ruidosos** al añadir un link en v1 (el drawer ya refleja el cambio; persistencia via `onUpdate` como el resto de campos). Toast solo si la URL es inválida. | Principio V; feedback inmediato en UI. |
| D12 | **Tono de copy: tuteo**. | Consistencia con 030/040/042. |
| D13 | **No se copian links al duplicar plantillas** de proceso en v1 (solo viven en `Task`). | Alcance acotado a tareas. |

## 4. Modelo de datos

```ts
export const TaskLinkSchema = z.object({
  id: Id,
  /** URL absoluta http(s) ya normalizada. */
  url: z.string().min(1),
  /** Etiqueta visible. Vacío → UI deriva hostname. */
  label: z.string().default(""),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
export type TaskLink = z.infer<typeof TaskLinkSchema>;

// En TaskSchema:
links: z.array(TaskLinkSchema).default([]),
```

Validación de URL **no** se deja solo a Zod `.url()` (es inconsistente con hosts sin TLD en tests).
Vive en un helper puro `normalizeTaskLinkUrl(raw: string): { ok: true; url: string } | { ok: false; error: string }`.

## 5. Historias de usuario y criterios de aceptación

### HU-01 — Agregar un link · **núcleo**
**Como** PM, **quiero** pegar una URL (y opcionalmente un nombre) en la tarea **para** tenerla a un clic.

- **CA-01.1** Debajo de Descripción hay una sección **Links** con contador (`Links (n)`).
- **CA-01.2** Puedo escribir URL + etiqueta opcional y pulsar **Añadir** (o Enter en el campo URL).
- **CA-01.3** URL válida se guarda en `Task.links`, aparece en la lista y se limpia el formulario.
- **CA-01.4** URL inválida o protocolo no permitido: no se guarda; mensaje inline o toast de error claro.
- **CA-01.5** Si ya hay 20 links, el formulario se deshabilita o rechaza con mensaje.
- **CA-01.6** Al pegar sin esquema (`figma.com/file/...`) se guarda como `https://figma.com/file/...`.

### HU-02 — Abrir un link con un clic grande
**Como** PM, **quiero** abrir el recurso con un botón fácil de pulsar **para** no pelearme con texto pequeño.

- **CA-02.1** Cada link se renderiza como botón/fila con área de click generosa (altura mínima ~40px).
- **CA-02.2** Muestra la etiqueta si existe; si no, el hostname (o URL truncada con ellipsis).
- **CA-02.3** Click abre la URL en **nueva pestaña** sin cerrar el drawer.
- **CA-02.4** Ícono de enlace externo visible; `title`/`aria-label` descriptivo.

### HU-03 — Eliminar un link
**Como** PM, **quiero** quitar un link obsoleto **para** no confundirme.

- **CA-03.1** Cada fila tiene control de eliminar (ícono trash) con `stopPropagation` para no abrir la URL.
- **CA-03.2** Al eliminar, desaparece de la lista y se persiste en el proyecto.
- **CA-03.3** Sin diálogo de confirmación en v1 (acción barata y reversible re-pegando la URL).

### HU-04 — Señal en la card del kanban
**Como** PM, **quiero** ver si una tarjeta tiene links **sin** abrir el drawer.

- **CA-04.1** Si `links.length > 0`, la card muestra un badge con ícono de link y el número.
- **CA-04.2** Si no hay links, no se muestra nada.

### HU-05 — Persistencia y migración
**Como** usuario con datos viejos, **quiero** que mis proyectos abran sin error tras el update.

- **CA-05.1** `SCHEMA_VERSION === 19`.
- **CA-05.2** Migración `projects` v18 → v19 identidad; tareas sin `links` pasan validación Zod con `[]`.
- **CA-05.3** `newTask()` inicializa `links: []`.
- **CA-05.4** Tests de migración actualizados al target 19.

## 6. Requisitos no funcionales

- **Sin nuevas dependencias** npm.
- **Accesibilidad**: inputs con labels; botones con nombre accesible; focus visible.
- **Mobile/tablet**: botones táctiles; el form de añadir no debe desbordar el drawer estrecho (stack vertical en anchos chicos).
- **Performance**: lista completa sin virtualizar (tope 20).

## 7. Archivos afectados (previsto)

| Archivo | Cambio |
|---------|--------|
| `src/domain/schemas/project.ts` | `TaskLinkSchema` + `links` en `TaskSchema` |
| `src/domain/schemas/common.ts` | `SCHEMA_VERSION` 18 → 19 |
| `src/domain/migrations.ts` | step projects `to: 19` |
| `src/domain/migrations.test.ts` | target 19 |
| `src/domain/factories.ts` | `links: []` en `newTask` |
| `src/lib/taskLinks.ts` (+ test) | normalizar/validar URL + display label |
| `src/features/projects/components/kanban/TaskDetailDrawer.tsx` | sección Links |
| `src/features/projects/components/kanban/TaskCard.tsx` | badge contador |

## 8. Fuera de alcance (este spec)

- Auto-detectar URLs dentro de `description` / markdown.
- Favicons remotos.
- Links en Project / Area / Process / Product.
- Reordenar links (drag).
- Edición in-place de url/label.
- Evento de actividad `task.link_added`.
- Sincronizar con anexos o con flujos de automatización.
- Previsualización embebida (iframe) de la URL.

## 9. Smoke manual (mínimo)

1. Abrir una tarea en el drawer → sección Links bajo Descripción.
2. Pegar `https://example.com` sin etiqueta → botón muestra `example.com` → click abre pestaña.
3. Pegar `github.com/org/repo` con etiqueta “Repo” → se guarda como `https://…` y el botón dice “Repo”.
4. Pegar `javascript:alert(1)` → se rechaza.
5. Eliminar un link → desaparece y al reabrir el proyecto sigue sin él.
6. Card del kanban muestra badge con el número de links.
