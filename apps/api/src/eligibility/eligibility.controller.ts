import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  EligibilityService,
  CreateRulesetDto,
  CreateRequirementDto,
} from './eligibility.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Discipline, DocumentType, EligibilityStatus } from '@prisma/client';

@Controller('eligibility')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  // =========================================================================
  // RULESET MANAGEMENT
  // =========================================================================

  @Get('rulesets')
  async getRulesets(@Query('commissionId') commissionId: string) {
    return this.eligibilityService.getRulesets(commissionId);
  }

  @Get('rulesets/:id')
  async getRulesetById(@Param('id') id: string) {
    return this.eligibilityService.getRulesetById(id);
  }

  @Get('rulesets/:commissionId/:discipline')
  async getRuleset(
    @Param('commissionId') commissionId: string,
    @Param('discipline') discipline: Discipline,
  ) {
    return this.eligibilityService.getRuleset(commissionId, discipline);
  }

  @Post('rulesets')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  async createRuleset(
    @Body()
    body: {
      commissionId: string;
      discipline: Discipline;
      name: string;
      description?: string;
      requirements: {
        name: string;
        description?: string;
        documentType: DocumentType;
        isRequired?: boolean;
        expirationDays?: number;
        condition?: string;
        conditionDescription?: string;
        sortOrder?: number;
      }[];
    },
    @Request() req: { user: { sub: string } },
  ) {
    const dto: CreateRulesetDto = {
      commissionId: body.commissionId,
      discipline: body.discipline,
      name: body.name,
      description: body.description,
      requirements: body.requirements,
    };

    return this.eligibilityService.createRuleset(dto, req.user.sub);
  }

  @Put('rulesets/:id')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  async updateRuleset(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string },
    @Request() req: { user: { sub: string } },
  ) {
    return this.eligibilityService.updateRuleset(id, body, req.user.sub);
  }

  @Put('rulesets/:id/requirements')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  async updateRequirements(
    @Param('id') id: string,
    @Body()
    body: {
      requirements: CreateRequirementDto[];
    },
    @Request() req: { user: { sub: string } },
  ) {
    return this.eligibilityService.updateRequirements(
      id,
      body.requirements,
      req.user.sub,
    );
  }

  @Post('rulesets/seed')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  async seedDefaultRulesets(
    @Body() body: { commissionId: string },
    @Request() req: { user: { sub: string } },
  ) {
    return this.eligibilityService.seedDefaultRulesets(
      body.commissionId,
      req.user.sub,
    );
  }

  // =========================================================================
  // ELIGIBILITY CHECKING
  // =========================================================================

  @Post('check')
  @HttpCode(HttpStatus.OK)
  async checkEligibility(
    @Body() body: { fighterId: string; rulesetId: string },
  ) {
    return this.eligibilityService.checkEligibility(
      body.fighterId,
      body.rulesetId,
    );
  }

  @Get('history/:fighterId')
  async getEligibilityHistory(@Param('fighterId') fighterId: string) {
    return this.eligibilityService.getEligibilityHistory(fighterId);
  }

  @Post('override')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  async overrideEligibility(
    @Body()
    body: {
      fighterId: string;
      status: EligibilityStatus;
      reason: string;
    },
    @Request() req: { user: { sub: string } },
  ) {
    return this.eligibilityService.overrideEligibility(
      body.fighterId,
      body.status,
      req.user.sub,
      body.reason,
    );
  }
}
