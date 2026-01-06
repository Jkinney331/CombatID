import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, InvitationStatus, Prisma } from '@prisma/client';
import { randomBytes } from 'crypto';

export interface CreateInvitationDto {
  email: string;
  role: UserRole;
  organizationId?: string;
  invitedById: string;
  expiresInDays?: number;
}

export interface InvitationQueryDto {
  status?: InvitationStatus;
  organizationId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Create a new user invitation
   */
  async create(dto: CreateInvitationDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // Check for existing pending invitation
    const existingInvitation = await this.prisma.userInvitation.findFirst({
      where: {
        email: dto.email,
        status: InvitationStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      throw new ConflictException('A pending invitation already exists for this email');
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex');

    // Calculate expiration (default 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (dto.expiresInDays ?? 7));

    const invitation = await this.prisma.userInvitation.create({
      data: {
        email: dto.email,
        role: dto.role,
        organizationId: dto.organizationId,
        invitedById: dto.invitedById,
        token,
        expiresAt,
      },
      include: {
        organization: true,
        invitedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    this.logger.log(`Invitation created for ${dto.email} by ${dto.invitedById}`);

    return invitation;
  }

  /**
   * Find all invitations with filters
   */
  async findAll(query: InvitationQueryDto) {
    const { status, organizationId, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserInvitationWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    const [invitations, total] = await Promise.all([
      this.prisma.userInvitation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organization: true,
          invitedBy: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.userInvitation.count({ where }),
    ]);

    return { invitations, total };
  }

  /**
   * Find invitation by token
   */
  async findByToken(token: string) {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { token },
      include: {
        organization: true,
        invitedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    return invitation;
  }

  /**
   * Validate and accept an invitation
   */
  async accept(token: string, auth0Id: string) {
    const invitation = await this.findByToken(token);

    // Check if invitation is still valid
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(`Invitation has already been ${invitation.status.toLowerCase()}`);
    }

    if (invitation.expiresAt < new Date()) {
      // Mark as expired
      await this.prisma.userInvitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED },
      });
      throw new BadRequestException('Invitation has expired');
    }

    // Create user and update invitation in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create the user
      const user = await tx.user.create({
        data: {
          email: invitation.email,
          auth0Id,
          role: invitation.role,
          status: 'PENDING_VERIFICATION',
        },
      });

      // If organization is specified, add user as member
      if (invitation.organizationId) {
        await tx.organizationMember.create({
          data: {
            userId: user.id,
            organizationId: invitation.organizationId,
            role: 'MEMBER',
          },
        });
      }

      // Update invitation status
      await tx.userInvitation.update({
        where: { id: invitation.id },
        data: {
          status: InvitationStatus.ACCEPTED,
          acceptedAt: new Date(),
        },
      });

      return user;
    });

    this.logger.log(`Invitation accepted: ${invitation.email}`);

    return result;
  }

  /**
   * Cancel an invitation
   */
  async cancel(id: string) {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Only pending invitations can be cancelled');
    }

    return this.prisma.userInvitation.update({
      where: { id },
      data: { status: InvitationStatus.CANCELLED },
    });
  }

  /**
   * Resend an invitation (creates new token)
   */
  async resend(id: string, invitedById: string) {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException('Invitation not found');
    }

    if (invitation.status === InvitationStatus.ACCEPTED) {
      throw new BadRequestException('Cannot resend an accepted invitation');
    }

    // Cancel old invitation and create new one
    await this.prisma.userInvitation.update({
      where: { id },
      data: { status: InvitationStatus.CANCELLED },
    });

    return this.create({
      email: invitation.email,
      role: invitation.role,
      organizationId: invitation.organizationId ?? undefined,
      invitedById,
    });
  }

  /**
   * Clean up expired invitations
   */
  async cleanupExpired() {
    const result = await this.prisma.userInvitation.updateMany({
      where: {
        status: InvitationStatus.PENDING,
        expiresAt: { lt: new Date() },
      },
      data: { status: InvitationStatus.EXPIRED },
    });

    this.logger.log(`Cleaned up ${result.count} expired invitations`);

    return result;
  }
}
