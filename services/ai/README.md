# CombatID AI Service

AI-powered document processing and extraction service for the CombatID platform. This service handles OCR, document classification, and structured data extraction from combat sports compliance documents.

## Features

- **Document Processing**: OCR extraction using AWS Textract
- **Classification**: AI-powered document type classification
- **Data Extraction**: Structured data extraction from various document types
- **Multi-Provider AI**: OpenAI with Anthropic fallback
- **Health Monitoring**: Health and readiness endpoints
- **Structured Logging**: JSON logging with request tracking

## Tech Stack

- **Framework**: FastAPI 0.109+
- **Python**: 3.11+
- **OCR**: AWS Textract
- **AI**: OpenAI GPT-4, Anthropic Claude
- **Storage**: AWS S3
- **Validation**: Pydantic v2
- **Testing**: pytest, httpx

## Project Structure

```
services/ai/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── config.py            # Settings with pydantic-settings
│   ├── api/
│   │   ├── routes/
│   │   │   ├── health.py    # Health check endpoints
│   │   │   ├── documents.py # Document processing endpoints
│   │   │   └── extraction.py # Data extraction endpoints
│   │   └── deps.py          # FastAPI dependencies
│   ├── services/
│   │   ├── textract.py      # AWS Textract wrapper
│   │   ├── openai_client.py # OpenAI/Anthropic client
│   │   ├── classifier.py    # Document classifier
│   │   └── extractor.py     # Data extractor
│   ├── models/
│   │   ├── document.py      # Document models
│   │   └── extraction.py    # Extraction models
│   └── core/
│       ├── logging.py       # Structured JSON logging
│       └── exceptions.py    # Custom exceptions
├── tests/
│   ├── conftest.py          # Pytest fixtures
│   ├── test_health.py       # Health endpoint tests
│   └── test_api/            # API endpoint tests
├── pyproject.toml           # Poetry dependencies
├── requirements.txt         # Pip dependencies
├── Dockerfile               # Multi-stage Docker build
└── .env.example             # Environment variable template
```

## Getting Started

### Prerequisites

- Python 3.11 or higher
- AWS account with Textract access
- OpenAI API key (or Anthropic API key)
- S3 bucket for document storage

### Installation

1. **Clone the repository and navigate to the AI service:**

```bash
cd services/ai
```

2. **Create and activate a virtual environment:**

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**

Using Poetry (recommended):
```bash
poetry install
```

Using pip:
```bash
pip install -r requirements.txt
```

4. **Configure environment variables:**

```bash
cp .env.example .env
# Edit .env and add your API keys and AWS credentials
```

### Running the Service

**Development mode with auto-reload:**

```bash
uvicorn app.main:app --reload --port 8000
```

**Production mode:**

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Using Docker:**

```bash
# Build
docker build -t combatid-ai-service .

# Run
docker run -p 8000:8000 --env-file .env combatid-ai-service
```

**From monorepo root:**

```bash
npm run ai
```

### API Documentation

Once running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health Checks

```
GET /health              - Basic health check
GET /health/ready        - Readiness check with dependency validation
```

### Document Processing

```
POST /api/v1/documents/process           - Process a document
GET  /api/v1/documents/{id}/status       - Get processing status
```

### Data Extraction

```
POST /api/v1/extract/classify            - Classify document type
POST /api/v1/extract/data                - Extract structured data
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
# Server
PORT=8000
LOG_LEVEL=INFO
ENVIRONMENT=development

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_BUCKET=combatid-documents

# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

## Testing

**Run all tests:**

```bash
pytest
```

**Run with coverage:**

```bash
pytest --cov=app --cov-report=html
```

**Run specific test file:**

```bash
pytest tests/test_health.py -v
```

## Development

### Code Quality

**Format code:**

```bash
black app tests
```

**Lint code:**

```bash
ruff check app tests
```

**Type checking:**

```bash
mypy app
```

### Adding New Document Types

1. Add document type to `DocumentType` enum in `app/models/document.py`
2. Create corresponding data model in `app/models/extraction.py`
3. Implement extraction logic in `app/services/extractor.py`
4. Add classification rules in `app/services/classifier.py`
5. Write tests for the new document type

## Current Implementation Status

### Completed
- FastAPI application scaffold
- Health check endpoints
- Pydantic models for documents and extraction
- API route stubs for processing and extraction
- Configuration management with pydantic-settings
- Structured JSON logging
- Custom exception hierarchy
- Docker support
- Comprehensive test suite

### TODO (Future Enhancements)
- Implement actual AWS Textract integration
- Implement OpenAI/Anthropic classification logic
- Implement document-specific extraction logic
- Add caching for processed documents
- Add job queue for async processing
- Implement actual readiness checks
- Add metrics and monitoring
- Add rate limiting
- Implement document validation

## Architecture

The service follows a clean architecture pattern:

- **API Layer**: FastAPI routes and request/response models
- **Service Layer**: Business logic for OCR, classification, and extraction
- **Core Layer**: Logging, configuration, and exception handling
- **Models Layer**: Pydantic models for validation and serialization

## Error Handling

The service uses custom exceptions with detailed error messages:

- `DocumentProcessingError`: Document processing failures
- `ClassificationError`: Classification failures
- `ExtractionError`: Data extraction failures
- `TextractError`: AWS Textract errors
- `AIProviderError`: OpenAI/Anthropic errors

All errors are logged with structured context and return appropriate HTTP status codes.

## Logging

All logs are output in JSON format with:
- Timestamp
- Log level
- Logger name
- Request ID (for tracking)
- Environment
- Custom context fields

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass and code quality checks succeed
5. Submit a pull request

## License

Copyright 2024 CombatID. All rights reserved.
