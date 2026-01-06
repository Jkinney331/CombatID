"""Application configuration using pydantic-settings."""

from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Server configuration
    port: int = Field(default=8000, description="Server port")
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
        default="INFO", description="Logging level"
    )
    environment: Literal["development", "staging", "production"] = Field(
        default="development", description="Environment name"
    )
    app_name: str = Field(default="CombatID AI Service", description="Application name")
    version: str = Field(default="0.1.0", description="Application version")

    # CORS settings
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"],
        description="Allowed CORS origins",
    )

    # AWS Configuration
    aws_region: str = Field(default="us-east-1", description="AWS region")
    aws_access_key_id: str = Field(default="", description="AWS access key ID")
    aws_secret_access_key: str = Field(default="", description="AWS secret access key")
    s3_bucket: str = Field(
        default="combatid-documents", description="S3 bucket for documents"
    )

    # AI Service API Keys
    openai_api_key: str = Field(default="", description="OpenAI API key")
    anthropic_api_key: str = Field(default="", description="Anthropic API key")

    # OpenAI Configuration
    openai_model: str = Field(
        default="gpt-4-turbo-preview", description="OpenAI model to use"
    )
    openai_max_tokens: int = Field(
        default=4096, description="Maximum tokens for OpenAI responses"
    )
    openai_temperature: float = Field(
        default=0.0, description="Temperature for OpenAI responses"
    )

    # Anthropic Configuration
    anthropic_model: str = Field(
        default="claude-3-5-sonnet-20241022", description="Anthropic model to use"
    )
    anthropic_max_tokens: int = Field(
        default=4096, description="Maximum tokens for Anthropic responses"
    )

    # Processing Configuration
    max_document_size_mb: int = Field(
        default=10, description="Maximum document size in MB"
    )
    processing_timeout_seconds: int = Field(
        default=300, description="Document processing timeout in seconds"
    )

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: str | list[str]) -> list[str]:
        """Parse CORS origins from comma-separated string or list."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    def validate_required_settings(self) -> None:
        """Validate that required settings are configured for production."""
        if self.environment == "production":
            required_settings = {
                "aws_access_key_id": self.aws_access_key_id,
                "aws_secret_access_key": self.aws_secret_access_key,
                "openai_api_key": self.openai_api_key,
            }
            missing = [key for key, value in required_settings.items() if not value]
            if missing:
                raise ValueError(
                    f"Missing required settings for production: {', '.join(missing)}"
                )

    @property
    def max_document_size_bytes(self) -> int:
        """Get maximum document size in bytes."""
        return self.max_document_size_mb * 1024 * 1024


# Global settings instance
settings = Settings()
