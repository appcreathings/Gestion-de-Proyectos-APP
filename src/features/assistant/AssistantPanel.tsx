import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle, BarChart3, MessageSquarePlus, RefreshCw, Settings, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AI_ERROR_MESSAGES } from "@/ai/gemini/errors";
import { rateLimiter } from "@/ai/rateLimiter";
import { getModelDef } from "@/ai/models";
import { getProviderDef } from "@/ai/providers/catalog";
import { cn } from "@/lib/utils";
import { activeKey, activeProviderId } from "@/ai/config";
import { useAiConfigStore } from "@/store/useAiConfigStore";
import {
  useChatStore,
  ASSISTANT_PANEL_MIN_WIDTH,
  ASSISTANT_PANEL_MAX_WIDTH,
} from "@/store/useChatStore";
import { selectQuickActions, type QuickAction } from "@/ai/chat/quickActions";
import { summarizeUiContext } from "@/ai/chat/uiContext";
import { AssistantEmptyState } from "./AssistantEmptyState";
import { ChatInput } from "./ChatInput";
import { ChatMessageList } from "./ChatMessageList";
import { QuickActionChips } from "./QuickActionChips";
import { RateLimitStatus } from "./RateLimitStatus";
import { ROUTES } from "@/routes/paths";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useChatUiContext } from "./useChatUiContext";

/** Leave this much main content visible while dragging the chat edge. */
const RESIZE_MAIN_GUTTER = 280;

