# Design — Demo local + modo navegador por defecto (030)

Contrapartida técnica de `spec.md`. Todas las citas de archivo/línea fueron verificadas leyendo el
código directamente el 2026-07-20 (no solo reportadas por agentes).

## 1. Estado actual (línea base)

- **Selección de adapter** — `src/storage/index.ts:10-14`:
  ```ts
  export function createStorageAdapter(): StorageAdapter {
    return FileSystemAdapter.isSupported()
      ? new FileSystemAdapter()
      : new DownloadAdapter();
  }
  ```
  Sin parámetro: la elección depende solo del navegador, nunca de una preferencia guardada.

- **Adapter singleton de módulo** — `src/store/useAppStore.ts:28-30`:
  ```ts
  const adapter = createStorageAdapter();
  export const useAppStore = create<AppState>((set, get) => ({
    adapter,
    connection: "initializing",
  ```
  `adapter` es `const`: nunca se reasigna hoy. `useDataStore` (`src/store/useDataStore.ts:96-98`)
  lee el adapter dinámicamente en cada llamada (`useAppStore.getState().adapter`), pero
  `useAppStore` lo captura una sola vez en closures (`connectFolder`, `bootstrap`, etc. — todos usan
  el identificador `adapter` del módulo, no `get().adapter`). Esto es clave: **cambiar de instancia
  de adapter en caliente requiere tocar ese patrón**, no es soportado hoy.

- **Gate** — `src/components/layout/AppGate.tsx` (completo, 25 líneas): bloquea `/app` mientras
  `connection !== "ready"` o `!hydrated`, mostrando `ConnectScreen`. No cambia en este spec — el
  demo funciona haciendo que `connection` llegue a `"ready"` en el modo navegador, igual que ya
  ocurre hoy con `DownloadAdapter`.

- **`DownloadAdapter.init()`** (`src/storage/DownloadAdapter.ts:53-57`) ya siembra un
  `emptyWorkspace()` en IndexedDB si no existe y marca `ready = true` — el mecanismo de "arrancar
  sin pedir nada" ya existe; falta el paso de sembrar *contenido*, no solo el workspace vacío.

- **`ConnectScreen.tsx`** (completo, 67 líneas): pantalla de página completa con botón "Elegir
  carpeta de datos" (`connectFolder`) o "Reconectar carpeta" (`reconnectFolder`), más un aviso ámbar
  cuando `adapterKind === "download"`. Sigue existiendo para `needs-reconnect`/`error`; no se usa
  para el flujo nuevo de "conectar desde el demo" (ese es un diálogo, no una pantalla completa,
  porque el usuario ya está dentro de la app con datos visibles).

- **Sidebar** — `src/components/layout/AppLayout.tsx:161-175`, indicador de solo lectura:
  ```tsx
  <div className="border-t border-border/70 px-5 py-3 font-mono text-[10px] text-muted-foreground">
    <div className="flex items-center gap-2">
      {adapterKind === "filesystem" ? (
        <><CheckCircle2 className="size-3.5 text-success" /> sincronizado · carpeta local</>
      ) : (
        <><HardDriveDownload className="size-3.5 text-warning" /> modo export/import</>
      )}
    </div>
  </div>
  ```
  Este bloque es el que se reemplaza por `WorkspaceStatus` (§6).

- **Ajustes** — `src/features/settings/SettingsPage.tsx`: panel "Carpeta de datos" (líneas 97-120)
  solo se muestra `adapter.kind === "filesystem"`; export/import general ya implementado (`onExport`
  línea 57, `onImport` línea 67, usa `adapter.exportAll()`/`importAll()`).

- **Estado vacío del Dashboard** — `src/features/dashboard/DashboardPage.tsx:44-56`: si
  `projects.length === 0` muestra `PageHeader` + `EmptyState` con CTA a Biblioteca/Proyectos (copy
  en voseo: *"Empezá por crear un proyecto"* — archivo no tocado por spec 028, ver nota §9).

- **`robots.txt`** (verificado, 4 líneas): `Allow: /` sin ningún `Disallow`. `/app` ya es
  rastreable hoy; no requiere cambios para esta spec.

- **Sin seed data hoy.** Confirmado por búsqueda exhaustiva: no existe ningún archivo
  `seed*`/`demo*`/`fixture*` relacionado al store de proyectos. Todo el contenido lo crea el usuario
  o viene de `instantiateProjectFromType` bajo acción explícita.

