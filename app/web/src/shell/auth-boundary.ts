export interface AuthBoundaryState {
  requiresLogin: boolean;
  redirectPath: string;
  source: string;
}

export function resolveAuthBoundary(isAuthenticated: boolean): AuthBoundaryState {
  if (isAuthenticated) {
    return {
      requiresLogin: false,
      redirectPath: "/",
      source: "legacyLoginBoundary"
    };
  }

  return {
    requiresLogin: true,
    redirectPath: "/account/login",
    source: "legacyLoginBoundary"
  };
}
