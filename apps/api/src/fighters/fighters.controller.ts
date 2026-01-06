import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FightersService } from './fighters.service';
import type { CreateFighterDto, UpdateFighterDto, FighterSearchQuery } from './fighters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../common';
import {
  WeightClass,
  Discipline,
  FighterStatus,
  EligibilityStatus,
  VerificationStatus,
} from '@prisma/client';

@ApiTags('fighters')
@Controller('fighters')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class FightersController {
  constructor(private readonly fightersService: FightersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fighter profile' })
  @ApiResponse({ status: 201, description: 'Fighter profile created' })
  @ApiResponse({ status: 409, description: 'User already has a fighter profile' })
  async create(
    @Body() data: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      nickname?: string;
      gender?: string;
      nationality?: string;
      countryOfBirth?: string;
      currentCity?: string;
      currentState?: string;
      currentCountry?: string;
      heightCm?: number;
      reachCm?: number;
      weightClass?: WeightClass;
      disciplines?: Discipline[];
      stance?: string;
      gymId?: string;
      bio?: string;
    },
    @Request() req: { user: { userId: string } },
  ) {
    const dto: CreateFighterDto = {
      ...data,
      userId: req.user.userId,
      dateOfBirth: new Date(data.dateOfBirth),
    };
    return this.fightersService.create(dto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Search fighters' })
  @ApiQuery({ name: 'discipline', required: false, enum: Discipline })
  @ApiQuery({ name: 'weightClass', required: false, enum: WeightClass })
  @ApiQuery({ name: 'status', required: false, enum: FighterStatus })
  @ApiQuery({ name: 'eligibilityStatus', required: false, enum: EligibilityStatus })
  @ApiQuery({ name: 'verificationStatus', required: false, enum: VerificationStatus })
  @ApiQuery({ name: 'gymId', required: false })
  @ApiQuery({ name: 'q', required: false, description: 'Search by name or CombatID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async search(
    @Query('discipline') discipline?: Discipline,
    @Query('weightClass') weightClass?: WeightClass,
    @Query('status') status?: FighterStatus,
    @Query('eligibilityStatus') eligibilityStatus?: EligibilityStatus,
    @Query('verificationStatus') verificationStatus?: VerificationStatus,
    @Query('gymId') gymId?: string,
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: FighterSearchQuery = {
      discipline,
      weightClass,
      status,
      eligibilityStatus,
      verificationStatus,
      gymId,
      q,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.fightersService.search(query);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user fighter profile' })
  @ApiResponse({ status: 200, description: 'Fighter profile found' })
  @ApiResponse({ status: 404, description: 'No fighter profile found' })
  async getMyProfile(@Request() req: { user: { userId: string } }) {
    return this.fightersService.findByUserId(req.user.userId);
  }

  @Get('verify/:combatId')
  @Public()
  @ApiOperation({ summary: 'Verify a Combat ID (public)' })
  @ApiResponse({ status: 200, description: 'Combat ID verification result' })
  async verifyCombatId(@Param('combatId') combatId: string) {
    return this.fightersService.verifyCombatId(combatId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fighter by ID' })
  @ApiResponse({ status: 200, description: 'Fighter found' })
  @ApiResponse({ status: 404, description: 'Fighter not found' })
  async findOne(@Param('id') id: string) {
    return this.fightersService.findById(id);
  }

  @Get('combat-id/:combatId')
  @ApiOperation({ summary: 'Get fighter by CombatID' })
  @ApiResponse({ status: 200, description: 'Fighter found' })
  @ApiResponse({ status: 404, description: 'Fighter not found' })
  async findByCombatId(@Param('combatId') combatId: string) {
    return this.fightersService.findByCombatId(combatId);
  }

  @Get(':id/completion')
  @ApiOperation({ summary: 'Get fighter profile completion score' })
  @ApiResponse({ status: 200, description: 'Profile completion score and missing fields' })
  async getCompletion(@Param('id') id: string) {
    return this.fightersService.getProfileCompletion(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fighter profile' })
  @ApiResponse({ status: 200, description: 'Fighter profile updated' })
  @ApiResponse({ status: 404, description: 'Fighter not found' })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateFighterDto,
    @Request() req: { user: { userId: string } },
  ) {
    return this.fightersService.update(id, data, req.user.userId);
  }

  @Put(':id/verification')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update fighter verification status (Commission only)' })
  @ApiResponse({ status: 200, description: 'Verification status updated' })
  async updateVerification(
    @Param('id') id: string,
    @Body() data: { status: VerificationStatus },
    @Request() req: { user: { userId: string } },
  ) {
    return this.fightersService.updateVerificationStatus(id, data.status, req.user.userId);
  }

  @Put(':id/eligibility')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Update fighter eligibility status (Commission only)' })
  @ApiResponse({ status: 200, description: 'Eligibility status updated' })
  async updateEligibility(
    @Param('id') id: string,
    @Body() data: { status: EligibilityStatus },
    @Request() req: { user: { userId: string } },
  ) {
    return this.fightersService.updateEligibilityStatus(id, data.status, req.user.userId);
  }
}
