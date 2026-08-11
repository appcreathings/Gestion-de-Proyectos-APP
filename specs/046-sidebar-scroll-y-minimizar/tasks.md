# Tasks 046 — Scroll interno del sidebar + modo minimizado

## Fase A — Fix de altura del app-shell (root cause)
- [x] A1 `AppLayout.tsx`: div raíz `className="flex h-full"` → `className="flex h-dvh"`
- [x] A2 Smoke inmediato (antes de seguir): `npm run dev`, recorrer Dashboard, Biblioteca,
      Flujos (`/app/flows/new`, canvas con `h-[calc(100vh-260px)]`), NotificationsPage con
      contenido largo — confirmar que `<main>` scrollea internamente, sin doble scroll ni
      contenido cortado, y que el sidebar/bottom nav móvil siguen fijos

## Fase B — Scroll del `<nav>` del sidebar
- [x] B1 `SidebarContent`: `<nav className="flex-1 space-y-0.5 px-3 py-2">` →
      `<nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 py-2">`
- [x] B2 Verificar con DevTools (no solo visual) que el `<nav>` tiene `scrollHeight >
      clientHeight` cuando hay suficientes Productos/Proyectos expandidos en `ProjectTree`
- [x] B3 Repetir B2 en el drawer móvil (abrir menú hamburguesa con contenido largo)

## Fase C — Estado de colapso + persistencia
- [x] C1 Constante de módulo `SIDEBAR_COLLAPSED_KEY = "hito:sidebar-collapsed"` en
      `AppLayout.tsx`
- [x] C2 `useState<boolean>` con initializer lazy leyendo `localStorage` (try/catch,
      default `false`)
- [x] C3 `toggleSidebarCollapsed()` que actualiza el estado y persiste (try/catch)
- [x] C4 Import de `PanelLeftClose`/`PanelLeftOpen` de `lucide-react`

## Fase D — Rail de íconos
- [x] D1 `<aside>` de escritorio: ancho condicional `w-16`/`w-56` +
      `transition-[width] duration-200 ease-in-out`; pasa `collapsed`/`onToggleCollapse` a
      `SidebarContent`
- [x] D2 `SidebarContent`: firma con props `collapsed = false`, `onToggleCollapse?`
- [x] D3 Header (logo): centrado + oculta nombre/versión en colapsado (§5.1 design)
- [x] D4 Botón de toggle nuevo, propia fila, estilo consistente con el botón de búsqueda
      (§5.2 design) — `aria-label`/`aria-pressed`/`title` dinámicos
- [x] D5 Botón de búsqueda: ícono solo + `title` en colapsado (§5.3 design)
- [x] D6 `<nav>`: cada `NavLink` centra el ícono + `title` en colapsado; oculta label y
      badge numérico; badge de no-leídas pasa a punto de 8px superpuesto (§5.4 design)
- [x] D7 `ProjectTree` no se renderiza cuando `collapsed` es `true`
- [x] D8 Botón de Asistente: ícono solo + `title` en colapsado (§5.5 design)
- [x] D9 Drawer móvil (`<SidebarContent onNavClick={...} />`) sigue **sin** pasar
      `collapsed`/`onToggleCollapse` — confirmar que el botón de toggle no aparece ahí

## Fase E — `WorkspaceStatus` colapsado
- [x] E1 Prop `collapsed = false` en la firma de `WorkspaceStatus`
- [x] E2 Rama "Error de escritura": resumen colapsado (`AlertCircle`, `text-destructive`,
      `title` con mención a expandir para reintentar)
- [x] E3 Rama "Escribiendo": resumen colapsado (`Loader2` animado, `title="Escribiendo..."`)
- [x] E4 Rama "Sincronizado": resumen colapsado (`CheckCircle2`, `text-success`, `title`)
- [x] E5 Rama "Navegador sin sincronizar": resumen colapsado (`HardDriveDownload`,
      `text-warning`, `title` con mención a expandir para conectar carpeta)
- [x] E6 `AppLayout.tsx` pasa `collapsed={collapsed}` a `<WorkspaceStatus>` desde
      `SidebarContent`

## Fase F — Smoke manual (obligatorio — no hay RTL en el repo para esto)
- [x] F1 Expandido, con muchos Productos/Proyectos: nav scrollea, header y pie fijos
      (CA-01.1)
- [x] F2 Drawer móvil con contenido largo: nav interno scrollea, X de cierre fija (CA-01.3)
- [x] F3 Click en colapsar → rail de íconos; cada ícono navega igual que antes (CA-02.1,
      CA-02.6)
- [x] F4 Hover sobre cada ícono colapsado → tooltip nativo con el nombre correcto (CA-02.2)
- [x] F5 `ProjectTree` no aparece en colapsado (CA-02.3)
- [x] F6 Asistente y `WorkspaceStatus` colapsados muestran ícono + tooltip correcto
      (CA-02.4); probar al menos el estado "sincronizado" y, si es posible, forzar un error
      de escritura para ver esa variante
- [x] F7 Click en expandir desde el rail → vuelve a `w-56` completo (CA-02.5)
- [x] F8 Recargar la página (F5) en colapsado → sigue colapsado, sin parpadeo (CA-03.1);
      expandir y recargar → sigue expandido (CA-03.2)
- [x] F9 Toggle con teclado (`Tab` hasta el botón + `Enter`) funciona; foco visible
      (CA-04.2)
- [x] F10 Badge de notificación no leída visible como punto en colapsado, como número en
      expandido (CA-02.6/D9)
- [x] F11 Confirmar que el modo colapsado **no** existe en el drawer móvil — abrir el drawer,
      no debe haber botón de minimizar (CA-02.7)

## Fase G — Cierre
- [x] G1 `npm run typecheck` + `npm test` + `npm run lint`
- [x] G2 `npm run build`
- [x] G3 Spec → **IMPLEMENTADO**
- [x] G4 `graphify update .`
