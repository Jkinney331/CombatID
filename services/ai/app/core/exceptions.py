"""Custom exceptions for the AI service."""


class AIServiceException(Exception):
    """Base exception for all AI service errors."""

    def __init__(self, message: str, details: dict | None = None) -> None:
        """Initialize exception with message and optional details."""
        self.message = message
        self.details = details or {}
        super().__init__(self.message)


class DocumentProcessingError(AIServiceException):
    """Raised when document processing fails."""

    pass


class DocumentNotFoundException(AIServiceException):
    """Raised when a document is not found."""

    pass


class ClassificationError(AIServiceException):
    """Raised when document classification fails."""

    pass


class ExtractionError(AIServiceException):
    """Raised when data extraction fails."""

    pass


class TextractError(AIServiceException):
    """Raised when AWS Textract operations fail."""

    pass


class AIProviderError(AIServiceException):
    """Raised when AI provider (OpenAI/Anthropic) operations fail."""

    pass


class InvalidDocumentError(AIServiceException):
    """Raised when a document is invalid or corrupted."""

    pass


class DocumentTooLargeError(AIServiceException):
    """Raised when a document exceeds size limits."""

    pass


class ConfigurationError(AIServiceException):
    """Raised when configuration is invalid or missing."""

    pass
