import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/admin/StatsCard';
import { IndianRupee, ShoppingCart, Clock, Package, AlertTriangle } from 'lucide-react';
import { formatPrice, formatDateTime, ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/lib/utils';
import Link from 'next/link';
import AdminRevenueChart from '@/components/admin/AdminRevenueChart';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parallel data fetching
  const [
    { data: todayOrders },
    { data: allOrders, count: totalCount },
    { data: pendingOrders, count: pendingCount },
    { data: inventory },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('orders').select('total_amount').gte('created_at', today.toISOString()),
    supabase.from('orders').select('total_amount', { count: 'exact' }),
    supabase.from('orders').select('id', { count: 'exact' }).eq('order_status', 'new'),
    supabase.from('inventory').select('*, product:products(name)'),
    supabase
      .from('orders')
      .select('*, product:products(name)')
      .order('created_at', { ascending: false })
      .limit(8),
  ]);

  const todayRevenue = todayOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;
  const totalRevenue = allOrders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;
  const todayOrderCount = todayOrders?.length || 0;

  // Low stock items
  const lowStockItems = inventory?.filter(i => i.quantity <= i.low_stock_threshold) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's your store overview.</p>
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-800 text-sm">Low Stock Alert</p>
            <p className="text-sm text-orange-700 mt-0.5">
              {lowStockItems.map(i => `${i.product?.name}: ${i.quantity} units left`).join(' · ')}
            </p>
            <Link href="/admin/inventory" className="text-xs font-bold text-orange-700 underline mt-1 inline-block">
              Manage Inventory →
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Revenue"
          value={formatPrice(todayRevenue)}
          subtitle={`${todayOrderCount} orders today`}
          icon={IndianRupee}
          color="green"
        />
        <StatsCard
          title="Total Orders"
          value={totalCount || 0}
          subtitle="All time"
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Pending Orders"
          value={pendingCount || 0}
          subtitle="Needs action"
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          subtitle="All time"
          icon={IndianRupee}
          color="purple"
        />
      </div>

      {/* Chart + Recent Orders */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Revenue (Last 7 Days)</h2>
          <AdminRevenueChart />
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-700" />
            Inventory
          </h2>
          <div className="space-y-4">
            {inventory?.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700 truncate max-w-[60%]">{item.product?.name}</span>
                  <span className={item.quantity <= item.low_stock_threshold ? 'text-red-600 font-bold' : 'text-gray-500'}>
                    {item.quantity} units
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.quantity <= item.low_stock_threshold ? 'bg-red-400' :
                      item.quantity <= item.low_stock_threshold * 2 ? 'bg-orange-400' : 'bg-primary-700'
                    }`}
                    style={{ width: `${Math.min((item.quantity / 100) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/inventory"
            className="block text-center mt-4 text-xs font-bold text-primary-700 hover:underline"
          >
            Manage Stock →
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-outline-variant">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-primary-700 hover:underline">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3 text-left">Order</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders?.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary-700 hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div>{order.customer_name}</div>
                    <div className="text-xs text-gray-400">{order.customer_phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{order.product?.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{formatPrice(order.total_amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${ORDER_STATUS_COLORS[order.order_status] || 'bg-gray-100 text-gray-700'}`}>
                      {ORDER_STATUS_LABELS[order.order_status] || order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{formatDateTime(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!recentOrders || recentOrders.length === 0) && (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No orders yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
