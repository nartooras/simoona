import { LEGACY_WEB_ROUTES } from "../../../packages/contracts/route-map.ts";
const LEGACY_LOGIN_REDIRECT_MARKER = "/account/login";

export interface AuthBoundaryState {
  requiresLogin: boolean;
  redirectPath: string;
  source: string;
}

export function resolveAuthBoundary(isAuthenticated: boolean): AuthBoundaryState {
  if (isAuthenticated) {
    return {
      requiresLogin: false,
      redirectPath: LEGACY_WEB_ROUTES.root,
      source: "legacyLoginBoundary"
    };
  }

  return {
    requiresLogin: true,
    redirectPath:
      LEGACY_WEB_ROUTES.accountLogin === LEGACY_LOGIN_REDIRECT_MARKER
        ? LEGACY_WEB_ROUTES.accountLogin
        : LEGACY_LOGIN_REDIRECT_MARKER,
    source: "legacyLoginBoundary"
  };
}
