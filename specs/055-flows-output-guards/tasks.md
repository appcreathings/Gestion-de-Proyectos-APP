# Tasks 055 — Guardas por salida

Baseline: **1096 tests**, `SCHEMA_VERSION` **19**. Numeración **T5500+**.  
Coordinar bump 19→20 con 051/056 si se implementan en paralelo (una sola migración identidad).

---

## Fase 0 — Schema

- [x] **T5500** — `OutputWhenSchema` + `when?` en **todas** las variantes de `OutputSchema`.
- [x] **T5501** — Bump 19→20 identidad en `common.ts` + `migrations.ts` (+ test).
- [x] **T5502** — `when` viaja en `output` del node data (sin strip en graph).
- [x] **Checkpoint 0**

---

## Fase 1 — Motor

- [x] **T5510** — Loop de outputs con guarda (design §2).
- [x] **T5511** — Tests engine: no pasa / pasa / sin when / no confunde con onErrorPolicy stop.
- [x] **Checkpoint 1**

---

## Fase 2 — UI

- [x] **T5520** — `OutputWhenEditor` + wiring en `ActionConfigFields`.
- [x] **T5521** — Resumen `· con guarda` en `actionSummary`.
- [x] **T5522** — Traza con reason de guarda (cubierto en tests de engine + `FlowRunTraceView` existente).
- [x] **Checkpoint 2**

---

## Fase 3 — Cierre

- [x] **T5530** — typecheck + test verdes (1103).
- [x] **T5531** — Progreso 055; 033 §B2 marcado.
- [x] **T5532** — Roadmap `flows-output-guards` → shipped; `graphify update .`.

## Trazabilidad 033

| 033 | 055 |
|-----|-----|
| T3350 schema when | T5500–T5501 |
| T3351 engine | T5510–T5511 |
| T3352 UI + traza | T5520–T5522 |
| T3353 tests | T5511 |
