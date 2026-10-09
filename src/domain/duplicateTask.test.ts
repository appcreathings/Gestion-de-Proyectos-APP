import { describe, expect, it } from "vitest";
import { newProject, newTask } from "./factories";
import type { Task } from "./schemas";
import {
  appendTasks,
  cloneTask,
  copyTitle,
  insertTaskCopies,
} from "./duplicateTask";

const TS = "2026-01-01T00:00:00.000Z";

function fullTask(): Task {
  return {
    ...newTask("Post semana 1", "area-1"),
    description: "Escribir y publicar",
    summary: "Post semanal",
    status: "doing",
    priority: "high",
    workType: "key_result",
    krCurrent: 5,
    krTarget: 10,
    krUnit: "posts",
    assigneeId: "person-1",
    dueDate: "2026-02-01",
    sourceItemId: "item-1",
    sprintId: "sprint-1",
    tags: ["marketing"],
    comments: [{ id: "c1", authorId: null, text: "Hecho", createdAt: TS, updatedAt: TS }],
    archived: true,
    estimate: 4,
    actualHours: 3,
    subtasks: [
      { id: "s1", title: "Borrador", done: true, createdAt: TS, updatedAt: TS },
      { id: "s2", title: "Publicar", done: false, createdAt: TS, updatedAt: TS },
    ],
    attachments: [
      {
        id: "a1",
        name: "img.png",
        ext: "png",
        mimeType: "image/png",
        kind: "image",
        size: 10,
        relativePath: "attachments/projects/p/tasks/t/a1__img.png",
      } as Task["attachments"][number],
    ],
    links: [{ id: "l1", url: "https://figma.com/x", label: "Figma", createdAt: TS, updatedAt: TS }],
    dedupeKey: "deal-1",
    createdAt: TS,
    updatedAt: TS,
  };
}

describe("cloneTask — mismo proyecto", () => {
  it("copia el trabajo y resetea la historia", () => {
    const src = fullTask();
    const copy = cloneTask(src, { sameProject: true });

    expect(copy.id).not.toBe(src.id);
    expect(copy.title).toBe("Post semana 1 (copia)");
    expect(copy.status).toBe("todo");
    expect(copy.archived).toBe(false);
    expect(copy.areaId).toBe("area-1");
    expect(copy.sprintId).toBe("sprint-1");
    expect(copy.comments).toEqual([]);
    expect(copy.attachments).toEqual([]);
    expect(copy.actualHours).toBeNull();
    expect(copy.krCurrent).toBeNull();
    expect(copy.sourceItemId).toBeNull();
    expect(copy.dedupeKey).toBeNull();

    expect(copy.krTarget).toBe(10);
    expect(copy.krUnit).toBe("posts");
    expect(copy.tags).toEqual(["marketing"]);
    expect(copy.assigneeId).toBe("person-1");
    expect(copy.dueDate).toBe("2026-02-01");
    expect(copy.estimate).toBe(4);
    expect(copy.description).toBe("Escribir y publicar");
    expect(copy.summary).toBe("Post semanal");
    expect(copy.priority).toBe("high");
    expect(copy.workType).toBe("key_result");
    expect(copy.createdAt).not.toBe(TS);
  });

  it("subtareas con ids nuevos y sin marcar", () => {
    const src = fullTask();
    const copy = cloneTask(src, { sameProject: true });

    expect(copy.subtasks.map((s) => s.title)).toEqual(["Borrador", "Publicar"]);
    expect(copy.subtasks.every((s) => !s.done)).toBe(true);
    const srcIds = new Set(src.subtasks.map((s) => s.id));
    expect(copy.subtasks.some((s) => srcIds.has(s.id))).toBe(false);
    expect(new Set(copy.subtasks.map((s) => s.id)).size).toBe(2);
  });

  it("links con ids nuevos y misma url/label", () => {
    const src = fullTask();
    const copy = cloneTask(src, { sameProject: true });

    expect(copy.links).toHaveLength(1);
    expect(copy.links[0].url).toBe("https://figma.com/x");
    expect(copy.links[0].label).toBe("Figma");
    expect(copy.links[0].id).not.toBe("l1");
  });

  it("tags es otro array", () => {
    const src = fullTask();
    const copy = cloneTask(src, { sameProject: true });
    copy.tags.push("otro");
    expect(src.tags).toEqual(["marketing"]);
  });

  it("dos clones tienen ids distintos", () => {
    const src = fullTask();
    expect(cloneTask(src, { sameProject: true }).id).not.toBe(
      cloneTask(src, { sameProject: true }).id,
    );
  });
});

describe("cloneTask — otro proyecto", () => {
  it("título igual, sin área ni sprint, responsable igual", () => {
    const copy = cloneTask(fullTask(), { sameProject: false });
    expect(copy.title).toBe("Post semana 1");
    expect(copy.areaId).toBeNull();
    expect(copy.sprintId).toBeNull();
    expect(copy.assigneeId).toBe("person-1");
  });
});

describe("copyTitle", () => {
  it("agrega el sufijo una sola vez", () => {
    expect(copyTitle("A")).toBe("A (copia)");
    expect(copyTitle("A (copia)")).toBe("A (copia)");
  });
});

describe("insertTaskCopies / appendTasks", () => {
  function projectWith(titles: string[]) {
    const p = newProject("P");
    return { ...p, tasks: titles.map((t) => newTask(t)) };
  }

  it("inserta cada copia justo después de su original", () => {
    const p = projectWith(["a", "b", "c"]);
    const [a, , c] = p.tasks;
    const a2 = cloneTask(a, { sameProject: true });
    const c2 = cloneTask(c, { sameProject: true });
    const next = insertTaskCopies(p, [
      { sourceId: a.id, task: a2 },
      { sourceId: c.id, task: c2 },
    ]);
    expect(next.tasks.map((t) => t.title)).toEqual([
      "a",
      "a (copia)",
      "b",
      "c",
      "c (copia)",
    ]);
  });

  it("origen inexistente → al final", () => {
    const p = projectWith(["a"]);
    const x = newTask("x");
    const next = insertTaskCopies(p, [{ sourceId: "nope", task: x }]);
    expect(next.tasks.map((t) => t.title)).toEqual(["a", "x"]);
  });

  it("listas vacías devuelven la misma referencia", () => {
    const p = projectWith(["a"]);
    expect(insertTaskCopies(p, [])).toBe(p);
    expect(appendTasks(p, [])).toBe(p);
  });

  it("appendTasks agrega al final en orden", () => {
    const p = projectWith(["x"]);
    const next = appendTasks(p, [newTask("a"), newTask("b")]);
    expect(next.tasks.map((t) => t.title)).toEqual(["x", "a", "b"]);
  });
});
