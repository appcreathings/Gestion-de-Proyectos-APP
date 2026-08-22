# Spec 065 — Color de tareas: escala de urgencia en pastel

> Estado: **IMPLEMENTADO** (rama `feat/065-colores-tareas-pastel`, 2026-08-21)
> Feature dir: `specs/065-colores-tareas-pastel/` · Fecha: 2026-08-21
> Baseline al empezar: `SCHEMA_VERSION` **23** (sin cambio) · 1333 tests en 141 archivos
> Depende de: 017 (indicadores de vencimiento), 054 (móvil), 061 (Mis tareas),
> 062 (tipos de trabajo), 064 (rediseño del drawer)
> Principios: **IV** (diseño limpio y enfocado), **V** (simplicidad)
> Decisión de producto tomada en brainstorming: **el color de una tarea significa
> urgencia** (prioridad + vencimiento), y **los tokens globales bajan a pastel**.

## 1. Contexto

El color de esta app creció sin gramática. Hoy conviven tres problemas distintos
que se leen como uno solo ("está muy saturado").

### 1.1 Los tokens sólidos están a máximo croma

```
--destructive: 0 72% 51%      --warning: 38 92% 45%      --success: 142 71% 35%
```

Son colores de señal de tráfico. Como `Badge` los usa **rellenos**
(`bg-destructive text-destructive-foreground`), cada badge de prioridad alta o
crítica es el objeto más brillante de la pantalla. Un tablero con veinte tarjetas
tiene veinte de esos.

### 1.2 Un mismo hecho se pinta hasta cinco veces

Una tarea **crítica, vencida y bloqueada** recibe hoy, a la vez:

| Señal | Origen |
|---|---|
| Badge de prioridad rojo relleno | `priorityVariant.critical = "destructive"` (`src/domain/labels.ts:52`) |
| Fondo de tarjeta rojo | `overdue && "bg-red-50 dark:bg-red-950/20"` (`TaskCard.tsx:118`) |
| Badge de fecha rojo relleno | `variant={overdue ? "destructive" : "outline"}` |
| Borde izquierdo rojo 4 px | `isBlocked && "border-l-4 border-l-red-500"` |
| Icono de candado rojo | `<Lock className="text-red-500" />` |

Cinco rojos para dos hechos. No es que el rojo sea muy saturado: es que está
cinco veces.

### 1.3 Seis variantes de badge cargan doce significados

`Badge` solo tiene `default | secondary | destructive | outline | success |
warning`. Sobre esas seis se reparten prioridad (4 valores), tipo de trabajo (7
valores), salud, estado de sprint, estado de trimestre, estado de proyecto, área,
sprint y responsable. El resultado es que `outline` significa simultáneamente
"prioridad baja", "enabler", "PRD", "sprint" y "responsable".

Cuando todo puede ser cualquier cosa, el color deja de identificar. Es
exactamente lo contrario de "que sea fácil identificar las diferentes tareas".

### 1.4 La solución ya existe, inventada dos veces y sin nombre

Dos lugares del código ya resolvieron bien el pastel, cada uno por su cuenta:

```ts
// PortfolioCalendarView.tsx:42 — familia de 6 tonos, claro y oscuro
"border-blue-300 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100"

// TaskDetailDrawer.tsx:50 — spec 064 D15, tras fallar AA con bg-destructive/10
blocked: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100"
```

Es el mismo patrón: **fondo muy claro + texto del mismo tono muy oscuro, con
pareja explícita para tema oscuro**. Nadie le puso nombre, así que no se reusa.
Esta spec le pone nombre y lo hace la regla.

## 2. Objetivo

Que el color de la app tenga **una gramática de una sola frase**:

> El color dice **cuánta prisa corre**. Todo lo demás se dice sin color.

Y que el pastel no sea un gusto estético suelto, sino la consecuencia de que
haya **una** señal por hecho en vez de cinco: si solo pinta una cosa, no hace
falta que grite.

## 3. Por qué no otras formas (descartado)

