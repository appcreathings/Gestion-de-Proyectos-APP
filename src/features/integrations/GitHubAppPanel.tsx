import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle2, Github, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/Panel";
import { isGitHubBffConfigured } from "@/integrations/github-bff";
import { getGitHubConnections, type GitHubConnection } from "@/integrations/github-sync";
import { ROUTES } from "@/routes/paths";

export function GitHubAppPanel() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<GitHubConnection[]>([]);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    getGitHubConnections().then(setConnections).catch(() => setConnections([]));
    setConfigured(isGitHubBffConfigured());
  }, []);

  return (
    <Panel
      label="GitHub App"
      title="Conecta GitHub con Hito"
      description="Autoriza repositorios concretos y publica cambios locales desde Hito. No se crea una cuenta de usuario adicional."
      actions={
        <Button
          size="sm"
          disabled={!configured}
          onClick={() => navigate(ROUTES.githubConnect)}
        >
          <Github className="size-4" />
          Conectar GitHub
        </Button>
      }
    >
      {!configured && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-warning" />
          <div>
            <p className="font-medium">Falta configurar el backend de GitHub</p>
            <p className="mt-1 text-muted-foreground">
              El cliente usa <code className="font-mono">/api</code> por defecto. Opcionalmente
              define <code className="font-mono">VITE_GITHUB_BFF_URL</code> y los secretos del
              servidor en Vercel.
            </p>
          </div>
        </div>
      )}

      {connections.length === 0 ? (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-6 text-center">
          <Github className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">GitHub aún no está conectado</p>
          <p className="mt-1 text-xs text-muted-foreground">
            La conexión usará una GitHub App y conservará la configuración en este dispositivo.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {connections.map((connection) => (
            <div key={connection.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <CheckCircle2 className="size-4 text-success" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">@{connection.githubLogin}</p>
                <p className="truncate text-xs text-muted-foreground">Instalación {connection.installationId}</p>
              </div>
              <Badge variant={connection.enabled ? "success" : "outline"}>
                {connection.enabled ? "Activa" : "Pausada"}
              </Badge>
            </div>
          ))}
        </div>
      )}

      <a
        className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        href="/docs"
      >
        Ver guía de configuración <ExternalLink className="size-3" />
      </a>
    </Panel>
  );
}
