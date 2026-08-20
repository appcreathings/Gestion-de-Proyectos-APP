# Mis tareas: filtros, ocultar hechas y vistas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar `/app/my-tasks` para triar trabajo abierto: hechas ocultas por defecto, filtros de estado/prioridad/vencimiento/proyecto en la URL, lista plana por urgencia y agrupación opcional por proyecto.

**Architecture:** Función pura `filterAndSortMyTasks` + `parseMyTasksQuery` + writers de URL en `src/features/my-tasks/filterMyTasks.ts`. `MyTasksPage` solo lee `searchParams`, llama al pipeline y renderiza. Sin bump de schema. Sin barra compartida con el Kanban.

**Tech Stack:** React 18, React Router `useSearchParams`, Vitest, Tailwind, componentes UI existentes (`Select`, `Button`, `Checkbox`, `Badge`, `EmptyState`).

**Spec:** `specs/061-mis-tareas-filtros/spec.md`

## Global Constraints

- Sin bump de `SCHEMA_VERSION` (sigue en **21**).
- Params de URL: `person`, `status`, `priority`, `date`, `project`, `done=1`, `view=project` — valores de `date` idénticos al Kanban (`overdue` | `due-soon` | `this-week`).
- Fechas vía `daysUntil` de `src/domain/compute.ts`, **no** copiar el `switch` con `new Date()` de `TasksTab`.
- Prioridad incluye `critical`. Orden: `critical` > `high` > `medium` > `low`.
- Archivadas fuera siempre. No hay identidad “yo”.
- “Limpiar filtros” borra `status`/`priority`/`date`/`project`; no borra `person`/`done`/`view`.
- Tests de este spec: solo la función pura (Vitest). No tests de componente de la página.
- Commits en PowerShell: `git commit -m "mensaje"` (sin heredoc).
- Copy en español. `replace: true` en `setSearchParams`.

## File structure

| File | Responsibility |
|------|----------------|
| Create: `src/features/my-tasks/filterMyTasks.ts` | Tipos, parse de URL, writers (D7), pipeline de filtro/orden/grupos. |
| Create: `src/features/my-tasks/filterMyTasks.test.ts` | 8 casos del spec §9 + parse + D7. |
| Modify: `src/features/my-tasks/MyTasksPage.tsx` | Barra, dos vistas, empty states; deja de filtrar en el `useMemo` actual. |

`MyTasksResult.assignedCount` (tareas post paso 1: asignadas, no archivadas, **incluye hechas**) no está en el typedef del spec §5; se agrega para poder implementar HU-05 (distinguir “cero asignadas” vs “solo hechas ocultas”).

---

### Task 1: Parse de URL y writers D7

**Files:**
- Create: `src/features/my-tasks/filterMyTasks.ts`
- Test: `src/features/my-tasks/filterMyTasks.test.ts`

**Interfaces:**
- Consumes: `Priority`, `TaskStatus` de `@/domain/schemas`
- Produces:
  - `MyTasksDateFilter = "overdue" | "due-soon" | "this-week"`
  - `MyTasksView = "priority" | "project"`
  - `MyTasksQuery` (abajo)
  - `parseMyTasksQuery(params: URLSearchParams): MyTasksQuery`
  - `applyShowDone(params: URLSearchParams, show: boolean): URLSearchParams`
  - `applyStatus(params: URLSearchParams, status: string | null): URLSearchParams`
  - `applyFilter(params: URLSearchParams, key: "priority" | "date" | "project" | "person" | "view", value: string | null): URLSearchParams`
  - `clearMyTaskFilters(params: URLSearchParams): URLSearchParams`
  - `MY_TASKS_PRIORITY_ORDER: readonly Priority[]`

- [ ] **Step 1: Write the failing tests**

