import { Module } from "@nestjs/common";
import { LegacyErrorMapper } from "./legacy-error.mapper";
import { LegacyErrorFilter } from "./legacy-error.filter";

@Module({
  providers: [LegacyErrorMapper, LegacyErrorFilter],
  exports: [LegacyErrorMapper, LegacyErrorFilter]
})
export class LegacyErrorModule {}
