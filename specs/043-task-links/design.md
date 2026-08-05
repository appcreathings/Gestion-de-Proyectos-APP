# Design 043 — Links en tareas

> Decisiones técnicas para `spec.md`. Ancladas a `SCHEMA_VERSION` 18 y al drawer unificado (016).

## 0. Mapa de archivos

| Área | Archivos | Naturaleza |
|------|----------|------------|
| A · Schema + migración | `schemas/project.ts`, `schemas/common.ts`, `migrations.ts`, `migrations.test.ts`, `factories.ts` | `TaskLink` + `links[]`, v19 |
| B · Helper puro | **nuevo** `lib/taskLinks.ts` + `lib/taskLinks.test.ts` | normalizar URL, label de display |
| C · UI drawer | `TaskDetailDrawer.tsx` | sección bajo descripción |
| D · Card | `TaskCard.tsx` | badge contador |

Sin cambios en storage adapters, flujos, anexos, RAG.

## 1. Schema

```ts
// project.ts
export const TaskLinkSchema = z.object({
  id: Id,
  url: z.string().min(1),
  label: z.string().default(""),
  createdAt: IsoDate,
  updatedAt: IsoDate,
});
export type TaskLink = z.infer<typeof TaskLinkSchema>;

// TaskSchema
links: z.array(TaskLinkSchema).default([]),
```

Migración projects `{ to: 19, up: (data) => data }` — los defaults de Zod cubren tareas sin el campo.

## 2. Helper `normalizeTaskLinkUrl`

```ts
const MAX_LINKS = 20;

function normalizeTaskLinkUrl(raw: string):
  | { ok: true; url: string }
  | { ok: false; error: string }
```

Reglas:
1. `trim()`.
2. Vacío → error “Pega una URL”.
3. Si no tiene esquema, anteponer `https://`.
4. Parsear con `new URL(...)`.
5. Protocolo ∈ {`http:`, `https:`}; si no → error.
6. Hostname no vacío.
7. Devolver `href` canónico del `URL`.

```ts
function taskLinkDisplayLabel(link: { url: string; label: string }): string
```

- Si `label.trim()` → label.
- Si no → `hostname` de la URL (sin `www.` opcional) o fallback a URL truncada.

## 3. UI drawer

Orden en el cuerpo del drawer (campos principales):

```
Título
Resumen
Descripción
← Links (NUEVO)
Estado | Prioridad
...
```

### 3.1 Lista

Cada item:

```
┌─────────────────────────────────────────────┐
│ [ExternalLink]  Etiqueta o hostname      [🗑] │  ← fila h-10+, outline
└─────────────────────────────────────────────┘
```

- El área principal es un `<a>` o `<button>` que hace `window.open(url, "_blank", "noopener,noreferrer")` o `<a target="_blank" rel="noopener noreferrer">`.
- Preferir **`<a href={url} target="_blank" rel="noopener noreferrer">`** para middle-click / “abrir en pestaña” nativo y accesibilidad.
- Botón trash: `type="button"`, `stopPropagation` no necesario si no es hijo del `<a>`; colocar **al lado** del link, no dentro.

### 3.2 Formulario añadir

```
[ URL (input)          ]
[ Etiqueta opcional    ]  [ Añadir ]
```

- En viewports estrechos del drawer: stack vertical.
- Enter en URL o etiqueta envía si URL no vacía.
- Botón deshabilitado si URL vacía o `links.length >= 20`.

### 3.3 Persistencia

Mismo patrón que comentarios/subtasks:

```ts
onUpdate({
  ...task,
  links: [...(task.links ?? []), newLink],
  updatedAt: nowIso(),
});
```

No hace falta store action dedicada.

## 4. TaskCard badge

Junto a comments / estimate / subtasks:

```tsx
{(task.links?.length ?? 0) > 0 && (
  <Badge variant="outline" className="gap-1 text-[11px] ...">
    <Link2 className="size-3" />
    {task.links!.length}
  </Badge>
)}
```

Ícono: `Link2` o `ExternalLink` de lucide-react.

## 5. Constantes

| Constante | Valor |
|-----------|-------|
| `MAX_TASK_LINKS` | 20 |
| `SCHEMA_VERSION` | 19 |

## 6. Tests

- `taskLinks.test.ts`: casos válidos (con/sin esquema), inválidos (`javascript:`, vacío, basura), display label.
- `migrations.test.ts`: `projects` v1 → 19 (o al menos target === 19).
