import { describe, it, expect } from "vitest";
import { newProject } from "@/domain/factories";
import { isStalled } from "@/domain/compute";
import type { Project, Settings } from "@/domain/schemas";
import {
  parseProjectsQuery,
  applyProjectsFilter,
  filterProjectsByQuery,
  type ProjectsQuery,
} from "./filterProjects";

const NOW = new Date(2026, 7, 20, 12, 0, 0); // 20 ago 2026 local

const SETTINGS: Settings = {
  theme: "system",
  stalledAfterDays: 14,
  dueSoonDays: 7,
  deriveHealth: false,
};

function project(name: string, over: Partial<Project> = {}): Project {
  return { ...newProject(name), ...over };
}

function q(over: Partial<ProjectsQuery> = {}): ProjectsQuery {
  return {
    productId: null,
    status: null,
    health: null,
    stalled: false,
    quarterId: null,
    ...over,
  };
}

describe("parseProjectsQuery", () => {
  it("defaults: sin filtros, stalled false", () => {
    expect(parseProjectsQuery(new URLSearchParams())).toEqual(q());
  });

  it("lee params válidos (product, status, health, stalled=1, quarter)", () => {
    const parsed = parseProjectsQuery(
      new URLSearchParams("product=p1&status=active&health=red&stalled=1&quarter=q1"),
    );
    expect(parsed).toEqual(
      q({ productId: "p1", status: "active", health: "red", stalled: true, quarterId: "q1" }),
    );
  });

  it("ignora status/health inválidos; stalled solo vale como 1 (spec §9.6, D5)", () => {
    const parsed = parseProjectsQuery(
      new URLSearchParams("status=nope&health=purple&stalled=yes"),
    );
    expect(parsed.status).toBeNull();
    expect(parsed.health).toBeNull();
    expect(parsed.stalled).toBe(false);
  });
});

describe("applyProjectsFilter (writers de URL)", () => {
  it("setea y borra product/status/health sin tocar el resto", () => {
    const base = new URLSearchParams("product=p1");
    const withStatus = applyProjectsFilter(base, "status", "active");
    expect(withStatus.get("status")).toBe("active");
    expect(withStatus.get("product")).toBe("p1");

    const withoutProduct = applyProjectsFilter(withStatus, "product", null);
    expect(withoutProduct.get("product")).toBeNull();
    expect(withoutProduct.get("status")).toBe("active");

    const withoutHealth = applyProjectsFilter(withStatus, "health", null);
    expect(withoutHealth.get("health")).toBeNull();
  });

  it("stalled solo escribe 1; cualquier otro valor borra el param", () => {
    const on = applyProjectsFilter(new URLSearchParams("status=active"), "stalled", "1");
    expect(on.get("stalled")).toBe("1");
    expect(on.get("status")).toBe("active");

    const off = applyProjectsFilter(on, "stalled", null);
    expect(off.get("stalled")).toBeNull();
  });
});

