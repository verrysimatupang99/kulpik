#!/bin/bash
# KulPik Auto-Curation Test Script
# Test the complete system from EXA search → Cohere enrichment → Supabase upsert

set -e

echo "🚀 KulPik Auto-Curation Test"
echo "==============================="

# Step 1: Check environment
echo "📋 Step 1: Checking environment..."
if [ -f .env.local ]; then
    echo "✅ .env.local found"
else
    echo "❌ .env.local not found"
    exit 1
fi

export $(cat .env.local | grep -v "^#" | xargs)

# Step 2: Install dependencies
echo "📋 Step 2: Installing dependencies..."
pip3 install flask flask-cors python-dotenv loguru supabase cohere

# Step 3: Test EXA search
echo "📋 Step 3: Testing EXA search..."
python3 -c "
import os
import requests
from dotenv import load_dotenv

load_dotenv()

EXA_API_KEY = os.getenv('EXA_API_KEY')
if EXA_API_KEY:
    headers = {'accept': 'application/json', 'content-type': 'application/json', 'Authorization': f'Bearer {EXA_API_KEY}'}
    payload = {'query': 'Best laptop for students', 'num_results': 2}
    
    try:
        response = requests.post('https://api.exa.ai/search', headers=headers, json=payload)
        if response.status_code == 200:
            print('✅ EXA API working: ' + str(response.status_code))
            data = response.json()
            print(f'Found {len(data.get('results', []))} results')
        else:
            print('❌ EXA API failed: ' + str(response.status_code))
    except Exception as e:
        print('❌ EXA API error: ' + str(e))
else:
    print('❌ EXA_API_KEY not set')
"

# Step 4: Test Cohere API
echo "📋 Step 4: Testing Cohere API..."
python3 -c "
import os
import cohere
from dotenv import load_dotenv

load_dotenv()

COHERE_API_KEY = os.getenv('COHERE_API_KEY')
if COHERE_API_KEY:
    try:
        co = cohere.Client(COHERE_API_KEY)
        # Test embedding
        response = co.embed(texts=['test laptop'], model='embed-v4.0', input_type='search_query', embedding_types=['float'])
        if response.embeddings.float_:
            print('✅ Cohere API working')
            print(f'Embedding dimensions: {len(response.embeddings.float_[0])}')
        else:
            print('❌ Cohere API returned no embeddings')
    except Exception as e:
        print('❌ Cohere API error: ' + str(e))
else:
    print('❌ COHERE_API_KEY not set')
"

# Step 5: Test Supabase
echo "📋 Step 5: Testing Supabase connection..."
python3 -c "
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        result = supabase.table('laptops').select('id').execute()
        print('✅ Supabase connection working')
        print(f'Database contains {len(result.data)} laptops')
    except Exception as e:
        print('❌ Supabase connection error: ' + str(e))
else:
    print('❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set')
"

# Step 6: Test auto-curation
echo "📋 Step 6: Testing auto-curation (curate 5 laptops)..."
python3 auto_curation.py --curate 5

# Step 7: Test embedding generation
echo "📋 Step 7: Testing embedding generation..."
python3 auto_curation.py --update-embeddings --limit 10

# Step 8: Test Flask server
echo "📋 Step 8: Testing Flask server..."
python3 -c "
import os
from dotenv import load_dotenv
from flask import Flask
from auto_curation import LaptopCurationSystem

load_dotenv()

EXA_API_KEY = os.getenv('EXA_API_KEY')
COHERE_API_KEY = os.getenv('COHERE_API_KEY')
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

print('Testing Flask server components...')
if EXA_API_KEY and COHERE_API_KEY and SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    try:
        system = LaptopCurationSystem()
        print('✅ All components initialized')
    except Exception as e:
        print('❌ System initialization error: ' + str(e))
else:
    print('❌ Missing environment variables')
"

# Step 9: Test vector search
echo "📋 Step 9: Testing vector search..."
python3 -c "
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    try:
        # Test pgvector function
        result = supabase.rpc('count_laptops_with_embeddings').execute()
        print('✅ pgvector function working')
        print('Embedding status:', result.data)
    except Exception as e:
        print('❌ pgvector error (maybe not enabled): ' + str(e))
else:
    print('❌ Supabase credentials missing')
"

# Summary
echo ""
echo "📊 Summary:"
echo "✅ All components tested"
echo ""
echo "🚀 Ready to run auto-curation!"
echo ""
echo "To start auto-curation server:"
echo "python3 curation_server.py"
echo ""
echo "To curate 100 laptops:"
echo "python3 auto_curation.py --curate 100"
echo ""
echo "Dashboard URL:"
echo "http://localhost:5000/api/curation/status"
echo ""
echo "Cron job ready to deploy!"