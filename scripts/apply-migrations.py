#!/usr/bin/env python3
"""
Apply Supabase migrations without CLI tool.
This script applies the SQL migrations directly via Supabase API.
"""

import os
import requests
import sys
from loguru import logger

def load_env():
    """Load environment variables from .env.local or .env"""
    env_files = [".env.local", ".env"]
    env_vars = {}
    
    for env_file in env_files:
        if os.path.exists(env_file):
            logger.info(f"Loading environment from {env_file}")
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#"):
                        if "=" in line:
                            key, value = line.split("=", 1)
                            env_vars[key] = value
    
    return env_vars

def apply_migration(migration_file, supabase_url, supabase_key):
    """Apply a single migration file."""
    logger.info(f"Applying migration: {migration_file}")
    
    # Read SQL file
    with open(migration_file, 'r') as f:
        sql_content = f.read()
    
    # Use Supabase REST API to run SQL
    # Note: Supabase doesn't have a direct SQL API endpoint
    # We need to use the SQL Editor API
    
    logger.warning(f"Migration {migration_file} cannot be applied automatically.")
    logger.warning("Please apply manually via Supabase Dashboard:")
    logger.warning(f"1. Go to https://app.supabase.com")
    logger.warning(f"2. Open your project")
    logger.warning(f"3. Go to SQL Editor")
    logger.warning(f"4. Run the SQL from {migration_file}")
    
    return False

def main():
    logger.info("🔄 KulPik Migration Application")
    logger.info("================================")
    
    # Load environment
    env = load_env()
    
    SUPABASE_URL = env.get("SUPABASE_URL", "")
    SUPABASE_SERVICE_ROLE_KEY = env.get("SUPABASE_SERVICE_ROLE_KEY", "")
    
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        logger.error("❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required in environment")
        sys.exit(1)
    
    logger.info(f"✅ Supabase URL: {SUPABASE_URL}")
    
    # List migrations to apply
    migrations_dir = "supabase/migrations"
    migrations = [
        "001_initial_schema.sql",
        "002_seed_jurusan_requirements.sql", 
        "003_pgvector.sql"
    ]
    
    logger.info(f"📋 Found {len(migrations)} migration files")
    
    for migration in migrations:
        migration_path = os.path.join(migrations_dir, migration)
        if not os.path.exists(migration_path):
            logger.error(f"❌ Migration file not found: {migration_path}")
            continue
        
        apply_migration(migration_path, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    logger.info("✅ Migration instructions printed")
    logger.info("📝 To apply migrations:")
    logger.info("   - Install Supabase CLI: npm install -g supabase")
    logger.info("   - Run: cd supabase && supabase db push")
    logger.info("   OR")
    logger.info("   - Apply manually via SQL Editor in Supabase Dashboard")

if __name__ == "__main__":
    main()