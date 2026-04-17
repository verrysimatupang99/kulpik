# KulPik Stack v2 -- Migration Guide

> Handover document for Goose CLI implementation.
> Use `zai-org/glm-5` model via NanoGPT (NOT `:thinking` variant).
> NanoGPT trial: 60M tokens, ~831K used, expires ~Apr 22 2026.

---

## Overview

Migrate KulPik from Playwright-scraping-only stack to hybrid EXA + Cohere + NanoGPT architecture.

**Goal:** Data lebih kaya (review, benchmark, spek dari web), harga tetap real-time dari marketplace Indonesia, retrieval lebih akurat, generation lebih bagus.

---

## Current Stack (v1)

```
Playwright scraper (Tokopedia + Shopee)
    → Supabase PostgreSQL (SQL queries)
        → Gemini API (generation)
            → Next.js 16 frontend (Vercel)
```

**Problems:**
- Playwright scraper fragile (Tokopedia selector sering berubah)
- Data terbatas pada marketplace (tidak ada review, benchmark, spek detail)
- Retrieval pakai SQL WHERE biasa (tidak paham konteks "laptop untuk jurusan TI")
- Maintenance tinggi

---

## New Stack (v2)

```
User Query (jurusan + budget + kebutuhan)
    │
    ├─ [EXA API]        → Cari spek, review, benchmark laptop dari web
    ├─ [Scraper Ringan]  → Ambil harga real-time + link beli Tokopedia/Shopee
    │
    ▼
[Cohere Embed v4.0]     → Embed data laptop ke vector
    │
    ▼
[Supabase + pgvector]   → Simpan data + vector embedding
    │
    ▼
[Cohere Rerank v3.5]    → Filter top 5 hasil paling relevan
    │
    ▼
[Qwen3-coder / NanoGPT] → Generate rekomendasi natural language
[Gemini API]             → Fallback kalau NanoGPT down
    │
    ▼
Output: 3 rekomendasi + reasoning + harga real-time + link beli
```

---

## API Keys & Credentials

All keys are in `~/.hermes/.env` on the Azure VM (20.212.85.248).
For local development, copy relevant keys to `.env` files.

| Service | Key Variable | Status | Notes |
|---------|-------------|--------|-------|
| NanoGPT | `NANOGPT_API_KEY` | Active | Trial 60M tokens, expires ~Apr 22 |
| NanoGPT | `OPENAI_API_KEY` | Active | Same key as NANOGPT_API_KEY |
| EXA | `EXA_API_KEY` | Active | $20 credit, ~1 month validity |
| Cohere | `COHERE_API_KEY` | **NEED TO SET** | Free tier: 100 req/min embed, 1000 req/month rerank |
| Gemini | `GEMINI_API_KEY` | **CHECK** | Existing key, used as fallback |
| Supabase | `SUPABASE_URL` + `SUPABASE_KEY` | **CHECK** | Already configured in project |

### NanoGPT Configuration

```
Provider:       NanoGPT (custom)
API Key:        sk-nano-d808b205-0a62-4dd8-83ea-306188e7c392
Base URL:       https://nano-gpt.com/api/v1
Subscription:   https://nano-gpt.com/api/subscription/v1
Header:         x-client: goose (REQUIRED for trial token access)
Model:          zai-org/glm-5
```

**IMPORTANT:** Without `x-client: goose` header, trial users get 402 "Insufficient USD balance".

### EXA Configuration

```
Provider:       EXA
API Key:        1ea2fd9a-78af-4d41-bafe-c3ac7531cb6c
Search Type:    auto (balanced relevance and speed, ~1s)
Content:        compact (4k chars highlights)
Rate Limit:     10 QPS
Pricing:        $7/1K searches, $1/1K content pages
```

### Cohere Configuration

```
Provider:       Cohere
Embed Model:    embed-v4.0 (1024 dimensions)
Rerank Model:   rerank-v3.5
Free Tier:      100 req/min embed, 1000 req/month rerank
```

**To get Cohere API key:** https://dashboard.cohere.com/api-keys

---

## Implementation Phases

### Phase 1: EXA Integration (Replace Full Scraping)

**Goal:** Use EXA for specs/reviews/benchmarks, keep scraper for prices only.

**Files to modify:**
- `scraper/exa_search.py` (NEW) -- EXA API client for laptop search
- `scraper/run.py` -- Add EXA phase to pipeline
- `scraper/config.py` -- Add EXA_API_KEY, EXA config
- `scraper/requirements.txt` -- Add `exa-py`

**Implementation steps:**

