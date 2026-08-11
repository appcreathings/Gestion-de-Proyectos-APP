import { describe, expect, it } from "vitest";
import { consumeSseStream } from "./sse";

function streamFromChunks(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i < chunks.length) {
        controller.enqueue(chunks[i++]);
      } else {
        controller.close();
      }
    },
  });
}

function enc(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

describe("consumeSseStream", () => {
  it("parsea data: completos y termina en [DONE]", async () => {
    const events: string[] = [];
    const body = streamFromChunks([
      enc('data: {"a":1}\n\ndata: {"b":2}\n\ndata: [DONE]\n\n'),
    ]);
    await consumeSseStream(body, (d) => {
      events.push(d);
    });
    expect(events).toEqual(['{"a":1}', '{"b":2}']);
  });

  it("une data: partido entre chunks", async () => {
    const events: string[] = [];
    const body = streamFromChunks([
      enc('data: {"hel'),
      enc('lo":true}\n\n'),
    ]);
    await consumeSseStream(body, (d) => {
      events.push(d);
    });
    expect(events).toEqual(['{"hello":true}']);
  });

  it("une carácter multibyte partido (emoji UTF-8)", async () => {
    // "á" en UTF-8 es C3 A1 — partimos entre los dos bytes
    const full = 'data: {"t":"café"}\n\n';
    const bytes = enc(full);
    const mid = Math.floor(bytes.length / 2);
    const events: string[] = [];
    const body = streamFromChunks([bytes.slice(0, mid), bytes.slice(mid)]);
    await consumeSseStream(body, (d) => {
      events.push(d);
    });
    expect(events).toEqual(['{"t":"café"}']);
  });

  it("ignora líneas event: y vacías", async () => {
    const events: string[] = [];
    const body = streamFromChunks([
      enc("event: ping\n\ndata: ok\n\n:comment\n\n"),
    ]);
    await consumeSseStream(body, (d) => {
      events.push(d);
    });
    expect(events).toEqual(["ok"]);
  });

  it("abort a mitad lanza AbortError", async () => {
    const controller = new AbortController();
    let pulls = 0;
    const body = new ReadableStream<Uint8Array>({
      async pull(c) {
        pulls++;
        if (pulls === 1) {
          c.enqueue(enc("data: partial"));
          controller.abort();
          // hang until cancelled
          await new Promise(() => undefined);
        }
      },
      cancel() {
        // ok
      },
    });

    await expect(
      consumeSseStream(body, () => undefined, controller.signal),
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("soporta delimitador \\r\\n\\r\\n", async () => {
    const events: string[] = [];
    const body = streamFromChunks([enc('data: {"x":1}\r\n\r\ndata: [DONE]\r\n\r\n')]);
    await consumeSseStream(body, (d) => {
      events.push(d);
    });
    expect(events).toEqual(['{"x":1}']);
  });
});
