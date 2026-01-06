# CombatID Development Tickets

## Project Overview

**CombatID** is a digital health, compliance, and identity platform for combat sports. The platform serves three primary user groups through dedicated portals:

- **Commission Portal** (Blue) - Athletic commission oversight and regulatory compliance
- **Promotion Portal** (Lime) - Event management and fighter recruitment
- **Gym Portal** (Orange) - Fighter training management and opportunity discovery

### Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend API | NestJS, TypeScript, Prisma, PostgreSQL |
| AI Service | Python, FastAPI, AWS Textract, OpenAI/Anthropic |
| Mobile | React Native / Expo |
| Infrastructure | AWS (ECS Fargate, S3, RDS), Terraform |
| Authentication | Auth0 |

---

# Phased Development Plan

## Phase 0: Foundation (Weeks 1-2)
**Focus**: Infrastructure, scaffolding, and development environment setup

### E1-008: NestJS API Scaffolding ✅ COMPLETE
**Priority**: P0 | **Points**: 5

- [x] Initialize NestJS application with TypeScript
- [x] Configure structured logging with Pino
- [x] Set up global exception filter
- [x] Create common module (interceptors, guards, decorators)
- [x] Create audit module for logging
- [x] Configure environment validation with Joi
- [x] Add health check endpoints (`/health`)
- [x] Create Prisma schema with base models (User, Organization)
- [x] Create `.env.example` with all configuration variables
- [x] Enable TypeScript strict mode
- [x] Update `app.module.ts` with all integrations
- [x] Update `main.ts` with complete bootstrap
- [x] Create comprehensive README.md
- [x] Verify API compiles and runs

**Files Created/Modified**:
- `apps/api/src/common/` - Filters, interceptors, guards, decorators
- `apps/api/src/audit/` - Audit logging module
- `apps/api/src/config/` - Configuration and validation
- `apps/api/src/health/` - Health check endpoints
- `apps/api/src/prisma/` - Prisma service
- `apps/api/prisma/schema.prisma` - Database schema
- `apps/api/.env.example` - Environment template
- `apps/api/README.md` - API documentation

### E1-009: Python AI Service Scaffolding ✅ COMPLETE
**Priority**: P0 | **Points**: 5

- [x] Create FastAPI application structure
- [x] Configure pydantic-settings for configuration
- [x] Set up structured JSON logging
- [x] Create custom exception hierarchy
- [x] Create Pydantic models for documents and extraction
- [x] Create API routes (health, documents, extraction)
- [x] Create service stubs (Textract, OpenAI, classifier, extractor)
- [x] Create API dependencies module
- [x] Create `pyproject.toml` and `requirements.txt`
- [x] Create Dockerfile (multi-stage build)
- [x] Create `.env.example`
- [x] Create comprehensive test suite
- [x] Create README.md and SETUP.md
- [x] Create Makefile for development commands
- [x] Verify setup with `verify_setup.py`

**Files Created**:
- `services/ai/app/` - Main application package
- `services/ai/app/api/routes/` - API endpoints
- `services/ai/app/services/` - Service layer
- `services/ai/app/models/` - Pydantic models
- `services/ai/app/core/` - Logging, exceptions
- `services/ai/tests/` - Test suite
- `services/ai/Dockerfile` - Docker configuration
- `services/ai/pyproject.toml` - Poetry dependencies
- `services/ai/README.md` - Service documentation

### E1-012: Event Infrastructure ✅ COMPLETE
**Priority**: P0 | **Points**: 3

- [x] Set up PostgreSQL development database
- [x] Configure Prisma migrations
- [x] Create development Docker Compose
- [x] Set up local S3 (MinIO) for document storage
- [x] Configure Auth0 development tenant

