import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class LegacyPermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.legacyPermissionCheck = {
      status: "planned",
      source: "legacy permission attributes"
    };
    return true;
  }
}
