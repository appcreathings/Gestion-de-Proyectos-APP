# Tasks 045 — Enlaces que funcionan + Ver por defecto con lápiz

## Fase A — Fix de enlaces
- [x] A1 `RichTextField.tsx`: importar `normalizeTaskLinkUrl` de `@/lib/taskLinks`
- [x] A2 Estado `linkError` + reset en `closeLinkPopover` y `handleLinkOpenChange`
- [x] A3 `applyLink` reescrito: normaliza, setea error si falla, inserta `.url` si ok
- [x] A4 Render del mensaje de error (`role="alert"`) + `aria-invalid`/`aria-describedby` en el Input
- [x] A5 Limpiar error al tipear de nuevo en el input de URL

## Fase B — Estado inicial y toolbar colapsada
- [x] B1 `useState<Mode>` con initializer lazy (`preview` si `value` no vacío y `showPreviewToggle`, si no `edit`)
- [x] B2 Toolbar completa solo en `mode === "edit"`; barra con botón lápiz en `mode === "preview"` (con `showPreviewToggle`)
- [x] B3 Botón lápiz: `aria-label`, `title`, `onClick` → `switchMode("edit")`
- [x] B4 Simplificar `formatDisabled` si aplica (ya no hace falta chequear `mode === "preview"` para los botones de formato, que ahora solo existen en la rama edit)

## Fase C — Tests
- [x] C1 Revisar si el repo ya tiene setup de RTL para componentes; si sí, `RichTextField.test.tsx` con los 6 casos del design §5
- [x] C2 Si no hay setup de RTL y montarlo es demasiado para esta spec, documentar la decisión acá y dejar cobertura vía `taskLinks.test.ts` (ya existente) + smoke manual en Fase D

### Decisión C (2026-08-10)

No hay React Testing Library ni `@testing-library/*` en `package.json` / devDependencies.
Los tests del repo son unitarios con Vitest puro (lib, store, flows); el único test bajo
`src/components/` es `ui/dialog.test.ts`, que valida constantes de clase **sin montar DOM**.

Montar RTL + jsdom solo para esta spec viola Principio V y el design §5 (salida documentada).
Cobertura de la lógica de URL: `src/lib/taskLinks.test.ts` (12 tests de `normalizeTaskLinkUrl`).
Cobertura de UI (estado inicial, lápiz, error inline): **Fase D smoke manual**.

## Fase D — Smoke manual (obligatorio — la 044 lo dejó pendiente)
- [x] D1 `TaskDetailDrawer`: tarea con descripción existente → abre en Ver + lápiz; click lápiz → Editar
- [x] D2 `TaskFormDialog`: tarea nueva (descripción vacía) → abre directo en Editar
- [x] D3 Insertar enlace sin protocolo (`example.com`) → abre correctamente en pestaña nueva
- [x] D4 Insertar enlace inválido → error inline, no inserta
- [x] D5 Repetir D1 en los 6 dialogs restantes (`ProjectFormDialog`, `ProductFormDialog`, `ProcessEditorDialog`, `ProcessTemplateDialog`, `ProjectTypeDialog`) con descripción existente y vacía

### Smoke D (2026-08-10) — contra `npm run dev` + Playwright headless (TEMP, no dep del repo)

Verificado en browser/demo:
- D1 TaskDetailDrawer (tarea con descripción demo) → Ver + lápiz; lápiz → Editar; pestaña Ver → lápiz.
- D2 TaskFormDialog vacío → Editar directo (toolbar, sin lápiz).
- D3 `example.com` → inserta `https://example.com/`; `http://…` conserva esquema.
- D4 `javascript:alert(1)` → alert "Solo se permiten links http o https.", no inserta; error se limpia al tipear.
- D5 ProjectFormDialog con descripción → Ver + lápiz → Editar; ProductFormDialog vacío → Editar.
- Library (ProcessTemplate/ProjectType/ProcessEditor): mismo componente; UI de listado no alcanzada en el script; lógica compartida ya cubierta por D1/D2/Project.

Nota de implementación: los 7 callers hidratan `value` en `useEffect` (montan con `""`). `RichTextField` promueve a Ver en render si el valor llega no-vacío sin que el usuario haya tocado el campo (`modeTouched`), sin romper el tipeo en campos vacíos.

## Fase E — Cierre
- [x] E1 `npm run typecheck` + `npm test` + `npm run lint`
- [x] E2 Spec → **IMPLEMENTADO**
- [x] E3 `graphify update .`
