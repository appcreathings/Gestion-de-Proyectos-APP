import { useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDataStore } from "@/store/useDataStore";
import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";
import { downloadText } from "@/lib/download";
import {
  buildPortfolioReport,
  buildProjectReport,
  type StatusReport,
} from "./statusReport";
import { reportFilename, reportToMarkdown } from "./statusReportMarkdown";
import { reportToPrintableHtml } from "./statusReportHtml";

type Props =
  | { scope: "project"; projectId: string }
  | { scope: "portfolio" };

/**
 * Export de informe de estado a Markdown o vista imprimible/PDF (spec 052).
 * Todo local — no sube datos a ningún servidor.
 */
export function ExportReportMenu(props: Props) {
  const projects = useDataStore((s) => s.projects);
  const products = useDataStore((s) => s.products);
  const people = useDataStore((s) => s.people);
  const workspace = useAppStore((s) => s.workspace);
  const toast = useToastStore((s) => s.toast);
  const [includePeople, setIncludePeople] = useState(true);

  if (!workspace?.settings) return null;

  function buildReport(): StatusReport | null {
    const now = new Date();
    const settings = workspace!.settings;
    const options = {
      includePeople,
      now,
      dueSoonDays: settings.dueSoonDays,
    };

    if (props.scope === "project") {
      const project = projects.find((p) => p.id === props.projectId);
      if (!project) return null;
      const productName = project.productId
        ? products.find((p) => p.id === project.productId)?.name
        : null;
      return buildProjectReport(
        project,
        { people, settings, productName },
        options,
      );
    }

    return buildPortfolioReport(
      projects,
      products,
      people,
      settings,
      options,
      workspace!.org?.name,
    );
  }

  function downloadMarkdown() {
    const report = buildReport();
    if (!report) {
      toast.error("No se pudo generar el informe.");
      return;
    }
    const now = new Date();
    const md = reportToMarkdown(report);
    downloadText(reportFilename(report, now, "md"), md);
    toast.info("Informe descargado.");
  }

  function openPrintablePdf() {
    const report = buildReport();
    if (!report) {
      toast.error("No se pudo generar el informe.");
      return;
    }
    const html = reportToPrintableHtml(report);
    // Blob URL avoids `window.open(..., "noopener")` returning null and
    // document.write being blocked. The HTML itself triggers print on load.
    const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
    const w = window.open(url, "_blank");
    if (!w) {
      URL.revokeObjectURL(url);
      toast.error(
        "No se pudo abrir la vista de impresión. Permití ventanas emergentes o usá Descargar Markdown.",
      );
      return;
    }
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  const scopeLabel =
    props.scope === "project" ? "Este proyecto" : "Portafolio completo";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="size-4" />
          {props.scope === "portfolio" ? (
            <>
              <span className="sm:hidden">Exportar informe</span>
              <span className="hidden sm:inline">Exportar informe de portafolio</span>
            </>
          ) : (
            "Exportar informe"
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <p className="px-2 py-1.5 text-xs text-muted-foreground">
          {scopeLabel} · descargá y enviá al cliente o al CEO — no sube nada a la nube.
        </p>
        <DropdownMenuSeparator />
        <div
          className="flex items-center gap-2 px-2 py-1.5 text-sm"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={includePeople}
            onCheckedChange={setIncludePeople}
            aria-label="Incluir nombres de personas"
          />
          <span>Incluir nombres de personas</span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={downloadMarkdown}>
          <FileText className="size-4" />
          Descargar Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={openPrintablePdf}>
          <Printer className="size-4" />
          PDF / Imprimir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
