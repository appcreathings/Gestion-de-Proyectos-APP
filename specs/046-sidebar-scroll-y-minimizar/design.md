# Design 046 — Scroll interno del sidebar + modo minimizado

> Decisiones técnicas para `spec.md`. Todo el cambio vive en `AppLayout.tsx` +
> `WorkspaceStatus.tsx`. Sin cambios de schema, sin dependencias nuevas.

## 0. Mapa de archivos

| Área | Archivo | Cambio |
|------|---------|--------|
| A · Altura real del shell | `src/components/layout/AppLayout.tsx` | Div raíz `h-full` → `h-dvh` |
| B · Scroll del nav | `src/components/layout/AppLayout.tsx` (`SidebarContent`) | `<nav>` gana `overflow-y-auto min-h-0` |
| C · Estado + persistencia | `src/components/layout/AppLayout.tsx` (`AppLayout`) | `sidebarCollapsed` (lazy init + localStorage) |
| D · Ancho del `<aside>` | `src/components/layout/AppLayout.tsx` (`AppLayout`) | Clase de ancho condicional + transición |
| E · Rail de íconos | `src/components/layout/AppLayout.tsx` (`SidebarContent`) | Props `collapsed`/`onToggleCollapse`; header, buscador, nav, asistente colapsados |
| F · `WorkspaceStatus` colapsado | `src/components/layout/WorkspaceStatus.tsx` | Prop `collapsed`; variante compacta |

## 1. Fix de altura (root cause)

En `AppLayout.tsx`, la función `AppLayout()` retorna hoy:

```tsx
return (
  <div className="flex h-full">
```

Cambiar a:

```tsx
return (
  <div className="flex h-dvh">
```

- `h-dvh` (`height: 100dvh`) es una utilidad nativa de Tailwind desde 3.4 (el repo usa
  `3.4.19`, confirmado en `node_modules/tailwindcss/package.json`) — no requiere tocar
  `tailwind.config.js`.
- Es **independiente de la cadena de ancestros** (`html`/`body`/`#root`), a diferencia de
  `h-full` (`height: 100%`), que hoy no resuelve a nada útil porque `html`/`body` no definen
  `height: 100%` en `src/index.css`. Por eso no hace falta tocar `index.css` ni `index.html`.
- `dvh` en vez de `vh` a propósito: en móvil, `100vh` no descuenta la barra de
  direcciones del navegador (causa overflow de 1 pantalla extra); `dvh` sí se ajusta. Coherente
  con que el bottom nav móvil ya maneja `env(safe-area-inset-bottom)` con el mismo espíritu.
- Este único cambio de línea es lo que hace que `overflow-y-auto` de `<main>`
  (`AppLayout.tsx:347`) y el `overflow-hidden` de su contenedor (`AppLayout.tsx:329`) —
  ambos **ya presentes** en el código — empiecen a comportarse como un app-shell real
  (scroll interno) en vez de dejar que la página completa scrollee.

## 2. Scroll del `<nav>` del sidebar

En `SidebarContent`, el `<nav>` actual:

```tsx
<nav className="flex-1 space-y-0.5 px-3 py-2">
```

pasa a:

```tsx
<nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
```

- `min-h-0` es imprescindible: por default, un hijo `flex` tiene `min-height: auto`, que en
  la práctica le impide encogerse por debajo de la altura de su contenido — así que
  `overflow-y-auto` sin `min-h-0` **no hace nada visible** (no hay error de consola; el nav
  simplemente sigue empujando a sus hermanos). Verificar con DevTools que el `<nav>` tenga
  `scrollHeight > clientHeight` cuando el contenido excede la ventana.
- Este cambio, sumado al fix de altura (§1), es lo que da scroll real al sidebar sin mover
  el header (logo + buscador) ni el pie (Asistente + `WorkspaceStatus`), que quedan **fuera**
  de este `<nav>` y no llevan `overflow-y-auto`.
- Aplica igual al `<aside>` de escritorio y al drawer móvil — ambos montan
  `<SidebarContent>`, así que el fix es automático en los dos sin lógica adicional.

## 3. Estado de colapso + persistencia

En `AppLayout()`, junto a los demás `useState`:

