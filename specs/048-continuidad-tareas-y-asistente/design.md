# Design 048 — Continuidad de navegación + productividad en tareas y asistente

> Decisiones técnicas para `spec.md`. Cuatro cambios independientes entre sí — se pueden
> implementar y verificar en cualquier orden, agrupados aquí por archivo/HU. Sin cambios de
> schema, sin dependencias nuevas.

## 0. Mapa de archivos

| HU | Archivo | Cambio |
|----|---------|--------|
| HU-01 | `src/features/projects/ProjectDetailPage.tsx` | Memoria global de última pestaña vista |
| HU-02 | `src/store/useChatStore.ts` | Nueva constante exportada `ASSISTANT_PANEL_WIDTH` |
| HU-02 | `src/features/assistant/AssistantPanel.tsx` | Usa la constante en vez de `w-[400px]` hardcodeado |
| HU-02 | `src/features/projects/components/kanban/TaskDetailDrawer.tsx` | Lee `useChatStore`/`useBreakpoint`, ancla a la izquierda del asistente cuando ambos están abiertos |
| HU-03 | `src/store/useChatStore.ts` | Flag de auto-aprobación en memoria (turn-scoped) + acción `approveAll` |
| HU-03 | `src/features/assistant/WriteConfirmCard.tsx` | Botón "Aprobar todo" nuevo |
| HU-04 | `src/components/attachments/AttachmentsSection.tsx` | Listener de `paste`, reconstruye `File` desde imagen del portapapeles |

## 1. HU-01 — Memoria global de última pestaña de proyecto

En `ProjectDetailPage.tsx`, hoy:

```tsx
const [searchParams] = useSearchParams();
const activeTab = searchParams.get("tab") ?? "overview";
```

Pasa a (agregado a nivel de módulo, fuera del componente, junto a los demás imports):

```tsx
const LAST_TAB_KEY = "hito:last-project-tab";
const VALID_TABS = ["overview", "areas", "tasks", "automations", "activity"] as const;
type ProjectTab = (typeof VALID_TABS)[number];

function isValidTab(v: string | null): v is ProjectTab {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

function readLastTab(): ProjectTab {
  try {
    const saved = localStorage.getItem(LAST_TAB_KEY);
    return isValidTab(saved) ? saved : "overview";
  } catch {
    return "overview";
  }
}
```

Dentro de `ProjectDetailContent`:

```tsx
const [searchParams] = useSearchParams();
const urlTab = searchParams.get("tab");
const activeTab: ProjectTab = isValidTab(urlTab) ? urlTab : readLastTab();

// Persiste la pestaña resuelta como "última vista" — cubre tanto el click en una
// TabsTrigger (cambia la URL → activeTab cambia) como llegar por deep link con
// ?tab= explícito (D2: visitar cuenta como "última vista", incluso por link).
useEffect(() => {
  try {
    localStorage.setItem(LAST_TAB_KEY, activeTab);
  } catch {
    // Ignore localStorage errors
  }
}, [activeTab]);
```

- No se toca el `onValueChange` de `<Tabs>` (línea 111-116) — sigue navegando con
  `{ replace: true }` igual que hoy. El nuevo `useEffect` reacciona al cambio resultante de
  `activeTab`, no hace falta duplicar la escritura a `localStorage` en el handler de click.
- `readLastTab()` se evalúa en cada render cuando `urlTab` es inválido/ausente — es una
  lectura síncrona y barata de `localStorage`, mismo costo que cualquier `useState`
  lazy-init existente en el repo (p. ej. `TasksTab.tsx:96-101`); no hace falta memoizarla.
- Mismo estilo de clave que precedentes del repo: string plano (no JSON), prefijo
  `hito:` como ya usa `hito:sidebar-collapsed` (spec 046) — a diferencia de claves más
  viejas sin prefijo (`kanban-view-mode`, `kanban-drawer-width`) que no se tocan.
- **No** se agrega esta memoria a `useDataStore`/schema — es preferencia de cliente pura,
  igual criterio que `sidebarCollapsed`/`viewMode` (Principio VI: solo pasa por
  `StorageAdapter` lo que es dato de dominio, no preferencias de UI).

## 2. HU-02 — Panel de tarea y asistente lado a lado

### 2.1 Constante compartida de ancho

