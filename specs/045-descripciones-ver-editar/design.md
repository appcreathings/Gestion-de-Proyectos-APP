# Design 045 — Enlaces que funcionan + Ver por defecto con lápiz

> Decisiones técnicas para `spec.md`. Todo el cambio vive dentro de
> `src/components/forms/RichTextField.tsx`. Sin cambios en `markdownEdit.ts`, `taskLinks.ts`
> ni en los 7 puntos de uso.

## 0. Mapa de archivos

| Área | Archivo | Cambio |
|------|---------|--------|
| A · Enlaces | `src/components/forms/RichTextField.tsx` | `applyLink` normaliza con `normalizeTaskLinkUrl`; nuevo estado `linkError` |
| B · Estado inicial | `src/components/forms/RichTextField.tsx` | `useState<Mode>` con initializer lazy basado en `value` |
| C · Toolbar en Ver | `src/components/forms/RichTextField.tsx` | render condicional: toolbar completa (edit) vs. solo lápiz (preview) |
| D · Tests | `src/components/forms/RichTextField.test.tsx` (nuevo) | RTL smoke: estado inicial, click lápiz, enlace inválido/válido |

## 1. Fix de enlaces (`applyLink`)

### 1.1 Import

```tsx
import { normalizeTaskLinkUrl } from "@/lib/taskLinks";
```

### 1.2 Nuevo estado local

```tsx
const [linkError, setLinkError] = useState<string | null>(null);
```

### 1.3 `applyLink` reescrito

```tsx
function applyLink() {
  const result = normalizeTaskLinkUrl(linkUrl);
  if (!result.ok) {
    setLinkError(result.error);
    return;
  }
  apply(insertLink(value, linkSelRef.current, result.url));
  closeLinkPopover();
}
```

- `closeLinkPopover()` ya limpia `linkUrl`; agregarle `setLinkError(null)`.
- `handleLinkOpenChange` (al abrir/cerrar el popover por fuera, ej. Escape o click afuera)
  también debe limpiar `linkError` para no arrastrar un error viejo la próxima vez que se
  abra:

```tsx
function handleLinkOpenChange(open: boolean) {
  setLinkOpen(open);
  if (!open) {
    setLinkUrl("");
    setLinkError(null);
  }
}
```

- El `onKeyDown` del input (`Enter` → `applyLink()`) no cambia — ya llama a la función
  reescrita.
- Al tipear de nuevo en el input después de un error, limpiar el error para que no quede
  "pegado" mientras el usuario corrige:

```tsx
<Input
  ...
  value={linkUrl}
  onChange={(e) => {
    setLinkUrl(e.target.value);
    if (linkError) setLinkError(null);
  }}
  aria-invalid={linkError ? true : undefined}
  aria-describedby={linkError ? linkErrorId : undefined}
  ...
/>
```

### 1.4 Render del error

Debajo del `Input`, antes del botón "Insertar":

```tsx
{linkError && (
  <p id={linkErrorId} role="alert" className="text-xs text-destructive">
    {linkError}
  </p>
)}
```

`linkErrorId` sigue el mismo patrón que `linkInputId` (`${id ?? reactId}-link-error`).

### 1.5 Por qué no tocar `insertLink` en `markdownEdit.ts`

`insertLink(value, sel, url, label?)` ya recibe la URL como string opaco y arma
`[label](url)` — no valida ni normaliza (es un helper puro de texto, sin conocimiento de
URLs). La normalización pertenece a la capa de UI (`RichTextField`), igual que en
task-links (`AddLinkPopover` o equivalente de la 043 normaliza antes de llamar al
factory/mutación). Mantener esa separación.

## 2. Estado inicial lazy (Ver si hay contenido, Editar si está vacío)

Reemplazar:

```tsx
const [mode, setMode] = useState<Mode>("edit");
```

por:

```tsx
const [mode, setMode] = useState<Mode>(() => (value.trim().length > 0 ? "preview" : "edit"));
```

- Es un **initializer lazy** (función pasada a `useState`) — React solo lo ejecuta en el
  montaje, no en cada render, así que no hay costo ni riesgo de recalcular el modo mientras
  el usuario escribe (`value` cambia en cada tecla, pero el estado `mode` ya está fijado).
- El patrón `key={task.id}` que ya usa `TaskDetailDrawer` (`RichTextField.tsx` usage,
  `TaskDetailDrawer.tsx:537`) sigue siendo lo que fuerza un remount — y por lo tanto un
  recálculo del initializer — al cambiar de tarea. **No se toca ese contrato**; documentarlo
  igual que en 044 para los formularios que agreguen `RichTextField` a futuro.
- `showPreviewToggle={false}` (sin callers hoy, D9 de la spec): si algún caller futuro lo
  usa, el initializer igual corre, pero como el toggle no se muestra, el usuario no tiene
  forma de salir de `preview` con contenido no vacío. Para ese caso, forzar `mode: "edit"`
  siempre cuando `showPreviewToggle` es `false`:

```tsx
const [mode, setMode] = useState<Mode>(() =>
  showPreviewToggle && value.trim().length > 0 ? "preview" : "edit",
);
```

  (Nota: `showPreviewToggle` tiene default `true` en la desestructuración de props, así que
  esto es seguro leerlo en el initializer.)

## 3. Toolbar colapsada en modo Ver

Hoy la toolbar (con los botones de formato deshabilitados) se renderiza siempre, y solo el
grupo de pestañas Editar\|Ver se oculta si `showPreviewToggle` es `false`. El cambio: en
`mode === "preview"`, la toolbar completa **no se monta**; se reemplaza por una barra
mínima con un solo botón de lápiz.

