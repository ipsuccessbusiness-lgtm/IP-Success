import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { subDays } from 'date-fns';
import { formatPrice, formatDateTime } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  const supabase = await createAdminClient();

  const startDate = subDays(new Date(), days);

  const { data: orders } = await supabase
    .from('orders')
    .select('*, product:products(name)')
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: false });

  const rows = [
    ['Order #', 'Date', 'Customer', 'Phone', 'Product', 'Amount', 'Payment', 'Status', 'Tracking'].join(','),
    ...(orders || []).map(o =>
      [
        o.order_number,
        formatDateTime(o.created_at),
        `"${o.customer_name}"`,
        o.customer_phone,
        `"${o.product?.name || ''}"`,
        formatPrice(o.total_amount),
        o.payment_method,
        o.order_status,
        o.tracking_id || '',
      ].join(',')
    ),
  ];

  return new NextResponse(rows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
