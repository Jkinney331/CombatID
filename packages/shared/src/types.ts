// User Roles
export enum UserRole {
  FIGHTER = 'fighter',
  GYM = 'gym',
  PROMOTION = 'promotion',
  COMMISSION = 'commission',
  SPONSOR = 'sponsor',
  ADMIN = 'admin',
}

// Verification Status
export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

// Eligibility Status
export enum EligibilityStatus {
  ELIGIBLE = 'eligible',
  CONDITIONAL = 'conditional',
  INCOMPLETE = 'incomplete',
  EXPIRED = 'expired',
  UNDER_REVIEW = 'under_review',
  SUSPENDED = 'suspended',
}

// Document Types
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

// Document Status
export enum DocumentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}

// Organization Types
export enum OrganizationType {
  GYM = 'gym',
  PROMOTION = 'promotion',
  COMMISSION = 'commission',
}

// Event Status
export enum EventStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Bout Status
export enum BoutStatus {
  PENDING = 'pending',
  SIGNED = 'signed',
  APPROVED = 'approved',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Weight Classes
export const WEIGHT_CLASSES = [
  'Strawweight',
  'Flyweight',
  'Bantamweight',
  'Featherweight',
  'Lightweight',
  'Welterweight',
  'Middleweight',
  'Light Heavyweight',
  'Heavyweight',
] as const;

export type WeightClass = typeof WEIGHT_CLASSES[number];

// Disciplines
export const DISCIPLINES = [
  'MMA',
  'Boxing',
  'Muay Thai',
  'Kickboxing',
  'BJJ',
  'Wrestling',
  'Judo',
  'Karate',
  'Taekwondo',
] as const;

export type Discipline = typeof DISCIPLINES[number];

// Fighter Interface
export interface Fighter {
  id: string;
  combatId: string;
  userId: string;
  name: string;
  dateOfBirth: Date;
  countryOfBirth: string;
  currentResidence: string;
  weightClass: WeightClass;
  disciplines: Discipline[];
  record: string;
  gym?: string;
  verificationStatus: VerificationStatus;
  eligibilityStatus: EligibilityStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Document Interface
export interface Document {
  id: string;
  fighterId: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  status: DocumentStatus;
  extractedData?: Record<string, unknown>;
  aiConfidence?: number;
  issueDate?: Date;
  expirationDate?: Date;
  provider?: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

// Organization Interface
export interface Organization {
  id: string;
  type: OrganizationType;
  name: string;
  description?: string;
  logoUrl?: string;
  location: string;
  jurisdiction?: string;
  verificationStatus: VerificationStatus;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Event Interface
export interface Event {
  id: string;
  promotionId: string;
  commissionId?: string;
  name: string;
  eventName: string;
  date: Date;
  location: string;
  type: string;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Bout Interface
export interface Bout {
  id: string;
  eventId: string;
  fighterAId: string;
  fighterBId: string;
  weightClass: WeightClass;
  rounds: number;
  position: number;
  status: BoutStatus;
  fighterASignedAt?: Date;
  fighterBSignedAt?: Date;
  result?: BoutResult;
}

export interface BoutResult {
  winner?: string;
  method: string;
  round?: number;
  time?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
