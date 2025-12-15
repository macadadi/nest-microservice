import { Controller, Post, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from './users/model/user.model';
import { UsersService } from './users/users.service';
import { Public } from './decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(
    @Request() req: Request & { user: Pick<UserDocument, 'email' | '_id'> },
  ) {
    return this.authService.login(req.user);
  }

  @Get('auth/users')
  users() {
    return this.usersService.getUsers();
  }
}
