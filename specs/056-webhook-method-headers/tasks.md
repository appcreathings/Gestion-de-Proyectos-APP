# Tasks 056 — Webhook method + headers

Numeración **T5600+**. Bump schema coordinado con 051/055 (19→20 una sola vez).

---

## Fase 0 — Schema + builder

- [x] **T5600** — `WebhookOutputSchema`: `method?`, `headers?`.
- [x] **T5601** — Sin bump (055 ya dejó SCHEMA_VERSION 20; campos opcionales).
- [x] **T5602** — `buildWebhookRequest`: method, merge headers, reserved names, interpolación.
- [x] **T5603** — Tests (design §4).
- [x] **Checkpoint 0**

---

## Fase 1 — UI

- [x] **T5610** — Select método + editor de headers + hint auth.
- [x] **T5611** — Aviso si el nombre de header está reservado.
- [x] **T5612** — Cubierto vía tests del builder (misma path que Probar/Reenviar).
- [x] **Checkpoint 1**

---

## Fase 2 — Cierre

- [x] **T5620** — typecheck + tests verdes.
- [x] **T5621** — Progreso 056; 033/roadmap.
- [x] **T5622** — graphify update opcional post-cierre.

## Trazabilidad 033

| 033 | 056 |
|-----|-----|
| T3360 schema | T5600–T5601 |
| T3361 webhook-request | T5602–T5603 |
| T3362 UI | T5610–T5611 |
| T3363 tests | T5603 |
