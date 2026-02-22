export const LEGACY_PERMISSION_FLAGS = {
  basicComment: "BasicPermissions.Comment",
  basicEvent: "BasicPermissions.Event",
  basicWall: "BasicPermissions.Wall",
  basicPost: "BasicPermissions.Post",
  basicApplicationUser: "BasicPermissions.ApplicationUser",
  basicOffice: "BasicPermissions.Office",
  basicFloor: "BasicPermissions.Floor",
  adminOrganization: "AdministrationPermissions.Organization",
  adminExternalLink: "AdministrationPermissions.ExternalLink",
  adminBlacklist: "AdministrationPermissions.Blacklist",
  adminApplicationUser: "AdministrationPermissions.ApplicationUser",
  adminOffice: "AdministrationPermissions.Office",
  adminFloor: "AdministrationPermissions.Floor",
  adminRole: "AdministrationPermissions.Role"
} as const;

export type LegacyPermissionFlag =
  (typeof LEGACY_PERMISSION_FLAGS)[keyof typeof LEGACY_PERMISSION_FLAGS];

export const LEGACY_PERMISSION_GUARD_SOURCE = "legacy permission attributes";

export interface LegacyPermissionEvaluation {
  required: string[];
  granted: string[];
  missing: string[];
}
