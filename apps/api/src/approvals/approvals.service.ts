import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  EventApproval,
  ApprovalStatus,
  EventStatus,
  Prisma,
} from '@prisma/client';

export interface CreateApprovalDto {
  eventId: string;
  reviewerId: string;
  delegatedFromId?: string;
}

export interface ApprovalDecisionDto {
  status: ApprovalStatus;
  notes?: string;
}

export interface ApprovalWithEvent extends EventApproval {
  event?: {
    id: string;
    name: string;
    eventDate: Date;
    status: EventStatus;
    promotionId: string;
  };
}

@Injectable()
export class ApprovalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateApprovalDto, requesterId: string): Promise<EventApproval> {
    // Validate event exists and is submitted
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${dto.eventId} not found`);
    }

    if (event.status !== EventStatus.SUBMITTED) {
      throw new BadRequestException('Can only create approval for submitted events');
    }

    // Check if approval already exists for this event/reviewer
    const existing = await this.prisma.eventApproval.findFirst({
      where: {
        eventId: dto.eventId,
        reviewerId: dto.reviewerId,
        status: ApprovalStatus.PENDING,
      },
    });

    if (existing) {
      throw new BadRequestException('Pending approval already exists for this reviewer');
    }

    const approval = await this.prisma.eventApproval.create({
      data: {
        eventId: dto.eventId,
        reviewerId: dto.reviewerId,
        delegatedFromId: dto.delegatedFromId,
        status: ApprovalStatus.PENDING,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CREATE',
      entityType: 'EventApproval',
      entityId: approval.id,
      newValues: {
        eventId: dto.eventId,
        reviewerId: dto.reviewerId,
      } as Prisma.JsonObject,
    });

    return approval;
  }

  async findById(id: string): Promise<ApprovalWithEvent> {
    const approval = await this.prisma.eventApproval.findUnique({
      where: { id },
    });

    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }

    // Fetch event separately since there's no relation defined
    const event = await this.prisma.event.findUnique({
      where: { id: approval.eventId },
      select: { id: true, name: true, eventDate: true, status: true, promotionId: true },
    });

    return { ...approval, event: event ?? undefined };
  }

  async findByEvent(eventId: string): Promise<EventApproval[]> {
    return this.prisma.eventApproval.findMany({
      where: { eventId },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async findByReviewer(reviewerId: string, status?: ApprovalStatus): Promise<ApprovalWithEvent[]> {
    const where: Prisma.EventApprovalWhereInput = { reviewerId };
    if (status) {
      where.status = status;
    }

    const approvals = await this.prisma.eventApproval.findMany({
      where,
      orderBy: { submittedAt: 'desc' },
    });

    // Fetch events for all approvals
    const eventIds = [...new Set(approvals.map(a => a.eventId))];
    const events = await this.prisma.event.findMany({
      where: { id: { in: eventIds } },
      select: { id: true, name: true, eventDate: true, status: true, promotionId: true },
    });

    const eventMap = new Map(events.map(e => [e.id, e]));

    return approvals.map(approval => ({
      ...approval,
      event: eventMap.get(approval.eventId),
    }));
  }

  async getPendingForReviewer(reviewerId: string): Promise<ApprovalWithEvent[]> {
    return this.findByReviewer(reviewerId, ApprovalStatus.PENDING);
  }

  async decide(id: string, dto: ApprovalDecisionDto, reviewerId: string): Promise<EventApproval> {
    const approval = await this.prisma.eventApproval.findUnique({
      where: { id },
    });

    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Approval has already been decided');
    }

    if (approval.reviewerId !== reviewerId) {
      throw new BadRequestException('Only the assigned reviewer can decide on this approval');
    }

    const updated = await this.prisma.eventApproval.update({
      where: { id },
      data: {
        status: dto.status,
        notes: dto.notes,
        reviewedAt: new Date(),
      },
    });

    // Update event status based on decision
    if (dto.status === ApprovalStatus.APPROVED) {
      await this.prisma.event.update({
        where: { id: approval.eventId },
        data: {
          status: EventStatus.APPROVED,
          approvedAt: new Date(),
          approvedById: reviewerId,
        },
      });
    } else if (dto.status === ApprovalStatus.REJECTED) {
      await this.prisma.event.update({
        where: { id: approval.eventId },
        data: {
          status: EventStatus.REJECTED,
          rejectionReason: dto.notes,
        },
      });
    } else if (dto.status === ApprovalStatus.REVISION_REQUESTED) {
      await this.prisma.event.update({
        where: { id: approval.eventId },
        data: {
          status: EventStatus.DRAFT,
          rejectionReason: dto.notes,
        },
      });
    }

    await this.auditService.log({
      userId: reviewerId,
      action: 'DECIDE',
      entityType: 'EventApproval',
      entityId: id,
      oldValues: { status: ApprovalStatus.PENDING } as Prisma.JsonObject,
      newValues: { status: dto.status, notes: dto.notes } as Prisma.JsonObject,
    });

    return updated;
  }

  async delegate(id: string, newReviewerId: string, requesterId: string): Promise<EventApproval> {
    const approval = await this.prisma.eventApproval.findUnique({
      where: { id },
    });

    if (!approval) {
      throw new NotFoundException(`Approval with ID ${id} not found`);
    }

    if (approval.status !== ApprovalStatus.PENDING) {
      throw new BadRequestException('Can only delegate pending approvals');
    }

    // Create new approval for the delegate
    const delegated = await this.prisma.eventApproval.create({
      data: {
        eventId: approval.eventId,
        reviewerId: newReviewerId,
        delegatedFromId: approval.reviewerId,
        status: ApprovalStatus.PENDING,
      },
    });

    // Mark original as delegated (using notes since we don't have a delegated status)
    await this.prisma.eventApproval.update({
      where: { id },
      data: {
        notes: `Delegated to ${newReviewerId}`,
        reviewedAt: new Date(),
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'DELEGATE',
      entityType: 'EventApproval',
      entityId: id,
      newValues: {
        delegatedTo: newReviewerId,
        newApprovalId: delegated.id,
      } as Prisma.JsonObject,
    });

    return delegated;
  }

  async getApprovalStats(commissionId: string): Promise<{
    pending: number;
    approved: number;
    rejected: number;
    revisionRequested: number;
  }> {
    // Get events for this commission
    const events = await this.prisma.event.findMany({
      where: { commissionId },
      select: { id: true },
    });

    const eventIds = events.map(e => e.id);

    const [pending, approved, rejected, revisionRequested] = await Promise.all([
      this.prisma.eventApproval.count({
        where: { eventId: { in: eventIds }, status: ApprovalStatus.PENDING },
      }),
      this.prisma.eventApproval.count({
        where: { eventId: { in: eventIds }, status: ApprovalStatus.APPROVED },
      }),
      this.prisma.eventApproval.count({
        where: { eventId: { in: eventIds }, status: ApprovalStatus.REJECTED },
      }),
      this.prisma.eventApproval.count({
        where: { eventId: { in: eventIds }, status: ApprovalStatus.REVISION_REQUESTED },
      }),
    ]);

    return { pending, approved, rejected, revisionRequested };
  }
}
