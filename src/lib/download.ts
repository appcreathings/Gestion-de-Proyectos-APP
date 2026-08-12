/** Descarga de Blob/texto en el navegador (spec 052 y reutilizable). */

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadText(
  filename: string,
  text: string,
  mime = "text/markdown;charset=utf-8",
): void {
  downloadBlob(filename, new Blob([text], { type: mime }));
}
