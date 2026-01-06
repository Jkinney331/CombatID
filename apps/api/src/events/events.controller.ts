import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { EventsService } from './events.service';
import type { CreateEventDto, UpdateEventDto, EventQueryDto } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { EventStatus } from '@prisma/client';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles('PROMOTION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  async create(
    @Body() data: {
      promotionId: string;
      commissionId?: string;
      name: string;
      description?: string;
      venue?: string;
      city?: string;
      state?: string;
      country?: string;
      eventDate: string;
      doorsOpen?: string;
      weighInDate?: string;
    },
    @Request() req: { user: { userId: string } },
  ) {
    const dto: CreateEventDto = {
      ...data,
      eventDate: new Date(data.eventDate),
      doorsOpen: data.doorsOpen ? new Date(data.doorsOpen) : undefined,
      weighInDate: data.weighInDate ? new Date(data.weighInDate) : undefined,
    };
    return this.eventsService.create(dto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Search events' })
  @ApiQuery({ name: 'promotionId', required: false })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('promotionId') promotionId?: string,
    @Query('commissionId') commissionId?: string,
    @Query('status') status?: EventStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: EventQueryDto = {
      promotionId,
      commissionId,
      status,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.eventsService.findAll(query);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Number of days ahead (default 30)' })
  async getUpcoming(@Query('days') days?: string) {
    return this.eventsService.getUpcoming(days ? parseInt(days, 10) : 30);
  }

  @Get('pending')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get events pending approval (Commission only)' })
  async getPendingApproval(
    @Query('commissionId') commissionId: string,
  ) {
    return this.eventsService.getPendingApproval(commissionId);
  }

  @Get('promotion/:promotionId')
  @ApiOperation({ summary: 'Get events by promotion' })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus })
  async findByPromotion(
    @Param('promotionId') promotionId: string,
    @Query('status') status?: EventStatus,
  ) {
    return this.eventsService.findByPromotion(promotionId, status);
  }

  @Get('commission/:commissionId')
  @ApiOperation({ summary: 'Get events by commission' })
  @ApiQuery({ name: 'status', required: false, enum: EventStatus })
  async findByCommission(
    @Param('commissionId') commissionId: string,
    @Query('status') status?: EventStatus,
  ) {
    return this.eventsService.findByCommission(commissionId, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID with bouts' })
  @ApiResponse({ status: 200, description: 'Event found' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Put(':id')
  @Roles('PROMOTION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update event details' })
  @ApiResponse({ status: 200, description: 'Event updated' })
  @ApiResponse({ status: 400, description: 'Can only update draft events' })
  async update(
    @Param('id') id: string,
    @Body() data: {
      name?: string;
      description?: string;
      venue?: string;
      city?: string;
      state?: string;
      country?: string;
      eventDate?: string;
      doorsOpen?: string;
      weighInDate?: string;
    },
    @Request() req: { user: { userId: string } },
  ) {
    const dto: UpdateEventDto = {
      ...data,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      doorsOpen: data.doorsOpen ? new Date(data.doorsOpen) : undefined,
      weighInDate: data.weighInDate ? new Date(data.weighInDate) : undefined,
    };
    return this.eventsService.update(id, dto, req.user.userId);
  }

  @Put(':id/submit')
  @Roles('PROMOTION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Submit event for approval' })
  @ApiResponse({ status: 200, description: 'Event submitted' })
  @ApiResponse({ status: 400, description: 'Event not in draft status or missing requirements' })
  async submit(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.eventsService.submit(id, req.user.userId);
  }

  @Put(':id/approve')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Approve event (Commission only)' })
  @ApiResponse({ status: 200, description: 'Event approved' })
  async approve(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.eventsService.approve(id, req.user.userId);
  }

  @Put(':id/reject')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Reject event (Commission only)' })
  @ApiResponse({ status: 200, description: 'Event rejected' })
  async reject(
    @Param('id') id: string,
    @Body() data: { reason: string },
    @Request() req: { user: { userId: string } },
  ) {
    return this.eventsService.reject(id, data.reason, req.user.userId);
  }

  @Put(':id/cancel')
  @Roles('PROMOTION_ADMIN', 'COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Cancel event' })
  @ApiResponse({ status: 200, description: 'Event cancelled' })
  @ApiResponse({ status: 400, description: 'Cannot cancel completed event' })
  async cancel(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.eventsService.cancel(id, req.user.userId);
  }

  @Put(':id/complete')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Mark event as completed (Commission only)' })
  @ApiResponse({ status: 200, description: 'Event completed' })
  async complete(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.eventsService.complete(id, req.user.userId);
  }
}
