# Especificación — Demo local + modo navegador por defecto

- **Feature ID:** 030-demo-y-modo-navegador
- **Estado:** Implementado (2026-07-20) — smoke visual manual pendiente (la sesión no cuenta con harness de navegador/Playwright; ver "Verificación" más abajo).
- **Fecha:** 2026-07-20
- **Principios afectados (constitución):** I (local-first, los datos son del usuario — en tensión
  deliberada, ver Decisiones), IV (diseño limpio y enfocado — estados vacíos guían al usuario), V
  (simplicidad y entrega incremental), VI (migrabilidad deliberada vía `StorageAdapter`)

## Resumen

Hoy un usuario nuevo que entra a `/app` choca contra un **muro inconsistente por navegador**: en
Chromium/Edge se le exige elegir una carpeta local antes de ver nada; en Firefox/Safari entra
directo pero a una app completamente vacía. Ninguno de los dos casos deja ver qué hace el
producto. Esta feature hace que **todas las subrutas de `/app` sean accesibles por defecto**,
sembrando automáticamente —solo la primera vez, solo si no hay datos reales— una estructura de
ejemplo realista (un PM operando una startup SaaS ficticia: producto, proyectos, áreas, procesos,
checklists, tareas Kanban, RACI, tipos y plantillas de Biblioteca) que vive en el navegador
(IndexedDB) hasta que el usuario decide conectar una carpeta local. El sidebar muestra claramente
que ese estado es **"sin sincronizar"**, con un botón para conectar carpeta que ofrece llevarse los
datos de la demo o empezar limpio.

## Problema / Necesidad

- **Asimetría de acceso por navegador**, confirmada en código: `src/storage/index.ts` elige
  `FileSystemAdapter` si `showDirectoryPicker` existe (Chromium/Edge), si no `DownloadAdapter`
  (Firefox/Safari). `AppGate` (`src/components/layout/AppGate.tsx`) bloquea todo `/app` mientras
  `connection !== "ready"`. En Chromium, un usuario nuevo queda en `needs-folder` y ve
  `ConnectScreen` en vez de la app. En Firefox/Safari, `DownloadAdapter.init()` siembra un
  `emptyWorkspace()` vacío en IndexedDB y pasa a `ready` sin pedir nada — pero la app está vacía.
- **Cero contenido de ejemplo.** No existe ningún seed/demo data en el código (`src/domain/factories.ts`
  y `src/domain/instantiate.ts` solo crean entidades vacías bajo acción del usuario). Un visitante
  nuevo no tiene forma de ver cómo luce un proyecto real con áreas, procesos, checklists y Kanban
  poblados sin crearlo todo a mano.
- **Fricción antes del "aha moment".** La landing (spec 004) ya resuelve la explicación de producto,
  pero el CTA lleva a una app vacía (o a un gate de carpeta) — se pierde la oportunidad de mostrar
  valor inmediato.
- **SEO limitado dentro de `/app`.** `public/robots.txt` es `Allow: /` (sin `Disallow`) — Google ya
  puede rastrear `/app`, pero hoy no hay nada que indexar ahí salvo pantallas vacías o un gate.

## Decisiones explícitas (no re-preguntar)

- **SEO del demo: dentro de `/app`, sin SSR/prerender.** Se mantiene la decisión de spec 004 (SPA
  renderizada en cliente). El demo aporta valor a crawlers que ejecutan JS (Googlebot) y sobre todo
  a la conversión (ver el producto poblado antes de comprometerse); no se crea una ruta pública
  `/demo` separada ni se genera HTML estático.
- **Escenario del demo: startup SaaS.** Producto ficticio **"Nimbus"**, con proyectos de release y
  growth. Ver detalle completo del contenido en `design.md` §4.
- **Controles de ciclo de vida — lo pedido más controles adicionales:**
  - Auto-sembrado silencioso para usuarios nuevos en modo navegador (sin diálogo de confirmación).
  - Botón **"Conectar carpeta"** en el sidebar (zona inferior izquierda, hoy solo indicador de solo
    lectura en `AppLayout.tsx:161-175`), con opción de **llevarse los datos actuales o empezar
    limpio** en la carpeta nueva.
  - Banner discreto y descartable: *"Estás explorando datos de ejemplo — los cambios viven solo en
    este navegador"*, con CTAs a conectar carpeta o vaciar.
  - Botones explícitos **"Cargar datos de ejemplo"** / **"Vaciar y empezar de cero"** en Ajustes y en
    estados vacíos (p. ej. Dashboard sin proyectos), disponibles también en Firefox/Safari (donde no
    hay carpeta que conectar).