| Enfoque | Por qué no |
|---|---|
| **Color por área o proyecto**, elegido por el usuario | Exige campo `color` en `Area` → cambio de esquema, migración y un selector de color nuevo. Además compite con la urgencia por el mismo píxel. Descartado en brainstorming a favor de urgencia. |
| **Color manual por tarea** | Máxima libertad, cero semántica: al mes el tablero es un arcoíris sin significado y el usuario tiene que recordar su propio código. |
| **Solo bajar la saturación de los tokens** y no tocar nada más | Ataca §1.1 e ignora §1.2 y §1.3. Cinco rojos pastel siguen siendo cinco señales para dos hechos, y `outline` seguiría significando cinco cosas. |
| **Volver pastel `--destructive` a secas** | `--destructive` pinta el botón de borrado con texto blanco encima. Un pastel ahí rompe AA y quita el aviso de una acción que sí es peligrosa. Por eso la familia `soft` va **en paralelo** al sólido, no en su lugar. |
| **Distinguir los niveles por claridad del mismo tono** (rojo claro / rojo más claro) | Es el modo de fallo clásico del pastel: a bajo croma, la diferencia de luminosidad deja de leerse a tamaño de badge. Los niveles se distinguen por **tono**, todos al mismo peso. |
| **Tarjeta con fondo lavado de color** (en vez de riel) | Es lo que hay hoy (`bg-red-50`) y es justo lo que satura: el color ocupa el 100 % de la superficie de la tarjeta. Un riel de 3 px da la misma información en el 2 % del área. |
| **Colorear también área / sprint / responsable** | Son clasificación, no urgencia. Colorearlos es volver a §1.3. |

## 4. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|---|---|
| **D1** | **El color de una tarea significa urgencia.** Ninguna otra dimensión de la tarea usa color de tono en las superficies de tarea. | Decisión de producto del brainstorming. Es la frase única de §2. |
| **D2** | **Familia `soft` de tokens, en paralelo a los sólidos.** Cada token semántico gana una pareja pastel: `--destructive-soft` / `--destructive-soft-foreground`, y lo mismo para `warning`, `success`, `info` (nuevo) y `primary`. El **sólido** se reserva para superficies de acción (botón primario, botón destructivo). El **`soft`** pinta *todo* badge, pastilla y tinte de la app. | Es lo que permite bajar globalmente a pastel sin romper AA en los botones. Formaliza el patrón que 064 D15 ya descubrió a la fuerza. |
| **D3** | **Los sólidos bajan de croma con moderación** (≈ −10 a −15 puntos de S), no a pastel: `--destructive 0 72% 51% → 0 60% 52%`, `--warning 38 92% 45% → 38 78% 47%`, `--success 142 71% 35% → 142 58% 38%`. Cada cambio se verifica AA contra su `-foreground` en claro **y** oscuro. | El usuario pidió pastel global. El pastel real lo entrega `soft`; el sólido solo deja de gritar. Bajarlo más rompería contraste o quitaría el aviso. |
| **D4** | **`Badge` deja de rellenar con sólidos.** Las variantes `destructive`, `warning`, `success` pasan a pintar con su par `soft`. Se añade `neutral` (fondo `muted`, texto `muted-foreground`). El relleno sólido sobrevive solo en `default` (el badge primario). | Un badge no es una acción: nunca necesitó el peso de un botón. |
| **D5** | **Escala de urgencia de 6 niveles, primera condición que aplica gana** (§5). Vive en una función pura `taskUrgency(task, today)` en `src/domain/taskUrgency.ts`, con test. | Hoy la regla `overdue`/`dueSoon` está copiada literal en `TaskCard`, `KanbanListView` y `MyTasksPage`. Una sola fuente. |
| **D6** | **El riel es el único portador del color de urgencia**: borde izquierdo de 3 px en tarjeta Kanban, fila de lista y fila de Mis tareas. Se eliminan `bg-red-50` / `bg-amber-50` / `dark:bg-*-950/20` y `border-l-4 border-l-red-500`. | Misma información, 2 % del área en vez del 100 %. Y elimina de un golpe tres de los cinco rojos de §1.2. |
| **D7** | **La prioridad deja de tener color.** `priorityVariant` pasa a `neutral`/`outline` en los cuatro valores; la palabra "Alta"/"Crítica" sigue ahí. | La prioridad alta y crítica ya alimentan el riel. El badge coloreado era la segunda copia del mismo hecho. |
| **D8** | **Área, sprint y responsable son neutros** (`outline` con `text-muted-foreground`). | Son clasificación, no urgencia (D1). |
| **D9** | **El tipo de trabajo (062) conserva color**, pero con **tonos propios** de la familia pastel en vez de reusar `warning`/`destructive`, y siempre como pastilla, nunca como riel. | Es la única otra dimensión cromática, y no se confunde con urgencia porque ocupa otra posición y otra forma. Reusar `destructive` para "bug" era lo que hacía que un bug pareciera urgente. |
| **D10** | **El badge de fecha usa el `soft` del mismo tono que el riel** cuando la urgencia viene de la fecha. | Mismo hecho, misma familia: refuerza en vez de competir. No es un rojo distinto. |
| **D11** | **Ningún nivel se comunica solo por color** (WCAG 1.4.1). Cada uno lleva portador textual o de icono: `overdue` → "Vencida hace N d"; `soon` → "Vence en N d"; `blocked` → candado + `aria`; `priority` → texto del badge. El riel va `aria-hidden`; el nivel viaja en el `aria-label` de la tarjeta. | El riel es color puro. Sin esto la feature es inaccesible por definición. |
| **D12** | **Los tonos salen de la familia que el calendario ya validó** (`blue`, `violet`, `teal`, `amber`, `rose`, `sky`), no de una paleta nueva. `PROJECT_COLORS` y la lista equivalente de `TaskCalendarView` pasan a leer de la misma tabla. | Dos copias de la misma lista en dos archivos (`PortfolioCalendarView.tsx:42`, `TaskCalendarView.tsx:43`), una con 6 tonos y otra con 4. Principio V. |
| **D13** | **La decisión (dominio) y la pintura (UI) se separan.** `src/domain/taskUrgency.ts` devuelve un nivel y no conoce Tailwind; `src/lib/urgencyStyles.ts` traduce nivel → clases. | El dominio no importa clases de CSS. Además hace testeable la regla sin render. |
| **D14** | **Sin cambio de esquema.** `SCHEMA_VERSION` sigue **23**. Nada de esto se guarda: todo es derivado. | El color es una lectura del estado, no un dato del usuario. |
| **D15** | **La landing, el blog y `/docs` quedan fuera.** Tienen paleta de marca propia (`BRAND_GUIDE.md`, `--brand-accent`). | Cambiar la marca no es lo que se pidió, y multiplicaría la superficie a verificar. |

