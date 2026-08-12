# Design 054 — Kanban usable en el teléfono

Diseño técnico anclado al código post-010/011/016:
carrusel `snap` &lt; `sm`, `TouchSensor` + bloqueo cross-column, drawer full-width móvil,
`MobileBottomNav` z-30 + `main` `pb-16`.

Principio: **mejorar el camino táctil existente**, no clonar el Kanban en un “MobileTasksPage”.

---

## 0. Mapa de archivos

| Área | Archivos | Naturaleza |
|------|----------|------------|
| Pager | **nuevo** `kanban/KanbanColumnPager.tsx` (+ test de pure helpers) | Chips + scroll |
| Scroll sync | **nuevo** `kanban/useSnapColumnIndex.ts` | IntersectionObserver / scroll |
| Board | `TasksTab.tsx` | Wiring pager, toolbar compacta, refs por columna |
| Column | `KanbanColumn.tsx` | `id`/`data-status` + ref forward si hace falta |
| Card | `TaskCard.tsx` | Targets 44px, layout acciones móvil |
| Drawer | `TaskDetailDrawer.tsx` | Full viewport, footer estado, composer |
| Ops | `projectOps` / handlers ya en TasksTab | Sin cambio de modelo |

Sin schema, sin npm deps, sin cambiar la política de sensores de 010.

---

## 1. Pager de columnas (HU-01)

### 1.1 Componente

```tsx
// KanbanColumnPager.tsx
interface Props {
  columns: { status: TaskStatus; count: number }[];
  active: TaskStatus;
  onSelect: (status: TaskStatus) => void;
}
```

UI: fila horizontal scrollable de chips (no envuelve en 2 filas si se puede evitar):

```
[ Por hacer 3 ] [ En curso 1 ] [ Bloqueada 0 ] [ Hecha 5 ]
     ↑ active: bg-foreground text-background o ring
```

Solo se monta cuando el board está en modo carrusel — **no** usar solo `useIsMobile()`
(que hoy corta en `md` 768px) sino el **mismo breakpoint del carrusel: &lt; sm (640px)**.

```ts
const isCarousel = !useBreakpoint("sm"); // alineado a sm:grid-cols-2 del board
```

### 1.2 Scroll sync — `useSnapColumnIndex`

El contenedor del board ya es:

```tsx
<div className="flex snap-x snap-mandatory gap-3 overflow-x-auto sm:grid ...">
```

Pasos:

1. `boardRef` en ese div.
2. Cada `KanbanColumn` root recibe `data-kanban-status={status}` y `id={`kanban-col-${status}`}`.
3. `IntersectionObserver` con `root: boardRef`, `threshold: 0.6` (o ratio mayor del ancho
   visible) actualiza `activeStatus`.
4. `onSelect(status)` →  
   `document.getElementById(`kanban-col-${status}`)?.scrollIntoView({ inline: "start", behavior: "smooth" })`  
   o `boardRef.scrollTo({ left: col.offsetLeft - gap, behavior: "smooth" })`.

Preferir **scrollTo sobre el board** para no scrollear la página verticalmente.

### 1.3 Sticky

```tsx
<div className="sticky top-0 z-10 -mx-1 bg-background/95 px-1 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:hidden">
  <KanbanColumnPager ... />
</div>
```

El `top` debe contabilizar si el header del proyecto no es sticky; si el sticky pelea con
tabs del proyecto, smoke y bajar a no-sticky si es peor.

---

## 2. Mover estado — card y drawer (HU-02)

### 2.1 Card — targets

Hoy (`TaskCard.tsx` ~252–290):

```tsx
className="size-8" // 32px — por debajo de 44
```

Cambio:

```tsx
className="size-11 min-w-11 min-h-11" // 44px
// o size-8 md:size-8 con max-sm:size-11
```

Aplicar a: MoveBack, Move, ToggleBlock, More. El drag handle **ya** tiene `min-w/h-[44px]`.

En móvil, opcionalmente **mostrar labels cortos** (“Antes” / “Sig.”) con `sr-only` en desktop
— no obligatorio si el `title`/`aria-label` es claro:

```tsx
aria-label="Mover al siguiente estado"
```

Separar la zona de acciones del `onActivate` del card: ya usan `stopPropagation` — mantener.

### 2.2 Drawer — control de estado de primera clase

En el header del drawer (bajo título o fila de acciones sticky superior/inferior):

```tsx
// MobileStatusBar — visible max-md
<div className="grid grid-cols-4 gap-1 p-2 border-t md:hidden">
  {TASK_COLUMNS.map(status => (
    <Button
      key={status}
      size="sm"
      variant={task.status === status ? "default" : "outline"}
      className="min-h-11 text-[11px] px-1"
      disabled={task.status === status}
      onClick={() => onChangeStatus(status)}
    >
      {shortLabel[status]} // "Por hacer" → "Hacer" / usar taskStatusLabel truncado
    </Button>
  ))}
</div>
```

`onChangeStatus` en `TasksTab` / drawer props:

```ts
mutate(p => ops.updateTask(p, { ...task, status: next }))
// o el helper que ya usan onMove/onMoveBack
```

**Blocked:** el grid de 4 estados ya incluye `blocked`; el botón candado de la card se mantiene.

