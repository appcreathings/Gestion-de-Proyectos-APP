import { useEffect, useMemo, useState } from "react";
import { BarChart3, Download, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
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
import { getModelDef, splitQualified } from "@/ai/models";
import { aggregateDay, localDateKey } from "@/ai/usage/aggregate";
import { buildExportPayload } from "@/ai/usage/export";
import { useAiUsageStore } from "@/store/useAiUsageStore";

export function AiUsageCard() {
  const events = useAiUsageStore((s) => s.events);
  const session = useAiUsageStore((s) => s.session);
  const includeEstimated = useAiUsageStore((s) => s.includeEstimated);
  const hydrate = useAiUsageStore((s) => s.hydrate);
  const clear = useAiUsageStore((s) => s.clear);
  const exportEvents = useAiUsageStore((s) => s.exportEvents);
  const setIncludeEstimated = useAiUsageStore((s) => s.setIncludeEstimated);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const day = useMemo(
    () => aggregateDay(events, localDateKey(new Date()), includeEstimated),
    [events, includeEstimated],
  );

  const recent = useMemo(() => {
    const visible = includeEstimated
      ? events
      : events.filter((e) => e.usage.source !== "estimated");
    return [...visible]
      .sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0))
      .slice(0, 20);
  }, [events, includeEstimated]);

  function onExport() {
    const payload = buildExportPayload(exportEvents(), new Date().toISOString());
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hito-uso-${localDateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card id="uso" className="scroll-mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="size-5 text-primary" />
          Uso de IA
        </CardTitle>
        <CardDescription>
          El desglose queda en este dispositivo (IndexedDB). No se envía a ningún servidor de Hito.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid max-w-xl gap-5">
        <Label className="flex items-start gap-3">
          <Checkbox
            checked={includeEstimated}
            onCheckedChange={setIncludeEstimated}
            aria-label="Incluir estimados"
          />
          <span className="text-sm font-medium">Incluir estimados</span>
        </Label>

        <div className="grid gap-1">
          <h3 className="text-sm font-medium">Hoy</h3>
          <p className="text-xs text-muted-foreground tabular-nums">
            {day.requests} req · {day.inputTokens} in · {day.outputTokens} out
          </p>
          {Object.keys(day.byModel).length > 0 && (
            <ul className="grid gap-1">
              {Object.entries(day.byModel).map(([id, bucket]) => (
                <li
                  key={id}
                  className="flex justify-between gap-3 text-xs text-muted-foreground"
                >
                  <span>{getModelDef(id)?.label ?? id}</span>
                  <span className="shrink-0 tabular-nums">
                    {bucket.requests} req · {bucket.inputTokens} in · {bucket.outputTokens} out
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-1">
          <h3 className="text-sm font-medium">Sesión</h3>
          <p className="text-xs text-muted-foreground tabular-nums">
            {session.requests} req · {session.inputTokens + session.outputTokens} tok
          </p>
        </div>

        {recent.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Todavía no hay consumo registrado. Se empieza a contar en el próximo mensaje.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-1 pr-2 font-medium">Hora</th>
                  <th className="py-1 pr-2 font-medium">Tipo</th>
                  <th className="py-1 pr-2 font-medium">Modelo</th>
                  <th className="py-1 pr-2 font-medium">Req</th>
                  <th className="py-1 pr-2 font-medium">Tokens</th>
                  <th className="py-1 font-medium">RAG</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="py-1 pr-2 tabular-nums">
                      {new Date(e.ts).toLocaleTimeString("es-ES", { timeStyle: "short" })}
                    </td>
                    <td className="py-1 pr-2">{e.kind}</td>
                    <td className="py-1 pr-2">{splitQualified(e.modelId).modelId}</td>
                    <td className="py-1 pr-2 tabular-nums">{e.requests}</td>
                    <td className="py-1 pr-2 tabular-nums">
                      {e.usage.source === "estimated" ? "~" : ""}
                      {e.usage.totalTokens}
                    </td>
                    <td className="py-1">{e.rag?.injected ? "RAG" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="size-4" />
            Exportar JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => setConfirmClear(true)}>
            <Trash2 className="size-4" />
            Vaciar historial
          </Button>
        </div>

        <ConfirmDialog
          open={confirmClear}
          onOpenChange={setConfirmClear}
          title="Vaciar historial"
          description="Se borrarán los eventos persistidos de este dispositivo. Los totales de esta pestaña no se reinician."
          confirmLabel="Vaciar historial"
          confirmVariant="destructive"
          onConfirm={clear}
        />
      </CardContent>
    </Card>
  );
}
