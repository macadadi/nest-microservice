import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './model/user.entity';
import {
  PasswordUtil,
  BaseService,
  PaginationDto,
  PaginatedResponse,
} from '@app/common';

@Injectable()
export class UsersService extends BaseService {
  constructor(private readonly userRepository: UserRepository) {
    super(UsersService.name);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    this.logInfo('Creating new user', { email: createUserDto.email });
    const hashedPassword = await PasswordUtil.hash(createUserDto.password);
    const user = await this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    this.logInfo('User created successfully', { userId: user.id });
    return user;
  }

  async getUser(id: string): Promise<UserEntity> {
    this.logInfo('Fetching user', { userId: id });
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    this.logDebug('Fetching user by email', { email });
    return this.userRepository.findByEmail(email);
  }

  async getUsers(
    pagination: PaginationDto,
  ): Promise<PaginatedResponse<Omit<UserEntity, 'password'>>> {
    this.logInfo('Fetching all users', { pagination });
    const [users, total] = await Promise.all([
      this.userRepository.findWithoutPassword({
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.userRepository.countWithoutPassword({}),
    ]);
    return new PaginatedResponse(users, total, pagination);
  }
}
