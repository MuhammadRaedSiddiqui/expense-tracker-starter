import { Link } from 'react-router-dom';
import type { Transaction } from '@/types';

interface RecentLedgerProps {
  transactions: Transaction[];
  onAddTransaction?: () => void;
}

export default function RecentLedger({ transactions, onAddTransaction }: RecentLedgerProps) {
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + ', ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      salary: 'bg-primary-container text-on-primary-container',
      freelance: 'bg-primary-container text-on-primary-container',
      food: 'bg-surface-container text-on-surface-variant',
      housing: 'bg-surface-container text-on-surface-variant',
      utilities: 'bg-surface-container text-on-surface-variant',
      transport: 'bg-surface-container text-on-surface-variant',
      entertainment: 'bg-surface-container text-on-surface-variant',
      healthcare: 'bg-surface-container text-on-surface-variant',
      shopping: 'bg-surface-container text-on-surface-variant',
    };
    return colors[category] || 'bg-surface-container text-on-surface-variant';
  };

  return (
    <section className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden border border-outline-variant/20">
      <div className="p-6 flex justify-between items-center border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-bold text-on-surface uppercase tracking-tight">
            Recent Ledger Actions
          </h3>
          {onAddTransaction && (
            <button
              onClick={onAddTransaction}
              className="flex items-center gap-1.5 px-3 py-1 border border-outline-variant/30 rounded text-[10px] font-bold text-secondary uppercase tracking-wider hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-xs" data-icon="add">
                add
              </span>
              Add Transaction
            </button>
          )}
        </div>
        <Link
          to="/transactions"
          className="text-[10px] font-bold text-secondary flex items-center gap-1 hover:underline"
        >
          VIEW FULL HISTORY{' '}
          <span className="material-symbols-outlined text-xs" data-icon="arrow_forward">
            arrow_forward
          </span>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">
              <th className="px-6 py-4">Timestamp</th>
              <th className="px-6 py-4">Entity / Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Amount (USD)</th>
              <th className="px-6 py-4 text-center">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx, i) => (
                <tr
                  key={tx.id}
                  className={`${i % 2 === 1 ? 'bg-surface-container-low/30' : ''} hover:bg-surface-container-low transition-colors`}
                >
                  <td className="px-6 py-4 text-xs text-on-surface-variant font-mono">
                    {formatDateTime(tx.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">{tx.description}</span>
                      <span className="text-[10px] text-on-surface-variant/70">
                        {tx.currency} Transaction
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-full ${getCategoryColor(tx.category)} text-[9px] font-bold uppercase`}
                    >
                      {tx.category}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-right text-xs font-bold font-mono ${
                      tx.type === 'income' ? 'text-secondary' : 'text-error'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(parseFloat(tx.amount.toString()))}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`material-symbols-outlined ${tx.type === 'income' ? 'text-secondary' : 'text-on-surface-variant'} text-sm`}
                        data-icon="check_circle"
                      >
                        check_circle
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
