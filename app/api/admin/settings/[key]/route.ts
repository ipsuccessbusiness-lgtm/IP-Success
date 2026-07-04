import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const supabase = await createAdminClient();
  const { value } = await request.json();

  const { data, error } = await supabase
    .from('settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
