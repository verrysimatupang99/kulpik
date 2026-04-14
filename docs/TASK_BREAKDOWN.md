# KulPik — Task Breakdown

> Roadmap pembangunan KulPik dari MVP sampai v3.
> Prioritas: P0 (harus ada), P1 (penting), P2 (nice to have)

---

## Phase 1: MVP (Target: 2-3 minggu)

### 1.1 Project Setup [P0]
```
[ ] Buat Next.js project (App Router, TypeScript, Tailwind CSS 4)
[ ] Setup folder structure (lihat ARCHITECTURE.md)
[ ] Setup Supabase project (buat akun, create project)
[ ] Setup environment variables (.env.local)
[ ] Setup GitHub Actions CI (lint + build check)
[ ] Setup ESLint + Prettier config
```

### 1.2 Database Schema [P0]
```
[ ] Create table: laptops (lihat DATABASE_SCHEMA.md)
[ ] Create table: jurusan
[ ] Create table: jurusan_requirements
[ ] Create table: software_specs
[ ] Create table: laptop_jurusan_score
[ ] Insert seed data: 10 jurusan populer
[ ] Insert seed data: 50 laptop (manual dulu)
[ ] Test queries & indexes
```

### 1.3 Scraping Setup [P0]
```
[ ] Setup Python environment (pip install playwright)
[ ] Install Playwright browsers (playwright install chromium)
[ ] Buat scraper/tokopedia.py (scrape search results)
[ ] Buat scraper/parser.py (extract specs dari text)
[ ] Buat scraper/cleaners.py (normalize harga, specs)
[ ] Buat scraper/db_sync.py (push to Supabase)
[ ] Test scrape 10 laptop, verify data quality
[ ] Setup GitHub Actions cron (daily scraping)
```

### 1.4 Frontend — Core Pages [P0]
```
[ ] Layout: Header, Footer, Navigation
[ ] Page: Home / Landing
[ ] Page: Search & Filter (/search)
[ ] Component: LaptopCard (card dengan gambar, harga, specs)
[ ] Component: FilterPanel (budget, brand, specs filter)
[ ] Component: SortOptions (harga, rating, relevansi)
[ ] Page: Laptop Detail (/laptop/[slug])
[ ] Component: SpecTable (specs dalam tabel)
[ ] Component: PriceCompare (harga dari beberapa toko)
[ ] Component: JurusanMatch (cocok buat jurusan apa)
```

### 1.5 Frontend — Jurusan Matcher [P0]
```
[ ] Page: Jurusan Selector (/jurusan)
[ ] Component: JurusanCard (jurusan dengan icon)
[ ] Logic: jurusan → minimum specs mapping
[ ] Page: Jurusan Results (/jurusan/[slug])
[ ] Component: RecommendedLaptops (filtered by jurusan)
[ ] Component: MinimumSpecs (specs minimum ditampilkan)
```

### 1.6 Frontend — Budget Calculator [P1]
```
[ ] Component: BudgetSlider (range input)
[ ] Logic: filter laptop by budget range
[ ] Page: Budget Results (integrated di /search)
[ ] Component: ValueScore (best value per budget)
```

### 1.7 Frontend — Compare [P1]
```
[ ] Page: Compare (/compare)
[ ] Component: CompareTable (side-by-side specs)
[ ] Component: CompareBar (selected laptops, max 3)
[ ] Logic: add/remove from compare
[ ] Component: ProConPerJurusan (per jurusan analysis)
```

### 1.8 AI Recommendation [P0]
```
[ ] Setup Gemini API integration
[ ] API Route: /api/recommend (POST)
[ ] Logic: parse user intent (jurusan, budget, prioritas)
[ ] Logic: filter DB by parsed requirements
[ ] Logic: AI ranks & generates explanation
[ ] Component: AIChatBox (simple chat UI)
[ ] Component: AIRecommendation (hasil rekomendasi)
[ ] Component: AIExplanation (alasan dalam bahasa ID)
```

### 1.9 Data Layer [P0]
```
[ ] lib/supabase.ts (Supabase client setup)
[ ] lib/laptops.ts (CRUD + query laptops)
[ ] lib/jurusan.ts (CRUD + query jurusan)
[ ] lib/recommend.ts (recommendation engine)
[ ] API Route: /api/laptops (GET, filter & paginate)
[ ] API Route: /api/jurusan (GET, list jurusan)
[ ] API Route: /api/compare (GET, compare 2-3 laptops)
```

### 1.10 Deploy & Launch [P0]
```
[ ] Deploy ke Vercel
[ ] Setup custom domain (kulpik.vercel.app atau .my.id)
[ ] Test production build
[ ] Setup error monitoring (Sentry / Vercel Analytics)
[ ] Landing page dengan email capture
[ ] Share ke sosmed & grup kampus
```

---

## Phase 2: Kurikulum Tracking (Target: 1-2 bulan)

### 2.1 Kurikulum Data [P1]
```
[ ] Research kurikulum 10 universitas top Indonesia
[ ] Create table: kurikulum (per universitas per jurusan)
[ ] Create table: mata_kuliah (nama, semester, software)
[ ] Insert data: 5 universitas × 10 jurusan = 50 kurikulum
[ ] Scrape kurikulum dari website kampus (atau manual)
```

