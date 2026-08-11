# Spec 046 — Scroll interno del sidebar + modo minimizado (rail de íconos)

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/046-sidebar-scroll-y-minimizar/` · Fecha: 2026-08-11
> Baseline al empezar: `SCHEMA_VERSION` **19** (sin bump de schema — feature pura de UI)
> Depende de: nada (no toca dominio ni storage)
> Principios: **IV** (diseño limpio), **V** (simplicidad incremental)

## 1. Contexto

El sidebar de escritorio (`AppLayout.tsx` → `SidebarContent`) es una columna flex fija de
`w-56` con: header (logo+nombre), botón de búsqueda (⌘K), `<nav>` con los 11 destinos de
`NAV` + el árbol Producto→Proyecto (`ProjectTree`, colapsable por producto), botón de
Asistente, y `WorkspaceStatus` al pie. Hoy no tiene forma de minimizarse ni de hacer scroll
propio.

**Root cause confirmado (leído en código, no es hipótesis) de por qué "no scrollea":** el
layout raíz de `AppLayout.tsx:282` es `<div className="flex h-full">`. Esa clase depende de
que toda la cadena de ancestros (`#root` en `index.html:17` ya tiene `class="h-full"`, pero
`html`/`body` en `src/index.css` **no** definen `height: 100%` en ningún lado — se verificó
con grep en todo `src/index.css`). Un `height: 100%` sobre una cadena de ancestros con altura
`auto` se resuelve como si no tuviera valor (spec CSS): el div raíz de `AppLayout` **no** está
realmente anclado al viewport, crece con el contenido, y es **la página completa** la que
scrollea — no `<main>` de forma independiente, aunque `<main>` ya tiene `overflow-y-auto`
(`AppLayout.tsx:347`) y su contenedor padre ya tiene `overflow-hidden`
(`AppLayout.tsx:329`), como si el patrón "app-shell con altura fija + scroll interno" ya
estuviera asumido en el código pero nunca terminado de anclar. Mismo problema afecta al
`<nav>` del sidebar: sin una altura real acotada arriba, no hay contenedor que pueda
scrollear — el `<nav className="flex-1 ...">` (`AppLayout.tsx:109`) no tiene
`overflow-y-auto` hoy, y aunque lo tuviera, sin el fix de altura no haría nada.

**Consecuencia real para el usuario:** con varios Productos/Proyectos, el árbol
`ProjectTree` expandido empuja `WorkspaceStatus` fuera de la vista y, en vez de scrollear
solo el sidebar, scrollea la página entera (sidebar incluido) — se pierde el acceso rápido a
navegación mientras se lee contenido largo del área principal.

**Pedido del usuario:** (1) que el sidebar tenga scroll propio (nav scrollea, header y pie
quedan fijos), y (2) un botón para minimizarlo a un rail de solo íconos, para ganar espacio
horizontal en pantallas más chicas o cuando se quiere más foco en el contenido.

## 2. Objetivo

1. Corregir la cadena de altura del app-shell (`AppLayout.tsx`) para que el patrón
   "header/pie fijos + contenido scrolleable" que el código ya insinúa (`overflow-hidden`/
   `overflow-y-auto` ya presentes) funcione de verdad.
2. El `<nav>` del sidebar (destinos + árbol de proyectos) scrollea de forma independiente;
   el header (logo, buscador) y el pie (Asistente, `WorkspaceStatus`) quedan siempre
   visibles, sin scrollear con el nav.
3. Agregar un botón para minimizar el sidebar de escritorio a un **rail de íconos** (~64px)
   con tooltip nativo (`title`) al pasar el mouse por cada ítem, y expandirlo de nuevo.
