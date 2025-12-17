import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

const projectRoot = process.cwd();

const envResult = config({ path: join(projectRoot, '.env') });
if (envResult.error && process.env.NODE_ENV !== 'production') {
  console.warn('Warning: Could not load .env file:', envResult.error.message);
}

export function createDataSourceOptions(): DataSourceOptions {
  const isProduction = process.env.NODE_ENV === 'production';
  const entityExt = isProduction ? '.js' : '.ts';

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
    entities: [
      join(projectRoot, 'libs/common/src/**/*.entity' + entityExt),
      join(projectRoot, 'apps/**/*.entity' + entityExt),
    ],
    migrations: [join(projectRoot, 'migrations/*' + entityExt)],
    synchronize: false,
    logging: process.env.POSTGRES_LOGGING === 'true',
  };
}

export async function createDataSourceFactory(
  options: DataSourceOptions,
): Promise<DataSource> {
  const dataSource = await new DataSource(options).initialize();
  return dataSource;
}

export const dataSourceOptions: DataSourceOptions = createDataSourceOptions();

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
