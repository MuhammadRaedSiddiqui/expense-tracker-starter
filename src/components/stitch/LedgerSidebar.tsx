import {
  LayoutDashboard,
  Receipt,
  RefreshCw,
  Wallet,
  BarChart3,
  Users,
  Settings,
  Plus
} from 'lucide-react';

interface LedgerSidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
}

export function LedgerSidebar({ activeItem = 'Dashboard', onNavigate }: LedgerSidebarProps) {
  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Transactions', icon: Receipt, label: 'Transactions' },
    { id: 'Recurring', icon: RefreshCw, label: 'Recurring' },
    { id: 'Budgets', icon: Wallet, label: 'Budgets' },
    { id: 'Reports', icon: BarChart3, label: 'Reports' },
    { id: 'Team', icon: Users, label: 'Team' },
    { id: 'Settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl h-screen w-64 border-r-0 font-['Inter'] antialiased z-50">
      <div className="px-6 py-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          The Ledger
        </h1>
        <p className="text-xs font-label uppercase tracking-widest text-slate-500 mt-1">
          Premium Finance
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;

          return (
            <a
              key={item.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNavigate?.(item.id);
              }}
              className={`flex items-center px-4 py-3 transition-colors duration-150 ease-in-out ${
                isActive
                  ? 'text-slate-900 dark:text-white font-semibold border-r-2 border-slate-900 dark:border-slate-50 bg-slate-200/50 dark:bg-slate-800/50 scale-95'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 hover:bg-slate-200/30 dark:hover:bg-slate-800/30'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-semibold flex items-center justify-center hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5 mr-2" />
          New Entry
        </button>

        <div className="mt-6 flex items-center px-2">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpiqDn0CBhMugwcCPqjEFZuEE7_90wcRAPx5ViD80UM89WFuma83-kB8BUUoEN78G88rCItsMmNo_Iao66f2qVER35Y_hxlu99f1iUXGYVrE5FDWtRED5FbmkpD0bcOoLqCeiJGZUe-6XJWUL8n7PjSF1f_BqNsSdHwVyOTwcldcZWhfHwsg6DBLn9GeLuyqCCfvDw7kanAmOifOr6BL2xpJwQsTZa0r0XcHuC60sIZ2vLuYj4rw6sBCUvmdsQcUYN2RSBLoCQYrc"
            alt="User profile"
          />
          <div className="ml-3">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              User profile
            </p>
            <p className="text-xs text-slate-500">Pro Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
