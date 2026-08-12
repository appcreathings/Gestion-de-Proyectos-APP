# Design 051 — Trigger programado (schedule)

Diseño técnico de la spec 051 (extrae 033 · B1). Anclado al código post-050:
`SCHEMA_VERSION = 19`, `TriggerSchema = event | poll`, motor puro sin timers.

Principio rector (heredado de 033): **no desestabilizar el motor** (`src/flows/engine.ts`).
Timers, `localStorage` y despacho viven en scheduling/store; el motor solo gana una rama más
en `matchesTrigger` / `resolveTriggerData`.

---

## 0. Mapa de archivos tocados (previsto)

| Área | Archivos | Naturaleza |
|------|----------|------------|
| Schema | `domain/schemas/flow.ts`, `common.ts`, `migrations.ts` (+ test) | `ScheduleTriggerSchema`; bump 19→20 identidad |
| Cadencia pura | **nuevo** `integrations/scheduling/schedule-cadence.ts` (+ test) | `nextFireAfter`, `isDue`, format legible |
| Watermark | **nuevo** `integrations/scheduling/schedule-sync-state.ts` (+ test) | `lastFiredAt` por `flowId` en `localStorage` |
| Manager | **nuevo** `integrations/scheduling/schedule-manager.ts` (+ test) | tick compartido 60s, register/unregister, catch-up |
| Motor | `flows/engine.ts` (+ tests) | rama `schedule`; exhaustividad switch |
| Variables / validación | `flows/validation.ts`, `features/flows/canvas/variables.ts`, `meta.ts`, `labels.ts` | UX + CA |
| Store | `useFlowStore.ts`, `useDataStore.ts` (`runFlowNow`, despacho schedule) | registro + ejecución |
| UI | `TriggerStep.tsx`, drawers/nodeTypes del canvas, `FlowsPage`, `ScheduledServicesPage` | selectores + listado |
| Bootstrap | `useFlowStore.hydrate` (preferido) o `App.tsx` | re-registro poll+schedule al abrir |

**Sin cambios de comportamiento** en: firma webhook, pollers HubSpot/Sheets/inbox (salvo el
re-registro al hidratar que también los re-arma — ver §4.3), `applyFlowResult` (solo lo consume
el nuevo camino de despacho).

---

## 1. Schema

### 1.1 `ScheduleTriggerSchema`

En `src/domain/schemas/flow.ts`, junto a `EventTriggerSchema` / `PollTriggerSchema`:

```ts
export const ScheduleTriggerSchema = z.object({
  type: z.literal("schedule"),
  cadence: z.enum(["hourly", "daily", "weekly"]),
  /** Minuto dentro de la hora (hourly/daily/weekly). */
  atMinute: z.number().int().min(0).max(59).default(0),
  /** Hora local 0–23. Requerido en la práctica para daily/weekly (validación de producto). */
  atHour: z.number().int().min(0).max(23).optional(),
  /** 0 = domingo … 6 = sábado (Date.getDay()). Solo weekly. */
  weekday: z.number().int().min(0).max(6).optional(),
});
export type ScheduleTrigger = z.infer<typeof ScheduleTriggerSchema>;

export const TriggerSchema = z.discriminatedUnion("type", [
  EventTriggerSchema,
  PollTriggerSchema,
  ScheduleTriggerSchema,
]);
```

**Por qué no `.refine` fuerte en Zod del trigger:** los flujos a medias en el editor (usuario
elige “semanal” y aún no tocó el día) deben poder **persistir borradores** como hoy hacen los
poll sin `connectionId`. La exigencia de `atHour`/`weekday` vive en `validateFlow` como
`severity: "error"` (bloquea “activar” con el mismo criterio que poll sin conexión — 027 §A /
038). El schema Zod solo garantiza tipos y rangos.

Defaults al crear desde UI:

| Cadencia | atHour | atMinute | weekday |
|----------|--------|----------|---------|
| hourly   | —      | 0        | —       |
| daily    | 9      | 0        | —       |
| weekly   | 9      | 0        | 1 (lunes) |

