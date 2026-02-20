import { Module } from "@nestjs/common";
import { LegacyResponseEnvelopeInterceptor } from "./legacy-response-envelope.interceptor";
import { LegacyDateSerializationInterceptor } from "./legacy-date-serialization.interceptor";

@Module({
  providers: [LegacyResponseEnvelopeInterceptor, LegacyDateSerializationInterceptor],
  exports: [LegacyResponseEnvelopeInterceptor, LegacyDateSerializationInterceptor]
})
export class LegacyConventionsModule {}
