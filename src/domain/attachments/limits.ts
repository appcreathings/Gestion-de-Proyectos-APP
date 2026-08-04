export const MAX_BYTES_FILESYSTEM = 25 * 1024 * 1024;
export const MAX_COUNT_FILESYSTEM = 50;

export const MAX_BYTES_DOWNLOAD = 5 * 1024 * 1024;
export const MAX_COUNT_DOWNLOAD = 20;

export type AdapterKind = "filesystem" | "download";

export function maxBytesFor(kind: AdapterKind): number {
  return kind === "filesystem" ? MAX_BYTES_FILESYSTEM : MAX_BYTES_DOWNLOAD;
}

export function maxCountFor(kind: AdapterKind): number {
  return kind === "filesystem" ? MAX_COUNT_FILESYSTEM : MAX_COUNT_DOWNLOAD;
}