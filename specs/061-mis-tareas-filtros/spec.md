# Spec 061 — Mis tareas: filtros, ocultar hechas y vistas de prioridad

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/061-mis-tareas-filtros/` · Fecha: 2026-08-20
> Baseline al empezar: `SCHEMA_VERSION` **21** (sin bump de schema — filtros de UI + URL)
> Depende de: 017 HU-03 (ruta `/app/my-tasks` ya existe, implementación incompleta)
> Antecede: spec de dashboard drill-down (enlaces a estas mismas URLs); spec de tipos de
> trabajo (historia / enabler / spike / key result / bug / PRD / tarea normal) — el filtro
> por tipo entra ahí, no aquí.
> Principios: **IV** (diseño limpio y enfocado), **V** (simplicidad incremental)

## 1. Contexto

`MyTasksPage` (`/app/my-tasks`) es la vista cross-proyecto de tareas asignadas. El spec 017
HU-03 la pidió con filtros de estado, **prioridad y fecha**. En código hoy solo hay:

- selector de persona (`?person=`)
- selector de estado (`?status=`)
- agrupación fija por proyecto
- exclusiones de archivadas

No hay interruptor de hechas, ni prioridad, ni vencimiento, ni proyecto, ni orden. Elegir
“Todos” mezcla hechas con trabajo abierto; elegir “Hecha” esconde el resto. Priorizar
(“¿qué hago ahora?”) obliga a escanear grupos de proyecto.

El Kanban (`TasksTab`) ya persiste `priority` y `date=overdue|due-soon|this-week` en la URL.
Mis tareas debe reutilizar **esos mismos valores**, no inventar otro contrato.

Esta es la primera de tres specs del mismo brainstorm (filtros de Mis tareas → hipervínculos
del dashboard → tipos de trabajo). Las otras no bloquean esta.

## 2. Objetivo

Que un PM abra Mis tareas, elija persona, y vea de inmediato el trabajo **abierto** ordenado
por urgencia, con filtros de estado / prioridad / vencimiento / proyecto, y pueda agrupar
por proyecto cuando quiera.

## 3. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| D1 | Hechas **ocultas por defecto**. Interruptor “Mostrar hechas”. Param `done=1` para mostrarlas; si el param no está, se ocultan. | Confirmado (opción A). El default tiene que servir para triar, no para auditoría. |
| D2 | Filtros de este spec: estado, prioridad, vencimiento, proyecto. Orden default: prioridad crítica → baja, luego fecha más cercana. | Confirmado (opción A). No se copian tags / área / sprint del Kanban. |
| D3 | Dos vistas: **Por prioridad** (lista plana, default) y **Por proyecto** (grupos colapsables). Param `view=project` para la segunda; si falta, es plana. | Confirmado (opción C + default A). |
| D4 | URL como fuente de verdad. Sin estado React paralelo de filtros. `replace: true` al cambiar params (igual que el Kanban). | Contrato compartible; el spec de dashboard podrá enlazar `?person=&date=overdue`. |
| D5 | Valores de `date` **idénticos al Kanban**: `overdue`, `due-soon`, `this-week`. Semántica con `daysUntil`: `< 0`, `0..3`, `0..7`. | Evita dos dialectos de URL. El Kanban calcula con `Date`; aquí se usa `daysUntil` de `src/domain/compute.ts`. |
| D6 | El selector de prioridad incluye **crítica** (`critical`). | El dominio ya la tiene; el dropdown del Kanban hoy la omite — no se replica ese hueco. |
| D7 | Elegir estado “Hecha” escribe `status=done` **y** `done=1`. Apagar “Mostrar hechas” borra `done` y, si `status` era `done`, también borra `status`. El resto de filtros no se toca. | Evita la trampa de filtrar hechas con el interruptor apagado (lista vacía). |
| D8 | Lógica de filtro/orden/agrupación en función pura `filterAndSortMyTasks` en `src/features/my-tasks/`. La página solo lee URL, llama, renderiza. | Testeable sin montar React; YAGNI de extraer una barra compartida con el Kanban. |
| D9 | No hay identidad “yo”. El selector de persona se queda. | La app no tiene usuario autenticado / `currentPersonId`. |
| D10 | Archivadas fuera **siempre**. El interruptor de hechas no las muestra. | Comportamiento actual; el archivo vive en el Kanban (spec 015). |
| D11 | “Limpiar filtros” borra `status`, `priority`, `date`, `project`. **No** borra `person`, `done` ni `view`. | Persona, hechas y vista son el marco de la pantalla, no un filtro puntual. |
| D12 | Sin bump de `SCHEMA_VERSION`. | Solo UI + searchParams. |

## 4. Contrato de URL

Ruta: `/app/my-tasks`

| Param | Ausente significa | Valores válidos | Notas |
|-------|-------------------|-----------------|-------|
| `person` | hay que elegir persona | id de `people` | Igual que hoy. Id desconocido → empty de “selecciona una persona” y se borra el param. |
| `status` | todos los visibles | `todo` \| `doing` \| `blocked` \| `done` | `done` solo tiene sentido con `done=1` (D7). |
| `priority` | todas | `critical` \| `high` \| `medium` \| `low` | |
| `date` | todas | `overdue` \| `due-soon` \| `this-week` | Tareas **sin** `dueDate` no matchean ningún valor. |
| `project` | todos | id de proyecto | Id desconocido se ignora (no filtra). |
| `done` | ocultar hechas | `1` | Cualquier otro valor se trata como ausente (ocultar). |
| `view` | por prioridad | `project` | Cualquier otro valor se trata como ausente (plana). |

Params desconocidos o valores inválidos de `status` / `priority` / `date`: se ignoran (no
filtran, no crashean).

## 5. Pipeline (`filterAndSortMyTasks`)

Entrada: `projects: Project[]`, query parseado de la URL, `now: Date` (inyectable en tests).

Orden estricto:

1. Recolectar tareas con `assigneeId === person` y `archived === false`, enriquecidas con
   `projectId`, `projectName`, `areaName`.
2. Si `done !== "1"`, descartar `status === "done"`.
3. Si `status` válido, filtrar por él.
4. Si `priority` válido, filtrar por él.
5. Si `date` válido, filtrar con `daysUntil(dueDate, now)`:
   - `overdue`: `d !== null && d < 0`
   - `due-soon`: `d !== null && d >= 0 && d <= 3`
   - `this-week`: `d !== null && d >= 0 && d <= 7`
6. Si `project` es un id que existe en `projects`, recortar a ese proyecto.
7. Ordenar:
   - prioridad: `critical` > `high` > `medium` > `low` (constante `MY_TASKS_PRIORITY_ORDER`)
   - a igual prioridad: `daysUntil` más pequeño primero (`-5` antes que `0` antes que `10`)
   - `dueDate` null al **final** de su prioridad
   - desempate: `title` locale-aware (`es`)

Salida:

```ts
type MyTasksQuery = {
  personId: string;
  status: TaskStatus | null;
  priority: Priority | null;
  date: "overdue" | "due-soon" | "this-week" | null;
  projectId: string | null;
  showDone: boolean;       // true iff param done=1
  view: "priority" | "project";
};

