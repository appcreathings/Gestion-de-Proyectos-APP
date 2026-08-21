# Spec 062 — Tipos de trabajo (historia, enabler, spike, key result, bug, PRD, tarea)

> Estado: **BORRADOR** (listo para implementación; no re-preguntar el alcance)
> Feature dir: `specs/062-tipos-de-trabajo/` · Fecha: 2026-08-20
> Baseline al empezar: `SCHEMA_VERSION` **21** → **22**
> Depende de: 017 (estimate, Kanban filters), 061 (Mis tareas URL)
> No bloquea ni espera el spec de drill-down del dashboard
> Principios: **II** (schema + migración), **IV** (diseño limpio), **V** (simplicidad)

## 1. Contexto

Hito organiza el trabajo así:

```
Producto → Proyecto → Área → {Procesos, Checklists} + Tareas (Kanban)
```

El **Área** es un contenedor operativo (Desarrollo, Diseño, Legal, o un slice de
producto). Tiene dueño, procesos y checklists. Las automatizaciones pueden
marcarla completa. **No es una épica ágil** y este spec no la convierte en una.

La **Tarea** ya tiene estado, prioridad, estimación en horas, tags, sprint, área,
subtareas. No tiene *qué clase de trabajo es*. Un spike de 4 h, un bug, un PRD
y una historia de usuario se ven iguales. Eso impide filtrar, priorizar y
explicar el tablero.

Este spec agrega un **tipo de trabajo en la tarea**. El Área sigue siendo el
bucket. No hay entidad Épica nueva ni padre/hijo entre tareas.

## 2. Objetivo

Que cada ítem del Kanban declare su naturaleza, se filtre por ella (Kanban y
Mis tareas) y, en tres tipos, tenga un matiz de UI:

| Tipo | Para qué existe |
|------|-----------------|
| **Tarea** (default) | Trabajo genérico. Sin badge extra. |
| **Historia** | Incremento con valor de usuario. |
| **Enabler** | Infra, arquitectura o compliance que desbloquea historias. |
| **Spike** | Prueba de concepto **acotada en tiempo**. La estimación es el time-box. |
| **Key result** | Resultado medible que se **sigue** en el tablero (no un módulo OKR nuevo). |
| **Bug** | Defecto. |
| **PRD** | El documento de requisitos **es** la descripción de la tarea. |

## 3. Por qué no otras formas (descartado)

| Enfoque | Por qué no |
|---------|------------|
| Convertir Área en épica | Rompe procesos, checklists, tipos de proyecto, `markAreaComplete`. Un área “Legal” no es una historia. |
| Colgar historias/spikes en el Área | La estimación ya vive en la tarea. El Área no es un work item. |
| Entidad `Epic` aparte | Tercer nivel innecesario. El Área ya agrupa. |
| Módulo OKR (objetivos + KR anidados) | Product ya tiene `objectives`. Un KR como *tipo de tarea* alcanza para asignar, fechar y verlo en el tablero. |
| PRD como archivo/entidad de Biblioteca | El PM quiere el PRD **en el flujo de trabajo** (estado, dueño, fecha). La descripción rica (044) ya es el cuerpo. |

## 4. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| D1 | Campo `Task.workType` (no `kind`: esa palabra ya es `entityRef`, flows, notificaciones). | Evita colisiones. |
| D2 | Enum cerrado: `task` \| `story` \| `enabler` \| `spike` \| `key_result` \| `bug` \| `prd`. Default **`task`**. | Lista acordada; default silencioso para lo existente. |
| D3 | Área **no cambia**. Sin padre/hijo de tareas. Sin renombrar “Área” a “Épica” en la UI. | El Área sigue siendo el slice del proyecto. |
| D4 | `SCHEMA_VERSION` **21 → 22**. Migración identidad: Zod default + `newTask()` escribe `workType: "task"`. Pasos `{ to: 22, up: (d) => d }` en `projects` y `flows`. | Mismo patrón que comments/links/estimate. |
| D5 | Badge de tipo en `TaskCard` / lista de Mis tareas **solo si `workType !== "task"`**. | No ensuciar el 80 % de tarjetas genéricas. |
| D6 | Filtro URL `workType=` en Kanban (`TasksTab`) y Mis tareas. Entra en “Limpiar filtros” de Mis tareas (D11 del 061). | Mismo contrato que `priority`. |
| D7 | **Spike:** no hay campo nuevo. `estimate` se etiqueta “Time-box (h)” y un texto de ayuda. Sin time-box no se bloquea el guardado. | Reusa estimate; el spike puede nacer vacío. |
| D8 | **Key result:** tres campos opcionales en `Task`: `krCurrent`, `krTarget` (`number \| null`), `krUnit` (`string`, default `""`). La UI de métrica **solo** se muestra si `workType === "key_result"`. Cambiar de tipo **no borra** los números (por si vuelven). | Un KR sin métrica es una etiqueta vacía; no inventamos un módulo OKR. |
| D9 | **PRD:** el cuerpo es `description` (Markdown ya existente). Helper bajo el campo: “El PRD vive en la descripción.” Sin schema extra. | 044 ya resolvió el documento. |
| D10 | Bug / historia / enabler: solo el enum + label + badge. Sin prioridad automática, sin workflow distinto. | YAGNI. |
| D11 | `create_task` / `update_task` de la IA aceptan `workType` opcional (y KR si aplica). Default `task`. | El asistente no puede mentir el tipo. |
| D12 | `CreateTaskOutput` de flows gana `workType` opcional. Default al crear: `task`. | Misma línea que `tags`/`estimate`. |
| D13 | Copy en tuteo. Labels ES en UI; valores EN en JSON. | Consistencia 030/040/061. |
| D14 | GitHub issue types, Daily, calendario, bulk-edit de tipo, demo seed masivo: **fuera de v1**. Daily puede ignorar el badge. | No inflar el spec. |
| D15 | Invalid `workType` en URL: se ignora (no filtra), igual que `priority` basura en 061. | Defensivo. |

