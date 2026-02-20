export interface NotificationSettingsCompatibilityInput {
  source: string;
  operation: "get" | "put";
}

export interface NotificationSettingsCompatibilityResponse {
  status: string;
  compatibility: string;
  settings: {
    source: string;
    operation: "get" | "put";
  };
  normalizedBy: string;
}

interface NotificationSettingsNormalizationContract {
  status: string;
  compatibility: string;
}

export function normalizeNotificationSettingsCompatibilityResponse(
  input: NotificationSettingsCompatibilityInput,
  contract: NotificationSettingsNormalizationContract
): NotificationSettingsCompatibilityResponse {
  return {
    status: contract.status,
    compatibility: contract.compatibility,
    settings: {
      source: input.source,
      operation: input.operation
    },
    normalizedBy: "notification-settings-compatibility-normalizer-v1"
  };
}
