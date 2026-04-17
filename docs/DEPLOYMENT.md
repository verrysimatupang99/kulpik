# 🚀 KulPik — Deployment Guide

Complete guide for deploying KulPik to production with custom domain.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Security Setup](#security-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Custom Domain Configuration](#custom-domain-configuration)
7. [Auto-Curation Setup](#auto-curation-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Run the verification script before deploying:

```bash
bash scripts/deploy-check.sh
```

This will verify:
- ✅ Python 3.8+ installed
- ✅ Node.js 18+ installed
- ✅ requirements.txt exists
- ✅ Environment variables configured
- ✅ No exposed credentials
- ✅ Database migrations ready
- ✅ Docker configuration valid
- ✅ CI/CD workflows configured

---

## Security Setup

### 1. Rotate Exposed API Keys (CRITICAL)

If you previously had `kulpik-env.txt` or `.env_clean` committed:

1. **Supabase**: Go to https://app.supabase.com → Project Settings → API → Regenerate keys
2. **EXA API**: Go to https://exa.ai/ → Dashboard → Regenerate API key
3. **Cohere API**: Go to https://cohere.com/ → Dashboard → Create new API key
4. **Gemini API**: Go to https://makersuite.google.com/ → API Keys → Create new key

### 2. Set Up GitHub Secrets

Go to your repository: `Settings → Secrets and variables → Actions`

Add these secrets:

| Secret Name | Value | Required |
|-------------|-------|----------|
| `SUPABASE_URL` | Your Supabase project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | ✅ |
| `SUPABASE_ANON_KEY` | Anon/public key | ✅ |
| `EXA_API_KEY` | EXA search API key | ✅ |
| `COHERE_API_KEY` | Cohere embeddings key | ✅ |
| `GEMINI_API_KEY` | Google Gemini key | ✅ |

### 3. Create Production Environment File

```bash
cp .env.production.example .env.production
```

Edit `.env.production` with your actual values (never commit this file!).

---

## Database Setup

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to https://app.supabase.com
2. Select your project (or create new)
3. Open **SQL Editor**
4. Run migrations in order:

```sql
-- Run each file separately in SQL Editor:
-- 1. supabase/migrations/001_initial_schema.sql
-- 2. supabase/migrations/002_seed_jurusan_requirements.sql
-- 3. supabase/migrations/003_pgvector.sql
```

### Option 2: Using Migration Script

```bash
# Set up environment variables first
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

bash scripts/run-migrations.sh
```

### Verify Database

After migrations, verify tables exist:

```sql
-- In Supabase SQL Editor:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should show:
-- laptops
-- jurusan
-- jurusan_requirements
-- software_specs
-- laptop_jurusan_score
-- price_history
-- reviews
```

---

## Backend Deployment

### Option 1: Deploy to Railway (Recommended for Python)

Railway is ideal for Flask apps with background jobs.

#### Step 1: Connect to Railway

1. Go to https://railway.app
2. Click **New Project → Deploy from GitHub repo**
3. Select your `kulpik` repository

#### Step 2: Configure Environment Variables

In Railway dashboard, add all variables from `.env.production.example`:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key
EXA_API_KEY=your-key
COHERE_API_KEY=your-key
GEMINI_API_KEY=your-key
DEBUG=false
PORT=5000
CORS_ORIGINS=https://kulpik.com,https://www.kulpik.com
```

#### Step 3: Set Start Command

In Railway settings:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python curation_server.py`

#### Step 4: Deploy

Railway will automatically deploy and give you a URL like:
`https://kulpik-backend-production.up.railway.app`

---

### Option 2: Deploy to Vercel (Serverless)

Create `vercel.json` in root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "curation_server.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "curation_server.py"
    }
  ],
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_SERVICE_ROLE_KEY": "@service_role_key",
    "EXA_API_KEY": "@exa_api_key",
    "COHERE_API_KEY": "@cohere_api_key"
  }
}
```

Deploy:

```bash
npm i -g vercel
vercel --prod
```

---

### Option 3: Deploy with Docker

```bash
# Build backend image
docker build -f Dockerfile.backend -t kulpik-backend:latest .

# Run backend
docker run -d \
  -p 5000:5000 \
  --env-file .env.production \
  --name kulpik-backend \
  kulpik-backend:latest
```

---

## Frontend Deployment

### Deploy to Vercel (Recommended for Next.js)

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Deploy

```bash
cd web
vercel --prod
```

#### Step 3: Configure Environment Variables

In Vercel dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://kulpik.com
GEMINI_API_KEY=your-gemini-key
```

#### Step 4: Set Build Command

In `web/next.config.js` or `web/next.config.ts`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
}

module.exports = nextConfig
```

---

## Custom Domain Configuration

### Step 1: Purchase Domain

Buy your domain from any registrar (Namecheap, Cloudflare, etc.):

```
kulpik.com  (or your preferred domain)
```

### Step 2: Configure DNS Records

Add these records in your DNS provider:

#### For Vercel Frontend:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.21.21
```

#### For Railway Backend:

```
Type: CNAME
Name: api
Value: your-railway-app.up.railway.app
```