1. Create `scraper/exa_search.py`:
   ```python
   """
   EXA Search Module for KulPik
   Searches for laptop specs, reviews, benchmarks from web.
   """
   from exa_py import Exa
   import os

   EXA_API_KEY = os.getenv("EXA_API_KEY", "")
   exa = Exa(api_key=EXA_API_KEY)

   def search_laptop_specs(query: str, num_results: int = 10) -> list:
       """
       Search for laptop specifications, reviews, and benchmarks.
       
       Args:
           query: e.g. "ASUS VivoBook 14 A1404 review specs benchmark"
           num_results: number of results to return
       
       Returns:
           List of dicts with title, url, highlights, published_date
       """
       results = exa.search_and_contents(
           query,
           type="auto",
           num_results=num_results,
           highlights={"max_characters": 4000}
       )
       return [
           {
               "title": r.title,
               "url": r.url,
               "highlights": getattr(r, "highlights", []),
               "published_date": getattr(r, "published_date", None),
               "source": "exa",
           }
           for r in results.results
       ]

   def search_laptop_reviews(laptop_name: str, num_results: int = 5) -> list:
       """Search for laptop reviews and user opinions."""
       return search_laptop_specs(f"{laptop_name} review Indonesia", num_results)

   def search_laptop_benchmark(laptop_name: str, num_results: int = 5) -> list:
       """Search for laptop benchmark scores."""
       return search_laptop_specs(f"{laptop_name} benchmark Cinebench Geekbench", num_results)

   def search_laptop_for_jurusan(jurusan: str, budget_juta: int) -> list:
       """
       Search for laptops suitable for a specific university major.
       
       Args:
           jurusan: e.g. "Teknik Informatika", "Desain Grafis"
           budget_juta: budget in juta rupiah
       """
       budget_str = f"{budget_juta} juta"
       return search_laptop_specs(
           f"laptop untuk {jurusan} budget {budget_str} 2025 2026",
           num_results=10
       )
   ```

2. Modify `scraper/run.py` -- Add EXA phase:
   ```python
   # In main(), add before SCRAPE phase:
   parser.add_argument("--exa", action="store_true", help="Run EXA search phase")
   
   # Add EXA phase:
   if args.exa or run_all:
       logger.info("PHASE 0: EXA SEARCH")
       from exa_search import search_laptop_specs
       # Search for popular laptop queries
       queries = args.queries or ["laptop mahasiswa 2025", "laptop gaming 10 juta"]
       for q in queries:
           results = search_laptop_specs(q)
           logger.info(f"EXA '{q}': {len(results)} results")
   ```

3. Add to `scraper/requirements.txt`:
   ```
   exa-py
   ```

### Phase 2: Cohere Embedding + pgvector

**Goal:** Store laptop data as vectors for semantic search.

**Prerequisites:**
- Get Cohere API key from https://dashboard.cohere.com/api-keys
- Enable pgvector extension in Supabase

**Files to modify:**
- `scraper/embeddings.py` (NEW) -- Cohere embedding client
- `supabase/migrations/003_pgvector.sql` (NEW) -- pgvector setup
- `scraper/db_sync.py` -- Add embedding generation during sync
- `web/src/lib/embeddings.ts` (NEW) -- Frontend vector search
- `web/src/lib/supabase.ts` -- Add vector search query

**Implementation steps:**

1. Create `supabase/migrations/003_pgvector.sql`:
   ```sql
   -- Enable pgvector extension
   CREATE EXTENSION IF NOT EXISTS vector;

   -- Add embedding column to laptops table
   ALTER TABLE laptops ADD COLUMN IF NOT EXISTS embedding vector(1024);

   -- Create index for fast similarity search (IVFFlat)
   CREATE INDEX IF NOT EXISTS laptops_embedding_idx 
   ON laptops USING ivfflat (embedding vector_cosine_ops)
   WITH (lists = 100);

   -- Function for similarity search
   CREATE OR REPLACE FUNCTION search_laptops_by_embedding(
       query_embedding vector(1024),
       match_count int DEFAULT 20,
       similarity_threshold float DEFAULT 0.7
   )
   RETURNS TABLE (
       id uuid,
       name text,
       brand text,
       price integer,
       specs jsonb,
       similarity float
   ) AS $$
   BEGIN
       RETURN QUERY
       SELECT 
           l.id,
           l.name,
           l.brand,
           l.price,
           l.specs,
           1 - (l.embedding <=> query_embedding) AS similarity
       FROM laptops l
       WHERE l.embedding IS NOT NULL
       ORDER BY l.embedding <=> query_embedding
       LIMIT match_count;
   END;
   $$ LANGUAGE plpgsql;
   ```

