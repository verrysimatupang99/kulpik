-- KulPik - Seed Data for Jurusan Requirements
-- Run this AFTER 001_initial_schema.sql

-- Teknik Informatika
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, need_gpu, need_dedicated_gpu, software_required, notes)
SELECT 
    id, 
    NULL, 
    16, 
    512, 
    15000,
    false,
    false,
    '["VS Code", "Docker", "Git", "Android Studio", "WSL"]'::jsonb,
    'RAM upgradable sangat disarankan untuk development dan future-proof'
FROM jurusan 
WHERE slug = 'teknik-informatika'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Sistem Informasi
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, need_gpu, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    12000,
    false,
    '["Microsoft Office", "VS Code", "MySQL", "Figma"]'::jsonb,
    'Lebih fokus ke bisnis analysis, tidak terlalu berat di development'
FROM jurusan 
WHERE slug = 'sistem-informasi'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- DKV (Desain Komunikasi Visual)
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, need_gpu, need_dedicated_gpu, need_color_accuracy, software_required, notes)
SELECT 
    id, 
    NULL, 
    16, 
    512, 
    15000,
    true,
    true,
    true,
    '["Adobe Photoshop", "Adobe Illustrator", "Adobe Premiere", "Figma", "Blender"]'::jsonb,
    'GPU dedicated wajib untuk rendering dan color accuracy penting untuk desain'
FROM jurusan 
WHERE slug = 'dkv'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Teknik Elektro
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, need_gpu, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    12000,
    false,
    '["MATLAB", "AutoCAD", "Multisim", "Microsoft Office"]'::jsonb,
    'MATLAB dan simulasi circuit membutuhkan CPU yang cukup kuat'
FROM jurusan 
WHERE slug = 'teknik-elektro'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Akuntansi
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, need_numeric_pad, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    true,
    '["Microsoft Excel", "MYOB", "Accurate", "Microsoft Office"]'::jsonb,
    'Numeric pad penting untuk input data akuntansi. Excel mastery is a must'
FROM jurusan 
WHERE slug = 'akuntansi'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Manajemen
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    '["Microsoft Office", "SPSS", "Microsoft Project"]'::jsonb,
    'Lebih ke presentasi dan analysis, laptop ringan sudah cukup'
FROM jurusan 
WHERE slug = 'manajemen'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Kedokteran
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    512, 
    '["Microsoft Office", "Complete Anatomy", "Medscape"]'::jsonb,
    'Storage besar untuk referensi buku dan aplikasi anatomi 3D'
FROM jurusan 
WHERE slug = 'kedokteran'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Arsitektur
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, need_gpu, need_dedicated_gpu, need_color_accuracy, software_required, notes)
SELECT 
    id, 
    NULL, 
    32, 
    1000, 
    20000,
    true,
    true,
    true,
    '["AutoCAD", "SketchUp", "Revit", "Lumion", "Adobe Photoshop", "V-Ray"]'::jsonb,
    'Paling berat secara hardware. GPU dedicated wajib, RAM 32GB recommended untuk 3D rendering'
FROM jurusan 
WHERE slug = 'arsitektur'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Teknik Sipil
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, min_cpu_benchmark, need_gpu, software_required, notes)
SELECT 
    id, 
    NULL, 
    16, 
    512, 
    15000,
    true,
    '["AutoCAD", "SAP2000", "ETABS", "Microsoft Office"]'::jsonb,
    'AutoCAD dan structural analysis software butuh GPU dan RAM cukup'
FROM jurusan 
WHERE slug = 'teknik-sipil'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Psikologi
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    NULL, 
    8, 
    256, 
    '["Microsoft Office", "SPSS", "JASP"]'::jsonb,
    'Lebih ke analisis data dan presentasi. Laptop ringan dan battery awet preferred'
FROM jurusan 
WHERE slug = 'psikologi'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

-- Semester-specific requirements for Teknik Informatika (example)
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    1, 
    8, 
    256, 
    '["VS Code", "Git", "Microsoft Office"]'::jsonb,
    'Semester 1-2: Dasar programming, laptop entry-level cukup'
FROM jurusan 
WHERE slug = 'teknik-informatika'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, software_required, notes)
SELECT 
    id, 
    3, 
    16, 
    512, 
    '["VS Code", "Docker", "MySQL", "Git"]'::jsonb,
    'Semester 3-4: Mulai berat, database dan web development'
FROM jurusan 
WHERE slug = 'teknik-informatika'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, need_gpu, software_required, notes)
SELECT 
    id, 
    5, 
    16, 
    512, 
    false,
    '["VS Code", "Docker", "Kubernetes", "Android Studio", "Postman"]'::jsonb,
    'Semester 5-6: Mobile development dan DevOps, RAM besar untuk emulator'
FROM jurusan 
WHERE slug = 'teknik-informatika'
ON CONFLICT (jurusan_id, semester) DO NOTHING;

INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, need_gpu, software_required, notes)
SELECT 
    id, 
    7, 
    16, 
    512, 
    false,
    '["VS Code", "Docker", "IntelliJ IDEA", "Postman"]'::jsonb,
    'Semester 7-8: Skripsi dan internship, laptop harus stabil untuk development'
FROM jurusan 
WHERE slug = 'teknik-informatika'
ON CONFLICT DO NOTHING;
