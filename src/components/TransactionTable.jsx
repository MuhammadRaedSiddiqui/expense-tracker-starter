import { useState } from 'react';
import EditTransactionForm from './EditTransactionForm';
import { formatCurrency, formatDate } from '../utils';
import { BASE_CURRENCY } from '../constants';

function TransactionTable({ transactions, onDeleteTransaction, onEditTransaction, categories }) {
  const [editingId, setEditingId] = useState(null);

  const handleSave = updatedTransaction => {
    onEditTransaction(updatedTransaction);
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500" role="status" aria-live="polite">
        <p>No transactions yet. Add your first transaction!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full" role="table" aria-label="Transactions list">
        <thead>
          <tr className="border-b border-gray-200">
            <th
              scope="col"
              className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Description
            </th>
            <th
              scope="col"
              className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              scope="col"
              className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Amount
            </th>
            <th
              scope="col"
              className="text-right py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map(t =>
            editingId === t.id ? (
              <EditTransactionForm
                key={t.id}
                transaction={t}
                onSave={handleSave}
                onCancel={handleCancel}
                categories={categories}
              />
            ) : (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 text-sm text-slate-600">{formatDate(t.date)}</td>
                <td className="py-3 px-4 text-sm font-medium text-slate-900">{t.description}</td>
                <td className="py-3 px-4 text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                    {t.category}
                  </span>
                </td>
                <td
                  className={`py-3 px-4 text-sm font-semibold text-right tabular-nums ${t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(Math.abs(t.amount), t.currency || BASE_CURRENCY)}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditingId(t.id)}
                      className="p-1.5 text-gray-400 hover:text-slate-600 hover:bg-gray-100 rounded transition-colors"
                      aria-label={`Edit ${t.description} transaction`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteTransaction(t.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      aria-label={`Delete ${t.description} transaction`}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
