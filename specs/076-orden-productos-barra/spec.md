# Spec 076 — Orden de productos en la barra

> Estado: **IMPLEMENTADO** (rama `feat/076-orden-productos-barra`)
> Feature dir: `specs/076-orden-productos-barra/` · Fecha: 2026-10-13
> Baseline al empezar: `SCHEMA_VERSION` **25** → **26**
> Depende de: 046 (la barra minimizada no monta el árbol), 073 («Abrir todos» / «Cerrar todos»), 075 (asa de proyectos, `sidebarOrder`, `orderProjects`, `reorderWithin`, rango del tablero)
> Enmienda: 075 **D7** (el primer puesto del tablero pasa a ser `productOrder`) y el «no reordenar productos» de 075 **D16** y **D24**
> Principios: **I** (el orden viaja con la carpeta), **II** (el esquema sube de versión), **IV** (claridad), **V** (rebanada vertical, sin librerías nuevas)
> Copy de UI en rioplatense, **tuteo**
> Diseño: `design.md` · Tareas: `tasks.md` · Smoke: `smoke.md` · Prompt: `PROMPT-EJECUCION.md`

## 1. Contexto

`ProjectTree` agrupa Producto → Proyecto. El spec 075 puso un asa en cada proyecto: el arrastre reordena proyectos **dentro** del mismo producto y persiste en `settings.sidebarOrder`. Los grupos de producto siguen el orden del array `products` del store. «Sin producto» (`__unassigned`) va siempre al final. Un producto sin proyectos no se muestra.

075 D16 y D24 dejaron afuera reordenar esos grupos. 075 D7 usa ese orden de productos como primera clave del rango de tarjetas del tablero global (`boardProjectRank`): primero el array, después `sidebarOrder` dentro del producto.

El asa de proyecto vive en un `DndContext` por grupo abierto. El clic en el nombre abre el proyecto. Flecha arriba y Flecha abajo mueven un puesto. La barra minimizada no monta el árbol (046). «Abrir todos» / «Cerrar todos» es de la 073 y no se toca.

`updateSettings` hace spread de primer nivel sobre `settings`. `readWorkspace` escribe el JSON migrado antes del parse de Zod.

## 2. Objetivo

En la barra, arrastrar un producto lo reordena entre los otros productos. Ese orden queda guardado y, al reabrir, la barra lo respeta. El tablero global usa el mismo orden como primera clave de sus tarjetas.

El asa de los proyectos, el grupo «Sin producto» y el resto de las pantallas se quedan como están.

## 3. Decisiones

