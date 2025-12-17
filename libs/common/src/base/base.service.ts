import { Logger } from '@nestjs/common';

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
  protected logError(message: string, error?: any): void {
    this.logger.error(message, error?.stack || error);
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

