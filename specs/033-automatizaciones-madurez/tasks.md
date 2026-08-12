# Tasks 033 — Madurez de automatizaciones

Checklist de implementación de la spec 033. Estado inicial: **ninguna tarea ejecutada** (backlog).
Baseline de tests al empezar: **588/588** (tras spec 032). `SCHEMA_VERSION = 15`. Convención de las
specs 018–032: cada fase cierra con `typecheck` + `lint` + `test` + `build` en verde y una nota en
`spec.md → Progreso`.

Secuencia sugerida: **Fase 1 (A1 → C1 → A2 → A3)** → **Fase 2 (B1 ∥ B2 ∥ B3)** → **Fase 3 (según
demanda)**. La primera feature de cada fase que toque schema introduce el bump identidad; las demás solo
suman campos.

---

## Fase 1 — Cerrar 032 y accionar los fallos

### A1 · Delivery log durable + Reenviar

- [ ] **T3300** — `src/flows/engine.ts`: extender `OutboundDelivery` (empujado a
  `result.outboundDeliveries`) con `status?`, `responseSnippet?`, `attempts?`, `error?` — el motor ya
  los computa en el `resolved` de 032 §C; poblarlos también en el objeto empujado. Sin persistencia en
  el motor.
- [ ] **T3301** — `src/store/useDataStore.ts` (`applyFlowResult`): persistir en `integrationDb.syncLogs`
  cada `outboundDeliveries`/`emailDeliveries` (direction outbound, secreto **enmascarado**, body/response
  truncados) y cada batch inbound drenado (direction inbound). Máscara: nunca `secret` ni body de email.
- [ ] **T3302** — Persistir lo mínimo para replay: `flowId` + índice de output + `data` resuelto junto a
  la entrega (campo del `SyncLog` o doc `flow-deliveries`). El secreto se recupera del Flujo vivo, no
  del log.
- [ ] **T3303** — `src/features/integrations/DeliveryDetailDrawer.tsx`: botón **"Reenviar"** (solo
  outbound con `flowId` resoluble) → `ConfirmDialog` → `buildWebhookRequest(output, data)` → `fetch` →
  nuevo `SyncLog` (retryCount++). Deshabilitado con aviso si el Flujo fue borrado.
- [ ] **T3304** — `src/features/integrations/SyncLogsPage.tsx`: filtros incluyen `provider`
  webhook/email/inbox; enlazar la entrada al Flujo/run cuando exista.
- [ ] **T3305** — Tests: `useDataStore` con `integrationDb` mockeado (persistencia + máscara del
  secreto); replay reconstruye la misma firma verificable (reusa `verifyRaw`). Confirmar que
  `maintenance.ts` rota estos logs.

### C1 · Notificación de fallo clicable (deep-link al run)

- [ ] **T3310** — `src/domain/schemas/notification.ts`: `EntityRefSchema.kind` gana `"flow"`; añadir
  `runId?: string`. Bump `SCHEMA_VERSION` 15→16 + paso identidad (`common.ts`, `migrations.ts`, test) —
  **este es el bump compartido de la Fase 2 si C1 va primero; si no, lo introduce B1**.
- [ ] **T3311** — `src/store/useDataStore.ts`: la notificación de fallo (024 §F3) setea
  `entityRef: { kind: "flow", id: flowId, runId }`.
- [ ] **T3312** — Centro de notificaciones: mapear `kind:"flow"` → `FlowHistoryPage` con el run abierto
  (`FlowRunDetailDrawer`). `FlowHistoryPage` enfoca el run del query param.
- [ ] **T3313** — Tests: la notificación de fallo lleva `kind:"flow"`+`runId`; el mapeo produce el
  deep-link correcto; notificaciones viejas sin el kind siguen resolviéndose.

### A2 · Salud por conexión + semáforo

- [ ] **T3320** — `src/integrations/inbound/inbox-poller.ts` / manager: persistir el último `backlog`
  por poll-key (junto a `lastSyncAt`, `poll-sync-state.ts`).
- [ ] **T3321** — Función pura de derivación de salud (por `connectionId`) sobre `syncLogs` +
  `pollingManager.getAllStatuses()`: última entrada/salida OK, nº de Flujos + frecuencia, backlog,
  warnings de tasa/retención.
