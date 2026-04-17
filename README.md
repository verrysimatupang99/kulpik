# KulPik — Laptop Recommendation Platform 🎓💻

> **"Baru lulus SMA? Bingung pilih laptop kuliah? KulPik kasih tau laptop yang tepat buat jurusan lo."**

KulPik is a data-driven laptop recommendation platform for Indonesian students. Unlike TikTok (subjective opinions) or ChatGPT (outdated data), KulPik provides recommendations based on major requirements, curriculum, budget, and real-time prices from Indonesian marketplaces.

---

## Why KulPik?

| Platform | Problems |
|----------|----------|
| TikTok | Subjective opinions, potential brand sponsorship bias |
| ChatGPT/Gemini | Training data cutoff dates, unaware of local prices |
| Pricebook | Specification comparison, no university context |
| Bhinneka/Pemmz | Marketplace, not recommendation engine |
| **KulPik** | **Real-time data + major-aware + AI + local prices** |

---

## Features

### v1 (MVP)
- 🔍 **Search & Filter** — Search by price, brand, specs, weight
- 🎓 **Major Matcher** — Select major → minimum specs
- 💰 **Budget Calculator** — Enter budget → suitable laptops
- ⚖️ **Compare** — Side-by-side specs & prices (max 3)
- 🤖 **AI Recommendation** — Natural language queries via Gemini API

### v2 (Curriculum Tracking)
- 📚 **Semester Tracker** — Roadmap of requirements per semester
- 🔮 **Future-proof Score** — How long laptop will last
- 📊 **Trend Insights** — Data trends of requirements per major

### v3 (Data Product)
- 💬 **User Reviews** — Student reviews of their laptops
- 🔔 **Price Alert** — Notification for price drops
- 🏆 **Laptop of the Month** — Monthly top recommendations
- 📤 **Share Card** — Recommendation image for sharing to WA/IG

---

## Tech Stack

```
Frontend:    Next.js 16 + React 19 + Tailwind CSS 4
Backend:     Flask API (Python) + Auto-curation system
Database:    Supabase (PostgreSQL managed, free 500MB)
AI APIs:     Google Gemini + Cohere Embeddings + EXA Search
Scraping:    EXA API + Cohere extraction + Supabase sync
Hosting:     Vercel (frontend) + Railway (backend)
Auth:        Supabase Auth (optional v1)
```

---

## Quick Start

### Local Development

```bash
# Clone repository
git clone https://github.com/verrysimatupang99/kulpik.git
cd kulpik

# Install dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd web && npm install && cd ..

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run deployment verification
bash scripts/deploy-check.sh

# Start backend server
python curation_server.py

# Start frontend (in another terminal)
cd web && npm run dev
```

### Testing Auto-Curation

```bash
# Test with 5 laptops
python auto_curation.py --curate 5

# Update embeddings for vector search
python auto_curation.py --update-embeddings --limit 50

# Access dashboard
http://localhost:5000/api/curation/health
```

---

## Project Structure

```
kulpik/
├── web/                    # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # UI components
│   │   ├── lib/           # Utilities & API
│   │   └── hooks/         # React hooks
│   └── package.json
├── supabase/               # Database migrations
│   └── migrations/
│       ├── 001_initial_schema.sql
│       ├── 002_seed_jurusan_requirements.sql
│       └── 003_pgvector.sql
├── scripts/               # Deployment & utility scripts
│   ├── deploy-check.sh
│   ├── run-migrations.sh
│   └── validate_env.py
├── docs/                  # Documentation
│   ├── DEPLOYMENT.md
│   ├── SUPABASE_SETUP.md
│   └── VECTOR_SEARCH guide.md
├── .github/workflows/     # CI/CD workflows
├── curation-ui/           # Auto-curation dashboard
├── Dockerfile.backend    # Backend Docker config
├── Dockerfile.frontend   # Frontend Docker config
├── docker-compose.yml    # Docker compose config
├── Procfile              # Railway/Heroku config
├── requirements.txt      # Python dependencies
├── package.json          # Project metadata
├── auto_curation.py      # Auto-curation system
├── curation_server.py    # Flask API backend
├── manual_curator.py     # Manual data entry tool
└── README.md            # This file
```

---

## Target Audience

1. **Fresh High School Graduates** — ~2 million/year, confused about laptop selection
2. **College Students Upgrading** — Semester 3-5, laptop outdated/slow
3. **Parents** — Buying for children, don't understand specs
4. **Senior Students** — Recommendations for juniors

---

## Monetization Strategy

- **Affiliate Links** — Tokopedia/Shopee affiliate commissions (1-5%)
- **Premium Features** — Unlimited comparison, real-time price alerts
- **Sponsored Content** — Brand partnerships (ASUS, Lenovo, etc.)

---

## Golden Window

May-July = peak demand for new students. Target launch before May 2026.

---

## Deployment Guide

See **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** for complete production deployment instructions.

### Quick Deployment Steps:

1. **Database Setup**
   - Create Supabase project
   - Run database migrations
   - Verify tables exist

2. **Environment Variables**
   - Copy `.env.example` to `.env.production`
   - Add Supabase, EXA, Cohere, Gemini API keys
   - NEVER commit `.env.production`

3. **Backend Deployment**
   - Deploy Flask API to Railway/Vercel
   - Configure environment variables
   - Set up health checks

4. **Frontend Deployment**
   - Deploy Next.js to Vercel
   - Configure environment variables
   - Enable custom domain

5. **Cron Jobs**
   - Schedule auto-curation (daily)
   - Schedule embedding updates (weekly)
   - Monitor API usage

6. **Custom Domain**
   - Purchase domain (kulpik.com)
   - Configure DNS records
   - Enable SSL certificates

---

## Security First

### ❌ **DO NOT COMMIT:**

- `.env.local`
- `.env.production`
- `.env_clean`
- `kulpik-env.txt`
- Any file containing API keys

### ✅ **SAFE TO COMMIT:**

- `.env.example` (template)
- `.gitignore` (with proper patterns)
- `requirements.txt`
- All other source code

---

## CI/CD Pipeline

### GitHub Actions Workflows:

1. **CI Checks** - Runs on every push/PR
   - Python syntax check
   - Frontend build test
   - Docker build test
   - Security scan for exposed credentials

2. **Auto-Curation Cron** - Runs daily at 6AM WIB
   - Curate new laptops via EXA API
   - Update embeddings via Cohere API
   - Sync to Supabase database

---

## Monitoring & Maintenance

### Health Checks:
- Backend: `http://localhost:5000/api/curation/health`
- Database: Check Supabase dashboard → Table Editor
- Auto-Curation: Check GitHub Actions logs

### Required Services:
- **Supabase**: Database + Vector storage
- **EXA API**: Laptop search/data extraction
- **Cohere API**: Embeddings generation
- **Google Gemini**: AI recommendations

---

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for contribution guidelines.

---

## License

MIT License