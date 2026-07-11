import { CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import type { StatusBadgeProps } from '../../types/stitch-components';

const statusConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    label: 'Success'
  },
  pending: {
    icon: Clock,
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    label: 'Pending'
  },
  failed: {
    icon: XCircle,
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-700',
    label: 'Failed'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    label: 'Warning'
  }
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-label-sm',
  md: 'px-3 py-1 text-label-md',
  lg: 'px-4 py-1.5 text-label-lg'
};

export function StatusBadge({
  status,
  label,
  size = 'md',
  className = ''
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full
        font-medium
        ${config.bgColor}
        ${config.textColor}
        ${sizeConfig[size]}
        ${className}
      `}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
}
