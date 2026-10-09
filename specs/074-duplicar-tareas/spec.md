# Spec 074 — Duplicar tareas

> Estado: **BORRADOR** (sin implementar)
> Feature dir: `specs/074-duplicar-tareas/` · Fecha: 2026-10-09
> Baseline: `SCHEMA_VERSION` **24** → **24** (sin cambio de esquema ni migración)
> Depende de: 003 (orden = posición en el array), 013 (drawer `?detail=`), 015 (archivado), 017 (selección múltiple), 043 (links), 062 (tipo de trabajo / KR), 064 (horas reales), 073 (etapas)
> Principios: **IV** (claridad), **V** (rebanada vertical, sin librerías nuevas)
> Copy de UI en rioplatense, **tuteo**
> Diseño: `design.md` · Tareas: `tasks.md` · Prompt: `PROMPT-EJECUCION.md`

## 1. Contexto

Hoy no hay forma de copiar una tarea. Para repetir un trabajo parecido («Post semana 2» a partir de «Post semana 1») hay que crearla de cero y volver a escribir la descripción, las subtareas, los links y los tags. Tampoco se puede llevar una tarea, o un bloque de tareas, a otro proyecto.

Lo que ya existe y se reutiliza:

- `ops.addTask(p, task)` (`src/domain/projectOps.ts`) agrega al final de `p.tasks`. El orden dentro de una columna es la posición en el array (spec 003).
- `newTask()` (`src/domain/factories.ts`) arma una tarea con todos los campos.
- Los eventos se derivan por diff de proyecto (`src/automations/events.ts`): toda tarea con id nuevo emite `task.added`.
- La tarjeta tiene un menú `⋯` (`TaskCard.tsx`) con Editar / Archivar / Eliminar. El drawer (`TaskDetailDrawer.tsx`) tiene un pie con Archivar. La barra de selección (`TasksTab.tsx`, spec 017) tiene Mover a… / Archivar / Eliminar.
- El drawer se abre con `?detail=<taskId>` (`openDetail` en `TasksTab`).
- `useDataStore.mutateProject(id, recipe)` escribe cualquier proyecto por id.
- Toast: `useToastStore.getState().toast.success(msg)`. No tiene botón de acción.

## 2. Objetivo

Desde la tarjeta, el drawer o la selección múltiple, la persona duplica una o varias tareas en el mismo proyecto o en otro. La copia trae el **trabajo** (qué hay que hacer) y no la **historia** (qué pasó con la original).