4. El estado colapsado/expandido se recuerda entre sesiones (`localStorage`).

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| D1 | Fix de altura: `AppLayout.tsx` cambia su div raíz de `h-full` a **`h-dvh`** (Tailwind 3.4, ya disponible — se confirmó versión `3.4.19` en `node_modules`). No se toca `index.css`/`index.html`/`#root`. | Autocontenido: `h-dvh` es relativo al viewport, no depende de que `html`/`body` definan altura. `dvh` (no `vh`) para no romperse con la barra de direcciones móvil, mismo criterio que ya usa `env(safe-area-inset-bottom)` en el bottom nav móvil. |
| D2 | El scroll del sidebar vive **solo en el `<nav>`** (`overflow-y-auto` + `min-h-0` — el `min-h-0` es imprescindible en un hijo `flex-1` de un contenedor `flex-col`, si no el navegador ignora el `overflow-y-auto`). Header y pie (`WorkspaceStatus`, botón Asistente) quedan fuera del contenedor scrolleable. | Patrón estándar de app-shell; es literalmente lo que pidió el usuario ("scroll" en el sidebar, no que todo el sidebar se mueva). |
| D3 | El fix de D1/D2 aplica igual al `<aside>` de escritorio y al drawer móvil (ambos usan `SidebarContent`) — mismo componente, mismo fix, sin lógica condicional por breakpoint dentro de `SidebarContent` para esta parte. | Un solo componente, un solo arreglo; el drawer móvil también puede tener muchos proyectos. |
| D4 | Minimizado = **rail de íconos** (`w-16`), no "ocultar del todo". El logo se reduce a solo el ícono cuadrado; la búsqueda, cada destino de `NAV` y el botón de Asistente muestran solo su ícono centrado, con tooltip nativo `title` (sin librería de Tooltip — no existe una en el repo hoy, y agregar Radix Tooltip solo para esto viola Principio V). | Confirmado con el usuario (opción recomendada). Mantiene acceso de un clic a cada sección aun colapsado. |
| D5 | El **árbol `ProjectTree`** (Producto→Proyecto) se **oculta por completo** en modo colapsado — no tiene sentido un árbol de nombres en un rail de solo íconos. Vuelve a aparecer al expandir. | Confirmado con el usuario. Evitar un tercer modo intermedio (íconos + árbol) no pedido. |
| D6 | **Solo escritorio** (`lg` / `useBreakpoint("lg")`). El drawer móvil no gana modo colapsado — ya tiene su propio mecanismo de cierre (botón X, overlay). El prop `onToggleCollapse` de `SidebarContent` simplemente no se pasa en el uso móvil, así el botón de colapsar no se renderiza ahí. | Evita inventar un tercer estado en móvil que nadie pidió; el drawer móvil ya resuelve "ocultar todo" cerrándose. |
| D7 | Persistencia en `localStorage`, clave **`hito:sidebar-collapsed`**, valores `"1"`/`"0"` (string, no JSON — mismo estilo que `kanban-view-mode`/`kanban-drawer-width` en `TasksTab.tsx`/`TaskDetailDrawer.tsx`). Lectura con **initializer lazy** de `useState` (sin flash de expandido→colapsado en el primer render) y try/catch silencioso igual que los precedentes del repo (`// Ignore localStorage errors`). | Confirmado con el usuario. Reusa un patrón ya validado 2 veces en este mismo repo — no se inventa un hook genérico `useLocalStorageState` para un solo uso (Principio V). |
| D8 | Toggle con íconos `PanelLeftClose`/`PanelLeftOpen` de `lucide-react` (confirmados existentes en `node_modules/lucide-react` — ya es dependencia del proyecto). Botón propio, **no** anidado dentro del `<Link>` del logo (evita el problema de accesibilidad de un elemento interactivo dentro de otro). | Sin dependencias nuevas; corrección de accesibilidad HTML básica. |
| D9 | El badge de notificaciones no leídas (`unread > 0`) se sigue mostrando en modo colapsado, como un punto pequeño superpuesto al ícono de Notificaciones (sin el número). En expandido no cambia (sigue con el número, como hoy). | Es información glanceable útil incluso sin texto; perderla del todo en colapsado sería una regresión silenciosa. |
| D10 | `WorkspaceStatus` gana un modo colapsado: un solo ícono centrado con color según estado (sincronizado / escribiendo / error / sin sincronizar) y el texto completo como `title` (tooltip nativo). Las acciones que hoy tiene inline (Conectar carpeta, Reintentar, Exportar copia) **no** están disponibles en colapsado — hay que expandir el sidebar para actuar. | Simplicidad: replicar 4 variantes de texto+botones en un rail de 64px degradaría la lectura; expandir es un clic. Principio IV. |
| D11 | Sin atajo de teclado nuevo para el toggle (no fue pedido). Sin dependencias npm nuevas. Sin cambios de schema/migración. | Principio V — no ampliar el alcance más allá de lo pedido. |
| D12 | Transición de ancho del `<aside>` con `transition-[width] duration-200 ease-in-out` (mismo timing ya usado en el drawer móvil, `AppLayout.tsx:299`/`312`, para consistencia visual). | Reusa un valor ya presente en el archivo en vez de inventar uno nuevo. |

