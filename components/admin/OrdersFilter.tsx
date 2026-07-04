'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { Search } from 'lucide-react';

interface StatusOption { value: string; label: string; }

function FilterContent({ statusOptions }: { statusOptions: StatusOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set('status', status); else params.delete('status');
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set('search', search); else params.delete('search');
    params.delete('page');
    router.push(`?${params.toString()}`);
  };

  const currentStatus = searchParams.get('status') || '';

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Status tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {statusOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentStatus === opt.value
                ? 'bg-primary-700 text-white shadow-sm'
                : 'bg-white border border-outline-variant text-gray-600 hover:border-primary-700 hover:text-primary-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 ml-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, order #"
            className="pl-9 pr-4 py-2 text-sm border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-700/30 focus:border-primary-700 w-56"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary-700 text-white rounded-xl text-sm font-semibold hover:bg-primary-800 transition-all">
          Search
        </button>
      </form>
    </div>
  );
}

export default function OrdersFilter({ statusOptions }: { statusOptions: StatusOption[] }) {
  return (
    <Suspense fallback={<div />}>
      <FilterContent statusOptions={statusOptions} />
    </Suspense>
  );
}
