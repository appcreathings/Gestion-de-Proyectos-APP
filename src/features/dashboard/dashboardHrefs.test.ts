import { describe, it, expect } from "vitest";
import { dashboardHrefs } from "./dashboardHrefs";

describe("dashboardHrefs (mapa de clicks, spec 063 §5)", () => {
  it("tile Proyectos activos → ?status=active", () => {
    expect(dashboardHrefs.activeProjects()).toBe("/app/projects?status=active");
  });

  it("tile Estancados → ?stalled=1", () => {
    expect(dashboardHrefs.stalledProjects()).toBe("/app/projects?stalled=1");
  });

  it("tile Vencidos → ancla #vencimientos en el dashboard", () => {
    expect(dashboardHrefs.overdueAnchor()).toBe("/app#vencimientos");
  });

  it("tile Por vencer → misma ancla #vencimientos que Vencidos (spec 066 D20)", () => {
    expect(dashboardHrefs.dueSoonAnchor()).toBe("/app#vencimientos");
    expect(dashboardHrefs.dueSoonAnchor()).toBe(dashboardHrefs.overdueAnchor());
  });

  it("filas de salud y estado → projects con el param correspondiente", () => {
    expect(dashboardHrefs.byHealth("red")).toBe("/app/projects?health=red");
    expect(dashboardHrefs.byStatus("blocked")).toBe("/app/projects?status=blocked");
  });

  it("fila de producto → reusa ROUTES.projectsByProduct", () => {
    expect(dashboardHrefs.byProduct("p1")).toBe("/app/projects?product=p1");
  });

  it("carga de trabajo → my-tasks con person, sin done=1", () => {
    const href = dashboardHrefs.personTasks("abc");
    expect(href).toBe("/app/my-tasks?person=abc");
    expect(href).not.toContain("done=");
  });

  it("personTasks encodea el id por seguridad", () => {
    expect(dashboardHrefs.personTasks("a b&c")).toBe("/app/my-tasks?person=a%20b%26c");
  });
});