```tsx
const SIDEBAR_COLLAPSED_KEY = "hito:sidebar-collapsed"; // módulo, fuera del componente

// ...dentro de AppLayout():
const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
  try {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
});

function toggleSidebarCollapsed() {
  setSidebarCollapsed((prev) => {
    const next = !prev;
    try {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
    } catch {
      // Ignore localStorage errors
    }
    return next;
  });
}
```

- Mismo patrón exacto que `viewMode` en `TasksTab.tsx:96-113` (lazy initializer +
  try/catch silencioso en lectura y escritura) — no se crea un hook genérico nuevo para un
  solo punto de uso (Principio V).
- `SIDEBAR_COLLAPSED_KEY` como constante de módulo (no dentro del componente) para no
  recrear el string en cada render — mismo nivel de detalle que otras claves del repo, que
  suelen ser literales inline; usar constante acá es aceptable porque se referencia dos veces
  (lectura y escritura).

## 4. Ancho del `<aside>` de escritorio

```tsx
<aside
  className={cn(
    "hidden shrink-0 flex-col border-r border-border/70 bg-background lg:flex",
    "transition-[width] duration-200 ease-in-out",
    sidebarCollapsed ? "w-16" : "w-56",
  )}
>
  <SidebarContent collapsed={sidebarCollapsed} onToggleCollapse={toggleSidebarCollapsed} />
</aside>
```

- `w-16` (64px) alcanza para un ícono `size-4`/`size-5` centrado con padding cómodo — mismo
  criterio de tamaño que los botones `size-8`/`size-9` ya usados en el archivo.
- El drawer móvil (`<aside>` dentro del bloque `{!isDesktop && (...)}`) **no** cambia: sigue
  usando `<SidebarContent onNavClick={() => setSidebarOpen(false)} />` sin los props de
  colapso — el botón de colapsar simplemente no se renderiza ahí (ver §5).

## 5. `SidebarContent` — props y rail de íconos

Firma actual:

```tsx
function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
```

Nueva:

```tsx
function SidebarContent({
  onNavClick,
  collapsed = false,
  onToggleCollapse,
}: {
  onNavClick?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
```

El uso móvil no pasa `collapsed`/`onToggleCollapse` → `collapsed` es `false` y
`onToggleCollapse` es `undefined`, así que todo lo condicionado a `onToggleCollapse` (el
botón de toggle) no se monta ahí — sin necesidad de chequear `useBreakpoint` dentro de
`SidebarContent`.

### 5.1 Header (logo)

Actual: el `<Link>` completo es el único elemento del header, con el badge de versión
`ml-auto`.

```tsx
<Link
  to={ROUTES.landing}
  onClick={onNavClick}
  title={collapsed ? "Hito" : undefined}
  className={cn(
    "flex h-14 items-center gap-2",
    collapsed ? "justify-center px-2" : "px-5",
  )}
>
  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
    <FolderKanban className="size-3.5" />
  </div>
  {!collapsed && <span className="text-sm font-semibold tracking-tight">Hito</span>}
  {!collapsed && (
    <span className="ml-auto font-mono text-[10px] text-muted-foreground">v0.1</span>
  )}
</Link>
```

(El `<Link>` se mantiene como único elemento interactivo del header — no se le agrega un
`<button>` anidado adentro; el toggle vive en su propia fila, ver §5.2.)

### 5.2 Botón de colapsar/expandir

Nueva fila, **reemplaza** al botón "Buscar…" solo en su posición relativa (el botón de
buscar se mantiene tal cual, debajo). Reusa las mismas clases del botón de búsqueda para
consistencia visual:

```tsx
{onToggleCollapse && (
  <button
    type="button"
    onClick={onToggleCollapse}
    aria-label={collapsed ? "Expandir barra lateral" : "Minimizar barra lateral"}
    aria-pressed={collapsed}
    title={collapsed ? "Expandir barra lateral" : "Minimizar barra lateral"}
    className={cn(
      "mx-3 mb-2 flex items-center gap-2 rounded-md border border-border/70 bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground",
      collapsed && "mx-auto w-8 justify-center px-0",
    )}
  >
    {collapsed ? <PanelLeftOpen className="size-3.5" /> : <PanelLeftClose className="size-3.5" />}
    {!collapsed && <span>Minimizar</span>}
  </button>
)}
```

