import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AnalyticsSnapshot, Prisma } from '@prisma/client';

export interface DashboardMetrics {
  fighters: {
    total: number;
    active: number;
    newThisMonth: number;
    eligible: number;
    suspended: number;
    pendingVerification: number;
  };
  documents: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    expiringSoon: number;
    expired: number;
  };
  events: {
    total: number;
    upcoming: number;
    pendingApproval: number;
    approved: number;
    completed: number;
  };
  licenses: {
    total: number;
    active: number;
    expiringSoon: number;
    expired: number;
    pending: number;
  };
  suspensions: {
    total: number;
    active: number;
    medical: number;
    disciplinary: number;
  };
}

export interface TrendData {
  date: string;
  value: number;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardMetrics(commissionId?: string): Promise<DashboardMetrics> {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // Base where clauses for commission filtering
    const fighterWhere: Prisma.FighterWhereInput = commissionId ? {
      licenses: { some: { commissionId } },
    } : {};

    const documentWhere: Prisma.DocumentWhereInput = commissionId ? {
      fighter: { licenses: { some: { commissionId } } },
      isLatest: true,
    } : { isLatest: true };

    const eventWhere: Prisma.EventWhereInput = commissionId ? { commissionId } : {};
    const licenseWhere: Prisma.FighterLicenseWhereInput = commissionId ? { commissionId } : {};
    const suspensionWhere: Prisma.MedicalSuspensionWhereInput = commissionId ? { commissionId } : {};

    // Parallel queries for all metrics
    const [
      // Fighter metrics
      totalFighters,
      activeFighters,
      newFighters,
      eligibleFighters,
      suspendedFighters,
      pendingVerificationFighters,
      // Document metrics
      totalDocuments,
      pendingDocuments,
      approvedDocuments,
      rejectedDocuments,
      expiringDocuments,
      expiredDocuments,
      // Event metrics
      totalEvents,
      upcomingEvents,
      pendingEvents,
      approvedEvents,
      completedEvents,
      // License metrics
      totalLicenses,
      activeLicenses,
      expiringLicenses,
      expiredLicenses,
      pendingLicenses,
      // Suspension metrics
      totalSuspensions,
      activeSuspensions,
      medicalSuspensions,
      disciplinarySuspensions,
    ] = await Promise.all([
      // Fighter counts
      this.prisma.fighter.count({ where: fighterWhere }),
      this.prisma.fighter.count({ where: { ...fighterWhere, status: 'ACTIVE' } }),
      this.prisma.fighter.count({ where: { ...fighterWhere, createdAt: { gte: thirtyDaysAgo } } }),
      this.prisma.fighter.count({ where: { ...fighterWhere, eligibilityStatus: 'ELIGIBLE' } }),
      this.prisma.fighter.count({ where: { ...fighterWhere, eligibilityStatus: 'SUSPENDED' } }),
      this.prisma.fighter.count({ where: { ...fighterWhere, verificationStatus: 'PENDING' } }),
      // Document counts
      this.prisma.document.count({ where: documentWhere }),
      this.prisma.document.count({ where: { ...documentWhere, status: 'PENDING_REVIEW' } }),
      this.prisma.document.count({ where: { ...documentWhere, status: 'APPROVED' } }),
      this.prisma.document.count({ where: { ...documentWhere, status: 'REJECTED' } }),
      this.prisma.document.count({
        where: {
          ...documentWhere,
          status: 'APPROVED',
          expirationDate: { gte: now, lte: thirtyDaysFromNow },
        },
      }),
      this.prisma.document.count({ where: { ...documentWhere, status: 'EXPIRED' } }),
      // Event counts
      this.prisma.event.count({ where: eventWhere }),
      this.prisma.event.count({
        where: {
          ...eventWhere,
          eventDate: { gte: now },
          status: { in: ['APPROVED', 'SUBMITTED'] },
        },
      }),
      this.prisma.event.count({ where: { ...eventWhere, status: 'SUBMITTED' } }),
      this.prisma.event.count({ where: { ...eventWhere, status: 'APPROVED' } }),
      this.prisma.event.count({ where: { ...eventWhere, status: 'COMPLETED' } }),
      // License counts
      this.prisma.fighterLicense.count({ where: licenseWhere }),
      this.prisma.fighterLicense.count({ where: { ...licenseWhere, status: 'ACTIVE' } }),
      this.prisma.fighterLicense.count({
        where: {
          ...licenseWhere,
          status: 'ACTIVE',
          expiresAt: { gte: now, lte: thirtyDaysFromNow },
        },
      }),
      this.prisma.fighterLicense.count({ where: { ...licenseWhere, status: 'EXPIRED' } }),
      this.prisma.fighterLicense.count({ where: { ...licenseWhere, status: 'PENDING' } }),
      // Suspension counts
      this.prisma.medicalSuspension.count({ where: suspensionWhere }),
      this.prisma.medicalSuspension.count({ where: { ...suspensionWhere, status: 'ACTIVE' } }),
      this.prisma.medicalSuspension.count({ where: { ...suspensionWhere, type: 'MEDICAL' } }),
      this.prisma.medicalSuspension.count({ where: { ...suspensionWhere, type: 'DISCIPLINARY' } }),
    ]);

    return {
      fighters: {
        total: totalFighters,
        active: activeFighters,
        newThisMonth: newFighters,
        eligible: eligibleFighters,
        suspended: suspendedFighters,
        pendingVerification: pendingVerificationFighters,
      },
      documents: {
        total: totalDocuments,
        pending: pendingDocuments,
        approved: approvedDocuments,
        rejected: rejectedDocuments,
        expiringSoon: expiringDocuments,
        expired: expiredDocuments,
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents,
        pendingApproval: pendingEvents,
        approved: approvedEvents,
        completed: completedEvents,
      },
      licenses: {
        total: totalLicenses,
        active: activeLicenses,
        expiringSoon: expiringLicenses,
        expired: expiredLicenses,
        pending: pendingLicenses,
      },
      suspensions: {
        total: totalSuspensions,
        active: activeSuspensions,
        medical: medicalSuspensions,
        disciplinary: disciplinarySuspensions,
      },
    };
  }

