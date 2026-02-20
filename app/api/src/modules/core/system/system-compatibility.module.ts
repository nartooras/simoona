import { Module } from "@nestjs/common";
import { ErrorCompatibilityController } from "./controllers/error-compatibility.controller";
import { LocalizationCompatibilityController } from "./controllers/localization-compatibility.controller";

@Module({
  controllers: [ErrorCompatibilityController, LocalizationCompatibilityController]
})
export class SystemCompatibilityModule {}
