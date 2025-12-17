import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  AuthService,
  LoginResponse,
  RefreshTokenResponse,
} from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserEntity } from '../users/model/user.entity';
import { UsersService } from '../users/users.service';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { LoginDto } from './dto/login.dto';
import { BaseController, CurrentUser } from '@app/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super(AuthController.name);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Request() req: Request & { user: Pick<UserEntity, 'email' | 'id'> },
  ): Promise<LoginResponse> {
    this.logInfo('User login attempt', { email: req.user.email });
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    this.logInfo('Token refresh attempt');
    return this.authService.refresh(refreshTokenDto.refresh_token);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Body() logoutDto: LogoutDto): Promise<{ message: string }> {
    this.logInfo('User logout attempt');
    await this.authService.logout(
      logoutDto.refresh_token,
      logoutDto.access_token,
    );
    return { message: 'Successfully logged out' };
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (for testing)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async users() {
    this.logInfo('Fetching users via auth endpoint');
    return this.usersService.getUsers();
  }
}
