# KulPik Development Plan — Segmented for Goose CLI
> Last updated: 2026-04-18

## Overview
Rencana pengembangan KulPik dibagi per segmen agar bisa didelegasikan ke Goose CLI satu-per-satu.
Setiap segmen berisi task yang bisa dijalankan secara independen.

---

## SEGMENT 1: DATABASE (Supabase/PostgreSQL)
Fokus: Schema, migrasi, query optimization, seed data

### 1.1 Schema Enhancement
- [ ] Tambah kolom `user_rating_avg` ke tabel laptops (untuk review v3)
- [ ] Tambah kolom `price_last_updated` untuk tracking freshness harga
- [ ] Tambah kolom `is_active` untuk soft-delete laptop yang sudah discontinued
- [ ] Buat index untuk kolom yang sering di-query: `brand`, `price_tokopedia`, `gpu_type`

### 1.2 Seed Data Expansion
- [ ] Expand data jurusan dari 12 → 25+ jurusan (tambah Teknik Industri, Farmasi, Kedokteran Gigi, dll)
- [ ] Tambah requirements per semester (untuk feature v2 Semester Tracker)
- [ ] Seed data minimum specs per jurusan (untuk Major Matcher yang lebih akurat)

### 1.3 Vector Search Improvement
- [ ] Update embeddings untuk semua laptop yang belum punya embedding
- [ ] Tambahkan metadata ke embedding (jurusan tags, use-case tags)
- [ ] Test dan validasi similarity threshold (saat ini 0.6)

### 1.4 Migrasi Baru
- [ ] Buat migration `004_reviews_table.sql` untuk user reviews (v3 prep)
- [ ] Buat migration `005_price_history.sql` untuk tracking harga dari waktu ke waktu
- [ ] Buat migration `006_favorites.sql` untuk user favorites/bookmarks

---

## SEGMENT 2: BACKEND (Flask API + Auto-curation)
Fokus: API endpoints, data pipeline, business logic

### 2.1 API Enhancement
- [ ] Tambah endpoint `GET /api/laptops/{id}` untuk detail laptop lengkap
- [ ] Tambah endpoint `GET /api/jurusan/{slug}` untuk data jurusan + rekomendasi
- [ ] Tambah endpoint `POST /api/compare` untuk compare max 3 laptop
- [ ] Tambah endpoint `GET /api/search/suggestions` untuk autocomplete
- [ ] Tambah endpoint `GET /api/stats` untuk dashboard statistik (total laptop, brand, harga range)

### 2.2 Auto-Curation Improvement
- [ ] Improve extraction logic di `auto_curation.py` — lebih banyak field yang di-parse
- [ ] Tambah deduplication logic (laptop sama dari sumber berbeda)
- [ ] Tambah price normalization (handle harga yang format-nya tidak standar)
- [ ] Tambah logging & error reporting yang lebih detail
- [ ] Tambah retry logic untuk API calls yang gagal

### 2.3 Search & Filter Enhancement
- [ ] Implementasi full-text search dengan PostgreSQL tsvector
- [ ] Tambah filter: storage type (SSD/HDD), screen size range, weight range
- [ ] Tambah sorting: by popularity, by value score (spec/price ratio)
- [ ] Implementasi pagination yang proper (cursor-based)

### 2.4 Recommendation Engine
- [ ] Improve Gemini prompt untuk rekomendasi yang lebih kontekstual
- [ ] Tambah scoring system: value score, performance score, portability score
- [ ] Implementasi "Future-proof Score" (berdasarkan spec vs trend jurusan)
- [ ] Tambah fallback ke NanoGPT jika Gemini quota habis

---

## SEGMENT 3: FRONTEND (Next.js + React)
Fokus: UI/UX, pages, components, interactivity

### 3.1 Home Page Enhancement
- [ ] Tambah section "Laptop Populer" dengan data real dari database
- [ ] Tambah section "Budget Picks" (laptop terbaik per range harga)
- [ ] Tambah testimonial/social proof section
- [ ] Implementasi search bar yang fungsional (langsung redirect ke /search)

