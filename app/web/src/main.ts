import { resolveAuthBoundary } from "./shell/auth-boundary";
import { resolveTenantRoute } from "./shell/tenant-route-container";
import { createTopLevelLayoutState } from "./shell/top-level-layout";

export interface ShellBootstrapState {
  auth: ReturnType<typeof resolveAuthBoundary>;
  tenantRoute: ReturnType<typeof resolveTenantRoute>;
  layout: ReturnType<typeof createTopLevelLayoutState>;
}

export function bootstrapShell(pathname: string, isAuthenticated: boolean): ShellBootstrapState {
  return {
    auth: resolveAuthBoundary(isAuthenticated),
    tenantRoute: resolveTenantRoute(pathname),
    layout: createTopLevelLayoutState()
  };
}
