import { useCallback, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { ClipboardPaste, Paperclip, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/formatBytes";

interface Props {
  disabled?: boolean;
  busy?: boolean;
  maxBytes: number;
  acceptHint?: string;
  onFiles: (files: File[]) => void;
  /** Paste image from clipboard (optional — parent wires navigator.clipboard / toast). */
  onPasteFromClipboard?: () => void;
  pasteBusy?: boolean;
}

export function AttachmentDropZone({
  disabled,
  busy,
  maxBytes,
  acceptHint = "PDF, imágenes, docs, audio, video o zip",
  onFiles,
  onPasteFromClipboard,
  pasteBusy,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = useCallback(
    (e?: { stopPropagation(): void; preventDefault(): void }) => {
      e?.stopPropagation();
      e?.preventDefault();
      if (disabled || busy) return;
      inputRef.current?.click();
    },
    [disabled, busy],
  );

  const emit = useCallback(
    (list: FileList | File[] | null) => {
      if (!list || disabled || busy) return;
      const files = Array.from(list);
      if (files.length === 0) return;
      onFiles(files);
    },
    [disabled, busy, onFiles],
  );

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      emit(e.dataTransfer.files);
    },
    [emit],
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        pick();
      }
    },
    [pick],
  );

  return (
    <div
      role="button"
      tabIndex={disabled || busy ? -1 : 0}
      aria-disabled={disabled || busy || undefined}
      aria-label="Adjuntar archivos"
      // Solo el gesto explícito de esta zona abre el picker — no un click
      // “fantasma” que burbujea desde la preview de video (portal React).
      onClick={(e) => pick(e)}
      onKeyDown={onKeyDown}
      onDragEnter={(e) => {
        e.preventDefault();
        if (!disabled && !busy) setDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-4 text-center transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/40",
        (disabled || busy) && "pointer-events-none opacity-60",
      )}
    >
      {/* `hidden` + pointer-events-none: el input no recibe clics; solo se abre vía pick(). */}
      <input
        ref={inputRef}
        type="file"
        multiple
        tabIndex={-1}
        className="pointer-events-none fixed h-0 w-0 opacity-0"
        disabled={disabled || busy}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          emit(e.target.files);
          e.target.value = "";
        }}
      />
      {busy ? (
        <Upload className="size-5 animate-pulse text-muted-foreground" />
      ) : (
        <Paperclip className="size-5 text-muted-foreground" />
      )}
      <p className="text-xs font-medium">
        {busy ? "Guardando…" : "Arrastra, elige o pega una imagen"}
      </p>
      <p className="text-[10px] text-muted-foreground">
        {acceptHint} · máx. {formatBytes(maxBytes)} c/u · Ctrl+V / ⌘V
      </p>
      {onPasteFromClipboard && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-1 h-7 gap-1.5"
          disabled={disabled || busy || pasteBusy}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onPasteFromClipboard();
          }}
        >
          <ClipboardPaste className="size-3.5" />
          {pasteBusy ? "Pegando…" : "Pegar del portapapeles"}
        </Button>
      )}
    </div>
  );
}
