"""FastAPI dependencies."""

import uuid
from typing import Annotated

from fastapi import Header, Request

from app.core.logging import request_id_var
from app.services.classifier import classifier
from app.services.extractor import extractor
from app.services.openai_client import ai_client
from app.services.textract import textract_service


async def get_request_id(
    request: Request, x_request_id: Annotated[str | None, Header()] = None
) -> str:
    """
    Get or generate request ID for tracking.

    Args:
        request: FastAPI request object
        x_request_id: Optional request ID from header

    Returns:
        Request ID string
    """
    request_id = x_request_id or str(uuid.uuid4())
    request_id_var.set(request_id)
    return request_id


def get_textract_service():
    """Get Textract service instance."""
    return textract_service


def get_ai_client():
    """Get AI client instance."""
    return ai_client


def get_classifier():
    """Get document classifier instance."""
    return classifier


def get_extractor():
    """Get data extractor instance."""
    return extractor
