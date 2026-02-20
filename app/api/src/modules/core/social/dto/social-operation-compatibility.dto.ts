import { SocialOperationAdapterPayload } from "../adapters/social-operation.adapter";

export interface SocialOperationCompatibilityResponse {
  status: string;
  compatibility: string;
  payload: SocialOperationAdapterPayload;
  normalizedBy: string;
}

interface SocialOperationNormalizationContract {
  status: string;
  compatibility: string;
}

export function normalizeSocialOperationCompatibilityResponse(
  payload: SocialOperationAdapterPayload,
  contract: SocialOperationNormalizationContract
): SocialOperationCompatibilityResponse {
  return {
    status: contract.status,
    compatibility: contract.compatibility,
    payload: {
      source: payload.source,
      adapter: payload.adapter,
      operation: payload.operation,
      payloadVersion: payload.payloadVersion
    },
    normalizedBy: "social-operation-compatibility-normalizer-v1"
  };
}
