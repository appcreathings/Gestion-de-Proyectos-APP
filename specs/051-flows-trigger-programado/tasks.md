# Tasks 051 — Trigger programado (schedule)

Checklist de implementación de la spec 051 (033 · B1).  
Estado inicial: **ninguna tarea ejecutada** (backlog / solo documentado).  
Baseline al empezar: **1096 tests / 109 archivos**, `SCHEMA_VERSION = 19`.  
Convención 018–050: cada fase cierra con `typecheck` + `lint` + `test` + `build` en verde.  
Numeración **T5100+**. Cada tarea ancla a `design.md`. `∥` = paralelizable dentro de la fase.

---

## Fase 0 — Schema, migración y helpers puros (sin UI visible)

- [ ] **T5100** — `src/domain/schemas/flow.ts`: añadir `ScheduleTriggerSchema`
  (`cadence hourly|daily|weekly`, `atMinute`, `atHour?`, `weekday?`); incluirlo en
  `TriggerSchema` discriminated union; exportar tipo `ScheduleTrigger`. (design §1.1)
- [ ] **T5101** — `SCHEMA_VERSION` 19 → **20** en `common.ts`; paso identidad
  `{ to: 20, up: (d) => d }` en `MIGRATIONS.flows` (y kinds que deban converger al número
  global según convención del repo). Comentario “spec 051 schedule (identity)”. (design §1.2)
- [ ] **T5102** — Test migración: doc `flows` v19 → v20 sin mutar el contenido de `flows`.
- [ ] **T5103** — **nuevo** `src/integrations/scheduling/schedule-cadence.ts`:
  `nextFireAfter`, `previousFireAtOrBefore`, `isDue`, `formatScheduleSummary`,
  `syntheticScheduleRecord`. Solo `Date` local; sin DOM. (design §2)
- [ ] **T5104** — Tests de cadence: hourly/daily/weekly due / no-due; ya disparó en la ventana;
  summary en español; anclas medianoche / cambio de día.
- [ ] **T5105** — **nuevo** `src/integrations/scheduling/schedule-sync-state.ts`:
  `loadLastFiredAt` / `saveLastFiredAt` / `clearLastFiredAt` (`hito:schedule-lastFired:<flowId>`).
  (design §4.1)
- [ ] **T5106** — Tests sync-state (incl. localStorage que lanza → no propaga).
- [ ] **Checkpoint 0:** `tsc` + Vitest verdes. Ningún cambio visible en la app. Los flujos
  existentes siguen parseando.

---

## Fase 1 — Motor reconoce `schedule`

- [ ] **T5110** — `src/flows/engine.ts`: exportar `scheduleTriggerKey(flowId)`; adaptar
  `matchesTrigger` / `resolveTriggerData` (y el loop) para recibir `flowId` o `FlowRule` y
  ramificar `schedule` → lee `externalData` con esa key; sources `{}` (sin proyecto).
  (design §3)
- [ ] **T5111** — Tests engine: con `externalData` poblado corre una vez y el record trae
  `firedAt`/`cadence`; sin key no corre; dos flows distintos no se cruzan.
- [ ] **T5112** — `src/flows/validation.ts`: errores si daily/weekly sin `atHour`, weekly sin
  `weekday`. (design §5.3)
- [ ] **T5113** — `variables.ts` (+ panel si aplica): variables de ejemplo `firedAt`, `cadence`,
  `weekday?` para trigger schedule. (design §5.2)
- [ ] **T5114** — `meta.ts` `triggerSummary` + `labels` si hace falta: resumen legible vía
  `formatScheduleSummary`. Corregir switches exhaustivos que TypeScript marque al ampliar el
  union (manual-run, migration labels, etc. — stubs mínimos “no soportado” solo donde no
  aplique aún).
- [ ] **Checkpoint 1:** tests de engine + validation verdes; `tsc` limpio con el union de 3.

---

## Fase 2 — Scheduler, store y bootstrap (catch-up real)

- [ ] **T5120** — **nuevo** `src/integrations/scheduling/schedule-manager.ts`: registro por
  `flowId`, tick compartido 60s, `evaluateAll(nowMs?)`, pause/resume, `getAllStatuses`.
  Watermark **antes** de `onFire` (at-most-once). (design §4.2)
- [ ] **T5121** — Tests del manager con reloj inyectado: due → 1 fire; segunda evaluate no
  repite; unregister; pause no dispara.
- [ ] **T5122** — `useDataStore`: `runScheduledFlow(flowId, firedAtIso)` → `runFlowEngine` +
  `applyFlowResult({ isAutomatic: true })`. (design §4.5)