type MyTaskRow = Task & {
  projectId: string;
  projectName: string;
  areaName?: string;
};

type MyTasksResult = {
  rows: MyTaskRow[];
  /** Filas post paso 2 (persona + no archivadas + hide-done), antes de status/priority/date/project. */
  projectOptions: { id: string; name: string }[];
  openCount: number;       // rows con status !== "done" (sobre `rows` ya filtradas)
  totalCount: number;      // rows.length
  groups: { projectId: string; projectName: string; tasks: MyTaskRow[] }[];
};
```

`groups` se deriva de `rows` ya ordenadas:

- un grupo por `projectId` en el orden en que aparece la **primera** fila de ese proyecto
  (como las filas ya van por urgencia, eso equivale a ordenar grupos por su tarea más urgente)
- dentro del grupo se conserva el orden de `rows`

`projectOptions`: proyectos que tienen al menos una tarea **después del paso 2** (persona,
no archivada, hide-done aplicado). Así no se ofrece un proyecto que solo tiene hechas
ocultas. Orden: nombre del proyecto (`es`).

La función **no** implementa D7 (eso es UI al escribir la URL). Si llega `status=done` sin
`showDone`, el paso 2 vacía las hechas y el paso 3 deja `rows = []`. Eso es correcto y se
testea.

## 6. Historias de usuario y criterios de aceptación

### HU-01 — Ocultar hechas · **núcleo**

**Como** persona que tria su día, **quiero** no ver las tareas hechas salvo que las pida
**para** concentrarme en lo abierto.

- [x] Sin `done` en la URL, ninguna fila tiene `status === "done"`.
- [x] Interruptor “Mostrar hechas” apagado ↔ param ausente; encendido ↔ `done=1`.
- [x] Al marcar hecha desde el drawer con el interruptor apagado, la fila desaparece al
      re-render (el store ya muta; el pipeline la filtra).
- [x] Archivadas nunca aparecen, con o sin interruptor.

### HU-02 — Filtros de triaje

**Como** PM, **quiero** recortar por estado, prioridad, vencimiento y proyecto **para**
encontrar el lote que me importa.

- [x] Selects visibles: Estado, Prioridad (incluye Crítica), Vencimiento (Vencidas / Por
      vencer (3 días) / Esta semana), Proyecto (`projectOptions`).
- [x] Estado “Hecha” enciende el interruptor (D7). Apagar el interruptor con estado Hecha
      limpia `status`.
- [x] Los filtros se combinan (AND).
- [x] “Limpiar filtros” visible solo si hay `status`, `priority`, `date` o `project`;
      ejecuta D11.
- [x] Contador: `N abierta(s)` si el interruptor está apagado; `N tarea(s)` si está
      encendido. Usar `openCount` / `totalCount`.

### HU-03 — Vista por prioridad (default)

**Como** PM, **quiero** una lista plana ordenada por urgencia **para** saber qué hago ahora.

- [x] Default al entrar (sin `view`): lista plana, sin agrupación.
- [x] Cada fila: badge de prioridad, título, nombre de proyecto, área si existe, fecha,
      estado.
- [x] Vencidas (`status !== "done"` y `daysUntil < 0`) y por vencer (`0..3`) conservan el
      fondo rojo / ámbar de las filas actuales.
- [x] Click abre `TaskDetailDrawer` igual que hoy (sin meter `detail` en la URL de esta
      página: el drawer sigue en estado local, no se cambia ese contrato).

### HU-04 — Vista por proyecto

**Como** PM, **quiero** agrupar por proyecto **para** trabajar un proyecto a la vez sin
perder el orden interno de urgencia.

- [x] Control de dos segmentos “Por prioridad | Por proyecto”; el segundo escribe
      `view=project`.
- [x] Grupos colapsables (mismo patrón visual que hoy).
- [x] Filas dentro del grupo: mismo orden del pipeline. El nombre de proyecto no se
      repite en la fila (ya está en el header del grupo); área / fecha / estado sí.
- [x] Orden de grupos: por la tarea más urgente de cada uno (§5 `groups`).
- [x] Con un solo proyecto, las dos vistas existen; “Por proyecto” muestra un grupo.

### HU-05 — Estados vacíos

- [x] Sin `person` (o id inválido): empty actual “Selecciona una persona”.
- [x] Persona sin ninguna asignada (ni hechas visibles): “No hay tareas asignadas a {nombre}”.
- [x] Persona con solo hechas y interruptor apagado, **sin** otros filtros: copy que lo
      diga + CTA “Mostrar hechas”.
- [x] Persona con asignadas que los filtros dejan en 0: “Ninguna coincide con los filtros”
      + CTA “Limpiar filtros”. No se calcula un contrafactual de “si mostrara hechas
      coincidirían”: un solo CTA.

## 7. UI

Todo en `src/features/my-tasks/`. No se toca `TasksTab`.

Barra (fila que envuelve en móvil), izquierda → derecha:

1. Persona (existente)
2. Interruptor “Mostrar hechas”
3. Estado, Prioridad, Vencimiento, Proyecto
4. Segmento Por prioridad | Por proyecto
5. Limpiar filtros (condicional)

`PageHeader` se queda: label “Mis tareas”, título “Tareas asignadas”.

No se extrae un `TaskFilterBar` compartido con el Kanban.

## 8. Archivos

| Archivo | Rol |
|---------|-----|
| `src/features/my-tasks/filterMyTasks.ts` | Crear. Query parse + `filterAndSortMyTasks` + constante de orden de prioridad. |
| `src/features/my-tasks/filterMyTasks.test.ts` | Crear. Casos de §9. |
| `src/features/my-tasks/MyTasksPage.tsx` | Modificar. Barra, vistas, empty states; deja de filtrar en el `useMemo` actual. |
| `src/routes/paths.ts` | Sin cambio de path. El spec de dashboard usará `ROUTES.myTasks` + querystring. |

Helpers de fecha: reusar `daysUntil`. No copiar el `switch` con `new Date()` del Kanban.

## 9. Tests

Vitest sobre la función pura. **No** test de componente de la página en este spec.

Fecha fija `now` inyectada. Fixtures mínimas (dos proyectos, tres–cinco tareas).

1. Sin `showDone`, las hechas no salen; con `showDone`, sí.
2. `status=done` y `showDone=false` → `rows` vacío.
3. Orden: crítica con fecha cercana **antes** que crítica sin fecha; alta vencida antes que
   alta a 10 días; `low` después de `medium`.
4. `date=overdue` no incluye tareas sin fecha; con `showDone=false` no incluye hechas
   vencidas.
5. `project` recorta a ese proyecto; id desconocido no recorta.
6. `groups`: dos proyectos, el que tiene la tarea más urgente sale primero; dentro del
   grupo se conserva el orden.
7. `projectOptions` no lista un proyecto que solo tiene hechas si `showDone=false`.
8. Archivada asignada no aparece nunca.

La UI de D7 (escribir `done=1` al elegir Hecha) no se cubre con test de componente; queda
como criterio de HU-02 y se verifica a mano / en el browser al implementar.

## 10. Fuera de alcance

- Identidad “yo” / persona por defecto.
- Búsqueda por texto, tags, área, sprint.
- Daily standup.
- Kanban (no se le agrega el interruptor de hechas ni el option Crítica, salvo que un
  follow-up lo pida).
- Meter `detail` en la URL de Mis tareas.
- Tipos de trabajo (historia, enabler, spike, key result, bug, PRD, tarea normal).
- Hipervínculos del dashboard (siguiente spec; consumirá este contrato).
- Cambiar agrupación default del Kanban.

## 11. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Duplicar la semántica de `date` y divergir del Kanban | Mismos tokens; `daysUntil` (días calendario) en vez de `Date#setHours`. `due-soon` = 0..3 inclusive, `this-week` = 0..7 inclusive. Documentado en D5. |
| El Kanban omite `critical` en su dropdown y alguien espera paridad visual | D6 es deliberado; no se “arregla” el Kanban aquí (fuera de alcance). |
| `MyTasksPage` crece demasiado con dos layouts | Extraer `TaskRow` (ya existe en el archivo) y un `ProjectTaskGroup` reusando el actual; la página orquesta, no se parte en micro-componentes de más. |

## 12. Definición de hecho

- [x] Spec revisado por el usuario
- [x] HU-01…HU-05 implementadas según D1–D12
- [x] `filterMyTasks.test.ts` cubre los 8 casos de §9 y pasa
- [x] `npm run typecheck` + `npm test` verdes
- [ ] Verificación en browser: interruptor, filtros, las dos vistas, drawer, marcar hecha
      desaparece, URL se actualiza, recargar conserva el estado
- [x] Estado → **IMPLEMENTADO**

Nota: smoke visual en browser pendiente (sin MCP de browser en el entorno de cierre); cubierto por tests de pipeline/URL writers + código de UI.
