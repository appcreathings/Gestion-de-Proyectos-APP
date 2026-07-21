import { DownloadAdapter } from "./DownloadAdapter";
import { FileSystemAdapter } from "./FileSystemAdapter";
import type { StorageAdapter } from "./StorageAdapter";
import type { WorkspaceMode } from "./mode";

export * from "./StorageAdapter";
export { FileSystemAdapter } from "./FileSystemAdapter";
export { DownloadAdapter } from "./DownloadAdapter";
export type { WorkspaceMode } from "./mode";

/**
 * Pick the adapter for the chosen workspace mode. Decoupled from browser
 * capabilities: a `filesystem` mode on a browser without the File System Access
 * API falls back to `DownloadAdapter` safely (spec 030 §3).
 */
export function createStorageAdapter(mode: WorkspaceMode): StorageAdapter {
  return mode === "filesystem" && FileSystemAdapter.isSupported()
    ? new FileSystemAdapter()
    : new DownloadAdapter();
}
