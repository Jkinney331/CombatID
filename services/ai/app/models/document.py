"""Pydantic models for document operations."""

from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class DocumentType(str, Enum):
    """Supported document types for classification."""

    MEDICAL_CLEARANCE = "medical_clearance"
    PHOTO_ID = "photo_id"
    WEIGH_IN_RECORD = "weigh_in_record"
    CONTRACT = "contract"
    INSURANCE_CERT = "insurance_certificate"
    LICENSE = "license"
    OTHER = "other"
    UNKNOWN = "unknown"


class ProcessingStatus(str, Enum):
    """Document processing status."""

    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class DocumentProcessRequest(BaseModel):
    """Request to process a document."""

    document_id: str = Field(..., description="Unique document identifier")
    s3_key: str = Field(..., description="S3 object key for the document")
    user_id: str | None = Field(None, description="User who uploaded the document")
    metadata: dict[str, Any] = Field(
        default_factory=dict, description="Additional metadata"
    )


class DocumentProcessResponse(BaseModel):
    """Response from document processing request."""

    job_id: str = Field(..., description="Processing job identifier")
    document_id: str = Field(..., description="Document identifier")
    status: ProcessingStatus = Field(..., description="Processing status")
    message: str | None = Field(None, description="Status message")
    created_at: datetime = Field(
        default_factory=datetime.utcnow, description="Job creation timestamp"
    )


class DocumentStatusResponse(BaseModel):
    """Response with document processing status."""

    document_id: str = Field(..., description="Document identifier")
    status: ProcessingStatus = Field(..., description="Processing status")
    progress: int = Field(default=0, ge=0, le=100, description="Progress percentage")
    document_type: DocumentType | None = Field(
        None, description="Classified document type"
    )
    extraction_complete: bool = Field(
        default=False, description="Whether data extraction is complete"
    )
    error_message: str | None = Field(None, description="Error message if failed")
    started_at: datetime | None = Field(None, description="Processing start time")
    completed_at: datetime | None = Field(None, description="Processing completion time")
    metadata: dict[str, Any] = Field(
        default_factory=dict, description="Additional metadata"
    )


class ClassificationResult(BaseModel):
    """Result of document classification."""

    document_type: DocumentType = Field(..., description="Classified document type")
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Classification confidence score"
    )
    alternative_types: list[tuple[DocumentType, float]] = Field(
        default_factory=list,
        description="Alternative classifications with confidence scores",
    )
    reasoning: str | None = Field(
        None, description="Explanation of classification decision"
    )