Create `src/features/my-tasks/filterMyTasks.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  parseMyTasksQuery,
  applyShowDone,
  applyStatus,
  applyFilter,
  clearMyTaskFilters,
} from "./filterMyTasks";

describe("parseMyTasksQuery", () => {
  it("defaults: no person, hide done, priority view, null filters", () => {
    const q = parseMyTasksQuery(new URLSearchParams());
    expect(q).toEqual({
      personId: null,
      status: null,
      priority: null,
      date: null,
      projectId: null,
      showDone: false,
      view: "priority",
    });
  });

  it("reads valid params and treats done=1 / view=project", () => {
    const q = parseMyTasksQuery(
      new URLSearchParams(
        "person=ana&status=doing&priority=critical&date=overdue&project=p1&done=1&view=project",
      ),
    );
    expect(q.personId).toBe("ana");
    expect(q.status).toBe("doing");
    expect(q.priority).toBe("critical");
    expect(q.date).toBe("overdue");
    expect(q.projectId).toBe("p1");
    expect(q.showDone).toBe(true);
    expect(q.view).toBe("project");
  });

  it("ignores invalid status/priority/date and treats other done/view as defaults", () => {
    const q = parseMyTasksQuery(
      new URLSearchParams("status=nope&priority=urgent&date=soon&done=true&view=list"),
    );
    expect(q.status).toBeNull();
    expect(q.priority).toBeNull();
    expect(q.date).toBeNull();
    expect(q.showDone).toBe(false);
    expect(q.view).toBe("priority");
  });
});

describe("URL writers (D7, D11)", () => {
  it("applyStatus(done) also sets done=1", () => {
    const next = applyStatus(new URLSearchParams("person=ana"), "done");
    expect(next.get("status")).toBe("done");
    expect(next.get("done")).toBe("1");
    expect(next.get("person")).toBe("ana");
  });

  it("applyShowDone(false) clears done and status=done", () => {
    const next = applyShowDone(new URLSearchParams("status=done&done=1&priority=high"), false);
    expect(next.get("done")).toBeNull();
    expect(next.get("status")).toBeNull();
    expect(next.get("priority")).toBe("high");
  });

  it("applyShowDone(false) keeps status when it is not done", () => {
    const next = applyShowDone(new URLSearchParams("status=doing&done=1"), false);
    expect(next.get("done")).toBeNull();
    expect(next.get("status")).toBe("doing");
  });

  it("clearMyTaskFilters keeps person, done and view", () => {
    const next = clearMyTaskFilters(
      new URLSearchParams("person=ana&status=todo&priority=high&date=overdue&project=p1&done=1&view=project"),
    );
    expect(next.get("person")).toBe("ana");
    expect(next.get("done")).toBe("1");
    expect(next.get("view")).toBe("project");
    expect(next.get("status")).toBeNull();
    expect(next.get("priority")).toBeNull();
    expect(next.get("date")).toBeNull();
    expect(next.get("project")).toBeNull();
  });

  it("applyFilter deletes the key when value is null; view=priority deletes view", () => {
    const withView = applyFilter(new URLSearchParams(), "view", "project");
    expect(withView.get("view")).toBe("project");
    const flat = applyFilter(withView, "view", null);
    expect(flat.get("view")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/my-tasks/filterMyTasks.test.ts`

Expected: FAIL — `Cannot find module './filterMyTasks'` (o exports missing).

- [ ] **Step 3: Write minimal implementation**

Create `src/features/my-tasks/filterMyTasks.ts`:

```ts
import type { Priority, Project, Task, TaskStatus } from "@/domain/schemas";

export const MY_TASKS_PRIORITY_ORDER: readonly Priority[] = [
  "critical",
  "high",
  "medium",
  "low",
];

export type MyTasksDateFilter = "overdue" | "due-soon" | "this-week";
export type MyTasksView = "priority" | "project";

export type MyTasksQuery = {
  personId: string | null;
  status: TaskStatus | null;
  priority: Priority | null;
  date: MyTasksDateFilter | null;
  projectId: string | null;
  showDone: boolean;
  view: MyTasksView;
};

const TASK_STATUSES: readonly TaskStatus[] = ["todo", "doing", "blocked", "done"];
const DATE_FILTERS: readonly MyTasksDateFilter[] = ["overdue", "due-soon", "this-week"];

function isTaskStatus(v: string | null): v is TaskStatus {
  return v !== null && (TASK_STATUSES as readonly string[]).includes(v);
}
function isPriority(v: string | null): v is Priority {
  return v !== null && (MY_TASKS_PRIORITY_ORDER as readonly string[]).includes(v);
}
function isDateFilter(v: string | null): v is MyTasksDateFilter {
  return v !== null && (DATE_FILTERS as readonly string[]).includes(v);
}

export function parseMyTasksQuery(params: URLSearchParams): MyTasksQuery {
  return {
    personId: params.get("person"),
    status: isTaskStatus(params.get("status")) ? params.get("status") : null,
    priority: isPriority(params.get("priority")) ? params.get("priority") : null,
    date: isDateFilter(params.get("date")) ? params.get("date") : null,
    projectId: params.get("project"),
    showDone: params.get("done") === "1",
    view: params.get("view") === "project" ? "project" : "priority",
  };
}

export function applyShowDone(params: URLSearchParams, show: boolean): URLSearchParams {
  const next = new URLSearchParams(params);
  if (show) {
    next.set("done", "1");
  } else {
    next.delete("done");
    if (next.get("status") === "done") next.delete("status");
  }
  return next;
}

export function applyStatus(params: URLSearchParams, status: string | null): URLSearchParams {
  const next = new URLSearchParams(params);
  if (!status) {
    next.delete("status");
  } else {
    next.set("status", status);
    if (status === "done") next.set("done", "1");
  }
  return next;
}

export function applyFilter(
  params: URLSearchParams,
  key: "priority" | "date" | "project" | "person" | "view",
  value: string | null,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (!value) next.delete(key);
  else next.set(key, value);
  return next;
}

export function clearMyTaskFilters(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params);
  next.delete("status");
  next.delete("priority");
  next.delete("date");
  next.delete("project");
  return next;
}
```