**Por qué no vive en `AssistantPanel.tsx`:** ese componente se monta con `lazy(() =>
import("@/features/assistant/AssistantPanel"))` en `AppLayout.tsx:40-45`, precisamente para
que su bundle (y el de todo `src/ai/`, que importa transitivamente) no entre en el chunk
principal. Si `TaskDetailDrawer.tsx` importara la constante directamente desde ese archivo,
Vite/Rollup dejaría de poder separarlo en un chunk aparte — el propósito del `lazy()` se
perdería. La constante se define en cambio en `useChatStore.ts`, un módulo liviano que
`TaskDetailDrawer.tsx` ya necesita importar para leer `s.open`, y que no arrastra el bundle
de IA:

```tsx
// useChatStore.ts, junto a los demás exports de nivel de módulo
export const ASSISTANT_PANEL_WIDTH = 400;
```

`AssistantPanel.tsx` la importa y la usa en vez del `w-[400px]` hardcodeado (línea 84):

```tsx
import { useChatStore, ASSISTANT_PANEL_WIDTH } from "@/store/useChatStore";
// ...
<aside
  ref={panelRef}
  aria-label="Asistente IA"
  className={cn(
    "relative flex flex-col overflow-hidden",
    isDesktop
      ? "shrink-0 border-l bg-card z-50"
      : "fixed inset-0 z-50 border-0 bg-card",
  )}
  style={isDesktop ? { width: ASSISTANT_PANEL_WIDTH } : undefined}
>
```

(Se quita `w-[400px]` de la lista de clases; el ancho pasa a `style` para que solo exista un
lugar con el número.)

### 2.2 `TaskDetailDrawer` — anclaje dinámico

Imports nuevos:

```tsx
import { useChatStore, ASSISTANT_PANEL_WIDTH } from "@/store/useChatStore";
import { useBreakpoint } from "@/hooks/useBreakpoint";
```

Dentro de `TaskDetailDrawer()`, junto a los demás hooks:

```tsx
const assistantOpen = useChatStore((s) => s.open);
const isDesktop = useBreakpoint("lg");
const sideBySide = assistantOpen && isDesktop;
```

El contenedor del panel (línea 439-452 actual) cambia de anclar `right-0` por clase fija a
un `right` dinámico por `style` (igual patrón que ya usa `width: drawerWidth`):

```tsx
<div
  ref={drawerRef}
  role="dialog"
  aria-modal="false"
  aria-label={`Detalle de tarea: ${task.title}`}
  style={{ width: drawerWidth, right: sideBySide ? ASSISTANT_PANEL_WIDTH : 0 }}
  className={cn(
    "fixed inset-y-0 z-50 flex w-full max-w-[800px] flex-col border-l bg-background shadow-lg transition-transform duration-200 ease-out md:max-w-none",
    isBlocked && "border-l-4 border-l-red-500",
    !isBlocked && overdue && "border-l-4 border-l-red-500",
    !isBlocked && dueSoon && !overdue && "border-l-4 border-l-amber-500",
  )}
>
```

(Se quita `right-0` de la cadena de clases — ahora lo controla `style.right`.)

### 2.3 Clamp del ancho máximo al redimensionar (D6)

`handleMouseMove` actual:

```tsx
const handleMouseMove = (e: MouseEvent) => {
  if (!isResizingRef.current) return;
  const newWidth = window.innerWidth - e.clientX;
  const clamped = Math.min(800, Math.max(320, newWidth));
  setDrawerWidth(clamped);
};
```

Pasa a:

```tsx
const handleMouseMove = (e: MouseEvent) => {
  if (!isResizingRef.current) return;
  const rightEdge = sideBySide ? window.innerWidth - ASSISTANT_PANEL_WIDTH : window.innerWidth;
  const newWidth = rightEdge - e.clientX;
  const maxWidth = sideBySide
    ? Math.min(800, window.innerWidth - ASSISTANT_PANEL_WIDTH - 200)
    : 800;
  const clamped = Math.min(maxWidth, Math.max(320, newWidth));
  setDrawerWidth(clamped);
};
```

y el `useEffect` que registra `handleMouseMove`/`handleMouseUp` (línea 243-268) agrega
`sideBySide` a su arreglo de dependencias (ya depende de `drawerWidth`).

- `200` (margen mínimo de contenido principal visible detrás de ambos paneles) es un valor
  conservador, no crítico — no hace falta exponerlo como constante ni ajustarlo con
  precisión; si en el futuro se siente muy angosto/ancho, es un solo número para tocar.
- El clamp del mínimo (`320`) no cambia.

