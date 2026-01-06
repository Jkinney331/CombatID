.PHONY: help install dev test lint format type-check clean verify docker-build docker-run

help:
	@echo "CombatID AI Service - Available commands:"
	@echo ""
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Run development server"
	@echo "  make test         - Run tests"
	@echo "  make lint         - Run linter"
	@echo "  make format       - Format code"
	@echo "  make type-check   - Run type checker"
	@echo "  make clean        - Clean cache files"
	@echo "  make verify       - Verify setup"
	@echo "  make docker-build - Build Docker image"
	@echo "  make docker-run   - Run Docker container"

install:
	pip install -r requirements.txt

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

test:
	pytest -v

test-cov:
	pytest --cov=app --cov-report=html --cov-report=term

lint:
	ruff check app tests

format:
	black app tests
	ruff check --fix app tests

type-check:
	mypy app

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name ".coverage" -delete

verify:
	python verify_setup.py

docker-build:
	docker build -t combatid-ai-service:latest .

docker-run:
	docker run -p 8000:8000 --env-file .env combatid-ai-service:latest

docker-dev:
	docker build --target development -t combatid-ai-service:dev .
	docker run -p 8000:8000 --env-file .env -v $(PWD)/app:/app/app combatid-ai-service:dev
