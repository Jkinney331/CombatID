import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  Event,
  EventStatus,
  WeightClass,
  Discipline,
  Prisma,
} from '@prisma/client';

export interface CreateEventDto {
  promotionId: string;
  commissionId?: string;
  name: string;
  description?: string;
  venue?: string;
  city?: string;
  state?: string;
  country?: string;
  eventDate: Date;
  doorsOpen?: Date;
  weighInDate?: Date;
}

export interface UpdateEventDto {
  name?: string;
  description?: string;
  venue?: string;
  city?: string;
  state?: string;
  country?: string;
  eventDate?: Date;
  doorsOpen?: Date;
  weighInDate?: Date;
}

export interface EventQueryDto {
  promotionId?: string;
  commissionId?: string;
  status?: EventStatus;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface EventWithBouts extends Event {
  bouts?: {
    id: string;
    fighterA: { id: string; combatId: string; firstName: string; lastName: string };
    fighterB: { id: string; combatId: string; firstName: string; lastName: string };
    weightClass: WeightClass;
    discipline: Discipline;
    rounds: number;
    status: string;
    isMainEvent: boolean;
    boutOrder: number;
  }[];
  _count?: { bouts: number };
}

@Injectable()
export class EventsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateEventDto, requesterId: string): Promise<Event> {
    const event = await this.prisma.event.create({
      data: {
        promotionId: dto.promotionId,
        commissionId: dto.commissionId,
        name: dto.name,
        description: dto.description,
        venue: dto.venue,
        city: dto.city,
        state: dto.state,
        country: dto.country,
        eventDate: dto.eventDate,
        doorsOpen: dto.doorsOpen,
        weighInDate: dto.weighInDate,
        status: EventStatus.DRAFT,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CREATE',
      entityType: 'Event',
      entityId: event.id,
      newValues: {
        name: dto.name,
        eventDate: dto.eventDate.toISOString(),
        promotionId: dto.promotionId,
      } as Prisma.JsonObject,
    });

    return event;
  }

  async findById(id: string): Promise<EventWithBouts> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        bouts: {
          include: {
            fighterA: { select: { id: true, combatId: true, firstName: true, lastName: true } },
            fighterB: { select: { id: true, combatId: true, firstName: true, lastName: true } },
          },
          orderBy: { boutOrder: 'asc' },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async findAll(query: EventQueryDto): Promise<{ events: EventWithBouts[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.EventWhereInput = {};

    if (query.promotionId) {
      where.promotionId = query.promotionId;
    }

    if (query.commissionId) {
      where.commissionId = query.commissionId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.fromDate || query.toDate) {
      where.eventDate = {};
      if (query.fromDate) {
        where.eventDate.gte = query.fromDate;
      }
      if (query.toDate) {
        where.eventDate.lte = query.toDate;
      }
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: {
          _count: { select: { bouts: true } },
        },
        skip,
        take: limit,
        orderBy: { eventDate: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { events, total, page, limit };
  }

  async findByPromotion(promotionId: string, status?: EventStatus): Promise<Event[]> {
    const where: Prisma.EventWhereInput = { promotionId };
    if (status) {
      where.status = status;
    }

    return this.prisma.event.findMany({
      where,
      orderBy: { eventDate: 'desc' },
    });
  }

  async findByCommission(commissionId: string, status?: EventStatus): Promise<Event[]> {
    const where: Prisma.EventWhereInput = { commissionId };
    if (status) {
      where.status = status;
    }

    return this.prisma.event.findMany({
      where,
      include: {
        _count: { select: { bouts: true } },
      },
      orderBy: { eventDate: 'desc' },
    });
  }

  async update(id: string, dto: UpdateEventDto, requesterId: string): Promise<Event> {
    const existing = await this.prisma.event.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (existing.status !== EventStatus.DRAFT) {
      throw new BadRequestException('Can only update events in DRAFT status');
    }

    const oldValues: Record<string, unknown> = {};
    const newValues: Record<string, unknown> = {};

    Object.keys(dto).forEach(key => {
      const typedKey = key as keyof UpdateEventDto;
      if (dto[typedKey] !== undefined) {
        oldValues[key] = existing[typedKey as keyof Event];
        newValues[key] = dto[typedKey] instanceof Date
          ? (dto[typedKey] as Date).toISOString()
          : dto[typedKey];
      }
    });

    const event = await this.prisma.event.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'UPDATE',
      entityType: 'Event',
      entityId: id,
      oldValues: oldValues as Prisma.JsonObject,
      newValues: newValues as Prisma.JsonObject,
    });

    return event;
  }

  async submit(id: string, requesterId: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { bouts: true } } },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.status !== EventStatus.DRAFT) {
      throw new BadRequestException('Can only submit events in DRAFT status');
    }

