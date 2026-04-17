#!/bin/bash
# ============================================================
# KulPik Deployment Verification Script
# Run this before deploying to ensure everything is ready
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
BOLD='\033[1m'

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

pass() {
    echo -e "${GREEN}✅ $1${NC}"
    PASS_COUNT=$((PASS_COUNT + 1))
}

fail() {
    echo -e "${RED}❌ $1${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARN_COUNT=$((WARN_COUNT + 1))
}

echo -e "${BOLD}🚀 KulPik Deployment Verification${NC}"
echo "========================================="
echo ""

# 1. Check Python
echo -e "${BOLD}📋 Python Environment${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | awk '{print $2}')
    pass "Python 3 found: $PYTHON_VERSION"
else
    fail "Python 3 not found. Install Python 3.8+"
fi

# 2. Check Node.js
echo -e "${BOLD}📋 Node.js Environment${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    pass "Node.js found: $NODE_VERSION"
else
    warn "Node.js not found. Required for frontend."
fi

# 3. Check requirements.txt
echo -e "${BOLD}📋 Python Dependencies${NC}"
if [ -f "requirements.txt" ]; then
    pass "requirements.txt exists"
else
    fail "requirements.txt missing!"
fi

# 4. Check Python packages
echo "Checking Python dependencies..."
# Check if virtual environment exists
if [ -d "venv" ]; then
    pass "Virtual environment exists"
else
    warn "Virtual environment doesn't exist (will be created during deployment)"
fi

# Check if key packages are importable
if python3 -c "import flask; import supabase; import cohere; print('Key dependencies importable')" > /dev/null 2>&1; then
    pass "Python dependencies importable"
else
    warn "Some dependencies missing (install during deployment)"
fi

# 5. Check environment files
echo -e "${BOLD}📋 Environment Configuration${NC}"
if [ -f ".env.local" ] || [ -f ".env" ]; then
    pass "Environment file found"

    # Check for required variables (don't expose values)
    if grep -q "SUPABASE_URL=" .env.local 2>/dev/null || grep -q "SUPABASE_URL=" .env 2>/dev/null; then
        pass "SUPABASE_URL configured"
    else
        fail "SUPABASE_URL not set in environment"
    fi

    if grep -q "EXA_API_KEY=" .env.local 2>/dev/null || grep -q "EXA_API_KEY=" .env 2>/dev/null; then
        pass "EXA_API_KEY configured"
    else
        warn "EXA_API_KEY not set (optional for testing)"
    fi

    if grep -q "COHERE_API_KEY=" .env.local 2>/dev/null || grep -q "COHERE_API_KEY=" .env 2>/dev/null; then
        pass "COHERE_API_KEY configured"
    else
        warn "COHERE_API_KEY not set (optional for testing)"
    fi
else
    warn "No .env.local or .env file found"
    echo "   Copy .env.example to .env.local and fill in your values"
fi

# 6. Check for exposed secrets
echo -e "${BOLD}📋 Security Check${NC}"
if [ -f "kulpik-env.txt" ]; then
    fail "kulpik-env.txt found! Delete this file immediately!"
else
    pass "No exposed credential files"
fi

if [ -f ".env_clean" ]; then
    fail ".env_clean found! Delete this file immediately!"
else
    pass "No .env_clean file"
fi

# Check .gitignore
if grep -q ".env.local" .gitignore 2>/dev/null; then
    pass ".gitignore properly configured"
else
    fail ".gitignore missing .env.local pattern!"
fi

# 7. Check database migrations
echo -e "${BOLD}📋 Database Migrations${NC}"
if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=$(ls supabase/migrations/*.sql 2>/dev/null | wc -l)
    pass "Found $MIGRATION_COUNT migration files"
else
    warn "No migrations directory found"
fi

if [ -f "seed.sql" ]; then
    pass "Seed data file exists"
else
    warn "seed.sql not found"
fi

# 8. Check Docker setup
echo -e "${BOLD}📋 Docker Configuration${NC}"
if [ -f "Dockerfile.backend" ]; then
    pass "Dockerfile.backend exists"
else
    warn "Dockerfile.backend not found"
fi

if [ -f "Dockerfile.frontend" ]; then
    pass "Dockerfile.frontend exists"
else
    warn "Dockerfile.frontend not found"
fi

if [ -f "docker-compose.yml" ]; then
    pass "docker-compose.yml exists"
else
    warn "docker-compose.yml not found"
fi

# 9. Check CI/CD
echo -e "${BOLD}📋 CI/CD Configuration${NC}"
if [ -d ".github/workflows" ]; then
    WORKFLOW_COUNT=$(ls .github/workflows/*.yml 2>/dev/null | wc -l)
    pass "Found $WORKFLOW_COUNT GitHub Actions workflows"
else
    warn "No .github/workflows directory"
fi

# 10. Test auto-curation script (dry run)
echo -e "${BOLD}📋 Auto-Curation System${NC}"
if [ -f "auto_curation.py" ]; then
    pass "auto_curation.py exists"

    # Test import (without running)
    if python3 -c "import ast; ast.parse(open('auto_curation.py').read())" 2>/dev/null; then
        pass "auto_curation.py syntax valid"
    else
        fail "auto_curation.py has syntax errors!"
    fi
else
    fail "auto_curation.py not found!"
fi

if [ -f "curation_server.py" ]; then
    pass "curation_server.py exists"

    if python3 -c "import ast; ast.parse(open('curation_server.py').read())" 2>/dev/null; then
        pass "curation_server.py syntax valid"
    else
        fail "curation_server.py has syntax errors!"
    fi
else
    fail "curation_server.py not found!"
fi

# Summary
echo ""
echo "========================================="
echo -e "${BOLD}📊 Verification Summary${NC}"
echo "========================================="
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARN_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}${BOLD}🎉 Ready for deployment!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review warnings above"
    echo "  2. Set up GitHub Secrets:"
    echo "     - SUPABASE_URL"
    echo "     - SUPABASE_SERVICE_ROLE_KEY"
    echo "     - EXA_API_KEY"
    echo "     - COHERE_API_KEY"
    echo "     - GEMINI_API_KEY"
    echo "  3. Run database migrations"
    echo "  4. Deploy to Vercel/Railway"
    echo "  5. Configure custom domain"
    echo ""
    exit 0
else
    echo -e "${RED}${BOLD}❌ Deployment not ready! Fix failed checks above.${NC}"
    exit 1
fi
