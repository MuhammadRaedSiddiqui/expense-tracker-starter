import { Search, Bell, User } from 'lucide-react';

interface LedgerHeaderProps {
  title?: string;
  onAddTransaction?: () => void;
}

export function LedgerHeader({ title = 'Dashboard', onAddTransaction }: LedgerHeaderProps) {
  return (
    <header className="flex justify-between items-center w-full px-8 py-4 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 sticky top-0 z-40">
      <div className="flex items-center space-x-4">
        <h2 className="text-1.5xl font-semibold tracking-tight">{title}</h2>
        <div className="h-4 w-[1px] bg-outline-variant mx-4"></div>
        <div className="flex items-center bg-surface-container-low px-4 py-2 rounded-lg w-96">
          <Search className="text-slate-400 w-4 h-4" />
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 outline-none"
            placeholder="Search transactions..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={onAddTransaction}
          className="bg-primary text-on-primary px-6 py-2 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          Add Transaction
        </button>
        <div className="flex items-center space-x-3 text-slate-500">
          <Bell className="w-5 h-5 cursor-pointer hover:text-slate-900" />
          <User className="w-5 h-5 cursor-pointer hover:text-slate-900" />
        </div>
      </div>
    </header>
  );
}
