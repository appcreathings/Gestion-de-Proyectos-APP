# Tasks 040 — UX: la app le contesta al usuario

> Numeración T4000+. Fases verticales; cada fase deja la app usable y se verifica
> (`tsc --noEmit` + Vitest + `vite build` + lint). Sin cambio de schema/migración.
> `∥` = paralelizable. Cada tarea ancla a `design.md`.
> Baseline al empezar: **823 tests en 75 archivos** (post spec 039).

## Fase A — Canal de feedback (HU-02) · base de todo lo demás
Sin esto, B, E y F no tienen dónde avisar. Primero.

- **T4000** `store/useToastStore.ts`: `enqueueToast`/`dismissToast` puras + store Zustand con
  atajos `toast.success/error/info`, dedupe por `key`, tope de 3, auto-expiración solo para
  `success`/`info`. (design §A2, CA-02.1, CA-02.3, CA-02.4)
- **T4001** `components/ui/Toaster.tsx`: dos regiones (`role="status"`/`polite` y
  `role="alert"`/`assertive`), botón de cerrar por toast. (design §A3, CA-02.1)
- **T4002** Montar `<Toaster />` una vez en `AppLayout.tsx`, junto a `<main id="main-content">`.
  (design §A3)
- **T4003** `ConnectionDialog.tsx:255,268`: reemplazar los dos `alert()` por `toast.error(...)`.
  Verificar que no queda ningún `alert()`/`confirm()` nativo en `src/`. (CA-02.2)
- **T4004** Tests de `enqueueToast`/`dismissToast`: dedupe por `key`, tope de 3 no descarta un
  error en cola, expiración por variante.
- **Checkpoint A:** smoke — un toast de éxito aparece y se autocierra; un toast de error se queda
  hasta cerrarlo a mano; dos toasts con la misma `key` no se apilan.

## Fase B — Guardado veraz (HU-01) · **DEFECTO**, depende de A
El bloque de más valor: sin esto, un fallo de escritura sigue siendo invisible aunque ya haya
canal para mostrarlo.

- **T4010** `store/withPersist.ts`: captura `prevState`, aplica `nextState`, persiste, revierte y
  emite `toast.error` si `persist` rechaza; limpia `lastWriteError` si resuelve. (design §B2,
  CA-01.1, CA-01.2)
- **T4011** `useAppStore`: `writeStatus: "synced" | "writing" | "error"` +
  `lastWriteError: string | null`, con `setWriteError`/`clearWriteError`. (design §B3, CA-01.3)
- **T4012** Cablear `withPersist` en `persistProject`, `persistPeople`, `persistNotifications` y
  los `adapter().write/remove` directos de productos, tipos de proyecto, plantillas de
  checklist/proceso, automations y quarters en `useDataStore.ts`. (design §B2, CA-01.4)
- **T4013** `WorkspaceStatus.tsx`: tres estados (`synced`/`writing`/`error` con botón de
  reintento sobre la última operación fallida). (design §B3, CA-01.3)
- **T4014** Nota en el toast de error de una mutación que ya disparó `runFlowRulesForEvents`:
  distinguir "no se pudo guardar" de "el flujo ya se ejecutó". (design §B4, CA-01.5, R1)
- **T4015** Tests de `withPersist`: resuelve → estado en `nextState`, sin error; rechaza →
  estado vuelto a `prevState`, `lastWriteError` lleno, toast emitido.
- **Checkpoint B:** smoke — con la carpeta local desconectada a mitad de sesión (o un adapter que
  se hace rechazar a propósito), borrar una tarea la deja igual en pantalla tras el fallo, avisa
  por toast, y `WorkspaceStatus` deja de decir "sincronizado".

## Fase C — Diálogos: tamaño y descripción (HU-03, HU-04) · **DEFECTO** · ∥ con B
Independiente del guardado; puede ir en paralelo.

- **T4020** `dialog.tsx`: prop `size` (`sm`/`md`/`lg`/`full`) reemplazando el `h-[99vh]` fijo por
  `max-h` variable; `full` reproduce la clase actual — nada cambia hasta reasignar `size` por
  sitio. (design §C2, CA-03.1)
