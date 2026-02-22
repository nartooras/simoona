import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException
} from "@nestjs/common";
import {
  LEGACY_PERMISSION_FLAGS,
  LEGACY_PERMISSION_GUARD_SOURCE
} from "@simoona/contracts/permissions";
import {
  hasRequiredPermissions,
  resolveAuthContext,
  resolveRequiredPermissionsFromHeaders
} from "../auth/services/auth-session-store";

function resolveRouteRequiredPermissions(pathName: string): string[] {
  if (pathName.startsWith("/Organization/")) {
    return [LEGACY_PERMISSION_FLAGS.adminOrganization];
  }

  if (pathName.startsWith("/Blacklist/")) {
    return [LEGACY_PERMISSION_FLAGS.adminBlacklist];
  }

  if (pathName.startsWith("/Wall/")) {
    return [LEGACY_PERMISSION_FLAGS.basicWall];
  }

  if (pathName.startsWith("/Post/")) {
    return [LEGACY_PERMISSION_FLAGS.basicPost];
  }

  if (pathName.startsWith("/Comment/")) {
    return [LEGACY_PERMISSION_FLAGS.basicComment];
  }

  if (pathName.startsWith("/User/")) {
    return [LEGACY_PERMISSION_FLAGS.basicApplicationUser];
  }

  if (pathName.startsWith("/Office/")) {
    return [LEGACY_PERMISSION_FLAGS.basicOffice];
  }

  if (pathName.startsWith("/Floor/")) {
    return [LEGACY_PERMISSION_FLAGS.basicFloor];
  }

  return [];
}

@Injectable()
export class LegacyPermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authContext = resolveAuthContext(request.headers ?? {});

    const explicitRequiredPermissions = resolveRequiredPermissionsFromHeaders(
      request.headers ?? {}
    );
    const routeRequiredPermissions = resolveRouteRequiredPermissions(request.path ?? "");
    const requiredPermissions = explicitRequiredPermissions.length
      ? explicitRequiredPermissions
      : routeRequiredPermissions;

    request.authContext = authContext;

    const missingPermissions = requiredPermissions.filter(
      (permission) => !authContext.permissions.includes(permission)
    );
    request.legacyPermissionCheck = {
      status: "implemented",
      source: LEGACY_PERMISSION_GUARD_SOURCE,
      authSource: authContext.authSource,
      requiredPermissions,
      grantedPermissions: authContext.permissions,
      missingPermissions
    };

    if (!authContext.isAuthenticated) {
      throw new UnauthorizedException("Legacy authentication context is required.");
    }

    if (!hasRequiredPermissions(authContext, requiredPermissions)) {
      throw new ForbiddenException(
        `Missing required permissions: ${missingPermissions.join(", ") || "unknown"}.`
      );
    }

    return true;
  }
}
