# Guía — Proxy propio en Cloudflare Workers (NVIDIA / OpenCode Zen)

> Complementa `spec.md` §2 y **D7**. NVIDIA y OpenCode Zen no devuelven cabeceras CORS, así que el
> navegador descarta sus respuestas antes de que el JS las vea. La salida prevista es una **URL
> base propia**: un proxy tuyo que sí manda esas cabeceras. Esta guía arma ese proxy.
>
> **La app no cambia.** El Worker replica la forma de `/v1`, así que
> `OpenAiCompatibleProvider` le pega igual que a Z.ai o a OpenAI: `${baseUrl}/chat/completions`,
> `${baseUrl}/models`, `Authorization: Bearer …`, `stream: true`. Cero código nuevo del lado del
> producto. Los bugs del selector de modelos ad-hoc y de rotar la key (review 047) se cerraron en
> la **spec 049**.

## 0. Qué vas a tener al final

```
Navegador (hito)  ──►  https://<tu-worker>.workers.dev/nvidia/chat/completions
                            │  (agrega Access-Control-Allow-Origin, hace passthrough del SSE)
                            ▼
                       https://integrate.api.nvidia.com/v1/chat/completions
```

La API key **sigue viviendo solo en tu dispositivo**: viaja en el header `Authorization` de cada
request y el Worker la reenvía sin guardarla. No hay secretos en el Worker (§5 explica por qué es
la opción correcta).

Costo: **0**. El plan gratuito de Cloudflare da 100.000 requests/día. El límite de 10 ms de CPU no
es problema: el passthrough de streaming es I/O, no CPU.

## 1. Crear la cuenta y el Worker

1. Entrá a [dash.cloudflare.com](https://dash.cloudflare.com) y creá una cuenta gratuita (no hace
   falta tener un dominio ni pasar tarjeta).
2. En el menú lateral: **Workers & Pages** → **Create** → **Start with Hello World!** → **Deploy**.
3. Ponele un nombre poco adivinable (p. ej. `hito-ai-relay-8f3a`, no `proxy`): la URL va a ser
   pública, y un nombre obvio es más fácil de encontrar por terceros.
4. Cuando termine el deploy, **Edit code** para abrir el editor.

La URL queda como `https://hito-ai-relay-8f3a.<tu-subdominio>.workers.dev`. Anotala.

## 2. El código del Worker

Borrá todo lo que haya en el editor y pegá esto:

```js
// Relay CORS para proveedores de IA que no lo soportan (NVIDIA NIM, OpenCode Zen).
// La API key la manda el cliente en cada request: este Worker NO guarda secretos.

const UPSTREAM = {
  nvidia: "https://integrate.api.nvidia.com/v1",
  zen: "https://opencode.ai/zen/v1",
};

// Origins que pueden usar este relay. Agregá el tuyo si servís la app en otro lado.
const ALLOWED_ORIGINS = [
  "https://hito.autos",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") ?? "";
    const allowed = ALLOWED_ORIGINS.includes(origin);

    // Preflight: esto es exactamente lo que NVIDIA y Zen no contestan.
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin, allowed) });
    }

    if (!allowed) {
      return json({ error: "Origin no permitido" }, 403, cors(origin, false));
    }

    // /nvidia/chat/completions  ->  UPSTREAM.nvidia + /chat/completions
    const url = new URL(request.url);
    const [, target, ...rest] = url.pathname.split("/");
    const base = UPSTREAM[target];
    if (!base) {
      return json({ error: `Destino desconocido: ${target}` }, 404, cors(origin, true));
    }

    const upstream = `${base}/${rest.join("/")}${url.search}`;
    const auth = request.headers.get("Authorization");
    if (!auth) {
      return json({ error: "Falta Authorization" }, 401, cors(origin, true));
    }

    // El body de un chat es chico: lo leemos entero. Lo que importa que siga en
    // streaming es la RESPUESTA, y eso se preserva abajo con `res.body`.
    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const res = await fetch(upstream, {
      method: request.method,
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        Accept: request.headers.get("Accept") ?? "application/json",
      },
      body,
    });

    // Passthrough del stream SSE tal cual, agregando las cabeceras CORS.
    const headers = cors(origin, true);
    headers.set(
      "Content-Type",
      res.headers.get("Content-Type") ?? "application/json",
    );
    headers.set("Cache-Control", "no-store");
    return new Response(res.body, { status: res.status, headers });
  },
};

function cors(origin, allowed) {
  const h = new Headers();
  h.set("Access-Control-Allow-Origin", allowed ? origin : "null");
  h.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  h.set("Access-Control-Allow-Headers", "authorization, content-type");
  h.set("Access-Control-Max-Age", "86400");
  h.set("Vary", "Origin");
  return h;
}

function json(obj, status, headers) {
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(obj), { status, headers });
}
```

**Deploy** arriba a la derecha.

### Alternativa por CLI

Si preferís tenerlo versionado en un repo aparte:

```bash
npm create cloudflare@latest hito-ai-relay -- --type=hello-world
cd hito-ai-relay
# pegá el código en src/index.js
npx wrangler deploy
npx wrangler tail          # logs en vivo, útil para el paso 3
```

## 3. Verificar el Worker antes de tocar la app

