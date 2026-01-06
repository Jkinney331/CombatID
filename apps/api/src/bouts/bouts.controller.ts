import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BoutsService } from './bouts.service';
import type { CreateBoutDto, UpdateBoutDto, RecordResultDto } from './bouts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { WeightClass, Discipline, BoutResult } from '@prisma/client';

@ApiTags('bouts')
@Controller('bouts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BoutsController {
  constructor(private readonly boutsService: BoutsService) {}

  @Post()
  @Roles('PROMOTION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a new bout' })
  @ApiResponse({ status: 201, description: 'Bout created successfully' })
  @ApiResponse({ status: 400, description: 'Event not in draft status' })
  @ApiResponse({ status: 409, description: 'Fighter already on card' })
  async create(
    @Body() data: {
      eventId: string;
      fighterAId: string;
      fighterBId: string;
      weightClass: WeightClass;
      discipline: Discipline;
      rounds?: number;
      roundMinutes?: number;
      isMainEvent?: boolean;
      isCoMain?: boolean;
      boutOrder?: number;
    },
    @Request() req: { user: { userId: string } },
  ) {
    const dto: CreateBoutDto = data;
    return this.boutsService.create(dto, req.user.userId);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all bouts for an event' })
  async findByEvent(@Param('eventId') eventId: string) {
    return this.boutsService.findByEvent(eventId);
  }

  @Get('fighter/:fighterId')
  @ApiOperation({ summary: 'Get all bouts for a fighter' })
  async findByFighter(@Param('fighterId') fighterId: string) {
    return this.boutsService.findByFighter(fighterId);
  }

  @Get('event/:eventId/unsigned')
  @Roles('PROMOTION_ADMIN', 'COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get unsigned bouts for an event' })
  async getUnsignedBouts(@Param('eventId') eventId: string) {
    return this.boutsService.getUnsignedBouts(eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bout by ID' })
  @ApiResponse({ status: 200, description: 'Bout found' })
  @ApiResponse({ status: 404, description: 'Bout not found' })
  async findOne(@Param('id') id: string) {
    return this.boutsService.findById(id);
  }

  @Put(':id')
  @Roles('PROMOTION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update bout details' })
  @ApiResponse({ status: 200, description: 'Bout updated' })
  @ApiResponse({ status: 400, description: 'Event not in draft status' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateBoutDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.boutsService.update(id, data, req.user.userId);
  }

  @Put(':id/sign')
  @Roles('FIGHTER')
  @ApiOperation({ summary: 'Sign bout agreement (Fighter only)' })
  @ApiResponse({ status: 200, description: 'Bout signed' })
  @ApiResponse({ status: 400, description: 'Fighter not in bout or already signed' })
  async signBout(
    @Param('id') id: string,
    @Body() data: { fighterId: string },
    @Request() req: { user: { userId: string } },
  ) {
    return this.boutsService.signBout(id, data.fighterId, req.user.userId);
  }

  @Put(':id/result')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Record bout result (Commission only)' })
  @ApiResponse({ status: 200, description: 'Result recorded' })
  @ApiResponse({ status: 400, description: 'Event not approved or bout already completed' })
  async recordResult(
    @Param('id') id: string,
    @Body() data: {
      winnerId?: string;
      result: BoutResult;
      resultRound?: number;
      resultTime?: string;
      resultNotes?: string;
    },
    @Request() req: { user: { userId: string } },
  ) {
    const dto: RecordResultDto = data;
    return this.boutsService.recordResult(id, dto, req.user.userId);
  }

  @Put(':id/cancel')
  @Roles('PROMOTION_ADMIN', 'COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Cancel bout' })
  @ApiResponse({ status: 200, description: 'Bout cancelled' })
  @ApiResponse({ status: 400, description: 'Cannot cancel completed bout' })
  async cancel(
    @Param('id') id: string,
    @Body() data: { reason: string },
    @Request() req: { user: { userId: string } },
  ) {
    return this.boutsService.cancel(id, data.reason, req.user.userId);
  }

  @Put('event/:eventId/reorder')
  @Roles('PROMOTION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Reorder bouts on a card' })
  @ApiResponse({ status: 200, description: 'Bouts reordered' })
  @ApiResponse({ status: 400, description: 'Event not in draft status' })
  async reorderBouts(
    @Param('eventId') eventId: string,
    @Body() data: { boutIds: string[] },
    @Request() req: { user: { userId: string } },
  ) {
    await this.boutsService.reorderBouts(eventId, data.boutIds, req.user.userId);
    return { success: true };
  }
}
