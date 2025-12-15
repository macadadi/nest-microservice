import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { AUTH_CONSTANTS } from '../constants/auth.constants';

interface RevokedToken {
  token: string;
  expiresAt: number;
}

@Injectable()
export class TokenRevocationService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TokenRevocationService.name);
  private readonly revokedTokens = new Map<string, RevokedToken>();
  private cleanupInterval?: NodeJS.Timeout;

  onModuleInit(): void {
    this.startCleanupInterval();
    this.logger.log('Token revocation service initialized');
  }

  onModuleDestroy(): void {
    this.stopCleanupInterval();
    this.logger.log('Token revocation service destroyed');
  }

  revokeToken(token: string, expiresAt?: number): void {
    const expirationTime =
      expiresAt ||
      Date.now() + AUTH_CONSTANTS.DEFAULT_REFRESH_TOKEN_EXPIRATION_MS;

    this.revokedTokens.set(token, {
      token,
      expiresAt: expirationTime,
    });

    this.logger.debug(
      `Token revoked. Expires at: ${new Date(expirationTime).toISOString()}`,
    );
  }

  isTokenRevoked(token: string): boolean {
    const revokedToken = this.revokedTokens.get(token);
    if (!revokedToken) {
      return false;
    }

    const now = Date.now();
    if (now > revokedToken.expiresAt) {
      this.revokedTokens.delete(token);
      return false;
    }

    return true;
  }

  cleanupExpiredTokens(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [token, data] of this.revokedTokens.entries()) {
      if (now > data.expiresAt) {
        this.revokedTokens.delete(token);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.logger.debug(`Cleaned up ${cleanedCount} expired revoked tokens`);
    }
  }

  clearRevokedToken(token: string): void {
    const removed = this.revokedTokens.delete(token);
    if (removed) {
      this.logger.debug('Manually cleared revoked token');
    }
  }

  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredTokens();
    }, AUTH_CONSTANTS.TOKEN_CLEANUP_INTERVAL_MS);
  }

  private stopCleanupInterval(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
  }

  getRevokedTokenCount(): number {
    return this.revokedTokens.size;
  }
}
