import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  Notification,
  NotificationPreference,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
  Prisma,
} from '@prisma/client';

export interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  entityType?: string;
  entityId?: string;
  channel?: NotificationChannel;
}

export interface NotificationQueryDto {
  userId?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface UpdatePreferenceDto {
  type: NotificationType;
  inAppEnabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  smsEnabled?: boolean;
}

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    // Check user preferences
    const preference = await this.prisma.notificationPreference.findUnique({
      where: {
        userId_type: {
          userId: dto.userId,
          type: dto.type,
        },
      },
    });

    const channel = dto.channel ?? NotificationChannel.IN_APP;

    // Respect user preferences
    if (preference) {
      if (channel === NotificationChannel.IN_APP && !preference.inAppEnabled) {
        return null as unknown as Notification; // User opted out
      }
      if (channel === NotificationChannel.EMAIL && !preference.emailEnabled) {
        return null as unknown as Notification;
      }
      if (channel === NotificationChannel.PUSH && !preference.pushEnabled) {
        return null as unknown as Notification;
      }
      if (channel === NotificationChannel.SMS && !preference.smsEnabled) {
        return null as unknown as Notification;
      }
    }

    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        message: dto.message,
        data: dto.data as Prisma.JsonObject,
        entityType: dto.entityType,
        entityId: dto.entityId,
        channel,
        status: NotificationStatus.PENDING,
      },
    });
  }

  async createBulk(notifications: CreateNotificationDto[]): Promise<number> {
    const results = await Promise.all(
      notifications.map(dto => this.create(dto)),
    );
    return results.filter(r => r !== null).length;
  }

  async findById(id: string): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return notification;
  }

  async findByUser(
    userId: string,
    query: NotificationQueryDto = {},
  ): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = { userId };

    if (query.type) {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.unreadOnly) {
      where.readAt = null;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId, readAt: null },
      }),
    ]);

    return { notifications, total, unreadCount };
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    if (notification.userId !== userId) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    return result.count;
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, readAt: null },
    });
  }

  async delete(id: string, userId: string): Promise<void> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }

    await this.prisma.notification.delete({ where: { id } });
  }

  async deleteAll(userId: string): Promise<number> {
    const result = await this.prisma.notification.deleteMany({
      where: { userId },
    });
    return result.count;
  }

  // Preference management
  async getPreferences(userId: string): Promise<NotificationPreference[]> {
    return this.prisma.notificationPreference.findMany({
      where: { userId },
    });
  }

  async updatePreference(
    userId: string,
    dto: UpdatePreferenceDto,
  ): Promise<NotificationPreference> {
    return this.prisma.notificationPreference.upsert({
      where: {
        userId_type: {
          userId,
          type: dto.type,
        },
      },
      update: {
        inAppEnabled: dto.inAppEnabled,
        emailEnabled: dto.emailEnabled,
        pushEnabled: dto.pushEnabled,
        smsEnabled: dto.smsEnabled,
      },
      create: {
        userId,
        type: dto.type,
        inAppEnabled: dto.inAppEnabled ?? true,
        emailEnabled: dto.emailEnabled ?? true,
        pushEnabled: dto.pushEnabled ?? false,
        smsEnabled: dto.smsEnabled ?? false,
      },
    });
  }

  async initializePreferences(userId: string): Promise<void> {
    const types = Object.values(NotificationType);

    await this.prisma.notificationPreference.createMany({
      data: types.map(type => ({
        userId,
        type,
        inAppEnabled: true,
        emailEnabled: true,
        pushEnabled: false,
        smsEnabled: false,
      })),
      skipDuplicates: true,
    });
  }

  // Helper methods for common notifications
  async notifyDocumentExpiring(
    userId: string,
    documentType: string,
    expirationDate: Date,
    documentId: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.DOCUMENT_EXPIRING,
      title: 'Document Expiring Soon',
      message: `Your ${documentType} will expire on ${expirationDate.toLocaleDateString()}`,
      entityType: 'Document',
      entityId: documentId,
      data: { documentType, expirationDate: expirationDate.toISOString() },
    });
  }

  async notifyEventApproved(
    userId: string,
    eventName: string,
    eventId: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.EVENT_APPROVED,
      title: 'Event Approved',
      message: `Your event "${eventName}" has been approved`,
      entityType: 'Event',
      entityId: eventId,
    });
  }

  async notifyEventRejected(
    userId: string,
    eventName: string,
    eventId: string,
    reason?: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.EVENT_REJECTED,
      title: 'Event Rejected',
      message: `Your event "${eventName}" has been rejected${reason ? `: ${reason}` : ''}`,
      entityType: 'Event',
      entityId: eventId,
      data: reason ? { reason } : undefined,
    });
  }

  async notifyBoutSigned(
    userId: string,
    fighterName: string,
    eventName: string,
    boutId: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.BOUT_SIGNED,
      title: 'Bout Agreement Signed',
      message: `${fighterName} has signed the bout agreement for ${eventName}`,
      entityType: 'Bout',
      entityId: boutId,
    });
  }

  async notifySuspensionCreated(
    userId: string,
    reason: string,
    suspensionId: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.SUSPENSION_CREATED,
      title: 'Medical Suspension Issued',
      message: `A medical suspension has been issued: ${reason}`,
      entityType: 'MedicalSuspension',
      entityId: suspensionId,
    });
  }

  async notifyEligibilityChanged(
    userId: string,
    newStatus: string,
    fighterId: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.ELIGIBILITY_CHANGED,
      title: 'Eligibility Status Changed',
      message: `Your eligibility status has changed to: ${newStatus}`,
      entityType: 'Fighter',
      entityId: fighterId,
      data: { newStatus },
    });
  }

  // Process pending notifications (for background job)
  async processPendingNotifications(): Promise<number> {
    const pending = await this.prisma.notification.findMany({
      where: { status: NotificationStatus.PENDING },
      take: 100,
    });

    let processed = 0;
    for (const notification of pending) {
      try {
        // For IN_APP, just mark as sent
        if (notification.channel === NotificationChannel.IN_APP) {
          await this.prisma.notification.update({
            where: { id: notification.id },
            data: {
              status: NotificationStatus.SENT,
              sentAt: new Date(),
            },
          });
          processed++;
        }
        // TODO: Implement EMAIL, PUSH, SMS delivery
        // These would integrate with external services
      } catch (error) {
        await this.prisma.notification.update({
          where: { id: notification.id },
          data: {
            status: NotificationStatus.FAILED,
            failureReason: error instanceof Error ? error.message : 'Unknown error',
          },
        });
      }
    }

    return processed;
  }
}