- **Sin cambios de esquema.** El demo se construye con `src/domain/factories.ts` +
  `instantiateProjectFromType` (`src/domain/instantiate.ts`), ya en `schemaVersion` 14. No hay
  migración nueva (Principio II no se activa).
- **Back-compat es un requisito duro, no una preferencia.** Usuarios existentes —carpeta ya
  conectada en Chromium (handle guardado en IndexedDB) o datos reales ya en IndexedDB en
  Firefox/Safari— **nunca** deben ver el demo ni perder sus datos. Ver HU-06.
- **Flujos/Integraciones quedan fuera del demo.** Requieren credenciales (base Dexie separada,
  cifrada, deliberadamente excluida de `exportAll`); el demo no las puebla.
- **Tono de copy nuevo: tuteo**, igual que `ConnectScreen.tsx` (el flujo hermano más cercano al que
  se extiende aquí) y la dirección ya tomada en spec 028 para superficies nuevas. Nota: el interior
  de `/app` hoy mezcla voseo (`DashboardPage.tsx`: *"Empezá por crear un proyecto"*) y tuteo
  (`ConnectScreen.tsx`, `SettingsPage.tsx`) — inconsistencia preexistente que esta spec no corrige;
  solo se evita agregarle una tercera variante. Ver nota de registro en `design.md` §9.

## Historias de usuario (con criterios de aceptación)

### HU-01 — Acceso por defecto sin conectar carpeta
**Como** usuario nuevo, **quiero** entrar a `/app` y ver la aplicación funcionando de inmediato,
**para** entender qué hace el producto sin fricción previa.
- ✅ En Chromium/Edge, un perfil sin handle guardado entra a `/app` y ve contenido (el demo), no
  `ConnectScreen`.
- ✅ En Firefox/Safari, un perfil sin datos previos entra a `/app` y ve el demo (hoy ya entraba, pero
  vacío).
- ✅ Las 12 subrutas de `/app` (`ROUTES.*`) responden con datos reales navegables, no pantallas vacías.

### HU-02 — Demo realista de un PM gestionando una startup SaaS
**Como** visitante, **quiero** ver una estructura de proyecto real y completa, **para** entender la
jerarquía Producto→Proyecto→Área→{Proceso, Checklist}→Tarea y las features clave (Tipos/Plantillas,
Kanban, RACI, Trimestres) sin crear nada.
- ✅ Existe al menos 1 Producto, 3 Proyectos (con áreas/procesos/checklists/tareas pobladas), 1
  Trimestre, 4 Personas con roles RACI asignados, 2 Tipos de Proyecto y sus Plantillas asociadas.
- ✅ Al menos un Proyecto muestra Kanban con tareas en varios estados (`todo/doing/blocked/done`),
  un checklist con ítem enlazado a tarea, un proceso (SOP) con pasos, y salud (`health`) no-verde
  para mostrar el semáforo del Dashboard.
- ✅ Todas las entidades sembradas pasan validación Zod (`collectionSchema`) sin excepciones.

### HU-03 — Estado "sin sincronizar" visible
**Como** usuario en modo navegador, **quiero** ver claramente que mis cambios no están en una
carpeta local, **para** no asumir una persistencia que no existe.
- ✅ El indicador del sidebar (reemplazo de `AppLayout.tsx:161-175`) muestra un estado distinto de
  "sincronizado · carpeta local" cuando el modo es navegador — p. ej. "Sin sincronizar · en este
  navegador" en ámbar.
- ✅ El estado persiste correctamente tras recargar la página (no parpadea a "sincronizado" ni
  viceversa).

### HU-04 — Conectar carpeta desde el modo navegador
**Como** usuario que ya exploró o trabajó en modo navegador, **quiero** conectar una carpeta local y
decidir si me llevo mis datos actuales, **para** pasar a persistencia real sin perder trabajo (o
descartando la demo si no me interesa).
- ✅ El botón "Conectar carpeta" del sidebar abre un diálogo con dos acciones claras: "Llevar mis
  datos a la carpeta" y "Empezar limpio en la carpeta" (más cancelar).
- ✅ "Llevar mis datos" copia el contenido actual de IndexedDB a los archivos `.json` de la carpeta
  elegida (mismo formato que `FileSystemAdapter.exportAll()`/`importAll()`).