### 3.2 Search Page Enhancement
- [ ] Tambah filter: storage type, screen size, weight
- [ ] Tambah sort: by value score, by popularity
- [ ] Implementasi infinite scroll atau pagination
- [ ] Tambah "Saved searches" atau recent searches
- [ ] Tambah URL state untuk shareable search results

### 3.3 Laptop Detail Page
- [ ] Complete `/laptop/[id]` page dengan full specs
- [ ] Tambah price comparison dari berbagai marketplace
- [ ] Tambah "Similar Laptops" section
- [ ] Tambah "Suitable for Jurusan" section
- [ ] Tambah share button (generate share card untuk WA/IG)

### 3.4 Compare Page Enhancement
- [ ] Improve compare layout (spec highlights, differences highlighted)
- [ ] Tambah "Winner" indicator per kategori spec
- [ ] Tambah AI summary untuk comparison
- [ ] Support compare sampai 4 laptop (saat ini max 3)

### 3.5 Jurusan Page Enhancement
- [ ] Complete `/jurusan/[slug]` dengan data real dari database
- [ ] Tambah semester-by-semester requirements roadmap
- [ ] Tambah "Top Picks for This Major" section
- [ ] Tambah related jurusan

### 3.6 AI Chat Page
- [ ] Complete `/ai` page dengan chat interface
- [ ] Implementasi streaming response dari Gemini
- [ ] Tambah suggested questions
- [ ] Tambah chat history (local storage)
- [ ] Tambah share conversation

### 3.7 New Pages
- [ ] Buat `/about` page
- [ ] Buat `/faq` page
- [ ] Buat `/contact` page
- [ ] Buat `/blog` atau `/tips` page (SEO content)

---

## SEGMENT 4: COMPONENTS & UI
Fokus: Reusable components, design system

### 4.1 New Components
- [ ] `PriceTag` — display harga dengan diskon/persentase
- [ ] `SpecBadge` — badge untuk spec highlights (RAM, GPU, dll)
- [ ] `RatingStars` — star rating component (untuk v3 reviews)
- [ ] `ShareCard` — generate image untuk share ke social media
- [ ] `LoadingSkeleton` — better loading states
- [ ] `ErrorBoundary` — error handling yang graceful
- [ ] `SearchBar` — reusable search dengan suggestions
- [ ] `FilterChip` — removable filter chip component

### 4.2 Layout Improvement
- [ ] Improve Header dengan mobile navigation
- [ ] Improve Footer dengan links dan social media
- [ ] Tambah Breadcrumb navigation
- [ ] Tambah Back-to-top button
- [ ] Implementasi dark mode (optional)

### 4.3 Responsive & Accessibility
- [ ] Audit dan fix mobile responsiveness
- [ ] Tambah proper ARIA labels
- [ ] Tambah keyboard navigation support
- [ ] Test dengan screen reader

---

## SEGMENT 5: AI & ML
Fokus: Embeddings, recommendation, search quality

### 5.1 Embedding Pipeline
- [ ] Migrate dari Cohere ke cheaper alternative jika quota habis
- [ ] Batch update embeddings untuk laptop baru
- [ ] Implementasi embedding versioning (untuk A/B test quality)

### 5.2 Recommendation Quality
- [ ] A/B test different Gemini prompts
- [ ] Implementasi context window optimization (kirim hanya laptop relevan)
- [ ] Tambah user preference learning (future)
- [ ] Implementasi feedback loop (rekomendasi bagus/tidak)

### 5.3 Search Quality
- [ ] Implementasi hybrid search (vector + keyword)
- [ ] Tambah reranking untuk hasil yang lebih relevan
- [ ] Implementasi typo tolerance
- [ ] Tambah semantic search untuk query natural language

---

## SEGMENT 6: DEVOPS & INFRASTRUCTURE
Fokus: Deployment, CI/CD, monitoring

