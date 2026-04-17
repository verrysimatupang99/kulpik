# KulPik Codebase Review — Goose CLI Report
> Reviewed by: Goose CLI (zai-org/glm-5 via NanoGPT)
> Date: 2026-04-18

---

## 🔴 CRITICAL (Harus diperbaiki segera)

| # | File | Issue |
|---|------|-------|
| 1 | `curation_server.py` | `/api/curation/clean` — NameError: variable `laptops` should be `slugs` |
| 2 | `web/src/components/laptop/LaptopCard.tsx` | Missing `import Link from "next/link"` — akan crash di runtime |
| 3 | `web/src/lib/vector_search.ts` | File Python (.py) tapi pakai ekstensi .ts — tidak akan compile |
| 4 | `web/src/app/api/recommend/route.ts` | Invalid method chaining pada RPC call (`.eq()`, `.lte()` setelah `.rpc()`) |
| 5 | `docker-compose.yml` | Frontend port 3000 vs `.env.example` port 3001 mismatch |
| 6 | `Procfile` | Menggunakan Flask dev server, bukan gunicorn untuk production |

---

## 🟠 HIGH (Perlu diperbaiki)

| # | File | Issue |
|---|------|-------|
| 7 | `web/src/app/search/page.tsx` | Multiple `any` types — harus pakai `Laptop` interface |
| 8 | `web/src/app/ai/page.tsx` | Missing `aria-live` region untuk chat messages |
| 9 | `web/src/app/api/recommend/route.ts` | SQL injection risk — user query diinterpolasi langsung |
| 10 | `web/src/app/api/recommend/route.ts` | Inconsistent env var naming |
| 11 | `requirements.txt` | Missing gunicorn untuk production |
| 12 | `Dockerfile.frontend` | Requires `output: 'standalone'` di next.config (belum diverifikasi) |

---

## 🟡 MEDIUM (Baik diperbaiki)

| # | File | Issue |
|---|------|-------|
| 13 | `curation_server.py` | Missing input validation pada `limit`/`offset` params |
| 14 | `curation_server.py` | CORS wide open (`CORS(app)` tanpa restrictions) |
| 15 | `curation_server.py` | No rate limiting |
| 16 | `curation_server.py` | `/api/curation/status` dan `/api/curation/health` missing "success" field |
| 17 | `web/src/app/page.tsx` | Hardcoded stats (54 Laptop, 7 Brand) — harus dynamic |
| 18 | `web/src/app/laptop/[id]/page.tsx` | Jurusan match logic hardcoded dan duplicated |
| 19 | `web/src/components/ui/SearchBar.tsx` | Missing accessible labels dan ARIA attributes |
| 20 | `web/package.json` | Missing `@types/node`, `eslint-config-next` |
| 21 | `.github/workflows/ci.yml` | `|| true` menyembunyikan lint failures |
| 22 | `supabase/migrations/003_pgvector.sql` | Unused `query_embedding` parameter di `search_laptops_by_text` |

---

## 🟢 LOW (Nice to have)

| # | File | Issue |
|---|------|-------|
| 23 | `web/src/app/jurusan/[slug]/page.tsx` | Large hardcoded `JURUSAN_DATA` — bisa dipindah ke shared file/database |
| 24 | Multiple files | Form inputs lack `aria-label` |
| 25 | Multiple files | Decorative emojis should have `aria-hidden="true"` |
| 26 | `web/src/components/ui/ErrorState.tsx` | Button missing `type="button"` |
| 27 | `web/src/components/layout/Header.tsx` | Mobile menu lacks `aria-expanded` state |
| 28 | `web/src/components/layout/Footer.tsx` | External link lacks new tab indication |
| 29 | `supabase/migrations/002/004_seed*.sql` | `ON CONFLICT DO NOTHING` without explicit conflict target |
| 30 | `package.json` | Python 3.8 is EOL, should require 3.9+ |
| 31 | CI Pipeline | No caching configured |
| 32 | Multiple | Missing `.dockerignore` file |
| 33 | Multiple | `CORS_ORIGINS` not documented in `.env.example` |

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 6 |
| 🟠 High | 6 |
| 🟡 Medium | 10 |
| 🟢 Low | 11 |
| **Total** | **33** |

## Files Reviewed by Goose

| Session | Files | Issues Found |
|---------|-------|-------------|
| Backend API | `curation_server.py` | 7 |
| Frontend Pages | 5 page files | 13 |
| Components | 9 component files | 9 |
| Lib & Database | 10 files | 6 |
| Config & Project | 11 files | ~10 |

**Total: ~45 files reviewed, 33 issues documented**
