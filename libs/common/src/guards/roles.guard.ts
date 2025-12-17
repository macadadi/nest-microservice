import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Roles guard to check if user has required roles
 * Works in conjunction with @Roles() decorator
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // If user has roles property, check them
    // Otherwise, allow access (can be customized based on your user model)
    if (user.roles && Array.isArray(user.roles)) {
      return requiredRoles.some((role) => user.roles.includes(role));
    }

    // Default: allow if user exists (can be customized)
    return true;
  }
}

