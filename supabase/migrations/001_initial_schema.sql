-- KulPik Database Schema
-- PostgreSQL via Supabase
-- Migration: 001_initial_schema

-- ============================================
-- 1. LAPTOPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS laptops (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            TEXT UNIQUE NOT NULL,

    -- Basic Info
    brand           TEXT NOT NULL,
    model           TEXT NOT NULL,
    full_name       TEXT NOT NULL,

    -- Prices
    price_tokopedia BIGINT,
    price_shopee    BIGINT,
    price_official  BIGINT,
    price_currency  TEXT DEFAULT 'IDR',

    -- CPU
    cpu_brand       TEXT,
    cpu_model       TEXT,
    cpu_generation  TEXT,
    cpu_benchmark   INTEGER,

    -- RAM
    ram_gb          INTEGER NOT NULL,
    ram_type        TEXT,
    ram_upgradable  BOOLEAN DEFAULT false,
    ram_max_gb      INTEGER,
    ram_slots       INTEGER,

    -- Storage
    storage_gb      INTEGER NOT NULL,
    storage_type    TEXT,
    storage_upgradable BOOLEAN DEFAULT false,

    -- GPU
    gpu_model       TEXT,
    gpu_type        TEXT,
    gpu_vram_gb     INTEGER,

    -- Display
    screen_inches   DECIMAL(3,1),
    screen_resolution TEXT,
    screen_type     TEXT,
    screen_srgb     DECIMAL(5,1),
    screen_refresh  INTEGER,

    -- Physical
    weight_kg       DECIMAL(3,2),
    battery_wh      INTEGER,
    battery_hours   DECIMAL(3,1),

    -- OS & Connectivity
    os              TEXT DEFAULT 'Windows',
    wifi            TEXT,
    bluetooth       TEXT,
    ports           JSONB,

    -- Media
    images          JSONB,
    source_url      TEXT,

    -- Metadata
    rating          DECIMAL(2,1),
    review_count    INTEGER DEFAULT 0,
    last_scraped_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes for laptops
CREATE INDEX IF NOT EXISTS idx_laptops_brand ON laptops(brand);
CREATE INDEX IF NOT EXISTS idx_laptops_price ON laptops(price_tokopedia);
CREATE INDEX IF NOT EXISTS idx_laptops_ram ON laptops(ram_gb);
CREATE INDEX IF NOT EXISTS idx_laptops_storage ON laptops(storage_gb);
CREATE INDEX IF NOT EXISTS idx_laptops_weight ON laptops(weight_kg);
CREATE INDEX IF NOT EXISTS idx_laptops_slug ON laptops(slug);

-- ============================================
-- 2. JURUSAN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jurusan (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT UNIQUE NOT NULL,
    nama        TEXT NOT NULL,
    fakultas    TEXT,
    bidang      TEXT NOT NULL,
    deskripsi   TEXT,
    icon        TEXT,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Seed data for jurusan
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
('psikologi', 'Psikologi', 'Fakultas Psikologi', 'Health', '🧠')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. JURUSAN REQUIREMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jurusan_requirements (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurusan_id          UUID REFERENCES jurusan(id) ON DELETE CASCADE,
    semester            INTEGER,
    min_ram_gb          INTEGER NOT NULL DEFAULT 8,
    min_storage_gb      INTEGER NOT NULL DEFAULT 256,
    min_cpu_benchmark   INTEGER,
    need_gpu            BOOLEAN DEFAULT false,
    need_dedicated_gpu    BOOLEAN DEFAULT false,
    need_color_accuracy BOOLEAN DEFAULT false,
    need_touchscreen    BOOLEAN DEFAULT false,
    need_numeric_pad    BOOLEAN DEFAULT false,
    need_lightweight    BOOLEAN DEFAULT false,
    max_weight_kg       DECIMAL(3,2),
    min_battery_hours   DECIMAL(3,1),
    software_required   JSONB,
    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jurusan_req_jurusan ON jurusan_requirements(jurusan_id);

-- ============================================
-- 4. SOFTWARE SPECS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS software_specs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama            TEXT NOT NULL,
    kategori        TEXT,
    min_ram_gb      INTEGER DEFAULT 4,
    min_storage_gb  INTEGER DEFAULT 10,
    min_cpu_benchmark INTEGER,
    need_gpu        BOOLEAN DEFAULT false,
    platform        TEXT DEFAULT 'all',
    official_url    TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Seed data for software_specs
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
('Figma', 'Design', 4, 1, false, 'all')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. LAPTOP JURUSAN SCORE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS laptop_jurusan_score (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laptop_id       UUID REFERENCES laptops(id) ON DELETE CASCADE,
    jurusan_id      UUID REFERENCES jurusan(id) ON DELETE CASCADE,
    score           INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    semester_survival INTEGER,
    pros            JSONB,
    cons            JSONB,
    ai_explanation  TEXT,
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(laptop_id, jurusan_id)
);

CREATE INDEX IF NOT EXISTS idx_score_laptop ON laptop_jurusan_score(laptop_id);
CREATE INDEX IF NOT EXISTS idx_score_jurusan ON laptop_jurusan_score(jurusan_id);
CREATE INDEX IF NOT EXISTS idx_score_value ON laptop_jurusan_score(score DESC);

-- ============================================
-- 6. PRICE HISTORY TABLE (v2)
-- ============================================
CREATE TABLE IF NOT EXISTS price_history (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laptop_id       UUID REFERENCES laptops(id) ON DELETE CASCADE,
    source          TEXT NOT NULL,
    price           BIGINT NOT NULL,
    recorded_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_history_laptop ON price_history(laptop_id);
CREATE INDEX IF NOT EXISTS idx_price_history_date ON price_history(recorded_at);

-- ============================================
-- 7. REVIEWS TABLE (v3)
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    laptop_id       UUID REFERENCES laptops(id) ON DELETE CASCADE,
    user_id         UUID,
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

CREATE INDEX IF NOT EXISTS idx_reviews_laptop ON reviews(laptop_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;
ALTER TABLE jurusan ENABLE ROW LEVEL SECURITY;
ALTER TABLE jurusan_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE laptop_jurusan_score ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (v1 - no auth required)
CREATE POLICY "Allow public read access on laptops"
    ON laptops FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on jurusan"
    ON jurusan FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on jurusan_requirements"
    ON jurusan_requirements FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on software_specs"
    ON software_specs FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on laptop_jurusan_score"
    ON laptop_jurusan_score FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on price_history"
    ON price_history FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access on reviews"
    ON reviews FOR SELECT
    USING (true);

-- Allow authenticated users to manage all data (for scraper/admin)
CREATE POLICY "Allow authenticated users to manage laptops"
    ON laptops FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage reviews"
    ON reviews FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- USEFUL FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for laptops table
CREATE TRIGGER update_laptops_updated_at
    BEFORE UPDATE ON laptops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
