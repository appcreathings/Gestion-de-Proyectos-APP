import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { cn } from "@/lib/utils";
import type { ChatMessage, ChatStatus } from "@/store/useChatStore";
import { ToolCallChip } from "./ToolCallChip";
import { WriteConfirmCard } from "./WriteConfirmCard";

interface Props {
  message: ChatMessage;
  /** Si es el último mensaje del asistente (para mostrar Regenerar). */
  isLastAssistant?: boolean;
  status?: ChatStatus;
  onRegenerate?: () => void;
}

export function ChatMessageBubble({ message, isLastAssistant, status, onRegenerate }: Props) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  if (isUser) {
    const text = message.parts
      .map((p) => (p.kind === "text" ? p.text : ""))
      .join("");
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
          {text}
        </div>
      </div>
    );
  }

  // D13: solo partes text del asistente.
  const plainText = message.parts
    .filter((p) => p.kind === "text")
    .map((p) => (p.kind === "text" ? p.text : ""))
    .join("")
    .trim();
  const hasText = plainText.length > 0;

  const canRegenerate =
    isLastAssistant && hasText && status === "idle" && onRegenerate;

  async function handleCopy() {
    if (!plainText) return;
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // best-effort: portapapeles no disponible (permisos, iframe).
    }
  }

  return (
    <div className="group relative max-w-full">
      <div className={cn(message.parts.length === 0 && "animate-pulse")}>
        {message.parts.length === 0 && (
          <p className="text-sm text-muted-foreground">Pensando…</p>
        )}
        {message.parts.map((part, i) => {
          switch (part.kind) {
            case "text":
              return <Markdown key={i}>{part.text}</Markdown>;
            case "toolCall":
              return <ToolCallChip key={part.id} part={part} />;
            case "pendingWrite":
              return <WriteConfirmCard key={part.id} part={part} />;
          }
        })}
      </div>

      {(hasText || canRegenerate) && (
        <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          {hasText && (
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copiado" : "Copiar respuesta"}
              title={copied ? "Copiado" : "Copiar respuesta"}
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="size-3" />
                  <span aria-live="polite">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          )}
          {canRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              aria-label="Regenerar respuesta"
              title="Regenerar respuesta"
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <RefreshCw className="size-3" />
              <span>Regenerar</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
