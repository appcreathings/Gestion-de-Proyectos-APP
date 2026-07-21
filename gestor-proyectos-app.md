# Memoria del proyecto — Gestión de Proyectos APP (Hito)

Bitácora técnica por spec. Cada entrada resume qué cambió, dónde, y qué quedó
pendiente, para que cualquier sesión futura (humano o agente) recupere contexto
sin releer todo el repo. Orden: más reciente primero.

> **Nota de creación:** este archivo se inicia con la spec 030. Las specs
> 001–029 se implementaron antes de existir esta bitácora y no están
> retro-portadas aquí; su histórico vive en `specs/*/` y en `git log`.

## Stack y convenciones (recordatorio)

- **App:** React 18 + Vite + TypeScript + Zustand + Zod, SPA local-first.
- **Storage:** `StorageAdapter` con dos implementaciones — `FileSystemAdapter`
  (Chromium, File System Access API, una carpeta de `.json`) y `DownloadAdapter`
  (Firefox/Safari, IndexedDB + export/import). Singleton de módulo en
  `useAppStore.ts`, reasignado solo por `bootstrap()`/transiciones de modo.
- **Validación:** toda entidad se valida con `collectionSchema[col].parse` en el
  I/O boundary (constitución, principio II). `SCHEMA_VERSION = 14`.
- **Tests:** Vitest en entorno `node` (sin jsdom). Cmd: `npm.cmd run typecheck`
  / `npm.cmd test` / `npm.cmd run build`. En Windows, **no** usar `Start-Process`
  con npm — usar la Bash tool o `npm.cmd`.
- **Specs:** GitHub Spec Kit (`spec.md` / `design.md` / `tasks.md` por feature).
  El `Estado` en `spec.md` pasa de `Borrador` → `Implementado (fecha)` al cerrar.

---

## Spec 030 — Demo local + modo navegador por defecto (2026-07-20)

**Estado:** Implementado. Smoke visual manual pendiente (sin Playwright en la sesión).

### Qué hace
`/app` accesible por defecto en cualquier navegador: siembra automáticamente un
demo realista (startup SaaS ficticia **"Nimbus"**) que vive en el navegador
(IndexedDB) hasta que el usuario conecte una carpeta local. Resuelve la asimetría
Chromium (muro de carpeta) vs Firefox/Safari (app vacía).

### Cambios clave
- **`src/storage/mode.ts`** (nuevo): modo persistente (`"filesystem"|"browser"`) +
  flags de ciclo de vida del demo (`isDemoSeeded`/`isDemoCleared`/`banner`) en
  `localStorage` con `try/catch` defensivo.
- **`src/storage/index.ts`**: `createStorageAdapter(mode)` — la elección de
  adapter se desacopla del navegador y depende del modo.
- **`src/store/useAppStore.ts`**: `const adapter` → `let adapter` (reasignable);
  `bootstrap()` resuelve modo (un handle guardado **siempre** gana → back-compat
  HU-06), reasigna el adapter si toca, y siembra el demo **solo** en modo
  navegador + nunca sembrado/vaciado + workspace vacío. Nuevas acciones
  `connectFolderFromBrowser({keepDemo})`, `clearWorkspace()`, `loadDemo()` — las
  tres terminan en `window.location.reload()` (Principio V: evita re-hidratar
  N stores en caliente).
- **`src/domain/demo/`** (nuevo): `seedData.ts` construye el escenario Nimbus
  con las factories reales + `instantiateProjectFromType`; `seed.ts` lo escribe
  vía `adapter.write`/`writeDoc`. IDs fijos `demo-*` (trazables, cero colisión
  con datos uuid reales). 1 producto, 1 trimestre, 4 personas (RACI), 2 tipos,
  2 plantillas checklist + 2 proceso, 3 proyectos (Kanban en los 4 estados,
  health amber, hito, sprint activo, comentarios/subtareas, ítem de checklist
  enlazado a tarea), 1 automatización, actividad + notificaciones.
- **UI nueva:** `WorkspaceStatus` (reemplaza el indicador read-only del sidebar:
  sincronizado / sin sincronizar + "Conectar carpeta" o "Exportar copia"),
  `ConnectFolderDialog` (3 salidas: llevar datos / empezar limpio / cancelar,
  sobre `ui/dialog` directo, **no** `ConfirmDialog`), `DemoBanner` (descartable,
  sobre el `<Outlet/>`). Integradas en `AppLayout.tsx`.
- **`SettingsPage.tsx`**: card "Datos de ejemplo" (cargar / vaciar) solo en modo
  navegador. **`DashboardPage.tsx`**: CTA "Cargar datos de ejemplo" en estado
  vacío si `mode==="browser" && !isDemoCleared()`.

### Decisiones de implementación (correcciones a design.md)
- **`clearWorkspace` no usa `importAll(emptyBundle`)**: ambos `importAll`
  (FileSystem y Download) son **aditivos** — no borran entidades ausentes del
  bundle. Se implementa con `list`+`remove` por colección + `writeDoc(emptyDoc)`
  + `writeWorkspace(emptyWorkspace())`, que funciona idéntico en ambos adapters.
  Corrección registrada en `design.md §4`.
- **`isDemo = mode==="browser" && isDemoSeeded() && !isDemoCleared()`**: el
  `&& !isDemoCleared()` es necesario para que, tras "Vaciar", el banner no
  quede colgado sobre un workspace vacío. Refinamiento registrado en
  `design.md §4`.

### Back-compat (HU-06) — el riesgo crítico, verificado con tests
Cubierta por `src/store/useAppStore.bootstrap.test.ts` (5 tests):
1. Handle guardado (Chromium) → modo filesystem, **nunca** siembra.
2. Handle guardado + permiso revocado → `needs-reconnect`, sin sembrar.
3. Productos/proyectos reales en DownloadAdapter (Firefox) → **no** siembra encima.
4. Perfil limpio siembra exactamente una vez; la recarga no re-siembra.
5. Tras `isDemoCleared`, no vuelve a sembrar aunque el workspace esté vacío.

### Verificación
- `tsc --noEmit` ✓, `vitest run` ✓ (533 tests, +14 nuevos: mode 9, bootstrap 5,
  seed 9 — alguno reemplaza stub), `vite build` ✓.
- `dist/sitemap.xml` sigue incluyendo `/app` y subrutas; `robots.txt` sin
  cambios (`Allow: /`).
- **Pendiente:** smoke visual manual en navegador real (Chromium fresh → demo →
  editar → recargar → "Conectar carpeta" llevar datos / empezar limpio;
  Firefox → "Exportar copia" + vaciar; back-compat con `local-data-app/` ya
  conectada). No ejecutable en esta sesión por falta de harness de navegador.

### Fuera de alcance ( intacto / no tocado )
Sin cambios de esquema ni migraciones (`SCHEMA_VERSION` sigue en 14). Flujos/
Integraciones no se siembran en el demo. SSR/SSG y ruta `/demo` pública
descartados. `ConnectScreen.tsx` sin cambios (ya solo alcanzable en modo
carpeta; su copy no mencionaba el demo).
