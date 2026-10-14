# Smoke 076 — Orden de productos en la barra

Recorrido manual después de D1–D3 en verde. Anotar en `tasks.md` qué se pudo clicar y qué no.

Datos: al menos dos productos con proyectos, y un proyecto sin producto. En el primer producto, dos proyectos ya reordenables. En el tablero, una tarea abierta en cada uno de esos dos productos. Ancho de escritorio y, para el punto 7, el cajón del celular.

## Barra

1. Arrastrar el segundo producto al primer puesto. Recargar: sigue primero. El orden de los proyectos dentro de cada producto no cambió.
2. «Sin producto» sigue debajo de todos y no tiene asa. No hay forma de soltar un producto debajo de él.
3. Con el asa de un producto enfocada, Flecha abajo lo baja un puesto. El aviso dice el nombre y «quedó en el puesto 2» (o el puesto que sea). En el último producto, Flecha abajo no mueve nada y no anuncia.
4. «Cerrar todos» cierra también el producto del proyecto abierto y no lo reabre solo. Arrastrar un producto cerrado no lo abre. «Abrir todos» sigue abriendo todos.
5. El asa de un proyecto, dentro de su producto, sigue moviendo solo a ese proyecto. Recargar: el producto no cambió de puesto por ese gesto.
6. Minimizar la barra oculta el árbol. No aparece otro control de orden.

## Tablero y el resto

7. En el cajón móvil el asa de producto está. Un toque corto en el nombre abre o cierra. Si el dedo se mueve enseguida para scrollear, el grupo no entra en arrastre.
8. En `/app/board`, en una columna donde haya tarjetas de los dos productos, las del producto que quedó primero en la barra aparecen arriba. Recargar el tablero no las desordena.
9. `/app/products` y el dashboard siguen el orden del store. El producto que quedó primero en la barra no tiene por qué quedar primero ahí.
