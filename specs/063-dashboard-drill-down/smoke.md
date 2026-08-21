# Smoke 063 — Dashboard drill-down

Con datos (demo o workspace con varios estados/salud/personas).

1. Dashboard → tile **Proyectos activos**: URL `/app/projects?status=active`,
   Select en Activo, grilla sin backlog/pausados. Recargar: se conserva.
2. Tile **Estancados** → `?stalled=1`. Chip «Estancados» visible. Quitar chip
   vuelve a listar todos. Recargar con `stalled=1` conserva el filtro.
3. Fila **En rojo** (si count > 0) → `?health=red`. Chip con `healthLabel.red`.
   Los listados coinciden con la fila (mismos proyectos abiertos en rojo).
4. Fila de un **producto** → Select de producto queda en ese valor.
5. Tile **Vencidos** no sale de `/app`; scroll a `#vencimientos`. Filas de esa
   card siguen abriendo el proyecto.
6. Tile **Avance medio**: no es enlace (cursor normal).
7. Nombre en **Carga** → `/app/my-tasks?person=<id>` sin `done=1`.
8. Combinación: pegar `/app/projects?status=active&stalled=1` y recargar.
9. Basura: `/app/projects?health=purple&stalled=yes` no recorta.
10. Lista plana filtrada a cero: mensaje «Ningún proyecto coincide con los filtros actuales.»
