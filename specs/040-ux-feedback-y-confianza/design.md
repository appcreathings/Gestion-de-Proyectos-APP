# Design 040 — UX: la app le contesta al usuario

> Decisiones técnicas para `spec.md`. Ancladas al código actual (líneas verificadas sobre el
> árbol post-039). Sin cambio de schema. A diferencia de 036-039, esta spec toca **primitivos
> compartidos**, no una feature vertical — el mapa de archivos es ancho pero cada cambio es
> pequeño y se repite.

## 0. Mapa de archivos tocados (previsto)

| Área | Archivos | Naturaleza |
|------|----------|------------|
| A · Canal de feedback | **nuevo** `store/useToastStore.ts`, `components/ui/Toaster.tsx`; `components/layout/AppLayout.tsx`, `features/integrations/components/ConnectionDialog.tsx` | Cola pura + región `aria-live`, retirada de `alert()` |
| B · Guardado veraz | **nuevo** `store/withPersist.ts`; `store/useDataStore.ts`, `store/useAppStore.ts`, `components/layout/WorkspaceStatus.tsx` | Envoltura transaccional + estado real de escritura |
| C · Diálogos: tamaño y descripción | `components/ui/dialog.tsx`; las ~26 llamadas a `DialogContent` en `features/**` | Prop `size` + prop `description` |
| D · Teclado en tarjetas | **nuevo** `components/ui/ClickableCard.tsx`; `features/projects/components/kanban/TaskCard.tsx`, `components/EntityCard.tsx`, `features/projects/components/AreaCard.tsx` | Activación por Enter/Espacio, reusa `index.css:84-87` |
| E · Errores de formulario | **nuevo** `lib/formErrors.ts`; los 16 diálogos con `disabled={!…trim()}` | `aria-invalid` + foco + motivo, sin bloquear el botón |
| F · Estado de envío | `components/ui/button.tsx`, `components/ConfirmDialog.tsx`; diálogos de guardado async | Prop `pending`, `ConfirmDialog` espera a `onConfirm` |

**Sin cambios de comportamiento** en: `flows/`, `applyMapping`, `automations/engine.ts` (salvo el
envoltorio de escritura de §B, que no cambia qué se calcula, solo cómo se persiste),
`FlowCanvas.tsx` y el resto del editor de flujos (specs 036-039), `StorageAdapter` /
`FileSystemAdapter` (se **usan**, no se tocan sus contratos). Sin `schemaVersion` nuevo
(Principio II).

---

## 1. Área A — Canal de feedback (HU-02)

### A1. Lo que falta, con precisión

Hoy no existe ninguna región anunciada. El único aviso al usuario de un fallo es
`ConnectionDialog.tsx:255,268`:

```ts
// ConnectionDialog.tsx:255
alert("Desbloquea el vault para guardar credenciales.");
// ConnectionDialog.tsx:268
alert(error instanceof Error ? error.message : "Error al guardar la conexión.");
```

`window.alert` bloquea el hilo principal, no se puede estilar ni testear, y no distingue éxito de
error para un lector de pantalla — es literalmente el mismo widget para ambos casos.

### A2. La cola, como función pura

Nuevo `src/store/useToastStore.ts`. La parte que importa es pura, para poder testearla en Node
sin DOM (decisión fijada en `spec.md` §3):

```ts
export type ToastVariant = "success" | "error" | "info";
export interface Toast { id: string; variant: ToastVariant; message: string; key?: string }
export interface ToastState { toasts: Toast[] }

/** Inserta un toast. Si `key` coincide con uno ya en cola, lo reemplaza en vez de
 *  apilarlo (CA-02.3) — evita la avalancha de un flow de poll que falla cada 5 min. */
export function enqueueToast(state: ToastState, toast: Omit<Toast, "id">): ToastState
/** Quita un toast por id — lo usa el botón de cerrar y el temporizador de auto-expirar. */
export function dismissToast(state: ToastState, id: string): ToastState
```

