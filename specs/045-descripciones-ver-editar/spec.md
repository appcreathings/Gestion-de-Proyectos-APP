# Spec 045 — Enlaces que funcionan + Ver por defecto con lápiz de edición

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/045-descripciones-ver-editar/` · Fecha: 2026-08-10
> Baseline al empezar: `SCHEMA_VERSION` **19** (sin bump de schema)
> Depende de: Spec 044 (`RichTextField`, `src/lib/markdownEdit.ts`) — **ya implementada**; Spec 043 (`normalizeTaskLinkUrl` en `src/lib/taskLinks.ts`).
> Principios: **V** (simplicidad incremental), **IV** (diseño limpio), **II** (schema estable — sin cambios).

## 1. Contexto

La spec 044 dejó `RichTextField` (`src/components/forms/RichTextField.tsx`) funcionando con
toolbar + preview, pero con dos deudas reales:

1. **`tasks.md` de la 044 quedó con `E2 Smoke manual` sin marcar** — nadie verificó a mano
   el flujo de insertar un enlace en el navegador.
2. El componente siempre arranca en modo **Editar** (`useState<Mode>("edit")`,
   `RichTextField.tsx:67`), mostrando la toolbar completa incluso al solo *leer* una
   descripción ya escrita (p. ej. abrir el drawer de una tarea con descripción existente).

**Root cause confirmado del bug de enlaces** (leído en código, no es hipótesis): en
`RichTextField.tsx`, `applyLink()` inserta `linkUrl.trim()` **tal cual**, sin normalizar
protocolo:

```tsx
function applyLink() {
  const url = linkUrl.trim();
  if (!url) return;
  apply(insertLink(value, linkSelRef.current, url));
  closeLinkPopover();
}
```

Si el usuario escribe `notion.so/doc` (sin `https://`), el Markdown insertado es
`[texto](notion.so/doc)`. Al renderizar con `react-markdown`
(`src/components/Markdown.tsx`), eso produce `<a href="notion.so/doc">`, que el navegador
resuelve como **URL relativa** (navega dentro de la SPA, no abre el sitio externo) — el
enlace "no funciona". El `Input` tiene `type="url"` pero nunca se llama
`reportValidity()`/`checkValidity()`, así que cualquier texto no vacío se inserta sin
validar. Tampoco hay normalización de protocolo ni mensaje de error.

**Esto ya se resolvió una vez** en spec 043 (links de tarea) con
`normalizeTaskLinkUrl()` (`src/lib/taskLinks.ts:16`): antepone `https://` si falta esquema,
valida que sea `http`/`https`, rechaza el resto (incluido `javascript:`), y devuelve la URL
normalizada (`.href`). El `design.md` de la 044 (§2.3) ya recomendaba reusarlo para el
editor de descripciones — **no se hizo**. Esta spec cierra esa deuda.

Sobre el modo de vista: hoy los 7 puntos de uso de `RichTextField` (Task, Project, Product,
Process, ProcessTemplate, ProjectType, TaskDetailDrawer) arrancan todos en Editar. Ninguno
pasa `showPreviewToggle={false}`.

## 2. Objetivo

1. **Arreglar la inserción de enlaces** para que el URL resultante siempre sea válido y
   abra correctamente, reusando `normalizeTaskLinkUrl`.
2. **Cambiar el estado inicial** de `RichTextField`:
   - `value` no vacío al montar → arranca en **Ver** (Markdown renderizado) + un ícono de
     lápiz pequeño para pasar a Editar.
   - `value` vacío al montar → arranca directo en **Editar** (no tiene sentido mostrar
     "Sin contenido" + tener que hacer clic antes de poder escribir en un formulario nuevo).
3. En modo Ver, la toolbar completa **no se muestra**; solo el botón de lápiz. Al hacer
   clic, pasa a Editar y ahí sí aparece la toolbar completa (Negrita, Cursiva, Listas,
   Enlace, Código) **con las pestañas Editar/Ver ya existentes** para volver a Ver
   manualmente — esa mecánica de vuelta no cambia.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| D1 | El fix de enlaces **reusa `normalizeTaskLinkUrl()`** de `src/lib/taskLinks.ts`. No duplicar lógica de normalización/validación. | Ya resuelto una vez en spec 043; mismo nivel de seguridad (rechaza `javascript:` y esquemas no-http). |