2. Create `scraper/embeddings.py`:
   ```python
   """
   Cohere Embedding Module for KulPik
   Generates embeddings for laptop data.
   """
   import cohere
   import os

   COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")
   co = cohere.Client(COHERE_API_KEY)

   def embed_text(texts: list[str]) -> list[list[float]]:
       """
       Generate embeddings for a list of texts.
       
       Args:
           texts: List of text strings to embed
       
       Returns:
           List of embedding vectors (1024 dimensions)
       """
       if not texts:
           return []
       
       response = co.embed(
           texts=texts,
           model="embed-v4.0",
           input_type="search_document",
           embedding_types=["float"],
       )
       return response.embeddings.float_

   def embed_laptop(laptop: dict) -> list[float]:
       """
       Generate embedding for a single laptop.
       Combines name, brand, specs into a single text for embedding.
       """
       text = format_laptop_for_embedding(laptop)
       embeddings = embed_text([text])
       return embeddings[0] if embeddings else []

   def format_laptop_for_embedding(laptop: dict) -> str:
       """Format laptop data into a searchable text string."""
       parts = []
       
       if laptop.get("name"):
           parts.append(f"Nama: {laptop['name']}")
       if laptop.get("brand"):
           parts.append(f"Brand: {laptop['brand']}")
       
       specs = laptop.get("specs", {})
       if isinstance(specs, dict):
           if specs.get("processor"):
               parts.append(f"Processor: {specs['processor']}")
           if specs.get("ram"):
               parts.append(f"RAM: {specs['ram']}")
           if specs.get("storage"):
               parts.append(f"Storage: {specs['storage']}")
           if specs.get("gpu"):
               parts.append(f"GPU: {specs['gpu']}")
           if specs.get("display"):
               parts.append(f"Display: {specs['display']}")
           if specs.get("battery"):
               parts.append(f"Battery: {specs['battery']}")
       
       if laptop.get("price"):
           parts.append(f"Harga: Rp {laptop['price']:,}")
       
       return " | ".join(parts)

   def embed_batch(laptops: list[dict], batch_size: int = 96) -> dict:
       """
       Embed a batch of laptops.
       
       Args:
           laptops: List of laptop dicts
           batch_size: Number of texts per API call (max 96 for Cohere)
       
       Returns:
           Dict mapping laptop index to embedding vector
       """
       embeddings = {}
       
       for i in range(0, len(laptops), batch_size):
           batch = laptops[i:i + batch_size]
           texts = [format_laptop_for_embedding(l) for l in batch]
           batch_embeddings = embed_text(texts)
           
           for j, emb in enumerate(batch_embeddings):
               embeddings[i + j] = emb
       
       return embeddings
   ```

3. Create `scraper/rerank.py`:
   ```python
   """
   Cohere Rerank Module for KulPik
   Reranks search results for better relevance.
   """
   import cohere
   import os

   COHERE_API_KEY = os.getenv("COHERE_API_KEY", "")
   co = cohere.Client(COHERE_API_KEY)

   def rerank_results(query: str, documents: list[dict], top_n: int = 5) -> list[dict]:
       """
       Rerank documents based on query relevance.
       
       Args:
           query: User query, e.g. "laptop untuk Teknik Informatika budget 10 juta"
           documents: List of dicts with at least 'name' and 'specs' keys
           top_n: Number of top results to return
       
       Returns:
           List of dicts sorted by relevance, with 'relevance_score' added
       """
       if not documents:
           return []
       
       # Format documents for reranking
       doc_texts = []
       for doc in documents:
           text = doc.get("name", "")
           specs = doc.get("specs", {})
           if isinstance(specs, dict):
               spec_parts = [f"{k}: {v}" for k, v in specs.items() if v]
               text += " " + " | ".join(spec_parts)
           if doc.get("price"):
               text += f" Harga: Rp {doc['price']:,}"
           doc_texts.append(text)
       
       response = co.rerank(
           query=query,
           documents=doc_texts,
           top_n=top_n,
           model="rerank-v3.5",
       )
       
       # Map results back to original documents
       reranked = []
       for result in response.results:
           doc = documents[result.index].copy()
           doc["relevance_score"] = result.relevance_score
           reranked.append(doc)
       
       return reranked
   ```

### Phase 3: NanoGPT Generation (Replace/Augment Gemini)

**Goal:** Use Qwen3-coder via NanoGPT for recommendation generation, keep Gemini as fallback.

**Files to modify:**
- `web/src/lib/recommend.ts` (or create) -- Generation logic
- `web/src/app/api/recommend/route.ts` -- API route for recommendations
- `web/.env.local` -- Add NanoGPT config

