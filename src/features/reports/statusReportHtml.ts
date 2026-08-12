import { reportToMarkdown } from "./statusReportMarkdown";
import type { StatusReport } from "./statusReport";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** HTML muy simple a partir del Markdown (sin lib): headings, lists, tables, quotes. */
function markdownToSimpleHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inTable = false;
  let inUl = false;

  const closeUl = () => {
    if (inUl) {
      out.push("</ul>");
      inUl = false;
    }
  };
  const closeTable = () => {
    if (inTable) {
      out.push("</tbody></table>");
      inTable = false;
    }
  };

  for (const raw of lines) {
    const line = raw;
    if (line.startsWith("| ---") || line.match(/^\|[\s-|]+\|$/)) continue;

    if (line.startsWith("| ")) {
      closeUl();
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (!inTable) {
        out.push("<table><thead><tr>");
        for (const c of cells) out.push(`<th>${escapeHtml(c)}</th>`);
        out.push("</tr></thead><tbody>");
        inTable = true;
      } else {
        out.push("<tr>");
        for (const c of cells) out.push(`<td>${escapeHtml(c)}</td>`);
        out.push("</tr>");
      }
      continue;
    }
    closeTable();

    if (line.startsWith("# ")) {
      closeUl();
      out.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeUl();
      out.push(`<h2>${escapeHtml(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      closeUl();
      out.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("> ")) {
      closeUl();
      out.push(`<blockquote>${escapeHtml(line.slice(2))}</blockquote>`);
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inUl) {
        out.push("<ul>");
        inUl = true;
      }
      // strip **bold** simply
      const text = line
        .slice(2)
        .replace(/\*\*(.+?)\*\*/g, "$1");
      out.push(`<li>${escapeHtml(text)}</li>`);
      continue;
    }
    if (line.startsWith("_") && line.endsWith("_")) {
      closeUl();
      out.push(`<p><em>${escapeHtml(line.slice(1, -1))}</em></p>`);
      continue;
    }
    if (line.trim() === "") {
      closeUl();
      continue;
    }
    closeUl();
    out.push(`<p>${escapeHtml(line.replace(/\*\*(.+?)\*\*/g, "$1"))}</p>`);
  }
  closeUl();
  closeTable();
  return out.join("\n");
}

export function reportToPrintableHtml(report: StatusReport): string {
  const md = reportToMarkdown(report);
  const body = markdownToSimpleHtml(md);
  const title =
    report.scope === "project"
      ? `Informe — ${report.title}`
      : report.title;

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 1.5cm; }
    body {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      max-width: 720px;
      margin: 0 auto;
      padding: 1.5rem;
      color: #111;
      line-height: 1.45;
      font-size: 14px;
    }
    h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    h2 { font-size: 1.15rem; margin: 1.5rem 0 0.5rem; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; }
    h3 { font-size: 1rem; margin: 1rem 0 0.35rem; }
    table { width: 100%; border-collapse: collapse; margin: 0.5rem 0 1rem; font-size: 12px; }
    th, td { border: 1px solid #ccc; padding: 0.35rem 0.5rem; text-align: left; }
    th { background: #f5f5f5; }
    blockquote { margin: 0.5rem 0; padding: 0.5rem 0.75rem; background: #f8f8f8; border-left: 3px solid #999; color: #444; }
    ul { margin: 0.35rem 0 0.75rem; padding-left: 1.25rem; }
    footer { margin-top: 2rem; font-size: 11px; color: #888; }
    .no-print { margin: 0 0 1rem; }
    .no-print button {
      font: inherit;
      padding: 0.45rem 0.8rem;
      border: 1px solid #ccc;
      background: #fff;
      cursor: pointer;
      border-radius: 6px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
<p class="no-print"><button type="button" onclick="window.print()">Imprimir / Guardar como PDF</button></p>
${body}
<footer>Generado con Hito — local-first</footer>
<script>window.addEventListener("load", function () { window.focus(); setTimeout(function(){ window.print(); }, 200); });</script>
</body>
</html>`;
}
