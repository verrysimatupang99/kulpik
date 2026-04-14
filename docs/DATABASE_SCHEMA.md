# KulPik — Database Schema

> PostgreSQL via Supabase

---

## Tables

### 1. laptops

```sql
CREATE TABLE laptops (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT UNIQUE NOT NULL,           -- asus-vivobook-14-x1404
    
    -- Basic Info
    brand           TEXT NOT NULL,                  -- ASUS, Lenovo, HP, Acer, Apple
    model           TEXT NOT NULL,                  -- VivoBook 14 X1404VA
    full_name       TEXT NOT NULL,                  -- ASUS VivoBook 14 X1404VA
    
    -- Prices
    price_tokopedia BIGINT,                         -- harga dalam Rupiah
    price_shopee    BIGINT,
    price_official  BIGINT,                         -- harga resmi/recommended
    price_currency  TEXT DEFAULT 'IDR',
    
    -- CPU
    cpu_brand       TEXT,                           -- Intel, AMD, Apple
    cpu_model       TEXT,                           -- Core i5-1335U, Ryzen 7 7730U
    cpu_generation  TEXT,                           -- 13th Gen, Zen 3
    cpu_benchmark   INTEGER,                        -- Cinebench / Geekbench score
    
    -- RAM
    ram_gb          INTEGER NOT NULL,               -- 8, 16, 32
    ram_type        TEXT,                           -- DDR4, DDR5, LPDDR5
    ram_upgradable  BOOLEAN DEFAULT false,          -- bisa ditambah?
    ram_max_gb      INTEGER,                        -- maksimal RAM setelah upgrade
    ram_slots       INTEGER,                        -- jumlah slot RAM
    
    -- Storage
    storage_gb      INTEGER NOT NULL,               -- 256, 512, 1000
    storage_type    TEXT,                           -- SSD, NVMe, eMMC
    storage_upgradable BOOLEAN DEFAULT false,
    
    -- GPU
    gpu_model       TEXT,                           -- Intel Iris Xe, RTX 4060
    gpu_type        TEXT,                           -- integrated, dedicated
    gpu_vram_gb     INTEGER,
    
    -- Display
    screen_inches   DECIMAL(3,1),                   -- 14.0, 15.6
    screen_resolution TEXT,                         -- 1920x1080, 2560x1600
    screen_type     TEXT,                           -- IPS, OLED, TN
    screen_srgb     DECIMAL(5,1),                   -- 95.0, 100.0
    screen_refresh  INTEGER,                        -- 60, 120, 144
    
    -- Physical
    weight_kg       DECIMAL(3,2),                   -- 1.40, 2.10
    battery_wh      INTEGER,                        -- 50, 72
    battery_hours   DECIMAL(3,1),                   -- 8.0, 12.5 (estimated)
    
    -- OS & Connectivity
    os              TEXT DEFAULT 'Windows',         -- Windows, macOS, Linux
    wifi            TEXT,                           -- WiFi 6, WiFi 6E
    bluetooth       TEXT,                           -- 5.0, 5.3
    ports           JSONB,                          -- ["USB-C", "HDMI", "USB-A x2"]
    
    -- Media
    images          JSONB,                          -- [url1, url2, url3]
    source_url      TEXT,                           -- link ke Tokopedia
    
    -- Metadata
    rating          DECIMAL(2,1),                   -- 4.5
    review_count    INTEGER DEFAULT 0,
    last_scraped_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_laptops_brand ON laptops(brand);
CREATE INDEX idx_laptops_price ON laptops(price_tokopedia);
CREATE INDEX idx_laptops_ram ON laptops(ram_gb);
CREATE INDEX idx_laptops_storage ON laptops(storage_gb);
CREATE INDEX idx_laptops_weight ON laptops(weight_kg);
CREATE INDEX idx_laptops_slug ON laptops(slug);
```

### 2. jurusan

```sql
CREATE TABLE jurusan (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT UNIQUE NOT NULL,               -- teknik-informatika
    nama        TEXT NOT NULL,                      -- Teknik Informatika
    fakultas    TEXT,                               -- Fakultas Teknik
    bidang      TEXT NOT NULL,                      -- STEM, Arts, Business, Health
    deskripsi   TEXT,                               -- Singkat tentang jurusan
    icon        TEXT,                               -- emoji atau icon name
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Seed data
INSERT INTO jurusan (slug, nama, fakultas, bidang, icon) VALUES
('teknik-informatika', 'Teknik Informatika', 'Fakultas Teknik', 'STEM', '💻'),
('sistem-informasi', 'Sistem Informasi', 'Fakultas Ilmu Komputer', 'STEM', '📊'),
('dkv', 'Desain Komunikasi Visual', 'Fakultas Seni & Desain', 'Arts', '🎨'),
('teknik-elektro', 'Teknik Elektro', 'Fakultas Teknik', 'STEM', '⚡'),
('akuntansi', 'Akuntansi', 'Fakultas Ekonomi', 'Business', '💰'),
('manajemen', 'Manajemen', 'Fakultas Ekonomi', 'Business', '📈'),
('kedokteran', 'Kedokteran', 'Fakultas Kedokteran', 'Health', '🏥'),
('arsitektur', 'Arsitektur', 'Fakultas Teknik', 'STEM', '🏗️'),
('teknik-sipil', 'Teknik Sipil', 'Fakultas Teknik', 'STEM', '🌉'),
('psikologi', 'Psikologi', 'Fakultas Psikologi', 'Health', '🧠');
```

### 3. jurusan_requirements

