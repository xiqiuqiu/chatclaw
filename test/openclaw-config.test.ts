import test from "node:test";
import assert from "node:assert/strict";

import { formatGatewayConfigPayload } from "../src/lib/openclaw-config.ts";

test("formats parsed gateway config payload as editable JSON", () => {
  const result = formatGatewayConfigPayload({
    hash: "abc123",
    parsed: {
      gateway: {
        mode: "local",
      },
    },
  });

  assert.equal(result.hash, "abc123");
  assert.equal(
    result.content,
    `{
  "gateway": {
    "mode": "local"
  }
}`
  );
});

test("formats raw gateway config payload as pretty JSON", () => {
  const result = formatGatewayConfigPayload({
    hash: "def456",
    raw: '{"gateway":{"mode":"local"}}',
  });

  assert.equal(result.hash, "def456");
  assert.equal(
    result.content,
    `{
  "gateway": {
    "mode": "local"
  }
}`
  );
});

test("keeps raw payload unchanged when it is not strict JSON", () => {
  const raw = '{\n  // comment\n  "gateway": {}\n}';
  const result = formatGatewayConfigPayload({
    raw,
  });

  assert.equal(result.content, raw);
});
