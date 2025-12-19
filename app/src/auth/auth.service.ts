import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/model/user.entity';
import { PasswordUtil, BaseService } from '@app/common';
import { TokenRevocationService } from './services/token-revocation.service';
import { JwtPayload } from './types/jwt-payload.interface';
import { AUTH_CONSTANTS } from './constants/auth.constants';
import { NotificationService } from '../notification/notification.service';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
}

@Injectable()
export class AuthService extends BaseService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokenRevocationService: TokenRevocationService,
    private readonly notificationService: NotificationService,
  ) {
    super(AuthService.name);
  }

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

      const passwordMatches = await PasswordUtil.compare(
        password,
        user.password,
      );
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
      this.logError(`Error validating user: ${email}`, error);
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

    this.logInfo(`User logged in successfully: ${user.email}`);

    // Send login notification asynchronously (fire-and-forget)
    // Don't block the response or fail login if notification fails
    this.sendLoginNotification(user.email).catch((error) => {
      this.logError(
        `Failed to send login notification email for user: ${user.email}`,
        error,
      );
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Sends a login notification email to the user.
   * This is called asynchronously and errors are handled gracefully.
   */
  private async sendLoginNotification(email: string): Promise<void> {
    await this.notificationService.sendNotification(
      `Welcome back, ${email}!<br><br>You have successfully logged into your Sleepr account. If this wasn't you, please contact support immediately.`,
      {
        to: email,
        subject: 'Login successful - Sleepr',
        title: 'Welcome Back!',
      },
    );
  }

  async refresh(refreshToken: string): Promise<RefreshTokenResponse> {
    if (this.tokenRevocationService.isTokenRevoked(refreshToken)) {
      this.logWarn('Attempted to use revoked refresh token');
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

      this.logInfo(`Access token refreshed for user: ${payload.email}`);

      return {
        access_token: accessToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      this.logWarn('Invalid refresh token provided');
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
      this.logDebug(
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
        this.logDebug(
          'Access token validation failed during logout (expected if expired)',
        );
      }
    }

    this.logInfo(
      `User logged out successfully. Revoked tokens: ${revokedTokens.join(', ') || 'none'}`,
    );
  }

  private extractExpirationTime(exp?: number): number | undefined {
    return exp ? exp * 1000 : undefined;
  }
}