export function AssistantPanel() {
  const navigate = useNavigate();
  const open = useChatStore((s) => s.open);
  const toggleOpen = useChatStore((s) => s.toggleOpen);
  const panelWidth = useChatStore((s) => s.panelWidth);
  const setPanelWidth = useChatStore((s) => s.setPanelWidth);
  const messages = useChatStore((s) => s.messages);
  const status = useChatStore((s) => s.status);
  const error = useChatStore((s) => s.error);
  const errorDetail = useChatStore((s) => s.errorDetail);
  const send = useChatStore((s) => s.send);
  const stop = useChatStore((s) => s.stop);
  const newConversation = useChatStore((s) => s.newConversation);
  const hydrated = useChatStore((s) => s.hydrated);
  const hydrateFromIdb = useChatStore((s) => s.hydrateFromIdb);

  const config = useAiConfigStore((s) => s.config);
  const hasKey = Boolean(activeKey(config));
  const providerLabel = getProviderDef(activeProviderId(config)).label;

  // Contexto de pantalla (spec 050 HU-01): se resuelve en runtime desde la URL
  // + stores; además sincronizamos el snapshot en el chatStore para que send()
  // pueda reproducirlo aunque el usuario ya no esté mirando este componente.
  const ctx = useChatUiContext();
  const location = useLocation();
  const setChatRouteSnapshot = useChatStore((s) => s.setChatRouteSnapshot);
  const regenerateLast = useChatStore((s) => s.regenerateLast);
  useEffect(() => {
    setChatRouteSnapshot({ pathname: location.pathname, search: location.search });
  }, [location.pathname, location.search, setChatRouteSnapshot]);

  const headerCtx = useMemo(() => summarizeUiContext(ctx), [ctx]);
  const composerActions = useMemo(
    () => selectQuickActions(ctx, "composer"),
    [ctx],
  );

  const pickAction = (a: QuickAction) => void send(a.prompt, { skipRag: a.skipRag });

  const panelRef = useRef<HTMLElement>(null);
  const isResizingRef = useRef(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showRateLimit, setShowRateLimit] = useState(false);
  const isDesktop = useBreakpoint("lg");

  useEffect(() => {
    if (!hydrated) void hydrateFromIdb();
  }, [hydrated, hydrateFromIdb]);

  useEffect(() => {
    if (open) {
      panelRef.current
        ?.querySelector<HTMLElement>("textarea, button, a")
        ?.focus();
    }
  }, [open]);

  // Horizontal resize (desktop only) — drag left edge; width lives in useChatStore.
  useEffect(() => {
    if (!isDesktop) return;

    const clampToViewport = (raw: number) => {
      const maxForViewport = Math.max(
        ASSISTANT_PANEL_MIN_WIDTH,
        window.innerWidth - RESIZE_MAIN_GUTTER,
      );
      const max = Math.min(ASSISTANT_PANEL_MAX_WIDTH, maxForViewport);
      return Math.min(max, Math.max(ASSISTANT_PANEL_MIN_WIDTH, raw));
    };

    const onMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      setPanelWidth(clampToViewport(window.innerWidth - e.clientX), { persist: false });
    };

    const onUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      // Persist the final width once (avoid localStorage writes per mousemove).
      setPanelWidth(useChatStore.getState().panelWidth);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isDesktop, setPanelWidth]);

  // Re-clamp when the window shrinks so the panel never covers everything.
  useEffect(() => {
    if (!isDesktop) return;
    const onResize = () => {
      const maxForViewport = Math.max(
        ASSISTANT_PANEL_MIN_WIDTH,
        window.innerWidth - RESIZE_MAIN_GUTTER,
      );
      const max = Math.min(ASSISTANT_PANEL_MAX_WIDTH, maxForViewport);
      if (panelWidth > max) setPanelWidth(max);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, [isDesktop, panelWidth, setPanelWidth]);

  if (!open) return null;

  const streaming = status === "streaming" || status === "awaiting-confirmation";

  const activeDef = getModelDef(config.model);
  const canUsePreferred = hasKey ? rateLimiter.canMakeRequest(config.model) : false;
  const isOnFallback = hasKey && config.autoFallback && !canUsePreferred;

  const isExhausted = hasKey && !canUsePreferred;
  const modelBadgeVariant = !hasKey
    ? "outline"
    : isOnFallback
      ? "warning"
      : isExhausted
        ? "destructive"
        : "success";

  return (
    <>
      {!isDesktop && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => toggleOpen(false)}
        />
      )}
      <aside
        ref={panelRef}
        aria-label="Asistente IA"
        className={cn(
          "relative flex flex-col overflow-hidden",
          isDesktop
            ? "z-50 shrink-0 border-l bg-card"
            : "fixed inset-0 z-50 border-0 bg-card",
          isResizing && "select-none",
        )}
        style={isDesktop ? { width: panelWidth } : undefined}
      >
        {isDesktop && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Redimensionar panel del asistente"
            aria-valuenow={panelWidth}
            aria-valuemin={ASSISTANT_PANEL_MIN_WIDTH}
            aria-valuemax={ASSISTANT_PANEL_MAX_WIDTH}
            title="Arrastra para cambiar el ancho"
            className={cn(
              "absolute inset-y-0 left-0 z-10 w-1.5 -translate-x-1/2 cursor-col-resize touch-none",
              "bg-transparent transition-colors hover:bg-primary/40",
              isResizing && "bg-primary/50",
            )}
            onMouseDown={(e) => {
              e.preventDefault();
              isResizingRef.current = true;
              setIsResizing(true);
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Sparkles className="size-4 text-primary" />
        <h2 className="text-sm font-semibold">Asistente</h2>
        {(headerCtx.primary || headerCtx.secondary) && (
          <div className="flex min-w-0 items-center gap-1">
            {headerCtx.primary && (
              <Badge variant="outline" className="text-[10px] gap-1 shrink-0">
                {headerCtx.primary}
              </Badge>
            )}
            {headerCtx.secondary && (
              <Badge
                variant="outline"
                className="max-w-[140px] truncate text-[10px] font-normal text-muted-foreground"
                title={headerCtx.secondary}
              >
                {headerCtx.secondary}
              </Badge>
            )}
          </div>
        )}
        {hasKey && (
          <Badge variant={modelBadgeVariant} className="ml-auto font-mono text-[10px] gap-1">
            {config.model.includes(":") ? config.model.split(":").slice(1).join(":") : config.model}
            {isOnFallback && <AlertTriangle className="size-3" />}
          </Badge>
        )}
        <div className={cn("flex items-center gap-0.5", hasKey ? "" : "ml-auto")}>
          {hasKey && (
            <Button
              variant="ghost"
              size="icon"
              title="Estado de límites"
              aria-label="Estado de límites"
              onClick={() => setShowRateLimit((v) => !v)}
              className={showRateLimit ? "bg-accent" : ""}
            >
              <BarChart3 className="size-4" />
            </Button>
          )}
          {messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon"
              title="Nueva conversación"
              aria-label="Nueva conversación"
              onClick={() => newConversation()}
            >
              <MessageSquarePlus className="size-4" />
            </Button>
          )}
          <button
            onClick={() => {
              toggleOpen(false);
              navigate(ROUTES.settings("ia"));
            }}
            title="Ajustes del asistente"
            aria-label="Ajustes del asistente"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Settings className="size-4" />
          </button>
          <Button
            variant="ghost"
            size="icon"
            title="Cerrar (Ctrl+J)"
            aria-label="Cerrar asistente"
            onClick={() => toggleOpen(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      </header>

      {showRateLimit && hasKey && (
        <div className="border-b px-3 py-2">
          <RateLimitStatus />
        </div>
      )}

      {messages.length === 0 ? (
        <AssistantEmptyState
          hasKey={hasKey}
          providerLabel={providerLabel}
          ctx={ctx}
          onSuggestion={pickAction}
        />
      ) : (
        <ChatMessageList
          messages={messages}
          status={status}
          ctx={ctx}
          onPickFollowUp={pickAction}
          onRegenerate={() => void regenerateLast()}
        />
      )}

      {error && (
        <div
          role="alert"
          className="mx-3 mb-2 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs"
        >
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
          <div className="grid gap-0.5">
            <span>{AI_ERROR_MESSAGES[error]}</span>
            {error === "rate-limit" && config.autoFallback && (
              <span className="text-muted-foreground">
                Fallback automático activado. El sistema intentó cambiar a otro modelo disponible.
                {activeDef && ` Grupo actual: ${config.fallbackGroup}.`}
              </span>
            )}
            {error === "all-models-exhausted" && (
              <span className="text-muted-foreground">
                Todos los modelos del grupo {config.fallbackGroup} están sin cuota.
                Espera un momento o cambia el grupo de fallback en Ajustes.
              </span>
            )}
            {errorDetail && (
              <details className="mt-1 text-muted-foreground">
                <summary className="cursor-pointer text-[11px] underline-offset-2 hover:underline">
                  Ver detalle técnico
                </summary>
                <pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded bg-muted/60 p-2 text-[10px]">
                  {errorDetail}
                </pre>
              </details>
            )}
            <button
              type="button"
              onClick={() => void regenerateLast()}
              className="mt-1 inline-flex w-fit items-center gap-1 rounded-md border border-destructive/40 bg-background/60 px-2 py-1 text-[11px] font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <RefreshCw className="size-3" />
              Reintentar
            </button>
          </div>
        </div>
      )}

      {messages.length > 0 && hasKey && composerActions.length > 0 && (
        <div className="border-t px-3 pt-2">
          <QuickActionChips
            actions={composerActions}
            disabled={streaming}
            onPick={pickAction}
            dense
          />
        </div>
      )}

      <ChatInput
        disabled={!hasKey}
        streaming={streaming}
        onSend={(t) => void send(t)}
        onStop={stop}
      />
    </aside>
    </>
  );
}