### 1.2 Bump 19 → 20 (identidad)

- `SCHEMA_VERSION = 20` en `common.ts`.
- `MIGRATIONS.flows` (y cualquier kind que deba converger al número global) suma
  `{ to: 20, up: (data) => data }` con comentario “spec 051 schedule trigger (identity)”.
- `migrateRecord` ya converge al target aunque falten pasos intermedios; igual se documenta el
  paso en el registry (convención 033/042).
- Test en `migrations.test.ts`: doc flows v19 → v20 sin mutar el array de flows.

**Nota:** el design 033 hablaba de 15→16; ese bump ya lo consumió C1. El número real al
implementar 051 es **19→20**.

---

## 2. Cadencia pura (`schedule-cadence.ts`)

Sin DOM, sin store — 100 % testeable.

```ts
export type ScheduleCadence = "hourly" | "daily" | "weekly";

export interface ScheduleSpec {
  cadence: ScheduleCadence;
  atMinute: number;
  atHour?: number;
  weekday?: number;
}

/** Instantes en ms epoch, zona = local del runtime (Date). */
export function nextFireAfter(spec: ScheduleSpec, afterMs: number): number;
export function previousFireAtOrBefore(spec: ScheduleSpec, atMs: number): number | null;
export function isDue(spec: ScheduleSpec, lastFiredAtMs: number | null, nowMs: number): boolean;
export function formatScheduleSummary(spec: ScheduleSpec): string; // "Cada día a las 09:00"
```

### 2.1 Semántica de `isDue`

```
isDue(spec, lastFiredAt, now) ===
  previousFireAtOrBefore(spec, now) != null
  && (lastFiredAt == null || previousFireAtOrBefore(spec, now)! > lastFiredAt)
```

En palabras: hay un disparo teórico ≤ now cuya marca es **estrictamente posterior** al último
disparo registrado (o nunca hubo disparo). Eso cubre:

- Primera vez que se activa un daily a las 9:00 y son las 11:00 → due (catch-up).
- Ya disparó hoy a las 9:01 (watermark) y son las 15:00 → no due.
- Hourly en minuto 0; lastFired 10:00:05; now 10:30 → no due; now 11:00:10 → due.

### 2.2 Construcción de `nextFireAfter` / `previousFireAtOrBefore`

Implementación recomendada (simple, sin librería de cron):

- **hourly:** anclar al minuto `atMinute` de cada hora local; si `after` cae exactamente en el
  ancla, el *next* es la siguiente hora (el *previous* sí incluye igualdad).
- **daily:** anclar a `atHour:atMinute` de cada día local.
- **weekly:** igual que daily pero solo el `weekday` elegido.

Cuidado con DST: usar componentes locales (`getFullYear/getMonth/getDate/getHours/…`) al armar
el `Date`, no sumar 24h en ms crudos para daily. Tests con fechas fijas alrededor de un cambio
de hora si el entorno lo permite; como mínimo tests con mediodía y medianoche locales.

### 2.3 Record sintético

```ts
export function syntheticScheduleRecord(
  spec: ScheduleSpec,
  firedAtIso: string,
): Record<string, unknown> {
  return {
    firedAt: firedAtIso,
    cadence: spec.cadence,
    ...(spec.weekday !== undefined ? { weekday: spec.weekday } : {}),
  };
}
```

---

## 3. Motor (`engine.ts`)

### 3.1 Entrada de ejecución

Hoy el engine distingue:

- `events: DomainEvent[]` → triggers `event`
- `externalData: Map<pollKey, records[]>` → triggers `poll`

Para schedule **no** se inventa un DomainEvent (contaminaría automations/temporal). Opciones:

| Opción | Pros | Contras |
|--------|------|---------|
| A. `externalData` con key `schedule:<flowId>` | Reusa camino poll | Confunde semántica “external” |
| B. Nuevo `scheduleData?: Map<flowId, record>` | Explícito | Toca `FlowEngineInput` |
| C. `events` sintéticos no-DomainEvent | — | Rompe tipos |

