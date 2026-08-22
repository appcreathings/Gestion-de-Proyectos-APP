# Design 065 — Color de tareas: escala de urgencia en pastel

Complemento técnico de `spec.md`. Los valores de aquí son el punto de partida
propuesto; el que manda es el **test de contraste** (§6): si un par no llega a
AA, se ajusta la luminosidad y se documenta, no se baja el listón.

## 1. De dónde salen los valores pastel

No se inventa una paleta. Se toman los pares que la escala de Tailwind ya tiene
resueltos y que dos partes del código eligieron por separado (spec §1.4):

| Uso | Tema claro | Tema oscuro |
|---|---|---|
| Fondo pastel | `<tono>-100` | `<tono>-950` |
| Texto sobre él | `<tono>-900` | `<tono>-100` |
| Riel de 3 px | `<tono>-400` | `<tono>-500` |

El riel usa `-400/-500` y no `-100`: a 3 px de ancho, un pastel de fondo
desaparece. El pastel manda en las superficies grandes (pastillas), no en la
línea fina. Ese es el reparto que hace que la app baje de intensidad sin perder
legibilidad.

## 2. Tokens — `src/index.css`

### 2.1 Sólidos ajustados (D3)

> **Valor final tras el test de contraste (A5):** los `--success` propuestos
> (`142 58% 38%` claro / `142 52% 44%` oscuro) quedaban en 3.48:1 y 2.81:1
> contra su foreground — tampoco los valores actuales cumplían (3.52 / 2.70).
> Se ajustó la **luminosidad** a **32 %** en ambos temas: `142 58% 32%` (4.67:1)
> y `142 52% 32%` (4.95:1). El resto de los pares pasó a la primera.

```css
:root {
  /* antes: 0 72% 51% / 38 92% 45% / 142 71% 35% */
  --destructive: 0 60% 52%;
  --warning: 38 78% 47%;
  --success: 142 58% 32%; /* ajustado: 38% no llegaba a AA */
}

.dark {
  /* antes: 0 63% 45% / 38 92% 50% / 142 64% 42% */
  --destructive: 0 52% 47%;
  --warning: 38 78% 52%;
  --success: 142 52% 32%; /* ajustado: 44% no llegaba a AA */
}
```

Los `-foreground` no cambian. El test de §6 cubre estos cuatro pares también:
bajar croma puede mover el ratio, y `--warning-foreground` ya era el caso justo
(texto oscuro sobre ámbar).

### 2.2 Familia `soft` (D2)

```css
:root {
  --destructive-soft: 356 100% 95%;          /* rose-100  */
  --destructive-soft-foreground: 336 74% 30%; /* rose-900  */
  --warning-soft: 48 96% 89%;                 /* amber-100 */
  --warning-soft-foreground: 28 78% 26%;      /* amber-900 */
  --success-soft: 149 80% 90%;                /* emerald-100 */
  --success-soft-foreground: 164 86% 16%;     /* emerald-900 */
  --info-soft: 214 95% 93%;                   /* blue-100  */
  --info-soft-foreground: 224 64% 33%;        /* blue-900  */
  --primary-soft: 214 32% 91%;
  --primary-soft-foreground: 222 47% 25%;
}

.dark {
  --destructive-soft: 342 88% 16%;            /* rose-950  */
  --destructive-soft-foreground: 356 100% 95%;
  --warning-soft: 28 74% 12%;                 /* amber-950 */
  --warning-soft-foreground: 48 96% 89%;
  --success-soft: 166 91% 9%;                 /* emerald-950 */
  --success-soft-foreground: 149 80% 90%;
  --info-soft: 226 57% 21%;                   /* blue-950  */
  --info-soft-foreground: 214 95% 93%;
  --primary-soft: 222 40% 20%;
  --primary-soft-foreground: 210 40% 92%;
}
```

`info` es nuevo: hoy no hay token azul y por eso `text-blue-600` aparece suelto
en `DailyStandupPage`.

### 2.3 `tailwind.config.js`

Cada par entra como sub-clave, igual que los existentes:

```js
destructive: {
  DEFAULT: "hsl(var(--destructive))",
  foreground: "hsl(var(--destructive-foreground))",
  soft: "hsl(var(--destructive-soft))",
  "soft-foreground": "hsl(var(--destructive-soft-foreground))",
},
// idem warning, success, primary
info: {
  soft: "hsl(var(--info-soft))",
  "soft-foreground": "hsl(var(--info-soft-foreground))",
},
```

