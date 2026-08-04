export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  const decimals = value >= 10 || i === 0 ? 0 : 1;
  const formatted = decimals === 0 ? Math.round(value).toString() : value.toFixed(decimals);
  return `${formatted} ${sizes[i]}`;
}