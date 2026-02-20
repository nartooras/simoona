import { Module } from "@nestjs/common";
import { ExternalJobsCompatibilityController } from "./controllers/external-jobs-compatibility.controller";
import { PictureCompatibilityController } from "./controllers/picture-compatibility.controller";
import { IntegrationCompatibilityService } from "./services/integration-compatibility.service";

@Module({
  controllers: [ExternalJobsCompatibilityController, PictureCompatibilityController],
  providers: [IntegrationCompatibilityService]
})
export class IntegrationCompatibilityModule {}
