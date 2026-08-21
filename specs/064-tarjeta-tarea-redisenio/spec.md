# Spec 064 — Rediseño de la tarjeta de tarea abierta

> Estado: **IMPLEMENTADO**
> Feature dir: `specs/064-tarjeta-tarea-redisenio/` · Fecha: 2026-08-21
> Baseline al empezar: `SCHEMA_VERSION` **22** → **23** (ver D12)
> Depende de: 013 (drawer), 042 (anexos), 043 (links), 044 (descripción rica), 054 (móvil), 062 (tipos de trabajo)
> Principios: **IV** (diseño limpio y enfocado), **V** (simplicidad)
> Lienzo de diseño: dirección A del canvas de rediseño (aprobada 2026-08-21)

## 1. Contexto

`TaskDetailDrawer.tsx` creció por acumulación: cada spec desde la 013 le añadió
un bloque y ninguna revisó el conjunto. Hoy el panel apila **19 bloques
verticales** y todos pesan lo mismo:

| # | Bloque | Alto aprox. |
|---|--------|-------------|
| 1 | Título (label + input 40 px) | 62 px |
| 2 | Resumen (label + input + contador) | 78 px |
| 3 | Descripción (label + RichTextField) | 150 px |
| 4 | Links (label + chips) | 60 px |
| 5–7 | Estado, Prioridad, Tipo | 140 px |
| 8 | Key result (condicional) | 110 px |
| 9–10 | Área, Responsable | 62 px |
| 11 | Sprint (condicional) | 62 px |
| 12 | Fecha límite | 62 px |
| 13 | Estimación | 62 px |
| 14 | Subtareas | variable |
| 15 | Tags | 100 px |
| 16 | Creada / Actualizada | 50 px |
| 17 | Archivar | 60 px |
| 18 | Anexos | variable |
| 19 | Comentarios | variable |

El patrón que domina es *etiqueta de 12 px sobre control de 40 px*: **62 px por
propiedad**, ocho propiedades, **496 px** de formulario antes de que el ojo
llegue a la descripción. El resultado es que **lo que la tarea es** (título,
resumen, descripción) no se distingue de **cómo está clasificada** (ocho selects
idénticos). El ancho por defecto del panel es 400 px, así que casi nada de eso
cabe en pantalla a la vez.

Esto contradice el Principio IV: no hay jerarquía visual obvia y hay ruido —
etiquetas que repiten lo que el control ya dice ("Estado" sobre un select que
dice "En curso").

## 2. Objetivo

Que abrir una tarea responda, sin scroll, a tres preguntas en este orden:

1. **¿Qué es esta tarea?** — título y resumen, con tipografía de título.
2. **¿En qué situación está?** — estado, urgencia, responsable.
3. **¿Qué hay que hacer?** — descripción y subtareas.

Todo lo demás (clasificación, referencias, actividad, metadatos) queda accesible
pero subordinado.

## 3. Por qué no otras formas (descartado)

| Enfoque | Por qué no |
|---------|------------|
| **Dirección B** — dos columnas con raíl de propiedades a la derecha | Exige un panel de ≥ 720 px; hoy arranca en 400 px y es redimensionable. Obligaría a mantener dos layouts completos (raíl en escritorio, apilado en tablet/móvil) para un panel que ya tiene reglas responsive propias de la spec 054. |
| **Dirección C** — cabecera fija con pestañas Detalle / Trabajo / Actividad | Esconde subtareas y comentarios tras un clic e introduce estado de navegación (¿se recuerda la pestaña entre tareas? ¿al cambiar de tarea?). Más superficie de decisión de la que este rediseño necesita. |
| Colapsar secciones con acordeones | Traslada el problema al usuario: sigue habiendo 19 bloques, ahora con un clic cada uno. |
| Mover propiedades a un diálogo aparte | Rompe la edición rápida, que es la razón de ser del drawer (spec 016). |
| Rehacer el drawer desde cero | Perdería reglas ganadas a pulso: bloqueo de scroll en móvil (054), coexistencia con el asistente (048), redimensionado persistido, `persist()` por campo. |

## 4. Decisiones fijadas (no re-preguntar)

