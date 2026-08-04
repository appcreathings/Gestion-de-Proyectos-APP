# Spec 040 — UX: la app le contesta al usuario

> Estado: **SOLO DOCUMENTADO** (planning). No se toca `src/`. Ejecutable en otra conversación.
> Feature dir: `specs/040-ux-feedback-y-confianza/` · Fecha: 2026-07-31
> Auditoría de: componentes transversales de UI (diálogos, tarjetas, formularios, capa de
> persistencia) — no una feature vertical como 036-039.
> Baseline al empezar: **823 tests en 75 archivos**, `tsc` limpio, build OK.

## 1. Contexto

Auditoría frontend/UX/UI de los componentes que hoy no funcionan correctamente. A diferencia de
036-039 (que corrigen el editor de flujos), esta spec mira los primitivos que **todas** las
pantallas comparten: `Dialog`, `Button`, `ConfirmDialog`, las tarjetas clicables, y la capa de
guardado. Un defecto ahí se repite en veintitantos sitios a la vez.

El hallazgo de fondo no es estético: **la app no le contesta al usuario**. Ocho defectos
verificados sobre el árbol actual, todos variaciones de lo mismo — la interfaz hace algo y no
dice qué pasó, o dice algo que no es verdad.

### El guardado puede mentir

1. **Un fallo al escribir en disco no se ve.** Las mutaciones de `useDataStore` aplican el
   `set()` en memoria y **después** persisten: 13 `await persist*` sin `try`/`catch` alrededor.
   `persistProject` (`useDataStore.ts:404-413`) escribe con `adapter().write(...)` sin capturar;
   `deletePerson` (`useDataStore.ts:397-400`) hace `set()` y luego `await persistPeople` — si el
   `write` rechaza (permiso de carpeta revocado, disco lleno), la excepción sube sin que nada la
   atrape, y el estado en memoria ya cambió. La UI sigue mostrando la tarea borrada; el archivo en
   disco todavía la tiene.
2. **La UI afirma "sincronizado" sin poder saberlo.** `WorkspaceStatus.tsx:28-35` muestra el
   badge "sincronizado · carpeta local" de forma **literal** para `mode === "filesystem"`. No hay
   ningún estado de "escribiendo" ni "error de escritura" que lo pueda contradecir — el
   componente no sabe si la última escritura funcionó.

### La app no contesta

3. **Cero canal de feedback.** No existe ni un toast, ni una región `aria-live`, en toda la
   aplicación. El único sitio que avisa de algo usa el diálogo nativo del navegador:
   `ConnectionDialog.tsx:255` (`alert("Desbloquea el vault para guardar credenciales.")`) y
   `:268` (`alert(error.message)`). Bloquea la pestaña, no se puede estilar, y en todo
   `src/features` hay **un solo** `.catch()`.
4. **16 botones de guardar se apagan sin decir por qué.** `disabled={!name.trim()}` (o
   equivalente) en 16 diálogos de formulario — `TaskFormDialog.tsx:277`,
   `ProjectFormDialog.tsx:298`, `AreaFormDialog.tsx:115`, y trece más. Cero `aria-invalid` en
   todo el proyecto. El usuario ve un botón muerto y tiene que adivinar qué campo falta.
5. **Sin estado de envío.** Solo dos diálogos (`ConnectionDialog.tsx:531`,
   `VaultSetupDialog.tsx:125`) muestran "Guardando…"/"Procesando…". El resto acepta un segundo
   clic mientras la promesa de guardado sigue en vuelo. `ConfirmDialog.tsx:44-49` es el caso más
   claro: llama `onConfirm()` sin `await` y cierra el diálogo en la misma función — si
   `onConfirm` es async, el diálogo ya se cerró cuando termina.

### La interfaz no se deja usar

