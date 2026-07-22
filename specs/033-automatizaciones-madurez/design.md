# Design 033 — Madurez de automatizaciones

Diseño técnico de la spec 033. Anclado al código tras spec 032. Principio rector: **no desestabilizar
el motor puro (`src/flows/engine.ts`) ni su suite** — los efectos con I/O (persistir en Dexie, timers,
red) viven en la capa de store/integraciones, no en el motor, que se mantiene `EngineInput →
EngineResult` y fácil de testear sin `window`/`indexedDB`.

Bumps de schema: cada feature que lo requiere sube `SCHEMA_VERSION` con **paso identidad** (patrón
026/027/032). Se agrupan por fase: la primera feature de cada fase que toque schema introduce el bump;
las siguientes de esa fase solo suman campos opcionales al mismo número. Estado inicial: `SCHEMA_VERSION
= 15` (tras spec 032).

---

## Arco A — Cerrar el round-trip de 032

### A1 · Delivery log durable + Reenviar

**Dónde persistir (decisión):** en `applyFlowResult` (`src/store/useDataStore.ts`), **no** en el motor.
`applyFlowResult` ya recibe el `FlowRunResult` (con `outboundDeliveries` y `emailDeliveries`) y ya
escribe efectos (notificaciones, runs). Ahí se agrega la escritura a `integrationDb.syncLogs`. Así los
tests del motor (que no mockean `integrationDb`) no se tocan; los de `useDataStore` (runFlowNow) ya
mockean el store y se extienden con un mock de `integrationDb`.

**Datos.** Reusar `SyncLog` (018 §4.2), sin tabla nueva. Por entrega saliente:

```ts
// una entrada por output de red ejecutado
integrationDb.syncLogs.add({
  id: uuid(),
  direction: "outbound",
  provider: "webhook" | "email",
  eventType: flow.name,               // o el tipo de trigger — legible en la lista
  status: outcome === "executed" ? "success" : "error",
  requestPayload: JSON.stringify(maskSecret(delivery.body)),  // secreto enmascarado, truncado 10KB
  responsePayload: delivery.responseSnippet ?? "",            // status+bytes (spec 032 §C ya lo captura)
  httpStatus: delivery.status ?? null,
  errorMessage: delivery.error ?? null,
  retryCount: delivery.attempts ?? 0,
  createdAt: nowIso(),
});
```

