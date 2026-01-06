import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SuspensionsService, CreateSuspensionDto, SuspensionQueryDto } from './suspensions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { SuspensionType, SuspensionStatus } from '@prisma/client';

@ApiTags('suspensions')
@Controller('suspensions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SuspensionsController {
  constructor(private readonly suspensionsService: SuspensionsService) {}

  @Post()
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a new medical suspension (Commission only)' })
  @ApiResponse({ status: 201, description: 'Suspension created' })
  async create(
    @Body() data: {
      fighterId: string;
      commissionId: string;
      type?: SuspensionType;
      reason: string;
      description?: string;
      startDate: string;
      endDate?: string;
      minimumDays?: number;
      requiresClearance?: boolean;
      clearanceType?: string;
      isNational?: boolean;
    },
    @Request() req: { user: { userId: string } },
  ) {
    const dto: CreateSuspensionDto = {
      ...data,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    };
    return this.suspensionsService.create(dto, req.user.userId);
  }

  @Get()
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'List suspensions with filters' })
  @ApiQuery({ name: 'fighterId', required: false })
  @ApiQuery({ name: 'commissionId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: SuspensionStatus })
  @ApiQuery({ name: 'type', required: false, enum: SuspensionType })
  @ApiQuery({ name: 'isNational', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('fighterId') fighterId?: string,
    @Query('commissionId') commissionId?: string,
    @Query('status') status?: SuspensionStatus,
    @Query('type') type?: SuspensionType,
    @Query('isNational') isNational?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: SuspensionQueryDto = {
      fighterId,
      commissionId,
      status,
      type,
      isNational: isNational === 'true' ? true : isNational === 'false' ? false : undefined,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.suspensionsService.findAll(query);
  }

  @Get('national')
  @ApiOperation({ summary: 'Get all national suspensions' })
  @ApiResponse({ status: 200, description: 'National suspensions' })
  async getNational() {
    return this.suspensionsService.getNationalSuspensions();
  }

  @Get('fighter/:fighterId')
  @ApiOperation({ summary: 'Get suspensions for a fighter' })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  async findByFighter(
    @Param('fighterId') fighterId: string,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.suspensionsService.findByFighterId(fighterId, activeOnly === 'true');
  }

  @Get('check/:fighterId')
  @ApiOperation({ summary: 'Check if fighter is suspended' })
  @ApiQuery({ name: 'commissionId', required: false })
  async checkSuspension(
    @Param('fighterId') fighterId: string,
    @Query('commissionId') commissionId?: string,
  ) {
    return this.suspensionsService.checkFighterSuspension(fighterId, commissionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get suspension by ID' })
  @ApiResponse({ status: 200, description: 'Suspension found' })
  @ApiResponse({ status: 404, description: 'Suspension not found' })
  async findOne(@Param('id') id: string) {
    return this.suspensionsService.findById(id);
  }

  @Put(':id/lift')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Lift a suspension (Commission only)' })
  @ApiResponse({ status: 200, description: 'Suspension lifted' })
  async lift(
    @Param('id') id: string,
    @Body() data: { notes?: string },
    @Request() req: { user: { userId: string } },
  ) {
    return this.suspensionsService.lift(id, req.user.userId, data.notes);
  }

  @Put(':id/extend')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Extend a suspension (Commission only)' })
  @ApiResponse({ status: 200, description: 'Suspension extended' })
  async extend(
    @Param('id') id: string,
    @Body() data: { endDate: string; reason: string },
    @Request() req: { user: { userId: string } },
  ) {
    return this.suspensionsService.extend(id, new Date(data.endDate), data.reason, req.user.userId);
  }
}
