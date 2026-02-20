import { Module } from "@nestjs/common";
import { LegacyPermissionGuard } from "./legacy-permission.guard";

@Module({
  providers: [LegacyPermissionGuard],
  exports: [LegacyPermissionGuard]
})
export class PermissionCompatibilityModule {}