## 4. Historias de usuario y criterios de aceptación

### HU-01 — El sidebar scrollea sin mover el header ni el pie · **núcleo**

**Como** usuario con varios Productos/Proyectos, **quiero** poder scrollear la lista de
navegación **para** seguir viendo el logo/buscador arriba y mi estado de sincronización
abajo sin que se salgan de pantalla.

- **CA-01.1** Con suficientes Productos/Proyectos expandidos en `ProjectTree` para exceder
  la altura de la ventana, el `<nav>` muestra scrollbar vertical propio; el header (logo +
  botón buscar) y el pie (Asistente + `WorkspaceStatus`) permanecen visibles y fijos.
- **CA-01.2** El resto de la app (`<main>`) sigue scrolleando de forma independiente del
  sidebar, como ya diseñaba el código existente (`overflow-y-auto` en `<main>`).
- **CA-01.3** Mismo comportamiento en el drawer móvil (abrir el menú con muchos proyectos →
  el nav interno scrollea, el botón X de cierre en la cabecera del drawer no se mueve).
- **CA-01.4** No hay doble scrollbar visual anidada de forma confusa (el body/página no
  debe scrollear de más al haber contenido largo en `<main>` — verificar visualmente en
  Dashboard o Biblioteca con contenido largo).

### HU-02 — Minimizar el sidebar a rail de íconos

**Como** usuario que quiere más espacio horizontal, **quiero** poder colapsar el sidebar a
solo íconos **para** ganar ancho para el contenido principal sin perder acceso a la
navegación.

- **CA-02.1** Click en el botón de colapsar (`PanelLeftClose`) → el sidebar de escritorio
  se angosta a un rail de íconos (~64px); el botón cambia a `PanelLeftOpen`.
- **CA-02.2** En modo colapsado: cada destino de `NAV` muestra solo su ícono, centrado,
  alcanzable por teclado (`Tab`), con `title` = el nombre de la sección (tooltip nativo del
  navegador al hover).
- **CA-02.3** En modo colapsado, `ProjectTree` no se renderiza (D5).
- **CA-02.4** En modo colapsado, el botón de Asistente y `WorkspaceStatus` muestran solo su
  ícono con `title` descriptivo (D10).
- **CA-02.5** Click en el botón de expandir (`PanelLeftOpen`, ahora en el rail) → vuelve al
  ancho `w-56` con todo el contenido (etiquetas, árbol, textos) visible.
- **CA-02.6** El resto de la navegación sigue funcionando igual en colapsado: click en un
  ícono navega a esa sección; el badge de notificaciones no leídas sigue visible como punto
  (D9).
- **CA-02.7** El modo colapsado **no** aparece en el drawer móvil — ahí el sidebar se ve
  igual que hoy (D6).

### HU-03 — El estado colapsado persiste

**Como** usuario que minimiza el sidebar, **quiero** que se mantenga así **para** no tener
que repetir el clic cada vez que recargo o vuelvo a la app.

- **CA-03.1** Colapsar el sidebar, recargar la página (F5) → el sidebar sigue colapsado, sin
  parpadeo visible de expandido→colapsado en el primer render.
- **CA-03.2** Expandir de nuevo, recargar → sigue expandido.
- **CA-03.3** Si `localStorage` no está disponible (modo privado, cuota excedida) la app no
  rompe — arranca expandido (comportamiento por defecto) y el toggle sigue funcionando en
  memoria durante esa sesión.

### HU-04 — Accesibilidad del toggle

- **CA-04.1** El botón de colapsar/expandir tiene `type="button"`, `aria-label` que describe
  la acción disponible ("Minimizar barra lateral" / "Expandir barra lateral") y
  `aria-pressed={sidebarCollapsed}`.
- **CA-04.2** Alcanzable por teclado, con foco visible (mismo estilo de foco que el resto de
  botones del sidebar, sin CSS custom nuevo).

## 5. Requisitos no funcionales

- Sin nuevas dependencias npm (D4, D8, D11).
- Sin cambios de schema ni migración (`SCHEMA_VERSION` se queda en 19).
- No degradar el comportamiento existente de `<main>`/mobile bottom nav/`DemoBanner` — el
  fix de altura (D1) es el único cambio fuera de `layout/AppLayout.tsx` +
  `layout/WorkspaceStatus.tsx`, y hay que verificar visualmente que ninguna página larga
  (Dashboard, Biblioteca, Flujos) se vea afectada negativamente por el paso de scroll de
  página completa a scroll interno de `<main>`.
