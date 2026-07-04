'use client';

import { useState } from 'react';
import { formatPrice, formatDateTime, PAYMENT_STATUS_COLORS } from '@/lib/utils';
import { CheckCircle2, Search, Filter, Hash, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type OrderPayment = {
  id: string;
  order_number: string;
  customer_name: string;
  payment_method: string;
  payment_status: string;
  total_amount: number;
  razorpay_payment_id: string | null;
  created_at: string;
};

export default function PaymentsTable({ initialOrders }: { initialOrders: OrderPayment[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleMarkAsPaid = async (id: string) => {
    if (!confirm('Mark this COD order as Paid? This indicates you have received the cash.')) return;
    setLoading(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: 'paid' }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, payment_status: 'paid' } : o));
        router.refresh();
      } else {
        alert('Failed to mark as paid');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating payment status');
    }
    setLoading(null);
  };

  const filtered = orders.filter(o => 
    (o.order_number.toLowerCase().includes(search.toLowerCase()) || 
     o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
     (o.razorpay_payment_id && o.razorpay_payment_id.toLowerCase().includes(search.toLowerCase()))
    ) &&
    (filterMethod ? o.payment_method === filterMethod : true) &&
    (filterStatus ? o.payment_status === filterStatus : true)
  );

  return (
    <div className="bg-white rounded-3xl p-1 overflow-hidden border border-outline-variant shadow-sm">
      <div className="bg-surface-container/30 rounded-[22px] p-6">
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order #, Name, or Txn ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary-700/30 text-sm shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterMethod}
              onChange={e => setFilterMethod(e.target.value)}
              className="px-4 py-3 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary-700/30 text-sm shadow-sm"
            >
              <option value="">All Methods</option>
              <option value="razorpay">Razorpay</option>
              <option value="cod">COD</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-3 rounded-xl border border-outline-variant bg-white focus:outline-none focus:ring-2 focus:ring-primary-700/30 text-sm shadow-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-outline-variant/60 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/80 text-gray-500 font-medium border-b border-outline-variant/60">
                <tr>
                  <th className="px-6 py-4">Order Info</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Method & Txn ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="font-bold text-primary-700 hover:underline flex items-center gap-1.5">
                        {order.order_number}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <div className="text-gray-500 text-xs mt-0.5">{order.customer_name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDateTime(order.created_at)}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold uppercase tracking-wider text-xs">
                          {order.payment_method === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
                        </span>
                        {order.razorpay_payment_id && (
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex items-center gap-1 w-max">
                            <Hash className="w-3 h-3" />
                            {order.razorpay_payment_id}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${PAYMENT_STATUS_COLORS[order.payment_status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {order.payment_method === 'cod' && order.payment_status === 'pending' ? (
                        <button
                          onClick={() => handleMarkAsPaid(order.id)}
                          disabled={loading === order.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-sm"
                        >
                          {loading === order.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-green-700/30 border-t-green-700 rounded-full animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Mark as Paid
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs italic">No Action Needed</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No payments found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
