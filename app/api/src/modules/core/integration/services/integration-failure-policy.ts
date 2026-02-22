import { BadGatewayException, GatewayTimeoutException, HttpException } from "@nestjs/common";
import type { Request } from "express";

export const INTEGRATION_FAILURE_HEADER = "x-simoona-integration-failure";
export const INTEGRATION_FAILURE_QUERY_KEY = "simulateFailure";

export const INTEGRATION_FAILURE_MODES = {
  oauthTimeout: "oauth-timeout",
  oauthAuthFailure: "oauth-auth-failure",
  smtpTimeout: "smtp-timeout",
  smtpAuthFailure: "smtp-auth-failure",
  storageTimeout: "storage-timeout",
  storageAuthFailure: "storage-auth-failure",
  externalJobsTimeout: "external-jobs-timeout",
  externalJobsAuthFailure: "external-jobs-auth-failure",
  localizationTimeout: "localization-timeout"
} as const;

export type IntegrationFailureMode =
  (typeof INTEGRATION_FAILURE_MODES)[keyof typeof INTEGRATION_FAILURE_MODES];

function readRequestValue(value: unknown): string {
  if (Array.isArray(value)) {
    return String(value[0] ?? "").trim();
  }

  return String(value ?? "").trim();
}

function normalizeFailureMode(raw: string): IntegrationFailureMode | null {
  if (!raw) {
    return null;
  }

  const normalized = raw.trim().toLowerCase();
  const values = Object.values(INTEGRATION_FAILURE_MODES) as string[];
  if (!values.includes(normalized)) {
    return null;
  }

  return normalized as IntegrationFailureMode;
}

export function resolveIntegrationFailureMode(request?: Request): IntegrationFailureMode | null {
  const fromHeader = normalizeFailureMode(
    readRequestValue(request?.headers?.[INTEGRATION_FAILURE_HEADER])
  );
  if (fromHeader) {
    return fromHeader;
  }

  const queryValue = request?.query?.[INTEGRATION_FAILURE_QUERY_KEY];
  return normalizeFailureMode(readRequestValue(queryValue));
}

function createFailureException(mode: IntegrationFailureMode, compatibility: string): HttpException {
  switch (mode) {
    case INTEGRATION_FAILURE_MODES.oauthTimeout:
      return new GatewayTimeoutException(
        `${compatibility}: external OAuth provider timeout.`
      );
    case INTEGRATION_FAILURE_MODES.oauthAuthFailure:
      return new BadGatewayException(
        `${compatibility}: external OAuth provider authentication failed.`
      );
    case INTEGRATION_FAILURE_MODES.smtpTimeout:
      return new GatewayTimeoutException(`${compatibility}: SMTP provider timeout.`);
    case INTEGRATION_FAILURE_MODES.smtpAuthFailure:
      return new BadGatewayException(`${compatibility}: SMTP provider authentication failed.`);
    case INTEGRATION_FAILURE_MODES.storageTimeout:
      return new GatewayTimeoutException(`${compatibility}: storage provider timeout.`);
    case INTEGRATION_FAILURE_MODES.storageAuthFailure:
      return new BadGatewayException(`${compatibility}: storage provider authentication failed.`);
    case INTEGRATION_FAILURE_MODES.externalJobsTimeout:
      return new GatewayTimeoutException(`${compatibility}: external jobs callback timeout.`);
    case INTEGRATION_FAILURE_MODES.externalJobsAuthFailure:
      return new BadGatewayException(
        `${compatibility}: external jobs callback authentication failed.`
      );
    case INTEGRATION_FAILURE_MODES.localizationTimeout:
      return new GatewayTimeoutException(
        `${compatibility}: localization provider timeout.`
      );
    default:
      return new BadGatewayException(`${compatibility}: unknown integration failure mode.`);
  }
}

export function throwIfIntegrationFailure(
  request: Request | undefined,
  compatibility: string,
  handledModes: IntegrationFailureMode[]
): void {
  const mode = resolveIntegrationFailureMode(request);
  if (!mode || !handledModes.includes(mode)) {
    return;
  }

  throw createFailureException(mode, compatibility);
}
