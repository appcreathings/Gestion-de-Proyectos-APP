import { useCallback, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { Paperclip, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/formatBytes";

interface Props {
  disabled?: boolean;
  busy?: boolean;
  maxBytes: number;
  acceptHint?: string;
  onFiles: (files: File[]) => void;
}

export function AttachmentDropZone({
  disabled,
  busy,
  maxBytes,
  acceptHint = "PDF, imágenes, docs, audio, video o zip",
  onFiles,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const pick = useCallback(() => {
    if (disabled || busy) return;
    inputRef.current?.click();
  }, [disabled, busy]);

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
      onClick={pick}
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
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        disabled={disabled || busy}
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
        {busy ? "Guardando…" : "Arrastra archivos aquí o elige…"}
      </p>
      <p className="text-[10px] text-muted-foreground">
        {acceptHint} · máx. {formatBytes(maxBytes)} c/u
      </p>
    </div>
  );
}
