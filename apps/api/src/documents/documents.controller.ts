import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DocumentsService, DocumentQueryDto, DocumentShareDto } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { DocumentType, DocumentStatus } from '@prisma/client';

@ApiTags('documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-url')
  @ApiOperation({ summary: 'Get presigned URL for document upload' })
  @ApiResponse({ status: 201, description: 'Upload URL generated' })
  async getUploadUrl(
    @Body() data: {
      fighterId: string;
      documentType: DocumentType;
      fileName: string;
      contentType: string;
    },
  ) {
    return this.documentsService.getUploadUrl(
      data.fighterId,
      data.documentType,
      data.fileName,
      data.contentType,
    );
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm document upload completion' })
  @ApiResponse({ status: 200, description: 'Upload confirmed' })
  async confirmUpload(
    @Param('id') id: string,
    @Body() data: { fileSize: number; checksum?: string },
  ) {
    return this.documentsService.confirmUpload(id, data.fileSize, data.checksum);
  }

  @Get()
  @ApiOperation({ summary: 'List documents with filters' })
  @ApiQuery({ name: 'fighterId', required: false })
  @ApiQuery({ name: 'type', required: false, enum: DocumentType })
  @ApiQuery({ name: 'status', required: false, enum: DocumentStatus })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('fighterId') fighterId?: string,
    @Query('type') type?: DocumentType,
    @Query('status') status?: DocumentStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const query: DocumentQueryDto = {
      fighterId,
      type,
      status,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    };
    return this.documentsService.findAll(query);
  }

  @Get('fighter/:fighterId')
  @ApiOperation({ summary: 'Get all documents for a fighter' })
  @ApiResponse({ status: 200, description: 'Fighter documents' })
  async findByFighter(@Param('fighterId') fighterId: string) {
    return this.documentsService.findByFighterId(fighterId);
  }

  @Get('pending')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Get pending document reviews (Commission only)' })
  @ApiResponse({ status: 200, description: 'Pending reviews' })
  async getPendingReviews() {
    return this.documentsService.getPendingReviews();
  }

  @Get('expiring')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN', 'GYM_ADMIN')
  @ApiOperation({ summary: 'Get documents expiring soon' })
  @ApiQuery({ name: 'days', required: false, type: Number, description: 'Days threshold (default 30)' })
  async getExpiring(@Query('days') days?: string) {
    return this.documentsService.getExpiringDocuments(days ? parseInt(days, 10) : 30);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document by ID' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async findOne(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get presigned download URL' })
  @ApiResponse({ status: 200, description: 'Download URL' })
  async getDownloadUrl(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.documentsService.getDownloadUrl(id, req.user.userId);
  }

  @Put(':id/review')
  @Roles('COMMISSION_ADMIN', 'SUPER_ADMIN')
  @ApiOperation({ summary: 'Review and approve/reject document (Commission only)' })
  @ApiResponse({ status: 200, description: 'Document reviewed' })
  async review(
    @Param('id') id: string,
    @Body() data: { status: DocumentStatus; notes?: string; rejectionReason?: string },
    @Request() req: { user: { userId: string } },
  ) {
    return this.documentsService.updateStatus(id, data.status, {
      reviewedBy: req.user.userId,
      reviewNotes: data.notes,
      rejectionReason: data.rejectionReason,
    });
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Share document with an organization' })
  @ApiResponse({ status: 201, description: 'Document shared' })
  async share(
    @Param('id') id: string,
    @Body() data: { organizationId: string; canView?: boolean; canDownload?: boolean; expiresAt?: string },
    @Request() req: { user: { userId: string } },
  ) {
    const dto: DocumentShareDto = {
      documentId: id,
      organizationId: data.organizationId,
      canView: data.canView,
      canDownload: data.canDownload,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    };
    return this.documentsService.shareDocument(dto, req.user.userId);
  }

  @Delete(':id/share/:shareId')
  @ApiOperation({ summary: 'Revoke document share' })
  @ApiResponse({ status: 200, description: 'Share revoked' })
  async revokeShare(
    @Param('shareId') shareId: string,
    @Request() req: { user: { userId: string } },
  ) {
    await this.documentsService.revokeShare(shareId, req.user.userId);
    return { success: true };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  async delete(
    @Param('id') id: string,
    @Request() req: { user: { userId: string } },
  ) {
    return this.documentsService.softDelete(id, req.user.userId);
  }
}
