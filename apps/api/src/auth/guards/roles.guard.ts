import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

// Re-export UserRole enum from Prisma for convenience
export { UserRole } from '@prisma/client';

// Role hierarchy - higher roles include permissions of lower roles
const ROLE_HIERARCHY: Record<string, string[]> = {
  SUPER_ADMIN: ['SUPER_ADMIN', 'COMMISSION_ADMIN', 'PROMOTION_ADMIN', 'GYM_ADMIN', 'FIGHTER', 'DOCTOR', 'OFFICIAL'],
  COMMISSION_ADMIN: ['COMMISSION_ADMIN', 'OFFICIAL'],
  PROMOTION_ADMIN: ['PROMOTION_ADMIN'],
  GYM_ADMIN: ['GYM_ADMIN'],
  FIGHTER: ['FIGHTER'],
  DOCTOR: ['DOCTOR'],
  OFFICIAL: ['OFFICIAL'],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles required - allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: No role assigned');
    }

    // Get all roles the user effectively has (including hierarchy)
    const effectiveRoles = ROLE_HIERARCHY[user.role] || [user.role];

    // Check if any of the user's effective roles match the required roles
    const hasRole = requiredRoles.some((role) => effectiveRoles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Required role(s): ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}

/**
 * Organization-scoped permission guard
 * Checks if user has permission within a specific organization
 */
@Injectable()
export class OrganizationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    const organizationId = request.params.organizationId || request.body?.organizationId;

    if (!organizationId) {
      return true; // No organization context
    }

    // Super admins can access any organization
    if (user.role === 'SUPER_ADMIN') {
      return true;
    }

    // Check if user is a member of the organization
    const membership = user.organizationMemberships?.find(
      (m: { organizationId: string }) => m.organizationId === organizationId,
    );

    if (!membership) {
      throw new ForbiddenException('Access denied: Not a member of this organization');
    }

    // Add membership to request for downstream use
    request.organizationMembership = membership;

    return true;
  }
}
