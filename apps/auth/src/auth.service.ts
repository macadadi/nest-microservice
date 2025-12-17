import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './users/model/user.entity';
import { compareUserPassword } from './users/password.helper';
import { TokenRevocationService } from './services/token-revocation.service';
import { JwtPayload } from './types/jwt-payload.interface';
import { AUTH_CONSTANTS } from './constants/auth.constants';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenRevocationService: TokenRevocationService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<
    UserEntity,
    'id' | 'email' | 'createdAt' | 'updatedAt'
  > | null> {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (!user) {
        return null;
      }

      const passwordMatches = await compareUserPassword(user, password);
      if (!passwordMatches) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return null;
      }
      this.logger.error(`Error validating user: ${email}`, error);
      throw error;
    }
  }

  async login(user: Pick<UserEntity, 'email' | 'id'>): Promise<LoginResponse> {
    const payload = { email: user.email, sub: user.id };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
      }),
    ]);

    this.logger.log(`User logged in successfully: ${user.email}`);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
    if (this.tokenRevocationService.isTokenRevoked(refreshToken)) {
      this.logger.warn('Attempted to use revoked refresh token');
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);

      const newPayload = {
        email: payload.email,
        sub: payload.sub,
      };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
      });

      this.logger.log(`Access token refreshed for user: ${payload.email}`);

      return {
        access_token: accessToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logger.warn('Invalid refresh token provided');
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(refreshToken: string, accessToken?: string): Promise<void> {
    const revokedTokens: string[] = [];
    try {
      const refreshPayload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);
      const refreshExpiresAt = this.extractExpirationTime(refreshPayload.exp);
      this.tokenRevocationService.revokeToken(refreshToken, refreshExpiresAt);
      revokedTokens.push('refresh_token');
    } catch {
      this.logger.debug(
        'Refresh token validation failed during logout (expected if expired)',
      );
    }

    if (accessToken) {
      try {
        const accessPayload =
          await this.jwtService.verifyAsync<JwtPayload>(accessToken);
        const accessExpiresAt = this.extractExpirationTime(accessPayload.exp);
        this.tokenRevocationService.revokeToken(accessToken, accessExpiresAt);
        revokedTokens.push('access_token');
      } catch {
        this.logger.debug(
          'Access token validation failed during logout (expected if expired)',
        );
      }
    }

    this.logger.log(
      `User logged out successfully. Revoked tokens: ${revokedTokens.join(', ') || 'none'}`,
    );
  }

  private extractExpirationTime(exp?: number): number | undefined {
    return exp ? exp * 1000 : undefined;
  }
}
