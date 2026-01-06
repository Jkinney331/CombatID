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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import type { InvitationQueryDto } from './invitations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../common';
import { InvitationStatus, UserRole } from '@prisma/client';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COMMISSION_ADMIN', 'PROMOTION_ADMIN', 'GYM_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new invitation' })
  @ApiResponse({ status: 201, description: 'Invitation created' })
  @ApiResponse({ status: 409, description: 'User or invitation already exists' })
  async create(
    @Body() dto: { email: string; role: UserRole; organizationId?: string },
    @Request() req: { user: { userId: string } },
  ) {
    return this.invitationsService.create({
      ...dto,
      invitedById: req.user.userId,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COMMISSION_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all invitations' })
  @ApiQuery({ name: 'status', required: false, enum: InvitationStatus })
  @ApiQuery({ name: 'organizationId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query() query: InvitationQueryDto) {
    return this.invitationsService.findAll(query);
  }

  @Get('verify/:token')
  @Public()
  @ApiOperation({ summary: 'Verify invitation token (public)' })
  @ApiResponse({ status: 200, description: 'Invitation details' })
  @ApiResponse({ status: 404, description: 'Invitation not found' })
  async verifyToken(@Param('token') token: string) {
    const invitation = await this.invitationsService.findByToken(token);
    // Don't expose the token in the response
    const { token: _token, ...safeInvitation } = invitation;
    return safeInvitation;
  }

  @Post('accept/:token')
  @Public()
  @ApiOperation({ summary: 'Accept an invitation (public)' })
  @ApiResponse({ status: 200, description: 'Invitation accepted, user created' })
  @ApiResponse({ status: 400, description: 'Invalid or expired invitation' })
  async accept(
    @Param('token') token: string,
    @Body() body: { auth0Id: string },
  ) {
    return this.invitationsService.accept(token, body.auth0Id);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COMMISSION_ADMIN', 'PROMOTION_ADMIN', 'GYM_ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an invitation' })
  @ApiResponse({ status: 200, description: 'Invitation cancelled' })
  @ApiResponse({ status: 400, description: 'Cannot cancel non-pending invitation' })
  async cancel(@Param('id') id: string) {
    return this.invitationsService.cancel(id);
  }

  @Post(':id/resend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COMMISSION_ADMIN', 'PROMOTION_ADMIN', 'GYM_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resend an invitation with new token' })
  @ApiResponse({ status: 201, description: 'New invitation created' })
  async resend(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.invitationsService.resend(id, req.user.userId);
  }
}
