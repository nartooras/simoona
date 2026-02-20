import { Module } from "@nestjs/common";
import { AuthCompatibilityModule } from "./auth/auth-compatibility.module";
import { PermissionCompatibilityModule } from "./permissions/permission-compatibility.module";
import { LegacyErrorModule } from "./errors/legacy-error.module";
import { LegacyConventionsModule } from "./conventions/legacy-conventions.module";
import { SocialCompatibilityModule } from "./social/social-compatibility.module";
import { SystemCompatibilityModule } from "./system/system-compatibility.module";
import { AdminReferenceCompatibilityModule } from "./admin/admin-reference-compatibility.module";
import { IntegrationCompatibilityModule } from "./integration/integration-compatibility.module";
import { CatchupCompatibilityModule } from "./catchup/catchup-compatibility.module";

@Module({
  imports: [
    AuthCompatibilityModule,
    PermissionCompatibilityModule,
    LegacyErrorModule,
    LegacyConventionsModule,
    SocialCompatibilityModule,
    SystemCompatibilityModule,
    AdminReferenceCompatibilityModule,
    IntegrationCompatibilityModule,
    CatchupCompatibilityModule
  ],
  exports: [LegacyConventionsModule]
})
export class CoreCompatibilityModule {}
