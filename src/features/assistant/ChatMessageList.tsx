import { useEffect, useMemo, useRef } from "react";
import type { ChatMessage, ChatStatus } from "@/store/useChatStore";
import type { QuickAction } from "@/ai/chat/quickActions";
import type { UiContext } from "@/ai/chat/uiContext";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { FollowUpChips } from "./FollowUpChips";

interface Props {
  messages: ChatMessage[];
  status: ChatStatus;
  ctx: UiContext;
  onPickFollowUp: (a: QuickAction) => void;
  onRegenerate: () => void;
}

export function ChatMessageList({
  messages,
  status,
  ctx,
  onPickFollowUp,
  onRegenerate,
}: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  // Follow the stream: scroll to bottom whenever content changes.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // Último asistente + último user text (para follow-ups). Solo cuando idle.
  const lastAssistantId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return messages[i].id;
    }
    return null;
  }, [messages]);

  const lastUserText = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m.role === "user") {
        return m.parts
          .map((p) => (p.kind === "text" ? p.text : ""))
          .join("")
          .trim();
      }
    }
    return "";
  }, [messages]);

  const showFollowUps = status === "idle" && lastAssistantId !== null;

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Conversación con el asistente"
      className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
    >
      {messages.map((m) => (
        <div key={m.id} className="space-y-1.5">
          <ChatMessageBubble
            message={m}
            isLastAssistant={m.id === lastAssistantId}
            status={status}
            onRegenerate={onRegenerate}
          />
          {showFollowUps && m.id === lastAssistantId && (
            <FollowUpChips
              ctx={ctx}
              lastUserText={lastUserText}
              disabled={status !== "idle"}
              onPick={onPickFollowUp}
            />
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
