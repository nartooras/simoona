import { Module } from "@nestjs/common";
import { AccountCompatibilityController } from "./controllers/account-compatibility.controller";
import { TokenCompatibilityController } from "./controllers/token-compatibility.controller";
import { UserCompatibilityController } from "./controllers/user-compatibility.controller";
import { AuthCompatibilityService } from "./services/auth-compatibility.service";
import { LegacyPermissionGuard } from "../permissions/legacy-permission.guard";

@Module({
  controllers: [
    AccountCompatibilityController,
    TokenCompatibilityController,
    UserCompatibilityController
  ],
  providers: [AuthCompatibilityService, LegacyPermissionGuard]
})
export class AuthCompatibilityModule {}