## 5. La escala de urgencia (contrato)

`taskUrgency(task, today)` evalúa en orden y devuelve **el primer nivel que
aplica**. El orden es el contrato: no es una tabla de condiciones sueltas.

| # | Nivel | Condición | Tono | Riel |
|---|---|---|---|---|
| 0 | `done` | `status === "done"` | — | sin riel; la tarjeta se atenúa |
| 1 | `overdue` | `dueDate` existe y es anterior a hoy | `rose` | sí |
| 2 | `blocked` | `status === "blocked"` | `violet` | sí |
| 3 | `soon` | `daysUntil(dueDate)` entre 0 y 3 | `amber` | sí |
| 4 | `priority` | `priority` es `high` o `critical` | `blue` | sí |
| 5 | `calm` | cualquier otro caso | — | sin riel |

Cuatro precisiones que el orden decide y que **no** hay que volver a discutir:

- **`done` va primero**, antes que `overdue`. Una tarea terminada no es urgente
  aunque su fecha haya pasado. Hoy esto se logra con `task.status !== "done" &&`
  repetido en cada condición; el orden lo hace estructural.
- **`overdue` gana a `blocked`.** Una tarea vencida *y* bloqueada pinta rosa. El
  candado (D11) sigue diciendo que está bloqueada, así que no se pierde el hecho;
  lo que se pierde es el segundo color.
- **`high` y `critical` comparten el nivel `priority`.** El riel responde "¿esto
  necesita atención?"; la distinción entre Alta y Crítica la dice el texto del
  badge. Pintarlas con dos tonos volvería a §1.3.
- **`soon` incluye el día 0** (vence hoy). No hay nivel "hoy" aparte: sería un
  quinto tono para un caso que el texto "Vence hoy" ya distingue.

## 6. Alcance

**Dentro:**

- `src/index.css` — familia `soft`, ajuste de croma de los sólidos (D2, D3).
- `tailwind.config.js` — exponer los `soft` y el tono `info`.
- `src/components/ui/badge.tsx` — variantes sobre `soft` + variante `neutral` (D4).
- `src/domain/labels.ts` — `priorityVariant` a neutro (D7); `workTypeVariant`
  a tonos propios (D9).
- **Nuevo** `src/domain/taskUrgency.ts` + `taskUrgency.test.ts` (D5, D13).
- **Nuevo** `src/lib/urgencyStyles.ts` — tabla nivel → clases, y la familia de
  tonos única que consumen los calendarios (D12, D13).
- **Nuevo** `src/lib/contrast.test.ts` — verificación AA de los 16 pares (HU-04).
- `src/features/projects/components/kanban/TaskCard.tsx` — riel, quitar lavados.
- `src/features/projects/components/kanban/KanbanListView.tsx` — ídem.
- `src/features/my-tasks/MyTasksPage.tsx` — ídem.
- `src/features/projects/components/kanban/TaskDetailDrawer.tsx` — `STATUS_PILL`
  pasa a leer de la tabla común; chips de fecha a `soft`.
- `src/features/projects/components/kanban/WorkTypeBadge.tsx` — tonos de D9.
- `src/features/projects/calendar/PortfolioCalendarView.tsx` y
  `TaskCalendarView.tsx` — consumir la familia única (D12).
- `src/features/daily/DailyStandupPage.tsx` — `text-red-600` / `text-green-600` /
  `text-blue-600` sueltos a tokens.

