# Spec 051 — Flujos: trigger programado (schedule / cron ligero)

> Estado: **IMPLEMENTADO** (2026-08-11).
> Feature dir: `specs/051-flows-trigger-programado/` · Fecha: 2026-08-11
> Extrae y detalla: **spec 033 · B1** (Fase 2 — Expresividad).
> Antecede: 019 (retiró la superficie muerta de schedule), 023 §F (panel de servicios),
> 024 §F10 (keys de poll sin colisión), 032 §E (caveat “solo con pestaña abierta” + catch-up),
> 033 Fase 1 (A1/A2/A3/C1 ya en producción).
> Baseline al empezar: **1096 tests en 109 archivos**, `SCHEMA_VERSION` **19**, `tsc` limpio, build OK.
> Principios: **I** local-first (timers en el cliente), **II** schema aditivo con migración identidad,
> **V** simplicidad (cadencias nombradas, no cron libre).

## 1. Contexto

Hoy un Flujo solo puede arrancar de dos formas:

| Tipo | Cómo corre | Ancla |
|------|------------|--------|
| `event` | Al mutar datos de Hito (tarea, proyecto, checklist…) | `DomainEvent` + `runAutomations` |
| `poll` | Cada N min consulta HubSpot / Sheets / inbox | `pollingManager` + `runPolledFlow` |

