"""Document processing endpoints."""

import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from app.core.logging import get_logger
from app.models.document import (
    DocumentProcessRequest,
    DocumentProcessResponse,
    DocumentStatusResponse,
    ProcessingStatus,
)

router = APIRouter(prefix="/api/v1/documents", tags=["documents"])
logger = get_logger(__name__)


@router.post(
    "/process",
    response_model=DocumentProcessResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Process a document",
    description="Initiates processing of a document from S3",
)
async def process_document(request: DocumentProcessRequest) -> DocumentProcessResponse:
    """
    Process a document from S3.

    This endpoint accepts a document ID and S3 key, then initiates
    OCR processing, classification, and data extraction.

    Args:
        request: Document processing request with document_id and s3_key

    Returns:
        Processing job information with job_id and status

    Raises:
        HTTPException: If the document cannot be processed
    """
    logger.info(
        "Document processing requested",
        extra={
            "document_id": request.document_id,
            "s3_key": request.s3_key,
            "user_id": request.user_id,
        },
    )

    # TODO: Implement actual document processing
    # 1. Validate document exists in S3
    # 2. Check document size and format
    # 3. Queue processing job
    # 4. Return job ID

    # Stub implementation
    job_id = str(uuid.uuid4())

    return DocumentProcessResponse(
        job_id=job_id,
        document_id=request.document_id,
        status=ProcessingStatus.PENDING,
        message="Document processing queued (stub implementation)",
        created_at=datetime.utcnow(),
    )


@router.get(
    "/{document_id}/status",
    response_model=DocumentStatusResponse,
    status_code=status.HTTP_200_OK,
    summary="Get document processing status",
    description="Retrieves the current processing status of a document",
)
async def get_document_status(document_id: str) -> DocumentStatusResponse:
    """
    Get the processing status of a document.

    Args:
        document_id: Unique identifier of the document

    Returns:
        Current processing status and progress

    Raises:
        HTTPException: If document is not found
    """
    logger.info("Document status requested", extra={"document_id": document_id})

    # TODO: Implement actual status retrieval
    # 1. Query processing job status from database/cache
    # 2. Return current status and progress
    # 3. Include any error messages

    # Stub implementation - simulate document not found for demonstration
    if document_id.startswith("invalid"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document not found: {document_id}",
        )

    return DocumentStatusResponse(
        document_id=document_id,
        status=ProcessingStatus.PENDING,
        progress=0,
        document_type=None,
        extraction_complete=False,
        error_message=None,
        started_at=None,
        completed_at=None,
        metadata={"note": "Stub implementation"},
    )
