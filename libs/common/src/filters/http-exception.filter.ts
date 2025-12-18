import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Standard error response format
 */
export interface HttpErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp: string;
  path: string;
}

/**
 * Type guard for exception response object
 */
interface ExceptionResponseObject {
  message?: string | string[];
  error?: string;
}

function isExceptionResponseObject(
  response: string | object,
): response is ExceptionResponseObject {
  return typeof response === 'object' && response !== null;
}

/**
 * Global HTTP exception filter
 * Provides consistent error response format across the application
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse: HttpErrorResponse = {
      success: false,
      statusCode: status,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : isExceptionResponseObject(exceptionResponse)
            ? exceptionResponse.message || exception.message
            : exception.message,
      error: isExceptionResponseObject(exceptionResponse)
        ? exceptionResponse.error
        : undefined,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.error(
      `HTTP Exception: ${status} - ${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
    );

    response.status(status).json(errorResponse);
  }
}