El schema lo confirma: `TriggerSchema` es un `discriminatedUnion` de solo `event | poll`
([flow.ts:66-69](src/domain/schemas/flow.ts#L66-L69)). La opción “Programado” existió en
automations legacy y se **retiró** en spec 019 §0.3 en vez de construirse; `labels.ts` todavía
tiene un fantasma `"schedule: Programado (M4)"` que no alimenta ningún trigger de Flows.

Eso deja fuera casos cotidianos del perfil no-code:

- “Cada día a las 9:00 avisame las tareas vencidas”
- “Cada lunes crear la tarea semanal de reporte”
- “Cada hora, aunque no haya evento ni poll, correr un resumen”

Es el tercer disparador canónico de cualquier iPaaS y hoy es un **gap real** (033 §B1 ❌).

### 1.1 Qué ya existe y se reutiliza

- Motor puro `runFlowEngine` (`EngineInput → EngineResult`) — no se mete I/O/timers dentro
  ([engine.ts](src/flows/engine.ts)); patrón fijado en 033 design.
- `pollingManager` + `visibility-aware` (pausa al ocultar pestaña, resume al foco).
- Watermark en `localStorage` vía `poll-sync-state.ts` (`loadLastSyncAt` / `saveLastSyncAt`).
- `applyFlowResult` / `runFlowNow` / historial de runs / notificaciones de fallo (033 A1+C1).
- `ScheduledServicesPage` lista timers de poll y salud por conexión.
- Caveat de producto documentado en 032 §E: **solo corre con Hito abierto**; al reabrir hay catch-up.

### 1.2 Qué no es esta spec

- Cron string libre (`0 9 * * 1-5`) — perfil no-code; cadencias nombradas bastan.
- Ejecución en background con la pestaña cerrada / service worker / backend — contra Principio I
  y el modelo local-first actual.
- “N disparos perdidos” al reabrir (p. ej. 7 diarios si estuvo una semana cerrada) — catch-up
  **de a lo sumo uno** por cadencia (coherente con 032 §E / 033 design B1).
- Branching por output (033 B2), headers HTTP (B3), versionado de flujos (C2) — otras features.

## 2. Objetivo

Que el usuario pueda elegir **“En un horario”** al configurar un Flujo y que ese Flujo corra
**solo** a la hora elegida (diaria / semanal / cada hora), con catch-up seguro al reabrir Hito
si el disparo venció mientras estaba cerrado — sin doble disparo y sin inventar un backend.

## 3. Decisiones fijadas (no re-preguntar al implementar)

1. **Cadencias nombradas, no cron.** `hourly | daily | weekly` + `atMinute` / `atHour` / `weekday`.
2. **Hora local del dispositivo.** Sin timezone configurables en v1 (el reloj del SO del usuario).
3. **Record sintético.** Cada disparo produce un único registro `{ firedAt, cadence, weekday? }`
   interpolable (`{{firedAt}}`, etc.). Sin proyecto de origen (igual que poll): outputs que mutan
   proyectos deben targetear explícitamente.
4. **Scheduler hermano del poll, no metido en el motor.** Nuevo
   `src/integrations/scheduling/schedule-manager.ts` (+ watermark). El motor solo reconoce el
   trigger y resuelve datos.
5. **Watermark por `flowId`.** Persistir `lastFiredAt` en `localStorage` (mismo patrón que
   `poll-sync-state`). El catch-up avanza el watermark **antes o atómicamente** con el disparo
   para no duplicar si el motor tarda o falla a medias (detalle en `design.md`).
6. **Catch-up = 1 disparo pendiente como máximo** por Flujo al hidratar / recuperar foco, no N.
7. **Re-registro al hidratar es obligatorio.** Hoy `useFlowStore.hydrate` carga flujos pero
   **no** re-registra pollers (solo `add`/`update`/`delete` llaman a `registerPollTrigger`).
   Esta spec **debe** registrar schedules al hidratar; de paso unifica el registro de poll
   habilitados al abrir la app (bug/gap latente documentado en design).
8. **Bump de schema 19 → 20** con paso identidad en `flows` (y kinds que compartan el número
   global). Discriminated union gana el tercer miembro; flujos existentes no lo usan.
9. **UI no-code en TriggerStep + canvas.** Opción “En un horario” con selectores; resumen en el
   nodo del canvas; listado en `ScheduledServicesPage`.
10. **“Ejecutar ahora”** para un schedule corre **una** vez con record sintético “ahora” (no
    espera a la cadencia) — simétrico a poll/event manual (spec 022).

## 4. Historias de usuario y criterios de aceptación

### HU-01 — Elegir un horario al crear/editar un Flujo

Como usuario, quiero decir “corre cada día a las 9:00” sin escribir cron ni código.

- **CA-01.1** En el selector de trigger (canvas / `TriggerStep`) aparece **“En un horario”**
  junto a evento y polling.
- **CA-01.2** Puedo elegir cadencia: **cada hora** / **cada día** / **cada semana**.
- **CA-01.3** Diaria: elijo hora (0–23) y minuto (0–59). Semanal: además el día de la semana
  (0=domingo … 6=sábado, o etiquetas en español en la UI). Horaria: solo minuto (p. ej. :00 o :30).
- **CA-01.4** El nodo de trigger en el canvas resume en lenguaje natural, p. ej.
  “Cada día a las 09:00”, “Cada lunes a las 09:00”, “Cada hora en el minuto 0”.
- **CA-01.5** Validación: un schedule semanal sin `weekday`, o daily/weekly sin `atHour`, es
  error accionable en `validateFlow` (no un crash de Zod al guardar si se puede prevenir en UI).
- **CA-01.6** Flujos guardados solo con `event`/`poll` siguen parseando y corriendo igual
  (retrocompat; migración identidad).

### HU-02 — El Flujo corre a la hora elegida (con Hito abierto)

Como usuario, quiero que a las 9:00 el Flujo se ejecute **una vez** ese día, no en cada tick
del timer.

- **CA-02.1** Con Hito abierto y el Flujo **enabled**, al cruzar el instante de disparo el motor
  corre **una** vez con el record sintético.
- **CA-02.2** Entre dos ventanas de cadencia no hay re-disparos (idempotencia vía watermark).
- **CA-02.3** El run entra al historial como ejecución automática (`isAutomatic: true`), con
  traza legible (trigger schedule + `firedAt`).
- **CA-02.4** Si el Flujo está deshabilitado, no se registra timer ni catch-up.
- **CA-02.5** Condiciones, transformación y outputs corren igual que en event/poll; variables
  `{{firedAt}}` / `{{cadence}}` están disponibles en el panel de variables y en interpolación.

### HU-03 — Catch-up al reabrir Hito

Como usuario, si cerré la pestaña a las 8:50 y la abro a las 11:00, quiero que el disparo de
las 9:00 **no se pierda del todo**, pero tampoco que se dispare 7 veces si estuve una semana
fuera.

- **CA-03.1** Al hidratar Flows (abrir app con workspace listo), si `now ≥ próximo disparo
  teórico desde lastFiredAt` (o nunca se disparó y el horario de hoy/esta semana ya pasó), se
  ejecuta **como máximo un** catch-up por Flujo.
- **CA-03.2** Tras el catch-up (o tras decidir que no aplica), el watermark queda en un valor
  que **impide** un segundo disparo en la misma ventana de cadencia.
- **CA-03.3** Si no había disparo vencido, no corre nada al abrir.
- **CA-03.4** El caveat de 032 §E sigue visible: en `ScheduledServicesPage` (y/o tooltip del
  trigger) se aclara que los horarios corren **solo con Hito abierto** y que al reabrir hay
  catch-up de un disparo pendiente.

### HU-04 — Ver y controlar servicios programados

Como usuario, quiero saber qué flujos de horario están activos sin adivinar.

- **CA-04.1** `ScheduledServicesPage` lista los schedules activos (nombre del flujo, cadencia
  legible, último disparo / próximo estimado si es barato de calcular, estado del timer).
- **CA-04.2** Al deshabilitar o borrar el Flujo, el timer se desregistra (sin fugas).
- **CA-04.3** Al cambiar la cadencia en el editor y guardar, se re-registra con la nueva config.

### HU-05 — Ejecutar ahora (prueba manual)

Como usuario, quiero probar el Flujo de horario sin esperar a las 9:00.

- **CA-05.1** “Ejecutar ahora” en un Flujo `schedule` corre una vez con `firedAt = now` y deja
  el run en el historial (misma semántica de 022; `isAutomatic: false`).
- **CA-05.2** Ese “Ejecutar ahora” **no** avanza el watermark de la cadencia real (o, si se
  avanza por simplicidad, queda documentado y testeado — decisión en design: **no avanza** el
  watermark de schedule, para no “gastar” el disparo de las 9:00 al probar a las 8:00).

## 5. Modelo de datos (vista de producto)

```ts
// Conceptual — detalle Zod en design.md
type ScheduleTrigger = {
  type: "schedule";
  cadence: "hourly" | "daily" | "weekly";
  atMinute: number;   // 0–59, default 0
  atHour?: number;    // 0–23, required for daily/weekly
  weekday?: number;   // 0–6 (Dom…Sáb), required for weekly
};
```

Record de ejecución (sintético, no es un DomainEvent):

```ts
{ firedAt: string /* ISO */, cadence: "hourly" | "daily" | "weekly", weekday?: number }
```

Watermark (fuera del doc `flows`, en `localStorage`):

```
hito:schedule-lastFired:<flowId> → ISO string
```

## 6. Roadmap de implementación (resumen)

| Fase | Qué entrega | Riesgo principal |
|------|-------------|------------------|
| **0** | Schema + migración 19→20 + helpers puros de cadencia/próximo disparo | Cálculo de “próximo” mal en DST / medianoche |
| **1** | Motor: `matchesTrigger` / `resolveTriggerData` + variables | Exhaustividad del switch |
| **2** | `schedule-manager` + watermark + catch-up + registro al hidratar | Doble disparo / fugas de timer |
| **3** | UI TriggerStep + canvas + validación + “Ejecutar ahora” | Selectores incompletos |
| **4** | `ScheduledServicesPage` + caveat + tests de cierre + Progreso | Visibilidad operativa |

Detalle de tareas: [`tasks.md`](./tasks.md). Diseño técnico: [`design.md`](./design.md).

## 7. Fuera de alcance (documentado)

- Cron libre, timezones nombrados, calendarios laborales, “solo días hábiles”.
- Disparo por fecha absoluta de una tarea (`date.due` como trigger de Flow) — es otro producto
  (el evaluador temporal M4 de automations legacy es distinto).
- Coalescing entre muchos schedules en un solo timer global (optimización; v1 = timer/tick por
  flujo o un tick compartido de 60s que evalúa todos — design elige **un tick compartido**).
- Notificaciones del SO / push cuando Hito está cerrado.

## 8. Archivos clave (previsto)

| Área | Archivos |
|------|----------|
| Schema | `src/domain/schemas/flow.ts`, `common.ts` (`SCHEMA_VERSION`), `migrations.ts` |
| Motor | `src/flows/engine.ts`, `src/flows/validation.ts`, tests del engine |
| Scheduler | **nuevo** `src/integrations/scheduling/*` |
| Store | `src/store/useFlowStore.ts`, `src/store/useDataStore.ts` (`runScheduledFlow` / `runFlowNow`) |
| UI | `TriggerStep.tsx`, canvas (`meta.ts`, `variables.ts`, nodeTypes/drawers), `ScheduledServicesPage.tsx`, `FlowsPage.tsx` |
| App bootstrap | `src/App.tsx` o hydrate de `useFlowStore` (re-registro + catch-up) |

## 9. Verificación

Al cerrar la implementación:

1. `npm run typecheck && npm run lint && npm test && npm run build` en verde.
2. Tests nuevos: helpers de cadencia, watermark/catch-up sin doble disparo, `matchesTrigger`
   schedule, registro/desregistro, validación de campos requeridos.
3. Smoke manual (ver `tasks.md` checkpoint final):
   - Flujo daily 1 min en el futuro → corre una vez.
   - Simular watermark antiguo → catch-up una vez al “hidratar”.
   - “Ejecutar ahora” no consume el disparo real (CA-05.2).
4. Actualizar **Progreso** de esta spec y marcar 033 §B1 como extraído/implementado vía 051.
5. `graphify update .` tras tocar código.

## 10. Progreso

- **Estado general: ✅ Implementado (2026-08-11).**
- **Baseline:** tests → **1123** en verde. `SCHEMA_VERSION` **21**. `tsc` limpio.
- **Schema:** `ScheduleTriggerSchema` (`hourly|daily|weekly` + atMinute/atHour/weekday) en
  `TriggerSchema`. Migración identidad flows v20→v21.
- **Cadencia / watermark:** `schedule-cadence.ts`, `schedule-sync-state.ts` (localStorage +
  memoria).
- **Scheduler:** `schedule-manager.ts` — tick 60s, watermark antes de `onFire`, catch-up en
  hydrate + visibility resume.
- **Motor:** `scheduleTriggerKey`, rama schedule en matches/resolve; dry-run + runFlowNow.
- **Store:** `registerTrigger` poll+schedule; hydrate re-registra y `evaluateAll`.
- **UI:** TriggerStep «En un horario»; Servicios programados lista schedules; Ejecutar ahora
  sin gastar watermark.
- **Tests:** cadence, manager, engine schedule (+ suite completa).