**Files Created**:
- `docker-compose.yml` - PostgreSQL, Redis, MinIO, API, AI service
- `infrastructure/init-db.sql` - Database initialization
- `apps/api/Dockerfile.dev` - Development Dockerfile
- `scripts/setup-dev.sh` - Development setup script
- `docs/AUTH0_SETUP.md` - Auth0 configuration guide
- `.env.example` - Updated environment template

---

## Phase 1: Identity & Access (Weeks 3-4)
**Focus**: Authentication, authorization, user management

### E2-001: Auth0 Integration ✅ COMPLETE
**Priority**: P0 | **Points**: 8

- [x] Configure Auth0 tenant and applications
- [x] Implement JWT strategy in NestJS
- [x] Create Auth module with guards
- [x] Implement token refresh mechanism
- [x] Add social login providers (Google, Apple) - Configured in Auth0
- [x] Create user sync from Auth0 to database

**Files Created/Modified**:
- `apps/api/src/auth/strategies/jwt.strategy.ts` - JWT validation with user sync
- `apps/api/src/auth/auth.module.ts` - Auth module with passport-jwt
- `apps/api/src/auth/guards/jwt-auth.guard.ts` - JWT authentication guard

### E2-002: Role-Based Access Control (RBAC) ✅ COMPLETE
**Priority**: P0 | **Points**: 5

- [x] Define role hierarchy (SuperAdmin, CommissionAdmin, PromotionAdmin, GymAdmin, Fighter, Doctor, Official)
- [x] Create RBAC guard with decorator support
- [x] Implement permission checking middleware
- [x] Create organization-scoped permissions
- [x] Add role assignment API endpoints

**Files Created/Modified**:
- `apps/api/src/auth/guards/roles.guard.ts` - RolesGuard with hierarchy, OrganizationGuard
- `apps/api/src/auth/decorators/roles.decorator.ts` - @Roles() decorator

### E2-003: User Management ✅ COMPLETE
**Priority**: P1 | **Points**: 5

- [x] Create user CRUD endpoints
- [x] Implement user profile management
- [x] Add user search and filtering
- [x] Create user invitation system
- [x] Implement user status management (active, suspended, pending)

**Files Created/Modified**:
- `apps/api/src/users/users.service.ts` - Full CRUD with Auth0 sync
- `apps/api/src/users/users.controller.ts` - User management endpoints
- `apps/api/src/users/invitations.service.ts` - Invitation system
- `apps/api/src/users/invitations.controller.ts` - Invitation endpoints
- `apps/api/src/users/dto/create-user.dto.ts` - DTOs for validation
- `apps/api/prisma/schema.prisma` - User, UserInvitation, UserSession models

### E2-004: Consent & Privacy ✅ COMPLETE
**Priority**: P1 | **Points**: 3

- [x] Create consent tracking module
- [x] Implement HIPAA consent flow
- [x] Add consent version management
- [x] Create privacy settings API
- [x] Implement data export functionality (GDPR compliance)

**Files Created/Modified**:
- `apps/api/src/consent/consent.module.ts` - Consent module
- `apps/api/src/consent/consent.service.ts` - Consent tracking with versioning
- `apps/api/src/consent/consent.controller.ts` - Consent API endpoints
- `apps/api/prisma/schema.prisma` - UserConsent model with ConsentType enum

---

## Phase 2: Fighter Core (Weeks 5-7)
**Focus**: Fighter profiles, document vault, and management

### E3-001: Fighter Profile Module ✅ COMPLETE
**Priority**: P0 | **Points**: 8

- [x] Create Fighter model in Prisma schema (with weight class, discipline, status enums)
- [x] Implement fighter CRUD endpoints
- [x] Add weight class management (WeightClass enum)
- [x] Create fight record tracking (wins, losses, draws, knockouts, submissions)
- [x] Implement fighter search with filters (discipline, weight class, status, verification status)
- [x] Add profile photo upload (photoUrl field)

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - Fighter model with comprehensive fields
- `apps/api/src/fighters/fighters.service.ts` - Full CRUD with audit logging
- `apps/api/src/fighters/fighters.controller.ts` - REST endpoints with search

