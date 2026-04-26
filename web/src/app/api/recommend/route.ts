import { NextRequest, NextResponse } from "next/server";
import { generateRecommendation } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";

function sanitizeInput(str: string): string {
  return str.replace(/[<>;&#|\\]/g, "").trim();
}

// Vector search implementation for semantic search
async function vectorSearch(query: string, budgetMax: number, top_n: number) {
  try {
    // Create temporary client for vector search
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseVector = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if pgvector is available
    const { data: vectorStatus, error: statusError } = await supabaseVector.rpc("count_laptops_with_embeddings");
    
    if (statusError || !vectorStatus || (vectorStatus[0]?.with_embeddings || 0) < 10) {
      // pgvector not ready, fallback to keyword search
      return null;
    }

    // Generate query embedding using Cohere
    const cohereKey = process.env.COHERE_API_KEY;
    if (!cohereKey) return null;

    const cohereUrl = "https://api.cohere.ai/v1/embed";
    const cohereResponse = await fetch(cohereUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${cohereKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texts: [query],
        model: "embed-v4.0",
        input_type: "search_query",
        embedding_types: ["float"],
      }),
    });

    if (!cohereResponse.ok) return null;

    const cohereData = await cohereResponse.json();
    const queryEmbedding = cohereData.embeddings?.float_[0];

    if (!queryEmbedding) return null;

    // Search using vector similarity
    // Note: RPC calls don't support chained filter methods like .eq(), .lte(), .or(), .order()
    // Filtering must be done in the SQL function or in post-processing
    const { data: vectorResults, error: vectorError } = await supabaseVector.rpc(
      "search_laptops_by_embedding",
      {
        query_embedding: queryEmbedding,
        match_count: top_n,
        similarity_threshold: 0.6,
      }
    );

    if (vectorError || !vectorResults) return null;

    // Post-process results
    const laptops = vectorResults.map((l: any) => ({
      id: l.id,
      name: l.name || "",
      brand: l.brand || "",
      price: l.price || 0,
      specs: {
        cpu: l.specs?.cpu_model || "",
        ram: l.specs?.ram_gb ? `${l.specs.ram_gb}GB` : "",
        storage: l.specs?.storage_gb ? `${l.specs.storage_gb}GB` : "",
        gpu: l.specs?.gpu_model || "",
        screen: l.specs?.screen_inches ? `${l.specs.screen_inches}"` : "",
        weight: l.specs?.weight_kg ? `${l.specs.weight_kg}kg` : "",
      },
      source_url: "", // Not returned in vector search results
      similarity: l.similarity || 0,
    }));

    // Filter and sort by vector similarity
    return laptops.filter((l: any) => l.price > 0).slice(0, top_n);
  } catch (e) {
    // Vector search failed silently
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, jurusan, budget_min = 0, budget_max = 100_000_000, top_n = 20 } = body;

    // Try vector search first (if embeddings available)
    let laptops: any[] = [];
    const vectorResults = await vectorSearch(query || "", budget_max, top_n * 2);
    
    if (vectorResults && vectorResults.length > 0) {
      // Use vector search results, but limit by budget
      laptops = vectorResults.slice(0, top_n);
    } else {
      // Fallback to keyword search
      let qb = supabase
        .from("laptops")
        .select("id,full_name,brand,price_tokopedia,price_shopee,price_official,cpu_model,ram_gb,ram_type,storage_gb,storage_type,gpu_model,gpu_type,screen_inches,weight_kg,source_url")
        .or(`price_tokopedia.lte.${budget_max},price_shopee.lte.${budget_max},price_official.lte.${budget_max}`)
        .order("price_tokopedia", { ascending: true })
        .limit(top_n);

      if (query) qb = qb.or(`full_name.ilike.%${sanitizeInput(query)}%,brand.ilike.%${sanitizeInput(query)}%,cpu_model.ilike.%${sanitizeInput(query)}%`);

      const { data, error } = await qb;
      if (error) return NextResponse.json({ success: false, error: error.message });

      laptops = (data || []).map((l) => ({
        id: l.id,
        name: l.full_name || "",
        brand: l.brand || "",
        price: l.price_tokopedia || l.price_shopee || l.price_official || 0,
        specs: { cpu: l.cpu_model, ram: `${l.ram_gb}GB ${l.ram_type || ""}`, storage: `${l.storage_gb}GB ${l.storage_type || ""}`, gpu: l.gpu_model, screen: `${l.screen_inches}"`, weight: l.weight_kg ? `${l.weight_kg}kg` : null },
        source_url: l.source_url,
      }));
    }

    if (!laptops.length) return NextResponse.json({ success: false, error: "No laptops found" });

    // Format for AI
    const ctx = laptops.map((l, i) =>
      `${i + 1}. ${l.name} (${l.brand}) - Rp ${(l.price || 0).toLocaleString("id-ID")}\n   Specs: ${Object.entries(l.specs).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(", ")}`
    ).join("\n\n");

    const fullQuery = [jurusan ? `Laptop untuk mahasiswa ${jurusan}` : "", query ? sanitizeInput(query) : "", `Budget ${Math.round(budget_max / 1_000_000)} juta`].filter(Boolean).join(". ");

    let recommendation: string;
    try {
      recommendation = await generateRecommendation(fullQuery, ctx);
    } catch (e) {
      return NextResponse.json({ success: true, recommendation: null, error: String(e), laptops: laptops.slice(0, 5) });
    }

    return NextResponse.json({ 
      success: true, 
      recommendation, 
      laptops: laptops.slice(0, 5), 
      laptopCount: laptops.length,
      searchMethod: vectorResults ? "vector" : "keyword"
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get("q") || "";
  const brand = sp.get("brand") || "";
  const budgetMin = parseInt(sp.get("budget_min") || "0");
  const budgetMax = parseInt(sp.get("budget_max") || "100000000");
  const limit = parseInt(sp.get("limit") || "24");

  let qb = supabase
    .from("laptops")
    .select("id,full_name,brand,price_tokopedia,price_shopee,price_official,cpu_model,ram_gb,ram_type,storage_gb,storage_type,gpu_model,gpu_type,screen_inches,weight_kg,source_url")
    .gte("price_tokopedia", budgetMin)
    .lte("price_tokopedia", budgetMax)
    .order("price_tokopedia", { ascending: true })
    .limit(limit);

  if (brand) qb = qb.eq("brand", brand);
  if (q) qb = qb.or(`full_name.ilike.%${sanitizeInput(q)}%,brand.ilike.%${sanitizeInput(q)}%,cpu_model.ilike.%${sanitizeInput(q)}%,gpu_model.ilike.%${sanitizeInput(q)}%`);

  const { data, error } = await qb;
  if (error) return NextResponse.json({ success: false, error: error.message });

  return NextResponse.json({ success: true, laptops: data || [], laptopCount: data?.length || 0 });
}
