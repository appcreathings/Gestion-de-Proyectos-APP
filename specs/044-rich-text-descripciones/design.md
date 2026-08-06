# Design 044 — Formato de texto en descripciones

> Decisiones técnicas para `spec.md`. Ancladas a `SCHEMA_VERSION` 19 (sin bump).
> Stack: React 18 + Vite + Tailwind + shadcn-style UI + `react-markdown`.

## 0. Mapa de archivos

| Área | Archivos | Naturaleza |
|------|----------|------------|
| A · Helpers | **nuevo** `src/lib/markdownEdit.ts` + test | wrap selección, prefijos de lista, enlace |
| B · UI compartida | **nuevo** `src/components/forms/RichTextField.tsx` | toolbar + textarea + preview |
| C · Render | `src/components/Markdown.tsx` | estilos prose (ajustes menores) |
| D · Forms / drawer | Task/Project/Product/Process/Type dialogs + TaskDetailDrawer | drop-in |
| E · Lectura | `OverviewTab.tsx` | `<Markdown>` en description de proyecto |

Sin cambios en storage, migraciones, flujos, RAG (consumen string).

## 1. Por qué Markdown y no HTML/JSON de editor

1. **Ya hay render** (`Markdown.tsx`, usado en chat y procesos).
2. **Schema estable** — `description: z.string()` no migra.
3. **Datos locales legibles** en JSON de carpeta / export.
4. **AI y tools** ya tratan descripciones como texto; Markdown es el dialecto natural.
5. TipTap/Lexical añadirían bundle, modelo de documento y riesgo XSS vía HTML.

## 2. Helper `markdownEdit.ts`

API pura (fácil de testear), sin DOM:

```ts
export type TextSelection = { start: number; end: number };

export type EditResult = {
  value: string;
  selection: TextSelection; // nueva selección / caret
};

/** Envuelve la selección o inserta open+close con caret en medio. */
export function wrapSelection(
  value: string,
  sel: TextSelection,
  open: string,
  close: string,
): EditResult;

/** Prefija cada línea de la selección (o la línea actual) con "- " / "1. ". */
export function prefixLines(
  value: string,
  sel: TextSelection,
  kind: "ul" | "ol",
): EditResult;

/** Si hay selección → [sel](url); si no → [etiqueta](url) con placeholders. */
export function insertLink(
  value: string,
  sel: TextSelection,
  url: string,
  label?: string,
): EditResult;
```

### 2.1 Comportamiento de wrap (negrita / cursiva / código)

| Caso | Input | Acción | Output caret |
|------|-------|--------|--------------|
| Selección no vacía | `hola [mundo]` + `**` | `hola **mundo**` | caret al final del wrap o selección del interior |
| Selección vacía | caret en medio | inserta `****` / `**` | caret entre marcadores |
| Toggle simple (opcional v1) | selección ya envuelta en `**` | no implementar en v1 | — |

Cursiva: `*` / `*` (no `_`, para menos choques con español).

Código inline: `` ` `` / `` ` ``.

### 2.2 Listas

- `ul`: cada línea de la selección recibe `- ` si no lo tiene; si ya empieza con `- `, no duplicar (idempotente light).
- `ol`: `1. `, `2. `, … por línea en el bloque seleccionado.
- Si selección vacía: prefijar la línea del caret; si la línea está vacía, insertar `- ` y caret después.

### 2.3 Enlace

v1 UX simple:

1. Click Enlace → `window.prompt("URL del enlace")` (o popover mínimo si ya hay Popover en UI).
2. Preferir **popover** con Input si el prompt nativo rompe el look; si tiempo limitado, `prompt` es aceptable y documentado como deuda.
3. Validar URL con la misma filosofía que task-links (opcional reutilizar `normalizeTaskLinkUrl`); si falla, toast/mensaje y no insertar.

**Recomendación implementable:** popover Radix ya en deps (`@radix-ui/react-popover`) + Input + botón Aplicar.

## 3. Componente `RichTextField`

### 3.1 API

```tsx
type RichTextFieldProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;          // wrapper
  textareaClassName?: string;  // altura min, mono opcional
  disabled?: boolean;
  /** default true */
  showPreviewToggle?: boolean;
  /** "sm" | "md" — padding toolbar / min-height */
  size?: "sm" | "md";
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};
```

Contrato drop-in respecto a Textarea controlado: `value` + `onChange(string)` (no el evento).  
Los padres que hoy hacen `onChange={(e) => setX(e.target.value)}` pasan a `onChange={setX}`.

### 3.2 Estructura visual

```
┌─────────────────────────────────────────────┐
│ [B] [I] [• lista] [1. ] [🔗] [`]   │ Editar│Ver │  ← toolbar h-9, border-b
├─────────────────────────────────────────────┤
│                                             │
│  textarea  (modo edit)                      │
│  — o —                                      │
│  <Markdown> (modo preview, min-height)      │
│                                             │
└─────────────────────────────────────────────┘
  hint opcional: "Selecciona texto y usa la barra para formatear"
```

- Contenedor: `rounded-md border border-input bg-background` (alineado a Input/Textarea).
- Toolbar: `flex flex-wrap items-center gap-0.5 px-1 py-1 bg-muted/30`.
- Botones: `Button variant="ghost" size="icon"` ~ `size-8`, Lucide: `Bold`, `Italic`, `List`, `ListOrdered`, `Link2`, `Code`.
- Toggle Editar|Ver: `Button` group o tabs sutiles a la derecha (`text-xs`).
- Textarea: sin borde propio (el borde es del wrapper); `min-h-[100px]` / `min-h-[120px]` vía `textareaClassName`.
- Preview: padding `p-3`, mismo min-height, `overflow-auto`.

### 3.3 Refs y selección

```ts
const taRef = useRef<HTMLTextAreaElement>(null);