**Decisión: A (pragmática)** — reutilizar `externalData` con key estable:

```ts
export function scheduleTriggerKey(flowId: string): string {
  return `schedule:${flowId}`;
}
```

El despachador pone `externalData.set(scheduleTriggerKey(flow.id), [syntheticRecord])` y corre
`runFlowEngine` solo con ese flow (o con todos enabled; `matchesTrigger` filtra).

Alternativa limpia B se reserva si al tocar el input el diff es trivial; A es suficiente y
simétrica a poll.

### 3.2 `matchesTrigger` / `resolveTriggerData`

```ts
case "schedule":
  return externalData?.has(scheduleTriggerKey(/* need flowId */)) ?? false;
```

**Problema:** `matchesTrigger(trigger, …)` hoy **no recibe `flowId`**. El poll key sale del
trigger (`connectionId`+provider). Schedule key necesita el id del flow.

**Solución (mínima):**

1. Ampliar la firma interna:

```ts
function matchesTrigger(
  flow: FlowRule, // o (trigger, flowId)
  events: DomainEvent[],
  externalData?: Map<string, Record<string, unknown>[]>,
): boolean
```

2. En el loop principal (`runFlowEngine`), pasar `flow` en vez de solo `flow.trigger`.

3. `resolveTriggerData` igual: rama schedule lee `externalData.get(scheduleTriggerKey(flow.id))`
   y sources `[{}]` (sin proyecto de origen), idéntico a poll.

Tests: schedule con map poblado corre; sin map no corre; no cruza con otro `flowId`.

### 3.3 Exhaustividad

Todo `switch (trigger.type)` del codebase debe cubrir `schedule` o usar `never` check:

- `engine.ts` (`matchesTrigger`, `resolveTriggerData`)
- `validation.ts`
- `variables.ts` / `VariablesPanel` / `meta.triggerSummary`
- `TriggerStep` / canvas drawers
- `manual-run.ts` / `runFlowNowImpl`
- `useFlowStore` register helpers
- `migration.ts` (legacy automations: schedule legacy sigue sin migrar a Flow — ya devuelve null;
  no cambiar ese comportamiento salvo documentar que el *nuevo* schedule de Flows es otro tipo)

---

## 4. Scheduler

### 4.1 Watermark — `schedule-sync-state.ts`

Espejo de `poll-sync-state.ts`:

```ts
// localStorage key: `hito:schedule-lastFired:${flowId}`
export function loadLastFiredAt(flowId: string): string | null;
export function saveLastFiredAt(flowId: string, iso: string): void;
export function clearLastFiredAt(flowId: string): void; // al borrar flow (opcional hygiene)
```

### 4.2 Manager — `schedule-manager.ts`

**Un solo `setInterval` global de 60s** (no un timer por flujo): en cada tick evalúa todos los
registros. Menos fugas, más fácil de pausar con visibility.

```ts
interface ScheduleRegistration {
  flowId: string;
  spec: ScheduleSpec;
  /** Llamado cuando isDue; el manager ya avanzó (o avanza tras await) el watermark. */
  onFire: (firedAtIso: string) => Promise<void>;
}

class ScheduleManager {
  register(reg: ScheduleRegistration): void;
  unregister(flowId: string): void;
  /** Evalúa todos; usado al hidratar y en cada tick. */
  async evaluateAll(nowMs?: number): Promise<void>;
  pause(): void;
  resume(): void;
  getAllStatuses(): Record<string, { spec: ScheduleSpec; lastFiredAt: string | null }>;
}

export const scheduleManager = new ScheduleManager();
```

**Tick:** 60_000 ms. Alineado con “minuto” de las cadencias; un disparo a las 9:00 puede caer
entre 9:00:00 y 9:00:59 — aceptable para el perfil (documentar). Si se quiere más precisión,
tick 15s; no bajar a 1s.

**Orden del watermark (anti doble disparo) — decisión:**

