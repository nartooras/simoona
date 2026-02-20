import { LEGACY_WEB_ROUTES } from "../../../packages/contracts/route-map.ts";

export interface TenantRouteContext {
  tenantId: string;
  normalizedPath: string;
  source: string;
}

export function resolveTenantRoute(pathname: string, tenantId?: string): TenantRouteContext {
  const normalizedInput = pathname || LEGACY_WEB_ROUTES.root;
  const pathSegments = normalizedInput.split("/").filter(Boolean);
  const inferredTenantId = tenantId ?? pathSegments[0] ?? "default";
  const normalizedPath = pathSegments.length > 1 ? `/${pathSegments.slice(1).join("/")}` : "/";

  return {
    tenantId: inferredTenantId,
    normalizedPath: normalizedPath || normalizedInput,
    source: "legacyTenantRouteContainer"
  };
}
