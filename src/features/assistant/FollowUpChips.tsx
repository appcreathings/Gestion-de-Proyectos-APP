import { useMemo } from "react";
import { selectFollowUps, type QuickAction } from "@/ai/chat/quickActions";
import type { UiContext } from "@/ai/chat/uiContext";
import { QuickActionChips } from "./QuickActionChips";

interface Props {
  ctx: UiContext;
  lastUserText: string;
  disabled?: boolean;
  onPick: (a: QuickAction) => void;
}

/**
 * Follow-ups post-respuesta (spec 050 HU-04). Plantillas client-side (D10).
 * Se muestra solo bajo el último mensaje del asistente cuando status === "idle".
 */
export function FollowUpChips({ ctx, lastUserText, disabled, onPick }: Props) {
  const actions = useMemo(
    () => selectFollowUps(ctx, lastUserText),
    [ctx, lastUserText],
  );
  if (actions.length === 0) return null;
  return (
    <QuickActionChips
      actions={actions}
      disabled={disabled}
      onPick={onPick}
      dense
      subtle
      className="mt-2"
    />
  );
}
