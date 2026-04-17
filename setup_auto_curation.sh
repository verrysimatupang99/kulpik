#!/bin/bash
# KulPik Auto-Curation Setup Script
# Install dependencies and setup auto-curation system

set -e

echo "🚀 KulPik Auto-Curation Setup"
echo "================================"

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

# Step 3: Install Python dependencies
echo "📋 Step 3: Installing Python dependencies..."
pip3 install -r requirements.txt flask flask-cors python-dotenv loguru supabase cohere

echo -e "${GREEN}✅ Python dependencies installed${NC}"

# Step 4: Check .env.local
echo "📋 Step 4: Checking .env.local..."
if [ -f .env.local ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
    
    # Check environment variables
    if grep -q "EXA_API_KEY=" .env.local; then
        echo -e "${GREEN}✅ EXA_API_KEY found${NC}"
    else
        echo -e "${YELLOW}⚠️  EXA_API_KEY missing${NC}"
    fi
    
    if grep -q "COHERE_API_KEY=" .env.local; then
        echo -e "${GREEN}✅ COHERE_API_KEY found${NC}"
    else
        echo -e "${YELLOW}⚠️  COHERE_API_KEY missing${NC}"
    fi
    
    if grep -q "SUPABASE_URL=" .env.local && grep -q "SUPABASE_SERVICE_ROLE_KEY=" .env.local; then
        echo -e "${GREEN}✅ Supabase credentials found${NC}"
    else
        echo -e "${RED}❌ Supabase credentials missing${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ .env.local not found${NC}"
    echo ""
    echo "Please create .env.local with:"
    echo "EXA_API_KEY=your-exa-api-key"
    echo "COHERE_API_KEY=your-cohere-api-key"
    echo "SUPABASE_URL=https://your-project.supabase.co"
    echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"
    exit 1
fi

# Step 5: Test auto-curation script
echo "📋 Step 5: Testing auto-curation script..."
python3 auto_curation.py --curate 5 || {
    echo -e "${YELLOW}⚠️  Auto-curation test failed. Check API keys${NC}"
}

# Step 6: Setup Flask server (optional)
echo "📋 Step 6: Setup Flask server..."
echo "To start curation dashboard server:"
echo "python3 curation_server.py"
echo ""
echo "Dashboard will be available at: http://localhost:5000"

# Step 7: Create requirements.txt
echo "📋 Step 7: Creating requirements.txt..."
cat > requirements.txt <<EOF
flask>=2.3.0
flask-cors>=4.0.0
python-dotenv>=1.0.0
loguru>=0.7.0
supabase>=2.0.0
cohere>=5.0.0
EOF

echo -e "${GREEN}✅ requirements.txt created${NC}"

# Step 8: Instructions
echo ""
echo "📝 Quick Start Instructions:"
echo ""
echo "1. Run auto-curation (add laptops):"
echo "   python3 auto_curation.py --curate 100"
echo ""
echo "2. Run embedding update:"
echo "   python3 auto_curation.py --update-embeddings --limit 100"
echo ""
echo "3. Start dashboard server:"
echo "   python3 curation_server.py"
echo ""
echo "4. Access dashboard UI:"
echo "   http://localhost:5000/api/curation/status"
echo ""
echo "📚 Next Steps:"
echo "   - Run script daily via cron job"
echo "   - Monitor laptop count via dashboard"
echo "   - Check embeddings via vector search"
echo ""
echo "✅ Setup complete! Ready to auto-curate 100+ laptops 🚀"