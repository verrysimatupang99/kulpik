# KulPik — Brainstorm Documentation

> Hasil diskusi brainstorming antara Verry & Hermes Agent, 14 April 2026.

---

## 1. Konsep & Visi

**KulPik** (Kuliah + Picker) adalah platform rekomendasi laptop berbasis data untuk mahasiswa Indonesia.

### Filosofi
- Berdasarkan **data**, bukan opini
- **Jurusan-aware** (beda jurusan, beda kebutuhan)
- **Future-proof** (pikirkan 4 tahun ke depan, bukan cuma sekarang)
- **Konteks Indonesia** (harga IDR, toko lokal, kurikulum lokal)

---

## 2. Target User

### Persona Utama

| Persona | Pain Point | Budget | Channel |
|---------|-----------|--------|---------|
| Fresh Graduate SMA/SMK | Bingung pilih, takut salah beli | 5-15 juta (dari ortu) | TikTok, IG, YouTube |
| Mahasiswa Upgrade | Laptop lemot, butuh lebih kuat | 8-20 juta | Reddit, grup kampus |
| Orang Tua | Gak paham specs, mau murah & awet | 5-12 juta | Facebook, WhatsApp |
| Kakak Tingkat | "Dulu gw salah beli, jangan kayak gw" | - | Grup kampus, LINE |

### Current Journey vs Ideal Journey

```
CURRENT:
Lulus SMA → Bingung → TikTok → 10 opsi beda → ChatGPT → jawaban generik
→ Nanya temen → ikut-ikutan → beli salah → nyesel

IDEAL (dengan KulPik):
Lulus SMA → Buka KulPik → pilih jurusan + budget → data-driven recommendation
→ paham kenapa cocok → beli dengan PD
```

---

## 3. Fitur Detail

### v1 — MVP (Build 2-3 minggu)

#### 3.1 Search & Filter
- Filter: budget (range IDR), brand, RAM, storage, GPU, berat, layar
- Sort: harga, rating, relevansi jurusan
- Search: nama laptop, brand, spesifikasi

#### 3.2 Jurusan Matcher
- 10 jurusan populer dulu:
  1. Teknik Informatika / Ilmu Komputer
  2. Sistem Informasi
  3. Desain Komunikasi Visual (DKV)
  4. Teknik Elektro
  5. Akuntansi
  6. Manajemen
  7. Kedokteran
  8. Arsitektur
  9. Teknik Sipil
  10. Psikologi
- Per jurusan: minimum specs mapping

#### 3.3 Budget Calculator
- Input: budget (range slider)
- Output: laptop yang masuk budget, sorted by value

#### 3.4 Compare (max 3)
- Side-by-side: specs, harga, rating, pro/con per jurusan

#### 3.5 AI Recommendation (Gemini)
- Natural language: "gw kuliah IF, budget 10jt, sering bawa ke kampus"
- AI parses intent → filters DB → ranks & explains

### v2 — Kurikulum Tracking (Build 1-2 bulan)

#### 3.6 Semester Tracker
- Per jurusan per kampus: mata kuliah per semester
- Software yang dipakai per mata kuliah
- Minimum specs software tersebut
- Tren perubahan kebutuhan

#### 3.7 Future-proof Score
- Score 0-100: berapa semester laptop cukup
- Based on: current specs vs projected requirements

#### 3.8 Trend Insights
- "Rata-rata kebutuhan RAM jurusan IF naik 2GB/tahun"
- "50% kampus sudah pakai Docker di semester 4"

### v3 — Data Product (Build 2-3 bulan)

#### 3.9 User Reviews
- Mahasiswa review laptop mereka by jurusan
- "I'm from IF UB, pakai ASUS VivoBook 14, cukup sampai semester 6"

#### 3.10 Price Alert
- User set target harga → notif kalau turun

#### 3.11 Share Card
- Generate gambar: "Laptop gw buat kuliah IF: ASUS VivoBook 14"
- Share ke WA, Instagram, TikTok

---

## 4. Data Strategy

### Sumber Data

| Source | Data | Method |
|--------|------|--------|
| Tokopedia | Harga, rating, toko, specs | Playwright scraping |
| Shopee | Harga, flash sale | Playwright scraping |
| Bhinneka | Specs detail | Playwright scraping |
| Notebookcheck | Review score | API / scraping |
| Website kampus | Kurikulum | Scraping / manual |
| Reddit/Quora | Real experience | Manual curation |
| YouTube | Mahasiswa review | Manual curation |

### Scraping Strategy

