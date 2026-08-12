# Spec 054 — Kanban usable en el teléfono

> Estado: **IMPLEMENTADO** (2026-08-11).
> Feature dir: `specs/054-kanban-movil-tactil/` · Fecha: 2026-08-11
> Roadmap: `mobile-kanban` en `src/features/releases/data/roadmap.ts`
>   («Flujo táctil para revisar, comentar y mover tareas desde el móvil»).
> Antecede: 010 (DnD + táctil restringido a reorder + botones de mover), 011 (tablet 2 col),
> 013–016 (drawer + comentarios + edición unificada), 017 (filtros/lista),
> `MobileBottomNav` en `AppLayout` (`pb-16` + safe-area).
> Baseline al empezar: **1096 tests / 109 archivos**, `SCHEMA_VERSION` **19**.
> Principios: **IV** enfocado (PWA web, no app nativa), **V** incremental sobre 010/011.

## 1. Contexto

En el teléfono el Kanban **ya no es un agujero negro**, pero tampoco es un flujo cómodo:

| Ya construido (010 / 011 / layout) | Sigue doliendo en &lt; ~640px |
|------------------------------------|-------------------------------|
| Carrusel `snap` de 1 columna (`min-w-[85vw]`) | No hay **indicador de columna** ni salto rápido entre estados |
| `TouchSensor` delay 250ms; cross-column **bloqueado** en touch | Mover estado depende de flechas `size-8` (32px &lt; 44px táctil) |
| Botones ← / → / bloquear + menú ⋮ en la card | Barra de acciones densa; fácil mis-tap vs abrir drawer |
| Drawer a ancho completo en móvil | No es *sheet* a pantalla completa con footer de acciones; puede pelear con teclado / safe-area |
| `main` con `pb-16` por bottom nav | Drawer `fixed inset-y-0` no hereda ese padding; chrome del proyecto (tabs + sprint + filtros) come altura |
| Comentarios en drawer (014) | Teclado móvil + scroll del drawer poco ensayados como flujo “revisar y comentar en el bondi” |
| Tablet ≥640px → 2 columnas | Fuera de este spec (ya cubierto por 011) |

El roadmap pide honestidad de alcance:

> *Flujo táctil para revisar, comentar y mover tareas desde el móvil — **sin pretender ser una
> app nativa completa**.*

Esta spec cierra el **camino feliz móvil** (abrir proyecto → ver tablero → mover / comentar /
revisar) sin React Native, sin gestos multi-finger fancy, sin modo offline especial.

### 1.1 Qué reutilizamos

- Restricción táctil de 010: drag = reorder intra-columna; cambio de estado = UI explícita.
- Carrusel y grilla responsiva de 011.
- `TaskDetailDrawer`, `ops.updateTask`, comentarios, deep-link `?focus=`.
- `MobileBottomNav` + `useBreakpoint` / `useIsMobile`.
- Vista **Lista** (`KanbanListView`) como alternativa ya existente (puede ser default opcional
  en móvil — ver decisiones).

### 1.2 Qué no es esta spec

- App nativa iOS/Android, Store, push notifications del SO.
- Rediseño completo del shell móvil (rail, “Más”, asistente).
- Drag cross-column en touch (se mantiene la decisión 010).
- Rehacer el Kanban desktop / tablet 2–4 columnas.
- Spec 053 (calendario) — solo se evita romper el toggle de vistas si ya existiera.

## 2. Objetivo

Que un PM con un teléfono (~360–430px de ancho) pueda, en menos de un minuto y sin pelearse
con el UI:

1. Encontrar el tablero de un proyecto  
2. Ver en qué estado está mirando y saltar a otro  
3. Abrir una tarea, leer/comentar, y **moverla de estado** con targets táctiles claros  
4. Volver al tablero sin perder contexto  

…con la app web actual (PWA o navegador), no con una app nativa.

## 3. Decisiones fijadas (no re-preguntar)

1. **Sigue siendo web responsive**, no un shell “mobile-only” paralelo.
2. **Se mantiene** carrusel de 1 columna &lt; `sm` y la regla 010 de no cross-drag táctil.
3. **Mover de estado en móvil** se eleva a un control de primera clase:
   - En card: botones con **mínimo 44×44px** y/o  
   - En drawer: barra fija **“Mover a…”** con los 4 estados (o siguiente/anterior + bloqueada).
