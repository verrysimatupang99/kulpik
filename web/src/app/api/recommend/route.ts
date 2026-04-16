import { NextRequest, NextResponse } from "next/server";
import { generateRecommendation } from "@/lib/gemini";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, jurusan, budget_min = 0, budget_max = 100_000_000, top_n = 20 } = body;

    // Fetch laptops from Supabase
    let qb = supabase
      .from("laptops")
      .select("id,full_name,brand,price_tokopedia,price_shopee,price_official,cpu_model,ram_gb,ram_type,storage_gb,storage_type,gpu_model,gpu_type,screen_inches,weight_kg,source_url")
      .or(`price_tokopedia.lte.${budget_max},price_shopee.lte.${budget_max},price_official.lte.${budget_max}`)
      .order("price_tokopedia", { ascending: true })
      .limit(top_n);

    if (query) qb = qb.or(`full_name.ilike.%${query}%,brand.ilike.%${query}%,cpu_model.ilike.%${query}%`);

    const { data, error } = await qb;
    if (error) return NextResponse.json({ success: false, error: error.message });

    const laptops = (data || []).map((l) => ({
      id: l.id,
      name: l.full_name || "",
      brand: l.brand || "",
      price: l.price_tokopedia || l.price_shopee || l.price_official || 0,
      specs: { cpu: l.cpu_model, ram: `${l.ram_gb}GB ${l.ram_type || ""}`, storage: `${l.storage_gb}GB ${l.storage_type || ""}`, gpu: l.gpu_model, screen: `${l.screen_inches}"`, weight: l.weight_kg ? `${l.weight_kg}kg` : null },
      source_url: l.source_url,
    }));

    if (!laptops.length) return NextResponse.json({ success: false, error: "No laptops found" });

    // Format for AI
    const ctx = laptops.map((l, i) =>
      `${i + 1}. ${l.name} (${l.brand}) - Rp ${(l.price || 0).toLocaleString("id-ID")}\n   Specs: ${Object.entries(l.specs).filter(([_, v]) => v).map(([k, v]) => `${k}: ${v}`).join(", ")}`
    ).join("\n\n");

    const fullQuery = [jurusan ? `Laptop untuk mahasiswa ${jurusan}` : "", query || "", `Budget ${Math.round(budget_max / 1_000_000)} juta`].filter(Boolean).join(". ");

    let recommendation: string;
    try {
      recommendation = await generateRecommendation(fullQuery, ctx);
    } catch (e) {
      return NextResponse.json({ success: true, recommendation: null, error: String(e), laptops: laptops.slice(0, 5) });
    }

    return NextResponse.json({ success: true, recommendation, laptops: laptops.slice(0, 5), laptopCount: laptops.length });
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
  if (q) qb = qb.or(`full_name.ilike.%${q}%,brand.ilike.%${q}%,cpu_model.ilike.%${q}%,gpu_model.ilike.%${q}%`);

  const { data, error } = await qb;
  if (error) return NextResponse.json({ success: false, error: error.message });

  return NextResponse.json({ success: true, laptops: data || [], laptopCount: data?.length || 0 });
}
