# KulPik — User Flows

## Flow A: Explorer ("GW UDAH TAU MAU APA")

```
┌─────────────────────────────────────┐
│  LANDING PAGE                        │
│  "Cari laptop buat kuliah"          │
│  [Mulai Cari] [Pilihin Dong] [Tanya]│
└──────────────┬──────────────────────┘
               │ klik "Mulai Cari"
               ▼
┌─────────────────────────────────────┐
│  /search                            │
│                                     │
│  ┌─────────┐  ┌─────────────────┐  │
│  │ FILTER  │  │  RESULTS        │  │
│  │         │  │                 │  │
│  │ Budget: │  │ [Card] [Card]   │  │
│  │ █████░░ │  │ [Card] [Card]   │  │
│  │ 5-15jt  │  │ [Card] [Card]   │  │
│  │         │  │                 │  │
│  │ Brand:  │  │ Sort: Harga ▼   │  │
│  │ [✓]ASUS │  │                 │  │
│  │ [✓]Lenovo│ │ Showing 12 of   │  │
│  │ [ ]HP   │  │ 48 laptops      │  │
│  │         │  │                 │  │
│  │ RAM:    │  │                 │  │
│  │ [✓]16GB │  │                 │  │
│  │ [ ]32GB │  │                 │  │
│  └─────────┘  └─────────────────┘  │
└──────────────┬──────────────────────┘
               │ klik laptop card
               ▼
┌─────────────────────────────────────┐
│  /laptop/asus-vivobook-14           │
│                                     │
│  [Gambar]                           │
│  ASUS VivoBook 14 X1404VA           │
│  Rp 8.499.000                       │
│  ⭐ 4.5 (324 reviews)               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ SPECS                       │   │
│  │ CPU: Intel Core i5-1335U    │   │
│  │ RAM: 16GB DDR4 (upgradable) │   │
│  │ Storage: 512GB NVMe         │   │
│  │ GPU: Intel Iris Xe          │   │
│  │ Screen: 14" FHD IPS         │   │
│  │ Weight: 1.4 kg              │   │
│  │ Battery: ~8 hours           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Cocok buat jurusan:                │
│  🟢 Teknik Informatika (Score: 85)  │
│  🟢 Sistem Informasi (Score: 82)    │
│  🟡 Manajemen (Score: 70)           │
│                                     │
│  [Beli di Tokopedia] [Compare]      │
└─────────────────────────────────────┘
```

## Flow B: Quiz ("GW BINGUNG")

```
┌─────────────────────────────────────┐
│  /quiz                              │
│  "Pilihin laptop buat lo!"          │
│                                     │
│  Step 1 of 4                        │
│  ┌─────────────────────────────┐   │
│  │ Jurusan lo apa?             │   │
│  │                             │   │
│  │ [💻 Teknik Informatika]     │   │
│  │ [📊 Sistem Informasi]       │   │
│  │ [🎨 DKV]                    │   │
│  │ [⚡ Teknik Elektro]         │   │
│  │ [💰 Akuntansi]              │   │
│  │ [+ Lihat semua jurusan]     │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │ pilih jurusan
               ▼
┌─────────────────────────────────────┐
│  Step 2 of 4                        │
│  ┌─────────────────────────────┐   │
│  │ Budget lo berapa?           │   │
│  │                             │   │
│  │  Rp 5jt ────●──── Rp 20jt  │   │
│  │  Dipilih: Rp 10.000.000     │   │
│  │                             │   │
│  │  Preset:                    │   │
│  │  [5-8jt] [8-12jt] [12-20jt]│   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │ set budget
               ▼
┌─────────────────────────────────────┐
│  Step 3 of 4                        │
│  ┌─────────────────────────────┐   │
│  │ Prioritas lo apa?           │   │
│  │ (pilih 2)                   │   │
│  │                             │   │
│  │ [⚖️ Ringan & Portable]      │   │
│  │ [🔋 Baterai Awet]           │   │
│  │ [🚀 Performa Kuat]          │   │
│  │ [📺 Layar Bagus]            │   │
│  │ [💰 Value for Money]        │   │
│  │ [🎮 Bisa Main Game]         │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │ pilih prioritas
               ▼
┌─────────────────────────────────────┐
│  Step 4 of 4                        │
│  ┌─────────────────────────────┐   │
│  │ Semester berapa lo masuk?   │   │
│  │                             │   │
│  │ [1] [2] [3] [4] [5] [6]    │   │
│  │                             │   │
│  │ Ini bantu kita prediksi     │   │
│  │ kebutuhan lo ke depannya    │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │ submit
               ▼
┌─────────────────────────────────────┐
│  /quiz/results                      │
│                                     │
│  "Rekomendasi buat lo:              │
│   Mahasiswa IF, budget 10jt,        │
│   prioritas ringan + performa"      │
│                                     │
│  🥇 ASUS VivoBook 14               │
│  Score: 88/100 | Cocok 6 semester   │
│  ✅ RAM 16GB cukup buat coding      │
│  ✅ Ringan 1.4kg, gampang dibawa    │
│  ⚠️ GPU integrated, kurang buat ML  │
│  Rp 8.499.000 di Tokopedia          │
│                                     │
│  🥈 Lenovo IdeaPad Slim 5           │
│  Score: 85/100 | Cocok 6 semester   │
│  ...                                │
│                                     │
│  🥉 Acer Swift Go 14                │
│  Score: 82/100 | Cocok 5 semester   │
│  ...                                │
│                                     │
│  [Lihat Detail] [Compare 3 Ini]     │
│  [Tanya AI buat penjelasan lebih]   │
└─────────────────────────────────────┘
```

## Flow C: AI Chat ("GW MAU NANYA")

```
┌─────────────────────────────────────┐
│  /ai                                │
│  "Tanya aja, gak usah sungkan"     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💬 Chat                     │   │
│  │                             │   │
│  │ 👤 gw kuliah informatika,   │   │
│  │ budget 10 juta, sering bawa │   │
│  │ ke kampus, kadang main      │   │
│  │ game ringan                 │   │
│  │                             │   │
│  │ 🤖 Oke, berarti lo butuh:  │   │
│  │ - RAM minimal 16GB (coding) │   │
│  │ - Ringan < 1.6kg (bawa)    │   │
│  │ - GPU lumayan (game ringan) │   │
│  │                             │   │
│  │ Rekomendasi gw:             │   │
│  │                             │   │
│  │ 1. ASUS VivoBook 14        │   │
│  │    Rp 8.5jt | Score: 85     │   │
│  │    RAM 16GB, 1.4kg,         │   │
│  │    Iris Xe cukup buat game  │   │
│  │    ringan (Valorant low)    │   │
│  │                             │   │
│  │ 2. Lenovo IdeaPad Slim 5   │   │
│  │    Rp 9.2jt | Score: 83     │   │
│  │    RAM 16GB, 1.5kg,         │   │
│  │    Ryzen 7, baterai awet    │   │
│  │                             │   │
│  │ ⚠️ Hindari yang RAM         │   │
│  │ soldered di bawah 16GB,    │   │
│  │ semester 5 pasti nyesel.   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Ketik pertanyaan...     [→] │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## Responsive Design Notes

- Mobile-first design (target utama: mahasiswa pakai HP)
- Filter → bottom sheet / drawer di mobile
- Compare → horizontal scroll di mobile
- Cards → 1 kolom mobile, 2 kolom tablet, 3 kolom desktop
