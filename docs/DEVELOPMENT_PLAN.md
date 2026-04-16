# KulPik — MANDOR Development Plan
# Updated: 2026-04-16
# Status: Stack v2 API connected, scraper pivot needed

## HONEST ASSESSMENT

### What Works Now
- [x] EXA Search API — laptop specs, reviews, benchmarks (VERIFIED)
- [x] Cohere Embeddings — 1536 dimensions (VERIFIED)
- [x] Cohere Rerank — relevance scoring (VERIFIED)
- [x] Google Gemini — AI recommendation (READY)
- [x] Supabase — connected, schema exists
- [x] Sample data — 10 laptops with full specs
- [x] API endpoint — /api/recommend (Gemini integration)

### What's Broken
- [x] Tokopedia Playwright scraper — ERR_HTTP2_PROTOCOL_ERROR (blocked by Tokopedia)
- [x] Frontend — only placeholder page.tsx exists

### What's Missing
- [ ] Database seed data (need 50+ laptops minimum)
- [ ] Frontend pages (search, jurusan, compare, detail)
- [ ] Frontend components (laptop cards, filters, etc.)
- [ ] pgvector setup in Supabase
- [ ] CI/CD pipeline

---

## STRATEGY PIVOT

### Old Plan: Scrape Tokopedia → Parse → DB → Frontend
### New Plan: EXA-Enriched Manual Curation → DB → Frontend → Launch

Rationale:
- Tokopedia blocks Playwright (HTTP2 protocol error)
- Fighting anti-bot is expensive, slow, fragile
- EXA search can get specs/reviews from multiple sources
- Better to launch fast with 50 curated laptops than delay for scraping
- Scraping can be added later as Phase 2

---

## PHASE 1: MVP (Target: 1 week)

### 1.1 Database Seeding [P0 — DO FIRST]
```
[ ] Create laptop seed script using sample_laptops.json as template
[ ] Use EXA search to enrich each laptop with real specs
[ ] Insert 50 laptops into Supabase (10 per brand: ASUS, Lenovo, HP, Acer, Apple)
[ ] Seed 10 jurusan with minimum requirements
[ ] Setup pgvector extension in Supabase
[ ] Generate embeddings for all laptops via Cohere
[ ] Store embeddings in Supabase (vector column)
```

### 1.2 Frontend — Core Layout [P0]
```
[ ] Layout: Header with logo + nav (Search, Jurusan, Compare, AI)
[ ] Layout: Footer with links
[ ] Theme: Tailwind CSS 4 config (colors: blue/green student theme)
[ ] Mobile responsive (60%+ users will be on phone)
```

### 1.3 Frontend — Home Page [P0]
```
[ ] Hero section: "Cari Laptop Tepat untuk Kuliahmu"
[ ] Search bar (big, centered)
[ ] Jurusan quick picks (8 popular: TI, DKV, Kedokteran, etc.)
[ ] Featured laptops grid (6 cards)
[ ] How it works (3 steps)
```

### 1.4 Frontend — Search Page (/search) [P0]
```
[ ] SearchInput: text search with debounce
[ ] FilterPanel: budget range slider, brand checkboxes, RAM/Storage
[ ] LaptopGrid: responsive grid of LaptopCards
[ ] LaptopCard: image, name, price, key specs, "Cocok untuk" badges
[ ] SortOptions: harga (asc/desc), rating, relevansi
[ ] Loading states + empty states
```

### 1.5 Frontend — Jurusan Page (/jurusan) [P0]
```
[ ] JurusanGrid: cards for each jurusan with icon + description
[ ] JurusanDetail (/jurusan/[slug]): minimum specs + recommended laptops
[ ] MinimumSpecs component: RAM, Storage, GPU requirements
[ ] RecommendedLaptops: filtered + reranked list
```

### 1.6 Frontend — Laptop Detail (/laptop/[slug]) [P0]
```
[ ] Image gallery (from scraped data)
[ ] SpecTable: full specs in organized table
[ ] PriceCompare: price from Tokopedia vs Shopee vs Official
[ ] JurusanMatch: "Cocok untuk" badges with explanations
[ ] SimilarLaptops: "Laptop Serupa" section
[ ] AI explanation: "Kenapa cocok untuk jurusan X?"
```

### 1.7 Frontend — AI Chat (/ai) [P1]
```
[ ] ChatInput: text input for natural language query
[ ] ChatMessages: conversation display
[ ] AIRecommendation: formatted recommendation cards
[ ] Quick prompts: "Laptop untuk TI budget 10 juta", etc.
```

---

## PHASE 2: Data & Scraping (Target: Week 2-3)

### 2.1 Fix Scraping Approach
```
[ ] Research: Tokopedia mobile API (less protected)
[ ] Research: Alternative sources (Bukalapak, Bhinneka — easier to scrape)
[ ] Implement: EXA-based scraping (search for each laptop, extract from results)
[ ] Implement: Manual curation workflow (spreadsheet → JSON → DB)
[ ] Consider: Using Tokopedia affiliate API if available
```

### 2.2 Expand Data
```
[ ] 200+ laptops across all brands
[ ] 20+ jurusan
[ ] Price tracking (daily snapshots)
[ ] User reviews aggregation
```

### 2.3 pgvector Search
```
[ ] Embed all laptops with Cohere embed-v4.0
[ ] Create search RPC functions in Supabase
[ ] Implement hybrid search (vector + keyword)
[ ] Test search quality
```

---

## PHASE 3: Polish & Launch (Target: Week 3-4)

### 3.1 SEO & Performance
```
[ ] Meta tags, Open Graph, Schema.org
[ ] Sitemap.xml, robots.txt
[ ] Image optimization (next/image)
[ ] ISR for laptop pages (revalidate: 3600)
```

### 3.2 Deploy
```
[ ] Vercel deployment
[ ] Custom domain (kulpik.my.id atau kulpik.vercel.app)
[ ] Environment variables setup
[ ] Error monitoring (Vercel Analytics)
```

### 3.3 Launch
```
[ ] Share to Indonesian student groups (LINE, WhatsApp, Discord)
[ ] Reddit: r/indonesia, r/indotech
[ ] TikTok: "Cara pilih laptop kuliah" video
[ ] Collect feedback, iterate
```

---

## IMMEDIATE TASKS (Today)

1. Seed database dengan 50 laptops (pakai EXA + sample data)
2. Setup frontend layout (Header, Footer, theme)
3. Build Home page
4. Build Search page

---

## TECHNICAL DEBT TO ADDRESS

- nanogpt.ts still exists (should be deleted after confirming Gemini works)
- scraper/config.py has old selectors (need update if scraping resumes)
- No tests exist yet
- No CI/CD pipeline
- No error boundaries in frontend
