import { describe, it, expect } from "vitest";
import { newProject, newTask, newPerson, newArea } from "@/domain/factories";
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
  });
});
