import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MetricCardProps } from '../../types/stitch-components';

export function MetricCard({
  label,
  value,
  trend,
  icon,
  className = ''
}: MetricCardProps) {
  return (
    <div
      className={`
        bg-white
        rounded-lg
        p-6
        border border-slate-200
        transition-all
        duration-250
        hover:shadow-lg
        ${className}
      `}
      role="article"
      aria-label={`${label} metric`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-label-md uppercase text-slate-500 tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="text-slate-400" aria-hidden="true">
            {icon}
          </div>
        )}
      </div>

      <div className="mb-2">
        <span
          className="text-display-md font-semibold text-slate-900 tabular-nums"
          aria-label={`Value: ${value}`}
        >
          {value}
        </span>
      </div>

      {trend && (
        <div
          className="flex items-center gap-1.5"
          aria-label={`Trend: ${trend.direction === 'up' ? 'increasing' : 'decreasing'} by ${Math.abs(trend.value)}%`}
        >
          {trend.direction === 'up' ? (
            <TrendingUp
              className={`w-4 h-4 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}
              aria-hidden="true"
            />
          ) : (
            <TrendingDown
              className={`w-4 h-4 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}
              aria-hidden="true"
            />
          )}
          <span
            className={`text-body-sm font-medium ${
              trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {Math.abs(trend.value)}%
          </span>
          <span className="text-body-sm text-slate-500">
            vs last period
          </span>
        </div>
      )}
    </div>
  );
}
