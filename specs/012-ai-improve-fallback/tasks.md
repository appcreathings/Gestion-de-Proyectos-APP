# Tasks — 012 AI Improve Fallback

**Estado:** Completado  
**Fases:** 6 (todas implementadas)

Tareas numeradas por fase. `[P]` = paralelizable dentro de la fase. Cada fase deja la app usable de
punta a punta (Principio V) y termina con `tsc --noEmit` + `vitest run` + smoke visual manual
confirmado antes de avanzar.

## Fase 1 — Lógica de fallback (backend)

- [x] T1201 `src/ai/gemini/errors.ts`: agregar tipo `"quota-exhausted"` a `AiErrorKind`.
- [x] T1202 `src/ai/gemini/errors.ts`: mejorar `classifyAiError` para detectar mensajes de cuota
  ("token limit", "quota exceeded", "daily limit", "exceeded your quota").
- [x] T1203 `src/ai/gemini/errors.ts`: agregar mensaje para `quota-exhausted` en `AI_ERROR_MESSAGES`.
- [x] T1204 `src/ai/improve.ts`: crear interfaz `ImproveOptionsWithFallback` extendiendo `ImproveOptions`
  con `autoFallback`, `fallbackGroup`, `onFallback`.
- [x] T1205 `src/ai/improve.ts`: crear interfaz `ImproveResultWithMeta` extendiendo `ImproveResult`
  con `modelUsed`, `fallbackChain`.
- [x] T1206 `src/ai/improve.ts`: implementar función `runImproveWithFallback` que itera sobre modelos
  del grupo, verifica cuota con `rateLimiter.canMakeRequest`, y hace fallback automático.
- [x] T1207 `src/ai/improve.ts`: en `runImproveWithFallback`, marcar modelo como saturado con
  `rateLimiter.markSaturated` cuando falla por cuota, y llamar `onFallback` si está definido.
- [x] T1208 Smoke visual: verificar que `runImproveWithFallback` funciona con fallback activo e inactivo.

## Fase 2 — Hook `useAiImprove` con fallback

- [x] T1210 `src/hooks/useAiImprove.ts`: agregar estados `currentModel`, `fallbackAttempt`,
  `totalAttempts`, `errorType`.
- [x] T1211 `src/hooks/useAiImprove.ts`: reemplazar llamada a `runImprove` por `runImproveWithFallback`,
  pasando `autoFallback` y `fallbackGroup` del config.
- [x] T1212 `src/hooks/useAiImprove.ts`: implementar callback `onFallback` que actualiza
  `fallbackAttempt` y `currentModel`.
- [x] T1213 `src/hooks/useAiImprove.ts`: agregar mensaje de error para `quota-exhausted` en el mapeo
  de errores.
- [x] T1214 `src/hooks/useAiImprove.ts`: implementar función `goToSettings` que navega a
  `/settings#ia`.
- [x] T1215 `src/hooks/useAiImprove.ts`: exponer nuevos estados y `goToSettings` en el return del hook.
- [x] T1216 Verificar con `tsc --noEmit` y tests existentes.

## Fase 3 — Componente `AiModelSelector`

- [x] T1220 `src/components/ai/AiModelSelector.tsx`: crear componente con props `value`, `onChange`,
  `compact`, `showAvailability`, `disabled`.
- [x] T1221 `src/components/ai/AiModelSelector.tsx`: implementar dropdown que muestra modelos del
  grupo de fallback activo (obtenidos con `getModelsByGroup`).
- [x] T1222 `src/components/ai/AiModelSelector.tsx`: agregar indicadores visuales de cuota usando
  `rateLimiter.getStatus` (verde/amarillo/rojo según disponibilidad).
- [x] T1223 `src/components/ai/AiModelSelector.tsx`: agregar opción "Ir a configuración" con
  separador al final del dropdown.
- [x] T1224 `src/components/ai/AiModelSelector.tsx`: implementar navegación a `/settings#ia` cuando
  se hace clic en "Ir a configuración".
- [x] T1225 `src/components/ai/AiModelSelector.tsx`: cerrar dropdown al seleccionar modelo o al
  hacer clic fuera (usar `useRef` y `useEffect` para click outside).
- [x] T1226 Smoke visual: verificar dropdown en modo compacto junto a un botón.

## Fase 4 — UI mejorada en botones y paneles

- [x] T1230 `src/components/ai/AiImproveButton.tsx`: agregar `AiModelSelector` en modo compacto
  junto al botón "Mejorar con IA".
- [x] T1231 `src/components/ai/AiImproveButton.tsx`: pasar `currentModel` del hook al selector, y
  `onChange` que llama a `setModel` del store.
- [x] T1232 `src/components/ai/AiSuggestionsPanel.tsx`: agregar nuevas props `errorType`,
  `onGoToSettings`, `onChangeModel`, `currentModel`, `fallbackAttempt`, `totalAttempts`.
