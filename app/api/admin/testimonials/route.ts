import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('testimonials').select('*').order('sort_order').order('created_at', { ascending: false });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const supabase = await createAdminClient();
  const body = await request.json();
  const { data, error } = await supabase.from('testimonials').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
