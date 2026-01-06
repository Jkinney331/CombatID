# CombatID API

Digital identity and compliance platform for combat sports - Backend API service.

## Overview

The CombatID API is a NestJS-based REST API that provides the backend services for the CombatID platform. It manages fighter profiles, organizations, events, documents, and eligibility verification for combat sports.

### Technology Stack

- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Auth0 (JWT-based)
- **Storage**: AWS S3 (documents)
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Pino (structured JSON logging)
- **Validation**: class-validator, class-transformer

## Project Structure

```
apps/api/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── auth/                   # Authentication module (Auth0)
│   ├── users/                  # User management
│   ├── fighters/               # Fighter profiles
│   ├── documents/              # Document vault
│   ├── organizations/          # Gyms, promotions, commissions
│   ├── events/                 # Event management
│   ├── eligibility/            # Eligibility verification engine
│   ├── audit/                  # Audit logging
│   ├── common/                 # Shared utilities
│   │   ├── filters/           # Exception filters
│   │   ├── interceptors/      # Request/response interceptors
│   │   ├── guards/            # Auth guards
│   │   └── decorators/        # Custom decorators
│   ├── config/                # Configuration management
│   ├── health/                # Health check endpoints
│   ├── prisma/                # Prisma service
│   ├── app.module.ts          # Root module
│   └── main.ts                # Application entry point
├── test/                       # E2E tests
├── .env.example               # Environment variables template
├── nest-cli.json              # NestJS CLI configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL 14+
- npm 10+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: PostgreSQL connection string
- `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `AUTH0_ISSUER_URL`: Auth0 credentials
- `AWS_S3_BUCKET_NAME`, `AWS_REGION`: AWS S3 configuration
- Other environment-specific settings

3. Generate Prisma client:
```bash
npx prisma generate
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

### Development

Run the API in development mode with hot-reload:
```bash
npm run start:dev
```

The API will be available at:
- API: http://localhost:3001/api/v1
- Documentation: http://localhost:3001/api/docs
- Health check: http://localhost:3001/health

### Available Scripts

```bash
# Development
npm run start:dev          # Start with watch mode
npm run start:debug        # Start with debug mode

# Build
npm run build              # Build for production

# Production
npm run start:prod         # Run production build

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:e2e           # Run end-to-end tests

# Database
npx prisma generate        # Generate Prisma client
npx prisma migrate dev     # Run migrations (dev)
npx prisma migrate deploy  # Run migrations (prod)
npx prisma studio          # Open Prisma Studio GUI

# Linting
npm run lint               # Lint code
npm run format             # Format code with Prettier
```

## API Documentation

Interactive API documentation is available via Swagger UI:
- **Local**: http://localhost:3001/api/docs
- **Development**: https://api-dev.combatid.com/api/docs
- **Production**: https://api.combatid.com/api/docs

The API follows RESTful conventions and includes:
- Request/response schemas
- Authentication requirements
- Error responses
- Example payloads

## Architecture

### Module Organization

The API is organized into feature modules:

- **Infrastructure Modules**: Common utilities, logging, health checks, Prisma
- **Authentication**: Auth0 integration with JWT strategy
- **Feature Modules**: Domain-specific modules (fighters, organizations, events, etc.)
- **Audit Module**: Centralized audit logging for compliance

### Key Features

#### 1. Request Validation
- Automatic validation using class-validator
- DTOs for all request payloads
- Type-safe transformations

#### 2. Error Handling
- Global exception filter
- Consistent error response format
- Detailed error messages in development

#### 3. Logging
- Structured JSON logging with Pino
- Request/response logging
- Correlation IDs for request tracing

#### 4. Security
- JWT-based authentication via Auth0
- Role-based access control (RBAC)
- Input sanitization and validation
- CORS configuration
- Rate limiting (planned)

#### 5. Database
- PostgreSQL with Prisma ORM
- Type-safe database queries
- Automatic migrations
- Connection pooling

#### 6. Health Checks
- Database connectivity check
- Graceful shutdown handling

## Environment Variables

Required environment variables (see `.env.example`):

### Application
- `NODE_ENV`: Environment (development, production, test)
- `PORT`: API port (default: 3001)

### Database
- `DATABASE_URL`: PostgreSQL connection string

### Authentication
- `AUTH0_DOMAIN`: Auth0 tenant domain
- `AUTH0_AUDIENCE`: API identifier
- `AUTH0_ISSUER_URL`: Auth0 issuer URL

### AWS
- `AWS_REGION`: AWS region for S3
- `AWS_S3_BUCKET_NAME`: S3 bucket for documents

### Other
- `CORS_ORIGIN`: Allowed CORS origins (comma-separated)
- `LOG_LEVEL`: Logging level (info, debug, error)

## Database Schema

The database schema is defined in `prisma/schema.prisma`. Key models include:

### Phase 0 Models (Current)
- **User**: User accounts with Auth0 integration
- **Organization**: Gyms, promotions, commissions
- **OrganizationMember**: User-organization relationships

### Planned Models
- **Fighter**: Fighter profiles and records
- **Document**: Document metadata and storage
- **Event**: Events and bouts
- **AuditLog**: Comprehensive audit trail

Run `npx prisma studio` to explore the database visually.

## Development Workflow

### TypeScript Strict Mode
The project uses TypeScript strict mode for maximum type safety:
- Strict null checks
- No implicit any
- Strict function types
- All strict compiler options enabled

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- Pre-commit hooks (planned)

### Testing Strategy
- Unit tests for services and utilities
- Integration tests for modules
- E2E tests for API endpoints
- Test coverage reporting

## Deployment

### Build for Production
```bash
npm run build
```

### Run Production Build
```bash
npm run start:prod
```

### Docker Support
Docker configuration is planned for Phase 1.

### Environment-Specific Configurations
- Development: `.env.local` or `.env`
- Staging/Production: Environment variables set in deployment platform

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check network connectivity
- Review Prisma connection logs

### Auth0 Configuration
- Verify Auth0 tenant settings
- Check API identifier matches `AUTH0_AUDIENCE`
- Ensure JWT configuration is correct
- Review Auth0 logs for authentication failures

### Port Conflicts
- Default port is 3001 (Next.js uses 3000)
- Change via `PORT` environment variable

## Contributing

### Code Style
- Follow NestJS conventions
- Use dependency injection
- Write testable, modular code
- Document complex logic

### Commit Messages
Follow conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes

## License

Proprietary - CombatID Platform

## Support

For questions or issues:
- Review the API documentation at `/api/docs`
- Check the health endpoint at `/health`
- Review application logs for errors
- Contact the development team

## Roadmap

### Phase 0 (Current)
- Core infrastructure setup
- Authentication integration
- Basic module scaffolding
- Database schema foundation

### Phase 1 (Planned)
- Fighter management implementation
- Document vault with S3 integration
- Organization management
- User role management

### Phase 2 (Planned)
- Event management
- Eligibility verification engine
- Advanced search and filtering
- Notification system

### Phase 3 (Planned)
- Reporting and analytics
- Compliance automation
- Third-party integrations
- Mobile API optimizations
