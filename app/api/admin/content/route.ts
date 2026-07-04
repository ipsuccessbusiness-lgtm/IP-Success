import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from('site_content').select('*').order('key');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
