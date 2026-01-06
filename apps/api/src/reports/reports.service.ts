import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  Report,
  ReportType,
  ReportStatus,
  ReportFormat,
  Prisma,
} from '@prisma/client';

export interface CreateReportDto {
  type: ReportType;
  name: string;
  description?: string;
  format?: ReportFormat;
  commissionId?: string;
  parameters?: Record<string, unknown>;
  isScheduled?: boolean;
  scheduleConfig?: Record<string, unknown>;
}

export interface ReportQueryDto {
  type?: ReportType;
  status?: ReportStatus;
  commissionId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateReportDto, requesterId: string): Promise<Report> {
    const report = await this.prisma.report.create({
      data: {
        requestedById: requesterId,
        commissionId: dto.commissionId,
        type: dto.type,
        name: dto.name,
        description: dto.description,
        format: dto.format ?? ReportFormat.PDF,
        parameters: dto.parameters as Prisma.JsonObject,
        isScheduled: dto.isScheduled ?? false,
        scheduleConfig: dto.scheduleConfig as Prisma.JsonObject,
        status: ReportStatus.PENDING,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CREATE',
      entityType: 'Report',
      entityId: report.id,
      newValues: {
        type: dto.type,
        name: dto.name,
      } as Prisma.JsonObject,
    });

    return report;
  }

  async findById(id: string): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    return report;
  }

  async findAll(query: ReportQueryDto): Promise<{ reports: Report[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = {};

    if (query.type) {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.commissionId) {
      where.commissionId = query.commissionId;
    }

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.report.count({ where }),
    ]);

    return { reports, total, page, limit };
  }

  async findByUser(userId: string, status?: ReportStatus): Promise<Report[]> {
    const where: Prisma.ReportWhereInput = { requestedById: userId };
    if (status) {
      where.status = status;
    }

    return this.prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async generate(id: string): Promise<Report> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    if (report.status === ReportStatus.GENERATING) {
      throw new BadRequestException('Report is already being generated');
    }

    // Update status to generating
    await this.prisma.report.update({
      where: { id },
      data: {
        status: ReportStatus.GENERATING,
        startedAt: new Date(),
      },
    });

    try {
      // Generate report based on type
      const reportData = await this.generateReportData(report);

      // TODO: Convert to actual file format (PDF, CSV, Excel)
      // For now, we'll store the data as JSON
      const fileKey = `reports/${report.id}.json`;
      const fileContent = JSON.stringify(reportData, null, 2);
      const fileSize = Buffer.byteLength(fileContent, 'utf8');

      // TODO: Upload to S3
      // await this.s3.upload(fileKey, fileContent);

      return this.prisma.report.update({
        where: { id },
        data: {
          status: ReportStatus.COMPLETED,
          fileKey,
          fileSize,
          completedAt: new Date(),
          lastRunAt: new Date(),
        },
      });
    } catch (error) {
      return this.prisma.report.update({
        where: { id },
        data: {
          status: ReportStatus.FAILED,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          completedAt: new Date(),
        },
      });
    }
  }

  private async generateReportData(report: Report): Promise<unknown> {
    const params = report.parameters as Record<string, unknown> | null;

    switch (report.type) {
      case ReportType.FIGHTER_COMPLIANCE:
        return this.generateFighterComplianceReport(report.commissionId, params);
      case ReportType.EVENT_SUMMARY:
        return this.generateEventSummaryReport(report.commissionId, params);
      case ReportType.SUSPENSION_REPORT:
        return this.generateSuspensionReport(report.commissionId, params);
      case ReportType.LICENSE_EXPIRATION:
        return this.generateLicenseExpirationReport(report.commissionId, params);
      case ReportType.DOCUMENT_AUDIT:
        return this.generateDocumentAuditReport(report.commissionId, params);
      case ReportType.COMMISSION_ACTIVITY:
        return this.generateCommissionActivityReport(report.commissionId, params);
      case ReportType.FINANCIAL_SUMMARY:
        return this.generateFinancialSummaryReport(report.commissionId, params);
      default:
        throw new BadRequestException(`Unsupported report type: ${report.type}`);
    }
  }

  private async generateFighterComplianceReport(
    commissionId: string | null,
    params: Record<string, unknown> | null,
  ): Promise<unknown> {
    const fighters = await this.prisma.fighter.findMany({
      where: commissionId ? {
        licenses: {
          some: { commissionId },
        },
      } : undefined,
      include: {
        documents: {
          where: { isLatest: true },
          select: { type: true, status: true, expirationDate: true },
        },
        licenses: commissionId ? {
          where: { commissionId },
          select: { type: true, status: true, expiresAt: true },
        } : {
          select: { type: true, status: true, expiresAt: true },
        },
        suspensions: {
          where: { status: 'ACTIVE' },
          select: { type: true, reason: true, endDate: true },
        },
      },
    });

    return {
      generatedAt: new Date().toISOString(),
      commissionId,
      parameters: params,
      summary: {
        totalFighters: fighters.length,
        eligible: fighters.filter(f => f.eligibilityStatus === 'ELIGIBLE').length,
        incomplete: fighters.filter(f => f.eligibilityStatus === 'INCOMPLETE').length,
        suspended: fighters.filter(f => f.eligibilityStatus === 'SUSPENDED').length,
      },
      fighters: fighters.map(f => ({
        combatId: f.combatId,
        name: `${f.firstName} ${f.lastName}`,
        eligibilityStatus: f.eligibilityStatus,
        verificationStatus: f.verificationStatus,
        documentCount: f.documents.length,
        activeLicenses: f.licenses.filter(l => l.status === 'ACTIVE').length,
        activeSuspensions: f.suspensions.length,
      })),
    };
  }

  private async generateEventSummaryReport(
    commissionId: string | null,
    params: Record<string, unknown> | null,
  ): Promise<unknown> {
    const dateRange = params?.dateRange as { start?: string; end?: string } | undefined;

    const where: Prisma.EventWhereInput = {};
    if (commissionId) {
      where.commissionId = commissionId;
    }
    if (dateRange?.start || dateRange?.end) {
      where.eventDate = {};
      if (dateRange.start) where.eventDate.gte = new Date(dateRange.start);
      if (dateRange.end) where.eventDate.lte = new Date(dateRange.end);
    }

    const events = await this.prisma.event.findMany({
      where,
      include: {
        bouts: {
          select: { status: true, result: true },
        },
      },
      orderBy: { eventDate: 'desc' },
    });

    return {
      generatedAt: new Date().toISOString(),
      commissionId,
      parameters: params,
      summary: {
        totalEvents: events.length,
        completed: events.filter(e => e.status === 'COMPLETED').length,
        approved: events.filter(e => e.status === 'APPROVED').length,
        pending: events.filter(e => e.status === 'SUBMITTED').length,
        cancelled: events.filter(e => e.status === 'CANCELLED').length,
        totalBouts: events.reduce((sum, e) => sum + e.bouts.length, 0),
      },
      events: events.map(e => ({
        id: e.id,
        name: e.name,
        date: e.eventDate,
        status: e.status,
        venue: e.venue,
        city: e.city,
        state: e.state,
        boutCount: e.bouts.length,
        completedBouts: e.bouts.filter(b => b.status === 'COMPLETED').length,
      })),
    };
  }

  private async generateSuspensionReport(
    commissionId: string | null,
    params: Record<string, unknown> | null,
  ): Promise<unknown> {
    const where: Prisma.MedicalSuspensionWhereInput = {};
    if (commissionId) {
      where.commissionId = commissionId;
    }

    const suspensions = await this.prisma.medicalSuspension.findMany({
      where,
      include: {
        fighter: {
          select: { combatId: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      generatedAt: new Date().toISOString(),
      commissionId,
      parameters: params,
      summary: {
        totalSuspensions: suspensions.length,
        active: suspensions.filter(s => s.status === 'ACTIVE').length,
        lifted: suspensions.filter(s => s.status === 'LIFTED').length,
        expired: suspensions.filter(s => s.status === 'EXPIRED').length,
        medical: suspensions.filter(s => s.type === 'MEDICAL').length,
        disciplinary: suspensions.filter(s => s.type === 'DISCIPLINARY').length,
      },
      suspensions: suspensions.map(s => ({
        id: s.id,
        fighterName: `${s.fighter.firstName} ${s.fighter.lastName}`,
        combatId: s.fighter.combatId,
        type: s.type,
        reason: s.reason,
        status: s.status,
        startDate: s.startDate,
        endDate: s.endDate,
        isNational: s.isNational,
      })),
    };
  }

  private async generateLicenseExpirationReport(
    commissionId: string | null,
    params: Record<string, unknown> | null,
  ): Promise<unknown> {
    const daysThreshold = (params?.daysThreshold as number) ?? 30;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    const where: Prisma.FighterLicenseWhereInput = {
      status: 'ACTIVE',
      expiresAt: {
        lte: thresholdDate,
        gte: new Date(),
      },
    };
    if (commissionId) {
      where.commissionId = commissionId;
    }

    const licenses = await this.prisma.fighterLicense.findMany({
      where,
      include: {
        fighter: {
          select: { combatId: true, firstName: true, lastName: true },
        },
      },
      orderBy: { expiresAt: 'asc' },
    });

    return {
      generatedAt: new Date().toISOString(),
      commissionId,
      parameters: { daysThreshold },
      summary: {
        totalExpiring: licenses.length,
        byType: {
          professional: licenses.filter(l => l.type === 'PROFESSIONAL').length,
          amateur: licenses.filter(l => l.type === 'AMATEUR').length,
        },
      },
      licenses: licenses.map(l => ({
        id: l.id,
        licenseNumber: l.licenseNumber,
        fighterName: `${l.fighter.firstName} ${l.fighter.lastName}`,
        combatId: l.fighter.combatId,
        type: l.type,
        expiresAt: l.expiresAt,
        daysUntilExpiration: l.expiresAt
          ? Math.ceil((l.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null,
      })),
    };
  }

  private async generateDocumentAuditReport(
    commissionId: string | null,
    params: Record<string, unknown> | null,
  ): Promise<unknown> {
    const dateRange = params?.dateRange as { start?: string; end?: string } | undefined;

    const where: Prisma.DocumentWhereInput = {
      isLatest: true,
    };
    if (dateRange?.start || dateRange?.end) {
      where.createdAt = {};
      if (dateRange.start) where.createdAt.gte = new Date(dateRange.start);
      if (dateRange.end) where.createdAt.lte = new Date(dateRange.end);
    }

    const documents = await this.prisma.document.findMany({
      where,
      include: {
        fighter: {
          select: { combatId: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const byStatus = {
      pending: documents.filter(d => d.status === 'PENDING_REVIEW').length,
      approved: documents.filter(d => d.status === 'APPROVED').length,
      rejected: documents.filter(d => d.status === 'REJECTED').length,
      expired: documents.filter(d => d.status === 'EXPIRED').length,
    };

    const byType = documents.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      generatedAt: new Date().toISOString(),
      commissionId,
      parameters: params,
      summary: {
        totalDocuments: documents.length,
        byStatus,
        byType,
        aiProcessed: documents.filter(d => d.aiProcessed).length,
      },
      documents: documents.slice(0, 100).map(d => ({
        id: d.id,
        type: d.type,
        status: d.status,
        fighterName: `${d.fighter.firstName} ${d.fighter.lastName}`,
        combatId: d.fighter.combatId,
        uploadedAt: d.createdAt,
        expirationDate: d.expirationDate,
        aiProcessed: d.aiProcessed,
        aiConfidence: d.aiConfidence,
      })),
    };
  }

  private async generateCommissionActivityReport(
    commissionId: string | null,
    params: Record<string, unknown> | null,
  ): Promise<unknown> {
    const dateRange = params?.dateRange as { start?: string; end?: string } | undefined;

    const where: Prisma.AuditLogWhereInput = {};
    if (dateRange?.start || dateRange?.end) {
      where.createdAt = {};
      if (dateRange.start) where.createdAt.gte = new Date(dateRange.start);
      if (dateRange.end) where.createdAt.lte = new Date(dateRange.end);
    }

    const logs = await this.prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    const byAction = logs.reduce((acc, l) => {
      acc[l.action] = (acc[l.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byEntityType = logs.reduce((acc, l) => {
      acc[l.entityType] = (acc[l.entityType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      generatedAt: new Date().toISOString(),
      commissionId,
      parameters: params,
      summary: {
        totalActions: logs.length,
        byAction,
        byEntityType,
      },
      recentActivity: logs.slice(0, 100).map(l => ({
        id: l.id,
        action: l.action,
        entityType: l.entityType,
        entityId: l.entityId,
        userId: l.userId,
        timestamp: l.createdAt,
      })),
    };
  }

  private async generateFinancialSummaryReport(
    commissionId: string | null,
    params: Record<string, unknown> | null,
  ): Promise<unknown> {
    const dateRange = params?.dateRange as { start?: string; end?: string } | undefined;

    // Build date filter
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (dateRange?.start) dateFilter.gte = new Date(dateRange.start);
    if (dateRange?.end) dateFilter.lte = new Date(dateRange.end);

    // Get license data for revenue calculations
    const licenseWhere: Prisma.FighterLicenseWhereInput = {};
    if (commissionId) licenseWhere.commissionId = commissionId;
    if (Object.keys(dateFilter).length > 0) licenseWhere.issuedAt = dateFilter;

    const licenses = await this.prisma.fighterLicense.findMany({
      where: licenseWhere,
      select: {
        type: true,
        status: true,
        issuedAt: true,
      },
    });

    // Get event data
    const eventWhere: Prisma.EventWhereInput = {};
    if (commissionId) eventWhere.commissionId = commissionId;
    if (Object.keys(dateFilter).length > 0) eventWhere.eventDate = dateFilter;

    const events = await this.prisma.event.findMany({
      where: eventWhere,
      include: {
        bouts: {
          select: { id: true, status: true },
        },
      },
    });

    // Calculate license fee estimates (configurable rates)
    const licenseRates = {
      PROFESSIONAL: 150,
      AMATEUR: 50,
      TRAINER: 75,
      CORNERMAN: 50,
      REFEREE: 100,
      JUDGE: 100,
    };

    const licenseRevenue = licenses.reduce((total, license) => {
      const rate = licenseRates[license.type as keyof typeof licenseRates] || 0;
      return total + rate;
    }, 0);

    // Calculate event fee estimates
    const eventFeePerBout = 25;
    const eventRevenue = events.reduce((total, event) => {
      return total + (event.bouts.length * eventFeePerBout);
    }, 0);

    // Group licenses by month
    const licensesByMonth = licenses.reduce((acc, license) => {
      if (license.issuedAt) {
        const monthKey = license.issuedAt.toISOString().slice(0, 7);
        acc[monthKey] = (acc[monthKey] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Group events by month
    const eventsByMonth = events.reduce((acc, event) => {
      if (event.eventDate) {
        const monthKey = event.eventDate.toISOString().slice(0, 7);
        acc[monthKey] = (acc[monthKey] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      generatedAt: new Date().toISOString(),
      commissionId,
      parameters: params,
      summary: {
        totalLicenses: licenses.length,
        totalEvents: events.length,
        totalBouts: events.reduce((sum, e) => sum + e.bouts.length, 0),
        estimatedLicenseRevenue: licenseRevenue,
        estimatedEventRevenue: eventRevenue,
        estimatedTotalRevenue: licenseRevenue + eventRevenue,
      },
      licenseBreakdown: {
        byType: Object.entries(licenseRates).map(([type, rate]) => ({
          type,
          count: licenses.filter(l => l.type === type).length,
          rate,
          revenue: licenses.filter(l => l.type === type).length * rate,
        })),
        byMonth: Object.entries(licensesByMonth).map(([month, count]) => ({
          month,
          count,
        })).sort((a, b) => a.month.localeCompare(b.month)),
      },
      eventBreakdown: {
        totalEvents: events.length,
        completedEvents: events.filter(e => e.status === 'COMPLETED').length,
        byMonth: Object.entries(eventsByMonth).map(([month, count]) => ({
          month,
          count,
        })).sort((a, b) => a.month.localeCompare(b.month)),
      },
      notes: [
        'Revenue figures are estimates based on standard fee schedules',
        'Actual revenue may vary based on discounts, waivers, and special circumstances',
        'This report does not include penalties, fines, or other miscellaneous revenue',
      ],
    };
  }

  async delete(id: string, requesterId: string): Promise<void> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }

    await this.prisma.report.delete({ where: { id } });

    await this.auditService.log({
      userId: requesterId,
      action: 'DELETE',
      entityType: 'Report',
      entityId: id,
    });
  }

  // Get scheduled reports that need to run
  async getScheduledReportsToRun(): Promise<Report[]> {
    const now = new Date();
    return this.prisma.report.findMany({
      where: {
        isScheduled: true,
        nextRunAt: { lte: now },
      },
    });
  }

  // Update next run time after scheduled report completes
  async updateNextRunTime(id: string): Promise<void> {
    const report = await this.prisma.report.findUnique({
      where: { id },
    });

    if (!report || !report.isScheduled || !report.scheduleConfig) {
      return;
    }

    const config = report.scheduleConfig as { intervalDays?: number };
    const intervalDays = config.intervalDays ?? 7;

    const nextRunAt = new Date();
    nextRunAt.setDate(nextRunAt.getDate() + intervalDays);

    await this.prisma.report.update({
      where: { id },
      data: { nextRunAt },
    });
  }
}
