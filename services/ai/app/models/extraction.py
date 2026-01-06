"""Pydantic models for data extraction."""

from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, Field

from app.models.document import DocumentType


class ExtractionRequest(BaseModel):
    """Request to extract data from a document."""

    document_id: str = Field(..., description="Document identifier")
    document_type: DocumentType = Field(
        ..., description="Type of document to extract from"
    )
    s3_key: str | None = Field(None, description="S3 object key if not stored")
    force_reprocess: bool = Field(
        default=False, description="Force reprocessing even if cached"
    )


class ClassificationRequest(BaseModel):
    """Request to classify a document."""

    document_id: str = Field(..., description="Document identifier")
    s3_key: str | None = Field(None, description="S3 object key if not stored")


class ExtractedField(BaseModel):
    """A single extracted field with metadata."""

    field_name: str = Field(..., description="Name of the extracted field")
    value: str | int | float | bool | date | None = Field(
        ..., description="Extracted value"
    )
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Extraction confidence score"
    )
    source_location: dict[str, Any] | None = Field(
        None, description="Location in document where value was found"
    )


class MedicalClearanceData(BaseModel):
    """Extracted data from medical clearance documents."""

    fighter_name: str | None = Field(None, description="Fighter name")
    date_of_birth: date | None = Field(None, description="Date of birth")
    clearance_date: date | None = Field(None, description="Date of medical clearance")
    expiration_date: date | None = Field(None, description="Clearance expiration date")
    physician_name: str | None = Field(None, description="Examining physician name")
    physician_license: str | None = Field(None, description="Physician license number")
    cleared_for_competition: bool | None = Field(
        None, description="Cleared for competition"
    )
    restrictions: list[str] = Field(
        default_factory=list, description="Medical restrictions"
    )
    notes: str | None = Field(None, description="Additional notes")


class PhotoIDData(BaseModel):
    """Extracted data from photo ID documents."""

    full_name: str | None = Field(None, description="Full name on ID")
    date_of_birth: date | None = Field(None, description="Date of birth")
    id_number: str | None = Field(None, description="ID number")
    issue_date: date | None = Field(None, description="ID issue date")
    expiration_date: date | None = Field(None, description="ID expiration date")
    address: str | None = Field(None, description="Address on ID")
    id_type: str | None = Field(
        None, description="Type of ID (passport, driver_license, etc.)"
    )
    issuing_authority: str | None = Field(None, description="Issuing authority")


class WeighInData(BaseModel):
    """Extracted data from weigh-in records."""

    fighter_name: str | None = Field(None, description="Fighter name")
    weight: float | None = Field(None, description="Weight in pounds")
    weight_class: str | None = Field(None, description="Weight class")
    weigh_in_date: date | None = Field(None, description="Date of weigh-in")
    weigh_in_time: str | None = Field(None, description="Time of weigh-in")
    official_name: str | None = Field(None, description="Official conducting weigh-in")
    made_weight: bool | None = Field(None, description="Whether fighter made weight")


class ExtractionResponse(BaseModel):
    """Response from data extraction."""

    document_id: str = Field(..., description="Document identifier")
    document_type: DocumentType = Field(..., description="Document type")
    extracted_data: (
        MedicalClearanceData | PhotoIDData | WeighInData | dict[str, Any]
    ) = Field(..., description="Extracted structured data")
    extracted_fields: list[ExtractedField] = Field(
        default_factory=list, description="Individual extracted fields with metadata"
    )
    raw_text: str | None = Field(None, description="Raw extracted text")
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0, description="Overall extraction confidence"
    )
    processing_time_ms: int = Field(..., description="Processing time in milliseconds")
    extracted_at: datetime = Field(
        default_factory=datetime.utcnow, description="Extraction timestamp"
    )
    warnings: list[str] = Field(
        default_factory=list, description="Extraction warnings"
    )
