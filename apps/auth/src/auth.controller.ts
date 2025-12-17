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
import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  AuthService,
  LoginResponse,
  RefreshTokenResponse,
} from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserEntity } from './users/model/user.entity';
import { UsersService } from './users/users.service';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(
    @Request() req: Request & { user: Pick<UserEntity, 'email' | 'id'> },
  ): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refresh(refreshTokenDto.refresh_token);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutDto: LogoutDto): Promise<{ message: string }> {
    await this.authService.logout(
      logoutDto.refresh_token,
      logoutDto.access_token,
    );
    return { message: 'Successfully logged out' };
  }

  @Get('users')
  async users() {
    return this.usersService.getUsers();
  }
}
