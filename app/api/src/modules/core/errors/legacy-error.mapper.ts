import { Injectable } from "@nestjs/common";
import { createLegacyErrorEnvelope } from "@simoona/contracts/error-envelope";

@Injectable()
export class LegacyErrorMapper {
  map(error: unknown) {
    if (error instanceof Error) {
      return createLegacyErrorEnvelope("LEGACY_COMPAT_ERROR", error.message);
    }

    return createLegacyErrorEnvelope("LEGACY_COMPAT_UNKNOWN", "Unknown error");
  }
}
