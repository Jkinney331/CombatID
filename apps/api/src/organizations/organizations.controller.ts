import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OrganizationsService, OrganizationType } from './organizations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('organizations')
@Controller('organizations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new organization' })
  async create(@Body() data: {
    type: OrganizationType;
    name: string;
    description?: string;
    location: string;
    jurisdiction?: string;
  }, @Request() req) {
    return this.organizationsService.create({ ...data, ownerId: req.user.userId });
  }

  @Get()
  @ApiOperation({ summary: 'Get all organizations' })
  @ApiQuery({ name: 'type', required: false, enum: OrganizationType })
  async findAll(@Query('type') type?: OrganizationType) {
    return this.organizationsService.findAll(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  async findOne(@Param('id') id: string) {
    return this.organizationsService.findById(id);
  }

  @Post(':id/roster/:fighterId')
  @ApiOperation({ summary: 'Add fighter to organization roster' })
  async addFighterToRoster(
    @Param('id') id: string,
    @Param('fighterId') fighterId: string,
  ) {
    return this.organizationsService.addFighterToRoster(id, fighterId);
  }

  @Delete(':id/roster/:fighterId')
  @ApiOperation({ summary: 'Remove fighter from organization roster' })
  async removeFighterFromRoster(
    @Param('id') id: string,
    @Param('fighterId') fighterId: string,
  ) {
    return this.organizationsService.removeFighterFromRoster(id, fighterId);
  }
}
