import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { format, subDays } from 'date-fns';

export async function GET(request: NextRequest) {
  const supabase = await createAdminClient();

  const sevenDaysAgo = subDays(new Date(), 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount, created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .neq('payment_status', 'failed');

  // Group by date
  const map: Record<string, { revenue: number; orders: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = format(subDays(new Date(), i), 'dd MMM');
    map[d] = { revenue: 0, orders: 0 };
  }

  orders?.forEach((order) => {
    const d = format(new Date(order.created_at), 'dd MMM');
    if (map[d]) {
      map[d].revenue += order.total_amount;
      map[d].orders += 1;
    }
  });

  return NextResponse.json(
    Object.entries(map).map(([date, val]) => ({ date, ...val }))
  );
}
