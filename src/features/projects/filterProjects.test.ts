import { describe, it, expect } from "vitest";
import { newArea, newChecklist, newItem, newProject, newTask } from "@/domain/factories";
import { isStalled } from "@/domain/compute";
import { healthSentence } from "@/features/dashboard/portfolio";
import type { Project, Settings } from "@/domain/schemas";
import {
  applyProjectsFilter,
  clearProjectFilters,
  compareProjects,
  filterProjectsByQuery,
  hasProjectFilters,
  healthSummaryFragments,
  overdueLiveTaskCount,
  parseProjectsQuery,
  projectDueLabel,
  projectsOfProduct,
  summarizeProjects,
  type KnownProjectRefs,
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
    q: "",
    priority: null,
    ownerId: null,
    due: null,
    closed: false,
    sort: "attention",
    view: "plan",
    ...over,
  };
}

const EMPTY_REFS: KnownProjectRefs = {
  productIds: new Set<string>(),
  quarterIds: new Set<string>(),
  ownerIds: new Set<string>(),
};

function known(over: Partial<KnownProjectRefs> = {}): KnownProjectRefs {
  return {
    productIds: over.productIds ?? EMPTY_REFS.productIds,
    quarterIds: over.quarterIds ?? EMPTY_REFS.quarterIds,
    ownerIds: over.ownerIds ?? EMPTY_REFS.ownerIds,
  };
}

/** Área con un checklist de `total` ítems, `done` marcados. */
function areaWithChecklist(done: number, total: number) {
  const cl = newChecklist("CL");
  cl.items = Array.from({ length: total }, (_, i) => ({
    ...newItem(`i${i}`),
    done: i < done,
  }));
  const area = newArea("Área");
  area.checklists = [cl];
  return area;
}

function withProgress(
  p: Project,
  clDone: number,
  clTotal: number,
  taskDone: number,
  taskTotal: number,
): Project {
  const tasks = Array.from({ length: taskTotal }, (_, i) => ({
    ...newTask(`t${i}`),
    status: i < taskDone ? ("done" as const) : ("todo" as const),
  }));
  return { ...p, areas: [areaWithChecklist(clDone, clTotal)], tasks };
}

