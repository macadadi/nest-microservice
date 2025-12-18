import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { hasStack } from '../utils/error.util';

/**
 * Logging interceptor for request/response logging
 * Logs incoming requests and outgoing responses with timing information
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const body: unknown = request.body;
    const query: unknown = request.query;
    const params: unknown = request.params;
    const now = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)}`,
    );

    return next.handle().pipe(
      tap({
        next: () => {
          const responseTime = Date.now() - now;
          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${responseTime}ms`,
          );
        },
        error: (error: unknown) => {
          const responseTime = Date.now() - now;
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          const errorStack = hasStack(error) ? error.stack : undefined;
          this.logger.error(
            `Request Error: ${method} ${url} - ${responseTime}ms - ${errorMessage}`,
            errorStack,
          );
        },
      }),
    );
  }
}
