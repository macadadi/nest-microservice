import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { createDataSourceFactory } from './data-source';

/**
 * Database module providing TypeORM configuration for PostgreSQL.
 * Supports automatic entity discovery and dynamic feature registration.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const isProduction = process.env.NODE_ENV === 'production';
        const entityExt = '.js';

        // Automatic entity discovery paths
        // Entities matching these patterns will be automatically discovered and loaded
        const entityPaths = [
          // Entities in common library
          join(__dirname, '../../**/*.entity' + entityExt),
          // Entities in all apps (auth, reservations, etc.)
          join(__dirname, '../../../apps/**/*.entity' + entityExt),
        ];
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST', 'localhost'),
          port: configService.get<number>('POSTGRES_PORT', 5432),
          username: configService.getOrThrow<string>('POSTGRES_USER'),
          password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
          database: configService.getOrThrow<string>('POSTGRES_DB'),
          // Automatic entity discovery from file paths
          // All entities matching these glob patterns will be automatically discovered and loaded
          // No need to manually register entities in the root module
          entities: entityPaths,
          // Use autoLoadEntities to automatically load entities registered via forFeature()
          // This works alongside the entities array above:
          // - entities array: automatically discovers entities from file paths
          // - autoLoadEntities: automatically loads entities registered via forFeature() in feature modules
          // Both work together - entities are discovered AND can be registered for repository injection
          autoLoadEntities: true,
          // Never use synchronize in production - use migrations instead
          synchronize: configService.get<boolean>(
            'POSTGRES_SYNCHRONIZE',
            false,
          ),
          logging: configService.get<boolean>('POSTGRES_LOGGING', false),
          migrations: [join(__dirname, '../../../../migrations/*' + entityExt)],
          migrationsRun: configService.get<boolean>(
            'POSTGRES_MIGRATIONS_RUN',
            false,
          ),
          // Connection retry configuration
          retryAttempts: configService.get<number>(
            'POSTGRES_RETRY_ATTEMPTS',
            10,
          ),
          retryDelay: configService.get<number>('POSTGRES_RETRY_DELAY', 3000),
        };
      },
      // Use custom dataSourceFactory following NestJS best practices
      // This factory receives the DataSourceOptions from useFactory above
      // and creates an initialized DataSource instance
      // The factory is exported from data-source.ts for reuse and consistency
      dataSourceFactory: createDataSourceFactory,
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  /**
   * Register TypeORM entities for a feature module
   * Uses @nestjs/typeorm's TypeOrmModule.forFeature()
   * Entities registered here will be automatically loaded via autoLoadEntities
   *
   * @param entities Array of entity classes or schemas
   * @returns TypeOrmModule configured for the specified entities
   *
   * @example
   * ```typescript
   * @Module({
   *   imports: [DatabaseModule.forFeature([UserEntity])],
   * })
   * export class UsersModule {}
   * ```
   */
  static forFeature(entities: any[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
