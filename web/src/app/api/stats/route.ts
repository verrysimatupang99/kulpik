import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch total laptops
    const { count: laptopCount, error: laptopError } = await supabase
      .from('laptops')
      .select('*', { count: 'exact', head: true });

    if (laptopError) throw laptopError;

    // Fetch distinct brands count
    // Note: Supabase doesn't have a simple "select distinct count" via JS client easily
    // So we fetch all brands and unique them, or just use a default if it's too many
    const { data: brandsData, error: brandsError } = await supabase
      .from('laptops')
      .select('brand');
    
    if (brandsError) throw brandsError;
    const uniqueBrands = new Set(brandsData?.map(l => l.brand)).size;

    // Fetch total jurusan
    const { count: jurusanCount, error: jurusanError } = await supabase
      .from('jurusan')
      .select('*', { count: 'exact', head: true });

    if (jurusanError) throw jurusanError;

    const realStats = {
      success: true,
      total_laptops: laptopCount || 0,
      total_brands: uniqueBrands || 0,
      total_jurusan: jurusanCount || 0,
      last_updated: new Date().toISOString()
    };

    return NextResponse.json(realStats);
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch stats',
        total_laptops: 0,
        total_brands: 0,
        total_jurusan: 0
      },
      { status: 500 }
    );
  }
}