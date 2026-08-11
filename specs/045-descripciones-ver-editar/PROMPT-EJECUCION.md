# Prompt de ejecución — Spec 045

> Pegar esto como primer mensaje en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 045 de este proyecto: `specs/045-descripciones-ver-editar/`.

Es una feature ya planificada: **arreglar la inserción de enlaces en `RichTextField`** (spec
044) para que el URL siempre sea válido, y **cambiar el estado inicial del editor** para que
arranque en modo Ver (con un ícono de lápiz para pasar a Editar) cuando ya hay contenido, y
en Editar directo cuando el campo está vacío. **No re-diseñes ni re-preguntes el alcance**:
ejecutá lo que `spec.md`, `design.md` y `tasks.md` ya fijaron. Si algo es ambiguo en el borde
de una decisión ya documentada, elegí la opción alineada a las "Decisiones fijadas" del spec
y seguí; solo preguntá si chocás con un invariante real o un bug bloqueante no previsto.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` del proyecto (raíz) y `.claude/CLAUDE.md` — reglas graphify. Este repo tiene
   grafo en `graphify-out/`: usá `graphify query "..."` / `graphify explain "..."` antes de
   leer archivos fuente a ciegas, y `graphify update .` al terminar.
2. `specs/045-descripciones-ver-editar/spec.md` — contexto, root cause del bug de enlaces,
   objetivo, decisiones D1–D11, HUs, CA, fuera de alcance.
3. `specs/045-descripciones-ver-editar/design.md` — cambios exactos en `applyLink`, estado
   inicial lazy, colapso de toolbar, tests.
4. `specs/045-descripciones-ver-editar/tasks.md` — fases A→E.
5. Código de referencia ya existente (leerlo, no asumirlo):
   - `src/components/forms/RichTextField.tsx` (componente a modificar — es TODO el diff de
     esta spec, ningún otro archivo de producto cambia)
   - `src/lib/taskLinks.ts` (`normalizeTaskLinkUrl` — a reusar, no modificar salvo bug real)
   - `src/lib/markdownEdit.ts` (`insertLink` — no cambia, sigue recibiendo URL ya
     normalizada)
   - `src/components/Markdown.tsx` (render, ya abre links en pestaña nueva desde la 044)
   - `specs/044-rich-text-descripciones/` completa (spec, design, tasks) — es la feature
     base sobre la que esta spec corrige y extiende; **no reabras su alcance**, solo el
     `RichTextField.tsx` que dejó construido.

## Baseline a verificar al empezar

```bash
npm run typecheck
npm test
npm run lint
```

Anotá el número de tests. **Solo puede subir** (o mantenerse si una fase no añade tests).
`SCHEMA_VERSION` se queda en 19 — **no hay migración ni bump**.

## Cómo ejecutar

Seguí `tasks.md` en este orden:

1. **Fase A** — Fix de enlaces: `applyLink` usa `normalizeTaskLinkUrl`, estado `linkError`,
   render del mensaje inline, reset del error al reabrir el popover o al tipear de nuevo.
2. **Fase B** — Estado inicial lazy (`preview` si hay contenido, `edit` si está vacío) +
   toolbar colapsada a un botón de lápiz en modo Ver.
3. **Fase C** — Tests: revisá primero si el repo ya tiene setup de React Testing Library
   para componentes (buscá otros `*.test.tsx` de componentes, no solo de `lib/`) antes de
   decidir cómo cubrir esto; el design documenta una salida si no lo hay — no instales un
   test runner nuevo para esto.
4. **Fase D** — Smoke manual **obligatorio**: la spec 044 dejó exactamente este paso sin
   verificar (por eso apareció el bug de enlaces). Corré `npm run dev`, abrí la app y probá
   a mano en el drawer de tarea y en al menos 2 de los 6 dialogs restantes: insertar un
   enlace sin protocolo, insertar uno inválido, y el toggle Ver↔Editar con descripción
   vacía y con descripción existente.
5. **Fase E** — typecheck/tests/lint, marcar spec **IMPLEMENTADO**, `graphify update .`.

Después de **cada fase**: `npm run typecheck` + `npm test` (+ lint) limpios antes de la
siguiente. Al cerrar: `npm run build` si el repo lo usa como gate habitual.

Marcá casillas en `tasks.md` al completar. Actualizá el estado del `spec.md` a
**IMPLEMENTADO** al final.

## Decisiones ya fijadas — no re-preguntar

1. **Fix de enlaces reusa `normalizeTaskLinkUrl()`** de `src/lib/taskLinks.ts` tal cual
   existe hoy — no duplicar lógica de normalización/validación de URL.
2. URL inválida → mensaje de error de `normalizeTaskLinkUrl` inline en el popover, no se
   inserta nada, el popover queda abierto.
3. URL válida → se inserta la URL **normalizada** (`.url` que devuelve
   `normalizeTaskLinkUrl`, con protocolo antepuesto si faltaba), no el texto crudo del
   input.
4. Estado inicial del editor: `value` no vacío al montar → `mode = "preview"` (Ver); `value`
   vacío → `mode = "edit"`. Calculado con initializer **lazy** de `useState`, no en efecto.
5. En modo Ver, la toolbar completa **no se muestra** — solo un botón de lápiz
   (`aria-label="Editar descripción"`). Click en el lápiz → `mode = "edit"`, aparece la
   toolbar completa igual que hoy (con las pestañas Editar\|Ver existentes).
6. **Volver de Editar a Ver es manual**, vía la pestaña "Ver" ya existente — **no** hay
   auto-colapso al perder foco del contenedor. Esto ya fue decidido con el usuario
   explícitamente; no reabrir esa discusión.
7. El `onBlur` del padre se sigue invocando al pasar **hacia** `"preview"` (mecanismo ya
   existente de la 044, necesario para el guardado en `TaskDetailDrawer`) — no tocar esa
   parte. Ir hacia `"edit"` (click en el lápiz) **no** dispara `onBlur`.
8. Alcance: todo el cambio vive en `src/components/forms/RichTextField.tsx`. Los 7 puntos de
   uso (`TaskFormDialog`, `TaskDetailDrawer`, `ProjectFormDialog`, `ProductFormDialog`,
   `ProcessEditorDialog`, `ProcessTemplateDialog`, `ProjectTypeDialog`) **no se tocan** —
   siguen pasando `value`/`onChange`/`onBlur` igual que hoy.
9. `src/lib/markdownEdit.ts` **no cambia** — `insertLink` sigue siendo un helper puro de
   texto sin conocimiento de URLs; la normalización pasa en `RichTextField`, no ahí.
10. Sin dependencias npm nuevas. Sin cambios de schema/migración.
11. Copy en tuteo/español — reusar los mensajes de `normalizeTaskLinkUrl` tal cual están
    redactados, no inventar copy nuevo para los errores.

## Invariantes (no romper)

- No tocar schema de dominio ni migraciones.
- No reabrir el alcance de la spec 043 (links de tarea) ni de la 044 (editor Markdown) más
  allá de leer su código para integrar correctamente.
- `normalizeTaskLinkUrl` y sus tests (`taskLinks.test.ts`) no se modifican salvo que
  encuentres un bug real en ella durante esta spec — si pasa, documentalo explícitamente
  antes de tocarla, no la "arregles" de paso sin decirlo.
- El guardado por `onBlur` en `TaskDetailDrawer` (persist de `description`) debe seguir
  funcionando exactamente igual que hoy al ir de Editar a Ver por la pestaña.
- Accesibilidad: el botón lápiz necesita `aria-label`, `title`, `type="button"`; el error de
  URL necesita `role="alert"`.
- Principio de UI: reusar `Button`, `Input`, `Popover` y tokens de diseño ya usados en el
  resto de `RichTextField.tsx` — no inventar un look nuevo para el botón de lápiz ni para el
  mensaje de error.

## Definición de hecho

- Fases A–E de `tasks.md` hechas.
- CA de HU-01, HU-02, HU-03 del `spec.md` cubiertos.
- `npm run typecheck`, `npm test`, `npm run lint` OK; build al cierre si aplica.
- Smoke manual de la Fase D hecho de verdad (no solo marcado) — es exactamente lo que faltó
  en la spec 044 y causó este bug.
- Spec marcada **IMPLEMENTADO**.
- `graphify update .` al final.

## Arranque

Empezá por **A1** (`RichTextField.tsx`: importar `normalizeTaskLinkUrl`). No escribas un
plan paralelo: usá `tasks.md` como checklist y reportá al cerrar cada fase qué quedó verde y
qué falta.

---
