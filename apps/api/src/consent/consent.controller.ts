import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ConsentService, CONSENT_VERSIONS, REQUIRED_CONSENTS } from './consent.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ConsentType } from '@prisma/client';
import type { Request as ExpressRequest } from 'express';

@ApiTags('consent')
@Controller('consent')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  @Get('status')
  @ApiOperation({ summary: 'Get consent status for all types' })
  @ApiResponse({ status: 200, description: 'Consent status for all types' })
  async getStatus(@Request() req: { user: { userId: string } }) {
    return this.consentService.getConsentStatus(req.user.userId);
  }

  @Get('required')
  @ApiOperation({ summary: 'Get required consent types and versions' })
  async getRequired() {
    return {
      required: REQUIRED_CONSENTS,
      versions: CONSENT_VERSIONS,
    };
  }

  @Get('missing')
  @ApiOperation({ summary: 'Get missing required consents' })
  async getMissing(@Request() req: { user: { userId: string } }) {
    return this.consentService.getMissingConsents(req.user.userId);
  }

  @Post('grant')
  @ApiOperation({ summary: 'Grant consent' })
  @ApiResponse({ status: 201, description: 'Consent granted' })
  async grantConsent(
    @Request() req: { user: { userId: string } },
    @Req() expressReq: ExpressRequest,
    @Body() body: { type: ConsentType; granted: boolean },
  ) {
    return this.consentService.grantConsent({
      userId: req.user.userId,
      type: body.type,
      granted: body.granted,
      ipAddress: expressReq.ip,
      userAgent: expressReq.headers['user-agent'],
    });
  }

  @Post('grant-bulk')
  @ApiOperation({ summary: 'Grant multiple consents at once' })
  @ApiResponse({ status: 201, description: 'Consents granted' })
  async grantBulkConsents(
    @Request() req: { user: { userId: string } },
    @Req() expressReq: ExpressRequest,
    @Body() body: { types: ConsentType[] },
  ) {
    return this.consentService.grantBulkConsents(
      req.user.userId,
      body.types,
      expressReq.ip,
      expressReq.headers['user-agent'],
    );
  }

  @Put('revoke/:type')
  @ApiOperation({ summary: 'Revoke consent' })
  @ApiResponse({ status: 200, description: 'Consent revoked' })
  @ApiResponse({ status: 400, description: 'Cannot revoke required consent' })
  async revokeConsent(
    @Request() req: { user: { userId: string } },
    @Param('type') type: ConsentType,
  ) {
    return this.consentService.revokeConsent(req.user.userId, type);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get consent history' })
  async getHistory(@Request() req: { user: { userId: string } }) {
    return this.consentService.getConsentHistory(req.user.userId);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export user data (GDPR compliance)' })
  @ApiResponse({ status: 200, description: 'User data export' })
  async exportData(@Request() req: { user: { userId: string } }) {
    return this.consentService.exportUserData(req.user.userId);
  }

  @Post('delete-request')
  @ApiOperation({ summary: 'Request data deletion (GDPR right to be forgotten)' })
  @ApiResponse({ status: 200, description: 'Deletion request submitted' })
  async requestDeletion(@Request() req: { user: { userId: string } }) {
    return this.consentService.requestDataDeletion(req.user.userId);
  }
}