Esto es lo que distingue "lo desplegué" de "funciona". Corré los tres, en este orden.

**a) El preflight ahora sí responde con CORS** (es lo que NVIDIA no hace):

```bash
curl -s -i -X OPTIONS "https://<tu-worker>.workers.dev/nvidia/chat/completions" \
  -H "Origin: https://hito.autos" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization,content-type" | head -12
```

Tenés que ver `HTTP/2 204` y **`access-control-allow-origin: https://hito.autos`**. Si no aparece
esa línea, nada de lo demás va a andar desde el navegador.

**b) Un origin no permitido queda afuera:**

```bash
curl -s -X OPTIONS "https://<tu-worker>.workers.dev/nvidia/chat/completions" \
  -H "Origin: https://sitio-cualquiera.com" -i | grep -i access-control-allow-origin
```

Debe decir `null`.

**c) Un request real con tu key** (reemplazá la key y el modelo):

```bash
curl -s -X POST "https://<tu-worker>.workers.dev/nvidia/chat/completions" \
  -H "Origin: https://hito.autos" \
  -H "Authorization: Bearer nvapi-TU-KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"meta/llama-3.1-8b-instruct","messages":[{"role":"user","content":"decí ok"}],"stream":true}' \
  | head -5
```

Tenés que ver líneas `data: {...}` llegando. Si ves un 401, la key está mal; si ves
`Destino desconocido`, revisá que el path arranque con `/nvidia` o `/zen`.

## 4. Configurar la app

1. **Ajustes → Asistente IA**.
2. **Proveedor**: `NVIDIA NIM (requiere URL propia)` — o `OpenCode Zen`.
3. **URL base**: `https://<tu-worker>.workers.dev/nvidia` (para Zen: `.../zen`).
   Sin barra final: la app la normaliza igual, pero el path importa.
4. **API key**: la de [build.nvidia.com](https://build.nvidia.com/) (`nvapi-…`) o la de
   [opencode.ai/auth](https://opencode.ai/auth). **Guardar** — la validación pega a
   `${baseUrl}/models` a través del Worker.
5. **Modelo**: como estos proveedores no tienen catálogo fijo en la app, escribí el id a mano.
   - NVIDIA: `meta/llama-3.1-8b-instruct`, `nvidia/llama-3.1-nemotron-70b-instruct`, …
     (el id lleva `/`, y está bien: el prefijo del proveedor se parte en el **primer** `:`).
   - OpenCode Zen: los que devuelva `GET /zen/v1/models` — p. ej. `deepseek-v4-flash-free`,
     `big-pickle`, `kimi-k2.6`.

## 5. Seguridad: por qué el Worker no guarda la key

La URL del Worker es pública y no puede pedir login (un header de auth propio dispararía preflight
con headers que la app no manda). Entonces hay dos diseños posibles:

| | Key en el cliente (**este**) | Key en el Worker (`env.NVIDIA_KEY`) |
|---|---|---|
| Si filtran la URL | Un tercero puede relayar **con su propia key**: te gasta requests del plan gratis | Un tercero usa **tu** key gratis hasta que la revoques |
| Principio I | La key sigue solo en tu dispositivo, únicamente transita | La key vive en infraestructura de Cloudflare |
| Cambios en la app | Ninguno: la app ya manda `Authorization` | Habría que sacar el header, o sea tocar el adaptador |

Por eso la guía usa la primera. `ALLOWED_ORIGINS` **no es seguridad real** (el header `Origin` se
falsea trivialmente fuera de un navegador); sirve para que otra *página web* no use tu relay, no
para frenar a alguien con `curl`. Si algún día ves consumo raro, renombrá el Worker: la URL cambia
y el anterior deja de existir.

Y no agregues `console.log(body)` al Worker: los logs de Cloudflare quedan asociados a tu cuenta.

## 6. Límites reales

| | Plan gratis |
|---|---|
| Requests | 100.000/día (una vuelta del agente = 1 request; un mensaje puede dar hasta 8) |
| CPU | 10 ms por request — irrelevante acá, el passthrough es I/O |
| Duración | sin límite de pared mientras el upstream siga respondiendo |
| Tamaño de respuesta | sin tope relevante para chat |

Streaming: **se conserva**. `new Response(res.body, …)` reenvía el `ReadableStream` del upstream
sin bufferearlo, así que el texto sigue apareciendo token a token en el chat. Esta es la razón
principal para elegir Cloudflare por sobre Apps Script, que buffea todo y obliga a `stream: false`.

## 7. Si algo falla

| Síntoma | Causa probable |
|---|---|
| En la app: *"Tu navegador bloqueó la llamada… (CORS)"* | El paso 3a no devuelve `access-control-allow-origin`, o el origin desde el que abrís la app no está en `ALLOWED_ORIGINS` |
| *"Todavía no elegiste un modelo…"* | Falta el id del modelo en Ajustes (p. ej. `meta/llama-3.1-8b-instruct`). Escribilo y guardá |
| 404 `Destino desconocido` | La URL base no incluye `/nvidia` o `/zen` al final |
| 401 desde el upstream | Key incorrecta, o la pegaste con espacios |
| El texto llega todo junto en vez de progresivo | El upstream ignoró `stream: true`, o algo entre medio buffea — revisá que no haya otro proxy/extensión |
