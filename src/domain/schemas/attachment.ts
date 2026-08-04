import { z } from "zod";
import { AttachmentKind } from "../attachments/allowlist";
import { Id, IsoDate } from "./common";

export const AttachmentSchema = z.object({
  id: Id,
  /** Nombre original mostrado en UI (p.ej. "Acta kickoff.pdf"). */
  name: z.string().min(1),
  /** Extensión normalizada sin punto: "pdf", "png". */
  ext: z.string().min(1),
  mimeType: z.string().default("application/octet-stream"),
  kind: AttachmentKind,
  /** Bytes del archivo. */
  size: z.number().int().nonnegative(),
  /**
   * Ruta relativa a la raíz del workspace, con `/` como separador.
   * Ej: "attachments/projects/<projectId>/tasks/<taskId>/<id>__acta-kickoff.pdf"
   * En DownloadAdapter es la clave lógica del blob (mismo string).
   */
  relativePath: z.string().min(1),
  description: z.string().default(""),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
export type Attachment = z.infer<typeof AttachmentSchema>;