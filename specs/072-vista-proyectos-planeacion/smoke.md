# Smoke 072 — Vista de proyectos para planear

Manual, en la app con datos (varios proyectos, uno terminado, uno archivado,
dos productos, un trimestre). Desktop y un viewport de ~390 px.

## Proyectos

1. Abrir `/app/projects` sin query. La tab activa es Plan. La URL no tiene `view`.
2. Cada fila muestra nombre, estado, prioridad, responsable (o «Sin responsable»),
   fecha y, si hay trabajo, barras. Un click abre ese proyecto. No hay un link
   adentro de la fila.
3. Buscar un nombre con acento usando el texto sin acento. La lista se achica
   después de un instante. Recargar conserva la búsqueda.
4. Combinar producto + prioridad + «Solo estancados». La URL tiene los tres.
   «Limpiar filtros» los saca y deja la tab Plan.
5. Con «Mostrar cerrados» apagado, un proyecto terminado no está. Elegir estado
   Terminado: aparece, y la URL tiene `status=done` y `closed=1`. Apagar la
   casilla borra los dos y la lista no queda vacía por ese motivo.
6. Abrir desde Trimestres el link «N proyectos →» de un trimestre. La URL es
   `?quarter=<id>`, la vista sigue en Plan y solo se ven proyectos de ese
   trimestre.
7. Desde el dashboard, abrir Activos (`?status=active`), Estancados
   (`?stalled=1`) y una salud (`?health=red`). Cada control llega marcado y
   la vista es Plan.
8. Pasar a Lista, recargar: sigue Lista (`view=list`). La tarjeta muestra
   salud y, si hay tareas, la segunda barra. Volver a Plan borra `view`.
9. Por trimestre y Por producto agrupan. La cabecera dice el conteo y el
   porcentaje que corresponda. El orden de atención se nota dentro del grupo
   (un rojo antes que un verde).
10. Un filtro que no matchea nada muestra «Ningún proyecto coincide con los
    filtros actuales.» y el botón Limpiar. No hay línea de resumen.
11. Con un workspace sin proyectos, el empty de «Aún no hay proyectos» es el
    de siempre, con el botón de crear.

## Productos

12. En `/app/products`, un producto con proyectos lista esos nombres y su
    estado, incluidos cerrados. El número de «N proyectos» coincide con la
    lista (o con el total si hay «Ver N más»).
13. El nombre abre el proyecto. «N proyectos» abre `/app/projects?product=<id>`.
14. Un producto sin proyectos dice «Sin proyectos aún.».
15. Con más de cinco, «Ver N más» abre el resto en la misma tarjeta.

## Mis tareas

17. En Mis tareas, elegir una persona y un filtro (prioridad o estado). Ir al dashboard por el menú y volver a Mis tareas. La URL trae esa query y la lista coincide.
18. Abrir Mis tareas con un link que ya tenga `?person=<otra>`. Se ve esa persona, no el filtro del paso 17. Volver a entrar por el menú, sin query: reaparece el filtro del paso 17, no el del link.
19. «Limpiar filtros» y salir. Al volver, la persona sigue y el filtro puntual no.

## Mobile (~390 px)

16. Repetir 1, 4 y 12. Los controles quedan uno bajo el otro. La fila Plan
    se lee en dos bloques (nombre arriba, meta abajo) y sigue siendo un
    solo link.

## Registro 2026-10-06 (implementación)

Recorrido hecho con datos demo en Chromium (IAB), desktop 1280 px y mobile 390 px.

- OK 1–4, 6–10: tab Plan default con URL pelada; fila Plan = un solo link que abre
  el proyecto; búsqueda sin acentos (`redisen` → «Rediseño onboarding») que sobrevive
  la recarga y se borra de la URL al vaciar; producto + prioridad + estancados
  acumulan en la URL y «Limpiar filtros» la deja pelada; `?quarter=` filtra con la
  tab en Plan; `?status=active` / `?stalled=1` / `?health=red` llegan con el control
  marcado; `view=list` sobrevive la recarga; cabeceras de grupo con conteo + ambos
  pct (omiten el pct con total 0); filtro sin resultados muestra la frase + Limpiar
  y sin resumen.
- OK 5 (mecánica): estado Terminado escribe `status=done&closed=1` y prende la
  casilla; apagarla borra ambos. El demo no tiene proyectos cerrados, así que la
  aparición visual de un terminado se cubre por los tests de `filterProjectsByQuery`.
- OK 12, 13, 16: la tarjeta de producto lista los nombres con su estado ordenados
  por nombre y el conteo coincide; los hrefs de nombres y conteo son los de
  `ROUTES`; en mobile los controles quedan apilados y la fila Plan se lee en dos
  bloques.
- OK 17–19: entrar pelado restaura persona + prioridad; un link con `?person=otra`
  gana y no pisa la memoria; «Limpiar filtros» deja la persona y la próxima entrada
  pelada restaura solo eso.
- No observable con datos demo (cubierto por tests): filas con «N vencidas» /
  «Estancado» (el seed no tiene tareas con fecha ni proyectos estancados), 12/15
  con cerrados o «Ver N más» (un solo producto con 3 proyectos), 14 «Sin proyectos
  aún.» (el único producto tiene proyectos).
- Nota de entorno: los clicks de Playwright en el IAB se ejecutaron con retraso;
  se verificó por URL/href y con clicks por coordenadas. El click en la tab Plan
  (borra `view`) no despachó; el writer quedó verificado por tests y el resto de
  los cambios de vista sí se vieron en la URL.