6. **Todos los diálogos nacen a pantalla completa.** `dialog.tsx:35` fija
   `sm:h-[99vh] md:h-[99vh] lg:h-[99vh]` como base. De 26 diálogos en la app, **19 no lo
   sobrescriben**: `VaultSetupDialog` (tres campos: contraseña, confirmar, listo) ocupa el 99%
   del alto de la pantalla igual que `TaskFormDialog`, que sí tiene contenido para llenarlo. Los
   7 que sí corrigen (`ConfirmDialog.tsx:35`, `ConnectFolderDialog.tsx:56`…) repiten la misma
   cadena `sm:h-auto md:h-auto lg:h-auto` copiada y pegada.
7. **18 de 26 diálogos sin `DialogDescription`.** Radix emite un aviso por consola cada vez que
   se abre uno (`Missing Description...`), y un lector de pantalla anuncia el diálogo sin
   contexto de qué hace. `AutomationDialog.tsx`, `ProjectFormDialog.tsx`, `TaskFormDialog.tsx`,
   `ProcessEditorDialog.tsx`, `ProjectTypeDialog.tsx` y trece más no la incluyen; `DialogContent`
   tampoco ofrece una forma explícita de declarar su ausencia.
8. **Lo clicable no es alcanzable con teclado.** Alrededor de 138 `onClick` sobre elementos que
   no son `<button>` (principalmente `<div>`), y **cero** `role="button"` + **cero** `tabIndex`
   en todo `src/`. `TaskCard.tsx:119` es el caso central: abrir el detalle de una tarea del
   kanban — la acción más frecuente de la app — solo funciona con ratón. La ironía es que
   `index.css:84-87` ya define el anillo de foco para `[role="button"]:focus-visible` y
   `[tabindex]:not([tabindex="-1"]):focus-visible` — la regla existe y nadie la usa porque nada
   lleva esos atributos.

## 2. Objetivo

Que toda acción del usuario tenga una respuesta **visible y verdadera** — si algo se guardó, si
algo falló, si algo está en curso — y que todo lo que se puede clicar se pueda también alcanzar
con teclado.

## 3. Decisiones fijadas (tomadas al planificar, no re-preguntar)

- **Toaster propio, no una librería externa.** Un store de Zustand con una cola pura más una
  región `aria-live` montada una vez en `AppLayout`. Cero dependencias nuevas: la constitución
  ratifica un stack cerrado (Radix/shadcn/lucide, §"Restricciones técnicas") y el Principio V
  pide evitar sobre-ingeniería mientras un enfoque más simple baste.
- **El guardado veraz (defectos 1 y 2) es el eje de la spec, no un añadido.** Se revierte el
  estado en memoria si la escritura a disco falla, y `WorkspaceStatus` pasa a tener un estado que
  puede decir que algo salió mal. Es el Principio I tomado en serio: si los datos son del
  usuario, un guardado que falla en silencio es la peor violación posible de "los datos son del
  usuario".
- **El toaster no sustituye el error de formulario.** Que falte el nombre de una tarea se
  resuelve **en el campo** (foco + `aria-invalid` + mensaje), no flotando arriba a la derecha
  donde ya no se ve cuando el usuario vuelve la vista al formulario. El toast es para lo que pasa
  fuera del formulario que el usuario tiene enfrente: guardado en disco, ejecución de un flujo,
  conexión de una carpeta.
- **Verificación por lógica pura + `smoke.md` manual**, igual que 036-039. `vitest.config.ts`
  corre en `environment: "node"`, sin `jsdom` ni `@testing-library/react`, y no hay un solo
  `.test.tsx` en el repo. Esta spec no monta un segundo entorno de test: cada pieza con lógica
  (cola de toasts, envoltura de guardado, validación de formulario) se extrae a una función pura
  testeable en Node: el render, el foco y el teclado se verifican a mano con `smoke.md`.
- **`flows/`, `applyMapping` y todo lo que 036-039 ya resolvieron quedan intactos.** Esta spec es
  transversal a los primitivos de UI; no reabre el editor de flujos.
- **Sin cambio de schema.** Nada de esto se persiste: la cola de toasts es de sesión, el estado
  de escritura es de sesión, las reglas de validación de formulario son derivadas.

## 4. Historias de usuario y criterios de aceptación

### HU-01 — El guardado que falla se ve y se revierte · **DEFECTO**
Como usuario, quiero que si el guardado en disco falla, la app no finja que funcionó.

