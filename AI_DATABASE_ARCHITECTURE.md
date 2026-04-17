# KulPik AI-Database Integration Architecture
> Vision: Auto-populating database + Multi-provider AI integration

## Arsitektur Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│                     (Next.js Frontend)                          │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AI ORCHESTRATOR                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Puter   │ │ AI Studio│ │ OpenRouter│ │ Claude   │  ...     │
│  │  GPT-5   │ │ Gemini   │ │ 200+     │ │ Opus 4.5 │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │            │            │            │                  │
│       └────────────┴─────┬──────┴────────────┘                  │
│                          │                                      │
│                          ▼                                      │
│              ┌───────────────────────┐                          │
│              │   Query Builder       │                          │
│              │   - Parse intent      │                          │
│              │   - Build SQL query   │                          │
│              │   - Format context    │                          │
│              └───────────┬───────────┘                          │
└──────────────────────────┼──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SUPABASE DATABASE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   laptops    │  │   jurusan    │  │ price_history│          │
│  │  54+ items   │  │   22 items   │  │  historical  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  embeddings  │  │   reviews    │  │  jurusan_req │          │
│  │  (pgvector)  │  │  user feeds  │  │  per semester│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                           ▲
                           │
┌──────────────────────────┼──────────────────────────────────────┐
│                     AUTO-CURATION                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  EXA Search  │  │   Scraping   │  │  Enrichment  │          │
│  │  laptop data │  │  prices      │  │  embeddings  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                          │                                      │
│                    ┌─────┴─────┐                                │
│                    │   Cron    │                                │
│                    │  Daily    │                                │
│                    └───────────┘                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Komponen 1: Auto-Populating Database

### Current State:
- ✅ Auto-curation via EXA API (`auto_curation.py`)
- ✅ Manual curator (`manual_curator.py`)
- ✅ Cron job di GitHub Actions

### Enhancement Needed:

#### A. Multi-Source Data Collection
```
Sources:
1. EXA API (existing) - laptop specs & reviews
2. Tokopedia scraping - prices (via API or scraping)
3. Shopee scraping - prices
4. Bhinneka scraping - prices
5. Pricebook scraping - specs comparison
6. Official brand sites - specs & images
```

#### B. Auto-Curation Pipeline
```python
# Enhanced auto_curation.py
class AutoCurationPipeline:
    def run_daily(self):
        # 1. Search for new laptops
        new_laptops = self.search_exa("laptop mahasiswa 2026")
        
        # 2. Enrich with prices
        for laptop in new_laptops:
            laptop.tokopedia_price = self.scrape_tokopedia(laptop.name)
            laptop.shopee_price = self.scrape_shopee(laptop.name)
        
        # 3. Generate embeddings
        for laptop in new_laptops:
            laptop.embedding = self.generate_embedding(laptop)
        
        # 4. Upsert to database
        self.supabase.upsert("laptops", new_laptops)
        
        # 5. Update price history
        self.update_price_history()
        
        # 6. Generate reports
        self.generate_daily_report()
```

#### C. Cron Schedule
```yaml
# .github/workflows/auto-curation.yml
schedule:
  - cron: '0 6 * * *'  # Daily at 6 AM WIB
  - cron: '0 18 * * *' # Daily at 6 PM WIB (price update)
```

---

## Komponen 2: Multi-Provider AI Integration

### AI Provider Interface

```typescript
// src/lib/ai-providers/base.ts
interface AIProvider {
  name: string;
  chat(prompt: string, options?: ChatOptions): Promise<string>;
  streamChat(prompt: string, options?: ChatOptions): AsyncGenerator<string>;
  isAvailable(): Promise<boolean>;
  getModels(): Promise<Model[]>;
}

interface ChatOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

interface Model {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  maxOutput: number;
}
```

### Provider Implementations

#### 1. Puter.js (Client-side)
```typescript
// src/lib/ai-providers/puter.ts
class PuterProvider implements AIProvider {
  name = "puter";
  
  async chat(prompt: string, options?: ChatOptions): Promise<string> {
    const puter = window.puter;
    const response = await puter.ai.chat(prompt, {
      model: options?.model || "gpt-5-nano",
      stream: false,
    });
    return response.message?.content || response;
  }
  
  // ... streamChat, isAvailable, getModels
}
```

