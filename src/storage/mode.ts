/**
 * Persisted workspace mode + demo lifecycle flags (spec 030).
 *
 * Lives in `localStorage` (synchronous, available before any `await`) — NOT in
 * IndexedDB — so `bootstrap()` can resolve the mode without racing the adapter.
 * `rootDirHandle` in IDB remains the source of truth for "is a folder handle
 * stored"; this mode is the user/app's explicit choice of backend.
 *
 * Every access is defensive: strict private mode can make `localStorage` throw,
 * so callers always get a sane default (`null`/`false`) instead of an exception
 * — same pattern as `hasStoredHandle()` in `useAppStore.ts`.
 */
const MODE_KEY = "hito:workspace-mode";
const DEMO_SEEDED_KEY = "hito:demo-seeded";
const DEMO_CLEARED_KEY = "hito:demo-cleared";
const BANNER_DISMISSED_KEY = "hito:demo-banner-dismissed";

export type WorkspaceMode = "filesystem" | "browser";

function readKey(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeKey(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore — best-effort persistence */
  }
}

export function getWorkspaceMode(): WorkspaceMode | null {
  const v = readKey(MODE_KEY);
  return v === "filesystem" || v === "browser" ? v : null;
}

export function setWorkspaceMode(mode: WorkspaceMode): void {
  writeKey(MODE_KEY, mode);
}

/** Has the demo ever been seeded (auto or manual) in this profile? */
export function isDemoSeeded(): boolean {
  return readKey(DEMO_SEEDED_KEY) === "1";
}

export function markDemoSeeded(): void {
  writeKey(DEMO_SEEDED_KEY, "1");
}

/** Did the user explicitly clear/vacate, opting out of future auto-seeding? */
export function isDemoCleared(): boolean {
  return readKey(DEMO_CLEARED_KEY) === "1";
}

export function markDemoCleared(): void {
  writeKey(DEMO_CLEARED_KEY, "1");
}

export function isDemoBannerDismissed(): boolean {
  return readKey(BANNER_DISMISSED_KEY) === "1";
}

export function dismissDemoBanner(): void {
  writeKey(BANNER_DISMISSED_KEY, "1");
}
