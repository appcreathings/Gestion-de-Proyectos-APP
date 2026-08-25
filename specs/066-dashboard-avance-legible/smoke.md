# Smoke 066 — Dashboard: avance legible y listas con «ver más»

Con datos (demo o workspace con varios proyectos abiertos, checklists, tareas,
vencidos, estancados y más de 5 filas en al menos una lista).

1. **Tiles.** Exactamente 4, en orden: Proyectos activos · Vencidos · Por vencer ·
   Estancados. **No** existe «Avance medio». Activos → `/app/projects?status=active`.
   Estancados → `?stalled=1`.
2. **Hash.** Tile Vencidos **y** Por vencer → `/app#vencimientos` (scroll). Filas
   de fecha siguen abriendo el proyecto (tab/focus).
3. **Hero.** No es enlace (cursor normal). Muestra `done/total · pct%` dual.
   Si una métrica no tiene ítems, esa barra no aparece.
4. **Ranking.** Click abre `/app/projects/:id`. Si hay > 5 abiertos: «Ver N más»
   / «Ver menos»; las 5 primeras respetan rojo → ámbar → verde y más trabajo
   restante. Recargar vuelve a 5.
5. **Estancados.** Las 5 visibles son las de `updatedAt` más viejo. «Ver N más»
   no reordena.
6. **Carga.** Una persona solo con hechas o archivadas no aparece. Click en
   nombre → `/app/my-tasks?person=<id>` sin `done=1`. Empty: «No hay tareas
   abiertas asignadas.»
7. **Atención.** Vencidos | Por vencer a **ancho completo** (no a ¼). Estancados
   | Carga debajo. Si hay vencidos y no por vencer (o al revés), la sección
   vacía muestra la frase muted **sin** check verde.
8. **Secundarias.** Salud: frase `{n} en rojo · …`. Estado: «N de T», **sin**
   barra de progreso de tarea. Producto: mini-barra + dots; «Sin producto» no
   enlaza. Click en rojo / estado / producto sigue filtrando `/app/projects`.