`isTaskStatus(params.get("status")) ? params.get("status") : null` se estrecha mal en TS (el segundo `get` sigue siendo `string | null`). Usar una local:

```ts
const statusRaw = params.get("status");
status: isTaskStatus(statusRaw) ? statusRaw : null,
```

Igual para `priority` y `date`.

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npx vitest run src/features/my-tasks/filterMyTasks.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```
git add src/features/my-tasks/filterMyTasks.ts src/features/my-tasks/filterMyTasks.test.ts
git commit -m "feat(my-tasks): parse URL query and D7 writers"
```

---

### Task 2: Pipeline — hide-done, archivadas, orden

**Files:**
- Modify: `src/features/my-tasks/filterMyTasks.ts`
- Modify: `src/features/my-tasks/filterMyTasks.test.ts`

**Interfaces:**
- Consumes: `parseMyTasksQuery` / `MyTasksQuery` (Task 1), `newProject`/`newTask`/`newArea` de `@/domain/factories`, `daysUntil`
- Produces:
  - `MyTaskRow = Task & { projectId: string; projectName: string; areaName?: string }`
  - `MyTasksResult` con `rows`, `groups`, `projectOptions`, `openCount`, `totalCount`, `assignedCount`
  - `filterAndSortMyTasks(projects: Project[], query: MyTasksQuery, now: Date): MyTasksResult`

- [ ] **Step 1: Write the failing tests**

Append to `filterMyTasks.test.ts` (keep the Task 1 describes). Helpers at top of the new describe:

```ts
import { newArea, newProject, newTask } from "@/domain/factories";
import type { Project, Task } from "@/domain/schemas";
import { filterAndSortMyTasks, type MyTasksQuery } from "./filterMyTasks";

const NOW = new Date(2026, 7, 20, 12, 0, 0); // 20 ago 2026 local
const ANA = "ana";

function q(over: Partial<MyTasksQuery> = {}): MyTasksQuery {
  return {
    personId: ANA,
    status: null,
    priority: null,
    date: null,
    projectId: null,
    showDone: false,
    view: "priority",
    ...over,
  };
}

function task(over: Partial<Task> & Pick<Task, "title">): Task {
  return { ...newTask(over.title), assigneeId: ANA, ...over };
}

function project(name: string, tasks: Task[], areas = [newArea("Core")]): Project {
  const p = newProject(name);
  return { ...p, areas, tasks };
}

describe("filterAndSortMyTasks hide-done / archive / sort", () => {
  it("hides done unless showDone; archived never appear", () => {
    const open = task({ title: "Open", status: "todo" });
    const done = task({ title: "Done", status: "done" });
    const archived = task({ title: "Archived", status: "todo", archived: true });
    const projects = [project("Alpha", [open, done, archived])];

    const hidden = filterAndSortMyTasks(projects, q(), NOW);
    expect(hidden.rows.map((r) => r.title)).toEqual(["Open"]);
    expect(hidden.assignedCount).toBe(2); // open + done, not archived
    expect(hidden.totalCount).toBe(1);
    expect(hidden.openCount).toBe(1);

    const shown = filterAndSortMyTasks(projects, q({ showDone: true }), NOW);
    expect(shown.rows.map((r) => r.title).sort()).toEqual(["Done", "Open"]);
    expect(shown.totalCount).toBe(2);
    expect(shown.openCount).toBe(1);
  });

  it("status=done and showDone=false yields empty rows", () => {
    const projects = [project("Alpha", [task({ title: "Done", status: "done" })])];
    const result = filterAndSortMyTasks(projects, q({ status: "done", showDone: false }), NOW);
    expect(result.rows).toEqual([]);
    expect(result.assignedCount).toBe(1);
  });

  it("sorts critical→low, nearer dueDate first, null dates last, title as tiebreak", () => {
    const projects = [
      project("Alpha", [
        task({ title: "M", priority: "medium", dueDate: "2026-08-20" }),
        task({ title: "L", priority: "low", dueDate: "2026-08-15" }),
        task({ title: "H-later", priority: "high", dueDate: "2026-08-30" }),
        task({ title: "H-over", priority: "high", dueDate: "2026-08-15" }),
        task({ title: "C-none", priority: "critical", dueDate: null }),
        task({ title: "C-soon", priority: "critical", dueDate: "2026-08-21" }),
      ]),
    ];
    const titles = filterAndSortMyTasks(projects, q(), NOW).rows.map((r) => r.title);
    expect(titles).toEqual(["C-soon", "C-none", "H-over", "H-later", "M", "L"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/my-tasks/filterMyTasks.test.ts`

