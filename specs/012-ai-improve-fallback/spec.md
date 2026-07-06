# 012 — Mejorar con IA: Fallback, Selector Inline y Navegación Contextual

**Estado:** Implementado  
**Prioridad:** Alta  
**Dependencias:** 006-model-management (registry, rateLimiter, fallback chains)

---

## 1. Motivación

El botón "Mejorar con IA" (`AiImproveButton`) permite enriquecer tareas, proyectos, procesos y otros objetos con sugerencias generadas por Gemini. Actualmente:

1. **No hay fallback automático**: cuando el modelo principal alcanza su límite (HTTP 429 o cuota agotada), el error se muestra al usuario sin intentar otros modelos del grupo, a pesar de que el sistema de fallback ya existe en el spec 006.
2. **No hay selector de modelo inline**: el usuario debe navegar a Ajustes → IA para cambiar de modelo, lo cual interrumpe el flujo de trabajo.
3. **No hay navegación contextual**: cuando ocurre un error, el panel solo muestra "Reintentar" sin ofrecer "Ir a configuración" o "Cambiar modelo".
4. **Los errores de cuota no se distinguen**: `classifyAiError` mapea 429 a `rate-limit` pero no detecta específicamente errores de cuota de tokens (que pueden manifestarse como 400 con mensaje "quota" o "limit").

El resultado es que el usuario queda bloqueado sin saber qué hacer, y el sistema no aprovecha los modelos alternativos disponibles.

---

## 2. Objetivos

1. **Fallback automático en `runImprove`**: cuando `autoFallback` está activo, intentar modelos alternativos del grupo configurado antes de mostrar error.
2. **Selector de modelo inline**: dropdown compacto junto al botón "Mejorar con IA" para cambiar de modelo sin salir del contexto.
3. **Acciones contextuales en errores**: botones "Ir a configuración", "Cambiar modelo" y "Reintentar" según el tipo de error.
4. **Mejor clasificación de errores**: detectar específicamente errores de cuota de tokens vs. rate-limit de requests.

---

## 3. Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│  UI                                                          │
│  AiImproveButton                                             │
│    ├── AiModelSelector (dropdown inline)                     │
│    └── AiSuggestionsPanel (errores con acciones)             │
└──────────────────────────┬──────────────────────────────────┘
                           │ usa
┌──────────────────────────▼──────────────────────────────────┐
│  useAiImprove (hook)                                         │
│    - Lógica de fallback automático                           │
│    - Navegación a settings                                   │
│    - Estados: currentModel, fallbackAttempt, canFallback     │
└──────────────────────────┬──────────────────────────────────┘
                           │ llama
┌──────────────────────────▼──────────────────────────────────┐
│  runImproveWithFallback (ai/improve.ts)                      │
│    - Intenta modelo principal                                │
│    - Si falla por cuota, prueba siguiente del grupo          │
│    - Retorna { result, modelUsed, fallbackChain }            │
└──────────────────────────┬──────────────────────────────────┘
                           │ usa
┌──────────────────────────▼──────────────────────────────────┐
│  rateLimiter + MODEL_REGISTRY + FALLBACK_CHAINS              │
│  (spec 006 — ya implementados)                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Cambios en `src/ai/improve.ts`

### 4.1 Nueva función `runImproveWithFallback`

```typescript
export interface ImproveOptionsWithFallback extends ImproveOptions {
  autoFallback?: boolean;
  fallbackGroup?: string;
  onFallback?: (from: string, to: string, reason: string) => void;
}

export interface ImproveResultWithMeta extends ImproveResult {
  modelUsed?: string;
  fallbackChain?: string[];
}

export async function runImproveWithFallback(
  options: ImproveOptionsWithFallback
): Promise<ImproveResultWithMeta>
```

**Algoritmo**:
1. Si `autoFallback` está activo y `fallbackGroup` definido:
   - Obtener modelos del grupo ordenados por prioridad
   - Intentar cada modelo hasta que uno funcione
   - Si todos fallan, retornar error `all-models-exhausted`
