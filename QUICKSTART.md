# 🚀 KulPik Quick Start Guide

Get KulPik running locally in 5 minutes!

---

## Prerequisites

- Python 3.8+
- Node.js 18+
- Git

---

## Option 1: Run Locally (Development)

### Step 1: Clone and Setup

```bash
git clone https://github.com/verrysimatupang99/kulpik.git
cd kulpik

# Install Python dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd web && npm install && cd ..
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your API keys:
# - Supabase credentials
# - EXA API key
# - Cohere API key
# - Gemini API key (optional)
```

### Step 3: Verify Setup

```bash
# Run deployment check
bash scripts/deploy-check.sh
```

### Step 4: Start Servers

```bash
# Terminal 1: Backend
python curation_server.py

# Terminal 2: Frontend
cd web && npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3001

---

## Option 2: Run with Docker (Production-like)

### Step 1: Setup Environment

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### Step 2: Start with Docker Compose

```bash
docker compose up -d
```

This starts:
- Backend API (port 5000)
- Frontend (port 3000)
- Auto-curation worker (background)

### Step 3: Verify

```bash
# Check backend health
curl http://localhost:5000/api/curation/health

# Check frontend
curl http://localhost:3000

# View logs
docker compose logs -f
```

---

## Database Setup

### Using Supabase (Recommended)

1. Create project at https://supabase.com
2. Go to SQL Editor
3. Run migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_jurusan_requirements.sql`
   - `supabase/migrations/003_pgvector.sql`

### Using Migration Script

```bash
# Set Supabase credentials in .env.local
bash scripts/run-migrations.sh
```

---

## Populate Initial Data

### Run Auto-Curation

```bash
# Add 30 laptops to database
python auto_curation.py --curate 30

# Update embeddings for vector search
python auto_curation.py --update-embeddings --limit 50
```

### Manual Entry (Alternative)

```bash
# Insert laptops from JSON file
python manual_curator.py --batch laptops.json

# Or just count existing laptops
python manual_curator.py --count
```

---

## API Endpoints

### Backend (Port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/curation/health` | Health check |
| GET | `/api/curation/status` | System status |
| GET | `/api/curation/laptops` | List laptops |
| POST | `/api/curation/search` | Search via EXA |
| POST | `/api/curation/bulk` | Bulk curate laptops |
| POST | `/api/curation/update_embeddings` | Update embeddings |
| DELETE | `/api/curation/delete/<slug>` | Delete laptop |

---

## Test Vector Search

```bash
curl -X POST http://localhost:5000/api/curation/search \
  -H "Content-Type: application/json" \
  -d '{"query": "laptop untuk coding", "limit": 5}'
```

---

## Common Commands

```bash
# Check environment
python scripts/validate_env.py

# Run deployment verification
bash scripts/deploy-check.sh

# Start auto-curation cron (runs once)
bash auto-curation-cron.sh

# Test auto-curation (5 laptops)
python auto_curation.py --curate 5

# Update all embeddings
python auto_curation.py --update-embeddings --limit 100
```

---

## Next Steps

- [ ] Read [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production deployment
- [ ] Set up GitHub Actions secrets
- [ ] Configure custom domain
- [ ] Schedule auto-curation cron job
- [ ] Monitor API usage and costs

---

## Need Help?

- **Docs**: `/docs/` directory
- **Issues**: https://github.com/verrysimatupang99/kulpik/issues
- **Vector Search**: `docs/VECTOR_SEARCH guide.md`
- **Database**: `docs/SUPABASE_SETUP.md`
