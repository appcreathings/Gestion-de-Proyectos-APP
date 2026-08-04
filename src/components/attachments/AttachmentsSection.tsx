import { useEffect, useMemo, useState } from "react";
import type { Attachment } from "@/domain/schemas/attachment";
import type { AttachmentKind } from "@/domain/attachments/allowlist";
import type { AttachmentParent } from "@/domain/attachments/paths";
import { getAttachmentsFromState } from "@/domain/attachments/ops";
import { AttachmentDropZone } from "./AttachmentDropZone";
import { AttachmentRow } from "./AttachmentRow";
import { useAttachmentActions } from "@/hooks/useAttachmentActions";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useDataStore } from "@/store/useDataStore";
import { cn } from "@/lib/utils";

const KIND_FILTERS: Array<{ id: "all" | AttachmentKind; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "image", label: "Imágenes" },
  { id: "document", label: "Documentos" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
  { id: "archive", label: "Archivos" },
];

interface Props {
  parent: AttachmentParent;
  /**
   * Opcional: si se omite, se lee del store (recomendado — evita props
   * obsoletas en diálogos que abrieron un snapshot del entity).
   */
  attachments?: Attachment[];
  disabled?: boolean;
  className?: string;
}

export function AttachmentsSection({
  parent,
  attachments: attachmentsProp,
  disabled,
  className,
}: Props) {
  // Siempre el store: evita snapshots viejos en diálogos (AreaForm, etc.).
  const storeList = useDataStore((s) =>
    getAttachmentsFromState(parent, {
      projects: s.projects,
      products: s.products,
      processTemplates: s.processTemplates,
    }),
  );
  const attachments = storeList.length > 0 || !attachmentsProp ? storeList : attachmentsProp;

  const {
    adapterKind,
    maxBytes,
    maxCount,
    busy,
    pendingDelete,
    setPendingDelete,
    addFiles,
    confirmRemove,
    updateDescription,
    download,
    thumbUrlFor,
  } = useAttachmentActions(parent);

  const [filter, setFilter] = useState<"all" | AttachmentKind>("all");
  const [thumbs, setThumbs] = useState<Record<string, string | null>>({});

  const sorted = useMemo(() => {
    const list = [...attachments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    if (filter === "all") return list;
    return list.filter((a) => a.kind === filter);
  }, [attachments, filter]);

  useEffect(() => {
    let cancelled = false;
    const images = attachments.filter((a) => a.kind === "image");
    void (async () => {
      const next: Record<string, string | null> = {};
      for (const att of images) {
        next[att.id] = await thumbUrlFor(att);
      }
      if (!cancelled) setThumbs((prev) => ({ ...prev, ...next }));
    })();
    return () => {
      cancelled = true;
    };
  }, [attachments, thumbUrlFor]);

  const atCap = attachments.length >= maxCount;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          Anexos ({attachments.length}
          {maxCount ? `/${maxCount}` : ""})
        </p>
        <div className="flex flex-wrap gap-1">
          {KIND_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors",
                filter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {adapterKind === "download" && (
        <p className="rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-[11px] text-muted-foreground">
          Modo navegador: los archivos viven solo en este dispositivo (máx.{" "}
          {Math.round(maxBytes / (1024 * 1024))} MB c/u). Con carpeta local se
          guardan en <code className="font-mono text-[10px]">attachments/</code>.
        </p>
      )}

      {!disabled && !atCap && (
        <AttachmentDropZone
          busy={busy}
          disabled={disabled}
          maxBytes={maxBytes}
          onFiles={(files) => void addFiles(files)}
        />
      )}
      {atCap && !disabled && (
        <p className="text-[11px] text-muted-foreground">
          Llegaste al máximo de {maxCount} anexos en esta entidad.
        </p>
      )}

      {sorted.length === 0 ? (
        <p className="text-[11px] italic text-muted-foreground">
          Aún no hay anexos — adjuntá PDFs, capturas o videos cortos.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {sorted.map((att) => (
            <li key={att.id}>
              <AttachmentRow
                attachment={att}
                thumbUrl={thumbs[att.id]}
                busy={busy}
                onDownload={() => void download(att)}
                onRemove={() => setPendingDelete(att)}
                onUpdateDescription={(d) => void updateDescription(att.id, d)}
              />
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        onOpenChange={(o) => {
          if (!o) setPendingDelete(null);
        }}
        title={
          pendingDelete
            ? `¿Eliminar «${pendingDelete.name}»?`
            : "¿Eliminar anexo?"
        }
        description="Se borrará del disco / de este navegador. No se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={() => confirmRemove()}
      />
    </div>
  );
}
