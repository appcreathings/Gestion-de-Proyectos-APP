import { create } from "zustand";
import type { Settings, Workspace } from "@/domain/schemas";
import { emptyWorkspace } from "@/domain/schemas";
import { createStorageAdapter, FileSystemAdapter, type StorageAdapter } from "@/storage";
import type { Collection, DocName } from "@/storage/StorageAdapter";
import { emptyDoc } from "@/storage/StorageAdapter";
import {
  getWorkspaceMode,
  setWorkspaceMode,
  isDemoSeeded,
  isDemoCleared,
  markDemoSeeded,
  markDemoCleared,
  type WorkspaceMode,
} from "@/storage/mode";
import { seedDemo } from "@/domain/demo/seed";
import { idbGet } from "@/storage/idb";

export type ConnectionState =
  | "initializing"
  | "needs-folder" // no folder chosen yet (filesystem)
  | "needs-reconnect" // handle stored but permission must be re-granted
  | "ready"
  | "error";

/** Runtime list of writeable collections (the `Collection` type is a union). */
const COLLECTION_COLS: Collection[] = [
  "products",
  "projects",
  "project-types",
  "checklist-templates",
  "process-templates",
  "automations",
  "quarters",
];
const DOC_NAMES: DocName[] = ["people", "notifications", "activity", "flows", "flow-runs"];

interface AppState {
  adapter: StorageAdapter;
  connection: ConnectionState;
  error: string | null;
  workspace: Workspace | null;
  /** Resolved backend mode (spec 030). `null` only before `bootstrap()` runs. */
  mode: WorkspaceMode | null;
  /** True while the user is browsing the seeded demo in browser mode. */
  isDemo: boolean;

  bootstrap: () => Promise<void>;
  connectFolder: () => Promise<void>;
  reconnectFolder: () => Promise<void>;
  changeFolder: () => Promise<void>;
  refreshWorkspace: () => Promise<void>;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  updateOrg: (name: string) => Promise<void>;
  /** Connect a folder from browser mode, optionally carrying current data. */
  connectFolderFromBrowser: (opts: { keepDemo: boolean }) => Promise<void>;
  /** Empty the workspace entirely and opt out of future auto-seeding. */
  clearWorkspace: () => Promise<void>;
  /** Seed the demo into the current (browser-mode) workspace. */
  loadDemo: () => Promise<void>;
}

// Best synchronous guess; `bootstrap()` re-resolves (and may reassign) the
// adapter once the persisted mode / stored handle are known (spec 030 §4).
let adapter: StorageAdapter = createStorageAdapter(
  getWorkspaceMode() ?? (FileSystemAdapter.isSupported() ? "filesystem" : "browser"),
);

export const useAppStore = create<AppState>((set, get) => ({
  adapter,
  connection: "initializing",
  error: null,
  workspace: null,
  mode: null,
  isDemo: false,

  async bootstrap() {
    try {
      // 1) Resolve mode — a stored folder handle always wins (HU-06 back-compat).
      let mode = getWorkspaceMode();
      if (mode === null) {
        mode = (await hasStoredHandle()) ? "filesystem" : "browser";
        setWorkspaceMode(mode);
      }

      // 2) Reassign the adapter if its kind doesn't match the resolved mode.
      const wantKind = mode === "filesystem" ? "filesystem" : "download";
      if (adapter.kind !== wantKind) {
        adapter = createStorageAdapter(mode);
        set({ adapter });
      }

      await adapter.init();

      if (adapter.isReady()) {
        // 3) Seed guard: browser mode only, never re-seeded/re-cleared, and only
        //    if the workspace is truly empty (extra back-compat defense, HU-06).
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
        set({
          workspace,
          connection: "ready",
          error: null,
          mode,
          isDemo: mode === "browser" && isDemoSeeded() && !isDemoCleared(),
        });
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

  async connectFolder() {
    try {
      await adapter.connect();
      const workspace = await adapter.readWorkspace();
      set({ workspace, connection: "ready", error: null });
    } catch (e) {
      set({ error: errMsg(e) });
    }
  },

  async reconnectFolder() {
    try {
      const ok = await adapter.reconnect();
      if (ok) {
        const workspace = await adapter.readWorkspace();
        set({ workspace, connection: "ready", error: null });
      } else {
        set({ error: "No se pudo reconectar la carpeta" });
      }
    } catch (e) {
      set({ error: errMsg(e) });
    }
  },

  async changeFolder() {
    try {
      await adapter.changeFolder();
      const workspace = await adapter.readWorkspace();
      set({ workspace, connection: "ready", error: null });
    } catch (e) {
      set({ error: errMsg(e) });
    }
  },

  async refreshWorkspace() {
    const workspace = await get().adapter.readWorkspace();
    set({ workspace });
  },

  async updateSettings(patch) {
    const ws = get().workspace;
    if (!ws) return;
    const next: Workspace = {
      ...ws,
      settings: { ...ws.settings, ...patch },
    };
    await get().adapter.writeWorkspace(next);
    set({ workspace: next });
  },

  async updateOrg(name) {
    const ws = get().workspace;
    if (!ws) return;
    const next: Workspace = { ...ws, org: { ...ws.org, name } };
    await get().adapter.writeWorkspace(next);
    set({ workspace: next });
  },

  async connectFolderFromBrowser({ keepDemo }) {
    // `new FileSystemAdapter().connect()` calls showDirectoryPicker — must run
    // in the same tick as the user's click gesture (Riesgo #5, design.md §Riesgos).
    const fs = new FileSystemAdapter();
    await fs.connect();
    if (keepDemo) {
      const bundle = await get().adapter.exportAll();
      await fs.importAll(bundle);
    }
    setWorkspaceMode("filesystem");
    if (keepDemo) markDemoSeeded();
    else markDemoCleared();
    // Reload avoids auditing every in-memory read across stores (Principio V).
    window.location.reload();
  },

  async clearWorkspace() {
    // Both adapters' `importAll` are additive, so clear via list/remove +
    // reset docs/workspace. Works identically for filesystem and download.
    for (const col of COLLECTION_COLS) {
      const ids = await adapter.list(col);
      await Promise.all(ids.map((id) => adapter.remove(col, id)));
    }
    await Promise.all(DOC_NAMES.map((name) => adapter.writeDoc(name, emptyDoc(name))));
    await adapter.writeWorkspace(emptyWorkspace());
    markDemoCleared();
    window.location.reload();
  },

  async loadDemo() {
    await seedDemo(adapter);
    markDemoSeeded();
    window.location.reload();
  },
}));

async function hasStoredHandle(): Promise<boolean> {
  try {
    return (await idbGet("rootDirHandle")) != null;
  } catch {
    return false;
  }
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}