- **Tool**: Playwright (Python) — handle JS-rendered SPA
- **Schedule**: 1-2x sehari (harga gak berubah tiap jam)
- **Safety**: delay random 2-5s, rotate user-agent
- **Storage**: Supabase (PostgreSQL)
- **Cron**: GitHub Actions (gratis)
- **Anti-detection**: headless=True, random delays, user-agent rotation

### Data Volume

```
v1 MVP:
├─ 50-100 laptop database (manual + scraped)
├─ 10 jurusan (populer)
└─ ~500 rows total

v1 Full:
├─ 500+ laptop (scraped)
├─ 30+ jurusan + kurikulum
└─ ~5000+ rows
```

---

## 5. User Flows

### Flow A: Explorer ("GW UDAH TAU MAU APA")
```
Landing Page → Filter (budget, brand, specs) → Results → Compare
```

### Flow B: Quiz ("GW BINGUNG")
```
"Pilihin dong" → Q1: Jurusan? → Q2: Budget? → Q3: Prioritas? → Q4: Semester?
→ Hasil + AI Penjelasan + 3 Rekomendasi
```

### Flow C: AI Chat ("GW MAU NANYA")
```
Chat box → "gw kuliah IF, budget 10jt, sering bawa ke kampus"
→ AI jawab + suggest 3 laptop + alasan
```

---

## 6. Kompetitor Analysis

| Kompetitor | Ada | Gak Ada |
|-----------|-----|---------|
| Pricebook.id | Compare harga | Konteks kuliah |
| GadgetIn (YT) | Review | Bukan tool |
| Pemmz.com | Jualan | Fokus gaming |
| Bhinneka | Marketplace | Bukan rekomendasi |
| ChatGPT | AI recommendation | Data outdated, gak lokal |
| TikTok | Opini visual | Subjektif, bisa dibayar |
| **KulPik** | **Data lokal + jurusan-aware + AI** | **Belum ada** |

### Gap di Pasar
- ❌ Tidak ada rekomendasi BY JURUSAN
- ❌ Tidak ada kurikulum-aware
- ❌ Tidak ada AI chat buat tanya-tanya lokal
- ❌ Tidak ada budget + future-proof calculator

---

## 7. Monetization

### Phase 1: Affiliate
- Tokopedia affiliate link → komisi 1-5%
- Shopee affiliate
- Link langsung ke toko

### Phase 2: Premium
- "Compare unlimited" (free: max 3)
- Price alert real-time
- Early access deals

### Phase 3: Ads & Partnership
- Sponsored laptop placement
- Brand partnership (ASUS, Lenovo, Acer, dll)
- Annual "State of Student Laptops" report

---

## 8. Launch Strategy

### Pre-Launch (Minggu 1-2)
- Landing page + email list
- Post di Twitter, Reddit r/indonesia, r/kuliah, grup FB kampus
- 1-2 artikel SEO: "Laptop Terbaik untuk Mahasiswa IF 2026"
- Target: 100 email subscribers

### Launch (Minggu 3)
- Deploy ke Vercel
- Post di Product Hunt
- Share di semua grup kampus
- Target: 500 unique visitors

### Post-Launch (Minggu 4+)
- Kumpulin feedback
- Tambahin jurusan & laptop data
- SEO content terus-menerus
- Mulai affiliate links
- Target: 1000 visitors/minggu

### Golden Window
- Mei–Juli = peak demand mahasiswa baru
- **Target launch: sebelum Mei 2026**

---

## 9. Marketing Angle

### Messaging
> "Baru lulus SMA? Bingung pilih laptop kuliah? KulPik kasih tau laptop yang tepat buat jurusan lo. Berdasarkan data, bukan opini."

### TikTok/Reels Content Ideas
1. "Laptop 10 juta terbaik buat kuliah IF"
2. "Jangan beli laptop ini kalau kuliah DKV"
3. "Laptop salah beli vs bener, bedanya apa?"
4. "Orang tua beliin laptop, ini yang harus dicek"
5. "Laptop 5 juta yang cukup buat kuliah"
6. "KulPik — cek laptop lo cocok gak buat jurusan"

---

## 10. Hosting & Deployment

```
FREE TIER SETUP:

Vercel (Frontend + API)
├─ Next.js native support
├─ Serverless functions (scraping endpoint)
├─ Auto-deploy dari GitHub
└─ $0/bulan

Supabase (Database)
├─ PostgreSQL managed (500MB free)
├─ Auth built-in
├─ Real-time subscriptions
└─ $0/bulan

GitHub Actions (Cron Scraping)
├─ Run scraper tiap hari
├─ 2000 menit/bulan free
└─ $0/bulan

TOTAL: $0/bulan
```

### Alternatif (nanti)
- DigitalOcean $100 credit (dari GitHub Student Pack)
- Disimpan buat scaling kalau udah rame
