import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './users/model/user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (user) {
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (passwordMatches) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = user;
          return userWithoutPassword;
        }
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      throw error;
    }
    return null;
  }

  async login(user: Pick<UserDocument, 'email' | '_id'>) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