  async getFighterTrends(commissionId?: string, days = 30): Promise<TrendData[]> {
    const trends: TrendData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      date.setHours(23, 59, 59, 999);

      const where: Prisma.FighterWhereInput = {
        createdAt: { lte: date },
      };

      if (commissionId) {
        where.licenses = { some: { commissionId } };
      }

      const count = await this.prisma.fighter.count({ where });

      trends.push({
        date: date.toISOString().split('T')[0] ?? '',
        value: count,
      });
    }

    return trends;
  }

  async getDocumentTrends(commissionId?: string, days = 30): Promise<{
    uploads: TrendData[];
    approvals: TrendData[];
  }> {
    const uploads: TrendData[] = [];
    const approvals: TrendData[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const dateStart = new Date();
      dateStart.setDate(now.getDate() - i);
      dateStart.setHours(0, 0, 0, 0);

      const dateEnd = new Date();
      dateEnd.setDate(now.getDate() - i);
      dateEnd.setHours(23, 59, 59, 999);

      const baseWhere: Prisma.DocumentWhereInput = commissionId ? {
        fighter: { licenses: { some: { commissionId } } },
      } : {};

      const [uploadCount, approvalCount] = await Promise.all([
        this.prisma.document.count({
          where: {
            ...baseWhere,
            createdAt: { gte: dateStart, lte: dateEnd },
          },
        }),
        this.prisma.document.count({
          where: {
            ...baseWhere,
            reviewedAt: { gte: dateStart, lte: dateEnd },
            status: 'APPROVED',
          },
        }),
      ]);

      const dateStr = dateStart.toISOString().split('T')[0] ?? '';
      uploads.push({ date: dateStr, value: uploadCount });
      approvals.push({ date: dateStr, value: approvalCount });
    }

    return { uploads, approvals };
  }

  async getEventTrends(commissionId?: string, months = 6): Promise<TrendData[]> {
    const trends: TrendData[] = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const where: Prisma.EventWhereInput = {
        eventDate: { gte: monthStart, lte: monthEnd },
      };

      if (commissionId) {
        where.commissionId = commissionId;
      }

      const count = await this.prisma.event.count({ where });

      trends.push({
        date: `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`,
        value: count,
      });
    }

    return trends;
  }

  async createSnapshot(commissionId?: string, periodType = 'daily'): Promise<AnalyticsSnapshot> {
    const metrics = await this.getDashboardMetrics(commissionId);
    const now = new Date();

    let periodStart: Date;
    let periodEnd: Date;

    switch (periodType) {
      case 'weekly':
        periodStart = new Date(now);
        periodStart.setDate(now.getDate() - now.getDay());
        periodStart.setHours(0, 0, 0, 0);
        periodEnd = new Date(periodStart);
        periodEnd.setDate(periodStart.getDate() + 6);
        periodEnd.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
        periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        periodEnd.setHours(23, 59, 59, 999);
        break;
      default: // daily
        periodStart = new Date(now);
        periodStart.setHours(0, 0, 0, 0);
        periodEnd = new Date(now);
        periodEnd.setHours(23, 59, 59, 999);
    }

    return this.prisma.analyticsSnapshot.upsert({
      where: {
        commissionId_periodType_periodStart: {
          commissionId: commissionId ?? '',
          periodType,
          periodStart,
        },
      },
      update: {
        periodEnd,
        totalFighters: metrics.fighters.total,
        activeFighters: metrics.fighters.active,
        newFighters: metrics.fighters.newThisMonth,
        eligibleFighters: metrics.fighters.eligible,
        suspendedFighters: metrics.fighters.suspended,
        totalDocuments: metrics.documents.total,
        pendingDocuments: metrics.documents.pending,
        approvedDocuments: metrics.documents.approved,
        rejectedDocuments: metrics.documents.rejected,
        expiringDocuments: metrics.documents.expiringSoon,
        totalEvents: metrics.events.total,
        pendingEvents: metrics.events.pendingApproval,
        approvedEvents: metrics.events.approved,
        completedEvents: metrics.events.completed,
        totalLicenses: metrics.licenses.total,
        activeLicenses: metrics.licenses.active,
        expiringLicenses: metrics.licenses.expiringSoon,
        additionalMetrics: {
          suspensions: metrics.suspensions,
          licensesPending: metrics.licenses.pending,
          documentsExpired: metrics.documents.expired,
        } as Prisma.JsonObject,
      },
      create: {
        commissionId: commissionId ?? null,
        periodType,
        periodStart,
        periodEnd,
        totalFighters: metrics.fighters.total,
        activeFighters: metrics.fighters.active,
        newFighters: metrics.fighters.newThisMonth,
        eligibleFighters: metrics.fighters.eligible,
        suspendedFighters: metrics.fighters.suspended,
        totalDocuments: metrics.documents.total,
        pendingDocuments: metrics.documents.pending,
        approvedDocuments: metrics.documents.approved,
        rejectedDocuments: metrics.documents.rejected,
        expiringDocuments: metrics.documents.expiringSoon,
        totalEvents: metrics.events.total,
        pendingEvents: metrics.events.pendingApproval,
        approvedEvents: metrics.events.approved,
        completedEvents: metrics.events.completed,
        totalLicenses: metrics.licenses.total,
        activeLicenses: metrics.licenses.active,
        expiringLicenses: metrics.licenses.expiringSoon,
        additionalMetrics: {
          suspensions: metrics.suspensions,
          licensesPending: metrics.licenses.pending,
          documentsExpired: metrics.documents.expired,
        } as Prisma.JsonObject,
      },
    });
  }

  async getSnapshots(
    commissionId?: string,
    periodType?: string,
    limit = 30,
  ): Promise<AnalyticsSnapshot[]> {
    const where: Prisma.AnalyticsSnapshotWhereInput = {};

    if (commissionId) {
      where.commissionId = commissionId;
    }

    if (periodType) {
      where.periodType = periodType;
    }

    return this.prisma.analyticsSnapshot.findMany({
      where,
      orderBy: { periodStart: 'desc' },
      take: limit,
    });
  }

  async getRecentActivity(commissionId?: string, limit = 10): Promise<unknown[]> {
    const where: Prisma.AuditLogWhereInput = {};

    // Filter by entities related to the commission if provided
    // This is a simplified approach - in production you'd want more sophisticated filtering
    if (commissionId) {
      where.OR = [
        { entityType: 'Event' },
        { entityType: 'EventApproval' },
        { entityType: 'FighterLicense' },
        { entityType: 'MedicalSuspension' },
      ];
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
      },
    });

    return logs.map(log => ({
      id: log.id,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      user: log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System',
      timestamp: log.createdAt,
    }));
  }

  async getTopFightersByRecord(commissionId?: string, limit = 10): Promise<unknown[]> {
    const where: Prisma.FighterWhereInput = {
      status: 'ACTIVE',
    };

    if (commissionId) {
      where.licenses = { some: { commissionId, status: 'ACTIVE' } };
    }

    const fighters = await this.prisma.fighter.findMany({
      where,
      orderBy: [
        { wins: 'desc' },
        { knockouts: 'desc' },
      ],
      take: limit,
      select: {
        id: true,
        combatId: true,
        firstName: true,
        lastName: true,
        wins: true,
        losses: true,
        draws: true,
        knockouts: true,
        submissions: true,
        weightClass: true,
      },
    });

    return fighters.map(f => ({
      ...f,
      name: `${f.firstName} ${f.lastName}`,
      record: `${f.wins}-${f.losses}-${f.draws}`,
      finishRate: f.wins > 0 ? Math.round(((f.knockouts + f.submissions) / f.wins) * 100) : 0,
    }));
  }
}
