# Design 076 — Orden de productos en la barra

> Autoridad: `spec.md` (D1–D14, HU-01…07). Si este archivo y el spec chocan, gana el spec.
> Snippets de esta página. `SCHEMA_VERSION` **25 → 26**.

## 0. Mapa de archivos

| Archivo | Qué |
|---------|-----|
| `src/domain/schemas/common.ts` | `SCHEMA_VERSION = 26` |
| `src/domain/schemas/workspace.ts` | `productOrder` en `SettingsSchema` |
| `src/domain/migrations.ts` | Paso `workspace` `{ to: 26 }` |
| `src/domain/migrations.test.ts` | El default del registry deja de ser v25. Caso workspace v25 → v26 |
| `src/ai/keys-never-exported.test.ts` | El pin `SCHEMA_VERSION === 25` pasa a 26 |
| `src/components/layout/ProjectTree.tsx` | Asa de producto, `DndContext` exterior, flechas, anuncio |
| `src/features/board/boardQuery.ts` | `boardProjectRank` recibe `productOrder` |
| `src/features/board/boardQuery.test.ts` | Caso nuevo de §4. El caso de la 075 sigue verde |
| `src/features/board/BoardPage.tsx` | Pasa `settings.productOrder` |

Literales `Settings` que hoy arman el objeto a mano y tienen que sumar `productOrder: []` para que cierre el tipo. No leen el campo. No cambia lo que hacen:

- `src/ai/gemini/systemPrompt.ts`
- `src/ai/gemini/systemPrompt.test.ts`
- `src/ai/tools/read/workspace.ts`
- `src/features/reports/statusReport.test.ts`
- `src/domain/health.test.ts`
- `src/features/projects/filterProjects.test.ts`
- `src/features/dashboard/portfolio.test.ts`
- `src/automations/temporal.test.ts`

No se toca: `sidebarOrder.ts` (se importa, no se reescribe), `GroupProjects` más allá de seguir recibiéndolo, `TasksTab`, `TaskCard`, páginas de productos y dashboard, `package.json`.

Reusar: `SortableItem`, `orderProjects`, `reorderWithin`, `UNASSIGNED_GROUP`, `updateSettings`, los sensores de la 075. Sin librerías nuevas. PowerShell: sin `&&`.

## 1. Settings y migración

En `SettingsSchema`, después de `sidebarOrder`:

```ts
// Orden de los productos en la barra (spec 076 D5). Ids de producto.
// `__unassigned` no va acá.
productOrder: z.array(z.string()).default([]),
```

`emptyWorkspace()` lo recibe por el default de Zod.

Paso nuevo en el kind `workspace`, después del `{ to: 25 }`. Los otros kinds no ganan un paso.

```ts
{
  to: 26,
  up(data) {
    const raw = data.settings;
    const settings =
      typeof raw === "object" && raw !== null
        ? { ...(raw as Record<string, unknown>) }
        : {};
    if (!Array.isArray(settings.productOrder)) settings.productOrder = [];
    return { ...data, settings };
  },
},
```

`readWorkspace` persiste este objeto antes de Zod. El paso tiene que dejar la clave en el archivo. No reescribe `sidebarOrder` ni `boardViews`: si el doc venía de v25, el paso 25 ya las escribió.

El test que dice `projects v1 -> v25` y espera `schemaVersion === 25` pasa a esperar **26**. Las cuatro etapas siguen ahí. El pin de `keys-never-exported.test.ts` pasa a 26. Los tests que migran hacia v25 a propósito (`migrateRecord(..., 25, MIGRATIONS)`) se quedan en 25.

## 2. Lectura en el árbol

`groups` deja de mapear `products` en el orden del store. Los grupos con al menos un proyecto se ordenan así:

```ts
const named = orderProjects(
  products
    .map((prod) => ({
      id: prod.id,
      name: prod.name,
      projects: orderProjects(
        byProduct.get(prod.id) ?? [],
        sidebarOrder?.[groupKey(prod.id)],
      ),
    }))
    .filter((g) => g.projects.length > 0),
  productOrder,
);
return [...named, ...unassigned];
```