### 2.4 Re-clamp al abrir el asistente con un ancho ya guardado

Si el usuario había dejado `drawerWidth` en un valor grande (p. ej. `700`, guardado en
`localStorage` bajo `kanban-drawer-width`) y **luego** abre el asistente, sin drag activo de
por medio, el panel podría quedar más angosto de lo ideal sin que nada lo reclame. Se agrega
un efecto chico que reclama solo cuando hace falta:

```tsx
useEffect(() => {
  if (!sideBySide) return;
  const maxWidth = Math.min(800, window.innerWidth - ASSISTANT_PANEL_WIDTH - 200);
  setDrawerWidth((w) => Math.min(w, Math.max(320, maxWidth)));
}, [sideBySide]);
```

No persiste este reclamado a `localStorage` — si el usuario cierra el asistente después, el
próximo resize manual parte del valor actual (ya angosto); no hace falta restaurar el ancho
"grande" original, es un caso borde aceptable (Principio V).

### 2.5 Por qué no tocar el backdrop

El overlay de fondo del drawer (línea 434-438, `bg-black/20 ... md:bg-transparent`) ya es
transparente en escritorio (`md:bg-transparent`) y tiene `z-40`, por debajo del `z-50` de
`AssistantPanel` — un click sobre el área del asistente ya lo recibe el asistente, no cierra
el drawer por accidente. No requiere cambios.

## 3. HU-03 — Botón "Aprobar todo"

### 3.1 Flag de auto-aprobación (turn-scoped, en memoria)

En `useChatStore.ts`, junto a las demás variables de módulo (`agentHistory`,
`abortController`, `pendingResolvers` — línea 66-68):

```ts
let autoApproveRestOfTurn = false;
```

No es estado de Zustand (no dispara re-render por sí solo — solo importa para la lógica
interna de `send()`/`onConfirmWrite`, igual criterio que `pendingResolvers`, que tampoco es
estado reactivo).

### 3.2 Resetear al empezar cada turno

En `send()`, junto a `abortController = new AbortController();` (línea 118):

```ts
abortController = new AbortController();
autoApproveRestOfTurn = false;
```

También en `stop()` (línea 248-254) y `newConversation()` (línea 270-275), por defensividad
(CA-03.6 — que no quede una auto-aprobación "fantasma" para un turno que ya terminó o una
conversación que se reinicia):

```ts
stop() {
  autoApproveRestOfTurn = false;
  for (const [id, resolve] of pendingResolvers) {
    resolve(false);
    pendingResolvers.delete(id);
  }
  abortController?.abort();
},
```

```ts
async newConversation() {
  get().stop(); // ya resetea el flag
  agentHistory = [];
  set({ messages: [], status: "idle", error: null, errorDetail: null });
  await idbDel(IDB_KEY).catch(() => undefined);
},
```

### 3.3 `onConfirmWrite` respeta el flag

Callback actual (línea 201-209):

```ts
onConfirmWrite: (call: ToolCallView, description: string) =>
  new Promise<boolean>((resolve) => {
    pendingResolvers.set(call.id, resolve);
    set({ status: "awaiting-confirmation" });
    patchAssistant((parts) => [
      ...parts,
      { kind: "pendingWrite", id: call.id, name: call.name, description },
    ]);
  }),
```

Pasa a:

```ts
onConfirmWrite: (call: ToolCallView, description: string) => {
  if (autoApproveRestOfTurn) return Promise.resolve(true);
  return new Promise<boolean>((resolve) => {
    pendingResolvers.set(call.id, resolve);
    set({ status: "awaiting-confirmation" });
    patchAssistant((parts) => [
      ...parts,
      { kind: "pendingWrite", id: call.id, name: call.name, description },
    ]);
  });
},
```

Con el flag activo, la tarjeta `pendingWrite` **nunca se crea** para las siguientes
escrituras del turno — se resuelve `true` de inmediato y `executeCall` (`runAgentTurn.ts`)
sigue directo a `callTool`. El usuario ve las próximas acciones aparecer directamente como
`toolCall` (chip normal, sin tarjeta de confirmación), igual que una escritura ya aprobada.

### 3.4 Nueva acción `approveAll`

Interfaz `ChatState` (línea 46-60) gana un método nuevo, junto a `approvePendingWrite`:

```ts
approvePendingWrite: (id: string, approved: boolean) => void;
approveAll: (id: string) => void;
```

Implementación, junto a `approvePendingWrite` (línea 256-268):

