import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Get the project root directory
// When running migrations, process.cwd() should be the project root (sleepr/)
// This works for both ts-node and compiled JS execution
const projectRoot = process.cwd();

// Load environment variables from .env file in project root
// Explicitly specify the path to ensure .env is loaded correctly
// This must happen before createDataSourceOptions() is called
const envResult = config({ path: join(projectRoot, '.env') });
if (envResult.error && process.env.NODE_ENV !== 'production') {
  // Only warn in development, .env might not exist in production
  console.warn('Warning: Could not load .env file:', envResult.error.message);
}

/**
 * Creates TypeORM DataSourceOptions from environment variables
 * Used by TypeORM CLI for migrations
 *
 * @returns DataSourceOptions configured from environment variables
 */
export function createDataSourceOptions(): DataSourceOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const entityExt = isProduction ? '.js' : '.ts';

  // Debug: Log database configuration (remove in production)
  const databaseName = process.env.POSTGRES_DB || 'sleepr';
  if (!isProduction) {
    console.log('[DataSource] Database config:', {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || '5432',
      username: process.env.POSTGRES_USER || 'admin',
      database: databaseName,
      projectRoot,
    });
  }

  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD || 'admin',
    database: databaseName,
    // Explicit entity paths for migrations (TypeORM CLI needs these)
    // These paths should match all entity files in the monorepo
    entities: [
      join(projectRoot, 'libs/common/src/**/*.entity' + entityExt),
      join(projectRoot, 'apps/**/*.entity' + entityExt),
    ],
    // Migration files location - use absolute path from project root
    migrations: [join(projectRoot, 'migrations/*' + entityExt)],
    // Never use synchronize in production - always use migrations
    synchronize: false,
    logging: process.env.POSTGRES_LOGGING === 'true',
  };
}

/**
 * Custom DataSource Factory for NestJS TypeORM integration
 * This factory function is used by TypeOrmModule.forRootAsync() dataSourceFactory option
 * It receives the DataSourceOptions from useFactory and creates an initialized DataSource
 *
 * Following NestJS best practices for custom DataSource creation
 *
 * @param options - DataSourceOptions configured by useFactory in DatabaseModule
 * @returns Promise<DataSource> - Initialized DataSource instance
 *
 * @example
 * ```typescript
 * TypeOrmModule.forRootAsync({
 *   useFactory: (configService: ConfigService) => ({ ... }),
 *   dataSourceFactory: createDataSourceFactory,
 * })
 * ```
 */
export async function createDataSourceFactory(
  options: DataSourceOptions,
): Promise<DataSource> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const dataSource = await new DataSource(options).initialize();
  return dataSource as DataSource;
}

/**
 * TypeORM DataSource configuration for migrations CLI
 * Used by TypeORM CLI for running migrations
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const dataSourceOptions: DataSourceOptions = createDataSourceOptions();

// Create and export the DataSource instance for TypeORM CLI
// This is the default export used by TypeORM CLI migration commands
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
