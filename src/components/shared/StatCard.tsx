interface StatCardProps {
  label: string;
  value: string;
  icon?: string;
  iconColor?: string;
  borderColor?: string;
  trend?: {
    value: string;
    label: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  progress?: {
    value: number;
    label: string;
    color?: string;
  };
}

export default function StatCard({
  label,
  value,
  icon,
  iconColor = 'text-primary',
  borderColor,
  trend,
  progress,
}: StatCardProps) {
  const borderClass = borderColor ? `border-b-2 ${borderColor}` : '';

  return (
    <div className={`bg-surface-container-lowest p-6 rounded-lg shadow-sm ${borderClass}`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">
          {label}
        </span>
        {icon && (
          <span className={`material-symbols-outlined ${iconColor}`} data-icon={icon}>
            {icon}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p
          className={`${borderColor ? 'text-3xl font-extrabold' : 'text-2xl font-bold'} tracking-tight${borderColor ? 'er' : ''} tabular-nums`}
        >
          {value}
        </p>
        {trend && (
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                trend.type === 'positive'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : trend.type === 'negative'
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {trend.value}
            </span>
            <span className="text-[10px] text-on-surface-variant">{trend.label}</span>
          </div>
        )}
        {progress && (
          <>
            <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full rounded-full ${progress.color || 'bg-secondary'}`}
                style={{ width: `${progress.value}%` }}
              />
            </div>
            <p className="text-[10px] text-on-surface-variant mt-1">{progress.label}</p>
          </>
        )}
      </div>
    </div>
  );
}