**Causa raíz:** ver §1.1-1.2. `set()` antes de `await persist*`, sin `try`/`catch`, y un badge
que es literal para el modo, no para el resultado de la última escritura.

- **CA-01.1** Si `adapter().write(...)` o `adapter().writeDoc(...)` rechaza, el estado en
  memoria **vuelve** al valor de antes de la mutación.
- **CA-01.2** El usuario ve un toast de error con el mensaje concreto (`e.message`), no un
  silencio ni una excepción sin capturar en la consola.
- **CA-01.3** `WorkspaceStatus` tiene tres estados visibles: sincronizado, escribiendo, error de
  escritura — el tercero con una acción de reintento.
- **CA-01.4** Las 13 rutas de persistencia de `useDataStore.ts` quedan cubiertas: proyectos,
  personas, notificaciones, actividad, y el resto de colecciones que el store persiste.
- **CA-01.5** Una mutación que ya disparó un efecto externo observable (por ejemplo, una acción
  del motor de flujos que llegó a ejecutarse) **no** finge revertir ese efecto — se documenta la
  distinción entre lo que sí se puede deshacer (el registro en disco) y lo que no (un webhook ya
  enviado), y se avisa en vez de mentir.

### HU-02 — La app confirma lo que hace
Como usuario, quiero saber si crear, guardar, borrar o ejecutar algo funcionó.

- **CA-02.1** Existe una cola de toasts (éxito / error / info) con una región anunciada:
  `role="status"` + `aria-live="polite"` para éxito/info, `role="alert"` +
  `aria-live="assertive"` para error.
- **CA-02.2** Los dos `window.alert()` de `ConnectionDialog.tsx:255,268` se reemplazan por
  toasts. Ningún `alert()`/`confirm()` nativo queda en el código de producción.
- **CA-02.3** Máximo 3 toasts visibles a la vez; uno repetido con la misma clave no se apila, se
  reemplaza (evita la avalancha de un flujo de poll que falla cada 5 minutos).
- **CA-02.4** Cada toast se puede cerrar a mano y expira solo (éxito ~4s, error no expira solo:
  el usuario lo cierra).
- **CA-02.5** La cola es una función pura (`enqueueToast(state, toast) → state`), testeable sin
  DOM.

### HU-03 — Los diálogos ocupan lo que su contenido pide · **DEFECTO**
Como usuario en un diálogo de 3 campos, no quiero que ocupe el 99% de mi pantalla.

**Causa raíz:** ver §1.6. `h-[99vh]` fijo en la base, sobrescrito ad-hoc en 7 de 26 sitios con la
misma cadena repetida.

- **CA-03.1** `DialogContent` gana una prop `size` (`"sm" | "md" | "lg" | "full"`) que controla
  un `max-h` (no un `h` fijo): el diálogo crece con su contenido hasta el tope de su tamaño, no
  ocupa el tope siempre.
- **CA-03.2** Los 26 diálogos existentes reciben el `size` que corresponde a su contenido real
  (formulario corto → `sm`; formulario con tabla/editor → `lg`; el editor de flujos, que
  necesita el lienzo completo → `full`).
- **CA-03.3** Los 7 diálogos que hoy repiten `sm:h-auto md:h-auto lg:h-auto` a mano quedan
  usando la prop; cero clases de altura sueltas en las llamadas.
- **CA-03.4** En móvil (`< 640px`) el comportamiento de hoja inferior (`bottom-0`, `rounded-t-xl`)
  no cambia — la prop `size` solo afecta el layout `sm:` en adelante.

### HU-04 — Todo diálogo se anuncia con contexto · **DEFECTO**
Como usuario con lector de pantalla, quiero saber para qué es el diálogo que se acaba de abrir.

**Causa raíz:** ver §1.7. `DialogContent` no exige ni facilita una descripción; 18 de 26 llamadas
no la tienen.

- **CA-04.1** `DialogContent` acepta una prop `description` que renderiza un
  `DialogDescription` visualmente oculto (`sr-only`) cuando el diseño no quiere texto visible
  bajo el título, pero sí anunciado.
