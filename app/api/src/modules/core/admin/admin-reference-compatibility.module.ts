import { Module } from "@nestjs/common";
import { FloorCompatibilityController } from "./controllers/floor-compatibility.controller";
import { OfficeCompatibilityController } from "./controllers/office-compatibility.controller";
import { OrganizationCompatibilityController } from "./controllers/organization-compatibility.controller";
import { AdminReferenceCompatibilityService } from "./services/admin-reference-compatibility.service";

@Module({
  controllers: [
    OrganizationCompatibilityController,
    OfficeCompatibilityController,
    FloorCompatibilityController
  ],
  providers: [AdminReferenceCompatibilityService]
})
export class AdminReferenceCompatibilityModule {}
