import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { EligibilityService, EligibilityStatus, Requirement } from './eligibility.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, UserRole } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('eligibility')
@Controller('eligibility')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Get('rulesets')
  @ApiOperation({ summary: 'Get rulesets for a commission' })
  @ApiQuery({ name: 'commissionId', required: true })
  async getRulesets(@Query('commissionId') commissionId: string) {
    return this.eligibilityService.getRulesets(commissionId);
  }

  @Get('rulesets/:commissionId/:discipline')
  @ApiOperation({ summary: 'Get specific ruleset' })
  async getRuleset(
    @Param('commissionId') commissionId: string,
    @Param('discipline') discipline: string,
  ) {
    return this.eligibilityService.getRuleset(commissionId, discipline);
  }

  @Post('rulesets')
  @Roles(UserRole.COMMISSION, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new ruleset (Commission only)' })
  async createRuleset(@Body() data: {
    commissionId: string;
    discipline: string;
    requirements: Requirement[];
  }) {
    return this.eligibilityService.createRuleset(data);
  }

  @Put('rulesets/:id')
  @Roles(UserRole.COMMISSION, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update ruleset requirements (Commission only)' })
  async updateRuleset(
    @Param('id') id: string,
    @Body() data: { requirements: Requirement[] },
  ) {
    return this.eligibilityService.updateRuleset(id, data.requirements);
  }

  @Post('check')
  @ApiOperation({ summary: 'Check fighter eligibility' })
  async checkEligibility(@Body() data: {
    fighterId: string;
    commissionId: string;
    discipline: string;
    documents: { type: string; expiresAt?: string; verified: boolean }[];
  }) {
    const documents = data.documents.map(d => ({
      ...d,
      expiresAt: d.expiresAt ? new Date(d.expiresAt) : undefined,
    }));
    return this.eligibilityService.checkEligibility(
      data.fighterId,
      data.commissionId,
      data.discipline,
      documents,
    );
  }

  @Post('override')
  @Roles(UserRole.COMMISSION, UserRole.ADMIN)
  @ApiOperation({ summary: 'Override fighter eligibility (Commission only)' })
  async overrideEligibility(@Body() data: {
    fighterId: string;
    status: EligibilityStatus;
    overrideBy: string;
    reason: string;
  }) {
    return this.eligibilityService.overrideEligibility(
      data.fighterId,
      data.status,
      data.overrideBy,
      data.reason,
    );
  }
}
