#!/usr/bin/env python3
"""
KulPik Environment Validation Script
Validates all required environment variables before starting the application
"""

import os
import sys
from typing import List, Tuple

# Define required variables and their purposes
REQUIRED_VARS: List[Tuple[str, str]] = [
    ("SUPABASE_URL", "Supabase project URL"),
    ("SUPABASE_SERVICE_ROLE_KEY", "Supabase service role key (for admin operations)"),
    ("EXA_API_KEY", "EXA search API key (for laptop data retrieval)"),
    ("COHERE_API_KEY", "Cohere API key (for embeddings and text processing)"),
]

OPTIONAL_VARS: List[Tuple[str, str]] = [
    ("GEMINI_API_KEY", "Google Gemini API key (for AI recommendations)"),
    ("CORS_ORIGINS", "Allowed CORS origins (comma-separated)"),
    ("SENTRY_DSN", "Sentry DSN for error tracking"),
    ("PORT", "Server port (default: 5000)"),
    ("DEBUG", "Debug mode (true/false, default: false)"),
    ("LOG_LEVEL", "Logging level (DEBUG/INFO/WARNING/ERROR)"),
]


def validate_environment():
    """Validate all required environment variables are set."""
    print("🔍 KulPik Environment Validation")
    print("=" * 50)
    print()

    missing_required = []
    missing_optional = []

    # Check required variables
    for var, description in REQUIRED_VARS:
        value = os.getenv(var)
        if not value:
            missing_required.append((var, description))
        else:
            # Don't print the value for security, just confirm it exists
            print(f"✅ {var}: {description}")

    # Check optional variables
    for var, description in OPTIONAL_VARS:
        value = os.getenv(var)
        if not value:
            missing_optional.append((var, description))
        else:
            print(f"✅ {var}: {description}")

    print()

    # Report results
    if missing_required:
        print("❌ Missing REQUIRED environment variables:")
        for var, desc in missing_required:
            print(f"   - {var}: {desc}")
        print()
        print("Please add these to your .env.local or .env.production file")
        print()
        return False

    if missing_optional:
        print("⚠️  Missing OPTIONAL environment variables:")
        for var, desc in missing_optional:
            print(f"   - {var}: {desc}")
        print("   (These are optional but recommended)")
        print()

    print("✅ All required environment variables are set!")
    print()

    # Additional checks
    print("🔧 Additional checks:")

    # Check if DEBUG is enabled (warn for production)
    debug_mode = os.getenv("DEBUG", "false").lower()
    if debug_mode == "true":
        print("⚠️  WARNING: DEBUG mode is enabled!")
        print("   This should be set to 'false' in production!")

    # Check port
    port = os.getenv("PORT", "5000")
    try:
        port_int = int(port)
        if port_int < 1024 or port_int > 65535:
            print(f"⚠️  WARNING: Port {port} may cause issues")
            print("   Recommended range: 1024-65535")
    except ValueError:
        print(f"❌ ERROR: Invalid port number: {port}")
        return False

    # Check log level
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    valid_levels = ["DEBUG", "INFO", "WARNING", "ERROR"]
    if log_level not in valid_levels:
        print(f"⚠️  WARNING: Invalid LOG_LEVEL: {log_level}")
        print(f"   Valid levels: {', '.join(valid_levels)}")

    print()
    print("🎉 Environment validation passed!")
    return True


if __name__ == "__main__":
    # Load .env file if it exists
    try:
        from dotenv import load_dotenv

        # Try to load .env files in order of preference
        if os.path.exists(".env.production"):
            load_dotenv(".env.production")
            print("📝 Loaded .env.production")
        elif os.path.exists(".env.local"):
            load_dotenv(".env.local")
            print("📝 Loaded .env.local")
        elif os.path.exists(".env"):
            load_dotenv(".env")
            print("📝 Loaded .env")
        else:
            print("⚠️  No .env file found, using system environment variables")
    except ImportError:
        print("⚠️  python-dotenv not installed, using system environment variables")

    print()

    # Validate
    success = validate_environment()

    if not success:
        sys.exit(1)
