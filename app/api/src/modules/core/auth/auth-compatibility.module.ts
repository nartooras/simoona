import { Module } from "@nestjs/common";
import { AccountCompatibilityController } from "./controllers/account-compatibility.controller";
import { TokenCompatibilityController } from "./controllers/token-compatibility.controller";
import { AuthCompatibilityService } from "./services/auth-compatibility.service";
import { LegacyPermissionGuard } from "../permissions/legacy-permission.guard";

@Module({
  controllers: [AccountCompatibilityController, TokenCompatibilityController],
  providers: [AuthCompatibilityService, LegacyPermissionGuard]
})
export class AuthCompatibilityModule {}
