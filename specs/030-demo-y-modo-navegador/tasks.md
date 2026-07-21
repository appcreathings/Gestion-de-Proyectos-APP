# Tasks — Demo local + modo navegador por defecto (030)

> **Estado (2026-07-20):** Implementado. `tsc --noEmit`, `vitest run` (533) y
> `vite build` en verde. **Pendiente:** smoke visual manual en navegador real
> (sin harness de Playwright en la sesión) — ver "Verificación / testing manual"
> en `design.md`. La memoria del proyecto (`gestor-proyectos-app.md`) se creó
> nueva en esta sesión (no existía antes en el workspace).

Tareas numeradas por fase. Cada fase debe dejar la app usable de punta a punta (Principio V) y
verificarse con `tsc --noEmit` + `vitest run` + `vite build` antes de avanzar (mismo criterio que
specs 003/010/029). **Ninguna tarea está iniciada** — este documento es la guía para la sesión de
implementación.

## Fase 0 — Confirmación previa (obligatoria, no saltar)
- [ ] T3000 Releer `src/store/useAppStore.ts`, `src/storage/index.ts`, `src/storage/DownloadAdapter.ts`,
  `src/components/layout/AppGate.tsx`, `src/components/layout/AppLayout.tsx` (líneas ~139-178) y
  confirmar que coinciden con lo descrito en `design.md` §1. Si algo cambió desde 2026-07-20,
  actualizar `design.md` antes de seguir.

## Fase 1 — Selector de modo + storage parametrizado
- [ ] T3001 `src/storage/mode.ts`: `getWorkspaceMode`/`setWorkspaceMode`,
  `isDemoSeeded`/`markDemoSeeded`, `isDemoCleared`/`markDemoCleared`,
  `isDemoBannerDismissed`/`dismissDemoBanner`. Todo sobre `localStorage` con `try/catch` defensivo.
- [ ] T3002 `src/storage/index.ts`: `createStorageAdapter(mode: WorkspaceMode)` (ver design.md §3).
  Actualizar el único call-site actual (`useAppStore.ts`).
- [ ] T3003 Test unitario de `mode.ts` (flags independientes, default `null`/`false`, no lanzan si
  `localStorage` no está disponible).

  Verificar: `tsc --noEmit`, tests en verde. (Esta fase sola no cambia comportamiento visible.)

## Fase 2 — Arranque: modo, back-compat y guard de sembrado
- [ ] T3010 `src/store/useAppStore.ts`: `const adapter` → `let adapter` (reasignable) + exponer
  `mode: WorkspaceMode` e `isDemo: boolean` en `AppState`.
- [ ] T3011 Reescribir `bootstrap()` con la secuencia de design.md §4: resolver modo (con back-compat
  vía `hasStoredHandle()` cuando `mode === null`), instanciar/reasignar adapter si no coincide,
  `init()`, guard de sembrado (`mode==="browser" && !seeded && !cleared && workspace vacío`), y solo
  entonces `connection: "ready"`.
- [ ] T3012 Nuevas acciones: `connectFolderFromBrowser({keepDemo})`, `clearWorkspace()`, `loadDemo()`
  (firmas y comportamiento en design.md §4). Las tres terminan en `window.location.reload()`.
- [ ] T3013 Test: con `rootDirHandle` simulado en IndexedDB, `bootstrap()` resuelve
  `mode:"filesystem"` y **nunca** llama a `seedDemo` (back-compat HU-06, caso Chromium).
- [ ] T3014 Test: con productos/proyectos ya presentes en `DownloadAdapter`, `bootstrap()` **no**
  siembra encima (back-compat HU-06, caso Firefox/Safari).
- [ ] T3015 Test: perfil limpio en modo navegador siembra exactamente una vez; una segunda llamada a
  `bootstrap()` (simulando recarga) no vuelve a sembrar.

  Verificar: `tsc --noEmit`, tests en verde. En este punto el guard existe pero `seedDemo` puede ser
  un stub vacío — no depende de la Fase 3 para compilar.

## Fase 3 — Datos del demo (escenario "Nimbus")
- [ ] T3020 `src/domain/demo/seedData.ts`: construir en memoria Producto «Nimbus», Trimestre «Q3
  2026», 4 Personas, 2 Tipos de Proyecto + sus Plantillas (checklist/proceso) — ver tabla completa en
  design.md §5.
- [ ] T3021 Proyecto 1 «Lanzamiento v1.0» vía `instantiateProjectFromType`: áreas Producto/
  Ingeniería/Marketing, Kanban poblado en los 4 estados, checklist QA con ≥1 ítem enlazado a tarea,
  hito, sprint activo, RACI, `health: amber`, ≥1 tarea con comentarios/subtareas.