Con eso `bg-destructive-soft text-destructive-soft-foreground` existe como clase.

## 3. `Badge` — `src/components/ui/badge.tsx` (D4)

```ts
variants: {
  variant: {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    neutral: "border-transparent bg-muted text-muted-foreground",
    outline: "border-border text-muted-foreground",
    destructive:
      "border-transparent bg-destructive-soft text-destructive-soft-foreground",
    success: "border-transparent bg-success-soft text-success-soft-foreground",
    warning: "border-transparent bg-warning-soft text-warning-soft-foreground",
    info: "border-transparent bg-info-soft text-info-soft-foreground",
  },
}
```

Los nombres de variante **no cambian**: `destructive` sigue llamándose
`destructive` y solo cambia lo que pinta. Así las ~40 llamadas repartidas por la
app (salud, sprints, trimestres, notificaciones, flujos) heredan el pastel sin
tocarlas una por una — que es exactamente lo que hace global el cambio.

`outline` gana `border-border` y `text-muted-foreground`: hoy es
`text-foreground` sin borde, indistinguible del texto normal.

## 4. Dominio — `src/domain/taskUrgency.ts` (D5, D13)

```ts
import { daysUntil } from "./compute";
import type { Task } from "./schemas";

/** Escala ordenada de urgencia (spec 065 §5). El orden del array ES el contrato:
 *  `taskUrgency` devuelve el primer nivel cuya condición se cumple. */
export type UrgencyLevel =
  | "done"
  | "overdue"
  | "blocked"
  | "soon"
  | "priority"
  | "calm";

/** Días de antelación con los que una fecha empieza a considerarse próxima. */
export const SOON_WINDOW_DAYS = 3;

export function taskUrgency(task: Task, now: Date = new Date()): UrgencyLevel {
  if (task.status === "done") return "done";

  const d = daysUntil(task.dueDate, now);
  if (d !== null && d < 0) return "overdue";
  if (task.status === "blocked") return "blocked";
  if (d !== null && d >= 0 && d <= SOON_WINDOW_DAYS) return "soon";
  if (task.priority === "high" || task.priority === "critical") return "priority";
  return "calm";
}
```

Sin clases de CSS, sin React: se testea con objetos planos.

### 4.1 Test (`taskUrgency.test.ts`)

Casos obligatorios, todos con `now` fijo para no depender del reloj:

| Caso | Espera |
|---|---|
| `status: "done"` con `dueDate` de la semana pasada | `"done"` |
| `dueDate` ayer, `status: "todo"` | `"overdue"` |
| `dueDate` ayer **y** `status: "blocked"` | `"overdue"` (el orden gana) |
| `status: "blocked"`, `dueDate: null` | `"blocked"` |
| `dueDate` hoy (`daysUntil === 0`) | `"soon"` |
| `dueDate` en 3 días | `"soon"` (borde incluido) |
| `dueDate` en 4 días | `"priority"` o `"calm"` según prioridad |
| `priority: "critical"`, `dueDate: null` | `"priority"` |
| `priority: "high"`, `dueDate: null` | `"priority"` |
| `priority: "medium"`, `dueDate: null` | `"calm"` |

## 5. Pintura — `src/lib/urgencyStyles.ts` (D6, D12, D13)

```ts
import type { UrgencyLevel } from "@/domain/taskUrgency";

/** Familia pastel única de la app (spec 065 D12). Reemplaza las dos copias que
 *  vivían en PortfolioCalendarView y TaskCalendarView. */
export const TONES = {
  blue:   "border-blue-300 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
  violet: "border-violet-300 bg-violet-50 text-violet-900 dark:bg-violet-950/40 dark:text-violet-100",
  teal:   "border-teal-300 bg-teal-50 text-teal-900 dark:bg-teal-950/40 dark:text-teal-100",
  amber:  "border-amber-300 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
  rose:   "border-rose-300 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-100",
  sky:    "border-sky-300 bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
} as const;

export const TONE_KEYS = Object.keys(TONES) as (keyof typeof TONES)[];

/** Riel de 3 px por nivel. `null` = la tarjeta no lleva riel. */
export const URGENCY_RAIL: Record<UrgencyLevel, string | null> = {
  done: null,
  overdue: "border-l-rose-400 dark:border-l-rose-500",
  blocked: "border-l-violet-400 dark:border-l-violet-500",
  soon: "border-l-amber-400 dark:border-l-amber-500",
  priority: "border-l-blue-400 dark:border-l-blue-500",
  calm: null,
};

/** Texto del nivel para el aria-label de la tarjeta (spec 065 D11). */
export const URGENCY_ARIA: Record<UrgencyLevel, string | null> = {
  done: null,
  overdue: "vencida",
  blocked: "bloqueada",
  soon: "vence pronto",
  priority: "prioridad alta",
  calm: null,
};
```

