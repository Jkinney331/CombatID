"""Document classification service."""

from app.core.logging import get_logger
from app.models.document import ClassificationResult, DocumentType
from app.services.openai_client import ai_client
from app.services.textract import textract_service

logger = get_logger(__name__)


class DocumentClassifier:
    """Service for classifying documents using AI."""

    async def classify(
        self, document_id: str, s3_key: str
    ) -> ClassificationResult:
        """
        Classify a document type.

        Args:
            document_id: Unique identifier for the document
            s3_key: S3 object key for the document

        Returns:
            Classification result with document type and confidence

        Raises:
            ClassificationError: If classification fails
        """
        logger.info(
            "Starting document classification",
            extra={"document_id": document_id, "s3_key": s3_key},
        )

        # TODO: Implement actual classification
        # 1. Extract text using Textract
        # textract_result = await textract_service.extract_text(s3_key)
        # extracted_text = textract_result.get("text", "")
        #
        # 2. Use AI to classify based on text content
        # classification_prompt = self._build_classification_prompt(extracted_text)
        # ai_response = await ai_client.complete(
        #     prompt=classification_prompt,
        #     system_prompt="You are a document classifier...",
        #     temperature=0.0,
        # )
        #
        # 3. Parse AI response and determine document type
        # document_type, confidence = self._parse_classification(ai_response)

        # Stub implementation
        logger.info(
            "Document classification completed (stub)",
            extra={"document_id": document_id},
        )

        return ClassificationResult(
            document_type=DocumentType.UNKNOWN,
            confidence=0.0,
            alternative_types=[],
            reasoning="Stub implementation - actual classification not implemented",
        )

    def _build_classification_prompt(self, text: str) -> str:
        """
        Build the classification prompt for AI.

        Args:
            text: Extracted document text

        Returns:
            Formatted prompt for classification
        """
        # TODO: Implement actual prompt building
        return f"Classify this document:\n\n{text}"

    def _parse_classification(
        self, ai_response: str
    ) -> tuple[DocumentType, float]:
        """
        Parse AI response to extract document type and confidence.

        Args:
            ai_response: Raw AI response

        Returns:
            Tuple of (document_type, confidence_score)
        """
        # TODO: Implement actual response parsing
        return DocumentType.UNKNOWN, 0.0


# Global classifier instance
classifier = DocumentClassifier()
