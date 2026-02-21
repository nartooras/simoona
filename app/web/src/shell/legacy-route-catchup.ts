export interface LegacyRouteMatch {
  routeKey: string;
  normalizedPath: string;
  isKnownLegacyRoute: boolean;
  source: string;
}

const TENANT_ROUTE_PREFIXES = new Set([
  "AccessDenied",
  "Admin",
  "Books",
  "Committees",
  "Employee",
  "Error",
  "Events",
  "Forgot",
  "Kudos",
  "Login",
  "LogOff",
  "Office",
  "OrganizationalStructure",
  "PageNotFound",
  "Profiles",
  "Projects",
  "Register",
  "Reset",
  "ServiceRequests",
  "Settings",
  "SubmitTicket",
  "Vacation",
  "Verify",
  "Wall"
]);

const PUBLIC_ROUTES = new Set(["/", "/Login"]);

function normalizePath(pathname: string): string {
  const input = pathname?.trim() || "/";
  if (input === "/") {
    return input;
  }

  const sanitized = input.replace(/\/{2,}/g, "/");
  return sanitized.endsWith("/") ? sanitized.slice(0, -1) : sanitized;
}

export function resolveLegacyRouteCatchup(pathname: string): LegacyRouteMatch {
  const normalizedPath = normalizePath(pathname);

  if (PUBLIC_ROUTES.has(normalizedPath)) {
    return {
      routeKey: normalizedPath === "/Login" ? "public.login" : "public.home",
      normalizedPath,
      isKnownLegacyRoute: true,
      source: "legacyRouteCatchupRegistry"
    };
  }

  if (normalizedPath.startsWith("/redirectTo/")) {
    return {
      routeKey: "redirect.redirectTo",
      normalizedPath,
      isKnownLegacyRoute: true,
      source: "legacyRouteCatchupRegistry"
    };
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  if (segments.length === 0) {
    return {
      routeKey: "public.home",
      normalizedPath: "/",
      isKnownLegacyRoute: true,
      source: "legacyRouteCatchupRegistry"
    };
  }

  const globalRouteHead = segments[0];
  if (TENANT_ROUTE_PREFIXES.has(globalRouteHead)) {
    return {
      routeKey: `global.${globalRouteHead.toLowerCase()}`,
      normalizedPath,
      isKnownLegacyRoute: true,
      source: "legacyRouteCatchupRegistry"
    };
  }

  if (segments.length === 1) {
    return {
      routeKey: "tenant.home",
      normalizedPath,
      isKnownLegacyRoute: true,
      source: "legacyRouteCatchupRegistry"
    };
  }

  const tenantRouteHead = segments[1];
  if (TENANT_ROUTE_PREFIXES.has(tenantRouteHead)) {
    return {
      routeKey: `tenant.${tenantRouteHead.toLowerCase()}`,
      normalizedPath,
      isKnownLegacyRoute: true,
      source: "legacyRouteCatchupRegistry"
    };
  }

  return {
    routeKey: "tenant.unknown",
    normalizedPath,
    isKnownLegacyRoute: false,
    source: "legacyRouteCatchupRegistry"
  };
}
