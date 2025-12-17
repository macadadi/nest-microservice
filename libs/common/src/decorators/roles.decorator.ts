import { SetMetadata } from '@nestjs/common';

/**
 * Roles metadata key
 */
export const ROLES_KEY = 'roles';

/**
 * Roles decorator to specify required roles for a route
 * Usage: @Roles('admin', 'user')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

