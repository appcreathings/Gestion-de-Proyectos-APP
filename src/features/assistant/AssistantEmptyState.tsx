import { useNavigate } from "react-router-dom";
import { KeyRound, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/paths";
import { useChatStore } from "@/store/useChatStore";

const SUGGESTIONS = [
  "¿Qué proyectos están estancados o en riesgo?",
  "Dame el resumen del día: vencidos y por vencer",
  "¿Qué tareas tengo bloqueadas?",
  "Crea una tarea urgente en un proyecto",
];

interface Props {
  hasKey: boolean;
  /** Label del proveedor activo (CA-01.6 / spec 049 F6). */
  providerLabel?: string;
  onSuggestion: (text: string) => void;
}

export function AssistantEmptyState({ hasKey, providerLabel, onSuggestion }: Props) {
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
      <div className="grid w-full gap-1">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="rounded-lg border px-2.5 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
