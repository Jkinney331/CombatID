import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get dashboard metrics' })
  @ApiQuery({ name: 'commissionId', required: false })
  async getDashboard(@Query('commissionId') commissionId?: string) {
    return this.analyticsService.getDashboardMetrics(commissionId);
  }

  @Get('trends/fighters')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get fighter growth trends' })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getFighterTrends(
    @Query('commissionId') commissionId?: string,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getFighterTrends(
      commissionId,
      days ? parseInt(days, 10) : 30,
    );
  }

  @Get('trends/documents')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get document upload/approval trends' })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getDocumentTrends(
    @Query('commissionId') commissionId?: string,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getDocumentTrends(
      commissionId,
      days ? parseInt(days, 10) : 30,
    );
  }

  @Get('trends/events')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get event trends by month' })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'months', required: false, type: Number })
  async getEventTrends(
    @Query('commissionId') commissionId?: string,
    @Query('months') months?: string,
  ) {
    return this.analyticsService.getEventTrends(
      commissionId,
      months ? parseInt(months, 10) : 6,
    );
  }

  @Get('snapshots')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get historical analytics snapshots' })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'periodType', required: false, enum: ['daily', 'weekly', 'monthly'] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getSnapshots(
    @Query('commissionId') commissionId?: string,
    @Query('periodType') periodType?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getSnapshots(
      commissionId,
      periodType,
      limit ? parseInt(limit, 10) : 30,
    );
  }

  @Post('snapshots')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create analytics snapshot (usually called by scheduler)' })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'periodType', required: false, enum: ['daily', 'weekly', 'monthly'] })
  async createSnapshot(
    @Query('commissionId') commissionId?: string,
    @Query('periodType') periodType?: string,
  ) {
    return this.analyticsService.createSnapshot(commissionId, periodType ?? 'daily');
  }

  @Get('activity')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get recent activity feed' })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecentActivity(
    @Query('commissionId') commissionId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getRecentActivity(
      commissionId,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @Get('top-fighters')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get top fighters by record' })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getTopFighters(
    @Query('commissionId') commissionId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getTopFightersByRecord(
      commissionId,
      limit ? parseInt(limit, 10) : 10,
    );
  }
}
