interface WorkspaceFileRpcResult {
  ok: boolean;
  payload?: Record<string, unknown>;
  error?: { code?: string; message?: string };
}

function normalizeWorkspaceError(message?: string): string {
  if (message === "unknown agent id") {
    return "This agent does not have editable workspace files in the current gateway.";
  }

  return message || "Failed to access workspace file";
}

export function parseWorkspaceFileRpcResult(result: WorkspaceFileRpcResult): { ok: true; content: string } | { ok: false; error: string } {
  if (result.ok && result.payload) {
    const fileData = result.payload.file as Record<string, unknown> | undefined;
    return {
      ok: true,
      content: (fileData?.content as string) || (result.payload.content as string) || "",
    };
  }

  return {
    ok: false,
    error: normalizeWorkspaceError(result.error?.message),
  };
}

export function parseWorkspaceWriteRpcResult(result: WorkspaceFileRpcResult): { ok: true } | { ok: false; error: string } {
  if (result.ok) {
    return { ok: true };
  }

  return {
    ok: false,
    error: normalizeWorkspaceError(result.error?.message),
  };
}
