# Tasks 065 — Color de tareas: escala de urgencia en pastel

Fases secuenciales. Después de cada una: `npx tsc --noEmit` y
`npx vitest run --exclude ".worktrees/**"` verdes.

Baseline: **1333 tests / 141 archivos**. `SCHEMA_VERSION` **23, sin bump**.

> Estado: **IMPLEMENTADO**. Cierre: 1360 tests / 143 archivos (+16 de
> contraste, +10 de taskUrgency, +1 de tonos de tipo de trabajo).
> `--success` ajustado a L 32 % en ambos temas para cumplir AA (ver
> `design.md` §2.1). F5 (smoke manual con navegador) quedó pendiente de
> verificación humana; todo lo demás está verificado por tests.

## Fase A — Tokens y contraste

- [x] A1 Familia `soft` en `:root` y `.dark` de `src/index.css` (design §2.2):
      `destructive`, `warning`, `success`, `info` (nuevo), `primary`
- [x] A2 Bajar croma de los sólidos `--destructive` / `--warning` / `--success`
      en ambos temas (design §2.1)
- [x] A3 `tailwind.config.js`: sub-claves `soft` y `soft-foreground` en los
      cuatro tokens + entrada `info`
- [x] A4 `src/lib/contrast.test.ts`: función de ratio WCAG + tabla de los 10
      pares `soft` y los 6 sólidos; todos ≥ 4.5:1
- [x] A5 Si algún par falla, ajustar la **luminosidad** en `index.css` (no bajar
      el umbral) y anotar el valor final en `design.md` §2
      → `--success` claro `142 58% 38%→32%` (4.67:1), oscuro `142 52% 44%→32%`
      (4.95:1); los valores previos tampoco cumplían (3.52 / 2.70)

## Fase B — Badge

- [x] B1 `badge.tsx`: `destructive` / `warning` / `success` pintan con su par
      `soft`; nueva variante `info`; nueva variante `neutral`; `outline` gana
      `border-border text-muted-foreground` (design §3)
- [x] B2 Recorrer los usos de `<Badge variant="destructive">` en avisos y
      notificaciones y anotar en spec §9 los que queden demasiado callados
      (**anotar, no arreglar**) → listado en spec §9

> Al cerrar B la app entera ya se ve pastel: los nombres de variante no
> cambiaron, así que salud, sprints y trimestres heredan el cambio.

## Fase C — Dominio de urgencia

- [x] C1 `src/domain/taskUrgency.ts`: `UrgencyLevel`, `SOON_WINDOW_DAYS`,
      `taskUrgency(task, now)` (design §4). Sin imports de UI
      (firma `Pick<Task, "status" | "priority" | "dueDate">` para que los
      chips de calendario también la usen)
- [x] C2 `src/domain/taskUrgency.test.ts` con los 10 casos de design §4.1,
      todos con `now` fijo
- [x] C3 `src/lib/urgencyStyles.ts`: `TONES`, `TONE_KEYS`, `URGENCY_RAIL`,
      `URGENCY_ARIA` (design §5) + `TONE_BARS` y `URGENCY_DOT` (consumidos
      por los calendarios). Clases literales, nunca interpoladas

## Fase D — Superficies de tarea

- [x] D1 `TaskCard.tsx`: riel `border-l-[3px]`, `opacity-70` en `done`, y
      **borrar** las tres líneas de lavado/borde rojo (design §5.1)
- [x] D2 `TaskCard.tsx`: `aria-label` incluye el nivel vía `URGENCY_ARIA`
- [x] D3 `KanbanListView.tsx`: mismo riel (en el primer `<td>` — un `<tr>`
      sin `border-collapse` no pinta bordes), sin `bg-red-50` / `bg-amber-50`
- [x] D4 `MyTasksPage.tsx`: ídem
- [x] D5 `labels.ts`: `priorityVariant` → neutro en los cuatro valores (D7;
      `low` queda `outline`, el resto `neutral`)
- [x] D6 `labels.ts` + `WorkTypeBadge.tsx`: tipos de trabajo a los tonos de
      design §7 (`workTypeTone`: teal/sky/neutral); `bug` deja de ser rojo
- [x] D7 `TaskCard.tsx`: área, sprint y responsable a `outline` neutro (D8)
- [x] D8 Badge de fecha usa el `soft` del tono del riel, no `destructive` a
      secas (D10): `overdue`→destructive(rose soft), `soon`→warning(amber soft)
- [x] D9 Verificar que no queda ningún `overdue &&` / `dueSoon &&` calculado a
      mano en una superficie de tarea (HU-05) → también migrados drawer,
      daily y chips/timelines de calendario; los que quedan son reportes y
      filtros con `settings.dueSoonDays` (spec 017, otro contrato)

## Fase E — Calendarios y colores sueltos

- [x] E1 `PortfolioCalendarView.tsx`: borrar `PROJECT_COLORS` local, consumir
      `TONES` / `TONE_KEYS` de `urgencyStyles.ts`
- [x] E2 `TaskCalendarView.tsx`: ídem (hoy tenía 4 tonos contra los 6 del otro);
      `SPRINT_BAR` → `TONE_BARS` de la misma tabla
- [x] E3 `TaskDetailDrawer.tsx`: `STATUS_PILL` lee de la tabla común
      (blocked→`TONES.rose`, done→`TONES.teal`); chips de fecha a `soft`;
      riel del panel via `URGENCY_RAIL`; sufijo de fecha con
      `*-soft-foreground`; `PRIORITY_DOT` sin tono (D1/D7)
- [x] E4 `DailyStandupPage.tsx`: `text-red-600` / `text-green-600` /
      `text-blue-600` / `text-red-500` a tokens; `TaskItem` con riel y regla única
- [x] E5 Barrido final: `grep -E "(bg|text|border)-(red|amber|green|blue)-[0-9]"`
      en `src/features` — migrados: `TriggerStep` (aviso azul → `info-soft`),
      `SyncLogsPage` (flechas → tokens), `KanbanColumn` (lavado WIP →
      `bg-warning-soft`), timelines (pastillas → `TONES`, puntos →
      `URGENCY_DOT`). Justificados (iconos decorativos del canvas de flujos,
      no superficies de tarea): `flows/canvas/meta.ts` y
      `flows/canvas/nodeTypes.tsx`

## Fase F — Cierre

- [x] F1 `npx tsc --noEmit` + `npx vitest run --exclude ".worktrees/**"` +
      `npx eslint src` (lint: mismo error/warnings preexistentes del baseline
      en `useBreakpoint.ts` y afines, sin problemas nuevos)
- [x] F2 Comparar a ojo la tabla de `contrast.test.ts` contra `index.css`
      (design §6: la duplicación es deliberada y esta es su contrapartida)
- [x] F3 `graphify update .` → 6401 nodos, 361 comunidades
- [x] F4 `spec.md` → **IMPLEMENTADO**; casillas de este archivo
- [ ] F5 Smoke manual (si hay navegador): Kanban claro y oscuro con una tarea de
      cada nivel, lista, Mis tareas, drawer, ambos calendarios — pendiente de
      ejecutar con navegador
