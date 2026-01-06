import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  MedicalSuspension,
  SuspensionType,
  SuspensionStatus,
  Prisma,
} from '@prisma/client';

export interface CreateSuspensionDto {
  fighterId: string;
  commissionId: string;
  type?: SuspensionType;
  reason: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  minimumDays?: number;
  requiresClearance?: boolean;
  clearanceType?: string;
  isNational?: boolean;
}

export interface SuspensionQueryDto {
  fighterId?: string;
  commissionId?: string;
  status?: SuspensionStatus;
  type?: SuspensionType;
  isNational?: boolean;
  page?: number;
  limit?: number;
}

export interface SuspensionWithRelations extends MedicalSuspension {
  fighter?: { id: string; combatId: string; firstName: string; lastName: string };
  commission?: { id: string; name: string };
  liftedBy?: { id: string; firstName: string | null; lastName: string | null } | null;
}

@Injectable()
export class SuspensionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateSuspensionDto, requesterId: string): Promise<MedicalSuspension> {
    // Validate fighter exists
    const fighter = await this.prisma.fighter.findUnique({
      where: { id: dto.fighterId },
    });

    if (!fighter) {
      throw new NotFoundException(`Fighter with ID ${dto.fighterId} not found`);
    }

    const suspension = await this.prisma.medicalSuspension.create({
      data: {
        fighterId: dto.fighterId,
        commissionId: dto.commissionId,
        type: dto.type ?? SuspensionType.MEDICAL,
        reason: dto.reason,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
        minimumDays: dto.minimumDays,
        requiresClearance: dto.requiresClearance ?? false,
        clearanceType: dto.clearanceType,
        isNational: dto.isNational ?? false,
        status: SuspensionStatus.ACTIVE,
      },
    });

    // Update fighter eligibility status
    await this.prisma.fighter.update({
      where: { id: dto.fighterId },
      data: { eligibilityStatus: 'SUSPENDED' },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CREATE',
      entityType: 'MedicalSuspension',
      entityId: suspension.id,
      newValues: {
        fighterId: dto.fighterId,
        reason: dto.reason,
        type: suspension.type,
      } as Prisma.JsonObject,
    });

