"""Health check endpoints."""

from datetime import datetime

from fastapi import APIRouter, status
from pydantic import BaseModel, Field

from app.config import settings

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    """Health check response model."""

    status: str = Field(..., description="Service status")
    version: str = Field(..., description="Service version")
    environment: str = Field(..., description="Environment name")
    timestamp: datetime = Field(..., description="Current server timestamp")


class ReadinessResponse(BaseModel):
    """Readiness check response model."""

    ready: bool = Field(..., description="Whether service is ready")
    checks: dict[str, bool] = Field(..., description="Individual dependency checks")
    details: dict[str, str] = Field(
        default_factory=dict, description="Additional details"
    )


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Returns the health status of the service",
)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.

    Returns basic service information and confirms the service is running.
    """
    return HealthResponse(
        status="healthy",
        version=settings.version,
        environment=settings.environment,
        timestamp=datetime.utcnow(),
    )


@router.get(
    "/health/ready",
    response_model=ReadinessResponse,
    status_code=status.HTTP_200_OK,
    summary="Readiness check",
    description="Checks if the service is ready to handle requests",
)
async def readiness_check() -> ReadinessResponse:
    """
    Readiness check endpoint.

    Verifies that all external dependencies are available.
    Currently returns stub data - will be implemented with actual checks.
    """
    # TODO: Implement actual dependency checks
    # - AWS S3 connectivity
    # - AWS Textract availability
    # - OpenAI API availability
    # - Anthropic API availability

    checks = {
        "aws_s3": True,  # Stub
        "aws_textract": True,  # Stub
        "openai": True,  # Stub
        "anthropic": True,  # Stub
    }

    all_ready = all(checks.values())

    return ReadinessResponse(
        ready=all_ready,
        checks=checks,
        details={
            "message": "All systems operational (stub implementation)",
        },
    )
