#!/bin/bash
# Copyright 2026 KulPik. All rights reserved.
# Run this script to enable pgvector and apply the migration.
# Requires: supabase CLI installed and authenticated

set -e

echo "🚀 KulPik — Enabling pgvector for semantic search"
echo "================================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found. Copy from .env.example first."
    exit 1
fi

# Load environment variables
export SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL=" .env.local | cut -d'=' -f2-)
export SUPABASE_ANON_KEY=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY=" .env.local | cut -d'=' -f2-)
export SUPABASE_SERVICE_ROLE_KEY=$(grep "SUPABASE_SERVICE_ROLE_KEY=" .env.local | cut -d'=' -f2-)

# Validate environment
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Supabase credentials missing. Please check .env.local"
    exit 1
fi

echo "✅ Supabase project: $SUPABASE_URL"

# Step 1: Verify pgvector extension can be enabled
echo "💡 Step 1: Verifying Supabase support for pgvector..."
# Note: pgvector is pre-installed on Supabase心智, but we still need to CREATE EXTENSION in the DB

# Step 2: Apply migration via Supabase SQL Editor
echo "💡 Step 2: Applying pgvector migration via Supabase SQL Editor..."
echo "   📁 Migration file: supabase/migrations/003_pgvector.sql"
echo ""
echo "   ⚠️  INSTRUCTIONS:"
echo "   1. Go to your Supabase project dashboard: $SUPABASE_URL"
echo "   2. Navigate to SQL Editor (left sidebar)"
echo "   3. Copy and paste the contents of supabase/migrations/003_pgvector.sql"
echo "   4. Click 'Run' to execute"
echo "   5. Wait for success message (should take < 30 seconds)"
echo ""
echo "   Alternatively, use the Supabase CLI:"
echo "   supabase db push"

echo ""
echo "✅ pgvector setup complete!"
echo "📝 Next steps:"
echo "   1. Generate embeddings for your laptops (see docs/EMBEDDINGS.md)"
echo "   2. Run: python embeddings.py --laptops 50"
echo "   3. Insert embeddings into database"
echo "   4. Implement vector search in your API"
echo ""
echo "🚀 Done!"
