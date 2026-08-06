import { describe, expect, it } from "vitest";
import { insertLink, prefixLines, wrapSelection } from "./markdownEdit";

describe("wrapSelection", () => {
  it("envuelve el texto seleccionado con marcadores de negrita", () => {
    const value = "hola mundo";
    const r = wrapSelection(value, { start: 5, end: 10 }, "**", "**");
    expect(r.value).toBe("hola **mundo**");
    // Selección interior (sin marcadores): escribir conserva `**...**`.
    expect(r.selection).toEqual({ start: 7, end: 12 });
  });

  it("con caret vacío inserta marcadores y deja el caret entre ellos", () => {
    const value = "hola mundo";
    const r = wrapSelection(value, { start: 5, end: 5 }, "**", "**");
    expect(r.value).toBe("hola ****mundo");
    expect(r.selection).toEqual({ start: 7, end: 7 });
  });

  it("cursiva usa un solo asterisco (no underscore)", () => {
    const r = wrapSelection("x", { start: 0, end: 1 }, "*", "*");
    expect(r.value).toBe("*x*");
  });

  it("código inline usa backticks", () => {
    const r = wrapSelection("code", { start: 0, end: 4 }, "`", "`");
    expect(r.value).toBe("`code`");
    // Selección interior: `code` entre los backticks.
    expect(r.selection).toEqual({ start: 1, end: 5 });
  });

  it("no corrompe emojis (offsets por code unit)", () => {
    // "👍" ocupa 2 code units UTF-16.
    const value = "👍";
    const r = wrapSelection(value, { start: 0, end: 2 }, "**", "**");
    expect(r.value).toBe("**👍**");
    // Selección interior: el emoji entre marcadores.
    expect(r.selection).toEqual({ start: 2, end: 4 });
  });
});

describe("prefixLines", () => {
  it("lista no ordenada en selección multi-línea", () => {
    const value = "a\nb\nc";
    const r = prefixLines(value, { start: 0, end: 5 }, "ul");
    expect(r.value).toBe("- a\n- b\n- c");
    expect(r.selection).toEqual({ start: 0, end: 11 });
  });

  it("idempotente light: no duplica `- ` si ya existe", () => {
    const value = "- a\nb";
    const r = prefixLines(value, { start: 0, end: 5 }, "ul");
    expect(r.value).toBe("- a\n- b");
  });

  it("lista numerada enumera 1..n", () => {
    const value = "a\nb\nc";
    const r = prefixLines(value, { start: 0, end: 5 }, "ol");
    expect(r.value).toBe("1. a\n2. b\n3. c");
  });

  it("ol reemplaza un número previo en la línea", () => {
    const value = "5. x";
    const r = prefixLines(value, { start: 0, end: 4 }, "ol");
    expect(r.value).toBe("1. x");
  });

  it("selección vacía en línea con texto → prefija la línea actual", () => {
    const value = "primer línea\nsegunda";
    const r = prefixLines(value, { start: 8, end: 8 }, "ul");
    expect(r.value).toBe("- primer línea\nsegunda");
  });

  it("selección vacía en línea vacía → inserta `- ` y caret al final", () => {
    const value = "";
    const r = prefixLines(value, { start: 0, end: 0 }, "ul");
    expect(r.value).toBe("- ");
    expect(r.selection).toEqual({ start: 2, end: 2 });
  });

  it("ol en línea vacía → inserta `1. ` y caret al final", () => {
    const r = prefixLines("", { start: 0, end: 0 }, "ol");
    expect(r.value).toBe("1. ");
    expect(r.selection).toEqual({ start: 0, end: 3 });
  });
});

describe("insertLink", () => {
  it("con selección usa el texto como etiqueta", () => {
    const r = insertLink("ver docs", { start: 4, end: 8 }, "https://x.io");
    expect(r.value).toBe("ver [docs](https://x.io)");
    expect(r.selection).toEqual({ start: 4, end: 24 });
  });

  it("sin selección inserta placeholder y selecciona la etiqueta", () => {
    const r = insertLink("x", { start: 1, end: 1 }, "https://x.io", "enlace");
    expect(r.value).toBe("x[enlace](https://x.io)");
    // Selección interior: solo `enlace` (sin corchetes).
    expect(r.selection).toEqual({ start: 2, end: 8 });
  });

  it("sin selección y sin label usa placeholder 'texto'", () => {
    const r = insertLink("", { start: 0, end: 0 }, "https://x.io");
    expect(r.value).toBe("[texto](https://x.io)");
    expect(r.selection).toEqual({ start: 1, end: 6 });
  });
});
