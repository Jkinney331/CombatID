"""Pytest configuration and fixtures."""

from typing import AsyncGenerator

import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

from app.main import app


@pytest.fixture
def client() -> TestClient:
    """
    Create a test client for the FastAPI application.

    Returns:
        TestClient instance
    """
    return TestClient(app)


@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async test client for the FastAPI application.

    Yields:
        AsyncClient instance
    """
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
