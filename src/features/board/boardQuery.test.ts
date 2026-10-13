import { describe, expect, it } from "vitest";
import { newProject, newProduct, newTask } from "@/domain/factories";
import type { Project, Task } from "@/domain/schemas";
import {
  boardColumns,
  boardProjectRank,
  canonicalBoardSearch,
  collectBoardCards,
  filtersEqual,
  matchingViewId,
  parseBoardQuery,
  sortCards,
  viewNameError,
  type KnownBoardRefs,
} from "./boardQuery";

const NOW = new Date(2026, 9, 12, 12, 0, 0); // 12 oct 2026, hora local

function dayOffset(days: number): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() + days);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function project(name: string, over: Partial<Project> = {}): Project {
  return { ...newProject(name), ...over };
}

function task(title: string, over: Partial<Task> = {}): Task {
  return { ...newTask(title), ...over };
}

function knownOf(over: Partial<KnownBoardRefs> = {}): KnownBoardRefs {
  return { productIds: new Set(), projectIds: new Set(), personIds: new Set(), ...over };
}

describe("collectBoardCards (spec 075 D8)", () => {
  it("un proyecto archived y uno done no aportan tareas; uno paused sí", () => {
    const archived = project("Cerrado", { status: "archived" });
    archived.tasks = [task("Viva en archivado")];
    const done = project("Terminado", { status: "done" });
    done.tasks = [task("Viva en done")];
    const paused = project("Pausado", { status: "paused" });
    paused.tasks = [task("Viva en pausa")];

    const cards = collectBoardCards([archived, done, paused], emptyQuery(), NOW);
    expect(cards.map((c) => c.task.title)).toEqual(["Viva en pausa"]);
  });

  it("una tarea archivada no entra", () => {
    const p = project("Demo");
    p.tasks = [task("Viva"), task("Archivada", { archived: true })];
    const cards = collectBoardCards([p], emptyQuery(), NOW);
    expect(cards.map((c) => c.task.title)).toEqual(["Viva"]);
  });

  it("una tarea con status propio cae en Otras y stageName es el nombre de la etapa", () => {
    const p = project("Demo", {
      stages: [
        { id: "todo", name: "Por hacer", color: "slate" },
        { id: "doing", name: "En curso", color: "blue" },
        { id: "blocked", name: "Bloqueada", color: "amber" },
        { id: "st-rev", name: "Revisión", color: "violet" },
        { id: "done", name: "Hecha", color: "green" },
      ],
    });
    p.tasks = [task("En revisión", { status: "st-rev" })];

    const cards = collectBoardCards([p], emptyQuery(), NOW);
    const cols = boardColumns(cards, true, boardProjectRank([], [p], {}));
    const otras = cols.find((c) => c.id === "otras");
    expect(otras?.cards.map((c) => c.stageName)).toEqual(["Revisión"]);
    expect(cols.map((c) => c.id)).toEqual(["todo", "doing", "blocked", "otras", "done"]);
  });

  it("sin tareas en Otras la columna no está; Hecha siempre está", () => {
    const p = project("Demo");
    p.tasks = [task("Abierta")];
    const cards = collectBoardCards([p], emptyQuery(), NOW);
    const cols = boardColumns(cards, true, boardProjectRank([], [p], {}));
    expect(cols.map((c) => c.id)).toEqual(["todo", "doing", "blocked", "done"]);
  });

  it("con showDone false, Hecha tiene cards vacío y hiddenCount con las hechas filtradas", () => {
    const p = project("Demo");
    p.tasks = [task("Abierta"), task("Lista", { status: "done" }), task("Lista 2", { status: "done" })];
    const cards = collectBoardCards([p], emptyQuery(), NOW);
    const cols = boardColumns(cards, false, boardProjectRank([], [p], {}));
    const doneCol = cols.find((c) => c.id === "done");
    expect(doneCol?.cards).toEqual([]);
    expect(doneCol?.hiddenCount).toBe(2);

    const revealed = boardColumns(cards, true, boardProjectRank([], [p], {}));
    const doneOpen = revealed.find((c) => c.id === "done");
    expect(doneOpen?.cards.map((c) => c.task.title)).toEqual(["Lista", "Lista 2"]);
    expect(doneOpen?.hiddenCount).toBe(0);
  });

  it("product y project son AND", () => {
    const prodA = newProduct("Producto A");
    const prodB = newProduct("Producto B");
    const pA = project("A", { productId: prodA.id });
    pA.tasks = [task("De A")];
    const pB = project("B", { productId: prodB.id });
    pB.tasks = [task("De B")];

    const both = { ...emptyQuery(), productIds: [prodA.id], projectIds: [pB.id] };
    expect(collectBoardCards([pA, pB], both, NOW)).toEqual([]);

    const productOnly = { ...emptyQuery(), productIds: [prodA.id] };
    expect(collectBoardCards([pA, pB], productOnly, NOW).map((c) => c.task.title)).toEqual(["De A"]);

    const andMatch = { ...emptyQuery(), productIds: [prodA.id], projectIds: [pA.id] };
    expect(collectBoardCards([pA, pB], andMatch, NOW)).toHaveLength(1);

    // Un proyecto elegido que no pertenece a los productos elegidos no entra,
    // aunque el proyecto esté elegido y el producto no lo contenga.
    const crossProduct = { ...emptyQuery(), projectIds: [pB.id] };
    expect(collectBoardCards([pA, pB], crossProduct, NOW)).toHaveLength(1);
  });

  it("person, priority y date recortan", () => {
    const p = project("Demo");
    p.tasks = [
      task("De Ana", { assigneeId: "ana", priority: "high", dueDate: dayOffset(-1) }),
      task("De Beto", { assigneeId: "beto", priority: "low", dueDate: dayOffset(10) }),
      task("Sin fecha", { assigneeId: "ana" }),
    ];

    const ana = { ...emptyQuery(), personId: "ana" };
    expect(collectBoardCards([p], ana, NOW).map((c) => c.task.title)).toEqual([
      "De Ana",
      "Sin fecha",
    ]);

    const high = { ...emptyQuery(), priority: "high" as const };
    expect(collectBoardCards([p], high, NOW).map((c) => c.task.title)).toEqual(["De Ana"]);

    const overdue = { ...emptyQuery(), date: "overdue" as const };
    expect(collectBoardCards([p], overdue, NOW).map((c) => c.task.title)).toEqual(["De Ana"]);
  });

  it("date=due-soon toma 0..3 y deja afuera una tarea sin fecha", () => {
    const p = project("Demo");
    p.tasks = [
      task("Hoy", { dueDate: dayOffset(0) }),
      task("En tres", { dueDate: dayOffset(3) }),
      task("En cuatro", { dueDate: dayOffset(4) }),
      task("Sin fecha"),
    ];
    const soon = { ...emptyQuery(), date: "due-soon" as const };
    expect(collectBoardCards([p], soon, NOW).map((c) => c.task.title)).toEqual(["Hoy", "En tres"]);
  });

  it("q no distingue mayúsculas ni diacríticos", () => {
    const p = project("Demo");
    p.tasks = [task("Revisión Óptica"), task("Otra cosa")];
    const query = { ...emptyQuery(), q: "REVISION optica" };
    expect(collectBoardCards([p], query, NOW).map((c) => c.task.title)).toEqual([
      "Revisión Óptica",
    ]);
  });
});

