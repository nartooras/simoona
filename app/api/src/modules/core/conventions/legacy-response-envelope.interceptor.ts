import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class LegacyResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse();
    response.locals.legacyResponseEnvelope = "legacyResponseEnvelopeV1";

    return next.handle().pipe(
      map((payload) => ({
        data: payload,
        meta: {
          envelope: "legacyResponseEnvelopeV1"
        }
      }))
    );
  }
}
