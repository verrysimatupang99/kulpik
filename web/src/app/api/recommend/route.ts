import { NextRequest } from 'next/server';
import { generateRecommendation } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import {
  ApiError,
  jsonError,
  jsonSuccess,
  parseBudgetRange,
  parseInteger,
  readJsonBody,
  sanitizeText,
} from '@/lib/api';

type LaptopRecommendation = {
  id: string | number;
  name: string;
  brand: string;
  price: number;
  specs: {
    cpu?: string | null;
    ram?: string | null;
    storage?: string | null;
    gpu?: string | null;
    screen?: string | null;
    weight?: string | null;
  };
  source_url?: string | null;
  similarity?: number;
};

type RecommendPostBody = {
  query?: unknown;
  jurusan?: unknown;
  budget_min?: unknown;
  budget_max?: unknown;
  budgetMin?: unknown;
  budgetMax?: unknown;
  top_n?: unknown;
  topN?: unknown;
};

function compactSpecEntries(specs: LaptopRecommendation['specs']): string {
  return Object.entries(specs)
    .filter(
      ([, value]) =>
        value !== undefined && value !== null && String(value).trim() !== '',
    )
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

function formatRupiah(value: number): string {
  return `Rp ${Math.max(0, value || 0).toLocaleString('id-ID')}`;
}

function normalizeLaptopFromRow(row: any): LaptopRecommendation {
  const price =
    row.price_tokopedia ||
    row.price_shopee ||
    row.price_official ||
    row.price ||
    0;

  return {
    id: row.id,
    name: row.full_name || row.name || '',
    brand: row.brand || '',
    price,
    specs: {
      cpu: row.cpu_model || row.specs?.cpu_model || row.specs?.cpu || null,
      ram:
        row.ram_gb || row.specs?.ram_gb
          ? `${row.ram_gb || row.specs?.ram_gb}GB ${row.ram_type || row.specs?.ram_type || ''}`.trim()
          : row.specs?.ram || null,
      storage:
        row.storage_gb || row.specs?.storage_gb
          ? `${row.storage_gb || row.specs?.storage_gb}GB ${row.storage_type || row.specs?.storage_type || ''}`.trim()
          : row.specs?.storage || null,
      gpu: row.gpu_model || row.specs?.gpu_model || row.specs?.gpu || null,
      screen:
        row.screen_inches || row.specs?.screen_inches
          ? `${row.screen_inches || row.specs?.screen_inches}"`
          : row.specs?.screen || null,
      weight:
        row.weight_kg || row.specs?.weight_kg
          ? `${row.weight_kg || row.specs?.weight_kg}kg`
          : row.specs?.weight || null,
    },
    source_url: row.source_url || null,
    similarity: row.similarity,
  };
}

async function vectorSearch(
  query: string,
  options: {
    budgetMin: number;
    budgetMax: number;
    topN: number;
  },
): Promise<LaptopRecommendation[] | null> {
  try {
    const { createClient } = await import('@supabase/supabase-js');

    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const cohereKey = process.env.COHERE_API_KEY;

    if (!supabaseUrl || !supabaseServiceKey || !cohereKey || !query) {
      return null;
    }

    const supabaseVector = createClient(supabaseUrl, supabaseServiceKey);

    const { data: vectorStatus, error: statusError } = await supabaseVector.rpc(
      'count_laptops_with_embeddings',
    );

    const embeddingCount = Array.isArray(vectorStatus)
      ? vectorStatus[0]?.with_embeddings || 0
      : vectorStatus?.with_embeddings || 0;

    if (statusError || embeddingCount < 10) {
      return null;
    }

    const cohereResponse = await fetch('https://api.cohere.ai/v1/embed', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cohereKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: [query],
        model: 'embed-v4.0',
        input_type: 'search_query',
        embedding_types: ['float'],
      }),
    });

    if (!cohereResponse.ok) {
      return null;
    }

    const cohereData = await cohereResponse.json();
    const queryEmbedding = cohereData.embeddings?.float_?.[0];

    if (!queryEmbedding) {
      return null;
    }

    const { data: vectorResults, error: vectorError } =
      await supabaseVector.rpc('search_laptops_by_embedding', {
        query_embedding: queryEmbedding,
        match_count: Math.min(options.topN * 3, 60),
        similarity_threshold: 0.6,
      });

    if (vectorError || !vectorResults) {
      return null;
    }

    return vectorResults
      .map(normalizeLaptopFromRow)
      .filter((laptop: LaptopRecommendation) => {
        if (!laptop.price) return false;
        return (
          laptop.price >= options.budgetMin && laptop.price <= options.budgetMax
        );
      })
      .slice(0, options.topN);
  } catch {
    return null;
  }
}

async function keywordSearch(options: {
  query: string;
  budgetMin: number;
  budgetMax: number;
  topN: number;
}): Promise<LaptopRecommendation[]> {
  let qb = supabase
    .from('laptops')
    .select(
      'id,full_name,brand,price_tokopedia,price_shopee,price_official,cpu_model,ram_gb,ram_type,storage_gb,storage_type,gpu_model,gpu_type,screen_inches,weight_kg,source_url',
    )
    .or(
      `and(price_tokopedia.gte.${options.budgetMin},price_tokopedia.lte.${options.budgetMax}),and(price_shopee.gte.${options.budgetMin},price_shopee.lte.${options.budgetMax}),and(price_official.gte.${options.budgetMin},price_official.lte.${options.budgetMax})`,
    )
    .order('price_tokopedia', { ascending: true })
    .limit(options.topN);

  if (options.query) {
    const q = sanitizeText(options.query, 120);
    qb = qb.or(
      `full_name.ilike.%${q}%,brand.ilike.%${q}%,cpu_model.ilike.%${q}%,gpu_model.ilike.%${q}%`,
    );
  }

  const { data, error } = await qb;

  if (error) {
    throw new ApiError('Gagal mengambil data laptop dari database.', {
      status: 502,
      code: 'DATABASE_QUERY_FAILED',
      details: error.message,
    });
  }

  return (data || [])
    .map(normalizeLaptopFromRow)
    .filter((laptop) => laptop.price > 0);
}

