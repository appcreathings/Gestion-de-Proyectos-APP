# Especificación — Sprints, Trimestres y navegación en árbol

- **Feature ID:** 008-sprints-trimestres-arbol
- **Estado:** Completado
- **Fecha:** 2026-07-05
- **Principios afectados (constitución):** I (local-first), II (esquema-contrato), IV (diseño limpio), V (simplicidad/incremental), VI (migrabilidad)

## Resumen

La landing pública muestra un preview del producto (`ProductMockup.tsx`) con un árbol de
navegación (`Proyectos › Marketing › Branding › Q3 Lanzamiento`) y un tablero
`Proyecto · Sprint 7` agrupado por trimestre. Ninguna de esas dos capacidades existía en la
app real: el modelo de datos no tenía Sprint ni Trimestre, y el panel izquierdo era una lista
plana de 7 destinos. Este feature cierra esa brecha: añade **Sprints** por proyecto,
**Trimestres** como agrupación real con progreso agregado, una **navegación en árbol** híbrida
(rail + columna dedicada), y un **preview de fechas** en vivo en todos los formularios con
campos de fecha.

## Problema / Necesidad

1. La gestión de tareas era plana por proyecto (backlog único), sin forma de acotar el trabajo a
   una iteración con fechas y objetivo propios.
2. No existía ninguna vista de portafolio que agrupara proyectos por trimestre y sumara su
   progreso — solo se podía filtrar por producto.
3. El panel izquierdo no reflejaba la jerarquía real de datos (Producto → Proyecto → Área);
   saltar entre proyectos relacionados requería volver a la lista de Proyectos cada vez.
