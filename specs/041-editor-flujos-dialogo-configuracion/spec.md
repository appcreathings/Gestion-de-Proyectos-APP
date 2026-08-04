# Spec 041 — Editor de flujos: diálogo de configuración acorde al nodo

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/041-editor-flujos-dialogo-configuracion/` · Fecha: 2026-08-02
> Antecede: 040 (sistema `DialogContent size` transversal).
> Baseline al empezar: **857 tests en 80 archivos**, `tsc` limpio, build OK.

## 1. Contexto

La spec 040 introdujo el sistema de tamaños de diálogo (`DialogContent size="sm"|"md"|"lg"|"full"`,
en `dialog.tsx:12-17`) y asignó `size` a los ~26 diálogos de la app. El editor de flujos
(`/app/flows/:id`) quedó fuera de ese barrido: en `FlowCanvas.tsx:655-656` un único `Dialog` con
`size="sm"` aloja los cuatro tipos de nodo por igual.

Dos problemas verificados:

1. **Tamaño fijo demasiado pequeño para transform y action.** `size="sm"` (`md:max-w-md`, ~448px)
   comprime `TransformConfigFields` (mapeo origen→destino en `grid sm:grid-cols-2` en
   `TransformConfigFields.tsx:472`; preview de código con scroll horizontal en `:599`) y
   `ActionConfigFields` (selector de conexión, muestras, picker de variables, guía de firma HMAC).
   Las filas de mapeo quedan en columnas de ~190px; el preview de código ya necesita scroll
   horizontal en un contenedor angosto.

2. **`AppsScriptGuide` usa overlay manual, no el `Dialog` compartido.** En
   `AppsScriptGuide.tsx:472-474` un `<div className="fixed inset-0 …">` reemplaza a Radix Portal.
   Se usa en `IntegrationsPage.tsx:289` (top-level, funciona) y en `TriggerStep.tsx:632` (anidado
   dentro de `TriggerNodeDrawer` → `DialogContent` de `FlowCanvas.tsx:656`). La clase base de
   `DialogContent` incluye siempre `sm:-translate-x-1/2 sm:-translate-y-1/2` (`dialog.tsx:48`) —
   un ancestro con `transform` convierte a sus descendientes `position: fixed` en relativos a esa
   caja (~448px × 70vh, más `overflow-hidden`). Resultado: la guía paso a paso de Make/Zapier no
   cubre la pantalla cuando se abre desde el trigger en el editor de flujos. Contraste:
   `WebhookSignatureGuide.tsx:167` sí usa `<DialogContent size="lg">` y porta correctamente.

## 2. Objetivo

Que cada tipo de nodo del editor de flujos se configure en un diálogo con el ancho que su
contenido pide, y que `AppsScriptGuide` use el mismo primitivo Radix que el resto de la app para
escapar del árbol DOM del diálogo padre.

## 3. Decisiones fijadas (tomadas al planificar, no re-preguntar)

- **Tamaño por `kind` de nodo, no un único `size` fijo.** `FlowCanvas.tsx` calcula el `size` según
  `selectedNode.data.kind` mediante una función pura `nodeConfigDialogSize(kind)` (testeable en
  Node). Sin quinto tamaño en `DIALOG_SIZE` — se reutilizan los cuatro de spec 040.
- **Asignación:** `trigger` y `condition` → `md`; `transform` y `action` → `lg`. El trigger incluye
  `TriggerStep` completo (webhook Make/Zapier, muestras); `md` (~672px) basta. Transform y action
  necesitan el ancho de `lg` (~896px) para filas de mapeo y controles densos sin scroll horizontal
  en viewport ~1280px.
- **`AppsScriptGuide` migra al patrón de `WebhookSignatureGuide`.** `<Dialog>` + `<DialogContent
  size="lg">` + `DialogHeader`/`DialogBody`/`DialogFooter`. Sin rediseño interno de pasos ni textos.
- **Auditoría de overlays manuales.** Barrido `fixed inset-0` en `src/**/*.tsx`: solo
  `AppsScriptGuide` tenía el bug de anidamiento dentro de un `Dialog`; el resto son top-level o
  drawers laterales documentados en `design.md` §3.
- **Verificación por lógica pura + `smoke.md` manual**, igual que 036-040. Sin jsdom.
- **Sin cambio de schema.** Solo CSS/montaje de diálogos.

## 4. Historias de usuario y criterios de aceptación

### HU-01 — Diálogo de nodo con tamaño acorde · **DEFECTO**
Como usuario que configura un nodo transform o action en el editor de flujos, quiero ver el
contenido sin scroll horizontal ni columnas aplastadas.

**Causa raíz:** ver §1.1. Un solo `size="sm"` para los cuatro tipos.

- **CA-01.1** `FlowCanvas.tsx` pasa a `DialogContent` un `size` derivado de
  `nodeConfigDialogSize(selectedNode.data.kind)`.
- **CA-01.2** `transform` y `action` usan `lg`; `trigger` y `condition` usan `md`.
- **CA-01.3** En viewport de escritorio (~1280px), las filas de mapeo de `TransformConfigFields`,
  el preview de código y los controles de `ActionConfigFields` entran sin overflow horizontal.
- **CA-01.4** `nodeConfigDialogSize` es función pura exportada y testeada.

### HU-02 — Guía Apps Script escapa del diálogo padre · **DEFECTO**
Como usuario que configura un webhook Make/Zapier desde el trigger en el editor de flujos,
quiero que "Ver guía paso a paso" cubra la pantalla completa igual que desde Integraciones.

**Causa raíz:** ver §1.2. Overlay `fixed inset-0` sin Portal, clippeado por `transform` del
`DialogContent` ancestro.

- **CA-02.1** `AppsScriptGuide` usa `Dialog`/`DialogContent` de `dialog.tsx`, no overlay manual.
- **CA-02.2** `size="lg"` (contenido de guía comparable a `WebhookSignatureGuide`).
- **CA-02.3** Funciona igual desde `IntegrationsPage.tsx:289` y desde `TriggerStep.tsx:632`
  (dentro del diálogo de nodo en el canvas).
- **CA-02.4** `WebhookSignatureGuide` no se rompe — sigue usando el mismo primitivo.

### HU-03 — Sin más overlays anidados rotos
Como mantenedor, quiero confirmar que no quede otro `fixed inset-0` manual con el mismo patrón
dentro de un `Dialog`.

- **CA-03.1** Barrido documentado en `design.md` §3: cada hallazgo con archivo, uso y riesgo.
- **CA-03.2** Ningún otro overlay manual dentro de un `Dialog` de Radix requiere corrección en
  esta spec (los demás son top-level o drawers de página).

## 5. Fuera de alcance (explícito)

- **`applyMapping`, motor de flujos, contenido de `ConditionConfigFields`/`TransformConfigFields`/
  `ActionConfigFields`.** Solo el contenedor (`size`) cambia; no el formulario interno.
- **Rediseño de pasos/textos/código de `AppsScriptGuide`.** Solo montaje como diálogo.
- **Quinto tamaño en `DIALOG_SIZE`.** Los cuatro de spec 040 bastan; ver `design.md` §1.
- **Reabrir spec 040** ni tocar diálogos fuera del editor de flujos y `AppsScriptGuide`.

## 6. Principios afectados (gobernanza)

- **Principio IV (Diseño limpio y enfocado):** HU-01 y HU-02 son claridad visual y uso correcto
  de primitivos accesibles (Radix Portal).
- **Principio V (Simplicidad):** reutiliza `DIALOG_SIZE` existente; una función pura para el
  mapeo kind→size; migración mecánica de `AppsScriptGuide` copiando el patrón ya probado en
  `WebhookSignatureGuide`.

## 7. Riesgos

- **R1 — Cambiar el ancho del diálogo de nodo puede desplazar el layout interno** si algún hijo
  dependía de ~448px. Mitigación: smoke manual de los cuatro tipos de nodo; solo ensanchamos, no
  estrechamos.
- **R2 — `AppsScriptGuide` con `Dialog` anidado en otro `Dialog`.** Radix soporta diálogos
  apilados; el hijo porta a `document.body` y escapa del `transform` del padre. Mitigación: smoke
  del caso Make/Zapier desde el canvas.
- **R3 — Regresión en Integraciones** al migrar `AppsScriptGuide`. Mitigación: smoke desde
  `IntegrationsPage` además del canvas.