## 3. Decisiones

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | Tres entradas: «Duplicar» (mismo proyecto, instantáneo), «Duplicar en otro proyecto…» (diálogo) y «Duplicar» en la barra de selección (diálogo, por defecto este proyecto). Sin rutas nuevas. | Los tres usos pedidos: variante rápida, llevar a otro proyecto, lote. |
| **D2** | Sin cambio de esquema. `SCHEMA_VERSION` sigue en 24. La copia es una `Task` normal; no guarda de dónde salió. | No hay pedido de trazabilidad. Un campo `duplicatedFrom` sería esquema sin uso. |
| **D3** | **Se copian tal cual:** `title` (ver D5), `description`, `summary`, `priority`, `workType`, `krTarget`, `krUnit`, `assigneeId`, `dueDate`, `estimate`, `tags`. | Es el trabajo a hacer. |
| **D4** | **Se copian con id nuevo:** `links` (id, `createdAt`, `updatedAt` nuevos) y `subtasks` (id y fechas nuevos, `done: false`). | Dos tareas no comparten ids de hijos. Una subtarea hecha en la original no está hecha en la copia. |
| **D5** | Título: en el mismo proyecto se le agrega `" (copia)"`. Si ya termina en `" (copia)"` no se agrega otra vez. En otro proyecto el título queda igual. | En el mismo tablero las dos tienen que distinguirse. En otro proyecto no hay confusión. |
| **D6** | **Se resetean:** `id` y `createdAt`/`updatedAt` nuevos; `status: "todo"`; `archived: false`; `comments: []`; `attachments: []`; `actualHours: null`; `krCurrent: null`; `sourceItemId: null`; `dedupeKey: null`. | Historia de la original. Los adjuntos son archivos físicos bajo la carpeta de la tarea original: copiarlos es otro problema (fuera de alcance). `sourceItemId` ataría dos tareas al mismo ítem de checklist. `dedupeKey` es de un flujo. |
| **D7** | `areaId` y `sprintId`: se conservan en el mismo proyecto. En otro proyecto pasan a `null`. `assigneeId` se conserva siempre (las personas son globales). | Áreas y sprints son ids del proyecto de origen. |
| **D8** | La copia no se agrega a ningún `milestones[].taskIds`. | Un hito agrupa tareas concretas; sumar la copia cambiaría su avance sin que nadie lo pida. |
| **D9** | Mismo proyecto: cada copia se inserta en `p.tasks` **justo después** de su original. Varias copias conservan su orden relativo. Como el status es `todo`, en el tablero aparece en Por hacer; si la original ya estaba en Por hacer, queda debajo de ella. | Al lado de la original es donde se busca. |
| **D10** | Otro proyecto: las copias se agregan **al final** de `p.tasks` del destino, en el orden de la selección dentro del array de origen. Solo se escribe el proyecto destino; el origen no cambia. | Es copiar, no mover. |
| **D11** | Cada copia emite `task.added` (diff de eventos). Corren las automatizaciones y los flujos de «Al crear una tarea» y queda en Actividad como tarea creada. No hay evento ni texto de «duplicada». | Duplicar es crear. Un evento nuevo obligaría a tocar el catálogo de flujos. |
| **D12** | «Duplicar» (una tarea, mismo proyecto) abre el drawer de la copia (`?detail=<idCopia>`) para ajustarla. Sin toast. | El caso de uso es crear una variante: lo siguiente es editarla. |
| **D13** | El diálogo lista los proyectos con `status !== "archived"`, ordenados por nombre. Desde una sola tarea, **excluye** el proyecto actual. Desde la selección, lo **incluye** y viene preseleccionado, con la etiqueta «{nombre} (este proyecto)». | Una sola tarea en el mismo proyecto ya tiene el atajo instantáneo. |
| **D14** | Sin proyectos elegibles, el diálogo muestra «No hay otros proyectos activos.» y el botón Duplicar queda deshabilitado. El ítem del menú se muestra igual. | No hace falta pasar la lista de proyectos a cada tarjeta. |
| **D15** | Al confirmar el diálogo: un solo `mutateProject` sobre el destino con todas las copias, toast «{N} tarea(s) duplicada(s) en «{proyecto}»», se cierra el diálogo y se limpia la selección. Si el destino es el proyecto actual, mismo toast y no se abre ningún drawer. | Una escritura, no N. Abrir un drawer solo tiene sentido con una copia. |
| **D16** | Duplicar una tarea archivada (desde su drawer) da una copia sin archivar en Por hacer. | D6. |
| **D17** | Fuera de alcance: herramienta de IA `duplicate_task`, acción de flujo, copiar adjuntos, «Mover a otro proyecto», duplicar desde Mis tareas, la vista lista o la lista de archivadas, atajo de teclado. | Rebanada mínima que cubre los tres usos. |

## 4. Historias

- **HU-01** En el menú `⋯` de una tarjeta elijo «Duplicar». Aparece «{título} (copia)» en Por hacer, debajo de la original si estaba ahí, y se abre su drawer.
- **HU-02** En el pie del drawer de una tarea uso «Duplicar». El drawer pasa a mostrar la copia.
- **HU-03** En el menú `⋯` o en el drawer elijo «Duplicar en otro proyecto…», elijo un proyecto y confirmo. Veo el toast. En ese proyecto la tarea está al final de Por hacer, con el mismo título, sin área ni sprint.
- **HU-04** Selecciono 3 tareas, uso «Duplicar» en la barra y confirmo con «este proyecto». Aparecen 3 copias, cada una junto a su original, y la selección se limpia.
- **HU-05** Igual que HU-04 pero elijo otro proyecto. Las 3 copias quedan al final de ese proyecto en el mismo orden relativo.
- **HU-06** La copia no tiene comentarios, adjuntos, horas reales ni avance de KR; sus subtareas están todas sin marcar; tiene los mismos links, tags, responsable, fecha y estimación.
- **HU-07** Con una automatización «Al crear una tarea», duplicar la dispara una vez por copia.

## 5. Copy

| Lugar | Texto |
|-------|-------|
| Menú `⋯` y pie del drawer | «Duplicar» · «Duplicar en otro proyecto…» |
| Barra de selección | «Duplicar» |
| Título del diálogo (1 tarea) | «Duplicar en otro proyecto» |
| Título del diálogo (lote) | «Duplicar {N} tareas» |
| Label del selector | «Proyecto destino» |
| Ayuda bajo el selector | «La copia queda en Por hacer, sin comentarios, adjuntos ni horas registradas.» |
| Ayuda extra si destino ≠ actual | «Fuera de este proyecto se quitan el área y el sprint.» |
| Sin destinos | «No hay otros proyectos activos.» |
| Botones | «Duplicar» · «Cancelar» |
| Toast | «1 tarea duplicada en «{proyecto}»» · «{N} tareas duplicadas en «{proyecto}»» |
| Sufijo de título | « (copia)» |

## 6. Criterios de aceptación

- `npx tsc --noEmit` limpio.
- Tests nuevos de `design.md` §6 verdes; suite completa verde.
- `vite build` OK.
- HU-01…07 verificadas en navegador (o anotado qué no se pudo clicar).
