import { describe, it, expect, beforeEach, vi } from "vitest";

/**
 * Back-compat tests for `useAppStore.bootstrap()` (spec 030, HU-06 — the single
 * most important risk in this spec). We mock the storage layer and the demo
 * seeder so we can assert exactly when `seedDemo` is invoked and which mode the
 * store resolves to, across the three profiles that must never regress:
 *  - Chromium with a stored folder handle (T3013)
 *  - Firefox/Safari with existing real data in IndexedDB (T3014)
 *  - A fresh profile that should seed exactly once (T3015)
 */

// Live scenario state — mutated by each test; read by the mocked adapters/mode
// functions at call time so reassignments take effect between tests.
const state = vi.hoisted(() => ({
  storedMode: null as "filesystem" | "browser" | null,
  storedHandle: false,
  demoSeeded: false,
  demoCleared: false,
  fsSupported: true,
  fsReady: true,
  browserReady: true,
  fsLists: {} as Record<string, string[]>,
  browserLists: {} as Record<string, string[]>,
}));

const seedCalls = vi.hoisted(() => vi.fn());

vi.mock("@/storage/mode", () => ({
  getWorkspaceMode: () => state.storedMode,
  setWorkspaceMode: (m: string) => {
    state.storedMode = m as "filesystem" | "browser";
  },
  isDemoSeeded: () => state.demoSeeded,
  isDemoCleared: () => state.demoCleared,
  markDemoSeeded: () => {
    state.demoSeeded = true;
  },
  markDemoCleared: () => {
    state.demoCleared = true;
  },
  isDemoBannerDismissed: () => false,
  dismissDemoBanner: () => undefined,
}));

vi.mock("@/storage/idb", () => ({
  idbGet: async (key: string) =>
    key === "rootDirHandle" ? (state.storedHandle ? {} : undefined) : undefined,
}));

vi.mock("@/domain/demo/seed", () => ({
  seedDemo: seedCalls,
}));

vi.mock("@/storage", () => {
  const make = (kind: "filesystem" | "download") => ({
    kind,
    init: vi.fn(async () => undefined),
    isReady: () => (kind === "filesystem" ? state.fsReady : state.browserReady),
    list: async (col: string) => {
      const lists = kind === "filesystem" ? state.fsLists : state.browserLists;
      return lists[col] ?? [];
    },
    readWorkspace: async () => ({ schemaVersion: 14 }) as never,
    write: vi.fn(async () => undefined),
    writeDoc: vi.fn(async () => undefined),
    writeWorkspace: vi.fn(async () => undefined),
    remove: vi.fn(async () => undefined),
    connect: vi.fn(async () => undefined),
    reconnect: vi.fn(async () => true),
    changeFolder: vi.fn(async () => undefined),
    getRootName: () => null,
    exportAll: vi.fn(async () => new Blob(["{}"])),
    importAll: vi.fn(async () => undefined),
    backup: vi.fn(async () => undefined),
  });
  return {
    createStorageAdapter: (mode: string) =>
      make(mode === "filesystem" ? "filesystem" : "download"),
    FileSystemAdapter: Object.assign(
      class {
        static isSupported() {
          return state.fsSupported;
        }
      },
      {},
    ),
  };
});

const { useAppStore } = await import("@/store/useAppStore");

function resetState() {
  state.storedMode = null;
  state.storedHandle = false;
  state.demoSeeded = false;
  state.demoCleared = false;
  state.fsSupported = true;
  state.fsReady = true;
  state.browserReady = true;
  state.fsLists = {};
  state.browserLists = {};
}

function resetStore() {
  useAppStore.setState({
    connection: "initializing",
    error: null,
    workspace: null,
    mode: null,
    isDemo: false,
  });
}

describe("bootstrap() back-compat — HU-06", () => {
  beforeEach(() => {
    resetState();
    resetStore();
    seedCalls.mockClear();
  });

  it("T3013: con rootDirHandle guardado (Chromium) resuelve filesystem y NUNCA siembra el demo", async () => {
    state.storedHandle = true;
    state.fsReady = true;

    await useAppStore.getState().bootstrap();

    const s = useAppStore.getState();
    expect(s.mode).toBe("filesystem");
    expect(s.connection).toBe("ready");
    expect(seedCalls).not.toHaveBeenCalled();
    expect(s.isDemo).toBe(false);
    // El modo se persiste la primera vez (para no volver a evaluar el handle).
    expect(state.storedMode).toBe("filesystem");
  });

  it("T3013b: con handle guardado pero permiso revocado → needs-reconnect, sin sembrar", async () => {
    state.storedHandle = true;
    state.fsReady = false; // init() no logra root (permiso no concedido)

    await useAppStore.getState().bootstrap();

    const s = useAppStore.getState();
    expect(s.mode).toBe("filesystem");
    expect(s.connection).toBe("needs-reconnect");
    expect(seedCalls).not.toHaveBeenCalled();
  });

  it("T3014: con productos/proyectos reales ya en DownloadAdapter (Firefox) NO siembra encima", async () => {
    state.fsSupported = false; // Firefox: sin File System Access API
    state.browserLists = { products: ["prod-real"], projects: ["proj-real"] };

    await useAppStore.getState().bootstrap();

    const s = useAppStore.getState();
    expect(s.mode).toBe("browser");
    expect(s.connection).toBe("ready");
    expect(seedCalls).not.toHaveBeenCalled();
    // Usuario con datos reales no ve el banner de demo.
    expect(s.isDemo).toBe(false);
  });

  it("T3015: perfil limpio siembra exactamente una vez; una segunda llamada (recarga) no vuelve a sembrar", async () => {
    state.fsSupported = true; // Chromium fresco: sin handle, cae a modo browser
    state.storedHandle = false;
    state.browserLists = {};

    // Primera carga: debe sembrar.
    await useAppStore.getState().bootstrap();
    expect(seedCalls).toHaveBeenCalledTimes(1);
    expect(state.demoSeeded).toBe(true);
    let s = useAppStore.getState();
    expect(s.mode).toBe("browser");
    expect(s.isDemo).toBe(true);

    // Simula recarga: el modo quedó persistido y el flag seeded está en true.
    resetStore();
    // state.storedMode ya es "browser"; state.demoSeeded ya es true (persistente).
    await useAppStore.getState().bootstrap();
    expect(seedCalls).toHaveBeenCalledTimes(1); // sin re-sembrar
    s = useAppStore.getState();
    expect(s.connection).toBe("ready");
    expect(s.isDemo).toBe(true);
  });

  it("T3015b: tras 'Vaciar' (isDemoCleared), bootstrap no vuelve a sembrar aunque el workspace esté vacío", async () => {
    state.storedMode = "browser";
    state.demoSeeded = true;
    state.demoCleared = true;
    state.browserLists = {};

    await useAppStore.getState().bootstrap();

    const s = useAppStore.getState();
    expect(s.connection).toBe("ready");
    expect(seedCalls).not.toHaveBeenCalled();
    // isDemo requiere !isDemoCleared: no debe mostrar el banner sobre un workspace vaciado.
    expect(s.isDemo).toBe(false);
  });
});
