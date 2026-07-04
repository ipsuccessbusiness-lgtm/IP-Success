import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('inventory')
    .select('*, product:products(name)')
    .order('product_id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
