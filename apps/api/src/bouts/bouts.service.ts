import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  Bout,
  BoutStatus,
  BoutResult,
  WeightClass,
  Discipline,
  EventStatus,
  Prisma,
} from '@prisma/client';

export interface CreateBoutDto {
  eventId: string;
  fighterAId: string;
  fighterBId: string;
  weightClass: WeightClass;
  discipline: Discipline;
  rounds?: number;
  roundMinutes?: number;
  isMainEvent?: boolean;
  isCoMain?: boolean;
  boutOrder?: number;
}

export interface UpdateBoutDto {
  weightClass?: WeightClass;
  discipline?: Discipline;
  rounds?: number;
  roundMinutes?: number;
  isMainEvent?: boolean;
  isCoMain?: boolean;
  boutOrder?: number;
}

export interface RecordResultDto {
  winnerId?: string;
  result: BoutResult;
  resultRound?: number;
  resultTime?: string;
  resultNotes?: string;
}

export interface BoutWithFighters extends Bout {
  fighterA: { id: string; combatId: string; firstName: string; lastName: string; userId: string };
  fighterB: { id: string; combatId: string; firstName: string; lastName: string; userId: string };
  event?: { id: string; name: string; eventDate: Date; status: EventStatus };
}

@Injectable()
export class BoutsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateBoutDto, requesterId: string): Promise<Bout> {
    // Validate event exists and is in draft status
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${dto.eventId} not found`);
    }

    if (event.status !== EventStatus.DRAFT) {
      throw new BadRequestException('Can only add bouts to events in DRAFT status');
    }

    // Validate fighters exist
    const [fighterA, fighterB] = await Promise.all([
      this.prisma.fighter.findUnique({ where: { id: dto.fighterAId } }),
      this.prisma.fighter.findUnique({ where: { id: dto.fighterBId } }),
    ]);

    if (!fighterA) {
      throw new NotFoundException(`Fighter A with ID ${dto.fighterAId} not found`);
    }

    if (!fighterB) {
      throw new NotFoundException(`Fighter B with ID ${dto.fighterBId} not found`);
    }

    // Check fighters aren't already on the card
    const existingBouts = await this.prisma.bout.findMany({
      where: {
        eventId: dto.eventId,
        status: { not: BoutStatus.CANCELLED },
        OR: [
          { fighterAId: dto.fighterAId },
          { fighterBId: dto.fighterAId },
          { fighterAId: dto.fighterBId },
          { fighterBId: dto.fighterBId },
        ],
      },
    });

    if (existingBouts.length > 0) {
      throw new ConflictException('One or both fighters are already on this card');
    }

    // Get next bout order if not specified
    let boutOrder = dto.boutOrder;
    if (boutOrder === undefined) {
      const maxOrder = await this.prisma.bout.aggregate({
        where: { eventId: dto.eventId },
        _max: { boutOrder: true },
      });
      boutOrder = (maxOrder._max.boutOrder ?? 0) + 1;
    }

    const bout = await this.prisma.bout.create({
      data: {
        eventId: dto.eventId,
        fighterAId: dto.fighterAId,
        fighterBId: dto.fighterBId,
        weightClass: dto.weightClass,
        discipline: dto.discipline,
        rounds: dto.rounds ?? 3,
        roundMinutes: dto.roundMinutes ?? 5,
        isMainEvent: dto.isMainEvent ?? false,
        isCoMain: dto.isCoMain ?? false,
        boutOrder,
        status: BoutStatus.SCHEDULED,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CREATE',
      entityType: 'Bout',
      entityId: bout.id,
      newValues: {
        eventId: dto.eventId,
        fighterAId: dto.fighterAId,
        fighterBId: dto.fighterBId,
        weightClass: dto.weightClass,
      } as Prisma.JsonObject,
    });

    return bout;
  }

  async findById(id: string): Promise<BoutWithFighters> {
    const bout = await this.prisma.bout.findUnique({
      where: { id },
      include: {
        fighterA: { select: { id: true, combatId: true, firstName: true, lastName: true, userId: true } },
        fighterB: { select: { id: true, combatId: true, firstName: true, lastName: true, userId: true } },
        event: { select: { id: true, name: true, eventDate: true, status: true } },
      },
    });

    if (!bout) {
      throw new NotFoundException(`Bout with ID ${id} not found`);
    }

    return bout;
  }

  async findByEvent(eventId: string): Promise<BoutWithFighters[]> {
    return this.prisma.bout.findMany({
      where: { eventId },
      include: {
        fighterA: { select: { id: true, combatId: true, firstName: true, lastName: true, userId: true } },
        fighterB: { select: { id: true, combatId: true, firstName: true, lastName: true, userId: true } },
      },
      orderBy: { boutOrder: 'asc' },
    });
  }

  async findByFighter(fighterId: string): Promise<BoutWithFighters[]> {
    return this.prisma.bout.findMany({
      where: {
        OR: [
          { fighterAId: fighterId },
          { fighterBId: fighterId },
        ],
      },
      include: {
        fighterA: { select: { id: true, combatId: true, firstName: true, lastName: true, userId: true } },
        fighterB: { select: { id: true, combatId: true, firstName: true, lastName: true, userId: true } },
        event: { select: { id: true, name: true, eventDate: true, status: true } },
      },
      orderBy: { event: { eventDate: 'desc' } },
    });
  }

  async update(id: string, dto: UpdateBoutDto, requesterId: string): Promise<Bout> {
    const bout = await this.prisma.bout.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!bout) {
      throw new NotFoundException(`Bout with ID ${id} not found`);
    }

    if (bout.event.status !== EventStatus.DRAFT) {
      throw new BadRequestException('Can only update bouts on events in DRAFT status');
    }

    const oldValues: Record<string, unknown> = {};
    Object.keys(dto).forEach(key => {
      oldValues[key] = bout[key as keyof Bout];
    });

    const updated = await this.prisma.bout.update({
      where: { id },
      data: dto,
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'UPDATE',
      entityType: 'Bout',
      entityId: id,
      oldValues: oldValues as Prisma.JsonObject,
      newValues: dto as unknown as Prisma.JsonObject,
    });

    return updated;
  }

  async signBout(id: string, fighterId: string, userId: string): Promise<Bout> {
    const bout = await this.prisma.bout.findUnique({
      where: { id },
      include: {
        fighterA: { select: { id: true, userId: true } },
        fighterB: { select: { id: true, userId: true } },
        event: true,
      },
    });

    if (!bout) {
      throw new NotFoundException(`Bout with ID ${id} not found`);
    }

    if (bout.status === BoutStatus.CANCELLED) {
      throw new BadRequestException('Cannot sign a cancelled bout');
    }

    // Verify the user is actually the fighter
    const isFighterA = bout.fighterA.id === fighterId && bout.fighterA.userId === userId;
    const isFighterB = bout.fighterB.id === fighterId && bout.fighterB.userId === userId;

    if (!isFighterA && !isFighterB) {
      throw new BadRequestException('User is not associated with either fighter in this bout');
    }

    const updateData: Prisma.BoutUpdateInput = {};
    if (isFighterA && !bout.fighterASignedAt) {
      updateData.fighterASignedAt = new Date();
    } else if (isFighterB && !bout.fighterBSignedAt) {
      updateData.fighterBSignedAt = new Date();
    } else {
      throw new BadRequestException('Fighter has already signed this bout');
    }

    const updated = await this.prisma.bout.update({
      where: { id },
      data: updateData,
    });

    await this.auditService.log({
      userId,
      action: 'SIGN',
      entityType: 'Bout',
      entityId: id,
      newValues: {
        fighterId,
        signedAt: new Date().toISOString(),
      } as Prisma.JsonObject,
    });

    return updated;
  }

  async recordResult(id: string, dto: RecordResultDto, requesterId: string): Promise<Bout> {
    const bout = await this.prisma.bout.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!bout) {
      throw new NotFoundException(`Bout with ID ${id} not found`);
    }

    if (bout.event.status !== EventStatus.APPROVED) {
      throw new BadRequestException('Can only record results for approved events');
    }

    if (bout.status === BoutStatus.COMPLETED) {
      throw new BadRequestException('Bout result has already been recorded');
    }

    // Validate winner is one of the fighters
    if (dto.winnerId && dto.winnerId !== bout.fighterAId && dto.winnerId !== bout.fighterBId) {
      throw new BadRequestException('Winner must be one of the fighters in this bout');
    }

    // Determine bout status based on result
    let status: BoutStatus = BoutStatus.COMPLETED;
    if (dto.result === BoutResult.NO_CONTEST) {
      status = BoutStatus.NO_CONTEST;
    } else if (dto.result === BoutResult.CANCELLED) {
      status = BoutStatus.CANCELLED;
    }

    const updated = await this.prisma.bout.update({
      where: { id },
      data: {
        winnerId: dto.winnerId,
        result: dto.result,
        resultRound: dto.resultRound,
        resultTime: dto.resultTime,
        resultNotes: dto.resultNotes,
        status,
      },
    });

    // Update fighter records if there's a winner
    if (dto.winnerId && status === BoutStatus.COMPLETED) {
      const loserId = dto.winnerId === bout.fighterAId ? bout.fighterBId : bout.fighterAId;

      // Determine if it was a KO or submission
      const isKO = dto.result === BoutResult.WIN_KO || dto.result === BoutResult.WIN_TKO;
      const isSubmission = dto.result === BoutResult.WIN_SUBMISSION;

      await Promise.all([
        // Update winner's record
        this.prisma.fighter.update({
          where: { id: dto.winnerId },
          data: {
            wins: { increment: 1 },
            knockouts: isKO ? { increment: 1 } : undefined,
            submissions: isSubmission ? { increment: 1 } : undefined,
          },
        }),
        // Update loser's record
        this.prisma.fighter.update({
          where: { id: loserId },
          data: { losses: { increment: 1 } },
        }),
      ]);
    } else if (dto.result === BoutResult.DRAW) {
      await Promise.all([
        this.prisma.fighter.update({
          where: { id: bout.fighterAId },
          data: { draws: { increment: 1 } },
        }),
        this.prisma.fighter.update({
          where: { id: bout.fighterBId },
          data: { draws: { increment: 1 } },
        }),
      ]);
    } else if (dto.result === BoutResult.NO_CONTEST) {
      await Promise.all([
        this.prisma.fighter.update({
          where: { id: bout.fighterAId },
          data: { noContests: { increment: 1 } },
        }),
        this.prisma.fighter.update({
          where: { id: bout.fighterBId },
          data: { noContests: { increment: 1 } },
        }),
      ]);
    }

    await this.auditService.log({
      userId: requesterId,
      action: 'RECORD_RESULT',
      entityType: 'Bout',
      entityId: id,
      newValues: {
        result: dto.result,
        winnerId: dto.winnerId,
        status,
      } as Prisma.JsonObject,
    });

    return updated;
  }

  async cancel(id: string, reason: string, requesterId: string): Promise<Bout> {
    const bout = await this.prisma.bout.findUnique({
      where: { id },
      include: { event: true },
    });

    if (!bout) {
      throw new NotFoundException(`Bout with ID ${id} not found`);
    }

    if (bout.status === BoutStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed bout');
    }

    const updated = await this.prisma.bout.update({
      where: { id },
      data: {
        status: BoutStatus.CANCELLED,
        resultNotes: reason,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CANCEL',
      entityType: 'Bout',
      entityId: id,
      oldValues: { status: bout.status } as Prisma.JsonObject,
      newValues: { status: BoutStatus.CANCELLED, reason } as Prisma.JsonObject,
    });

    return updated;
  }

  async reorderBouts(eventId: string, boutIds: string[], requesterId: string): Promise<void> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    if (event.status !== EventStatus.DRAFT) {
      throw new BadRequestException('Can only reorder bouts on events in DRAFT status');
    }

    // Update bout orders in a transaction
    await this.prisma.$transaction(
      boutIds.map((boutId, index) =>
        this.prisma.bout.update({
          where: { id: boutId },
          data: { boutOrder: index + 1 },
        }),
      ),
    );

    await this.auditService.log({
      userId: requesterId,
      action: 'REORDER',
      entityType: 'Event',
      entityId: eventId,
      newValues: { boutOrder: boutIds } as Prisma.JsonObject,
    });
  }

  async getUnsignedBouts(eventId: string): Promise<BoutWithFighters[]> {
    return this.prisma.bout.findMany({
      where: {
        eventId,
        status: BoutStatus.SCHEDULED,
        OR: [
          { fighterASignedAt: null },
          { fighterBSignedAt: null },
        ],
      },
      include: {
        fighterA: { select: { id: true, combatId: true, firstName: true, lastName: true, userId: true } },
        fighterB: { select: { id: true, combatId: true, firstName: true, lastName: true, userId: true } },
      },
      orderBy: { boutOrder: 'asc' },
    });
  }
}
