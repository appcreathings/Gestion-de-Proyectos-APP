import { describe, it, expect } from "vitest";
import { newProject, newTask, newPerson, newArea, newChecklist, newItem } from "@/domain/factories";
import { buildProjectReport, buildPortfolioReport } from "./statusReport";
import { reportToMarkdown, reportFilename, slugify } from "./statusReportMarkdown";
import { reportToPrintableHtml } from "./statusReportHtml";
import type { Settings } from "@/domain/schemas";

const settings: Settings = {
  theme: "system",
  stalledAfterDays: 14,
  dueSoonDays: 7,
  deriveHealth: false,
};

describe("status reports (spec 052)", () => {
  it("buildProjectReport includes areas and overdue task", () => {
    const project = newProject("Acme Rollout");
    project.id = "p1";
    project.status = "active";
    project.health = "amber";
    project.priority = "high";
    const area = newArea("Ingeniería");
    project.areas = [area];
    const task = newTask("Fix pago");
    task.id = "t1";
    task.areaId = area.id;
    task.dueDate = "2020-01-01"; // overdue
    task.status = "todo";
    project.tasks = [task];

    const report = buildProjectReport(
      project,
      { people: [], settings, productName: "SaaS" },
      { includePeople: true, now: new Date(), dueSoonDays: 7 },
    );

    expect(report.scope).toBe("project");
    expect(report.title).toBe("Acme Rollout");
    expect(report.areas).toHaveLength(1);
    expect(report.areas[0].name).toBe("Ingeniería");
    expect(report.overdue.some((d) => d.label === "Fix pago")).toBe(true);
    expect(report.productName).toBe("SaaS");
  });

  it("omits people names when includePeople is false", () => {
    const person = newPerson("Diego");
    person.id = "person-1";
    const project = newProject("X");
    project.ownerId = person.id;
    const report = buildProjectReport(
      project,
      { people: [person], settings },
      { includePeople: false, now: new Date(), dueSoonDays: 7 },
    );
    expect(report.ownerName).toBeNull();
  });

  it("markdown has sections and no raw project UUID", () => {
    const project = newProject("Demo");
    project.id = "uuid-should-not-appear-in-md-abcdef";
    const report = buildProjectReport(
      project,
      { people: [], settings },
      { includePeople: true, now: new Date(), dueSoonDays: 7 },
    );
    const md = reportToMarkdown(report);
    expect(md).toContain("## Avance por área");
    expect(md).toContain("## Vencidos");
    expect(md).not.toContain(project.id);
  });

  it("portfolio totals match open projects count", () => {
    const a = newProject("A");
    a.status = "active";
    const b = newProject("B");
    b.status = "done";
    const report = buildPortfolioReport(
      [a, b],
      [],
      [],
      settings,
      { includePeople: true, now: new Date(), dueSoonDays: 7 },
    );
    expect(report.totals.projects).toBe(2);
    expect(report.totals.open).toBe(1);
    expect(report.openProjects).toHaveLength(1);
  });

  it("portfolio sin ítems: sin «Avance medio» ni 0/0; dto ponderado (spec 066 D22)", () => {
    const a = newProject("A");
    a.status = "active";
    const report = buildPortfolioReport(
      [a],
      [],
      [],
      settings,
      { includePeople: false, now: new Date(), dueSoonDays: 7 },
    );
    const md = reportToMarkdown(report);
    expect(md).not.toContain("Avance medio");
    expect(md).not.toContain("0/0");
    expect(report.totals.avgProgress).toBe(0);
    expect(report.totals.checklist).toEqual({ done: 0, total: 0, pct: 0 });
    expect(report.totals.tasks).toEqual({ done: 0, total: 0, pct: 0 });
  });

  it("portfolio con checklists: markdown dual ponderado (spec 066 D22)", () => {
    const a = newProject("A");
    a.status = "active";
    const area = newArea("Área");
    const doneItem = newItem("Hecho");
    doneItem.done = true;
    const pendingItem = newItem("Pendiente");
    const checklist = newChecklist("Checklist");
    checklist.items = [doneItem, pendingItem];
    area.checklists = [checklist];
    a.areas = [area];
    const report = buildPortfolioReport(
      [a],
      [],
      [],
      settings,
      { includePeople: false, now: new Date(), dueSoonDays: 7 },
    );
    const md = reportToMarkdown(report);
    expect(md).toContain("**Avance de checklists:** 1/2 · 50%");
    expect(report.totals.avgProgress).toBe(50);
  });

  it("slugify and filename", () => {
    expect(slugify("Acme Rollout 2026")).toBe("acme-rollout-2026");
    const project = newProject("Acme");
    const report = buildProjectReport(
      project,
      { people: [], settings },
      { includePeople: true, now: new Date("2026-08-12T12:00:00Z"), dueSoonDays: 7 },
    );
    expect(reportFilename(report, new Date("2026-08-12T12:00:00Z"), "md")).toMatch(
      /^hito-informe-acme-2026-08-12\.md$/,
    );
  });

  it("printable html escapes script tags in title", () => {
    const project = newProject('<script>alert(1)</script>');
    const report = buildProjectReport(
      project,
      { people: [], settings },
      { includePeople: true, now: new Date(), dueSoonDays: 7 },
    );
    const html = reportToPrintableHtml(report);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>alert");
    expect(html).toContain("@media print");
    expect(html).toContain("Imprimir / Guardar como PDF");
  });

  it("uses injected now for overdue vs due-soon and lists people when enabled", () => {
    const person = newPerson("Diego");
    person.id = "person-1";
    const project = newProject("Acme");
    project.ownerId = person.id;
    const overdue = newTask("Pago vencido");
    overdue.id = "t-over";
    overdue.dueDate = "2026-08-10";
    overdue.status = "todo";
    overdue.assigneeId = person.id;
    const soon = newTask("Cierre");
    soon.id = "t-soon";
    soon.dueDate = "2026-08-14";
    soon.status = "doing";
    soon.assigneeId = person.id;
    project.tasks = [overdue, soon];

    const now = new Date(2026, 7, 12, 15, 0, 0);
    const withPeople = buildProjectReport(
      project,
      { people: [person], settings },
      { includePeople: true, now, dueSoonDays: 7 },
    );
    expect(withPeople.overdue.map((d) => d.label)).toEqual(["Pago vencido"]);
    expect(withPeople.overdue[0].daysUntil).toBe(-2);
    expect(withPeople.dueSoon.map((d) => d.label)).toEqual(["Cierre"]);
    expect(withPeople.dueSoon[0].daysUntil).toBe(2);
    expect(withPeople.ownerName).toBe("Diego");

    const md = reportToMarkdown(withPeople);
    expect(md).toContain("Diego");
    expect(md).toContain("## Por vencer (≤ 7 días)");

    const hidden = buildProjectReport(
      project,
      { people: [person], settings },
      { includePeople: false, now, dueSoonDays: 7 },
    );
    expect(hidden.ownerName).toBeNull();
    expect(reportToMarkdown(hidden)).not.toContain("Diego");
  });

  it("caps long lists with an omitted note", () => {
    const project = newProject("Cap");
    project.tasks = Array.from({ length: 4 }, (_, i) => {
      const t = newTask(`Tarea ${i + 1}`);
      t.id = `t-${i}`;
      t.dueDate = "2020-01-01";
      t.status = "todo";
      return t;
    });
    const report = buildProjectReport(
      project,
      { people: [], settings },
      { includePeople: true, now: new Date("2026-08-12T12:00:00"), dueSoonDays: 7, listCap: 2 },
    );
    expect(report.overdue).toHaveLength(2);
    expect(report.overdueOmitted).toBe(2);
    expect(reportToMarkdown(report)).toContain("…y 2 más");
  });
});