### 6.1 Docker & Deployment
- [ ] Fix dan test Docker setup (backend + frontend)
- [ ] Tambah health check endpoint yang proper
- [ ] Implementasi environment-specific configs
- [ ] Test deployment ke Railway (backend) dan Vercel (frontend)

### 6.2 CI/CD Enhancement
- [ ] Improve GitHub Actions workflow
- [ ] Tambah automated testing (unit + integration)
- [ ] Tambah preview deployments untuk PR
- [ ] Tambah automated dependency updates

### 6.3 Monitoring & Observability
- [ ] Tambah error tracking (Sentry atau similar)
- [ ] Tambah performance monitoring
- [ ] Tambah API usage tracking (untuk cost management)
- [ ] Implementasi rate limiting

### 6.4 Security
- [ ] Audit environment variables handling
- [ ] Tambah input validation dan sanitization
- [ ] Implementasi CORS yang proper
- [ ] Tambah API key rotation mechanism

---

## SEGMENT 7: DOCUMENTATION & TESTING
Fokus: Code quality, docs, tests

### 7.1 Testing
- [ ] Unit tests untuk backend API endpoints
- [ ] Unit tests untuk utility functions
- [ ] Integration tests untuk database queries
- [ ] E2E tests untuk critical user flows

### 7.2 Documentation
- [ ] Update README dengan setup yang lebih detail
- [ ] Buat API documentation (OpenAPI/Swagger)
- [ ] Buat component documentation (Storybook atau similar)
- [ ] Documentasi untuk auto-curation system

---

## SEGMENT 8: PRE-LAUNCH & GROWTH
Fokus: SEO, analytics, monetization prep

### 8.1 SEO
- [ ] Implementasi proper meta tags untuk semua pages
- [ ] Tambah structured data (JSON-LD) untuk laptop pages
- [ ] Buat sitemap.xml
- [ ] Implementasi Open Graph tags untuk social sharing
- [ ] Optimize page speed (Core Web Vitals)

### 8.2 Analytics
- [ ] Implementasi Google Analytics atau Plausible
- [ ] Track user behavior (search queries, popular jurusan, dll)
- [ ] Implementasi conversion tracking (affiliate clicks)

### 8.3 Monetization Prep
- [ ] Implementasi affiliate link tracking
- [ ] Tambah "Beli di Tokopedia/Shopee" buttons dengan affiliate codes
- [ ] Research premium features yang mungkin

---

## PRIORITAS URUTAN

### Phase 1: Core Features (Week 1-2)
1. Backend: API endpoints untuk laptop detail, jurusan, compare
2. Frontend: Complete laptop detail page, improve search
3. Database: Expand seed data, add indexes

### Phase 2: Enhanced Experience (Week 3-4)
1. Frontend: AI chat page, jurusan page completion
2. Backend: Search improvement, recommendation engine
3. Components: New reusable components

### Phase 3: Quality & Polish (Week 5-6)
1. Testing & Documentation
2. DevOps: Deployment & monitoring
3. SEO & Analytics

### Phase 4: Growth Features (Week 7-8)
1. Reviews & ratings
2. Price history & alerts
3. Share cards & social features

---

## NOTES UNTUK GOOSE CLI

### Cara Delegasi per Segmen:
```
goose run --task "Kerjakan Segment 1: Database — bagian 1.1 Schema Enhancement"
goose run --task "Kerjakan Segment 3: Frontend — bagian 3.3 Laptop Detail Page"
```

### Tips:
1. Satu segmen per session Goose untuk hasil terbaik
2. Berikan context: file paths, existing code patterns, tech stack
3. Minta Goose untuk test setiap perubahan
4. Review code output sebelum commit

### Context untuk Goose:
- Project: KulPik — Laptop Recommendation Platform
- Root: ~/Documents/Coding/kulpik/
- Frontend: web/ (Next.js 16 + React 19 + Tailwind CSS 4)
- Backend: curation_server.py (Flask), auto_curation.py
- Database: Supabase (PostgreSQL + pgvector)
- AI: Gemini API + Cohere Embeddings + EXA Search
