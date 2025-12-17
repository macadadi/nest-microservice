import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './model/user.entity';

/**
 * User repository providing data access operations for UserEntity
 * Extends AbstractRepository for common CRUD operations
 */
@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(UserEntity)
    userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  /**
   * Find users without password field
   * Useful for returning user data without sensitive information
   */
  async findWithoutPassword(
    filterQuery: Parameters<Repository<UserEntity>['find']>[0],
  ): Promise<Omit<UserEntity, 'password'>[]> {
    this.logger.log('Finding users without password');
    const users = await this.repository.find({
      ...filterQuery,
      select: ['id', 'email', 'createdAt', 'updatedAt'],
    });
    return users;
  }

  /**
   * Find user by email
   * Includes password for authentication purposes
   */
  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.findOneOrNull({
      where: { email },
    });
  }
}
