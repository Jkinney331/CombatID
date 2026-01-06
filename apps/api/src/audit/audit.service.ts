import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export enum AuditAction {
  // CRUD operations
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  // Auth operations
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  // Access operations
  ACCESS = 'ACCESS',
  EXPORT = 'EXPORT',
  DOWNLOAD = 'DOWNLOAD',
  // Review/approval operations
  REVIEW = 'REVIEW',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  // Document operations
  SHARE = 'SHARE',
  REVOKE_SHARE = 'REVOKE_SHARE',
  VERSION = 'VERSION',
  // License operations
  SUSPEND = 'SUSPEND',
  REVOKE = 'REVOKE',
  RENEW = 'RENEW',
  // Suspension operations
  LIFT = 'LIFT',
  EXTEND = 'EXTEND',
  // Eligibility operations
  OVERRIDE = 'OVERRIDE',
  // Fighter operations
  VERIFY = 'VERIFY',
  ELIGIBILITY_UPDATE = 'ELIGIBILITY_UPDATE',
}

export interface AuditLog {
  userId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Extended audit log interface for entity-based logging
export interface EntityAuditLog {
  userId?: string;
  action: AuditAction | string;
  entityType: string;
  entityId: string;
  oldValues?: Prisma.JsonObject;
  newValues?: Prisma.JsonObject;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface AuditQueryDto {
  userId?: string;
  action?: string;
  entityType?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Log an entity-based audit event with database persistence
   */
  async log(entry: EntityAuditLog): Promise<void> {
    try {
      // Serialize dates in values for proper JSON storage
      const serializeValue = (obj: Prisma.JsonObject | undefined): Prisma.InputJsonValue | undefined => {
        if (!obj) return undefined;
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
          if (value instanceof Date) {
            result[key] = value.toISOString();
          } else if (value !== null) {
            result[key] = value;
          }
        }
        return result as Prisma.InputJsonValue;
      };

      // Persist to database
      await this.prisma.auditLog.create({
        data: {
          userId: entry.userId,
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          oldValues: serializeValue(entry.oldValues) ?? Prisma.JsonNull,
          newValues: serializeValue(entry.newValues) ?? Prisma.JsonNull,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
        },
      });

      // Also log to application logger for monitoring
      this.logger.debug({
        message: 'Audit log created',
        userId: entry.userId,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
      });
    } catch (error) {
      // Don't throw - audit logging should not break the main operation
      this.logger.error('Failed to persist audit log', error);
    }
  }

  /**
   * Search audit logs with filters and pagination
   */
  async search(query: AuditQueryDto) {
    const {
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = query;

    const where: Prisma.AuditLogWhereInput = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get audit logs for a specific entity
   */
  async getEntityHistory(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Get audit logs for a specific user
   */
  async getUserActivity(userId: string, limit = 100) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Export audit logs for compliance/reporting
   */
  async exportLogs(query: AuditQueryDto) {
    const { data } = await this.search({ ...query, limit: 10000 });
    return data;
  }

  /**
   * Get summary statistics for audit logs
   */
  async getStatistics(startDate?: Date, endDate?: Date) {
    const where: Prisma.AuditLogWhereInput = {};

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [totalLogs, actionCounts, entityTypeCounts] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      this.prisma.auditLog.groupBy({
        by: ['entityType'],
        where,
        _count: true,
      }),
    ]);

    return {
      totalLogs,
      byAction: actionCounts.reduce(
        (acc, item) => {
          acc[item.action] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      byEntityType: entityTypeCounts.reduce(
        (acc, item) => {
          acc[item.entityType] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }

  /**
   * Log user authentication events
   */
  async logAuth(
    userId: string,
    action: AuditAction.LOGIN | AuditAction.LOGOUT,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entityType: 'Authentication',
      entityId: userId,
      newValues: metadata as Prisma.JsonObject,
    });
  }

  /**
   * Log resource access
   */
  async logAccess(
    userId: string,
    resource: string,
    resourceId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.log({
      userId,
      action: AuditAction.ACCESS,
      entityType: resource,
      entityId: resourceId || 'unknown',
      newValues: metadata as Prisma.JsonObject,
    });
  }

  /**
   * Log data modifications
   */
  async logModification(
    userId: string,
    action: AuditAction.CREATE | AuditAction.UPDATE | AuditAction.DELETE,
    resource: string,
    resourceId: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entityType: resource,
      entityId: resourceId,
      newValues: metadata as Prisma.JsonObject,
    });
  }
}
