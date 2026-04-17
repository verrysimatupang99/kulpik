-- KulPik - Expanded Seed Data
-- Adds more jurusan and their requirements
-- Run this AFTER 001_initial_schema.sql and 002_seed_jurusan_requirements.sql

-- ============================================
-- ADDITIONAL JURUSAN (12 new, total 22)
-- ============================================

INSERT INTO jurusan (slug, nama, fakultas, bidang, icon) VALUES
('teknik-industri', 'Teknik Industri', 'Fakultas Teknik', 'STEM', '🏭'),
('farmasi', 'Farmasi', 'Fakultas Farmasi', 'Health', '💊'),
('kedokteran-gigi', 'Kedokteran Gigi', 'Fakultas Kedokteran', 'Health', '🦷'),
('teknik-kimia', 'Teknik Kimia', 'Fakultas Teknik', 'STEM', '⚗️'),
('teknik-mesin', 'Teknik Mesin', 'Fakultas Teknik', 'STEM', '⚙️'),
('ilmu-komunikasi', 'Ilmu Komunikasi', 'Fakultas Ilmu Sosial', 'Social', '📢'),
('hukum', 'Hukum', 'Fakultas Hukum', 'Social', '⚖️'),
('pendidikan', 'Pendidikan', 'Fakultas Keguruan', 'Education', '📚'),
('ekonomi', 'Ekonomi', 'Fakultas Ekonomi', 'Business', '💹'),
('biologi', 'Biologi', 'Fakultas MIPA', 'STEM', '🧬'),
('statistika', 'Statistika', 'Fakultas MIPA', 'STEM', '📈'),
('teknik-lingkungan', 'Teknik Lingkungan', 'Fakultas Teknik', 'STEM', '🌿')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- REQUIREMENTS FOR NEW JURUSAN
-- ============================================

-- Teknik Industri
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, need_gpu, software_required, notes)
SELECT 
    id, 
    NULL, 
    16, 
    512, 
    15000,
    false,
    '["AutoCAD", "MATLAB", "Microsoft Project", "SAP", "Minitab"]'::jsonb,
    'Fokus ke optimasi proses, butuh CPU kuat untuk simulasi'
FROM jurusan 
WHERE slug = 'teknik-industri'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Farmasi
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    '["Microsoft Office", "ChemDraw", "SPSS", "Mendeley"]'::jsonb,
    'Lebih ke penelitian dan analisis data, laptop ringan sudah cukup'
FROM jurusan 
WHERE slug = 'farmasi'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Kedokteran Gigi
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    '["Microsoft Office", "3D Anatomy", "PDF Reader"]'::jsonb,
    'Mirip kedokteran umum, storage cukup untuk referensi'
FROM jurusan 
WHERE slug = 'kedokteran-gigi'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Teknik Kimia
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, software_required, notes)
SELECT 
    id, 
    NULL, 
    16, 
    512, 
    15000,
    '["MATLAB", "Aspen Plus", "ChemCAD", "Microsoft Office"]'::jsonb,
    'Simulasi proses kimia butuh CPU dan RAM cukup besar'
FROM jurusan 
WHERE slug = 'teknik-kimia'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Teknik Mesin
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, need_gpu, need_dedicated_gpu, software_required, notes)
SELECT 
    id, 
    NULL, 
    16, 
    512, 
    18000,
    true,
    true,
    '["SolidWorks", "AutoCAD", "ANSYS", "MATLAB", "CATIA"]'::jsonb,
    'CAD dan simulasi FEA butuh GPU dedicated dan RAM besar'
FROM jurusan 
WHERE slug = 'teknik-mesin'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Ilmu Komunikasi
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    '["Microsoft Office", "Adobe Premiere", "Canva", "WordPress"]'::jsonb,
    'Lebih ke konten kreatif, laptop ringan dan portable preferred'
FROM jurusan 
WHERE slug = 'ilmu-komunikasi'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Hukum
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    '["Microsoft Word", "PDF Reader", "LexisNexis", "Microsoft Office"]'::jsonb,
    'Fokus ke dokumen dan riset, laptop ringan dengan keyboard nyaman'
FROM jurusan 
WHERE slug = 'hukum'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Pendidikan
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    '["Microsoft Office", "Canva", "Google Workspace", "Zoom"]'::jsonb,
    'Untuk presentasi dan pengajaran, battery life penting'
