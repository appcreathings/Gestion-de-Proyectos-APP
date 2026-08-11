import { Check, CheckCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChatStore, type ChatPart } from "@/store/useChatStore";

type PendingWritePart = Extract<ChatPart, { kind: "pendingWrite" }>;

/** Compact inline approval for a write the assistant wants to execute. */
export function WriteConfirmCard({ part }: { part: PendingWritePart }) {
  const approve = useChatStore((s) => s.approvePendingWrite);
  const approveAll = useChatStore((s) => s.approveAll);

  return (
    <div
      role="alertdialog"
      aria-label="Confirmar acción del asistente"
      className="my-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border border-warning/40 bg-warning/10 px-2 py-1.5"
    >
      <p className="min-w-0 flex-1 truncate text-xs leading-snug" title={part.description}>
        <span className="font-medium text-foreground">{part.description}</span>
        <span className="ml-1.5 font-mono text-[10px] text-muted-foreground">
          {part.name}
        </span>
      </p>
      <div className="ml-auto flex shrink-0 items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-foreground"
          onClick={() => approve(part.id, false)}
        >
          <X className="size-3" />
          Cancelar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-1.5 text-[11px]"
          title="Aprueba esta acción y las siguientes de esta misma respuesta, sin volver a preguntar. En tu próximo mensaje se vuelve a pedir confirmación."
          onClick={() => approveAll(part.id)}
        >
          <CheckCheck className="size-3" />
          Todo
        </Button>
        <Button
          size="sm"
          className="h-6 px-2 text-[11px]"
          autoFocus
          onClick={() => approve(part.id, true)}
        >
          <Check className="size-3" />
          Confirmar
        </Button>
      </div>
    </div>
  );
}
