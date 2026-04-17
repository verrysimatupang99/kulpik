#!/bin/bash
# KulPik Auto-Curation Cron Job
# Run this script daily to maintain fresh laptop data

set -e

echo "🚀 KulPik Auto-Curation Cron Job"
echo "=================================="

# Load environment
export $(cat .env.local | grep -v "^#" | xargs)

# Check for required environment variables
if [ -z "$EXA_API_KEY" ]; then
    echo "❌ EXA_API_KEY not set in .env.local"
    exit 1
fi

if [ -z "$COHERE_API_KEY" ]; then
    echo "❌ COHERE_API_KEY not set in .env.local"
    exit 1
fi

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Supabase credentials not set in .env.local"
    exit 1
fi

echo "✅ Environment loaded successfully"

# Step 1: Check database count
echo "📊 Step 1: Checking current laptop count..."
python3 -c "
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

result = supabase.table('laptops').select('id').execute()
print(f'📊 Current laptops: {len(result.data)}')
"

# Step 2: Curate new laptops
echo "🚀 Step 2: Curating new laptops..."
python3 auto_curation.py --curate 30

# Step 3: Update embeddings for new laptops
echo "📝 Step 3: Updating embeddings..."
python3 auto_curation.py --update-embeddings --limit 50

# Step 4: Final database count
echo "📊 Step 4: Final database count..."
python3 -c "
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()
supabase = create_client(os.getenv('SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_ROLE_KEY'))

result = supabase.table('laptops').select('id').execute()
print(f'📊 Total laptops: {len(result.data)}')

result_with_embeddings = supabase.table('laptops').select('id, embedding').execute()
embeddings_count = len([laptop for laptop in result_with_embeddings.data or [] if laptop.get('embedding') is not None])
print(f'📊 Laptops with embeddings: {embeddings_count}')
"

echo ""
echo "✅ Auto-curation cron job complete!"
echo "📝 Summary:"
echo "   - New laptops curated"
echo "   - Embeddings updated"
echo "   - Database refreshed"
echo ""
echo "📅 Next run: Tomorrow at same time"
echo ""
echo "📋 To add to cron (daily at 6AM):"
echo "0 6 * * * /path/to/kulpik/auto-curation-cron.sh"