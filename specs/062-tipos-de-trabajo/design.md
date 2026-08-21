# Design 062 — Tipos de trabajo

Snippets y puntos de enganche. La autoridad de producto es `spec.md` (D1–D15).

## 1. Schema

`src/domain/schemas/common.ts`:

```ts
export const SCHEMA_VERSION = 22;

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
```

Reexportar desde `schemas/index.ts` como el resto de enums.

`TaskSchema` (`project.ts`), después de `priority`:

```ts
workType: WorkType.default("task"),
krCurrent: z.number().nullable().default(null),
krTarget: z.number().nullable().default(null),
krUnit: z.string().default(""),
```

`CreateTaskOutputSchema` (`flow.ts`):

```ts
workType: z.string().optional(),
```

No validar el enum en el output del flujo con Zod estricto (los demás campos
`priority`/`status` ya son `z.string().optional()`). El engine coacciona.

## 2. Factory + migración

`newTask`:

```ts
workType: "task",
krCurrent: null,
krTarget: null,
krUnit: "",
```

`migrations.ts`:

- `projects`: `{ to: 22, up: (data) => data }` (comentar spec 062).
- `flows`: `{ to: 22, up: (data) => data }`.

`migrations.test.ts`: el caso “defaults the target to current SCHEMA_VERSION”
pasa de `toBe(21)` a `toBe(22)`.

## 3. Labels

```ts
export const workTypeLabel: Record<WorkType, string> = {
  task: "Tarea",
  story: "Historia",
  enabler: "Enabler",
  spike: "Spike",
  key_result: "Key result",
  bug: "Bug",
  prd: "PRD",
};

export const workTypeVariant: Record<WorkType, BadgeVariant> = {
  task: "outline",
  story: "secondary",
  enabler: "outline",
  spike: "warning",
  key_result: "default",
  bug: "destructive",
  prd: "outline",
};

/** Orden del <select> (Tarea al final: es el default, no el protagonista). */
export const WORK_TYPE_OPTIONS: WorkType[] = [
  "story",
  "enabler",
  "spike",
  "key_result",
  "bug",
  "prd",
  "task",
];
```

Helper de UI (mismo archivo o `src/features/projects/components/kanban/WorkTypeBadge.tsx`
si se usa en 3 sitios — preferir un componente de 15 líneas a copiar el Badge):

```tsx
export function WorkTypeBadge({ workType }: { workType: WorkType }) {
  if (workType === "task") return null;
  return (
    <Badge variant={workTypeVariant[workType]} className="text-[11px] leading-tight px-1.5 py-0.5">
      {workTypeLabel[workType]}
    </Badge>
  );
}
```

## 4. KR compacto

Helper puro `src/domain/krProgress.ts` (testeable):

```ts
export function krProgress(
  current: number | null,
  target: number | null,
): number | null {
  if (current === null || target === null) return null;
  if (!Number.isFinite(current) || !Number.isFinite(target) || target === 0) return null;
  return Math.min(1, Math.max(0, current / target));
}
```

Barra: `h-1 rounded-full bg-muted` + inner `bg-primary` width `%`. En card, debajo
de los badges si `krProgress(...) !== null`.

Parseo de input (drawer): `value.trim() === "" ? null : Number(value)` y si
`Number.isFinite` entonces guardar; si no, no tocar el draft (o revertir al
último válido). No persistir `NaN`.

## 5. Forms

**TaskFormDialog** y **TaskDetailDrawer**: un `<Select>` “Tipo” iterando
`WORK_TYPE_OPTIONS`. Estado local `workType: WorkType`.

Hints condicionales (mismo bloque, no tres formularios):

- `spike` → label estimación “Time-box (h)”; `<p className="text-xs text-muted-foreground">Techo de horas para la prueba de concepto. No es una promesa de entrega.</p>`
- `prd` → bajo descripción: “El PRD vive en la descripción.”
- `key_result` → tres campos Actual / Meta / Unidad. Unidad placeholder `%`.

Persistir en el mismo `onUpdate` / submit que el resto.

## 6. Filtros

**Kanban `TasksTab`:** leer `searchParams.get("workType")`, validar con
`WorkType.safeParse` o un `isWorkType`. Aplicar tras el filtro de prioridad.
Select dentro del dropdown Filtros, debajo de Fecha. `clearFilters` también
borra `workType`. El contador de filtros activos lo incluye.

**Mis tareas:**

- `MyTasksQuery.workType: WorkType | null`
- `parseMyTasksQuery`: `workType` válido o `null`
- `applyFilter` gana key `"workType"`
- `clearMyTaskFilters` hace `next.delete("workType")`
- Pipeline: si `query.workType`, `filtered = filtered.filter(t => t.workType === query.workType)`
  (después de priority, antes de date)
- Select en la barra, entre Proyecto y el segmento de vista

Test: persona con un bug y una historia; `workType: "bug"` → solo el bug.

## 7. IA

`create_task` / `update_task` input:

```ts
workType: WorkType.optional(),
krCurrent: z.number().nullable().optional(),
krTarget: z.number().nullable().optional(),
krUnit: z.string().optional(),
```

`execute`: si viene `workType`, asignar. KR solo se escribe si el tipo
efectivo es `key_result` **o** si el caller manda los números (no descartar
si actualizan KR en un ítem que ya es key_result).

`taskView`: agregar `workType`, y si es `key_result` también `krCurrent`,
`krTarget`, `krUnit`.

`namesAndShapes.test.ts`: `workType` **no** entra en `required`.

## 8. Flows

`engine.ts` tras `newTask(...)`:

```ts
if (output.workType && isWorkType(output.workType)) {
  task.workType = output.workType;
}
```

`ActionConfigFields` case `createTask`: un Select “Tipo de trabajo” (opcional,
opción “— Default: Tarea —” = `undefined`).

No interpolar `workType` (no es un token de registro).

## 9. Orden de implementación

Ver `tasks.md`. No mezclar schema y UI en el mismo commit si se puede evitar:
A dominio → B labels/badge/KR helper → C forms → D filtros → E IA/flujos → F cierre.

## 10. Alternativas descartadas en implementación

- Guardar el tipo como tag (`type:spike`): no es filtrable con integridad.
- `kind` en Task: choca con `EntityRef.kind`.
- Time-box como fecha aparte: `estimate` ya es horas.
- Forzar `workType` required en create_task de la IA: rompe callers actuales.