4. **Pager de columnas** visible en móvil: chips o dots “Por hacer · En curso · …” que hacen
   `scrollIntoView` / `scrollTo` de la columna (además del swipe).
5. **Drawer móvil = experiencia full-viewport:** `inset-0` (o casi), `z` por encima del bottom
   nav, padding inferior `safe-area` + espacio para teclado; resize handle de desktop **oculto**
   (ya `hidden md:block`).
6. **Toolbar colapsable en móvil:** búsqueda + filtros + acciones secundarias no compiten a
   la vez con el board; patrón “Buscar” expandible + un botón “Filtros”.
7. **Default de vista en móvil:** se mantiene el `viewMode` persistido del usuario; si no hay
   preferencia, default **kanban** (el carrusel mejorado), no forzar lista — la lista sigue a un
   tap. (Si en smoke se demuestra que lista es netamente mejor, se puede cambiar el default
   solo móvil en un follow-up; no se decide por fe.)
8. **Sin schema bump** y sin deps nuevas.
9. **No se toca** la lógica de WIP, bulk selection avanzada ni multi-drag en esta spec; si el
   modo selección estorba en móvil, se oculta o se mueve al menú “Más” de la toolbar.
10. **Comentar** = el flujo del drawer existente, con foco en que el composer y la lista sean
    usables con teclado virtual (scroll al foco, no tap traps).

## 4. Historias de usuario y criterios de aceptación

### HU-01 — Orientarme en el carrusel de columnas

Como PM en el bondi, quiero saber en qué columna estoy y saltar a “Bloqueadas” sin swipes a ciegas.

- **CA-01.1** En viewport &lt; `sm`, bajo el header del board (o sticky sobre el carrusel) hay un
  **pager** con las 4 columnas y conteo (o al menos el nombre).
- **CA-01.2** La columna visible (por scroll snap) se marca como activa en el pager.
- **CA-01.3** Tap en un ítem del pager desplaza el carrusel a esa columna (smooth si el UA lo
  permite) y deja el snap estable.
- **CA-01.4** Swipe horizontal entre columnas sigue funcionando (no se rompe el `snap`).

### HU-02 — Mover tarea con el dedo sin mis-taps

Como PM, quiero pasar una tarea a “En curso” o “Hecha” sin activar drag ni abrir el drawer por error.

- **CA-02.1** Controles primarios de mover en la card tienen área táctil ≥ **44×44px** (padding
  incluido), no solo el icono 16px en un `size-8`.
- **CA-02.2** Siguen existiendo avanzar / retroceder de estado (semántica actual `NEXT`/`PREV`)
  y bloquear/desbloquear.
- **CA-02.3** En el drawer, hay una forma explícita de **cambiar estado** (segmented control,
  select grande o chips de estado) usable a una mano, sin depender solo de las flechas de la card.
- **CA-02.4** El drag handle sigue siendo el único origen de reorder táctil; un tap en el cuerpo
  de la card abre detalle (sin iniciar drag). La activación táctil del drag mantiene delay
  (≈250ms) de 010.

### HU-03 — Revisar y comentar en el drawer móvil

Como PM, quiero abrir una tarea, leer el hilo y dejar un comentario sin que el teclado tape el
composer de forma irrecuperable.

- **CA-03.1** En &lt; `md`, el drawer ocupa el alto/ancho útil de la pantalla (full-screen sheet),
  con botón cerrar claro (≥44px).
- **CA-03.2** El contenido scrollea; el composer de comentarios permanece usable (sticky bottom
  del panel de comentarios o del drawer) y respeta `safe-area-inset-bottom`.
- **CA-03.3** Al enfocar el input de comentario, el campo no queda oculto bajo el teclado de
  forma permanente (scroll into view del composer).
- **CA-03.4** Se puede publicar un comentario y verlo en la lista sin cerrar el drawer.
- **CA-03.5** Bottom nav de la app no intercepta taps del drawer abierto (drawer por encima,
  o nav oculto mientras el drawer está abierto — **preferir overlay completo**).

### HU-04 — Más tablero, menos chrome

