export interface TenantRouteContext {
  tenantId: string;
  normalizedPath: string;
  source: string;
}

export function resolveTenantRoute(pathname: string, tenantId?: string): TenantRouteContext {
  const pathSegments = pathname.split("/").filter(Boolean);
  const inferredTenantId = tenantId ?? pathSegments[0] ?? "default";
  const normalizedPath = pathSegments.length > 1 ? `/${pathSegments.slice(1).join("/")}` : "/";

  return {
    tenantId: inferredTenantId,
    normalizedPath,
    source: "legacyTenantRouteContainer"
  };
}