4. Los campos de fecha (`<input type="date">`) no daban ninguna señal legible ("¿en cuántos días
   vence esto?") ni indicaban rangos inválidos (fin antes que inicio).

## Decisiones explícitas (no re-preguntar)

- **Sprint es una entidad embebida por proyecto** (mismo patrón que `Milestone`), no un ciclo
  global del workspace. `Task.sprintId` referencia un sprint del propio proyecto; `null` = backlog.
- **Trimestre es una agrupación real** (colección nueva a nivel workspace, `Project.quarterId`),
  no solo una etiqueta de texto — su progreso se agrega sumando `projectChecklistProgress` de los
  proyectos asignados.
- **Navegación híbrida**: árbol ligero de 2 niveles (Producto → Proyecto) integrado en el rail
  global (`AppLayout`) para saltar rápido desde cualquier pantalla, **más** una columna de árbol
  dedicada de 3 niveles (Producto → Proyecto → Área) en el workspace de Proyectos
  (`ProjectsLayout`), que es la que replica fielmente el `ÁRBOL` del preview.
- **El Kanban mantiene sus 4 columnas** (Por hacer/En curso/Bloqueada/Hecha) — el preview de 3
  columnas es aspiracional; la columna "Bloqueada" aporta información real que no se sacrifica.
- **Trimestres tiene página dedicada + toggle de vista** en Proyectos (Lista / Por trimestre /
  Por producto), no solo un filtro adicional.
- El preview de fechas se construye sobre el `<input type="date">` nativo (accesibilidad y cero
  dependencias nuevas) — solo se añade una línea de texto en vivo debajo.
- **Sin acción rápida de "mover a sprint" en la tarjeta del Kanban**: se reutiliza el diálogo de
  edición de tarea (que ya gana un campo Sprint), igual que ya ocurre con el área — evita saturar
  la tarjeta con una quinta acción.

## Historias de usuario (con criterios de aceptación)

### HU-01 — Planificar por Sprints dentro de un proyecto
**Como** responsable de proyecto, **quiero** crear sprints con nombre, fechas y meta, y asignarles
tareas, **para** acotar el trabajo a iteraciones con seguimiento propio.
- ✅ Un proyecto puede tener 0..N sprints; cada tarea pertenece a un sprint o al backlog.
- ✅ El tablero de Tareas se puede acotar a "Todas las tareas", "Backlog" o un sprint concreto,
  con selector y flechas prev/next.
- ✅ Al eliminar un sprint, sus tareas vuelven al backlog (no se borran).
- ✅ El conmutador muestra el rango de fechas y el número de tareas visibles.

### HU-02 — Agrupar proyectos por Trimestre
**Como** líder de portafolio, **quiero** asignar proyectos a un trimestre y ver su progreso
agregado, **para** entender el avance de una iniciativa que cruza varios proyectos.
- ✅ Página "Trimestres" con tarjetas: progreso agregado (checklists), nº de proyectos, rango de
  fechas, estado.
- ✅ En Proyectos, un toggle "Lista / Por trimestre / Por producto" agrupa con cabecera de
  progreso agregado por grupo.
- ✅ Eliminar un trimestre no borra proyectos; solo los desasigna.

### HU-03 — Navegar por árbol
**Como** usuario con varios productos y proyectos, **quiero** un árbol plegable en el panel
izquierdo, **para** saltar entre proyectos relacionados sin volver a la lista.
- ✅ El rail global muestra un árbol de 2 niveles (Producto → Proyecto) bajo "Proyectos".
- ✅ El workspace de Proyectos (`/app/projects` y `/app/projects/:id`) añade una columna de árbol
  de 3 niveles (+ Áreas del proyecto activo) en pantallas ≥ `lg`.
- ✅ El grupo que contiene el proyecto activo se expande automáticamente.

### HU-04 — Ver un preview de fecha al seleccionarla
**Como** cualquier usuario llenando un formulario con fecha, **quiero** ver de inmediato qué día
es y cuán próximo está, **para** no tener que calcularlo mentalmente.
- ✅ Fecha única → línea "sáb, 5 jul 2026 · en 3 días" bajo el campo, con tono de aviso si está
  vencida o próxima.
- ✅ Rango (inicio/fin) → resumen "1 jul 2026 – 14 jul 2026 · 14 días", o aviso si el fin es
  anterior al inicio.
- ✅ Reutilizado en: tarea, ítem de checklist, proyecto, sprint y trimestre.

## Requisitos no funcionales

- Migración hacia adelante: `SCHEMA_VERSION` 1 → 2, sin romper datos existentes (snapshot
  automático antes de migrar, principio VI).
- Cero dependencias nuevas (Radix/dnd-kit/Zod ya presentes; el preview de fechas usa `Intl`
  nativo).
- Proyectos sin sprints ni trimestres se comportan exactamente igual que antes (regresión cero).

## Fuera de alcance (este ciclo)

- Ciclos globales de workspace (sprints compartidos entre proyectos).
- Burndown/velocity charts de sprint.
- Seguimiento de OKRs a nivel de trimestre (solo progreso agregado de checklists).
- Acción rápida "mover a sprint" desde la tarjeta del Kanban (se cubre vía el diálogo de edición).
- Reconciliar el copy de `ProductMockup.tsx` (la landing sigue usando datos ilustrativos).

## Métricas de éxito

- `tsc --noEmit` y la suite Vitest en verde para todos los archivos de este feature.
- Un proyecto existente (v1, sin sprints) sigue abriendo y funcionando sin cambios visibles.
- Crear un sprint, asignarle tareas y cerrarlo (con recarga de página) persiste correctamente en
  JSON.
- Crear un trimestre, asignarle 2+ proyectos y ver el progreso agregado coincidir con la suma
  manual de checklists.

## Verificación final

- Smoke visual end-to-end con Playwright: crear producto, proyecto, sprint con fechas, tarea con
  campo Sprint, filtrar tablero por Backlog/Sprint, crear trimestre, alternar vistas de Proyectos,
  expandir árbol en rail y columna dedicada.
- Preview de fechas validado: "mié, 1 jul 2026 · hace 4 días" en rojo, rango "14 días", y
  "1 proyecto · 92 días" con progreso agregado en trimestres.
- **0 errores de consola** en todo el recorrido.
- `npx tsc --noEmit` limpio.
- `npx vitest run`: 154/154 tests pasando (incluye tests del spec 007 integrados en el repo).
- Quedan 2 errores de `tsc` preexistentes en archivos de la sesión concurrente
  `007-rag-semantico` (`AiImproveButton.tsx`, `ProjectTypeDialog.tsx`); no se tocaron.
