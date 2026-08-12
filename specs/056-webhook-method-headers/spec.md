# Spec 056 — Webhook saliente: método HTTP y headers custom

> Estado: **IMPLEMENTADO** (2026-08-11).
> Feature dir: `specs/056-webhook-method-headers/` · Fecha: 2026-08-11
> Extrae: **spec 033 · B3**. Roadmap: `webhook-http-power`.
> Antecede: 032 (firma), 034 (modo simple bare), `buildWebhookRequest`, 055 (`SCHEMA_VERSION` 20).
> Principios: **V** aditivo (default POST idéntico al actual).

## 1. Contexto

`buildWebhookRequest` fija `method: "POST"` y headers solo `Content-Type` + opcionales
`X-Hito-*` ([webhook-request.ts](src/flows/webhook-request.ts)). Eso basta para catch-hooks
de Make/Zapier; **no** alcanza para APIs que exigen `PUT`/`PATCH` o
`Authorization: Bearer …` / `X-Api-Key`.

## 2. Objetivo

Campos opcionales en el output webhook:

- `method?: "POST" | "PUT" | "PATCH"` (default efectivo **POST**)
- `headers?: Record<string, string>` (valores **interpolables** con `{{}}`)

La firma `X-Hito-*` y `Content-Type: application/json` **no** se pueden sobrescribir con
headers custom (la firma siempre gana).

## 3. Decisiones

1. Sin GET/DELETE en v1 (sin body semántico claro para este output).
2. Headers custom se mergean **debajo** de los del sistema:  
   `final = { ...interpolatedCustom, ...systemHeaders }` o system last-write-wins.
3. Nombres de header inválidos → validación en UI / ignore en runtime con traza.
4. Secreto de terceros en `headers`, no en `secret` de firma Hito (documentar en UI).
5. Bump 19→20 identidad (compartido con 051/055).
6. Retrocompat: sin campos = POST idéntico.

## 4. CAs

- **CA-01** PUT + header `Authorization: Bearer {{token}}` → request usa método y header.
- **CA-02** Header que intenta pisar `X-Hito-Signature` no lo reemplaza.
- **CA-03** Webhook viejo sin method/headers → POST igual que hoy.
- **CA-04** UI: selector de método + editor clave→valor interpolable.
- **CA-05** “Probar webhook” / reenviar usan el mismo `buildWebhookRequest`.

## 5. Fuera de alcance

- GET, query params builder, multipart, OAuth interactivo.
- Editor JSON libre del body (sigue clave/valor + bare/envelope).

## 6. Progreso

- **Estado general: ✅ Implementado (2026-08-11).**
- **Schema:** `WebhookOutput.method?` (`POST|PUT|PATCH`) + `headers?: Record<string,string>`.
  Sin bump extra (campos opcionales sobre `SCHEMA_VERSION` 20 de 055).
- **Builder:** `buildWebhookRequest` aplica `method`, interpola headers, reserva
  `Content-Type` / `X-Hito-*` (`isReservedWebhookHeader`). Motor / Probar / Reenviar reusan el builder.
- **UI:** selector de método + editor de headers en `ActionConfigFields` (webhook).
- **Tests:** +6 en `webhook-request.test.ts` (19 total en el archivo). Suite completa en verde.
