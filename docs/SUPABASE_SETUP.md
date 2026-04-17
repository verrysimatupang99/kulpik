# KulPik - Supabase Setup Guide

## Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Click **"New Project"**
4. Fill in:
   - **Project name**: `kulpik`
   - **Database password**: (save this securely!)
   - **Region**: Choose closest to Indonesia (Singapore or Tokyo)
   - **Pricing plan**: Free tier (500MB storage, sufficient for MVP)

### 2. Get Your Credentials

After project is created, go to **Project Settings** → **API**:

- **Project URL**: `https://xxxxx.supabase.co`
- **anon/public key**: `eyJhbGc...` (for client-side)
- **service_role key**: `eyJhbGc...` (for server-side, keep secret!)

### 3. Run Migration

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Copy-paste content from `supabase/migrations/001_initial_schema.sql`
4. Click **Run** (or `Ctrl+Enter`)

#### Option B: Via Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 4. Verify Setup

After running migration, check:

1. **Tables** - Go to **Table Editor**, verify these tables exist:
   - ✅ `laptops`
   - ✅ `jurusan`
   - ✅ `jurusan_requirements`
   - ✅ `software_specs`
   - ✅ `laptop_jurusan_score`
   - ✅ `price_history`
   - ✅ `reviews`

2. **Seed Data** - Check if seed data inserted:
   - `jurusan` should have 10 rows
   - `software_specs` should have 10 rows

### 5. Update Environment Variables

Copy `.env.example` to `.env` (or `.env.local` for Next.js):

```bash
cp .env.example .env
```

Edit `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Optional: Seed Additional Data

### Insert Jurusan Requirements

After setup, you may want to add requirements for each jurusan:

```sql
-- Example: Teknik Informatika requirements
INSERT INTO jurusan_requirements (jurusan_id, semester, min_ram_gb, min_storage_gb, need_gpu, software_required, notes)
SELECT 
    id, 
    NULL, 
    16, 
    512, 
    false,
    '["VS Code", "Docker", "Git", "Android Studio"]'::jsonb,
    'Disarankan RAM upgradable untuk future-proof'
FROM jurusan 
WHERE slug = 'teknik-informatika';
```

### Insert Sample Laptops

```sql
-- Example laptop entry
INSERT INTO laptops (
    slug, brand, model, full_name,
    price_tokopedia, price_shopee,
    cpu_brand, cpu_model, cpu_generation,
    ram_gb, ram_type, ram_upgradable, ram_max_gb,
    storage_gb, storage_type, storage_upgradable,
    gpu_model, gpu_type,
    screen_inches, screen_resolution, screen_type,
    weight_kg, battery_wh, battery_hours,
    os, ports, images, source_url
) VALUES (
    'asus-vivobook-14-x1404',
    'ASUS',
    'VivoBook 14 X1404VA',
    'ASUS VivoBook 14 X1404VA Intel Core i5-1335U',
    8500000,
    8300000,
    'Intel',
    'Core i5-1335U',
    '13th Gen',
    8,
    'DDR4',
    true,
    16,
    512,
    'NVMe',
    true,
    'Intel Iris Xe',
    'integrated',
    14.0,
    '1920x1080',
    'IPS',
    1.40,
    50,
    8.0,
    'Windows',
    '["USB-C", "HDMI", "USB-A x2", "Audio Jack"]'::jsonb,
    '["https://example.com/img1.jpg", "https://example.com/img2.jpg"]'::jsonb,
    'https://tokopedia.com/example-laptop'
);
```

---

## Testing Connection

### Using Supabase JS Client

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Test query
const { data, error } = await supabase
  .from('jurusan')
  .select('*')

console.log(data) // Should return 10 jurusan
```

### Using SQL Editor

```sql
-- Count tables
SELECT COUNT(*) FROM laptops;
SELECT COUNT(*) FROM jurusan;
SELECT COUNT(*) FROM software_specs;

-- Test join query
SELECT 
    j.nama,
    jr.min_ram_gb,
    jr.min_storage_gb,
    jr.software_required
FROM jurusan j
LEFT JOIN jurusan_requirements jr ON j.id = jr.jurusan_id
WHERE j.slug = 'teknik-informatika';
```

---

## Security Notes

1. **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code
2. RLS policies are set for:
   - ✅ Public read access (all tables)
   - ✅ Authenticated write access (for future auth implementation)
3. For scraper/admin operations, use `SUPABASE_SERVICE_ROLE_KEY`

---

## Next Steps

- [ ] Set up Next.js frontend with Supabase client
- [ ] Configure scraper to sync data to Supabase
- [ ] Add more jurusan requirements seed data
- [ ] Set up GitHub Actions for daily scraping
- [ ] Implement laptop scoring algorithm

---

## Troubleshooting

### Issue: "relation already exists"
**Solution**: Tables already created. Migration is idempotent with `IF NOT EXISTS`.

### Issue: "permission denied"
**Solution**: Ensure you're using correct API keys. Check RLS policies if using authenticated queries.

### Issue: "foreign key violation"
**Solution**: Insert parent tables first (jurusan) before child tables (jurusan_requirements).