    return suspension;
  }

  async findById(id: string): Promise<SuspensionWithRelations> {
    const suspension = await this.prisma.medicalSuspension.findUnique({
      where: { id },
      include: {
        fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
        commission: { select: { id: true, name: true } },
        liftedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!suspension) {
      throw new NotFoundException(`Suspension with ID ${id} not found`);
    }

    return suspension;
  }

  async findByFighterId(fighterId: string, activeOnly = false): Promise<SuspensionWithRelations[]> {
    const where: Prisma.MedicalSuspensionWhereInput = { fighterId };

    if (activeOnly) {
      where.status = SuspensionStatus.ACTIVE;
    }

    return this.prisma.medicalSuspension.findMany({
      where,
      include: {
        commission: { select: { id: true, name: true } },
        liftedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(query: SuspensionQueryDto): Promise<{ suspensions: SuspensionWithRelations[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.MedicalSuspensionWhereInput = {};

    if (query.fighterId) {
      where.fighterId = query.fighterId;
    }

    if (query.commissionId) {
      where.commissionId = query.commissionId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.isNational !== undefined) {
      where.isNational = query.isNational;
    }

    const [suspensions, total] = await Promise.all([
      this.prisma.medicalSuspension.findMany({
        where,
        include: {
          fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
          commission: { select: { id: true, name: true } },
          liftedBy: { select: { id: true, firstName: true, lastName: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.medicalSuspension.count({ where }),
    ]);

    return { suspensions, total, page, limit };
  }

  async lift(
    id: string,
    liftedById: string,
    notes?: string,
  ): Promise<MedicalSuspension> {
    const suspension = await this.prisma.medicalSuspension.findUnique({
      where: { id },
    });

    if (!suspension) {
      throw new NotFoundException(`Suspension with ID ${id} not found`);
    }

    if (suspension.status !== SuspensionStatus.ACTIVE) {
      throw new BadRequestException('Suspension is not active');
    }

    // Check if minimum days have passed
    if (suspension.minimumDays) {
      const daysSinceStart = Math.floor(
        (Date.now() - suspension.startDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysSinceStart < suspension.minimumDays) {
        throw new BadRequestException(
          `Minimum suspension period of ${suspension.minimumDays} days has not elapsed (${daysSinceStart} days)`,
        );
      }
    }

    const updated = await this.prisma.medicalSuspension.update({
      where: { id },
      data: {
        status: SuspensionStatus.LIFTED,
        liftedAt: new Date(),
        liftedById,
        liftNotes: notes,
      },
    });

    // Check if fighter has any other active suspensions
    const activeSuspensions = await this.prisma.medicalSuspension.count({
      where: {
        fighterId: suspension.fighterId,
        status: SuspensionStatus.ACTIVE,
      },
    });

    // If no more active suspensions, update fighter status
    if (activeSuspensions === 0) {
      await this.prisma.fighter.update({
        where: { id: suspension.fighterId },
        data: { eligibilityStatus: 'INCOMPLETE' }, // Will be recalculated on next check
      });
    }

    await this.auditService.log({
      userId: liftedById,
      action: 'LIFT',
      entityType: 'MedicalSuspension',
      entityId: id,
      oldValues: { status: SuspensionStatus.ACTIVE } as Prisma.JsonObject,
      newValues: { status: SuspensionStatus.LIFTED, notes } as Prisma.JsonObject,
    });

    return updated;
  }

  async extend(
    id: string,
    newEndDate: Date,
    reason: string,
    requesterId: string,
  ): Promise<MedicalSuspension> {
    const suspension = await this.prisma.medicalSuspension.findUnique({
      where: { id },
    });

    if (!suspension) {
      throw new NotFoundException(`Suspension with ID ${id} not found`);
    }

    if (suspension.status !== SuspensionStatus.ACTIVE) {
      throw new BadRequestException('Suspension is not active');
    }

    const updated = await this.prisma.medicalSuspension.update({
      where: { id },
      data: {
        endDate: newEndDate,
        description: suspension.description
          ? `${suspension.description}\n\nExtended: ${reason}`
          : `Extended: ${reason}`,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'EXTEND',
      entityType: 'MedicalSuspension',
      entityId: id,
      oldValues: { endDate: suspension.endDate?.toISOString() ?? null } as Prisma.JsonObject,
      newValues: { endDate: newEndDate.toISOString(), reason } as Prisma.JsonObject,
    });

    return updated;
  }

  async checkExpired(): Promise<number> {
    const now = new Date();

    const result = await this.prisma.medicalSuspension.updateMany({
      where: {
        status: SuspensionStatus.ACTIVE,
        endDate: { lt: now },
        requiresClearance: false, // Only auto-expire if no clearance required
      },
      data: { status: SuspensionStatus.EXPIRED },
    });

    return result.count;
  }

  async getNationalSuspensions(): Promise<SuspensionWithRelations[]> {
    return this.prisma.medicalSuspension.findMany({
      where: {
        isNational: true,
        status: SuspensionStatus.ACTIVE,
      },
      include: {
        fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
        commission: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async checkFighterSuspension(
    fighterId: string,
    commissionId?: string,
  ): Promise<{ suspended: boolean; suspensions: MedicalSuspension[] }> {
    const where: Prisma.MedicalSuspensionWhereInput = {
      fighterId,
      status: SuspensionStatus.ACTIVE,
    };

    // Check both commission-specific and national suspensions
    if (commissionId) {
      where.OR = [{ commissionId }, { isNational: true }];
    }

    const suspensions = await this.prisma.medicalSuspension.findMany({
      where,
    });

    return {
      suspended: suspensions.length > 0,
      suspensions,
    };
  }
}
