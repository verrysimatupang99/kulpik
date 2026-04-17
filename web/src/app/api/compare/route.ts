import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const idsParam = sp.get("ids");
  const q = sp.get("q") || "";
  const limit = parseInt(sp.get("limit") || "24");

  // Mode 1: Fetch specific laptops by IDs for comparison
  if (idsParam) {
    const ids = idsParam.split(",").map((id) => id.trim()).filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json({ success: false, error: "No IDs provided" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("laptops")
      .select("id,full_name,brand,price_tokopedia,price_shopee,price_official,cpu_model,ram_gb,ram_type,storage_gb,storage_type,gpu_model,gpu_type,screen_inches,weight_kg,source_url")
      .in("id", ids);

    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    const laptops = (data || []).map((l) => ({
      id: l.id,
      name: l.full_name || "",
      brand: l.brand || "",
      price_tokopedia: l.price_tokopedia,
      price_shopee: l.price_shopee,
      price_official: l.price_official,
      best_price: l.price_tokopedia || l.price_shopee || l.price_official || 0,
      specs: {
        cpu: l.cpu_model || "-",
        ram: l.ram_gb ? `${l.ram_gb}GB${l.ram_type ? ` ${l.ram_type}` : ""}` : "-",
        storage: l.storage_gb ? `${l.storage_gb}GB${l.storage_type ? ` ${l.storage_type}` : ""}` : "-",
        gpu: l.gpu_model || "-",
        gpu_type: l.gpu_type || "-",
        screen: l.screen_inches ? `${l.screen_inches}"` : "-",
        weight: l.weight_kg ? `${l.weight_kg}kg` : "-",
      },
      source_url: l.source_url,
    }));

    return NextResponse.json({ success: true, laptops });
  }

  // Mode 2: Search laptops to add to comparison
  let qb = supabase
    .from("laptops")
    .select("id,full_name,brand,price_tokopedia,price_shopee,price_official,cpu_model,ram_gb,gpu_model,screen_inches")
    .gt("price_tokopedia", 0)
    .order("price_tokopedia", { ascending: true })
    .limit(limit);

  if (q) {
    const sanitized = q.replace(/[<>;&#|\\]/g, "").trim();
    qb = qb.or(`full_name.ilike.%${sanitized}%,brand.ilike.%${sanitized}%,cpu_model.ilike.%${sanitized}%,gpu_model.ilike.%${sanitized}%`);
  }

  const { data, error } = await qb;
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  const laptops = (data || []).map((l) => ({
    id: l.id,
    name: l.full_name || "",
    brand: l.brand || "",
    best_price: l.price_tokopedia || l.price_shopee || l.price_official || 0,
    snippet: `${l.cpu_model || "?"} · ${l.ram_gb || "?"}GB · ${l.gpu_model || "Integrated"}`,
  }));

  return NextResponse.json({ success: true, laptops });
}
