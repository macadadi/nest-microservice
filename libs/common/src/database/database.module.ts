import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { createDataSourceFactory } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const entityExt = '.js';

        const entityPaths = [
          join(__dirname, '../../**/*.entity' + entityExt),
          join(__dirname, '../../../app/**/*.entity' + entityExt),
        ];
        return {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST', 'localhost'),
          port: configService.get<number>('POSTGRES_PORT', 5432),
          username: configService.getOrThrow<string>('POSTGRES_USER'),
          password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
          database: configService.getOrThrow<string>('POSTGRES_DB'),
          entities: entityPaths,
          autoLoadEntities: true,
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
          retryAttempts: configService.get<number>(
            'POSTGRES_RETRY_ATTEMPTS',
            10,
          ),
          retryDelay: configService.get<number>('POSTGRES_RETRY_DELAY', 3000),
        };
      },
      dataSourceFactory: createDataSourceFactory,
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {
  static forFeature(entities: any[]) {
    return TypeOrmModule.forFeature(entities);
  }
}
