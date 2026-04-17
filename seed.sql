-- Seed data for `jurusan`
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

-- Seed data for `software_specs`
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