import { useState, type ReactNode } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProviderId } from "@/ai/providers/types";

const WORKER_CODE = `// Relay CORS para proveedores de IA (NVIDIA NIM, OpenCode Zen).
// La API key la envía el cliente en cada request: este Worker NO guarda secretos.

const UPSTREAM = {
  nvidia: "https://integrate.api.nvidia.com/v1",
  zen: "https://opencode.ai/zen/v1",
};

// Orígenes que pueden usar este relay. Agrega el tuyo si la app corre en otro dominio.
const ALLOWED_ORIGINS = [
  "https://hito.autos",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

export default {
  async fetch(request) {
    const origin = request.headers.get("Origin") ?? "";
    const allowed = ALLOWED_ORIGINS.includes(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin, allowed) });
    }

    if (!allowed) {
      return json({ error: "Origen no permitido" }, 403, cors(origin, false));
    }

    const url = new URL(request.url);
    const [, target, ...rest] = url.pathname.split("/");
    const base = UPSTREAM[target];
    if (!base) {
      return json({ error: \`Destino desconocido: \${target}\` }, 404, cors(origin, true));
    }

    const upstream = \`\${base}/\${rest.join("/")}\${url.search}\`;
    const auth = request.headers.get("Authorization");
    if (!auth) {
      return json({ error: "Falta Authorization" }, 401, cors(origin, true));
    }

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
}`;

/** Path segment on the Worker URL for each browser-blocked provider. */
function proxyPath(providerId: ProviderId): "nvidia" | "zen" {
  return providerId === "opencode-zen" ? "zen" : "nvidia";
}

function exampleBaseUrl(providerId: ProviderId): string {
  return `https://hito-ai-relay-XXXX.workers.dev/${proxyPath(providerId)}`;
}

function exampleModel(providerId: ProviderId): string {
  return providerId === "opencode-zen"
    ? "deepseek-v4-flash-free"
    : "meta/llama-3.1-8b-instruct";
}

interface Props {
  providerId: ProviderId;
  providerLabel: string;
}

/**
 * Step-by-step guide to deploy a CORS relay on Cloudflare Workers.
 * Shown when the user picks NVIDIA or OpenCode Zen (browserBlocked).
 * Content mirrors specs/047-proveedores-ia-multi/PROXY-CLOUDFLARE.md.
 */
export function CloudflareProxyGuide({ providerId, providerLabel }: Props) {
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const path = proxyPath(providerId);
  const baseExample = exampleBaseUrl(providerId);
  const modelExample = exampleModel(providerId);

  async function copyWorkerCode() {
    try {
      await navigator.clipboard.writeText(WORKER_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — user can select text manually
    }
  }

  return (
    <div className="rounded-md border border-primary/30 bg-primary/5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-medium"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="size-4 shrink-0 text-primary" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-primary" />
        )}
        <span>
          Guía: proxy en Cloudflare para {providerLabel}
        </span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-primary/20 px-3 py-3 text-xs leading-relaxed text-muted-foreground">
          <p>
            {providerLabel} no manda cabeceras CORS, y por eso el navegador bloquea las
            respuestas. Necesitas un Worker gratis que las agregue. Tu API key se queda
            solo en este dispositivo: el Worker no la guarda.
          </p>

          <Step n={1} title="Crea el Worker">
            <ol className="ml-4 list-decimal space-y-1">
              <li>
                Entra a{" "}
                <a
                  href="https://dash.cloudflare.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-0.5 text-foreground underline-offset-2 hover:underline"
                >
                  dash.cloudflare.com
                  <ExternalLink className="size-3" />
                </a>{" "}
                (cuenta gratis, sin tarjeta de crédito).
              </li>
              <li>
                En el menú ve a{" "}
                <strong className="text-foreground">Workers &amp; Pages</strong> →{" "}
                <strong className="text-foreground">Create</strong> →{" "}
                <strong className="text-foreground">Start with Hello World!</strong> →{" "}
                <strong className="text-foreground">Deploy</strong>.
              </li>
              <li>
                Ponle un nombre que no sea fácil de adivinar (por ejemplo{" "}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">
                  hito-ai-relay-8f3a
                </code>
                ).
              </li>
              <li>
                Abre <strong className="text-foreground">Edit code</strong> y anota la
                URL{" "}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">
                  https://…workers.dev
                </code>
                .
              </li>
            </ol>
          </Step>

          <Step n={2} title="Pega el código del Worker">
            <p className="mb-2">
              Borra todo lo que hay en el editor, pega el código de abajo y dale en{" "}
              <strong className="text-foreground">Deploy</strong>.
            </p>
            <div className="relative">
              <pre className="max-h-48 overflow-auto rounded-md border bg-muted/60 p-2 font-mono text-[10px] leading-snug text-foreground">
                {WORKER_CODE}
              </pre>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute right-2 top-2 h-7 gap-1 bg-background"
                onClick={() => void copyWorkerCode()}
              >
                {copied ? (
                  <>
                    <Check className="size-3.5" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
            <p className="mt-2">
              Si tienes la app en otro dominio, agrégalo a{" "}
              <code className="rounded bg-muted px-1 font-mono text-[10px]">
                ALLOWED_ORIGINS
              </code>{" "}
              en el Worker y vuelve a desplegar.
            </p>
          </Step>

          <Step n={3} title="Configura Hito">
            <ol className="ml-4 list-decimal space-y-1">
              <li>
                En el campo <strong className="text-foreground">URL base</strong> de
                arriba, pega esto:
                <code className="mt-1 block rounded bg-muted px-1.5 py-1 font-mono text-[10px] text-foreground">
                  {baseExample}
                </code>
                (cambia el subdominio por el tuyo). El path al final tiene que quedar{" "}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">
                  /{path}
                </code>
                , sin barra al final.
              </li>
              <li>
                Pega tu API key y dale en{" "}
                <strong className="text-foreground">Guardar</strong>.
              </li>
              <li>
                En <strong className="text-foreground">Modelo</strong>, escribe el id
                exacto, por ejemplo{" "}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">
                  {modelExample}
                </code>
                .
              </li>
            </ol>
          </Step>

          <Step n={4} title="Si algo no funciona">
            <ul className="ml-4 list-disc space-y-1">
              <li>
                Error de <strong className="text-foreground">CORS</strong>: el origen
                desde el que abres Hito no está en{" "}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">
                  ALLOWED_ORIGINS
                </code>
                .
              </li>
              <li>
                <strong className="text-foreground">404 Destino desconocido</strong>: la
                URL base no termina en{" "}
                <code className="rounded bg-muted px-1 font-mono text-[10px]">
                  /{path}
                </code>
                .
              </li>
              <li>
                <strong className="text-foreground">401</strong>: la key está mal o
                quedó con espacios de más.
              </li>
              <li>
                <strong className="text-foreground">Sin modelo</strong>: falta el id del
                modelo en Ajustes.
              </li>
            </ul>
          </Step>

          <p className="text-[11px]">
            En el plan gratis de Cloudflare tienes 100.000 requests al día. La key viaja
            en{" "}
            <code className="rounded bg-muted px-1 font-mono text-[10px]">
              Authorization
            </code>{" "}
            y no se guarda en el Worker.
          </p>
        </div>
      )}
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="font-medium text-foreground">
        <span className="mr-1.5 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-[10px] text-primary">
          {n}
        </span>
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}
