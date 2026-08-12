import { nowIso, uuid } from "@/lib/utils";
import type { WebhookOutput } from "@/domain/schemas/flow";
import { signRaw } from "@/integrations/outbound/signing";
import { interpolateObject, interpolateString } from "./interpolation";

/** Headers que el sistema define y el usuario no puede sobrescribir (spec 056). */
export function isReservedWebhookHeader(name: string): boolean {
  const n = name.trim().toLowerCase();
  return n === "content-type" || n.startsWith("x-hito-");
}

export interface WebhookRequest {
  url: string;
  /** Opciones listas para `fetch(url, init)` — sin `signal`, cada caller
   * (motor real, "Probar webhook") decide su propio timeout. */
  init: RequestInit;
  /** Payload ya interpolado (los datos, sin el envelope). */
  payload: Record<string, unknown>;
  /** Body crudo exacto que se envía y sobre el que se calculó la firma. */
  rawBody: string;
  /** Firma HMAC (`sha256=<hex>`) sobre `rawBody` — verificable por el receptor.
   * Cadena **vacía** cuando el webhook no tiene secreto (modo Simple, spec 034
   * §A): en ese caso NO se firma ni se envía el header `X-Hito-Signature`. */
  signature: string;
  /** Id único de esta entrega (`X-Hito-Delivery`). Se calcula siempre (el
   * envelope lo usa como `eventId`), pero solo viaja como header cuando se firma. */
  deliveryId: string;
  /** Timestamp ISO de la entrega (`X-Hito-Timestamp`, anti-replay). Solo viaja
   * como header cuando se firma. */
  timestamp: string;
  /** Tokens `{{x}}` del payload que no resolvieron contra `data` (spec 026 §A/§E). */
  unresolved: string[];
}

/**
 * Construye la request de un output `webhook` — payload interpolado, envelope
 * (o body plano), firma HMAC y headers `X-Hito-*` — sin llamar a `fetch`.
 * Compartida por el motor (`engine.ts`) y "Probar webhook" (`webhook-test.ts`),
 * y por "Reenviar" (spec 032 §C): una sola fuente de verdad para la firma.
 *
 * Invariante de correctitud (spec 032 §A): la firma se calcula sobre el
 * **string exacto del body que se envía** (`signRaw(rawBody)`), no sobre un
 * objeto paralelo. Antes se firmaba un envelope con `eventId`/`timestamp` que
 * nunca se transmitían, por lo que el receptor no podía reproducir el cálculo y
 * `X-Hito-Signature` era, en la práctica, inverificable.
 *
 * Firma opcional (spec 034 §A): si `output.secret` está vacío, el webhook es
 * "limpio" — se envía solo el body (plano o envelope, según `payloadShape`) con
 * `Content-Type: application/json` y NINGÚN header `X-Hito-*`. Firmar es un
 * upgrade opt-in; el primer contacto con Make/Zapier no lo necesita.
 */
export async function buildWebhookRequest(
  output: WebhookOutput,
  data: Record<string, unknown>
): Promise<WebhookRequest> {
  const { value: payload, unresolved } = output.payload
    ? interpolateObject(output.payload, data)
    : { value: data, unresolved: [] as string[] };

  const deliveryId = uuid();
  const timestamp = nowIso();
  const shape = output.payloadShape ?? "bare"; // guardados antes de 032 = bare

  // Campos `eventId`/`eventType` (no `id`/`type`) para coincidir exactamente con
  // el envelope que documenta `WebhookSignatureGuide.tsx` y sus recetas de
  // verificación (Express/Python/Zapier/Make) — antes esa guía describía este
  // shape pero el código enviaba solo `data`, dejando la firma inverificable.
  const bodyObject =
    shape === "envelope"
      ? {
          eventId: deliveryId,
          eventType: "flow.execution",
          timestamp,
          workspace: { org: "Hito" },
          data: payload,
        }
      : payload;

  // Se serializa UNA sola vez y se firma ESE string — así el receptor puede
  // verificar `HMAC(rawBody, secret) === X-Hito-Signature`.
  const rawBody = JSON.stringify(bodyObject);

  // Spec 056: headers custom interpolables (merge debajo de los del sistema).
  const customHeaders: Record<string, string> = {};
  const headerUnresolved: string[] = [];
  if (output.headers) {
    for (const [rawName, rawValue] of Object.entries(output.headers)) {
      const name = rawName.trim();
      if (!name || isReservedWebhookHeader(name)) continue;
      const { value, unresolved: u } = interpolateString(rawValue, data);
      customHeaders[name] = value;
      for (const token of u) {
        if (!headerUnresolved.includes(token)) headerUnresolved.push(token);
      }
    }
  }

  // Secreto vacío ⇒ webhook limpio (spec 034 §A): sin firma, sin headers
  // `X-Hito-*`. Con secreto ⇒ firma verificable de spec 032 (no se rompe).
  const shouldSign = output.secret.trim().length > 0;
  // Sistema gana siempre: Content-Type + X-Hito-* pisan cualquier custom.
  const systemHeaders: Record<string, string> = { "Content-Type": "application/json" };
  const signature = shouldSign ? await signRaw(rawBody, output.secret) : "";
  if (shouldSign) {
    systemHeaders["X-Hito-Signature"] = signature;
    systemHeaders["X-Hito-Event"] = "flow.execution";
    systemHeaders["X-Hito-Delivery"] = deliveryId;
    systemHeaders["X-Hito-Timestamp"] = timestamp;
  }
  const headers = { ...customHeaders, ...systemHeaders };
  const allUnresolved = [...unresolved];
  for (const token of headerUnresolved) {
    if (!allUnresolved.includes(token)) allUnresolved.push(token);
  }

  return {
    url: output.url,
    payload,
    rawBody,
    signature,
    deliveryId,
    timestamp,
    unresolved: allUnresolved,
    init: {
      method: output.method ?? "POST",
      headers,
      body: rawBody,
    },
  };
}