Desktop: el select/status del drawer unificado (016) se deja; la barra 4 chips es **solo
`md:hidden`** para no duplicar ruido en pantallas grandes. Si el drawer ya tiene un Select de
estado, reutilizarlo en desktop y en móvil **agrandar** ese control en lugar de inventar dos
fuentes de verdad — **preferencia: un solo control de estado en el formulario del drawer,
con clases táctiles en móvil**, y la barra sticky inferior solo si el select queda lejos del
pulgar tras mucho scroll.

Decisión práctica:

1. Asegurar que el campo **Estado** del drawer sea un `<Select>` o chips **arriba del fold**
   en móvil (reordenar secciones: título → estado → resto).
2. Si tras reordenar sigue siendo difícil, añadir footer sticky de estados.

### 2.3 Sensores (sin cambio de política)

```ts
// TasksTab — mantener
useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } })
// onDragOver: if (isTouchDragRef.current && toCol !== fromCol) return prev;
```

No reintroducir cross-column touch.

---

## 3. Drawer full-screen y comentarios (HU-03)

### 3.1 Layout móvil

Hoy:

```tsx
"fixed inset-y-0 z-50 flex w-full max-w-[800px] ... md:max-w-none"
// width: drawerWidth (state, default puede ser ~400)
```

En &lt; `md`:

```tsx
className={cn(
  "fixed z-50 flex flex-col bg-background shadow-lg",
  isMobile
    ? "inset-0 w-full max-w-none border-0"
    : "inset-y-0 border-l max-w-[800px] ...",
)}
style={isMobile ? undefined : { width: drawerWidth, right: ... }}
```

- `isMobile = !useBreakpoint("md")` (drawer ya usa `md` para resize handle).
- `z-50` &gt; bottom nav `z-30` → el drawer tapa la nav (correcto).
- Padding inferior del contenido:  
  `pb-[max(1rem,env(safe-area-inset-bottom))]`

### 3.2 Comentarios

Localizar el composer en `TaskDetailDrawer` (sección comentarios). Asegurar:

```tsx
// contenedor de la lista + composer
<div className="flex min-h-0 flex-1 flex-col">
  <div className="min-h-0 flex-1 overflow-y-auto">...</div>
  <div className="shrink-0 border-t bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
    <Textarea className="min-h-[44px] text-base" /> // text-base evita zoom iOS
    <Button className="min-h-11">Comentar</Button>
  </div>
</div>
```

`text-base` (16px) en inputs móviles evita el auto-zoom de iOS Safari.

Al `focus` del textarea:  
`composerRef.current?.scrollIntoView({ block: "nearest" })`.

### 3.3 Body scroll lock

Cuando el drawer está abierto en móvil, lock de `document.body.style.overflow` (mismo patrón
que sidebar/assistant en `AppLayout`). Puede vivir en el drawer con `useEffect`.

---

## 4. Toolbar compacta (HU-04)

En `TasksTab` la fila de controles (~571+) se vuelve:

```
[ 🔍 busqueda flex-1 ] [ Filtros ] [ ⋮ más ] [ + ]
```

Acciones secundarias (WIP config, archivadas, selección múltiple, toggle vista) entran al menú
**Más** en &lt; `sm`. Toggle lista/kanban puede quedarse visible como icon-only.

`SprintSwitcher`: en móvil apilar (ya `flex-col`); aumentar hit area de chevrons a `size-11`.

No reescribir el switcher completo.

---

## 5. Nueva tarea (HU-05)

Opciones:

| A. Botón `+` en header de cada columna | Ya existe `onAdd` en KanbanColumn |
| B. FAB fixed bottom-right | Compite con bottom nav |

**Decisión: potenciar A** — el `+` del header de columna debe ser `min-h/w-11` en carrusel.
Además, en toolbar móvil un botón **“Nueva”** que llama `onAdd` de la **columna activa**
(estado del pager). Así el pulgar no depende de scrollear al header de la columna.

```ts
function addInActiveColumn() {
  openCreateDialog(activeStatus); // status del pager
}
```

---

## 6. Helpers testeables

```ts
// kanban/columnScroll.ts
export function clampScrollLeft(left: number, max: number): number
export function pickActiveStatus(
  entries: { status: TaskStatus; intersectionRatio: number }[],
  fallback: TaskStatus,
): TaskStatus
```

Tests unitarios de `pickActiveStatus` (mayor ratio gana; empate → orden de TASK_COLUMNS).

---

## 7. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| `scrollIntoView` mueve la página vertical | scroll solo en `boardRef` |
| Observer marca mal la columna activa | threshold alto + fallback a la de mayor ratio |
| iOS zoom en inputs | `text-base` en campos del drawer móvil |
| FAB vs bottom nav | no FAB; usar toolbar + header columna |
| Regresión desktop drag | no tocar sensores ni onDragOver mouse path |
| TasksTab aún más grande | extraer pager y toolbar a componentes |

---

## 8. Secuencia

1. Helpers + `data-kanban-status` + pager + observer  
2. Targets card + estado en drawer + text-base inputs  
3. Full-screen drawer + body lock + composer  
4. Toolbar compacta + Nueva en columna activa  
5. Smoke + cierre  

Ver `tasks.md`.
