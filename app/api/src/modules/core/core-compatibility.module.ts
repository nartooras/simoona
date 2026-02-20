import { Module } from "@nestjs/common";
import { AuthCompatibilityModule } from "./auth/auth-compatibility.module";
import { PermissionCompatibilityModule } from "./permissions/permission-compatibility.module";
import { LegacyErrorModule } from "./errors/legacy-error.module";
import { LegacyConventionsModule } from "./conventions/legacy-conventions.module";
import { SocialCompatibilityModule } from "./social/social-compatibility.module";

@Module({
  imports: [
    AuthCompatibilityModule,
    PermissionCompatibilityModule,
    LegacyErrorModule,
    LegacyConventionsModule,
    SocialCompatibilityModule
  ],
  exports: [LegacyConventionsModule]
})
export class CoreCompatibilityModule {}
