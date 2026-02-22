export const LEGACY_AUTH_CLAIMS = {
  userId: "legacy.user.id",
  organizationName: "legacy.organization.name",
  permissions: "legacy.user.permissions",
  tenantId: "legacy.tenant.id",
  culture: "legacy.user.culture",
  sessionId: "legacy.session.id",
  authSource: "legacy.auth.source",
  tokenExpiresAtUtc: "legacy.token.expires_at_utc"
} as const;

export type LegacyAuthClaimKey = keyof typeof LEGACY_AUTH_CLAIMS;

export interface LegacyAuthContext {
  userId?: string;
  organizationName?: string;
  tenantId?: string;
  permissions?: string[];
  culture?: string;
  sessionId?: string;
  authSource?: RuntimeAuthSource;
  tokenExpiresAtUtc?: string;
}

export type RuntimeAuthSource = "bearer-token" | "legacy-header" | "anonymous";
