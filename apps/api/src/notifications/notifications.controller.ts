import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import type { UpdatePreferenceDto } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationType, NotificationStatus } from '@prisma/client';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  @ApiQuery({ name: 'type', required: false, enum: NotificationType })
  @ApiQuery({ name: 'status', required: false, enum: NotificationStatus })
  @ApiQuery({ name: 'unreadOnly', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMyNotifications(
    @Request() req: { user: { userId: string } },
    @Query('type') type?: NotificationType,
    @Query('status') status?: NotificationStatus,
    @Query('unreadOnly') unreadOnly?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.findByUser(req.user.userId, {
      type,
      status,
      unreadOnly: unreadOnly === 'true',
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getUnreadCount(@Request() req: { user: { userId: string } }) {
    const count = await this.notificationsService.getUnreadCount(req.user.userId);
    return { count };
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get my notification preferences' })
  async getPreferences(@Request() req: { user: { userId: string } }) {
    return this.notificationsService.getPreferences(req.user.userId);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update notification preference' })
  async updatePreference(
    @Request() req: { user: { userId: string } },
    @Body() data: UpdatePreferenceDto,
  ) {
    return this.notificationsService.updatePreference(req.user.userId, data);
  }

  @Post('preferences/initialize')
  @ApiOperation({ summary: 'Initialize default notification preferences' })
  async initializePreferences(@Request() req: { user: { userId: string } }) {
    await this.notificationsService.initializePreferences(req.user.userId);
    return { success: true };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: 200, description: 'Notification found' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(@Param('id') id: string) {
    return this.notificationsService.findById(id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@Request() req: { user: { userId: string } }) {
    const count = await this.notificationsService.markAllAsRead(req.user.userId);
    return { count };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notification' })
  async delete(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    await this.notificationsService.delete(id, req.user.userId);
    return { success: true };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all my notifications' })
  async deleteAll(@Request() req: { user: { userId: string } }) {
    const count = await this.notificationsService.deleteAll(req.user.userId);
    return { count };
  }
}