```sql
CREATE TABLE jurusan_requirements (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurusan_id          UUID REFERENCES jurusan(id) ON DELETE CASCADE,
    
    semester            INTEGER,                    -- 1-8, NULL = overall minimum
    
    -- Minimum specs
    min_ram_gb          INTEGER NOT NULL DEFAULT 8,
    min_storage_gb      INTEGER NOT NULL DEFAULT 256,
    min_cpu_benchmark   INTEGER,                    -- optional benchmark floor
    
    -- Feature requirements
    need_gpu            BOOLEAN DEFAULT false,
    need_dedicated_gpu  BOOLEAN DEFAULT false,
    need_color_accuracy BOOLEAN DEFAULT false,      -- DKV, desain
    need_touchscreen    BOOLEAN DEFAULT false,
    need_numeric_pad    BOOLEAN DEFAULT false,      -- akuntansi
    need_lightweight    BOOLEAN DEFAULT false,      -- sering bawa ke kampus
    max_weight_kg       DECIMAL(3,2),
    min_battery_hours   DECIMAL(3,1),
    
    -- Software
    software_required   JSONB,                      -- ["VS Code", "Docker", "Git"]
    
    notes               TEXT,                       -- catatan khusus
    
    created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_jurusan_req_jurusan ON jurusan_requirements(jurusan_id);
```

### 4. software_specs

```sql
CREATE TABLE software_specs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama            TEXT NOT NULL,                  -- Android Studio
    kategori        TEXT,                           -- IDE, Design, Office
    min_ram_gb      INTEGER DEFAULT 4,
    min_storage_gb  INTEGER DEFAULT 10,
    min_cpu_benchmark INTEGER,
    need_gpu        BOOLEAN DEFAULT false,
    platform        TEXT DEFAULT 'all',            -- Windows, macOS, Linux, all
    official_url    TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Seed data examples
INSERT INTO software_specs (nama, kategori, min_ram_gb, min_storage_gb, need_gpu, platform) VALUES
('VS Code', 'IDE', 4, 1, false, 'all'),
('Android Studio', 'IDE', 16, 8, false, 'all'),
('Docker', 'DevOps', 8, 10, false, 'all'),
('Adobe Photoshop', 'Design', 16, 4, true, 'all'),
('Adobe Premiere', 'Video', 16, 8, true, 'all'),
('AutoCAD', 'Engineering', 16, 10, true, 'Windows'),
('Blender', '3D', 16, 5, true, 'all'),
('MATLAB', 'Engineering', 8, 5, false, 'all'),
('Microsoft Office', 'Office', 4, 4, false, 'all'),
('Figma', 'Design', 4, 1, false, 'all');
```

### 5. laptop_jurusan_score

```sql
CREATE TABLE laptop_jurusan_score (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laptop_id       UUID REFERENCES laptops(id) ON DELETE CASCADE,
    jurusan_id      UUID REFERENCES jurusan(id) ON DELETE CASCADE,
    
    score           INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    semester_survival INTEGER,                      -- berapa semester cukup
    
    pros            JSONB,                          -- ["RAM upgradable", "Ringan"]
    cons            JSONB,                          -- ["GPU integrated", "Layar TN"]
    ai_explanation  TEXT,                           -- penjelasan AI dalam bahasa ID
    
    created_at      TIMESTAMPTZ DEFAULT now(),
    
    UNIQUE(laptop_id, jurusan_id)
);

CREATE INDEX idx_score_laptop ON laptop_jurusan_score(laptop_id);
CREATE INDEX idx_score_jurusan ON laptop_jurusan_score(jurusan_id);
CREATE INDEX idx_score_value ON laptop_jurusan_score(score DESC);
```

### 6. price_history (v2)

```sql
CREATE TABLE price_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laptop_id       UUID REFERENCES laptops(id) ON DELETE CASCADE,
    source          TEXT NOT NULL,                  -- tokopedia, shopee
    price           BIGINT NOT NULL,
    recorded_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_price_history_laptop ON price_history(laptop_id);
CREATE INDEX idx_price_history_date ON price_history(recorded_at);
```

### 7. reviews (v3)

```sql
CREATE TABLE reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laptop_id       UUID REFERENCES laptops(id) ON DELETE CASCADE,
    user_id         UUID,                           -- Supabase auth user
    jurusan         TEXT,
    universitas     TEXT,
    rating          INTEGER CHECK (rating >= 1 AND rating <= 5),
    title           TEXT,
    content         TEXT,
    pros            JSONB,
    cons            JSONB,
    verified        BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_laptop ON reviews(laptop_id);
```

---

## Useful Queries

```sql
-- Get laptops for a specific jurusan under budget
SELECT l.*, ljs.score, ljs.pros, ljs.cons, ljs.ai_explanation
FROM laptops l
JOIN laptop_jurusan_score ljs ON l.id = ljs.laptop_id
JOIN jurusan j ON ljs.jurusan_id = j.id
WHERE j.slug = 'teknik-informatika'
  AND l.price_tokopedia <= 10000000
ORDER BY ljs.score DESC
LIMIT 10;

-- Compare 3 laptops side by side
SELECT * FROM laptops
WHERE slug IN ('asus-vivobook-14', 'lenovo-ideapad-slim-5', 'acer-swift-go-14');

-- Get minimum specs for a jurusan
SELECT j.nama, jr.*
FROM jurusan_requirements jr
JOIN jurusan j ON jr.jurusan_id = j.id
WHERE j.slug = 'teknik-informatika'
ORDER BY jr.semester;
```
