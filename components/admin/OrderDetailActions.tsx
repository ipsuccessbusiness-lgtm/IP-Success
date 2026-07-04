'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Order } from '@/types';
import { ORDER_STATUS_LABELS } from '@/lib/utils';
import { Settings2, Truck, Bookmark, FileText, CheckCircle2 } from 'lucide-react';

const ORDER_STATUSES = ['new', 'confirmed', 'dispatched', 'delivered', 'cancelled'];

export default function OrderDetailActions({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.order_status);
  const [trackingId, setTrackingId] = useState(order.tracking_id || '');
  const [courierName, setCourierName] = useState(order.courier_name || '');
  const [notes, setNotes] = useState(order.notes || '');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_status: status,
          tracking_id: trackingId || null,
          courier_name: courierName || null,
          notes: notes || null,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch (err) {
      alert('Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-1 overflow-hidden border border-outline-variant shadow-sm">
      <div className="bg-surface-container/30 rounded-[22px] p-6">
        <h2 className="font-bold text-lg text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
            <Settings2 className="w-4 h-4" />
          </div>
          Update Status
        </h2>

        <div className="space-y-5">
          {/* Status */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Order Status
            </label>
            <div className="relative">
              <select
                id="order-status-select"
                value={status}
                onChange={e => setStatus(e.target.value as Order['order_status'])}
                className="w-full px-4 py-3 rounded-xl border border-outline-variant/80 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700 appearance-none shadow-sm"
              >
                {ORDER_STATUSES.map(s => (
                  <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/60" />

          {/* Courier */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Courier Partner
            </label>
            <input
              id="order-courier-name"
              value={courierName}
              onChange={e => setCourierName(e.target.value)}
              placeholder="e.g. DTDC, India Post"
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/80 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700 shadow-sm transition-all"
            />
          </div>

          {/* Tracking */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" /> Tracking ID
            </label>
            <input
              id="order-tracking-id"
              value={trackingId}
              onChange={e => setTrackingId(e.target.value)}
              placeholder="Enter tracking number..."
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/80 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700 shadow-sm transition-all font-mono"
            />
          </div>

          <div className="pt-2 border-t border-outline-variant/60" />

          {/* Notes */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Internal Notes
            </label>
            <textarea
              id="order-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add private notes..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/80 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700 shadow-sm transition-all resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 w-full py-3.5 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl text-sm font-bold hover:from-primary-800 hover:to-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          id="save-order-btn"
        >
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle2 className="w-4 h-4" /> Saved Successfully!</>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}
