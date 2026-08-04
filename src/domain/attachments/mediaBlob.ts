import type { Attachment } from "@/domain/schemas/attachment";
import { ATTACHMENT_ALLOWLIST } from "./allowlist";

/**
 * Normaliza bytes leídos del storage a un `Blob` usable por
 * `URL.createObjectURL` y por `<video>`/`<audio>`/`<img>`.
 *
 * Casos que rompen la previsualización:
 * - File System Access devuelve a menudo `type: ""` o `application/octet-stream`
 *   y Chrome no elige decoder de video con ese MIME.
 * - IndexedDB puede devolver `ArrayBuffer`/`Uint8Array` si en algún momento
 *   se guardó así (no es un Blob real).
 */
export function resolveAttachmentMime(att: Pick<Attachment, "mimeType" | "ext">): string {
  const fromMeta = att.mimeType?.trim();
  if (fromMeta && fromMeta !== "application/octet-stream") return fromMeta;
  const fromExt = ATTACHMENT_ALLOWLIST[att.ext.toLowerCase()]?.mime;
  if (fromExt) return fromExt;
  return fromMeta || "application/octet-stream";
}

/** Convierte lo que venga de IDB/FS a Blob (sin forzar MIME aún). */
export function coerceToBlob(data: unknown): Blob {
  if (data instanceof Blob) return data;
  if (data instanceof ArrayBuffer) return new Blob([new Uint8Array(data)]);
  if (ArrayBuffer.isView(data)) {
    const view = data as ArrayBufferView;
    // Copia a Uint8Array (evita SharedArrayBuffer en el tipo de BlobPart).
    return new Blob([
      new Uint8Array(view.buffer, view.byteOffset, view.byteLength).slice(),
    ]);
  }
  throw new Error("El contenido del anexo no es un blob válido");
}

/**
 * Asegura un Blob con MIME correcto para previsualizar/reproducir.
 * Si el type ya coincide, reutiliza la misma instancia.
 */
export function blobForMedia(
  data: unknown,
  att: Pick<Attachment, "mimeType" | "ext">,
): Blob {
  const raw = coerceToBlob(data);
  const mime = resolveAttachmentMime(att);
  if (raw.type === mime) return raw;
  // Re-envolver: los media elements miran blob.type al abrir blob: URLs.
  return new Blob([raw], { type: mime });
}