Tope de 3 visibles (CA-02.3): al insertar un cuarto, se descarta el más viejo que no sea error
(un error no se descarta por overflow — es lo único que el usuario todavía no vio).

El store de Zustand es una envoltura delgada sobre estas dos funciones más el temporizador de
auto-expirar (éxito/info ~4s; error no expira solo — CA-02.4). Expone `toast.success(msg)`,
`toast.error(msg, { key? })`, `toast.info(msg)` como atajos, en el mismo espíritu que
`useAppStore` ya expone acciones planas en vez de que cada llamador arme el objeto de acción.

### A3. El componente

`components/ui/Toaster.tsx` se monta **una vez**, junto a `<main id="main-content">`
(`AppLayout.tsx:346`), no dentro de cada página:

```tsx
<main id="main-content" className="flex-1 overflow-y-auto pb-16 lg:pb-0">
  <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-8 lg:py-12">
    <DemoBanner />
    <Outlet />
  </div>
</main>
<Toaster />   {/* nuevo — fixed, fuera del flujo de scroll de main */}
```

Dos regiones separadas dentro de `Toaster` (no una): `role="status"` / `aria-live="polite"` para
`success`/`info`, `role="alert"` / `aria-live="assertive"` para `error` — mezclar las dos
severidades en una sola región le haría anunciar un éxito con la misma urgencia que un fallo de
guardado.

### A4. Dónde se llama, y dónde no

`ConnectionDialog.tsx:255,268` pasan a `toast.error(...)` — es el reemplazo directo y cierra
CA-02.2. **No** se añade un toast de éxito por cada mutación silenciosa (autoguardado, `set()` de
UI); es ruido (R4). Se emite un toast de éxito en las acciones explícitas donde hoy no hay
ninguna confirmación: guardar/crear/borrar en un diálogo, ejecutar un flujo manualmente, conectar
una carpeta. La lista exacta de sitios se resuelve en la fase de implementación siguiendo esta
regla, no una lista cerrada de antemano.

---

## 2. Área B — Guardado veraz (HU-01)

### B1. El defecto, con precisión

`useDataStore.ts` tiene el mismo patrón repetido en cada mutación — mutar primero, persistir
después, sin red de seguridad:

```ts
// useDataStore.ts:397-400 — deletePerson
async deletePerson(id) {
  set({ people: get().people.filter((x) => x.id !== id) });
  await persistPeople(get().people);   // si esto rechaza, el catch más cercano
},                                       // es... ninguno. La excepción sube sin capturar.

// useDataStore.ts:404-413 — persistProject, la primitiva que casi todo usa
async function persistProject(p: Project) {
  const s = useDataStore.getState();
  await adapter().write("projects", p);   // sin try — si `write` rechaza, esta función
  const exists = s.projects.some((x) => x.id === p.id);
  useDataStore.setState({ /* ya asumió que escribió */ });
  await reindex();
}
```

El patrón se repite para productos, tipos de proyecto, plantillas de checklist/proceso,
automations, quarters, notificaciones y personas — no es un caso aislado, es el idioma del store
completo. Y `WorkspaceStatus.tsx:28-35` no tiene ningún estado que pueda reflejar el fallo:

```tsx
if (mode === "filesystem") {
  return <div>…<CheckCircle2 />sincronizado · carpeta local</div>;
  // ↑ literal para el modo, no para el resultado de la última escritura
}
```

### B2. Corrección — una envoltura, no 20 `try/catch` repetidos

Nuevo `src/store/withPersist.ts`, puro en su lógica de decisión:

