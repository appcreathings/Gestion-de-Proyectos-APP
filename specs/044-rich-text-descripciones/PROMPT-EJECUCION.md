# Prompt de ejecución — Spec 044

> Pegar esto como primer mensaje en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 044 de este proyecto: `specs/044-rich-text-descripciones/`.

Es una feature ya planificada: **formato de texto (Markdown + toolbar + preview)** en campos de descripción largos. **No re-diseñes ni re-preguntes el alcance**: ejecutá lo que `spec.md`, `design.md` y `tasks.md` ya fijaron. Si algo es ambiguo en el borde de una decisión ya documentada, elegí la opción alineada a las “Decisiones fijadas” del spec y seguí; solo preguntá si chocás con un invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `Claude.md` del proyecto (raíz) — reglas graphify.
2. `specs/044-rich-text-descripciones/spec.md` — objetivo, decisiones D1–D15, HUs, CA, fuera de alcance.
3. `specs/044-rich-text-descripciones/design.md` — helpers, `RichTextField`, integración, blur/preview, tests.
4. `specs/044-rich-text-descripciones/tasks.md` — fases A→E.
5. Código de referencia ya existente:
   - `src/components/Markdown.tsx` (render con `react-markdown`)
   - `src/components/ui/textarea.tsx`
   - `src/features/projects/components/AreaCard.tsx` (ya renderiza process description con `<Markdown>`)
   - Forms/drawer listados en design §4

## Regla de exploración del repo

Hay grafo en `graphify-out/`. Para ubicar usos de `Textarea` / description: `graphify query "..."` o grep anclado. Al terminar cambios de código: `graphify update .` (AST-only, sin API cost).

## Baseline a verificar al empezar

```bash
npm run typecheck
npm test
npm run lint
```

Anotá el número de tests. **Solo puede subir** (o mantenerse si una fase no añade tests).  
**`SCHEMA_VERSION` se queda en 19** — **no hay migración ni bump**.

## Cómo ejecutar

Seguí `tasks.md` en este orden:

1. **Fase A** — `src/lib/markdownEdit.ts` + tests (`wrapSelection`, `prefixLines`, `insertLink`)
2. **Fase B** — `src/components/forms/RichTextField.tsx` (toolbar + textarea + toggle Editar/Ver + atajos + blur al preview)
3. **Fase C** — Tareas: `TaskFormDialog` + `TaskDetailDrawer` (description)
4. **Fase D** — Project + OverviewTab; Product; Process + ProcessTemplate; ProjectType
5. **Fase E** — typecheck/tests/lint, smoke, marcar spec **IMPLEMENTADO**, `graphify update .`

Después de **cada fase**: `npm run typecheck` + `npm test` (+ lint) limpios antes de la siguiente.  
Al cerrar: `npm run build` si el repo lo usa como gate habitual.

Marcá casillas en `tasks.md` al completar. Actualizá el estado del `spec.md` a **IMPLEMENTADO** al final.

## Decisiones ya fijadas — no re-preguntar

1. **Almacenamiento: Markdown** en `description: z.string()` existente. Sin HTML, sin JSON de editor.
2. **Sin bump de `SCHEMA_VERSION`**, sin migración.
3. **Sin TipTap / Lexical / Plate** en v1. Sin dependencia npm nueva si se puede con helpers + Textarea + botones UI existentes.
4. **Un solo componente** reutilizable `RichTextField` (nombre del design); no copiar toolbar en cada form.
5. **Toolbar v1**: Negrita (`**`), Cursiva (`*`), lista `-`, lista numerada, enlace `[text](url)`, código inline `` ` ``.
6. **Toggle Editar | Ver** — preview con el componente `Markdown` existente.
7. **Alcance v1**: description de Task, Project, Product, Process (+ ProcessTemplate, ProjectType).
8. **Fuera de v1**: comentarios, goals de sprint/quarter, notes de checklist items, chat, textareas de flujos/config, process step text/details, summary de tarea.
9. **Atajos**: Mod+B negrita, Mod+I cursiva. Botones de toolbar con `onMouseDown preventDefault` para no perder selección.
10. **Drawer de tarea**: al pasar a “Ver”, invocar `onBlur` del padre para no perder el persist en blur.
11. **Enlaces al render**: preferir `target="_blank" rel="noopener noreferrer"` en `Markdown.tsx` si es barato.
12. **No** habilitar `rehype-raw`. **No** añadir `remark-gfm` en v1.
13. **AI Improve / tools / RAG**: no cambiar; siguen con el string Markdown tal cual.
14. **Copy en tuteo** (español). Labels: “Descripción”; no asustar con jerga Markdown en el label principal.
15. Cursiva con `*` (no `_`).

## Invariantes (no romper)

- No tocar schema de dominio ni migraciones.
- No reabrir specs ajenas (043 links, 042 anexos, flows, etc.) salvo leer código para integrar.
- `AreaCard` ya usa `<Markdown>` en procesos — no regresar a texto plano.
- Forms que usan AI Improve deben seguir pasando `description` string al panel.
- Accesibilidad: `role="toolbar"`, `aria-label` en botones, Label+id del textarea.
- Principio de UI: reutilizar `Button`, `Textarea`/`textarea` styling, tokens de diseño existentes (no inventar look genérico).

## Definición de hecho

- Fases A–E de `tasks.md` hechas (o deuda explícita solo si está en design §9).
- CA de HU-01…HU-05 cubiertos; fuera de alcance del §8 del spec respetado.
- `npm run typecheck`, `npm test`, `npm run lint` OK; build al cierre si aplica.
- Spec marcada **IMPLEMENTADO**.
- `graphify update .` al final.

## Arranque

Empezá por **A1** (`markdownEdit.ts`). No escribas un plan paralelo: usá `tasks.md` como checklist y reportá al cerrar cada fase qué quedó verde y qué falta.

---
