import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

function normalizeDates(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeDates(item));
  }

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const normalized: Record<string, unknown> = {};

    for (const [key, recordValue] of Object.entries(record)) {
      normalized[key] = normalizeDates(recordValue);
    }

    return normalized;
  }

  return value;
}

@Injectable()
export class LegacyDateSerializationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse();
    response.locals.legacyDateSerialization = "legacyDateISO8601Utc";

    return next.handle().pipe(map((payload) => normalizeDates(payload)));
  }
}