#### 2. OpenAI-Compatible (Server-side)
```typescript
// src/lib/ai-providers/openai-compat.ts
// Works with: OpenAI, AI Studio, ModelStudio, OpenRouter, etc.
class OpenAICompatProvider implements AIProvider {
  constructor(
    private apiKey: string,
    private baseUrl: string,
    private name: string
  ) {}
  
  async chat(prompt: string, options?: ChatOptions): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options?.model || "gpt-4o-mini",
        messages: [
          { role: "system", content: options?.systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: options?.maxTokens,
        temperature: options?.temperature,
      }),
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  }
}
```

#### 3. Claude (Anthropic)
```typescript
// src/lib/ai-providers/claude.ts
class ClaudeProvider implements AIProvider {
  name = "claude";
  
  async chat(prompt: string, options?: ChatOptions): Promise<string> {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: options?.model || "claude-sonnet-4-20250514",
        max_tokens: options?.maxTokens || 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    
    const data = await response.json();
    return data.content[0].text;
  }
}
```

### AI Orchestrator

```typescript
// src/lib/ai-orchestrator.ts
class AIOrchestrator {
  private providers: Map<string, AIProvider> = new Map();
  
  registerProvider(provider: AIProvider) {
    this.providers.set(provider.name, provider);
  }
  
  async chat(
    prompt: string,
    preferredProvider?: string,
    options?: ChatOptions
  ): Promise<string> {
    // Try preferred provider first
    if (preferredProvider) {
      const provider = this.providers.get(preferredProvider);
      if (provider && await provider.isAvailable()) {
        return provider.chat(prompt, options);
      }
    }
    
    // Fallback chain
    const fallbackOrder = ["puter", "openrouter", "modelstudio", "claude", "openai"];
    for (const name of fallbackOrder) {
      const provider = this.providers.get(name);
      if (provider && await provider.isAvailable()) {
        return provider.chat(prompt, options);
      }
    }
    
    throw new Error("No AI provider available");
  }
  
  async chatWithContext(
    userQuery: string,
    context: LaptopContext,
    provider?: string
  ): Promise<string> {
    const systemPrompt = this.buildSystemPrompt(context);
    const fullPrompt = this.buildUserPrompt(userQuery, context);
    
    return this.chat(fullPrompt, provider, { systemPrompt });
  }
  
  private buildSystemPrompt(context: LaptopContext): string {
    return `Kamu adalah asisten rekomendasi laptop untuk mahasiswa Indonesia.
    
Database KulPik berisi ${context.totalLaptops} laptop dari ${context.totalBrands} brand.
Harga range: Rp ${context.priceMin.toLocaleString()} - Rp ${context.priceMax.toLocaleString()}.

Berikan rekomendasi berdasarkan data yang ada di database.`;
  }
  
  private buildUserPrompt(query: string, context: LaptopContext): string {
    const relevantLaptops = context.relevantLaptops
      .map(l => `- ${l.full_name} (${l.brand}) - Rp ${l.price.toLocaleString()} | ${l.specs}`)
      .join("\n");
    
    return `User bertanya: "${query}"

Laptop yang relevan dari database:
${relevantLaptops}

Berikan rekomendasi yang sesuai dengan format:
1. Nama laptop
2. Alasan cocok
3. Harga
4. Spesifikasi penting`;
  }
}
```

### Database Query Builder

```typescript
// src/lib/db-query-builder.ts
class DBQueryBuilder {
  constructor(private supabase: SupabaseClient) {}
  
  async getRelevantLaptops(query: string): Promise<Laptop[]> {
    // 1. Try vector search first
    const embedding = await this.generateEmbedding(query);
    const vectorResults = await this.vectorSearch(embedding);
    
    if (vectorResults.length > 0) {
      return vectorResults;
    }
    
    // 2. Fallback to keyword search
    return this.keywordSearch(query);
  }
  
  async getLaptopsByJurusan(jurusan: string): Promise<Laptop[]> {
    const { data } = await this.supabase
      .from("laptops")
      .select("*")
      .gte("ram_gb", this.getMinRam(jurusan))
      .order("price_tokopedia", { ascending: true })
      .limit(20);
    
    return data || [];
  }
  
  async getLaptopsByBudget(min: number, max: number): Promise<Laptop[]> {
    const { data } = await this.supabase
      .from("laptops")
      .select("*")
      .gte("price_tokopedia", min)
      .lte("price_tokopedia", max)
      .order("price_tokopedia", { ascending: true })
      .limit(20);
    
    return data || [];
  }
  
  async getStats(): Promise<DatabaseStats> {
    // Return total counts, price ranges, popular brands, etc.
  }
}
```

---

## Komponen 3: API Endpoints

### New Unified Chat Endpoint

