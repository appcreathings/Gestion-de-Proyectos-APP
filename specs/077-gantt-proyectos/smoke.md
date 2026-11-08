# Smoke 077 — Gantt de proyectos

Recorrido manual después de las Tareas 1–6 en verde (`npm run dev`, datos demo, Playwright). Leyenda: ✅ a mano (verificado en la app) / 🧪 por test (cubierto por un test, no recorrido a mano) / ❌ falló.

Preparación en los datos demo (no hay proyectos `done` ni historia del año pasado): se cerró «Lanzar A/B de email de bienvenida» (Growth Q3) y se pasó Growth Q3 a estado `done`.

## Historias

1. **HU-01**
   - ✅ a mano: `/app/gantt` (nav «Gantt») abre en Trimestre (Ago–Nov 2026) con una fila por proyecto, barra de fechas, puntos verdes llenos de lo hecho (1 y 8 oct) y línea de hoy.
   - 🧪 por test: puntos de lo que vence (los datos demo no tienen vencimientos en la ventana), `src/features/gantt/ganttModel.test.ts`.
2. **HU-02** ✅ a mano (vía drawer; el arrastre en el kanban no se pudo probar). Estado de la tarea a Hecha en el drawer (mismo camino de guardado que el kanban): al volver al Gantt aparece un punto verde lleno «hecha el sáb, 17 oct 2026» (hoy). Reabrirla a En curso lo quita (queda «Sin fecha»). 🧪 Respaldo por test: `src/store/useDataStore.completedAt.test.ts` («saveProject stamps a task moved to done», «reopening clears completedAt»).
3. **HU-03** (no se pudo producir un workspace v26 en el navegador)
   - 🧪 por test: `src/domain/migrations.test.ts`, «projects v26 -> v27 (spec 077: completedAt) › backfills done tasks from updatedAt as estimated».
   - Revisado en código (`GanttGrid.tsx`: `dotClass`, `title` «Fecha aproximada», `dotAriaLabel`), sin test: estilo hueco punteado y tooltip.
4. **HU-04** ✅ a mano. Dos proyectos como chips dejan `?project=a%2Cb`; al recargar siguen filtrados; al ir a Productos y volver a `/app/gantt` sin params se restaura el mismo `?project=…` desde `hito.gantt.lastQuery`. Ids basura/localStorage corrupto: tests de `ganttQuery`.
5. **HU-05** ✅ a mano. Al desplegar Lanzamiento v1.0 las tareas van de lo hecho a lo pendiente («Sin fecha» al final); clic en una tarea abre su drawer.
6. **HU-06**
   - ✅ a mano: Año + período anterior con un proyecto cerrado (`scale=year&at=2025-10-17`, Abr 2025 – Mar 2026); el proyecto cerrado sigue en el Gantt.
   - 🧪 por test: punto de cierre del año pasado (el cierre demo es de hoy, no se pudo fabricar), `ganttModel.test.ts`.
7. **HU-07** ✅ a mano. Se archivó la tarea hecha (sigue en el Gantt, punto verde y fila) y una pendiente (desaparece de las filas).
8. **HU-08** 🧪 por test (armar un flujo en el navegador no fue práctico): `useDataStore.completedAt.test.ts`, «flow results are stamped too (HU-08)».
9. **HU-09** ✅ a mano. El selector «+ Proyecto» tiene el grupo «Cerrados» con «Growth Q3 · Nimbus»; elegirlo deja solo su fila y su punto de historia.

## Notas

- Sin errores de consola nuevos durante el recorrido (1 warning previo).
- `npm run lint` NO está limpio: 1 error preexistente en `src/hooks/useBreakpoint.ts` (rules-of-hooks), archivo no tocado por esta rama (último commit 47341e7 en main), más 6 warnings.