Las clases van **literales y completas**: Tailwind escanea el archivo, así que
`` `border-l-${tone}-400` `` no compilaría.

### 5.1 Cómo se aplica en `TaskCard.tsx`

El riel es un borde izquierdo que **siempre ocupa 3 px**, tenga color o no, para
que ninguna tarjeta se desplace al cambiar de nivel:

```tsx
const urgency = taskUrgency(task);
const rail = URGENCY_RAIL[urgency];

className={cn(
  "relative group flex flex-col rounded-lg border border-l-[3px] p-3 transition-colors",
  rail ?? "border-l-border/70",
  urgency === "done" && "opacity-70",
  // …lo que ya había de drag, foco y selección
)}
```

Y desaparecen estas tres líneas (spec §1.2):

```diff
- !isPlaceholder && !isOverlay && isBlocked && "border-l-4 border-l-red-500",
- !isPlaceholder && !isOverlay && overdue && "bg-red-50 dark:bg-red-950/20",
- !isPlaceholder && !isOverlay && dueSoon && !overdue && "bg-amber-50 dark:bg-amber-950/20",
```

Igual en `KanbanListView.tsx:65-66` y `MyTasksPage.tsx:359-360`.

El `aria-label` pasa de `Abrir detalle de ${task.title}` a incluir el nivel:

```ts
const aria = URGENCY_ARIA[urgency];
`Abrir detalle de ${task.title}${aria ? ` — ${aria}` : ""}`
```

## 6. Test de contraste (HU-04)

`src/lib/contrast.test.ts`. Es el que convierte "pastel" en algo verificable.

```ts
/** Ratio WCAG 2.1 entre dos colores HSL declarados como "H S% L%". */
function ratio(hslA: string, hslB: string): number { /* hsl→rgb→luminancia relativa */ }

const PAIRS: [name: string, bg: string, fg: string][] = [
  ["destructive-soft claro", "356 100% 95%", "336 74% 30%"],
  ["destructive-soft oscuro", "342 88% 16%", "356 100% 95%"],
  // …los 10 pares soft + los 6 pares sólidos ajustados (D3)
];

it.each(PAIRS)("%s cumple AA", (_n, bg, fg) => {
  expect(ratio(bg, fg)).toBeGreaterThanOrEqual(4.5);
});
```

Los valores se declaran **en el test**, duplicados del CSS a propósito: si
alguien edita `index.css` sin actualizar aquí, el test no lo detecta, pero si
alguien edita aquí sin mirar el CSS tampoco rompe nada real. Para cerrar el hueco,
la tabla del test lleva un comentario que apunta a `index.css` y el paso F del
`tasks.md` incluye compararlos a ojo una vez. No merece un parser de CSS.

## 7. Tipos de trabajo (D9)

`workTypeVariant` deja de mapear a variantes de `Badge` y pasa a mapear a tonos
de `TONES`, para que ningún tipo comparta tono con un nivel de urgencia:

| Tipo | Tono | Nota |
|---|---|---|
| `story` | `teal` | trabajo de producto |
| `key_result` | `teal` | comparte tono con `story`: ambos son resultado, no medio |
| `enabler` | `sky` | trabajo habilitador |
| `spike` | `sky` | comparte tono con `enabler`: ambos son exploración |
| `bug` | `neutral` | **deja de ser rojo**: un bug no es urgente por ser bug |
| `prd` | `neutral` | documento, no ejecución |
| `task` | — | sigue sin pastilla (062 D5) |

Dos tonos para cuatro tipos es deliberado: el tono agrupa en **familias**
(resultado / exploración) y la palabra dentro de la pastilla dice cuál de las dos
es. Darle un tono propio a cada uno sería volver a seis colores compitiendo, que
es el problema que esta spec cierra.

`rose`, `amber`, `violet` y `blue` quedan **reservados** a urgencia. Es la regla
que impide que la confusión vuelva.

## 8. Orden de trabajo sugerido

Tokens → `Badge` → dominio → superficies de tarea → calendarios → limpieza de
colores sueltos. Cada escalón deja la app compilando: al terminar el segundo la
app ya se ve pastel entera (porque los nombres de variante no cambiaron), y el
resto es quitar duplicación.
