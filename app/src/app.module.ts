import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  DatabaseModule,
  LoggerModule,
  configValidationSchema,
} from '@app/common';
import { AuthModule } from './auth/auth.module';
import { ReservationsModule } from './reservations/reservations.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
    DatabaseModule,
    LoggerModule,
    AuthModule,
    ReservationsModule,
    NotificationModule,
  ],
})
export class AppModule {}