```ts
approvePendingWrite(id, approved) {
  const resolve = pendingResolvers.get(id);
  if (!resolve) return;
  pendingResolvers.delete(id);
  set({
    status: "streaming",
    messages: get().messages.map((m) => ({
      ...m,
      parts: m.parts.filter((p) => !(p.kind === "pendingWrite" && p.id === id)),
    })),
  });
  resolve(approved);
},

approveAll(id) {
  autoApproveRestOfTurn = true;
  get().approvePendingWrite(id, true);
},
```

`approveAll` solo marca el flag y delega en `approvePendingWrite` para la acción actual —
no duplica la lógica de resolver/limpiar la tarjeta.

### 3.5 `WriteConfirmCard` — tercer botón

```tsx
import { CheckCheck, ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore, type ChatPart } from "@/store/useChatStore";

type PendingWritePart = Extract<ChatPart, { kind: "pendingWrite" }>;

export function WriteConfirmCard({ part }: { part: PendingWritePart }) {
  const approve = useChatStore((s) => s.approvePendingWrite);
  const approveAll = useChatStore((s) => s.approveAll);

  return (
    <div
      role="alertdialog"
      aria-label="Confirmar acción del asistente"
      className="my-2 rounded-lg border border-warning/50 bg-warning/10 p-3"
    >
      <div className="flex items-start gap-2">
        <ShieldQuestion className="mt-0.5 size-4 shrink-0 text-warning" />
        <div className="flex-1">
          <p className="text-sm font-medium">{part.description}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            El asistente quiere modificar tus datos ({part.name}).
          </p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => approve(part.id, false)}>
          Cancelar
        </Button>
        <Button
          variant="outline"
          size="sm"
          title="Aprueba esta acción y las siguientes de esta misma respuesta, sin volver a preguntar. En tu próximo mensaje se vuelve a pedir confirmación."
          onClick={() => approveAll(part.id)}
        >
          <CheckCheck className="size-3.5" />
          Aprobar todo
        </Button>
        <Button size="sm" autoFocus onClick={() => approve(part.id, true)}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
```

- `title` nativo en el botón nuevo explicita el alcance (mitigación del riesgo de
  ambigüedad de nombre, spec §8).
- Se reusa el ícono `CheckCheck` de `lucide-react` (ya es dependencia del proyecto, mismo
  paquete que el resto de íconos del archivo).
- Orden de botones: Cancelar → Aprobar todo → Confirmar. "Confirmar" (la acción más frecuente
  hoy) se mantiene como último botón con `autoFocus`, sin cambiar el foco por defecto
  existente.

## 4. HU-04 — Pegar imagen del portapapeles

En `AttachmentsSection.tsx`, después de que `atCap` queda definido (línea 123) y con
`addFiles` ya desestructurado de `useAttachmentActions` (línea 59):

```tsx
useEffect(() => {
  if (disabled) return;
  function onPaste(e: ClipboardEvent) {
    if (atCap) return;
    const items = e.clipboardData?.items;
    if (!items) return;
    const imageFiles: File[] = [];
    for (const item of items) {
      if (item.kind !== "file" || !item.type.startsWith("image/")) continue;
      const file = item.getAsFile();
      if (!file) continue;
      // D9: nombre generado desde el MIME type, no desde `file.name` del portapapeles
      // (no confiable entre navegadores) — classifyFile() exige extensión válida.
      const ext = item.type.split("/")[1]?.split("+")[0] || "png";
      imageFiles.push(new File([file], `pegado-${Date.now()}.${ext}`, { type: item.type }));
    }
    if (imageFiles.length === 0) return;
    e.preventDefault();
    void addFiles(imageFiles);
  }
  document.addEventListener("paste", onPaste);
  return () => document.removeEventListener("paste", onPaste);
}, [disabled, atCap, addFiles]);
```

