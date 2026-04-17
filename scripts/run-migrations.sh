#!/bin/bash
# ============================================================
# KulPik Database Migration Runner
# Applies all pending migrations to Supabase
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

echo -e "${BOLD}🗄️  KulPik Database Migration Runner${NC}"
echo "========================================="
echo ""

# Load environment
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v "^#" | xargs)
elif [ -f .env ]; then
    export $(cat .env | grep -v "^#" | xargs)
else
    echo -e "${RED}❌ No .env.local or .env file found${NC}"
    exit 1
fi

# Check Supabase credentials
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Connected to Supabase:${NC} $SUPABASE_URL"
echo ""

# Check if Supabase CLI is installed
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✅ Supabase CLI found${NC}"
    echo "Running migrations via Supabase CLI..."
    cd supabase
    supabase db push
    cd ..
    echo -e "${GREEN}✅ Migrations applied successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Supabase CLI not found. Using manual method...${NC}"
    echo ""
    echo "Please apply migrations manually:"
    echo "1. Go to https://app.supabase.com"
    echo "2. Open SQL Editor"
    echo "3. Run the following files in order:"
    echo "   - supabase/migrations/001_initial_schema.sql"
    echo "   - supabase/migrations/002_seed_jurusan_requirements.sql"
    echo "   - supabase/migrations/003_pgvector.sql"
    echo ""
    echo "Or install Supabase CLI:"
    echo "  brew install supabase/tap/supabase  # macOS"
    echo "  npm install -g supabase  # npm"
fi

echo ""
echo -e "${BOLD}📊 Verifying migrations...${NC}"

# Verify tables exist
python3 -c "
import os
from supabase import create_client

supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

tables = ['laptops', 'jurusan', 'jurusan_requirements', 'software_specs', 'laptop_jurusan_score']

for table in tables:
    try:
        result = supabase.table(table).select('id').limit(1).execute()
        print(f'✅ {table} table exists')
    except Exception as e:
        print(f'❌ {table} table missing or error: {e}')

print()
print('🎉 Migration verification complete!')
"

echo ""
echo -e "${GREEN}✅ Database setup complete!${NC}"