- [x] T1233 `src/components/ai/AiSuggestionsPanel.tsx`: implementar función `getErrorActions` que
  mapea `errorType` a acciones (showSettings, showChangeModel, showRetry).
- [x] T1234 `src/components/ai/AiSuggestionsPanel.tsx`: mostrar acciones contextuales según
  `getErrorActions`: botón "Ir a configuración", "Cambiar modelo", "Reintentar".
- [x] T1235 `src/components/ai/AiSuggestionsPanel.tsx`: mostrar información de fallback si
  `totalAttempts > 1`: "Intento X de Y modelos intentados".
- [x] T1236 `src/components/ai/AiImproveButton.tsx`: pasar `goToSettings` del hook a
  `AiSuggestionsPanel` como `onGoToSettings`.
- [x] T1237 `src/components/ai/AiImproveButton.tsx`: pasar `errorType`, `currentModel`,
  `fallbackAttempt`, `totalAttempts` del hook a `AiSuggestionsPanel`.
- [x] T1238 Smoke visual: probar todos los escenarios de error (quota-exhausted, rate-limit,
  invalid-key, all-models-exhausted) y verificar que las acciones contextuales aparecen correctamente.

## Fase 5 — Fix de interacción del Popover

- [x] T1240 `src/components/ai/AiModelSelector.tsx`: eliminar `onClick={() => setOpen(!open)}` del
  Button trigger (el Popover maneja el toggle automáticamente con `onOpenChange`).
- [x] T1241 `src/components/ai/AiModelSelector.tsx`: agregar `onInteractOutside={(e) => e.preventDefault()}`
  al PopoverContent para mantener el popover abierto mientras se interactúa con los botones internos.
- [x] T1242 `src/components/ai/AiModelSelector.tsx`: agregar `onClick={(e) => e.stopPropagation()}` y
  `style={{ pointerEvents: "auto" }}` al PopoverContent (patrón oficial de Radix UI).
- [x] T1243 `src/components/ai/AiModelSelector.tsx`: eliminar `onPointerDown` de cada botón
  individual (ya no es necesario con `onInteractOutside`).
- [x] T1244 `src/components/ai/AiModelSelector.tsx`: agregar `type="button"` a todos los botones
  internos para evitar comportamiento de form submit.
- [x] T1245 Verificar con `tsc --noEmit` y `npm run build`.

## Fase 6 — Fix de redirección y sincronización

- [x] T1250 `src/components/ai/AiModelSelector.tsx`: importar `ROUTES` desde `@/routes/paths`.
- [x] T1251 `src/components/ai/AiModelSelector.tsx`: corregir redirección de `/settings#ia` a
  `ROUTES.settings("ia")` (genera `/app/settings#ia`).
- [x] T1252 `src/hooks/useAiImprove.ts`: importar `useEffect` desde React.
- [x] T1253 `src/hooks/useAiImprove.ts`: agregar `useEffect` para sincronizar `currentModel` con
  `config.model` cuando cambia.
- [x] T1254 Verificar con `tsc --noEmit` y `npm run build`.
- [x] T1255 Smoke visual: verificar que al cambiar modelo desde el selector, `currentModel` se
  actualiza inmediatamente sin necesidad de cerrar/abrir la tarea.

## Explícitamente fuera de este tasks.md

- Cambios en `AiSettingsCard.tsx` (ya tiene selector de modelos completo).
- Cambios en `rateLimiter.ts` o `models.ts` (spec 006).
- Cambios en `useAiConfigStore.ts` (ya tiene `setModel`, `autoFallback`, `fallbackGroup`).
- Tests unitarios nuevos (se puede agregar en una fase posterior si es necesario).

## Verificación por fase

Tras cada fase:
- `npx tsc --noEmit` (typecheck)
- `npx vitest run` (tests existentes)
- Smoke visual manual en dev server

No se avanza con typecheck o tests rotos, ni sin confirmación visual. Al cerrar la fase 6:
`npm run build` y verificación final en producción.

## Escenarios de prueba manual

1. **Fallback automático activo, modelo principal saturado**: verificar que intenta automáticamente
   el siguiente modelo del grupo y muestra sugerencias con el modelo alternativo.
2. **Fallback automático inactivo, error de cuota**: verificar que muestra error con botones
   "Cambiar modelo", "Ir a configuración", "Reintentar".
3. **Selector inline**: verificar que cambia de modelo y guarda en el store, y que `currentModel`
   se actualiza inmediatamente sin cerrar/abrir la tarea.
4. **Navegación a settings**: verificar que "Ir a configuración" lleva a `/app/settings#ia` con
   scroll automático a la sección de IA.
5. **Todos los modelos agotados**: verificar que muestra error "Todos los modelos alcanzaron su límite"
   con botón "Ir a configuración".
6. **Interacción del Popover**: verificar que los clicks en "Cambiar modelo" e "Ir a configuración"
   funcionen correctamente sin que el popover se cierre prematuramente.
