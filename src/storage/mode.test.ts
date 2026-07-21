import { describe, it, expect, beforeEach, vi } from "vitest";

const {
  getWorkspaceMode,
  setWorkspaceMode,
  isDemoSeeded,
  markDemoSeeded,
  isDemoCleared,
  markDemoCleared,
  isDemoBannerDismissed,
  dismissDemoBanner,
} = await import("./mode");

/** Minimal in-memory localStorage for the happy-path cases. */
function makeStorage(): Storage {
  const store = new Map<string, string>();
  return {
    getItem: (k) => (store.has(k) ? store.get(k)! : null),
    setItem: (k, v) => {
      store.set(k, v);
    },
    removeItem: (k) => {
      store.delete(k);
    },
    clear: () => store.clear(),
    key: () => null,
    get length() {
      return store.size;
    },
  } as Storage;
}

describe("mode (localStorage disponible)", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", makeStorage());
  });

  it("valores por defecto: mode null, todos los flags false", () => {
    expect(getWorkspaceMode()).toBeNull();
    expect(isDemoSeeded()).toBe(false);
    expect(isDemoCleared()).toBe(false);
    expect(isDemoBannerDismissed()).toBe(false);
  });

  it("setWorkspaceMode round-trips ambos valores", () => {
    setWorkspaceMode("browser");
    expect(getWorkspaceMode()).toBe("browser");
    setWorkspaceMode("filesystem");
    expect(getWorkspaceMode()).toBe("filesystem");
  });

  it("valores no-válidos en storage se tratan como null", () => {
    localStorage.setItem("hito:workspace-mode", "garbage");
    expect(getWorkspaceMode()).toBeNull();
  });

  it("marcar seeded no afecta cleared ni banner (flags independientes)", () => {
    markDemoSeeded();
    expect(isDemoSeeded()).toBe(true);
    expect(isDemoCleared()).toBe(false);
    expect(isDemoBannerDismissed()).toBe(false);
  });

  it("marcar cleared no afecta seeded ni banner", () => {
    markDemoCleared();
    expect(isDemoCleared()).toBe(true);
    expect(isDemoSeeded()).toBe(false);
    expect(isDemoBannerDismissed()).toBe(false);
  });

  it("dismissDemoBanner es independiente del resto", () => {
    dismissDemoBanner();
    expect(isDemoBannerDismissed()).toBe(true);
    expect(isDemoSeeded()).toBe(false);
    expect(isDemoCleared()).toBe(false);
  });

  it("seeded y cleared pueden coexistir (registro orthogonal)", () => {
    markDemoSeeded();
    markDemoCleared();
    expect(isDemoSeeded()).toBe(true);
    expect(isDemoCleared()).toBe(true);
  });
});

describe("mode defensivo (localStorage lanza — p. ej. modo privado estricto)", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceeded");
      },
    });
  });

  it("getters devuelven null/false sin lanzar", () => {
    expect(() => getWorkspaceMode()).not.toThrow();
    expect(() => isDemoSeeded()).not.toThrow();
    expect(() => isDemoCleared()).not.toThrow();
    expect(() => isDemoBannerDismissed()).not.toThrow();
    expect(getWorkspaceMode()).toBeNull();
    expect(isDemoSeeded()).toBe(false);
    expect(isDemoCleared()).toBe(false);
    expect(isDemoBannerDismissed()).toBe(false);
  });

  it("setters no lanzan (best-effort)", () => {
    expect(() => setWorkspaceMode("browser")).not.toThrow();
    expect(() => markDemoSeeded()).not.toThrow();
    expect(() => markDemoCleared()).not.toThrow();
    expect(() => dismissDemoBanner()).not.toThrow();
  });
});
