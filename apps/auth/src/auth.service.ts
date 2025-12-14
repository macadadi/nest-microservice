import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUser(email);
    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (passwordMatches) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
    }
    return null;
  }
}
