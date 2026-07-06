# Plan Técnico — 012 AI Improve Fallback

- **Feature:** 012-ai-improve-fallback
- **Estado:** Implementado
- **Constitución:** alineado con I (local-first), IV (diseño limpio) y V (simplicidad). No toca
  esquema de datos (II) ni storage (I/VI). Extiende el sistema de fallback ya implementado en
  spec 006 al contexto de "Mejorar con IA".

## Alcance técnico

Ninguna dependencia nueva. Se reutiliza:
- `rateLimiter` (spec 006) para verificar cuota antes de llamar
- `MODEL_REGISTRY` y `FALLBACK_CHAINS` (spec 006) para obtener modelos del grupo
- `useAiConfigStore` para leer `autoFallback` y `fallbackGroup`

Los cambios son exclusivamente de lógica de fallback en `runImprove`, UI en los componentes
existentes, y un nuevo componente `AiModelSelector`.

## Componentes a crear/extender

| Componente | Acción | Descripción |
|---|---|---|
| `AiModelSelector` | **NUEVO** | Dropdown compacto para cambiar modelo inline |
| `AiImproveButton` | Extender | Agregar selector inline, layout mejorado |
| `AiSuggestionsPanel` | Extender | Acciones contextuales en errores |
| `useAiImprove` | Extender | Lógica de fallback, nuevos estados |
| `runImprove` | Extender | Nueva función `runImproveWithFallback` |
| `classifyAiError` | Extender | Detectar `quota-exhausted` |

## Diseño del selector inline (`AiModelSelector`)

### Modo compacto (en botón)

```
[🤖 Mejorar con IA ▼]
  └── Dropdown:
      ├── ✓ Gemini 2.5 Flash (6/6 RPM)
      ├── ○ Gemini 2.5 Flash Lite (10/10 RPM)
      ├── ○ Gemini 3 Flash (2/5 RPM)
      ├── ──────────────
      └── ⚙ Ir a configuración...
```

- **✓** = modelo seleccionado
- **○** = modelos alternativos
- **Indicadores de color**: verde (>50% libre), amarillo (<50% libre), rojo (saturado)
- **Separador** antes de "Ir a configuración"
- **Click en modelo**: cambia modelo y cierra dropdown
- **Click en "Ir a configuración"**: navega a settings con hash `#ia`

### Implementación

