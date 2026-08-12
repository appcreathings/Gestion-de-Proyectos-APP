import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  AlertCircle,
  CheckCircle2,
  Github,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { HitoMark } from "@/components/brand/HitoMark";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/paths";
import {
  getGitHubCallbackUrl,
  getGitHubConnectUrl,
  getGitHubConnection,
  isGitHubBffConfigured,
} from "@/integrations/github-bff";
import { getGitHubConnections, saveGitHubConnection } from "@/integrations/github-sync";

type PageState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved"; login: string }
  | { kind: "error"; message: string }
  | { kind: "setup"; installationId: string }
  | { kind: "forwarding" };

/**
 * Public page at /github/connect.
 * - Default: start GitHub App connect (BFF → install App if needed + OAuth).
 * - Return from BFF: ?status=ok&connectionId=… → persist locally and go to Integrations.
 * - GitHub Setup URL: ?installation_id=…&setup_action=… → finish OAuth if needed.
 * - If GitHub returns ?code=&state= here (OAuth during install), forward to BFF callback.
 */
export function GitHubConnectPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>({ kind: "idle" });
  const [bffReady, setBffReady] = useState(true);
  const [existingCount, setExistingCount] = useState(0);

  const status = params.get("status");
  const connectionId = params.get("connectionId");
  const errorParam = params.get("error");
  const installationId = params.get("installation_id");
  const setupAction = params.get("setup_action");
  const oauthCode = params.get("code");
  const oauthState = params.get("state");

  const returnHint = useMemo(() => {
    // Install + "Request user authorization during installation" may land on
    // the Setup URL with a temporary code — hand it to the BFF, never exchange
    // secrets in the browser.
    if (oauthCode && oauthState) return "oauth-code" as const;
    if (status === "ok" && connectionId) return "return-ok" as const;
    if (status === "error" || errorParam) return "return-error" as const;
    if (installationId) return "setup" as const;
    return "idle" as const;
  }, [oauthCode, oauthState, status, connectionId, errorParam, installationId]);

  useEffect(() => {
    setBffReady(isGitHubBffConfigured());
    void getGitHubConnections()
      .then((list) => setExistingCount(list.length))
      .catch(() => setExistingCount(0));
  }, []);

  useEffect(() => {
    if (returnHint === "oauth-code" && oauthCode && oauthState) {
      setState({ kind: "forwarding" });
      try {
        window.location.replace(
          getGitHubCallbackUrl({
            code: oauthCode,
            state: oauthState,
            installationId,
          }),
        );
      } catch {
        setState({
          kind: "error",
          message: "No se pudo reenviar el código OAuth al backend de GitHub.",
        });
      }
      return;
    }

    if (returnHint === "return-error") {
      setState({
        kind: "error",
        message: humanizeError(errorParam || "La autorización con GitHub no se completó."),
      });
      return;
    }

    if (returnHint === "setup" && installationId) {
      setState({ kind: "setup", installationId });
      return;
    }

    if (returnHint !== "return-ok" || !connectionId) return;

    let cancelled = false;
    setState({ kind: "saving" });

    void (async () => {
      const result = await getGitHubConnection(connectionId);
      if (cancelled) return;
      if (!result.ok) {
        setState({ kind: "error", message: result.message });
        return;
      }

      try {
        const existing = await getGitHubConnections();
        const match = existing.find(
          (c) =>
            c.installationId === result.data.installationId ||
            c.backendConnectionId === result.data.connectionId,
        );
        await saveGitHubConnection({
          id: match?.id ?? crypto.randomUUID(),
          provider: "github",
          githubUserId: result.data.githubUserId,
          githubLogin: result.data.githubLogin,
          installationId: result.data.installationId,
          backendConnectionId: result.data.connectionId,
          enabled: true,
        });
        if (cancelled) return;
        setState({ kind: "saved", login: result.data.githubLogin });
        window.setTimeout(() => {
          navigate(`${ROUTES.integrations}?tab=github`, { replace: true });
        }, 1200);
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message: err instanceof Error ? err.message : "No se pudo guardar la conexión local.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [returnHint, connectionId, errorParam, installationId, navigate, oauthCode, oauthState]);

  async function startConnect(mode: "install" | "oauth" = "install") {
    try {
      // Preflight: surface 503/config errors instead of a blank Vercel crash page.
      const healthUrl = getGitHubConnectUrl().replace(/\/connect\/?$/, "/health");
      try {
        const health = await fetch(healthUrl, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(8_000),
        });
        if (!health.ok) {
          const body = (await health.json().catch(() => null)) as {
            message?: string;
            missing?: string[];
          } | null;
          const missing = body?.missing?.length
            ? ` Faltan: ${body.missing.join(", ")}.`
            : "";
          setState({
            kind: "error",
            message:
              (body?.message ?? "El backend de GitHub no está listo.") + missing,
          });
          return;
        }
      } catch {
        // Health may fail on cold start or older deploys — still attempt connect.
      }
      // After Setup URL install, only OAuth may be left; otherwise install-first.
      const effectiveMode = state.kind === "setup" ? "oauth" : mode;
      window.location.assign(getGitHubConnectUrl({ mode: effectiveMode }));
    } catch {
      setBffReady(false);
      setState({
        kind: "error",
        message: "Falta configurar el backend de GitHub (VITE_GITHUB_BFF_URL o /api).",
      });
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Helmet>
        <title>Conectar GitHub | Hito</title>
        <meta
          name="description"
          content="Autoriza la GitHub App de Hito para sincronizar issues y proyectos con tu workspace local."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <header className="border-b border-border/60">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-6">
          <Link to={ROUTES.landing} className="flex items-center gap-2" aria-label="Hito — inicio">
            <HitoMark variant="inverted" className="size-7" />
            <span className="text-sm font-semibold tracking-tight">Hito</span>
          </Link>
          <Link
            to={ROUTES.integrations}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Integraciones
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-muted">
              <Github className="size-5" />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                GitHub App
              </p>
              <h1 className="text-xl font-semibold tracking-tight">Conectar GitHub</h1>
            </div>
          </div>

          {state.kind === "saving" && (
            <StatusBlock
              icon={<Loader2 className="size-5 animate-spin text-primary" />}
              title="Guardando conexión…"
              body="Estamos registrando la instalación de GitHub en este dispositivo."
            />
          )}

          {state.kind === "forwarding" && (
            <StatusBlock
              icon={<Loader2 className="size-5 animate-spin text-primary" />}
              title="Completando autorización…"
              body="GitHub devolvió el código de instalación. Reenviando al servidor de Hito…"
            />
          )}

          {state.kind === "saved" && (
            <StatusBlock
              icon={<CheckCircle2 className="size-5 text-success" />}
              title={`Conectado como @${state.login}`}
              body="Redirigiendo a Integraciones…"
            />
          )}

          {state.kind === "error" && (
            <StatusBlock
              icon={<AlertCircle className="size-5 text-destructive" />}
              title="No se pudo conectar"
              body={state.message}
              tone="error"
            />
          )}

          {state.kind === "setup" && (
            <StatusBlock
              icon={<ShieldCheck className="size-5 text-primary" />}
              title={
                setupAction === "update"
                  ? "Instalación actualizada"
                  : "App instalada en GitHub"
              }
              body={`Instalación ${state.installationId}. Completa la autorización para que Hito pueda listar repositorios y sincronizar.`}
            />
          )}

          {(state.kind === "idle" || state.kind === "error" || state.kind === "setup") && (
            <div className="mt-6 space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  Si aún no tienes la App, GitHub te pedirá instalarla en un repositorio.
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  Sin cuentas nuevas: GitHub autentica; Hito guarda el vínculo en este dispositivo.
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  La private key de la App nunca viaja al navegador.
                </li>
              </ul>

              {!bffReady && (
                <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm">
                  <p className="font-medium">Backend de GitHub no configurado</p>
                  <p className="mt-1 text-muted-foreground">
                    En Vercel define las variables{" "}
                    <code className="font-mono text-xs">GITHUB_APP_ID</code>,{" "}
                    <code className="font-mono text-xs">GITHUB_CLIENT_ID</code>,{" "}
                    <code className="font-mono text-xs">GITHUB_CLIENT_SECRET</code> y{" "}
                    <code className="font-mono text-xs">GITHUB_PRIVATE_KEY</code>. El frontend
                    usará <code className="font-mono text-xs">/api/github/*</code> por defecto.
                  </p>
                </div>
              )}

              {existingCount > 0 && state.kind === "idle" && (
                <p className="text-xs text-muted-foreground">
                  Ya hay {existingCount} conexión{existingCount === 1 ? "" : "es"} guardada
                  {existingCount === 1 ? "" : "s"} en este dispositivo.
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  className="flex-1"
                  onClick={() => void startConnect(state.kind === "setup" ? "oauth" : "install")}
                  disabled={!bffReady}
                >
                  <Github className="size-4" />
                  {state.kind === "setup" ? "Continuar con GitHub" : "Conectar con GitHub"}
                </Button>
                <Link
                  to={ROUTES.integrations}
                  className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
                >
                  Ir a Integraciones
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Flujo: instalar App (si falta) → autorizar → callback del servidor{" "}
          <code className="font-mono">/api/github/callback</code>
        </p>
      </main>
    </div>
  );
}

function StatusBlock({
  icon,
  title,
  body,
  tone = "default",
}: {
  icon: ReactNode;
  title: string;
  body: string;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        tone === "error"
          ? "border-destructive/30 bg-destructive/5"
          : "border-border bg-muted/30",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div className="min-w-0">
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}

function humanizeError(raw: string): string {
  if (raw.startsWith("no_installation:")) {
    return raw.replace(/^no_installation:\s*/, "");
  }
  try {
    return decodeURIComponent(raw.replace(/\+/g, " "));
  } catch {
    return raw;
  }
}
