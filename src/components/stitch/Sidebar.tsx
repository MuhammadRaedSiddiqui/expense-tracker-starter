import { NavigationItem } from './NavigationItem';
import type { SidebarProps } from '../../types/stitch-components';

export function Sidebar({
  navigationItems,
  userInfo,
  className = ''
}: SidebarProps) {
  return (
    <aside
      className={`
        w-64
        h-screen
        bg-slate-800
        border-r border-slate-700
        flex flex-col
        fixed left-0 top-0
        ${className}
      `}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo/Brand */}
      <div className="px-6 py-6 border-b border-slate-700">
        <h1 className="text-title-lg font-bold text-white">
          Finance Architect
        </h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item, index) => (
          <NavigationItem key={index} {...item} />
        ))}
      </nav>

      {/* User Info */}
      {userInfo && (
        <div className="px-4 py-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-2">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                <span className="text-title-sm font-semibold text-white">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-body-md font-medium text-white truncate">
                {userInfo.name}
              </p>
              <p className="text-body-sm text-slate-400 truncate">
                {userInfo.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
