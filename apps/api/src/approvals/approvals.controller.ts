import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ApprovalsService } from './approvals.service';
import type { ApprovalDecisionDto } from './approvals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApprovalStatus } from '@prisma/client';

@ApiTags('approvals')
@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ApprovalsController {
  constructor(private readonly approvalsService: ApprovalsService) {}

  @Post()
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create approval request for an event' })
  @ApiResponse({ status: 201, description: 'Approval created' })
  @ApiResponse({ status: 400, description: 'Event not in submitted status' })
  async create(
    @Body() data: { eventId: string; reviewerId: string },
    @Request() req: { user: { userId: string } },
  ) {
    return this.approvalsService.create(data, req.user.userId);
  }

  @Get('my-pending')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get my pending approvals' })
  async getMyPending(@Request() req: { user: { userId: string } }) {
    return this.approvalsService.getPendingForReviewer(req.user.userId);
  }

  @Get('reviewer/:reviewerId')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get approvals by reviewer' })
  @ApiQuery({ name: 'status', required: false, enum: ApprovalStatus })
  async findByReviewer(
    @Param('reviewerId') reviewerId: string,
    @Query('status') status?: ApprovalStatus,
  ) {
    return this.approvalsService.findByReviewer(reviewerId, status);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get approvals for an event' })
  async findByEvent(@Param('eventId') eventId: string) {
    return this.approvalsService.findByEvent(eventId);
  }

  @Get('stats/:commissionId')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get approval statistics for a commission' })
  async getStats(@Param('commissionId') commissionId: string) {
    return this.approvalsService.getApprovalStats(commissionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get approval by ID' })
  @ApiResponse({ status: 200, description: 'Approval found' })
  @ApiResponse({ status: 404, description: 'Approval not found' })
  async findOne(@Param('id') id: string) {
    return this.approvalsService.findById(id);
  }

  @Put(':id/decide')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Make decision on approval' })
  @ApiResponse({ status: 200, description: 'Decision recorded' })
  @ApiResponse({ status: 400, description: 'Not the assigned reviewer or already decided' })
  async decide(
    @Param('id') id: string,
    @Body() data: { status: ApprovalStatus; notes?: string },
    @Request() req: { user: { userId: string } },
  ) {
    const dto: ApprovalDecisionDto = data;
    return this.approvalsService.decide(id, dto, req.user.userId);
  }

  @Put(':id/delegate')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Delegate approval to another reviewer' })
  @ApiResponse({ status: 200, description: 'Approval delegated' })
  async delegate(
    @Param('id') id: string,
    @Body() data: { newReviewerId: string },
    @Request() req: { user: { userId: string } },
  ) {
    return this.approvalsService.delegate(id, data.newReviewerId, req.user.userId);
  }
}
