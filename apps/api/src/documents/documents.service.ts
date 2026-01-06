import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export enum DocumentType {
  BLOOD_TEST = 'blood_test',
  PHYSICAL = 'physical',
  EYE_EXAM = 'eye_exam',
  MRI = 'mri',
  EKG = 'ekg',
  DRUG_TEST = 'drug_test',
  LICENSE = 'license',
  INSURANCE = 'insurance',
  OTHER = 'other',
}

export enum DocumentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

export interface Document {
  id: string;
  fighterId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: DocumentStatus;
  extractedData?: Record<string, any>;
  aiConfidence?: number;
  issueDate?: Date;
  expirationDate?: Date;
  provider?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class DocumentsService {
  // TODO: Replace with Prisma + S3 implementation
  private documents: Document[] = [];

  async create(data: Partial<Document>): Promise<Document> {
    const doc: Document = {
      id: uuidv4(),
      fighterId: data.fighterId!,
      type: data.type!,
      fileName: data.fileName!,
      fileUrl: data.fileUrl!,
      fileSize: data.fileSize!,
      mimeType: data.mimeType!,
      status: DocumentStatus.PENDING,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.push(doc);
    return doc;
  }

  async findByFighterId(fighterId: string): Promise<Document[]> {
    return this.documents.filter(d => d.fighterId === fighterId);
  }

  async findById(id: string): Promise<Document | null> {
    return this.documents.find(d => d.id === id) || null;
  }

  async updateStatus(id: string, status: DocumentStatus, reviewData?: {
    reviewedBy?: string;
    reviewNotes?: string;
  }): Promise<Document | null> {
    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) return null;

    this.documents[index] = {
      ...this.documents[index],
      status,
      reviewedBy: reviewData?.reviewedBy,
      reviewedAt: new Date(),
      reviewNotes: reviewData?.reviewNotes,
      updatedAt: new Date(),
    };
    return this.documents[index];
  }

  async updateExtractedData(id: string, extractedData: Record<string, any>, confidence: number): Promise<Document | null> {
    const index = this.documents.findIndex(d => d.id === id);
    if (index === -1) return null;

    this.documents[index] = {
      ...this.documents[index],
      extractedData,
      aiConfidence: confidence,
      status: confidence >= 90 ? DocumentStatus.PROCESSING : DocumentStatus.PENDING,
      issueDate: extractedData.issueDate ? new Date(extractedData.issueDate) : undefined,
      expirationDate: extractedData.expirationDate ? new Date(extractedData.expirationDate) : undefined,
      provider: extractedData.provider,
      updatedAt: new Date(),
    };
    return this.documents[index];
  }

  async getUploadUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; fileKey: string }> {
    // TODO: Implement S3 presigned URL generation
    const fileKey = `documents/${uuidv4()}/${fileName}`;
    return {
      uploadUrl: `https://s3.amazonaws.com/combatid-documents/${fileKey}?presigned=true`,
      fileKey,
    };
  }

  async getPendingReviews(): Promise<Document[]> {
    return this.documents.filter(d =>
      d.status === DocumentStatus.PENDING || d.status === DocumentStatus.PROCESSING
    );
  }
}
