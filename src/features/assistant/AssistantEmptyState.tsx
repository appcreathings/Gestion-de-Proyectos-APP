import { useNavigate } from "react-router-dom";
import { KeyRound, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/paths";
import { useChatStore } from "@/store/useChatStore";
import { selectQuickActions, type QuickAction } from "@/ai/chat/quickActions";
import type { UiContext } from "@/ai/chat/uiContext";
import { QuickActionChips } from "./QuickActionChips";

interface Props {
  hasKey: boolean;
  /** Label del proveedor activo (CA-01.6 / spec 049 F6). */
  providerLabel?: string;
  /** Contexto de pantalla actual (spec 050 HU-02). */
  ctx: UiContext;
  onSuggestion: (action: QuickAction) => void;
}

export function AssistantEmptyState({ hasKey, providerLabel, ctx, onSuggestion }: Props) {
  const navigate = useNavigate();
  const toggleOpen = useChatStore((s) => s.toggleOpen);

  if (!hasKey) {
    const providerName = providerLabel?.trim() || "el proveedor activo";
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="size-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Configura tu API key</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Configurá tu API key de {providerName} en Ajustes. La clave se guarda solo en
            este dispositivo y nunca viaja con tus datos exportados.
          </p>
        </div>
        <button
          onClick={() => {
            toggleOpen(false);
            navigate(ROUTES.settings("ia"));
          }}
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Ir a Ajustes → Asistente IA
        </button>
      </div>
    );
  }

  const actions = selectQuickActions(ctx, "empty");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="size-5 text-primary" />
      </div>
      <div className="text-center">
        <h3 className="text-sm font-semibold">Tu copiloto de PM</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Pregunta por tu portafolio o pide acciones: crear tareas, marcar ítems,
          cambiar estados… Las escrituras se confirman contigo.
        </p>
      </div>
      <QuickActionChips actions={actions} onPick={onSuggestion} />
    </div>
  );
}
