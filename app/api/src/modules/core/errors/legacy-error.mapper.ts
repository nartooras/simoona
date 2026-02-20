import { Injectable } from "@nestjs/common";

@Injectable()
export class LegacyErrorMapper {
  map(error: unknown) {
    if (error instanceof Error) {
      return {
        errorCode: "LEGACY_COMPAT_ERROR",
        errorMessage: error.message
      };
    }

    return {
      errorCode: "LEGACY_COMPAT_UNKNOWN",
      errorMessage: "Unknown error"
    };
  }
}