**Implementation steps:**

1. Create `web/src/lib/nanogpt.ts`:
   ```typescript
   /**
    * NanoGPT Client for KulPik
    * Uses OpenAI-compatible API with custom header for trial access.
    */

   const NANOGPT_API_KEY = process.env.NANOGPT_API_KEY || process.env.OPENAI_API_KEY || "";
   const NANOGPT_BASE_URL = "https://nano-gpt.com/api/v1";
   // Use subscription endpoint for trial tokens:
   // const NANOGPT_BASE_URL = "https://nano-gpt.com/api/subscription/v1";

   interface NanoGPTMessage {
     role: "system" | "user" | "assistant";
     content: string;
   }

   interface NanoGPTResponse {
     choices: Array<{
       message: {
         content: string;
       };
     }>;
     usage?: {
       prompt_tokens: number;
       completion_tokens: number;
       total_tokens: number;
     };
   }

   export async function generateRecommendation(
     userQuery: string,
     laptopContext: string,
     model: string = "zai-org/glm-5"
   ): Promise<string> {
     const messages: NanoGPTMessage[] = [
       {
         role: "system",
         content: `Kamu adalah KulPik, asisten rekomendasi laptop untuk mahasiswa Indonesia.

   Tugasmu:
   - Berikan 3 rekomendasi laptop berdasarkan data yang diberikan
   - Jelaskan alasan setiap rekomendasi (cocok untuk jurusan apa, kenapa)
   - Sertakan harga dan link beli jika ada
   - Gunakan bahasa Indonesia yang santai tapi informatif
   - Format output dengan numbering yang jelas

   Format output:
   1. [Nama Laptop]
      - Harga: Rp X.XXX.XXX
      - Keunggulan: ...
      - Cocok untuk: [jurusan/penggunaan]
      - Link: [url jika ada]
   
   2. [dst...]`,
       },
       {
         role: "user",
         content: `Data laptop yang tersedia:\n${laptopContext}\n\nPertanyaan user: ${userQuery}`,
       },
     ];

     const response = await fetch(`${NANOGPT_BASE_URL}/chat/completions`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
         "Authorization": `Bearer ${NANOGPT_API_KEY}`,
         "x-client": "goose", // REQUIRED for trial token access
       },
       body: JSON.stringify({
         model,
         messages,
         max_tokens: 2000,
         temperature: 0.7,
       }),
     });

     if (!response.ok) {
       const error = await response.text();
       throw new Error(`NanoGPT API error: ${response.status} - ${error}`);
     }

     const data: NanoGPTResponse = await response.json();
     return data.choices[0]?.message?.content || "Tidak dapat menghasilkan rekomendasi.";
   }
   ```

2. Create `web/src/app/api/recommend/route.ts`:
   ```typescript
   import { NextRequest, NextResponse } from "next/server";
   import { generateRecommendation } from "@/lib/nanogpt";
   import { createClient } from "@supabase/supabase-js";

   const supabase = createClient(
     process.env.SUPABASE_URL!,
     process.env.SUPABASE_SERVICE_KEY!
   );

   export async function POST(request: NextRequest) {
     try {
       const body = await request.json();
       const { query, jurusan, budget_min, budget_max } = body;

       // Step 1: Fetch relevant laptops from Supabase
       let dbQuery = supabase
         .from("laptops")
         .select("*")
         .gte("price", budget_min || 0)
         .lte("price", budget_max || 999999999)
         .order("price", { ascending: true })
         .limit(20);

       if (jurusan) {
         // If pgvector is available, use vector search
         // Otherwise fall back to keyword search
         dbQuery = dbQuery.ilike("name", `%${jurusan.split(" ")[0]}%`);
       }

       const { data: laptops, error } = await dbQuery;
       if (error) throw error;

       // Step 2: Format context for generation
       const laptopContext = (laptops || [])
         .map((l, i) => `${i + 1}. ${l.name} - Rp ${(l.price || 0).toLocaleString("id-ID")} - ${JSON.stringify(l.specs || {})}`)
         .join("\n");

       // Step 3: Generate recommendation
       const recommendation = await generateRecommendation(
         query || `Rekomendasi laptop untuk ${jurusan || "mahasiswa"} budget ${budget_max ? `Rp ${budget_max.toLocaleString("id-ID")}` : "flexible"}`,
         laptopContext
       );

       return NextResponse.json({
         success: true,
         recommendation,
         laptopCount: laptops?.length || 0,
       });
     } catch (error: any) {
       return NextResponse.json(
         { success: false, error: error.message },
         { status: 500 }
       );
     }
   }
   ```