- **Listener en `document`, no en un elemento con `tabIndex`:** así funciona sin importar
  qué parte del drawer tiene el foco (título, descripción, o nada en particular) — cubre
  CA-04.1 tal como está redactado ("con el foco en cualquier parte de la sección... o dentro
  del drawer"). Se limpia en el cleanup del efecto, así que solo está activo mientras
  `AttachmentsSection` está montada (D10).
- **`e.preventDefault()` solo cuando hay imagen:** si el portapapeles solo tiene texto
  (`imageFiles.length === 0`), la función retorna antes de llamar `preventDefault()` — el
  paste de texto en Título/Resumen/Descripción sigue funcionando exactamente igual (D11,
  CA-04.3). Si el portapapeles trae texto **y** una imagen a la vez (raro, pero posible en
  algunos flujos de copiado), se prioriza la imagen y se bloquea el paste de texto — caso
  borde aceptado, no es el flujo típico de "pegar una captura de pantalla".
- **`ext` desde el MIME type:** `"image/svg+xml"` → `split("/")[1]` = `"svg+xml"` →
  `split("+")[0]` = `"svg"`. Cubre los 5 tipos de imagen del allowlist (`png`, `jpg`/`jpeg`,
  `webp`, `gif`, `svg`) sin necesitar un mapa explícito — `jpeg` desde `image/jpeg` produce
  extensión `jpeg`, que **sí** está en `ATTACHMENT_ALLOWLIST` (`allowlist.ts:18`), así que
  no hace falta normalizarla a `jpg`.
- **Guard `atCap`/`disabled`:** mismo criterio que `AttachmentDropZone`/`addFiles` — no se
  duplica la validación de tamaño (`maxBytes`) ni de tipo aquí, `addFiles` →
  `addAttachment` → `classifyFile`/límites ya la hacen y reportan por `toast` (CA-04.4,
  CA-04.5 se resuelven gratis reusando el pipeline existente).
- **No se toca `AttachmentDropZone.tsx`:** el paste no depende de que esa zona tenga foco ni
  esté siquiera renderizada (p. ej. si `atCap` ya ocultó el dropzone) — de hecho, si
  `atCap` es `true` tanto el dropzone como el paste están inactivos, consistente.
- **Múltiples instancias montadas a la vez:** hoy `AttachmentsSection` se usa siempre de a
  una por pantalla (drawer de tarea, o un diálogo de Área/Producto/plantilla — mutuamente
  excluyentes). Si en el futuro hubiera dos montadas simultáneamente, ambas reaccionarían al
  mismo evento de paste (dos toasts) — no es el caso actual, no se agrega guarda para eso
  (Principio V).

## 5. Alternativas descartadas

| Alternativa | Por qué no |
|-------------|------------|
| HU-01: mapa `Record<projectId, tab>` en vez de clave global | Descartado explícitamente por el usuario — más estado para un beneficio no pedido. |
| HU-02: mover `TaskDetailDrawer` a vivir dentro del árbol de `AppLayout` (como `AssistantPanel`) para que el flujo flexbox los ordene solo, en vez de `fixed` + cálculo de `right` | Cambio de arquitectura mucho más grande (el drawer se abre desde `TasksTab`/`AreasTab`, no desde `AppLayout`; moverlo requeriría un store global de "tarea abierta" o portal) para el mismo resultado visual — el cálculo de `right` dinámico es autocontenido y no toca cómo se abre/cierra el drawer hoy (Principio V). |
| HU-03: mostrar todas las tarjetas de confirmación pendientes de una tanda a la vez (en vez de auto-aprobar las siguientes) | Requeriría rediseñar `runAgentTurn.ts` para separar "fase de confirmación" de "fase de ejecución" por ronda de tool calls — el modelo hoy decide sus próximos tool calls dinámicamente en base al resultado del anterior (loop ReAct-like), así que ni siquiera hay una "tanda completa" conocida de antemano para mostrar junta. Auto-aprobar el resto del turno logra el mismo alivio ("no confirmar una por una") sin ese rediseño. |
| HU-03: auto-aprobación persistida (toda la conversación o entre sesiones) | Descartado explícitamente por el usuario — riesgo de que la IA modifique datos sin confirmar en mensajes futuros no relacionados que el usuario ya olvidó que quedaron auto-aprobados. |
| HU-04: pegar en un `<input type="file">` oculto vía `document.execCommand` o similar | Innecesario — `DataTransferItem.getAsFile()` del evento `paste` ya da acceso directo al `Blob`/`File` de la imagen, sin necesidad de simular un file picker. |
| HU-04: agregar el listener de paste en `AttachmentDropZone.tsx` en vez de `AttachmentsSection.tsx` | El dropzone no se renderiza cuando `atCap` es `true` (línea 159-166 de `AttachmentsSection.tsx`) — si el listener viviera ahí, pegar una imagen al tope del cupo simplemente no haría nada en vez de (potencialmente) mostrar un mensaje; viviendo en la sección padre, el guard `atCap` es explícito y centralizado. |
