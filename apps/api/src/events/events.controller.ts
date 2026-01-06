import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { EventsService, Event, Bout } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, UserRole } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles(UserRole.PROMOTION, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new event' })
  async create(@Body() data: Partial<Event>) {
    return this.eventsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }

  @Post(':id/bouts')
  @Roles(UserRole.PROMOTION, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add a bout to event' })
  async addBout(
    @Param('id') id: string,
    @Body() data: Partial<Bout>,
  ) {
    return this.eventsService.addBout(id, data);
  }

  @Put(':id/status')
  @Roles(UserRole.COMMISSION, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update event status (Commission only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: Event['status'] },
  ) {
    return this.eventsService.updateEventStatus(id, data.status);
  }

  @Post(':eventId/bouts/:boutId/sign')
  @Roles(UserRole.FIGHTER)
  @ApiOperation({ summary: 'Sign bout agreement (Fighter only)' })
  async signBout(
    @Param('eventId') eventId: string,
    @Param('boutId') boutId: string,
    @Request() req,
  ) {
    return this.eventsService.signBout(eventId, boutId, req.user.combatId);
  }
}
