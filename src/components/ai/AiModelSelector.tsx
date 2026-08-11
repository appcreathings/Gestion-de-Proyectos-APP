import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAiConfigStore } from "@/store/useAiConfigStore";
import { activeProviderId } from "@/ai/config";
import { getModelsByProvider, getModelDef, qualify, splitQualified } from "@/ai/models";
import { getProviderDef } from "@/ai/providers/catalog";
import { rateLimiter } from "@/ai/rateLimiter";
import { ROUTES } from "@/routes/paths";

export interface AiModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  compact?: boolean;
  showAvailability?: boolean;
  disabled?: boolean;
}

export function AiModelSelector({
  value,
  onChange,
  compact = false,
  showAvailability = true,
  disabled = false,
}: AiModelSelectorProps) {
  const config = useAiConfigStore((s) => s.config);
  const setModel = useAiConfigStore((s) => s.setModel);
  const [open, setOpen] = useState(false);
  const setModelRef = useRef(setModel);
  setModelRef.current = setModel;

  const providerId = activeProviderId(config);
  const def = getProviderDef(providerId);
  const groupModels = getModelsByProvider(providerId).filter((m) => m.category !== "embedding");
  const selectedDef = getModelDef(value);
  const needsCustom = def.browserBlocked || groupModels.length === 0;
  const [customDraft, setCustomDraft] = useState(() => splitQualified(value).modelId);

  const handleSelect = (modelId: string) => {
    setModelRef.current(modelId);
    onChange(modelId);
    setOpen(false);
  };

  const handleCustom = () => {
    const id = customDraft.trim();
    if (!id) return;
    const q = qualify(providerId, id);
    handleSelect(q);
  };

  const handleGoToSettings = () => {
    setOpen(false);
    window.location.href = ROUTES.settings("ia");
  };

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      // Force re-render to update rate limit indicators
    }, 5000);
    return () => clearInterval(interval);
  }, [open]);

  const list = (
    <div className="space-y-0.5">
      {groupModels.map((model) => {
        const status = rateLimiter.getStatus(model.id);
        const isSelected = value === model.id;
        const isAvailable = rateLimiter.canMakeRequest(model.id);

        return (
          <button
            type="button"
            key={model.id}
            onClick={() => handleSelect(model.id)}
            className={`flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent ${
              isSelected ? "bg-accent" : ""
            }`}
          >
            <span className="flex items-center gap-2">
              {isSelected && <Check className="size-3 text-primary" />}
              <span className={!isSelected ? "ml-5" : ""}>{model.label}</span>
            </span>
            {showAvailability && (
              <span
                className={`text-xs ${
                  isAvailable
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {model.limitsUnknown
                  ? "—"
                  : status.rpmLimit > 0
                    ? `${status.rpmUsed}/${status.rpmLimit}`
                    : "—"}
              </span>
            )}
          </button>
        );
      })}
      {needsCustom && (
        <div className="space-y-1 border-t px-2 py-2">
          <p className="text-xs text-muted-foreground">Id de modelo personalizado</p>
          <div className="flex gap-1">
            <Input
              value={customDraft}
              onChange={(e) => setCustomDraft(e.target.value)}
              placeholder="model-id"
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCustom();
                }
              }}
            />
            <Button type="button" size="sm" variant="secondary" onClick={handleCustom}>
              OK
            </Button>
          </div>
        </div>
      )}
      <div className="my-1 border-t" />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={handleGoToSettings}
        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent"
      >
        <Settings className="size-3" />
        Ir a configuración...
      </button>
    </div>
  );

  if (compact) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            className="px-2"
            aria-label="Cambiar modelo"
          >
            <ChevronDown className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-64 p-1"
          onClick={(e) => e.stopPropagation()}
          onInteractOutside={(e) => e.preventDefault()}
          style={{ pointerEvents: "auto" }}
        >
          {list}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          className="justify-between"
        >
          <span>{selectedDef?.label ?? splitQualified(value).modelId ?? value}</span>
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-80 p-1"
        onClick={(e) => e.stopPropagation()}
        onInteractOutside={(e) => e.preventDefault()}
        style={{ pointerEvents: "auto" }}
      >
        {list}
      </PopoverContent>
    </Popover>
  );
}