- **CA-04.2** Los 18 diálogos sin descripción reciben una frase de una línea que dice qué hace el
  diálogo (no repite el título).
- **CA-04.3** Si un diálogo declara explícitamente que no necesita descripción, lo hace con un
  prop `descriptionless` — no por omisión accidental — para que el aviso de Radix no vuelva a
  aparecer sin que quede constancia de la decisión.
- **CA-04.4** Cero avisos de `Missing Description` en la consola al recorrer los 26 diálogos.

### HU-05 — Lo clicable es alcanzable con teclado · **DEFECTO**
Como usuario que no usa ratón, quiero poder abrir el detalle de una tarea con `Tab` + `Enter`.

**Causa raíz:** ver §1.8. `onClick` sobre `<div>` sin `role`, `tabIndex` ni `onKeyDown`; el estilo
de foco ya existe en `index.css:84-87` y no tiene a quién aplicarse.

- **CA-05.1** `TaskCard` (el caso de mayor uso: abrir el detalle desde el kanban) es alcanzable
  con `Tab` y se activa con `Enter` o `Espacio`, sin activarse dos veces cuando el foco está en
  un control interno (checkbox, menú, botón de mover).
- **CA-05.2** El mismo patrón se aplica a las demás tarjetas clicables con la misma forma:
  `EntityCard`, `AreaCard`.
- **CA-05.3** El asa de arrastre de `TaskCard` (`TaskCard.tsx:136-142`, ya un `<button>` con
  `KeyboardSensor` cableado por dnd-kit) **no se toca** — ya es accesible.
- **CA-05.4** El anillo de foco es el que ya define `index.css:84-87` — no se crea un estilo de
  foco nuevo.
- **CA-05.5** Un elemento envuelto de esta forma expone un `aria-label` o texto accesible que
  identifica qué abre (ej. "Abrir detalle de {título de la tarea}").

### HU-06 — El formulario dice qué le falta
Como usuario, quiero saber qué campo completar cuando el botón de guardar no reacciona.

**Causa raíz:** ver §1.4. `disabled={!name.trim()}` apaga el botón sin indicar la causa; cero
`aria-invalid` en el proyecto.

- **CA-06.1** El botón de guardar deja de estar `disabled` por validación; al pulsarlo con un
  campo requerido vacío, valida, marca `aria-invalid="true"` en ese campo, mueve el foco ahí y
  muestra el mensaje de qué falta.
- **CA-06.2** La regla de qué campos son requeridos por diálogo es una función pura
  (`requiredFields(values, rules) → { field, message }[]`), testeable sin DOM.
- **CA-06.3** Se aplica a los 16 diálogos identificados con este patrón; ninguno queda con un
  botón que se apaga sin explicación.
- **CA-06.4** El botón puede seguir deshabilitado por razones que no son "falta completar algo"
  (ej. sin conexión, sin selección de tipo) — esas siguen siendo `disabled`, porque ahí no hay
  nada que el usuario pueda corregir en el campo.

### HU-07 — Guardar tiene estado y no se puede disparar dos veces
Como usuario, quiero ver que mi clic en Guardar se está procesando, y que un segundo clic no
duplique la acción.

**Causa raíz:** ver §1.5. Solo 2 de los diálogos con guardado async muestran progreso;
`ConfirmDialog` cierra antes de que `onConfirm` resuelva.

- **CA-07.1** `Button` gana una prop `pending` (spinner + `aria-busy="true"` + `disabled`
  mientras está activa).
- **CA-07.2** `ConfirmDialog.onConfirm` acepta `() => void | Promise<void>`; el diálogo **no**
  cierra hasta que la promesa resuelve, y muestra `pending` en el botón de confirmar mientras
  tanto.
- **CA-07.3** Los diálogos de formulario con guardado async (crear/editar proyecto, tarea,
  conexión, tipo de proyecto…) usan `pending` en su botón de guardar; un segundo clic mientras
  está `pending` no dispara una segunda llamada.
- **CA-07.4** Un guardado que falla limpia el estado `pending` y deja el diálogo abierto con el
  error visible (vía HU-02), para que el usuario pueda corregir sin perder lo escrito.

