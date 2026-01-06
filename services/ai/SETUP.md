# AI Service Setup Guide

## Quick Start

### 1. Verify Setup

Run the verification script to ensure all files are in place:

```bash
python verify_setup.py
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```bash
# Required for production
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
OPENAI_API_KEY=your_openai_api_key

# Optional fallback
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. Install Dependencies

**Option A: Using pip (recommended for Docker builds)**

```bash
pip install -r requirements.txt
```

**Option B: Using Poetry (recommended for development)**

```bash
poetry install
poetry shell
```

### 4. Run the Service

**Development mode with auto-reload:**

```bash
make dev
# or
uvicorn app.main:app --reload
```

**Access the API:**
- API Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

### 5. Run Tests

```bash
make test
# or
pytest -v
```

**With coverage:**

```bash
make test-cov
# or
pytest --cov=app --cov-report=html
```

## Docker Setup

### Build and Run

```bash
# Build the image
make docker-build

# Run the container
make docker-run
```

### Development with Docker

```bash
# Build development image with hot-reload
make docker-dev
```

## Code Quality

### Format Code

```bash
make format
# Runs black and ruff
```

### Lint Code

```bash
make lint
# Runs ruff
```

### Type Checking

```bash
make type-check
# Runs mypy
```

## Project Structure

```
services/ai/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Settings with pydantic-settings
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py          # FastAPI dependencies
│   │   └── routes/
│   │       ├── __init__.py
│   │       ├── health.py    # GET /health, /health/ready
│   │       ├── documents.py # POST /api/v1/documents/process
│   │       └── extraction.py # POST /api/v1/extract/classify, /data
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── textract.py      # AWS Textract wrapper (stub)
│   │   ├── openai_client.py # OpenAI with Anthropic fallback (stub)
│   │   ├── classifier.py    # Document classifier (stub)
│   │   └── extractor.py     # Data extractor (stub)
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── document.py      # Document models (ProcessRequest, Status, etc.)
│   │   └── extraction.py    # Extraction models (MedicalClearance, PhotoID, etc.)
│   │
│   └── core/
│       ├── __init__.py
│       ├── logging.py       # Structured JSON logging
│       └── exceptions.py    # Custom exceptions
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures
│   ├── test_health.py       # Health endpoint tests
│   └── test_api/
│       ├── __init__.py
│       └── test_documents.py # Document endpoint tests
│
├── pyproject.toml           # Poetry configuration
├── requirements.txt         # Pip dependencies
├── Dockerfile               # Multi-stage Docker build
├── .env.example             # Environment template
├── .gitignore
├── .dockerignore
├── Makefile                 # Convenience commands
├── verify_setup.py          # Setup verification script
├── README.md                # Comprehensive documentation
└── SETUP.md                 # This file
```

## API Endpoints

### Health Checks

```bash
# Basic health check
curl http://localhost:8000/health

# Readiness check (validates dependencies)
curl http://localhost:8000/health/ready
```

### Document Processing

```bash
# Process a document
curl -X POST http://localhost:8000/api/v1/documents/process \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "doc-123",
    "s3_key": "documents/medical-clearance.pdf",
    "user_id": "user-456"
  }'

# Get processing status
curl http://localhost:8000/api/v1/documents/doc-123/status
```

### Classification and Extraction

```bash
# Classify document type
curl -X POST http://localhost:8000/api/v1/extract/classify \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "doc-123",
    "s3_key": "documents/medical-clearance.pdf"
  }'

# Extract structured data
curl -X POST http://localhost:8000/api/v1/extract/data \
  -H "Content-Type: application/json" \
  -d '{
    "document_id": "doc-123",
    "document_type": "medical_clearance"
  }'
```

## Implementation Status

### ✅ Completed

- FastAPI application scaffold
- Health check endpoints (with stubs)
- Document processing endpoints (stubs)
- Classification and extraction endpoints (stubs)
- Pydantic models for all document types
- Configuration management with validation
- Structured JSON logging with request tracking
- Custom exception hierarchy
- Docker multi-stage build
- Comprehensive test suite
- Code quality tooling (black, ruff, mypy)
- Documentation

### 🚧 TODO (Future Implementation)

The following are currently stub implementations and need actual logic:

1. **AWS Textract Integration**
   - Implement `textract_service.extract_text()`
   - Implement `textract_service.analyze_document()`
   - Add error handling and retries

2. **AI Classification**
   - Implement `classifier.classify()` with actual AI logic
   - Create document type detection prompts
   - Parse AI responses into structured results

3. **Data Extraction**
   - Implement `extractor.extract()` for each document type
   - Create extraction prompts for each document type
   - Parse extracted data into Pydantic models

4. **OpenAI/Anthropic Integration**
   - Implement `ai_client._complete_openai()`
   - Implement `ai_client._complete_anthropic()`
   - Add error handling and fallback logic

5. **Readiness Checks**
   - Implement actual dependency checks in `/health/ready`
   - Check AWS S3 connectivity
   - Check Textract availability
   - Check AI provider availability

6. **Additional Features**
   - Add caching for processed documents
   - Add job queue for async processing
   - Add metrics and monitoring
   - Add rate limiting
   - Implement document validation

## Development Workflow

### Adding a New Document Type

1. **Add to enum** (`app/models/document.py`):
   ```python
   class DocumentType(str, Enum):
       NEW_TYPE = "new_type"
   ```

2. **Create data model** (`app/models/extraction.py`):
   ```python
   class NewTypeData(BaseModel):
       field1: str | None
       field2: date | None
   ```

3. **Add extraction logic** (`app/services/extractor.py`):
   ```python
   def _build_extraction_prompt(self, text: str, document_type: DocumentType) -> str:
       prompts[DocumentType.NEW_TYPE] = "Extract..."
   ```

4. **Add tests** (`tests/test_api/test_extraction.py`):
   ```python
   def test_extract_new_type():
       # Test implementation
   ```

### Running from Monorepo Root

The monorepo's `package.json` has been updated with the correct path:

```bash
npm run ai
```

This will run: `cd services/ai && uvicorn app.main:app --reload`

## Troubleshooting

### Import Errors

Ensure you're running from the correct directory:
```bash
cd /path/to/CombatID/services/ai
```

### Missing Dependencies

Reinstall dependencies:
```bash
pip install -r requirements.txt
```

### AWS Credentials

Ensure AWS credentials are configured:
```bash
# Option 1: Environment variables in .env
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Option 2: AWS credentials file
aws configure
```

### Port Already in Use

Change the port in `.env`:
```bash
PORT=8001
```

## Next Steps

1. **Configure AWS**:
   - Set up S3 bucket for document storage
   - Enable Textract in your AWS account
   - Configure IAM permissions

2. **Configure AI Providers**:
   - Get OpenAI API key
   - (Optional) Get Anthropic API key for fallback

3. **Implement Core Logic**:
   - Start with Textract integration
   - Then implement classification
   - Finally implement extraction

4. **Add Monitoring**:
   - Set up logging aggregation
   - Add performance metrics
   - Configure alerts

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the API docs at http://localhost:8000/docs
3. Check test files for usage examples
4. Review the code comments and docstrings
