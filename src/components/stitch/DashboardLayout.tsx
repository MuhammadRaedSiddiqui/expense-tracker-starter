import type { DashboardLayoutProps } from '../../types/stitch-components';

export function DashboardLayout({
  children,
  sidebar,
  header,
  className = ''
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      {sidebar && <div className="fixed left-0 top-0 z-30">{sidebar}</div>}

      {/* Main Content Area */}
      <div
        className={`
          ${sidebar ? 'ml-64' : ''}
          min-h-screen
          flex flex-col
        `}
      >
        {/* Header */}
        {header && <div className="sticky top-0 z-20">{header}</div>}

        {/* Page Content */}
        <main
          className={`
            flex-1
            p-6
            lg:p-8
            ${className}
          `}
          role="main"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