- ✅ "Empezar limpio" conecta la carpeta con un workspace vacío, sin arrastrar el demo.
- ✅ Tras conectar, el sidebar pasa a "sincronizado · carpeta local" y el modo persiste entre
  sesiones (no vuelve a ofrecer el demo).
- ✅ Solo visible/habilitado en navegadores con soporte de File System Access API.

### HU-05 — Cargar o vaciar la demo manualmente
**Como** usuario, **quiero** recuperar la demo si la borré, o vaciar todo y empezar de cero, **para**
tener control total sin depender solo del sembrado automático inicial.
- ✅ Ajustes tiene un botón "Cargar datos de ejemplo" (solo si el workspace actual está vacío) y
  "Vaciar y empezar de cero" (con confirmación, dado que es destructivo).
- ✅ El mismo par de acciones está disponible desde el estado vacío del Dashboard cuando aplica.
- ✅ "Vaciar" no vuelve a auto-sembrar la demo en el siguiente arranque (respeta la elección del
  usuario).

### HU-06 — No romper usuarios existentes
**Como** usuario que ya conecté una carpeta o ya tengo datos reales en el navegador, **quiero** que
esta feature no toque mis datos, **para** no perder trabajo por una actualización de la app.
- ✅ Con un `rootDirHandle` ya guardado en IndexedDB (Chromium), el arranque resuelve modo
  `"filesystem"` automáticamente y sigue el flujo actual (`ready`/`needs-reconnect`), sin pasar
  nunca por el sembrado de demo.
- ✅ Con productos o proyectos ya presentes en el `DownloadAdapter` (Firefox/Safari con uso previo),
  el guard de sembrado detecta datos existentes y **no siembra** el demo encima.
- ✅ El sembrado corre como máximo una vez por perfil de navegador (flag persistente), incluso tras
  múltiples recargas.

### HU-07 — Degradación correcta sin File System Access API
**Como** usuario de Firefox/Safari, **quiero** un camino claro para respaldar mis datos aunque no
pueda conectar una carpeta, **para** no quedar atrapado en "modo navegador" sin salida.
- ✅ Donde Chromium mostraría "Conectar carpeta", Firefox/Safari muestra "Exportar copia" (reutiliza
  `exportAll()` ya existente) con un tooltip/nota explicando la limitación del navegador.
- ✅ El banner y los botones de cargar/vaciar demo funcionan igual en ambos navegadores.

## Fuera de alcance

- SSR/SSG/prerender del demo o de cualquier otra ruta.
- Ruta pública dedicada `/demo` fuera de `/app`.
- Cambios de esquema, migraciones nuevas, o tocar `schemaVersion`.
- Poblar Flujos/Integraciones en el demo (requieren credenciales cifradas).
- Sincronización bidireccional, detección de cambios externos en archivos, o file-watching — el
  modelo write-through actual (`src/store/useDataStore.ts`) no cambia.
- Cuentas, multi-usuario, o cualquier noción de identidad/login.
- Renombrar `DB_NAME` (`src/storage/idb.ts`) o el `id` del directory picker — mismo blindaje que
  spec 004.
- Corregir la inconsistencia de registro voseo/tuteo preexistente en el resto de `/app` (fuera de
  alcance, señalado como candidato a spec futura igual que en specs previas).

## Supuestos

- El inventario de archivos/línea citado aquí y en `design.md` fue verificado leyendo el código
  directamente el 2026-07-20; si el código cambió desde entonces, se revalida antes de implementar.
- No hay otra spec en curso que toque `src/storage/`, `useAppStore.ts` o `AppLayout.tsx` en paralelo.

## Métricas de éxito

- Un perfil de navegador nuevo (Chromium sin handle, o Firefox/Safari sin datos) entra a `/app` y ve
  el demo poblado en las 12 subrutas, sin ningún gate de carpeta.
- Un usuario con carpeta ya conectada (`local-data-app/` u otra) sigue viendo exactamente sus datos
  reales tras la actualización — 0 regresiones de acceso a datos existentes.
- El sembrado de demo ocurre como máximo 1 vez por perfil de navegador, verificable con un test.
- `tsc --noEmit`, la suite Vitest completa y `vite build` en verde.
- Conectar carpeta desde modo navegador con "Llevar mis datos" produce en disco la misma estructura
  de archivos que hoy produce `FileSystemAdapter` para datos creados a mano.
