// API Endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
export const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000/api/v1';

// Auth
export const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || '';
export const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || '';
export const AUTH0_AUDIENCE = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE || '';

// Document expiration defaults (in days)
export const DOCUMENT_EXPIRATION_DEFAULTS = {
  blood_test: 180, // 6 months for HIV
  physical: 365,
  eye_exam: 365,
  mri: 365,
  ekg: 365,
  drug_test: 90,
  license: 365,
  insurance: 365,
  other: 365,
} as const;

// Commission medical suspension periods (in days)
export const MEDICAL_SUSPENSION_PERIODS = {
  knockout_loss: 30,
  tko_loss: 21,
  submission_loss: 14,
  decision_loss: 7,
} as const;

// File upload limits
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