2. Si `autoFallback` está inactivo:
   - Intentar solo con el modelo principal
   - Si falla, retornar error directamente
3. En cada intento:
   - Verificar `rateLimiter.canMakeRequest(modelId)` antes de llamar
   - Si no puede, saltar al siguiente
   - Si la llamada falla con error de cuota, marcar modelo como saturado y continuar

### 4.2 Mejora en `classifyAiError`

Agregar detección de errores de cuota de tokens:

```typescript
// En errors.ts, agregar nuevo tipo:
export type AiErrorKind =
  | "invalid-key"
  | "rate-limit"
  | "quota-exhausted"  // NUEVO: cuota de tokens agotada
  | "all-models-exhausted"
  | "offline"
  | "aborted"
  | "unknown";
```

Detectar mensajes como "token limit", "quota exceeded", "daily limit" en el error.

---

## 5. Cambios en `src/hooks/useAiImprove.ts`

### 5.1 Nuevos estados expuestos

```typescript
export interface UseAiImproveReturn {
  // ... existentes
  currentModel: string;           // modelo que se está usando
  fallbackAttempt: number;        // intento actual (1, 2, 3...)
  totalAttempts: number;          // total de intentos realizados
  canFallback: boolean;           // si hay más modelos disponibles
  goToSettings: () => void;       // navegación a settings
}
```

