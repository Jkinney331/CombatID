import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FightersService, Fighter } from './fighters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, UserRole } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('fighters')
@Controller('fighters')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FightersController {
  constructor(private readonly fightersService: FightersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fighter profile' })
  async create(@Body() data: Partial<Fighter>, @Request() req) {
    return this.fightersService.create({ ...data, userId: req.user.userId });
  }

  @Get()
  @ApiOperation({ summary: 'Search fighters' })
  @ApiQuery({ name: 'discipline', required: false })
  @ApiQuery({ name: 'weightClass', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'q', required: false, description: 'Search by name or CombatID' })
  async search(
    @Query('discipline') discipline?: string,
    @Query('weightClass') weightClass?: string,
    @Query('status') status?: string,
    @Query('q') q?: string,
  ) {
    return this.fightersService.search({ discipline, weightClass, status, q });
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user fighter profile' })
  async getMyProfile(@Request() req) {
    return this.fightersService.findByUserId(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fighter by ID' })
  async findOne(@Param('id') id: string) {
    return this.fightersService.findById(id);
  }

  @Get('combat-id/:combatId')
  @ApiOperation({ summary: 'Get fighter by CombatID' })
  async findByCombatId(@Param('combatId') combatId: string) {
    return this.fightersService.findByCombatId(combatId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fighter profile' })
  async update(@Param('id') id: string, @Body() data: Partial<Fighter>) {
    return this.fightersService.update(id, data);
  }

  @Put(':id/eligibility')
  @Roles(UserRole.COMMISSION, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update fighter eligibility status (Commission only)' })
  async updateEligibility(
    @Param('id') id: string,
    @Body() data: { status: Fighter['eligibilityStatus']; reason?: string },
  ) {
    return this.fightersService.update(id, { eligibilityStatus: data.status });
  }
}