```
1. due = isDue(spec, lastFired, now)
2. si !due → return
3. saveLastFiredAt(flowId, nowIso)   // AVANZAR PRIMERO
4. await onFire(nowIso)              // si falla, no reintenta en bucle; el user usa historial / Ejecutar ahora
```

Rationale: si se avanzara *después* y `onFire` colgara o el tab se cerrara a mitad, el próximo
tick re-dispararía (doble notificación / doble tarea). Preferimos **at-most-once** en la
ventana. Coherente con “catch-up de a lo sumo uno”.

### 4.3 Registro desde `useFlowStore`

Extender el patrón de poll:

```ts
async function registerTrigger(flow: FlowRule): Promise<void> {
  if (!flow.enabled) return;
  if (flow.trigger.type === "poll") { /* existente */ }
  if (flow.trigger.type === "schedule") {
    const { registerSchedule } = await import("@/integrations/scheduling/schedule-manager");
    registerSchedule(flow);
  }
}
```

`addFlow` / `updateFlow` / `deleteFlow`: unregister prev + register new (igual que poll).

**Hydrate — gap actual y fix:**

`hydrate()` hoy solo hace `set({ flows })` y **no** registra pollers. Eso implica que tras
recargar la página los polls solo vuelven si algo llama `updateFlow`. 032 design asumía
re-registro al abrir; el código no lo hace.

**En 051, `hydrate` (al final, si `flows.length`) debe:**

```ts
for (const flow of flows) {
  if (flow.enabled) await registerTrigger(flow);
}
// catch-up inmediato de schedules (evaluateAll una vez)
await scheduleManager.evaluateAll();
```

Esto **también** re-registra polls al abrir (corrección de gap, beneficio colateral, scope
aceptado). Tests de store: tras hydrate mockeado, `register*` fue llamado para enabled poll y
schedule.

### 4.4 Visibility

Reusar el espíritu de `visibility-aware.ts`:

- Opción 1: extender ese módulo para también `scheduleManager.pause/resume`.
- Opción 2: el schedule-manager escucha `document.visibilitychange` solo.

**Decisión:** extender `initVisibilityAwarePolling` → renombrar conceptualmente a
`initVisibilityAwareBackground` (o añadir `initVisibilityAwareScheduling` llamado al lado en
`App.tsx`) que pause/resume **ambos** managers. Al resume: `evaluateAll()` (catch-up de foco).

### 4.5 Despacho → motor

```ts
// schedule-manager onFire:
async function fireSchedule(flowId: string, firedAtIso: string) {
  await useDataStore.getState().runScheduledFlow(flowId, firedAtIso);
}

// useDataStore
async function runScheduledFlowImpl(flowId: string, firedAtIso: string) {
  const flow = useFlowStore.getState().flows.find(f => f.id === flowId);
  if (!flow || flow.trigger.type !== "schedule" || !flow.enabled) return;
  const record = syntheticScheduleRecord(flow.trigger, firedAtIso);
  const externalData = new Map([[scheduleTriggerKey(flowId), [record]]]);
  const result = await runFlowEngine({
    flows: [{ ...flow, enabled: true }],
    events: [],
    projects, people, /* …deps */,
    externalData,
    trace: true,
  });
  await applyFlowResult(result, flowStore, { isAutomatic: true });
}
```

### 4.6 `runFlowNow` para schedule

En `runFlowNowImpl`, rama nueva:

```ts
if (flow.trigger.type === "schedule") {
  const firedAt = nowIso();
  const record = syntheticScheduleRecord(flow.trigger, firedAt);
  externalData = new Map([[scheduleTriggerKey(flow.id), [record]]]);
  // NO tocar saveLastFiredAt — CA-05.2
}
```

`FlowsPage`: el botón “Ejecutar” que hoy ramifica poll vs event debe incluir schedule (mismo
camino que poll en el sentido de “no pide entidad”, o un camino directo sin diálogo).

---

## 5. UI

### 5.1 `TriggerStep` / drawer del canvas

Añadir a `TRIGGER_TYPES`:

```ts
{
  value: "schedule",
  label: "En un horario",
  icon: "⏰", // o lucide Clock en canvas
  description: "Cada día, semana o hora en el minuto que elijas",
}
```

Al seleccionar, `updateFlow({ trigger: { type: "schedule", cadence: "daily", atHour: 9, atMinute: 0 } })`.

Selectores:

1. Cadencia (hourly | daily | weekly)
2. Si daily/weekly → hora (select 0–23 o input)
3. Minuto (0–59; presets 0 / 15 / 30 / 45 + custom)
4. Si weekly → día (Lunes…Domingo)

Helper de copy bajo los selectores: “Solo corre mientras Hito esté abierto. Si estaba cerrado,
al reabrir se ejecuta como máximo un disparo pendiente.”

### 5.2 Canvas

- `triggerSummary`: `formatScheduleSummary(trigger)`.
- `variables.ts`: si `type === "schedule"`, exponer `firedAt`, `cadence`, `weekday?` como
  variables de ejemplo (sin muestra real).
- Node types: no marcar inválido por cuenta propia — solo vía `validateFlow` (038).

### 5.3 `validateFlow`

```ts
if (flow.trigger.type === "schedule") {
  const t = flow.trigger;
  if ((t.cadence === "daily" || t.cadence === "weekly") && t.atHour === undefined) {
    issues.push({ severity: "error", nodeKind: "trigger",
      message: "El horario diario/semanal necesita una hora." });
  }
  if (t.cadence === "weekly" && t.weekday === undefined) {
    issues.push({ severity: "error", nodeKind: "trigger",
      message: "El horario semanal necesita un día de la semana." });
  }
}
```

### 5.4 `ScheduledServicesPage`

Nueva sección **“Flujos programados”** (además de polling rows):

| Flujo | Cadencia | Último disparo | Timer |
|-------|----------|----------------|-------|
| Resumen diario | Cada día 09:00 | hace 2 h / nunca | activo |

Datos: `scheduleManager.getAllStatuses()` + nombres desde `useFlowStore.flows`.

Caveat 032 §E en un `Alert`/texto de ayuda al pie de la sección.

---

## 6. Plan de tests

| Capa | Casos mínimos |
|------|----------------|
| `schedule-cadence` | next/previous hourly/daily/weekly; isDue true/false; no due si ya disparó en la ventana; summary ES |
| `schedule-sync-state` | save/load/clear; fallo de localStorage no tira |
| `schedule-manager` | register → evaluate due dispara 1×; segunda evaluate no repite; unregister; pause |
| `engine` | matches schedule con key correcta; record sintético en traza; sin key no corre |
| `runFlowNow` | schedule no escribe watermark; success path |
| `validateFlow` | weekly sin weekday → error; daily ok |
| `migrations` | v19→v20 identidad flows |
| `useFlowStore` | hydrate registra schedule enabled; delete desregistra |

No se exigen tests E2E de reloj real; inyectar `nowMs` en `evaluateAll`.

---

## 7. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Doble disparo (tick + catch-up) | Watermark **antes** de `onFire`; `isDue` estricto |
| Timer huérfano al cambiar trigger de schedule→event | `updateFlow` siempre unregister prev |
| Usuario cree que corre con la tapa cerrada | Copy en UI + ScheduledServicesPage (032 §E) |
| DST / medianoche | Componentes locales en cadence helpers; tests ancla |
| Exhaustividad TypeScript al sumar el union member | `switch` con `assertNever`; CI typecheck |
| Re-registrar poll al hydrate cambia comportamiento | Deseable (corrige gap); smoke de un poll enabled tras reload |

---

## 8. Secuencia de implementación

Ver `tasks.md`. Orden técnico forzado:

1. Schema + migración (desbloquea tipos)
2. Cadence + sync-state (puros)
3. Engine branch (tests sin UI)
4. Manager + store wiring + hydrate
5. runFlowNow + UI + panel
6. Cierre (lint/test/build + Progreso + graphify update)
