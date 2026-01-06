import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createHash } from 'crypto';
import { nanoid } from 'nanoid';

export interface UploadUrlResult {
  uploadUrl: string;
  fileKey: string;
  expiresIn: number;
}

export interface DownloadUrlResult {
  downloadUrl: string;
  expiresIn: number;
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly cdnUrl?: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION', 'us-east-1');
    const endpoint = this.configService.get<string>('AWS_S3_ENDPOINT'); // For MinIO local dev

    this.s3Client = new S3Client({
      region,
      endpoint,
      forcePathStyle: !!endpoint, // Required for MinIO
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      },
    });

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET', 'combatid-documents');
    this.cdnUrl = this.configService.get<string>('CDN_URL');
  }

  generateFileKey(fighterId: string, documentType: string, fileName: string): string {
    const timestamp = Date.now();
    const uniqueId = nanoid(8);
    const ext = fileName.split('.').pop() || 'bin';
    const sanitizedType = documentType.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `fighters/${fighterId}/${sanitizedType}/${timestamp}-${uniqueId}.${ext}`;
  }

  async getUploadUrl(
    fileKey: string,
    contentType: string,
    expiresInSeconds = 3600,
  ): Promise<UploadUrlResult> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    return {
      uploadUrl,
      fileKey,
      expiresIn: expiresInSeconds,
    };
  }

  async getDownloadUrl(fileKey: string, expiresInSeconds = 3600): Promise<DownloadUrlResult> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });

    const downloadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: expiresInSeconds,
    });

    return {
      downloadUrl,
      expiresIn: expiresInSeconds,
    };
  }

  async getFileMetadata(fileKey: string): Promise<{
    contentType: string;
    contentLength: number;
    lastModified: Date;
    etag: string;
  } | null> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      const response = await this.s3Client.send(command);

      return {
        contentType: response.ContentType ?? 'application/octet-stream',
        contentLength: response.ContentLength ?? 0,
        lastModified: response.LastModified ?? new Date(),
        etag: response.ETag ?? '',
      };
    } catch (error) {
      this.logger.warn(`File not found: ${fileKey}`, error);
      return null;
    }
  }

  async deleteFile(fileKey: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileKey,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete file: ${fileKey}`, error);
      return false;
    }
  }

  async copyFile(sourceKey: string, destinationKey: string): Promise<boolean> {
    try {
      // Get the source file
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: sourceKey,
      });

      const response = await this.s3Client.send(getCommand);

      // Upload to new location
      const putCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: destinationKey,
        Body: response.Body,
        ContentType: response.ContentType,
      });

      await this.s3Client.send(putCommand);
      return true;
    } catch (error) {
      this.logger.error(`Failed to copy file from ${sourceKey} to ${destinationKey}`, error);
      return false;
    }
  }

  calculateChecksum(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  getPublicUrl(fileKey: string): string {
    if (this.cdnUrl) {
      return `${this.cdnUrl}/${fileKey}`;
    }
    return `https://${this.bucketName}.s3.amazonaws.com/${fileKey}`;
  }
}
