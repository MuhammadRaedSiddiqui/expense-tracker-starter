import { useEffect } from 'react';

const TOAST_TYPES = {
  success: {
    icon: '✓',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  error: {
    icon: '✕',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-800',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
  },
  warning: {
    icon: '⚠',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  info: {
    icon: 'ℹ',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
};

function Toast({ id, type = 'info', message, onClose, duration = 5000 }) {
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg animate-slide-in-right`}
      role="alert"
    >
      <div className={`flex-shrink-0 w-6 h-6 rounded-full ${config.iconBg} flex items-center justify-center`}>
        <span className={`text-sm font-bold ${config.iconColor}`}>{config.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${config.textColor}`}>{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}

export default Toast;
