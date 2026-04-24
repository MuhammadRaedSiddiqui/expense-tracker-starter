import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useOrganization } from '@/integration/hooks/useOrganization';

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/transactions', icon: 'receipt_long', label: 'Transactions' },
  { to: '/recurring', icon: 'sync', label: 'Recurring' },
  { to: '/budgets', icon: 'account_balance_wallet', label: 'Budgets' },
  { to: '/reports', icon: 'bar_chart', label: 'Reports' },
  { to: '/team', icon: 'group', label: 'Team' },
  { to: '/settings', icon: 'settings', label: 'Settings' },
  
];

const inactiveClasses =
  'flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors hover:bg-surface-container-high';
const activeClasses =
  'flex items-center gap-3 px-4 py-2 bg-primary text-on-primary rounded-lg transition-all scale-[0.98] duration-150';

interface SideNavProps {
  onAddTransaction?: () => void;
}

export default function SideNav({ onAddTransaction }: SideNavProps) {
  const { pathname } = useLocation();
  const { organization, loading } = useOrganization();

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 flex flex-col p-4 border-r border-outline-variant/20 bg-surface-container-low font-inter antialiased tracking-tight z-50">
      <div className="mb-8 px-4">
        <h1 className="text-lg font-bold tracking-tighter text-on-surface">Finance Architect</h1>
        <p className="text-xs text-on-surface-variant/70">Enterprise Tier</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            className={pathname === item.to ? activeClasses : inactiveClasses}
            to={item.to}
          >
            <span className="material-symbols-outlined" data-icon={item.icon}>
              {item.icon}
            </span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* <div className="mt-auto space-y-4">
        <button
          onClick={onAddTransaction}
          className="w-full bg-secondary text-on-secondary py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm" data-icon="add">
            add
          </span>
          Add Transaction
        </button>
        <div className="pt-4 border-t border-outline-variant/20">
          <div className="flex items-center gap-3 px-4">
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-on-surface">
                {loading ? 'Loading...' : organization?.name || 'No Organization'}
              </p>
              <p className="text-[10px] text-outline truncate">HQ Terminal</p>
            </div>
          </div>
        </div>
      </div> */}
    </aside>
  );
}
