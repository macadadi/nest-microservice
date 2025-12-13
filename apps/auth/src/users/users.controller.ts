import { Controller, Post, Get, Body, Param, Logger } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creating user');
    const password = await bcrypt.hash(createUserDto.password, 10);
    return this.usersService.createUser({ ...createUserDto, password });
  }
  
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}
