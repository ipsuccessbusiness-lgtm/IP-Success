import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createAdminClient();
  const { data } = await supabase.from('settings').select('*').order('key');
  return NextResponse.json(data || []);
}
