import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./modules/app.module";
import { LegacyErrorFilter } from "./modules/core/errors/legacy-error.filter";
import { LegacyResponseEnvelopeInterceptor } from "./modules/core/conventions/legacy-response-envelope.interceptor";
import { LegacyDateSerializationInterceptor } from "./modules/core/conventions/legacy-date-serialization.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );
  app.useGlobalInterceptors(
    new LegacyDateSerializationInterceptor(),
    new LegacyResponseEnvelopeInterceptor()
  );
  app.useGlobalFilters(new LegacyErrorFilter());

  await app.listen(3000);
}

void bootstrap();
