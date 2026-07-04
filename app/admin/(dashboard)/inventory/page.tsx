'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, TrendingUp, AlertTriangle } from 'lucide-react';

interface InventoryItem {
  id: string;
  product_id: string;
  quantity: number;
  low_stock_threshold: number;
  product?: { name: string };
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [addQty, setAddQty] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      if (Array.isArray(data)) {
        setInventory(data);
      } else {
        console.error('Failed to load inventory:', data);
        setInventory([]);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (item: InventoryItem) => {
    const qty = addQty[item.id] || 0;
    if (qty <= 0) return;

    setSaving(item.id);
    await fetch(`/api/admin/inventory/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: item.quantity + qty }),
    });
    setAddQty(prev => ({ ...prev, [item.id]: 0 }));
    await fetchInventory();
    setSaving(null);
  };

  const handleThreshold = async (item: InventoryItem, threshold: number) => {
    await fetch(`/api/admin/inventory/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ low_stock_threshold: threshold }),
    });
    await fetchInventory();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-48 text-gray-400">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-primary-700" />
          Inventory Management
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Track and manage product stock levels</p>
      </div>

      <div className="grid gap-6">
        {inventory.map((item) => {
          const isLow = item.quantity <= item.low_stock_threshold;
          const stockPercent = Math.min((item.quantity / Math.max(item.low_stock_threshold * 5, 100)) * 100, 100);

          return (
            <div key={item.id} className={`bg-white rounded-2xl p-6 border shadow-sm ${isLow ? 'border-red-200' : 'border-outline-variant'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{item.product?.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {isLow ? (
                      <span className="flex items-center gap-1 text-xs text-red-600 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Alert
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                        <TrendingUp className="w-3.5 h-3.5" /> Stock OK
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${isLow ? 'text-red-600' : 'text-primary-700'}`}>
                    {item.quantity}
                  </div>
                  <div className="text-xs text-gray-500">units in stock</div>
                </div>
              </div>

              {/* Stock bar */}
              <div className="mb-6">
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLow ? 'bg-red-400' : stockPercent < 50 ? 'bg-orange-400' : 'bg-primary-700'
                    }`}
                    style={{ width: `${stockPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>Low stock threshold: {item.low_stock_threshold}</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Add stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Stock Units</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      id={`add-stock-${item.id}`}
                      value={addQty[item.id] || ''}
                      onChange={e => setAddQty(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 0 }))}
                      placeholder="Enter quantity"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30"
                    />
                    <button
                      onClick={() => handleAddStock(item)}
                      disabled={!addQty[item.id] || saving === item.id}
                      className="px-4 py-2.5 bg-primary-700 text-white rounded-xl text-sm font-bold hover:bg-primary-800 disabled:opacity-60 transition-all flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      {saving === item.id ? '...' : 'Add'}
                    </button>
                  </div>
                </div>

                {/* Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      id={`threshold-${item.id}`}
                      defaultValue={item.low_stock_threshold}
                      className="flex-1 px-3 py-2.5 rounded-xl border border-outline-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary-700/30"
                      onBlur={e => handleThreshold(item, parseInt(e.target.value) || 10)}
                    />
                    <span className="flex items-center px-3 text-sm text-gray-500">units</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