- Tests: este spec es mayormente CSS/estructura visual (difícil de testear sin RTL, que el
  repo no tiene — ver precedente en spec 045 §Fase C). Cobertura vía smoke manual
  obligatorio (igual criterio que 045); si hay lógica pura extraíble (p. ej. una función que
  decide el ícono/color de `WorkspaceStatus` colapsado a partir del estado), sí testearla
  con Vitest puro sin DOM.

## 6. Archivos afectados (previsto)

| Archivo | Cambio |
|---------|--------|
| `src/components/layout/AppLayout.tsx` | Div raíz `h-full`→`h-dvh` (D1); `<nav>` con `overflow-y-auto min-h-0` (D2); estado `sidebarCollapsed` + persistencia (D7); `<aside>` de escritorio con ancho condicional + transición (D12); `SidebarContent` gana props `collapsed`/`onToggleCollapse` y renderiza el rail de íconos (D4, D5, D8, D9); botón toggle nuevo |
| `src/components/layout/WorkspaceStatus.tsx` | Prop `collapsed` nueva; variante compacta de ícono+color+`title` (D10) |
| Ningún cambio en `ProjectTree.tsx` (se deja de renderizar desde `AppLayout`, no se le agrega lógica propia de colapso) | — |
| Ningún cambio en dominio/storage/schema | — |

**No tocar:** `src/index.css`, `index.html` (`#root`), `ProjectTree.tsx`, cualquier archivo
de `src/domain/` o `src/storage/`.

## 7. Fuera de alcance

- Sidebar redimensionable a mano (drag handle de ancho arbitrario) — solo dos estados fijos
  (expandido `w-56` / colapsado `w-16`).
- Tooltips enriquecidos (Radix/librería) — solo `title` nativo.
- Atajo de teclado para el toggle.
- Modo colapsado en el drawer móvil.
- Cambiar el contenido o el orden de `NAV`, agregar/quitar destinos.
- Cualquier cambio a `AppGate.tsx`, `ConnectScreen`, landing, blog, u otras páginas fuera de
  `/app` — el fix de altura (D1) es local a `AppLayout.tsx`, no se propaga a otros roots.

## 8. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| El cambio `h-full`→`h-dvh` en el div raíz cambia el comportamiento de scroll de **toda** la app (de "scrollea la página" a "scrollea `<main>` internamente") — puede revelar contenido cortado en alguna página que hoy "funciona por accidente" con scroll de página completa | Smoke manual obligatorio recorriendo las páginas con más contenido potencial: Dashboard, Biblioteca, Flujos (canvas con `h-[calc(100vh-260px)]` en `FlowCanvas.tsx`/`FlowBuilderPage.tsx` — verificar que esos cálculos basados en `100vh` (no `dvh`) siguen viéndose bien con el nuevo contenedor padre), NotificationsPage con muchas notificaciones |
| `min-h-0` es un detalle de flexbox fácil de omitir sin que el error sea obvio en review (el `overflow-y-auto` simplemente no hace nada, sin error de consola) | Verificar explícitamente con DevTools (inspeccionar que el `<nav>` tenga una altura calculada menor a su `scrollHeight`) antes de dar la tarea por hecha |
| El árbol `ProjectTree` desaparece "de golpe" al colapsar sin transición propia, mientras el ancho del `<aside>` sí anima | Aceptable — es contenido, no un problema visual grave; si se ve mal, usar la misma clase de transición que ya trae el archivo, sin inventar timing nuevo |
| `WorkspaceStatus` colapsado pierde las acciones (Conectar carpeta, Reintentar) — un usuario en estado de error podría no notar que hay una acción disponible si no expande | El `title` en colapsado debe incluir explícitamente que hay que expandir para actuar (ej. `title="Error de escritura — expandí el sidebar para reintentar"`) |

## 9. Definición de hecho

- [x] Spec + design + tasks en esta carpeta
- [x] `AppLayout.tsx` con `h-dvh`, `<nav>` scrolleable (`overflow-y-auto min-h-0`), estado de
      colapso persistido, rail de íconos funcionando
- [x] `WorkspaceStatus.tsx` con variante colapsada
- [x] Las 4 HU con sus CA verificadas manualmente (smoke, sin RTL en el repo)
- [x] `npm run typecheck` + `npm test` + `npm run lint` verdes
- [x] Estado → **IMPLEMENTADO**
