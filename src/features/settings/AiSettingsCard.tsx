import { useEffect, useRef, useState } from "react";
import { Check, Eye, EyeOff, ExternalLink, Sparkles, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  AI_MODELS,
  activeProviderId,
  geminiKey,
  hasKey as configHasKey,
  type AiConfig,
} from "@/ai/config";
import { FALLBACK_CHAINS, getModelDef, qualify, splitQualified } from "@/ai/models";
import { PROVIDER_CATALOG, getProviderDef } from "@/ai/providers/catalog";
import type { ProviderId } from "@/ai/providers/types";
import { AI_ERROR_MESSAGES } from "@/ai/gemini/errors";
import { useAiConfigStore, type KeyStatus } from "@/store/useAiConfigStore";
import { fieldAria, useFieldErrors } from "@/lib/formErrors";
import { CloudflareProxyGuide } from "./CloudflareProxyGuide";

function isValidBaseUrl(url: string): boolean {
  const t = url.trim();
  if (!t) return false;
  try {
    const u = new URL(t);
    if (u.protocol === "https:") return true;
    if (
      u.protocol === "http:" &&
      (u.hostname === "localhost" || u.hostname === "127.0.0.1")
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function AiSettingsCard() {
  const config = useAiConfigStore((s) => s.config);
  const keyStatuses = useAiConfigStore((s) => s.keyStatus);
  const lastError = useAiConfigStore((s) => s.lastError);
  const saveAndValidateKey = useAiConfigStore((s) => s.saveAndValidateKey);
  const clearKey = useAiConfigStore((s) => s.clearKey);
  const setActiveProvider = useAiConfigStore((s) => s.setActiveProvider);
  const setBaseUrl = useAiConfigStore((s) => s.setBaseUrl);
  const setModel = useAiConfigStore((s) => s.setModel);
  const setConfirmWrites = useAiConfigStore((s) => s.setConfirmWrites);
  const setAutoFallback = useAiConfigStore((s) => s.setAutoFallback);
  const setFallbackGroup = useAiConfigStore((s) => s.setFallbackGroup);
  const setRagEnabled = useAiConfigStore((s) => s.setRagEnabled);

  const providerId = activeProviderId(config);
  const def = getProviderDef(providerId);
  const keyStatus: KeyStatus = keyStatuses[providerId] ?? "unset";
  const hasKey = keyStatus === "valid";
  const providerModels = AI_MODELS.filter((m) => m.provider === providerId);
  const needsCustomModel = def.browserBlocked || providerModels.length === 0;
  const chainsForProvider = FALLBACK_CHAINS.filter((c) =>
    c.group.startsWith(`${providerId}:`),
  );
  const hasGeminiKey = Boolean(geminiKey(config));

  const [draft, setDraft] = useState("");
  const [show, setShow] = useState(false);
  const [baseDraft, setBaseDraft] = useState(config.providers[providerId]?.baseUrl ?? "");
  const [customModel, setCustomModel] = useState(() => {
    const { modelId } = splitQualified(config.model);
    return needsCustomModel ? modelId : "";
  });
  const keyRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();

  useEffect(() => {
    setDraft("");
    setBaseDraft(config.providers[providerId]?.baseUrl ?? "");
    const { modelId } = splitQualified(config.model);
    setCustomModel(providerId === splitQualified(config.model).provider ? modelId : "");
    clear();
  }, [providerId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onProviderChange(id: ProviderId) {
    await setActiveProvider(id);
  }

  async function onSave() {
    type FormVals = { key: string; baseUrl: string };
    const rules: import("@/lib/formErrors").FieldRule<FormVals>[] = [
      {
        field: "key",
        message: "La API key no puede estar vacía",
        test: (v) => v.key.trim().length > 0,
      },
    ];
    if (def.browserBlocked) {
      rules.push({
        field: "baseUrl",
        message: "Este proveedor requiere una URL base https:// (o http://localhost)",
        test: (v) => isValidBaseUrl(v.baseUrl),
      });
    }
    const errs = validate({ key: draft, baseUrl: baseDraft }, rules);
    if (errs.length > 0) {
      keyRef.current?.focus();
      return;
    }
    if (def.browserBlocked && baseDraft.trim()) {
      await setBaseUrl(providerId, baseDraft.trim());
    }
    const ok = await saveAndValidateKey(providerId, draft);
    if (ok) setDraft("");
  }

  async function onSaveBaseUrl() {
    if (baseDraft.trim() && !isValidBaseUrl(baseDraft)) {
      validate(
        { baseUrl: baseDraft },
        [
          {
            field: "baseUrl",
            message: "Usá https:// o http://localhost / 127.0.0.1",
            test: () => false,
          },
        ],
      );
      return;
    }
    await setBaseUrl(providerId, baseDraft.trim());
  }

  async function onCustomModelBlur() {
    const id = customModel.trim();
    if (!id) return;
    await setModel(qualify(providerId, id));
  }

  return (
    <Card id="ia" className="scroll-mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="size-5 text-primary" />
          Asistente IA
        </CardTitle>
        <CardDescription>
          Conectá la API key del proveedor que uses. Las claves se guardan{" "}
          <strong>solo en este dispositivo</strong> (IndexedDB); nunca se incluyen en{" "}
          <code>workspace.json</code> ni en las exportaciones.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid max-w-xl gap-5">
        {/* Proveedor */}
        <div className="grid max-w-sm gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-provider">Proveedor</Label>
            {hasKey && (
              <Badge variant="success" className="gap-1">
                <Check className="size-3" /> key guardada
              </Badge>
            )}
          </div>
          <Select
            id="ai-provider"
            value={providerId}
            onChange={(e) => void onProviderChange(e.target.value as ProviderId)}
          >
            {PROVIDER_CATALOG.map((p) => (
              <option key={p.id} value={p.id}>
                {configHasKey(config, p.id) ? "✓ " : ""}
                {p.label}
                {p.browserBlocked ? " (requiere URL propia)" : ""}
              </option>
            ))}
          </Select>
        </div>

        {/* baseUrl + guía Cloudflare para browserBlocked (NVIDIA / OpenCode Zen) */}
        {def.browserBlocked && (
          <div className="grid gap-3">
            <CloudflareProxyGuide providerId={providerId} providerLabel={def.label} />
            <div className="grid gap-1.5 rounded-md border border-warning/40 bg-warning/5 p-3">
              <p className="text-xs text-muted-foreground">
                Este proveedor no permite llamadas directas desde el navegador (CORS).
                Necesitas una URL base propia (proxy). Sigue la guía de arriba o pega la
                URL de tu Worker.
              </p>
              <Label htmlFor="ai-base-url">URL base</Label>
              <div className="flex gap-2">
                <Input
                  id="ai-base-url"
                  value={baseDraft}
                  placeholder={
                    providerId === "opencode-zen"
                      ? "https://mi-proxy.workers.dev/zen"
                      : "https://mi-proxy.workers.dev/nvidia"
                  }
                  onChange={(e) => setBaseDraft(e.target.value)}
                  onBlur={() => void onSaveBaseUrl()}
                  {...fieldAria("baseUrl", errors)}
                />
              </div>
              {errors.baseUrl && (
                <p role="alert" className="text-xs text-destructive">
                  {errors.baseUrl}
                </p>
              )}
            </div>
          </div>
        )}

        {/* API Key */}
        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-key">API key</Label>
            <StatusBadge status={keyStatus} />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="ai-key"
                ref={keyRef}
                type={show ? "text" : "password"}
                value={draft}
                placeholder={hasKey ? "••••••••  (clave guardada)" : def.keyHint}
                autoComplete="off"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void onSave();
                  }
                }}
                {...fieldAria("key", errors)}
              />
              {errors.key && (
                <p id="key-err" role="alert" className="text-xs text-destructive">
                  {errors.key}
                </p>
              )}
              <button
                type="button"
                className="absolute inset-y-0 right-2 text-muted-foreground hover:text-foreground"
                aria-label={show ? "Ocultar clave" : "Mostrar clave"}
                onClick={() => setShow((s) => !s)}
              >
                {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <Button
              onClick={() => void onSave()}
              disabled={keyStatus === "validating"}
              pending={keyStatus === "validating"}
            >
              {keyStatus === "validating" ? "Validando…" : "Guardar"}
            </Button>
          </div>
          {(keyStatus === "invalid" || keyStatus === "network-error") && lastError && (
            <p role="alert" className="text-xs text-destructive">
              {AI_ERROR_MESSAGES[lastError]}
            </p>
          )}
          <a
            href={def.keyUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Obtener una key
            <ExternalLink className="size-3" />
          </a>
          <p className="text-xs text-muted-foreground">
            Se guarda solo en este dispositivo (IndexedDB), nunca en workspace.json.
          </p>
        </div>

        {/* Modelo */}
        <div className="grid gap-2">
          <Label>Modelo</Label>
          {needsCustomModel ? (
            <div className="grid gap-1.5">
              <Input
                value={customModel}
                placeholder={
                  providerId === "opencode-zen"
                    ? "id de modelo (ej. big-pickle)"
                    : "id de modelo (ej. meta/llama-3.1-8b-instruct)"
                }
                onChange={(e) => setCustomModel(e.target.value)}
                onBlur={() => void onCustomModelBlur()}
              />
              <p className="text-xs text-muted-foreground">
                Escribe el id exacto del modelo
                {providerId === "opencode-zen"
                  ? " (ej. big-pickle o deepseek-v4-flash-free)."
                  : " que expone tu proxy o el catálogo del proveedor."}
              </p>
              {providerId === "opencode-zen" && (
                <a
                  href="https://opencode.ai/docs/es/zen"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary underline-offset-2 hover:underline"
                >
                  Ver modelos de OpenCode Zen
                  <ExternalLink className="size-3" />
                </a>
              )}
              {providerId === "nvidia" && (
                <a
                  href="https://build.nvidia.com/models"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary underline-offset-2 hover:underline"
                >
                  Ver modelos de NVIDIA NIM
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          ) : (
            <div className="grid gap-1.5">
              {providerModels.map((m) => {
                const mDef = getModelDef(m.value);
                const isSelected = config.model === m.value;
                const limits = mDef
                  ? mDef.limitsUnknown
                    ? "límites no publicados"
                    : formatLimits(mDef)
                  : "";
                return (
                  <label
                    key={m.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors hover:bg-accent ${
                      isSelected ? "border-primary bg-accent/50" : "border-border"
                    } ${!m.available ? "opacity-60" : ""}`}
                  >
                    <input
                      type="radio"
                      name="model"
                      value={m.value}
                      checked={isSelected}
                      onChange={() => setModel(m.value as AiConfig["model"])}
                      className="mt-1 size-4 accent-primary"
                    />
                    <div className="grid gap-0.5 text-sm">
                      <span className="font-medium">{m.label}</span>
                      <span className="text-xs text-muted-foreground">{limits}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Fallback */}
        <div className="grid gap-2">
          <Label className="flex items-center gap-3">
            <Checkbox
              checked={config.autoFallback}
              onCheckedChange={(v) => setAutoFallback(v)}
              aria-label="Activar fallback automático"
            />
            <div className="grid gap-0.5">
              <span className="text-sm font-medium">Fallback automático</span>
              <span className="text-xs text-muted-foreground">
                Cuando un modelo alcanza su límite, cambia a otro del mismo proveedor.
              </span>
            </div>
          </Label>
        </div>

        {config.autoFallback && chainsForProvider.length > 0 && (
          <div className="grid max-w-sm gap-1.5">
            <Label htmlFor="ai-fallback-group">Grupo de fallback</Label>
            <Select
              id="ai-fallback-group"
              value={config.fallbackGroup}
              onChange={(e) => setFallbackGroup(e.target.value)}
            >
              {chainsForProvider.map((chain) => (
                <option key={chain.group} value={chain.group}>
                  {chain.label}
                </option>
              ))}
            </Select>
          </div>
        )}

        <label className="flex items-start gap-3">
          <Checkbox
            checked={config.confirmWrites}
            onCheckedChange={(v) => setConfirmWrites(v)}
            aria-label="Confirmar antes de escribir datos"
          />
          <span className="grid gap-0.5">
            <span className="text-sm font-medium">Confirmar antes de escribir datos</span>
            <span className="text-xs text-muted-foreground">
              El asistente pedirá tu aprobación antes de crear o modificar datos. Recomendado.
            </span>
          </span>
        </label>

        <label className="flex items-start gap-3">
          <Checkbox
            checked={config.ragEnabled && hasGeminiKey}
            disabled={!hasGeminiKey}
            onCheckedChange={(v) => setRagEnabled(v)}
            aria-label="Contexto semántico RAG"
          />
          <span className="grid gap-0.5">
            <span className="text-sm font-medium">Contexto semántico (RAG)</span>
            <span className="text-xs text-muted-foreground">
              {hasGeminiKey
                ? "Usa embeddings de Gemini aunque el chat esté en otro proveedor."
                : "Requiere una API key de Gemini guardada (los embeddings solo corren en Gemini)."}
            </span>
          </span>
        </label>

        {hasKey && (
          <div>
            <Button variant="outline" size="sm" onClick={() => clearKey(providerId)}>
              <Trash2 className="size-4" />
              Borrar clave de {def.label}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: KeyStatus }) {
  switch (status) {
    case "valid":
      return (
        <Badge variant="success" className="gap-1">
          <Check className="size-3" /> Válida
        </Badge>
      );
    case "invalid":
      return (
        <Badge variant="destructive" className="gap-1">
          <X className="size-3" /> Inválida
        </Badge>
      );
    case "network-error":
      return <Badge variant="warning">Error de red</Badge>;
    case "validating":
      return <Badge variant="secondary">Validando…</Badge>;
    default:
      return <Badge variant="outline">Sin configurar</Badge>;
  }
}

function formatLimits(def: {
  limits: { rpm: number; tpm: number; rpd: number };
  unlimitedTpm?: boolean;
}): string {
  const parts: string[] = [];
  if (def.limits.rpm > 0) parts.push(`${def.limits.rpm} req/min`);
  if (def.unlimitedTpm) parts.push("tok. ilimitado/min");
  else if (def.limits.tpm > 0) parts.push(`${(def.limits.tpm / 1000).toFixed(0)}K tok/min`);
  if (def.limits.rpd > 0) parts.push(`${def.limits.rpd}/día`);
  return parts.join(" · ");
}
