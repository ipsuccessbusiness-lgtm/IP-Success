'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { formatPrice } from '@/lib/utils';
import { BarChart3, Download } from 'lucide-react';

const COLORS = ['#166534', '#6dfe9c', '#404230', '#22c55e'];

export default function ReportsPage() {
  const [data, setData] = useState<{
    revenue: { date: string; revenue: number; orders: number }[];
    byPack: { name: string; value: number }[];
    bySource: { name: string; value: number }[];
    totalRevenue: number;
    totalOrders: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('30');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch(`/api/admin/reports?days=${range}`);
      if (res.ok) setData(await res.json());
      setLoading(false);
    };
    fetchData();
  }, [range]);

  const handleExport = async () => {
    const res = await fetch(`/api/admin/reports/export?days=${range}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-success-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-700" />
            Sales Reports
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Revenue and order analytics</p>
        </div>
        <div className="flex gap-2">
          <select
            value={range}
            onChange={e => setRange(e.target.value)}
            className="px-3 py-2 border border-outline-variant rounded-xl text-sm focus:outline-none"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 1 year</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-700 text-white rounded-xl text-sm font-semibold hover:bg-primary-800 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Summary */}
      {data && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Revenue ({range} days)</div>
            <div className="text-3xl font-bold text-primary-700">{formatPrice(data.totalRevenue)}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
            <div className="text-sm text-gray-500 mb-1">Orders ({range} days)</div>
            <div className="text-3xl font-bold text-primary-700">{data.totalOrders}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="h-48 flex items-center justify-center text-gray-400">Loading reports...</div>
      ) : data ? (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue chart */}
          <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Daily Revenue</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `₹${Math.round(v/100)}`} />
                <Tooltip formatter={(v) => formatPrice(Number(v))} />
                <Bar dataKey="revenue" fill="#166534" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pack breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Sales by Pack</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={data.byPack} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {data.byPack.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Source breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Orders by Source</h2>
            <div className="space-y-3">
              {data.bySource.map((src) => (
                <div key={src.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium capitalize">{src.name}</span>
                    <span className="text-gray-500">{src.value} orders</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-full bg-primary-700 rounded-full"
                      style={{ width: `${(src.value / data.totalOrders) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">No data available</div>
      )}
    </div>
  );
}
