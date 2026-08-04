# Smoke 040 — UX: la app le contesta al usuario

> Guion de verificación visual para el usuario. El repo no tiene Playwright: el render, el foco,
> el teclado y el contraste en tema oscuro se confirman en el navegador. Recorre toda la app, no
> una sola pantalla — abrí varios diálogos de distintas secciones.

## 1. Canal de feedback (HU-02, Fase A)

- [ ] `Ajustes → Conexiones`: intentá guardar una credencial con el vault bloqueado. Aparece un
      **toast** (no un `alert()` del navegador que bloquee la pestaña).
- [ ] El toast de error tiene el texto real del problema, no un genérico.
- [ ] Un toast de éxito (guardar algo que funciona) desaparece solo a los pocos segundos; uno de
      error se queda hasta que lo cerrás vos.
- [ ] Provocá dos avisos del mismo tipo seguidos (ej. dos fallos del mismo flujo de poll): no se
      apilan dos veces, el segundo reemplaza al primero.
- [ ] Con el lector de pantalla activo (o el inspector de accesibilidad del navegador), un toast
      de error se anuncia con urgencia distinta a uno de éxito.

## 2. Guardado veraz (HU-01, Fase B) — el más importante

> Necesita simular un fallo de escritura: revocá el permiso de la carpeta conectada desde los
> ajustes del navegador (`chrome://settings/content/all` → buscar el sitio → borrar permiso de
> archivos), o desconectá la carpeta a mitad de sesión si la app lo permite.

- [ ] Con el permiso revocado, borrá una tarea. La tarea **no desaparece** de la pantalla (o
      reaparece si ya había desaparecido) tras el fallo — el estado no queda mintiendo.
- [ ] Aparece un toast de error explicando que no se pudo guardar.
- [ ] El indicador de estado en la barra lateral (`WorkspaceStatus`) deja de decir "sincronizado"
      y muestra el estado de error, con una acción de reintentar.
- [ ] Reconectá el permiso y usá "reintentar": la operación se completa y el estado vuelve a
      "sincronizado".
- [ ] Con el permiso normal (sin revocar), crear/editar/borrar una tarea, un proyecto y una
      plantilla funciona exactamente igual que antes de esta spec — sin regresión.

## 3. Diálogos: tamaño (HU-03, Fase C)

- [ ] `VaultSetupDialog` (Ajustes → Conexiones → configurar vault): ocupa un tamaño acorde a sus
      3-4 campos, no el 99% de la pantalla.
- [ ] `TaskFormDialog`, `ProjectFormDialog`, `ProcessEditorDialog`: se ven igual o mejor que
      antes — estos ya tenían contenido para llenar su espacio.
- [ ] En móvil (390px de ancho, DevTools): los diálogos siguen abriendo como hoja inferior
      (`bottom sheet`), sin cambios de comportamiento.
- [ ] Redimensioná la ventana de ancha a angosta con un diálogo abierto: no se corta contenido ni
      queda un salto brusco.

## 4. Diálogos: descripción (HU-04, Fase C)

- [ ] Abrí 8-10 diálogos distintos de distintas secciones (proyectos, tareas, ajustes,
      integraciones, biblioteca) con la consola del navegador abierta: **cero** avisos
      `Missing Description` de Radix.
- [ ] Con un lector de pantalla (o el inspector de accesibilidad), abrir cualquier diálogo
      anuncia una frase de contexto además del título.

## 5. Teclado en tarjetas (HU-05, Fase D)

- [ ] En el kanban de un proyecto, navegá **solo con teclado** (`Tab`, sin tocar el mouse):
      llegás a una tarjeta de tarea.
- [ ] `Enter` sobre la tarjeta enfocada abre el detalle de la tarea.
- [ ] El anillo de foco se ve claramente alrededor de la tarjeta enfocada (mismo estilo que el
      resto de la app, no uno nuevo).
- [ ] Seguí tabulando **dentro** de la tarjeta: llegás al checkbox de selección (si el modo
      selección está activo), al asa de arrastre y al menú de opciones, cada uno con su propio
      foco — sin que `Enter` en esos controles abra también el detalle.
- [ ] Repetí en una tarjeta de `EntityCard`/`AreaCard` (biblioteca o áreas de un proyecto): mismo
      comportamiento.
- [ ] El asa de arrastre sigue funcionando con teclado como antes (`Tab` al asa, flechas o
      `Espacio` según el patrón de dnd-kit) — no debería haber cambiado.

## 6. Formularios: error de campo (HU-06, Fase E)

- [ ] `TaskFormDialog`: dejá el título vacío y pulsá Guardar. El campo se marca como inválido, el
      foco salta ahí, y aparece el motivo.
- [ ] Repetí en al menos dos diálogos más de la lista (`ProjectFormDialog`,
      `AutomationDialog`, `AreaFormDialog`…): mismo comportamiento.
- [ ] Con el campo lleno, Guardar funciona exactamente igual que antes.
- [ ] Un diálogo con un `disabled` que **no** es de campo vacío (ej. "elegir un tipo" en
      `CreateFromTypeDialog` antes de elegir tipo) sigue apagado como antes — eso no cambia.

## 7. Estado de envío (HU-07, Fase F)

- [ ] En un diálogo con guardado (ej. crear un proyecto), pulsá Guardar y mirá el botón: muestra
      un estado de "en curso" (spinner o texto) mientras la operación corre.
- [ ] Hacé doble clic rápido en Guardar: solo se crea **una** entidad, no dos.
- [ ] Un `ConfirmDialog` sobre una acción que tarda (ej. "Ejecutar ahora" un flujo) no se cierra
      hasta que la acción termina — el botón muestra el estado en curso mientras tanto.
- [ ] Provocá un fallo de guardado (ver §2) con un diálogo de formulario abierto: el diálogo
      **no** se cierra, el botón vuelve a su estado normal, y el toast de error explica qué pasó
      — lo escrito en el formulario sigue ahí.

---

## Nota para quien ejecute: orden de verificación recomendado

Verificar en el orden de las fases (A → B → C/D en paralelo → E → F) deja cada checkpoint
apoyado en el anterior: sin el toast de la Fase A, el checkpoint de guardado veraz de la Fase B no
tiene cómo mostrar el error; sin los errores de campo de la Fase E, el estado `pending` de la
Fase F no tiene un caso de fallo que mostrar con contenido real.
