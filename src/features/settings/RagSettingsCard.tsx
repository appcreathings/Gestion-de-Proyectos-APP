import { useCallback, useEffect } from "react";
import { Database, FileSearch, Square, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAiConfigStore } from "@/store/useAiConfigStore";
import type { RagStatus } from "@/ai/rag/types";
import { useRagStore } from "@/store/useRagStore";

const STATUS_LABELS: Record<RagStatus, string> = {
  idle: "Sin datos",
  indexing: "Indexando…",
  "up-to-date": "Actualizado",
  partial: "Parcial",
  error: "Error",
};

const STATUS_VARIANTS: Record<
  RagStatus,
  "outline" | "secondary" | "success" | "warning" | "destructive"
> = {
  idle: "outline",
  indexing: "secondary",
  "up-to-date": "success",
  partial: "warning",
  error: "destructive",
};

export function RagSettingsCard() {
  const ragEnabled = useAiConfigStore((s) => s.config.ragEnabled);
  const setRagEnabled = useAiConfigStore((s) => s.setRagEnabled);
  const keyStatus = useAiConfigStore((s) => s.keyStatus);

  const status = useRagStore((s) => s.status);
  const progress = useRagStore((s) => s.progress);
  const meta = useRagStore((s) => s.meta);
  const error = useRagStore((s) => s.error);
  const hydrated = useRagStore((s) => s.loaded);
  const hydrate = useRagStore((s) => s.hydrate);
  const startIndexing = useRagStore((s) => s.startIndexing);
  const clearEmbeddings = useRagStore((s) => s.clearEmbeddings);
  const cancelIndexing = useRagStore((s) => s.cancelIndexing);
  const checkStale = useRagStore((s) => s.checkStale);

  useEffect(() => {
    if (!hydrated) void hydrate();
  }, [hydrated, hydrate]);

  const check = useCallback(() => {
    if (hydrated && meta.entityCount > 0) void checkStale();
  }, [hydrated, meta.entityCount, checkStale]);

  useEffect(() => {
    check();
  }, [check]);

  const hasKey = keyStatus === "valid";
  const isIndexing = status === "indexing";
  const pct = progress ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <Card className="scroll-mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="size-5 text-primary" />
          Busqueda semantica (RAG)
        </CardTitle>
        <CardDescription>
          Indexa el contenido de tus proyectos, tareas y checklists para que el
          asistente pueda buscar por significado, no solo por palabras clave. Los
          embeddings se guardan localmente (IndexedDB).
        </CardDescription>
      </CardHeader>
      <CardContent className="grid max-w-xl gap-5">
        {/* Toggle */}
        <Label className="flex items-start gap-3">
          <Checkbox
            checked={ragEnabled}
            onCheckedChange={(v) => setRagEnabled(v)}
            aria-label="Activar busqueda semantica"
          />
          <span className="grid gap-0.5">
            <span className="text-sm font-medium">
              Inyectar contexto semantico en cada mensaje
            </span>
            <span className="text-xs text-muted-foreground">
              Al enviar un mensaje al asistente, busca automaticamente entidades
              relevantes y las incluye en el prompt.
            </span>
          </span>
        </Label>

        {!hasKey && (
          <p className="text-xs text-warning">
            Configura una API key en Ajustes &gt; Asistente IA para poder indexar.
          </p>
        )}

        {/* Status + meta */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Estado:</span>
            <Badge variant={STATUS_VARIANTS[status]}>
              {STATUS_LABELS[status]}
            </Badge>
          </div>
          {meta.lastIndexedAt && (
            <span className="text-xs text-muted-foreground">
              {meta.entityCount} entidades indexadas
              {" · "}
              {new Date(meta.lastIndexedAt).toLocaleString("es-ES", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </span>
          )}
        </div>

        {/* Partial hint */}
        {status === "partial" && (
          <p className="text-xs text-warning">
            Hay cambios sin indexar. Vuelve a indexar para mantener el contexto actualizado.
          </p>
        )}

        {/* Progress */}
        {isIndexing && progress && (
          <div className="grid gap-1">
            <Progress value={pct} />
            <span className="text-xs text-muted-foreground">
              {progress.current} / {progress.total} ({progress.phase})
            </span>
          </div>
        )}

        {/* Error */}
        {status === "error" && error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={isIndexing ? cancelIndexing : startIndexing}
            disabled={!hasKey && !isIndexing}
          >
            {isIndexing ? (
              <>
                <Square className="size-4" />
                Cancelar
              </>
            ) : (
              <>
                <Database className="size-4" />
                Indexar
              </>
            )}
          </Button>
          {meta.entityCount > 0 && !isIndexing && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearEmbeddings}
            >
              <Trash2 className="size-4" />
              Borrar indices
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
