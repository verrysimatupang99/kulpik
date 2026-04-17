#!/bin/bash
# Database Setup Script for KulPik
# This script helps you set up the Supabase database with all migrations

set -e

echo "=========================================="
echo "KulPik Database Setup"
echo "=========================================="
echo ""
echo "This script will guide you through setting up your Supabase database."
echo ""

# Check if SUPABASE_URL and SUPABASE_SERVICE_KEY are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
    echo "⚠️  Environment variables not found!"
    echo ""
    echo "Please set these environment variables first:"
    echo "  export SUPABASE_URL='your-supabase-project-url'"
    echo "  export SUPABASE_SERVICE_KEY='your-service-role-key'"
    echo ""
    echo "You can find these in your Supabase Dashboard:"
    echo "  - URL: Project Settings > API"
    echo "  - Service Key: Project Settings > API > service_role secret"
    echo ""
    echo "Alternatively, create a .env file with these variables."
    echo ""
    
    # Ask user if they want to continue interactively
    read -p "Do you want to enter your Supabase credentials now? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled. Please set the environment variables and run this script again."
        exit 1
    fi
    
    read -p "Enter your SUPABASE_URL: " SUPABASE_URL
    read -sp "Enter your SUPABASE_SERVICE_KEY: " SUPABASE_SERVICE_KEY
    echo
    export SUPABASE_URL
    export SUPABASE_SERVICE_KEY
fi

echo "✅ Using Supabase project: ${SUPABASE_URL}"
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "❌ psql is not installed. Please install PostgreSQL client tools."
    echo ""
    echo "On Ubuntu/Debian:"
    echo "  sudo apt-get install postgresql-client"
    echo ""
    echo "On macOS (with Homebrew):"
    echo "  brew install postgresql"
    echo ""
    echo "Or use the Supabase Dashboard web interface instead:"
    echo "  1. Go to your Supabase Dashboard"
    echo "  2. Navigate to SQL Editor"
    echo "  3. Copy and paste each migration file content"
    echo "  4. Run them in order (001, 002, 003)"
    exit 1
fi

echo "🚀 Starting database migrations..."
echo ""

# Migration files in order
MIGRATIONS=(
    "supabase/migrations/001_initial_schema.sql"
    "supabase/migrations/002_seed_jurusan_requirements.sql"
    "supabase/migrations/003_pgvector.sql"
)

for migration in "${MIGRATIONS[@]}"; do
    if [ ! -f "$migration" ]; then
        echo "❌ Migration file not found: $migration"
        exit 1
    fi
    
    filename=$(basename "$migration")
    echo "📄 Running: $filename"
    
    # Run migration using psql
    if psql "$SUPABASE_URL" -U postgres -c "$(cat "$migration")" --no-password &> /dev/null; then
        echo "   ✅ Successfully applied: $filename"
    else
        # Try with connection string format
        if psql "$SUPABASE_URL" -c "$(cat "$migration")" --no-password &> /dev/null; then
            echo "   ✅ Successfully applied: $filename"
        else
            echo "   ❌ Failed to apply: $filename"
            echo ""
            echo "Please try applying this migration manually via Supabase Dashboard SQL Editor."
            echo "Content of $migration:"
            echo "---"
            cat "$migration"
            echo "---"
            exit 1
        fi
    fi
done

echo ""
echo "=========================================="
echo "✅ Database setup completed successfully!"
echo "=========================================="
echo ""
echo "Your Supabase database now has:"
echo "  ✓ Laptops table"
echo "  ✓ Jurusan (major) tables"
echo "  ✓ Software specs"
echo "  ✓ Laptop-jurusan scores"
echo "  ✓ Price history"
echo "  ✓ Reviews table"
echo "  ✓ pgvector extension enabled"
echo "  ✓ Vector search functions"
echo ""
echo "Next steps:"
echo "  1. Set your API keys in .env file:"
echo "     - COHERE_API_KEY (free trial tier available)"
echo "     - EXA_API_KEY (free tier: 100 requests/day)"
echo "     - GEMINI_API_KEY (free tier available)"
echo ""
echo "  2. Start running auto_curation.py to populate laptop data"
echo "  3. Deploy your application!"
echo ""