- [ ] **T3322** — UI: sección "Salud por conexión" en `ScheduledServicesPage` (o card en
  `IntegrationsPage`) con badges entrada/salida, "N flujos · cada X", backlog y warnings.
- [ ] **T3323** — Tests: derivación pura sobre mocks (OK reciente / hace rato / último falló; umbral de
  carga; backlog cerca de retención).

### A3 · Probar el round-trip del inbox

- [ ] **T3330** — Botón "Enviar entrega de prueba" en `ConnectionDialog` (provider `webhook-inbox`):
  `ConfirmDialog` → POST de ingreso (`postToProxy`, sample fijo) → `drain` de confirmación → resultado
  inline (deliveryId recuperado).
- [ ] **T3331** — `AppsScriptGuide` (inbox): check "he pegado la URL en Make/Zapier" para completar la
  lista de setup.
- [ ] **T3332** — Verificación manual: ingreso + drain confirmados contra un proxy real.

---

## Fase 2 — Expresividad

### B1 · Trigger programado (schedule) → **✅ spec 051 (2026-08-11)**

> [`specs/051-flows-trigger-programado/`](../051-flows-trigger-programado/) · implementado.

- [x] **T3340** — schema schedule → 051
- [x] **T3341** — schedule-manager → 051
- [x] **T3342** — catch-up hydrate → 051
- [x] **T3343** — engine matches → 051
- [x] **T3344** — store + TriggerStep → 051
- [x] **T3345** — tests → 051

### B2 · Branching por salida (guardas por output) → **✅ spec 055 (2026-08-11)**

> [`specs/055-flows-output-guards/`](../055-flows-output-guards/) · implementado (T5500–T5531).

- [x] **T3350** — schema `when` → 055
- [x] **T3351** — engine guarda → 055
- [x] **T3352** — UI + traza → 055
- [x] **T3353** — tests → 055

### B3 · Webhook: método HTTP y headers custom → **✅ spec 056 (2026-08-11)**

> [`specs/056-webhook-method-headers/`](../056-webhook-method-headers/) · implementado.

- [x] **T3360** — schema method/headers → 056
- [x] **T3361** — webhook-request → 056
- [x] **T3362** — UI → 056
- [x] **T3363** — tests → 056

---

## Fase 3 — Madurez y portabilidad (según demanda)

### B4 · Verificación de firma entrante en el inbox

- [ ] **T3370** — Conexión `webhook-inbox`: `config.verifySignature?`. `inbox-poller.ts`: si activo,
  `verifyRaw(JSON.stringify(body), secret, signature)` por delivery; inválida → descartar + registrar.
- [ ] **T3371** — `AppsScriptGuide` inbox: documentar cómo firma Make/Zapier. Tests: válida pasa,
  inválida se descarta, off = actual.

### C2 · Versionado + rollback

- [ ] **T3380** — Doc `flow-versions` (aparte de `flows`, como `flow-runs`), cap N=10 FIFO.
  `useFlowStore.updateFlow` snapshota antes de sobrescribir.
- [ ] **T3381** — UI "Historial de versiones" en el builder + "Restaurar" (crea versión nueva). Export/
  import opcional. Tests: snapshot al guardar; restaurar no borra intermedias.

### C3 · Coalescing de polling

- [ ] **T3390** — Agrupar Flujos por key base + intervalo; una consulta por tick alimenta a todos (sin
  reintroducir la colisión de 024 §F10). Tests: una sola llamada compartida por grupo.

### C4 · Export de Conexiones sin secretos

- [ ] **T3395** — `exportAll`/`importAll` incluyen `IntegrationConnection` **sin** `encryptedSecret`;
  import las recrea inactivas; banner "N conexiones sin resolver" en Flujos.
  `CollectionTransferCard`: "Conexiones (sin secretos)". Test: el bundle no contiene `encryptedSecret`.

---

## Cierre (por fase)

- [ ] **T33F1/F2/F3** — `npm run typecheck && npm run lint && npm test && npm run build` en verde con los
  tests nuevos de la fase. Actualizar `spec.md → Progreso` (estado, archivos, tests, verificación),
  convención 018–032.
- [ ] **T33MEM** — Actualizar la memoria del proyecto (`gestor-proyectos-app.md`) al cerrar cada fase.
