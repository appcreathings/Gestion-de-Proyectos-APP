# Especificación — Kanban a 2 columnas en tablet

- **Feature ID:** 011-kanban-tablet-2-columnas
- **Estado:** Implementado
- **Fecha:** 2026-07-06
- **Principios afectados (constitución):** IV (diseño limpio y enfocado), V (simplicidad, evitar sobre-ingeniería)

## Resumen

El Kanban de tareas (`TasksTab`) muestra un carrusel de una sola columna en dispositivos tablet de
tamaño común (p. ej. **710 × 835 px**) en vez de aprovechar el ancho disponible para mostrar 2
columnas, como sí ocurre en el resto de las grillas responsivas de la app. La causa es que el
punto de quiebre entre el carrusel móvil y la grilla de 2 columnas está fijado en `md` (768px),
dejando una franja de anchos "tablet" (640–767px) atrapada en el modo de una columna. Este spec
baja ese punto de quiebre a `sm` (640px), alineando el Kanban con la convención ya usada en el
resto del producto (`sm:grid-cols-2`).

## Problema / Necesidad

Revisando `TasksTab.tsx` y `kanban/KanbanColumn.tsx` se confirmó que el número de columnas
visibles del Kanban depende de dos strings de clases de Tailwind que cambian juntas en el mismo
punto de quiebre (alineadas por el commit `5ed7746`):

1. **`TasksTab.tsx`** — el contenedor del board pasa de `flex` + `snap-x snap-mandatory` +
   `overflow-x-auto` (carrusel horizontal, una columna visible a la vez) a
   `grid grid-cols-2` (2 columnas) recién en `md:` (768px), y a `grid-cols-4` en `xl:` (1280px).
2. **`kanban/KanbanColumn.tsx`** — cada columna tiene `min-w-[85vw] shrink-0` (ancho fijo al 85%
   del viewport, sin encogerse) hasta ese mismo `md:`, momento en el que suelta el ancho fijo y
   deja que la grilla decida su tamaño.

Con una tablet a **710 × 835 px** (por debajo de 768px), ambas condiciones aplican el modo móvil:
se ve una sola columna con scroll horizontal `snap`, en vez de un tablero de 2 columnas. Esto
contrasta con el resto de la app, donde todas las demás grillas responsivas (dashboard, biblioteca,
productos, formularios, landing) ya usan `sm:grid-cols-2` (640px) como primer punto de quiebre.

## Decisiones explícitas (no re-preguntar)

- **Reusar el breakpoint `sm` (640px) de Tailwind**, sin agregar un breakpoint custom de "tablet" a
  `tailwind.config.js`. Mantiene la convención ya usada en el resto de la app y no añade
  configuración nueva para un caso puntual.
- **Sin cambios de schema, dominio ni lógica de negocio.** Es puramente un ajuste de clases CSS
  (Tailwind) en dos componentes de presentación.
- **Las 4 columnas de estado siguen fijas** (`todo/doing/blocked/done`, spec 010) y no se vuelven
  reordenables ni configurables.
- **El carrusel móvil se mantiene sin cambios por debajo de 640px** — este spec no toca la
  experiencia de teléfonos pequeños, solo extiende el rango donde se ve la grilla de 2+ columnas.
- **El punto de quiebre a 4 columnas (`xl`, 1280px) no cambia.**

## Historias de usuario (con criterios de aceptación)

### HU-01 — Ver 2 columnas en tablet (640–1279px)
**Como** PM usando una tablet (p. ej. 710 × 835 px), **quiero** ver el tablero organizado en 2
columnas **para** aprovechar el ancho de pantalla sin depender de un carrusel de una sola columna.
- ✅ A 710px de ancho, las 4 columnas de estado se muestran en una grilla 2×2, sin scroll
  horizontal.
- ✅ Cada columna respeta el ancho de la grilla (sin `min-w-[85vw]` fijo) y sus tarjetas, badges y
  fila de botones de acción se ven completos, sin cortes ni solapes.
- ✅ El resaltado `isOver` al arrastrar una tarjeta sigue funcionando igual, sin saltos de layout.

### HU-02 — Móvil angosto sigue en modo carrusel
**Como** usuario en un teléfono angosto (< 640px), **quiero** seguir viendo una columna a la vez
con scroll horizontal `snap` **para** no perder la experiencia táctil ya optimizada (spec 010).
- ✅ Por debajo de 640px, el board sigue siendo un carrusel horizontal `snap-mandatory` con columnas
  al 85% del viewport, igual que antes de este cambio.

### HU-03 — Desktop sigue mostrando 4 columnas
**Como** PM en un monitor de escritorio (≥ 1280px), **quiero** seguir viendo las 4 columnas en una
sola fila **para** no perder la vista completa del tablero.
- ✅ A partir de 1280px (`xl`), las 4 columnas se muestran en una fila, sin cambios respecto al
  comportamiento previo.

## Requisitos no funcionales

- **Cero cambios de schema/dominio/migración.**
- **Cero dependencias nuevas** — el cambio es exclusivamente de clases Tailwind en
  `TasksTab.tsx` y `kanban/KanbanColumn.tsx`.
- **Consistencia visual:** el nuevo punto de quiebre (`sm`, 640px) coincide con el que ya usa el
  resto de las grillas responsivas de la app (`sm:grid-cols-2` en dashboard, biblioteca, productos,
  formularios, landing, etc.).
- **Tests en verde:** la suite Vitest existente sigue pasando sin cambios, dado que no se modifica
  `src/domain` ni lógica de componentes, solo clases de estilo.

## Fuera de alcance (este spec)

- Reordenar o hacer configurable el número/orden de las columnas de estado.
- Arrastrar entre columnas en dispositivos táctiles (fuera de alcance también en spec 010).
- Cualquier cambio a `tailwind.config.js` (breakpoints custom, nuevos tamaños de contenedor).
- Cambios a la lógica de drag-and-drop, filtros (`?area=`/`?sprint=`) o al modelo de datos.

## Supuestos

- No hay trabajo en curso simultáneo sobre `TasksTab.tsx` o `kanban/KanbanColumn.tsx` más allá de
  lo descrito en spec 010 (ya implementado).
- El único lugar donde vive este punto de quiebre son los dos archivos mencionados (verificado por
  búsqueda en `src/`); no existen otras referencias a actualizar.

## Métricas de éxito

- Verificado con smoke visual manual en 710 × 835 px: se ven 2 columnas, sin scroll horizontal, sin
  elementos cortados.
- Verificado que < 640px conserva el carrusel y que ≥ 1280px conserva las 4 columnas en fila.
- `tsc --noEmit`, `vitest run` y `vite build` en verde sin tocar `src/domain`.