**Fuera:**

- El esquema, el store y las migraciones (D14).
- Color por área, proyecto o tarea elegido por el usuario.
- Landing, blog y `/docs` (D15).
- `AttachmentsSection` y los cinco diálogos que lo comparten (deuda de 064 §6).
- Salud de proyecto, estado de sprint y trimestre **cambian de aspecto** al pasar
  `Badge` a `soft`, pero **no** se rediseñan ni cambian de variante aquí.
- Un selector de tema o de paleta en Ajustes.

## 7. Historias de usuario y criterios de aceptación

**HU-01 — Escanear un tablero sin cansarse.**
Como usuario con 20 tareas en el Kanban, quiero distinguir de un vistazo lo que
corre prisa sin que la pantalla me grite.

- [ ] Ninguna tarjeta tiene fondo de color; la urgencia se ve solo en el riel.
- [ ] Un tablero sin tareas vencidas ni bloqueadas ni críticas no muestra ningún
      tono de color en las tarjetas.
- [ ] El riel mide 3 px y no desplaza el contenido de la tarjeta.

**HU-02 — Un hecho, una señal.**
Como usuario, quiero que una tarea crítica y vencida se vea urgente una vez, no
cinco.

- [ ] Una tarea `critical` + vencida + bloqueada muestra **un** tono (rosa).
- [ ] El badge de prioridad de esa tarea no tiene color de tono.
- [ ] El candado sigue presente y accesible.

**HU-03 — Distinguir el tipo de trabajo sin confundirlo con urgencia.**

- [ ] Un `bug` no vencido ni crítico no muestra riel.
- [ ] La pastilla de `bug` no usa el mismo tono que ningún nivel de urgencia.
- [ ] Una tarea `task` sigue sin pastilla de tipo (062 D5).

**HU-04 — Accesible.**

- [ ] Todo par `soft` / `soft-foreground` cumple contraste **AA (4.5:1)** en tema
      claro y oscuro; verificado con cálculo, no a ojo.
- [ ] Los tokens sólidos ajustados en D3 siguen cumpliendo AA con su `-foreground`.
- [ ] Cada nivel de urgencia tiene portador no cromático (D11).
- [ ] El `aria-label` de la tarjeta menciona el nivel cuando no es `calm`.

**HU-05 — Una sola regla de urgencia.**

- [ ] `taskUrgency` es la única implementación; no queda ningún
      `overdue && ...` recalculado en una superficie de tarea.
- [ ] Tiene test unitario que cubre: los 6 niveles, `done` con fecha pasada,
      vencida+bloqueada, `daysUntil` 0 y 3 y 4, y `dueDate === null`.

**HU-06 — Una sola familia de tonos.**

- [ ] `PROJECT_COLORS` y la lista de `TaskCalendarView` desaparecen como copias:
      ambas leen de la tabla única de `urgencyStyles.ts`.

## 8. Verificación

```bash
npx tsc --noEmit
npx vitest run --exclude ".worktrees/**"   # baseline 1333, solo puede subir
npx eslint src
```

Comprobación manual (si hay navegador): Kanban claro y oscuro con una tarea de
cada nivel, vista de lista, Mis tareas, drawer abierto, y ambos calendarios.

El contraste de HU-04 se verifica con un test que calcula el ratio WCAG sobre los
pares declarados, no con inspección visual: es la única forma de que no vuelva a
pasar lo de 064 D15 (un token que "se veía bien" y no llegaba a AA).

## 9. Deuda declarada

`Badge` pierde el relleno sólido en tres variantes. Si alguna superficie usaba un
badge sólido *como si fuera* un botón o una alerta, ahí bajará de peso. Es el
efecto buscado, pero conviene mirar notificaciones y avisos de flujos durante la
verificación manual y anotar (no arreglar aquí) cualquier sitio donde el aviso
quede demasiado callado.

Anotados al cerrar la fase B (todos heredan `soft` sin cambio de código; los
tres primeros son los candidatos a quedar callados, los demás leen razonable):

- `src/features/settings/AiSettingsCard.tsx:453` — badge de error de conexión
  del proveedor de IA: único aviso del estado, sin icono ni texto de refuerzo.
- `src/features/flows/FlowsPage.tsx:537` — badge "con error" en la lista de
  flujos.
- `src/features/integrations/IntegrationsPage.tsx:447` — badge de última prueba
  fallida por conexión.
- `src/features/flows/ScheduledServicesPage.tsx:271,278` — salud in/out de un
  servicio: pastilla pequeña junto al nombre, texto completo en el detalle.
- `src/features/projects/components/kanban/KanbanColumn.tsx:65` — WIP excedido:
  el número grande del contador ya lleva el peso del aviso.