## 2. Selector de modo persistente — `src/storage/mode.ts` (nuevo)

Un modo explícito (`"filesystem" | "browser"`) desacopla "qué adapter usar" de "qué navegador es
este". Se guarda en `localStorage` (síncrono, disponible antes de cualquier `await`, a diferencia de
IndexedDB) bajo una clave propia — **no** reutiliza `rootDirHandle` (que sigue siendo la fuente de
verdad de si hay un handle guardado).

```ts
const MODE_KEY = "hito:workspace-mode";
const DEMO_SEEDED_KEY = "hito:demo-seeded";
const DEMO_CLEARED_KEY = "hito:demo-cleared";
const BANNER_DISMISSED_KEY = "hito:demo-banner-dismissed";

export type WorkspaceMode = "filesystem" | "browser";

export function getWorkspaceMode(): WorkspaceMode | null { /* localStorage.getItem(MODE_KEY) */ }
export function setWorkspaceMode(mode: WorkspaceMode): void { /* localStorage.setItem */ }

export function isDemoSeeded(): boolean { /* ... */ }
export function markDemoSeeded(): void { /* ... */ }
export function isDemoCleared(): boolean { /* ... */ }
export function markDemoCleared(): void { /* ... */ }

export function isDemoBannerDismissed(): boolean { /* ... */ }
export function dismissDemoBanner(): void { /* ... */ }
```

`localStorage` puede fallar (modo privado estricto en algún navegador) — envolver cada acceso en
`try/catch` devolviendo `null`/`false` por defecto, mismo patrón defensivo que
`hasStoredHandle()` en `useAppStore.ts:113-119`.

## 3. `createStorageAdapter` con parámetro — `src/storage/index.ts`

```ts
export function createStorageAdapter(mode: WorkspaceMode): StorageAdapter {
  return mode === "filesystem" && FileSystemAdapter.isSupported()
    ? new FileSystemAdapter()
    : new DownloadAdapter();
}
```
Si `mode === "filesystem"` pero el navegador no soporta la API (URL compartida entre navegadores,
o localStorage manipulado a mano), cae a `DownloadAdapter` de forma segura — mismo comportamiento
de fallback que existe hoy implícitamente.

## 4. Arranque — `src/store/useAppStore.ts`

Cambios sobre la interfaz `AppState` y `bootstrap()`:

- `const adapter = createStorageAdapter();` → **`let adapter: StorageAdapter = ...`** (reasignable)
  más un setter interno para sincronizar el store cuando cambia.
- Nuevo estado: `mode: WorkspaceMode`, `isDemo: boolean`.
- Nuevas acciones: `connectFolderFromBrowser(opts: { keepDemo: boolean })`, `clearWorkspace()`,
  `loadDemo()`.

`bootstrap()` (reemplaza `src/store/useAppStore.ts:36-52`):

```ts
async bootstrap() {
  try {
    // 1) Resolver modo, con back-compat: un handle guardado siempre gana (HU-06).
    let mode = getWorkspaceMode();
    if (mode === null) {
      mode = (await hasStoredHandle()) ? "filesystem" : "browser";
      setWorkspaceMode(mode);
    }

    // 2) Instanciar el adapter correcto para ese modo si no coincide ya.
    if (adapter.kind !== (mode === "filesystem" ? "filesystem" : "download")) {
      adapter = createStorageAdapter(mode);
      set({ adapter });
    }

    await adapter.init();

    if (adapter.isReady()) {
      // 3) Guard de sembrado: solo en modo navegador, solo si nunca se sembró/vació,
      //    y solo si el workspace está realmente vacío (defensa extra de back-compat).
      if (mode === "browser" && !isDemoSeeded() && !isDemoCleared()) {
        const [products, projects] = await Promise.all([
          adapter.list("products"),
          adapter.list("projects"),
        ]);
        if (products.length === 0 && projects.length === 0) {
          await seedDemo(adapter);
          markDemoSeeded();
        }
      }
      const workspace = await adapter.readWorkspace();
      // `!isDemoCleared()` => tras "Vaciar y empezar de cero" el workspace queda
      // vacío y el banner "estás explorando datos de ejemplo" NO debe mostrarse.
      set({ workspace, connection: "ready", error: null, mode, isDemo: mode === "browser" && isDemoSeeded() && !isDemoCleared() });
    } else if (adapter.kind === "filesystem") {
      const stored = await hasStoredHandle();
      set({ connection: stored ? "needs-reconnect" : "needs-folder", mode });
    } else {
      set({ connection: "needs-folder", mode });
    }
  } catch (e) {
    set({ connection: "error", error: errMsg(e) });
  }
},
```

