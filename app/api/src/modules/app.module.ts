import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { CoreCompatibilityModule } from "./core/core-compatibility.module";
import { TenantContextMiddleware } from "./core/tenant/tenant-context.middleware";
import { LegacyPaginationMiddleware } from "./core/conventions/legacy-pagination.middleware";

@Module({
  imports: [CoreCompatibilityModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantContextMiddleware, LegacyPaginationMiddleware).forRoutes("*");
  }
}
