import { describe, expect, it } from "vitest";
import {
  dueLabel,
  dueSuffix,
  formatDate,
  metaLabel,
  relativeSince,
} from "./taskDetailLabels";

const NOW = new Date("2026-08-21T12:00:00.000Z");

describe("dueLabel", () => {
  it("no dice nada sin fecha", () => {
    expect(dueLabel(null)).toBeNull();
  });

  it("distingue hoy de mañana y de ayer", () => {
    expect(dueLabel(0)).toBe("Vence hoy");
    expect(dueLabel(1)).toBe("Vence en 1 día");
    expect(dueLabel(-1)).toBe("Vencida hace 1 día");
  });

  it("pluraliza a partir de dos", () => {
    expect(dueLabel(5)).toBe("Vence en 5 días");
    expect(dueLabel(-3)).toBe("Vencida hace 3 días");
  });
});

describe("dueSuffix", () => {
  it("acompaña a la fecha sin repetir el verbo", () => {
    expect(dueSuffix(null)).toBeNull();
    expect(dueSuffix(0)).toBe("hoy");
    expect(dueSuffix(1)).toBe("en 1 día");
    expect(dueSuffix(5)).toBe("en 5 días");
    expect(dueSuffix(-2)).toBe("hace 2 días");
  });
});

describe("relativeSince", () => {
  it("colapsa el pasado inmediato en 'ahora'", () => {
    expect(relativeSince("2026-08-21T11:59:40.000Z", NOW)).toBe("ahora");
  });

  it("no viaja al futuro", () => {
    expect(relativeSince("2026-08-21T13:00:00.000Z", NOW)).toBe("ahora");
  });

  it("escala minutos, horas y días", () => {
    expect(relativeSince("2026-08-21T11:15:00.000Z", NOW)).toBe("hace 45 min");
    expect(relativeSince("2026-08-21T10:00:00.000Z", NOW)).toBe("hace 2 h");
    expect(relativeSince("2026-08-18T12:00:00.000Z", NOW)).toBe("hace 3 d");
  });

  it("pasa a fecha absoluta a partir de una semana", () => {
    expect(relativeSince("2026-08-10T12:00:00.000Z", NOW)).toBe("10 ago");
  });

  it("devuelve cadena vacía ante una fecha ilegible", () => {
    expect(relativeSince("no-es-una-fecha", NOW)).toBe("");
  });
});

describe("formatDate", () => {
  it("omite el año en curso y lo muestra fuera de él", () => {
    expect(formatDate("2026-08-03T09:00:00.000Z", NOW)).toBe("3 ago");
    expect(formatDate("2025-12-31T09:00:00.000Z", NOW)).toBe("31 dic 2025");
  });
});

describe("metaLabel", () => {
  it("junta creación y actualización en una línea", () => {
    expect(metaLabel("2026-08-03T09:00:00.000Z", "2026-08-21T10:00:00.000Z", NOW)).toBe(
      "Creada 3 ago · Actualizada hace 2 h",
    );
  });
});