Nuevas acciones (esbozo; firmas exactas de `StorageAdapter` en `src/storage/StorageAdapter.ts`):

```ts
async connectFolderFromBrowser({ keepDemo }: { keepDemo: boolean }) {
  const fs = new FileSystemAdapter();
  await fs.connect(); // showDirectoryPicker — requiere el gesto del click que originó esta llamada
  if (keepDemo) {
    const bundle = await get().adapter.exportAll(); // Blob del DownloadAdapter actual
    await fs.importAll(bundle);
  }
  setWorkspaceMode("filesystem");
  keepDemo ? markDemoSeeded() : markDemoCleared();
  window.location.reload(); // recarga simple; evita el riesgo de estado a medio migrar (Principio V)
},

async clearWorkspace() {
  // Los `importAll` de ambos adapters son aditivos (no borran entidades
  // ausentes del bundle), así que no basta con importar un bundle vacío. Se
  // usa el contrato existente list/remove/writeDoc/writeWorkspace, que además
  // funciona idéntico para FileSystemAdapter y DownloadAdapter.
  for (const col of COLLECTION_COLS) {
    const ids = await adapter.list(col);
    await Promise.all(ids.map((id) => adapter.remove(col, id)));
  }
  for (const name of DOC_NAMES) await adapter.writeDoc(name, emptyDoc(name));
  await adapter.writeWorkspace(emptyWorkspace());
  markDemoCleared();
  window.location.reload();
},

async loadDemo() {
  await seedDemo(adapter);
  markDemoSeeded();
  window.location.reload();
},
```

**Por qué recargar en vez de re-hidratar en caliente:** `useDataStore`, `useFlowStore` y varios
componentes leen el adapter en distintos momentos; forzar una recarga tras cada transición de modo
evita tener que auditar cada lectura en memoria vs. disco (Principio V — la alternativa "correcta"
de re-hidratar todo sin recargar es una superficie de bugs mucho mayor para un beneficio marginal:
esta transición ocurre unas pocas veces en la vida de un workspace, no es una ruta caliente).

## 5. Datos del demo — `src/domain/demo/`

Dos archivos nuevos:

- **`seedData.ts`** — construye las entidades en memoria reutilizando `src/domain/factories.ts`
  (`newProduct`, `newProject`, `newArea`, `newProcess`, `newChecklist`, `newItem`, `newTask`,
  `newQuarter`, `newPerson`, `newChecklistTemplate`, `newProcessTemplate`, `newProjectType`) y
  `instantiateProjectFromType` (`src/domain/instantiate.ts`) donde aplique, para que el demo pase
  por el mismo camino que "crear proyecto desde tipo" usa un usuario real.
- **`seed.ts`** — `seedDemo(adapter: StorageAdapter)`: escribe cada colección/doc vía
  `adapter.write(col, entity)` / `adapter.writeDoc(name, doc)`, mismas primitivas que usan las
  acciones de `useDataStore`.

**Contenido (escenario "Nimbus", startup SaaS):**

| Entidad | Detalle |
|---|---|
| Producto | «Nimbus» — visión + 2-3 objetivos, `status: active` |
| Trimestre | «Q3 2026» (jul–sep 2026) |
| Personas (RACI) | Ana (PM), Beto (Dev lead), Carla (Marketing), Diego (Diseño) |
| Tipos de Proyecto | «Release», «Experimento de growth» (con `defaultAreas` referenciando las plantillas) |
| Plantillas checklist | «Definición de release», «QA de release» |
| Plantillas proceso | «SOP: Publicar release notes», «SOP: Deploy a producción» |
| Proyecto 1 | «Lanzamiento v1.0» (tipo Release, vía `instantiateProjectFromType`) — áreas Producto (checklist+proceso), Ingeniería (Kanban ~8 tareas repartidas en todo/doing/blocked/done, checklist QA), Marketing (proceso+tareas); 1 hito «Beta cerrada»; 1 sprint activo; RACI poblado; `health: amber`; ≥1 tarea con comentarios y subtareas; ≥1 ítem de checklist enlazado a una tarea (`linkedTaskId`) |
| Proyecto 2 | «Growth Q3» (tipo Experimento) — área Adquisición con tareas A/B + checklist de experimento; `health: green` |
| Proyecto 3 | «Rediseño onboarding» — `status: backlog`, sin poblar tanto (llena el portafolio con variedad de estados) |
| Automatización | 1 `AutomationRule` de ejemplo (`checklist.completed` → crear tarea de seguimiento) |
| Actividad/Notificaciones | Un puñado de `ActivityEntry`/`Notification` sembradas para que esas páginas no se vean vacías |

