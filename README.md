# CombatID

Digital identity and compliance platform for combat sports.

## Project Structure

```
combatid/
├── apps/
│   ├── mobile/          # Expo React Native (Fighter app)
│   ├── web/             # Next.js (Commission/Promotion dashboards)
│   ├── api/             # NestJS backend API
│   └── ai-service/      # FastAPI document intelligence
├── packages/
│   ├── shared/          # Shared types, utils, constants
│   ├── database/        # Prisma schema and client
│   └── ui/              # Shared React components
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Expo Go app (for mobile testing)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Set up database:
```bash
npm run db:push
```

4. Start development servers:

**Mobile App (Fighter):**
```bash
npm run mobile
# Scan QR code with Expo Go app
```

**Web Dashboard:**
```bash
npm run web
# Open http://localhost:3000
```

**API Server:**
```bash
npm run api
# API at http://localhost:3001
# Docs at http://localhost:3001/api/docs
```

**AI Service:**
```bash
cd apps/ai-service
pip install -r requirements.txt
python main.py
# Service at http://localhost:8000
```

## Development

### Mobile App Testing

1. Install Expo Go on your phone
2. Run `npm run mobile`
3. Scan the QR code
4. App loads instantly with hot reload

### Database

```bash
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run migrations
npm run db:push      # Push schema changes
```

## Tech Stack

- **Mobile**: Expo + React Native + TypeScript
- **Web**: Next.js 14 + Tailwind CSS
- **API**: NestJS + TypeScript
- **AI Service**: FastAPI + Python
- **Database**: PostgreSQL + Prisma
- **Auth**: Auth0
- **Storage**: AWS S3
- **OCR**: AWS Textract

## Features (MVP)

- [ ] Fighter registration & identity verification
- [ ] Document vault with AI extraction
- [ ] Eligibility engine with commission rules
- [ ] Commission review console
- [ ] Event management & bout agreements
- [ ] Organization dashboards (Gym, Promotion)

## License

Proprietary - All Rights Reserved
