import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }
  async getUser(id: string) {
    return this.userRepository.findOne({ _id: id });
  }
  async getUserByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }
  async getUsers() {
    return this.userRepository.findWithoutPassword({});
  }
}