Import nuevo en el bloque de `lucide-react` ya existente:

```tsx
import {
  // ...íconos actuales...
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
```

### 5.3 Botón de búsqueda (⌘K)

```tsx
<button
  onClick={() => { /* sin cambios */ }}
  title={collapsed ? "Buscar… (⌘K)" : undefined}
  className={cn(
    "mx-3 mb-2 flex items-center gap-2 rounded-md border border-border/70 bg-background px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground",
    collapsed && "mx-auto w-8 justify-center px-0",
  )}
>
  <Search className="size-3.5" />
  {!collapsed && (
    <>
      <span className="flex-1 text-left">Buscar…</span>
      <kbd className="rounded border border-border/70 bg-muted px-1.5 text-[10px] font-mono">
        ⌘K
      </kbd>
    </>
  )}
</button>
```

### 5.4 `<nav>` — destinos + árbol

```tsx
<nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
  {NAV.map(({ to, label, icon: Icon, end }) => (
    <div key={to}>
      <NavLink
        to={to}
        end={end}
        onClick={onNavClick}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
          cn(
            "flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
            collapsed && "justify-center px-0",
            isActive
              ? "bg-foreground/5 text-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
          )
        }
      >
        <span className="relative shrink-0">
          <Icon className="size-4" />
          {collapsed && to === ROUTES.notifications && unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-foreground" />
          )}
        </span>
        {!collapsed && <span className="flex-1">{label}</span>}
        {!collapsed && to === ROUTES.notifications && unread > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-semibold text-background">
            {unread}
          </span>
        )}
      </NavLink>
      {to === ROUTES.projects && !collapsed && (
        <ProjectTree onNavigate={onNavClick} className="mt-0.5" />
      )}
    </div>
  ))}
</nav>
```

- El badge numérico completo (D9 del spec) sigue igual en expandido; en colapsado se
  reemplaza por un punto de 8px superpuesto arriba-derecha del ícono — sin número (no entra
  legible en un ícono de 16px).
- `ProjectTree` deja de montarse en colapsado — no se le agrega ningún prop nuevo a
  `ProjectTree.tsx`, el archivo no se toca.

### 5.5 Botón de Asistente

```tsx
<div className={cn("px-3 pb-3", collapsed && "px-2")}>
  <button
    onClick={() => { toggleAssistant(); onNavClick?.(); }}
    aria-pressed={assistantOpen}
    title={collapsed ? "Asistente (⌘J)" : undefined}
    className={cn(
      "flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
      collapsed && "justify-center px-0",
      assistantOpen
        ? "bg-foreground/5 text-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-foreground",
    )}
  >
    <Sparkles className="size-4 shrink-0" />
    {!collapsed && <span className="flex-1 text-left">Asistente</span>}
    {!collapsed && (
      <kbd className="rounded border border-border/70 bg-muted px-1.5 text-[10px] font-mono">
        ⌘J
      </kbd>
    )}
  </button>
</div>
<WorkspaceStatus collapsed={collapsed} />
```

## 6. `WorkspaceStatus` colapsado

Firma actual: `export function WorkspaceStatus()`. Nueva:

```tsx
export function WorkspaceStatus({ collapsed = false }: { collapsed?: boolean }) {
```

Todos los hooks/estado existentes (`mode`, `adapter`, `writeStatus`, `productCount`, etc.)
se mantienen **arriba**, sin cambios — siguen calculándose siempre (reglas de hooks). Lo que
cambia es qué se **renderiza**: antes de los `return` existentes de cada rama, insertar un
resumen colapsado equivalente a esa rama. Concretamente, en cada uno de los 4 puntos de
retorno actuales (filesystem+error, filesystem+writing, filesystem+synced, browser-mode),
envolver el contenido así — ejemplo con la rama `synced` (las otras 3 siguen el mismo
patrón, cambiando solo ícono/color/texto del `title`):

```tsx
if (mode === "filesystem" && writeStatus !== "error" && writeStatus !== "writing") {
  if (collapsed) {
    return (
      <div className="border-t border-border/70 px-2 py-3" title="Sincronizado · carpeta local">
        <div className="mx-auto flex size-8 items-center justify-center rounded-md text-success">
          <CheckCircle2 className="size-4" />
        </div>
      </div>
    );
  }
  return (
    <div className="border-t border-border/70 px-5 py-3 font-mono text-[10px] text-muted-foreground">
      {/* ...contenido actual sin cambios... */}
    </div>
  );
}
```

