import { describe, expect, it } from "vitest";
import { UNASSIGNED_GROUP, groupKey, orderProjects, reorderWithin } from "./sidebarOrder";

interface Ref {
  id: string;
  name: string;
}

const P = (id: string, name: string): Ref => ({ id, name });

describe("orderProjects (spec 075 D17)", () => {
  it("sin lista, el orden de entrada se conserva", () => {
    const projects = [P("a", "Alfa"), P("b", "Beta"), P("c", "Gamma")];
    expect(orderProjects(projects, undefined)).toEqual(projects);
    expect(orderProjects(projects, [])).toEqual(projects);
  });

  it("la lista manda sobre el orden de entrada", () => {
    const projects = [P("a", "Alfa"), P("b", "Beta"), P("c", "Gamma")];
    expect(orderProjects(projects, ["c", "a", "b"]).map((p) => p.id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("un id que no está en los proyectos se salta", () => {
    const projects = [P("a", "Alfa"), P("b", "Beta")];
    expect(orderProjects(projects, ["ghost", "b", "a"]).map((p) => p.id)).toEqual([
      "b",
      "a",
    ]);
  });

  it("un proyecto que no está en la lista va al final, en el orden de entrada", () => {
    const projects = [P("a", "Alfa"), P("b", "Beta"), P("c", "Gamma")];
    expect(orderProjects(projects, ["c"]).map((p) => p.id)).toEqual(["c", "a", "b"]);
  });

  it("ids repetidos en la lista: cuenta una vez", () => {
    const projects = [P("a", "Alfa"), P("b", "Beta"), P("c", "Gamma")];
    expect(orderProjects(projects, ["b", "b", "a"]).map((p) => p.id)).toEqual([
      "b",
      "a",
      "c",
    ]);
  });
});

describe("reorderWithin (spec 075 D16)", () => {
  it("mueve un id a la posición del destino", () => {
    expect(reorderWithin(["a", "b", "c"], "a", "c")).toEqual(["b", "c", "a"]);
    expect(reorderWithin(["a", "b", "c"], "c", "a")).toEqual(["c", "a", "b"]);
  });

  it("devuelve null si el destino es el mismo id", () => {
    expect(reorderWithin(["a", "b"], "a", "a")).toBeNull();
  });

  it("devuelve null si el activo o el destino no están", () => {
    expect(reorderWithin(["a", "b"], "ghost", "a")).toBeNull();
    expect(reorderWithin(["a", "b"], "a", "ghost")).toBeNull();
  });
});

describe("groupKey (spec 075 D16)", () => {
  it("un producto usa su id", () => {
    expect(groupKey("prod-1")).toBe("prod-1");
  });

  it("null es __unassigned", () => {
    expect(groupKey(null)).toBe(UNASSIGNED_GROUP);
    expect(UNASSIGNED_GROUP).toBe("__unassigned");
  });
});