function apply(edit: EditResult) {
  onChange(edit.value);
  // rAF / useEffect para setSelectionRange tras re-render controlado
  requestAnimationFrame(() => {
    const el = taRef.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(edit.selection.start, edit.selection.end);
  });
}
```

Leer selección: `taRef.current.selectionStart/End` al click de toolbar (antes de que el botón robe el focus: usar `onMouseDown={(e) => e.preventDefault()}` en botones de formato para no perder selección).

### 3.4 Atajos

En `onKeyDown` del textarea:

| Atajo | Acción |
|-------|--------|
| `Mod+B` | wrap `**` |
| `Mod+I` | wrap `*` |
| `Mod+E` (opcional) | wrap `` ` `` |

`Mod` = `metaKey` en Mac, `ctrlKey` en resto.  
`preventDefault` solo cuando se maneja el atajo.

No interceptar Enter (listas inteligentes / continue list **fuera de v1**).

### 3.5 Preview

Estado local `mode: "edit" | "preview"`.  
Si `value` vacío en preview → el empty state de `Markdown` (“Sin contenido.”) o placeholder suave “Nada que previsualizar”.

Al cambiar a preview no se dispara blur de guardado extra si el padre ya guarda en blur: el blur del textarea puede ocurrir al clicar Ver — **importante**: en `TaskDetailDrawer` el save es `onBlur` del campo. Opciones:

1. **Guardar al salir del wrapper** (`onBlur` del contenedor con `relatedTarget` check), o  
2. Llamar `onBlur` del padre también al toggle a preview / al desmontar, o  
3. En drawer: `onChange` ya actualiza state local; `persist` en blur del textarea **y** al pasar a preview.

**Decisión:** el wrapper expone `onBlur` en el textarea; además, al cambiar a `preview`, invoca `onBlur?.()` una vez para no perder el guardado del drawer. Documentar en el componente.

### 3.6 Accesibilidad

- Toolbar: `role="toolbar" aria-label="Formato de texto"`.
- Cada botón: `aria-label` (“Negrita”, “Cursiva”, …).
- Textarea: `aria-multiline`, id enlazado al Label del padre.
- Toggle: `aria-pressed` o tabs con `aria-selected`.

## 4. Integración por pantalla

| Pantalla | Campo | Persistencia | Notas |
|----------|-------|--------------|-------|
| `TaskFormDialog` | description | submit | min-h 100px |
| `TaskDetailDrawer` | description | blur → `persist("description", …)` | min-h 120px; onBlur al preview |
| `ProjectFormDialog` | description | submit (+ AI improve) | |
| `ProductFormDialog` | description | submit | |
| `ProcessEditorDialog` | description | submit | quitar mono forzado o dejar opcional |
| `ProcessTemplateDialog` | description | submit | igual |
| `ProjectTypeDialog` | description | submit | |
| `OverviewTab` | solo lectura | — | `<Markdown>{project.description}</Markdown>` |

### 4.1 AI Improve

Sigue pasando `description` string al panel. Si la IA devuelve Markdown, el editor lo muestra; si devuelve plano, igual. **Sin cambios** en `useAiImprove` / prompts en v1.

### 4.2 Labels

Unificar copy:

- Label: **Descripción**
- Opcional sublabel o `title` en toolbar: “Formato Markdown”
- Quitar “Descripción (Markdown)” crudo o dejar “Descripción” + hint en toolbar para no asustar a no-técnicos.

## 5. Ajustes a `Markdown.tsx`

Revisar selectores para cubrir bien:

- `em` / `i` (cursiva)
- `strong`
- `ul` / `ol` / `li` (ya hay list-disc / list-decimal)
- `a` (ya primary + underline) — `target="_blank" rel="noopener noreferrer"` vía `components` de react-markdown **recomendado** en este PR si es 5 líneas.
- `p` spacing

No añadir `rehype-raw`. No GFM tables en v1 (opcional `remark-gfm` **no** en v1 para no sumar dep).

## 6. Tests

`markdownEdit.test.ts`:

1. wrap selección negrita  
2. wrap caret vacío  
3. prefixLines ul en multi-línea  
4. prefixLines ol numera 1..n  
5. insertLink con y sin selección  
6. no corrompe unicode / emojis en offsets  

Sin test de componente pesado en v1 (opcional RTL smoke después).

## 7. Orden de implementación sugerido

1. Helpers + tests  
2. `RichTextField` visual (toolbar + edit + preview)  
3. Task drawer + Task form (mayor valor PM)  
4. Project form + OverviewTab  
5. Product + Process + templates + project type  
6. Smoke + typecheck + mark spec IMPLEMENTADO  

## 8. Alternativas descartadas (v1)

| Alternativa | Por qué no |
|-------------|------------|
| TipTap / Lexical / Plate | Bundle, HTML storage, overlap con Markdown existente |
| `react-simple-code-editor` para MD | Es para código (Prism); no toolbar semántica |
| Solo preview al blur sin toolbar | No cumple “poner negrilla” guiado |
| Guardar HTML | Schema/XSS/migración; peores exports |

## 9. Deuda consciente / v1.1

- [ ] Comentarios de tarea con el mismo `RichTextField`
- [ ] Continue-list en Enter
- [ ] Toggle off de negrita si ya está envuelto
- [ ] Popover de enlace pulido (si v1 usó prompt)
- [ ] `remark-gfm` (strikethrough, tables) si se pide
- [ ] Strip Markdown para previews en cards (line-clamp plain)
