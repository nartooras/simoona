export const LEGACY_PERMISSION_FLAGS = {
  basicComment: "BasicPermissions.Comment",
  basicEvent: "BasicPermissions.Event",
  basicWall: "BasicPermissions.Wall",
  basicPost: "BasicPermissions.Post",
  adminOrganization: "AdministrationPermissions.Organization",
  adminExternalLink: "AdministrationPermissions.ExternalLink",
  adminBlacklist: "AdministrationPermissions.Blacklist"
} as const;

export type LegacyPermissionFlag =
  (typeof LEGACY_PERMISSION_FLAGS)[keyof typeof LEGACY_PERMISSION_FLAGS];

export const LEGACY_PERMISSION_GUARD_SOURCE = "legacy permission attributes";
