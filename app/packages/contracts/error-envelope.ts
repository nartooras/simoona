export interface LegacyErrorEnvelope {
  errorCode: string;
  errorMessage: string;
}

export function createLegacyErrorEnvelope(
  errorCode: string,
  errorMessage: string
): LegacyErrorEnvelope {
  return {
    errorCode,
    errorMessage
  };
}
