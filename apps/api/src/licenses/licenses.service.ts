import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  FighterLicense,
  LicenseType,
  LicenseStatus,
  Discipline,
  Prisma,
} from '@prisma/client';

export interface CreateLicenseDto {
  fighterId: string;
  commissionId: string;
  type: LicenseType;
  licenseNumber: string;
  disciplines: Discipline[];
  issuedAt?: Date;
  expiresAt?: Date;
}

export interface LicenseQueryDto {
  fighterId?: string;
  commissionId?: string;
  type?: LicenseType;
  status?: LicenseStatus;
  page?: number;
  limit?: number;
}

export interface LicenseWithRelations extends FighterLicense {
  fighter?: { id: string; combatId: string; firstName: string; lastName: string };
  commission?: { id: string; name: string };
}

@Injectable()
export class LicensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateLicenseDto, requesterId: string): Promise<FighterLicense> {
    // Check if license already exists for this fighter/commission/type
    const existing = await this.prisma.fighterLicense.findFirst({
      where: {
        fighterId: dto.fighterId,
        commissionId: dto.commissionId,
        type: dto.type,
      },
    });

    if (existing) {
      throw new ConflictException(
        `License of type ${dto.type} already exists for this fighter in this commission`,
      );
    }

    const license = await this.prisma.fighterLicense.create({
      data: {
        fighterId: dto.fighterId,
        commissionId: dto.commissionId,
        type: dto.type,
        licenseNumber: dto.licenseNumber,
        disciplines: dto.disciplines,
        status: dto.issuedAt ? LicenseStatus.ACTIVE : LicenseStatus.PENDING,
        issuedAt: dto.issuedAt,
        expiresAt: dto.expiresAt,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CREATE',
      entityType: 'FighterLicense',
      entityId: license.id,
      newValues: {
        fighterId: dto.fighterId,
        type: dto.type,
        licenseNumber: dto.licenseNumber,
      } as Prisma.JsonObject,
    });

    return license;
  }

  async findById(id: string): Promise<LicenseWithRelations> {
    const license = await this.prisma.fighterLicense.findUnique({
      where: { id },
      include: {
        fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
        commission: { select: { id: true, name: true } },
      },
    });

    if (!license) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }

    return license;
  }

  async findByLicenseNumber(licenseNumber: string): Promise<LicenseWithRelations | null> {
    return this.prisma.fighterLicense.findFirst({
      where: { licenseNumber },
      include: {
        fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
        commission: { select: { id: true, name: true } },
      },
    });
  }

  async findByFighterId(fighterId: string): Promise<LicenseWithRelations[]> {
    return this.prisma.fighterLicense.findMany({
      where: { fighterId },
      include: {
        commission: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(query: LicenseQueryDto): Promise<{ licenses: LicenseWithRelations[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.FighterLicenseWhereInput = {};

    if (query.fighterId) {
      where.fighterId = query.fighterId;
    }

    if (query.commissionId) {
      where.commissionId = query.commissionId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [licenses, total] = await Promise.all([
      this.prisma.fighterLicense.findMany({
        where,
        include: {
          fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
          commission: { select: { id: true, name: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.fighterLicense.count({ where }),
    ]);

    return { licenses, total, page, limit };
  }

  async approve(
    id: string,
    issuedAt: Date,
    expiresAt: Date,
    requesterId: string,
  ): Promise<FighterLicense> {
    const license = await this.prisma.fighterLicense.findUnique({ where: { id } });

    if (!license) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }

    if (license.status !== LicenseStatus.PENDING) {
      throw new BadRequestException('License is not pending approval');
    }

    const updated = await this.prisma.fighterLicense.update({
      where: { id },
      data: {
        status: LicenseStatus.ACTIVE,
        issuedAt,
        expiresAt,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'APPROVE',
      entityType: 'FighterLicense',
      entityId: id,
      oldValues: { status: LicenseStatus.PENDING } as Prisma.JsonObject,
      newValues: { status: LicenseStatus.ACTIVE, issuedAt: issuedAt.toISOString(), expiresAt: expiresAt.toISOString() } as Prisma.JsonObject,
    });

    return updated;
  }

  async suspend(id: string, reason: string, requesterId: string): Promise<FighterLicense> {
    const license = await this.prisma.fighterLicense.findUnique({ where: { id } });

    if (!license) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }

    const updated = await this.prisma.fighterLicense.update({
      where: { id },
      data: { status: LicenseStatus.SUSPENDED },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'SUSPEND',
      entityType: 'FighterLicense',
      entityId: id,
      oldValues: { status: license.status } as Prisma.JsonObject,
      newValues: { status: LicenseStatus.SUSPENDED, reason } as Prisma.JsonObject,
    });

    return updated;
  }

  async revoke(id: string, reason: string, requesterId: string): Promise<FighterLicense> {
    const license = await this.prisma.fighterLicense.findUnique({ where: { id } });

    if (!license) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }

    const updated = await this.prisma.fighterLicense.update({
      where: { id },
      data: { status: LicenseStatus.REVOKED },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'REVOKE',
      entityType: 'FighterLicense',
      entityId: id,
      oldValues: { status: license.status } as Prisma.JsonObject,
      newValues: { status: LicenseStatus.REVOKED, reason } as Prisma.JsonObject,
    });

    return updated;
  }

  async renew(
    id: string,
    newExpiresAt: Date,
    requesterId: string,
  ): Promise<FighterLicense> {
    const license = await this.prisma.fighterLicense.findUnique({ where: { id } });

    if (!license) {
      throw new NotFoundException(`License with ID ${id} not found`);
    }

    if (license.status === LicenseStatus.REVOKED) {
      throw new BadRequestException('Cannot renew a revoked license');
    }

    const updated = await this.prisma.fighterLicense.update({
      where: { id },
      data: {
        status: LicenseStatus.ACTIVE,
        expiresAt: newExpiresAt,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'RENEW',
      entityType: 'FighterLicense',
      entityId: id,
      oldValues: { expiresAt: license.expiresAt?.toISOString() ?? null } as Prisma.JsonObject,
      newValues: { expiresAt: newExpiresAt.toISOString() } as Prisma.JsonObject,
    });

    return updated;
  }

  async markExpired(): Promise<number> {
    const result = await this.prisma.fighterLicense.updateMany({
      where: {
        status: LicenseStatus.ACTIVE,
        expiresAt: { lt: new Date() },
      },
      data: { status: LicenseStatus.EXPIRED },
    });

    return result.count;
  }

  async getExpiring(daysThreshold = 30): Promise<LicenseWithRelations[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return this.prisma.fighterLicense.findMany({
      where: {
        status: LicenseStatus.ACTIVE,
        expiresAt: {
          lte: thresholdDate,
          gte: new Date(),
        },
      },
      include: {
        fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
        commission: { select: { id: true, name: true } },
      },
      orderBy: { expiresAt: 'asc' },
    });
  }

  async verifyLicense(
    licenseNumber: string,
    commissionId?: string,
  ): Promise<{ valid: boolean; license?: LicenseWithRelations; reason?: string }> {
    const where: Prisma.FighterLicenseWhereInput = { licenseNumber };

    if (commissionId) {
      where.commissionId = commissionId;
    }

    const license = await this.prisma.fighterLicense.findFirst({
      where,
      include: {
        fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
        commission: { select: { id: true, name: true } },
      },
    });

    if (!license) {
      return { valid: false, reason: 'License not found' };
    }

    if (license.status === LicenseStatus.EXPIRED) {
      return { valid: false, license, reason: 'License has expired' };
    }

    if (license.status === LicenseStatus.SUSPENDED) {
      return { valid: false, license, reason: 'License is suspended' };
    }

    if (license.status === LicenseStatus.REVOKED) {
      return { valid: false, license, reason: 'License has been revoked' };
    }

    if (license.status === LicenseStatus.PENDING) {
      return { valid: false, license, reason: 'License is pending approval' };
    }

    if (license.expiresAt && license.expiresAt < new Date()) {
      return { valid: false, license, reason: 'License has expired' };
    }

    return { valid: true, license };
  }
}
