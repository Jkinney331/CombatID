# CombatID

Digital identity, health compliance, and eligibility platform for combat sports.

## Overview

CombatID serves three primary user groups through dedicated portals:

- **Commission Portal** - Athletic commission oversight, fighter registry, event approvals, ruleset management
- **Promotion Portal** - Event creation, roster management, fighter recruitment, bout agreements
- **Gym Portal** - Fighter management, training tracking, opportunity discovery

## Project Structure

```
combatid/
├── apps/
│   ├── api/              # NestJS backend API (22 modules)
│   ├── web/              # Next.js 14 (Commission/Promotion/Gym dashboards)
│   ├── mobile/           # Expo React Native (Fighter app)
│   └── database/         # Prisma schema
├── services/
│   └── ai/               # FastAPI document intelligence service
├── packages/
│   └── shared/           # Shared types, utils, constants
├── infrastructure/       # Terraform IaC, Docker configs
├── docs/                 # Architecture docs, Auth0 setup guide
└── TICKETS.md            # Development tickets and phase tracking
```

## Development Status

See [TICKETS.md](./TICKETS.md) for detailed ticket tracking.

### Completed Phases

| Phase | Name | Status | Description |
|-------|------|--------|-------------|
| 0 | Foundation | Complete | Infrastructure, NestJS/FastAPI scaffolding, Docker Compose |
| 1 | Identity & Access | Complete | Auth0 JWT, RBAC with role hierarchy, user management, consent tracking |
| 2 | Fighter Core | Complete | Fighter profiles, Combat ID generation, document vault, S3 storage |
| 3 | AI Intelligence | Complete | Textract integration, document classification, data extraction pipeline |
| 4 | Eligibility Engine | Complete | Rules engine, medical suspensions, license verification |
| 5 | Commission & Events | Complete | Event management, bout management, approval workflows |
| 6 | Compliance & Reporting | Complete | Audit logging with search API, reports, notifications, analytics |
| 7 | Mobile & Polish | Complete | Mobile app with real API, UI components, loading/error states |

### API Modules (22 Total)

```
ConfigModule, LoggerModule, PrismaModule, CommonModule, HealthModule,
AuditModule, AuthModule, UsersModule, ConsentModule, FightersModule,
DocumentsModule, OrganizationsModule, EventsModule, EligibilityModule,
StorageModule, SuspensionsModule, LicensesModule, BoutsModule,
ApprovalsModule, NotificationsModule, ReportsModule, AnalyticsModule
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Docker & Docker Compose (recommended)
- Expo Go app (for mobile testing)

### Installation

1. Clone and install dependencies:
```bash
git clone <repo-url>
cd combatid
npm install
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your credentials (see docs/AUTH0_SETUP.md for Auth0 config)
```

3. Start infrastructure (PostgreSQL, Redis, MinIO):
```bash
docker-compose up -d postgres redis minio
```

4. Set up database:
```bash
cd apps/api
npx prisma generate
npx prisma db push
```

5. Start development servers:

```bash
# All services (using Turborepo)
npm run dev

# Or individually:
npm run api        # NestJS API at http://localhost:3001
npm run web        # Next.js at http://localhost:3000
npm run mobile     # Expo (scan QR with Expo Go)
```

### API Documentation

When running the API, Swagger docs are available at:
- http://localhost:3001/api/docs

### Docker Development

Full stack with Docker Compose:
```bash
docker-compose up
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Mobile | React Native, Expo ~54, TypeScript |
| Backend API | NestJS, TypeScript, Prisma ORM |
| AI Service | Python, FastAPI, AWS Textract, OpenAI/Anthropic |
| Database | PostgreSQL 14+ |
| Cache | Redis |
| Storage | AWS S3 / MinIO (local) |
| Auth | Auth0 with JWT |
| Infrastructure | Docker, Terraform (AWS ECS Fargate) |

## Key Features

### Fighter Management
- Combat ID generation (CID-XXXXXX format)
- Document vault with AI-powered extraction
- Medical record tracking
- Fight record management

### Eligibility Engine
- Commission-specific rulesets
- Document expiration tracking
- Medical suspension management
- License verification with renewal workflows

### Event Management
- Event creation and approval workflows
- Bout management with fight cards
- Fighter signature tracking
- Result recording with automatic record updates

### Compliance & Reporting
- Full audit trail with search API
- 7 report types (Fighter Compliance, Financial Summary, etc.)
- Real-time notifications (in-app, email templates)
- Dashboard analytics with trends

### Mobile App
- Fighter authentication
- Document upload via camera
- Real-time notifications
- Profile management

## Development Commands

```bash
# Build all packages
npm run build

# Run tests
npm run test

# Database commands
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run migrations
npm run db:push      # Push schema changes
npm run db:generate  # Generate Prisma client

# Linting
npm run lint
```

## Architecture Decisions

1. **Monorepo**: Turborepo for shared tooling and dependencies
2. **API Versioning**: URI-based (`/api/v1/`)
3. **Auth**: Auth0 with JWT, stateless authentication
4. **Documents**: S3 with presigned URLs, no direct bucket access
5. **AI Fallback**: OpenAI primary, Anthropic secondary
6. **Audit**: All entity changes logged with user tracking

## Environment Variables

See [.env.example](./.env.example) for all required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `AUTH0_DOMAIN`, `AUTH0_AUDIENCE` - Auth0 configuration
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `S3_BUCKET`, `S3_REGION` - S3 storage configuration
- `OPENAI_API_KEY` - AI service (optional)

## Contributing

1. Check [TICKETS.md](./TICKETS.md) for available work
2. Create feature branch: `feature/E1-008-description`
3. Follow commit format: `feat(api): add health check endpoints`
4. Ensure `npm run build` passes
5. Submit PR with description referencing ticket

## License

Proprietary - All Rights Reserved
