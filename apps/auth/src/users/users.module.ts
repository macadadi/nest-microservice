import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDocument } from './model/user.model';
import { DatabaseModule } from '@app/common';
import { UserRepository } from './user.repository';
import { UserSchema } from './model/user.model';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    DatabaseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    LoggerModule,
    DatabaseModule,
  ],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
