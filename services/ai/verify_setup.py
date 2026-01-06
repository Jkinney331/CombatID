#!/usr/bin/env python3
"""Verification script for AI service setup."""

import sys
from pathlib import Path


def verify_structure() -> bool:
    """Verify that all required files and directories exist."""
    base_path = Path(__file__).parent

    required_files = [
        # Root files
        "app/__init__.py",
        "app/main.py",
        "app/config.py",
        # Core
        "app/core/__init__.py",
        "app/core/logging.py",
        "app/core/exceptions.py",
        # Models
        "app/models/__init__.py",
        "app/models/document.py",
        "app/models/extraction.py",
        # API
        "app/api/__init__.py",
        "app/api/deps.py",
        "app/api/routes/__init__.py",
        "app/api/routes/health.py",
        "app/api/routes/documents.py",
        "app/api/routes/extraction.py",
        # Services
        "app/services/__init__.py",
        "app/services/textract.py",
        "app/services/openai_client.py",
        "app/services/classifier.py",
        "app/services/extractor.py",
        # Tests
        "tests/__init__.py",
        "tests/conftest.py",
        "tests/test_health.py",
        "tests/test_api/__init__.py",
        "tests/test_api/test_documents.py",
        # Configuration
        "pyproject.toml",
        "requirements.txt",
        "Dockerfile",
        ".env.example",
        ".gitignore",
        ".dockerignore",
        "README.md",
    ]

    missing_files = []
    for file_path in required_files:
        full_path = base_path / file_path
        if not full_path.exists():
            missing_files.append(file_path)

    if missing_files:
        print("❌ Missing files:")
        for file in missing_files:
            print(f"  - {file}")
        return False

    print("✅ All required files present")
    return True


def main() -> int:
    """Run verification."""
    print("Verifying CombatID AI Service setup...")
    print()

    if not verify_structure():
        print()
        print("Setup verification failed!")
        return 1

    print()
    print("✅ Setup verification passed!")
    print()
    print("Next steps:")
    print("1. Copy .env.example to .env and configure your API keys")
    print("2. Install dependencies: pip install -r requirements.txt")
    print("3. Run the server: uvicorn app.main:app --reload")
    print("4. Run tests: pytest")
    print("5. View API docs: http://localhost:8000/docs")

    return 0


if __name__ == "__main__":
    sys.exit(main())
