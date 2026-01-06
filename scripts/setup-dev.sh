#!/bin/bash

# CombatID Development Setup Script
# This script sets up the local development environment

set -e

echo "🥊 CombatID Development Setup"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for required tools
check_requirements() {
    echo -e "\n${YELLOW}Checking requirements...${NC}"

    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed. Please install Docker Desktop.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker installed${NC}"

    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed. Please install Node.js 20+.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Node.js installed ($(node --version))${NC}"

    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.11+.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Python installed ($(python3 --version))${NC}"
}

# Setup environment files
setup_env() {
    echo -e "\n${YELLOW}Setting up environment files...${NC}"

    if [ ! -f .env ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env from .env.example${NC}"
        echo -e "${YELLOW}  Please edit .env with your Auth0 and API keys${NC}"
    else
        echo -e "${GREEN}✓ .env already exists${NC}"
    fi
}

# Start Docker services
start_docker() {
    echo -e "\n${YELLOW}Starting Docker services...${NC}"

    docker compose up -d postgres redis minio

    echo -e "${GREEN}✓ PostgreSQL running on port 5432${NC}"
    echo -e "${GREEN}✓ Redis running on port 6379${NC}"
    echo -e "${GREEN}✓ MinIO running on port 9000 (console: 9001)${NC}"

    # Wait for PostgreSQL to be ready
    echo -e "\n${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
    sleep 5

    until docker exec combatid-postgres pg_isready -U combatid -d combatid > /dev/null 2>&1; do
        echo "Waiting for PostgreSQL..."
        sleep 2
    done
    echo -e "${GREEN}✓ PostgreSQL is ready${NC}"
}

# Install dependencies
install_deps() {
    echo -e "\n${YELLOW}Installing dependencies...${NC}"

    # Root dependencies
    npm install
    echo -e "${GREEN}✓ Root dependencies installed${NC}"

    # API dependencies
    cd apps/api
    npm install
    echo -e "${GREEN}✓ API dependencies installed${NC}"
    cd ../..

    # AI service dependencies
    if [ -d "services/ai" ]; then
        cd services/ai
        pip3 install -r requirements.txt
        echo -e "${GREEN}✓ AI service dependencies installed${NC}"
        cd ../..
    fi
}

# Run Prisma migrations
run_migrations() {
    echo -e "\n${YELLOW}Running database migrations...${NC}"

    cd apps/api

    # Generate Prisma client
    npx prisma generate
    echo -e "${GREEN}✓ Prisma client generated${NC}"

    # Push schema to database (for development)
    npx prisma db push
    echo -e "${GREEN}✓ Database schema applied${NC}"

    cd ../..
}

# Print summary
print_summary() {
    echo -e "\n${GREEN}=============================="
    echo -e "🎉 Setup Complete!"
    echo -e "==============================${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Edit .env with your Auth0 and API keys"
    echo "     See docs/AUTH0_SETUP.md for Auth0 configuration"
    echo ""
    echo "  2. Start the development servers:"
    echo "     npm run dev          # Start all services"
    echo "     npm run dev:api      # Start API only"
    echo "     npm run dev:web      # Start web only"
    echo ""
    echo "  3. Access the services:"
    echo "     Web Portal:    http://localhost:3000"
    echo "     API:           http://localhost:3001"
    echo "     API Docs:      http://localhost:3001/api/docs"
    echo "     AI Service:    http://localhost:8000"
    echo "     MinIO Console: http://localhost:9001"
    echo ""
    echo "  4. View logs:"
    echo "     docker compose logs -f"
    echo ""
}

# Main execution
main() {
    check_requirements
    setup_env
    start_docker
    install_deps
    run_migrations
    print_summary
}

main "$@"