- [ ] T3022 Proyecto 2 «Growth Q3» (tipo Experimento) y Proyecto 3 «Rediseño onboarding» (`backlog`).
- [ ] T3023 1 `AutomationRule` de ejemplo + un puñado de `ActivityEntry`/`Notification`.
- [ ] T3024 `src/domain/demo/seed.ts`: `seedDemo(adapter)` escribe todo vía `adapter.write`/
  `writeDoc`, reemplaza el stub de la Fase 2.
- [ ] T3025 `src/domain/demo/seed.test.ts`: cada entidad pasa `collectionSchema[col].parse(...)` sin
  excepción; conteos mínimos (≥3 proyectos, tareas en cada estado del Kanban, ≥1 checklist con ítem
  enlazado, RACI no vacío en al menos un proyecto).

  Verificar: `tsc --noEmit`, tests en verde, `vite build`. Smoke manual: perfil nuevo → `/app` muestra
  el demo completo navegable (Dashboard, Proyectos, Biblioteca, Trimestres, Mis tareas).

## Fase 4 — UI: sidebar, diálogo de conectar, banner
- [ ] T3030 `src/components/layout/WorkspaceStatus.tsx`: reemplaza el bloque de
  `AppLayout.tsx:161-175`. Estados: sincronizado (igual que hoy) / sin sincronizar + "Conectar
  carpeta" (Chromium) / sin sincronizar + "Exportar copia" (Firefox/Safari).
- [ ] T3031 `src/components/layout/ConnectFolderDialog.tsx`: construido sobre `ui/dialog.tsx`
  directamente (no `ConfirmDialog`, que es de una sola acción). Dos acciones primarias ("Llevar mis
  datos" / "Empezar limpio") + cancelar; salta el diálogo si el workspace ya está vacío.
- [ ] T3032 `src/components/layout/DemoBanner.tsx`: banner descartable montado en `AppLayout` sobre
  el `<Outlet/>`, visible si `isDemo && !bannerDismissed`. CTAs "Conectar carpeta" / "Empezar de
  cero".
- [ ] T3033 `AppLayout.tsx`: integrar `WorkspaceStatus` y `DemoBanner`.

  Verificar: `tsc --noEmit`, tests en verde, `vite build`. Smoke manual: ver banner, descartarlo (no
  reaparece tras recargar), abrir diálogo, cancelar no rompe nada.

## Fase 5 — Ajustes, estados vacíos y flujo de conectar/vaciar/cargar completo
- [ ] T3040 `SettingsPage.tsx`: card "Datos de ejemplo" con "Cargar datos de ejemplo"
  (`disabled` si ya hay datos) y "Vaciar y empezar de cero" (vía `ConfirmDialog` existente,
  `confirmVariant="destructive"`).
- [ ] T3041 `DashboardPage.tsx`: CTA adicional "Cargar datos de ejemplo" en el estado vacío
  (`projects.length === 0`), solo si `mode==="browser" && !isDemoCleared()`.
- [ ] T3042 Copy: revisar `ConnectScreen.tsx` para aclarar (si hace falta) que ese flujo de página
  completa sigue siendo solo para `needs-reconnect`/`error`, no para la transición desde el demo.

  Verificar: `tsc --noEmit`, tests en verde, `vite build`. Smoke manual completo (ver sección
  "Verificación / testing manual" de `design.md`): Chromium fresh → editar → recargar → conectar
  carpeta llevando datos → verificar `.json` en disco; repetir con "empezar limpio"; Firefox con
  exportar copia y vaciar; **back-compat con `local-data-app/` ya conectada**.

## Fase 6 — Cierre
- [ ] T3050 `npm run typecheck && npm test && npm run build` (usar Bash tool o `npm.cmd`, no
  `Start-Process`, en este entorno Windows).
- [ ] T3051 Confirmar `dist/sitemap.xml` sigue incluyendo `/app` y `robots.txt` no cambió.
- [ ] T3052 Actualizar memoria del proyecto (`gestor-proyectos-app.md`) con el resumen de spec 030,
  mismo hábito que specs anteriores.
- [ ] T3053 Cambiar `Estado` de `spec.md` de "Borrador" a "Implementado" (con fecha) si todo lo
  anterior quedó en verde; si algo queda pendiente (p. ej. smoke visual manual sin harness de
  navegador en el proyecto), dejarlo anotado explícitamente como en specs previas.

## Explícitamente fuera de este tasks.md
- Cualquier cambio a `src/domain/schemas/` o `src/domain/migrations.ts` (no hay cambio de esquema).
- Poblar Flujos/Integraciones en el demo.
- Ruta pública `/demo` o cualquier trabajo de SSR/prerender.
- Corregir la inconsistencia de registro voseo/tuteo preexistente fuera de lo que esta spec agrega.

## Verificación por fase
Tras cada fase: `npx tsc --noEmit`, `npx vitest run`, y el smoke manual descrito en esa fase. No
avanzar a la fase siguiente sin confirmar que la actual no rompió el flujo de usuarios existentes
(back-compat, HU-06) — es el criterio más fácil de romper por accidente en esta spec.
