/**
 * Helpers puros de edición Markdown para `RichTextField` (spec 044).
 *
 * Son agnósticos al DOM: reciben el texto y la selección actual y devuelven
 * el nuevo texto junto con la próxima posición del caret/selección, de
 * modo que el componente pueda aplicar `setSelectionRange` tras el render.
 */

export type TextSelection = { start: number; end: number };

export type EditResult = {
  value: string;
  /** Nueva selección / caret que el componente debe aplicar tras el cambio. */
  selection: TextSelection;
};

function clamp(n: number, max: number): number {
  if (n < 0) return 0;
  if (n > max) return max;
  return n;
}

/**
 * Envuelve la selección con `open` / `close`. Si la selección es vacía,
 * inserta ambos marcadores y deja el caret en el medio.
 */
export function wrapSelection(
  value: string,
  sel: TextSelection,
  open: string,
  close: string,
): EditResult {
  const len = value.length;
  const start = clamp(sel.start, len);
  const end = clamp(sel.end, len);
  const before = value.slice(0, start);
  const middle = value.slice(start, end);
  const after = value.slice(end);
  const next = before + open + middle + close + after;

  if (middle.length > 0) {
    // Selecciona el texto envuelto (sin marcadores) para que escribir
    // reemplace solo el contenido y los marcadores queden intactos.
    return {
      value: next,
      selection: { start: start + open.length, end: start + open.length + middle.length },
    };
  }
  // Caret entre marcadores.
  return {
    value: next,
    selection: { start: start + open.length, end: start + open.length },
  };
}

/**
 * Prefija cada línea de la selección (o la línea del caret si la selección
 * es vacía) con `- ` (ul) o `1. `, `2. `, … (ol). Idempotente light: una
 * línea que ya empieza con `- ` no se duplica.
 */
export function prefixLines(
  value: string,
  sel: TextSelection,
  kind: "ul" | "ol",
): EditResult {
  const len = value.length;
  const start = clamp(sel.start, len);
  const end = clamp(sel.end, len);

  // Extender a límites de línea completos para no partir texto a medias.
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  let endForLine = end;
  if (end > start && value[end - 1] === "\n") {
    // La selección termina justo después de un `\n`: no incluir la línea vacía siguiente.
    endForLine = end - 1;
  }
  const blockEnd = (() => {
    const nl = value.indexOf("\n", endForLine === start ? start : endForLine);
    return nl === -1 ? value.length : nl;
  })();

  const block = value.slice(lineStart, blockEnd);
  const lines = block.split("\n");

  let newBlock: string;
  if (kind === "ul") {
    newBlock = lines
      .map((line) => (line.startsWith("- ") ? line : `- ${line}`))
      .join("\n");
  } else {
    newBlock = lines
      .map((line, i) => `${i + 1}. ${line.replace(/^\d+\.\s+/, "")}`)
      .join("\n");
  }

  const next = value.slice(0, lineStart) + newBlock + value.slice(blockEnd);

  // Caso especial: línea vacía en ul → insertar `- ` y caret al final.
  if (kind === "ul" && lines.length === 1 && lines[0] === "") {
    return {
      value: value.slice(0, lineStart) + "- " + value.slice(blockEnd),
      selection: { start: lineStart + 2, end: lineStart + 2 },
    };
  }

  return {
    value: next,
    selection: { start: lineStart, end: lineStart + newBlock.length },
  };
}

/**
 * Inserta un enlace `[label](url)`. Si hay selección, se usa como label
 * y el caret queda al final del markdown insertado. Si no hay selección,
 * se inserta con el `label` provisto (o el placeholder `"texto"`) y se
 * selecciona solo la etiqueta entre corchetes para que el usuario la reemplace.
 */
export function insertLink(
  value: string,
  sel: TextSelection,
  url: string,
  label?: string,
): EditResult {
  const len = value.length;
  const start = clamp(sel.start, len);
  const end = clamp(sel.end, len);
  const selected = value.slice(start, end);
  const before = value.slice(0, start);
  const after = value.slice(end);

  if (selected.length > 0) {
    const md = `[${selected}](${url})`;
    return {
      value: before + md + after,
      selection: { start, end: start + md.length },
    };
  }

  const lbl = label && label.length > 0 ? label : "texto";
  const md = `[${lbl}](${url})`;
  // Seleccionar solo la etiqueta (entre corchetes) para que escribir
  // reemplace el texto visible y conservemos `[](url)`.
  return {
    value: before + md + after,
    selection: { start: start + 1, end: start + 1 + lbl.length },
  };
}
