import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { TokenRevocationService } from '../services/token-revocation.service';
import { Request } from 'express';
import { JwtPayload, JwtPayloadWithUser } from '../types/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  private readonly extractJwt = ExtractJwt.fromAuthHeaderAsBearerToken();

  constructor(
    private readonly tokenRevocationService: TokenRevocationService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: JwtPayload): JwtPayloadWithUser {
    const token = this.extractJwt(request);

    if (!token) {
      this.logger.warn('JWT token not found in request');
      throw new UnauthorizedException('Authentication token not provided');
    }

    if (this.tokenRevocationService.isTokenRevoked(token)) {
      this.logger.warn(`Revoked token attempted for user: ${payload.email}`);
      throw new UnauthorizedException('Token has been revoked');
    }

    return {
      id: payload.sub,
      email: payload.email,
      sub: payload.sub,
      exp: payload.exp,
      iat: payload.iat,
    };
  }
}