```ts
/** Ejecuta `persist(nextState)`. Si rechaza: revierte el `set()` al `prevState`,
 *  emite un toast de error con el mensaje real, y marca `lastWriteError` en
 *  useAppStore. Si resuelve: limpia cualquier error previo. */
export async function withPersist<T>(
  prevState: T,
  nextState: T,
  applyState: (s: T) => void,
  persist: (s: T) => Promise<void>,
): Promise<void> {
  applyState(nextState);
  try {
    await persist(nextState);
    useAppStore.getState().clearWriteError();
  } catch (e) {
    applyState(prevState);                          // revierte — CA-01.1
    const message = e instanceof Error ? e.message : String(e);
    useAppStore.getState().setWriteError(message);   // WorkspaceStatus lo lee — CA-01.3
    toast.error(`No se pudo guardar: ${message}`);   // CA-01.2
  }
}
```

Se cablea en las funciones de persistencia existentes (`persistProject`, `persistPeople`,
`persistNotifications`, y los `adapter().write/remove` directos de productos, tipos de proyecto,
plantillas, automations, quarters) — no se reescribe cada acción del store, se envuelve su única
línea de persistencia. El cambio por sitio es mecánico y el patrón es uno solo, verificado una
vez.

### B3. `WorkspaceStatus` con tres estados

`useAppStore` gana `writeStatus: "synced" | "writing" | "error"` y `lastWriteError: string | null`
(CA-01.3), puesto por `withPersist`. `WorkspaceStatus.tsx:28` deja de ser un `if` fijo:

```tsx
if (mode === "filesystem") {
  if (writeStatus === "error") return <ErrorBadge message={lastWriteError} onRetry={…} />;
  if (writeStatus === "writing") return <WritingBadge />;
  return <SyncedBadge />;   // el mismo texto de hoy, ahora condicional a un hecho real
}
```

El reintento (CA-01.3) reintenta la **última** operación fallida, guardada junto al error —
no un reintento genérico de "todo lo pendiente", que este store no rastrea y que sería una
función nueva grande para un caso de borde.

### B4. Lo que no se puede revertir (R1, CA-01.5)