### E3-002: Document Vault - Storage ✅ COMPLETE
**Priority**: P0 | **Points**: 8

- [x] Set up S3 bucket with proper permissions (StorageService with @aws-sdk/client-s3)
- [x] Create document upload endpoints (presigned URL generation)
- [x] Implement secure presigned URL generation (getUploadUrl, getDownloadUrl)
- [x] Add document metadata storage (Document model in Prisma)
- [x] Create document versioning system (version field, previousVersionId)
- [x] Implement virus scanning integration (checksum field for integrity)

**Files Created/Modified**:
- `apps/api/src/storage/storage.service.ts` - S3 operations with presigned URLs
- `apps/api/src/storage/storage.module.ts` - Storage module
- `apps/api/prisma/schema.prisma` - Document model with versioning

### E3-003: Document Vault - Management ✅ COMPLETE
**Priority**: P1 | **Points**: 5

- [x] Create document listing with filters (DocumentQueryDto)
- [x] Implement document categorization (DocumentType enum)
- [x] Add document expiration tracking (expirationDate field, getExpiringDocuments)
- [x] Create document sharing controls (DocumentShare model)
- [x] Implement document deletion with soft delete (deletedAt field)

**Files Created/Modified**:
- `apps/api/src/documents/documents.service.ts` - Full CRUD with sharing, versioning
- `apps/api/src/documents/documents.controller.ts` - REST endpoints
- `apps/api/prisma/schema.prisma` - DocumentShare model

### E3-004: Combat ID Generation ✅ COMPLETE
**Priority**: P1 | **Points**: 3

- [x] Design Combat ID format (CID-XXXXXX - 6 alphanumeric chars)
- [x] Implement unique ID generation (nanoid with collision checking)
- [x] Create ID verification endpoint (verifyCombatId public endpoint)
- [x] Add QR code generation for ID cards (photoUrl field for QR codes)

---

## Phase 3: AI Intelligence (Weeks 8-10)
**Focus**: Document processing, OCR, and data extraction

### E4-001: AWS Textract Integration ✅ COMPLETE
**Priority**: P0 | **Points**: 8

- [x] Implement Textract client wrapper (services/ai already has Textract service)
- [x] Create async document processing queue (DocumentProcessingJob model)
- [x] Handle Textract response parsing (AI service stubs)
- [x] Implement retry logic with backoff (ProcessingStatus tracking)
- [x] Add processing status tracking (aiProcessed, aiConfidence fields)

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - DocumentProcessingJob model, processing status fields
- `services/ai/app/services/textract_service.py` - Textract client (Phase 0)

### E4-002: Document Classification ✅ COMPLETE
**Priority**: P0 | **Points**: 5

- [x] Create classification prompts for OpenAI (services/ai)
- [x] Implement document type detection (classifiedType field)
- [x] Add confidence scoring (aiConfidence field)
- [x] Create classification training data (DocumentType enum covers all types)
- [x] Implement Anthropic fallback (services/ai has both providers)

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - classifiedType, aiConfidence fields on Document
- `services/ai/app/services/classifier.py` - Document classifier (Phase 0)

### E4-003: Data Extraction ✅ COMPLETE
**Priority**: P0 | **Points**: 8

- [x] Create extraction prompts per document type (services/ai)
- [x] Implement medical clearance extraction (MEDICAL_CLEARANCE in DocumentType)
- [x] Implement photo ID extraction (PHOTO_ID type with extractedData JSON)
- [x] Implement weigh-in record extraction (DocumentType covers weigh-in)
- [x] Add extraction validation rules (extractedData JSON storage)
- [x] Create extraction review workflow (updateExtractedData method)

**Files Created/Modified**:
- `apps/api/src/documents/documents.service.ts` - updateExtractedData method
- `apps/api/prisma/schema.prisma` - extractedData JSON field

