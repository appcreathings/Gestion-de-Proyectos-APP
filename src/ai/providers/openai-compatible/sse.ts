/**
 * Parseador de `text/event-stream` con buffer persistente entre chunks.
 * Un chunk de red puede partir una línea `data:` por la mitad (incluso a mitad
 * de un carácter multibyte) — solo se consumen bloques completos delimitados
 * por `\n\n`.
 */

export type SseHandler = (data: string) => void | Promise<void>;

export async function consumeSseStream(
  body: ReadableStream<Uint8Array>,
  onData: SseHandler,
  signal?: AbortSignal,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  const onAbort = () => {
    void reader.cancel().catch(() => undefined);
  };
  signal?.addEventListener("abort", onAbort, { once: true });

  try {
    while (true) {
      if (signal?.aborted) {
        throw new DOMException("aborted", "AbortError");
      }
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let sep: number;
      while ((sep = findEventBoundary(buffer)) >= 0) {
        const block = buffer.slice(0, sep);
        buffer = buffer.slice(sep + (buffer[sep] === "\r" ? 4 : 2));
        await dispatchBlock(block, onData);
      }
    }
    // flush residual
    buffer += decoder.decode();
    if (buffer.trim()) {
      await dispatchBlock(buffer, onData);
    }
  } finally {
    signal?.removeEventListener("abort", onAbort);
    try {
      reader.releaseLock();
    } catch {
      // already released
    }
  }
}

/** `\n\n` or `\r\n\r\n` */
function findEventBoundary(buf: string): number {
  const n = buf.indexOf("\n\n");
  const rn = buf.indexOf("\r\n\r\n");
  if (n < 0) return rn;
  if (rn < 0) return n;
  return Math.min(n, rn);
}

async function dispatchBlock(block: string, onData: SseHandler): Promise<void> {
  const lines = block.split(/\r?\n/);
  for (const line of lines) {
    if (!line.startsWith("data:")) continue;
    // "data:" or "data: "
    const payload = line.slice(5).replace(/^\s/, "");
    if (payload === "[DONE]") return;
    if (!payload) continue;
    await onData(payload);
  }
  // lines starting with `event:` are ignored (OpenAI rarely uses them)
}
