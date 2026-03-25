import test from "node:test";
import assert from "node:assert/strict";

import { parseWorkspaceFileRpcResult, parseWorkspaceWriteRpcResult } from "../src/lib/workspace-files.ts";

test("returns content when workspace file rpc succeeds", () => {
  const result = parseWorkspaceFileRpcResult({
    ok: true,
    payload: {
      file: {
        content: "hello",
      },
    },
  });

  assert.deepEqual(result, { ok: true, content: "hello" });
});

test("surfaces unknown agent id as a user-facing workspace capability error", () => {
  const result = parseWorkspaceFileRpcResult({
    ok: false,
    error: {
      code: "INVALID_REQUEST",
      message: "unknown agent id",
    },
  });

  assert.deepEqual(result, {
    ok: false,
    error: "This agent does not have editable workspace files in the current gateway.",
  });
});

test("surfaces unknown agent id on workspace writes with the same user-facing error", () => {
  const result = parseWorkspaceWriteRpcResult({
    ok: false,
    error: {
      code: "INVALID_REQUEST",
      message: "unknown agent id",
    },
  });

  assert.deepEqual(result, {
    ok: false,
    error: "This agent does not have editable workspace files in the current gateway.",
  });
});
