# Design 041 — Editor de flujos: diálogo de configuración acorde al nodo

> Decisiones técnicas para `spec.md`. Ancladas al código actual (líneas verificadas post-040).
> Sin cambio de schema. Complementa spec 040 §C2 en el único diálogo del editor que quedó con
> `size="sm"` fijo.

## 0. Mapa de archivos tocados (previsto)

| Área | Archivos | Naturaleza |
|------|----------|------------|
| A · Tamaño por tipo de nodo | **nuevo** `canvas/nodeConfigDialog.ts`; `canvas/FlowCanvas.tsx` | Función pura kind→size + cableado |
| B · AppsScriptGuide → Dialog | `integrations/guides/AppsScriptGuide.tsx` | Overlay manual → Radix Portal |
| C · Auditoría overlays | (solo documentación en §3) | Sin cambios salvo A y B |

**Sin cambios de comportamiento** en: `applyMapping`, `ConditionConfigFields`, `TransformConfigFields`,
`ActionConfigFields`, `TriggerStep` (contenido), `dialog.tsx` (`DIALOG_SIZE` intacto),
`WebhookSignatureGuide.tsx`. Sin `schemaVersion` nuevo (Principio II).

---

## 1. Área A — Tamaño del diálogo de nodo (HU-01)

### A1. El defecto, con precisión

`FlowCanvas.tsx:655-656`:

```tsx
<Dialog open={selectedNode !== undefined} onOpenChange={(o) => !o && setSelectedId(null)}>
  <DialogContent size="sm" description="Configura el nodo seleccionado del flujo: …">
```

`size="sm"` → `md:max-w-md` (~448px) en `dialog.tsx:13`. Los cuatro `kind` comparten esa caja:

| `kind` | Componente hijo | Densidad |
|--------|-----------------|----------|
| `trigger` | `TriggerNodeDrawer` → `TriggerStep` | Media (webhook, muestras, guía) |
| `condition` | `ConditionConfigFields` | Media |
| `transform` | `TransformConfigFields` | Alta (grid 2 cols, `<pre>` preview) |
| `action` | `ActionConfigFields` | Alta (conexión, variables, guía HMAC) |

### A2. Por qué no hace falta un quinto tamaño

Los tope de spec 040 (`design.md` §C2):

| `size` | `md:max-w-*` | Uso en esta spec |
|--------|--------------|------------------|
| `sm` | `md` (448px) | **Demasiado** para transform/action; ya no se usa aquí |
| `md` | `2xl` (672px) | trigger, condition |
| `lg` | `4xl` (896px) | transform, action, AppsScriptGuide |
| `full` | `5xl` + h fija | Solo lienzo maximizado del canvas |

A ~1280px de viewport, `lg` deja ~896px de ancho útil — suficiente para
`TransformConfigFields.tsx:472` (`sm:grid-cols-2` → ~430px por columna) y el `<pre>` de `:599`
sin scroll horizontal en condiciones normales.

### A3. Función pura

Nuevo `src/features/flows/canvas/nodeConfigDialog.ts`:

```ts
import type { FlowNodeKind } from "@/flows/graph";
import type { DialogSize } from "@/components/ui/dialog";

/** Tamaño del diálogo de configuración de nodo según su kind (spec 041). */
export function nodeConfigDialogSize(kind: FlowNodeKind): DialogSize {
  switch (kind) {
    case "trigger":
    case "condition":
      return "md";
    case "transform":
    case "action":
      return "lg";
  }
}
```

Cableado en `FlowCanvas.tsx`:

```tsx
<DialogContent
  size={selectedNode ? nodeConfigDialogSize(selectedNode.data.kind) : "md"}
  description="Configura el nodo seleccionado del flujo: disparador, condición, transformación o acción."
>
```

El fallback `"md"` solo aplica mientras `selectedNode` es truthy (el `Dialog` ya está condicionado);
si el diálogo cierra, `selectedNode` es `undefined` y el contenido no renderiza hijos de config.

---

## 2. Área B — AppsScriptGuide al Dialog compartido (HU-02)

### B1. El defecto, con precisión

`AppsScriptGuide.tsx:472-474`:

```tsx
return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border …">
```

Sin `DialogPrimitive.Portal`. Anidado en `TriggerStep.tsx:632` dentro del `DialogContent` de
`FlowCanvas`, el `fixed inset-0` queda clippeado porque `dialog.tsx:48` aplica
`sm:-translate-x-1/2 sm:-translate-y-1/2` — el containing block del padre.

