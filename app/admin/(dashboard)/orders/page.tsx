import { createClient } from '@/lib/supabase/server';
import { formatPrice, formatDateTime, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, PAYMENT_STATUS_COLORS } from '@/lib/utils';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import OrdersFilter from '@/components/admin/OrdersFilter';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const page = parseInt(params.page || '1');
  const limit = 20;

  let query = supabase
    .from('orders')
    .select('*, product:products(name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (params.status) query = query.eq('order_status', params.status);
  if (params.search) {
    query = query.or(
      `customer_name.ilike.%${params.search}%,customer_phone.ilike.%${params.search}%,order_number.ilike.%${params.search}%`
    );
  }

  const { data: orders, count } = await query;
  const totalPages = Math.ceil((count || 0) / limit);

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'new', label: 'New' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'dispatched', label: 'Dispatched' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{count || 0} total orders</p>
        </div>
        <Link
          href="/admin/quick-order"
          className="bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-800 transition-all"
        >
          + Quick Order
        </Link>
      </div>

      <OrdersFilter statusOptions={statusOptions} />

      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-outline-variant">
              <tr className="text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 text-left">Order #</th>
                <th className="px-6 py-4 text-left">Customer</th>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Payment</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-semibold text-primary-700 hover:underline text-xs">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-xs text-gray-400">{order.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">{order.product?.name}</td>
                  <td className="px-6 py-4 font-bold">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PAYMENT_STATUS_COLORS[order.payment_status] || 'bg-gray-100 text-gray-700'}`}>
                      {order.payment_method === 'cod' ? 'COD' : 'Online'} · {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ORDER_STATUS_COLORS[order.order_status] || 'bg-gray-100 text-gray-700'}`}>
                      {ORDER_STATUS_LABELS[order.order_status] || order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{formatDateTime(order.created_at)}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs font-bold text-primary-700 hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!orders || orders.length === 0) && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">📦</p>
              <p>No orders found</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-outline-variant flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link href={`?page=${page - 1}`} className="px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 font-medium">← Prev</Link>
              )}
              {page < totalPages && (
                <Link href={`?page=${page + 1}`} className="px-3 py-1.5 text-xs bg-primary-700 text-white rounded-lg hover:bg-primary-800 font-medium">Next →</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
