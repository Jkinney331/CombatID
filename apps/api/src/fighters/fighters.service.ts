import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  Fighter,
  WeightClass,
  Discipline,
  FighterStatus,
  VerificationStatus,
  EligibilityStatus,
  Prisma,
} from '@prisma/client';
import { nanoid } from 'nanoid';

// Combat ID format: CID-XXXXXX (6 alphanumeric characters)
function generateCombatId(): string {
  const id = nanoid(6).toUpperCase();
  return `CID-${id}`;
}

export interface CreateFighterDto {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nickname?: string;
  gender?: string;
  nationality?: string;
  countryOfBirth?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  heightCm?: number;
  reachCm?: number;
  weightClass?: WeightClass;
  disciplines?: Discipline[];
  stance?: string;
  gymId?: string;
  bio?: string;
  photoUrl?: string;
}

export interface UpdateFighterDto {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  countryOfBirth?: string;
  currentCity?: string;
  currentState?: string;
  currentCountry?: string;
  heightCm?: number;
  reachCm?: number;
  weightClass?: WeightClass;
  disciplines?: Discipline[];
  stance?: string;
  gymId?: string;
  bio?: string;
  photoUrl?: string;
  status?: FighterStatus;
}

export interface FighterSearchQuery {
  discipline?: Discipline;
  weightClass?: WeightClass;
  status?: FighterStatus;
  eligibilityStatus?: EligibilityStatus;
  verificationStatus?: VerificationStatus;
  q?: string; // Search by name or combatId
  gymId?: string;
  page?: number;
  limit?: number;
}

export interface FighterWithRelations extends Fighter {
  user?: { email: string; firstName: string | null; lastName: string | null };
  gym?: { id: string; name: string } | null;
  _count?: { documents: number; licenses: number; suspensions: number };
}

@Injectable()
export class FightersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateFighterDto, requesterId?: string): Promise<Fighter> {
    // Check if user already has a fighter profile
    const existingFighter = await this.prisma.fighter.findUnique({
      where: { userId: dto.userId },
    });

    if (existingFighter) {
      throw new ConflictException('User already has a fighter profile');
    }