## 5. Fuera de alcance (explícito)

- **Rediseño visual, tokens de color o tema.** Esta spec corrige comportamiento e
  interactividad, no estética. Ningún color, tipografía o espaciado cambia salvo el necesario
  para el estado `pending`/error de un componente ya existente.
- **Modo oscuro.** Ya existe (`ThemeProvider`); no se audita aquí.
- **`landing/` y `blog/`.** Contenido de marketing, fuera del flujo autenticado de la app; sus
  propios `<table>` y componentes no entran en el barrido de teclado de HU-05.
- **`prefers-reduced-motion` global.** Hoy solo `Reveal.tsx` (landing) lo respeta. Se anota como
  deuda técnica identificada durante la auditoría, no entra en esta spec.
- **Migrar el runner de tests a jsdom/Testing Library.** Decisión fijada en §3: se prueba lógica
  pura, no render.
- **`flows/canvas/` y todo lo que 036-039 ya resolvieron.** El editor de flujos tiene sus propios
  diálogos, paneles y pickers ya auditados en specs previas; esta spec no los reabre.
- **Undo/deshacer para el borrado de entidades.** HU-01 revierte un fallo de **escritura**; no
  añade un "deshacer borrado" para cuando la escritura sí funciona.

## 6. Principios afectados (gobernanza)

- **Principio I (Local-first, los datos son del usuario):** HU-01 es la aplicación directa — si
  el archivo del usuario no se pudo escribir, la app no puede fingir que sí.
- **Principio IV (Diseño limpio y enfocado):** HU-03, HU-04 y HU-05 son literalmente los
  criterios que el principio ya exige ("navegación por teclado", "componentes accesibles") y que
  la auditoría encontró incumplidos.
- **Principio V (Simplicidad y entrega incremental):** el toaster propio en vez de una
  dependencia nueva; HU-06 y HU-07 reutilizan `Button` y `ConfirmDialog` existentes en vez de
  crear componentes paralelos.
- **Principio II:** sin `schemaVersion` nuevo ni migración — nada de esto se persiste.

## 7. Riesgos

- **R1 — `withPersist` no puede revertir un efecto ya disparado fuera del store.** Si una
  mutación de tarea ya hizo que el motor de flujos enviara un webhook antes de que la escritura a
  disco fallara, revertir el estado en memoria no puede revertir ese envío. Mitigación: HU-01
  documenta explícitamente esta distinción (CA-01.5) y el toast avisa en vez de prometer una
  reversión que no puede cumplir.
- **R2 — Quitar `disabled` de 16 botones a la vez cambia el gesto de guardar en toda la app de
  golpe.** Si `requiredFields` tiene un error, 16 formularios fallan igual el mismo día.
  Mitigación: HU-06 va en su propia fase con checkpoint dedicado antes de tocar HU-07; se prueba
  primero en un diálogo, se generaliza después.
- **R3 — Cambiar la altura de 26 diálogos es el cambio de mayor superficie visual de la spec.**
  Elegir mal el `size` de alguno rompe su layout interno (contenido que dependía de `flex-1` con
  altura fija). Mitigación: `smoke.md` lista los 26 uno por uno; el barrido va después de que la
  prop `size` esté probada en los diálogos más simples.
- **R4 — La cola de toasts puede volverse una fuente de ruido si cada mutación menor emite uno.**
  Un guardado exitoso de cada tecla escrita saturaría la UI. Mitigación: el toast de éxito es
  para la acción explícita del usuario (pulsar Guardar), no para el autoguardado silencioso; se
  documenta caso por caso en `design.md` §A.
- **R5 — El envoltorio de teclado (`ClickableCard`) puede robar el foco a los controles internos
  de la tarjeta** (checkbox, menú, botón de mover) si el manejo de `stopPropagation` no es
  cuidadoso. Mitigación: se aplica primero a `TaskCard`, el caso con más controles internos, y el
  checkpoint de la Fase D lo verifica explícitamente antes de generalizar a `EntityCard`/`AreaCard`.