Expected: FAIL — `filterAndSortMyTasks` is not exported.

- [ ] **Step 3: Write minimal implementation**

Append to `filterMyTasks.ts` (keep Task 1 exports):

```ts
import { daysUntil } from "@/domain/compute";

export type MyTaskRow = Task & {
  projectId: string;
  projectName: string;
  areaName?: string;
};

export type MyTasksResult = {
  rows: MyTaskRow[];
  groups: { projectId: string; projectName: string; tasks: MyTaskRow[] }[];
  projectOptions: { id: string; name: string }[];
  openCount: number;
  totalCount: number;
  assignedCount: number;
};

function emptyResult(): MyTasksResult {
  return {
    rows: [],
    groups: [],
    projectOptions: [],
    openCount: 0,
    totalCount: 0,
    assignedCount: 0,
  };
}

function collectAssigned(projects: Project[], personId: string): MyTaskRow[] {
  const rows: MyTaskRow[] = [];
  for (const project of projects) {
    for (const t of project.tasks) {
      if (t.assigneeId !== personId) continue;
      if (t.archived) continue;
      const area = project.areas.find((a) => a.id === t.areaId);
      rows.push({
        ...t,
        projectId: project.id,
        projectName: project.name,
        areaName: area?.name,
      });
    }
  }
  return rows;
}

function sortRows(rows: MyTaskRow[], now: Date): MyTaskRow[] {
  return [...rows].sort((a, b) => {
    const pr =
      MY_TASKS_PRIORITY_ORDER.indexOf(a.priority) -
      MY_TASKS_PRIORITY_ORDER.indexOf(b.priority);
    if (pr !== 0) return pr;
    const da = daysUntil(a.dueDate, now);
    const db = daysUntil(b.dueDate, now);
    const ra = da === null ? Number.POSITIVE_INFINITY : da;
    const rb = db === null ? Number.POSITIVE_INFINITY : db;
    if (ra !== rb) return ra - rb;
    return a.title.localeCompare(b.title, "es");
  });
}

export function filterAndSortMyTasks(
  projects: Project[],
  query: MyTasksQuery,
  now: Date,
): MyTasksResult {
  if (!query.personId) return emptyResult();

  const assigned = collectAssigned(projects, query.personId);
  const afterHide = query.showDone
    ? assigned
    : assigned.filter((t) => t.status !== "done");

  const rows = sortRows(afterHide, now);
  return {
    rows,
    groups: [],
    projectOptions: [],
    openCount: rows.filter((t) => t.status !== "done").length,
    totalCount: rows.length,
    assignedCount: assigned.length,
  };
}
```