```tsx
{mode === "edit" ? (
  <div role="toolbar" aria-label="Formato de texto" className={/* clases actuales */}>
    {/* ...ToolButtons de Negrita/Cursiva/Lista/Lista numerada/Código... */}
    {/* ...Popover de enlace... */}
    {showPreviewToggle && (
      <div className="ml-auto ..." role="tablist" aria-label="Modo de edición">
        <ModeButton active onClick={() => switchMode("edit")}>Editar</ModeButton>
        <ModeButton onClick={() => switchMode("preview")}>Ver</ModeButton>
      </div>
    )}
  </div>
) : (
  showPreviewToggle && (
    <div className="flex items-center justify-end border-b border-border/60 bg-muted/30 px-1 py-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        title="Editar descripción"
        aria-label="Editar descripción"
        disabled={disabled}
        onClick={() => switchMode("edit")}
      >
        <Pencil className="size-4" />
      </Button>
    </div>
  )
)}
```

Notas de implementación:

- `Pencil` se importa de `lucide-react` (ya es dependencia del proyecto, usado en otros
  componentes — ver `src/components/forms/RichTextField.tsx` imports actuales de
  `lucide-react` para mantener el mismo estilo de import).
- El bloque `formatDisabled` (hoy `disabled || mode === "preview"`) deja de tener sentido
  para los `ToolButton` porque en preview esos botones ya ni se montan — se puede simplificar
  a `formatDisabled = disabled` una vez hecho este cambio (los botones de formato solo
  existen dentro de la rama `mode === "edit"`, donde `mode` siempre es `"edit"`).
- Si `showPreviewToggle` es `false` y `mode` es `"preview"` (no debería pasar por el ajuste
  del §2, pero por defensividad): no renderizar ninguna barra — igual que hoy cuando no hay
  toggle.
- El botón de lápiz reusa el mismo `switchMode("edit")` que ya existe — **no** dispara
  `onBlur` del padre (esa invocación solo pasa al ir *hacia* `"preview"`, ver `switchMode`
  actual). Ir hacia `"edit"` no necesita persistir nada porque no hay pérdida de datos.
- El área de preview (`<Markdown>{value}</Markdown>`) no cambia de posición ni estilos —
  solo cambia lo que hay arriba (toolbar completa vs. barra con lápiz).

## 4. Accesibilidad

- Botón lápiz: `type="button"`, `aria-label="Editar descripción"`, `title="Editar
  descripción"` — mismo patrón que los `ToolButton` existentes.
- Alcanzable por `Tab`; usa el mismo `Button` de shadcn que el resto (foco visible ya viene
  del design system).
- El error de URL usa `role="alert"` para que un lector de pantalla lo anuncie al aparecer,
  y `aria-invalid` + `aria-describedby` en el `Input` para asociarlo (mismo patrón que
  `fieldAria()` en `src/lib/formErrors.ts`, aunque acá no hace falta usar ese helper — es un
  campo de popover efímero, no un campo de formulario persistente).

## 5. Tests

Nuevo `src/components/forms/RichTextField.test.tsx` (React Testing Library — confirmar que
el proyecto ya tiene RTL configurado; si no, usar el mismo runner/config que
`markdownEdit.test.ts` extendiéndolo a un test de componente, o revisar cómo testea
componentes en otro lugar del repo como referencia de setup antes de escribir este archivo).

Casos:

1. `value=""` → el campo monta en modo Editar (toolbar completa visible, sin botón lápiz).
2. `value="algo"` → el campo monta en modo Ver (solo lápiz visible, sin toolbar de
   formato).
3. Click en lápiz con `value="algo"` → aparece la toolbar completa.
4. Insertar enlace con `linkUrl="example.com"` → el valor final contiene
   `https://example.com/`.
5. Insertar enlace con `linkUrl="   "` o algo que `normalizeTaskLinkUrl` rechace → aparece
   el mensaje de error, `onChange` **no** se llama.
6. Tipear en el input de URL después de un error → el error desaparece.

Si RTL no está configurado en el repo y montarlo es una tarea grande fuera de alcance,
alternativa mínima: extraer la lógica de decisión de error a una función pura testeable sin
DOM (p. ej. reusar directamente `normalizeTaskLinkUrl` — ya tiene sus propios tests en
`taskLinks.test.ts`, que sirven como cobertura indirecta) y limitar el test de componente a
un smoke manual documentado en `tasks.md`. Decidir esto al llegar a la Fase B según lo que
ya exista en el repo — **no** introducir un test runner nuevo solo para esto (Principio V).

## 6. Orden de implementación sugerido

1. Fix de enlaces (`applyLink` + estado de error) — es el bug reportado, más aislado y
   testeable.
2. Estado inicial lazy.
3. Colapso de toolbar a lápiz en Ver.
4. Tests (o smoke manual documentado si RTL no está listo).
5. Smoke manual en los 7 puntos de uso + `npm run typecheck`/`test`/`lint`.

## 7. Alternativas descartadas

| Alternativa | Por qué no |
|-------------|------------|
| Validar la URL con `input.reportValidity()` del navegador | No normaliza protocolo (sigue sin anteponer `https://`), y el mensaje de error del navegador no es consistente con el resto de la app (no está en español/tuteo). |
| Escribir una normalización de URL nueva y propia para descripciones | Duplica exactamente lo que ya hace `normalizeTaskLinkUrl`; viola Principio V. |
| Auto-colapsar a Ver al perder foco del contenedor completo | Descartado explícitamente por el usuario (D6 del spec) — mayor riesgo sobre el guardado en `onBlur` del drawer, sin pedido claro que lo justifique. |
| Mostrar siempre la pestaña "Ver" también en modo preview (en vez de colapsar todo a un lápiz) | No cumple el pedido literal de "un pequeño ícono de lápiz"; además es redundante (ya estás viendo el preview). |
