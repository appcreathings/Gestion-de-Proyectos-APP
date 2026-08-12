import type { PortfolioStatusReport, ProjectStatusReport, StatusReport } from "./statusReport";
import { taskStatusLabel } from "./statusReport";

function escCell(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function table(headers: string[], rows: string[][]): string {
  if (rows.length === 0) return "_Sin filas._\n";
  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((r) => `| ${r.map(escCell).join(" | ")} |`).join("\n");
  return `${head}\n${sep}\n${body}\n`;
}

function omittedNote(n: number): string {
  return n > 0 ? `\n_…y ${n} más._\n` : "";
}

function projectMarkdown(r: ProjectStatusReport): string {
  const lines: string[] = [];
  lines.push(`# Informe de estado — ${r.title}`);
  lines.push(`Generado: ${r.generatedAt} · Hito`);
  lines.push("");
  lines.push("> Snapshot exportado desde Hito. No se actualiza solo.");
  lines.push("");
  lines.push("## Resumen");
  lines.push(`- **Estado:** ${r.statusLabel}`);
  lines.push(`- **Salud:** ${r.healthLabel}`);
  lines.push(`- **Prioridad:** ${r.priorityLabel}`);
  if (r.productName) lines.push(`- **Producto:** ${r.productName}`);
  if (r.ownerName) lines.push(`- **Responsable:** ${r.ownerName}`);
  if (r.startDate) lines.push(`- **Inicio:** ${r.startDate}`);
  if (r.dueDate) lines.push(`- **Vence:** ${r.dueDate}`);
  lines.push(
    `- **Avance checklists:** ${r.checklist.pct}% (${r.checklist.done}/${r.checklist.total})`,
  );
  lines.push(
    `- **Tareas hechas:** ${r.tasks.pct}% (${r.tasks.done}/${r.tasks.total})` +
      (r.tasks.archivedCount > 0 ? ` · ${r.tasks.archivedCount} archivada(s)` : ""),
  );
  lines.push("");

  lines.push("## Avance por área");
  if (r.areas.length === 0) {
    lines.push("_Sin áreas._");
  } else {
    lines.push(
      table(
        ["Área", "Avance", "Estado", "Tareas abiertas", "Hechas"],
        r.areas.map((a) => [
          a.name,
          `${a.progressPct}%`,
          a.completed ? "Completada" : "En curso",
          String(a.taskOpen),
          String(a.taskDone),
        ]),
      ),
    );
  }
  lines.push("");

  lines.push("## Vencidos");
  if (r.overdue.length === 0) {
    lines.push("_Sin tareas vencidas._");
  } else {
    lines.push(
      table(
        ["Ítem", "Vence", "Días", "Área"],
        r.overdue.map((d) => [
          d.label,
          d.dueDate,
          String(d.daysUntil),
          d.areaName ?? "—",
        ]),
      ) + omittedNote(r.overdueOmitted),
    );
  }
  lines.push("");

  lines.push("## Por vencer");
  if (r.dueSoon.length === 0) {
    lines.push("_Nada por vencer en el umbral configurado._");
  } else {
    lines.push(
      table(
        ["Ítem", "Vence", "Días", "Área"],
        r.dueSoon.map((d) => [
          d.label,
          d.dueDate,
          String(d.daysUntil),
          d.areaName ?? "—",
        ]),
      ) + omittedNote(r.dueSoonOmitted),
    );
  }
  lines.push("");

  lines.push("## Tareas en curso y bloqueadas");
  if (r.focusTasks.length === 0) {
    lines.push("_Sin tareas en foco._");
  } else {
    lines.push(
      table(
        ["Tarea", "Estado", "Prioridad", "Vence", "Área"],
        r.focusTasks.map((t) => [
          t.title,
          taskStatusLabel[t.status],
          t.priorityLabel,
          t.dueDate ?? "—",
          t.areaName ?? "—",
        ]),
      ) + omittedNote(r.focusTasksOmitted),
    );
  }
  lines.push("");

  if (r.descriptionPlain) {
    lines.push("## Notas");
    lines.push(r.descriptionPlain);
    lines.push("");
  }

  return lines.join("\n");
}

function portfolioMarkdown(r: PortfolioStatusReport): string {
  const lines: string[] = [];
  lines.push(`# ${r.title}`);
  lines.push(`Generado: ${r.generatedAt} · Hito`);
  lines.push("");
  lines.push("> Snapshot exportado desde Hito. No se actualiza solo.");
  lines.push("");
  lines.push("## Cifras");
  lines.push(`- **Proyectos (total):** ${r.totals.projects}`);
  lines.push(`- **Abiertos:** ${r.totals.open}`);
  lines.push(`- **Avance medio:** ${r.totals.avgProgress}%`);
  lines.push("");

  lines.push("## Salud y estado");
  lines.push("### Por salud");
  lines.push(
    r.byHealth.length
      ? r.byHealth.map((h) => `- **${h.label}:** ${h.count}`).join("\n")
      : "_Sin datos._",
  );
  lines.push("");
  lines.push("### Por estado");
  lines.push(
    r.byStatus.length
      ? r.byStatus.map((h) => `- **${h.label}:** ${h.count}`).join("\n")
      : "_Sin datos._",
  );
  lines.push("");

  lines.push("## Por producto");
  if (r.byProduct.length === 0) {
    lines.push("_Sin productos._");
  } else {
    lines.push(
      table(
        ["Producto", "Proyectos", "Avance medio", "Salud"],
        r.byProduct.map((p) => [
          p.name,
          String(p.total),
          `${p.avgProgress}%`,
          p.healthSummary,
        ]),
      ),
    );
  }
  lines.push("");

  lines.push("## Vencidos");
  if (r.overdue.length === 0) {
    lines.push("_Sin vencidos._");
  } else {
    lines.push(
      table(
        ["Proyecto", "Ítem", "Vence", "Días"],
        r.overdue.map((d) => [
          d.projectName ?? "—",
          d.label,
          d.dueDate,
          String(d.daysUntil),
        ]),
      ) + omittedNote(r.overdueOmitted),
    );
  }
  lines.push("");

  lines.push("## Por vencer");
  if (r.dueSoon.length === 0) {
    lines.push("_Nada por vencer._");
  } else {
    lines.push(
      table(
        ["Proyecto", "Ítem", "Vence", "Días"],
        r.dueSoon.map((d) => [
          d.projectName ?? "—",
          d.label,
          d.dueDate,
          String(d.daysUntil),
        ]),
      ) + omittedNote(r.dueSoonOmitted),
    );
  }
  lines.push("");

  lines.push("## Estancados");
  if (r.stalled.length === 0) {
    lines.push("_Ninguno._");
  } else {
    lines.push(
      table(
        ["Proyecto", "Estado", "Salud", "Actualizado"],
        r.stalled.map((s) => [s.name, s.statusLabel, s.healthLabel, s.updatedAt.slice(0, 10)]),
      ),
    );
  }
  lines.push("");

  lines.push("## Proyectos abiertos");
  if (r.openProjects.length === 0) {
    lines.push("_Sin proyectos abiertos._");
  } else {
    lines.push(
      table(
        ["Proyecto", "Estado", "Salud", "Checklists", "Tareas", "Vence"],
        r.openProjects.map((p) => [
          p.name,
          p.statusLabel,
          p.healthLabel,
          `${p.checklistPct}%`,
          `${p.taskPct}%`,
          p.dueDate ?? "—",
        ]),
      ),
    );
  }
  lines.push("");

  return lines.join("\n");
}

export function reportToMarkdown(report: StatusReport): string {
  return report.scope === "project"
    ? projectMarkdown(report)
    : portfolioMarkdown(report);
}

export function slugify(title: string): string {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "informe";
}

export function reportFilename(report: StatusReport, now: Date, ext: "md" | "html"): string {
  const day = now.toISOString().slice(0, 10);
  if (report.scope === "portfolio") return `hito-informe-portafolio-${day}.${ext}`;
  return `hito-informe-${slugify(report.title)}-${day}.${ext}`;
}
