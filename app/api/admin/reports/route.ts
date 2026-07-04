import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { format, subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  const supabase = await createAdminClient();

  const startDate = subDays(new Date(), days);
  startDate.setHours(0, 0, 0, 0);

  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(name)')
    .gte('created_at', startDate.toISOString())
    .neq('payment_status', 'failed')
    .neq('order_status', 'cancelled');

  if (!orders) return NextResponse.json({ revenue: [], byPack: [], bySource: [], totalRevenue: 0, totalOrders: 0 });

  // Daily revenue
  const revenueMap: Record<string, number> = {};
  orders.forEach(o => {
    const d = format(new Date(o.created_at), 'dd MMM');
    revenueMap[d] = (revenueMap[d] || 0) + o.total_amount;
  });

  // By pack
  const packMap: Record<string, number> = {};
  orders.forEach(o => {
    const name = o.product?.name || 'Unknown';
    packMap[name] = (packMap[name] || 0) + 1;
  });

  // By source
  const sourceMap: Record<string, number> = {};
  orders.forEach(o => {
    sourceMap[o.source] = (sourceMap[o.source] || 0) + 1;
  });

  return NextResponse.json({
    revenue: Object.entries(revenueMap).map(([date, revenue]) => ({ date, revenue })),
    byPack: Object.entries(packMap).map(([name, value]) => ({ name, value })),
    bySource: Object.entries(sourceMap).map(([name, value]) => ({ name, value })),
    totalRevenue: orders.reduce((s, o) => s + o.total_amount, 0),
    totalOrders: orders.length,
  });
}