## 5. Modelo de datos

```ts
export const WorkType = z.enum([
  "task",
  "story",
  "enabler",
  "spike",
  "key_result",
  "bug",
  "prd",
]);
export type WorkType = z.infer<typeof WorkType>;

// En TaskSchema, junto a status/priority:
workType: WorkType.default("task"),
krCurrent: z.number().nullable().default(null),
krTarget: z.number().nullable().default(null),
krUnit: z.string().default(""),
```

Labels (`src/domain/labels.ts`):

| valor | label | badge variant |
|-------|--------|----------------|
| `task` | Tarea | (no se pinta) |
| `story` | Historia | `secondary` |
| `enabler` | Enabler | `outline` |
| `spike` | Spike | `warning` |
| `key_result` | Key result | `default` |
| `bug` | Bug | `destructive` |
| `prd` | PRD | `outline` |

Helper `workTypeLabel` / `workTypeVariant`. Lista ordenada de UI:

`story`, `enabler`, `spike`, `key_result`, `bug`, `prd`, `task`.

## 6. Semántica por tipo (contrato de producto)

### Tarea (`task`)
Trabajo que no justifica otra etiqueta. Default de `newTask`, flujos, IA y datos viejos.

### Historia (`story`)
Entrega valor a un usuario o cliente. Vive bajo un Área. Se estima en horas como hoy.

### Enabler (`enabler`)
Trabajo que **no** es valor directo de usuario pero desbloquea historias (plataforma,
migración, observabilidad, permiso legal). Se filtra para ver “qué nos está trabando”.

### Spike (`spike`)
Investigación o PoC **con techo de tiempo**. `estimate` = horas máximas a gastar, no
promesa de entrega. Al vencer el time-box se decide: otra historia, otro spike, o se
cierra. El Kanban no auto-cierra spikes.

### Key result (`key_result`)
Un resultado que el equipo **persigue** (ej. “NPS 40 → 55”, “1000 trials/mes”).
No reemplaza `Product.objectives`. Es el KR puesto en el tablero: tiene dueño, fecha
y estado. La barra de avance es `krCurrent / krTarget` cuando ambos son números
finitos y `krTarget !== 0`. `krUnit` es sufijo de display (`%`, `usuarios`).

### Bug (`bug`)
Defectos. Mismo workflow que una tarea.

### PRD (`prd`)
El ítem *es* el documento. Título = nombre del PRD. Descripción = cuerpo. Estado
`todo` = borrador, `doing` = en revisión, `done` = aprobado (convención de uso,
no se valida). Anexos (042) para mockups.

## 7. Historias de usuario

### HU-01 — Elegir tipo al crear/editar · **núcleo**

**Como** PM, **quiero** marcar el tipo de una tarea **para** que el tablero distinga
spikes, bugs y PRDs.

- [ ] Select **Tipo** en `TaskFormDialog` y `TaskDetailDrawer` (junto a prioridad).
- [ ] Default al crear: Tarea.
- [ ] Al cambiar a Spike, el label de estimación pasa a “Time-box (h)” + ayuda.
- [ ] Al cambiar a Key result, aparecen Actual / Meta / Unidad.
- [ ] Al cambiar a PRD, aparece el helper de descripción.
- [ ] Guardar persiste `workType` (y KR si aplica).

### HU-02 — Ver el tipo de un vistazo

- [ ] `TaskCard`: badge con label si `workType !== "task"`.
- [ ] Mis tareas (fila): el mismo criterio, a la izquierda del badge de prioridad
      o junto al título.
- [ ] Kanban lista (`KanbanListView`): igual que la card.

### HU-03 — Filtrar por tipo

