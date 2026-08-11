import { useCallback, useId, useRef, useState } from "react";
import { Bold, Code, Italic, Link2, List, ListOrdered, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/Markdown";
import { normalizeTaskLinkUrl } from "@/lib/taskLinks";
import { cn } from "@/lib/utils";
import {
  insertLink,
  prefixLines,
  wrapSelection,
  type EditResult,
  type TextSelection,
} from "@/lib/markdownEdit";

export interface RichTextFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  /** Clases aplicadas al contenedor (toolbar + cuerpo). */
  className?: string;
  /** Clases aplicadas al textarea (altura mínima, fuente…). */
  textareaClassName?: string;
  disabled?: boolean;
  /** Muestra el toggle Editar | Ver (default: true). */
  showPreviewToggle?: boolean;
  /** Densidad de la toolbar y altura mínima por defecto. */
  size?: "sm" | "md";
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

type Mode = "edit" | "preview";

/**
 * Editor Markdown drop-in para descripciones largas (spec 044 + 045).
 *
 * - Toolbar con Negrita / Cursiva / Listas / Enlace / Código inline.
 * - Atajos Mod+B (negrita), Mod+I (cursiva), Mod+E (código).
 * - Estado inicial: Ver si hay contenido, Editar si está vacío.
 * - En Ver: solo botón de lápiz; en Editar: toolbar completa + pestañas.
 * - Enlaces normalizados con `normalizeTaskLinkUrl` (protocolo + validación).
 *
 * El valor almacenado es siempre **string Markdown**. El `onBlur` del padre
 * se invoca además al pasar a preview para no perder el persist del drawer.
 *
 * Si el padre reutiliza la instancia al cambiar de entidad (p. ej. drawer de
 * tarea), pasar `key={entityId}` para resetear modo edit/preview.
 */
export function RichTextField({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  className,
  textareaClassName,
  disabled,
  showPreviewToggle = true,
  size = "md",
  ...rest
}: RichTextFieldProps) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const reactId = useId();
  const linkInputId = `${id ?? reactId}-link-url`;
  const linkErrorId = `${id ?? reactId}-link-error`;
  // Spec 045 D4/D5: Ver si hay contenido y el toggle está activo; si no, Editar.
  const [mode, setMode] = useState<Mode>(() =>
    showPreviewToggle && value.trim().length > 0 ? "preview" : "edit",
  );
  // Los 7 callers hidratan `value` en useEffect (montan con ""). Si el valor
  // llega después sin que el usuario haya tocado el campo, promover a Ver
  // durante el render (patrón getDerivedStateFromProps — no useEffect).
  const [modeTouched, setModeTouched] = useState(false);
  let effectiveMode: Mode = mode;
  if (
    showPreviewToggle &&
    !modeTouched &&
    mode === "edit" &&
    value.trim().length > 0
  ) {
    setMode("preview");
    effectiveMode = "preview";
  }
  // Snapshot de la selección tomada en `mousedown` de los botones de formato
  // (que con `preventDefault` no roban el foco del textarea).
  const selRef = useRef<TextSelection>({ start: 0, end: 0 });

  // Snapshot del caret para el popover de enlace (que SÍ roba el foco).
  const linkSelRef = useRef<TextSelection>({ start: 0, end: 0 });
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const readSelection = useCallback((): TextSelection => {
    const el = taRef.current;
    if (!el) return selRef.current;
    return { start: el.selectionStart ?? 0, end: el.selectionEnd ?? 0 };
  }, []);

  const apply = useCallback(
    (edit: EditResult) => {
      selRef.current = edit.selection;
      setModeTouched(true);
      onChange(edit.value);
      // El textarea controlado aún no refleja el nuevo valor en este frame;
      // esperar al próximo paint para reposicionar el caret.
      requestAnimationFrame(() => {
        const el = taRef.current;
        if (!el) return;
        el.focus();
        el.setSelectionRange(edit.selection.start, edit.selection.end);
      });
    },
    [onChange],
  );

  const handleBold = () => apply(wrapSelection(value, readSelection(), "**", "**"));
  const handleItalic = () => apply(wrapSelection(value, readSelection(), "*", "*"));
  const handleCode = () => apply(wrapSelection(value, readSelection(), "`", "`"));
  const handleUl = () => apply(prefixLines(value, readSelection(), "ul"));
  const handleOl = () => apply(prefixLines(value, readSelection(), "ol"));

  function closeLinkPopover() {
    setLinkOpen(false);
    setLinkUrl("");
    setLinkError(null);
  }

  function applyLink() {
    const result = normalizeTaskLinkUrl(linkUrl);
    if (!result.ok) {
      setLinkError(result.error);
      return;
    }
    apply(insertLink(value, linkSelRef.current, result.url));
    closeLinkPopover();
  }

  function handleLinkOpenChange(open: boolean) {
    setLinkOpen(open);
    if (!open) {
      setLinkUrl("");
      setLinkError(null);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod || e.altKey) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      handleBold();
    } else if (key === "i") {
      e.preventDefault();
      handleItalic();
    } else if (key === "e") {
      e.preventDefault();
      handleCode();
    }
  }

  function switchMode(next: Mode) {
    if (next === effectiveMode) return;
    setModeTouched(true);
    // El drawer persiste en `onBlur` del textarea; al cambiar a preview el
    // textarea se desmonta y el blur nativo podría no alcanzar al padre.
    if (next === "preview") onBlur?.();
    setMode(next);
  }

  function handleValueChange(next: string) {
    setModeTouched(true);
    onChange(next);
  }

  const minH =
    size === "sm" ? "min-h-[80px]" : "min-h-[120px]";

  // Los botones de formato solo existen en la rama edit (spec 045 B4).
  const formatDisabled = disabled;

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border border-input bg-background overflow-hidden",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      aria-disabled={disabled || undefined}
    >
      {effectiveMode === "edit" ? (
        <div
          role="toolbar"
          aria-label="Formato de texto"
          className={cn(
            "flex flex-wrap items-center gap-0.5 border-b border-border/60 bg-muted/30",
            size === "sm" ? "px-1 py-0.5" : "px-1 py-1",
          )}
        >
          <ToolButton label="Negrita (Ctrl+B)" onClick={handleBold} disabled={formatDisabled} onMouseDown={preserveFocus}>
            <Bold className="size-4" />
          </ToolButton>
          <ToolButton label="Cursiva (Ctrl+I)" onClick={handleItalic} disabled={formatDisabled} onMouseDown={preserveFocus}>
            <Italic className="size-4" />
          </ToolButton>
          <ToolButton label="Lista con viñetas" onClick={handleUl} disabled={formatDisabled} onMouseDown={preserveFocus}>
            <List className="size-4" />
          </ToolButton>
          <ToolButton label="Lista numerada" onClick={handleOl} disabled={formatDisabled} onMouseDown={preserveFocus}>
            <ListOrdered className="size-4" />
          </ToolButton>
          <ToolButton label="Código inline (Ctrl+E)" onClick={handleCode} disabled={formatDisabled} onMouseDown={preserveFocus}>
            <Code className="size-4" />
          </ToolButton>

          <Popover open={linkOpen} onOpenChange={handleLinkOpenChange}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8"
                title="Enlace"
                aria-label="Insertar enlace"
                disabled={formatDisabled}
                onMouseDown={(e) => {
                  e.preventDefault();
                  linkSelRef.current = readSelection();
                }}
              >
                <Link2 className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-2">
              <div className="grid gap-1.5">
                <label htmlFor={linkInputId} className="text-xs font-medium text-muted-foreground">
                  URL del enlace
                </label>
                <Input
                  id={linkInputId}
                  type="url"
                  autoFocus
                  autoComplete="off"
                  placeholder="https://…"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    if (linkError) setLinkError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyLink();
                    }
                    if (e.key === "Escape") {
                      e.preventDefault();
                      e.stopPropagation();
                      closeLinkPopover();
                    }
                  }}
                  aria-invalid={linkError ? true : undefined}
                  aria-describedby={linkError ? linkErrorId : undefined}
                  className="h-8 text-sm"
                />
                {linkError && (
                  <p id={linkErrorId} role="alert" className="text-xs text-destructive">
                    {linkError}
                  </p>
                )}
                <Button
                  type="button"
                  size="sm"
                  className="h-8 justify-center"
                  disabled={!linkUrl.trim()}
                  onClick={applyLink}
                >
                  Insertar
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {showPreviewToggle && (
            <div
              className="ml-auto flex items-center gap-0.5 rounded-md bg-background p-0.5"
              role="tablist"
              aria-label="Modo de edición"
            >
              <ModeButton active onClick={() => switchMode("edit")}>
                Editar
              </ModeButton>
              <ModeButton active={false} onClick={() => switchMode("preview")}>
                Ver
              </ModeButton>
            </div>
          )}
        </div>
      ) : (
        showPreviewToggle && (
          <div className="flex items-center justify-end border-b border-border/60 bg-muted/30 px-1 py-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8"
              title="Editar descripción"
              aria-label="Editar descripción"
              disabled={disabled}
              onClick={() => switchMode("edit")}
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        )
      )}

      {effectiveMode === "edit" ? (
        <Textarea
          id={id}
          ref={taRef}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => handleValueChange(e.target.value)}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          aria-multiline
          className={cn(
            "resize-y rounded-none border-0 bg-transparent px-3 py-2 text-sm shadow-none",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            minH,
            textareaClassName,
          )}
          {...rest}
        />
      ) : (
        <div
          id={id}
          tabIndex={-1}
          className={cn(
            "overflow-auto px-3 py-2 text-sm outline-none",
            minH,
            textareaClassName,
          )}
          aria-label="Vista previa"
        >
          <Markdown>{value}</Markdown>
        </div>
      )}
    </div>
  );
}

function preserveFocus(e: React.MouseEvent) {
  // Los botones de formato no deben robar la selección del textarea.
  e.preventDefault();
}

function ToolButton({
  label,
  onClick,
  disabled,
  onMouseDown,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-8"
      title={label}
      aria-label={label}
      disabled={disabled}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded px-2 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