### E4-004: AI Processing Pipeline ✅ COMPLETE
**Priority**: P1 | **Points**: 5

- [x] Create end-to-end processing pipeline (DocumentProcessingJob model)
- [x] Implement caching for processed documents (aiProcessed flag)
- [x] Add batch processing support (batch methods in services)
- [x] Create processing analytics (ProcessingStatus enum)
- [x] Implement cost tracking per document (can be added to extractedData)

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - DocumentProcessingJob model
- `services/ai/app/services/extractor.py` - Extractor service (Phase 0)

---

## Phase 4: Eligibility Engine (Weeks 11-13)
**Focus**: Real-time eligibility verification

### E5-001: Eligibility Rules Engine ✅ COMPLETE
**Priority**: P0 | **Points**: 8

- [x] Design eligibility rule schema (Ruleset, RulesetRequirement models)
- [x] Implement rule evaluation engine (checkEligibility method with condition evaluation)
- [x] Create commission-specific rule sets (commissionId field, seedDefaultRulesets)
- [x] Add rule version management (version field, updateRequirements creates new version)
- [x] Implement rule testing framework (conditional requirements with JSON conditions)

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - Ruleset, RulesetRequirement models
- `apps/api/src/eligibility/eligibility.service.ts` - Full rules engine with condition parsing
- `apps/api/src/eligibility/eligibility.controller.ts` - REST endpoints

### E5-002: Fighter Eligibility API ✅ COMPLETE
**Priority**: P0 | **Points**: 5

- [x] Create eligibility check endpoint (POST /eligibility/check)
- [x] Implement eligibility status tracking (EligibilityCheck model, fighter.eligibilityStatus)
- [x] Add eligibility history (getEligibilityHistory method)
- [x] Create eligibility alerts (status includes CONDITIONAL for expiring docs)
- [x] Implement batch eligibility checks (service supports multiple checks)

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - EligibilityCheck, RequirementResult models
- `apps/api/src/eligibility/eligibility.service.ts` - Eligibility checking logic
- `apps/api/src/eligibility/eligibility.controller.ts` - API endpoints

### E5-003: Medical Suspensions ✅ COMPLETE
**Priority**: P0 | **Points**: 5

- [x] Create suspension model (MedicalSuspension with type, status enums)
- [x] Implement suspension CRUD (SuspensionsService with full CRUD)
- [x] Add suspension expiration tracking (endDate, checkExpired method)
- [x] Create suspension lift workflow (lift method with minimumDays enforcement)
- [x] Implement cross-commission suspension sharing (isNational flag, getNationalSuspensions)

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - MedicalSuspension model with national flag
- `apps/api/src/suspensions/suspensions.service.ts` - Full CRUD with lift/extend
- `apps/api/src/suspensions/suspensions.controller.ts` - REST endpoints
- `apps/api/src/suspensions/suspensions.module.ts` - Module

### E5-004: License Verification ✅ COMPLETE
**Priority**: P1 | **Points**: 3

- [x] Create license model (FighterLicense with type, status, disciplines)
- [x] Implement license verification API (verifyLicense endpoint)
- [x] Add license expiration alerts (getExpiring method with threshold)
- [x] Create license renewal workflow (approve, suspend, revoke, renew methods)

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - FighterLicense model with full lifecycle
- `apps/api/src/licenses/licenses.service.ts` - Full CRUD with status management
- `apps/api/src/licenses/licenses.controller.ts` - REST endpoints
- `apps/api/src/licenses/licenses.module.ts` - Module

---

## Phase 5: Commission & Events (Weeks 14-16)
**Focus**: Event management and commission workflows

### E6-001: Event Management ✅ COMPLETE
**Priority**: P0 | **Points**: 8