    if (!event.commissionId) {
      throw new BadRequestException('Event must have a commission assigned before submission');
    }

    if (event._count.bouts === 0) {
      throw new BadRequestException('Event must have at least one bout before submission');
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.SUBMITTED,
        submittedAt: new Date(),
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'SUBMIT',
      entityType: 'Event',
      entityId: id,
      oldValues: { status: EventStatus.DRAFT } as Prisma.JsonObject,
      newValues: { status: EventStatus.SUBMITTED } as Prisma.JsonObject,
    });

    return updated;
  }

  async approve(id: string, approverId: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.status !== EventStatus.SUBMITTED) {
      throw new BadRequestException('Can only approve events in SUBMITTED status');
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.APPROVED,
        approvedAt: new Date(),
        approvedById: approverId,
      },
    });

    await this.auditService.log({
      userId: approverId,
      action: 'APPROVE',
      entityType: 'Event',
      entityId: id,
      oldValues: { status: EventStatus.SUBMITTED } as Prisma.JsonObject,
      newValues: { status: EventStatus.APPROVED } as Prisma.JsonObject,
    });

    return updated;
  }

  async reject(id: string, reason: string, reviewerId: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.status !== EventStatus.SUBMITTED) {
      throw new BadRequestException('Can only reject events in SUBMITTED status');
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.REJECTED,
        rejectionReason: reason,
      },
    });

    await this.auditService.log({
      userId: reviewerId,
      action: 'REJECT',
      entityType: 'Event',
      entityId: id,
      oldValues: { status: EventStatus.SUBMITTED } as Prisma.JsonObject,
      newValues: { status: EventStatus.REJECTED, reason } as Prisma.JsonObject,
    });

    return updated;
  }

  async cancel(id: string, requesterId: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.status === EventStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed event');
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: { status: EventStatus.CANCELLED },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CANCEL',
      entityType: 'Event',
      entityId: id,
      oldValues: { status: event.status } as Prisma.JsonObject,
      newValues: { status: EventStatus.CANCELLED } as Prisma.JsonObject,
    });

    return updated;
  }

  async complete(id: string, requesterId: string): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.status !== EventStatus.APPROVED) {
      throw new BadRequestException('Can only complete approved events');
    }

    const updated = await this.prisma.event.update({
      where: { id },
      data: { status: EventStatus.COMPLETED },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'COMPLETE',
      entityType: 'Event',
      entityId: id,
      oldValues: { status: EventStatus.APPROVED } as Prisma.JsonObject,
      newValues: { status: EventStatus.COMPLETED } as Prisma.JsonObject,
    });

    return updated;
  }

  async getUpcoming(days = 30): Promise<Event[]> {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.prisma.event.findMany({
      where: {
        eventDate: {
          gte: now,
          lte: futureDate,
        },
        status: {
          in: [EventStatus.APPROVED, EventStatus.SUBMITTED],
        },
      },
      include: {
        _count: { select: { bouts: true } },
      },
      orderBy: { eventDate: 'asc' },
    });
  }

  async getPendingApproval(commissionId: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        commissionId,
        status: EventStatus.SUBMITTED,
      },
      include: {
        _count: { select: { bouts: true } },
      },
      orderBy: { submittedAt: 'asc' },
    });
  }
}
