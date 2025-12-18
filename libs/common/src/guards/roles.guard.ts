import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

/**
 * Roles metadata key
 */
export const ROLES_KEY = 'roles';

/**
 * Authenticated user type attached to request
 */
interface AuthenticatedUser {
  id?: string;
  email?: string;
  roles?: string[];
  [key: string]: unknown;
}

/**
 * Request with authenticated user
 */
interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

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

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return false;
    }

    // If user has roles property, check them
    // Otherwise, allow access (can be customized based on your user model)
    const userRoles = user.roles;
    if (userRoles && Array.isArray(userRoles)) {
      return requiredRoles.some((role) => userRoles.includes(role));
    }

    // Default: allow if user exists (can be customized)
    return true;
  }
}
