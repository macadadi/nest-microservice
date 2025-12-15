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
import {
  AuthService,
  LoginResponse,
  RefreshTokenResponse,
} from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from './users/model/user.model';
import { UsersService } from './users/users.service';
import { Public } from './decorators/public.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(
    @Request() req: Request & { user: Pick<UserDocument, 'email' | '_id'> },
  ): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('auth/refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refresh(refreshTokenDto.refresh_token);
  }

  @Public()
  @Post('auth/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutDto: LogoutDto): Promise<{ message: string }> {
    await this.authService.logout(
      logoutDto.refresh_token,
      logoutDto.access_token,
    );
    return { message: 'Successfully logged out' };
  }

  @Get('auth/users')
  async users() {
    return this.usersService.getUsers();
  }
}
