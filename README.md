# KulPik — Rekomendasi Laptop by Jurusan 🎓💻

> **"Baru lulus SMA? Bingung pilih laptop kuliah? KulPik kasih tau laptop yang tepat buat jurusan lo."**

KulPik adalah platform rekomendasi laptop berbasis data untuk mahasiswa Indonesia. Berbeda dengan TikTok (opini subjektif) atau ChatGPT (data outdated), KulPik memberikan rekomendasi data-driven berdasarkan jurusan, kurikulum, budget, dan harga real-time dari marketplace Indonesia.

---

## Mengapa KulPik?

| Platform | Masalah |
|----------|---------|
| TikTok | Opini subjektif, bisa dibayar brand |
| ChatGPT/Gemini | Data training cutoff, gak tau harga lokal |
| Pricebook | Compare specs, tapi gak ada konteks kuliah |
| Bhinneka/Pemmz | Marketplace, bukan rekomendasi |
| **KulPik** | **Data real-time + jurusan-aware + AI + harga lokal** |

---

## Fitur Utama

### v1 (MVP)
- 🔍 **Search & Filter** — Cari by harga, brand, specs, berat
- 🎓 **Jurusan Matcher** — Pilih jurusan → minimum specs
- 💰 **Budget Calculator** — Masukin budget → laptop yang masuk
- ⚖️ **Compare** — Side-by-side specs & harga (max 3)
- 🤖 **AI Recommendation** — Natural language query via Gemini

### v2 (Kurikulum Tracking)
- 📚 **Semester Tracker** — Roadmap kebutuhan per semester
- 🔮 **Future-proof Score** — Berapa lama laptop cukup
- 📊 **Trend Insights** — Data tren kebutuhan per jurusan

### v3 (Data Product)
- 💬 **User Reviews** — Mahasiswa review laptop mereka
- 🔔 **Price Alert** — Notifikasi harga turun
- 🏆 **Laptop of the Month** — Rekomendasi terbaik per bulan
- 📤 **Share Card** — Gambar rekomendasi buat share ke WA/IG

---

## Tech Stack

```
Frontend:   Next.js 16 + React 19 + Tailwind CSS 4
Backend:    Next.js API Routes (serverless)
Database:   Supabase (PostgreSQL managed, free 500MB)
AI:         Google Gemini API (rekomendasi cerdas)
Scraping:   Playwright (Python) + GitHub Actions cron
Hosting:    Vercel (free tier)
Auth:       Supabase Auth (opsional v1)
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/verrysimatupang99/kulpik.git
cd kulpik

# Install dependencies (frontend)
cd web
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan API keys

# Run dev
npm run dev

# Scraping (Python)
cd ../scraper
pip install -r requirements.txt
python run.py
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
├── scraper/                # Playwright scraper
│   ├── tokopedia.py       # Tokopedia scraper
│   ├── parser.py          # Spec extraction
│   ├── cleaners.py        # Data cleaning
│   ├── db_sync.py         # Supabase sync
│   └── run.py             # Entry point
├── docs/                   # Documentation
├── .github/workflows/      # CI/CD + scraping cron
└── README.md
```

---

## Target Audience

1. **Fresh Graduate SMA/SMK** — ~2 juta/tahun, bingung pilih laptop
2. **Mahasiswa Upgrade** — Semester 3-5, laptop lemot
3. **Orang Tua** — Beliin anak, gak paham specs
4. **Kakak Tingkat** — Rekomendasi ke junior

---

## Monetization

- **Affiliate Links** — Tokopedia/Shopee affiliate (komisi 1-5%)
- **Premium** — Compare unlimited, price alert real-time
- **Sponsored** — Brand partnership (ASUS, Lenovo, dll)

---

## Golden Window

Mei–Juli = peak demand mahasiswa baru. Target launch sebelum Mei 2026.

---

## License

MIT
