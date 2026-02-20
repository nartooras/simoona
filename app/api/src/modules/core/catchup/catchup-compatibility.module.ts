import { Module } from "@nestjs/common";
import { LegacyCatchupCompatibilityController } from "./controllers/legacy-catchup-compatibility.controller";

@Module({
  controllers: [LegacyCatchupCompatibilityController]
})
export class CatchupCompatibilityModule {}
