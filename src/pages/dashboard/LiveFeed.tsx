import type { Transaction } from '@/types';

interface LiveFeedProps {
  transactions: Transaction[];
}

export default function LiveFeed({ transactions }: LiveFeedProps) {
  // Show most recent 5 transactions
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      salary: 'bg-secondary-container text-on-secondary-container',
      freelance: 'bg-secondary-container text-on-secondary-container',
      food: 'bg-primary-container text-on-primary-container',
      housing: 'bg-error-container/20 text-error',
      utilities: 'bg-primary-container text-on-primary-container',
      transport: 'bg-tertiary-container text-on-tertiary-container',
      entertainment: 'bg-primary-container text-on-primary-container',
      healthcare: 'bg-error-container/20 text-error',
      shopping: 'bg-primary-container text-on-primary-container',
    };
    return colors[category] || 'bg-surface-container text-on-surface-variant';
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden border border-outline-variant/20">
      <div className="p-4 border-b border-outline-variant/10 flex justify-between items-center">
        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface">Live Feed</h3>
        <span className="text-[9px] font-bold text-on-surface-variant/60 tracking-tighter">
          REAL-TIME UPDATES
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 text-on-surface-variant border-b border-outline-variant/10">
              <th className="px-6 py-4 font-bold uppercase text-[9px] tracking-wider">Description</th>
              <th className="px-6 py-4 font-bold uppercase text-[9px] tracking-wider">Category</th>
              <th className="px-6 py-4 font-bold uppercase text-[9px] tracking-wider">Date</th>
              <th className="px-6 py-4 font-bold uppercase text-[9px] tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 font-semibold text-on-surface">{transaction.description}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${getCategoryColor(transaction.category)}`}
                    >
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-mono">
                    {formatDate(transaction.date)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-bold font-mono ${
                      transaction.type === 'income' ? 'text-secondary' : 'text-on-surface'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(parseFloat(transaction.amount.toString()))}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">
                  No transactions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
