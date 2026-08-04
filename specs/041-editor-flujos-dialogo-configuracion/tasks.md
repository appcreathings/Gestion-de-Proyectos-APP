# Tasks 041 — Editor de flujos: diálogo de configuración acorde al nodo

> Numeración T4100+. Fases verticales; cada fase deja la app usable y se verifica
> (`tsc --noEmit` + Vitest + `vite build` + lint). Sin cambio de schema/migración.
> `∥` = paralelizable. Cada tarea ancla a `design.md`.
> Baseline al empezar: **857 tests en 80 archivos** (post spec 040).

## Fase A — Tamaño por tipo de nodo (HU-01) · **DEFECTO**

- **T4100** **nuevo** `canvas/nodeConfigDialog.ts`: `nodeConfigDialogSize(kind: FlowNodeKind):
  DialogSize` — trigger/condition → `md`, transform/action → `lg`. (design §A3, CA-01.2, CA-01.4)
- **T4101** `FlowCanvas.tsx:656`: reemplazar `size="sm"` fijo por
  `size={selectedNode ? nodeConfigDialogSize(selectedNode.data.kind) : "md"}`. (design §A3,
  CA-01.1)
- **T4102** Tests de `nodeConfigDialogSize`: los cuatro kinds devuelven el tamaño esperado.
  (design §5)
- **Checkpoint A:** `tsc` + Vitest + build + lint; smoke — abrir nodo transform y action: diálogo
  notablemente más ancho que antes; trigger y condition en tamaño mediano.

## Fase B — AppsScriptGuide al Dialog compartido (HU-02) · **DEFECTO** · ∥ con A

Independiente del tamaño del diálogo de nodo; puede ir en paralelo.

- **T4110** `AppsScriptGuide.tsx`: eliminar overlay `fixed inset-0` manual; envolver en
  `<Dialog>` + `<DialogContent size="lg" description="…">` siguiendo patrón de
  `WebhookSignatureGuide.tsx:164-171`. (design §B3, CA-02.1, CA-02.2)
- **T4111** Reestructurar header/footer/progreso con `DialogHeader`, `DialogBody`, `DialogFooter`;
  quitar botón ✕ manual. Reset de `currentStep` al cerrar vía `onOpenChange`. (design §B3)
- **T4112** Verificar que `IntegrationsPage.tsx:289` y `TriggerStep.tsx:632` no requieren cambios
  de props — la interfaz `AppsScriptGuideProps` se mantiene. (CA-02.3)
- **Checkpoint B:** smoke — guía Make/Zapier desde editor de flujos cubre pantalla completa;
  misma guía desde Integraciones sin regresión; `WebhookSignatureGuide` intacto.

## Fase C — Cierre

- **T4120** Documentar barrido `fixed inset-0` en `design.md` §3 (ya previsto; confirmar en
  implementación). (CA-03.1, CA-03.2)
- **T4121** Verificación final: `tsc --noEmit`, Vitest completo, `vite build`, lint. Delta de tests
  desde 857.
- **T4122** `graphify update .` y confirmar `smoke.md` completo.
- **T4123** Smoke manual de los cuatro tipos de nodo + guías (ver `smoke.md`).

## Secuencia sugerida

`(A ∥ B)` → `C`.

A y B no comparten archivos salvo que ambos importan de `dialog.tsx` (sin modificarlo). Pueden
implementarse en cualquier orden.

## Invariantes (no violar)

- **`DIALOG_SIZE` de spec 040 no cambia.** Cuatro tamaños bastan; sin quinto por comodidad.
- **`applyMapping` y campos de config no se rediseñan.** Solo el contenedor (`size`) y el montaje
  de `AppsScriptGuide`.
- **Interfaz pública de `AppsScriptGuide` intacta** (`open`, `onOpenChange`, `provider`).
- **El número de tests solo sube** respecto al baseline de 857.
