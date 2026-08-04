import { useEffect, useState } from "react";
import {
  Download,
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
  onRemove: () => void;
  onUpdateDescription: (description: string) => void;
}

export function AttachmentRow({
  attachment,
  thumbUrl,
  busy,
  onDownload,
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
      <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
        {attachment.kind === "image" && thumbUrl ? (
          <img
            src={thumbUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <Icon className="size-4 text-muted-foreground" aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-sm font-medium leading-tight" title={attachment.name}>
          {attachment.name}
        </p>
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
          <DropdownMenuItem onClick={onDownload}>
            <Download className="size-4" />
            Descargar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onRemove}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="size-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
