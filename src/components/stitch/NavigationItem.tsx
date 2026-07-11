import type { NavigationItemProps } from '../../types/stitch-components';

export function NavigationItem({
  icon,
  label,
  href,
  isActive = false,
  badge,
  onClick,
  className = ''
}: NavigationItemProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`
        flex items-center gap-3
        px-4 py-3
        rounded-md
        transition-all
        duration-250
        group
        ${
          isActive
            ? 'bg-slate-700 text-white font-medium'
            : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
        }
        focus:outline-none
        focus:ring-2
        focus:ring-slate-500
        ${className}
      `}
      aria-current={isActive ? 'page' : undefined}
    >
      <span
        className={`
          flex-shrink-0
          ${isActive ? 'text-white' : 'text-slate-400'}
        `}
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="flex-1 text-body-md">{label}</span>

      {badge !== undefined && (
        <span
          className={`
            flex-shrink-0
            px-2 py-0.5
            rounded-full
            text-label-sm
            font-medium
            tabular-nums
            ${
              isActive
                ? 'bg-slate-600 text-white'
                : 'bg-slate-700 text-slate-300'
            }
          `}
          aria-label={`${badge} notifications`}
        >
          {badge}
        </span>
      )}
    </a>
  );
}
