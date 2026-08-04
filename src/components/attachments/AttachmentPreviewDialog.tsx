import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Download, ExternalLink, X } from "lucide-react";
import type { Attachment } from "@/domain/schemas/attachment";
import { resolveAttachmentMime } from "@/domain/attachments/mediaBlob";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatBytes } from "@/lib/formatBytes";
import { cn } from "@/lib/utils";

interface Props {
  attachment: Attachment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Object URL o null si aún carga / falló. */
  url: string | null;
  loading?: boolean;
  error?: string | null;
  onDownload: () => void;
}

/**
 * Vista previa en portal propio (NO Radix Dialog).
 *
 * Importante: cuando Anexos vive dentro de un Dialog modal de Radix, el
 * `body` queda con `pointer-events: none` y solo el content del Dialog
 * recupera eventos. Un portal a `document.body` hereda ese bloqueo y el
 * overlay de preview tapa la app **sin poder cerrarse ni usar controles**
 * (video/audio). Por eso la raíz del portal fuerza `pointerEvents: "auto"`.
 */
export function AttachmentPreviewDialog({
  attachment,
  open,
  onOpenChange,
  url,
  loading,
  error,
  onDownload,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Escape cierra solo la preview (capture + stopImmediatePropagation para
  // no cerrar también el Dialog padre de plantilla/área/proceso).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      onOpenChange(false);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, onOpenChange]);

  // Foco al abrir: botón cerrar (evita que el focus trap de Radix deje el
  // teclado “atrapado” en el formulario de detrás sin feedback).
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, [open, attachment?.id]);

  if (!open || !attachment || typeof document === "undefined") return null;

  const kind = attachment.kind;
  const canEmbed =
    kind === "image" ||
    kind === "video" ||
    kind === "audio" ||
    attachment.ext === "pdf" ||
    attachment.mimeType === "application/pdf" ||
    attachment.ext === "txt" ||
    attachment.ext === "md" ||
    attachment.ext === "csv";

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Vista previa de ${attachment.name}`}
      // Crítico bajo Dialog Radix (body { pointer-events: none }).
      style={{ pointerEvents: "auto" }}
      // Cortar burbujeo hacia la sección de anexos (drop zone / file input).
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        role="presentation"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Cerrar vista previa"
        style={{ pointerEvents: "auto" }}
        onClick={() => onOpenChange(false)}
      />
      <div
        ref={panelRef}
        className={cn(
          "relative z-[1] flex max-h-[min(92vh,48rem)] w-full max-w-4xl flex-col overflow-hidden",
          "rounded-xl border border-border bg-background shadow-2xl",
        )}
        style={{ pointerEvents: "auto" }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold leading-snug">{attachment.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(attachment.size)} · {attachment.ext.toUpperCase()}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Cerrar"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
          {loading && (
            <p className="py-12 text-center text-sm text-muted-foreground">Cargando vista previa…</p>
          )}
          {error && !loading && (
            <div className="space-y-3 py-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="size-4" />
                Descargar de todos modos
              </Button>
            </div>
          )}
          {!loading && !error && url && canEmbed && (
            <PreviewBody attachment={attachment} url={url} />
          )}
          {!loading && !error && url && !canEmbed && (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                Este tipo de archivo no se previsualiza en la app. Podés descargarlo o
                abrirlo en una pestaña nueva.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="size-4" />
                  Descargar
                </Button>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "sm" }), "inline-flex gap-2")}
                >
                  <ExternalLink className="size-4" />
                  Abrir en pestaña
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t px-4 py-3 sm:px-5">
          {url && !error && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex gap-2")}
            >
              <ExternalLink className="size-4" />
              Abrir en pestaña
            </a>
          )}
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="size-4" />
            Descargar
          </Button>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function PreviewBody({ attachment, url }: { attachment: Attachment; url: string }) {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    if (!["txt", "md", "csv"].includes(attachment.ext)) {
      setText(null);
      return;
    }
    let cancelled = false;
    void fetch(url)
      .then((r) => r.text())
      .then((t) => {
        if (!cancelled) setText(t.slice(0, 200_000));
      })
      .catch(() => {
        if (!cancelled) setText(null);
      });
    return () => {
      cancelled = true;
    };
  }, [url, attachment.ext]);

  if (attachment.kind === "image") {
    return (
      <div className="flex max-h-[min(65vh,32rem)] items-center justify-center overflow-auto rounded-md bg-muted/30 p-2">
        <img
          src={url}
          alt={attachment.name}
          className="max-h-[min(62vh,30rem)] max-w-full object-contain"
        />
      </div>
    );
  }

  if (attachment.kind === "video") {
    return <VideoPreview attachment={attachment} url={url} />;
  }

  if (attachment.kind === "audio") {
    return <AudioPreview attachment={attachment} url={url} />;
  }

  if (attachment.ext === "pdf" || attachment.mimeType === "application/pdf") {
    return (
      <iframe
        title={attachment.name}
        src={url}
        className="h-[min(65vh,32rem)] w-full rounded-md border border-border bg-background"
      />
    );
  }

  if (text !== null) {
    return (
      <pre className="max-h-[min(65vh,32rem)] overflow-auto rounded-md border border-border bg-muted/20 p-3 text-xs whitespace-pre-wrap">
        {text}
      </pre>
    );
  }

  return (
    <p className="py-8 text-center text-sm text-muted-foreground">Preparando vista previa…</p>
  );
}

/**
 * Video: MIME forzado vía <source type>, altura mínima, error visible.
 * Solo pause al desmontar (no vaciar src en cleanup: en Strict Mode rompía
 * el elemento reutilizado y dejaba la preview en negro sin reproducir).
 */
function VideoPreview({
  attachment,
  url,
}: {
  attachment: Attachment;
  url: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const mime = resolveAttachmentMime(attachment);

  useEffect(() => {
    setMediaError(null);
    const el = ref.current;
    return () => {
      el?.pause();
    };
  }, [url]);

  if (mediaError) {
    return (
      <div className="space-y-3 py-8 text-center">
        <p className="text-sm text-destructive">{mediaError}</p>
        <p className="text-xs text-muted-foreground">
          {attachment.ext === "mov"
            ? "Los .mov (QuickTime) suelen no reproducirse en Chrome/Edge. Probá MP4/WebM o abrí el archivo en otra app."
            : "Podés abrirlo en una pestaña nueva o descargarlo."}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "inline-flex gap-2")}
          >
            <ExternalLink className="size-4" />
            Abrir en pestaña
          </a>
          <a
            href={url}
            download={attachment.name}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex gap-2")}
          >
            <Download className="size-4" />
            Descargar
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <video
        ref={ref}
        key={url}
        controls
        playsInline
        preload="auto"
        className="mx-auto min-h-[12rem] max-h-[min(65vh,32rem)] w-full rounded-md bg-black"
        onError={() =>
          setMediaError(
            "No se pudo reproducir este video en el navegador (formato o códec no soportado).",
          )
        }
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* type explícito: sin él, blob: con type vacío no elige decoder */}
        <source src={url} type={mime} />
        Tu navegador no reproduce este video.
      </video>
    </div>
  );
}

function AudioPreview({
  attachment,
  url,
}: {
  attachment: Attachment;
  url: string;
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const mime = resolveAttachmentMime(attachment);

  useEffect(() => {
    setMediaError(null);
    const el = ref.current;
    return () => {
      el?.pause();
    };
  }, [url]);

  if (mediaError) {
    return (
      <div className="space-y-3 py-8 text-center">
        <p className="text-sm text-destructive">{mediaError}</p>
        <a
          href={url}
          download={attachment.name}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "inline-flex gap-2")}
        >
          <Download className="size-4" />
          Descargar
        </a>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-4 py-8 pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <audio
        ref={ref}
        key={url}
        controls
        preload="auto"
        className="w-full max-w-lg"
        onError={() =>
          setMediaError("No se pudo reproducir este audio en el navegador.")
        }
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <source src={url} type={mime} />
        Tu navegador no reproduce este audio.
      </audio>
    </div>
  );
}
