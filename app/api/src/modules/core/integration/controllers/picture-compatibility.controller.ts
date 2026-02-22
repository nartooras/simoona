import { All, Controller, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { IntegrationCompatibilityService } from "../services/integration-compatibility.service";

@Controller("Picture")
@UseGuards(LegacyPermissionGuard)
export class PictureCompatibilityController {
  constructor(private readonly integrationService: IntegrationCompatibilityService) {}

  @All("Upload")
  upload(@Req() request: Request) {
    return this.integrationService.uploadPicture(request);
  }
}
