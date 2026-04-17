#!/bin/bash
# Quick start script for KulPik Vector Search setup
# This script will:
# 1. Check dependencies
# 2. Guide pgvector setup
# 3. Generate embeddings
# 4. Sync to database

set -e

echo "🚀 KulPik — Vector Search Quick Start"
echo "======================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Python
echo "📋 Step 1: Checking Python..."
if command -v python3 &> /dev/null; then
    echo -e "${GREEN}✅ Python 3 found:$(python3 --version)${NC}"
else
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.8+${NC}"
    exit 1
fi

# Step 2: Check pip
echo "📋 Step 2: Checking pip..."
if command -v pip3 &> /dev/null; then
    echo -e "${GREEN}✅ pip3 found${NC}"
else
    echo -e "${RED}❌ pip3 not found. Please install pip${NC}"
    exit 1
fi

# Step 3: Check .env.local
echo "📋 Step 3: Checking .env.local..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
    
    # Check Supabase credentials
    if grep -q "SUPABASE_URL=" .env.local && grep -q "SUPABASE_SERVICE_ROLE_KEY=" .env.local; then
        echo -e "${GREEN}✅ Supabase credentials found${NC}"
    else
        echo -e "${YELLOW}⚠️  Supabase credentials missing in .env.local${NC}"
        echo "Please add:"
        echo "SUPABASE_URL=https://your-project.supabase.co"
        echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
        echo "COHERE_API_KEY=your-cohere-key"
        exit 1
    fi
else
    echo -e "${RED}❌ .env.local not found. Copy from .env.example first${NC}"
    echo ""
    echo "See docs/VECTOR_SEARCH guide.md for setup instructions"
    exit 1
fi

# Step 4: Check embeddings.json
echo "📋 Step 4: Checking embeddings.json..."
if [ -f embeddings.json ]; then
    echo -e "${GREEN}✅ embeddings.json exists${NC}"
else
    echo -e "${YELLOW}⚠️  embeddings.json not found. We'll generate it now${NC}"
fi

# Step 5: Install Python dependencies
echo "📋 Step 5: Installing Python dependencies..."
pip3 install -r scraper/requirements.txt python-dotenv

# Step 6: Generate embeddings
echo "📋 Step 6: Generating embeddings (this may take 2-5 minutes)..."
python3 scraper/generate_embeddings.py

# Step 7: Sync embeddings to database
echo "📋 Step 7: Syncing embeddings to Supabase..."
python3 scraper/sync_embeddings.py --file embeddings.json

# Step 8: Verify embeddings were synced
echo "📋 Step 8: Verifying embeddings..."
python3 -c "
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))
result = supabase.rpc('count_laptops_with_embeddings').execute()
print('✅ Embedding status:', result.data)
"

# Success!
echo ""
echo -e "${GREEN}✅ Vector Search setup complete!${NC}"
echo ""
echo "📝 Next steps:"
echo "   1. Enable pgvector in Supabase:"
echo "      - Go to https://app.supabase.com"
echo "      - SQL Editor → Run supabase/migrations/003_pgvector.sql"
echo ""
echo "   2. Test vector search:"
echo "      curl -X POST http://localhost:3001/api/recommend \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -d '{\"query\":\"laptop untuk coding\",\"budget_max\":15000000}'"
echo ""
echo "   3. Check search method in response:"
echo "      \"searchMethod\": \"vector\" ← should be 'vector' not 'keyword'"
echo ""
echo "📚 Documentation: docs/VECTOR_SEARCH guide.md"
echo ""
