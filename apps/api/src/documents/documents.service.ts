import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { AuditService } from '../audit/audit.service';
import {
  Document,
  DocumentType,
  DocumentStatus,
  Prisma,
} from '@prisma/client';

export interface CreateDocumentDto {
  fighterId: string;
  type: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface DocumentQueryDto {
  fighterId?: string;
  type?: DocumentType;
  status?: DocumentStatus;
  page?: number;
  limit?: number;
}

export interface DocumentShareDto {
  documentId: string;
  organizationId: string;
  canView?: boolean;
  canDownload?: boolean;
  expiresAt?: Date;
}

export interface DocumentWithRelations extends Document {
  fighter?: { id: string; combatId: string; firstName: string; lastName: string };
  reviewedBy?: { id: string; firstName: string | null; lastName: string | null } | null;
}

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
    private readonly auditService: AuditService,
  ) {}

  async getUploadUrl(
    fighterId: string,
    documentType: DocumentType,
    fileName: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; fileKey: string; documentId: string }> {
    // Validate fighter exists
    const fighter = await this.prisma.fighter.findUnique({
      where: { id: fighterId },
    });

    if (!fighter) {
      throw new NotFoundException(`Fighter with ID ${fighterId} not found`);
    }

    // Generate file key
    const fileKey = this.storageService.generateFileKey(fighterId, documentType, fileName);

    // Get presigned URL
    const { uploadUrl } = await this.storageService.getUploadUrl(fileKey, contentType);

    // Create document record in pending state
    const document = await this.prisma.document.create({
      data: {
        fighterId,
        type: documentType,
        fileName,
        fileKey,
        fileSize: 0, // Will be updated after upload
        mimeType: contentType,
        status: DocumentStatus.PENDING_UPLOAD,
      },
    });

    return { uploadUrl, fileKey, documentId: document.id };
  }

  async confirmUpload(
    documentId: string,
    fileSize: number,
    checksum?: string,
  ): Promise<Document> {
    const document = await this.prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    if (document.status !== DocumentStatus.PENDING_UPLOAD) {
      throw new BadRequestException('Document is not in pending upload state');
    }

    // Verify file exists in S3
    const metadata = await this.storageService.getFileMetadata(document.fileKey);
    if (!metadata) {
      throw new BadRequestException('File not found in storage');
    }

    return this.prisma.document.update({
      where: { id: documentId },
      data: {
        fileSize: fileSize || metadata.contentLength,
        checksum,
        status: DocumentStatus.UPLOADED,
      },
    });
  }

  async create(dto: CreateDocumentDto, fileKey: string, requesterId?: string): Promise<Document> {
    const document = await this.prisma.document.create({
      data: {
        fighterId: dto.fighterId,
        type: dto.type,
        fileName: dto.fileName,
        fileKey,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        status: DocumentStatus.UPLOADED,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'CREATE',
      entityType: 'Document',
      entityId: document.id,
      newValues: { type: document.type, fileName: document.fileName } as Prisma.JsonObject,
    });

    return document;
  }

  async findById(id: string): Promise<DocumentWithRelations> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: {
        fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
        reviewedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async findByFighterId(fighterId: string, includeDeleted = false): Promise<Document[]> {
    const where: Prisma.DocumentWhereInput = {
      fighterId,
      isLatest: true,
    };

    if (!includeDeleted) {
      where.deletedAt = null;
    }

    return this.prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(query: DocumentQueryDto): Promise<{ documents: DocumentWithRelations[]; total: number; page: number; limit: number }> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.DocumentWhereInput = {
      deletedAt: null,
      isLatest: true,
    };

    if (query.fighterId) {
      where.fighterId = query.fighterId;
    }

    if (query.type) {
      where.type = query.type;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        include: {
          fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
          reviewedBy: { select: { id: true, firstName: true, lastName: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.document.count({ where }),
    ]);

    return { documents, total, page, limit };
  }

  async getPendingReviews(): Promise<DocumentWithRelations[]> {
    return this.prisma.document.findMany({
      where: {
        status: { in: [DocumentStatus.UPLOADED, DocumentStatus.PENDING_REVIEW] },
        deletedAt: null,
      },
      include: {
        fighter: { select: { id: true, combatId: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateStatus(
    id: string,
    status: DocumentStatus,
    reviewData: { reviewedBy: string; reviewNotes?: string; rejectionReason?: string },
  ): Promise<Document> {
    const existing = await this.prisma.document.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const document = await this.prisma.document.update({
      where: { id },
      data: {
        status,
        reviewedById: reviewData.reviewedBy,
        reviewedAt: new Date(),
        reviewNotes: reviewData.reviewNotes,
        rejectionReason: status === DocumentStatus.REJECTED ? reviewData.rejectionReason : null,
      },
    });

    await this.auditService.log({
      userId: reviewData.reviewedBy,
      action: 'REVIEW',
      entityType: 'Document',
      entityId: document.id,
      oldValues: { status: existing.status } as Prisma.JsonObject,
      newValues: { status, reviewNotes: reviewData.reviewNotes } as Prisma.JsonObject,
    });

    return document;
  }

  async updateExtractedData(
    id: string,
    extractedData: Record<string, unknown>,
    confidence: number,
    classifiedType?: DocumentType,
  ): Promise<Document> {
    return this.prisma.document.update({
      where: { id },
      data: {
        aiProcessed: true,
        aiConfidence: confidence,
        extractedData: extractedData as Prisma.JsonObject,
        classifiedType,
        issueDate: extractedData['issueDate'] ? new Date(extractedData['issueDate'] as string) : undefined,
        expirationDate: extractedData['expirationDate'] ? new Date(extractedData['expirationDate'] as string) : undefined,
        issuingAuthority: extractedData['issuingAuthority'] as string | undefined,
        documentNumber: extractedData['documentNumber'] as string | undefined,
        status: confidence >= 85 ? DocumentStatus.PENDING_REVIEW : DocumentStatus.PROCESSING,
      },
    });
  }

  async getDownloadUrl(id: string, requesterId: string): Promise<{ downloadUrl: string }> {
    const document = await this.prisma.document.findUnique({
      where: { id },
      include: { fighter: true },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const { downloadUrl } = await this.storageService.getDownloadUrl(document.fileKey);

    await this.auditService.log({
      userId: requesterId,
      action: 'DOWNLOAD',
      entityType: 'Document',
      entityId: document.id,
    });

    return { downloadUrl };
  }

  async createNewVersion(
    originalId: string,
    dto: CreateDocumentDto,
    fileKey: string,
    requesterId: string,
  ): Promise<Document> {
    const original = await this.prisma.document.findUnique({
      where: { id: originalId },
    });

    if (!original) {
      throw new NotFoundException(`Document with ID ${originalId} not found`);
    }

    // Mark original as not latest
    await this.prisma.document.update({
      where: { id: originalId },
      data: { isLatest: false },
    });

    // Create new version
    const newDocument = await this.prisma.document.create({
      data: {
        fighterId: dto.fighterId,
        type: dto.type,
        fileName: dto.fileName,
        fileKey,
        fileSize: dto.fileSize,
        mimeType: dto.mimeType,
        status: DocumentStatus.UPLOADED,
        version: original.version + 1,
        previousVersionId: originalId,
        isLatest: true,
      },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'VERSION',
      entityType: 'Document',
      entityId: newDocument.id,
      oldValues: { previousVersionId: originalId, version: original.version } as Prisma.JsonObject,
      newValues: { version: newDocument.version } as Prisma.JsonObject,
    });

    return newDocument;
  }

  async softDelete(id: string, requesterId: string): Promise<Document> {
    const document = await this.prisma.document.findUnique({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const updated = await this.prisma.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'DELETE',
      entityType: 'Document',
      entityId: id,
    });

    return updated;
  }

  async shareDocument(dto: DocumentShareDto, sharedById: string): Promise<{ id: string }> {
    const document = await this.prisma.document.findUnique({
      where: { id: dto.documentId },
      include: { fighter: true },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${dto.documentId} not found`);
    }

    const share = await this.prisma.documentShare.create({
      data: {
        documentId: dto.documentId,
        sharedWithOrgId: dto.organizationId,
        sharedById,
        canView: dto.canView ?? true,
        canDownload: dto.canDownload ?? false,
        expiresAt: dto.expiresAt,
      },
    });

    await this.auditService.log({
      userId: sharedById,
      action: 'SHARE',
      entityType: 'Document',
      entityId: dto.documentId,
      newValues: { sharedWithOrgId: dto.organizationId } as Prisma.JsonObject,
    });

    return { id: share.id };
  }

  async revokeShare(shareId: string, requesterId: string): Promise<void> {
    const share = await this.prisma.documentShare.findUnique({
      where: { id: shareId },
    });

    if (!share) {
      throw new NotFoundException(`Share with ID ${shareId} not found`);
    }

    await this.prisma.documentShare.update({
      where: { id: shareId },
      data: { revokedAt: new Date() },
    });

    await this.auditService.log({
      userId: requesterId,
      action: 'REVOKE_SHARE',
      entityType: 'DocumentShare',
      entityId: shareId,
    });
  }

  async getExpiringDocuments(daysThreshold = 30): Promise<Document[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return this.prisma.document.findMany({
      where: {
        expirationDate: {
          lte: thresholdDate,
          gte: new Date(),
        },
        status: DocumentStatus.APPROVED,
        deletedAt: null,
        isLatest: true,
      },
      include: {
        fighter: { select: { id: true, combatId: true, firstName: true, lastName: true, userId: true } },
      },
      orderBy: { expirationDate: 'asc' },
    });
  }

  async getExpiredDocuments(): Promise<Document[]> {
    return this.prisma.document.findMany({
      where: {
        expirationDate: { lt: new Date() },
        status: { not: DocumentStatus.EXPIRED },
        deletedAt: null,
        isLatest: true,
      },
    });
  }

  async markExpired(): Promise<number> {
    const result = await this.prisma.document.updateMany({
      where: {
        expirationDate: { lt: new Date() },
        status: { not: DocumentStatus.EXPIRED },
        deletedAt: null,
      },
      data: { status: DocumentStatus.EXPIRED },
    });

    return result.count;
  }
}
