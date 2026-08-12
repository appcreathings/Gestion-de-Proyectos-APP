# Design 056 — Webhook method + headers

## 1. Schema

```ts
// WebhookOutputSchema
method: z.enum(["POST", "PUT", "PATCH"]).optional(),
headers: z.record(z.string()).optional(), // valores con {{}}
```

Bump 19→20 identidad si no lo introdujo 051/055.

## 2. `buildWebhookRequest`

Tras armar `headers` de sistema (Content-Type + X-Hito-* si firma):

```ts
const method = output.method ?? "POST";

const custom: Record<string, string> = {};
if (output.headers) {
  for (const [k, v] of Object.entries(output.headers)) {
    const name = k.trim();
    if (!name || isReservedHeader(name)) continue;
    const { value } = interpolateString(v, data); // o helper existente
    custom[name] = value;
    // unresolved tokens → acumular en unresolved[]
  }
}

// Sistema gana:
const headers = { ...custom, ...systemHeaders };

init: { method, headers, body: rawBody }
```

```ts
function isReservedHeader(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n === "content-type" ||
    n.startsWith("x-hito-")
  );
}
```

Firma sigue sobre `rawBody` únicamente (headers fuera de la firma) — sin cambio 032.

## 3. UI (`ActionConfigFields` webhook)

- Select método: POST | PUT | PATCH  
- Lista de pares header name + `InterpolableField` value  
- Hint: “No podés sobrescribir Content-Type ni X-Hito-*. Para auth de terceros usá headers
  (ej. Authorization), no el secreto de firma de Hito.”
- Validación ligera: nombre no vacío, sin espacios raros (`/^[\w-]+$/i`).

## 4. Tests

| Caso | Esperado |
|------|----------|
| method PUT | init.method === "PUT" |
| header custom | presente en init.headers |
| custom X-Hito-Signature | no pisa la firma real |
| custom Content-Type | no pisa application/json |
| sin campos | POST + headers actuales |
| interpolación `{{token}}` | resuelve desde data |

Reusar suite `webhook-request` / signing tests.

## 5. Superficies

Motor, “Probar webhook”, Reenviar (033 A1) — todos pasan por `buildWebhookRequest` → gratis.
