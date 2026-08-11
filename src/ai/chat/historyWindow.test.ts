import { describe, expect, it } from "vitest";
import { AGENT_HISTORY_WINDOW, trimAgentHistory } from "./historyWindow";

describe("trimAgentHistory", () => {
  it("devuelve el mismo array si length <= max (sin copia)", () => {
    const h = [1, 2, 3];
    expect(trimAgentHistory(h)).toBe(h);
  });

  it("recorta a las últimas N entradas cuando excede", () => {
    const h = Array.from({ length: 20 }, (_, i) => i);
    const trimmed = trimAgentHistory(h);
    expect(trimmed.length).toBe(AGENT_HISTORY_WINDOW);
    expect(trimmed[0]).toBe(20 - AGENT_HISTORY_WINDOW);
    expect(trimmed[trimmed.length - 1]).toBe(19);
  });

  it("respeta max custom", () => {
    expect(trimAgentHistory([1, 2, 3, 4, 5], 2)).toEqual([4, 5]);
  });

  it("no muta el array original", () => {
    const h = [1, 2, 3, 4, 5];
    trimAgentHistory(h, 2);
    expect(h).toEqual([1, 2, 3, 4, 5]);
  });

  it("en el límite exacto (12) devuelve sin recortar", () => {
    const h = Array.from({ length: AGENT_HISTORY_WINDOW }, (_, i) => i);
    expect(trimAgentHistory(h).length).toBe(AGENT_HISTORY_WINDOW);
  });
});
