export const LEGACY_AUTH_CLAIMS = {
  userId: "legacy.user.id",
  organizationName: "legacy.organization.name",
  permissions: "legacy.user.permissions",
  tenantId: "legacy.tenant.id",
  culture: "legacy.user.culture"
} as const;

export type LegacyAuthClaimKey = keyof typeof LEGACY_AUTH_CLAIMS;

export interface LegacyAuthContext {
  userId?: string;
  organizationName?: string;
  tenantId?: string;
  permissions?: string[];
  culture?: string;
}