describe("parseBoardQuery (spec 075 D10/D11)", () => {
  const known = knownOf({
    productIds: new Set(["prod-1", "prod-2"]),
    projectIds: new Set(["p-1", "p-2"]),
    personIds: new Set(["ana"]),
  });

  it("separa por coma, recorta y tira vacíos y duplicados", () => {
    const q = parseBoardQuery(new URLSearchParams("product= prod-2 ,,prod-1,prod-2 "), known);
    expect(q.productIds).toEqual(["prod-2", "prod-1"]);
  });

  it("un id desconocido se descarta; si todos lo son, el param no filtra", () => {
    const partial = parseBoardQuery(new URLSearchParams("product=ghost,prod-1"), known);
    expect(partial.productIds).toEqual(["prod-1"]);

    const allUnknown = parseBoardQuery(new URLSearchParams("product=ghost"), known);
    expect(allUnknown.productIds).toEqual([]);

    const unknownProject = parseBoardQuery(new URLSearchParams("project=ghost"), known);
    expect(unknownProject.projectIds).toEqual([]);
  });

  it("person, priority y date inválidos no filtran", () => {
    const q = parseBoardQuery(
      new URLSearchParams("person=ghost&priority=urgent&date=mañana"),
      known,
    );
    expect(q.personId).toBeNull();
    expect(q.priority).toBeNull();
    expect(q.date).toBeNull();
  });

  it("done solo cuenta con 1; q se recorta; view pasa tal cual", () => {
    const q = parseBoardQuery(new URLSearchParams("done=true&q=  algo  &view=v-1"), known);
    expect(q.showDone).toBe(false);
    expect(q.q).toBe("algo");
    expect(q.viewId).toBe("v-1");

    const on = parseBoardQuery(new URLSearchParams("done=1"), known);
    expect(on.showDone).toBe(true);
  });

  it("sin params, la query está vacía y filtersEqual la compara sin viewId", () => {
    const a = parseBoardQuery(new URLSearchParams("done=1&priority=high&view=a"), known);
    const b = parseBoardQuery(new URLSearchParams("done=1&priority=high&view=b"), known);
    expect(filtersEqual(a, b)).toBe(true);

    const c = parseBoardQuery(new URLSearchParams("done=1"), known);
    expect(filtersEqual(a, c)).toBe(false);
  });
});

describe("canonicalBoardSearch (spec 075 §4)", () => {
  it("omite defaults y ordena los ids con localeCompare", () => {
    const query: Parameters<typeof canonicalBoardSearch>[0] = {
      productIds: ["prod-2", "prod-10", "prod-1"],
      projectIds: [],
      personId: "ana",
      priority: "high",
      date: "due-soon",
      q: "revision",
      showDone: true,
      viewId: null,
    };
    const params = canonicalBoardSearch(query);
    expect(params.get("product")).toBe("prod-1,prod-10,prod-2");
    expect([...params.keys()]).toEqual(["product", "person", "priority", "date", "q", "done"]);
  });

  it("una query vacía canoniza a vacío", () => {
    expect(canonicalBoardSearch(emptyQuery()).toString()).toBe("");
  });
});

