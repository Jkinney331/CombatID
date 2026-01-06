"""Tests for document processing endpoints."""

import pytest
from fastapi import status
from fastapi.testclient import TestClient


def test_process_document_returns_202_accepted(client: TestClient) -> None:
    """Test that process document endpoint returns 202 ACCEPTED."""
    payload = {
        "document_id": "test-doc-123",
        "s3_key": "documents/test.pdf",
        "user_id": "user-456",
    }

    response = client.post("/api/v1/documents/process", json=payload)

    assert response.status_code == status.HTTP_202_ACCEPTED


def test_process_document_returns_job_info(client: TestClient) -> None:
    """Test that process document returns job information."""
    payload = {
        "document_id": "test-doc-123",
        "s3_key": "documents/test.pdf",
    }

    response = client.post("/api/v1/documents/process", json=payload)
    data = response.json()

    assert "job_id" in data
    assert "document_id" in data
    assert "status" in data
    assert data["document_id"] == "test-doc-123"


def test_process_document_requires_document_id(client: TestClient) -> None:
    """Test that document_id is required."""
    payload = {
        "s3_key": "documents/test.pdf",
    }

    response = client.post("/api/v1/documents/process", json=payload)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_process_document_requires_s3_key(client: TestClient) -> None:
    """Test that s3_key is required."""
    payload = {
        "document_id": "test-doc-123",
    }

    response = client.post("/api/v1/documents/process", json=payload)

    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_get_document_status_returns_200(client: TestClient) -> None:
    """Test that get document status endpoint returns 200 OK."""
    response = client.get("/api/v1/documents/test-doc-123/status")

    assert response.status_code == status.HTTP_200_OK


def test_get_document_status_returns_status_info(client: TestClient) -> None:
    """Test that get document status returns status information."""
    response = client.get("/api/v1/documents/test-doc-123/status")
    data = response.json()

    assert "document_id" in data
    assert "status" in data
    assert "progress" in data
    assert data["document_id"] == "test-doc-123"


def test_get_document_status_invalid_document_returns_404(client: TestClient) -> None:
    """Test that invalid document ID returns 404."""
    response = client.get("/api/v1/documents/invalid-not-found/status")

    assert response.status_code == status.HTTP_404_NOT_FOUND
