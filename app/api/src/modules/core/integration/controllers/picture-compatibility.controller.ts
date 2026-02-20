import { All, Controller, UseGuards } from "@nestjs/common";
import { LegacyPermissionGuard } from "../../permissions/legacy-permission.guard";
import { IntegrationCompatibilityService } from "../services/integration-compatibility.service";

@Controller("Picture")
@UseGuards(LegacyPermissionGuard)
export class PictureCompatibilityController {
  constructor(private readonly integrationService: IntegrationCompatibilityService) {}

  @All("Upload")
  upload() {
    return this.integrationService.uploadPicture();
  }
}
