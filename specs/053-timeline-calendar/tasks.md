# Tasks 053 — Vista línea de tiempo / calendario

Checklist de implementación de la spec 053 (`timeline-calendar`).  
Estado inicial: **ninguna tarea ejecutada** (solo documentado).  
Baseline: **1096 tests / 109 archivos**, `SCHEMA_VERSION = 19` (sin bump).  
Numeración **T5300+**. Anclas en `design.md`.  
Sin dependencias npm nuevas. Cierre de fase: `typecheck` + `lint` + `test`.

---

## Fase 0 — Fechas y modelo puro

- [ ] **T5300** — Extender `src/lib/dates.ts` (o módulo colindante) con
  `weekRangeContaining`, `monthRangeContaining`, `shiftRange`, `eachDay`, `intersects`
  sobre day keys `YYYY-MM-DD` (semana ISO lunes–domingo). (design §1.2)
- [ ] **T5301** — Tests de rangos (miércoles → lunes..domingo; mes completo; shift ±1).
- [ ] **T5302** — **nuevo** `buildCalendarItems.ts` (`buildCalendarModel`): filtra tareas
  (archivadas, done, scope sprint, área, search), clasifica in-range vs unscheduled;
  sprints que intersectan; project due. (design §1.1)
- [ ] **T5303** — Extraer `taskMatchesSprintScope` (o el predicado que use hoy `TasksTab`) a
  helper compartido para no divergir Kanban vs calendario.
- [ ] **T5304** — Tests del builder: in/out range, backlog scope, sprint scope, unscheduled,
  archived/done, sprint sin fechas no genera banda.
- [ ] **Checkpoint 0:** Vitest verde; sin UI.

---

## Fase 1 — Calendario semana + mes (UI)

- [ ] **T5310** — `CalendarEventChip` + `CalendarDayCell` (presentacionales).
- [ ] **T5311** — `TaskCalendarView`: navegación prev/next/Hoy, toggle Semana|Mes, grilla
  semana con chips. (HU-01)
- [ ] **T5312** — Grilla mes + “+N más” + selección de día. (HU-02)
- [ ] **T5313** — Bandas de sprint en semana (column span) + indicación en mes + leyenda.
  (CA-01.4)
- [ ] **T5314** — Marcador de due del proyecto. (CA-01.5)
- [ ] **T5315** — `UnscheduledTasksPanel` (“Sin fecha (N)”). (CA-03.3)
- [ ] **T5316** — Empty state cuando no hay fechas ni sprints fechados.
- [ ] **Checkpoint 1:** montar temporalmente en Story/página o branch de TasksTab para smoke
  visual con datos demo.

---

## Fase 2 — Integración TasksTab

- [ ] **T5320** — `viewMode` → `"kanban" | "list" | "calendar"`; persistencia `tasks-view-mode`
  con fallback a `kanban-view-mode`. Toggle 3 botones accesibles. (CA-01.1)
- [ ] **T5321** — Render `TaskCalendarView` con props de scope/search/area; `onOpenTask` abre
  el mismo drawer. (HU-04)
- [ ] **T5322** — **Acotar `DndContext`** al branch kanban (no envolver calendar/list si list
  no lo necesita). Verificar que el kanban sigue reordenando.
- [ ] **T5323** — Toggle “Mostrar hechas” en la barra del calendario (`includeDone`).
- [ ] **T5324** — Click en banda de sprint → `onFocusSprint` cambia scope del switcher
  (opcional suave).
- [ ] **Checkpoint 2:** smoke — demo project: cambiar Kanban ↔ Calendario; filtros; drawer;
  crear tarea con due y ver chip.

---

## Fase 3 — Línea de tiempo (HU-05)

- [ ] **T5330** — `TaskTimelineView`: rango ~4 semanas, barras sprint, marcadores task,
  scroll horizontal, tooltips. (design §3)
- [ ] **T5331** — Integrar en modo calendario (sección bajo la grilla o sub-tab
  Semana | Mes | Línea). Preferir **sección bajo semana/mes** para no esconder la grilla.
- [ ] **T5332** — Tests de layout math (left/width %) puros si se extraen.
- [ ] **Checkpoint 3:** 2 sprints contiguos + varias dues se leen en el eje.

---

## Fase 4 — Drag reprogramar (HU-06, opcional de cierre)

- [ ] **T5340** — Drag chip → celda día actualiza `dueDate` vía `ops.updateTask` + `mutate`.
- [ ] **T5341** — (Nice) Drag desde “Sin fecha” hacia un día asigna due.
- [ ] **T5342** — Si no hay tiempo: documentar en `spec.md` Progreso como **aplazado** y
  cerrar sin bloquear el ship de HU-01–05.

---

## Fase 5 — Cierre

- [ ] **T5350** — `npm run typecheck && npm run lint && npm test && npm run build`.
- [ ] **T5351** — Actualizar `spec.md → §10 Progreso` (archivos, tests, qué quedó de HU-06).
- [ ] **T5352** — Roadmap `timeline-calendar` → `shipped` (o description “spec 053”) al
  cerrar; nota en `gestor-proyectos-app.md` si aplica.
- [ ] **T5353** — Docs in-app (`features/docs`) si el módulo “tareas y kanban” existe: una
  frase sobre la vista calendario.
- [ ] **T5354** — `graphify update .`
- [ ] **Checkpoint final:**
  1. Semana con sprints y vencimientos legibles.
  2. Mes con overflow “+N”.
  3. Sin fecha accesible.
  4. Drawer y filtros coherentes.
  5. Timeline visible en desktop.

---

## Notas para el agente implementador

- No añadir FullCalendar / vis-timeline / dhtmlx.
- No inventar `Task.startDate`.
- No reintroducir milestones UI “de paso”.
- Semana empieza en **lunes** (ISO), alineado a `weekKey`.
- Mantener español en labels de UI.
- Preferir composición en `features/projects/calendar/*` antes de inflar `TasksTab.tsx`
  (ya es un archivo grande).
