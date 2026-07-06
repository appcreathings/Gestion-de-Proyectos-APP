import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAiConfigStore } from "@/store/useAiConfigStore";
import { getModelsByGroup, getModelDef } from "@/ai/models";
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

  const groupModels = getModelsByGroup(config.fallbackGroup);
  const selectedDef = getModelDef(value);

  const handleSelect = (modelId: string) => {
    setModelRef.current(modelId);
    onChange(modelId);
    setOpen(false);
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
                        isAvailable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {status.rpmLimit > 0 ? `${status.rpmUsed}/${status.rpmLimit}` : "—"}
                    </span>
                  )}
                </button>
              );
            })}
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
          <span>{selectedDef?.label ?? value}</span>
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
        <div className="space-y-0.5">
          {groupModels.map((model) => {
            const status = rateLimiter.getStatus(model.id);
            const isSelected = value === model.id;
            const isAvailable = rateLimiter.canMakeRequest(model.id);
            const def = getModelDef(model.id);

            return (
              <button
                type="button"
                key={model.id}
                onClick={() => handleSelect(model.id)}
                className={`flex w-full flex-col items-start rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent ${
                  isSelected ? "bg-accent" : ""
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="flex items-center gap-2">
                    {isSelected && <Check className="size-3 text-primary" />}
                    <span className="font-medium">{model.label}</span>
                  </span>
                  {showAvailability && (
                    <span
                      className={`text-xs ${
                        isAvailable ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {status.rpmLimit > 0 ? `${status.rpmUsed}/${status.rpmLimit} RPM` : "—"}
                    </span>
                  )}
                </div>
                {def && (
                  <span className="ml-5 text-xs text-muted-foreground">
                    {def.limits.rpm > 0 && `${def.limits.rpm} req/min`}
                    {def.limits.tpm > 0 && ` · ${(def.limits.tpm / 1000).toFixed(0)}K tok/min`}
                    {def.limits.rpd > 0 && ` · ${def.limits.rpd}/día`}
                  </span>
                )}
              </button>
            );
          })}
          <div className="my-1 border-t" />
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={handleGoToSettings}
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Settings className="size-3" />
            Ir a configuración...
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
