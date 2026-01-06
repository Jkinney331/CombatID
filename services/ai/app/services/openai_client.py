"""OpenAI client with Anthropic fallback."""

from typing import Any

from anthropic import Anthropic, APIError as AnthropicAPIError
from openai import AsyncOpenAI, APIError as OpenAIAPIError

from app.config import settings
from app.core.exceptions import AIProviderError
from app.core.logging import get_logger

logger = get_logger(__name__)


class AIClient:
    """
    AI client with OpenAI as primary and Anthropic as fallback.

    Provides a unified interface for AI operations with automatic
    fallback to Anthropic if OpenAI is unavailable.
    """

    def __init__(self) -> None:
        """Initialize AI clients."""
        self.openai_client = (
            AsyncOpenAI(api_key=settings.openai_api_key)
            if settings.openai_api_key
            else None
        )
        self.anthropic_client = (
            Anthropic(api_key=settings.anthropic_api_key)
            if settings.anthropic_api_key
            else None
        )

        if not self.openai_client and not self.anthropic_client:
            logger.warning("No AI provider configured - both OpenAI and Anthropic keys are missing")

    async def complete(
        self,
        prompt: str,
        system_prompt: str | None = None,
        max_tokens: int | None = None,
        temperature: float | None = None,
        use_fallback: bool = True,
    ) -> str:
        """
        Generate a completion using AI.

        Tries OpenAI first, falls back to Anthropic if enabled and OpenAI fails.

        Args:
            prompt: User prompt
            system_prompt: Optional system prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            use_fallback: Whether to use Anthropic as fallback

        Returns:
            Generated completion text

        Raises:
            AIProviderError: If completion fails on all providers
        """
        max_tokens = max_tokens or settings.openai_max_tokens
        temperature = temperature or settings.openai_temperature

        # Try OpenAI first
        if self.openai_client:
            try:
                return await self._complete_openai(
                    prompt, system_prompt, max_tokens, temperature
                )
            except OpenAIAPIError as e:
                logger.warning(
                    "OpenAI completion failed",
                    extra={"error": str(e), "use_fallback": use_fallback},
                )
                if not use_fallback:
                    raise AIProviderError(
                        f"OpenAI completion failed: {str(e)}"
                    ) from e

        # Try Anthropic as fallback
        if self.anthropic_client and use_fallback:
            try:
                return await self._complete_anthropic(
                    prompt, system_prompt, max_tokens, temperature
                )
            except AnthropicAPIError as e:
                logger.error(
                    "Anthropic completion failed", extra={"error": str(e)}, exc_info=True
                )
                raise AIProviderError(
                    f"Anthropic completion failed: {str(e)}"
                ) from e

        raise AIProviderError("No AI provider available or configured")

    async def _complete_openai(
        self,
        prompt: str,
        system_prompt: str | None,
        max_tokens: int,
        temperature: float,
    ) -> str:
        """
        Generate completion using OpenAI.

        Args:
            prompt: User prompt
            system_prompt: Optional system prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature

        Returns:
            Generated completion text
        """
        logger.info("Generating OpenAI completion")

        # TODO: Implement actual OpenAI API call
        # messages = []
        # if system_prompt:
        #     messages.append({"role": "system", "content": system_prompt})
        # messages.append({"role": "user", "content": prompt})
        #
        # response = await self.openai_client.chat.completions.create(
        #     model=settings.openai_model,
        #     messages=messages,
        #     max_tokens=max_tokens,
        #     temperature=temperature,
        # )
        # return response.choices[0].message.content

        # Stub implementation
        return "OpenAI completion (stub implementation)"

    async def _complete_anthropic(
        self,
        prompt: str,
        system_prompt: str | None,
        max_tokens: int,
        temperature: float,
    ) -> str:
        """
        Generate completion using Anthropic.

        Args:
            prompt: User prompt
            system_prompt: Optional system prompt
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature

        Returns:
            Generated completion text
        """
        logger.info("Generating Anthropic completion (fallback)")

        # TODO: Implement actual Anthropic API call
        # response = self.anthropic_client.messages.create(
        #     model=settings.anthropic_model,
        #     max_tokens=max_tokens,
        #     temperature=temperature,
        #     system=system_prompt or "",
        #     messages=[{"role": "user", "content": prompt}],
        # )
        # return response.content[0].text

        # Stub implementation
        return "Anthropic completion (stub implementation)"


# Global AI client instance
ai_client = AIClient()
