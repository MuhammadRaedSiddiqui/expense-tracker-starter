import { Search, Bell } from 'lucide-react';
import type { HeaderProps } from '../../types/stitch-components';

export function Header({
  searchPlaceholder = 'Search...',
  onSearch,
  notificationCount = 0,
  onNotificationClick,
  userInfo,
  onUserClick,
  className = ''
}: HeaderProps) {
  return (
    <header
      className={`
        h-16
        bg-white
        border-b border-slate-200
        flex items-center justify-between
        px-6
        ${className}
      `}
      role="banner"
    >
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder={searchPlaceholder}
            onChange={(e) => onSearch?.(e.target.value)}
            className={`
              w-full
              pl-10 pr-4 py-2
              bg-slate-50
              border border-slate-200
              rounded-lg
              text-body-md
              text-slate-900
              placeholder:text-slate-400
              transition-colors
              focus:outline-none
              focus:border-slate-400
              focus:bg-white
            `}
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-6">
        {/* Notifications */}
        <button
          onClick={onNotificationClick}
          className={`
            relative
            p-2
            rounded-lg
            text-slate-600
            hover:bg-slate-100
            transition-colors
            focus:outline-none
            focus:ring-2
            focus:ring-slate-300
          `}
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ''}`}
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          {notificationCount > 0 && (
            <span
              className={`
                absolute -top-1 -right-1
                w-5 h-5
                bg-rose-600
                text-white
                text-label-sm
                font-medium
                rounded-full
                flex items-center justify-center
                tabular-nums
              `}
              aria-hidden="true"
            >
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        {userInfo && (
          <button
            onClick={onUserClick}
            className={`
              flex items-center gap-3
              px-3 py-2
              rounded-md
              hover:bg-surface-container-high
              transition-colors
              focus:outline-none
              focus:ring-2
              focus:ring-primary
            `}
            aria-label="User menu"
          >
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="text-body-md font-semibold text-on-primary-container">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="hidden md:block text-left">
              <p className="text-body-md font-medium text-on-surface">
                {userInfo.name}
              </p>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
