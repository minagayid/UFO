import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '../utils/cn';

interface KPICardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

const KPICard = React.memo(function KPICard({ title, value, change, icon, trend = 'neutral' }: KPICardProps) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;

  return (
    <div className="bg-white dark:bg-gray-800/60 dark:backdrop-blur-md rounded-2xl shadow-lg hover:shadow-xl p-6 border border-gray-100 dark:border-gray-700/50 transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{value}</p>
          {change && (
            <div className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full mt-1",
              trend === 'up' 
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' 
                : trend === 'down' 
                  ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10' 
                  : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10'
            )}>
              <TrendIcon className="w-3 h-3" />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="p-3.5 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-500/10 dark:border-indigo-500/20 group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-3">
          {icon}
        </div>
      </div>
    </div>
  );
});

export default KPICard;