- **T4021** `dialog.tsx`: prop `description` (renderiza `DialogDescription` `sr-only` si no hay
  una visible ya) + prop `descriptionless` para la declaración explícita de "no aplica". (design
  §C3, CA-04.1, CA-04.3)
- **T4022** Barrido de los ~26 diálogos: asignar `size` según la tabla de `design.md` §C2; quitar
  la cadena `sm:h-auto md:h-auto lg:h-auto` de los 7 que la repiten a mano. (CA-03.2, CA-03.3,
  CA-03.4)
- **T4023** Barrido de los 18 diálogos sin `DialogDescription`: añadir `description` con una
  frase de una línea que diga qué hace el diálogo. (CA-04.2, CA-04.4)
- **T4024** Verificación: recorrer los 26 diálogos en el navegador con la consola abierta — cero
  avisos `Missing Description`.
- **Checkpoint C:** smoke — `VaultSetupDialog` mide lo que su contenido pide en vez del 99% de la
  pantalla; `TaskFormDialog` sigue viéndose igual que antes (era `lg`/`full` ya de facto);
  consola limpia de avisos de Radix.

## Fase D — Teclado en tarjetas clicables (HU-05) · **DEFECTO** · ∥ con B y C
Independiente de A/B/C; toca componentes de tarjeta, no diálogos ni store.

- **T4030** `components/ui/ClickableCard.tsx`: `role="button"` + `tabIndex={0}` +
  `onKeyDown` (Enter/Espacio) con la guarda `e.target !== e.currentTarget` para no interferir con
  controles internos. (design §D2, CA-05.1, R5)
- **T4031** `TaskCard.tsx`: la raíz pasa a `ClickableCard`; verificar que el checkbox de
  selección, el asa de arrastre y el menú de opciones siguen recibiendo su propio foco y no
  disparan `onOpenDetail` al activarse. (design §D3, CA-05.1, CA-05.3, CA-05.5)
- **T4032** Generalizar a `EntityCard.tsx` y `AreaCard.tsx`. (CA-05.2)
- **T4033** Verificar que **no** se tocó el asa de arrastre de `TaskCard` (`TaskCard.tsx:136-142`,
  ya accesible vía dnd-kit `KeyboardSensor`). (design §D3, CA-05.3)
- **Checkpoint D:** smoke — recorrer el kanban solo con teclado: `Tab` llega a una tarjeta,
  `Enter` abre su detalle, `Tab` dentro de la tarjeta llega al checkbox/menú sin abrir el detalle
  de paso.

## Fase E — Errores de formulario (HU-06) · después de A
Necesita el toast de A solo si algún formulario decide avisar fuera del campo; el grueso es
independiente.

- **T4040** `lib/formErrors.ts`: `requiredFields(values, rules) → FieldError[]`, pura. (design
  §E2, CA-06.2)
- **T4041** `TaskFormDialog.tsx` como caso de referencia: quitar `disabled={!title.trim()}`,
  validar al pulsar Guardar, `aria-invalid` + foco al primer campo con error + mensaje asociado
  por `aria-describedby`. (design §E2, CA-06.1)
- **T4042** Replicar el patrón de T4041 en los 15 diálogos restantes con la misma forma
  (`AutomationDialog`, `WebhookSubscriptionDialog`, `ChecklistTemplateDialog`,
  `ProcessTemplateDialog`, `ProjectTypeDialog`, `ProductFormDialog`, `AreaFormDialog`,
  `ItemEditorDialog`, `ProcessEditorDialog`, `SprintFormDialog`, `CreateFromTypeDialog`,
  `ProjectFormDialog`, `QuarterFormDialog`, `AiSettingsCard`, `SettingsPage`). Los `disabled` que
  no son de campo vacío (sin tipo elegido, sin conexión) se quedan como están (CA-06.4). (CA-06.3)
- **T4043** Tests de `requiredFields`: campo vacío → error; todos llenos → `[]`; orden de errores
  sigue el de las reglas.
