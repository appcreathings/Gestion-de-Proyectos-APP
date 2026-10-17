# Smoke 077 — Gantt de proyectos

Recorrido manual después de las Tareas 1–6 en verde (`npm run dev`, datos demo, Playwright). Leyenda: ✅ verificado a mano / ✅ cubierto por test / ❌ falló.

Preparación en los datos demo (no hay proyectos `done` ni historia del año pasado): se cerró «Lanzar A/B de email de bienvenida» (Growth Q3) y se pasó Growth Q3 a estado `done`.

## Historias

1. **HU-01** ✅ verificado a mano. `/app/gantt` (nav «Gantt») abre en Trimestre (Ago–Nov 2026) con una fila por proyecto, barra de fechas y puntos verdes llenos de lo hecho (1 y 8 oct) y línea de hoy. Puntos de lo que vence: los datos demo no tienen tareas con vencimiento en la ventana; cubierto por test en `src/features/gantt/ganttModel.test.ts`.
2. **HU-02** ✅ verificado a mano. Estado de la tarea a Hecha (drawer, mismo camino de guardado que el kanban): al volver al Gantt aparece un punto verde lleno «hecha el sáb, 17 oct 2026» (hoy). Reabrirla a En curso lo quita (queda «Sin fecha», sin vencimiento). Respaldo por test: `src/store/useDataStore.completedAt.test.ts` («saveProject stamps a task moved to done», «reopening clears completedAt»). Nota: el arrastre en el kanban no se pudo simular con el mouse automatizado.
3. **HU-03** ✅ cubierto por test (no se pudo producir un workspace v26 en el navegador). `src/domain/migrations.test.ts` «projects v26 -> v27 … backfills done tasks from updatedAt as estimated»; el estilo hueco punteado y el tooltip «Fecha aproximada» salen de `dotClass` / `title` en `GanttGrid.tsx` (también en `dotAriaLabel`, «fecha aproximada»).
4. **HU-04** ✅ verificado a mano. Dos proyectos como chips dejan `?project=a%2Cb`; al recargar siguen filtrados; al ir a Productos y volver a `/app/gantt` sin params se restaura el mismo `?project=…` desde `hito.gantt.lastQuery`. Ids basura/localStorage corrupto: tests de `ganttQuery`.
5. **HU-05** ✅ verificado a mano. Al desplegar Lanzamiento v1.0 las tareas van de lo hecho a lo pendiente («Sin fecha» al final); clic en una tarea abre su drawer.
6. **HU-06** ✅ verificado a mano en parte. Con Growth Q3 en `done`: Año y ‹ («Período anterior») cambian a `scale=year&at=2025-10-17` (Abr 2025 – Mar 2026) y el proyecto cerrado sigue en el Gantt; el punto verde de un cierre del año pasado no se pudo fabricar (el cierre demo es de hoy), ese recorte queda cubierto por los tests de ventana/puntos en `ganttModel.test.ts`.
7. **HU-07** ✅ verificado a mano. Se archivó la tarea hecha (sigue en el Gantt, punto verde y fila) y una pendiente (desaparece de las filas).
8. **HU-08** ✅ cubierto por test (armar un flujo en el navegador no fue práctico): `useDataStore.completedAt.test.ts`, «flow results are stamped too (HU-08)».
9. **HU-09** ✅ verificado a mano. El selector «+ Proyecto» tiene el grupo «Cerrados» con «Growth Q3 · Nimbus»; elegirlo deja solo su fila y su punto de historia.

## Notas

- Sin errores de consola nuevos durante el recorrido (1 warning previo).
- `npm run lint`: 1 error preexistente en `src/hooks/useBreakpoint.ts` (rules-of-hooks) ajeno a esta rama.
