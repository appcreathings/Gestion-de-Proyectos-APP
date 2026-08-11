import { useMemo, useRef, useState } from "react";
import { Send, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { listSlashCommands, parseSlashInput } from "@/ai/chat/slashCommands";

interface Props {
  disabled: boolean;
  streaming: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
}

export function ChatInput({ disabled, streaming, onSend, onStop }: Props) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashIndex, setSlashIndex] = useState(0);

  const parsed = useMemo(() => parseSlashInput(text), [text]);
  // Mostrar el menú solo mientras se escribe un comando (sin espacios todavía)
  // y el texto empieza con "/". CA-03.1.
  const showMenu =
    text.startsWith("/") &&
    !text.includes(" ") &&
    parsed.kind === "command" &&
    slashOpen;

  const filtered = useMemo(() => {
    if (!showMenu) return [];
    const q = parsed.kind === "command" ? parsed.name.toLowerCase() : "";
    const all = listSlashCommands();
    return all.filter((c) => c.name.toLowerCase().includes(q));
  }, [showMenu, parsed]);

  function submit() {
    const t = text.trim();
    if (!t || disabled || streaming) return;
    onSend(t);
    setText("");
    setSlashOpen(false);
    if (ref.current) ref.current.style.height = "auto";
  }

  function pickCommand(name: string) {
    setText(`/${name} `);
    setSlashOpen(false);
    ref.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (showMenu && filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSlashIndex((i) => (i + 1) % filtered.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSlashIndex((i) => (i - 1 + filtered.length) % filtered.length);
        return;
      }
      if (e.key === "Tab" || (e.key === "Enter" && !e.shiftKey)) {
        e.preventDefault();
        pickCommand(filtered[slashIndex].name);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setSlashOpen(false);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t p-3">
      <div className="relative flex items-end gap-2">
        {showMenu && filtered.length > 0 && (
          <div
            role="listbox"
            aria-label="Comandos slash"
            className="absolute bottom-full left-0 z-20 mb-1 w-64 overflow-hidden rounded-lg border bg-popover shadow-lg"
          >
            {filtered.map((c, i) => (
              <button
                key={c.name}
                type="button"
                role="option"
                aria-selected={i === slashIndex}
                onMouseEnter={() => setSlashIndex(i)}
                onClick={() => pickCommand(c.name)}
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 px-2.5 py-1.5 text-left transition-colors",
                  i === slashIndex ? "bg-accent" : "hover:bg-accent/50",
                )}
              >
                <span className="font-mono text-xs">/{c.name}</span>
                <span className="text-[11px] text-muted-foreground">{c.description}</span>
              </button>
            ))}
          </div>
        )}
        <textarea
          ref={ref}
          value={text}
          disabled={disabled}
          rows={1}
          placeholder="Pregunta o pide una acción… (Enter envía · / para comandos)"
          aria-label="Mensaje para el asistente"
          className="max-h-40 flex-1 resize-none rounded-lg border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          onChange={(e) => {
            setText(e.target.value);
            // Reabrir el menú mientras el usuario sigue escribiendo un comando.
            setSlashOpen(e.target.value.startsWith("/"));
            setSlashIndex(0);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
          onKeyDown={onKeyDown}
        />
        {streaming ? (
          <Button
            variant="outline"
            size="icon"
            aria-label="Detener respuesta"
            onClick={onStop}
          >
            <Square className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            aria-label="Enviar mensaje"
            disabled={disabled || !text.trim()}
            onClick={submit}
          >
            <Send className="size-4" />
          </Button>
        )}
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground">
        Shift+Enter para salto de línea · <code className="font-mono">/</code> para comandos · El
        asistente puede leer y, con tu confirmación, modificar tus datos.
      </p>
    </div>
  );
}