    // Generate unique Combat ID
    let combatId = generateCombatId();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await this.prisma.fighter.findUnique({
        where: { combatId },
      });
      if (!existing) break;
      combatId = generateCombatId();
      attempts++;
    }

    const fighter = await this.prisma.fighter.create({
      data: {
        combatId,
        userId: dto.userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: dto.dateOfBirth,
        nickname: dto.nickname,
        gender: dto.gender,
        nationality: dto.nationality,
        countryOfBirth: dto.countryOfBirth,
        currentCity: dto.currentCity,
        currentState: dto.currentState,
        currentCountry: dto.currentCountry,
        heightCm: dto.heightCm,
        reachCm: dto.reachCm,
        weightClass: dto.weightClass,
        disciplines: dto.disciplines ?? [],
        stance: dto.stance,
        gymId: dto.gymId,
        bio: dto.bio,
        photoUrl: dto.photoUrl,
        status: FighterStatus.ACTIVE,
        verificationStatus: VerificationStatus.PENDING,
        eligibilityStatus: EligibilityStatus.INCOMPLETE,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CREATE',
      entityType: 'Fighter',
      entityId: fighter.id,
      newValues: fighter as unknown as Prisma.JsonObject,
    });

    return fighter;
  }

  async findById(id: string): Promise<FighterWithRelations> {
    const fighter = await this.prisma.fighter.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        gym: { select: { id: true, name: true } },
        _count: { select: { documents: true, licenses: true, suspensions: true } },
      },
    });

    if (!fighter) {
      throw new NotFoundException(`Fighter with ID ${id} not found`);
    }

    return fighter;
  }

  async findByCombatId(combatId: string): Promise<FighterWithRelations> {
    const fighter = await this.prisma.fighter.findUnique({
      where: { combatId },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        gym: { select: { id: true, name: true } },
        _count: { select: { documents: true, licenses: true, suspensions: true } },
      },
    });

    if (!fighter) {
      throw new NotFoundException(`Fighter with Combat ID ${combatId} not found`);
    }

    return fighter;
  }

  async findByUserId(userId: string): Promise<FighterWithRelations | null> {
    return this.prisma.fighter.findUnique({
      where: { userId },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        gym: { select: { id: true, name: true } },
        _count: { select: { documents: true, licenses: true, suspensions: true } },
      },
    });
  }

  async update(id: string, dto: UpdateFighterDto, requesterId?: string): Promise<Fighter> {
    const existing = await this.prisma.fighter.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Fighter with ID ${id} not found`);
    }

    const fighter = await this.prisma.fighter.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        nickname: dto.nickname,
        dateOfBirth: dto.dateOfBirth,
        gender: dto.gender,
        nationality: dto.nationality,
        countryOfBirth: dto.countryOfBirth,
        currentCity: dto.currentCity,
        currentState: dto.currentState,
        currentCountry: dto.currentCountry,
        heightCm: dto.heightCm,
        reachCm: dto.reachCm,
        weightClass: dto.weightClass,
        disciplines: dto.disciplines,
        stance: dto.stance,
        gymId: dto.gymId,
        bio: dto.bio,
        photoUrl: dto.photoUrl,
        status: dto.status,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'UPDATE',
      entityType: 'Fighter',
      entityId: fighter.id,
      oldValues: existing as unknown as Prisma.JsonObject,
      newValues: fighter as unknown as Prisma.JsonObject,
    });

    return fighter;
  }

  async updateVerificationStatus(
    id: string,
    status: VerificationStatus,
    requesterId: string,
  ): Promise<Fighter> {
    const existing = await this.prisma.fighter.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Fighter with ID ${id} not found`);
    }

    const fighter = await this.prisma.fighter.update({
      where: { id },
      data: { verificationStatus: status },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'VERIFY',
      entityType: 'Fighter',
      entityId: fighter.id,
      oldValues: { verificationStatus: existing.verificationStatus } as Prisma.JsonObject,
      newValues: { verificationStatus: status } as Prisma.JsonObject,
    });

    return fighter;
  }

  async updateEligibilityStatus(
    id: string,
    status: EligibilityStatus,
    requesterId: string,
  ): Promise<Fighter> {
    const existing = await this.prisma.fighter.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Fighter with ID ${id} not found`);
    }

    const fighter = await this.prisma.fighter.update({
      where: { id },
      data: { eligibilityStatus: status },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'ELIGIBILITY_UPDATE',
      entityType: 'Fighter',
      entityId: fighter.id,
      oldValues: { eligibilityStatus: existing.eligibilityStatus } as Prisma.JsonObject,
      newValues: { eligibilityStatus: status } as Prisma.JsonObject,
    });

    return fighter;
  }

  async updateRecord(
    id: string,
    data: { wins?: number; losses?: number; draws?: number; noContests?: number; knockouts?: number; submissions?: number },
  ): Promise<Fighter> {
    return this.prisma.fighter.update({
      where: { id },
      data,
    });
  }

  async search(query: FighterSearchQuery): Promise<{ fighters: FighterWithRelations[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.FighterWhereInput = {};

    if (query.discipline) {
      where.disciplines = { has: query.discipline };
    }

    if (query.weightClass) {
      where.weightClass = query.weightClass;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.eligibilityStatus) {
      where.eligibilityStatus = query.eligibilityStatus;
    }

    if (query.verificationStatus) {
      where.verificationStatus = query.verificationStatus;
    }

    if (query.gymId) {
      where.gymId = query.gymId;
    }

    if (query.q) {
      where.OR = [
        { firstName: { contains: query.q, mode: 'insensitive' } },
        { lastName: { contains: query.q, mode: 'insensitive' } },
        { nickname: { contains: query.q, mode: 'insensitive' } },
        { combatId: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const [fighters, total] = await Promise.all([
      this.prisma.fighter.findMany({
        where,
        include: {
          user: { select: { email: true, firstName: true, lastName: true } },
          gym: { select: { id: true, name: true } },
          _count: { select: { documents: true, licenses: true, suspensions: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.fighter.count({ where }),
    ]);

    return { fighters, total, page, limit };
  }

  async getProfileCompletion(id: string): Promise<{ score: number; missing: string[] }> {
    const fighter = await this.prisma.fighter.findUnique({
      where: { id },
      include: {
        documents: { where: { status: 'APPROVED', deletedAt: null } },
        licenses: { where: { status: 'ACTIVE' } },
      },
    });

    if (!fighter) {
      throw new NotFoundException(`Fighter with ID ${id} not found`);
    }

    const fields: { field: string; value: unknown; weight: number }[] = [
      { field: 'firstName', value: fighter.firstName, weight: 10 },
      { field: 'lastName', value: fighter.lastName, weight: 10 },
      { field: 'dateOfBirth', value: fighter.dateOfBirth, weight: 10 },
      { field: 'nationality', value: fighter.nationality, weight: 5 },
      { field: 'heightCm', value: fighter.heightCm, weight: 5 },
      { field: 'weightClass', value: fighter.weightClass, weight: 10 },
      { field: 'disciplines', value: fighter.disciplines.length > 0, weight: 10 },
      { field: 'photoUrl', value: fighter.photoUrl, weight: 10 },
      { field: 'hasPhotoId', value: fighter.documents.some(d => d.type === 'PHOTO_ID'), weight: 10 },
      { field: 'hasPhysicalExam', value: fighter.documents.some(d => d.type === 'PHYSICAL_EXAM'), weight: 10 },
      { field: 'hasActiveLicense', value: fighter.licenses.length > 0, weight: 10 },
    ];

    const missing: string[] = [];
    let totalWeight = 0;
    let completedWeight = 0;

    for (const { field, value, weight } of fields) {
      totalWeight += weight;
      if (value) {
        completedWeight += weight;
      } else {
        missing.push(field);
      }
    }

    const score = Math.round((completedWeight / totalWeight) * 100);
    return { score, missing };
  }

  async verifyCombatId(combatId: string): Promise<{ valid: boolean; fighter?: FighterWithRelations }> {
    const fighter = await this.prisma.fighter.findUnique({
      where: { combatId },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        gym: { select: { id: true, name: true } },
      },
    });

    if (!fighter) {
      return { valid: false };
    }

    return { valid: true, fighter };
  }
}
