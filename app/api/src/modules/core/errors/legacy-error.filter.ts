import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus
} from "@nestjs/common";
import { LegacyErrorMapper } from "./legacy-error.mapper";

@Catch()
export class LegacyErrorFilter implements ExceptionFilter {
  private readonly mapper = new LegacyErrorMapper();

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    response.status(status).json(this.mapper.map(exception));
  }
}