| D2 | Si la URL no es válida, se muestra el `error` que devuelve `normalizeTaskLinkUrl` **inline en el popover** (texto bajo el input), **no se inserta nada** y el popover **queda abierto** para corregir. | Feedback claro; consistente con el patrón de error de task-links. |
| D3 | URL válida → se inserta `parsed.href` (normalizado, con protocolo), no el texto crudo del input. | Evita relativos rotos y dobles-prefijos. |
| D4 | Estado inicial de `mode`: `value.trim().length > 0 ? "preview" : "edit"`, calculado en el **initializer** de `useState` (lazy init), no en un `useEffect`. | Evita parpadeo (flash) de Editar→Ver en el primer render. |
| D5 | En modo Ver (`preview`) con `showPreviewToggle` activo, la toolbar se **colapsa a un único botón** de lápiz (`aria-label="Editar descripción"`), sin botones de formato deshabilitados ni pestaña "Ver" visible (ya estás en Ver). | Menos ruido visual en modo lectura; cumple el pedido literal ("pequeño ícono de lápiz"). |
| D6 | Click en el lápiz → `mode = "edit"`; aparece la toolbar completa **igual que hoy** (Negrita/Cursiva/Listas/Enlace/Código + pestañas Editar\|Ver). **Volver a Ver es manual** vía la pestaña "Ver" existente — **no** hay auto-colapso al perder foco. | Decisión confirmada con el usuario: menor riesgo, no toca la lógica de guardado en `onBlur` del drawer de tareas (spec 044 §3.5). |
| D7 | El mecanismo existente "`onBlur` del padre se invoca también al pasar a preview" (044, `switchMode`) **se mantiene intacto** — sigue siendo necesario para persistir en `TaskDetailDrawer` cuando el usuario vuelve a Ver desde la pestaña. | No romper el guardado ya validado en 044. |
| D8 | Si el padre remonta el campo al cambiar de entidad (p. ej. `key={task.id}` en `TaskDetailDrawer`), el modo inicial se recalcula solo — comportamiento ya soportado por el patrón `key` documentado en 044. | Sin cambios en ese contrato. |
| D9 | Alcance: **mismos 7 puntos de uso que la 044** (`TaskFormDialog`, `TaskDetailDrawer`, `ProjectFormDialog`, `ProductFormDialog`, `ProcessEditorDialog`, `ProcessTemplateDialog`, `ProjectTypeDialog`). Ninguno pasa hoy `showPreviewToggle={false}`; si en el futuro alguno lo hiciera, ese caso simplemente no muestra lápiz ni colapsa nada (queda como estaba: sin toggle, sin preview). | Verificado por grep — no hay callers con `showPreviewToggle={false}` hoy. |
| D10 | **Sin dependencias npm nuevas.** Sin cambios de schema/migración. | Principios II y V. |
| D11 | Copy en tuteo/español, reusando los mensajes de error ya redactados en `normalizeTaskLinkUrl` ("Esa URL no es válida.", "Solo se permiten links http o https.", "Pega una URL."). | Consistencia con task-links; cero copy nuevo que inventar. |

## 4. Historias de usuario y criterios de aceptación

### HU-01 — Insertar un enlace funciona siempre · **núcleo**

**Como** PM, **quiero** que el enlace que inserto en una descripción abra el sitio correcto
**para** no tener links rotos en mis notas.

- **CA-01.1** Escribir `example.com` (sin protocolo) en el popover de enlace → se inserta
  `[texto](https://example.com/)`; al pasar a Ver, el link abre `https://example.com/` en
  pestaña nueva.
- **CA-01.2** Escribir una URL con protocolo ya presente (`http://` o `https://`) → se
  conserva ese esquema, sin duplicar prefijo.
- **CA-01.3** Escribir algo inválido (vacío tras trim, o un esquema no-http como
  `javascript:alert(1)`) → aparece el mensaje de error de `normalizeTaskLinkUrl` bajo el
  input, no se inserta nada, el popover sigue abierto.
- **CA-01.4** Con texto seleccionado (ej. "aceptación") + URL válida → el resultado es
  `[aceptación](https://…)`. Sin selección → `[texto](https://…)` con "texto" seleccionado
  para que el usuario lo reemplace escribiendo (comportamiento ya existente de
  `insertLink`, sin cambios).
- **CA-01.5** El botón "Insertar" se deshabilita mientras el campo de URL esté vacío
  (comportamiento ya existente); el error solo aparece tras intentar insertar con un valor
  no vacío pero inválido.

### HU-02 — Ver por defecto, lápiz para editar

**Como** usuario que abre una tarea/proyecto/proceso con descripción ya escrita, **quiero**
ver el texto formateado de entrada, sin la toolbar encima, **para** leer más limpio.

- **CA-02.1** Abrir `TaskDetailDrawer` de una tarea con `description` no vacía → el campo
  muestra el render Markdown (`<Markdown>`) y **un solo botón de lápiz**, sin toolbar de
  formato ni pestañas Editar/Ver.
- **CA-02.2** Click en el lápiz → aparece la toolbar completa + textarea (modo Editar) con
  el valor intacto y el foco en el textarea.
