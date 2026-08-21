# Design 064 — Rediseño de la tarjeta de tarea abierta

> Acompaña a `spec.md`. Decisiones técnicas, no de producto.

## 1. Estructura del render

El panel pasa de una lista plana de 19 `<div class="grid gap-1.5">` a cinco
zonas con responsabilidad distinta:

```
┌ Cabecera (fija)              estado · vencimiento          ⋯  ✕
├ Encabezado                   título 20/600
│                              resumen 13.5 muted
├ Propiedades                  grid 2 col · filas de 32 px
├ Secciones                    Descripción
│                              Subtareas   (+ barra de avance)
│                              Referencias (links + anexos)
│                              Actividad   (comentarios)
└ Pie (fijo)                   creada · actualizada        Archivar
```

Las secciones se separan con `<div class="h-px bg-border" />`, no con
`border-t pt-4` en cada bloque: una regla es una regla, no un margen que cada
bloque reinventa.

## 2. `PropertyRow` — el componente nuevo

Único componente nuevo del spec. Vive en
`src/features/projects/components/kanban/PropertyRow.tsx`.

```tsx
interface PropertyRowProps {
  label: string;
  htmlFor?: string;
  /** Ocupa las dos columnas del grid (fecha, etiquetas). */
  wide?: boolean;
  children: React.ReactNode;
}
```

Render: `<div>` flex de 32 px con `<Label>` de 78 px (`text-xs
text-muted-foreground`, `shrink-0`) y el control en `flex-1 min-w-0`. El hover
lo pinta la fila (`hover:bg-muted/60 rounded-md`), no el control.

No lleva estado. No decide qué control va dentro. Es un contenedor de layout —
esa es la razón de que sea seguro.

## 3. Controles «sin caja hasta que se usan»

La apariencia se consigue con clases, no con un modo de edición:

```
border-transparent bg-transparent hover:bg-muted/60
focus-visible:border-input focus-visible:bg-background
```

El control sigue montado y enfocable siempre. Esto conserva:

- el `persist(campo, valor)` por campo que ya existe,
- la navegación por Tab,
- el `aria-label` / `htmlFor` de cada campo,
- el comportamiento de Escape del panel.

### 3.1 La trampa de `tailwind-merge` en `Select`

Documentada en `src/components/ui/select.tsx` (spec 037 §E): el tamaño
`default` incluye `text-base sm:text-sm`. Pasar `text-[13px]` por `className`
sustituye `text-base` pero **conserva `sm:text-sm`**, y en ≥ 640 px el texto
vuelve a 14 px dentro de una caja de 32 px.

Por eso las filas usan `size="sm"` (que trae `text-xs` sin variante
responsive) y encima `text-[13px]`. `EntitySelect` y `PersonSelect` no exponen
`size` hoy: se añade como prop pasante, con `default` como valor por defecto
para no alterar sus otros usos.

### 3.2 `DateFieldPreview`

Fija `h-10 w-10` en el botón del calendario y renderiza una línea de vista
previa debajo del input. Se añade `compact?: boolean`:

- `compact` → input `h-8`, botón `h-8 w-8`, sin línea de vista previa (el
  «· en 5 días» se muestra en la propia fila, junto al valor).
- sin `compact` → exactamente lo de hoy. Los demás usos no cambian.

## 4. Las dos columnas

El umbral es del **panel**, no del viewport: el drawer es redimensionable y
guarda su ancho en `localStorage["kanban-drawer-width"]`, así que un breakpoint
de viewport daría el resultado equivocado en una ventana ancha con el panel
estrecho.

**Resuelto en la implementación:** `@tailwindcss/container-queries` no está
instalado (Tailwind 3.4.19 sin el plugin), así que se usa la alternativa ya
prevista — una clase condicional calculada del estado:

```ts
const twoColumns = !isMobile && drawerWidth >= TWO_COLUMN_MIN_WIDTH; // 460
```

En móvil el panel ocupa el viewport completo y va siempre a una columna: los
controles necesitan el ancho entero (CA-05, CA-06). No se añade la dependencia
solo por esto — el estado ya tenía el dato.

### 4.1 Dos trampas de `tailwind-merge` que aparecieron al implementar

