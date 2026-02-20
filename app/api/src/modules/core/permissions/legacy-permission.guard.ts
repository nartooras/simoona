import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { LEGACY_PERMISSION_GUARD_SOURCE } from "@simoona/contracts/permissions";

@Injectable()
export class LegacyPermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.legacyPermissionCheck = {
      status: "planned",
      source: LEGACY_PERMISSION_GUARD_SOURCE
    };
    return true;
  }
}
