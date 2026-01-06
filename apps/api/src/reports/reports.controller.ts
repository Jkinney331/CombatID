import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import type { CreateReportDto, ReportQueryDto } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReportType, ReportStatus, ReportFormat } from '@prisma/client';

@ApiTags('reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a new report request' })
  @ApiResponse({ status: 201, description: 'Report request created' })
  async create(
    @Body() data: {
      type: ReportType;
      name: string;
      description?: string;
      format?: ReportFormat;
      commissionId?: string;
      parameters?: Record<string, unknown>;
      isScheduled?: boolean;
      scheduleConfig?: Record<string, unknown>;
    },
    @Request() req: { user: { userId: string } },
  ) {
    const dto: CreateReportDto = data;
    return this.reportsService.create(dto, req.user.userId);
  }

  @Get()
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all reports' })
  @ApiQuery({ name: 'type', required: false, enum: ReportType })
  @ApiQuery({ name: 'status', required: false, enum: ReportStatus })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('type') type?: ReportType,
    @Query('status') status?: ReportStatus,
    @Query('commissionId') commissionId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: ReportQueryDto = {
      type,
      status,
      commissionId,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.reportsService.findAll(query);
  }

  @Get('my-reports')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get my report requests' })
  @ApiQuery({ name: 'status', required: false, enum: ReportStatus })
  async getMyReports(
    @Request() req: { user: { userId: string } },
    @Query('status') status?: ReportStatus,
  ) {
    return this.reportsService.findByUser(req.user.userId, status);
  }

  @Get(':id')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiResponse({ status: 200, description: 'Report found' })
  @ApiResponse({ status: 404, description: 'Report not found' })
  async findOne(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }

  @Post(':id/generate')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Generate/regenerate a report' })
  @ApiResponse({ status: 200, description: 'Report generation started' })
  @ApiResponse({ status: 400, description: 'Report already generating' })
  async generate(@Param('id') id: string) {
    return this.reportsService.generate(id);
  }

  @Delete(':id')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete a report' })
  async delete(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    await this.reportsService.delete(id, req.user.userId);
    return { success: true };
  }
}