```typescript
// src/app/api/ai/chat/route.ts
export async function POST(request: NextRequest) {
  const { query, provider, model, options } = await request.json();
  
  // 1. Query database for relevant laptops
  const dbBuilder = new DBQueryBuilder(supabase);
  const relevantLaptops = await dbBuilder.getRelevantLaptops(query);
  
  // 2. Build context
  const context: LaptopContext = {
    totalLaptops: await dbBuilder.getLaptopCount(),
    totalBrands: await dbBuilder.getBrandCount(),
    priceMin: await dbBuilder.getMinPrice(),
    priceMax: await dbBuilder.getMaxPrice(),
    relevantLaptops,
  };
  
  // 3. Call AI provider
  const orchestrator = new AIOrchestrator();
  const response = await orchestrator.chatWithContext(query, context, provider);
  
  return NextResponse.json({
    success: true,
    recommendation: response,
    laptops: relevantLaptops.slice(0, 5),
    provider: provider || "auto",
  });
}
```

### Provider Status Endpoint

```typescript
// src/app/api/ai/providers/route.ts
export async function GET() {
  const orchestrator = new AIOrchestrator();
  const providers = await orchestrator.getAvailableProviders();
  
  return NextResponse.json({
    success: true,
    providers,
  });
}
```

---

## Komponen 4: Configuration

### Environment Variables

```env
# AI Providers (Server-side)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AI...
OPENROUTER_API_KEY=sk-or-...
MODELSTUDIO_API_KEY=sk-...

# AI Provider Endpoints
OPENAI_BASE_URL=https://api.openai.com/v1
ANTHROPIC_BASE_URL=https://api.anthropic.com
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
MODELSTUDIO_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1

# Auto-curation
EXA_API_KEY=...
COHERE_API_KEY=...

# Database
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Provider Config

```typescript
// src/lib/ai-config.ts
export const AI_PROVIDERS = {
  puter: {
    name: "Puter.js",
    type: "client",
    models: ["gpt-5-nano", "gpt-4o", "claude-sonnet-4", "gemini-2.0-flash"],
    default: "gpt-5-nano",
  },
  openai: {
    name: "OpenAI",
    type: "server",
    baseUrl: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
    models: ["gpt-4o", "gpt-4o-mini", "gpt-5"],
    default: "gpt-4o-mini",
  },
  claude: {
    name: "Claude",
    type: "server",
    baseUrl: process.env.ANTHROPIC_BASE_URL,
    apiKey: process.env.ANTHROPIC_API_KEY,
    models: ["claude-opus-4-5", "claude-sonnet-4", "claude-haiku"],
    default: "claude-sonnet-4",
  },
  openrouter: {
    name: "OpenRouter",
    type: "server",
    baseUrl: process.env.OPENROUTER_BASE_URL,
    apiKey: process.env.OPENROUTER_API_KEY,
    models: ["auto"], // 200+ models available
    default: "auto",
  },
  modelstudio: {
    name: "ModelStudio (Alibaba)",
    type: "server",
    baseUrl: process.env.MODELSTUDIO_BASE_URL,
    apiKey: process.env.MODELSTUDIO_API_KEY,
    models: ["qwen-max", "qwen-plus", "qwen-turbo"],
    default: "qwen-plus",
  },
};
```

---

## Implementation Plan

### Phase 1: Auto-Database (Week 1)
1. Enhanced auto-curation with multi-source
2. Price scraping pipeline
3. Cron job optimization
4. Data validation & dedup

### Phase 2: AI Provider Interface (Week 2)
1. Base provider interface
2. Puter.js provider (existing)
3. OpenAI-compatible provider
4. Claude provider
5. Orchestrator with fallback

### Phase 3: Integration (Week 3)
1. Unified chat endpoint
2. Database query builder
3. Context-aware prompts
4. Provider selection UI

### Phase 4: Polish (Week 4)
1. Provider status dashboard
2. Usage tracking
3. Error handling
4. Documentation

---

## Keuntungan Arsitektur Ini

### Untuk Developer:
- ✅ Tidak perlu bayar API key untuk setiap provider
- ✅ Database auto-populated
- ✅ Fallback chain untuk reliability

### Untuk User:
- ✅ Pilih AI provider sesuai preference
- ✅ Puter.js gratis (user-pays)
- ✅ Data real dari Indonesia

### Untuk Bisnis:
- ✅ Scalable - tambah provider baru mudah
- ✅ Data-driven - semua rekomendasi dari database
- ✅ Cost-efficient - Puter.js sebagai primary