Aplicar el mismo `if (collapsed) { return (...) }` al inicio de cada una de las 4 ramas
existentes, con:

| Rama | Ícono (ya importado) | Color | `title` |
|------|----------------------|-------|---------|
| Error de escritura | `AlertCircle` | `text-destructive` | `"Error de escritura — expandí el sidebar para reintentar"` (D10 riesgo) |
| Escribiendo | `Loader2` (con `animate-spin`) | `text-muted-foreground` | `"Escribiendo..."` |
| Sincronizado | `CheckCircle2` | `text-success` | `"Sincronizado · carpeta local"` |
| Navegador sin sincronizar | `HardDriveDownload` | `text-warning` | `"Sin sincronizar · en este navegador — expandí el sidebar para conectar una carpeta"` |

Ninguno de los 4 resúmenes colapsados incluye botones de acción (Reintentar, Conectar
carpeta, Exportar copia) — coherente con D10 del spec. `ConnectFolderDialog` sigue
montado igual (el `dialogOpen` state no cambia), simplemente no hay forma de abrirlo desde
colapsado.

## 7. Accesibilidad

- Botón de toggle: `type="button"`, `aria-label` dinámico según estado, `aria-pressed`,
  `title` (tooltip nativo + accesible para lectores que sí muestran `title`).
- Íconos de nav en colapsado: `title` en el `NavLink` (atributo HTML estándar, funciona en
  cualquier elemento, incluyendo los que React Router renderiza como `<a>`).
- Foco visible: no se toca `globals.css`/Tailwind — el estilo de foco ya viene del reset
  global (`@layer base` en `src/index.css:87`, `outline-none ring-2 ring-ring ...`), se
  aplica igual a los botones nuevos sin declarar nada extra.

## 8. Orden de implementación sugerido

1. **Fix de altura** (§1) — un solo cambio de clase, bajo riesgo aislado, pero es la base de
   todo lo demás. Verificar con smoke inmediatamente después (no esperar a las fases
   siguientes) que no rompe ninguna página existente.
2. **Scroll del nav** (§2) — depende de 1.
3. **Estado + persistencia** (§3).
4. **Ancho del `<aside>`** (§4) — depende de 3.
5. **Rail de íconos en `SidebarContent`** (§5.1–5.5) — depende de 3 y 4.
6. **`WorkspaceStatus` colapsado** (§6) — depende de 5 (necesita el prop `collapsed` que le
   pasa `SidebarContent`).
7. Smoke manual completo (ver `tasks.md` Fase F) + typecheck/tests/lint.

## 9. Alternativas descartadas

| Alternativa | Por qué no |
|-------------|------------|
| Arreglar la altura tocando `html, body { height: 100% }` en `index.css` | Cambio global de mayor superficie (afecta landing, blog, docs, todas las páginas fuera de `/app`, que hoy dependen del scroll de página completa y no fueron auditadas en este spec); `h-dvh` local a `AppLayout.tsx` es igual de efectivo y de alcance mínimo (Principio V). |
| Sidebar redimensionable con drag handle (ancho arbitrario, no solo 2 estados) | No fue lo pedido; agrega complejidad de estado (ancho continuo, límites min/max, persistencia de un número en vez de un booleano) sin beneficio claro sobre el pedido literal ("minimizar"). |
| Tooltip enriquecido con Radix `Tooltip` (delay configurable, mejor estética) | No hay Tooltip en el repo hoy; agregar una dependencia nueva solo para esto viola Principio V. `title` nativo cubre el caso de uso (ver el nombre de la sección al pasar el mouse). |
| Ocultar el sidebar por completo en vez de rail de íconos | Descartado explícitamente por el usuario — pierde acceso de un clic a la navegación. |
| Mantener `ProjectTree` visible en colapsado como mini-puntos sin texto | Tercer modo intermedio no pedido; con nombres de proyecto reales un punto sin texto no es útil, y con tooltip por cada punto se vuelve una lista de tooltips apilados poco usable. Descartado, sigue D5. |
