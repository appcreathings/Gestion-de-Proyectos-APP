import { z } from "zod";

export const AttachmentKind = z.enum([
  "image",
  "document",
  "video",
  "audio",
  "archive",
]) as z.ZodEnum<["image", "document", "video", "audio", "archive"]>;
export type AttachmentKind = z.infer<typeof AttachmentKind>;

export const ATTACHMENT_ALLOWLIST: Record<
  string,
  { kind: AttachmentKind; mime: string }
> = {
  png: { kind: "image", mime: "image/png" },
  jpg: { kind: "image", mime: "image/jpeg" },
  jpeg: { kind: "image", mime: "image/jpeg" },
  webp: { kind: "image", mime: "image/webp" },
  gif: { kind: "image", mime: "image/gif" },
  svg: { kind: "image", mime: "image/svg+xml" },
  pdf: { kind: "document", mime: "application/pdf" },
  txt: { kind: "document", mime: "text/plain" },
  md: { kind: "document", mime: "text/markdown" },
  csv: { kind: "document", mime: "text/csv" },
  doc: { kind: "document", mime: "application/msword" },
  docx: { kind: "document", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  xls: { kind: "document", mime: "application/vnd.ms-excel" },
  xlsx: { kind: "document", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  ppt: { kind: "document", mime: "application/vnd.ms-powerpoint" },
  pptx: { kind: "document", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
  mp4: { kind: "video", mime: "video/mp4" },
  webm: { kind: "video", mime: "video/webm" },
  mov: { kind: "video", mime: "video/quicktime" },
  mp3: { kind: "audio", mime: "audio/mpeg" },
  wav: { kind: "audio", mime: "audio/wav" },
  ogg: { kind: "audio", mime: "audio/ogg" },
  m4a: { kind: "audio", mime: "audio/mp4" },
  zip: { kind: "archive", mime: "application/zip" },
};

export function classifyFile(file: File):
  | { ok: true; ext: string; kind: AttachmentKind; mimeType: string }
  | { ok: false; reason: string }
{
  const name = file.name.toLowerCase();
  const lastDot = name.lastIndexOf(".");
  if (lastDot === -1) {
    return { ok: false, reason: "El archivo no tiene extensión" };
  }
  const ext = name.slice(lastDot + 1);
  const allowed = ATTACHMENT_ALLOWLIST[ext];
  if (!allowed) {
    return { ok: false, reason: `Extensión .${ext} no permitida` };
  }
  return {
    ok: true,
    ext,
    kind: allowed.kind,
    mimeType: file.type || allowed.mime,
  };
}