function buildLaptopContext(laptops: LaptopRecommendation[]): string {
  return laptops
    .map((laptop, index) => {
      const specs = compactSpecEntries(laptop.specs);

      return `${index + 1}. ${laptop.name} (${laptop.brand}) - ${formatRupiah(laptop.price)}
   Specs: ${specs || 'Spesifikasi belum lengkap'}
   Source: ${laptop.source_url || 'Tidak tersedia'}`;
    })
    .join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJsonBody<RecommendPostBody>(request);

    const query = sanitizeText(body.query, 300);
    const jurusan = sanitizeText(body.jurusan, 120);
    const { budgetMin, budgetMax } = parseBudgetRange(body);
    const topN = parseInteger(body.top_n ?? body.topN, {
      defaultValue: 20,
      min: 3,
      max: 50,
    });

    if (!query && !jurusan) {
      throw new ApiError('Isi query atau jurusan terlebih dahulu.', {
        status: 400,
        code: 'QUERY_REQUIRED',
      });
    }

    const searchQuery = [
      jurusan ? `laptop untuk mahasiswa ${jurusan}` : '',
      query,
    ]
      .filter(Boolean)
      .join('. ');

    const vectorResults = await vectorSearch(searchQuery, {
      budgetMin,
      budgetMax,
      topN,
    });

    const laptops =
      vectorResults && vectorResults.length > 0
        ? vectorResults
        : await keywordSearch({
            query: searchQuery,
            budgetMin,
            budgetMax,
            topN,
          });

    if (!laptops.length) {
      throw new ApiError(
        'Belum ada laptop yang cocok untuk kriteria ini. Coba ubah budget atau kata kunci pencarian.',
        {
          status: 404,
          code: 'NO_LAPTOPS_FOUND',
          details: { query, jurusan, budgetMin, budgetMax },
        },
      );
    }

    const laptopContext = buildLaptopContext(laptops);
    const fullQuery = [
      jurusan ? `Laptop untuk mahasiswa ${jurusan}` : '',
      query,
      `Budget ${formatRupiah(budgetMin)} sampai ${formatRupiah(budgetMax)}`,
    ]
      .filter(Boolean)
      .join('. ');

    let recommendation: string | null = null;
    let aiError: string | null = null;

    try {
      recommendation = await generateRecommendation(fullQuery, laptopContext);
    } catch (error) {
      aiError = error instanceof Error ? error.message : String(error);
    }

    return jsonSuccess(
      {
        recommendation,
        laptops: laptops.slice(0, 5),
        laptopCount: laptops.length,
        searchMethod:
          vectorResults && vectorResults.length > 0 ? 'vector' : 'keyword',
        aiAvailable: Boolean(recommendation),
        aiError,
      },
      {
        legacyFields: true,
        meta: {
          laptopCount: laptops.length,
          searchMethod:
            vectorResults && vectorResults.length > 0 ? 'vector' : 'keyword',
          budgetMin,
          budgetMax,
          topN,
        },
        headers: {
          'X-KulPik-Laptop-Count': String(laptops.length),
          'X-KulPik-Search-Method':
            vectorResults && vectorResults.length > 0 ? 'vector' : 'keyword',
        },
      },
    );
  } catch (error) {
    return jsonError(error, {
      fallbackMessage: 'Gagal membuat rekomendasi laptop.',
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const query = sanitizeText(searchParams.get('q'), 120);
    const brand = sanitizeText(searchParams.get('brand'), 80);
    const { budgetMin, budgetMax } = parseBudgetRange({
      budget_min: searchParams.get('budget_min'),
      budget_max: searchParams.get('budget_max'),
    });
    const limit = parseInteger(searchParams.get('limit'), {
      defaultValue: 24,
      min: 1,
      max: 100,
    });

    let qb = supabase
      .from('laptops')
      .select(
        'id,full_name,brand,price_tokopedia,price_shopee,price_official,cpu_model,ram_gb,ram_type,storage_gb,storage_type,gpu_model,gpu_type,screen_inches,weight_kg,source_url',
      )
      .or(
        `and(price_tokopedia.gte.${budgetMin},price_tokopedia.lte.${budgetMax}),and(price_shopee.gte.${budgetMin},price_shopee.lte.${budgetMax}),and(price_official.gte.${budgetMin},price_official.lte.${budgetMax})`,
      )
      .order('price_tokopedia', { ascending: true })
      .limit(limit);

    if (brand) {
      qb = qb.eq('brand', brand);
    }

    if (query) {
      qb = qb.or(
        `full_name.ilike.%${query}%,brand.ilike.%${query}%,cpu_model.ilike.%${query}%,gpu_model.ilike.%${query}%`,
      );
    }

    const { data, error } = await qb;

    if (error) {
      throw new ApiError('Gagal mengambil data laptop.', {
        status: 502,
        code: 'DATABASE_QUERY_FAILED',
        details: error.message,
      });
    }

    const laptops = (data || []).map(normalizeLaptopFromRow);

    return jsonSuccess(
      {
        laptops,
        laptopCount: laptops.length,
      },
      {
        legacyFields: true,
        meta: {
          laptopCount: laptops.length,
          budgetMin,
          budgetMax,
          limit,
        },
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
        },
      },
    );
  } catch (error) {
    return jsonError(error, {
      fallbackMessage: 'Gagal mengambil rekomendasi laptop.',
    });
  }
}
