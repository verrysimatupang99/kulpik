# Supabase Migrations

This folder contains SQL migration files for the KulPik project.

## Migration Files

- `001_initial_schema.sql` - Creates all tables, indexes, RLS policies, and seed data
- `002_seed_jurusan_requirements.sql` - Inserts jurusan requirements for all 10 majors

## How to Run

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project → **SQL Editor**
2. Click **New Query**
3. Copy-paste each migration file in order (001, then 002)
4. Click **Run** (or `Ctrl+Enter`)

### Option 2: Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run all migrations
supabase db push
```

## Order Matters

Always run migrations in order:
1. `001_initial_schema.sql` (creates tables)
2. `002_seed_jurusan_requirements.sql` (adds requirements data)
