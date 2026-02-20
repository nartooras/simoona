import { WallReadAdapterPayload } from "../adapters/wall-read.adapter";

export interface WallReadCompatibilityResponse {
  status: string;
  compatibility: string;
  payload: WallReadAdapterPayload;
  normalizedBy: string;
}

interface WallReadNormalizationContract {
  status: string;
  compatibility: string;
}

export function normalizeWallReadCompatibilityResponse(
  payload: WallReadAdapterPayload,
  contract: WallReadNormalizationContract
): WallReadCompatibilityResponse {
  return {
    status: contract.status,
    compatibility: contract.compatibility,
    payload: {
      source: payload.source,
      adapter: payload.adapter,
      operation: payload.operation,
      payloadVersion: payload.payloadVersion
    },
    normalizedBy: "wall-read-compatibility-normalizer-v1"
  };
}