- **CA-02.3** Crear una tarea nueva (`description` vacía) en `TaskFormDialog` → el campo
  abre **directo en modo Editar** (toolbar completa visible desde el inicio), sin pasar
  por un "Ver" vacío.
- **CA-02.4** Dentro de Editar, click en la pestaña "Ver" existente → vuelve a preview +
  lápiz (comportamiento D8 de la 044, sin regresión).
- **CA-02.5** No hay regresión en el guardado por `onBlur` de `TaskDetailDrawer` al pasar
  de Editar a Ver vía la pestaña.
- **CA-02.6** Mismo comportamiento en los 7 puntos de uso listados en D9.

### HU-03 — Accesibilidad del lápiz

- **CA-03.1** El botón de lápiz tiene `aria-label="Editar descripción"` y `type="button"`.
- **CA-03.2** Es alcanzable por teclado (`Tab` + `Enter`/`Space`) y tiene foco visible.

## 5. Requisitos no funcionales

- Sin nuevas dependencias npm.
- Sin cambios de schema ni migración (`SCHEMA_VERSION` se queda en 19).
- Reusar `normalizeTaskLinkUrl` tal cual está — no modificarla salvo que un test de esta
  spec encuentre un caso real que no cubra (documentar si pasa).
- Tests: unit tests de la nueva lógica de estado inicial (`value` vacío/no vacío →
  edit/preview) y del camino de error de `applyLink` con URL inválida.

## 6. Archivos afectados (previsto)

| Archivo | Cambio |
|---------|--------|
| `src/components/forms/RichTextField.tsx` | Estado inicial lazy (D4), colapso de toolbar en preview a botón lápiz (D5/D6), `applyLink` usa `normalizeTaskLinkUrl` + estado de error inline (D1–D3) |
| `src/components/forms/RichTextField.test.tsx` (nuevo, si no existe test de componente) o extender `markdownEdit.test.ts` si el caso de error se puede testear sin DOM | Cobertura de HU-01 y HU-02 |
| Ningún otro archivo — los 7 puntos de uso (`TaskFormDialog`, `TaskDetailDrawer`,
  `ProjectFormDialog`, `ProductFormDialog`, `ProcessEditorDialog`, `ProcessTemplateDialog`,
  `ProjectTypeDialog`) **no cambian**: siguen pasando `value`/`onChange`/`onBlur` igual que
  hoy; el nuevo comportamiento vive dentro de `RichTextField`. | — |

**No tocar:** `src/lib/markdownEdit.ts` (los helpers puros `wrapSelection`/`prefixLines`/
`insertLink` no cambian — `insertLink` sigue recibiendo la URL ya normalizada desde
`RichTextField`, no normaliza ella misma), `src/lib/taskLinks.ts` (se reusa, no se
modifica salvo bug real encontrado), `Markdown.tsx` (ya abre en pestaña nueva desde la
044).

## 7. Fuera de alcance

- Autocompletar/sugerir URLs.
- Editar un enlace ya insertado desde la toolbar (seleccionar `[label](url)` y reabrir el
  popover con la URL precargada) — se puede pedir aparte.
- Auto-colapsar a Ver al perder foco del contenedor (D6 lo descarta explícitamente).
- Cualquier cambio a comentarios, metas de sprint/trimestre, notas de checklist, chat,
  textareas de flujos — mismo fuera-de-alcance que la 044 (D6 de esa spec sigue vigente).

## 8. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| El colapso de toolbar en Ver rompe el layout en pantallas angostas (drawer móvil) | El botón de lápiz es un solo `Button variant="ghost" size="icon"`; probar en el ancho mínimo del drawer. |
| Cambiar el estado inicial rompe algún flujo que dependía de "siempre arranca en Editar" | Grep confirmó que ningún caller pasa `showPreviewToggle={false}` ni depende de un modo inicial fijo; los 7 usos son controlados (`value`/`onChange`) y no leen `mode`. |
| `normalizeTaskLinkUrl` tiene un caso borde no cubierto por sus tests actuales | Correr `taskLinks.test.ts` como baseline; si aparece un caso real, documentarlo, no "arreglarlo" a ciegas fuera de alcance. |

## 9. Definición de hecho

- [x] Spec + design + tasks en esta carpeta
- [x] `applyLink` usa `normalizeTaskLinkUrl`; error inline funcionando
- [x] Estado inicial lazy (`edit`/`preview` según `value`) sin flash
- [x] Toolbar colapsada a lápiz en modo Ver; expande a toolbar completa en Editar
- [x] Los 7 puntos de uso verificados manualmente (drawer + los 6 dialogs)
- [x] `npm run typecheck` + `npm test` + `npm run lint` verdes
- [x] Estado → **IMPLEMENTADO**