`productOrder` y `sidebarOrder` se leen de `useAppStore`. `unassigned` se arma como hoy, con `groupKey(null)`, y no entra a `orderProjects` de productos.

Un id de `productOrder` que no está entre los visibles se salta. Un producto visible que no está en la lista queda al final de `named`. «Sin producto» queda después, aunque la lista guardada tenga basura.

## 3. Asa, soltar y flechas

Sensores del contexto exterior, iguales a los del grupo (075, design §3):

- mouse: `activationConstraint: { distance: 8 }`
- touch: `delay: 200`, `tolerance: 8`

No agregar `KeyboardSensor`. La flecha es `onKeyDown` del asa, como en el proyecto.

El nodo sortable envuelve el grupo entero (encabezado + proyectos abiertos) para que el bloque se mueva junto. El asa es el único nodo con `listeners`.

```tsx
<div ref={setNodeRef} className={cn(isDragging && "opacity-40")}>
  <div className="flex items-center">
    <button
      type="button"
      aria-label={`Reordenar ${g.name}`}
      onKeyDown={onProductKeyDown}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="size-3" />
    </button>
    <button
      type="button"
      onClick={() => toggle(g.id)}
      aria-expanded={isOpen}
      className="flex min-w-0 flex-1 items-center gap-1.5 ..."
    >
      {chevron}
      <span className="truncate">{g.name}</span>
    </button>
  </div>
  {isOpen && <GroupProjects group={g} ... />}
</div>
```

Clases del asa: las mismas que el asa de proyecto (`h-6 w-3`, `cursor-grab`, `touch-none`, ring de foco). El botón del nombre conserva el estilo actual del encabezado (`text-xs text-muted-foreground`, hover, `rounded-md`, `px-2 py-1.5`).

**Ampliación post-implementación (pedido del usuario, «mejora la animación»):** el
snippet de arriba no daba feedback visual (el bloque no seguía al puntero y el orden
saltaba al soltar, con una vuelta atrás cuando aterrizaba la escritura asincrónica
del store). Los dos niveles aplican ahora el `style` de `SortableItem` (transform +
transition de dnd-kit) y reacomodan la lista **en vivo** durante el drag: un orden
optimista local (`dragOrder` / `liveIds`) se actualiza en `onDragOver`, el drop
escribe el store con esa lista final y el estado local se conserva hasta que el
orden guardado lo alcanza (efecto sobre la lista del store), para que `updateSettings`
no haga saltar la fila. El nodo activo lleva `relative z-10 opacity-40` mientras
arrastra. El contrato de `onReorder` de `GroupProjects` pasa a recibir la lista
final `(groupId, next, movedId)` y devuelve `boolean` (false = sin workspace).
«Sin producto» sigue fuera del contexto.

`SortableContext` `items` = ids de `named`. «Sin producto» se renderiza después del contexto, sin `SortableItem` y sin asa. Su botón de abrir/cerrar queda como el de hoy.

Al soltar:

1. `visible` = ids de los grupos nombrados, en el orden en que se están viendo. No incluye `__unassigned`.
2. `next = reorderWithin(visible, activeId, overId)`.
3. Si `next` es null, no se escribe y no hay anuncio.
4. `updateSettings({ productOrder: next })`.

La flecha usa la misma función. El vecino es el puesto `index ± 1` de `visible`. Si el índice no existe o el destino se sale del array, return.

Textos, exactos:

| Caso | Texto |
|------|--------|
| El producto queda en el puesto 1 | `${name} quedó primero` |
| Otro puesto | `${name} quedó en el puesto ${n}` con `n` empezando en 1 |

El anuncio de un proyecto no se cambia: «Quedó primero en …» / «Quedó en el puesto n en …». Los dos escriben el mismo `role="status"` `aria-live="polite"` `sr-only`.

