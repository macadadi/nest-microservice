/**
 * Application configuration class
 * Provides type definitions for environment variables
 */
export class AppConfiguration {
  // PostgreSQL Database Configuration
  POSTGRES_HOST?: string = 'localhost';
  POSTGRES_PORT?: number = 5432;
  POSTGRES_USER!: string;
  POSTGRES_PASSWORD!: string;
  POSTGRES_DB!: string;
  POSTGRES_SYNCHRONIZE?: boolean = false;
  POSTGRES_LOGGING?: boolean = false;
  POSTGRES_MIGRATIONS_RUN?: boolean = false;
  POSTGRES_RETRY_ATTEMPTS?: number = 10;
  POSTGRES_RETRY_DELAY?: number = 3000;

  // JWT Configuration
  JWT_SECRET!: string;

  // Server Configuration
  PORT?: number = 3001;
}
