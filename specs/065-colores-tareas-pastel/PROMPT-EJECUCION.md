# Prompt de ejecución — Spec 065

> Pegar esto como **primer mensaje** en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 065 de este proyecto: `specs/065-colores-tareas-pastel/`.

Es una feature ya diseñada: **el color de una tarea pasa a significar una sola
cosa — urgencia — y toda la app baja a una paleta pastel**. **No re-diseñes ni
re-preguntes el alcance**: ejecutá `spec.md`, `design.md` y `tasks.md`. Si algo
es ambiguo en el borde de una decisión ya documentada, elegí la opción de
"Decisiones fijadas" (§4 del spec) y seguí. Solo preguntá si chocás con un
invariante real o un bug bloqueante.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` — reglas graphify. Hay grafo en `graphify-out/`:
   `graphify query "..."` antes de leer a ciegas; `graphify update .` al terminar.
2. `specs/065-colores-tareas-pastel/spec.md` — D1–D15, la escala de urgencia de
   §5, las HUs y el fuera de alcance. **Esto manda.**
3. `specs/065-colores-tareas-pastel/design.md` — valores HSL, snippets de
   `badge.tsx`, `taskUrgency.ts`, `urgencyStyles.ts` y el test de contraste.
4. `specs/065-colores-tareas-pastel/tasks.md` — fases A→F.
5. Código de referencia (releerlo; puede haber cambiado):
   - `src/index.css` (tokens, `:root` y `.dark`)
   - `tailwind.config.js`
   - `src/components/ui/badge.tsx`
   - `src/domain/labels.ts` (`priorityVariant`, `workTypeVariant`)
   - `src/domain/compute.ts` (`daysUntil`)
   - `src/features/projects/components/kanban/TaskCard.tsx` (~L117-119: los tres lavados)
   - `src/features/projects/components/kanban/KanbanListView.tsx` (~L65-66)
   - `src/features/my-tasks/MyTasksPage.tsx` (~L359-360)
   - `src/features/projects/components/kanban/TaskDetailDrawer.tsx` (~L47 `STATUS_PILL`)
   - `src/features/projects/components/kanban/WorkTypeBadge.tsx`
   - `src/features/projects/calendar/PortfolioCalendarView.tsx` (~L42 `PROJECT_COLORS`)
   - `src/features/projects/calendar/TaskCalendarView.tsx` (~L43, la copia con 4 tonos)
   - `src/features/daily/DailyStandupPage.tsx` (colores sueltos)

## Baseline al empezar

```bash
npx tsc --noEmit
npx vitest run --exclude ".worktrees/**"
npx eslint src
```

Al escribir esta spec: **1333 tests en 141 archivos, verdes**. Puede haber
subido. Solo puede subir o mantenerse.

**`SCHEMA_VERSION` sigue 23. NO hay bump y NO hay migración.** Si te encontrás
escribiendo una migración, parate: te saliste del alcance.

## Cómo ejecutar

Seguí `tasks.md` en orden A→F. Después de **cada fase**: typecheck + vitest con
`--exclude ".worktrees/**"`.

1. **A — Tokens** (`index.css`, `tailwind.config.js`) + el test de contraste.
   El test es parte de la fase, no del cierre: es lo que decide si los valores
   propuestos sirven.
2. **B — `Badge`**. Al terminar B la app entera ya se ve pastel, porque los
   nombres de variante no cambian y las ~40 llamadas existentes heredan.
3. **C — Dominio**: `taskUrgency` + su test + la tabla de clases. Sin tocar UI.
4. **D — Superficies de tarea**: riel, borrar lavados, badges a neutro.
5. **E — Calendarios** y limpieza de colores sueltos.
6. **F — Cierre**: spec IMPLEMENTADO, `graphify update .`.

Commits por fase, mensajes tipo `feat(ui): add soft token family (spec 065)`.
PowerShell: `git commit -m "mensaje"` (sin heredoc).

Trabajá en una rama (`feat/065-colores-tareas-pastel`), no en `main`, salvo que
te pidan lo contrario.

## Decisiones ya fijadas — no re-preguntar

1. **El color significa urgencia.** Nada más usa color de tono en superficies de tarea.
2. Escala de 6 niveles, **primera condición que aplica gana**, en este orden:
   `done` → `overdue` → `blocked` → `soon` → `priority` → `calm`.
3. `done` va **antes** que `overdue`: una tarea hecha no es urgente aunque haya vencido.
4. Vencida + bloqueada pinta **rosa** (gana `overdue`); el candado sigue diciendo
   que está bloqueada.
5. `high` y `critical` comparten el nivel `priority`. La diferencia la dice el texto.
6. `soon` incluye el día 0. **No** hay nivel "vence hoy" aparte.
7. La familia `soft` va **en paralelo** a los sólidos, no los reemplaza: el botón
   destructivo sigue siendo sólido.
8. Los **nombres** de variante de `Badge` no cambian; cambia lo que pintan.
9. El riel mide 3 px y está **siempre presente** (transparente cuando no hay
   nivel) para que nada se desplace.
10. Prioridad, área, sprint y responsable son **neutros**.
11. `bug` deja de ser rojo. `rose`, `amber`, `violet` y `blue` quedan reservados
    a urgencia; los tipos de trabajo usan `teal`, `sky` o neutro.
12. Fuera: esquema, color por área/proyecto/tarea, landing, blog, `/docs`,
    `AttachmentsSection`, selector de paleta en Ajustes.
13. Copy en español, tuteo. Valores internos en inglés.

## Invariantes (no romper)

- **Sin cambio de esquema.** `SCHEMA_VERSION === 23` al terminar.
- `taskUrgency` no importa nada de UI ni clases de Tailwind (D13).
- Las clases de Tailwind van **literales**: nada de `` `border-l-${tone}-400` ``,
  no compilaría al pasar el escáner de Tailwind.
- Ningún nivel se comunica **solo** por color (D11): cada uno conserva su
  portador de texto o icono, y el nivel entra en el `aria-label` de la tarjeta.
- Todo par `soft` debe cumplir **AA 4.5:1** en claro y oscuro. Si un valor
  propuesto no llega, se ajusta la luminosidad — **no** se baja el umbral del test.
- No tocar `WorkTypeBadge`'s regla de 062 D5: una tarea `task` sigue sin pastilla.
- No tocar el contrato de URL de 061/062 ni los filtros.
- Vitest **nunca** debe correr tests de `.worktrees/`.
- Principio V: una tabla de tonos, no tres copias (hoy hay dos en los calendarios).

## Definición de hecho

- [ ] Fases A–F en `tasks.md`
- [ ] HU-01…HU-06 del spec
- [ ] `SCHEMA_VERSION === 23` (sin tocar)
- [ ] `contrast.test.ts` verde: 16 pares ≥ 4.5:1
- [ ] `taskUrgency.test.ts` verde: los 10 casos
- [ ] Cero `bg-red-50` / `bg-amber-50` / `border-l-red-500` en superficies de tarea
- [ ] typecheck + tests + lint verdes con exclude de worktrees
- [ ] `graphify update .`
- [ ] `spec.md` → **IMPLEMENTADO**

Si al terminar el usuario quiere merge: skill `finishing-a-development-branch`;
no pushees a origin a menos que te lo pidan.
