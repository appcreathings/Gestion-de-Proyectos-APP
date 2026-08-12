# Tasks 054 — Kanban usable en el teléfono

Checklist de implementación de la spec 054 (`mobile-kanban`).  
Estado inicial: **ninguna tarea ejecutada** (solo documentado).  
Baseline: **1096 tests / 109 archivos**, sin bump de schema.  
Numeración **T5400+**. Anclas en `design.md`.  
Cierre de fase: `typecheck` + `lint` + `test` (+ `build` al final).

---

## Fase 0 — Anclas y helpers

- [ ] **T5400** — `KanbanColumn`: `data-kanban-status={status}` e `id={`kanban-col-${status}`}`.
- [ ] **T5401** — **nuevo** `kanban/columnScroll.ts`: `pickActiveStatus` (+ tests). (design §6)
- [ ] **T5402** — Confirmar breakpoint del carrusel (`sm`) y usarlo de forma consistente
  (`useBreakpoint("sm")`) en pager/toolbar — no `useIsMobile()` (md). (design §1.1)
- [ ] **Checkpoint 0:** tests del helper verdes.

---

## Fase 1 — Pager de columnas (HU-01)

- [ ] **T5410** — **nuevo** `KanbanColumnPager.tsx`: chips con label + count; active state;
  `onSelect`. Solo visible &lt; `sm`.
- [ ] **T5411** — `useSnapColumnIndex` (o lógica en TasksTab): `IntersectionObserver` con root =
  board scroller; actualiza `activeStatus`.
- [ ] **T5412** — `onSelect` hace scroll horizontal del board a la columna (sin saltar la página).
- [ ] **T5413** — Sticky del pager si no rompe el layout; si pelea con tabs del proyecto, dejar
  estático y documentar en Progreso.
- [ ] **Checkpoint 1:** DevTools 375px — swipe cambia active; tap en “Bloqueada” salta bien.

---

## Fase 2 — Mover con el dedo (HU-02)

- [ ] **T5420** — `TaskCard`: acciones primarias `min-h/w-11` (44px) en viewport pequeño
  (`max-sm:` o siempre si no ensucia desktop). `aria-label` claros en ←/→/bloquear.
- [ ] **T5421** — `TaskDetailDrawer`: estado **arriba del fold** en móvil (reordenar campos) y/o
  footer/chips de los 4 `TASK_COLUMNS` (`md:hidden`) que llaman al mismo update de status.
- [ ] **T5422** — Verificar que touch drag sigue **sin** cross-column (test manual + no tocar
  la guarda de `onDragOver` salvo bug).
- [ ] **Checkpoint 2:** mover 3 tareas solo con botones/chips en 375px sin abrir menús raros.

---

## Fase 3 — Drawer y comentarios (HU-03)

- [ ] **T5430** — Drawer &lt; `md`: `inset-0`, full viewport, sin `drawerWidth` forzado; handle de
  resize sigue `hidden md:block`.
- [ ] **T5431** — Body scroll lock mientras el drawer móvil está abierto.
- [ ] **T5432** — Composer de comentarios: `text-base`, safe-area padding, sticky bottom de la
  sección; `scrollIntoView` on focus.
- [ ] **T5433** — Cerrar: botón ≥44px; tap en backdrop sigue cerrando.
- [ ] **Checkpoint 3:** escribir comentario con teclado virtual simulado; publicar; ver en lista;
  bottom nav no roba taps.

---

## Fase 4 — Chrome y alta de tarea (HU-04, HU-05)

- [ ] **T5440** — Toolbar &lt; `sm` compacta: búsqueda + Filtros + menú Más (WIP, archivadas,
  selección, etc.) + toggle vista icon-only.
- [ ] **T5441** — `SprintSwitcher`: chevrons/select con mejor hit area en móvil.
- [ ] **T5442** — “Nueva tarea” en toolbar móvil → crea en `activeStatus` del pager; `+` de
  columna con target 44px.
- [ ] **Checkpoint 4:** board legible sin scroll eterno de toolbars; crear tarea en “En curso”.

---

## Fase 5 — Cierre

- [ ] **T5450** — Smoke desktop/tablet: 2 col @710px, 4 col @1280px, drag mouse cross-column.
- [ ] **T5451** — `npm run typecheck && npm run lint && npm test && npm run build`.
- [ ] **T5452** — `spec.md → §10 Progreso` (archivos, decisiones de sticky pager, etc.).
- [ ] **T5453** — Roadmap `mobile-kanban` → referencia spec 054 / `shipped` al cerrar.
- [ ] **T5454** — Docs in-app kanban (si aplica) + `graphify update .`.
- [ ] **Checkpoint final (manual):**
  1. 375px: pager + mover + comentar + crear.
  2. 412px: igual.
  3. Desktop: sin regresión DnD.
  4. Tablet 710: sigue 2×2.

---

## Notas para el agente implementador

- No FullCalendar, no librerías de gesture nuevas, no React Native.
- No reactivar cross-column touch “porque se siente más app”.
- No usar `useIsMobile()` (md) para lógica del carrusel — el carrusel corta en **sm**.
- Preferir extraer componentes antes de sumar 200 líneas a `TasksTab.tsx`.
- Inputs móviles: **16px** (`text-base`) para evitar zoom iOS.
- Verificar z-index: drawer `z-50` &gt; bottom nav `z-30`.
