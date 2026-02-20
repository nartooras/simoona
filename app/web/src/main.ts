import { resolveAuthBoundary } from "./shell/auth-boundary";
import { resolveLegacyRouteCatchup } from "./shell/legacy-route-catchup";
import { resolveTenantRoute } from "./shell/tenant-route-container";
import { createTopLevelLayoutState } from "./shell/top-level-layout";

export interface ShellBootstrapState {
  auth: ReturnType<typeof resolveAuthBoundary>;
  route: ReturnType<typeof resolveLegacyRouteCatchup>;
  tenantRoute: ReturnType<typeof resolveTenantRoute>;
  layout: ReturnType<typeof createTopLevelLayoutState>;
}

export function bootstrapShell(
  pathname: string,
  isAuthenticated: boolean,
  prefersReducedMotion: boolean = false
): ShellBootstrapState {
  return {
    auth: resolveAuthBoundary(isAuthenticated),
    route: resolveLegacyRouteCatchup(pathname),
    tenantRoute: resolveTenantRoute(pathname),
    layout: createTopLevelLayoutState(prefersReducedMotion)
  };
}