| # | Decisión | Razón |
|---|----------|--------|
| **D1** | La única superficie nueva es el árbol de `ProjectTree`: la barra de escritorio y el mismo árbol del cajón móvil. No hay ruta nueva ni pantalla de orden en Ajustes. | Es el mismo gesto que la 075, un nivel más arriba. |
| **D2** | El arrastre reordena grupos de producto entre sí. No cambia `productId` de ningún proyecto. No reordena proyectos dentro del producto: eso sigue siendo `sidebarOrder`. | Mezclar los dos gestos en un solo contexto permitiría soltar un proyecto en otro producto, y la 075 lo prohibió. |
| **D3** | «Sin producto» queda último, sin asa, y su id no se guarda en `productOrder`. No es destino de soltar. | No es un producto. El balde residual no se entierra entre productos. |
| **D4** | Siguen ocultos los productos sin proyectos. No se puede ordenar uno hasta que tenga al menos un proyecto. Cuando aparece, va al final de los productos visibles, antes de «Sin producto», hasta que se arrastra. | El árbol es navegación a proyectos. Un producto vacío no tiene fila. |
| **D5** | El orden persiste en `settings.productOrder: string[]`, ids de producto. Leer usa `orderProjects`: un id desconocido se salta; un producto visible que no está en la lista va al final, en el orden del store. Al soltar se escribe la lista visible de productos con proyectos, en el puesto nuevo. Crear, borrar o vaciar un producto no reescribe la lista. | El mismo contrato que 075 D17. El único gesto que fija un puesto es el arrastre o la flecha. |
| **D6** | `SCHEMA_VERSION` **26**. Migración del kind `workspace` `{ to: 26 }`: si `productOrder` no es un array, escribe `[]`. No toca `sidebarOrder`, `boardViews`, proyectos ni tareas. El fallback de `migrateRecord` sube el resto de los kinds. | El orden es del workspace (principio I). Un producto no gana un campo nuevo. |
| **D7** | El clic en el chevron o el nombre sigue abriendo y cerrando el grupo. El arrastre y las flechas nacen de un asa a la izquierda de ese botón. Con el asa enfocada, Flecha arriba y Flecha abajo mueven un puesto entre los productos visibles. En el extremo, no hacen nada y no anuncian. Un aviso `aria-live` dice el nombre y el puesto. | El encabezado es navegación del árbol. El teclado tiene que poder ordenar (principio IV). |
| **D8** | Hay un `DndContext` exterior para los productos. Cada grupo abierto conserva su `DndContext` propio (075 D16). Los listeners van solo en el asa de ese nivel. No se unen los dos niveles en un solo contexto. | Un contexto por nivel hace imposible que el arrastre de un proyecto cambie de producto, y que el de un producto arranque desde una fila de proyecto. |
| **D9** | Enmienda 075 D7. `boardProjectRank` recorre los productos con `orderProjects(products, productOrder)` y, dentro de cada uno, `sidebarOrder`. `__unassigned` sigue último. Sin lista guardada, el rango queda igual que hoy (orden del array). El selector de producto del tablero, la página de productos, el dashboard, la paleta, el informe, los flujos y la IA no leen `productOrder`. | El producto que subiste en la barra queda más arriba en cada columna, igual que ya pasa con el proyecto. El resto de las listas no son esta preferencia. |
| **D10** | «Abrir todos» / «Cerrar todos» y el efecto que no reabre el grupo salteado (073 D15) no se reescriben. Reordenar no cambia el conjunto `expanded`. Arrastrar un grupo cerrado no lo abre. | El orden y el pliegue son gestos distintos. |
| **D11** | La barra minimizada no muestra el árbol y no ofrece otro lugar para reordenar. En el cajón móvil el asa es la misma. El sensor táctil sigue con delay 200 y tolerance 8, para que el scroll gane si el dedo se mueve enseguida. | 046 y 075 D18/D19. Un segundo editor se desactualiza. |
| **D12** | No hay función de dominio nueva ni librería nueva. Se reutilizan `orderProjects` y `reorderWithin`. No se las renombra. | Ya describen «lista guardada + ids visibles». Renombrarlas toca la 075 sin cambiar el comportamiento. |
| **D13** | Copy en rioplatense, tuteo. Los textos cerrados están en el diseño §3. | Principio IV. Un texto nuevo en la implementación se copia de ahí. |
| **D14** | Quedan afuera: soltar un proyecto en otro producto, mostrar productos vacíos para poder ordenarlos, reordenar la grilla de `/app/products` o el panel del dashboard, reordenar el selector de producto del tablero, reescribir el array de archivos de productos, `localStorage`, Gantt, renombrar desde el asa. | Para que el chat que implemente no los agregue. |

## 4. Modelo

`Settings` suma, junto a `sidebarOrder`:

```ts
productOrder: string[]  // default []
```

Cada entrada es un id de producto. `__unassigned` no pertenece a esta lista. Ids repetidos cuentan una vez, por el comportamiento ya testeado de `orderProjects`.

## 5. Barra

Cada grupo de producto visible tiene un asa a la izquierda del chevron. «Sin producto» no. El grupo cerrado igual muestra el asa: la fila del producto siempre está.

Al soltar, o al usar la flecha, `updateSettings({ productOrder: next })` reemplaza solo esa clave. `sidebarOrder` y `boardViews` quedan como estaban.

El orden de los proyectos dentro del grupo no cambia con este gesto.

## 6. Tablero

`BoardPage` pasa `settings.productOrder` a `boardProjectRank`. El default del cuarto argumento existe para los tests viejos; la página no se apoya en ese default.

Dentro de una columna, el producto que quedó primero en la barra aporta sus tarjetas antes que el que quedó debajo. Dentro del producto sigue mandando `sidebarOrder` y, si empatan, `taskIndex` (075 D7).

## 7. Historias

- **HU-01** Arrastro un producto arriba de otro en la barra. Recargo y sigue arriba. Los proyectos de cada uno no cambiaron de puesto.
- **HU-02** «Sin producto» sigue último y no tiene asa. No puedo soltar un producto debajo de él.
- **HU-03** Con el asa de un producto enfocada, Flecha abajo lo baja un puesto y el aviso dice el nombre y el puesto. En el último puesto, Flecha abajo no hace nada.
- **HU-04** «Cerrar todos» sigue cerrando el producto del proyecto abierto y no lo reabre solo. Arrastrar un producto cerrado no lo abre.
- **HU-05** En el tablero, las tarjetas del producto que subí quedan arriba de las del que quedó debajo, en la misma columna. El orden interno de ese producto sigue el de su asa de proyectos.
- **HU-06** La grilla de productos y el dashboard no cambian de orden.
- **HU-07** Con la barra minimizada no hay árbol ni otro control de orden. En el cajón del celular el asa está y el scroll de la lista sigue ganando si el dedo se mueve enseguida.

## 8. Fuera de alcance

Mudanza de proyecto por arrastre, productos vacíos en el árbol, orden de `/app/products`, del dashboard, de la paleta o del selector de producto del tablero, orden de los JSON de producto, `localStorage`, Gantt, un editor de orden en Ajustes.