3. Add to `web/.env.local`:
   ```
   NANOGPT_API_KEY=sk-nano-d808b205-0a62-4dd8-83ea-306188e7c392
   NANOGPT_BASE_URL=https://nano-gpt.com/api/v1
   COHERE_API_KEY=<get from dashboard.cohere.com>
   ```

### Phase 4: Integration & Testing

**Goal:** Wire everything together and test end-to-end.

**Steps:**
1. Run scraper with EXA: `python run.py --exa --no-sync`
2. Generate embeddings: `python -c "from embeddings import embed_batch; ..."`
3. Run pgvector migration in Supabase
4. Test recommendation API: `curl -X POST http://localhost:3000/api/recommend -H "Content-Type: application/json" -d '{"jurusan":"Teknik Informatika","budget_max":15000000}'`
5. Test frontend integration

---

## File Structure (New Files)

```
kulpik/
├── scraper/
│   ├── exa_search.py          # NEW: EXA search module
│   ├── embeddings.py          # NEW: Cohere embedding module
│   ├── rerank.py              # NEW: Cohere rerank module
│   ├── run.py                 # MODIFY: Add EXA + embed phases
│   ├── config.py              # MODIFY: Add EXA/COHERE config
│   └── requirements.txt       # MODIFY: Add exa-py, cohere
├── supabase/
│   └── migrations/
│       └── 003_pgvector.sql   # NEW: pgvector setup
├── web/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── nanogpt.ts     # NEW: NanoGPT client
│   │   │   └── embeddings.ts  # NEW: Vector search client
│   │   └── app/
│   │       └── api/
│   │           └── recommend/
│   │               └── route.ts # MODIFY: Use NanoGPT
│   └── .env.local             # MODIFY: Add new keys
└── docs/
    └── STACK_V2_MIGRATION.md  # THIS FILE
```

---

## Model Selection Guide (NanoGPT)

**For generation (this project):**
- `zai-org/glm-5` -- Best quality, fast, good reasoning
- `qwen3-coder-30b-a3b-instruct` -- Good for structured output

**Avoid:**
- Any model with `:thinking` suffix -- broken tool calling, XML format output
- `zai-org/glm-4.7-flash` -- lower quality than glm-5

---

## Testing Checklist

- [ ] EXA search returns relevant laptop results
- [ ] EXA search returns Indonesian marketplace results
- [ ] Cohere embedding generates 1024-dim vectors
- [ ] pgvector similarity search returns correct results
- [ ] Cohere rerank improves result relevance
- [ ] NanoGPT generates readable recommendation text
- [ ] NanoGPT `x-client: goose` header works (trial access)
- [ ] Fallback to Gemini works when NanoGPT fails
- [ ] End-to-end: query → EXA → embed → rerank → generate → output
- [ ] Price data from scraper matches EXA results
- [ ] Frontend displays recommendations correctly

---

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| NanoGPT 402 | Missing `x-client: goose` header | Add header to all API calls |
| NanoGPT 403 | Model not supported on Free Tier | Use different model |
| EXA 402 | Credit exhausted | Top up at dashboard.exa.ai |
| EXA rate limit | >10 QPS | Add retry with backoff |
| Cohere 429 | Rate limit exceeded | Batch requests, add delay |
| pgvector slow | Missing index | Run `CREATE INDEX ... ivfflat` |

---

## Cost Estimate (Monthly, 1000 users)

| Service | Cost | Notes |
|---------|------|-------|
| EXA Search | ~$21 | 3000 searches/month |
| Cohere Embed | $0 (trial) | 1000 embeds/month within free tier |
| Cohere Rerank | $0 (trial) | 3000 reranks/month within free tier |
| NanoGPT | $0 (trial) | 60M tokens, ~1% used |
| Supabase | $0 | Free tier 500MB |
| Vercel | $0 | Free tier |
| **Total** | **~$21/month** | After trial expires, ~$50-80/month |

---

## Timeline

| Phase | Task | Duration | Dependencies |
|-------|------|----------|-------------|
| Phase 1 | EXA integration | 1-2 days | EXA API key (done) |
| Phase 2 | Cohere + pgvector | 2-3 days | Cohere API key (need) |
| Phase 3 | NanoGPT generation | 1 day | NanoGPT key (done) |
| Phase 4 | Integration & testing | 1-2 days | All above |
| **Total** | | **5-8 days** | |

---

*Document created: 2026-04-16*
*Last updated: 2026-04-16*
*Target: Launch before Mei 2026 (peak demand mahasiswa baru)*