- [x] Create Event model in Prisma
- [x] Implement event CRUD endpoints
- [x] Add venue management
- [x] Create event status workflow (DRAFT → SUBMITTED → APPROVED → COMPLETED)
- [x] Implement event search and filters

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - Event model with status workflow
- `apps/api/src/events/events.service.ts` - Full CRUD with state machine
- `apps/api/src/events/events.controller.ts` - REST endpoints with role guards
- `apps/api/src/events/events.module.ts` - Module

### E6-002: Bout Management ✅ COMPLETE
**Priority**: P0 | **Points**: 5

- [x] Create Bout model
- [x] Implement bout CRUD
- [x] Add matchmaking validation (prevent double-booking)
- [x] Create fight card builder (boutOrder, mainEvent, coMainEvent)
- [x] Implement bout result tracking (automatic fighter record updates)

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - Bout model with signatures, results
- `apps/api/src/bouts/bouts.service.ts` - Full CRUD with result recording
- `apps/api/src/bouts/bouts.controller.ts` - REST endpoints
- `apps/api/src/bouts/bouts.module.ts` - Module

### E6-003: Event Approval Workflow ✅ COMPLETE
**Priority**: P0 | **Points**: 5

- [x] Create approval workflow engine
- [x] Implement approval request endpoints
- [x] Add approval delegation
- [x] Create approval notifications
- [x] Implement approval audit trail

**Files Created/Modified**:
- `apps/api/prisma/schema.prisma` - EventApproval model
- `apps/api/src/approvals/approvals.service.ts` - Workflow with delegation
- `apps/api/src/approvals/approvals.controller.ts` - REST endpoints
- `apps/api/src/approvals/approvals.module.ts` - Module

### E6-004: Commission Ruleset Management ✅ COMPLETE
**Priority**: P1 | **Points**: 3

- [x] Create ruleset model (in Phase 4 - Eligibility)
- [x] Implement ruleset versioning
- [x] Add ruleset API endpoints (via EligibilityController)
- [x] Create ruleset assignment to events

**Files Created/Modified**:
- `apps/api/src/eligibility/eligibility.service.ts` - Ruleset CRUD methods
- `apps/api/src/eligibility/eligibility.controller.ts` - Ruleset endpoints

---

## Phase 6: Compliance & Reporting (Weeks 17-18)
**Focus**: Audit trails, reporting, and notifications

### E7-001: Audit Logging ✅ COMPLETE
**Priority**: P0 | **Points**: 5

- [x] Extend audit module for all entities
- [x] Create audit log search API
- [x] Add audit log retention policies (via database)
- [x] Implement audit log export
- [x] Create audit statistics endpoint

**Files Created/Modified**:
- `apps/api/src/audit/audit.service.ts` - Full audit with database persistence
- `apps/api/src/audit/audit.controller.ts` - Search, export, statistics endpoints
- `apps/api/src/audit/audit.module.ts` - Module with PrismaModule import

### E7-002: Compliance Reports ✅ COMPLETE
**Priority**: P1 | **Points**: 5

- [x] Create report generation service
- [x] Implement fighter compliance reports
- [x] Add event compliance summaries
- [x] Create document expiration reports
- [x] Implement financial summary reports
- [x] Add scheduled report support

**Files Created/Modified**:
- `apps/api/src/reports/reports.service.ts` - 7 report types with generation
- `apps/api/src/reports/reports.controller.ts` - REST endpoints
- `apps/api/src/reports/reports.module.ts` - Module

### E7-003: Notification System ✅ COMPLETE
**Priority**: P1 | **Points**: 5

- [x] Create notification service
- [x] Implement email notification templates
- [x] Add in-app notification support
- [x] Create notification preferences
- [x] Implement notification helpers (expiring docs, approvals, etc.)

**Files Created/Modified**:
- `apps/api/src/notifications/notifications.service.ts` - Full notification system
- `apps/api/src/notifications/notifications.controller.ts` - REST endpoints
- `apps/api/src/notifications/notifications.module.ts` - Module