describe("orden de tarjetas (spec 075 D7)", () => {
  it("manda el puesto del proyecto en la barra y, adentro, taskIndex", () => {
    const prodA = newProduct("Producto A");
    const prodB = newProduct("Producto B");
    const pA1 = project("A1", { productId: prodA.id });
    pA1.tasks = [task("A1 primera"), task("A1 segunda")];
    const pA2 = project("A2", { productId: prodA.id });
    pA2.tasks = [task("A2 única")];
    const pB = project("B", { productId: prodB.id });
    pB.tasks = [task("B primera"), task("B segunda")];

    // En el store pA1 está antes que pA2, pero la barra lo manda al final.
    const sidebarOrder = { [prodA.id]: [pA2.id, pA1.id] };
    const rank = boardProjectRank([prodB, prodA], [pA1, pA2, pB], sidebarOrder);
    expect(rank.get(pB.id)).toBe(0);
    expect(rank.get(pA2.id)).toBe(1);
    expect(rank.get(pA1.id)).toBe(2);

    const cards = collectBoardCards([pA1, pA2, pB], emptyQuery(), NOW);
    const cols = boardColumns(cards, true, rank);
    const todo = cols.find((c) => c.id === "todo");
    expect(todo?.cards.map((c) => c.task.title)).toEqual([
      "B primera",
      "B segunda",
      "A2 única",
      "A1 primera",
      "A1 segunda",
    ]);
  });

  it("sortCards usa título con localeCompare es si empatan rango e índice", () => {
    const p1 = project("Demo 1");
    p1.tasks = [task("caramelo")];
    const p2 = project("Demo 2");
    p2.tasks = [task("azul")];
    // Ninguno entra en el rango: empate en MAX y en taskIndex decide el título.
    const rank = boardProjectRank([], [], {});
    const cards = [
      ...collectBoardCards([p1], emptyQuery(), NOW),
      ...collectBoardCards([p2], emptyQuery(), NOW),
    ];
    expect(sortCards(cards, rank).map((c) => c.task.title)).toEqual(["azul", "caramelo"]);
  });

  it("un proyecto fuera del rango queda al final", () => {
    const prod = newProduct("Producto");
    const inside = project("Adentro", { productId: prod.id });
    inside.tasks = [task("De adentro")];
    const outside = project("Afuera");
    outside.tasks = [task("De afuera")];
    const rank = boardProjectRank([prod], [inside], {});
    const cards = [
      ...collectBoardCards([outside], emptyQuery(), NOW),
      ...collectBoardCards([inside], emptyQuery(), NOW),
    ];
    expect(sortCards(cards, rank).map((c) => c.projectName)).toEqual(["Adentro", "Afuera"]);
  });
});

describe("vistas (spec 075 D14)", () => {
  it("nombre vacío da empty; repetido por foldName da duplicate", () => {
    const views = [{ id: "v1", name: "Bloqueos" }];
    expect(viewNameError(views, "   ")).toBe("empty");
    expect(viewNameError(views, "bloqueos")).toBe("duplicate");
    expect(viewNameError(views, "BLOQUEOS")).toBe("duplicate");
    expect(viewNameError(views, "Bloqueos", "v1")).toBeNull();
    expect(viewNameError(views, "Otra cosa")).toBeNull();
  });

  it("el límite 20 solo muerde al crear; renombrar ignora el propio id", () => {
    const views = Array.from({ length: 20 }, (_, i) => ({ id: `v${i}`, name: `Vista ${i}` }));
    expect(viewNameError(views, "Nueva")).toBe("limit");
    expect(viewNameError(views, "Vista 5", "v5")).toBeNull();
  });

  it("matchingViewId ignora view y compara done de verdad", () => {
    const views = [
      { id: "v1", query: "priority=high&done=1" },
      { id: "v2", query: "priority=high" },
    ];
    // Sin done en la URL, la vista con done=1 no matchea.
    expect(matchingViewId(views, new URLSearchParams("priority=high"))).toBe("v2");
    expect(matchingViewId(views, new URLSearchParams("priority=high&done=1"))).toBe("v1");
    // El param view de la URL no participa de la comparación.
    expect(matchingViewId(views, new URLSearchParams("priority=high&view=otra"))).toBe("v2");
    expect(
      matchingViewId(views, new URLSearchParams("priority=high&done=1&view=v2")),
    ).toBe("v1");
    // Nada matchea → null.
    expect(matchingViewId(views, new URLSearchParams("q=revision"))).toBeNull();
  });
});

function emptyQuery() {
  return {
    productIds: [],
    projectIds: [],
    personId: null,
    priority: null,
    date: null,
    q: "",
    showDone: false,
    viewId: null,
  };
}