Sin workspace, `updateSettings` ya retorna solo. No anunciar en ese caso: mirar el workspace antes de escribir, igual que `persistOrder`.

## 4. Rango del tablero

```ts
export function boardProjectRank(
  products: readonly Product[],
  projects: readonly Project[],
  sidebarOrder: Readonly<Record<string, string[]>>,
  productOrder: readonly string[] = [],
): Map<string, number>
```

El armado de `groups` recorre `orderProjects(products, productOrder)` en lugar de `products`. El resto de la función queda: proyectos abiertos (`status` distinto de `done` y de `archived`), `orderProjects` con `sidebarOrder[group.id]`, después el grupo `__unassigned`, rango `0, 1, 2…`. Quien no entró sigue en `Number.MAX_SAFE_INTEGER` vía `sortCards`.

El cuarto argumento tiene default para que los llamados de tres argumentos de `boardQuery.test.ts` sigan compilando y sigan esperando el orden del array. `BoardPage` igual tiene que pasar `settings.productOrder ?? []`. Si no lo pasa, el tablero ignora el orden de la barra.

Caso nuevo en el describe «orden de tarjetas»:

- Productos en el array `[prodB, prodA]`.
- `productOrder = [prodA.id, prodB.id]`.
- `sidebarOrder` vacío.
- `rank.get(proyecto de A)` es menor que `rank.get(proyecto de B)`.

El caso existente que espera `pB` en el rango 0 cuando el array es `[prodB, prodA]` y no hay `productOrder` se queda. Sirve de regresión: sin lista, manda el store.

Agregar otro caso en el mismo describe, o en el anterior si queda más claro al lado del de `sidebarOrder`:

- `productOrder` pone A antes que B.
- `sidebarOrder` de A pone el segundo proyecto de A antes que el primero.
- El rango es: primer proyecto reordenado de A, segundo de A, después B.

Así las dos claves no se pisan.

## 5. Tests de migración

Describe `workspace v25 -> v26 (spec 076: productOrder)`:

- Un workspace v25 con `sidebarOrder` y `boardViews` ya escritos, sin `productOrder`, sale con `schemaVersion` 26, `productOrder: []`, y esas dos claves iguales.
- Un workspace v25 que ya trae `productOrder: ["b", "a"]` no lo pisa.
- `migrateRecord("workspace", docV26, 26)` con la clave ya array no migra (`migrated === false`).

El test de idempotencia v25 que llama `migrateRecord(..., 25)` no se reescribe.

## 6. Trampas

- `updateSettings({ productOrder: next })` alcanza. `next` es el array completo de ids visibles. No hace falta rearmar `sidebarOrder` en ese llamado: el spread de `settings` lo conserva. No pases `productOrder` adentro de `sidebarOrder`.
- No unir los `DndContext`. El de productos no envuelve los listeners del asa de proyecto: esos siguen en el contexto del grupo. Si los dos niveles comparten contexto, un proyecto se puede soltar sobre otro producto.
- El `DndContext` de productos usa `pointerWithin`. El nodo medido es el grupo entero; con `rectIntersection` el drop sigue cayendo sobre el mismo producto cuando se lo arrastra hacia arriba.
- No pongas los `listeners` del producto en el botón del chevron. Ese botón solo abre y cierra.
- `orderProjects` no se duplica ni se renombra. El nombre quedó de la 075 y también ordena productos.
- El `useEffect` de «Cerrar todos» no se reescribe. Sigue dependiendo solo de `activeGroupId`.
- El default `productOrder = []` de `boardProjectRank` no es una excusa para que `BoardPage` no lo pase.
- El test de «versión actual» de projects pasa a esperar 26. Los tests que fijan el target en 25 se quedan.
- Un producto que pierde su último proyecto desaparece del árbol y, en el próximo arrastre de otro, sale de la lista guardada (D5 escribe solo visibles). Al volver a tener un proyecto aparece al final. No escribas la lista en el alta ni en el borrado para «acordarte» de él.