### Step 3: Add Domain to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add: `kulpik.com` and `www.kulpik.com`
3. Vercel will verify DNS configuration
4. Wait for SSL certificate (automatic via Let's Encrypt)

### Step 4: Add Domain to Railway

1. Go to Railway Dashboard → Your Service → Settings
2. Add custom domain: `api.kulpik.com`
3. Railway will provision SSL certificate

### Step 5: Update CORS Configuration

In backend `.env.production`:

```
CORS_ORIGINS=https://kulpik.com,https://www.kulpik.com
```

### Step 6: Update Frontend API URL

In frontend `.env.production`:

```
NEXT_PUBLIC_API_URL=https://api.kulpik.com
```

Redeploy both services after updating.

---

## Auto-Curation Setup

### Option 1: GitHub Actions (Already Configured)

The workflow `.github/workflows/auto-curation.yml` runs daily at 6AM WIB.

To trigger manually:
1. Go to **Actions** tab in GitHub
2. Select **KulPik Auto-Curation Cron Job**
3. Click **Run workflow**
4. Optionally set number of laptops to curate

### Option 2: Railway Cron Job

Add to Railway `Procfile`:

```
web: python curation_server.py
worker: python auto_curation.py --curate 30
```

Or use Railway's built-in cron feature to run scripts on schedule.

### Option 3: Docker Compose (Self-Hosted)

```bash
# Start all services including cron worker
docker compose up -d

# Check logs
docker compose logs -f curation-worker
```

### Option 4: Server Cron Job

If you have a VPS:

```bash
crontab -e

# Add this line (runs daily at 6AM WIB = UTC+7):
0 23 * * * cd /path/to/kulpik && bash auto-curation-cron.sh >> /var/log/kulpik-curation.log 2>&1
```

---

## Monitoring & Maintenance

### 1. Health Checks

Backend health endpoint:

```bash
curl https://api.kulpik.com/api/curation/health
```

Expected response:

```json
{
  "status": "initialized",
  "exa_available": true,
  "cohere_available": true,
  "laptop_count": 150,
  "embedding_count": 145,
  "timestamp": "2026-04-17T10:30:00",
  "server_port": 5000,
  "debug_mode": false
}
```

### 2. Monitor Database

Check laptop count in Supabase Dashboard → Table Editor

Or via SQL:

```sql
SELECT
  COUNT(*) as total_laptops,
  COUNT(embedding) as with_embeddings,
  COUNT(*) - COUNT(embedding) as without_embeddings
FROM laptops;
```

### 3. Set Up Error Monitoring

#### Sentry (Recommended):

```bash
pip install sentry-sdk[flask]
```

Add to `curation_server.py`:

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0,
)
```

### 4. Backup Database

Set up automatic backups in Supabase:
- Project Settings → Database → Backups
- Enable daily backups
- Set retention period (7-30 days)

### 5. Monitor API Usage

Track your API usage:
- **EXA**: Dashboard at https://exa.ai/
- **Cohere**: Dashboard at https://dashboard.cohere.com/
- **Gemini**: Console at https://makersuite.google.com/

Set up billing alerts to avoid surprise charges.

---

## Troubleshooting

### Backend won't start

```bash
# Check logs
docker logs kulpik-backend

# Or if running directly:
python curation_server.py
```

Common issues:
- Missing environment variables → Check `.env.production`
- Invalid API keys → Regenerate keys
- Port already in use → Change PORT variable

### Frontend build fails

```bash
cd web
npm run build
```

Common issues:
- Missing `NEXT_PUBLIC_*` variables → Add to Vercel dashboard
- TypeScript errors → Fix type errors
- Node version mismatch → Ensure Node 18+

### CORS errors in browser console

Fix by updating backend CORS configuration:

```python
# In curation_server.py
CORS(app, origins=os.getenv("CORS_ORIGINS", "").split(","))
```

### Database migrations fail

- Check if tables already exist
- Run migrations one at a time
- Check Supabase logs for detailed errors

### Auto-curation not running

- Check GitHub Actions logs
- Verify all API keys are valid
- Check rate limits on EXA and Cohere

---

## Production Checklist

Before going live:

- [ ] All API keys rotated (no exposed credentials)
- [ ] GitHub secrets configured
- [ ] Database migrations applied
- [ ] Backend deployed and healthy
- [ ] Frontend deployed and building successfully
- [ ] Custom domain configured with SSL
- [ ] CORS configured correctly
- [ ] Auto-curation scheduled and running
- [ ] Error monitoring set up (Sentry)
- [ ] Database backups enabled
- [ ] Environment variables verified
- [ ] Health checks passing
- [ ] Test end-to-end user flow

---

## Quick Commands Reference

```bash
# Verify deployment readiness
bash scripts/deploy-check.sh

# Run database migrations
bash scripts/run-migrations.sh

# Test auto-curation (5 laptops)
python3 auto_curation.py --curate 5

# Update embeddings
python3 auto_curation.py --update-embeddings --limit 50

# Start backend locally
DEBUG=true python3 curation_server.py

# Start frontend locally
cd web && npm run dev

# Deploy backend to Railway
railway up

# Deploy frontend to Vercel
cd web && vercel --prod

# Check backend health
curl https://api.kulpik.com/api/curation/health

# View Docker logs
docker compose logs -f backend
docker compose logs -f frontend
```

---

## Support

- **Documentation**: `/docs/` directory
- **Issues**: https://github.com/verrysimatupang99/kulpik/issues
- **Database**: Supabase Dashboard
- **Frontend Hosting**: Vercel Dashboard
- **Backend Hosting**: Railway Dashboard

---

**Last Updated**: April 17, 2026