### 5.2 Lógica de fallback

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
  setFallbackAttempt(1);

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

  if (res.ok) {
    setResult(res.data);
    setCurrentModel(res.modelUsed ?? config.model);
  } else {
    // Mapeo de errores mejorado
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

### 5.3 Navegación a settings

```typescript
const goToSettings = useCallback(() => {
  window.location.hash = "ia";
  // Asumiendo que hay un router o navigate function
  window.dispatchEvent(new CustomEvent("navigate", { detail: "/settings" }));
}, []);
```

---

## 6. Nuevo Componente: `AiModelSelector.tsx`

### 6.1 Ubicación

`src/components/ai/AiModelSelector.tsx`

### 6.2 Props

```typescript
export interface AiModelSelectorProps {
  value: string;
  onChange: (model: string) => void;
  compact?: boolean;              // true para usar en botón
  showAvailability?: boolean;     // mostrar indicador de cuota
  disabled?: boolean;
}
```

### 6.3 Diseño

**Modo compacto** (inline en el botón):
```
[🤖 Mejorar con IA ▼]
  └── Dropdown:
      ├── Gemini 2.5 Flash ✓ (6/6 RPM)
      ├── Gemini 2.5 Flash Lite (10/10 RPM)
      ├── Gemini 3 Flash (2/5 RPM)
      ├── ──────────────
      └── Ir a configuración...
```

**Modo expandido** (en settings):
```
Modelo: [Gemini 2.5 Flash ▼]
  └── Dropdown con detalles completos:
      ├── Gemini 2.5 Flash
      │   └── 6 req/min · 250K tok/min · 20/día
      ├── Gemini 2.5 Flash Lite
      │   └── 10 req/min · 250K tok/min · 20/día
      └── ...
```

### 6.4 Indicadores visuales

- **Verde**: modelo con cuota disponible (>50% libre)
- **Amarillo**: modelo con cuota baja (<50% libre)
- **Rojo**: modelo sin cuota (saturado o al límite)
- **Gris**: modelo deshabilitado (sin límites configurados)

---

## 7. Cambios en `AiSuggestionsPanel.tsx`

### 7.1 Nuevas props

```typescript
export interface AiSuggestionsPanelProps {
  // ... existentes
  errorType?: AiErrorKind;        // tipo específico de error
  onGoToSettings?: () => void;    // navegar a configuración
  onChangeModel?: () => void;     // abrir selector de modelo
  currentModel?: string;          // modelo que falló
  fallbackAttempt?: number;       // intento actual
  totalAttempts?: number;         // total de intentos
}
```

### 7.2 UI de errores mejorada

**Error de cuota (`quota-exhausted` o `rate-limit`)**:
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Límite alcanzado en Gemini 2.5 Flash             │
│                                                     │
│ Intento 1 de 4 modelos intentados                   │
│                                                     │
│ [Cambiar modelo]  [Ir a configuración]  [Reintentar]│
└─────────────────────────────────────────────────────┘
```

**Error de key inválida (`invalid-key`)**:
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ La API key no es válida                          │
│                                                     │
│ [Ir a configuración]                                │
└─────────────────────────────────────────────────────┘
```

**Todos los modelos agotados (`all-models-exhausted`)**:
```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Todos los modelos alcanzaron su límite           │
│                                                     │
│ Espera un minuto o cambia el grupo de fallback.     │
│                                                     │
│ [Ir a configuración]  [Reintentar]                  │
└─────────────────────────────────────────────────────┘
```

---

## 8. Cambios en `AiImproveButton.tsx`

### 8.1 Layout mejorado

```typescript
<div className="flex items-center gap-2">
  <Button ...>
    {isLoading ? "Analizando…" : "Mejorar con IA"}
  </Button>
  
  <AiModelSelector
    value={currentModel}
    onChange={setModel}
    compact
    showAvailability
  />
</div>
```

### 8.2 Estados del botón

- **Normal**: muestra "Mejorar con IA" + selector compacto
- **Loading**: muestra "Analizando…" + spinner, selector deshabilitado
- **Error**: muestra error panel con acciones contextuales
- **Success**: muestra sugerencias normalmente

---

## 9. Flujo de Usuario

### Escenario 1: Fallback automático activo, modelo principal saturado

1. Usuario hace clic en "Mejorar con IA"
2. Sistema intenta con `gemini-2.5-flash` → falla (429)
3. Sistema automáticamente prueba `gemini-2.5-flash-lite` → éxito
4. UI muestra: "Sugerencias generadas (usando Gemini 2.5 Flash Lite)"
5. Selector inline muestra el modelo actual

### Escenario 2: Fallback automático inactivo, error de cuota

1. Usuario hace clic en "Mejorar con IA"
2. Sistema intenta con modelo principal → falla (429)
3. UI muestra error: "Límite alcanzado en [modelo]"
4. Botones: "Cambiar modelo" (abre dropdown) | "Ir a configuración" | "Reintentar"

### Escenario 3: Usuario quiere cambiar modelo rápidamente

1. Usuario hace clic en el selector inline (▼)
2. Selecciona nuevo modelo
3. Sistema guarda cambio vía `useAiConfigStore.setModel()`
4. Siguiente solicitud usará el nuevo modelo

---

## 10. Validaciones

### Antes de llamar a la API

- Verificar `rateLimiter.canMakeRequest(modelId)`
- Si no puede y `autoFallback` está activo, buscar alternativa automáticamente
- Si no puede y no hay fallback, mostrar advertencia antes de intentar

### Después de error

- Clasificar error específicamente (cuota vs red vs key inválida)
- Si es cuota: ofrecer acciones específicas (cambiar modelo, ir a settings)
- Si es red: sugerir reintentar
- Si es key: sugerir ir a configuración

### UI

- Deshabilitar modelos sin cuota en el selector (pero permitir seleccionarlos)
- Mostrar indicador visual de estado de cuota
- Validar que haya al menos un modelo disponible en el grupo

---

## 11. Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/ai/improve.ts` | Agregar `runImproveWithFallback` |
| `src/ai/gemini/errors.ts` | Agregar tipo `quota-exhausted` y mejorar `classifyAiError` |
| `src/hooks/useAiImprove.ts` | Lógica de fallback, nuevos estados, navegación, sincronización con `useEffect` |
| `src/components/ai/AiImproveButton.tsx` | Selector inline, layout mejorado |
| `src/components/ai/AiSuggestionsPanel.tsx` | Acciones contextuales en errores |
| `src/components/ai/AiModelSelector.tsx` | **NUEVO** componente con Popover interactivo |

---

## 12. Implementación Realizada

### 12.1 Fase 1 — Lógica de fallback (backend)

- Agregado tipo `"quota-exhausted"` a `AiErrorKind` en `src/ai/gemini/errors.ts`
- Mejorado `classifyAiError` para detectar mensajes de cuota ("token limit", "quota exceeded", "daily limit")
- Agregado mensaje para `quota-exhausted` en `AI_ERROR_MESSAGES`
- Creada interfaz `ImproveOptionsWithFallback` extendiendo `ImproveOptions`
- Creada interfaz `ImproveResultWithMeta` extendiendo `ImproveResult`
- Implementada función `runImproveWithFallback` que itera sobre modelos del grupo
- Marcado de modelo como saturado con `rateLimiter.markSaturated` cuando falla por cuota

### 12.2 Fase 2 — Hook `useAiImprove` con fallback

- Agregados estados: `currentModel`, `fallbackAttempt`, `totalAttempts`, `errorType`
- Reemplazada llamada a `runImprove` por `runImproveWithFallback`
- Implementado callback `onFallback` que actualiza `fallbackAttempt` y `currentModel`
- Agregado mensaje de error para `quota-exhausted`
- Implementada función `goToSettings` que navega a `/app/settings#ia`
- Agregado `useEffect` para sincronizar `currentModel` cuando cambia `config.model`

### 12.3 Fase 3 — Componente `AiModelSelector`

- Creado componente con props `value`, `onChange`, `compact`, `showAvailability`, `disabled`
- Implementado dropdown con modelos del grupo de fallback activo
- Agregados indicadores visuales de cuota usando `rateLimiter.getStatus`
- Agregada opción "Ir a configuración" con separador
- Implementada navegación a `/app/settings#ia` usando `ROUTES.settings("ia")`
- Fix de interacción del Popover usando `onInteractOutside={(e) => e.preventDefault()}`

### 12.4 Fase 4 — UI mejorada en botones y paneles

- Agregado `AiModelSelector` en modo compacto junto al botón "Mejorar con IA"
- Agregadas nuevas props a `AiSuggestionsPanel`: `errorType`, `onGoToSettings`, `onChangeModel`, `currentModel`, `fallbackAttempt`, `totalAttempts`
- Implementada función `getErrorActions` que mapea `errorType` a acciones
- Mostradas acciones contextuales según tipo de error
- Mostrada información de fallback cuando `totalAttempts > 1`

### 12.5 Fix de interacción del Popover

- Eliminado `onClick={() => setOpen(!open)}` del Button trigger
- Agregado `onInteractOutside={(e) => e.preventDefault()}` al PopoverContent
- Agregado `onClick={(e) => e.stopPropagation()}` y `style={{ pointerEvents: "auto" }}` al PopoverContent
- Agregado `type="button"` a todos los botones internos

### 12.6 Fix de redirección y sincronización

- Corregida redirección de `/settings#ia` a `ROUTES.settings("ia")` (genera `/app/settings#ia`)
- Agregado `useEffect` para sincronizar `currentModel` con `config.model`

---

## 13. Riesgos y Mitigaciones

| Riesgo | Mitigación |
|--------|-----------|
| Fallback automático puede ser lento si prueba muchos modelos | Limitar a modelos del grupo activo; mostrar progreso en UI |
| Selector inline puede confundir si hay muchos modelos | Modo compacto solo muestra modelos del grupo de fallback activo |
| Navegación a settings puede perder el contexto | Usar `ROUTES.settings("ia")` para scroll automático a sección IA |
| Errores de cuota pueden ser ambiguos | Mejorado `classifyAiError` con más patrones de mensaje |
| Popover se cierra antes de ejecutar acción | Usar `onInteractOutside` con `preventDefault()` (patrón oficial de Radix UI) |
| Estado local no se sincroniza con el store | Agregar `useEffect` para sincronizar `currentModel` con `config.model` |

---

## 14. Métricas de Éxito

- Reducción de errores visibles al usuario en 80% (fallback automático)
- Tiempo promedio para cambiar de modelo < 2 segundos (selector inline)
- Cero errores de "no sé qué hacer" (acciones contextuales claras)
- Navegación correcta a `/app/settings#ia` desde cualquier contexto
- Sincronización inmediata del modelo seleccionado sin necesidad de cerrar/abrir tarea
