import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LicensesService, CreateLicenseDto, LicenseQueryDto } from './licenses.service';
import { LicenseType, LicenseStatus, Discipline } from '@prisma/client';

@Controller('licenses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Post()
  @Roles('COMMISSION_ADMIN', 'COMMISSION_OFFICIAL')
  async create(
    @Body() body: {
      fighterId: string;
      commissionId: string;
      type: LicenseType;
      licenseNumber: string;
      disciplines: Discipline[];
      issuedAt?: string;
      expiresAt?: string;
    },
    @Request() req: { user: { sub: string } },
  ) {
    const dto: CreateLicenseDto = {
      fighterId: body.fighterId,
      commissionId: body.commissionId,
      type: body.type,
      licenseNumber: body.licenseNumber,
      disciplines: body.disciplines,
      issuedAt: body.issuedAt ? new Date(body.issuedAt) : undefined,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    };

    return this.licensesService.create(dto, req.user.sub);
  }

  @Get()
  @Roles('COMMISSION_ADMIN', 'COMMISSION_OFFICIAL', 'PROMOTION_ADMIN', 'MATCHMAKER')
  async findAll(
    @Query('fighterId') fighterId?: string,
    @Query('commissionId') commissionId?: string,
    @Query('type') type?: LicenseType,
    @Query('status') status?: LicenseStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: LicenseQueryDto = {
      fighterId,
      commissionId,
      type,
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };

    return this.licensesService.findAll(query);
  }

  @Get('expiring')
  @Roles('COMMISSION_ADMIN', 'COMMISSION_OFFICIAL')
  async getExpiring(@Query('days') days?: string) {
    const daysThreshold = days ? parseInt(days, 10) : 30;
    return this.licensesService.getExpiring(daysThreshold);
  }

  @Get('verify/:licenseNumber')
  async verifyLicense(
    @Param('licenseNumber') licenseNumber: string,
    @Query('commissionId') commissionId?: string,
  ) {
    return this.licensesService.verifyLicense(licenseNumber, commissionId);
  }

  @Get('fighter/:fighterId')
  async findByFighter(@Param('fighterId') fighterId: string) {
    return this.licensesService.findByFighterId(fighterId);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.licensesService.findById(id);
  }

  @Put(':id/approve')
  @Roles('COMMISSION_ADMIN', 'COMMISSION_OFFICIAL')
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id') id: string,
    @Body() body: { issuedAt: string; expiresAt: string },
    @Request() req: { user: { sub: string } },
  ) {
    return this.licensesService.approve(
      id,
      new Date(body.issuedAt),
      new Date(body.expiresAt),
      req.user.sub,
    );
  }

  @Put(':id/suspend')
  @Roles('COMMISSION_ADMIN', 'COMMISSION_OFFICIAL')
  @HttpCode(HttpStatus.OK)
  async suspend(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Request() req: { user: { sub: string } },
  ) {
    return this.licensesService.suspend(id, body.reason, req.user.sub);
  }

  @Put(':id/revoke')
  @Roles('COMMISSION_ADMIN')
  @HttpCode(HttpStatus.OK)
  async revoke(
    @Param('id') id: string,
    @Body() body: { reason: string },
    @Request() req: { user: { sub: string } },
  ) {
    return this.licensesService.revoke(id, body.reason, req.user.sub);
  }

  @Put(':id/renew')
  @Roles('COMMISSION_ADMIN', 'COMMISSION_OFFICIAL')
  @HttpCode(HttpStatus.OK)
  async renew(
    @Param('id') id: string,
    @Body() body: { expiresAt: string },
    @Request() req: { user: { sub: string } },
  ) {
    return this.licensesService.renew(id, new Date(body.expiresAt), req.user.sub);
  }

  @Post('mark-expired')
  @Roles('COMMISSION_ADMIN', 'SYSTEM')
  @HttpCode(HttpStatus.OK)
  async markExpired() {
    const count = await this.licensesService.markExpired();
    return { markedExpired: count };
  }
}
