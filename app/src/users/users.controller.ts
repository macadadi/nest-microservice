import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseController, PaginationDto, PaginatedResponse } from '@app/common';

@ApiTags('Users')
@Controller('users')
export class UsersController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super(UsersController.name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    this.logInfo('Creating user');
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: PaginatedResponse,
  })
  getUsers(@Query() pagination: PaginationDto) {
    this.logInfo('Fetching all users', { pagination });
    return this.usersService.getUsers(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  getUser(@Param('id') id: string) {
    this.logInfo('Fetching user', { userId: id });
    return this.usersService.getUser(id);
  }
}