Explícitamente **no** se siembran Flujos/Integraciones (fuera de alcance, spec.md).

**Validación:** cada entidad se construye con `schemaVersion: SCHEMA_VERSION` (vía las factories, ya
lo hacen) y se valida con `collectionSchema[col].parse(...)` antes de escribir — mismo contrato que
exige el adapter en cada `write()`. Un test (`seed.test.ts`) recorre todo el bundle y confirma que
parsea sin excepción, más conteos mínimos (≥3 proyectos, ≥1 tarea por estado del Kanban, etc.).

## 6. Sidebar — `WorkspaceStatus.tsx` (nuevo, reemplaza `AppLayout.tsx:161-175`)

```tsx
function WorkspaceStatus() {
  const mode = useAppStore((s) => s.mode);
  const adapterKind = useAppStore((s) => s.adapter.kind);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (mode === "filesystem" && adapterKind === "filesystem") {
    return <SyncedRow />; // check verde "sincronizado · carpeta local" — igual que hoy
  }
  return (
    <div className="border-t border-border/70 px-5 py-3">
      <div className="flex items-center gap-2 font-mono text-[10px] text-warning">
        <HardDriveDownload className="size-3.5" /> sin sincronizar · en este navegador
      </div>
      {FileSystemAdapter.isSupported() ? (
        <button onClick={() => setDialogOpen(true)} className="mt-1.5 text-xs underline">
          Conectar carpeta
        </button>
      ) : (
        <button onClick={onExportCopy} className="mt-1.5 text-xs underline">
          Exportar copia
        </button>
      )}
      <ConnectFolderDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
```

**`ConnectFolderDialog.tsx`** (nuevo): construido sobre las primitivas de `ui/dialog.tsx`
directamente (`Dialog`/`DialogContent`/`DialogHeader`/`DialogFooter`), **no** sobre
`ConfirmDialog.tsx` — `ConfirmDialog` solo soporta una acción de confirmación
(`src/components/ConfirmDialog.tsx:11-22`), y este diálogo necesita **tres** salidas (llevar datos /
empezar limpio / cancelar). Contenido: explicación breve + dos `Button` primarios uno al lado del
otro + "Cancelar". Si el workspace ya está vacío (`products.length === 0 && projects.length === 0`),
saltar el diálogo y conectar directo (no forzar una decisión sin sentido).

## 7. `DemoBanner.tsx` (nuevo)

Montado en `AppLayout.tsx` justo encima del `<Outlet/>` (dentro de `<main>`, no en el sidebar).
Visible cuando `isDemo && !isDemoBannerDismissed()`. Barra angosta, no modal, con botón de cerrar
(persiste `dismissDemoBanner()`) y dos links de texto: "Conectar carpeta" (abre el mismo
`ConnectFolderDialog`) y "Empezar de cero" (confirma y llama `clearWorkspace()`).

## 8. Ajustes y estados vacíos

- **`SettingsPage.tsx`**: nueva card "Datos de ejemplo" (junto a la de Almacenamiento), visible
  siempre en modo navegador: botón "Cargar datos de ejemplo" (`disabled` si ya hay
  productos/proyectos) y "Vaciar y empezar de cero" (usa `ConfirmDialog` existente,
  `confirmVariant="destructive"` — este caso sí es una única confirmación, encaja con el componente
  actual).
- **`DashboardPage.tsx`** (y opcionalmente otros estados vacíos): en el bloque
  `projects.length === 0` (línea 44), agregar un segundo CTA "Cargar datos de ejemplo" junto a los
  existentes, solo si `mode === "browser" && !isDemoCleared()`.

## 9. Nota de registro (tuteo/voseo) para el copy nuevo

