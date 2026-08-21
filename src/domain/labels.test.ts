import { describe, expect, it } from "vitest";
import { WorkType } from "./schemas/common";
import { workTypeLabel, workTypeVariant, WORK_TYPE_OPTIONS } from "./labels";

describe("workType labels (spec 062 §5)", () => {
  it("los 7 valores del enum tienen label y variant", () => {
    for (const value of WorkType.options) {
      expect(typeof workTypeLabel[value]).toBe("string");
      expect(workTypeLabel[value].length).toBeGreaterThan(0);
      expect(workTypeVariant[value]).toBeDefined();
    }
    expect(workTypeLabel.task).toBe("Tarea");
    expect(workTypeLabel.key_result).toBe("Key result");
  });

  it("WORK_TYPE_OPTIONS contiene los 7 valores, con task al final", () => {
    expect([...WORK_TYPE_OPTIONS].sort()).toEqual([...WorkType.options].sort());
    expect(WORK_TYPE_OPTIONS[WORK_TYPE_OPTIONS.length - 1]).toBe("task");
  });
});
