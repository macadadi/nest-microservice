import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/common';
import { UserRepository } from './user.repository';
import { UserEntity } from './model/user.entity';
import { LoggerModule } from '@app/common';

@Module({
  imports: [DatabaseModule.forFeature([UserEntity]), LoggerModule],
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