describe("filterProjectsByQuery", () => {
  it("status=active deja solo los active (spec §9.1)", () => {
    const projects = [
      project("A", { status: "active" }),
      project("B", { status: "backlog" }),
      project("C", { status: "paused" }),
      project("D", { status: "done" }),
    ];
    const result = filterProjectsByQuery(projects, q({ status: "active" }), SETTINGS, NOW, new Set());
    expect(result.map((p) => p.name)).toEqual(["A"]);
  });

  it("stalled=1 coincide con isStalled; un done viejo no entra (spec §9.2)", () => {
    const old = "2026-07-01T12:00:00.000Z"; // 50 días antes de NOW
    const fresh = "2026-08-19T12:00:00.000Z";
    const active = project("Viejo-activo", { status: "active", updatedAt: old });
    const done = project("Viejo-done", { status: "done", updatedAt: old });
    const moving = project("Reciente", { status: "active", updatedAt: fresh });
    const projects = [active, done, moving];

    const result = filterProjectsByQuery(projects, q({ stalled: true }), SETTINGS, NOW, new Set());
    expect(result.map((p) => p.name)).toEqual(["Viejo-activo"]);
    expect(result).toEqual(projects.filter((p) => isStalled(p, SETTINGS.stalledAfterDays, NOW)));
  });

  it("health=red manual usa project.health; un done rojo no entra (D14, spec §9.3)", () => {
    const red = project("Rojo", { status: "active", health: "red" });
    const green = project("Verde", { status: "active", health: "green" });
    const doneRed = project("Done-rojo", { status: "done", health: "red" });
    const settings = { ...SETTINGS, deriveHealth: false };

    const result = filterProjectsByQuery(
      [red, green, doneRed],
      q({ health: "red" }),
      settings,
      NOW,
      new Set(),
    );
    expect(result.map((p) => p.name)).toEqual(["Rojo"]);
  });

  it("health=red derivado usa deriveHealth: estancado o fecha vencida (spec §9.4)", () => {
    const stalled = project("Estancado", {
      status: "active",
      health: "green", // el manual miente; con deriveHealth=true no se usa
      updatedAt: "2026-07-01T12:00:00.000Z",
    });
    const overdue = project("Vencido", {
      status: "active",
      health: "green",
      dueDate: "2026-08-01",
    });
    const healthy = project("Sano", { status: "active", health: "red", updatedAt: "2026-08-19T12:00:00.000Z" });
    const settings = { ...SETTINGS, deriveHealth: true };

    const result = filterProjectsByQuery(
      [stalled, overdue, healthy],
      q({ health: "red" }),
      settings,
      NOW,
      new Set(),
    );
    expect(result.map((p) => p.name).sort()).toEqual(["Estancado", "Vencido"]);
  });

  it("AND: status=active&health=green recorta ambos (spec §9.5)", () => {
    const activeGreen = project("AG", { status: "active", health: "green" });
    const activeRed = project("AR", { status: "active", health: "red" });
    const backlogGreen = project("BG", { status: "backlog", health: "green" });

    const result = filterProjectsByQuery(
      [activeGreen, activeRed, backlogGreen],
      q({ status: "active", health: "green" }),
      SETTINGS,
      NOW,
      new Set(),
    );
    expect(result.map((p) => p.name)).toEqual(["AG"]);
  });

  it("product desconocido no recorta; id conocido sí (spec §9.7)", () => {
    const projects = [
      project("Con-producto", { productId: "p1" }),
      project("Otro", { productId: "p2" }),
      project("Sin-producto", { productId: null }),
    ];
    const known = new Set(["p1", "p2"]);

    const unknown = filterProjectsByQuery(
      projects,
      q({ productId: "inventado" }),
      SETTINGS,
      NOW,
      known,
    );
    expect(unknown.map((p) => p.name)).toEqual(["Con-producto", "Otro", "Sin-producto"]);

    const knownCut = filterProjectsByQuery(projects, q({ productId: "p1" }), SETTINGS, NOW, known);
    expect(knownCut.map((p) => p.name)).toEqual(["Con-producto"]);
  });

  it("quarter no filtra (D15): solo vista + highlight", () => {
    const projects = [project("A", { quarterId: "q1" }), project("B", { quarterId: null })];
    const result = filterProjectsByQuery(
      projects,
      q({ quarterId: "q1" }),
      SETTINGS,
      NOW,
      new Set(),
    );
    expect(result).toHaveLength(2);
  });

  it("sin settings: status/product aplican, health/stalled se ignoran (design §5)", () => {
    const red = project("Rojo", {
      status: "active",
      health: "red",
      updatedAt: "2026-07-01T12:00:00.000Z",
    });
    const done = project("Done", { status: "done" });

    const result = filterProjectsByQuery(
      [red, done],
      q({ health: "red", stalled: true, status: "done" }),
      null,
      NOW,
      new Set(),
    );
    expect(result.map((p) => p.name)).toEqual(["Done"]);
  });
});
