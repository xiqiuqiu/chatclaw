import test from "node:test";
import assert from "node:assert/strict";

import { gatewayRpcCall } from "../src/lib/gateway-ws.ts";

type MessageHandler = ((event: { data: string }) => void) | null;
type CloseHandler = ((event: { code?: number; reason?: string }) => void) | null;
type ErrorHandler = (() => void) | null;

class ClosingWebSocket {
  static instances: ClosingWebSocket[] = [];

  onmessage: MessageHandler = null;
  onclose: CloseHandler = null;
  onerror: ErrorHandler = null;
  sent: Array<{ type: string; id?: string; method?: string }> = [];
  url: string;

  constructor(url: string) {
    this.url = url;
    ClosingWebSocket.instances.push(this);
    queueMicrotask(() => {
      this.onmessage?.({
        data: JSON.stringify({ type: "event", event: "connect.challenge" }),
      });
    });
  }

  send(data: string) {
    const frame = JSON.parse(data) as { type: string; id?: string; method?: string };
    this.sent.push(frame);

    if (frame.method === "connect") {
      queueMicrotask(() => {
        this.onmessage?.({
          data: JSON.stringify({ type: "res", id: frame.id, ok: true }),
        });
      });
      return;
    }

    queueMicrotask(() => {
      this.onclose?.({ code: 1006, reason: "socket closed during restart" });
    });
  }

  close() {}
}

test("rejects immediately when the gateway socket closes before replying", async () => {
  const originalWebSocket = globalThis.WebSocket;
  ClosingWebSocket.instances = [];
  globalThis.WebSocket = ClosingWebSocket as unknown as typeof WebSocket;

  const startedAt = Date.now();

  try {
    await assert.rejects(
      () => gatewayRpcCall("ws://localhost:18080/proxy/27eafc3c", "token", "config.apply", { raw: "{}", baseHash: "hash" }, 1000),
      /WebSocket closed before response: config\.apply/
    );
  } finally {
    globalThis.WebSocket = originalWebSocket;
  }

  const elapsedMs = Date.now() - startedAt;
  assert.ok(elapsedMs < 300, `expected close to fail fast, got ${elapsedMs}ms`);
});