### B2. Patrón de referencia

`WebhookSignatureGuide.tsx:164-171` (mismo dominio, ya correcto):

```tsx
export function WebhookSignatureGuide({ open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg" description="Cómo verificar la firma HMAC-SHA256 …">
        <DialogHeader>
          <DialogTitle>Cómo verificar la firma del webhook</DialogTitle>
        </DialogHeader>
        <DialogBody>{/* contenido */}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}
```

### B3. Migración mecánica (sin rediseño de pasos)

1. Importar `Dialog`, `DialogContent`, `DialogHeader`, `DialogBody`, `DialogFooter`, `DialogTitle`
   desde `@/components/ui/dialog`.
2. Envolver el return en `<Dialog open={open} onOpenChange={handleOpenChange}>` donde
   `handleOpenChange` resetea `currentStep` a `0` al cerrar (igual que `handleFinish`).
3. Sustituir el `<div fixed inset-0>` externo por `<DialogContent size="lg"
   description="Guía paso a paso para desplegar el proxy de Apps Script.">`.
4. Header manual → `DialogHeader` + `DialogTitle` (+ subtítulo de paso en `DialogDescription`
   visible o párrafo bajo el título).
5. Zona scrollable → `DialogBody` (ya trae `overflow-y-auto`).
6. Barra de progreso: entre `DialogHeader` y `DialogBody`, o como primer hijo de `DialogBody`.
7. Footer manual → `DialogFooter` con botones Anterior/Siguiente/Finalizar.
8. Eliminar botón ✕ manual — `DialogContent` incluye cierre Radix (`dialog.tsx:67-70`).
9. Early return cuando `!open`: no necesario; Radix controla montaje con `open`.

`size="lg"` (`md:max-w-4xl`) es ligeramente más ancho que el antiguo `max-w-3xl` (768px) — aceptable
y alineado con `WebhookSignatureGuide`.

---

## 3. Área C — Auditoría `fixed inset-0` (HU-03)

Resultado de `grep -rn "fixed inset-0" src --include=*.tsx`:

| Archivo | Uso | ¿Anidado en Dialog? | Acción |
|---------|-----|---------------------|--------|
| `AppsScriptGuide.tsx:473` | Modal guía proxy | **Sí** (desde canvas) | **Corregir** (Área B) |
| `dialog.tsx:84` | `DialogOverlay` Radix | N/A (es el primitivo) | OK |
| `FlowCanvas.tsx:546` | Modo maximizado canvas | No (es el canvas) | OK |
| `AppLayout.tsx:299,305` | Sidebar móvil | Top-level | OK |
| `AssistantPanel.tsx:73,84` | Panel asistente | Top-level | OK |
| `DeliveryDetailDrawer.tsx:143` | Drawer lateral derecho | Top-level | OK |
| `FlowRunDetailDrawer.tsx:20` | Drawer lateral | Top-level | OK |
| `TaskDetailDrawer.tsx:339` | Backdrop drawer kanban | Top-level | OK |
| `QuickAddTask.tsx:64,72` | Montado en `AppLayout.tsx:376` | Top-level | OK |
| `WipLimitConfig.tsx:37,45` | Montado en `TasksTab.tsx:933` | Top-level | OK |
| `KeyboardShortcutsModal.tsx:31,39` | Montado en `AppLayout.tsx:369` | Top-level | OK |

El editor de flujos ya usa `ShortcutsDialog.tsx` (Dialog Radix) para atajos — no
`KeyboardShortcutsModal`. Ningún otro caso requiere cambio en esta spec.

---

## 4. Accesibilidad

- `DialogContent description` en `AppsScriptGuide` anuncia el propósito de la guía (CA-04 de 040).
- El diálogo de nodo conserva su `description` existente en `FlowCanvas.tsx:656`.
- Radix Portal del hijo (`AppsScriptGuide`) no roba foco permanentemente del padre: al cerrar la
  guía, el foco vuelve al trigger según comportamiento estándar de Radix apilado.

## 5. Verificación (por fase)

- `tsc --noEmit` limpio · Vitest completo verde · `vite build` OK · lint sin errores nuevos.
- **Cuenta de tests:** baseline **857**. Se añade test de `nodeConfigDialogSize`; el total sube.
- **Tests nuevos (unidad, sin DOM):**
  - `nodeConfigDialogSize`: cada `FlowNodeKind` devuelve el `DialogSize` esperado.
- **Smoke visual:** ver `smoke.md`.
- **`graphify update .`** al terminar cada fase.