This is enough for Task 2 tests (groups/options still empty — those tests come in Task 3). Do **not** add date/status/project filters yet; Task 2 tests do not require them.

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npx vitest run src/features/my-tasks/filterMyTasks.test.ts`

Expected: PASS (Task 1 + Task 2).

- [ ] **Step 5: Commit**

```
git add src/features/my-tasks/filterMyTasks.ts src/features/my-tasks/filterMyTasks.test.ts
git commit -m "feat(my-tasks): hide done, drop archived, sort by priority and date"
```

---

### Task 3: Pipeline — status, date, project, groups, projectOptions

**Files:**
- Modify: `src/features/my-tasks/filterMyTasks.ts`
- Modify: `src/features/my-tasks/filterMyTasks.test.ts`

**Interfaces:**
- Consumes: `filterAndSortMyTasks` de Task 2 (misma firma; se completa el cuerpo)
- Produces: misma firma; `rows` ya recortados por status/date/project; `groups` y `projectOptions` llenos

- [ ] **Step 1: Write the failing tests**

Append, reusing `NOW`, `q`, `task`, `project`, `ANA` del archivo:

```ts
describe("filterAndSortMyTasks filters / groups / options", () => {
  it("date=overdue excludes undated and hidden done", () => {
    const area = newArea("Core");
    const projects = [
      project(
        "Alpha",
        [
          task({ title: "Over", dueDate: "2026-08-15", status: "todo" }),
          task({ title: "Today", dueDate: "2026-08-20", status: "todo" }),
          task({ title: "None", dueDate: null, status: "todo" }),
          task({ title: "DoneOver", dueDate: "2026-08-10", status: "done" }),
        ],
        [area],
      ),
    ];
    const hidden = filterAndSortMyTasks(projects, q({ date: "overdue" }), NOW);
    expect(hidden.rows.map((r) => r.title)).toEqual(["Over"]);

    const shown = filterAndSortMyTasks(
      projects,
      q({ date: "overdue", showDone: true }),
      NOW,
    );
    expect(shown.rows.map((r) => r.title)).toEqual(["DoneOver", "Over"]);
  });

  it("project recorta; unknown id does not recortar", () => {
    const alphaTasks = [task({ title: "A", priority: "high" })];
    const betaTasks = [task({ title: "B", priority: "critical" })];
    const alpha = project("Alpha", alphaTasks);
    const beta = project("Beta", betaTasks);
    const projects = [alpha, beta];

    const cut = filterAndSortMyTasks(projects, q({ projectId: alpha.id }), NOW);
    expect(cut.rows.map((r) => r.title)).toEqual(["A"]);

    const unknown = filterAndSortMyTasks(projects, q({ projectId: "missing" }), NOW);
    expect(unknown.rows.map((r) => r.title)).toEqual(["B", "A"]);
  });

  it("groups: most urgent project's group first; order preserved inside", () => {
    const alpha = project("Alpha", [
      task({ title: "A-low", priority: "low", dueDate: "2026-08-30" }),
    ]);
    const beta = project("Beta", [
      task({ title: "B-crit", priority: "critical", dueDate: "2026-08-15" }),
      task({ title: "B-med", priority: "medium", dueDate: "2026-08-20" }),
    ]);
    const result = filterAndSortMyTasks([alpha, beta], q(), NOW);
    expect(result.rows.map((r) => r.title)).toEqual(["B-crit", "B-med", "A-low"]);
    expect(result.groups.map((g) => g.projectName)).toEqual(["Beta", "Alpha"]);
    expect(result.groups[0].tasks.map((t) => t.title)).toEqual(["B-crit", "B-med"]);
  });

  it("projectOptions omits a project that only has hidden done", () => {
    const alpha = project("Alpha", [task({ title: "Open", status: "todo" })]);
    const beta = project("Beta", [task({ title: "Done", status: "done" })]);
    const hidden = filterAndSortMyTasks([alpha, beta], q(), NOW);
    expect(hidden.projectOptions.map((o) => o.name)).toEqual(["Alpha"]);

    const shown = filterAndSortMyTasks([alpha, beta], q({ showDone: true }), NOW);
    expect(shown.projectOptions.map((o) => o.name)).toEqual(["Alpha", "Beta"]);
  });
});
```

`due-soon` (0..3) y `this-week` (0..7) no tienen un test propio en el spec §9; el de `overdue` cubre el cable de `daysUntil`. Implementar los tres branches igual.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/features/my-tasks/filterMyTasks.test.ts`

Expected: FAIL on `date=overdue` (Today/None still in rows) and/or empty `groups`/`projectOptions`.

- [ ] **Step 3: Complete filterAndSortMyTasks**

Replace the body after `const assigned = ...` with:

```ts
  const afterHide = query.showDone
    ? assigned
    : assigned.filter((t) => t.status !== "done");

  const knownProjectIds = new Set(projects.map((p) => p.id));

  let filtered = afterHide;
  if (query.status) {
    filtered = filtered.filter((t) => t.status === query.status);
  }
  if (query.priority) {
    filtered = filtered.filter((t) => t.priority === query.priority);
  }
  if (query.date) {
    filtered = filtered.filter((t) => matchesDateFilter(t.dueDate, query.date!, now));
  }
  if (query.projectId && knownProjectIds.has(query.projectId)) {
    filtered = filtered.filter((t) => t.projectId === query.projectId);
  }

  const rows = sortRows(filtered, now);

  const groups: MyTasksResult["groups"] = [];
  const groupIndex = new Map<string, number>();
  for (const row of rows) {
    const existing = groupIndex.get(row.projectId);
    if (existing === undefined) {
      groupIndex.set(row.projectId, groups.length);
      groups.push({
        projectId: row.projectId,
        projectName: row.projectName,
        tasks: [row],
      });
    } else {
      groups[existing].tasks.push(row);
    }
  }

  const optionMap = new Map<string, string>();
  for (const row of afterHide) {
    if (!optionMap.has(row.projectId)) optionMap.set(row.projectId, row.projectName);
  }
  const projectOptions = [...optionMap.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return {
    rows,
    groups,
    projectOptions,
    openCount: rows.filter((t) => t.status !== "done").length,
    totalCount: rows.length,
    assignedCount: assigned.length,
  };
```

Add helper in the same file:

```ts
function matchesDateFilter(
  dueDate: string | null,
  date: MyTasksDateFilter,
  now: Date,
): boolean {
  const d = daysUntil(dueDate, now);
  if (d === null) return false;
  if (date === "overdue") return d < 0;
  if (date === "due-soon") return d >= 0 && d <= 3;
  return d >= 0 && d <= 7; // this-week
}
```

- [ ] **Step 4: Run tests and make sure they pass**

Run: `npx vitest run src/features/my-tasks/filterMyTasks.test.ts`

Expected: PASS. The 8 spec §9 cases are now covered (1–3 Task 2, 4–7 Task 3, 8 archived in Task 2).

- [ ] **Step 5: Commit**

```
git add src/features/my-tasks/filterMyTasks.ts src/features/my-tasks/filterMyTasks.test.ts
git commit -m "feat(my-tasks): status, date, project filters and project groups"
```

---

### Task 4: Barra de Mis tareas (URL → pipeline)

**Files:**
- Modify: `src/features/my-tasks/MyTasksPage.tsx`

**Interfaces:**
- Consumes: `parseMyTasksQuery`, `filterAndSortMyTasks`, `applyShowDone`, `applyStatus`, `applyFilter`, `clearMyTaskFilters`, `MyTaskRow`
- Produces: página que escribe los params D1–D7/D11 y llama al pipeline. Las vistas/empties se pulen en Task 5; aquí la barra ya funciona y la lista plana usa `result.rows`.

- [ ] **Step 1: No new failing test** (spec: no component tests). Confirm unit tests still pass:

Run: `npx vitest run src/features/my-tasks/filterMyTasks.test.ts`

Expected: PASS.

- [ ] **Step 2: Replace the data/URL logic and toolbar in `MyTasksPage.tsx`**

Keep the existing `TaskDetailDrawer` wiring. Replace `TaskWithProject` usage for listing with `MyTaskRow`. Lookup of `Project` for the drawer is `projects.find((p) => p.id === row.projectId)`.

Imports to add:

```ts
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { priorityLabel } from "@/domain/labels";
import {
  applyFilter,
  applyShowDone,
  applyStatus,
  clearMyTaskFilters,
  filterAndSortMyTasks,
  parseMyTasksQuery,
  type MyTaskRow,
} from "./filterMyTasks";
```

Remove the old `tasksByProject` `useMemo` that filters by status inline.

Inside `MyTasksPage`:

```ts
  const query = useMemo(() => parseMyTasksQuery(searchParams), [searchParams]);
  const selectedPerson = query.personId
    ? people.find((p) => p.id === query.personId) ?? null
    : null;

  useEffect(() => {
    if (query.personId && !selectedPerson) {
      setSearchParams(applyFilter(searchParams, "person", null), { replace: true });
    }
  }, [query.personId, selectedPerson, searchParams, setSearchParams]);

  const result = useMemo(
    () => filterAndSortMyTasks(projects, query, new Date()),
    [projects, query],
  );

  const hasActiveFilters = Boolean(
    query.status || query.priority || query.date || query.projectId,
  );

  function commit(next: URLSearchParams) {
    setSearchParams(next, { replace: true });
  }
```

Toolbar JSX (replace the current two-select row). Persona stays a `Select`. Then:

```tsx
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[12rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Persona</label>
            <Select
              value={query.personId ?? ""}
              onChange={(e) => commit(applyFilter(searchParams, "person", e.target.value || null))}
            >
              <option value="">Seleccionar persona...</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          </div>

          <label className="mb-2 flex items-center gap-2 text-sm font-medium">
            <Checkbox
              checked={query.showDone}
              onCheckedChange={(c) => commit(applyShowDone(searchParams, c))}
              aria-label="Mostrar hechas"
            />
            Mostrar hechas
          </label>

          <div className="min-w-[9rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Estado</label>
            <Select
              value={query.status ?? ""}
              onChange={(e) => commit(applyStatus(searchParams, e.target.value || null))}
            >
              <option value="">Todos</option>
              <option value="todo">Por hacer</option>
              <option value="doing">En curso</option>
              <option value="blocked">Bloqueada</option>
              <option value="done">Hecha</option>
            </Select>
          </div>

          <div className="min-w-[9rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Prioridad</label>
            <Select
              value={query.priority ?? ""}
              onChange={(e) => commit(applyFilter(searchParams, "priority", e.target.value || null))}
            >
              <option value="">Todas</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </Select>
          </div>

          <div className="min-w-[11rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Vencimiento</label>
            <Select
              value={query.date ?? ""}
              onChange={(e) => commit(applyFilter(searchParams, "date", e.target.value || null))}
            >
              <option value="">Todas</option>
              <option value="overdue">Vencidas</option>
              <option value="due-soon">Por vencer (3 días)</option>
              <option value="this-week">Esta semana</option>
            </Select>
          </div>

          <div className="min-w-[11rem] flex-1">
            <label className="mb-1.5 block text-sm font-medium">Proyecto</label>
            <Select
              value={query.projectId ?? ""}
              onChange={(e) => commit(applyFilter(searchParams, "project", e.target.value || null))}
            >
              <option value="">Todos</option>
              {result.projectOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-md border border-border/70">
            <Button
              type="button"
              variant={query.view === "priority" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => commit(applyFilter(searchParams, "view", null))}
            >
              Por prioridad
            </Button>
            <Button
              type="button"
              variant={query.view === "project" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => commit(applyFilter(searchParams, "view", "project"))}
            >
              Por proyecto
            </Button>
          </div>
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" onClick={() => commit(clearMyTaskFilters(searchParams))}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>
```

