# Tasks 044 — Formato de texto en descripciones

## Fase A — Helpers
- [x] A1 `src/lib/markdownEdit.ts` — `wrapSelection`, `prefixLines`, `insertLink`
- [x] A2 `src/lib/markdownEdit.test.ts` — casos del design §6

## Fase B — Componente
- [x] B1 `RichTextField` — toolbar + textarea + toggle Editar/Ver
- [x] B2 Atajos Mod+B / Mod+I; `onMouseDown` prevent en botones
- [x] B3 Enlace vía popover (o prompt documentado)
- [x] B4 `onBlur` al pasar a preview (compat drawer)
- [x] B5 Ajustes menores `Markdown.tsx` (links nueva pestaña si falta)

## Fase C — Tareas (núcleo UX)
- [x] C1 `TaskFormDialog` → RichTextField
- [x] C2 `TaskDetailDrawer` description → RichTextField

## Fase D — Resto de descripciones
- [x] D1 `ProjectFormDialog` + `OverviewTab` (Markdown en lectura)
- [x] D2 `ProductFormDialog`
- [x] D3 `ProcessEditorDialog` + `ProcessTemplateDialog`
- [x] D4 `ProjectTypeDialog`

## Fase E — Cierre
- [x] E1 `npm run typecheck` + `npm test`
- [ ] E2 Smoke manual (tarea, proyecto, proceso) — pendiente verificación humana
- [x] E3 Spec → **IMPLEMENTADO**
- [x] E4 `graphify update .` (opcional al commitear)