Como PM, quiero ver tarjetas, no cinco filas de filtros.

- **CA-04.1** En &lt; `sm`, la fila de controles del `TasksTab` se compacta: no muestra a la vez
  todos los botones de desktop a tamaño completo en una sola fila wrap caótica.
- **CA-04.2** Búsqueda accesible en ≤1 tap; filtros en menú/sheet (el dropdown actual vale si
  el trigger es fácil de pulsar).
- **CA-04.3** `SprintSwitcher` en móvil es usable (no desborda horizontal sin sentido); prev/next
  y select tienen targets táctiles razonables.
- **CA-04.4** La altura del carrusel usa el espacio vertical disponible de forma razonable
  (el board no queda en un “sello” de 120px por exceso de toolbars apiladas — smoke visual).

### HU-05 — Añadir tarea con el pulgar

- **CA-05.1** En móvil hay un control obvio para **Nueva tarea** (botón en toolbar y/o FAB
  sobre el bottom nav, sin tapar el pager). Preferencia design: FAB o botón sticky en la
  columna visible.
- **CA-05.2** El diálogo/formulario de creación es usable a ancho completo (ya suele serlo);
  al guardar, la tarea aparece en la columna correcta del scope actual.

### HU-06 — No regresar desktop / tablet

- **CA-06.1** ≥ `sm`: grilla 2 columnas y ≥ `xl`: 4 columnas sin regresión (011).
- **CA-06.2** Mouse: drag cross-column con preview sigue igual (010).
- **CA-06.3** Suite de tests existente del kanban en verde; no se añaden tests E2E de device
  farm obligatorios (verificación manual + unitarios de helpers).

## 5. Métricas de éxito (cualitativas)

- Un usuario puede **mover 3 tareas de estado** y **dejar 1 comentario** en un proyecto demo
  solo con el teléfono, sin instrucciones, en una sesión de smoke.
- Cero “no sé en qué columna estoy”.
- Cero dependencia de hover para acciones críticas de la card.

## 6. Roadmap de implementación

| Fase | Entrega |
|------|---------|
| **0** | Inventario de clases táctiles + helpers (`scrollColumnIntoView`, active column by scroll) |
| **1** | Pager de columnas + scroll sync |
| **2** | Targets y mover estado (card + drawer) |
| **3** | Drawer full-screen móvil + comentarios/teclado |
| **4** | Toolbar compacta + nueva tarea + smoke/cierre |

## 7. Fuera de alcance

- Gestos “swipe card to complete” (puede ser follow-up; fácil de pelear con scroll).
- Offline-first del board sin red (la app ya es local-first de datos; no es el foco UX).
- Haptic feedback nativo.
- Rediseño de `MobileBottomNav` destinations.
- Modo horizontal landscape optimizado (nice-to-have, no CA).

## 8. Archivos clave (previsto)

| Área | Archivos |
|------|----------|
| Board | `TasksTab.tsx`, `KanbanColumn.tsx`, **nuevo** `KanbanColumnPager.tsx` |
| Card | `TaskCard.tsx` |
| Drawer | `TaskDetailDrawer.tsx` (layout móvil, footer estado, comentarios) |
| Layout | `AppLayout.tsx` solo si hace falta z-index / hide nav con drawer |
| Hooks | posible `useActiveSnapIndex` / `useMediaQuery` ya existente |

## 9. Verificación

1. `typecheck` + `lint` + `test` + `build`.
2. Smoke manual en DevTools device mode **iPhone SE** y **Pixel 5** (o anchos 375 y 412):
   pager, mover, comentar, crear tarea, bottom nav no tapa acciones del drawer.
3. Smoke desktop ≥1280: 4 columnas + drag cross-column.
4. Progreso + roadmap `mobile-kanban`; `graphify update .`.

## 10. Progreso

- **Estado general: ✅ Implementado (2026-08-11).**
- Pager de columnas en carrusel &lt; sm + IntersectionObserver.
- Targets ≥44px en card; chips de estado y drawer full-screen en móvil.
- Toolbar compacta (Más + Nueva); nueva tarea en columna activa del pager.
- Comentarios con `text-base` y scroll-into-view.
- **1142 tests** en verde.