Temporary list (Task 5 replaces grouping/empties): if `query.personId` and `result.rows.length`, render `result.rows` with `TaskRow` (adapt prop type to `MyTaskRow`). Drawer: `detailTask: MyTaskRow | null`; `detailProject` from `projects.find`.

`openDetail(row)`:

```ts
function openDetail(row: MyTaskRow) {
  const project = projects.find((p) => p.id === row.projectId) ?? null;
  setDetailTask(row);
  setDetailProject(project);
}
```

`handleUpdateTask` stays `mutate(detailProject.id, ...)`. After update, if `detailTask`, set `detailTask` to `{ ...updatedTask, projectId, projectName, areaName }` from the previous row (area may change if the drawer moved it — re-read from `detailProject.areas` + `updatedTask.areaId`).

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`

Expected: PASS. Fix any leftover `TaskWithProject` / `project` on the row.

- [ ] **Step 4: Run unit tests**

Run: `npx vitest run src/features/my-tasks/filterMyTasks.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```
git add src/features/my-tasks/MyTasksPage.tsx
git commit -m "feat(my-tasks): filter toolbar and URL-backed query"
```

---

### Task 5: Vistas, filas, empty states, drawer

**Files:**
- Modify: `src/features/my-tasks/MyTasksPage.tsx`

**Interfaces:**
- Consumes: `result.rows` / `result.groups` / `assignedCount` / `openCount` / `totalCount` / `query.view` / `hasActiveFilters`
- Produces: HU-03, HU-04, HU-05

- [ ] **Step 1: Adapt `TaskRow` and `ProjectTaskGroup`**

`TaskRow` props:

```ts
function TaskRow({
  task,
  onClick,
  showProjectName,
}: {
  task: MyTaskRow;
  onClick: () => void;
  showProjectName: boolean;
}) {
```

Under the title, muted line:

```tsx
        {(showProjectName || task.areaName) && (
          <p className="truncate text-xs text-muted-foreground">
            {showProjectName ? task.projectName : null}
            {showProjectName && task.areaName ? " · " : null}
            {task.areaName}
          </p>
        )}
```

Keep overdue / due-soon background using `daysUntil(task.dueDate)` as today.

`ProjectTaskGroup`: drop the full `Project`; take `projectName`, `tasks: MyTaskRow[]`, `onOpenDetail: (t: MyTaskRow) => void`. Rows call `<TaskRow showProjectName={false} />`.

- [ ] **Step 2: Empty states and counter (HU-05, HU-02)**

After the toolbar, before the list:

```tsx
      {!query.personId || !selectedPerson ? (
        <EmptyState
          icon={UserCheck}
          title="Selecciona una persona"
          description="Elige una persona del selector superior para ver sus tareas asignadas."
        />
      ) : result.assignedCount === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No hay tareas asignadas"
          description={`No hay tareas asignadas a ${selectedPerson.name}.`}
        />
      ) : result.totalCount === 0 && !hasActiveFilters && !query.showDone ? (
        <EmptyState
          icon={UserCheck}
          title="No hay tareas abiertas"
          description={`Todas las tareas de ${selectedPerson.name} están hechas.`}
          action={
            <Button type="button" size="sm" onClick={() => commit(applyShowDone(searchParams, true))}>
              Mostrar hechas
            </Button>
          }
        />
      ) : result.totalCount === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="Ninguna coincide con los filtros"
          description="Prueba a limpiar los filtros para volver a ver las tareas de esta persona."
          action={
            <Button type="button" size="sm" variant="outline" onClick={() => commit(clearMyTaskFilters(searchParams))}>
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {query.showDone
              ? `${result.totalCount} tarea${result.totalCount !== 1 ? "s" : ""}`
              : `${result.openCount} abierta${result.openCount !== 1 ? "s" : ""}`}
            {" "}asignada{result.totalCount !== 1 ? "s" : ""} a{" "}
            <span className="font-medium text-foreground">{selectedPerson.name}</span>
          </p>
          {query.view === "project"
            ? result.groups.map((g) => (
                <ProjectTaskGroup
                  key={g.projectId}
                  projectName={g.projectName}
                  tasks={g.tasks}
                  onOpenDetail={openDetail}
                />
              ))
            : (
                <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-background">
                  {result.rows.map((row) => (
                    <TaskRow
                      key={row.id}
                      task={row}
                      showProjectName
                      onClick={() => openDetail(row)}
                    />
                  ))}
                </div>
              )}
        </div>
      )}
```

