import { Logger } from '@nestjs/common';
import { hasStack } from '../utils/error.util';

/**
 * Base service class with common functionality
 * Provides logging and common methods for all services
 */
export abstract class BaseService {
  protected readonly logger: Logger;

  constructor(protected readonly serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  /**
   * Log an info message
   */
  protected logInfo(message: string, context?: any): void {
    this.logger.log(message, context ? JSON.stringify(context) : '');
  }

  /**
   * Log an error message
   */
  protected logError(message: string, error?: unknown): void {
    const errorMessage = hasStack(error) ? error.stack : error;
    this.logger.error(message, errorMessage);
  }

  /**
   * Log a warning message
   */
  protected logWarn(message: string, context?: any): void {
    this.logger.warn(message, context ? JSON.stringify(context) : '');
  }

  /**
   * Log a debug message
   */
  protected logDebug(message: string, context?: any): void {
    this.logger.debug(message, context ? JSON.stringify(context) : '');
  }
}
