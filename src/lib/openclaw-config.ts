interface GatewayConfigPayload {
  hash?: unknown;
  raw?: unknown;
  parsed?: unknown;
}

interface FormattedGatewayConfig {
  hash: string;
  content: string;
}

function formatJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function formatGatewayConfigPayload(
  payload: GatewayConfigPayload | null | undefined
): FormattedGatewayConfig {
  const safePayload = payload ?? {};
  const hash = typeof safePayload.hash === "string" ? safePayload.hash : "";

  if (safePayload.parsed && typeof safePayload.parsed === "object") {
    return {
      hash,
      content: formatJson(safePayload.parsed),
    };
  }

  if (typeof safePayload.raw === "string") {
    try {
      return {
        hash,
        content: formatJson(JSON.parse(safePayload.raw)),
      };
    } catch {
      return {
        hash,
        content: safePayload.raw,
      };
    }
  }

  return {
    hash,
    content: formatJson(safePayload),
  };
}