- [ ] Kanban: el menú Filtros gana **Tipo** (Todas + los 7). Param `workType`.
      Se combina AND con área/sprint/prioridad/assignee/fecha/búsqueda.
- [ ] Mis tareas: Select **Tipo**; param `workType`; entra en Limpiar filtros.
- [ ] `filterAndSortMyTasks` recorta por `query.workType` después de prioridad
      y antes de fecha (un paso más en el pipeline 061).
- [ ] Valor inválido: se ignora.

### HU-04 — Key result medible

- [ ] Si tipo = key result, drawer muestra los tres campos numéricos/texto.
- [ ] Si `krCurrent` y `krTarget` son números y target ≠ 0, una barrita
      `clamp(current/target, 0, 1)` en drawer y, compacta, en la card.
- [ ] Vacío es válido (KR cualitativo por ahora).
- [ ] Inputs no numéricos no se guardan como `NaN` (se deja `null`).

### HU-05 — IA y flujos no inventan otro default

- [ ] `create_task` / `update_task` aceptan `workType` (enum). Ausente → `task`.
- [ ] `CreateTaskOutput.workType` opcional; `newTask` cubre el default.
- [ ] Serializers de tarea (`taskView`) incluyen `workType` para que la IA lo lea.

## 8. Archivos (mapa)

| Archivo | Cambio |
|---------|--------|
| `src/domain/schemas/common.ts` | `WorkType` enum; `SCHEMA_VERSION` 22 |
| `src/domain/schemas/project.ts` | `workType`, `kr*` en `TaskSchema` |
| `src/domain/schemas/flow.ts` | `workType` opcional en `CreateTaskOutputSchema` |
| `src/domain/schemas/index.ts` | reexport si hace falta |
| `src/domain/factories.ts` | `newTask`: `workType: "task"`, KR null/"" |
| `src/domain/migrations.ts` | `{ to: 22 }` en `projects` y `flows` |
| `src/domain/migrations.test.ts` | target 22 |
| `src/domain/labels.ts` | `workTypeLabel`, `workTypeVariant`, orden UI |
| `src/features/projects/components/TaskFormDialog.tsx` | select + hints |
| `src/features/projects/components/kanban/TaskDetailDrawer.tsx` | select + KR + hints |
| `src/features/projects/components/kanban/TaskCard.tsx` | badge + KR compacto |
| `src/features/projects/components/kanban/KanbanListView.tsx` | badge |
| `src/features/projects/components/TasksTab.tsx` | filtro `workType` |
| `src/features/my-tasks/filterMyTasks.ts` | parse/filter/clear |
| `src/features/my-tasks/filterMyTasks.test.ts` | caso workType |
| `src/features/my-tasks/MyTasksPage.tsx` | select Tipo + fila |
| `src/ai/tools/write/task.ts` | input + execute |
| `src/ai/tools/serializers.ts` | `workType` en vista |
| `src/automations/engine.ts` o factory path de flows `createTask` | pasar workType si viene |
| UI de config del nodo createTask (si ya lista tags/estimate) | select opcional |

## 9. Tests

Vitest, sin test de componente de página salvo que ya exista patrón barato.

1. `newTask().workType === "task"`; KR null.
2. Zod parse de tarea vieja (sin `workType`) → default `task`.
3. Migración projects v21 → v22 (identidad, `schemaVersion` 22).
4. `filterAndSortMyTasks` con `workType: "bug"` deja solo bugs; `null` no recorta; valor basura ignorado en parse.
5. Labels: los 7 valores tienen label.
6. Tools: `create_task` acepta `workType` y lo persiste (extender test de shapes: el campo es opcional, no required).

## 10. Fuera de alcance

- Renombrar o re-tipar Áreas.
- Épicas, jerarquía de tareas, historias hijas.
- Módulo OKR (objetivos de producto/trimestre).
- Auto-cerrar spikes al gastar el time-box.
- Mapear tipos de GitHub Issues.
- Forzar prioridad en bugs.
- Daily / calendario / informe de estado / dashboard (el dashboard podrá usar `workType` después).
- Bulk-edit de tipo.
- Traducir “Enabler”/“Spike”/“Key result”/“PRD”/“Bug” al español largo (se quedan así: son jerga de producto conocida).

## 11. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| `kind` vs `workType` en tools/IA | Nombre de campo fijo; descripción del tool dice “tipo de trabajo (workType)” |
| Kanban Filter dropdown se llena | Un Select más, mismo patrón que prioridad; no un segundo menú |
| KR con target 0 | No pintar barra; no dividir |
| Flujos viejos | Campo opcional; `newTask` default |

## 12. Definición de hecho

- [ ] HU-01…HU-05
- [ ] Tests §9 verdes; `typecheck` + suite (`--exclude ".worktrees/**"`)
- [ ] Migración 22 en projects y flows
- [ ] `graphify update .`
- [ ] Spec → **IMPLEMENTADO**