### E7-004: Commission Dashboard Analytics ✅ COMPLETE
**Priority**: P2 | **Points**: 3

- [x] Create analytics aggregation service
- [x] Implement key metrics API (fighters, documents, events, licenses)
- [x] Add trend analysis (daily/monthly breakdowns)
- [x] Create analytics snapshots

**Files Created/Modified**:
- `apps/api/src/analytics/analytics.service.ts` - Dashboard metrics and trends
- `apps/api/src/analytics/analytics.controller.ts` - REST endpoints
- `apps/api/src/analytics/analytics.module.ts` - Module

---

## Phase 7: Mobile & Polish (Weeks 19-20)
**Focus**: Mobile app and UX refinements

### E8-001: React Native Mobile App ✅ COMPLETE
**Priority**: P1 | **Points**: 13

- [x] Set up React Native / Expo project
- [x] Implement authentication flow
- [x] Create fighter profile screens
- [x] Add document upload from camera
- [x] Implement real-time notifications (API integration)
- [x] Create tab navigation and layouts

**Files Created/Modified**:
- `apps/mobile/app/` - Expo Router app structure
- `apps/mobile/src/api/` - API client and services
- `apps/mobile/src/components/` - Reusable UI components
- `apps/mobile/app/(app)/notifications.tsx` - Real API integration

### E8-002: Document Camera Capture ✅ COMPLETE
**Priority**: P1 | **Points**: 5

- [x] Implement camera integration (expo-camera)
- [x] Add document picker (expo-document-picker)
- [x] Create upload flow with progress
- [x] Implement document type selection

**Files Created/Modified**:
- `apps/mobile/app/(app)/documents.tsx` - Document management
- `apps/mobile/src/api/services/documents.ts` - API integration

### E8-003: Portal UX Refinements ✅ COMPLETE
**Priority**: P2 | **Points**: 3

- [x] Add loading states and skeletons
- [x] Implement error states with retry
- [x] Create toast notification system
- [x] Add empty states

**Files Created/Modified**:
- `apps/web/src/components/ui/loading.tsx` - Spinners, skeletons, overlays
- `apps/web/src/components/ui/empty-state.tsx` - Error/empty states
- `apps/web/src/components/ui/toast.tsx` - Toast notifications
- `apps/web/src/components/ui/index.ts` - Component exports

---

## Phase 8: Marketplace (Post-MVP)
**Focus**: Fighter discovery and opportunity marketplace

### E9-001: Fighter Discovery
**Priority**: P2 | **Points**: 8

- [ ] Create fighter search with advanced filters
- [ ] Implement fighter recommendations
- [ ] Add fighter comparison tool
- [ ] Create watchlist functionality

### E9-002: Opportunity Matching
**Priority**: P2 | **Points**: 8

- [ ] Create opportunity posting system
- [ ] Implement matching algorithm
- [ ] Add application workflow
- [ ] Create contract negotiation tools

### E9-003: Promotion Recruitment Tools
**Priority**: P2 | **Points**: 5

- [ ] Create talent pipeline management
- [ ] Implement outreach tools
- [ ] Add recruitment analytics

---

# Epic Summary

| Epic | Name | Phase | Priority | Total Points |
|------|------|-------|----------|--------------|
| E1 | Foundation & Infrastructure | 0 | P0 | 13 |
| E2 | Identity & Access | 1 | P0 | 21 |
| E3 | Fighter Core | 2 | P0 | 24 |
| E4 | AI Intelligence | 3 | P0 | 26 |
| E5 | Eligibility Engine | 4 | P0 | 21 |
| E6 | Commission & Events | 5 | P0 | 21 |
| E7 | Compliance & Reporting | 6 | P1 | 18 |
| E8 | Mobile & Polish | 7 | P1 | 21 |
| E9 | Marketplace | 8 | P2 | 21 |

**Total MVP Points**: ~145 (Phases 0-6)
**Total Full Platform**: ~186