describe("parseProjectsQuery", () => {
  it("defaults: sin filtros, stalled false (spec 063)", () => {
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

  it("defaults 072: q vacío, sort attention, view plan, closed false, resto null", () => {
    const parsed = parseProjectsQuery(new URLSearchParams());
    expect(parsed.q).toBe("");
    expect(parsed.sort).toBe("attention");
    expect(parsed.view).toBe("plan");
    expect(parsed.closed).toBe(false);
    expect(parsed.priority).toBeNull();
    expect(parsed.ownerId).toBeNull();
    expect(parsed.due).toBeNull();
  });

  it("lee los params nuevos 072", () => {
    const parsed = parseProjectsQuery(
      new URLSearchParams(
        "q=hola&priority=high&owner=o1&due=soon&closed=1&sort=name&view=quarter",
      ),
    );
    expect(parsed.q).toBe("hola");
    expect(parsed.priority).toBe("high");
    expect(parsed.ownerId).toBe("o1");
    expect(parsed.due).toBe("soon");
    expect(parsed.closed).toBe(true);
    expect(parsed.sort).toBe("name");
    expect(parsed.view).toBe("quarter");
  });

  it("valores inválidos 072 no filtran: priority/due null, sort attention, view plan, closed false", () => {
    const parsed = parseProjectsQuery(
      new URLSearchParams("priority=nope&due=week&view=kanban&sort=magic&closed=yes"),
    );
    expect(parsed.priority).toBeNull();
    expect(parsed.due).toBeNull();
    expect(parsed.sort).toBe("attention");
    expect(parsed.view).toBe("plan");
    expect(parsed.closed).toBe(false);
  });

  it("view=plan explícito también es plan; q se recorta con espacios", () => {
    const parsed = parseProjectsQuery(new URLSearchParams("view=plan&q=%20hola%20"));
    expect(parsed.view).toBe("plan");
    expect(parsed.q).toBe("hola");
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

  it("status=done escribe status y closed=1 (D6)", () => {
    const next = applyProjectsFilter(new URLSearchParams(), "status", "done");
    expect(next.get("status")).toBe("done");
    expect(next.get("closed")).toBe("1");
  });

  it("status=archived también escribe closed=1; status activo no toca closed", () => {
    const arch = applyProjectsFilter(new URLSearchParams(), "status", "archived");
    expect(arch.get("closed")).toBe("1");

    const active = applyProjectsFilter(new URLSearchParams("closed=1"), "status", "active");
    expect(active.get("status")).toBe("active");
    expect(active.get("closed")).toBe("1");
  });

  it("status null borra status y no toca closed (D6)", () => {
    const next = applyProjectsFilter(new URLSearchParams("status=done&closed=1"), "status", null);
    expect(next.get("status")).toBeNull();
    expect(next.get("closed")).toBe("1");
  });

  it("apagar closed borra closed y el status si era done/archived (D6)", () => {
    const offDone = applyProjectsFilter(new URLSearchParams("status=done&closed=1"), "closed", null);
    expect(offDone.get("closed")).toBeNull();
    expect(offDone.get("status")).toBeNull();

    const offArchived = applyProjectsFilter(
      new URLSearchParams("status=archived&closed=1"),
      "closed",
      "0",
    );
    expect(offArchived.get("closed")).toBeNull();
    expect(offArchived.get("status")).toBeNull();
  });

  it("apagar closed con status activo borra solo closed", () => {
    const next = applyProjectsFilter(new URLSearchParams("status=active&closed=1"), "closed", null);
    expect(next.get("closed")).toBeNull();
    expect(next.get("status")).toBe("active");
  });

  it("q se escribe recortado; vacío borra el param (D7)", () => {
    const set = applyProjectsFilter(new URLSearchParams(), "q", "  hola  ");
    expect(set.get("q")).toBe("hola");

    const cleared = applyProjectsFilter(set, "q", "   ");
    expect(cleared.get("q")).toBeNull();
  });

  it("sort=attention y view=plan borran el param; los otros valores lo setean (D13, D21)", () => {
    const withSort = applyProjectsFilter(new URLSearchParams(), "sort", "name");
    expect(withSort.get("sort")).toBe("name");
    expect(applyProjectsFilter(withSort, "sort", "attention").get("sort")).toBeNull();

    const withView = applyProjectsFilter(new URLSearchParams(), "view", "list");
    expect(withView.get("view")).toBe("list");
    expect(applyProjectsFilter(withView, "view", "plan").get("view")).toBeNull();
    expect(applyProjectsFilter(withView, "view", null).get("view")).toBeNull();
  });

  it("quarter/owner/priority/due setean con valor y borran con null", () => {
    let next = applyProjectsFilter(new URLSearchParams(), "quarter", "q1");
    expect(next.get("quarter")).toBe("q1");
    next = applyProjectsFilter(next, "owner", "o1");
    next = applyProjectsFilter(next, "priority", "high");
    next = applyProjectsFilter(next, "due", "overdue");
    expect(next.get("owner")).toBe("o1");
    expect(next.get("priority")).toBe("high");
    expect(next.get("due")).toBe("overdue");

    next = applyProjectsFilter(next, "quarter", null);
    next = applyProjectsFilter(next, "owner", null);
    next = applyProjectsFilter(next, "priority", null);
    next = applyProjectsFilter(next, "due", null);
    expect(next.get("quarter")).toBeNull();
    expect(next.get("owner")).toBeNull();
    expect(next.get("priority")).toBeNull();
    expect(next.get("due")).toBeNull();
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
    const result = filterProjectsByQuery(projects, q({ status: "active" }), SETTINGS, NOW, known());
    expect(result.map((p) => p.name)).toEqual(["A"]);
  });

  it("stalled=1 coincide con isStalled; un done viejo no entra (spec §9.2)", () => {
    const old = "2026-07-01T12:00:00.000Z"; // 50 días antes de NOW
    const fresh = "2026-08-19T12:00:00.000Z";
    const active = project("Viejo-activo", { status: "active", updatedAt: old });
    const done = project("Viejo-done", { status: "done", updatedAt: old });
    const moving = project("Reciente", { status: "active", updatedAt: fresh });
    const projects = [active, done, moving];

    const result = filterProjectsByQuery(projects, q({ stalled: true }), SETTINGS, NOW, known());
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
      known(),
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
      known(),
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
      known(),
    );
    expect(result.map((p) => p.name)).toEqual(["AG"]);
  });

  it("product desconocido no recorta; id conocido sí (spec §9.7)", () => {
    const projects = [
      project("Con-producto", { productId: "p1" }),
      project("Otro", { productId: "p2" }),
      project("Sin-producto", { productId: null }),
    ];
    const refs = known({ productIds: new Set(["p1", "p2"]) });

    const unknown = filterProjectsByQuery(
      projects,
      q({ productId: "inventado" }),
      SETTINGS,
      NOW,
      refs,
    );
    expect(unknown.map((p) => p.name)).toEqual(["Con-producto", "Otro", "Sin-producto"]);

    const knownCut = filterProjectsByQuery(projects, q({ productId: "p1" }), SETTINGS, NOW, refs);
    expect(knownCut.map((p) => p.name)).toEqual(["Con-producto"]);
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
      known(),
    );
    expect(result.map((p) => p.name)).toEqual(["Done"]);
  });

  it("sin closed: done y archived quedan afuera (D6)", () => {
    const projects = [
      project("Activo", { status: "active" }),
      project("Terminado", { status: "done" }),
      project("Archivado", { status: "archived" }),
    ];
    const result = filterProjectsByQuery(projects, q(), SETTINGS, NOW, known());
    expect(result.map((p) => p.name)).toEqual(["Activo"]);
  });

  it("closed=1 los muestra todos (D6)", () => {
    const projects = [
      project("Activo", { status: "active" }),
      project("Terminado", { status: "done" }),
      project("Archivado", { status: "archived" }),
    ];
    const result = filterProjectsByQuery(projects, q({ closed: true }), SETTINGS, NOW, known());
    expect(result).toHaveLength(3);
  });

  it("status=done sin closed: solo terminados, aunque la casilla esté apagada (D6)", () => {
    const projects = [
      project("Activo", { status: "active" }),
      project("Terminado", { status: "done" }),
      project("Otro-done", { status: "done" }),
      project("Archivado", { status: "archived" }),
    ];
    const result = filterProjectsByQuery(projects, q({ status: "done" }), SETTINGS, NOW, known());
    expect(result.map((p) => p.name)).toEqual(["Terminado", "Otro-done"]);
  });

  it("closed=1 + health=red: un done en rojo sigue afuera (D14 sobre D6)", () => {
    const red = project("Rojo", { status: "active", health: "red" });
    const doneRed = project("Done-rojo", { status: "done", health: "red" });
    const settings = { ...SETTINGS, deriveHealth: false };

    const result = filterProjectsByQuery(
      [red, doneRed],
      q({ closed: true, health: "red" }),
      settings,
      NOW,
      known(),
    );
    expect(result.map((p) => p.name)).toEqual(["Rojo"]);
  });

  it("quarter conocido filtra; desconocido no (D4)", () => {
    const q1 = project("Del-q1", { quarterId: "q1" });
    const q2 = project("Del-q2", { quarterId: "q2" });
    const sinQ = project("Sin-q", { quarterId: null });
    const refs = known({ quarterIds: new Set(["q1", "q2"]) });

    const cut = filterProjectsByQuery([q1, q2, sinQ], q({ quarterId: "q1" }), SETTINGS, NOW, refs);
    expect(cut.map((p) => p.name)).toEqual(["Del-q1"]);

    const unknown = filterProjectsByQuery(
      [q1, q2, sinQ],
      q({ quarterId: "inventado" }),
      SETTINGS,
      NOW,
      refs,
    );
    expect(unknown).toHaveLength(3);
  });

  it("q=arbol matchea «Árbol» por nombre; no mira tags (D7)", () => {
    const arbol = project("Árbol", { tags: ["roble"] });
    const roble = project("Roble", { tags: ["árbol"] });

    const result = filterProjectsByQuery([arbol, roble], q({ q: "arbol" }), SETTINGS, NOW, known());
    expect(result.map((p) => p.name)).toEqual(["Árbol"]);
  });

  it("owner desconocido no filtra; id conocido deja solo sus proyectos (D9)", () => {
    const ana = project("De-ana", { ownerId: "o1" });
    const beto = project("De-beto", { ownerId: "o2" });
    const nadie = project("Sin-responsable", { ownerId: null });
    const refs = known({ ownerIds: new Set(["o1", "o2"]) });

    const unknown = filterProjectsByQuery(
      [ana, beto, nadie],
      q({ ownerId: "inventado" }),
      SETTINGS,
      NOW,
      refs,
    );
    expect(unknown).toHaveLength(3);

    const cut = filterProjectsByQuery([ana, beto, nadie], q({ ownerId: "o1" }), SETTINGS, NOW, refs);
    expect(cut.map((p) => p.name)).toEqual(["De-ana"]);
  });

  it("due=soon deja solo la fecha a 14 días; none y overdue según daysUntil (D10)", () => {
    const d14 = project("A-14", { dueDate: "2026-09-03" }); // 14 días después de NOW
    const d15 = project("B-15", { dueDate: "2026-09-04" });
    const vencido = project("C-vencido", { dueDate: "2026-08-01" });
    const sinFecha = project("D-sin-fecha", { dueDate: null });
    const projects = [d14, d15, vencido, sinFecha];

    const soon = filterProjectsByQuery(projects, q({ due: "soon" }), SETTINGS, NOW, known());
    expect(soon.map((p) => p.name)).toEqual(["A-14"]);

    const none = filterProjectsByQuery(projects, q({ due: "none" }), SETTINGS, NOW, known());
    expect(none.map((p) => p.name)).toEqual(["D-sin-fecha"]);

    const overdue = filterProjectsByQuery(projects, q({ due: "overdue" }), SETTINGS, NOW, known());
    expect(overdue.map((p) => p.name)).toEqual(["C-vencido"]);
  });

  it("AND 072: priority + owner + product se combinan (HU-01)", () => {
    const a = project("A", { priority: "high", ownerId: "o1", productId: "p1" });
    const b = project("B", { priority: "high", ownerId: "o2", productId: "p1" });
    const c = project("C", { priority: "low", ownerId: "o1", productId: "p1" });
    const refs = known({
      productIds: new Set(["p1"]),
      ownerIds: new Set(["o1", "o2"]),
    });

    const result = filterProjectsByQuery(
      [a, b, c],
      q({ priority: "high", ownerId: "o1", productId: "p1" }),
      SETTINGS,
      NOW,
      refs,
    );
    expect(result.map((p) => p.name)).toEqual(["A"]);
  });

  it("sets vacíos de known (store sin hidratar) hacen que el id se ignore (D3)", () => {
    const p1 = project("Con-producto", { productId: "p1", quarterId: "q1", ownerId: "o1" });
    const result = filterProjectsByQuery(
      [p1],
      q({ productId: "p1", quarterId: "q1", ownerId: "o1" }),
      SETTINGS,
      NOW,
      known(),
    );
    expect(result).toHaveLength(1);
  });
});

describe("compareProjects", () => {
  it("attention: rojo antes que ámbar antes que verde; a igual salud, fecha ascendente; sin fecha al final", () => {
    const rojo = project("R", { health: "red", dueDate: "2026-12-01" });
    const ambar = project("A", { health: "amber", dueDate: "2026-12-01" });
    const verdeCerca = project("V1", { health: "green", dueDate: "2026-09-01" });
    const verdeLejos = project("V2", { health: "green", dueDate: "2026-09-02" });
    const verdeSin = project("V3", { health: "green", dueDate: null });

    const sorted = [verdeSin, verdeLejos, verdeCerca, ambar, rojo].sort((a, b) =>
      compareProjects(a, b, "attention", null, NOW),
    );
    expect(sorted.map((p) => p.name)).toEqual(["R", "A", "V1", "V2", "V3"]);
  });

  it("attention usa effectiveHealth con settings (D12)", () => {
    // deriveHealth=false: usa p.health manual.
    const manual = { ...SETTINGS, deriveHealth: false };
    const rojo = project("R", { health: "red" });
    const verde = project("V", { health: "green" });
    const sorted = [verde, rojo].sort((a, b) => compareProjects(a, b, "attention", manual, NOW));
    expect(sorted.map((p) => p.name)).toEqual(["R", "V"]);
  });

  it("empate total en attention devuelve 0 (sort estable)", () => {
    const a = project("Igual", { health: "green", dueDate: "2026-09-01" });
    const b = project("Igual", { health: "green", dueDate: "2026-09-01" });
    expect(compareProjects(a, b, "attention", null, NOW)).toBe(0);
  });

  it("sort due: fecha ascendente, sin fecha al final (D11)", () => {
    const sinFecha = project("Sin", { dueDate: null });
    const lejos = project("Lejos", { dueDate: "2026-09-02" });
    const cerca = project("Cerca", { dueDate: "2026-08-21" });
    const sorted = [sinFecha, lejos, cerca].sort((a, b) => compareProjects(a, b, "due", null, NOW));
    expect(sorted.map((p) => p.name)).toEqual(["Cerca", "Lejos", "Sin"]);
  });

  it("sort name: localeCompare es, base (D11)", () => {
    const mango = project("Mango");
    const arbol = project("Árbol");
    const azul = project("azul");
    const sorted = [mango, arbol, azul].sort((a, b) => compareProjects(a, b, "name", null, NOW));
    expect(sorted.map((p) => p.name)).toEqual(["Árbol", "azul", "Mango"]);
  });

  it("sort progress: mayor pct de checklists primero; empate por tareas vivas (D11)", () => {
    const full = withProgress(project("Full"), 2, 2, 0, 0); // checklists 100%
    const tasksHechas = withProgress(project("Tareas-hechas"), 1, 2, 1, 1); // 50% + tareas 100%
    const tasksPendientes = withProgress(project("Tareas-pendientes"), 1, 2, 0, 1); // 50% + tareas 0%

    const sorted = [tasksPendientes, full, tasksHechas].sort((a, b) =>
      compareProjects(a, b, "progress", null, NOW),
    );
    expect(sorted.map((p) => p.name)).toEqual(["Full", "Tareas-hechas", "Tareas-pendientes"]);
  });

  it("sort updated: updatedAt descendente, nombre de desempate (D11)", () => {
    const viejo = project("Viejo", { updatedAt: "2026-08-01T12:00:00.000Z" });
    const nuevo = project("Nuevo", { updatedAt: "2026-08-19T12:00:00.000Z" });
    const sorted = [viejo, nuevo].sort((a, b) => compareProjects(a, b, "updated", null, NOW));
    expect(sorted.map((p) => p.name)).toEqual(["Nuevo", "Viejo"]);
  });
});

describe("projectDueLabel", () => {
  it("hoy, mañana, N días, ayer, hace N días y sin fecha (D14)", () => {
    expect(projectDueLabel("2026-08-20", NOW)).toBe("vence hoy");
    expect(projectDueLabel("2026-08-21", NOW)).toBe("vence en 1 día");
    expect(projectDueLabel("2026-08-23", NOW)).toBe("vence en 3 días");
    expect(projectDueLabel("2026-08-19", NOW)).toBe("venció hace 1 día");
    expect(projectDueLabel("2026-08-01", NOW)).toBe("venció hace 19 días");
    expect(projectDueLabel(null, NOW)).toBe("Sin fecha");
  });
});

describe("overdueLiveTaskCount", () => {
  it("cuenta tareas vivas no hechas con fecha vencida; ignora archivadas, hechas y sin fecha (D15)", () => {
    const p = project("P", {
      tasks: [
        { ...newTask("Vencida"), dueDate: "2026-08-01" },
        { ...newTask("En-curso-vencida"), dueDate: "2026-08-10", status: "doing" },
        { ...newTask("Hecha"), dueDate: "2026-08-01", status: "done" },
        { ...newTask("Archivada"), dueDate: "2026-08-01", archived: true },
        { ...newTask("Sin-fecha"), dueDate: null },
        { ...newTask("Futura"), dueDate: "2026-09-01" },
      ],
    });
    expect(overdueLiveTaskCount(p, NOW)).toBe(2);
  });
});

describe("summarizeProjects", () => {
  it("cuenta por salud y proyectos vencidos del conjunto recibido (D19)", () => {
    const red = project("R", { health: "red", dueDate: "2026-08-01" });
    const red2 = project("R2", { health: "red" });
    const amber = project("A", { health: "amber" });
    const green = project("V", { health: "green" });
    const done = project("T", { status: "done", health: "red", dueDate: "2026-08-01" });

    const summary = summarizeProjects([red, red2, amber, green, done], null, NOW);
    expect(summary.count).toBe(5);
    expect(summary.byHealth).toEqual({ red: 3, amber: 1, green: 1 });
    expect(summary.overdueProjects).toBe(2);
  });

  it("usa effectiveHealth cuando hay settings (D12)", () => {
    const p = project("P", { health: "green", updatedAt: "2026-07-01T12:00:00.000Z" });
    const settings = { ...SETTINGS, deriveHealth: true }; // estancado → rojo
    const summary = summarizeProjects([p], settings, NOW);
    expect(summary.byHealth.red).toBe(1);
    expect(summary.byHealth.green).toBe(0);
  });
});

describe("healthSummaryFragments", () => {
  it("unidos con « · » dan healthSentence(byHealth) (D19)", () => {
    const singular = { red: 2, amber: 1, green: 1 };
    expect(healthSummaryFragments(singular).join(" · ")).toBe(healthSentence(singular));

    const plural = { red: 0, amber: 2, green: 3 };
    expect(healthSummaryFragments(plural).join(" · ")).toBe(healthSentence(plural));
  });
});

describe("projectsOfProduct", () => {
  it("incluye done/archived, excluye otro producto y ordena por nombre (D28)", () => {
    const zeta = project("Zeta", { productId: "p1", status: "done" });
    const alfa = project("Alfa", { productId: "p1", status: "archived" });
    const beta = project("Beta", { productId: "p1" });
    const otro = project("Otro", { productId: "p2" });

    const list = projectsOfProduct([zeta, alfa, otro, beta], "p1");
    expect(list.map((p) => p.name)).toEqual(["Alfa", "Beta", "Zeta"]);
    expect(list).toHaveLength(3);
  });
});

describe("clearProjectFilters / hasProjectFilters", () => {
  it("borra los filtros y el orden; deja view (D20)", () => {
    const params = new URLSearchParams(
      "product=p1&status=done&closed=1&health=red&stalled=1&priority=high&owner=o1&q=hola&due=overdue&quarter=q1&sort=name&view=list",
    );
    expect(hasProjectFilters(params)).toBe(true);

    const cleared = clearProjectFilters(params);
    expect(cleared.get("view")).toBe("list");
    for (const key of [
      "product", "status", "health", "stalled", "priority",
      "owner", "q", "due", "closed", "quarter", "sort",
    ]) {
      expect(cleared.get(key)).toBeNull();
    }
  });

  it("hasProjectFilters: false sin params; false con solo view; true con quarter", () => {
    expect(hasProjectFilters(new URLSearchParams())).toBe(false);
    expect(hasProjectFilters(new URLSearchParams("view=list"))).toBe(false);
    expect(hasProjectFilters(new URLSearchParams("quarter=q1"))).toBe(true);
  });
});