FROM jurusan 
WHERE slug = 'pendidikan'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Ekonomi
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    '["Microsoft Excel", "SPSS", "EViews", "Microsoft Office"]'::jsonb,
    'Analisis data ekonomi, Excel dan SPSS adalah tools utama'
FROM jurusan 
WHERE slug = 'ekonomi'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Biologi
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    512, 
    '["Microsoft Office", "ImageJ", "BLAST", "Mendeley"]'::jsonb,
    'Penelitian dan analisis gambar mikroskop, storage cukup besar'
FROM jurusan 
WHERE slug = 'biologi'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Statistika
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, software_required, notes)
SELECT 
    id, 
    NULL, 
    16, 
    512, 
    15000,
    '["R", "Python", "SPSS", "SAS", "Microsoft Excel"]'::jsonb,
    'Komputasi statistik berat, CPU dan RAM besar dibutuhkan'
FROM jurusan 
WHERE slug = 'statistika'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Teknik Lingkungan
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    12000,
    '["AutoCAD", "ArcGIS", "Microsoft Office", "EPANET"]'::jsonb,
    'GIS dan modeling lingkungan butuh CPU cukup kuat'
FROM jurusan 
WHERE slug = 'teknik-lingkungan'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- ============================================
-- SEMESTER-SPECIFIC FOR ADDITIONAL JURUSAN
-- ============================================

-- DKV semester progression
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT id, 1, 8, 256, '["Adobe Photoshop", "Figma", "Microsoft Office"]'::jsonb, 'Semester 1-2: Dasar desain 2D, laptop entry-level cukup'
FROM jurusan WHERE slug = 'dkv' ON CONFLICT (jurusan_id, semester) DO NOTHING;

INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, need_gpu, software_required, notes)
SELECT id, 3, 16, 512, true, '["Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere"]'::jsonb, 'Semester 3-4: Video editing dan ilustrasi, GPU mulai dibutuhkan'
FROM jurusan WHERE slug = 'dkv' ON CONFLICT (jurusan_id, semester) DO NOTHING;

INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, need_gpu, need_dedicated_gpu, software_required, notes)
SELECT id, 5, 16, 512, true, true, '["Blender", "After Effects", "Cinema 4D"]'::jsonb, 'Semester 5-6: 3D dan motion graphics, GPU dedicated wajib'
FROM jurusan WHERE slug = 'dkv' ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Arsitektur semester progression
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT id, 1, 8, 256, '["AutoCAD", "SketchUp", "Adobe Photoshop"]'::jsonb, 'Semester 1-2: Gambar teknis dasar, laptop menengah cukup'
FROM jurusan WHERE slug = 'arsitektur' ON CONFLICT (jurusan_id, semester) DO NOTHING;

INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, need_gpu, software_required, notes)
SELECT id, 3, 16, 512, true, '["AutoCAD", "Revit", "SketchUp", "Lumion"]'::jsonb, 'Semester 3-4: 3D modeling, GPU mulai dibutuhkan'
FROM jurusan WHERE slug = 'arsitektur' ON CONFLICT (jurusan_id, semester) DO NOTHING;

INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, need_gpu, need_dedicated_gpu, software_required, notes)
SELECT id, 5, 32, 1000, true, true, '["Revit", "Lumion", "V-Ray", "3ds Max"]'::jsonb, 'Semester 5+: Rendering berat, RAM 32GB dan GPU dedicated wajib'
FROM jurusan WHERE slug = 'arsitektur' ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Kedokteran semester progression
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT id, 1, 8, 256, '["Microsoft Office", "PDF Reader"]'::jsonb, 'Semester 1-2: Pre-klinik, laptop basic cukup'
FROM jurusan WHERE slug = 'kedokteran' ON CONFLICT (jurusan_id, semester) DO NOTHING;

INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT id, 3, 8, 512, '["Complete Anatomy", "Microsoft Office", "Medscape"]'::jsonb, 'Semester 3+: Anatomi 3D, storage lebih besar untuk referensi'
FROM jurusan WHERE slug = 'kedokteran' ON CONFLICT (jurusan_id, semester) DO NOTHING;