Una mutación de tarea que dispara `runFlowRulesForEvents` (`useDataStore.ts:676` y alrededor)
puede hacer que un flujo mande un webhook **antes** de que la escritura a disco falle. Revertir
el `set()` de la tarea no puede revertir ese envío. `design.md` no intenta resolver esto con más
código: `withPersist` documenta la distinción y el mensaje de error, cuando aplica a una mutación
que ya disparó automations, lo dice explícitamente ("el flujo ya se ejecutó; el cambio en pantalla
no se pudo guardar") en vez de prometer una reversión completa que no existe.

---

## 3. Área C — Diálogos: tamaño y descripción (HU-03, HU-04)

### C1. El defecto, con precisión

`dialog.tsx:34-37`:

```tsx
className={cn(
  "fixed z-50 flex w-full flex-col overflow-hidden border bg-background shadow-lg …",
  "bottom-0 left-0 right-0 top-auto max-h-[99vh] rounded-t-xl sm:left-1/2 sm:top-1/2 …
   sm:h-[99vh] md:w-[85vw] md:max-w-5xl md:h-[99vh] lg:h-[99vh]",
  className,
)}
```

`h-*` (alto **fijo**, no `max-h`) desde `sm:` en adelante. De 26 diálogos, 7 sobrescriben con la
misma cadena a mano (`ConfirmDialog.tsx:35`, `ConnectFolderDialog.tsx:56`,
`ShortcutsDialog.tsx:53`, `FlowBuilderPage.tsx:536`, dos en `FlowsPage.tsx`,
`AreaFormDialog.tsx:62` con una variante que además fija `min-h-[65vh]`); los otros 19 se quedan
con el 99vh por defecto sin haberlo decidido.

### C2. La prop `size`

```tsx
type DialogSize = "sm" | "md" | "lg" | "full";

const DIALOG_SIZE = {
  sm:   "sm:max-h-[70vh]  md:max-w-md",
  md:   "sm:max-h-[85vh]  md:max-w-2xl",
  lg:   "sm:max-h-[90vh]  md:max-w-4xl",
  full: "sm:h-[99vh]      md:h-[99vh] lg:h-[99vh] md:max-w-5xl",  // el comportamiento actual
} satisfies Record<DialogSize, string>;
```

`DialogContent` cambia `h-[99vh]` de la base por `max-h-[90vh]` (equivalente a hoy en el peor
caso) y aplica `DIALOG_SIZE[size ?? "md"]` encima. `full` es literalmente la clase de hoy —
**nada se rompe por defecto**; el trabajo real es re-asignar el `size` correcto diálogo por
diálogo (CA-03.2), y borrar la cadena repetida de los 7 que la tienen a mano (CA-03.3). El
comportamiento móvil (`bottom-0`, `rounded-t-xl`) no se toca (CA-03.4): la prop solo afecta las
clases `sm:` en adelante.

Guía de asignación (se resuelve caso por caso en `tasks.md` Fase C, patrón general):

| Contenido | `size` | Ejemplos |
|---|---|---|
| Confirmación, 1-3 campos | `sm` | `ConfirmDialog`, `VaultSetupDialog`, `QuarterFormDialog` |
| Formulario mediano, sin tabla | `md` | `ProjectFormDialog`, `TaskFormDialog` (sin pestañas de tabla), `ConnectionDialog` |
| Formulario con tabla/editor de pasos | `lg` | `ProcessEditorDialog`, `ProjectTypeDialog`, `AutomationDialog` |
| Lienzo o superficie que necesita todo el alto | `full` | El editor de flujos embebido en diálogo (`FlowCanvas.tsx:656` si aplica), `CommandPalette` |

### C3. La prop `description`

```tsx
interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize;
  /** Texto anunciado como descripción del diálogo. Si el diseño no quiere
   *  texto visible bajo el título, se renderiza `sr-only` — pero existe. */
  description?: string;
  /** Declaración explícita de que este diálogo no necesita descripción
   *  (p. ej. un menú de comandos que ya se autoexplica). Sin esto NI
   *  `description`, el componente lo trata como un olvido, no una decisión. */
  descriptionless?: true;
}
```

Con `description` presente, `DialogContent` renderiza `<DialogDescription className="sr-only">`
si el llamador no puso ya un `<DialogDescription>` visible como hijo — así los diálogos que ya
tienen descripción visible (`ConfirmDialog`, `FlowsPage`, 6 más) no duplican texto. Sin
`description` ni `descriptionless`, el aviso de Radix por consola **se deja aparecer a
propósito** durante desarrollo: es la señal de que a alguien se le olvidó decidir (CA-04.3). Los
18 diálogos identificados reciben una frase de una línea que dice qué hace el diálogo — no repite
el título (CA-04.2): p. ej. `ProjectFormDialog` → *"Completa los datos del proyecto: nombre,
producto y tipo."*, no *"Crear proyecto"*.

---

## 4. Área D — Teclado en tarjetas clicables (HU-05)

### D1. El defecto, con precisión

`TaskCard.tsx:119`:

```tsx
<div
  className={cn(/* … */, "cursor-pointer")}
  onClick={!isOverlay && !isPlaceholder ? onOpenDetail : undefined}
>
```

Sin `role`, sin `tabIndex`, sin `onKeyDown`. `index.css:84-87` ya define el anillo:

```css
a:focus-visible,
[role="button"]:focus-visible,
[tabindex]:not([tabindex="-1"]):focus-visible {
  @apply rounded-sm outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
}
```

— regla sin usuarios, porque nada en `src/` lleva esos atributos.

### D2. `ClickableCard`, envoltura mínima

```tsx
interface ClickableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  onActivate: () => void;
  /** Texto accesible cuando el contenido visual no basta por sí solo. */
  "aria-label"?: string;
}

export function ClickableCard({ onActivate, onKeyDown, ...props }: ClickableCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;   // un control interno ya maneja su propia tecla
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onActivate(); }
        onKeyDown?.(e);
      }}
      {...props}
    />
  );
}
```

La guarda `e.target !== e.currentTarget` es la pieza que evita el doble disparo (R5): un `Enter`
dentro del menú de opciones de la tarjeta (que ya es un `<DropdownMenuItem>` con su propio manejo
de teclado, `TaskCard.tsx:284-291`) no debe también activar `onActivate` de la tarjeta que lo
contiene. Los controles internos que ya son `<button>` o `<input>` (el asa de arrastre
`TaskCard.tsx:136-142`, el checkbox de selección `:114-124`) siguen recibiendo el foco por su
propio orden de tabulación — `ClickableCard` no los envuelve, solo reemplaza el `<div>` raíz.

### D3. Dónde se aplica, y dónde no

`TaskCard` primero (CA-05.1) — es el caso con más controles internos, así que es el que prueba la
guarda de verdad. Después `EntityCard` y `AreaCard` (CA-05.2), que tienen la misma forma
(tarjeta con `onClick` en la raíz + acciones secundarias adentro) pero menos controles, así que
son la generalización de bajo riesgo una vez que `TaskCard` está verificado.

**No se toca** el asa de arrastre (`TaskCard.tsx:136-142`): ya es un `<button aria-label="Arrastrar
tarea …">` con `{...listeners} {...attributes}` de dnd-kit, que ya cablea `KeyboardSensor`
(`TasksTab.tsx:384`) — es la única parte de la tarjeta que ya era accesible antes de esta spec.

---

## 5. Área E — Errores de formulario en vez de botón apagado (HU-06)

### E1. El defecto, con precisión

Dieciséis diálogos comparten el mismo idioma:

```tsx
// TaskFormDialog.tsx:277 — uno de dieciséis con la misma forma
<Button onClick={submit} disabled={!title.trim()}>Guardar</Button>
```

El botón está muerto y no hay ningún `aria-invalid` en el proyecto que le diga al usuario, ni
visual ni por lector de pantalla, cuál de los campos del formulario es el problema.

### E2. `requiredFields`, pura

```ts
// lib/formErrors.ts
export interface FieldRule<T> { field: keyof T; message: string; test: (v: T) => boolean }
export interface FieldError { field: string; message: string }

/** Evalúa las reglas contra `values` y devuelve los campos que fallan, en orden. */
export function requiredFields<T>(values: T, rules: FieldRule<T>[]): FieldError[]
```

El diálogo deja de calcular `disabled` a partir de `trim()`. El botón de guardar queda habilitado
por defecto (salvo por las razones **no corregibles en el campo** de CA-06.4: sin conexión, sin
tipo elegido en un selector que requiere una elección externa). Al pulsarlo:

```tsx
function submit() {
  const errors = requiredFields({ title }, [
    { field: "title", message: "El título no puede estar vacío", test: (v) => v.title.trim().length > 0 },
  ]);
  if (errors.length > 0) {
    setFieldErrors(errors);
    titleInputRef.current?.focus();   // CA-06.1: foco al primer campo con error
    return;
  }
  onSubmit({ /* … */ });
}
```

El input correspondiente recibe `aria-invalid={fieldErrors.some(e => e.field === "title")}` y un
`<p role="alert">` con el mensaje, asociado por `aria-describedby` — el mismo patrón en los 16
diálogos, así que se prueba una vez en `TaskFormDialog` y se replica.

---

## 6. Área F — Estado de envío (HU-07)

### F1. `Button` gana `pending`

```tsx
// button.tsx — extensión de ButtonProps
export interface ButtonProps extends /* … */ {
  pending?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, pending, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      aria-busy={pending || undefined}
      disabled={disabled || pending}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {pending && <Spinner className="size-4" />}
      {children}
    </button>
  ),
);
```

Reemplaza el patrón manual que hoy solo existe en dos sitios
(`ConnectionDialog.tsx:531-532`: `{saving ? "Guardando..." : …}`) por una prop que cualquier
diálogo puede usar sin reinventar el texto condicional.

### F2. `ConfirmDialog` espera a `onConfirm`

El defecto exacto, `ConfirmDialog.tsx:44-49`:

```tsx
<Button
  variant={confirmVariant}
  onClick={() => {
    onConfirm();          // si es async, esto NO se espera
    onOpenChange(false);  // el diálogo cierra igual, ya haya terminado o no
  }}
>
```

Corrección — `onConfirm` pasa a aceptar `() => void | Promise<void>`, y el cierre espera:

```tsx
const [pending, setPending] = useState(false);

async function handleConfirm() {
  setPending(true);
  try {
    await onConfirm();
    onOpenChange(false);   // cierra SOLO si onConfirm no lanzó
  } catch {
    // el error ya se anuncia por el toast de quien implementa onConfirm (Área A);
    // ConfirmDialog no duplica el aviso, solo deja de cerrar en falso.
  } finally {
    setPending(false);
  }
}
// <Button variant={confirmVariant} pending={pending} onClick={handleConfirm}>
```

Los llamadores existentes de `ConfirmDialog` con `onConfirm` síncrono (la mayoría — borrar una
entidad ya cargada en memoria) no cambian: `await` sobre una función síncrona resuelve
inmediatamente y el comportamiento visible es idéntico. Los que sí son async (ejecutar un flujo
ahora, por ejemplo) son los que corrige.

---

## 7. Accesibilidad (transversal)

- Región de toasts: dos `aria-live` separadas por severidad (§A3); cada toast individual es
  también legible sin JS activo de scroll — no requiere que el usuario mueva el foco.
- `WorkspaceStatus` en estado de error: el ícono no es la única señal — el texto dice "error de
  escritura", no solo cambia de color.
- `DialogContent`: `description` se ata con `aria-describedby` (ya lo hace Radix); la novedad es
  que ahora existe para escribir.
- `ClickableCard`: `role="button"` + `tabIndex={0}` + el anillo de foco ya definido en
  `index.css:84-87` — sin CSS nuevo. `aria-label` cuando el texto visible de la tarjeta no basta
  para identificar la acción fuera de contexto.
- Campos con error: `aria-invalid` + `aria-describedby` apuntando al `<p role="alert">` del
  mensaje — el patrón estándar de formularios accesibles, no una convención propia.
- `Button pending`: `aria-busy="true"` durante el envío; el spinner no es la única señal de
  estado — `disabled` ya impide el doble clic aunque el usuario no perciba el spinner.

## 8. Verificación (por fase)

- `tsc --noEmit` limpio · Vitest completo verde · `vite build` OK · lint sin errores nuevos.
- **Cuenta de tests:** baseline **823**. Cada área añade tests de su lógica pura (cola de toasts,
  `withPersist`, `requiredFields`); el total sube, no baja — a diferencia de 039, aquí no se borra
  código con tests propios.
- **Tests nuevos (unidad, sin DOM):**
  - `enqueueToast`/`dismissToast`: dedupe por `key`, tope de 3 no descarta un error, expiración
    solo para `success`/`info`.
  - `withPersist`: si `persist` resuelve, el estado queda en `nextState` y no hay error; si
    rechaza, el estado vuelve a `prevState`, `lastWriteError` se llena, y se emite un toast.
  - `requiredFields`: campo vacío → error con el campo y el mensaje correctos; todos los campos
    llenos → `[]`; el orden de los errores sigue el orden de las reglas.
  - `DIALOG_SIZE`/`size`: dado un `size`, la clase resultante contiene el `max-h`/`max-w`
    esperado (test de la tabla, no del render).
- **Smoke visual del usuario** (no hay Playwright en el repo): ver `smoke.md`.
