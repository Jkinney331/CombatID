import apiClient, { uploadFile } from '../client';

export interface Document {
  id: string;
  fighterId: string;
  type: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  status: string;
  aiProcessed: boolean;
  aiConfidence?: number;
  extractedData?: Record<string, unknown>;
  classifiedType?: string;
  issueDate?: string;
  expirationDate?: string;
  issuingAuthority?: string;
  documentNumber?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  rejectionReason?: string;
  version: number;
  isLatest: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentUploadRequest {
  type: string;
  file: {
    uri: string;
    name: string;
    type: string;
  };
}

export interface DocumentSearchParams {
  type?: string;
  status?: string;
  isLatest?: boolean;
  page?: number;
  limit?: number;
}

export interface DocumentSearchResponse {
  documents: Document[];
  total: number;
  page: number;
  limit: number;
}

export const documentsService = {
  async upload(
    fighterId: string,
    data: DocumentUploadRequest,
    onProgress?: (progress: number) => void
  ): Promise<Document> {
    const result = await uploadFile(
      `/documents/${fighterId}/upload`,
      data.file,
      { type: data.type },
      onProgress
    );
    return result as Document;
  },

  async getMyDocuments(params?: DocumentSearchParams): Promise<DocumentSearchResponse> {
    const response = await apiClient.get<DocumentSearchResponse>('/documents/my', { params });
    return response.data;
  },

  async getByFighter(fighterId: string, params?: DocumentSearchParams): Promise<DocumentSearchResponse> {
    const response = await apiClient.get<DocumentSearchResponse>(`/documents/fighter/${fighterId}`, { params });
    return response.data;
  },

  async getById(id: string): Promise<Document> {
    const response = await apiClient.get<Document>(`/documents/${id}`);
    return response.data;
  },

  async getDownloadUrl(id: string): Promise<{ url: string; expiresAt: string }> {
    const response = await apiClient.get<{ url: string; expiresAt: string }>(`/documents/${id}/download`);
    return response.data;
  },

  async getExpiring(days?: number): Promise<Document[]> {
    const response = await apiClient.get<Document[]>('/documents/expiring', {
      params: { days: days ?? 30 },
    });
    return response.data;
  },

  async getMissingTypes(fighterId: string): Promise<string[]> {
    const response = await apiClient.get<string[]>(`/documents/fighter/${fighterId}/missing`);
    return response.data;
  },

  async reprocess(id: string): Promise<Document> {
    const response = await apiClient.post<Document>(`/documents/${id}/reprocess`);
    return response.data;
  },
};
