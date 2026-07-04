import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // In production, fetch from Supabase settings table
  // For now, return default enabled state
  return NextResponse.json({ enabled: true });
}