- **Checkpoint E:** smoke — pulsar Guardar con el nombre vacío en `TaskFormDialog` y en al menos
  dos diálogos más marca el campo, mueve el foco y muestra el motivo; con el campo lleno, guarda
  igual que antes.

## Fase F — Estado de envío (HU-07) · después de A y E
Depende de A para el toast de error en caso de fallo, y en la práctica se prueba junto a los
mismos diálogos que E.

- **T4050** `button.tsx`: prop `pending` (`aria-busy`, `disabled`, spinner). (design §F1, CA-07.1)
- **T4051** `ConfirmDialog.tsx`: `onConfirm` acepta `() => void | Promise<void>`; el diálogo
  **no** cierra hasta que resuelve; botón de confirmar usa `pending`. (design §F2, CA-07.2)
- **T4052** Diálogos de formulario con guardado async (crear/editar proyecto, tarea, conexión,
  tipo de proyecto, y los demás de la Fase E que llaman a un `create*`/`update*` async del store):
  botón de guardar con `pending`; verificar que un segundo clic durante `pending` no dispara una
  segunda llamada. (CA-07.3)
- **T4053** Verificar que un guardado que falla limpia `pending` y deja el diálogo abierto con el
  error visible (vía el toast de A), sin perder lo escrito. (CA-07.4)
- **Checkpoint F:** smoke — doble clic rápido en Guardar produce **una** sola llamada de
  creación; `ConfirmDialog` sobre una acción async no cierra hasta que termina.

## Fase G — Cierre

- **T4060** Repaso de accesibilidad de todo lo nuevo (toasts, `WorkspaceStatus`, diálogos,
  `ClickableCard`, campos con error, botones `pending`): foco, rótulos, contraste AA, información
  no solo por color. (design §7)
- **T4061** Verificación final: `tsc --noEmit`, Vitest completo, `vite build`, lint sin errores
  nuevos. Dejar escrito el delta de la cuenta de tests (sube desde 823, ninguna fase de esta spec
  borra tests existentes).
- **T4062** Confirmar el `smoke.md` completo, marcado, antes de cerrar la spec.

## Secuencia sugerida

`A` → `(B ∥ C ∥ D)` → `E` → `F` → `G`.

A es la base: B, y en menor medida E y F, necesitan un canal para avisar. B, C y D son
independientes entre sí una vez que A existe — pueden ir en paralelo o en cualquier orden. E
necesita A si algún formulario decide avisar fuera del campo (la mayoría no lo necesita, pero se
seculariza después de A por consistencia). F depende de E porque prueba `pending` sobre los
mismos diálogos que E ya tocó.

Si hay que recortar, los candidatos a diferir son **T4014** (nota de distinción en mutaciones que
ya dispararon automations — documentación, no funcionalidad nueva) y una parte de **T4022/T4023**
(el barrido puede hacerse en dos tandas: los diálogos de mayor uso primero, el resto después) —
pero **no** T4012 ni T4041, que son los defectos centrales de B y E.

## Invariantes (no violar)

- **El toast no sustituye el error de formulario.** Un campo vacío se señala en el campo
  (foco + `aria-invalid` + mensaje), nunca solo con un toast — invariante fijado en `spec.md` §3.
- **`withPersist` revierte el estado en memoria, no promete revertir efectos externos.** Una
  automation que ya se ejecutó no se puede "des-ejecutar"; se avisa, no se finge (design §B4).
- **`ClickableCard` no envuelve controles que ya son accesibles.** El asa de arrastre de
  `TaskCard` y cualquier `<button>`/`<input>` interno siguen siendo ellos mismos; la envoltura
  solo reemplaza el `<div>` raíz no interactivo.
- **El anillo de foco es el que ya existe en `index.css:84-87`.** No se define un estilo de foco
  nuevo ni distinto por componente.
- **Sin dependencias nuevas.** El toaster es propio (Zustand + `aria-live`), no una librería
  externa — decisión fijada en `spec.md` §3.
- **Sin `schemaVersion` nuevo ni migración.** Toda la cola de toasts, el estado de escritura y el
  estado `pending` son de sesión/memoria.
- **`flows/`, `applyMapping` y el editor de flujos (036-039) no se reabren.**
