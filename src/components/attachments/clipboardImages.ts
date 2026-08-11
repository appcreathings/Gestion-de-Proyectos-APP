/**
 * Build File objects from clipboard image items.
 * Names use MIME → extension (classifyFile requires a valid extension).
 */

function extFromMime(mime: string): string {
  return mime.split("/")[1]?.split("+")[0] || "png";
}

/** From a paste event (ClipboardEvent.clipboardData.items). */
export function imageFilesFromDataTransferItems(
  items: DataTransferItemList | undefined | null,
): File[] {
  if (!items) return [];
  const imageFiles: File[] = [];
  for (const item of items) {
    if (item.kind !== "file" || !item.type.startsWith("image/")) continue;
    const file = item.getAsFile();
    if (!file) continue;
    const ext = extFromMime(item.type);
    imageFiles.push(new File([file], `pegado-${Date.now()}.${ext}`, { type: item.type }));
  }
  return imageFiles;
}

/** From Clipboard API (navigator.clipboard.read()). */
export async function imageFilesFromClipboardRead(): Promise<File[]> {
  if (!navigator.clipboard?.read) {
    throw new Error("clipboard-read-unsupported");
  }
  const items = await navigator.clipboard.read();
  const imageFiles: File[] = [];
  for (const item of items) {
    const type = item.types.find((t) => t.startsWith("image/"));
    if (!type) continue;
    const blob = await item.getType(type);
    const ext = extFromMime(type);
    imageFiles.push(new File([blob], `pegado-${Date.now()}.${ext}`, { type }));
  }
  return imageFiles;
}
