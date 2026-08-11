import { useEffect, useState } from "react";
import {
  Download,
  Eye,
  FileArchive,
  FileImage,
  FileText,
  Film,
  MoreHorizontal,
  Music,
  Trash2,
} from "lucide-react";
import type { Attachment } from "@/domain/schemas/attachment";
import type { AttachmentKind } from "@/domain/attachments/allowlist";
import { formatBytes } from "@/lib/formatBytes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<AttachmentKind, typeof FileText> = {
  image: FileImage,
  document: FileText,
  video: Film,
  audio: Music,
  archive: FileArchive,
};

interface Props {
  attachment: Attachment;
  thumbUrl?: string | null;
  busy?: boolean;
  onDownload: () => void;
  onPreview: () => void;
  onRemove: () => void;
  onUpdateDescription: (description: string) => void;
}

export function AttachmentRow({
  attachment,
  thumbUrl,
  busy,
  onDownload,
  onPreview,
  onRemove,
  onUpdateDescription,
}: Props) {
  const Icon = KIND_ICON[attachment.kind] ?? FileText;
  const [desc, setDesc] = useState(attachment.description ?? "");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setDesc(attachment.description ?? "");
  }, [attachment.description, attachment.id]);

  const commitDesc = () => {
    setEditing(false);
    const next = desc.trim();
    if (next !== (attachment.description ?? "").trim()) {
      onUpdateDescription(next);
    }
  };

  const dateLabel = new Date(attachment.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border border-border/60 bg-background px-2 py-2",
        busy && "opacity-70",
      )}
    >
      <button
        type="button"
        onClick={onPreview}
        disabled={busy}
        className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Vista previa de ${attachment.name}`}
        title="Vista previa"
      >
        {attachment.kind === "image" && thumbUrl ? (
          <img src={thumbUrl} alt="" className="size-full object-cover" />
        ) : (
          <Icon className="size-4 text-muted-foreground" aria-hidden />
        )}
      </button>

      <div className="min-w-0 flex-1 space-y-1">
        <button
          type="button"
          onClick={onPreview}
          disabled={busy}
          className="block w-full truncate text-left text-sm font-medium leading-tight hover:underline"
          title={attachment.name}
        >
          {attachment.name}
        </button>
        <p className="text-[10px] text-muted-foreground">
          {formatBytes(attachment.size)} · {dateLabel}
        </p>
        {editing ? (
          <Input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onBlur={commitDesc}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitDesc();
              }
              if (e.key === "Escape") {
                setDesc(attachment.description ?? "");
                setEditing(false);
              }
            }}
            placeholder="Descripción (opcional)"
            className="h-7 text-xs"
            autoFocus
            disabled={busy}
          />
        ) : (
          <button
            type="button"
            onClick={() => !busy && setEditing(true)}
            className="block w-full truncate text-left text-[11px] text-muted-foreground hover:text-foreground"
            title="Editar descripción"
          >
            {desc.trim() || "Añadir descripción…"}
          </button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            disabled={busy}
            aria-label={`Acciones de ${attachment.name}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onPreview} className="gap-2">
            <Eye className="size-4" />
            Vista previa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDownload} className="gap-2">
            <Download className="size-4" />
            Descargar
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 text-destructive focus:text-destructive"
            // Defer ConfirmDialog until after the menu's dismiss cycle.
            // Opening in the same tick lets pointer-up/focus restore close the
            // non-modal confirm immediately (delete UI "flashes" and vanishes).
            onSelect={() => {
              window.setTimeout(() => onRemove(), 0);
            }}
          >
            <Trash2 className="size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
