import { Info, AlertTriangle, XCircle, CheckCircle, X } from 'lucide-react';
import type { AlertBannerProps } from '../../types/stitch-components';

const alertConfig = {
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    iconColor: 'text-blue-600',
    textColor: 'text-slate-900'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    iconColor: 'text-amber-600',
    textColor: 'text-slate-900'
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-500',
    iconColor: 'text-rose-600',
    textColor: 'text-slate-900'
  },
  success: {
    icon: CheckCircle,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-500',
    iconColor: 'text-emerald-600',
    textColor: 'text-slate-900'
  }
};

export function AlertBanner({
  type,
  title,
  message,
  onClose,
  className = ''
}: AlertBannerProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-4
        p-4
        rounded-md
        border-l-4
        ${config.bgColor}
        ${config.borderColor}
        ${className}
      `}
      role="alert"
      aria-live="polite"
    >
      <Icon
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`}
        aria-hidden="true"
      />

      <div className="flex-1 min-w-0">
        <h3 className={`text-title-sm font-semibold mb-1 ${config.textColor}`}>
          {title}
        </h3>
        <p className={`text-body-md text-slate-600`}>
          {message}
        </p>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className={`
            flex-shrink-0
            p-1
            rounded
            transition-colors
            hover:bg-surface-container
            focus:outline-none
            focus:ring-2
            focus:ring-primary
            ${config.iconColor}
          `}
          aria-label="Close alert"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