- [ ] **T5123** — `useFlowStore`: `registerTrigger` / `unregisterTrigger` cubren `schedule` además
  de poll; `add`/`update`/`delete` cableados. (design §4.3)
- [ ] **T5124** — **Hydrate registra triggers enabled** (poll **y** schedule) y llama
  `scheduleManager.evaluateAll()` una vez (catch-up al abrir). (design §4.3, CA-03.*)
- [ ] **T5125** — Visibility: pause/resume del schedule-manager al ocultar/mostrar pestaña
  (extender `visibility-aware` o módulo hermano); al resume, `evaluateAll`. (design §4.4)
- [ ] **T5126** — Tests de store/wiring (mocks): hydrate registra; delete desregistra; catch-up
  llama `runScheduledFlow` como máximo una vez por flow due.
- [ ] **Checkpoint 2:** con reloj mockeado, un flow daily “vencido” se ejecuta al evaluate/hydrate
  y no se duplica. Polls enabled vuelven a registrarse tras hydrate (smoke o test).

---

## Fase 3 — UI de configuración y “Ejecutar ahora”

- [ ] **T5130** — `TriggerStep.tsx` (+ drawer del canvas si es la superficie canónica): opción
  **“En un horario”**; selectores cadencia / hora / minuto / weekday; defaults design §1.1;
  copy del caveat 032 §E. (design §5.1, CA-01.*)
- [ ] **T5131** — Canvas: nodo trigger muestra `formatScheduleSummary`; sin criterios locales de
  invalid (solo `validateFlow`). (038 invariante)
- [ ] **T5132** — `runFlowNowImpl`: rama `schedule` con record sintético **sin** avanzar
  watermark (CA-05.2). (design §4.6)
- [ ] **T5133** — `FlowsPage` (y diálogos): “Ejecutar” disponible para schedule sin pedir entidad
  de evento. Tests `runFlowNow` schedule.
- [ ] **Checkpoint 3:** smoke manual — crear flow “cada día 09:00” + notificación; Ejecutar ahora
  produce run; watermark de cadencia intacto; validación semanal sin día marca error en canvas.

---

## Fase 4 — Observabilidad, cierre y docs

- [ ] **T5140** — `ScheduledServicesPage`: sección **“Flujos programados”** (nombre, cadencia,
  último disparo, activo); caveat “solo con Hito abierto / catch-up al reabrir”. (CA-04.*)
- [ ] **T5141** — Revisar exhaustividad final: `grep`/tsc de `trigger.type` / switches; plantillas
  de flujos si alguna asume solo event|poll.
- [ ] **T5142** — **Cierre:** `npm run typecheck && npm run lint && npm test && npm run build`.
  Actualizar `spec.md → §10 Progreso` (estado, archivos, tests, verificación).
- [ ] **T5143** — Marcar **033 §B1** como implementado vía 051 (enlace + fecha) en
  `specs/033-automatizaciones-madurez/spec.md` y tasks T3340–T3345 → delegadas/cerradas.
- [ ] **T5144** — Actualizar memoria del proyecto (`gestor-proyectos-app.md`) si el repo lo usa
  al cerrar features; `graphify update .`.
- [ ] **Checkpoint final (smoke humano):**
  1. Flow daily con hora = ahora+1 min → al cruzar, 1 run automático.
  2. Forzar `lastFiredAt` antiguo en localStorage → al recargar, 1 catch-up, no 2.
  3. Deshabilitar flow → desaparece del panel y no vuelve a disparar.
  4. Ejecutar ahora a las 8:xx no impide el disparo de las 9:00 el mismo día.

---

## Trazabilidad 033 → 051

| Task 033 (B1) | Task 051 |
|---------------|----------|
| T3340 schema schedule | T5100–T5102 |
| T3341 schedule-manager | T5120–T5121 |
| T3342 catch-up hydrate | T5124–T5126 |
| T3343 engine matches/resolve | T5110–T5111 |
| T3344 store + TriggerStep | T5123, T5130–T5131 |
| T3345 tests | T5104–T5106, T5111, T5121, T5126, T5133 |

---

## Notas para el agente implementador

- No meter `setInterval` dentro de `engine.ts`.
- No persistir watermark en el doc `flows` (crece writes y complica export); `localStorage` como
  poll-sync-state.
- No implementar cron libre ni timezones.
- Si al ampliar el union TypeScript falla en sitios muertos (p. ej. `migration.ts` de automations
  legacy), preferir `assertNever` o rama explícita documentada, no `as any`.
- Preferir inyectar `nowMs` en tests; evitar `vi.useFakeTimers` globales si rompen otros suites
  — acotar al describe del manager.
