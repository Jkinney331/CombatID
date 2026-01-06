"""Tests for health check endpoints."""

from datetime import datetime

import pytest
from fastapi import status
from fastapi.testclient import TestClient

from app.config import settings


def test_health_check_returns_200(client: TestClient) -> None:
    """Test that health check endpoint returns 200 OK."""
    response = client.get("/health")

    assert response.status_code == status.HTTP_200_OK


def test_health_check_returns_correct_structure(client: TestClient) -> None:
    """Test that health check returns expected JSON structure."""
    response = client.get("/health")
    data = response.json()

    assert "status" in data
    assert "version" in data
    assert "environment" in data
    assert "timestamp" in data


def test_health_check_status_is_healthy(client: TestClient) -> None:
    """Test that health status is 'healthy'."""
    response = client.get("/health")
    data = response.json()

    assert data["status"] == "healthy"


def test_health_check_version_matches_settings(client: TestClient) -> None:
    """Test that version matches application settings."""
    response = client.get("/health")
    data = response.json()

    assert data["version"] == settings.version


def test_health_check_environment_matches_settings(client: TestClient) -> None:
    """Test that environment matches application settings."""
    response = client.get("/health")
    data = response.json()

    assert data["environment"] == settings.environment


def test_health_check_timestamp_is_valid_iso_format(client: TestClient) -> None:
    """Test that timestamp is in valid ISO format."""
    response = client.get("/health")
    data = response.json()

    # Should not raise ValueError if valid ISO format
    datetime.fromisoformat(data["timestamp"].replace("Z", "+00:00"))


def test_readiness_check_returns_200(client: TestClient) -> None:
    """Test that readiness check endpoint returns 200 OK."""
    response = client.get("/health/ready")

    assert response.status_code == status.HTTP_200_OK


def test_readiness_check_returns_correct_structure(client: TestClient) -> None:
    """Test that readiness check returns expected JSON structure."""
    response = client.get("/health/ready")
    data = response.json()

    assert "ready" in data
    assert "checks" in data
    assert "details" in data


def test_readiness_check_includes_dependency_checks(client: TestClient) -> None:
    """Test that readiness check includes all dependency checks."""
    response = client.get("/health/ready")
    data = response.json()

    expected_checks = ["aws_s3", "aws_textract", "openai", "anthropic"]

    for check in expected_checks:
        assert check in data["checks"]


def test_readiness_check_ready_is_boolean(client: TestClient) -> None:
    """Test that ready field is a boolean."""
    response = client.get("/health/ready")
    data = response.json()

    assert isinstance(data["ready"], bool)


def test_root_endpoint_returns_service_info(client: TestClient) -> None:
    """Test that root endpoint returns service information."""
    response = client.get("/")

    assert response.status_code == status.HTTP_200_OK

    data = response.json()
    assert "service" in data
    assert "version" in data
    assert "docs" in data
    assert "health" in data


def test_root_endpoint_includes_docs_link(client: TestClient) -> None:
    """Test that root endpoint includes link to documentation."""
    response = client.get("/")
    data = response.json()

    assert data["docs"] == "/docs"
    assert data["health"] == "/health"
