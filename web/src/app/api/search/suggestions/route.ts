import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";

  if (q.length < 2) {
    return NextResponse.json({ success: true, suggestions: [] });
  }

  try {
    // Search laptop names
    const { data: laptops } = await supabase
      .from("laptops")
      .select("full_name,brand,cpu_model")
      .or(`full_name.ilike.%${q}%,brand.ilike.%${q}%,cpu_model.ilike.%${q}%`)
      .limit(10);

    const suggestions = [
      ...new Set([
        ...((laptops || []).map((l: any) => l.full_name).filter(Boolean)),
        ...((laptops || []).map((l: any) => l.brand).filter(Boolean)),
      ]),
    ].slice(0, 8);

    return NextResponse.json({ success: true, suggestions }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (e) {
    return NextResponse.json({ success: true, suggestions: [] });
  }
}
