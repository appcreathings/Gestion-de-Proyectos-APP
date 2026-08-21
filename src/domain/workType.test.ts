import { describe, expect, it } from "vitest";
import { newTask } from "./factories";
import { TaskSchema } from "./schemas/project";

describe("Task workType defaults (spec 062)", () => {
  it("newTask() crea una tarea genérica con KR vacío", () => {
    const t = newTask("Spike de pago");
    expect(t.workType).toBe("task");
    expect(t.krCurrent).toBeNull();
    expect(t.krTarget).toBeNull();
    expect(t.krUnit).toBe("");
  });

  it("Zod parse de una tarea vieja (sin workType/kr*) aplica los defaults", () => {
    const legacy = TaskSchema.parse({
      id: "t1",
      title: "Vieja",
      description: "",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(legacy.workType).toBe("task");
    expect(legacy.krCurrent).toBeNull();
    expect(legacy.krTarget).toBeNull();
    expect(legacy.krUnit).toBe("");
  });

  it("Zod parse conserva un workType explícito y su métrica KR", () => {
    const kr = TaskSchema.parse({
      id: "t2",
      title: "NPS 40 → 55",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      workType: "key_result",
      krCurrent: 40,
      krTarget: 55,
      krUnit: "pts",
    });
    expect(kr.workType).toBe("key_result");
    expect(kr.krCurrent).toBe(40);
    expect(kr.krTarget).toBe(55);
    expect(kr.krUnit).toBe("pts");
  });

  it("rechaza un workType fuera del enum", () => {
    expect(() =>
      TaskSchema.parse({
        id: "t3",
        title: "Rota",
        createdAt: "2026-01-01T00:00:00.000Z",
        updatedAt: "2026-01-01T00:00:00.000Z",
        workType: "epic",
      }),
    ).toThrow();
  });
});