`EmptyState` acepta `action?: React.ReactNode` (`src/components/EmptyState.tsx`).

Drawer: only render if `detailTask && detailProject`. `onClose` clears both.

When marking done with `showDone=false`, the row vanishes on next render because `projects` in the store updates and the pipeline drops it. If `detailTask` still points at a now-hidden task, close the drawer in `handleUpdateTask` when `updatedTask.status === "done" && !query.showDone`:

```ts
  function handleUpdateTask(updatedTask: Task) {
    if (!detailProject) return;
    mutate(detailProject.id, (p) => ops.updateTask(p, updatedTask));
    if (updatedTask.status === "done" && !query.showDone) {
      setDetailTask(null);
      setDetailProject(null);
      return;
    }
    const area = detailProject.areas.find((a) => a.id === updatedTask.areaId);
    setDetailTask({
      ...updatedTask,
      projectId: detailProject.id,
      projectName: detailProject.name,
      areaName: area?.name,
    });
  }
```

- [ ] **Step 3: Typecheck + unit tests**

Run: `npx tsc --noEmit`

Run: `npx vitest run src/features/my-tasks/filterMyTasks.test.ts`

Expected: both PASS.

- [ ] **Step 4: Browser smoke (spec §12)**

`npm run dev`. Open `/app/my-tasks?person=<id>`:

1. Hechas no se ven; “Mostrar hechas” las muestra y pone `done=1`.
2. Filtros de prioridad / vencimiento / proyecto recortan; recargar conserva la URL.
3. Default lista plana; “Por proyecto” agrupa; grupos ordenados por urgencia.
4. Elegir estado Hecha enciende el interruptor (`done=1`).
5. Apagar el interruptor con estado Hecha limpia `status`.
6. Abrir drawer, marcar hecha, la fila desaparece.
7. Persona inválida en la URL cae al empty de seleccionar.

- [ ] **Step 5: Commit**

```
git add src/features/my-tasks/MyTasksPage.tsx
git commit -m "feat(my-tasks): priority/project views and empty states"
```

---

### Task 6: Cierre — suite y spec

**Files:**
- Modify: `specs/061-mis-tareas-filtros/spec.md` (estado → IMPLEMENTADO, checkboxes de definición de hecho)

**Interfaces:**
- Consumes: Tasks 1–5
- Produces: spec marcada implementada

- [ ] **Step 1: Full verification**

Run: `npx tsc --noEmit`

Run: `npx vitest run`

Expected: typecheck PASS; full suite PASS (no regressions). Lint: do not fail the spec on the pre-existing `useBreakpoint` error.

- [ ] **Step 2: Update spec header**

In `specs/061-mis-tareas-filtros/spec.md`:

- Estado: **IMPLEMENTADO**
- Tick HU-01…HU-05 and §12 items that are done.

- [ ] **Step 3: Commit**

```
git add specs/061-mis-tareas-filtros/spec.md
git commit -m "docs(spec): mark 061 mis-tareas-filtros as implemented"
```

---

## Spec coverage (self-review)

| Spec item | Task |
|-----------|------|
| D1 hide done / `done=1` | 1 (parse), 2 (pipeline), 4 (checkbox) |
| D2 filters + sort | 2–4 |
| D3 two views | 4 (control), 5 (render) |
| D4 URL source of truth | 1, 4 |
| D5 date tokens + `daysUntil` | 3 |
| D6 critical | 4 select, 2 sort |
| D7 hecha ↔ interruptor | 1 writers, 4 selects |
| D8 pure function | 1–3 |
| D9 no “yo” | 4 person select kept |
| D10 archived | 2 |
| D11 clear filters | 1, 4 |
| D12 no schema bump | all |
| HU-01…HU-05 | 2–5 |
| Tests §9 (8 cases) | 2–3 |
| Browser §12 | 5–6 |
| Out of scope (Kanban, Daily, kinds, dashboard) | not in any task |

No TBD/TODO left. Signatures are consistent across tasks (`MyTasksQuery.personId: string | null`, `assignedCount` on `MyTasksResult`).