Para que la entrega saliente lleve `responseSnippet`/`status`/`attempts` hasta `applyFlowResult`, se
extiende `OutboundDelivery` (el tipo que el motor empuja a `result.outboundDeliveries`,
[engine.ts:151](src/flows/engine.ts#L151)) con esos campos opcionales — el motor ya los computa en el
`resolved` de 032 §C; se los añade también al objeto empujado. **No** se persiste el `secret` (se
enmascara con `••••`); el `body` del email tampoco (solo to/subject), criterio 024 §F4 / 026 §E.

Entrada de inbox (032 §B): el `inbox-polling-manager` ya corre `runPolledFlow`; ahí se agrega un
`syncLogs.add({ direction: "inbound", provider: "inbox", ... })` por batch drenado (o por entrega si se
quiere granularidad), con el desenlace del Flujo.

**Reenviar (replay).** Requiere reconstruir la request. Se persiste junto a la entrega (en un campo del
`SyncLog` o en un doc paralelo `flow-deliveries`) lo mínimo para reconstruir: el `WebhookOutput`
resuelto (sin secreto en claro — el secreto se recupera del propio output guardado en el Flujo, no del
log) y el `data` interpolado. En `DeliveryDetailDrawer`:

```
"Reenviar" → ConfirmDialog (llamada real, criterio 025 §D)
  → buildWebhookRequest(output, data)   // misma firma verificable de 032 §A
  → fetch → nuevo SyncLog (retryCount++), manteniendo el vínculo al original
```

Decisión: el `output` para el replay se lee del Flujo vivo por `flowId`+índice de output cuando existe
(así el secreto nunca vive en el log); si el Flujo fue borrado, el replay se deshabilita con un aviso.

**UI.** `SyncLogsPage` ya está cableada a `syncLogs` — solo gana los nuevos `provider` en sus filtros y
el `DeliveryDetailDrawer` gana el botón Reenviar (para `direction: "outbound"` con `flowId` resoluble).

**Tests.** `useDataStore` con `integrationDb` mockeado: una entrega exitosa/ fallida produce el
`syncLog` correcto con secreto enmascarado; replay reconstruye la misma firma (reusa el test de
`webhook-request` de 032 §A).

---

### A2 · Salud por conexión + semáforo de carga

**Derivación (sin tabla nueva).** Todo sale de `syncLogs` + `pollingManager.getAllStatuses()`:

```ts
// por connectionId:
lastInboundOk  = max(createdAt where direction=inbound  && status=success && key~connectionId)
lastOutboundOk = max(createdAt where direction=outbound && status=success)  // por flow→connection
flowsQuerying  = count(pollingManager keys que contienen connectionId)  // 032: inbox:${id}, hubspot:${id}:*, ...
backlog        = último `backlog` reportado por el drain del inbox (persistir el último valor por key)
```

El `backlog` del inbox (032 §B `drainInbox` ya devuelve `backlog`) se guarda como último-valor por
poll-key (junto a `lastSyncAt`, `poll-sync-state.ts`) para leerlo sin re-drenar.

**Umbrales.** Tabla de límites conocidos (HubSpot Starter 10/10s … 024 §F10) → si
`flowsQuerying × (60000/intervalMs)` se acerca al límite, warning. Si `backlog > 0.8 × retención` del
proxy, warning de posible pérdida.

**UI.** Nueva sección "Salud por conexión" en `ScheduledServicesPage` (o card en `IntegrationsPage`):
por conexión, dos badges (entrada/salida: verde=OK reciente, ámbar=hace rato, rojo=último falló),
"N flujos · cada X", backlog, y los warnings.

**Tests.** Puros sobre la función de derivación (mock de `syncLogs` + statuses) — sin UI.

---

### A3 · Probar el round-trip del inbox

**Flujo.** En `ConnectionDialog` (provider `webhook-inbox`) y/o en el explorador de conexión, botón
"Enviar entrega de prueba":

```
ConfirmDialog (escritura real en el buffer)
  → postToProxy(proxyUrl, { ...sampleBody, secret? })   // ingreso (NO action:drain)
  → postToProxy(proxyUrl, { action:"drain", cursor:"" }) // confirma que aparece
  → verde: "Entrega de prueba aceptada y recuperada (deliveryId ...)"
```

Reusa `postToProxy` (032). El `sampleBody` es un JSON fijo `{ demo: true, titulo: "Prueba desde Hito" }`.

---

## Arco B — Expresividad

### B1 · Trigger programado (schedule)

**Schema** (`src/domain/schemas/flow.ts`, bump 15→16 identidad):

```ts
export const ScheduleTriggerSchema = z.object({
  type: z.literal("schedule"),
  cadence: z.enum(["hourly", "daily", "weekly"]),
  atMinute: z.number().min(0).max(59).default(0),
  atHour: z.number().min(0).max(23).optional(),      // daily/weekly
  weekday: z.number().min(0).max(6).optional(),      // weekly (0=domingo)
});
// TriggerSchema = discriminatedUnion(event | poll | schedule)
```

El "record" del disparo es sintético: `{ firedAt: ISO, cadence }` — disponible en `{{firedAt}}`.

**Scheduler.** Nuevo `src/integrations/scheduling/schedule-manager.ts`, hermano de `pollingManager`:
un timer por Flujo programado que, en cada tick (p. ej. cada 60s), evalúa si la cadencia debió dispararse
desde el último disparo registrado y, si sí, corre el motor una vez y avanza el watermark.

**Watermark + catch-up (lo delicado).** Persistir por `flowId` el `lastFiredAt` (patrón
`poll-sync-state.ts`). En `matchesTrigger`/despacho: se dispara si `now ≥ próximoDisparo(lastFiredAt,
cadence)`. Al **abrir** la app (hidratar Flows), un barrido inicial dispara una vez los schedules cuyo
disparo venció mientras Hito estuvo cerrado (catch-up de a lo sumo un disparo por cadencia, no N). El
caveat de 032 §E aplica y se documenta.

**Wiring.** `useFlowStore.add/update/deleteFlow` registran/desregistran el schedule igual que hacen con
poll; `TriggerStep` gana la opción "En un horario" con selectores de cadencia/hora/día.

**Ejecución.** El motor trata el schedule como un trigger con un único `record` sintético — condiciones/
transformación/outputs corren igual. `resolveTargetProjectId` no tiene proyecto de origen (como poll):
los outputs que mutan proyectos deben targetear explícitamente.

---

### B2 · Branching por salida (guardas por output)

**Schema** (bump 15→16, compartido con B1/B3 si van en la misma fase): cada `Output` gana
`when?: { conditions: FlowCondition[], conditionMode?: "all"|"any" }` (reusa `FlowConditionSchema` y el
`conditionMode` de 027 §F). Ausente = sin guarda = siempre (retrocompat).

**Motor** (`engine.ts`, loop de outputs ~235-268): antes de ejecutar cada output, si tiene `when`,
evaluar sus condiciones contra el `record` con la misma `evaluateConditionsDetailed` ya existente; si no
pasa, `outcome: "skipped"`, `reason: "Omitido — guarda del paso no cumplida"`, sin ejecutar. La traza
(`FlowRunTraceView`) ya renderiza `skipped`+`reason`; solo se añade el detalle de la guarda.

**UI.** En `ActionConfigFields`, un disclosure "Solo ejecutar si…" por nodo de acción que edita
`output.when` con el mismo editor de condiciones del trigger.

**Tests.** output con guarda que no pasa → skipped; sin guarda → siempre; retrocompat (flujos sin
`when`).

---

### B3 · Webhook: método HTTP y headers custom

**Schema** (bump compartido): `WebhookOutputSchema` gana
`method: z.enum(["POST","PUT","PATCH"]).optional()` (default POST) y
`headers: z.record(z.string()).optional()` (valores interpolables).

**Request builder** (`webhook-request.ts`): usar `output.method ?? "POST"`; mergear `output.headers`
(interpolados con `interpolateString`) **debajo** de los headers de firma `X-Hito-*` + `Content-Type`
(la firma siempre gana, no se puede sobrescribir). La firma sigue cubriendo el `rawBody` (032 §A) — los
headers no entran en la firma.

**UI.** En `ActionConfigFields` (webhook): selector de método + editor de headers clave→`InterpolableField`
(mismo patrón que el payload personalizado). Validación en vivo de nombres de header.

**Tests.** método aplicado; headers custom presentes junto a la firma; header que colisiona con `X-Hito-*`
no la sobrescribe; retrocompat (sin campos = POST idéntico).

---

### B4 · Verificación de firma entrante en el inbox

**Schema/config.** La conexión `webhook-inbox` gana en `config` un flag `verifySignature?: boolean`.
Cuando está activo, cada entrega debe traer una firma (el proxy la incluye, o Make/Zapier la calculan)
que Hito valida con `verifyRaw` (032 §A) usando el secreto de la conexión.

**Poller** (`inbox-poller.ts`): si `verifySignature`, por cada delivery calcular
`verifyRaw(JSON.stringify(delivery.body), secret, delivery.signature)`; si falla, descartar y contar
como rechazada (a `syncLogs` con `status:"error"`). El `Code.gs` del inbox (032 §D) documenta cómo
firmar del lado de Make/Zapier.

**Tests.** delivery con firma válida pasa; inválida se descarta; sin `verifySignature`, comportamiento
actual.

---

## Arco C — Confianza y pulido

### C1 · Notificación de fallo clicable (deep-link al run)

**Schema** (`src/domain/schemas/notification.ts`, bump 15→16 identidad): `EntityRefSchema.kind` gana
`"flow"`; se añade `runId?: string` opcional a `EntityRefSchema` (los demás kinds lo ignoran).

**Emisión.** La notificación de fallo de 024 §F3 (en `useDataStore`, `applyFlowResult`
`options.isAutomatic`) setea `entityRef: { kind: "flow", id: flowId, runId }` en vez de dejar el mensaje
autodescriptivo suelto.

**Deep-link.** El centro de notificaciones (donde se resuelven los `kind` a rutas) mapea `kind:"flow"`
→ `ROUTES.flowHistory` con `?run=<runId>` (o el patrón de query que use `FlowHistoryPage`); al abrir,
`FlowHistoryPage` enfoca ese run y abre `FlowRunDetailDrawer`.

**Retrocompat.** Notificaciones viejas sin `kind:"flow"` siguen resolviéndose igual (el nuevo kind es
aditivo). Migración identidad.

**Tests.** la notificación de fallo lleva `entityRef.kind === "flow"` + `runId`; el mapeo de ruta
produce el deep-link correcto.

---

### C2 · Versionado + rollback de flujos

**Datos.** Nuevo documento `flow-versions` (fuera de `flows` para no inflarlo), como `flow-runs`:
`{ flowId, versions: [{ id, savedAt, summary, definition: FlowRule }] }`, cap N=10 por flow (FIFO).
`useFlowStore.updateFlow` empuja un snapshot antes de sobrescribir. Export/import lo incluye
(opcional).

**UI.** "Historial de versiones" en el builder → lista con fecha/resumen; "Restaurar" crea una versión
nueva idéntica a la elegida (no borra intermedias) y la carga en el canvas.

**Migración.** Documento nuevo → no toca `SCHEMA_VERSION` de `flows` (es un doc aparte, como `flow-runs`).

---

### C3 · Coalescing de polling

**Motor de despacho.** Hoy cada Flujo poll registra su propio timer bajo `pollTriggerKey` (incluye
`connectionId`+objectType, 024 §F10). Coalescing: agrupar Flujos que comparten **key base**
(connection+objectType) e **intervalo**; una sola consulta por tick alimenta a todos vía `runPolledFlow`
iterando los N Flujos de ese grupo. Requiere que el `polling-manager` (o una capa encima) mantenga el
grupo de Flujos por key en vez de un solo callback. Cuidado de no reintroducir la colisión que 024 §F10
cerró: el despacho sigue siendo por Flujo, solo se comparte la llamada de red.

**Tests.** dos Flujos misma key/intervalo → una sola llamada `postToProxy`, ambos reciben el batch.

---

### C4 · Export de Conexiones sin secretos + reconexión guiada

**Export** (`FileSystemAdapter`/`DownloadAdapter` `exportAll`): incluir las `IntegrationConnection` de
Dexie **sin** `encryptedSecret` (se omite el campo). **Import** (`importAll`): recrear las conexiones
sin secreto (`encryptedSecret: null`, `enabled: false`) y, en Flujos, un banner "N conexiones sin
resolver" con acceso a completarlas. `CollectionTransferCard` gana "Conexiones (sin secretos)".

**Riesgo.** Nunca serializar `encryptedSecret`; test que verifica que el bundle exportado no lo contiene.

---

## Resumen de bumps de schema

| Feature | Schema | Bump |
|---|---|---|
| B1 schedule trigger | `flow.ts` (TriggerSchema) | 15→16 (identidad) |
| B2 output guard | `flow.ts` (Output.when) | mismo 16 |
| B3 webhook method/headers | `flow.ts` (WebhookOutput) | mismo 16 |
| C1 notif kind "flow" | `notification.ts` (EntityRef) | mismo 16 (identidad) |
| A1/A2/A3 | — (usan `syncLogs`/config Dexie) | sin bump de dominio |
| C2 versiones | doc `flow-versions` (aparte) | sin bump |
| C4 export conexiones | adapters | sin bump |

Fase 2 (B1/B2/B3) introduce el bump 15→16; C1 (Fase 1) puede compartirlo o hacer el suyo — coordinar la
primera feature de schema que se implemente para introducir la migración identidad una sola vez.

## Plan de tests (resumen; detalle en tasks.md)

- **A1:** `useDataStore` con `integrationDb` mockeado (persistencia + máscara); replay = misma firma.
- **A2:** derivación de salud pura sobre mocks.
- **B1:** cadencia dispara una vez por ventana; catch-up no duplica; watermark.
- **B2:** guarda skip/ejecuta; retrocompat.
- **B3:** método/headers aplicados; firma no sobrescribible; retrocompat.
- **B4:** firma entrante válida/ inválida.
- **C1:** entityRef kind "flow"+runId; mapeo de ruta.
- **C2:** snapshot al guardar; restaurar crea versión nueva.
- **C3:** una llamada compartida por grupo.
- **C4:** export sin secretos; import recrea inactivas.
