"""Data extraction and classification endpoints."""

from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from app.core.logging import get_logger
from app.models.document import ClassificationResult, DocumentType
from app.models.extraction import (
    ClassificationRequest,
    ExtractionRequest,
    ExtractionResponse,
)

router = APIRouter(prefix="/api/v1/extract", tags=["extraction"])
logger = get_logger(__name__)


@router.post(
    "/classify",
    response_model=ClassificationResult,
    status_code=status.HTTP_200_OK,
    summary="Classify a document",
    description="Classifies a document into predefined categories",
)
async def classify_document(request: ClassificationRequest) -> ClassificationResult:
    """
    Classify a document type.

    Uses AI to analyze the document and determine its type
    (e.g., medical clearance, photo ID, weigh-in record).

    Args:
        request: Classification request with document_id

    Returns:
        Classification result with document type and confidence

    Raises:
        HTTPException: If classification fails
    """
    logger.info(
        "Document classification requested",
        extra={"document_id": request.document_id, "s3_key": request.s3_key},
    )

    # TODO: Implement actual classification
    # 1. Retrieve document from S3 or cache
    # 2. Extract text using Textract
    # 3. Use OpenAI/Anthropic to classify document type
    # 4. Return classification with confidence score

    # Stub implementation
    return ClassificationResult(
        document_type=DocumentType.UNKNOWN,
        confidence=0.0,
        alternative_types=[],
        reasoning="Stub implementation - actual classification not yet implemented",
    )


@router.post(
    "/data",
    response_model=ExtractionResponse,
    status_code=status.HTTP_200_OK,
    summary="Extract structured data",
    description="Extracts structured data from a classified document",
)
async def extract_data(request: ExtractionRequest) -> ExtractionResponse:
    """
    Extract structured data from a document.

    Based on the document type, extracts relevant fields
    (e.g., names, dates, license numbers).

    Args:
        request: Extraction request with document_id and document_type

    Returns:
        Extracted structured data with confidence scores

    Raises:
        HTTPException: If extraction fails
    """
    logger.info(
        "Data extraction requested",
        extra={
            "document_id": request.document_id,
            "document_type": request.document_type,
            "force_reprocess": request.force_reprocess,
        },
    )

    # TODO: Implement actual data extraction
    # 1. Retrieve document and OCR text
    # 2. Use document-type-specific extraction logic
    # 3. Validate extracted data
    # 4. Return structured data with confidence scores

    # Stub implementation
    if request.document_type == DocumentType.UNKNOWN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot extract data from unknown document type. Classify document first.",
        )

    return ExtractionResponse(
        document_id=request.document_id,
        document_type=request.document_type,
        extracted_data={},
        extracted_fields=[],
        raw_text=None,
        confidence_score=0.0,
        processing_time_ms=0,
        extracted_at=datetime.utcnow(),
        warnings=["Stub implementation - actual extraction not yet implemented"],
    )
