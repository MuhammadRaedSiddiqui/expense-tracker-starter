import { useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function TopNav() {
  const { pathname } = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLiveStatus, setShowLiveStatus] = useState(false);

  const getBreadcrumb = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ label: 'Dashboard' }];
    return segments.map((seg) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    }));
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <header className="flex justify-between items-center h-16 px-8 sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/15">
      <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
        <span className="material-symbols-outlined text-on-surface-variant text-base" data-icon="home">
          home
        </span>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <span className="text-on-surface-variant/50">/</span>
            <span
              className={
                i === breadcrumbs.length - 1
                  ? 'font-semibold text-on-surface'
                  : 'text-on-surface-variant'
              }
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-outline-variant/30 pr-6">
          <button
            onClick={() => setShowLiveStatus(!showLiveStatus)}
            className="text-outline hover:text-on-surface transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-lg" data-icon="sensors">
              sensors
            </span>
            <span className="font-inter text-sm font-medium">Live Status</span>
          </button>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-outline hover:text-on-surface transition-colors relative"
          >
            <span className="material-symbols-outlined text-lg" data-icon="notifications">
              notifications
            </span>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-error rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Live Status Dropdown */}
      {showLiveStatus && (
        <div className="absolute top-16 right-8 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 p-4 w-64 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-on-surface">System Status</h3>
            <button onClick={() => setShowLiveStatus(false)}>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">close</span>
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">API</span>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">Database</span>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant">Real-time</span>
              <span className="flex items-center gap-1 text-xs text-green-600">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                Connected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-16 right-8 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/20 p-4 w-80 z-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-on-surface">Notifications</h3>
            <button onClick={() => setShowNotifications(false)}>
              <span className="material-symbols-outlined text-sm text-on-surface-variant">close</span>
            </button>
          </div>
          <div className="space-y-3">
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_off</span>
              <p className="text-xs">No new notifications</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
