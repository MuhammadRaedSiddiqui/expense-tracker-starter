import { formatCurrency, formatDate } from '../../utils';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  currency: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-surface-container-lowest p-12 rounded-lg border border-outline-variant/10 text-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4 inline-block" data-icon="receipt_long">
          receipt_long
        </span>
        <h3 className="text-lg font-bold text-on-surface mb-2">No transactions found</h3>
        <p className="text-sm text-on-surface-variant">
          Create your first transaction to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant/10 overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-container-high border-b border-outline-variant/10">
            <tr>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Date
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Description
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Category
              </th>
              <th className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Type
              </th>
              <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-surface-container transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-xs text-on-surface font-medium">
                  {formatDate(transaction.date)}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface font-medium">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface-variant">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                      transaction.type === 'income'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold tabular-nums">
                  <span className={transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="text-primary hover:text-primary-dim mr-3 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]" data-icon="edit">
                      edit
                    </span>
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="text-error hover:text-error-dim transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]" data-icon="delete">
                      delete
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