| # | Decisión | Razón |
|---|----------|--------|
| D1 | **La fila de propiedad sustituye al bloque etiqueta-sobre-control.** Etiqueta en columna fija de 78 px + control de 32 px en la misma línea. | 62 px → 32 px por propiedad. |
| D2 | **Los controles son los mismos de hoy** (`Select`, `EntitySelect`, `PersonSelect`, `DateFieldPreview`, `Input`), solo restilados: sin borde ni fondo en reposo, fondo `muted` en hover, anillo de foco al editar. | No se inventa una máquina de estados de edición en línea. Se conserva accesibilidad, teclado y el `persist()` por campo. |
| D3 | **Las propiedades van en dos columnas.** Seis emparejadas; fecha límite y etiquetas a ancho completo. Por debajo de 460 px de panel, vuelven a una columna. | Petición explícita sobre el lienzo. El umbral evita que a 400 px queden ilegibles. |
| D4 | **El título deja de tener etiqueta** y se renderiza a 20 px/600 sin borde. El resumen queda debajo a 13,5 px en `muted-foreground`. | Es el encabezado del panel, no un campo más. |
| D5 | **El estado sale del cuerpo y sube a la cabecera** como pastilla con punto de color; el chip de vencimiento se mantiene a su lado. | Responde "¿en qué situación está?" antes del scroll. En móvil se conservan los cuatro botones táctiles de la spec 054. |
| D6 | **Cuatro secciones con encabezado de 11 px versalita**: Descripción, Subtareas, Referencias, Actividad. Separadas por regla de 1 px, no por caja. | Jerarquía sin añadir contenedores. |
| D7 | **Links y anexos viven bajo un mismo encabezado `Referencias`**, pero `AttachmentsSection` conserva su interfaz actual (drop zone, filtros, previsualización). | Ver §6: unificar la estética de anexos a chips es un cambio a un componente compartido por cinco diálogos. Fuera de alcance aquí. |
| D8 | **Las etiquetas (tags) pasan a ser una fila de propiedad**, no una sección. | Son clasificación, no contenido. |
| D9 | **Metadatos y Archivar bajan a un pie fijo** de una línea. | Hoy ocupan dos bloques con regla propia cada uno. |
| D10 | **La métrica de key result son dos filas**: `Progreso` (barra + `actual / meta unidad · %`, solo si hay métrica) y `Métrica` (los tres campos en línea). | Hoy son tres inputs con etiqueta de 10 px cada uno, ~110 px. Así son ~72 px. **Corregido durante la implementación:** la versión inicial escondía los campos tras un botón «editar»; se descartó porque hacía que tres controles editables dejaran de ser alcanzables con Tab sin una acción previa. Nada queda oculto. |
| D11 | ~~Sin cambio de esquema.~~ **Anulada en la segunda ronda** por D12: `SCHEMA_VERSION` **22 → 23**. El resto del rediseño sigue sin tocar el esquema. | — |
| D12 | **`Task.actualHours`**: horas que la tarea realmente costó, en la misma fila que `estimate` y a su derecha. `null` mientras no se registre; la migración **no** copia `estimate` en él. | La estimación es la promesa y el tiempo real es el hecho: separados se pueden comparar, y rellenar el segundo con el primero haría que toda tarea vieja pareciera medida. Comparten fila **siempre**, no solo en modo dos columnas: son dos números de tres caracteres y caben incluso a 400 px. |
| D13 | **El panel no roba el foco al abrirse.** Se elimina el `focus()` sobre el título. | Abrir una tarea es leerla, no editarla. El cursor en el primer campo obligaba a salir de él antes de poder usar el teclado para otra cosa. |
| D14 | **El título envuelve hacia abajo**: es un `textarea` de una línea con el alto ajustado al contenido, no un `input`. Enter confirma y no inserta salto de línea. | Un título largo se recortaba. Ahora usa el espacio inferior, que es lo que sobra en la cabecera. |
| D15 | **La pastilla de estado lleva pareja clara/oscura explícita** (`red-100/red-950`, `emerald-100/emerald-950`) en vez de `bg-destructive/10 text-destructive`, y todos los `<select>` sin fondo declaran color de sus `<option>`. | Ver §9. |

## 5. Alcance

Dentro:

- `src/features/projects/components/kanban/TaskDetailDrawer.tsx` — reorganización completa del render.
- Un componente nuevo `PropertyRow` para la fila etiqueta + control.
- `size` pasante en `EntitySelect` / `PersonSelect` (hoy no lo exponen).
- Modo `compact` en `DateFieldPreview` (hoy fija `h-10` en el botón de calendario).
- Helpers puros nuevos con prueba unitaria: etiqueta de vencimiento y formato de metadatos.

Fuera:

- El esquema y el store.
- `TaskCard` (la tarjeta cerrada del Kanban).
- `TaskFormDialog` (el diálogo de creación).
- La estética interna de `AttachmentsSection` (ver D7 y §6).
- Las direcciones B y C del lienzo.

## 6. Riesgo asumido y deuda declarada

El lienzo aprobado dibuja links y anexos como **una sola fila de chips**.
`AttachmentsSection` es un componente compartido (`AreaFormDialog`,
`ProjectFormDialog`, `ProcessTemplateDialog`, `ChecklistTemplateDialog`,
`OverviewTab`) con zona de arrastre, filtros por tipo, miniaturas y diálogo de
previsualización. Convertirlo en chips es un rediseño propio, con su propio
riesgo de regresión, y afectaría a cinco pantallas que este spec no revisa.

**Decisión:** en 064 los anexos se colocan bajo el encabezado `Referencias`
junto a los chips de link, conservando su interfaz actual. La unificación
estética queda anotada como candidata a un spec posterior.

Es la única desviación deliberada respecto del lienzo aprobado.

## 7. Criterios de aceptación

| # | Criterio |
|---|----------|
| CA-01 | Con el panel a 520 px, el bloque de propiedades mide ≤ 180 px (hoy 496 px). |
| CA-02 | El título se renderiza a 20 px/600 sin borde visible en reposo y sigue guardando al perder el foco y con Enter. |
| CA-03 | Estado y chip de vencimiento son visibles en la cabecera sin hacer scroll, en escritorio y en móvil. |
| CA-04 | Las ocho propiedades siguen siendo editables con teclado: Tab entra, el control muestra anillo de foco, Escape no cierra el panel mientras un control tiene el foco abierto. |
| CA-05 | Por debajo de 460 px de ancho de panel las propiedades se apilan en una columna, sin texto truncado en las etiquetas. |
| CA-06 | Los cuatro botones táctiles de estado de la spec 054 siguen presentes en móvil, con altura ≥ 44 px. |
| CA-07 | El contraste de la etiqueta (`muted-foreground` sobre `background`) cumple AA en tema claro y oscuro. |
| CA-08 | Ninguna propiedad pierde funcionalidad: prioridad, tipo, área, responsable, sprint, fecha, estimación y etiquetas guardan igual que antes. |
| CA-09 | Con `workType === "key_result"`, la fila `Progreso` muestra barra y `actual / meta unidad · %`; al editarla aparecen los tres campos. |
| CA-10 | `npm run typecheck`, `npm run lint` y `npm test` pasan. |
| CA-11 | Al abrir una tarea, `document.activeElement` no es ningún control del panel. |
| CA-12 | Un título de 80+ caracteres se muestra completo en varias líneas, sin recorte ni scroll horizontal. |
| CA-13 | `Estimación` y `Tiempo real` comparten fila a cualquier ancho de panel, incluidos 400 px. |
| CA-14 | En tema oscuro, el desplegable de estado muestra las opciones sobre `popover` con texto `popover-foreground`, y las pastillas de `Bloqueada` y `Hecha` cumplen AA. |

## 9. El desplegable en tema oscuro

El `<select>` de estado y los de las filas de propiedad llevan `bg-transparent`
para no dibujar caja en reposo. El desplegable nativo hereda el
`background-color` **calculado** del control: sin fondo propio, el navegador
pintaba el popup en claro y en tema oscuro salía texto claro sobre blanco.

Las `<option>` necesitan color explícito aunque el control no lo tenga:
`[&>option]:bg-popover [&>option]:text-popover-foreground`, aplicado en
`QUIET_CONTROL` y en la pastilla de cabecera.

Aparte, `bg-destructive/10 text-destructive` no servía para la pastilla de
`Bloqueada`: en oscuro ese token es un rojo apagado (#bb2a2a) que sobre el
fondo casi negro del panel no llegaba a AA. Se sustituye por la pareja
explícita clara/oscura que ya usaba el chip ámbar de «vence pronto».

## 8. Cómo se verifica

- Unitario (vitest, entorno node): helpers puros de vencimiento y metadatos.
- Manual: abrir una tarea con todos los campos llenos, una vacía, una `key_result`
  y una vencida; a 400 px, 520 px y 800 px de ancho de panel; en claro y oscuro.
- El proyecto no tiene React Testing Library ni entorno jsdom configurado
  (`vitest.config.ts` usa `environment: "node"`), así que no se añaden pruebas
  de render en este spec. Introducirlas es un cambio de infraestructura de
  pruebas que merece su propia decisión.
