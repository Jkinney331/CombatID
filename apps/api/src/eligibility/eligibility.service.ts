import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  Ruleset,
  RulesetRequirement,
  EligibilityCheck,
  DocumentType,
  DocumentStatus,
  EligibilityStatus,
  Discipline,
  Prisma,
} from '@prisma/client';

export interface CreateRulesetDto {
  commissionId: string;
  discipline: Discipline;
  name: string;
  description?: string;
  requirements: CreateRequirementDto[];
}

export interface CreateRequirementDto {
  name: string;
  description?: string;
  documentType: DocumentType;
  isRequired?: boolean;
  expirationDays?: number;
  condition?: string;
  conditionDescription?: string;
  sortOrder?: number;
}

export interface EligibilityCheckResult {
  id: string;
  fighterId: string;
  rulesetId: string;
  status: EligibilityStatus;
  overallScore: number;
  requirements: {
    name: string;
    documentType: DocumentType;
    isRequired: boolean;
    isFulfilled: boolean;
    documentId?: string;
    expiresAt?: Date;
    notes?: string;
  }[];
  checkedAt: Date;
}

export interface RulesetWithRequirements extends Ruleset {
  requirements: RulesetRequirement[];
  commission?: { id: string; name: string };
}

@Injectable()
export class EligibilityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // =========================================================================
  // RULESET MANAGEMENT
  // =========================================================================

  async createRuleset(dto: CreateRulesetDto, requesterId: string): Promise<RulesetWithRequirements> {
    // Check if ruleset already exists for this commission/discipline
    const existing = await this.prisma.ruleset.findFirst({
      where: {
        commissionId: dto.commissionId,
        discipline: dto.discipline,
        isActive: true,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Active ruleset already exists for ${dto.discipline} in this commission`,
      );
    }

    const ruleset = await this.prisma.ruleset.create({
      data: {
        commissionId: dto.commissionId,
        discipline: dto.discipline,
        name: dto.name,
        description: dto.description,
        requirements: {
          create: dto.requirements.map((req, index) => ({
            name: req.name,
            description: req.description,
            documentType: req.documentType,
            isRequired: req.isRequired ?? true,
            expirationDays: req.expirationDays,
            condition: req.condition,
            conditionDescription: req.conditionDescription,
            sortOrder: req.sortOrder ?? index,
          })),
        },
      },
      include: {
        requirements: { orderBy: { sortOrder: 'asc' } },
        commission: { select: { id: true, name: true } },
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CREATE',
      entityType: 'Ruleset',
      entityId: ruleset.id,
      newValues: { name: ruleset.name, discipline: ruleset.discipline } as Prisma.JsonObject,
    });

    return ruleset;
  }

  async getRuleset(commissionId: string, discipline: Discipline): Promise<RulesetWithRequirements | null> {
    return this.prisma.ruleset.findFirst({
      where: {
        commissionId,
        discipline,
        isActive: true,
      },
      include: {
        requirements: { orderBy: { sortOrder: 'asc' } },
        commission: { select: { id: true, name: true } },
      },
    });
  }

  async getRulesets(commissionId: string): Promise<RulesetWithRequirements[]> {
    return this.prisma.ruleset.findMany({
      where: {
        commissionId,
        isActive: true,
      },
      include: {
        requirements: { orderBy: { sortOrder: 'asc' } },
        commission: { select: { id: true, name: true } },
      },
    });
  }

  async getRulesetById(id: string): Promise<RulesetWithRequirements> {
    const ruleset = await this.prisma.ruleset.findUnique({
      where: { id },
      include: {
        requirements: { orderBy: { sortOrder: 'asc' } },
        commission: { select: { id: true, name: true } },
      },
    });

    if (!ruleset) {
      throw new NotFoundException(`Ruleset with ID ${id} not found`);
    }

    return ruleset;
  }

  async updateRuleset(
    id: string,
    updates: { name?: string; description?: string },
    requesterId: string,
  ): Promise<Ruleset> {
    const existing = await this.prisma.ruleset.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Ruleset with ID ${id} not found`);
    }

    const ruleset = await this.prisma.ruleset.update({
      where: { id },
      data: updates,
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'UPDATE',
      entityType: 'Ruleset',
      entityId: id,
      oldValues: { name: existing.name, description: existing.description } as Prisma.JsonObject,
      newValues: updates as Prisma.JsonObject,
    });

    return ruleset;
  }

  async updateRequirements(
    rulesetId: string,
    requirements: CreateRequirementDto[],
    requesterId: string,
  ): Promise<RulesetWithRequirements> {
    // Create a new version of the ruleset
    const existing = await this.prisma.ruleset.findUnique({
      where: { id: rulesetId },
      include: { requirements: true },
    });

    if (!existing) {
      throw new NotFoundException(`Ruleset with ID ${rulesetId} not found`);
    }

    // Deactivate old version
    await this.prisma.ruleset.update({
      where: { id: rulesetId },
      data: { isActive: false },
    });

    // Create new version
    const newRuleset = await this.prisma.ruleset.create({
      data: {
        commissionId: existing.commissionId,
        discipline: existing.discipline,
        name: existing.name,
        description: existing.description,
        version: existing.version + 1,
        isActive: true,
        requirements: {
          create: requirements.map((req, index) => ({
            name: req.name,
            description: req.description,
            documentType: req.documentType,
            isRequired: req.isRequired ?? true,
            expirationDays: req.expirationDays,
            condition: req.condition,
            conditionDescription: req.conditionDescription,
            sortOrder: req.sortOrder ?? index,
          })),
        },
      },
      include: {
        requirements: { orderBy: { sortOrder: 'asc' } },
        commission: { select: { id: true, name: true } },
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'VERSION',
      entityType: 'Ruleset',
      entityId: newRuleset.id,
      oldValues: { previousVersion: existing.version } as Prisma.JsonObject,
      newValues: { version: newRuleset.version } as Prisma.JsonObject,
    });

    return newRuleset;
  }

  // =========================================================================
  // ELIGIBILITY CHECKING
  // =========================================================================

  async checkEligibility(
    fighterId: string,
    rulesetId: string,
  ): Promise<EligibilityCheckResult> {
    // Get fighter with documents
    const fighter = await this.prisma.fighter.findUnique({
      where: { id: fighterId },
      include: {
        documents: {
          where: {
            status: DocumentStatus.APPROVED,
            deletedAt: null,
            isLatest: true,
          },
        },
        suspensions: {
          where: {
            status: 'ACTIVE',
          },
        },
      },
    });

    if (!fighter) {
      throw new NotFoundException(`Fighter with ID ${fighterId} not found`);
    }

    // Get ruleset with requirements
    const ruleset = await this.prisma.ruleset.findUnique({
      where: { id: rulesetId },
      include: {
        requirements: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!ruleset) {
      throw new NotFoundException(`Ruleset with ID ${rulesetId} not found`);
    }

    // Check for active suspensions
    if (fighter.suspensions.length > 0) {
      const check = await this.prisma.eligibilityCheck.create({
        data: {
          fighterId,
          rulesetId,
          status: EligibilityStatus.SUSPENDED,
          overallScore: 0,
          requirementResults: {
            create: [],
          },
        },
      });

      return {
        id: check.id,
        fighterId,
        rulesetId,
        status: EligibilityStatus.SUSPENDED,
        overallScore: 0,
        requirements: [],
        checkedAt: check.checkedAt,
      };
    }

    const now = new Date();
    const fighterAge = this.calculateAge(fighter.dateOfBirth);

    // Check each requirement
    const requirementResults: {
      name: string;
      documentType: DocumentType;
      isRequired: boolean;
      isFulfilled: boolean;
      documentId?: string;
      expiresAt?: Date;
      notes?: string;
    }[] = [];

    for (const requirement of ruleset.requirements) {
      // Check if requirement is conditional
      if (requirement.condition) {
        const meetsCondition = this.evaluateCondition(requirement.condition, { age: fighterAge });
        if (!meetsCondition) {
          // Skip this requirement if condition not met
          continue;
        }
      }

      // Find matching document
      const matchingDoc = fighter.documents.find(d => d.type === requirement.documentType);

      let isFulfilled = false;
      let notes: string | undefined;

      if (matchingDoc) {
        // Check if document is expired
        if (requirement.expirationDays && matchingDoc.issueDate) {
          const expirationDate = new Date(matchingDoc.issueDate);
          expirationDate.setDate(expirationDate.getDate() + requirement.expirationDays);

          if (expirationDate > now) {
            isFulfilled = true;
          } else {
            notes = 'Document expired based on ruleset requirements';
          }
        } else if (matchingDoc.expirationDate) {
          if (matchingDoc.expirationDate > now) {
            isFulfilled = true;
          } else {
            notes = 'Document has passed its expiration date';
          }
        } else {
          isFulfilled = true;
        }
      }

      requirementResults.push({
        name: requirement.name,
        documentType: requirement.documentType,
        isRequired: requirement.isRequired,
        isFulfilled,
        documentId: matchingDoc?.id,
        expiresAt: matchingDoc?.expirationDate ?? undefined,
        notes,
      });
    }

    // Calculate overall status and score
    const requiredResults = requirementResults.filter(r => r.isRequired);
    const fulfilledRequired = requiredResults.filter(r => r.isFulfilled).length;
    const totalRequired = requiredResults.length;

    const allResults = requirementResults;
    const fulfilledAll = allResults.filter(r => r.isFulfilled).length;
    const totalAll = allResults.length;

    const overallScore = totalAll > 0 ? Math.round((fulfilledAll / totalAll) * 100) : 0;

    let status: EligibilityStatus;
    if (fulfilledRequired < totalRequired) {
      status = EligibilityStatus.INCOMPLETE;
    } else {
      // Check for documents expiring within 30 days
      const hasExpiringSoon = requirementResults.some(r => {
        if (!r.expiresAt) return false;
        const daysUntil = (r.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntil <= 30 && daysUntil > 0;
      });

      if (hasExpiringSoon) {
        status = EligibilityStatus.CONDITIONAL;
      } else {
        status = EligibilityStatus.ELIGIBLE;
      }
    }

    // Calculate valid until (earliest expiration)
    const expirations = requirementResults
      .filter(r => r.isRequired && r.expiresAt)
      .map(r => r.expiresAt!);
    const validUntil = expirations.length > 0 ? new Date(Math.min(...expirations.map(d => d.getTime()))) : null;

    // Save eligibility check
    const check = await this.prisma.eligibilityCheck.create({
      data: {
        fighterId,
        rulesetId,
        status,
        overallScore,
        validUntil,
        requirementResults: {
          create: requirementResults.map(r => ({
            requirementName: r.name,
            documentType: r.documentType,
            isRequired: r.isRequired,
            isFulfilled: r.isFulfilled,
            documentId: r.documentId,
            documentExpiresAt: r.expiresAt,
            notes: r.notes,
          })),
        },
      },
    });

    // Update fighter eligibility status
    await this.prisma.fighter.update({
      where: { id: fighterId },
      data: { eligibilityStatus: status },
    });

    return {
      id: check.id,
      fighterId,
      rulesetId,
      status,
      overallScore,
      requirements: requirementResults,
      checkedAt: check.checkedAt,
    };
  }

  async overrideEligibility(
    fighterId: string,
    status: EligibilityStatus,
    overriddenById: string,
    reason: string,
  ): Promise<EligibilityCheck> {
    // Get the most recent check
    const latestCheck = await this.prisma.eligibilityCheck.findFirst({
      where: { fighterId },
      orderBy: { checkedAt: 'desc' },
    });

    if (!latestCheck) {
      throw new BadRequestException('No eligibility check found to override');
    }

    const updated = await this.prisma.eligibilityCheck.update({
      where: { id: latestCheck.id },
      data: {
        status,
        isOverridden: true,
        overriddenById,
        overrideReason: reason,
        overriddenAt: new Date(),
      },
    });

    // Update fighter status
    await this.prisma.fighter.update({
      where: { id: fighterId },
      data: { eligibilityStatus: status },
    });

    await this.auditService.log({
      userId: overriddenById,
      action: 'OVERRIDE',
      entityType: 'EligibilityCheck',
      entityId: latestCheck.id,
      oldValues: { status: latestCheck.status } as Prisma.JsonObject,
      newValues: { status, reason } as Prisma.JsonObject,
    });

    return updated;
  }

  async getEligibilityHistory(fighterId: string): Promise<EligibilityCheck[]> {
    return this.prisma.eligibilityCheck.findMany({
      where: { fighterId },
      include: {
        ruleset: { select: { name: true, discipline: true } },
        requirementResults: true,
        overriddenBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { checkedAt: 'desc' },
    });
  }

  // =========================================================================
  // HELPER METHODS
  // =========================================================================

  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    return age;
  }

  private evaluateCondition(condition: string, context: { age: number }): boolean {
    try {
      const parsed = JSON.parse(condition);

      if (parsed.ageOver && context.age <= parsed.ageOver) {
        return false;
      }

      if (parsed.ageUnder && context.age >= parsed.ageUnder) {
        return false;
      }

      return true;
    } catch {
      return true; // If condition can't be parsed, apply the requirement
    }
  }

  // =========================================================================
  // DEFAULT RULESETS (Seeding)
  // =========================================================================

  async seedDefaultRulesets(commissionId: string, requesterId: string): Promise<RulesetWithRequirements[]> {
    const defaultRulesets: CreateRulesetDto[] = [
      {
        commissionId,
        discipline: Discipline.MMA,
        name: 'Professional MMA Requirements',
        description: 'Standard requirements for professional MMA competition',
        requirements: [
          { name: 'Physical Examination', documentType: DocumentType.PHYSICAL_EXAM, isRequired: true, expirationDays: 365 },
          { name: 'HIV Test (Negative)', documentType: DocumentType.HIV_TEST, isRequired: true, expirationDays: 180 },
          { name: 'Hepatitis B Test (Negative)', documentType: DocumentType.HEPATITIS_B_TEST, isRequired: true, expirationDays: 365 },
          { name: 'Hepatitis C Test (Negative)', documentType: DocumentType.HEPATITIS_C_TEST, isRequired: true, expirationDays: 365 },
          { name: 'Eye Examination', documentType: DocumentType.EYE_EXAM, isRequired: true, expirationDays: 365 },
          { name: 'EKG (35+ years)', documentType: DocumentType.EKG, isRequired: true, expirationDays: 365, condition: '{"ageOver": 35}', conditionDescription: 'Required for fighters over 35 years old' },
          { name: 'Photo ID', documentType: DocumentType.PHOTO_ID, isRequired: true },
          { name: 'Fighter License', documentType: DocumentType.FIGHTER_LICENSE, isRequired: true, expirationDays: 365 },
        ],
      },
      {
        commissionId,
        discipline: Discipline.BOXING,
        name: 'Professional Boxing Requirements',
        description: 'Standard requirements for professional boxing competition',
        requirements: [
          { name: 'Physical Examination', documentType: DocumentType.PHYSICAL_EXAM, isRequired: true, expirationDays: 365 },
          { name: 'HIV Test (Negative)', documentType: DocumentType.HIV_TEST, isRequired: true, expirationDays: 180 },
          { name: 'Hepatitis B Test (Negative)', documentType: DocumentType.HEPATITIS_B_TEST, isRequired: true, expirationDays: 365 },
          { name: 'Hepatitis C Test (Negative)', documentType: DocumentType.HEPATITIS_C_TEST, isRequired: true, expirationDays: 365 },
          { name: 'Eye Examination', documentType: DocumentType.EYE_EXAM, isRequired: true, expirationDays: 365 },
          { name: 'EKG (35+ years)', documentType: DocumentType.EKG, isRequired: true, expirationDays: 365, condition: '{"ageOver": 35}', conditionDescription: 'Required for fighters over 35 years old' },
          { name: 'Neurological Exam (35+ years)', documentType: DocumentType.NEUROLOGICAL_EXAM, isRequired: true, expirationDays: 365, condition: '{"ageOver": 35}', conditionDescription: 'Required for fighters over 35 years old' },
          { name: 'Photo ID', documentType: DocumentType.PHOTO_ID, isRequired: true },
          { name: 'Fighter License', documentType: DocumentType.FIGHTER_LICENSE, isRequired: true, expirationDays: 365 },
        ],
      },
    ];

    const created: RulesetWithRequirements[] = [];

    for (const dto of defaultRulesets) {
      try {
        const ruleset = await this.createRuleset(dto, requesterId);
        created.push(ruleset);
      } catch (error) {
        // Skip if ruleset already exists
        continue;
      }
    }

    return created;
  }
}