### 2.2 Software → Hardware Mapping [P1]
```
[ ] Create table: software_requirements
[ ] Map: Android Studio → RAM 16GB, SSD 256GB
[ ] Map: AutoCAD → RAM 16GB, GPU dedicated
[ ] Map: Adobe Premiere → RAM 16GB, GPU, storage besar
[ ] Test: jurusan → software → hardware chain
```

### 2.3 Semester Tracker [P1]
```
[ ] Page: Semester Roadmap (/roadmap/[jurusan])
[ ] Component: SemesterTimeline (visual timeline)
[ ] Component: SoftwarePerSemester (apa yang dipakai)
[ ] Component: SpecsProjection (kebutuhan naik tiap semester)
[ ] Logic: calculate future requirements
```

### 2.4 Future-proof Score [P1]
```
[ ] Algorithm: score laptop vs projected requirements
[ ] Component: FutureProofBadge (🟢🟡🔴)
[ ] Component: SurvivabilityTimeline (berapa semester cukup)
[ ] Logic: factor in upgradability (RAM, storage)
```

### 2.5 Expanded Jurusan [P1]
```
[ ] Tambah 20 jurusan lagi (total 30)
[ ] Tambah 5 universitas (total 10)
[ ] Tambah data kurikulum per universitas
[ ] Tambah software mapping per jurusan
```

---

## Phase 3: Data Product (Target: 2-3 bulan)

### 3.1 User Reviews [P2]
```
[ ] Create table: reviews (user_id, laptop_id, jurusan, rating, text)
[ ] API: POST /api/reviews
[ ] API: GET /api/reviews?laptop_id=X
[ ] Component: ReviewCard
[ ] Component: ReviewForm
[ ] Moderation: basic profanity filter
```

### 3.2 Price Tracking [P2]
```
[ ] Create table: price_history (laptop_id, source, price, date)
[ ] Scraper update: save price history
[ ] API: GET /api/price-history?laptop_id=X
[ ] Component: PriceChart (line chart harga over time)
[ ] Component: PriceAlert (set target harga)
[ ] Cron: check price alerts daily
```

### 3.3 Share Card [P2]
```
[ ] Library: html-to-image (generate shareable image)
[ ] Component: ShareCard (laptop info + KulPik branding)
[ ] Logic: generate & download/share image
[ ] Template: "Laptop gw buat kuliah IF: ASUS VivoBook 14"
```

### 3.4 SEO & Content [P1]
```
[ ] Blog: /blog/[slug] (Next.js dynamic routes)
[ ] Articles:
    - "Laptop Terbaik untuk Mahasiswa IF 2026"
    - "Panduan Pilih Laptop Kuliah Budget 10 Juta"
    - "Laptop DKV Terbaik: Butuh Layar Akurat"
    - "Orang Tua: Cara Pilih Laptop buat Anak Kuliah"
[ ] Schema.org markup (Product, Article, FAQ)
[ ] Sitemap.xml & robots.txt
[ ] Open Graph meta tags
```

### 3.5 Auth & Personalization [P2]
```
[ ] Supabase Auth (login/register)
[ ] User profile (save jurusan, budget, preferences)
[ ] Saved laptops (wishlist)
[ ] Personalized recommendations (based on history)
```

---

## Phase 4: Scaling (Jika sukses)

### 4.1 Monetization [P2]
```
[ ] Affiliate links (Tokopedia, Shopee)
[ ] Track affiliate clicks & conversions
[ ] Premium tier planning
[ ] Sponsored placement system
```

### 4.2 Community [P2]
```
[ ] User-generated reviews
[ ] Kakak tingkat → junior recommendations
[ ] Discussion / Q&A per laptop
[ ] "Tanya Senior" feature
```

### 4.3 Mobile [P2]
```
[ ] PWA (Progressive Web App)
[ ] Responsive optimization
[ ] Push notifications (price alerts)
```

### 4.4 Data Expansion [P2]
```
[ ] Scrape Shopee (selain Tokopedia)
[ ] Scrape Bhinneka (specs detail)
[ ] International expansion planning
[ ] API for third-party integration
```

---

## Metrics & Success Criteria

### MVP Success
- [ ] 500 unique visitors in first week
- [ ] 100 email subscribers
- [ ] 10+ jurusan searchable
- [ ] AI recommendation working
- [ ] Deployed & accessible

### v1 Success
- [ ] 2000 unique visitors/week
- [ ] 500 email subscribers
- [ ] 500+ laptop in database
- [ ] 30+ jurusan
- [ ] First affiliate revenue

### v2 Success
- [ ] 10,000 unique visitors/week
- [ ] Kurikulum data for 10 universities
- [ ] Featured on media / viral TikTok
- [ ] Steady affiliate income

---

## Timeline

```
Minggu 1:    Project setup + DB schema + scraping setup
Minggu 2:    Frontend core pages + data layer
Minggu 3:    AI recommendation + compare + deploy
Minggu 4:    Launch! Sebar ke sosmed

Bulan 2:     Kurikulum tracking + expanded data
Bulan 3:     Reviews + price tracking + SEO
Bulan 4+:    Monetization + scaling
```
