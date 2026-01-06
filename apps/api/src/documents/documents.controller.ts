import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DocumentsService, DocumentStatus, DocumentType } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, UserRole } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Get presigned URL for document upload' })
  async getUploadUrl(
    @Body() data: { fileName: string; contentType: string },
  ) {
    return this.documentsService.getUploadUrl(data.fileName, data.contentType);
  }

  @Post()
  @ApiOperation({ summary: 'Register uploaded document' })
  async create(@Body() data: {
    fighterId: string;
    type: DocumentType;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }) {
    return this.documentsService.create(data);
  }

  @Get('fighter/:fighterId')
  @ApiOperation({ summary: 'Get all documents for a fighter' })
  async findByFighter(@Param('fighterId') fighterId: string) {
    return this.documentsService.findByFighterId(fighterId);
  }

  @Get('pending')
  @Roles(UserRole.COMMISSION, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get pending document reviews (Commission only)' })
  async getPendingReviews() {
    return this.documentsService.getPendingReviews();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  async findOne(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Put(':id/review')
  @Roles(UserRole.COMMISSION, UserRole.ADMIN)
  @ApiOperation({ summary: 'Review and approve/reject document (Commission only)' })
  async review(
    @Param('id') id: string,
    @Body() data: { status: DocumentStatus; notes?: string },
    @Request() req,
  ) {
    return this.documentsService.updateStatus(id, data.status, {
      reviewedBy: req.user.userId,
      reviewNotes: data.notes,
    });
  }
}
