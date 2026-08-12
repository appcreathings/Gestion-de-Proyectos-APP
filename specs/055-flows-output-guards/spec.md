# Spec 055 — Flujos: guardas por salida (branching ligero)

> Estado: **IMPLEMENTADO** (2026-08-11).
> Feature dir: `specs/055-flows-output-guards/` · Fecha: 2026-08-11
> Extrae: **spec 033 · B2**. Roadmap: `flows-output-guards`.
> Antecede: 024 §F6 (documentó branching, no lo construyó), 027 §F (`conditionMode` all/any
> plano en el trigger), motor `evaluateConditionsDetailed`, canvas `ConditionConfigFields`.
> Baseline: **1096 tests / 109 archivos**, `SCHEMA_VERSION` **19**.
> Principios: **V** simplicidad (guarda plana por output, no árbol visual de ramas).

## 1. Contexto

Hoy un Flujo tiene **un** set de condiciones globales (`flow.logic.conditions` +
`conditionMode`). Si pasan, **todas** las acciones del array `outputs` se ejecutan en orden.
Si el usuario quiere:

> *Si el deal es grande → crear proyecto **y** avisar; si es chico → solo crear tarea*

…hoy hay que **duplicar el flujo entero** (o vivir con efectos de más).

033 §B2 lo dejó en backlog con diseño claro. Esta spec lo verticaliza.

### 1.1 Qué reutilizamos

- `FlowConditionSchema` + `evaluateConditionsDetailed` ([engine.ts](src/flows/engine.ts)).
- `conditionMode: "all" | "any"` (027 §F).
- Traza `outcome: "skipped"` + `reason` (ya renderizada en `FlowRunTraceView`).
- UI de condiciones del canvas (`ConditionConfigFields`) — reusar, no reinventar.

### 1.2 Qué no es

- Árbol visual de ramas / if-else nodes en el canvas (fuera de 033).
- Condiciones anidadas (AND/OR de grupos).
- Else implícito: la “rama chica” es **otro output sin guarda o con guarda opuesta**.

## 2. Objetivo

Que cada **acción (output)** pueda llevar una guarda opcional *“Solo ejecutar si…”*; si la
guarda no se cumple, esa acción se omite (`skipped`) y el resto del flujo sigue (salvo
`onErrorPolicy: stop` en fallos reales, que no aplica a skips de guarda).

## 3. Decisiones fijadas

1. Campo opcional en cada output:  
   `when?: { conditions: FlowCondition[]; conditionMode?: "all" | "any" }`.  
   Ausente o `conditions: []` = **siempre** (retrocompat).
2. Evaluación **después** de condiciones globales + mapping/transform, **antes** de
   `executeOutput`, contra el mismo `record`/`transformed` que usan las acciones.
3. Skip de guarda **no** dispara `onErrorPolicy: stop` ni notificación de fallo.
4. Bump schema **19 → 20** identidad (si 051/056 no lo consumieron antes; coordinar).
5. UI: disclosure en config de cada nodo de acción; badge en el canvas si hay guarda.
6. Dry-run / describeOutputs: la traza muestra skipped por guarda igual que en real.

## 4. Historias y CAs

### HU-01 — Configurar guarda en una acción

- **CA-01.1** En el drawer/config de cualquier output hay “Solo ejecutar si…”.
- **CA-01.2** Se pueden añadir N condiciones con el mismo editor que el trigger
  (campo, op, valor) y modo todas/cualquiera.
- **CA-01.3** Guardar y reabrir el flujo conserva `when`.

### HU-02 — Ejecución selectiva

- **CA-02.1** Record que no cumple la guarda → ese output `skipped` con reason
  legible (“Omitido — guarda del paso no cumplida” o detalle breve).
- **CA-02.2** Los demás outputs sin guarda / con guarda cumplida se ejecutan.
- **CA-02.3** Flujo sin ningún `when` se comporta idéntico a hoy.
- **CA-02.4** Condiciones globales que fallan siguen cortando **todo** el registro
  (no se llega a outputs) — sin cambio.

### HU-03 — Traza y canvas

- **CA-03.1** Historial / dry-run muestran el skip de guarda.
- **CA-03.2** El nodo de acción indica visualmente que tiene guarda (badge o texto en
  resumen), sin exigir abrir el drawer.

## 5. Fuera de alcance

- Ramas visuales, else-node, switch multi-vía.
- Guardas sobre el *resultado* de un output anterior (solo sobre el record del trigger).

## 6. Archivos clave

- `domain/schemas/flow.ts` — `when` en outputs  
- `flows/engine.ts` — check pre-`executeOutput`  
- `ActionConfigFields.tsx` / nodeTypes meta  
- `FlowRunTraceView` (solo copy si hace falta)  
- tests engine + schema  

## 7. Progreso

- **Estado general: ✅ Implementado (2026-08-11).**
- **Baseline:** 1096 → **1103** tests (+7), todas en verde. `SCHEMA_VERSION` 19 → **20**.
  `tsc --noEmit` limpio.
- **Schema:** `OutputWhenSchema` + `when?` en las 9 variantes de `OutputSchema`
  (`src/domain/schemas/flow.ts`). Migración identidad `flows` v19→v20.
- **Motor:** loop de outputs en `engine.ts` evalúa `when` con `evaluateConditionsDetailed`
  sobre el registro transformado; skip → `outcome: "skipped"`, reason
  `"Omitido — guarda del paso no cumplida"`; no activa `onErrorPolicy: stop`.
- **UI:** `OutputWhenEditor.tsx` + wiring en `ActionConfigFields`; resumen de nodo
  `· con guarda` en `meta.ts` `actionSummary`.
- **Tests:** engine (4) + migrations v19→v20 + meta (2); fix `SCHEMA_VERSION` en
  `keys-never-exported.test.ts`.
