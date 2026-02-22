export interface LegacyErrorEnvelope {
  status?: "error";
  errorCode: string;
  errorMessage: string;
  path?: string;
  timestampUtc?: string;
  details?: Record<string, unknown>;
}

export function createLegacyErrorEnvelope(
  errorCode: string,
  errorMessage: string,
  details: Record<string, unknown> = {}
): LegacyErrorEnvelope {
  const timestampUtc = new Date().toISOString();
  return {
    errorCode,
    errorMessage,
    details,
    timestampUtc
  };
}