Los textos completos nuevos (banner, descripciones de diálogo) van en **tuteo**, igual que
`ConnectScreen.tsx` ("Elige una carpeta de datos", "Reconecta tu carpeta") — el flujo hermano más
cercano. Las **etiquetas de botón** ("Conectar carpeta", "Cargar datos de ejemplo", "Vaciar y
empezar de cero", "Exportar copia") son frases imperativas/nominales que no conjugan
vos/tú, así que no cargan registro — se insertan sin conflicto incluso en archivos que hoy están en
voseo (p. ej. el CTA nuevo en `DashboardPage.tsx`). No se re-escribe copy existente fuera de lo que
esta spec agrega.

## Archivos afectados

| Acción | Archivo |
|---|---|
| Nuevo | `src/storage/mode.ts` |
| Modificar | `src/storage/index.ts` (`createStorageAdapter(mode)`) |
| Modificar | `src/store/useAppStore.ts` (`let adapter`, modo/isDemo, guard de sembrado, `connectFolderFromBrowser`/`clearWorkspace`/`loadDemo`) |
| Nuevo | `src/domain/demo/seedData.ts`, `src/domain/demo/seed.ts` |
| Nuevo | `src/components/layout/WorkspaceStatus.tsx`, `src/components/layout/ConnectFolderDialog.tsx`, `src/components/layout/DemoBanner.tsx` |
| Modificar | `src/components/layout/AppLayout.tsx` (sustituir bloque 161-175 por `<WorkspaceStatus/>`, montar `<DemoBanner/>`) |
| Modificar | `src/features/settings/SettingsPage.tsx` (card "Datos de ejemplo") |
| Modificar | `src/features/dashboard/DashboardPage.tsx` (CTA cargar demo en estado vacío) |
| Modificar (copy, opcional) | `src/features/connect/ConnectScreen.tsx` (aclarar que solo aplica a modo carpeta) |
| Nuevo (tests) | `src/domain/demo/seed.test.ts`, test del guard de sembrado en `useAppStore` |

## Riesgos ya identificados (ver spec.md para el marco de decisión)

1. Back-compat con handle guardado / datos IndexedDB reales — mitigado por el orden de checks en
   `bootstrap()` (§4) y el guard de "workspace vacío" antes de sembrar.
2. Adapter singleton reasignable — mitigado con recarga completa en cada transición de modo (§4),
   no re-hidratación en caliente.
3. `localStorage` no disponible — fallback defensivo `try/catch` (§2).
4. IndexedDB puede ser desalojado por el navegador — comunicado vía banner (§7), no resuelto
   técnicamente (fuera de alcance: no hay forma de "fijar" almacenamiento del navegador de forma
   fiable cross-browser sin `navigator.storage.persist()`, que se puede evaluar como mejora futura
   pero no bloquea esta spec).
5. Gesto de usuario para `showDirectoryPicker` — se preserva porque `connectFolderFromBrowser` se
   invoca directo desde el `onClick` del botón de confirmación del diálogo, sin `await` previo que
   rompa la cadena de gesto.

## Verificación / testing manual

- `npx tsc --noEmit`, `npx vitest run`, `npm run build` (usar Bash tool o `npm.cmd`; `Start-Process`
  no ejecuta npm en este entorno Windows).
- **Chromium, perfil nuevo:** `/app` muestra el demo Nimbus sin pedir carpeta → editar una tarea →
  recargar → cambio persiste → sidebar "sin sincronizar" → "Conectar carpeta" → "Llevar mis datos" →
  elegir carpeta → tras recarga, `.json` en disco reflejan el demo + la edición, sidebar
  "sincronizado". Repetir el flujo completo eligiendo "Empezar limpio" (la carpeta queda vacía, sin
  rastro del demo).
- **Firefox:** `/app` con demo en IndexedDB; botón "Exportar copia" en vez de "Conectar carpeta";
  "Vaciar y empezar de cero" deja el Dashboard en estado vacío real (no vuelve a autosembrar).
- **Back-compat (crítico, no saltar):** abrir la app con `local-data-app/` ya conectada (handle
  existente) → debe ir directo a esos datos reales, cero rastro de demo, cero diálogo inesperado.
- **SEO:** `dist/sitemap.xml` sigue incluyendo `/app`; `robots.txt` sigue `Allow: /` sin cambios.
