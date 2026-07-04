
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: number;
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
}

const colorMap = {
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-700', value: 'text-green-700', border: 'border-green-100' },
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-700', value: 'text-blue-700', border: 'border-blue-100' },
  orange: { bg: 'bg-orange-50', icon: 'bg-orange-100 text-orange-700', value: 'text-orange-700', border: 'border-orange-100' },
  red: { bg: 'bg-red-50', icon: 'bg-red-100 text-red-700', value: 'text-red-700', border: 'border-red-100' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-700', value: 'text-purple-700', border: 'border-purple-100' },
};

export default function StatsCard({ title, value, subtitle, icon: Icon, trend, color = 'green' }: StatsCardProps) {
  const c = colorMap[color];

  return (
    <div className={cn('bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow', c.border)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', c.icon)}>
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div className={cn('text-xs font-semibold px-2 py-1 rounded-full', trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className={cn('text-2xl font-bold mb-1', c.value)}>{value}</div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
    </div>
  );
}
