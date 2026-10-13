# Smoke 075 — Tablero global y orden de proyectos

Recorrido manual después de E1–E3 en verde. Anotar en `tasks.md` qué se pudo clicar y qué no.

Datos: al menos dos productos, dos proyectos en el primero, un proyecto sin producto, una tarea en una etapa propia, una tarea hecha, un proyecto archivado o terminado con una tarea viva (no tiene que aparecer).

## Tablero

1. El nav muestra «Tablero» después de «Mis tareas». En un ancho de celular, la barra inferior sigue siendo Dashboard, Productos, Proyectos y Mis tareas.
2. `/app/board` muestra Por hacer, En curso y Bloqueada. Otras aparece solo si hay una etapa propia. Hecha se ve con «N ocultas» y sin esas tarjetas.
3. La tarea del proyecto archivado o terminado no está.
4. Filtrar por el primer producto saca las tareas del otro. Recargar conserva `?product=`.
5. Agregar un proyecto de otro producto como chip, junto con el filtro de producto, deja el tablero vacío y muestra «Ninguna tarea coincide con estos filtros.» Limpiar vuelve a mostrar todo. «Mostrar hechas» sigue como estaba.
6. Buscar un título con mayúscula y tilde distinta encuentra la tarea.
7. En ancho `sm+`, soltar una tarjeta de Otras en En curso la saca de Otras. En el kanban de ese proyecto, la tarea está en En curso. Soltarla de nuevo en la misma columna no cambia el orden.
8. Soltar una tarjeta en Hecha la oculta y sube «N ocultas». «Mostrar hechas» la vuelve a mostrar en Hecha.
9. Clic en una tarjeta abre el drawer. Cerrarlo deja los filtros iguales.
10. A menos de `sm`, se ve el pager y no se pueden arrastrar tarjetas. El drawer cambia el estado.

## Vistas

11. Guardar con el nombre vacío muestra «Escribí un nombre.» y no cierra el diálogo.
12. Guardar «Bloqueos» con prioridad alta. Recargar aplica la vista si la URL tiene `view` y los filtros.
13. Sacar la prioridad: el menú dice «Vista modificada». Actualizar y recargar: la vista ya no trae la prioridad.
14. Borrar la vista saca el param `view` y deja el recorte en pantalla.

## Barra

15. Con el primer producto abierto, arrastrar el segundo proyecto al primer puesto. Recargar: sigue primero. El proyecto del otro producto no se movió.
16. Con el asa enfocada, Flecha abajo lo baja un puesto y el aviso nombra el producto.
17. Minimizar la barra oculta el árbol. No aparece otro control de orden.
18. «Cerrar todos» sigue cerrando el producto del proyecto abierto y no lo reabre solo.