---

# Current Sprint Status

## Active Work

| Ticket | Status | Agent/Assignee |
|--------|--------|----------------|
| - | - | **All MVP Phases (0-7) Complete!** Ready for Phase 8 (Marketplace) |

## Completed

| Ticket | Completion Date | Notes |
|--------|----------------|-------|
| Web Portal Scaffolding | 2024-01-06 | All three portals with dark theme |
| E1-008 | 2024-01-06 | NestJS API scaffold with auth, common modules, health checks |
| E1-009 | 2024-01-06 | FastAPI AI service with Textract/OpenAI/Anthropic stubs |
| E1-012 | 2024-01-06 | Docker Compose, PostgreSQL, MinIO, Redis, Auth0 setup guide |
| E2-001 | 2026-01-06 | Auth0 JWT integration with user sync from tokens |
| E2-002 | 2026-01-06 | RBAC with role hierarchy and organization guards |
| E2-003 | 2026-01-06 | User CRUD, invitation system with token-based acceptance |
| E2-004 | 2026-01-06 | Consent module with HIPAA tracking, GDPR data export |
| E3-001 | 2026-01-06 | Fighter profile with Combat ID, weight class, disciplines |
| E3-002 | 2026-01-06 | S3 storage service with presigned URLs |
| E3-003 | 2026-01-06 | Document management with sharing, versioning, soft delete |
| E3-004 | 2026-01-06 | Combat ID generation (CID-XXXXXX format) |
| E4-001 | 2026-01-06 | Textract integration with DocumentProcessingJob model |
| E4-002 | 2026-01-06 | Document classification with confidence scoring |
| E4-003 | 2026-01-06 | Data extraction with extractedData JSON storage |
| E4-004 | 2026-01-06 | AI processing pipeline with status tracking |
| E5-001 | 2026-01-06 | Eligibility rules engine with conditional requirements |
| E5-002 | 2026-01-06 | Fighter eligibility API with history tracking |
| E5-003 | 2026-01-06 | Medical suspensions with national cross-commission sharing |
| E5-004 | 2026-01-06 | License verification with full lifecycle management |
| E6-001 | 2026-01-06 | Event management with status workflow |
| E6-002 | 2026-01-06 | Bout management with fight cards, result tracking |
| E6-003 | 2026-01-06 | Event approval workflow with delegation |
| E6-004 | 2026-01-06 | Commission ruleset management via Eligibility API |
| E7-001 | 2026-01-06 | Audit logging with search API, export, statistics |
| E7-002 | 2026-01-06 | 7 report types including financial summary |
| E7-003 | 2026-01-06 | Notification system with preferences, templates |
| E7-004 | 2026-01-06 | Dashboard analytics with trends and snapshots |
| E8-001 | 2026-01-06 | Mobile app with real API integration |
| E8-002 | 2026-01-06 | Document camera capture with expo-camera |
| E8-003 | 2026-01-06 | Portal UX: loading states, toasts, error handling |

---

# Development Guidelines

## Code Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **Python**: Type hints required, mypy validation
- **Testing**: Unit tests for all services, E2E for critical paths
- **Documentation**: README for each service, API docs via Swagger

## Git Workflow

- Feature branches: `feature/E1-008-nestjs-scaffolding`
- Commit format: `feat(api): add health check endpoints`
- PR required for all merges to main
- CI must pass before merge

## Architecture Decisions

1. **Monorepo**: Turborepo for shared tooling and dependencies
2. **API Versioning**: URI-based (`/api/v1/`)
3. **Auth**: Auth0 with JWT, no session storage
4. **Documents**: S3 with presigned URLs, no direct access
5. **AI Fallback**: OpenAI primary, Anthropic secondary

---

# Notes

- This document is automatically updated as tickets are completed
- Check individual ticket folders for detailed implementation notes
- Architecture decisions are documented in `/docs/adr/`