```typescript
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

  // Filtrar modelos del grupo de fallback activo
  const groupModels = getModelsByGroup(config.fallbackGroup);

  const handleSelect = (modelId: string) => {
    setModel(modelId);
    onChange(modelId);
    setOpen(false);
  };

  const handleGoToSettings = () => {
    setOpen(false);
    window.location.hash = "ia";
    // Dispatch navigate event o usar router si existe
    window.location.href = "/settings#ia";
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="px-2"
      >
        <ChevronDown className="size-4" />
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-1 w-64 rounded-md border bg-popover shadow-md">
          <div className="p-1">
            {groupModels.map((model) => {
              const status = rateLimiter.getStatus(model.id);
              const isSelected = value === model.id;
              const isAvailable = rateLimiter.canMakeRequest(model.id);

              return (
                <button
                  key={model.id}
                  onClick={() => handleSelect(model.id)}
                  className={`flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-accent ${
                    isSelected ? "bg-accent" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isSelected && <Check className="size-3" />}
                    <span>{model.label}</span>
                  </span>
                  {showAvailability && (
                    <span className={`text-xs ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                      {status.rpmUsed}/{status.rpmLimit}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="my-1 border-t" />
            <button
              onClick={handleGoToSettings}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
            >
              <Settings className="size-3" />
              Ir a configuración...
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Diseño de `runImproveWithFallback`

### Algoritmo

```typescript
export async function runImproveWithFallback(
  options: ImproveOptionsWithFallback
): Promise<ImproveResultWithMeta> {
  const {
    apiKey,
    model: preferredModel,
    entityType,
    fields,
    signal,
    autoFallback = true,
    fallbackGroup = "flash",
    onFallback,
  } = options;

  // Si no hay fallback, usar el modelo principal directamente
  if (!autoFallback) {
    const result = await runImprove({ apiKey, model: preferredModel, entityType, fields, signal });
    return { ...result, modelUsed: preferredModel };
  }

  // Obtener modelos del grupo ordenados por prioridad
  const groupModels = getModelsByGroup(fallbackGroup);
  const fallbackChain: string[] = [];

  for (const modelDef of groupModels) {
    // Verificar cuota antes de intentar
    if (!rateLimiter.canMakeRequest(modelDef.id)) {
      continue;
    }

    fallbackChain.push(modelDef.id);

    try {
      const result = await runImprove({
        apiKey,
        model: modelDef.id,
        entityType,
        fields,
        signal,
      });

      if (result.ok) {
        return { ...result, modelUsed: modelDef.id, fallbackChain };
      }

      // Si falló por cuota, marcar como saturado y continuar
      if (result.error === "rate-limit" || result.error === "quota-exhausted") {
        rateLimiter.markSaturated(modelDef.id, 60);
        if (onFallback) {
          const nextModel = groupModels.find(
            (m) => m.priority > modelDef.priority && rateLimiter.canMakeRequest(m.id)
          );
          if (nextModel) {
            onFallback(modelDef.id, nextModel.id, result.error);
          }
        }
        continue;
      }

      // Otros errores: retornar inmediatamente
      return { ...result, modelUsed: modelDef.id, fallbackChain };
    } catch (e) {
      // Error inesperado, continuar al siguiente
      continue;
    }
  }

  // Todos los modelos fallaron
  return {
    ok: false,
    error: "all-models-exhausted",
    fallbackChain,
  };
}
```

## Diseño de errores contextuales en `AiSuggestionsPanel`

### Mapeo de errores a acciones

| Error | Mensaje | Acciones |
|-------|---------|----------|
| `invalid-key` | "La API key no es válida" | [Ir a configuración] |
| `rate-limit` | "Límite de peticiones alcanzado" | [Cambiar modelo] [Ir a configuración] [Reintentar] |
| `quota-exhausted` | "Cuota de tokens agotada" | [Cambiar modelo] [Ir a configuración] [Reintentar] |
| `all-models-exhausted` | "Todos los modelos alcanzaron su límite" | [Ir a configuración] [Reintentar] |
| `offline` | "Sin conexión a internet" | [Reintentar] |
| `aborted` | "Solicitud cancelada" | [Reintentar] |
| `unknown` | "Error inesperado" | [Reintentar] |

### Implementación

```typescript
function getErrorActions(errorType: AiErrorKind) {
  switch (errorType) {
    case "invalid-key":
      return { showSettings: true, showChangeModel: false, showRetry: false };
    case "rate-limit":
    case "quota-exhausted":
      return { showSettings: true, showChangeModel: true, showRetry: true };
    case "all-models-exhausted":
      return { showSettings: true, showChangeModel: false, showRetry: true };
    case "offline":
    case "aborted":
    case "unknown":
    default:
      return { showSettings: false, showChangeModel: false, showRetry: true };
  }
}
```

## Diseño de `useAiImprove` con fallback

### Nuevos estados

```typescript
const [currentModel, setCurrentModel] = useState(config.model);
const [fallbackAttempt, setFallbackAttempt] = useState(1);
const [totalAttempts, setTotalAttempts] = useState(0);
const [errorType, setErrorType] = useState<AiErrorKind | null>(null);
```

### Lógica de fallback

```typescript
const improve = useCallback(async () => {
  if (!config.apiKey) {
    setError("Configura una API key en Ajustes → IA");
    return;
  }

  abortRef.current?.abort();
  const controller = new AbortController();
  abortRef.current = controller;

  setIsLoading(true);
  setError(null);
  setResult(null);
  setErrorType(null);
  setFallbackAttempt(1);
  setCurrentModel(config.model);

  const res = await runImproveWithFallback({
    apiKey: config.apiKey,
    model: config.model,
    entityType,
    fields,
    signal: controller.signal,
    autoFallback: config.autoFallback,
    fallbackGroup: config.fallbackGroup,
    onFallback: (from, to, reason) => {
      setFallbackAttempt((prev) => prev + 1);
      setCurrentModel(to);
    },
  });

  if (controller.signal.aborted) return;

  setIsLoading(false);
  setTotalAttempts(res.fallbackChain?.length ?? 1);

  if (res.ok) {
    setResult(res.data);
    setCurrentModel(res.modelUsed ?? config.model);
  } else {
    const messages: Record<string, string> = {
      "invalid-key": "La API key no es válida. Revísala en Ajustes → IA.",
      "rate-limit": "Límite de peticiones alcanzado. Espera un momento.",
      "quota-exhausted": "Cuota de tokens agotada. Cambia de modelo o espera.",
      "all-models-exhausted": "Todos los modelos alcanzaron su límite.",
      offline: "Sin conexión a internet.",
      aborted: "Solicitud cancelada.",
      unknown: "Error inesperado. Inténtalo de nuevo.",
    };
    setError(messages[res.error] ?? "Error desconocido");
    setErrorType(res.error);
  }
}, [config, entityType, fields]);
```

### Navegación a settings

```typescript
const goToSettings = useCallback(() => {
  window.location.href = "/settings#ia";
}, []);
```

## Orden de implementación (6 fases)

**Fase 1 — Mejoras en lógica de fallback (bajo riesgo, aislado):**
1. Agregar tipo `quota-exhausted` a `AiErrorKind`
2. Mejorar `classifyAiError` para detectar errores de cuota
3. Implementar `runImproveWithFallback` en `improve.ts`
4. Verificar con `tsc --noEmit` y tests existentes

**Fase 2 — Hook `useAiImprove` con fallback:**
5. Agregar nuevos estados: `currentModel`, `fallbackAttempt`, `errorType`
6. Integrar `runImproveWithFallback` en lugar de `runImprove`
7. Agregar función `goToSettings`
8. Verificar que el hook funciona correctamente

**Fase 3 — Componente `AiModelSelector`:**
9. Crear componente `AiModelSelector` con modo compacto
10. Implementar dropdown con indicadores de cuota
11. Agregar opción "Ir a configuración"
12. Verificar visualmente en modo compacto

**Fase 4 — UI mejorada en botones y paneles:**
13. Extender `AiImproveButton` con selector inline
14. Extender `AiSuggestionsPanel` con acciones contextuales
15. Mapear errores a acciones específicas
16. Smoke visual: probar todos los escenarios de error

**Fase 5 — Fix de interacción del Popover:**
17. Eliminar `onClick` manual del Button trigger (el Popover maneja el toggle automáticamente)
18. Agregar `onInteractOutside={(e) => e.preventDefault()}` al PopoverContent (patrón oficial de Radix UI)
19. Agregar `onClick={(e) => e.stopPropagation()}` y `style={{ pointerEvents: "auto" }}` al PopoverContent
20. Eliminar `onPointerDown` de botones individuales (no necesario con `onInteractOutside`)

**Fase 6 — Fix de redirección y sincronización:**
21. Corregir redirección de `/settings#ia` a `ROUTES.settings("ia")` (genera `/app/settings#ia`)
22. Agregar `useEffect` para sincronizar `currentModel` con `config.model`
23. Verificar que el modelo se actualiza inmediatamente sin cerrar/abrir tarea

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Fallback automático puede ser lento si prueba muchos modelos | Limitar a modelos del grupo activo (no todos); mostrar progreso en UI |
| Selector inline puede confundir si hay muchos modelos | Modo compacto solo muestra modelos del grupo de fallback activo |
| Navegación a settings puede perder el contexto | Usar `ROUTES.settings("ia")` para generar `/app/settings#ia` con hash para scroll automático |
| Errores de cuota pueden ser ambiguos | Mejorado `classifyAiError` con más patrones de mensaje |
| `rateLimiter.canMakeRequest` puede no ser preciso | Es una estimación local; si la API rechaza, el fallback se activa igual |
| Popover se cierra antes de ejecutar acción | Usar `onInteractOutside` con `preventDefault()` (patrón oficial de Radix UI) |
| Estado local no se sincroniza con el store | Agregar `useEffect` para sincronizar `currentModel` con `config.model` |

## Estrategia de verificación por fase

Después de cada fase:
- `npx tsc --noEmit` (typecheck)
- `npx vitest run` (tests existentes)
- Smoke visual manual en dev server

No se avanza a la fase siguiente sin confirmar que la fase actual no rompió nada.

**Fase 5 y 6 adicionales:**
- Verificar que los clicks en "Cambiar modelo" e "Ir a configuración" funcionen correctamente
- Verificar que la redirección vaya a `/app/settings#ia` (no `/settings#ia`)
- Verificar que `currentModel` se actualice inmediatamente al cambiar el modelo

## Gates de la constitución (revisión)

- ✅ **I Local-first:** sin cambios de persistencia ni red (solo usa rateLimiter en memoria).
- ✅ **II Esquema-contrato:** sin cambios de esquema ni migraciones.
- ✅ **III Plantillas/Tipos:** no aplica (no toca plantillas).
- ✅ **IV Diseño limpio:** reutiliza componentes y patrones existentes (dropdown, badges, botones).
- ✅ **V Simplicidad/incremental:** 6 fases independientes; reutiliza spec 006.
- ✅ **VI Migrabilidad:** no toca `StorageAdapter`.

---

## Resumen de Implementación

### Archivos creados:
- `src/components/ai/AiModelSelector.tsx` — Nuevo componente con Popover interactivo

### Archivos modificados:
- `src/ai/gemini/errors.ts` — Nuevo tipo `quota-exhausted` + detección mejorada
- `src/ai/improve.ts` — Nueva función `runImproveWithFallback` con lógica de fallback automático
- `src/hooks/useAiImprove.ts` — Nuevos estados (`currentModel`, `fallbackAttempt`, `errorType`, `goToSettings`) + sincronización con `useEffect`
- `src/components/ai/AiSuggestionsPanel.tsx` — Acciones contextuales según tipo de error
- `src/components/ai/AiImproveButton.tsx` — Selector inline de modelos + integración con panel mejorado

### Fixes aplicados:
1. **Fix de interacción del Popover**: Usar `onInteractOutside` con `preventDefault()` (patrón oficial de Radix UI)
2. **Fix de redirección**: Corregir `/settings#ia` a `ROUTES.settings("ia")` (genera `/app/settings#ia`)
3. **Fix de sincronización**: Agregar `useEffect` para sincronizar `currentModel` con `config.model`

### Verificación:
- ✅ `tsc --noEmit` pasado sin errores
- ✅ `npm run build` compilado correctamente
- ✅ Todas las fases completadas
