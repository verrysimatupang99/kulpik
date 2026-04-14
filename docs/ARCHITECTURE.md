# KulPik — Architecture

## Tech Stack

```
Frontend:    Next.js 16 (App Router) + React 19 + TypeScript
Styling:     Tailwind CSS 4
Charts:      lightweight-charts / Recharts
AI:          Google Gemini API (via @google/generative-ai)
Database:    Supabase (PostgreSQL managed)
Scraping:    Playwright (Python) + asyncio
Hosting:     Vercel (frontend + API) + Supabase (DB)
CI/CD:       GitHub Actions
```

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Vercel (Next.js 16)                                        │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ /search     │  │ /jurusan    │  │ /compare    │        │
│  │ Filter &    │  │ Jurusan     │  │ Side-by-    │        │
│  │ Browse      │  │ Matcher     │  │ side specs  │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                 │
│  ┌──────┴────────────────┴────────────────┴──────┐         │
│  │              API Routes (/api/*)               │         │
│  │  /laptops  /jurusan  /compare  /recommend     │         │
│  └──────────────────────┬────────────────────────┘         │
│                         │                                   │
│  ┌──────────────────────┴────────────────────────┐         │
│  │           Data Layer (lib/*)                   │         │
│  │  supabase.ts  laptops.ts  jurusan.ts          │         │
│  └──────────────────────┬────────────────────────┘         │
└─────────────────────────┼───────────────────────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
     ┌────────┴────────┐    ┌────────┴────────┐
     │   Supabase      │    │  Gemini API     │
     │   PostgreSQL    │    │  AI Recommend   │
     │   (500MB free)  │    │  (already have  │
     │                 │    │   key)          │
     └────────┬────────┘    └─────────────────┘
              │
     ┌────────┴────────┐
     │  Playwright     │
     │  Scraper        │
     │  (GitHub Actions│
     │   daily cron)   │
     └─────────────────┘
```

## Folder Structure

```
kulpik/
├── web/                          # Next.js app
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── page.tsx          # Home / Landing
│   │   │   ├── search/
│   │   │   │   └── page.tsx      # Search & Filter
│   │   │   ├── jurusan/
│   │   │   │   ├── page.tsx      # Jurusan list
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Jurusan detail + results
│   │   │   ├── laptop/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Laptop detail
│   │   │   ├── compare/
│   │   │   │   └── page.tsx      # Compare page
│   │   │   ├── ai/
│   │   │   │   └── page.tsx      # AI Chat recommendation
│   │   │   └── api/
│   │   │       ├── laptops/
│   │   │       │   └── route.ts  # GET laptops
│   │   │       ├── jurusan/
│   │   │       │   └── route.ts  # GET jurusan
│   │   │       ├── compare/
│   │   │       │   └── route.ts  # GET compare
│   │   │       └── recommend/
│   │   │           └── route.ts  # POST AI recommend
│   │   ├── components/
│   │   │   ├── ui/               # Basic UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Slider.tsx
│   │   │   │   └── Badge.tsx
│   │   │   ├── laptop/
│   │   │   │   ├── LaptopCard.tsx
│   │   │   │   ├── SpecTable.tsx
│   │   │   │   ├── PriceCompare.tsx
│   │   │   │   └── JurusanMatch.tsx
│   │   │   ├── jurusan/
│   │   │   │   ├── JurusanCard.tsx
│   │   │   │   └── MinimumSpecs.tsx
│   │   │   ├── filter/
│   │   │   │   ├── FilterPanel.tsx
│   │   │   │   ├── BudgetSlider.tsx
│   │   │   │   └── BrandFilter.tsx
│   │   │   ├── compare/
│   │   │   │   ├── CompareTable.tsx
│   │   │   │   └── CompareBar.tsx
│   │   │   ├── ai/
│   │   │   │   ├── AIChatBox.tsx
│   │   │   │   └── AIRecommendation.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       ├── Footer.tsx
│   │   │       └── Navigation.tsx
│   │   ├── lib/
│   │   │   ├── supabase.ts       # Supabase client
│   │   │   ├── laptops.ts        # Laptop queries
│   │   │   ├── jurusan.ts        # Jurusan queries
│   │   │   ├── recommend.ts      # Recommendation logic
│   │   │   ├── gemini.ts         # Gemini API client
│   │   │   ├── format.ts         # Format harga, specs
│   │   │   └── constants.ts      # Brands, categories
│   │   └── hooks/
│   │       ├── useLaptops.ts
│   │       ├── useJurusan.ts
│   │       ├── useCompare.ts
│   │       └── useDebounce.ts
│   ├── public/
│   │   ├── images/
│   │   └── icons/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── .env.local
├── scraper/                      # Python scraper
│   ├── __init__.py
│   ├── tokopedia.py              # Main scraper
│   ├── parser.py                 # Extract specs
│   ├── cleaners.py               # Data cleaning
│   ├── db_sync.py                # Supabase sync
│   ├── config.py                 # URLs, selectors
│   ├── run.py                    # Entry point
│   └── requirements.txt
├── docs/                         # Documentation
│   ├── BRAINSTORM.md
│   ├── TASK_BREAKDOWN.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── DATA_STRATEGY.md
│   └── USER_FLOWS.md
├── .github/
│   └── workflows/
│       ├── ci.yml                # Lint + build check
│       └── scrape.yml            # Daily scraper cron
├── .gitignore
├── .env.example
└── README.md
```

## Data Flow

```
User Request (Browser)
    │
    ▼
Next.js Page (SSR / Client)
    │
    ├─ Static data (cached) ──→ Vercel CDN
    │
    └─ Dynamic data ──→ API Route (/api/*)
                            │
                            ├─ Supabase (laptops, jurusan)
                            │
                            └─ Gemini API (AI recommendation)
                                    │
                                    ▼
                            Response (JSON)
                                    │
                                    ▼
                            React renders UI

Scraping Flow (daily cron):
    │
    ▼
GitHub Actions (06:00 WIB)
    │
    ▼
Playwright → Tokopedia
    │
    ▼
Parse & Clean → JSON
    │
    ▼
Supabase Upsert
    │
    ▼
User sees fresh data
```

## Key Design Decisions

1. **Next.js App Router** — Modern, SSR support, file-based routing
2. **Supabase** — Free tier, PostgreSQL, built-in auth, real-time
3. **Playwright** — Handle JS-rendered Tokopedia SPA
4. **Gemini API** — Already have key, fast, good for Indonesian
5. **Vercel** — Free, native Next.js support, auto-deploy
6. **GitHub Actions** — Free cron for scraping (2000 min/month)