1. **El padding se come el icono.** `Select size="sm"` reserva `pr-7` para su
   flecha y `DateFieldPreview compact` reserva `pr-8` para el botón de
   calendario. Un `px-1.5` en la clase compartida llega **después** en la
   cadena y `tailwind-merge` lo deja ganar sobre `pr-*`, metiendo el texto
   debajo del icono. Por eso `QUIET_CONTROL` no lleva padding horizontal y hay
   dos variantes: `QUIET_INPUT` (`px-1.5`, controles sin icono) y `QUIET_DATE`
   (`pl-1.5`, solo el lado libre).
2. **El envoltorio del `Select` no crece.** `Select` envuelve su `<select>` en
   un `div.relative` sin clase de ancho. Como hijo de un contenedor flex ese
   div se encoge a su contenido y el `w-full` de dentro se mide contra una caja
   colapsada. `PropertyRow` lo arregla estirando su último hijo
   (`[&>*:last-child]:flex-1 [&>*:last-child]:min-w-0`), lo que también sirve
   para las filas que llevan un punto de color delante del control.

Reparto: Responsable | Prioridad · Área | Tipo · Sprint | Estimación, y luego
Fecha límite y Etiquetas a ancho completo (`wide`), porque sus valores
("27/08/2026 · en 5 días", una fila de chips) no caben en media columna.

## 5. Cabecera y pie

**Cabecera** — hoy muestra `taskStatusLabel[task.status]` como texto plano de
12 px. Pasa a pastilla con punto de color:

| Estado | Punto | Fondo |
|--------|-------|-------|
| `todo` | `muted-foreground` | `muted` |
| `doing` | `primary` | `accent` |
| `blocked` | `destructive` | `destructive/10` |
| `done` | `success` | `success/10` |

Los chips de vencida / vence pronto se conservan tal cual (ya son correctos) y
la franja de color en el borde izquierdo del panel también.

**Pie** — `border-t` de una línea con `Creada … · Actualizada …` a la izquierda
y `Archivar` como botón `ghost` a la derecha. Sustituye a dos bloques con regla
propia.

## 6. Helpers puros extraídos

Para tener algo verificable en un entorno sin jsdom, se extrae a
`src/features/projects/components/kanban/taskDetailLabels.ts`:

```ts
/** "Vencida hace 3 días" | "Vence hoy" | "Vence en 5 días" | null */
export function dueLabel(daysUntilDue: number | null): string | null;

/** "Creada 3 ago · Actualizada hace 2 h" */
export function metaLabel(createdAt: string, updatedAt: string, now?: Date): string;
```

`dueLabel` es la lógica que hoy vive inline en el JSX del drawer con tres
ternarios anidados y una pluralización repetida cuatro veces. Sacarla no es
adorno: es lo único de este spec que se puede probar sin montar React.

Prueba: `taskDetailLabels.test.ts`, entorno node, casos de frontera en −1, 0, 1
y el umbral de «vence pronto».

## 7. Lo que no se toca

- `persist()`, `changeStatus()`, `addComment()`, `toggleSubtask()`,
  `addLink()`, `removeLink()`, `addTag()`, `removeTag()`, `toggleArchive()` y
  el resto de manejadores: se conservan literalmente.
- El redimensionado por arrastre y su persistencia.
- El bloqueo de scroll del `body` en móvil (spec 054).
- La colocación junto al asistente (spec 048).
- `AttachmentsSection` (ver spec §6).

## 8. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Un control restilado pierde el anillo de foco y rompe CA-04 / AA. | `focus-visible:` explícito en cada variante; revisión con Tab en claro y oscuro. |
| `tailwind-merge` vuelve a morder en otro control. | Solo `Select` tiene variantes responsive en su base; el resto (`Input`, `Textarea`) usa `text-base sm:text-sm` igual — se les aplica el mismo tratamiento con `text-[13px]` + `sm:text-[13px]`. |
| Container queries no disponibles. | Alternativa ya identificada: clase condicional desde `drawerWidth`, que está en el estado. |
| El panel a 400 px queda peor que antes. | CA-05 lo cubre: por debajo de 460 px se apila en una columna. |
