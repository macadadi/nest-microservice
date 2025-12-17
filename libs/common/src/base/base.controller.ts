import { Logger } from '@nestjs/common';

/**
 * Base controller class with common functionality
 * Provides logging and common methods for all controllers
 */
export abstract class BaseController {
  protected readonly logger: Logger;

  constructor(protected readonly controllerName: string) {
    this.logger = new Logger(controllerName);
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
}

